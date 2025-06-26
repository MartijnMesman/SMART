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
}

const StepNavigation = memo(function StepNavigation({ steps, currentStep, onStepClick }: StepNavigationProps) {
  const getNavButtonClass = useCallback((index: number) => {
    if (index === currentStep) return 'bg-purple-600 text-white'
    if (index < currentStep) return 'bg-green-100 text-green-800'
    return 'bg-gray-100 text-gray-600'
  }, [currentStep])

  const handleStepClick = useCallback((index: number) => {
    onStepClick(index)
  }, [onStepClick])

  return (
    <div className="bg-white border-b border-gray-200 overflow-x-auto">
      <div className="max-w-screen-xl mx-auto px-4 py-3">
        <div className="flex gap-1 min-w-max pb-2 md:pb-0">
          {steps.map((step, index) => (
            <button
              key={step.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border-none cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-gray-200 ${getNavButtonClass(index)} ${index === currentStep ? 'hover:bg-purple-700' : ''}`}
              onClick={() => handleStepClick(index)}
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