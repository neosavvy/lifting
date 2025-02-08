import { useState, useEffect } from 'react'
import WorkoutPlan from './WorkoutPlan'
import { FiEdit3, FiTrendingUp } from 'react-icons/fi'
import { calculateEliteProgress } from '../utils/eliteCalculations'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

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
  isEliteFitness: boolean
  currentWeek: number
}

export default function CycleSummary({ 
  maxLifts, 
  bodyWeight, 
  onBack, 
  onShowTimeline,
  isEliteFitness,
  currentWeek,
  onStartReview
}: CycleSummaryProps & {
  onStartReview: () => void
}) {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [completedWeeks, setCompletedWeeks] = useState<number[]>([])
  const [currentWeekOverride, setCurrentWeekOverride] = useState<number | null>(null)
  const [completedLifts, setCompletedLifts] = useState<{week: number, lift: string}[]>([])
  const eliteProgress = calculateEliteProgress(parseInt(bodyWeight), maxLifts)
  const { user } = useAuth()

  // Load completed weeks and calculate current week
  const loadCompletedWeeks = async () => {
    if (!user) return

    // First, get the latest cycle number for this user
    const { data: cycleData, error: cycleError } = await supabase
      .from('lift_completions')
      .select('cycle_number')
      .eq('user_id', user.id)
      .order('cycle_number', { ascending: false })
      .limit(1)

    if (cycleError) {
      console.error('Error getting latest cycle:', cycleError)
      return
    }

    const currentCycle = cycleData?.[0]?.cycle_number || 1
    console.log('Current cycle from DB:', currentCycle)

    // Get all lift completions for the current cycle
    const { data, error } = await supabase
      .from('lift_completions')
      .select('cycle_week, lift_type, cycle_number')
      .eq('user_id', user.id)
      .eq('cycle_number', currentCycle)
      .not('status', 'is', null)

    if (error) {
      console.error('Error loading completed weeks:', error)
      return
    }

    if (!data) return

    console.log('Completed lifts data:', data)

    // Store completed lifts for progress bar
    setCompletedLifts(data.map(d => ({ week: d.cycle_week, lift: d.lift_type })))

    // Count total lift completions for the cycle
    const totalCompletions = data?.length || 0
    const isFullCycleComplete = totalCompletions === 16 // 4 lifts × 4 weeks

    // Group completions by week for UI purposes
    const weekCompletions = data.reduce((acc, completion) => {
      acc[completion.cycle_week] = acc[completion.cycle_week] || new Set()
      acc[completion.cycle_week].add(completion.lift_type)
      return acc
    }, {} as Record<number, Set<string>>)

    // A week is completed if all 4 lifts are marked
    const completed = Object.entries(weekCompletions)
      .filter(([_, lifts]) => lifts.size === 4)
      .map(([week]) => parseInt(week))
      .sort((a, b) => a - b)

    console.log('Completed weeks:', completed)
    setCompletedWeeks(completed)

    // Calculate current week
    if (completed.length === 0) {
      setCurrentWeekOverride(1)
    } else if (completed.length === 4) {
      setCurrentWeekOverride(4)
    } else {
      const nextWeek = Math.min(completed[completed.length - 1] + 1, 4)
      setCurrentWeekOverride(nextWeek)
    }
  }

  // Callback for WorkoutPlan to notify us of status changes
  const handleStatusChange = () => {
    loadCompletedWeeks()
  }

  // Load data initially and when user changes
  useEffect(() => {
    loadCompletedWeeks()
  }, [user])

  // Update selected week when current week changes
  useEffect(() => {
    if (currentWeekOverride !== null) {
      setSelectedWeek(currentWeekOverride)
    }
  }, [currentWeekOverride])

  const handleWeekSelect = (week: number) => {
    setSelectedWeek(week === selectedWeek ? null : week)
  }

  return (
    <div className="min-h-screen p-2 bg-matrix-dark/30">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="text-matrix-green font-cyber hover:text-matrix-green/80 p-2 rounded-full hover:bg-matrix-green/10 transition-colors"
            title="Back to Form"
          >
            <FiEdit3 size={24} />
          </button>
          <h2 className="text-3xl font-retro text-matrix-green">Current 4-Week Cycle</h2>
          <button
            onClick={onShowTimeline}
            className="text-matrix-green font-cyber hover:text-matrix-green/80 p-2 rounded-full hover:bg-matrix-green/10 transition-colors"
            title="View Timeline"
          >
            <FiTrendingUp size={24} />
          </button>
        </div>

        {/* Max Lifts */}
        <div className="retro-container mb-8">
          <h3 className="text-xl font-retro text-matrix-green mb-4">Max Lifts</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {Object.entries(maxLifts).map(([lift, weight]) => (
              <div key={lift} className="border border-matrix-green/30 rounded-lg p-4">
                <div className="font-cyber text-matrix-green capitalize mb-1">
                  {lift.replace('overhead', 'Overhead Press')}
                </div>
                <div className="text-2xl font-cyber text-matrix-green">
                  {weight} lbs
                </div>
                <div className="text-sm font-cyber text-matrix-green/70">
                  Training Max: {Math.round(parseInt(weight) * 0.9)} lbs
                </div>
              </div>
            ))}
          </div>
          
          {/* Totals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-matrix-green/30">
            <div className="border border-matrix-green/30 rounded-lg p-4 bg-matrix-green/5">
              <div className="font-cyber text-matrix-green mb-1">
                3-Lift Total
              </div>
              <div className="text-2xl font-cyber text-matrix-green">
                {parseInt(maxLifts.squat) + parseInt(maxLifts.bench) + parseInt(maxLifts.deadlift)} lbs
              </div>
              <div className="text-sm font-cyber text-matrix-green/70">
                Squat + Bench + Deadlift
              </div>
            </div>
            <div className="border border-matrix-green/30 rounded-lg p-4 bg-matrix-green/5">
              <div className="font-cyber text-matrix-green mb-1">
                4-Lift Total
              </div>
              <div className="text-2xl font-cyber text-matrix-green">
                {parseInt(maxLifts.squat) + parseInt(maxLifts.bench) + parseInt(maxLifts.deadlift) + parseInt(maxLifts.overhead)} lbs
              </div>
              <div className="text-sm font-cyber text-matrix-green/70">
                All Lifts Including Overhead Press
              </div>
            </div>
          </div>
        </div>

        {/* Elite Status Progress */}
        {isEliteFitness && (
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
        )}

        {/* Cycle Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="font-cyber text-matrix-green text-sm">
              Cycle Progress
            </div>
            <div className="font-cyber text-matrix-green text-sm">
              {completedLifts.length}/16 Lifts
            </div>
          </div>
          <div className="grid grid-cols-16 gap-0.5 bg-matrix-dark rounded-lg p-1">
            {Array.from({ length: 16 }).map((_, i) => {
              const week = Math.floor(i / 4) + 1
              const lift = i % 4
              const liftType = ['squat', 'bench', 'overhead', 'deadlift'][lift]
              const isCompleted = completedLifts.some(cl => cl.week === week && cl.lift === liftType)
              
              return (
                <div 
                  key={i}
                  className={`h-1.5 rounded-sm transition-all duration-300 ${isCompleted ? 'bg-matrix-green' : 'bg-matrix-green/20'}`}
                  title={`Week ${week} - ${liftType.charAt(0).toUpperCase() + liftType.slice(1)}`}
                />
              )
            })}
          </div>
        </div>

        {/* Week Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(week => (
            <button
              key={week}
              onClick={() => handleWeekSelect(week)}
              className={`
                py-4 px-6 rounded-lg font-cyber text-lg transition-all relative
                ${selectedWeek === week
                  ? 'bg-matrix-green text-black'
                  : completedWeeks.includes(week)
                    ? 'border border-matrix-green text-matrix-green bg-matrix-green/10 hover:bg-matrix-green/20'
                    : 'border border-matrix-green text-matrix-green hover:bg-matrix-green/20'
                }
                ${completedWeeks.includes(week) ? 'ring-2 ring-matrix-green ring-offset-2 ring-offset-black' : ''}
              `}
            >
              <div className="text-lg">Week {week}</div>
              <div className="text-sm opacity-80">
                {week === 4 ? 'Deload' : 
                 week === 3 ? '🔥 Fire Week' : 
                 week === 2 ? '3-week' : 
                 '5-week'}
              </div>
              {completedWeeks.includes(week) && (
                <div className="absolute bottom-2 right-2 text-matrix-green">
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>

        {selectedWeek === null ? (
          <div className="text-center text-matrix-green/70 font-cyber p-8">
            Select a week above to view detailed workout
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            <WorkoutPlan 
              maxLifts={maxLifts} 
              selectedWeek={selectedWeek} 
              onStatusChange={handleStatusChange}
            />
            
            {/* Show Flex button when current week is complete, but not when cycle is complete */}
            {completedWeeks.includes(selectedWeek) && completedWeeks.length < 4 && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => window.alert('Flex on em! 💪')}
                  className="px-6 py-3 bg-gradient-to-r from-matrix-green/80 to-matrix-green 
                           text-black rounded-lg font-cyber text-lg transform hover:scale-105
                           transition-all hover:shadow-lg hover:shadow-matrix-green/20"
                >
                  Flex on Em! 💪
                </button>
              </div>
            )}
            
            {/* Show Review Button when all 16 lifts in the cycle are complete */}
            {completedWeeks.length === 4 && completedWeeks.every(w => w >= 1 && w <= 4) && (
              <div className="mt-12 flex flex-col items-center space-y-4">
                <div className="text-matrix-green/80 font-cyber text-center">
                  🎯 You've completed all lifts for this cycle!
                </div>
                <button
                  onClick={onStartReview}
                  className="px-8 py-4 bg-matrix-green text-black rounded-lg font-cyber text-lg
                           hover:bg-matrix-green/90 transition-colors transform hover:scale-105 active:scale-95
                           border-2 border-matrix-green flex items-center space-x-2 shadow-lg shadow-matrix-green/20"
                >
                  <span>Review Cycle & Set Goals</span>
                  <span className="text-2xl">🎯</span>
                </button>
                <div className="text-matrix-green/60 font-cyber text-sm text-center max-w-md">
                  Review your progress and set new goals for your next training cycle
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 