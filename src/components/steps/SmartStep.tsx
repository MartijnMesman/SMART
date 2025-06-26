'use client'

import React from 'react'

interface StepProps {
  formData: any;
  updateFormData: (path: string, value: any) => void;
  getNestedValue: (obj: any, path: string) => any;
}

export default function SmartStep({ formData, updateFormData, getNestedValue }: StepProps) {
  const handleInputChange = (path: string, value: any) => {
    updateFormData(path, value);
  };

  const smartCriteria = [
    { key: 'specifiek', label: 'Specifiek', icon: '📍', question: 'Wat wil je concreet verbeteren?' },
    { key: 'meetbaar', label: 'Meetbaar', icon: '📊', question: 'Hoe bewijs je dat je het bereikt hebt?' },
    { key: 'acceptabel', label: 'Acceptabel', icon: '✅', question: 'Is het mogelijk en waardevol?' },
    { key: 'realistisch', label: 'Realistisch', icon: '🎯', question: 'Is het haalbaar en uitdagend?' },
    { key: 'tijdgebonden', label: 'Tijdgebonden', icon: '⏰', question: 'Wanneer wil je het bereikt hebben?' }
  ];

  const completedCriteria = smartCriteria.filter(criteria => 
    getNestedValue(formData, `stap4_smart.${criteria.key}`) && 
    getNestedValue(formData, `stap4_smart.smartChecklist.${criteria.key}`)
  ).length;

  return (
    <>
      <h2 className="step-title">Stap 4: Formuleren van een SMART leerdoel</h2>
      
      <div className="info-box blue">
        <h3>Van wens naar SMART leerdoel</h3>
        <p>Nu gaan we je ontwikkelwens omzetten in een concreet, meetbaar en tijdgebonden leerdoel.</p>
      </div>

      {smartCriteria.map(criteria => (
        <div key={criteria.key} className="card">
          <div className="flex justify-between items-center mb-2">
            <label className="form-label block text-sm font-medium text-gray-700">
              {criteria.icon} {criteria.label}
            </label>
            <input 
              type="checkbox" 
              className="checkbox w-5 h-5"
              checked={getNestedValue(formData, `stap4_smart.smartChecklist.${criteria.key}`) || false}
              onChange={(e) => handleInputChange(`stap4_smart.smartChecklist.${criteria.key}`, e.target.checked)}
            />
          </div>
          <p className="text-sm text-gray-600 mb-2">{criteria.question}</p>
          <textarea 
            className="form-textarea" 
            rows={2} 
            value={getNestedValue(formData, `stap4_smart.${criteria.key}`)}
            onChange={(e) => handleInputChange(`stap4_smart.${criteria.key}`, e.target.value)}
            placeholder={`Beschrijf het ${criteria.label.toLowerCase()} aspect...`}
          />
        </div>
      ))}

      <div className="info-box yellow">
        <h3>📋 SMART Checklist ({completedCriteria}/5 voltooid)</h3>
        <div className="flex gap-2 mt-3">
          {smartCriteria.map(criteria => (
            <div 
              key={criteria.key}
              className={`smart-circle ${getNestedValue(formData, `stap4_smart.smartChecklist.${criteria.key}`) ? 'complete' : 'incomplete'}`}
            >
              {criteria.label[0]}
            </div>
          ))}
        </div>
      </div>

      <div className="form-group mb-6">
        <label className="form-label block text-sm font-medium text-gray-700 mb-2">
          Formuleer nu je complete SMART leerdoel
        </label>
        <textarea 
          className="form-textarea" 
          rows={4} 
          value={getNestedValue(formData, 'stap4_smart.leerdoel')}
          onChange={(e) => handleInputChange('stap4_smart.leerdoel', e.target.value)}
          placeholder="Formuleer je volledige SMART leerdoel..."
        />
      </div>

      <div className="info-box green">
        <h3>📝 Voorbeeld format</h3>
        <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
          <p className="italic text-gray-700 text-sm">
            "Ik kan voor [datum] in [situatie] [concrete vaardigheid] zodat [meetbaar resultaat], omdat [motivatie]"
          </p>
        </div>
      </div>

      {completedCriteria === 5 && getNestedValue(formData, 'stap4_smart.leerdoel') && (
        <div className="bg-green-100 border border-green-300 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✅</span>
            <h4 className="font-semibold text-green-800">SMART leerdoel compleet!</h4>
          </div>
          <p className="text-green-800 text-sm mt-1">
            Je hebt alle SMART-criteria ingevuld en een volledig leerdoel geformuleerd.
          </p>
        </div>
      )}
    </>
  )
}