import { generateCycle } from '../utils/workoutCalculations'
import { calculatePlates, formatPlateText } from '../utils/plateCalculations'
import { useState } from 'react'

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
  const cycle = generateCycle(maxLifts)
  const lifts: LiftName[] = ['squat', 'bench', 'overhead', 'deadlift']
  const liftNames: Record<LiftName, string> = {
    squat: 'Squat',
    bench: 'Bench Press',
    overhead: 'Overhead Press',
    deadlift: 'Deadlift'
  }

  const getWeekTitle = (week: number) => {
    if (week === 4) return "Deload Week"
    return `Week ${week} - ${week === 3 ? '1+ Week' : `${5 - week}s Week`}`
  }

  const toggleSetExpansion = (setKey: string) => {
    setExpandedSet(expandedSet === setKey ? null : setKey)
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
              {selectedWeek !== 4 && (
                <div className="mt-4 text-sm text-matrix-green/70 font-cyber">
                  AMRAP = As Many Reps As Possible
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
} 