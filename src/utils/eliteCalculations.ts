type MaxLifts = {
  squat: string
  bench: string
  overhead: string
  deadlift: string
}

export const calculateEliteProgress = (bodyWeight: number, maxLifts: MaxLifts) => {
  const eliteMultipliers = {
    squat: 2.0,
    bench: 1.5,
    overhead: 1.0,
    deadlift: 2.5
  }

  const progress = Object.entries(maxLifts).map(([lift, max]) => {
    const currentMax = parseInt(max)
    const eliteGoal = bodyWeight * eliteMultipliers[lift as keyof typeof eliteMultipliers]
    const percentage = (currentMax / eliteGoal) * 100

    return {
      lift,
      current: currentMax,
      goal: Math.round(eliteGoal),
      percentage: Math.min(100, Math.round(percentage)),
      remaining: Math.max(0, Math.round(eliteGoal - currentMax))
    }
  })

  const overallProgress = progress.reduce((sum, { percentage }) => sum + percentage, 0) / 4

  return {
    lifts: progress,
    overall: Math.round(overallProgress)
  }
} 