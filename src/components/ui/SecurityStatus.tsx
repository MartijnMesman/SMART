'use client'

import React, { useState, useEffect, memo } from 'react'
import { SessionManager, PrivacyManager } from '../../utils/security'

interface SecurityStatusProps {
  isSessionValid: boolean
  saveStatus: string
}

const SecurityStatus = memo(function SecurityStatus({ isSessionValid, saveStatus }: SecurityStatusProps) {
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const info = SessionManager.getSessionInfo()
    setSessionInfo(info)
  }, [isSessionValid])

  const getStatusColor = () => {
    if (!isSessionValid) return 'text-red-600'
    if (saveStatus === 'FOUT') return 'text-orange-600'
    return 'text-green-600'
  }

  const getStatusIcon = () => {
    if (!isSessionValid) return '🔒'
    if (saveStatus === 'FOUT') return '⚠️'
    return '🔐'
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('nl-NL')
  }

  const getSessionAge = () => {
    if (!sessionInfo) return 'Onbekend'
    const age = Date.now() - sessionInfo.created
    const minutes = Math.floor(age / (1000 * 60))
    return `${minutes} minuten`
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center gap-2 text-xs ${getStatusColor()} hover:opacity-80 transition-opacity`}
        title="Beveiligingsstatus"
      >
        {getStatusIcon()}
        <span>
          {!isSessionValid ? 'Sessie verlopen' : 
           saveStatus === 'FOUT' ? 'Opslaan mislukt' : 
           'Beveiligd'}
        </span>
      </button>

      {showDetails && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 z-50">
          <h3 className="font-semibold text-gray-900 mb-3">🔐 Beveiligingsstatus</h3>
          
          <div className="space-y-3 text-sm">
            {/* Session Status */}
            <div className="flex justify-between">
              <span className="text-gray-600">Sessie:</span>
              <span className={isSessionValid ? 'text-green-600' : 'text-red-600'}>
                {isSessionValid ? '✅ Actief' : '❌ Verlopen'}
              </span>
            </div>

            {/* Save Status */}
            <div className="flex justify-between">
              <span className="text-gray-600">Auto-save:</span>
              <span className={saveStatus === 'AAN' ? 'text-green-600' : 'text-orange-600'}>
                {saveStatus === 'AAN' ? '✅ Actief' : `⚠️ ${saveStatus}`}
              </span>
            </div>

            {/* Encryption Status */}
            <div className="flex justify-between">
              <span className="text-gray-600">Versleuteling:</span>
              <span className="text-green-600">✅ Actief</span>
            </div>

            {/* Privacy Consent */}
            <div className="flex justify-between">
              <span className="text-gray-600">Privacy:</span>
              <span className={PrivacyManager.hasConsent() ? 'text-green-600' : 'text-orange-600'}>
                {PrivacyManager.hasConsent() ? '✅ Toestemming' : '⚠️ Geen toestemming'}
              </span>
            </div>

            {sessionInfo && (
              <>
                <hr className="border-gray-200" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sessie ID:</span>
                    <span className="text-gray-800 font-mono text-xs">
                      {sessionInfo.id.substring(0, 8)}...
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gestart:</span>
                    <span className="text-gray-800">{formatTime(sessionInfo.created)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Laatste activiteit:</span>
                    <span className="text-gray-800">{formatTime(sessionInfo.lastActivity)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sessie leeftijd:</span>
                    <span className="text-gray-800">{getSessionAge()}</span>
                  </div>
                </div>
              </>
            )}

            <hr className="border-gray-200" />
            <div className="text-xs text-gray-500">
              <p><strong>Beveiliging:</strong></p>
              <ul className="mt-1 space-y-1">
                <li>• AES-256 versleuteling</li>
                <li>• Sessie-gebaseerde toegang</li>
                <li>• Input sanitization</li>
                <li>• GDPR compliance</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

export default SecurityStatus