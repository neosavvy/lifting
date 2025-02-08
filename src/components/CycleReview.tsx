import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { calculateEliteProgress } from '../utils/eliteCalculations'
import { FiArrowLeft } from 'react-icons/fi'

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
  const [newMaxes, setNewMaxes] = useState(currentMaxes)
  const eliteProgress = calculateEliteProgress(parseInt(bodyWeight), currentMaxes)

  const handleInputChange = (lift: keyof typeof newMaxes) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMaxes(prev => ({
      ...prev,
      [lift]: e.target.value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCommit(newMaxes)
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
                    <input
                      type="number"
                      value={weight}
                      onChange={handleInputChange(lift as keyof typeof newMaxes)}
                      className="flex-1 bg-black border-2 border-matrix-green/30 rounded-lg px-4 py-2 font-cyber text-matrix-green focus:border-matrix-green focus:outline-none"
                      min="0"
                      step="5"
                    />
                    <span className="font-cyber text-matrix-green">lbs</span>
                  </div>
                  {isEliteFitness && (
                    <div className="text-sm font-cyber text-matrix-green/70">
                      Elite Goal: {eliteProgress[lift as keyof typeof eliteProgress].target} lbs
                    </div>
                  )}
                </div>
              ))}
            </div>
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
