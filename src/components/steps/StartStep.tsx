'use client'

import React from 'react'

interface StepProps {
  formData: any;
  updateFormData: (path: string, value: any) => void;
  getNestedValue: (obj: any, path: string) => any;
}

export default function StartStep({ formData, updateFormData, getNestedValue }: StepProps) {
  return (
    <div className="text-center">
      <div className="hero-icon">🎯</div>
      <h2 className="step-title">Welkom bij de SMART Leerdoel Creator</h2>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        Deze tool begeleidt je door een 9-stappen methode om een effectief SMART leerdoel te formuleren voor je studie aan Hogeschool Inholland.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="info-box blue">
          <h3>👁️ Stappen 1-3: Zelfinzicht</h3>
          <ul className="text-left mt-2 space-y-1">
            <li>• Bewust worden van uitdagingen</li>
            <li>• Kernkwaliteiten herkennen</li>
            <li>• BANGE-check uitvoeren</li>
          </ul>
        </div>
        
        <div className="info-box green">
          <h3>🎯 Stappen 4-6: Doelstelling</h3>
          <ul className="text-left mt-2 space-y-1">
            <li>• SMART leerdoel formuleren</li>
            <li>• Startpunt bepalen (0-10 schaal)</li>
            <li>• Concrete acties plannen</li>
          </ul>
        </div>
        
        <div className="info-box purple">
          <h3>📅 Stappen 7-9: Uitvoering</h3>
          <ul className="text-left mt-2 space-y-1">
            <li>• Obstakels anticiperen</li>
            <li>• Planning & cues instellen</li>
            <li>• Reflectie & vernieuwing</li>
          </ul>
        </div>
      </div>
      
      <div className="info-box yellow">
        <h3>🎯 Waarom deze methode?</h3>
        <p>Deze 9-stappen aanpak is gebaseerd op bewezen coaching technieken en helpt je om 
        niet alleen een goed leerdoel te formuleren, maar ook om het daadwerkelijk te behalen.</p>
      </div>
    </div>
  )
}