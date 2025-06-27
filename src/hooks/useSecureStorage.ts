'use client'

import { useState, useCallback, useEffect } from 'react'
import { DataEncryption, SessionManager, InputSanitizer } from '../utils/security'

interface SecureStorageOptions {
  encrypt?: boolean
  sanitize?: boolean
  sessionValidation?: boolean
}

export function useSecureStorage(key: string, options: SecureStorageOptions = {}) {
  const {
    encrypt = true,
    sanitize = true,
    sessionValidation = true
  } = options

  const [isSessionValid, setIsSessionValid] = useState(true)

  // Validate session on mount and periodically
  useEffect(() => {
    if (sessionValidation) {
      const validateSession = () => {
        const valid = SessionManager.validateSession()
        setIsSessionValid(valid)
        return valid
      }

      // Initial validation
      validateSession()

      // Periodic validation every 5 minutes
      const interval = setInterval(validateSession, 5 * 60 * 1000)

      return () => clearInterval(interval)
    }
  }, [sessionValidation])

  const setSecureItem = useCallback((value: any) => {
    try {
      if (sessionValidation && !isSessionValid) {
        console.warn('Session invalid, cannot store data')
        return false
      }

      let processedValue = value

      // Sanitize if it's a string and sanitization is enabled
      if (sanitize && typeof value === 'string') {
        processedValue = InputSanitizer.sanitizeText(value)
      } else if (sanitize && typeof value === 'object') {
        // Deep sanitize object properties
        processedValue = sanitizeObject(value)
      }

      const serializedValue = JSON.stringify(processedValue)

      // Encrypt if encryption is enabled
      const finalValue = encrypt 
        ? DataEncryption.encrypt(serializedValue)
        : serializedValue

      localStorage.setItem(key, finalValue)
      return true
    } catch (error) {
      console.error('Failed to store secure item:', error)
      return false
    }
  }, [key, encrypt, sanitize, sessionValidation, isSessionValid])

  const getSecureItem = useCallback(() => {
    try {
      if (sessionValidation && !isSessionValid) {
        console.warn('Session invalid, cannot retrieve data')
        return null
      }

      const storedValue = localStorage.getItem(key)
      if (!storedValue) return null

      // Decrypt if encryption was used
      const decryptedValue = encrypt 
        ? DataEncryption.decrypt(storedValue)
        : storedValue

      return JSON.parse(decryptedValue)
    } catch (error) {
      console.error('Failed to retrieve secure item:', error)
      return null
    }
  }, [key, encrypt, sessionValidation, isSessionValid])

  const removeSecureItem = useCallback(() => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Failed to remove secure item:', error)
      return false
    }
  }, [key])

  const clearSecureStorage = useCallback(() => {
    try {
      // Clear all app-related secure storage
      Object.keys(localStorage).forEach(storageKey => {
        if (storageKey.startsWith('smart_leerdoel_') || storageKey.startsWith('smartLeerdoel_')) {
          localStorage.removeItem(storageKey)
        }
      })
      return true
    } catch (error) {
      console.error('Failed to clear secure storage:', error)
      return false
    }
  }, [])

  return {
    setSecureItem,
    getSecureItem,
    removeSecureItem,
    clearSecureStorage,
    isSessionValid
  }
}

/**
 * Deep sanitize object properties
 */
function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) return obj
  
  if (typeof obj === 'string') {
    return InputSanitizer.sanitizeText(obj)
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item))
  }
  
  if (typeof obj === 'object') {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedKey = InputSanitizer.sanitizeText(key)
      sanitized[sanitizedKey] = sanitizeObject(value)
    }
    return sanitized
  }
  
  return obj
}