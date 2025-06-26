'use client'

import React from 'react'

interface StepProps {
  formData: any;
  updateFormData: (path: string, value: any) => void;
  getNestedValue: (obj: any, path: string) => any;
  addActie: () => void;
  removeActie: (index: number) => void;
}

export default function ActiesStep({ formData, updateFormData, getNestedValue, addActie, removeActie }: StepProps) {
  const updateActie = (index: number, value: string) => {
    const newActies = [...formData.stap6_acties];
    newActies[index] = { ...newActies[index], actie: value };
    updateFormData('stap6_acties', newActies);
  };

  return (
    <>
      <h2 className="step-title">Stap 6: Formuleren van concrete acties</h2>
      
      <div className="info-box blue">
        <h3>Van doel naar actie</h3>
        <p>Welke concrete acties ga je ondernemen om je leerdoel te behalen? Begin met een kleine STARTactie die binnen 2 minuten uitvoerbaar is.</p>
      </div>
      
      <div className="space-y-4 mb-6">
        {formData.stap6_acties.map((actie: any, index: number) => (
          <div key={index} className="card">
            <div className="flex justify-between items-center mb-4">
              <div className="font-medium text-gray-700">
                Actie {index + 1} {index === 0 ? '(STARTactie - binnen 2 minuten)' : ''}
              </div>
              {index > 0 && (
                <button 
                  className="btn btn-danger"
                  onClick={() => removeActie(index)}
                >
                  ✕
                </button>
              )}
            </div>
            <textarea 
              className="form-textarea" 
              rows={2}
              value={actie.actie}
              onChange={(e) => updateActie(index, e.target.value)}
              placeholder={index === 0 ? 'Kleine actie binnen 2 minuten...' : 'Beschrijf je actie...'}
            />
          </div>
        ))}
      </div>
      
      <button 
        className="btn btn-dashed w-full mb-8"
        onClick={addActie}
      >
        ⚡ Actie toevoegen
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="info-box yellow">
          <h3>⚡ Voorbeelden STARTacties</h3>
          <ul className="text-sm mt-2 space-y-1">
            <li>• "Ik begroet klasgenoten met overtuiging"</li>
            <li>• "Ik oefen mijn pitch voor de spiegel"</li>
            <li>• "Ik schrijf 3 persoonlijke sterke punten op"</li>
          </ul>
        </div>
        
        <div className="info-box green">
          <h3>📋 Actie-tips</h3>
          <ul className="text-sm mt-2 space-y-1">
            <li>• Begin klein en concreet</li>
            <li>• Maak het meetbaar</li>
            <li>• Plan specifieke momenten</li>
          </ul>
        </div>
      </div>
    </>
  )
}