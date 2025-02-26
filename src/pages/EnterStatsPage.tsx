import React from 'react'
import { useNavigate } from 'react-router-dom'
import WorkoutForm from '../components/WorkoutForm'
import { GiWeightLiftingUp } from 'react-icons/gi'

export default function EnterStatsPage() {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-retro text-center mb-8">
        5x3x1 Weightlifting Planner
      </h1>
      <WorkoutForm initialShowPlan={false} />
    </div>
  )
} 