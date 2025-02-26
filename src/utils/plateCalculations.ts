import { getPreferredWeightUnit } from './weightConversions'

type PlateBreakdown = {
  standardPlates: number[]  // 45, 35, 25
  smallPlates: number[]     // 10, 5
  microPlates: number[]     // 2.5 and smaller
}

// Get available plates from equipment settings
const getAvailablePlates = (): { plates: number[], unit: 'lbs' | 'kg' } => {
  try {
    const settings = localStorage.getItem('531_equipment_settings')
    if (settings) {
      const parsed = JSON.parse(settings)
      const unit = parsed.unit || 'lbs'
      
      if (unit === 'lbs') {
        const largePlates = parsed.lbsLargePlates
          .filter((p: { enabled: boolean }) => p.enabled)
          .map((p: { weight: number }) => p.weight)
        const changePlates = parsed.lbsChangePlates
          .filter((p: { enabled: boolean }) => p.enabled)
          .map((p: { weight: number }) => p.weight)
        return { plates: [...largePlates, ...changePlates].sort((a, b) => b - a), unit }
      } else {
        const largePlates = parsed.kgLargePlates
          .filter((p: { enabled: boolean }) => p.enabled)
          .map((p: { weight: number }) => p.weight)
        const changePlates = parsed.kgChangePlates
          .filter((p: { enabled: boolean }) => p.enabled)
          .map((p: { weight: number }) => p.weight)
        return { plates: [...largePlates, ...changePlates].sort((a, b) => b - a), unit }
      }
    }
  } catch (e) {
    console.error('Error getting available plates:', e)
  }
  // Default to standard LBS plates if no settings found
  return {
    plates: [45, 35, 25, 10, 5, 2.5],
    unit: 'lbs'
  }
}

export const calculatePlates = (targetWeight: number): PlateBreakdown => {
  // Get available plates and unit from settings
  const { plates: availablePlates, unit } = getAvailablePlates()
  
  // Bar weight is 45 lbs or 20 kg
  const BAR_WEIGHT = unit === 'lbs' ? 45 : 20
  
  // Calculate weight needed per side (subtract bar, divide by 2)
  let remainingWeight = (targetWeight - BAR_WEIGHT) / 2
  
  // Categorize available plates
  const standardPlates: number[] = []
  const smallPlates: number[] = []
  const microPlates: number[] = []
  
  // Try each available plate in descending order
  availablePlates.forEach(plate => {
    while (remainingWeight >= plate - 0.0001) { // Add small tolerance for floating point math
      if (plate >= 25) {
        standardPlates.push(plate)
      } else if (plate >= 5) {
        smallPlates.push(plate)
      } else {
        microPlates.push(plate)
      }
      remainingWeight -= plate
    }
  })
  
  return { standardPlates, smallPlates, microPlates }
}

const PLATE_EMOJIS: Record<number, string> = {
  // Standard plates (squares)
  45: '🟦',  // Blue square for 45 lbs / 20 kg
  35: '🟨',  // Yellow square for 35 lbs / 15 kg
  25: '🟩',  // Green square for 25 lbs / 10 kg
  20: '🟦',  // Blue square for 20 kg
  15: '🟨',  // Yellow square for 15 kg
  10: '🟡',  // Yellow circle for 10 lbs / 5 kg
  5: '🔵',   // Blue circle for 5 lbs / 2.5 kg
  2.5: '⚪️', // White circle for 2.5 lbs / 1.25 kg
  1.25: '🟣', // Purple circle for 1.25 lbs / 0.5 kg
  0.5: '⭕️'  // Red circle for 0.5 lbs / 0.25 kg
}

export const EMPTY_SLOT = '⬜️'  // White square emoji

// Format plates as emojis for sharing
export const formatPlateEmojis = (plateBreakdown: PlateBreakdown): string => {
  const { standardPlates, smallPlates, microPlates } = plateBreakdown
  
  // Combine all plates and sort by weight
  const allPlates = [...standardPlates, ...smallPlates, ...microPlates]
    .sort((a, b) => b - a)
  
  // Convert all plates to emojis
  return allPlates
    .map(plate => PLATE_EMOJIS[plate] || '')
    .join('')
}

// Format plates as text for web display
export const formatPlateText = (plateBreakdown: PlateBreakdown): string => {
  const { standardPlates, smallPlates, microPlates } = plateBreakdown
  const { unit } = getAvailablePlates()
  
  const formatSection = (plates: number[], label: string) => {
    if (plates.length === 0) return ''
    
    // Group identical plates and show count
    const grouped = plates.reduce((acc, plate) => {
      acc[plate] = (acc[plate] || 0) + 1
      return acc
    }, {} as Record<number, number>)
    
    const parts = Object.entries(grouped)
      .sort(([a], [b]) => parseFloat(b) - parseFloat(a))
      .map(([weight, count]) => `${count}x${weight} ${unit}`)
      .join(', ')
    
    return `${label}: ${parts}`
  }
  
  const sections = [
    formatSection(standardPlates, 'Standard'),
    formatSection(smallPlates, 'Small'),
    formatSection(microPlates, 'Micro')
  ].filter(Boolean)
  
  return sections.join(' | ')
}

// Get a detailed breakdown of plates for web display
export const getPlateBreakdownText = (plateBreakdown: PlateBreakdown): string => {
  const { standardPlates, smallPlates, microPlates } = plateBreakdown
  const { unit } = getAvailablePlates()
  
  // Combine all plates
  const allPlates = [...standardPlates, ...smallPlates, ...microPlates]
  
  // Group identical plates
  const grouped = allPlates.reduce((acc, plate) => {
    acc[plate] = (acc[plate] || 0) + 1
    return acc
  }, {} as Record<number, number>)
  
  // Sort by weight (heaviest first) and format
  return Object.entries(grouped)
    .sort(([a], [b]) => parseFloat(b) - parseFloat(a))
    .map(([weight, count]) => `${count} × ${weight} ${unit} plates`)
    .join('\n')
}