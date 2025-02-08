import { generateCycle } from '../utils/workoutCalculations'
import { calculatePlates, formatPlateText, EMPTY_SLOT } from '../utils/plateCalculations'
import { useState, useEffect } from 'react'
import { LiftStatus, WorkoutStatus } from '../types/workout'
import { supabase } from '../lib/supabase'
import { LiftCompletion } from '../types/liftCompletions'
import { useAuth } from '../contexts/AuthContext'
import { Toast } from './Toast'

type WorkoutPlanProps = {
  maxLifts: {
    squat: string
    bench: string
    overhead: string
    deadlift: string
  }
  selectedWeek: number
}

type LiftName = 'squat' | 'bench' | 'overhead' | 'deadlift'

export default function WorkoutPlan({ maxLifts, selectedWeek }: WorkoutPlanProps) {
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [expandedSet, setExpandedSet] = useState<string | null>(null)
  const [workoutStatus, setWorkoutStatus] = useState<WorkoutStatus>({})
  const { user } = useAuth()
  const cycle = generateCycle(maxLifts)

  // Load initial lift completions
  useEffect(() => {
    const loadLiftCompletions = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from('lift_completions')
        .select('*')
        .eq('user_id', user.id)
        .eq('cycle_week', selectedWeek)

      if (error) {
        console.error('Error loading lift completions:', error)
        return
      }

      if (!data) return

      // Convert to WorkoutStatus format
      const newStatus = { ...workoutStatus }
      if (!newStatus[selectedWeek]) {
        newStatus[selectedWeek] = {}
      }

      data.forEach((completion: LiftCompletion) => {
        newStatus[selectedWeek][completion.lift_type] = completion.status as 'nailed' | 'failed'
      })

      setWorkoutStatus(newStatus)
    }

    loadLiftCompletions()
  }, [user, selectedWeek])

  const saveLiftCompletion = async (lift: LiftName, status: 'nailed' | 'failed') => {
    if (!user) return

    const workout = cycle[`week${selectedWeek}`][lift]
    const completion: Partial<LiftCompletion> = {
      user_id: user.id,
      cycle_week: selectedWeek,
      lift_type: lift,
      status,
      set1_weight: workout.weights[0],
      set2_weight: workout.weights[1],
      set3_weight: workout.weights[2],
      amrap_reps: selectedWeek === 3 ? undefined : undefined // Only track AMRAP reps in week 3
    }

    const { error } = await supabase
      .from('lift_completions')
      .upsert(completion, { onConflict: 'user_id,cycle_week,lift_type' })

    if (error) {
      console.error('Error saving lift completion:', error)
      return
    }

    // Update local state
    const newStatus = { ...workoutStatus }
    if (!newStatus[selectedWeek]) {
      newStatus[selectedWeek] = {}
    }
    newStatus[selectedWeek][lift] = status
    setWorkoutStatus(newStatus)
    localStorage.setItem('workoutStatus', JSON.stringify(newStatus))
  }

  const toggleLiftStatus = (lift: LiftName, status: 'nailed' | 'failed') => {
    saveLiftCompletion(lift, status)
  }
  const lifts: LiftName[] = ['squat', 'bench', 'overhead', 'deadlift']
  const liftNames: Record<LiftName, string> = {
    squat: 'SQAT',
    bench: 'BNCH',
    overhead: 'OHPR',
    deadlift: 'DLFT'
  }

  const getWeekTitle = (week: number) => {
    if (week === 4) return "Deload Week"
    return `Week ${week} - ${week === 3 ? '1+ Week' : `${5 - week}s Week`}`
  }

  const toggleSetExpansion = (setKey: string) => {
    setExpandedSet(expandedSet === setKey ? null : setKey)
  }



  const generateShareText = () => {
    const weekName = selectedWeek === 3 ? '1+ Week' : `${5 - selectedWeek}s Week`
    const results = lifts.map(lift => {
      const status = workoutStatus[selectedWeek]?.[lift]
      return status === 'nailed' ? '💪' : status === 'failed' ? '😤' : '❌'
    }).join('')

    // First pass: generate all plate texts and find max length
    const liftInfo = lifts.map(lift => {
      const workout = cycle[`week${selectedWeek}`][lift]
      const maxWeight = Math.max(...workout.weights)
      const plates = calculatePlates(maxWeight)
      // Count actual plates (not emojis which are 2 chars each)
      const plateCount = plates.standardPlates.length + plates.smallPlates.length + plates.microPlates.length
      const plateText = formatPlateText(plates)
      return { lift, maxWeight, plateText, plateCount }
    })

    // Find the maximum number of plates
    const maxPlates = Math.max(5, ...liftInfo.map(info => info.plateCount))

    // Second pass: format each lift with consistent width
    const liftDetails = liftInfo.map(({ lift, maxWeight, plateText }) => {
      // Each emoji is 2 chars, so we need to account for that in padding calculation
      const currentPlateCount = plateText.length / 2
      const paddingNeeded = maxPlates - currentPlateCount
      const paddedPlateText = plateText + EMPTY_SLOT.repeat(paddingNeeded)
      return `${paddedPlateText} ${liftNames[lift]}: ${maxWeight} lbs`
    }).join('\n')
    
    const legend = [
      'Plates: 🟦=45 🟨=35 🟩=25 | 🟡=10 🔵=5 ⚪️=2.5 🟣=1.25 ⭕️=0.5'
    ].join('\n')

    return `Lift! Week ${selectedWeek} (${weekName}) Results:\n${results}\n\n${liftDetails}\n\n${legend}\n\nCome at me! 🏋️\n#LiftLife #NoExcuses\n\nhttps://lift.neosavvy.com`
  }

  const [showShareModal, setShowShareModal] = useState(false)
  const [shareText, setShareText] = useState('')

  const copyToClipboard = async () => {
    try {
      // Save all current lift statuses before sharing
      if (user) {
        const promises = lifts.map(lift => {
          const status = workoutStatus[selectedWeek]?.[lift]
          if (status) {
            return saveLiftCompletion(lift, status)
          }
          return Promise.resolve()
        })
        await Promise.all(promises)
      }

      const text = generateShareText()
      
      // Try using the Clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        try {
          // Check clipboard permission
          const permissionResult = await navigator.permissions.query({
            name: 'clipboard-write' as PermissionName
          })

          if (permissionResult.state === 'granted' || permissionResult.state === 'prompt') {
            await navigator.clipboard.writeText(text)
            setToastMessage('Copied to clipboard! Now go flex on your friends! 💪')
            setToastType('success')
            setShowToast(true)
            return
          } else {
            throw new Error('Clipboard permission denied')
          }
        } catch (clipboardError) {
          console.error('Clipboard API error:', clipboardError)
          const errorMessage = clipboardError instanceof Error && clipboardError.message === 'Clipboard permission denied'
            ? 'Please allow clipboard access or use manual copy'
            : 'Clipboard access not available'
          setToastMessage(errorMessage)
          setToastType('error')
          setShowToast(true)
          // Fall through to manual copy
        }
      }

      // Show manual copy interface for mobile or when Clipboard API fails
      setShareText(text)
      setShowShareModal(true)
      setToastMessage('Select and copy the text below to share')
      setToastType('success')
      setShowToast(true)
    } catch (error) {
      console.error('Share error:', error)
      setToastMessage('Failed to generate share text')
      setToastType('error')
      setShowToast(true)
    }
  }

  return (
    <>
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
      
      {/* Share Modal for Mobile */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-black border border-[#00ff00] rounded-lg p-4 w-[90%] h-[80vh] flex flex-col">
            <h3 className="text-[#00ff00] text-xl mb-4 font-cyber">Copy this text to share:</h3>
            <textarea
              className="flex-1 w-full bg-black text-[#00ff00] border border-[#00ff00] rounded p-4 mb-4 font-mono text-lg"
              value={shareText}
              readOnly
              ref={(textarea) => {
                if (textarea) {
                  textarea.select()
                  // Try to show the native copy UI
                  if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(textarea.value)
                  }
                }
              }}
              onClick={(e) => {
                const textarea = e.target as HTMLTextAreaElement
                textarea.select()
                // Try to show the native copy UI
                if (navigator.clipboard && window.isSecureContext) {
                  navigator.clipboard.writeText(textarea.value)
                }
              }}
            />
            <div className="flex justify-end space-x-4">
              <button
                className="px-6 py-3 bg-[#00ff00] text-black rounded-lg hover:bg-[#008000] font-cyber text-lg"
                onClick={() => setShowShareModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="retro-container">
      <h3 className="text-2xl font-retro text-matrix-green mb-6">
        {getWeekTitle(selectedWeek)}
      </h3>
      <div className="space-y-6">
        {lifts.map(lift => {
          const workout = cycle[`week${selectedWeek}`][lift]
          return (
            <div key={lift} className="border border-matrix-green/30 rounded-lg p-4">
              <h4 className="text-xl font-cyber text-matrix-green mb-3">
                {liftNames[lift]}
              </h4>
              <div className="space-y-2">
                {workout.weights.map((weight: number, idx: number) => {
                  const setKey = `${lift}-${idx}`
                  const plateBreakdown = calculatePlates(weight)
                  const isExpanded = expandedSet === setKey
                  
                  return (
                    <div key={idx} className="border border-matrix-green/10 rounded-lg p-3 hover:border-matrix-green/30 transition-colors">
                      <button 
                        onClick={() => toggleSetExpansion(setKey)}
                        className="w-full text-left"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-cyber text-matrix-green/80">
                            Set {idx + 1}:
                          </span>
                          <span className="font-cyber text-matrix-green">
                            {weight} lbs × {idx === 2 && selectedWeek !== 4 
                              ? workout.reps.final 
                              : workout.reps.main}
                          </span>
                        </div>
                        
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-matrix-green/20">
                            <div className="text-sm font-cyber text-matrix-green/70">
                              Plate Math:
                            </div>
                            <div className="font-cyber text-matrix-green mt-1">
                              {formatPlateText(plateBreakdown)}
                            </div>
                            <div className="text-xs font-cyber text-matrix-green/50 mt-2 space-y-1">
                              <div>Bar weight: 45 lbs</div>
                              <div>Load plates from heaviest to lightest</div>
                              {plateBreakdown.microPlates.length > 0 && (
                                <div className="text-matrix-green/40">
                                  * Use micro plates last, closest to collar
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
              
              {/* Status Buttons */}
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={() => toggleLiftStatus(lift, 'nailed')}
                  className={`px-4 py-2 rounded-lg font-cyber text-sm transition-colors ${workoutStatus[selectedWeek]?.[lift] === 'nailed' 
                    ? 'bg-matrix-green text-black' 
                    : 'border border-matrix-green text-matrix-green hover:bg-matrix-green/20'}`}
                >
                  Nailed it! 💪
                </button>
                <button
                  onClick={() => toggleLiftStatus(lift, 'failed')}
                  className={`px-4 py-2 rounded-lg font-cyber text-sm transition-colors ${workoutStatus[selectedWeek]?.[lift] === 'failed' 
                    ? 'bg-red-600 text-black' 
                    : 'border border-red-600 text-red-600 hover:bg-red-600/20'}`}
                >
                  Failed it! 😤
                </button>
              </div>
              
              {selectedWeek !== 4 && (
                <div className="mt-4 text-sm text-matrix-green/70 font-cyber">
                  AMRAP = As Many Reps As Possible
                </div>
              )}
            </div>
          )
        })}

        {/* Share Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={copyToClipboard}
            className="px-6 py-3 rounded-lg font-cyber text-lg bg-matrix-dark border-2 border-matrix-green text-matrix-green hover:bg-matrix-green hover:text-black transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Flex on 'em! 💪
          </button>
        </div>
      </div>
    </div>
    </>
  )
} 