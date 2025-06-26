'use client'

import React from 'react'

interface StepProps {
  formData: any;
  updateFormData: (path: string, value: any) => void;
  getNestedValue: (obj: any, path: string) => any;
}

export default function ReflectieStep({ formData, updateFormData, getNestedValue }: StepProps) {
  const handleInputChange = (path: string, value: any) => {
    updateFormData(path, value);
  };

  return (
    <>
      <h2 className="step-title">Stap 9: Reflecteren en vernieuwen</h2>
      
      <div className="info-box blue">
        <h3>Continue ontwikkeling</h3>
        <p>Hoe ga je reflecteren op je ontwikkeling en jezelf blijven uitdagen? Zo blijf je in ontwikkeling en in 'flow' (Csikszentmihalyi).</p>
      </div>

      <div className="form-group mb-6">
        <label className="form-label block text-sm font-medium text-gray-700 mb-2">
          Heb je je de eigenschap eigen gemaakt?
        </label>
        <textarea 
          className="form-textarea" 
          rows={4} 
          value={getNestedValue(formData, 'stap9_reflectie.eigenGemaakt')}
          onChange={(e) => handleInputChange('stap9_reflectie.eigenGemaakt', e.target.value)}
          placeholder="Reflecteer op je ontwikkeling. Voel je dat je de eigenschap hebt geïntegreerd in je gedrag?"
        />
      </div>

      <div className="form-group mb-6">
        <label className="form-label block text-sm font-medium text-gray-700 mb-2">
          Kies een nieuwe lat om in de flow te blijven
        </label>
        <textarea 
          className="form-textarea" 
          rows={4} 
          value={getNestedValue(formData, 'stap9_reflectie.nieuweUitdaging')}
          onChange={(e) => handleInputChange('stap9_reflectie.nieuweUitdaging', e.target.value)}
          placeholder="Wat is je volgende ontwikkeluitdaging? Hoe ga je jezelf blijven uitdagen?"
        />
      </div>

      <div className="form-group mb-6">
        <label className="form-label block text-sm font-medium text-gray-700 mb-2">
          Vervolgontwikkeling
        </label>
        <textarea 
          className="form-textarea" 
          rows={3} 
          value={getNestedValue(formData, 'stap9_reflectie.vervolgOntwikkeling')}
          onChange={(e) => handleInputChange('stap9_reflectie.vervolgOntwikkeling', e.target.value)}
          placeholder="Hoe ga je jezelf blijven ontwikkelen? Welke gewoontes behoud je?"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="info-box green">
          <h3>🎯 Reflectievragen</h3>
          <ul className="text-sm mt-2 space-y-1">
            <li>• Wat heb je geleerd over jezelf?</li>
            <li>• Welke nieuwe kwaliteiten heb je ontdekt?</li>
            <li>• Hoe hebben anderen je ontwikkeling ervaren?</li>
            <li>• Wat zou je anders doen?</li>
          </ul>
        </div>
        
        <div className="info-box purple">
          <h3>🔄 Flow behouden</h3>
          <ul className="text-sm mt-2 space-y-1">
            <li>• Zoek een uitdaging die iets hoger ligt</li>
            <li>• Bouw voort op je huidige sterkte</li>
            <li>• Blijf experimenteren en leren</li>
            <li>• Deel je ontwikkeling met anderen</li>
          </ul>
        </div>
      </div>

      <div className="info-box yellow">
        <h3>💡 Het belang van continue ontwikkeling</h3>
        <p>Csikszentmihalyi's flow-theorie laat zien dat we ons beste prestaties leveren wanneer 
        de uitdaging en onze vaardigheden in balans zijn. Door steeds nieuwe uitdagingen te 
        zoeken die net iets hoger liggen dan ons huidige niveau, blijven we gemotiveerd en groeien.</p>
      </div>
    </>
  )
}