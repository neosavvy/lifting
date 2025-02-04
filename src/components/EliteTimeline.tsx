import { calculateProgressionTimeline } from '../utils/progressionCalculations'

type EliteTimelineProps = {
  maxLifts: {
    squat: string
    bench: string
    overhead: string
    deadlift: string
  }
  bodyWeight: string
  yearsLifting: string
  onBack: () => void
}

export default function EliteTimeline({ maxLifts, bodyWeight, yearsLifting, onBack }: EliteTimelineProps) {
  const { predictions, liftingLevel } = calculateProgressionTimeline(
    parseInt(bodyWeight),
    maxLifts,
    parseFloat(yearsLifting)
  )

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  const getLevelEmoji = (level: string) => {
    switch(level) {
      case 'beginner': return '🌱'
      case 'intermediate': return '⚡'
      case 'advanced': return '🔥'
      default: return '💪'
    }
  }

  return (
    <div className="min-h-screen p-4 bg-matrix-dark/30">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="text-matrix-green font-cyber hover:text-matrix-green/80"
          >
            ← Back to Plan
          </button>
          <h2 className="text-3xl font-retro text-matrix-green">Elite Timeline</h2>
        </div>

        {/* Lifter Status */}
        <div className="retro-container mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-retro text-matrix-green mb-2">
                Current Status {getLevelEmoji(liftingLevel)}
              </h3>
              <p className="font-cyber text-matrix-green/70 capitalize">
                {liftingLevel} Lifter • {yearsLifting} Years Experience
              </p>
            </div>
            <div className="text-right">
              <div className="font-cyber text-matrix-green">
                Body Weight: {bodyWeight} lbs
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Cards */}
        <div className="space-y-6">
          {predictions.map(prediction => (
            <div key={prediction.lift} className="retro-container">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <h3 className="text-xl font-retro text-matrix-green capitalize mb-2 md:mb-0">
                  {prediction.lift.replace('overhead', 'Overhead Press')}
                </h3>
                <div className="font-cyber text-matrix-green text-right">
                  Target: {formatDate(prediction.targetDate)}
                </div>
              </div>

              {/* Progress Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-3 border border-matrix-green/30 rounded">
                  <div className="text-sm font-cyber text-matrix-green/70 mb-1">Current</div>
                  <div className="font-cyber text-matrix-green">{prediction.currentMax} lbs</div>
                </div>
                <div className="p-3 border border-matrix-green/30 rounded">
                  <div className="text-sm font-cyber text-matrix-green/70 mb-1">Elite Goal</div>
                  <div className="font-cyber text-matrix-green">{prediction.eliteGoal} lbs</div>
                </div>
                <div className="p-3 border border-matrix-green/30 rounded">
                  <div className="text-sm font-cyber text-matrix-green/70 mb-1">Monthly Progress</div>
                  <div className="font-cyber text-matrix-green">+{prediction.monthlyProgress} lbs</div>
                </div>
              </div>

              {/* Time Estimate */}
              <div className="text-sm font-cyber text-matrix-green/70">
                Estimated time to reach elite level: {prediction.monthsToGoal} months
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 border border-matrix-green/30 rounded">
          <p className="text-sm font-cyber text-matrix-green/70">
            Note: These projections are based on consistent training and proper recovery. 
            Progress may vary based on individual factors, nutrition, and training adherence.
          </p>
        </div>
      </div>
    </div>
  )
} 