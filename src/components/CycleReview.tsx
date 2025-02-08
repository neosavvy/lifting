import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { calculateEliteProgress } from '../utils/eliteCalculations'
import { FiArrowLeft } from 'react-icons/fi'
import PersonalMetrics from './PersonalMetrics'

type CycleReviewProps = {
  currentMaxes: {
    squat: string
    bench: string
    overhead: string
    deadlift: string
  }
  bodyWeight: string
  isEliteFitness: boolean
  onBack: () => void
  onCommit: (newMaxes: { squat: string; bench: string; overhead: string; deadlift: string }) => void
}

export default function CycleReview({
  currentMaxes,
  bodyWeight,
  isEliteFitness,
  onBack,
  onCommit
}: CycleReviewProps) {
  // Calculate recommended increases based on lift type
  const getRecommendedIncrease = (lift: string) => {
    switch (lift) {
      case 'squat': return 5
      case 'bench': return 2.5
      case 'overhead': return 1.5
      case 'deadlift': return 5
      default: return 2.5
    }
  }

  // Initialize new maxes with recommended increases
  const [currentBodyWeight, setCurrentBodyWeight] = useState(bodyWeight)
  const [yearsLifting, setYearsLifting] = useState('0')
  const [currentEliteFitness, setCurrentEliteFitness] = useState(isEliteFitness)
  const [newMaxes, setNewMaxes] = useState(() => {
    return Object.entries(currentMaxes).reduce((acc, [lift, weight]) => ({
      ...acc,
      [lift]: (parseFloat(weight) + getRecommendedIncrease(lift)).toFixed(1)
    }), {} as typeof currentMaxes)
  })

  const { user } = useAuth()

  // Fetch current years_lifting on mount
  useEffect(() => {
    const fetchYearsLifting = async () => {
      if (!user) return
      const { data, error } = await supabase
        .from('fitness_metrics')
        .select('years_lifting')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (!error && data?.[0]?.years_lifting) {
        setYearsLifting(data[0].years_lifting.toString())
      }
    }
    fetchYearsLifting()
  }, [user])
  const eliteProgress = calculateEliteProgress(parseInt(bodyWeight), currentMaxes)

  const handleInputChange = (lift: keyof typeof newMaxes) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow only numbers and one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setNewMaxes(prev => ({
        ...prev,
        [lift]: value
      }))
    }
  }



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Round all values to nearest 0.5 before committing
    const roundedMaxes = Object.entries(newMaxes).reduce((acc, [lift, weight]) => ({
      ...acc,
      [lift]: (Math.round(parseFloat(weight) * 2) / 2).toFixed(1)
    }), {} as typeof newMaxes)

    onCommit(roundedMaxes)
  }

  return (
    <div className="min-h-screen p-2 bg-matrix-dark/30">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="text-matrix-green font-cyber hover:text-matrix-green/80 p-2 rounded-full hover:bg-matrix-green/10 transition-colors"
            title="Back"
          >
            <FiArrowLeft size={24} />
          </button>
          <h2 className="text-3xl font-retro text-matrix-green ml-4">Review Cycle & Set New Goals</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Current Progress Summary */}
          <div className="retro-container">
            <h3 className="text-xl font-retro text-matrix-green mb-4">Current Progress</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(currentMaxes).map(([lift, weight]) => (
                <div key={lift} className="border border-matrix-green/30 rounded-lg p-4">
                  <div className="font-cyber text-matrix-green capitalize mb-1">
                    {lift.replace('overhead', 'Overhead Press')}
                  </div>
                  <div className="text-2xl font-cyber text-matrix-green">
                    {weight} lbs
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Set New Goals */}
          <div className="retro-container">
            <h3 className="text-xl font-retro text-matrix-green mb-4">Set New Goals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(newMaxes).map(([lift, weight]) => (
                <div key={lift} className="space-y-2">
                  <label className="block font-cyber text-matrix-green capitalize">
                    {lift.replace('overhead', 'Overhead Press')}
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        inputMode="decimal"
                        pattern="[0-9]*[.]?[0-9]*"
                        value={weight}
                        onChange={handleInputChange(lift as keyof typeof newMaxes)}
                        className="w-full bg-black border-2 border-matrix-green/30 rounded-lg px-4 py-2 font-cyber text-matrix-green focus:border-matrix-green focus:outline-none"
                      />
                      <div className="absolute -top-5 right-0 text-sm font-cyber text-matrix-green/70">
                        +{getRecommendedIncrease(lift)} lbs/cycle
                      </div>
                    </div>
                    <span className="font-cyber text-matrix-green">lbs</span>
                  </div>
                  {isEliteFitness && (
                    <div className="text-sm font-cyber text-matrix-green/70">
                      Elite Goal: {eliteProgress.lifts.find(l => l.lift === lift)?.goal} lbs
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Personal Metrics */}
          <div className="retro-container">
            <h3 className="text-xl font-retro text-matrix-green mb-4">Personal Metrics</h3>
            <PersonalMetrics 
              currentWeight={currentBodyWeight}
              onWeighIn={setCurrentBodyWeight}
              yearsLifting={yearsLifting}
              onYearsLiftingChange={setYearsLifting}
              isEliteFitness={currentEliteFitness}
              onEliteFitnessChange={setCurrentEliteFitness}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-8 py-4 bg-matrix-green text-black rounded-lg font-cyber text-lg hover:bg-matrix-green/90 transition-colors transform hover:scale-105 active:scale-95"
            >
              Commit to New Goals
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
