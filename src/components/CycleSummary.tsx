import { useState } from 'react'
import WorkoutPlan from './WorkoutPlan'
import { calculateEliteProgress } from '../utils/eliteCalculations'

type CycleSummaryProps = {
  maxLifts: {
    squat: string
    bench: string
    overhead: string
    deadlift: string
  }
  bodyWeight: string
  onBack: () => void
  onShowTimeline: () => void
}

export default function CycleSummary({ 
  maxLifts, 
  bodyWeight, 
  onBack, 
  onShowTimeline 
}: CycleSummaryProps) {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const eliteProgress = calculateEliteProgress(parseInt(bodyWeight), maxLifts)

  const handleWeekSelect = (week: number) => {
    setSelectedWeek(week === selectedWeek ? null : week)
  }

  return (
    <div className="min-h-screen p-4 bg-matrix-dark/30">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="text-matrix-green font-cyber hover:text-matrix-green/80"
          >
            ← Back to Form
          </button>
          <h2 className="text-3xl font-retro text-matrix-green">Current 4-Week Cycle</h2>
          <button
            onClick={onShowTimeline}
            className="text-matrix-green font-cyber hover:text-matrix-green/80"
          >
            View Timeline →
          </button>
        </div>

        {/* Overall Elite Progress */}
        <div className="retro-container mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-retro text-matrix-green">Elite Status Progress</h3>
            <div className="font-cyber text-matrix-green">
              Overall: {eliteProgress.overall}%
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 bg-matrix-dark rounded-full mb-6">
            <div 
              className="h-full bg-matrix-green rounded-full transition-all duration-500"
              style={{ width: `${eliteProgress.overall}%` }}
            />
          </div>
        </div>

        {/* Training Max Info with Elite Goals */}
        <div className="retro-container mb-8">
          <h3 className="text-xl font-retro text-matrix-green mb-4">Current Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {eliteProgress.lifts.map(({ lift, current, goal, percentage, remaining }) => (
              <div key={lift} className="border border-matrix-green/30 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-cyber text-matrix-green capitalize mb-1">
                      {lift.replace('overhead', 'Overhead Press')}
                    </div>
                    <div className="text-sm font-cyber text-matrix-green/70">
                      Training Max: {Math.round(current * 0.9)} lbs
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-cyber text-matrix-green">
                      {percentage}%
                    </div>
                    <div className="text-sm font-cyber text-matrix-green/70">
                      of Elite
                    </div>
                  </div>
                </div>
                {/* Individual progress bar */}
                <div className="w-full h-1.5 bg-matrix-dark rounded-full my-3">
                  <div 
                    className="h-full bg-matrix-green rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm font-cyber text-matrix-green/70">
                  <div>Current: {current} lbs</div>
                  <div>Goal: {goal} lbs</div>
                </div>
                {remaining > 0 && (
                  <div className="mt-2 text-sm font-cyber text-matrix-green/60">
                    {remaining} lbs to Elite
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Week Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(week => (
            <button
              key={week}
              onClick={() => handleWeekSelect(week)}
              className={`p-4 border-2 rounded-lg font-cyber transition-all
                ${selectedWeek === week 
                  ? 'border-matrix-green bg-matrix-green/20 text-matrix-green' 
                  : 'border-matrix-green/30 hover:border-matrix-green/60 text-matrix-green/70 hover:text-matrix-green'
                }`}
            >
              <div className="text-lg">Week {week}</div>
              <div className="text-sm opacity-80">
                {week === 4 ? 'Deload' : week === 3 ? '1+ Week' : `${5 - week}s Week`}
              </div>
            </button>
          ))}
        </div>

        {/* Workout Plan Display */}
        {selectedWeek === null ? (
          <div className="text-center text-matrix-green/70 font-cyber p-8">
            Select a week above to view detailed workout
          </div>
        ) : (
          <WorkoutPlan maxLifts={maxLifts} selectedWeek={selectedWeek} />
        )}
      </div>
    </div>
  )
} 