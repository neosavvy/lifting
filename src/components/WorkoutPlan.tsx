import { generateCycle } from '../utils/workoutCalculations'
import { calculatePlates, formatPlateText } from '../utils/plateCalculations'
import { useState, useEffect } from 'react'
import { LiftStatus, WorkoutStatus } from '../types/workout'

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
  const [expandedSet, setExpandedSet] = useState<string | null>(null)
  const [workoutStatus, setWorkoutStatus] = useState<WorkoutStatus>(() => {
    const saved = localStorage.getItem('workoutStatus')
    return saved ? JSON.parse(saved) : {}
  })
  const cycle = generateCycle(maxLifts)
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

  const getPlateEmoji = (weight: number) => {
    switch (weight) {
      case 45: return '🟦' // 🟦
      case 35: return '🟨' // 🟨
      case 25: return '🟩' // 🟩
      default: return ''
    }
  }

  const generateShareText = () => {
    const weekName = selectedWeek === 3 ? '1+ Week' : `${5 - selectedWeek}s Week`
    const results = lifts.map(lift => {
      const status = workoutStatus[selectedWeek]?.[lift]
      return status === 'nailed' ? '💪' : status === 'failed' ? '😤' : '❌'
    }).join('')

    // Get the heaviest set for each lift
    const liftDetails = lifts.map(lift => {
      const workout = cycle[`week${selectedWeek}`][lift]
      const maxWeight = Math.max(...workout.weights)
      const plates = calculatePlates(maxWeight)
      
      // Create a visual representation of plates using emojis
      // Convert the array of plate weights into emojis
      const plateEmojis = plates.standardPlates
        .map(weight => getPlateEmoji(weight))
        .join('')

      // Pad the lift name and ensure consistent spacing
      return `${liftNames[lift]}: ${plateEmojis}`
    }).join('\n')
    
    const legend = '🟩 = 25lbs    🟨 = 35lbs    🟦 = 45lbs'
    
    return `Lift! Week ${selectedWeek} (${weekName}) Results:\n${results}\n\n${liftDetails}\n\n${legend}\n\nCome at me! 🏋️\n#LiftLife #NoExcuses\n\nhttps://lift.neosavvy.com`
  }

  const copyToClipboard = () => {
    const text = generateShareText()
    navigator.clipboard.writeText(text)
      .then(() => alert('Copied to clipboard! Now go flex on your friends! 💪'))
      .catch(() => alert('Failed to copy to clipboard'))
  }

  return (
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
                  onClick={() => {
                    const newStatus = { ...workoutStatus }
                    if (!newStatus[selectedWeek]) newStatus[selectedWeek] = {}
                    newStatus[selectedWeek][lift] = 'nailed'
                    setWorkoutStatus(newStatus)
                    localStorage.setItem('workoutStatus', JSON.stringify(newStatus))
                  }}
                  className={`px-4 py-2 rounded-lg font-cyber text-sm transition-colors ${workoutStatus[selectedWeek]?.[lift] === 'nailed' 
                    ? 'bg-matrix-green text-black' 
                    : 'border border-matrix-green text-matrix-green hover:bg-matrix-green/20'}`}
                >
                  Nailed it! 💪
                </button>
                <button
                  onClick={() => {
                    const newStatus = { ...workoutStatus }
                    if (!newStatus[selectedWeek]) newStatus[selectedWeek] = {}
                    newStatus[selectedWeek][lift] = 'failed'
                    setWorkoutStatus(newStatus)
                    localStorage.setItem('workoutStatus', JSON.stringify(newStatus))
                  }}
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
  )
} 