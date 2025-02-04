import { useState, useEffect } from 'react'
import WorkoutPlan from './WorkoutPlan'
import CycleSummary from './CycleSummary'
import EliteTimeline from './EliteTimeline'

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
}

type MaxesKey = keyof FormData['maxes']

const STORAGE_KEY = '531_workout_data'

export default function WorkoutForm() {
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
      trackEliteGoals: false
    }
  })

  const [showPlan, setShowPlan] = useState(false)
  const [showTimeline, setShowTimeline] = useState(false)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowPlan(true)
  }

  return (
    <div className="min-h-screen p-4 bg-matrix-dark/30">
      <div className="max-w-4xl mx-auto">
        {!showPlan ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="space-y-8 bg-black/40 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-matrix-green/30">
              {/* Header */}
              <div className="text-center">
                <h2 className="text-3xl font-retro text-matrix-green mb-2">Enter Your Stats</h2>
                <p className="text-sm font-cyber text-matrix-green/70">All weights in pounds (lbs)</p>
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
                className="w-full bg-matrix-green/20 border-2 border-matrix-green text-matrix-green 
                         font-cyber py-3 px-4 rounded-lg hover:bg-matrix-green/30 
                         active:bg-matrix-green/40 transition-all duration-200 
                         focus:outline-none focus:ring-2 focus:ring-matrix-green/50 
                         shadow-[0_0_15px_rgba(0,255,0,0.1)] hover:shadow-[0_0_20px_rgba(0,255,0,0.2)]"
              >
                Generate Workout Plan
              </button>
            </div>
          </form>
        ) : showTimeline ? (
          <EliteTimeline 
            maxLifts={formData.maxes}
            bodyWeight={formData.bodyWeight}
            yearsLifting={formData.yearsLifting}
            onBack={() => setShowTimeline(false)}
          />
        ) : (
          <CycleSummary 
            maxLifts={formData.maxes}
            bodyWeight={formData.bodyWeight}
            onBack={() => setShowPlan(false)}
            onShowTimeline={() => setShowTimeline(true)}
          />
        )}
      </div>
    </div>
  )
} 