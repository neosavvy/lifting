// Standard conversion rates
const KG_TO_LBS = 2.20462
const LBS_TO_KG = 0.453592

export const lbsToKg = (lbs: number): number => {
  return Math.round(lbs * LBS_TO_KG * 10) / 10 // Round to 1 decimal place
}

export const kgToLbs = (kg: number): number => {
  return Math.round(kg * KG_TO_LBS * 10) / 10 // Round to 1 decimal place
}

// Get the user's preferred weight unit from localStorage
export const getPreferredWeightUnit = (): 'lbs' | 'kg' => {
  try {
    const settings = localStorage.getItem('531_equipment_settings')
    if (settings) {
      const parsed = JSON.parse(settings)
      if (parsed.unit === 'kg') return 'kg'
    }
  } catch (e) {
    console.error('Error getting preferred weight unit:', e)
  }
  return 'lbs' // Default to lbs if no setting or error
}

// Convert weight to preferred unit
export const convertToPreferredUnit = (weightInLbs: number): { value: number, unit: 'lbs' | 'kg' } => {
  const unit = getPreferredWeightUnit()
  return {
    value: unit === 'kg' ? lbsToKg(weightInLbs) : weightInLbs,
    unit
  }
} 