'use client'

import React, { memo, useCallback } from 'react'

interface FooterNavigationProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
  onSave: () => void
  onLoad: (event: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

const FooterNavigation = memo(function FooterNavigation({ 
  currentStep, 
  totalSteps, 
  onPrevious, 
  onNext, 
  onSave, 
  onLoad,
  disabled = false
}: FooterNavigationProps) {
  const handlePrevious = useCallback(() => {
    if (!disabled) onPrevious()
  }, [onPrevious, disabled])

  const handleNext = useCallback(() => {
    if (!disabled) onNext()
  }, [onNext, disabled])

  const handleSave = useCallback(() => {
    if (!disabled) onSave()
  }, [onSave, disabled])

  const handleLoad = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) onLoad(event)
  }, [onLoad, disabled])

  const getButtonClass = (isDisabled: boolean, baseClass: string) => {
    if (disabled || isDisabled) {
      return `${baseClass} opacity-50 cursor-not-allowed`
    }
    return baseClass
  }

  return (
    <div className="bg-white border-t border-gray-200 mt-8">
      <div className="max-w-screen-lg mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <button
          className={getButtonClass(
            currentStep === 0,
            "inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border-none cursor-pointer transition-all duration-200 bg-gray-200 text-gray-700 hover:bg-gray-300"
          )}
          onClick={handlePrevious}
          disabled={disabled || currentStep === 0}
          title={disabled ? 'Privacy toestemming vereist' : 'Vorige stap'}
        >
          ← Vorige
        </button>
        
        <div className="flex gap-4">
          <button 
            className={getButtonClass(
              false,
              "inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border-none cursor-pointer transition-all duration-200 bg-green-500 text-white hover:bg-green-600"
            )}
            onClick={handleSave}
            disabled={disabled}
            title={disabled ? 'Privacy toestemming vereist' : 'Opslaan'}
          >
            💾 Opslaan
          </button>
          <label className={getButtonClass(
            false,
            "inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border-none cursor-pointer transition-all duration-200 bg-purple-600 text-white hover:bg-purple-700"
          )}>
            📁 Laden
            <input 
              type="file" 
              accept=".json" 
              onChange={handleLoad} 
              className="hidden"
              disabled={disabled}
            />
          </label>
        </div>
        
        <button
          className={getButtonClass(
            currentStep === totalSteps - 1,
            "inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border-none cursor-pointer transition-all duration-200 bg-purple-600 text-white hover:bg-purple-700"
          )}
          onClick={handleNext}
          disabled={disabled || currentStep === totalSteps - 1}
          title={disabled ? 'Privacy toestemming vereist' : 'Volgende stap'}
        >
          Volgende →
        </button>
      </div>
    </div>
  )
})

export default FooterNavigation