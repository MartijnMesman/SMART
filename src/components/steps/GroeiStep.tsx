'use client'

import React from 'react'

interface StepProps {
  formData: any;
  updateFormData: (path: string, value: any) => void;
  getNestedValue: (obj: any, path: string) => any;
}

export default function GroeiStep({ formData, updateFormData, getNestedValue }: StepProps) {
  const handleInputChange = (path: string, value: any) => {
    updateFormData(path, value);
  };

  const bangeItems = [
    { key: 'belangrijk', label: 'Belangrijk', description: 'Vind je het echt een belangrijk doel?' },
    { key: 'authentiek', label: 'Authentiek', description: 'Past het bij je ontwikkeling?' },
    { key: 'nuttig', label: 'Nuttig', description: 'Vinden anderen het nuttig?' },
    { key: 'geloofwaardig', label: 'Geloofwaardig', description: 'Kun je dit uitvoeren?' },
    { key: 'enthousiasmerend', label: 'Enthousiasmerend', description: 'Word je er enthousiast van?' }
  ];
  
  const completedChecks = bangeItems.filter(item => 
    getNestedValue(formData, `stap3_groei.${item.key}`) === true
  ).length;

  return (
    <>
      <h2 className="step-title">Stap 3: Bepalen waarin je wilt groeien</h2>
      
      <div className="info-box blue">
        <h3>BANGE-check voor je ontwikkelwens</h3>
        <p>De BANGE-check helpt je controleren of je ontwikkelwens echt bij je past en haalbaar is.</p>
      </div>

      <div className="form-group mb-6">
        <label className="form-label block text-sm font-medium text-gray-700 mb-2">
          Waarin wil je groeien? Wat wil je ontwikkelen?
        </label>
        <textarea 
          className="form-textarea" 
          rows={3} 
          value={getNestedValue(formData, 'stap3_groei.ontwikkelwens')}
          onChange={(e) => handleInputChange('stap3_groei.ontwikkelwens', e.target.value)}
          placeholder="Beschrijf wat je wilt leren of verbeteren..."
        />
      </div>

      <div className="info-box yellow">
        <h3>🎯 BANGE-check ({completedChecks}/5 voltooid)</h3>
        <div className="mt-4 space-y-4">
          {bangeItems.map(item => (
            <div key={item.key} className="checkbox-group">
              <input 
                type="checkbox" 
                className="checkbox w-5 h-5 mt-1" 
                id={item.key}
                checked={getNestedValue(formData, `stap3_groei.${item.key}`) || false}
                onChange={(e) => handleInputChange(`stap3_groei.${item.key}`, e.target.checked)}
              />
              <div>
                <label htmlFor={item.key} className="checkbox-label font-medium cursor-pointer">{item.label}</label>
                <div className="checkbox-description text-sm text-gray-600">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
        {completedChecks === 5 && (
          <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
            <p className="text-green-800 font-medium text-sm">
              ✅ Geweldig! Je ontwikkelwens scoort vol op de BANGE-check.
            </p>
          </div>
        )}
      </div>

      <div className="form-group mb-6">
        <label className="form-label block text-sm font-medium text-gray-700 mb-2">
          Waarom wil je dit écht veranderen? (Intrinsieke motivatie)
        </label>
        <textarea 
          className="form-textarea" 
          rows={4} 
          value={getNestedValue(formData, 'stap3_groei.motivatie')}
          onChange={(e) => handleInputChange('stap3_groei.motivatie', e.target.value)}
          placeholder="Beschrijf je dieperliggende motivatie..."
        />
      </div>

      <div className="info-box green">
        <h3>📝 Gestructureerde formulering</h3>
        <p className="mb-3">Formuleer je ontwikkelwens volgens dit format:</p>
        <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
          <p className="italic text-gray-700">
            "Ik wil beter worden in [beschrijf je vaardigheid] omdat [beschrijf hier je belangrijkste motivatie]"
          </p>
        </div>
      </div>
    </>
  )
}