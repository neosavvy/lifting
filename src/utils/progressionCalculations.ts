type MaxLifts = {
  squat: string
  bench: string
  overhead: string
  deadlift: string
}

// Monthly progression rates (in lbs) based on conservative estimates
const monthlyProgressionRates = {
  beginner: {
    squat: 15,
    bench: 10,
    overhead: 5,
    deadlift: 15
  },
  intermediate: {
    squat: 10,
    bench: 5,
    overhead: 2.5,
    deadlift: 10
  },
  advanced: {
    squat: 5,
    bench: 2.5,
    overhead: 1.5,
    deadlift: 5
  }
}

const getLiftingLevel = (yearsLifting: number) => {
  if (yearsLifting < 1) return 'beginner'
  if (yearsLifting < 3) return 'intermediate'
  return 'advanced'
}

export const calculateProgressionTimeline = (
  bodyWeight: number,
  maxLifts: MaxLifts,
  yearsLifting: number
) => {
  const eliteMultipliers = {
    squat: 2.0,
    bench: 1.5,
    overhead: 1.0,
    deadlift: 2.5
  }

  const liftingLevel = getLiftingLevel(yearsLifting)
  const progressionRates = monthlyProgressionRates[liftingLevel]

  const predictions = Object.entries(maxLifts).map(([lift, max]) => {
    const currentMax = parseInt(max)
    const eliteGoal = bodyWeight * eliteMultipliers[lift as keyof typeof eliteMultipliers]
    const remainingWeight = Math.max(0, eliteGoal - currentMax)
    const monthlyProgress = progressionRates[lift as keyof typeof progressionRates]
    
    // Calculate months needed
    const monthsToGoal = Math.ceil(remainingWeight / monthlyProgress)
    const targetDate = new Date()
    targetDate.setMonth(targetDate.getMonth() + monthsToGoal)

    return {
      lift,
      currentMax,
      eliteGoal: Math.round(eliteGoal),
      monthsToGoal,
      targetDate,
      monthlyProgress,
      liftingLevel
    }
  })

  return {
    predictions,
    liftingLevel
  }
} 