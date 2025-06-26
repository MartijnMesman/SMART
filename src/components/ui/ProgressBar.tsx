'use client'

import React, { memo } from 'react'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

const ProgressBar = memo(function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progressPercentage = Math.round(((currentStep + 1) / totalSteps) * 100)

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 py-2">
        <div className="flex justify-between text-xs text-gray-600 mb-2">
          <span>Stap {currentStep + 1} van {totalSteps}</span>
          <span>{progressPercentage}% voltooid</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-pink-600 to-pink-800 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
})

export default ProgressBar