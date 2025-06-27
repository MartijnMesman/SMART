'use client'

import { useState } from 'react'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(true)

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-4 border-pink-600">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
              i
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SMART Leerdoel Creator</h1>
              <p className="text-sm text-pink-600 font-medium">inholland hogeschool</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="text-6xl mb-6">🎯</div>
            <h2 className="text-3xl font-bold text-purple-800 mb-6">Welkom bij de SMART Leerdoel Creator</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Deze tool begeleidt je door een 9-stappen methode om een effectief SMART leerdoel te formuleren voor je studie aan Hogeschool Inholland.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">👁️ Stappen 1-3: Zelfinzicht</h3>
                <ul className="text-left mt-2 space-y-1 text-sm">
                  <li>• Bewust worden van uitdagingen</li>
                  <li>• Kernkwaliteiten herkennen</li>
                  <li>• BANGE-check uitvoeren</li>
                </ul>
              </div>
              
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">🎯 Stappen 4-6: Doelstelling</h3>
                <ul className="text-left mt-2 space-y-1 text-sm">
                  <li>• SMART leerdoel formuleren</li>
                  <li>• Startpunt bepalen (0-10 schaal)</li>
                  <li>• Concrete acties plannen</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">📅 Stappen 7-9: Uitvoering</h3>
                <ul className="text-left mt-2 space-y-1 text-sm">
                  <li>• Obstakels anticiperen</li>
                  <li>• Planning & cues instellen</li>
                  <li>• Reflectie & vernieuwing</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg mb-8">
              <h3 className="font-semibold text-gray-800 mb-2">🎯 Waarom deze methode?</h3>
              <p className="text-gray-700">
                Deze 9-stappen aanpak is gebaseerd op bewezen coaching technieken en helpt je om 
                niet alleen een goed leerdoel te formuleren, maar ook om het daadwerkelijk te behalen.
              </p>
            </div>

            <div className="mt-8">
              <button 
                onClick={() => alert('Functionaliteit wordt binnenkort toegevoegd!')}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors text-lg font-medium"
              >
                🚀 Start met je SMART leerdoel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-screen-lg mx-auto px-4 py-4 text-center">
          <p className="text-gray-600 text-sm">
            💜 Ontwikkeld door Inholland Hogeschool voor effectieve leerdoel-ontwikkeling
          </p>
        </div>
      </div>
    </div>
  )
}