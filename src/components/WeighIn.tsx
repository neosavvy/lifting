import { useState } from 'react'

type WeighInProps = {
  onWeighIn: (weight: string) => void
  currentWeight?: string
}

export default function WeighIn({ onWeighIn, currentWeight }: WeighInProps) {
  const [weight, setWeight] = useState(currentWeight || '')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow only numbers and one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setWeight(value)
      onWeighIn(value)
    }
  }

  return (
    <div className="mb-6">
      <label className="block font-cyber text-matrix-green mb-2">
        Current Body Weight
      </label>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          inputMode="decimal"
          pattern="[0-9]*[.]?[0-9]*"
          value={weight}
          onChange={handleInputChange}
          className="flex-1 bg-black border-2 border-matrix-green/30 rounded-lg px-4 py-2 font-cyber text-matrix-green focus:border-matrix-green focus:outline-none"
          placeholder="Enter your current weight"
        />
        <span className="font-cyber text-matrix-green">lbs</span>
      </div>
    </div>
  )
}
