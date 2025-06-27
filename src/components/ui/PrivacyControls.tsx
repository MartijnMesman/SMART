'use client'

import React, { useState, memo } from 'react'
import { PrivacyManager, DataEncryption } from '../../utils/security'

const PrivacyControls = memo(function PrivacyControls() {
  const [showControls, setShowControls] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  const handleExportData = async () => {
    setIsExporting(true)
    try {
      const userData = PrivacyManager.exportUserData()
      const blob = new Blob([userData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `SMART_Leerdoel_Data_Export_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      alert('✅ Je gegevens zijn succesvol geëxporteerd!')
    } catch (error) {
      console.error('Export failed:', error)
      alert('❌ Export mislukt. Probeer het opnieuw.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleClearAllData = () => {
    if (window.confirm(
      '⚠️ Weet je zeker dat je alle gegevens wilt verwijderen?\n\n' +
      'Dit omvat:\n' +
      '• Je leerdoel-formulier\n' +
      '• Auto-save gegevens\n' +
      '• Privacy-voorkeuren\n' +
      '• Sessie-informatie\n\n' +
      'Deze actie kan niet ongedaan worden gemaakt.'
    )) {
      setIsClearing(true)
      try {
        PrivacyManager.clearAllUserData()
        alert('✅ Alle gegevens zijn succesvol verwijderd!')
        // Reload page to reset application state
        window.location.reload()
      } catch (error) {
        console.error('Clear data failed:', error)
        alert('❌ Verwijderen mislukt. Probeer het opnieuw.')
      } finally {
        setIsClearing(false)
      }
    }
  }

  const handleRevokeConsent = () => {
    if (window.confirm(
      '⚠️ Weet je zeker dat je je toestemming wilt intrekken?\n\n' +
      'Dit zal alle gegevens verwijderen en de applicatie opnieuw opstarten.'
    )) {
      PrivacyManager.revokeConsent()
      alert('✅ Toestemming ingetrokken en gegevens verwijderd!')
      window.location.reload()
    }
  }

  const retentionInfo = PrivacyManager.getDataRetentionInfo()
  const dataAgeDays = retentionInfo.dataAge ? Math.floor(retentionInfo.dataAge / (1000 * 60 * 60 * 24)) : null

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {!showControls ? (
        <button
          onClick={() => setShowControls(true)}
          className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-colors"
          title="Privacy instellingen"
        >
          🔒
        </button>
      ) : (
        <div className="bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">🔒 Privacy Controles</h3>
            <button
              onClick={() => setShowControls(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Data retention info */}
            <div className="bg-blue-50 p-3 rounded-lg text-sm">
              <h4 className="font-medium text-blue-900 mb-1">📊 Gegevens Informatie</h4>
              <p className="text-blue-800">
                <strong>Bewaartermijn:</strong> {retentionInfo.retentionDays} dagen
              </p>
              {dataAgeDays !== null && (
                <p className="text-blue-800">
                  <strong>Leeftijd gegevens:</strong> {dataAgeDays} dagen
                </p>
              )}
            </div>

            {/* Export data */}
            <button
              onClick={handleExportData}
              disabled={isExporting}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Exporteren...
                </>
              ) : (
                <>📥 Exporteer Mijn Gegevens</>
              )}
            </button>

            {/* Clear all data */}
            <button
              onClick={handleClearAllData}
              disabled={isClearing}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
            >
              {isClearing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Verwijderen...
                </>
              ) : (
                <>🗑️ Verwijder Alle Gegevens</>
              )}
            </button>

            {/* Revoke consent */}
            <button
              onClick={handleRevokeConsent}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg text-sm transition-colors"
            >
              ❌ Trek Toestemming In
            </button>

            <div className="text-xs text-gray-600 pt-2 border-t">
              <p><strong>GDPR Rechten:</strong></p>
              <ul className="mt-1 space-y-1">
                <li>• Recht op inzage ✅</li>
                <li>• Recht op correctie ✅</li>
                <li>• Recht op verwijdering ✅</li>
                <li>• Recht op overdraagbaarheid ✅</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

export default PrivacyControls