'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { FormData } from './useFormData'
import { useSecureStorage } from './useSecureStorage'
import { SessionManager } from '../utils/security'

export function useSecureAutoSave(formData: FormData, currentStep: number) {
  const [saveStatus, setSaveStatus] = useState('AAN')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSaveRef = useRef<string>('')

  const { setSecureItem, getSecureItem, isSessionValid } = useSecureStorage('smartLeerdoel_autosave', {
    encrypt: true,
    sanitize: true,
    sessionValidation: true
  })

  // Initialize session on mount
  useEffect(() => {
    if (!SessionManager.validateSession()) {
      SessionManager.createSession()
    }
  }, [])

  const autoSave = useCallback(() => {
    try {
      if (!isSessionValid) {
        setSaveStatus('SESSIE VERLOPEN')
        return
      }

      const dataToSave = {
        formData,
        currentStep,
        timestamp: new Date().toISOString(),
        sessionId: SessionManager.getSessionInfo()?.id
      }

      const serializedData = JSON.stringify(dataToSave)

      // Only save if data has actually changed
      if (serializedData !== lastSaveRef.current) {
        const success = setSecureItem(dataToSave)
        
        if (success) {
          lastSaveRef.current = serializedData
          setSaveStatus('AAN')
        } else {
          setSaveStatus('FOUT')
        }
      }
    } catch (e) {
      console.error('Secure auto-save failed:', e)
      setSaveStatus('FOUT')
    }
  }, [formData, currentStep, setSecureItem, isSessionValid])

  // Debounced auto-save to prevent excessive saves
  const debouncedAutoSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      autoSave()
    }, 1000) // Save 1 second after last change
  }, [autoSave])

  // Auto-save with debouncing
  useEffect(() => {
    debouncedAutoSave()
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [debouncedAutoSave])

  // Periodic auto-save as backup
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isSessionValid) {
        autoSave()
      }
    }, 120000) // Auto-save every 2 minutes as backup

    return () => clearInterval(intervalId)
  }, [autoSave, isSessionValid])

  const loadAutoSave = useCallback(() => {
    try {
      if (!isSessionValid) {
        console.warn('Session invalid, cannot load auto-save data')
        return null
      }

      const saved = getSecureItem()
      if (saved && saved.formData && saved.currentStep !== undefined) {
        // Validate session ID if available
        const currentSession = SessionManager.getSessionInfo()
        if (saved.sessionId && currentSession && saved.sessionId !== currentSession.id) {
          console.warn('Session ID mismatch, data may be from different session')
        }

        lastSaveRef.current = JSON.stringify(saved)
        return saved
      }
    } catch (e) {
      console.error('Error loading secure auto-saved data:', e)
    }
    return null
  }, [getSecureItem, isSessionValid])

  // Monitor session validity
  useEffect(() => {
    if (!isSessionValid) {
      setSaveStatus('SESSIE VERLOPEN')
    }
  }, [isSessionValid])

  return {
    saveStatus,
    autoSave,
    loadAutoSave,
    isSessionValid
  }
}