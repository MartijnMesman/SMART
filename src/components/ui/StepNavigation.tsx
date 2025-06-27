'use client'

import React, { memo, useCallback } from 'react'

interface Step {
  id: string
  title: string
  icon: string
}

interface StepNavigationProps {
  steps: Step[]
  currentStep: number
  onStepClick: (stepIndex: number) => void
  disabled?: boolean
}

const StepNavigation = memo(function StepNavigation({ steps, currentStep, onStepClick, disabled = false }: StepNavigationProps) {
  const getNavButtonClass = useCallback((index: number) => {
    const baseClass = 'flex items-center gap-2 px-3 py-2 rounded-lg text-sm border-none cursor-pointer transition-all duration-200 whitespace-nowrap'
    
    if (disabled) {
      return `${baseClass} bg-gray-200 text-gray-400 cursor-not-allowed`
    }
    
    if (index === currentStep) return `${baseClass} bg-purple-600 text-white hover:bg-purple-700`
    if (index < currentStep) return `${baseClass} bg-green-100 text-green-800 hover:bg-green-200`
    return `${baseClass} bg-gray-100 text-gray-600 hover:bg-gray-200`
  }, [currentStep, disabled])

  const handleStepClick = useCallback((index: number) => {
    if (!disabled) {
      onStepClick(index)
    }
  }, [onStepClick, disabled])

  return (
    <div className="bg-white border-b border-gray-200 overflow-x-auto">
      <div className="max-w-screen-xl mx-auto px-4 py-3">
        <div className="flex gap-1 min-w-max pb-2 md:pb-0">
          {steps.map((step, index) => (
            <button
              key={step.id}
              className={getNavButtonClass(index)}
              onClick={() => handleStepClick(index)}
              disabled={disabled}
              title={disabled ? 'Privacy toestemming vereist' : `Ga naar ${step.title}`}
            >
              {step.icon} {step.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
})

export default StepNavigation