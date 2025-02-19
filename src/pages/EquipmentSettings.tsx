import React, { useState, useEffect } from 'react'
import { GiWeightLiftingUp } from 'react-icons/gi'
import { useNavigate } from 'react-router-dom'

type WeightUnit = 'lbs' | 'kg'

interface PlateConfig {
  weight: number
  enabled: boolean
  isCommon?: boolean
}

interface EquipmentSettings {
  unit: WeightUnit
  lbsLargePlates: PlateConfig[]
  lbsChangePlates: PlateConfig[]
  kgLargePlates: PlateConfig[]
  kgChangePlates: PlateConfig[]
}

const STORAGE_KEY = '531_equipment_settings'

const defaultSettings: EquipmentSettings = {
  unit: 'lbs',
  lbsLargePlates: [
    { weight: 55, enabled: false },
    { weight: 45, enabled: true, isCommon: true },
    { weight: 35, enabled: true },
    { weight: 25, enabled: true, isCommon: true },
  ],
  lbsChangePlates: [
    { weight: 10, enabled: true, isCommon: true },
    { weight: 5, enabled: true, isCommon: true },
    { weight: 2.5, enabled: true, isCommon: true },
    { weight: 1.25, enabled: false },
    { weight: 1, enabled: false },
    { weight: 0.75, enabled: false },
    { weight: 0.5, enabled: false },
    { weight: 0.25, enabled: false },
  ],
  kgLargePlates: [
    { weight: 25, enabled: true, isCommon: true },
    { weight: 20, enabled: true, isCommon: true },
    { weight: 15, enabled: true },
    { weight: 10, enabled: true, isCommon: true },
    { weight: 5, enabled: true, isCommon: true },
  ],
  kgChangePlates: [
    { weight: 2.5, enabled: true, isCommon: true },
    { weight: 2, enabled: false },
    { weight: 1.5, enabled: false },
    { weight: 1.25, enabled: true, isCommon: true },
    { weight: 1, enabled: true },
    { weight: 0.5, enabled: true },
    { weight: 0.25, enabled: false },
  ],
}

// Function to get initial settings from localStorage or default
const getInitialSettings = (): EquipmentSettings => {
  const savedSettings = localStorage.getItem(STORAGE_KEY)
  if (savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings)
      // Validate that all required fields exist
      if (
        parsed.unit &&
        Array.isArray(parsed.lbsLargePlates) &&
        Array.isArray(parsed.lbsChangePlates) &&
        Array.isArray(parsed.kgLargePlates) &&
        Array.isArray(parsed.kgChangePlates)
      ) {
        return parsed as EquipmentSettings
      }
    } catch (e) {
      console.error('Error parsing saved equipment settings:', e)
    }
  }
  return defaultSettings
}

export default function EquipmentSettings() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState<EquipmentSettings>(getInitialSettings)
  const [saveStatus, setSaveStatus] = useState<string>('')

  const handleUnitChange = (newUnit: WeightUnit) => {
    setSettings(prev => ({ ...prev, unit: newUnit }))
  }

  const togglePlate = (
    plateType: 'lbsLargePlates' | 'lbsChangePlates' | 'kgLargePlates' | 'kgChangePlates',
    weight: number
  ) => {
    setSettings(prev => ({
      ...prev,
      [plateType]: prev[plateType].map(plate =>
        plate.weight === weight ? { ...plate, enabled: !plate.enabled } : plate
      ),
    }))
  }

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    setSaveStatus('Settings saved successfully!')
    setTimeout(() => setSaveStatus(''), 2000)
  }

  const renderPlateToggles = (
    plateType: 'lbsLargePlates' | 'lbsChangePlates' | 'kgLargePlates' | 'kgChangePlates'
  ) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {settings[plateType].map(plate => (
        <button
          key={plate.weight}
          onClick={() => togglePlate(plateType, plate.weight)}
          className={`
            p-4 rounded-lg border font-cyber text-sm transition-all duration-200
            ${plate.enabled 
              ? 'bg-matrix-green/20 border-matrix-green text-matrix-green' 
              : 'bg-matrix-dark/40 border-matrix-green/30 text-matrix-green/50'
            }
            ${plate.isCommon ? 'ring-2 ring-matrix-green/30' : ''}
            hover:bg-matrix-green/30 hover:border-matrix-green
          `}
        >
          {plate.weight} {settings.unit}
        </button>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen p-2 bg-matrix-dark/30">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/workout')}
            className="text-matrix-green font-cyber bg-matrix-dark/40 hover:bg-matrix-green/20 
                     p-3 rounded-lg border border-matrix-green/30 hover:border-matrix-green 
                     transition-all duration-200 transform hover:scale-105 hover:shadow-glow"
            title="Back to Workout"
          >
            <GiWeightLiftingUp size={24} />
          </button>
          <h2 className="text-3xl font-retro text-matrix-green">Equipment Settings</h2>
          <div className="w-10"></div>
        </div>

        <div className="space-y-8 bg-black/40 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-matrix-green/30">
          {/* Unit Selection */}
          <div className="space-y-4">
            <h3 className="text-xl font-retro text-matrix-green">Weight Unit</h3>
            <div className="flex gap-4">
              {(['lbs', 'kg'] as const).map((weightUnit) => (
                <button
                  key={weightUnit}
                  onClick={() => handleUnitChange(weightUnit)}
                  className={`
                    px-6 py-3 rounded-lg border font-cyber transition-all duration-200
                    ${settings.unit === weightUnit 
                      ? 'bg-matrix-green text-black border-matrix-green' 
                      : 'bg-matrix-dark/40 border-matrix-green/30 text-matrix-green'
                    }
                    hover:bg-matrix-green/30 hover:border-matrix-green
                  `}
                >
                  {weightUnit.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Large Plates */}
          <div className="space-y-4">
            <h3 className="text-xl font-retro text-matrix-green">Large Plates</h3>
            <p className="text-sm font-cyber text-matrix-green/70">
              Select the large plates available in your gym
            </p>
            {renderPlateToggles(
              settings.unit === 'lbs' ? 'lbsLargePlates' : 'kgLargePlates'
            )}
          </div>

          {/* Change Plates */}
          <div className="space-y-4">
            <h3 className="text-xl font-retro text-matrix-green">Change Plates</h3>
            <p className="text-sm font-cyber text-matrix-green/70">
              Select the change plates available in your gym
            </p>
            {renderPlateToggles(
              settings.unit === 'lbs' ? 'lbsChangePlates' : 'kgChangePlates'
            )}
          </div>

          {/* Save Button and Status */}
          <div className="pt-6 border-t border-matrix-green/30">
            {saveStatus && (
              <div className="mb-4 text-center font-cyber text-matrix-green animate-fade-out">
                {saveStatus}
              </div>
            )}
            <button
              onClick={handleSave}
              className="w-full bg-matrix-green/20 border-2 border-matrix-green text-matrix-green 
                       font-cyber py-3 px-4 rounded-lg hover:bg-matrix-green/30 
                       active:bg-matrix-green/40 transition-all duration-200 
                       focus:outline-none focus:ring-2 focus:ring-matrix-green/50 
                       shadow-[0_0_15px_rgba(0,255,0,0.1)] hover:shadow-[0_0_20px_rgba(0,255,0,0.2)]"
            >
              Save Equipment Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 