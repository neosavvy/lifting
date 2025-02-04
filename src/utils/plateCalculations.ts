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

export const formatPlateText = (plateBreakdown: PlateBreakdown): string => {
  const { standardPlates, smallPlates, microPlates } = plateBreakdown
  const parts: string[] = []
  
  // Helper function to format plate counts
  const formatPlateCounts = (plates: number[]) => {
    const plateCounts = plates.reduce((acc, plate) => {
      acc[plate] = (acc[plate] || 0) + 1
      return acc
    }, {} as Record<number, number>)
    
    return Object.entries(plateCounts)
      .sort((a, b) => Number(b[0]) - Number(a[0])) // Sort by weight descending
      .map(([plate, count]) => `${count}×${Number(plate)}`)
      .join(' + ')
  }
  
  // Format standard plates
  if (standardPlates.length > 0) {
    parts.push(formatPlateCounts(standardPlates))
  }
  
  // Format small plates
  if (smallPlates.length > 0) {
    parts.push(formatPlateCounts(smallPlates))
  }
  
  // Format micro plates
  if (microPlates.length > 0) {
    parts.push(formatPlateCounts(microPlates))
  }
  
  if (parts.length === 0) {
    return "Bar only"
  }
  
  return parts.join(' + ') + ' per side'
} 