import { useState } from 'react'

type PersonalMetricsProps = {
  onWeighIn: (weight: string) => void
  onYearsLiftingChange: (years: string) => void
  onEliteFitnessChange: (isElite: boolean) => void
  currentWeight?: string
  yearsLifting?: string
  isEliteFitness: boolean
}

export default function PersonalMetrics({ 
  onWeighIn, 
  onYearsLiftingChange,
  onEliteFitnessChange,
  currentWeight,
  yearsLifting,
  isEliteFitness
}: PersonalMetricsProps) {
  const [weight, setWeight] = useState(currentWeight || '')
  const [years, setYears] = useState(yearsLifting || '')

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow only numbers and one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setWeight(value)
      onWeighIn(value)
    }
  }

  const handleYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow only numbers and one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setYears(value)
      onYearsLiftingChange(value)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block font-cyber text-matrix-green mb-2">
          Current Body Weight
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            inputMode="decimal"
            pattern="[0-9]*[.]?[0-9]*"
            value={weight}
            onChange={handleWeightChange}
            className="flex-1 bg-black border-2 border-matrix-green/30 rounded-lg px-4 py-2 font-cyber text-matrix-green focus:border-matrix-green focus:outline-none"
            placeholder="Enter your current weight"
          />
          <span className="font-cyber text-matrix-green">lbs</span>
        </div>
      </div>

      <div>
        <label className="block font-cyber text-matrix-green mb-2">
          Years Lifting
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            inputMode="decimal"
            pattern="[0-9]*[.]?[0-9]*"
            value={years}
            onChange={handleYearsChange}
            className="flex-1 bg-black border-2 border-matrix-green/30 rounded-lg px-4 py-2 font-cyber text-matrix-green focus:border-matrix-green focus:outline-none"
            placeholder="Enter years of lifting experience"
          />
          <span className="font-cyber text-matrix-green">years</span>
        </div>
      </div>

      <div>
        <label className="group relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isEliteFitness}
            onChange={(e) => onEliteFitnessChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-14 h-7 bg-black border-2 border-matrix-green/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-matrix-green after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-black">
          </div>
          <span className="ml-3 font-cyber text-matrix-green">Track Elite Level Goals</span>
        </label>
        <div className="mt-2 text-sm text-matrix-green/70 ml-[4.5rem]">
          Enable to see recommended goals based on elite lifting standards
        </div>
      </div>
    </div>
  )
}
