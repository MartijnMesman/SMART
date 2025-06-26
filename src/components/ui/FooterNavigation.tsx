'use client'

import React from 'react'

interface FooterNavigationProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
  onSave: () => void
  onLoad: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function FooterNavigation({ 
  currentStep, 
  totalSteps, 
  onPrevious, 
  onNext, 
  onSave, 
  onLoad 
}: FooterNavigationProps) {
  return (
    <div className="bg-white border-t border-gray-200 mt-8">
      <div className="max-w-screen-lg mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <button
          className={`inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border-none cursor-pointer transition-all duration-200 ${
            currentStep === 0 
              ? 'bg-gray-200 text-gray-700 opacity-50 cursor-not-allowed' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={onPrevious}
          disabled={currentStep === 0}
        >
          ← Vorige
        </button>
        
        <div className="flex gap-4">
          <button 
            className="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border-none cursor-pointer transition-all duration-200 bg-green-500 text-white hover:bg-green-600"
            onClick={onSave}
          >
            💾 Opslaan
          </button>
          <label className="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border-none cursor-pointer transition-all duration-200 bg-purple-600 text-white hover:bg-purple-700">
            📁 Laden
            <input type="file" accept=".json" onChange={onLoad} className="hidden" />
          </label>
        </div>
        
        <button
          className={`inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border-none cursor-pointer transition-all duration-200 ${
            currentStep === totalSteps - 1 
              ? 'bg-gray-200 text-gray-700 opacity-50 cursor-not-allowed' 
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
          onClick={onNext}
          disabled={currentStep === totalSteps - 1}
        >
          Volgende →
        </button>
      </div>
    </div>
  )
}