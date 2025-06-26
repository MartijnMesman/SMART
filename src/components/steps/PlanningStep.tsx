'use client'

import React from 'react'

interface StepProps {
  formData: any;
  updateFormData: (path: string, value: any) => void;
  getNestedValue: (obj: any, path: string) => any;
  updatePlanningItem: (category: string, index: number, value: string) => void;
  addPlanningItem: (category: string) => void;
  removePlanningItem: (category: string, index: number) => void;
}

export default function PlanningStep({ 
  formData, 
  updateFormData, 
  getNestedValue, 
  updatePlanningItem, 
  addPlanningItem, 
  removePlanningItem 
}: StepProps) {
  const categories = [
    { key: 'agendaItems', label: 'Agenda Items', icon: '📅', placeholder: 'Bijv. Elke maandag 09:00 oefen ik' },
    { key: 'cues', label: 'Cues (herinneringen)', icon: '🔔', placeholder: 'Bijv. Notitie op laptop' },
    { key: 'beloningen', label: 'Beloningen', icon: '⭐', placeholder: 'Bijv. Na 3 keer mezelf trakteren' }
  ];

  return (
    <>
      <h2 className="step-title">Stap 8: Plannen van de uitvoering</h2>
      
      <div className="info-box blue">
        <h3>Van plan naar gewoonte</h3>
        <p>Hoe ga je je acties inbedden in je dagelijkse leven? Door concrete planning, cues en beloningen in te stellen, maak je van je leerdoel een gewoonte.</p>
      </div>

      {categories.map(category => {
        const items = formData.stap8_planning[category.key] || [];
        return (
          <div key={category.key} className="card">
            <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              {category.icon} {category.label}
            </h4>
            
            <div className="space-y-2 mb-4">
              {items.map((item: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <input 
                    type="text" 
                    className="form-input flex-1" 
                    value={item}
                    onChange={(e) => updatePlanningItem(category.key, index, e.target.value)}
                    placeholder={category.placeholder}
                  />
                  <button 
                    className="btn btn-danger"
                    onClick={() => removePlanningItem(category.key, index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            
            <button 
              className="btn btn-dashed w-full"
              onClick={() => addPlanningItem(category.key)}
            >
              + {category.label} toevoegen
            </button>
          </div>
        );
      })}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="info-box yellow">
          <h3>📅 Planning tips</h3>
          <ul className="text-sm mt-2 space-y-1">
            <li>• Koppel aan bestaande gewoontes</li>
            <li>• Plan specifieke tijden en plekken</li>
            <li>• Start met kleine, haalbare stappen</li>
            <li>• Maak het visueel zichtbaar</li>
          </ul>
        </div>
        
        <div className="info-box green">
          <h3>🎯 Effectieve cues</h3>
          <ul className="text-sm mt-2 space-y-1">
            <li>• Visuele herinneringen (post-its)</li>
            <li>• Telefoon notificaties</li>
            <li>• Voorwerpen op een vaste plek</li>
            <li>• Koppeling aan bestaande routine</li>
          </ul>
        </div>
      </div>
    </>
  )
}