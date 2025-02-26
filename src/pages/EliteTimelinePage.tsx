import React from 'react'
import EliteTimeline from '../components/EliteTimeline'
import { useNavigate, useLocation } from 'react-router-dom'
import { GiWeightLiftingUp } from 'react-icons/gi'

export default function EliteTimelinePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as {
    maxLifts: { squat: string; bench: string; overhead: string; deadlift: string }
    bodyWeight: string
    yearsLifting: string
    isEliteFitness: boolean
  } | null

  if (!state) {
    // If no state is provided, redirect back to the workout form
    navigate('/workout')
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-retro text-center mb-8">
        5x3x1 Weightlifting Planner
      </h1>
      <div className="min-h-screen p-2 bg-matrix-dark/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/workout')}
              className="text-matrix-green font-cyber bg-matrix-dark/40 hover:bg-matrix-green/20 
                       p-3 rounded-lg border border-matrix-green/30 hover:border-matrix-green 
                       transition-all duration-200 transform hover:scale-105 hover:shadow-glow"
              title="Back to Workout"
            >
              <GiWeightLiftingUp size={24} />
            </button>
            <h2 className="text-3xl font-retro text-matrix-green">Elite Timeline</h2>
            {/* Empty div to maintain centering */}
            <div className="w-10"></div>
          </div>
          <EliteTimeline
            maxLifts={state.maxLifts}
            bodyWeight={state.bodyWeight}
            yearsLifting={state.yearsLifting}
            isEliteFitness={state.isEliteFitness}
            onBack={() => navigate('/workout')}
          />
        </div>
      </div>
    </div>
  )
} 