import { useState, useEffect } from 'react'
import WorkoutPlan from './WorkoutPlan'
import CycleSummary from './CycleSummary'
import EliteTimeline from './EliteTimeline'
import CycleReview from './CycleReview'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { FitnessMetric, getLatestFitnessMetric, saveFitnessMetric, metricsAreEqual } from '../lib/fitnessMetrics'

type FormData = {
  bodyWeight: string
  yearsLifting: string
  maxes: {
    squat: string
    bench: string
    overhead: string
    deadlift: string
  }
  trackEliteGoals: boolean
  cycleNumber: number
}

type MaxesKey = keyof FormData['maxes']

const STORAGE_KEY = '531_workout_data'

export default function WorkoutForm() {
  const { user } = useAuth()
  const [formData, setFormData] = useState<FormData>(() => {
    // Load initial data from localStorage on component mount
    const savedData = localStorage.getItem(STORAGE_KEY)
    return savedData ? JSON.parse(savedData) : {
      bodyWeight: '',
      yearsLifting: '',
      maxes: {
        squat: '',
        bench: '',
        overhead: '',
        deadlift: ''
      },
      trackEliteGoals: false,
      cycleNumber: 1
    }
  })

  const [latestMetric, setLatestMetric] = useState<FitnessMetric | null>(null)
  const [showPlan, setShowPlan] = useState(false)
  const [showTimeline, setShowTimeline] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load latest metric from database
  useEffect(() => {
    if (user) {
      setIsLoading(true)
      setError(null)
      getLatestFitnessMetric()
        .then(metric => {
          if (metric) {
            setLatestMetric(metric)
            // Update form data with latest metric
            const newFormData = {

              bodyWeight: metric.body_weight.toString(),
              yearsLifting: metric.years_lifting.toString(),
              maxes: {
                squat: metric.squat_weight.toString(),
                bench: metric.bench_weight.toString(),
                overhead: metric.overhead_press_weight.toString(),
                deadlift: metric.deadlift_weight.toString()
              },
              trackEliteGoals: metric.is_elite_fitness,
              cycleNumber: metric.cycle_number
            }
            setFormData(newFormData)
            
            // Auto-show plan if all required fields are filled
            const hasAllFields = newFormData.bodyWeight && 
              newFormData.yearsLifting && 
              Object.values(newFormData.maxes).every(val => val) &&
              newFormData.cycleNumber
            
            if (hasAllFields) {
              setShowPlan(true)
            }
          }
        })
        .catch(err => {
          console.error('Error loading metrics:', err)
          setError('Failed to load your previous metrics')
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [user])

  // Save to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
  }, [formData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof FormData] as Record<string, string>),
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setError('You must be logged in to save metrics')
      return
    }

    setIsLoading(true)
    setError(null)

    // Ensure all numeric values are properly converted
    const newMetric = {
      body_weight: parseFloat(formData.bodyWeight) || 0,
      years_lifting: parseInt(formData.yearsLifting) || 0,
      squat_weight: parseFloat(formData.maxes.squat) || 0,
      deadlift_weight: parseFloat(formData.maxes.deadlift) || 0,
      bench_weight: parseFloat(formData.maxes.bench) || 0,
      overhead_press_weight: parseFloat(formData.maxes.overhead) || 0,
      is_elite_fitness: Boolean(formData.trackEliteGoals),
      cycle_number: formData.cycleNumber || 1 // Ensure cycle_number has a default value
    }

    try {
      // Only save if there's no previous metric or if the values have changed
      if (!metricsAreEqual(latestMetric, newMetric)) {
        const savedMetric = await saveFitnessMetric(newMetric)
        if (savedMetric) {
          setLatestMetric(savedMetric)
          // Increment cycle number for next time
          setFormData(prev => ({
            ...prev,
            cycleNumber: (prev.cycleNumber || 1) + 1
          }))
        } else {
          throw new Error('Failed to save metrics')
        }
      }
      setShowPlan(true)
    } catch (err) {
      console.error('Error saving metrics:', err)
      setError('Failed to save your metrics')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 bg-matrix-dark/30 flex justify-center items-center">
        <div className="font-cyber text-matrix-green text-lg animate-pulse">Loading your plan...</div>
      </div>
    )
  }

  const handleCommitNewGoals = async (newMaxes: typeof formData.maxes) => {
    if (!user) return

    // Get the current cycle number from fitness_metrics
    const { data: metricsData, error: metricsError } = await supabase
      .from('fitness_metrics')
      .select('cycle_number')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)

    if (metricsError) {
      console.error('Error getting current cycle:', metricsError)
      return
    }

    const nextCycle = (metricsData?.[0]?.cycle_number || 0) + 1

    // Save new maxes and update cycle
    const newFormData = {
      ...formData,
      maxes: newMaxes,
      cycleNumber: nextCycle
    }
    setFormData(newFormData)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFormData))

    // Save to database
    const newMetric = {
      body_weight: parseFloat(formData.bodyWeight) || 0,
      years_lifting: parseInt(formData.yearsLifting) || 0,
      squat_weight: parseFloat(newMaxes.squat) || 0,
      deadlift_weight: parseFloat(newMaxes.deadlift) || 0,
      bench_weight: parseFloat(newMaxes.bench) || 0,
      overhead_press_weight: parseFloat(newMaxes.overhead) || 0,
      is_elite_fitness: Boolean(formData.trackEliteGoals),
      cycle_number: nextCycle
    }
    await saveFitnessMetric(newMetric)

    setShowReview(false)
    setShowPlan(true)
  }

  return (
    <div className="min-h-screen p-2 bg-matrix-dark/30">
      <div className="max-w-4xl mx-auto">
        {showReview ? (
          <CycleReview
            currentMaxes={formData.maxes}
            bodyWeight={formData.bodyWeight}
            isEliteFitness={formData.trackEliteGoals}
            onBack={() => {
              setShowReview(false)
              setShowPlan(true)
            }}
            onCommit={handleCommitNewGoals}
          />
        ) : showTimeline ? (
          <EliteTimeline
            maxLifts={formData.maxes}
            bodyWeight={formData.bodyWeight}
            yearsLifting={formData.yearsLifting}
            onBack={() => setShowTimeline(false)}
            isEliteFitness={formData.trackEliteGoals}
          />
        ) : !showPlan ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="space-y-8 bg-black/40 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-matrix-green/30">
              {/* Header */}
              <div className="text-center">
                <h2 className="text-3xl font-retro text-matrix-green mb-2">Enter Your Stats</h2>
                <p className="text-sm font-cyber text-matrix-green/70">All weights in pounds (lbs)</p>
                {error && (
                  <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-300 text-sm">
                    {error}
                  </div>
                )}
              </div>
              
              {/* Basic Info Section */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block font-cyber text-sm text-matrix-green mb-1">Body Weight</label>
                    <input
                      type="number"
                      name="bodyWeight"
                      value={formData.bodyWeight}
                      onChange={handleInputChange}
                      className="w-full bg-matrix-dark/60 border border-matrix-green/50 p-3 rounded-lg 
                               text-matrix-green font-cyber focus:outline-none focus:border-matrix-green
                               focus:ring-1 focus:ring-matrix-green placeholder-matrix-green/30"
                      placeholder="Enter weight in lbs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-cyber text-sm text-matrix-green mb-1">Years Lifting</label>
                    <input
                      type="number"
                      name="yearsLifting"
                      value={formData.yearsLifting}
                      onChange={handleInputChange}
                      className="w-full bg-matrix-dark/60 border border-matrix-green/50 p-3 rounded-lg 
                               text-matrix-green font-cyber focus:outline-none focus:border-matrix-green
                               focus:ring-1 focus:ring-matrix-green placeholder-matrix-green/30"
                      placeholder="Years of experience"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 1RM Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-retro text-matrix-green border-b border-matrix-green/30 pb-2">
                  Current 1 Rep Maxes
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {['squat', 'bench', 'overhead', 'deadlift'].map((lift) => (
                    <div key={lift}>
                      <label className="block font-cyber text-sm text-matrix-green mb-1 capitalize">
                        {lift.replace('overhead', 'Overhead Press')}
                      </label>
                      <input
                        type="number"
                        name={`maxes.${lift}`}
                        value={formData.maxes[lift as keyof typeof formData.maxes]}
                        onChange={handleInputChange}
                        className="w-full bg-matrix-dark/60 border border-matrix-green/50 p-3 rounded-lg 
                                 text-matrix-green font-cyber focus:outline-none focus:border-matrix-green
                                 focus:ring-1 focus:ring-matrix-green placeholder-matrix-green/30"
                        placeholder={`Enter ${lift} max`}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Elite Goals Toggle */}
              <div className="pt-4 border-t border-matrix-green/30">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="trackEliteGoals"
                      checked={formData.trackEliteGoals}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-matrix-dark/60 rounded-full border border-matrix-green/50 
                                  peer-checked:bg-matrix-green/30 peer-checked:border-matrix-green transition-colors">
                    </div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-matrix-green/50 rounded-full 
                                  peer-checked:bg-matrix-green peer-checked:translate-x-4 transition-all">
                    </div>
                  </div>
                  <span className="font-cyber text-sm text-matrix-green group-hover:text-matrix-green/90">
                    Track Elite Level Goals
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-matrix-green/20 border-2 border-matrix-green text-matrix-green 
                         font-cyber py-3 px-4 rounded-lg hover:bg-matrix-green/30 
                         active:bg-matrix-green/40 transition-all duration-200 
                         focus:outline-none focus:ring-2 focus:ring-matrix-green/50 
                         shadow-[0_0_15px_rgba(0,255,0,0.1)] hover:shadow-[0_0_20px_rgba(0,255,0,0.2)]
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Generate Workout Plan'}
              </button>
            </div>
          </form>
        ) : showTimeline ? (
          <EliteTimeline 
            maxLifts={formData.maxes}
            bodyWeight={formData.bodyWeight}
            yearsLifting={formData.yearsLifting}
            onBack={() => setShowTimeline(false)}
            isEliteFitness={formData.trackEliteGoals}
          />
        ) : (
          <CycleSummary 
            maxLifts={formData.maxes}
            bodyWeight={formData.bodyWeight}
            onBack={() => setShowPlan(false)}
            onShowTimeline={() => setShowTimeline(true)}
            isEliteFitness={formData.trackEliteGoals}
            currentWeek={formData.cycleNumber}
            onStartReview={() => {
              setShowPlan(false)
              setShowReview(true)
            }}
          />
        )}
      </div>
    </div>
  )
} 