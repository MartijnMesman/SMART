'use client'

import React from 'react'

interface StepProps {
  formData: any;
  updateFormData: (path: string, value: any) => void;
  getNestedValue: (obj: any, path: string) => any;
}

export default function EigenschapStep({ formData, updateFormData, getNestedValue }: StepProps) {
  const handleInputChange = (path: string, value: any) => {
    updateFormData(path, value);
  };

  return (
    <>
      <h2 className="step-title">Stap 2: Onderzoeken welke eigenschap zichtbaar wordt</h2>
      
      <div className="info-box blue">
        <h3>Van situatie naar eigenschap</h3>
        <p>Nu gaan we kijken hoe je reageert in lastige situaties en wat dit zegt over je eigenschappen. 
        We gebruiken het kernkwadrant van Ofman om dit inzichtelijk te maken.</p>
      </div>

      <div className="form-group mb-6">
        <label className="form-label block text-sm font-medium text-gray-700 mb-2">
          Hoe reageer je in zulke situaties?
        </label>
        <textarea 
          className="form-textarea" 
          rows={3} 
          value={getNestedValue(formData, 'stap2_eigenschap.reactie')}
          onChange={(e) => handleInputChange('stap2_eigenschap.reactie', e.target.value)}
          placeholder="Beschrijf concreet hoe je reageert..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <label className="form-label block text-sm font-medium text-green-800 mb-2">🌟 Kernkwaliteit</label>
          <textarea 
            className="form-textarea border-green-300" 
            rows={2} 
            value={getNestedValue(formData, 'stap2_eigenschap.kernkwaliteit')}
            onChange={(e) => handleInputChange('stap2_eigenschap.kernkwaliteit', e.target.value)}
            placeholder="Je sterke eigenschap?"
          />
          <p className="text-xs text-green-800 mt-1">Je natuurlijke talent of positieve eigenschap</p>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <label className="form-label block text-sm font-medium text-orange-800 mb-2">⚠️ Valkuil</label>
          <textarea 
            className="form-textarea border-orange-300" 
            rows={2} 
            value={getNestedValue(formData, 'stap2_eigenschap.valkuil')}
            onChange={(e) => handleInputChange('stap2_eigenschap.valkuil', e.target.value)}
            placeholder="Waarin schiet je door?"
          />
          <p className="text-xs text-orange-800 mt-1">Te veel van je kwaliteit wordt een probleem</p>
        </div>
      </div>

      <div className="info-box purple">
        <h3>📝 Gestructureerde formulering</h3>
        <p className="mb-3">Probeer je gedragsbeschrijving te formuleren volgens dit format:</p>
        <div className="bg-white p-4 rounded-lg border-l-4 border-purple-600">
          <p className="italic text-gray-700">
            "Het lukt me dan nog niet om [vul in] wat samenhangt met mijn kernkwaliteit [vul in]"
          </p>
        </div>
        <div className="mt-4">
          <textarea 
            className="form-textarea border-purple-300" 
            rows={2} 
            value={getNestedValue(formData, 'stap2_eigenschap.gedragBeschrijving')}
            onChange={(e) => handleInputChange('stap2_eigenschap.gedragBeschrijving', e.target.value)}
            placeholder="Formuleer volgens bovenstaand format..."
          />
        </div>
      </div>
    </>
  )
}