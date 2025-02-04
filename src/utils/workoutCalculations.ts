type MaxLifts = {
  squat: string
  bench: string
  overhead: string
  deadlift: string
}

export const calculateTrainingMax = (oneRepMax: number) => {
  // Training max is 90% of 1RM
  return Math.round(oneRepMax * 0.9)
}

export const calculateWeek = (trainingMax: number, week: 1 | 2 | 3 | 4) => {
  const percentages = {
    1: [0.65, 0.75, 0.85], // Week 1: 5 reps
    2: [0.70, 0.80, 0.90], // Week 2: 3 reps
    3: [0.75, 0.85, 0.95], // Week 3: 1+ reps
    4: [0.40, 0.50, 0.60]  // Week 4: Deload
  }

  return percentages[week].map(percentage => 
    Math.round((trainingMax * percentage) / 5) * 5
  )
}

export const generateCycle = (maxLifts: MaxLifts) => {
  const lifts = {
    squat: parseInt(maxLifts.squat),
    bench: parseInt(maxLifts.bench),
    overhead: parseInt(maxLifts.overhead),
    deadlift: parseInt(maxLifts.deadlift)
  }

  const schedule = {
    1: { // Week 1: 5 reps
      main: '3 sets of 5 reps',
      final: '5+ reps (AMRAP)'
    },
    2: { // Week 2: 3 reps
      main: '3 sets of 3 reps',
      final: '3+ reps (AMRAP)'
    },
    3: { // Week 3: Heavy singles
      main: '3 sets',
      final: '1+ reps (AMRAP)'
    },
    4: { // Week 4: Deload
      main: '5 reps',
      final: '5 reps'
    }
  }

  const cycle: Record<string, Record<string, any>> = {
    week1: {},
    week2: {},
    week3: {},
    week4: {}
  }

  // Generate plan for each lift
  Object.entries(lifts).forEach(([lift, max]) => {
    const trainingMax = calculateTrainingMax(max)
    
    ;[1, 2, 3, 4].forEach((week) => {
      const weights = calculateWeek(trainingMax, week as 1 | 2 | 3 | 4)
      cycle[`week${week}`][lift] = {
        weights,
        reps: schedule[week as 1 | 2 | 3 | 4]
      }
    })
  })

  return cycle
} 