import { generateCycle } from '../utils/workoutCalculations'
import { calculatePlates, formatPlateEmojis, getPlateBreakdownText, EMPTY_SLOT } from '../utils/plateCalculations'
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
  onStatusChange?: () => void
}

type LiftName = 'squat' | 'bench' | 'overhead' | 'deadlift'

export default function WorkoutPlan({ maxLifts, selectedWeek, onStatusChange }: WorkoutPlanProps) {
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [expandedSet, setExpandedSet] = useState<string | null>(null)
  const [workoutStatus, setWorkoutStatus] = useState<WorkoutStatus>({})
  const [currentCycle, setCurrentCycle] = useState(1)
  const { user } = useAuth()
  const cycle = generateCycle(maxLifts)

  // Load initial lift completions
  useEffect(() => {
    // Reset workout status when cycle changes
    setWorkoutStatus({})
    const loadLiftCompletions = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from('lift_completions')
        .select('*')
        .eq('user_id', user.id)
        .eq('cycle_number', getCurrentCycle())
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
  }, [user, selectedWeek, currentCycle])

  const deleteLiftCompletion = async (lift: LiftName) => {
    if (!user) return

    const { error } = await supabase
      .from('lift_completions')
      .delete()
      .match({
        user_id: user.id,
        cycle_week: selectedWeek,
        cycle_number: getCurrentCycle(),
        lift_type: lift
      })

    if (error) {
      console.error('Error deleting lift completion:', error)
      return false
    }

    // Update local state
    const newStatus = { ...workoutStatus }
    if (newStatus[selectedWeek]) {
      delete newStatus[selectedWeek][lift]
    }
    setWorkoutStatus(newStatus)
    localStorage.setItem('workoutStatus', JSON.stringify(newStatus))
    return true
  }

  // Get current cycle number from database
  useEffect(() => {
    const fetchCurrentCycle = async () => {
      if (!user) return

      console.log('Fetching current cycle from fitness_metrics...')
      const { data, error } = await supabase
        .from('fitness_metrics')
        .select('cycle_number, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) {
        console.error('Error getting current cycle:', error)
        return
      }

      console.log('Latest fitness metrics entries:', data)

      if (data && data.length > 0) {
        console.log('Setting current cycle to:', data[0].cycle_number)
        console.log('From entry created at:', new Date(data[0].created_at).toLocaleString())
        setCurrentCycle(data[0].cycle_number)
      } else {
        console.log('No fitness metrics entries found')
      }
    }

    fetchCurrentCycle()
  }, [user])

  const getCurrentCycle = () => currentCycle

  const saveLiftCompletion = async (lift: LiftName, status: 'nailed' | 'failed') => {
    if (!user) return false

    const workout = cycle[`week${selectedWeek}`][lift]
    const completion: Partial<LiftCompletion> = {
      user_id: user.id,
      cycle_week: selectedWeek,
      cycle_number: getCurrentCycle(),
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
      return false
    }

    // Update local state
    const newStatus = { ...workoutStatus }
    if (!newStatus[selectedWeek]) {
      newStatus[selectedWeek] = {}
    }
    newStatus[selectedWeek][lift] = status
    setWorkoutStatus(newStatus)
    localStorage.setItem('workoutStatus', JSON.stringify(newStatus))
    return true
  }

  const formatPlatesWithPlaceholders = (plates: ReturnType<typeof calculatePlates>, minPlaceholders: number = 5) => {
    const plateEmojis = formatPlateEmojis(plates)
    const plateCount = plateEmojis.length / 2 // Each emoji is 2 chars
    const placeholdersNeeded = Math.max(0, minPlaceholders - plateCount)
    return plateEmojis + EMPTY_SLOT.repeat(placeholdersNeeded)
  }

  const generateShareText = (currentLift: string, status: 'nailed' | 'failed', weight: number) => {
    const weekName = cycle[`week${selectedWeek}`][lifts[0]].name
    const emoji = status === 'nailed' ? '💪' : '😤'
    
    // Generate status emojis for the week
    const statusEmojis = lifts.map(lift => {
      if (lift === currentLift) return emoji
      const liftStatus = workoutStatus[selectedWeek]?.[lift]
      return liftStatus === 'nailed' ? '💪' : 
             liftStatus === 'failed' ? '😤' : '⬜'
    }).join('')

    // Find maximum number of plates across all lifts
    const maxPlates = Math.max(6, ...lifts.map(lift => {
      const liftWeight = Math.max(...cycle[`week${selectedWeek}`][lift].weights)
      const plates = calculatePlates(liftWeight)
      const plateText = formatPlateEmojis(plates)
      return plateText.length / 2 // Each emoji is 2 chars
    }))

    // Generate plate breakdowns for each lift
    const liftDetails = lifts.map(lift => {
      const liftStatus = workoutStatus[selectedWeek]?.[lift]
      const liftWeight = Math.max(...cycle[`week${selectedWeek}`][lift].weights)
      
      if (liftStatus === 'nailed' || liftStatus === 'failed') {
        // Show plates and weight for completed lifts
        const plates = calculatePlates(liftWeight)
        const plateText = formatPlatesWithPlaceholders(plates, maxPlates)
        return `${plateText} ${liftNames[lift]}: ${liftWeight} lbs`
      } else {
        // Show only placeholders for incomplete lifts
        const placeholders = EMPTY_SLOT.repeat(maxPlates)
        return `${placeholders} ${liftNames[lift]}: ${liftWeight} lbs`
      }
    }).join('\n')

    return `${emoji} Just ${status} my ${liftNames[currentLift as LiftName]} at ${weight}lbs!\n\nWeek ${selectedWeek} (${weekName}) Results:\n${statusEmojis}\n\n${liftDetails}\n\nCome at me! 🏋️\n\nhttps://lift.neosavvy.com`
  }

  const [showShareModal, setShowShareModal] = useState(false)
  const [shareText, setShareText] = useState('')

  const shareToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        try {
          // Try using the Clipboard API first
          await navigator.clipboard.writeText(text)
          setToastMessage('Achievement copied! Share it with your friends! 🏋️')
          setToastType('success')
          setShowToast(true)
          return
        } catch (clipboardError) {
          console.error('Clipboard API failed:', clipboardError)
          // Fall through to next method
        }
      }

      // Try execCommand as fallback
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)
      
      if (successful) {
        setToastMessage('Achievement copied! Share it with your friends! 🏋️')
        setToastType('success')
        setShowToast(true)
        return
      }
    } catch (err) {
      console.error('All copy methods failed:', err)
    }

    // If all methods fail, show modal with selectable text
    setShareText(text)
    setShowShareModal(true)
  }

  const toggleLiftStatus = async (lift: LiftName, status: 'nailed' | 'failed') => {
    const currentStatus = workoutStatus[selectedWeek]?.[lift]
    
    // If clicking the same status button again, remove the status
    if (currentStatus === status) {
      const success = await deleteLiftCompletion(lift)
      if (success) {
        setToastMessage(`Cleared ${lift} status`)
        setToastType('success')
        setShowToast(true)
        if (onStatusChange) {
          onStatusChange()
        }
      }
    } else {
      // Otherwise save the new status
      const success = await saveLiftCompletion(lift, status)
      if (success) {
        // Get the max weight for this lift in the current week
        const workout = cycle[`week${selectedWeek}`][lift]
        const maxWeight = Math.max(...workout.weights)
        
        // Generate and share the achievement
        const shareText = generateShareText(lift, status, maxWeight)
        await shareToClipboard(shareText)
        
        // Check if all lifts in the week are completed
        const allLiftsCompleted = lifts.every(l => 
          workoutStatus[selectedWeek]?.[l] === 'nailed' || 
          workoutStatus[selectedWeek]?.[l] === 'failed'
        )
        
        if (allLiftsCompleted) {
          if (selectedWeek === 4) {
            // For week 4, add a delay before scrolling to bottom
            setTimeout(() => {
              window.scrollTo({ 
                top: document.documentElement.scrollHeight,
                behavior: 'smooth' 
              })
            }, 500) // 500ms delay to allow new content to render
          } else {
            // For other weeks, scroll to top immediately
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }
        }
        
        if (onStatusChange) {
          onStatusChange()
        }
      }
    }
  }
  const lifts: LiftName[] = ['squat', 'bench', 'overhead', 'deadlift']
  const liftNames: Record<LiftName, string> = {
    squat: 'SQAT',
    bench: 'BNCH',
    overhead: 'OHPR',
    deadlift: 'DLFT'
  }

  const getWeekTitle = (week: number) => {
    const weekSchedule = cycle[`week${week}`][lifts[0]]
    return `Week ${week} - ${weekSchedule.name}`
  }

  const toggleSetExpansion = (setKey: string) => {
    setExpandedSet(expandedSet === setKey ? null : setKey)
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
      {showShareModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black border-2 border-matrix-green rounded-lg p-4 min-h-[80vh] w-full max-w-2xl mx-4 flex flex-col">
            <h3 className="text-xl font-retro text-matrix-green mb-3">Share Your Achievement</h3>
            <p className="text-sm font-cyber text-matrix-green/70 mb-3">Select and copy the text below:</p>
            <textarea
              className="flex-grow w-full bg-black border-2 border-matrix-green/30 rounded-lg p-4 text-matrix-green font-mono text-base leading-relaxed focus:outline-none focus:border-matrix-green/50 mb-3"
              value={shareText}
              readOnly
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              style={{ resize: 'none' }}
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-6 py-2 font-cyber text-sm border-2 border-matrix-green text-matrix-green rounded-lg hover:bg-matrix-green/20 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="retro-container overflow-x-hidden max-w-full">
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
                        <div className="flex justify-between items-center min-w-0">
                          <span className="font-cyber text-matrix-green/80 mr-2 flex-shrink-0">
                            Set {idx + 1}:
                          </span>
                          <span className="font-cyber text-matrix-green flex-shrink-0">
                            {weight} lbs × {workout.sets[idx].reps}
                          </span>
                        </div>
                        
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-matrix-green/20">
                            <div className="text-sm font-cyber text-matrix-green/70">
                              Plate Math (per side):
                            </div>
                            <div className="font-cyber text-matrix-green mt-2 space-y-1">
                              {getPlateBreakdownText(plateBreakdown).split('\n').map((line, i) => (
                                <div key={i}>{line}</div>
                              ))}
                            </div>
                            <div className="text-xs font-cyber text-matrix-green/50 mt-3 space-y-1">
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
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => toggleLiftStatus(lift, 'nailed')}
                  className={`min-w-[120px] px-4 py-2 rounded-lg font-cyber text-sm transition-all relative
                    ${workoutStatus[selectedWeek]?.[lift] === 'nailed'
                      ? 'bg-matrix-green text-black hover:bg-matrix-green/90 active:scale-95'
                      : 'border border-matrix-green text-matrix-green hover:bg-matrix-green/20'}
                    transform hover:scale-105 active:scale-95`}
                  title={workoutStatus[selectedWeek]?.[lift] === 'nailed' ? 'Click to clear status' : 'Mark as completed'}
                >
                  {workoutStatus[selectedWeek]?.[lift] === 'nailed' ? (
                    <>
                      Nailed! 💪
                      <span className="absolute -top-1 -right-1 text-xs bg-black text-matrix-green rounded-full px-1">×</span>
                    </>
                  ) : 'Nailed it! 💪'}
                </button>
                <button
                  onClick={() => toggleLiftStatus(lift, 'failed')}
                  className={`min-w-[120px] px-4 py-2 rounded-lg font-cyber text-sm transition-all relative
                    ${workoutStatus[selectedWeek]?.[lift] === 'failed'
                      ? 'bg-red-600 text-black hover:bg-red-500 active:scale-95'
                      : 'border border-red-600 text-red-600 hover:bg-red-600/20'}
                    transform hover:scale-105 active:scale-95`}
                  title={workoutStatus[selectedWeek]?.[lift] === 'failed' ? 'Click to clear status' : 'Mark as failed'}
                >
                  {workoutStatus[selectedWeek]?.[lift] === 'failed' ? (
                    <>
                      Failed! 😤
                      <span className="absolute -top-1 -right-1 text-xs bg-black text-red-500 rounded-full px-1">×</span>
                    </>
                  ) : 'Failed it! 😤'}
                </button>
              </div>
              

            </div>
          )
        })}


      </div>
    </div>
    </>
  )
} 