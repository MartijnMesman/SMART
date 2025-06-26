'use client'

import React from 'react'

interface StepProps {
  formData: any;
  updateFormData: (path: string, value: any) => void;
  getNestedValue: (obj: any, path: string) => any;
}

export default function StartpuntStep({ formData, updateFormData, getNestedValue }: StepProps) {
  const handleInputChange = (path: string, value: any) => {
    updateFormData(path, value);
  };

  const score = getNestedValue(formData, 'stap5_startpunt.huidigeScore') || 5;
  
  return (
    <>
      <h2 className="step-title">Stap 5: In kaart brengen van je startpunt</h2>
      
      <div className="info-box blue">
        <h3>Waar sta je nu?</h3>
        <p>Door je huidige niveau in te schatten, krijg je een realistisch beeld van je ontwikkeling.</p>
      </div>

      <div className="form-group mb-6">
        <label className="form-label block text-sm font-medium text-gray-700 mb-2">
          Waar sta je nu op een schaal van 0 tot 10?
        </label>
        <div className="range-container my-4">
          <input 
            type="range" 
            min="0" 
            max="10" 
            value={score}
            className="range-input" 
            onChange={(e) => handleInputChange('stap5_startpunt.huidigeScore', parseInt(e.target.value))}
          />
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>0 - Helemaal niet</span>
            <span className="text-lg font-semibold text-purple-600">{score}</span>
            <span>10 - Volledig beheerst</span>
          </div>
        </div>
      </div>

      <div className="form-group mb-6">
        <label className="form-label block text-sm font-medium text-gray-700 mb-2">
          Wat kun je al waardoor je niet op 0 staat?
        </label>
        <textarea 
          className="form-textarea" 
          rows={3} 
          value={getNestedValue(formData, 'stap5_startpunt.waaromNietNul')}
          onChange={(e) => handleInputChange('stap5_startpunt.waaromNietNul', e.target.value)}
          placeholder="Beschrijf wat je al kunt..."
        />
      </div>

      <div className="form-group mb-6">
        <label className="form-label block text-sm font-medium text-gray-700 mb-2">
          Wanneer heb je het dichtst bij de 10 gestaan?
        </label>
        <textarea 
          className="form-textarea" 
          rows={3} 
          value={getNestedValue(formData, 'stap5_startpunt.succesSituatie')}
          onChange={(e) => handleInputChange('stap5_startpunt.succesSituatie', e.target.value)}
          placeholder="Beschrijf een succesmoment..."
        />
      </div>

      <div className="form-group mb-6">
        <label className="form-label block text-sm font-medium text-gray-700 mb-2">
          Hoe is je dat toen gelukt?
        </label>
        <textarea 
          className="form-textarea" 
          rows={3} 
          value={getNestedValue(formData, 'stap5_startpunt.hoeGelukt')}
          onChange={(e) => handleInputChange('stap5_startpunt.hoeGelukt', e.target.value)}
          placeholder="Wat deed je anders?"
        />
      </div>

      <div className="form-group mb-6">
        <label className="form-label block text-sm font-medium text-gray-700 mb-2">
          Als je één stap verder op de schaal staat, wat doe je dan anders?
        </label>
        <textarea 
          className="form-textarea" 
          rows={3} 
          value={getNestedValue(formData, 'stap5_startpunt.volgendStap')}
          onChange={(e) => handleInputChange('stap5_startpunt.volgendStap', e.target.value)}
          placeholder="Beschrijf je volgende stap..."
        />
      </div>

      <div className="form-group mb-6">
        <label className="form-label block text-sm font-medium text-gray-700 mb-2">
          Wat heb je nodig om daar te komen?
        </label>
        <textarea 
          className="form-textarea" 
          rows={3} 
          value={getNestedValue(formData, 'stap5_startpunt.watNodig')}
          onChange={(e) => handleInputChange('stap5_startpunt.watNodig', e.target.value)}
          placeholder="Welke hulp of middelen heb je nodig?"
        />
      </div>
    </>
  )
}