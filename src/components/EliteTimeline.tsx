import { calculateProgressionTimeline } from '../utils/progressionCalculations'
import { calculateEliteProgress } from '../utils/eliteCalculations'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { LiftCompletion } from '../types/liftCompletions'

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
  isEliteFitness: boolean
}

export default function EliteTimeline({ maxLifts, bodyWeight, yearsLifting, onBack, isEliteFitness }: EliteTimelineProps) {
  const { user } = useAuth()
  const [completedLifts, setCompletedLifts] = useState<LiftCompletion[]>([])

  useEffect(() => {
    const loadLiftCompletions = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from('lift_completions')
        .select('*')
        .eq('user_id', user.id)

      if (error) {
        console.error('Error loading lift completions:', error)
        return
      }

      if (data) {
        setCompletedLifts(data)
      }
    }

    loadLiftCompletions()
  }, [user])

  const { predictions, liftingLevel } = calculateProgressionTimeline(
    parseInt(bodyWeight),
    maxLifts,
    parseFloat(yearsLifting)
  )

  const eliteProgress = calculateEliteProgress(
    parseInt(bodyWeight),
    maxLifts
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

        {/* Elite Status Progress */}
        <div className="retro-container mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-retro text-matrix-green">Elite Status Progress</h3>
            <div className="font-cyber text-matrix-green">
              Overall: {eliteProgress.overall}%
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 bg-matrix-dark rounded-full">
            <div 
              className="h-full bg-matrix-green rounded-full transition-all duration-500"
              style={{ width: `${eliteProgress.overall}%` }}
            />
          </div>
        </div>

        {/* Current Progress */}
        <div className="retro-container mb-8">
          <h3 className="text-xl font-retro text-matrix-green mb-4">
            Current Progress
          </h3>
          <div className="space-y-2">
            {completedLifts.length > 0 ? (
              completedLifts.map((completion, index) => (
                <div key={index} className="text-sm font-cyber text-matrix-green/80">
                  Week {completion.cycle_week} - {completion.lift_type}: {completion.status}
                </div>
              ))
            ) : (
              <div className="text-sm font-cyber text-matrix-green/60">
                No lifts completed yet. Start lifting! 💪
              </div>
            )}
          </div>
        </div>

        {/* Current Progress */}
        <div className="retro-container mb-8">
          <h3 className="text-xl font-retro text-matrix-green mb-4">
            Current Progress
          </h3>
          <div className="space-y-2">
            {completedLifts.length > 0 ? (
              completedLifts.map((completion, index) => (
                <div key={index} className="text-sm font-cyber text-matrix-green/80">
                  Week {completion.cycle_week} - {completion.lift_type}: {completion.status}
                </div>
              ))
            ) : (
              <div className="text-sm font-cyber text-matrix-green/60">
                No lifts completed yet. Start lifting! 💪
              </div>
            )}
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