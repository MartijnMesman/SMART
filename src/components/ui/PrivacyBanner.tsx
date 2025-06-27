'use client'

import React, { useState, useEffect, memo } from 'react'
import { PrivacyManager } from '../../utils/security'

interface PrivacyBannerProps {
  onConsentChange?: (hasConsent: boolean) => void
}

const PrivacyBanner = memo(function PrivacyBanner({ onConsentChange }: PrivacyBannerProps) {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const hasConsent = PrivacyManager.hasConsent()
    setShowBanner(!hasConsent)
    onConsentChange?.(hasConsent)
  }, [onConsentChange])

  const handleAccept = () => {
    PrivacyManager.grantConsent(['functional', 'analytics'])
    setShowBanner(false)
    onConsentChange?.(true)
  }

  const handleDecline = () => {
    PrivacyManager.revokeConsent()
    setShowBanner(false)
    onConsentChange?.(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-purple-600 shadow-lg z-50">
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">🍪 Privacy & Gegevensbescherming</h3>
            <p className="text-sm text-gray-600 mb-2">
              Deze applicatie slaat je leerdoel-gegevens lokaal op je apparaat op voor een betere gebruikerservaring. 
              We respecteren je privacy en volgen de GDPR-richtlijnen.
            </p>
            
            {showDetails && (
              <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600 mb-3">
                <h4 className="font-medium mb-2">Wat we opslaan:</h4>
                <ul className="space-y-1">
                  <li>• <strong>Functionele gegevens:</strong> Je leerdoel-formulier voor auto-save functionaliteit</li>
                  <li>• <strong>Sessie-informatie:</strong> Beveiligde sessie-tokens voor veilig gebruik</li>
                  <li>• <strong>Privacy-voorkeuren:</strong> Je toestemming en privacy-instellingen</li>
                </ul>
                <h4 className="font-medium mt-3 mb-2">Je rechten:</h4>
                <ul className="space-y-1">
                  <li>• <strong>Inzage:</strong> Bekijk alle opgeslagen gegevens</li>
                  <li>• <strong>Correctie:</strong> Wijzig je gegevens op elk moment</li>
                  <li>• <strong>Verwijdering:</strong> Verwijder alle gegevens permanent</li>
                  <li>• <strong>Overdraagbaarheid:</strong> Exporteer je gegevens</li>
                </ul>
                <p className="mt-2">
                  <strong>Bewaartermijn:</strong> Gegevens worden automatisch verwijderd na 1 jaar inactiviteit.
                </p>
              </div>
            )}
            
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="text-purple-600 hover:text-purple-800 text-sm underline"
            >
              {showDetails ? 'Minder details' : 'Meer details over gegevensbescherming'}
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm transition-colors"
            >
              Weigeren
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg text-sm transition-colors"
            >
              Accepteren
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})

export default PrivacyBanner