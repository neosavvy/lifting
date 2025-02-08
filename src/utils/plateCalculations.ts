type PlateBreakdown = {
  standardPlates: number[]  // 45, 35, 25
  smallPlates: number[]     // 10, 5
  microPlates: number[]     // 2.5 and smaller
}

export const calculatePlates = (targetWeight: number): PlateBreakdown => {
  // Bar weight is 45 lbs
  const BAR_WEIGHT = 45
  
  // Standard plate weights (per side)
  const STANDARD_PLATES = [45, 35, 25]
  // Small plates (per side)
  const SMALL_PLATES = [10, 5]
  // Micro plates (per side)
  const MICRO_PLATES = [2.5, 1.25, 0.5, 0.25, 0.125]
  
  // Calculate weight needed per side (subtract bar, divide by 2)
  let remainingWeight = (targetWeight - BAR_WEIGHT) / 2
  
  const standardPlates: number[] = []
  const smallPlates: number[] = []
  const microPlates: number[] = []
  
  // Calculate standard plates needed
  STANDARD_PLATES.forEach(plate => {
    while (remainingWeight >= plate) {
      standardPlates.push(plate)
      remainingWeight -= plate
    }
  })
  
  // Calculate small plates needed
  SMALL_PLATES.forEach(plate => {
    while (remainingWeight >= plate) {
      smallPlates.push(plate)
      remainingWeight -= plate
    }
  })
  
  // Calculate micro plates needed
  MICRO_PLATES.forEach(plate => {
    while (remainingWeight >= plate - 0.0001) { // Add small tolerance for floating point math
      microPlates.push(plate)
      remainingWeight -= plate
    }
  })
  
  return { standardPlates, smallPlates, microPlates }
}

const PLATE_EMOJIS: Record<number, string> = {
  // Standard plates (squares)
  45: '🟦',  // 🟦
  35: '🟨',  // 🟨
  25: '🟩',  // 🟩
  // Small plates (circles)
  10: '🟡',  // 🟡
  5: '🔵',   // 🔵
  2.5: '⚪️', // ⚪️
  1.25: '🟣', // 🟣
  0.5: '⭕️'  // ⭕️
}

export const EMPTY_SLOT = '⬜️'  // White square emoji

export const formatPlateText = (plateBreakdown: PlateBreakdown, _minWidth: number = 0): string => {
  const { standardPlates, smallPlates, microPlates } = plateBreakdown
  
  // Combine all plates and sort by weight
  const allPlates = [...standardPlates, ...smallPlates, ...microPlates]
    .sort((a, b) => b - a)
  
  // Convert all plates to emojis
  return allPlates
    .map(plate => PLATE_EMOJIS[plate] || '')
    .join('')
} 