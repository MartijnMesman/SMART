'use client'

import React from 'react'

interface StepProps {
  formData: any;
  updateFormData: (path: string, value: any) => void;
  getNestedValue: (obj: any, path: string) => any;
}

export default function BewustwordingStep({ formData, updateFormData, getNestedValue }: StepProps) {
  const handleInputChange = (path: string, value: any) => {
    updateFormData(path, value);
  };

  return (
    <>
      <h2 className="step-title">Stap 1: Bewust worden van lastige situaties</h2>
      
      <div className="info-box blue">
        <h3>Wat gaan we doen?</h3>
        <p>We beginnen met het herkennen van situaties die je uitdagend vindt. Dit geeft inzicht 
        in waar je kunt groeien en vormt de basis voor je leerdoel.</p>
      </div>

      <div className="form-group mb-6">
        <label className="form-label block text-sm font-medium text-gray-700 mb-2">
          Wat vind je op dit moment lastig? (in school, vriendschappen of op je werk)
        </label>
        <textarea 
          className="form-textarea" 
          rows={4} 
          value={getNestedValue(formData, 'stap1_bewustwording.lastigeSituatie')}
          onChange={(e) => handleInputChange('stap1_bewustwording.lastigeSituatie', e.target.value)}
          placeholder="Beschrijf een concrete situatie die je uitdagend vindt..."
        />
      </div>

      <div className="form-group mb-6">
        <label className="form-label block text-sm font-medium text-gray-700 mb-2">
          Wat voor gevoel roept dit op? (bijv. stress, twijfel, frustratie)
        </label>
        <textarea 
          className="form-textarea" 
          rows={3} 
          value={getNestedValue(formData, 'stap1_bewustwording.gevoel')}
          onChange={(e) => handleInputChange('stap1_bewustwording.gevoel', e.target.value)}
          placeholder="Beschrijf het gevoel dat deze situatie bij je oproept..."
        />
      </div>

      <div className="info-box green">
        <h3>📝 Gestructureerde formulering</h3>
        <div className="bg-white p-4 rounded-lg border-l-4 border-green-500 mt-3">
          <p className="italic text-gray-700">
            "Ik merk dat ik het moeilijk heb in [beschrijf de situatie] en voel me daarin [beschrijf het gevoel]"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="info-box yellow">
          <h3>Voorbeelden situaties</h3>
          <ul className="text-sm mt-2 space-y-1">
            <li>• Grenzen aangeven</li>
            <li>• Leiding geven</li>
            <li>• Gestructureerd werken</li>
            <li>• Presenteren</li>
          </ul>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg">
          <h4 className="font-semibold text-orange-800 mb-2">Mogelijke gevoelens</h4>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>• Stress, spanning</li>
            <li>• Onzekerheid, twijfel</li>
            <li>• Frustratie, ergernis</li>
            <li>• Angst, nervositeit</li>
          </ul>
        </div>
        
        <div className="info-box purple">
          <h3>💡 Tips</h3>
          <ul className="text-sm mt-2 space-y-1">
            <li>• Wees specifiek</li>
            <li>• Denk aan recente situaties</li>
            <li>• Beschrijf je eigen rol</li>
          </ul>
        </div>
      </div>
    </>
  )
}