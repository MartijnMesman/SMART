'use client'

import React from 'react'

interface StepProps {
  formData: any;
  updateFormData: (path: string, value: any) => void;
  getNestedValue: (obj: any, path: string) => any;
  exportAsText: () => void;
  exportAsMarkdown: () => void;
  saveProgress: () => void;
}

export default function OverzichtStep({ 
  formData, 
  updateFormData, 
  getNestedValue, 
  exportAsText, 
  exportAsMarkdown, 
  saveProgress 
}: StepProps) {
  const completedSteps = [
    formData.stap1_bewustwording.lastigeSituatie && formData.stap1_bewustwording.gevoel,
    formData.stap2_eigenschap.reactie && formData.stap2_eigenschap.kernkwaliteit,
    formData.stap3_groei.ontwikkelwens && formData.stap3_groei.motivatie,
    formData.stap4_smart.leerdoel,
    formData.stap5_startpunt.waaromNietNul,
    formData.stap6_acties.length > 0 && formData.stap6_acties[0].actie,
    formData.stap7_obstakels.length > 0 && formData.stap7_obstakels[0].obstakel,
    Object.values(formData.stap8_planning).some((arr: any) => arr && arr.length > 0),
    formData.stap9_reflectie.eigenGemaakt || formData.stap9_reflectie.nieuweUitdaging
  ].filter(Boolean).length;

  const bangeScore = Object.values(formData.stap3_groei).filter(v => v === true).length;

  return (
    <>
      <h2 className="step-title">Overzicht & Export</h2>
      
      <div className="info-box green">
        <h3>🎉 Gefeliciteerd!</h3>
        <p>Je hebt {completedSteps} van de 9 stappen voltooid en je SMART leerdoel succesvol ontwikkeld. 
        Hieronder zie je een overzicht dat je kunt exporteren en delen.</p>
      </div>

      <div className="bg-white border-2 border-purple-300 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-bold text-purple-800 mb-4">📋 Voortgang</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{completedSteps}/9</div>
            <div className="text-sm text-blue-600">Stappen voltooid</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{Math.round((completedSteps/9)*100)}%</div>
            <div className="text-sm text-green-600">Compleet</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{formData.stap6_acties.length}</div>
            <div className="text-sm text-purple-600">Acties gepland</div>
          </div>
        </div>
      </div>

      {formData.stap4_smart.leerdoel && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-purple-800 mb-4">🎯 Jouw SMART Leerdoel</h3>
          <div className="bg-white p-4 rounded-lg border-l-4 border-purple-600">
            <p className="text-gray-900 font-medium text-lg">{formData.stap4_smart.leerdoel}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-3">🧠 Kerngegevens</h4>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Naam:</strong> {formData.algemeneInfo.naam || 'Niet ingevuld'}</p>
            <p><strong>Kernkwaliteit:</strong> {formData.stap2_eigenschap.kernkwaliteit || 'Niet ingevuld'}</p>
            <p><strong>Huidige score:</strong> {formData.stap5_startpunt.huidigeScore}/10</p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-3">📊 Planning</h4>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Acties:</strong> {formData.stap6_acties.length} gepland</p>
            <p><strong>Obstakels:</strong> {formData.stap7_obstakels.length} geïdentificeerd</p>
            <p><strong>BANGE-score:</strong> {bangeScore}/5</p>
          </div>
        </div>
      </div>

      <div className="info-box blue">
        <h3>📥 Export je leerdoel</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <button className="btn btn-primary" onClick={exportAsText}>
            📄 Download als .txt
          </button>
          
          <button className="btn btn-success" onClick={exportAsMarkdown}>
            📝 Download als .md
          </button>
          
          <button className="btn btn-primary" onClick={saveProgress}>
            💾 Opslaan als .json
          </button>
        </div>
      </div>

      <div className="info-box yellow">
        <h3>👥 Delen & Feedback</h3>
        <p className="mb-4">Deel je leerdoel met medestudenten, docenten of mentoren voor feedback en ondersteuning.</p>
        <div className="flex gap-2 flex-wrap">
          <button className="btn btn-secondary">🔗 Deel voor feedback</button>
          <button className="btn btn-secondary">👥 Zoek studiebuddy</button>
        </div>
      </div>

      <div className="info-box purple">
        <h3>🚀 Volgende stappen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <ul className="text-sm space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✅</span> Deel je leerdoel met je docent/mentor
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✅</span> Begin met je eerste STARTactie
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✅</span> Plan evaluatiemomenten in je agenda
            </li>
          </ul>
          <ul className="text-sm space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✅</span> Zoek een studiebuddy voor motivatie
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✅</span> Start een reflectiedagboek
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✅</span> Stel herinneringen in voor acties
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg text-center">
        <h4 className="font-semibold text-gray-700 mb-2">💬 Hulp nodig?</h4>
        <p className="text-gray-600 text-sm mb-3">
          Voor vragen over deze tool of ondersteuning bij je leerdoel kun je contact opnemen:
        </p>
        <p className="text-pink-600 font-semibold">Jouw docent of studieloopbaanbegeleider</p>
        <p className="text-gray-600 text-xs mt-2">
          Ontwikkeld door inholland hogeschool
        </p>
      </div>
    </>
  )
}