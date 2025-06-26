'use client'

import React from 'react'

interface StepProps {
  formData: any;
  updateFormData: (path: string, value: any) => void;
  getNestedValue: (obj: any, path: string) => any;
  updateObstakel: (index: number, field: string, value: string) => void;
  addObstakel: () => void;
  removeObstakel: (index: number) => void;
}

export default function ObstakelsStep({ 
  formData, 
  updateFormData, 
  getNestedValue, 
  updateObstakel, 
  addObstakel, 
  removeObstakel 
}: StepProps) {
  return (
    <>
      <h2 className="step-title">Stap 7: Herkennen van obstakels</h2>
      
      <div className="info-box blue">
        <h3>Anticiperen op belemmeringen</h3>
        <p>Welke obstakels zou je kunnen tegenkomen en hoe ga je ermee om? Denk in als-dan scenario's.</p>
      </div>
      
      <div className="space-y-4 mb-6">
        {formData.stap7_obstakels.map((item: any, index: number) => (
          <div key={index} className="card">
            <div className="flex justify-between items-center mb-4">
              <div className="font-medium text-gray-700">Obstakel {index + 1}</div>
              {index > 0 && (
                <button 
                  className="btn btn-danger"
                  onClick={() => removeObstakel(index)}
                >
                  ✕
                </button>
              )}
            </div>
            <div className="mb-4">
              <label className="form-label block text-sm font-medium text-gray-700 mb-2">
                Wat kan je tegenhouden?
              </label>
              <textarea 
                className="form-textarea" 
                rows={2}
                value={item.obstakel}
                onChange={(e) => updateObstakel(index, 'obstakel', e.target.value)}
                placeholder="Beschrijf een mogelijk obstakel..."
              />
            </div>
            <div>
              <label className="form-label block text-sm font-medium text-gray-700 mb-2">
                Als-dan plan
              </label>
              <textarea 
                className="form-textarea border-orange-300" 
                rows={2}
                value={item.alsDanPlan}
                onChange={(e) => updateObstakel(index, 'alsDanPlan', e.target.value)}
                placeholder="Als [obstakel], dan [oplossing]..."
              />
            </div>
          </div>
        ))}
      </div>
      
      <button 
        className="btn btn-dashed w-full mb-8 border-orange-300 text-orange-800"
        onClick={addObstakel}
      >
        🛡️ Obstakel toevoegen
      </button>

      <div className="info-box yellow">
        <h3>📝 Gestructureerde formulering</h3>
        <p className="mb-3">Gebruik dit format voor je als-dan plannen:</p>
        <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-500">
          <p className="italic text-gray-700">
            "De reden dat ik dit niet ga doen is [vul in]. Een manier om te zorgen dat ik het toch doe is [vul in]"
          </p>
        </div>
      </div>
    </>
  )
}