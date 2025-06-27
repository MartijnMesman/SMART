// Security utilities for data protection and input sanitization
import CryptoJS from 'crypto-js'

// Environment-based encryption key (should be in .env in production)
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'smart-leerdoel-default-key-2024'

/**
 * Data Encryption utilities
 */
export class DataEncryption {
  private static key = ENCRYPTION_KEY

  /**
   * Encrypt sensitive data before storing
   */
  static encrypt(data: string): string {
    try {
      return CryptoJS.AES.encrypt(data, this.key).toString()
    } catch (error) {
      console.error('Encryption failed:', error)
      return data // Fallback to unencrypted if encryption fails
    }
  }

  /**
   * Decrypt sensitive data after retrieving
   */
  static decrypt(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.key)
      return bytes.toString(CryptoJS.enc.Utf8)
    } catch (error) {
      console.error('Decryption failed:', error)
      return encryptedData // Return as-is if decryption fails
    }
  }

  /**
   * Hash sensitive data for comparison (one-way)
   */
  static hash(data: string): string {
    return CryptoJS.SHA256(data).toString()
  }
}

/**
 * Input Sanitization utilities
 */
export class InputSanitizer {
  /**
   * Remove potentially dangerous HTML/script tags
   */
  static sanitizeHtml(input: string): string {
    if (typeof input !== 'string') return ''
    
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '') // Remove object tags
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '') // Remove embed tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim()
  }

  /**
   * Sanitize text input for safe storage and display
   */
  static sanitizeText(input: string): string {
    if (typeof input !== 'string') return ''
    
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript protocols
      .replace(/data:/gi, '') // Remove data protocols
      .trim()
      .substring(0, 10000) // Limit length to prevent DoS
  }

  /**
   * Validate and sanitize email addresses
   */
  static sanitizeEmail(email: string): string {
    if (typeof email !== 'string') return ''
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const sanitized = email.toLowerCase().trim()
    
    return emailRegex.test(sanitized) ? sanitized : ''
  }

  /**
   * Sanitize file names for safe storage
   */
  static sanitizeFileName(fileName: string): string {
    if (typeof fileName !== 'string') return 'untitled'
    
    return fileName
      .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars with underscore
      .replace(/_{2,}/g, '_') // Replace multiple underscores with single
      .substring(0, 255) // Limit length
      .trim()
  }
}

/**
 * Session Management utilities
 */
export class SessionManager {
  private static readonly SESSION_KEY = 'smart_leerdoel_session'
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes

  /**
   * Create a new session
   */
  static createSession(): string {
    const sessionId = this.generateSessionId()
    const sessionData = {
      id: sessionId,
      created: Date.now(),
      lastActivity: Date.now(),
      isActive: true
    }

    try {
      const encryptedSession = DataEncryption.encrypt(JSON.stringify(sessionData))
      localStorage.setItem(this.SESSION_KEY, encryptedSession)
      return sessionId
    } catch (error) {
      console.error('Failed to create session:', error)
      return ''
    }
  }

  /**
   * Validate current session
   */
  static validateSession(): boolean {
    try {
      const encryptedSession = localStorage.getItem(this.SESSION_KEY)
      if (!encryptedSession) return false

      const sessionData = JSON.parse(DataEncryption.decrypt(encryptedSession))
      const now = Date.now()

      // Check if session has expired
      if (now - sessionData.lastActivity > this.SESSION_TIMEOUT) {
        this.destroySession()
        return false
      }

      // Update last activity
      sessionData.lastActivity = now
      const updatedSession = DataEncryption.encrypt(JSON.stringify(sessionData))
      localStorage.setItem(this.SESSION_KEY, updatedSession)

      return sessionData.isActive
    } catch (error) {
      console.error('Session validation failed:', error)
      this.destroySession()
      return false
    }
  }

  /**
   * Destroy current session
   */
  static destroySession(): void {
    try {
      localStorage.removeItem(this.SESSION_KEY)
      // Clear other sensitive data
      localStorage.removeItem('smartLeerdoel_autosave')
    } catch (error) {
      console.error('Failed to destroy session:', error)
    }
  }

  /**
   * Get session info
   */
  static getSessionInfo(): { id: string; created: number; lastActivity: number } | null {
    try {
      const encryptedSession = localStorage.getItem(this.SESSION_KEY)
      if (!encryptedSession) return null

      const sessionData = JSON.parse(DataEncryption.decrypt(encryptedSession))
      return {
        id: sessionData.id,
        created: sessionData.created,
        lastActivity: sessionData.lastActivity
      }
    } catch (error) {
      console.error('Failed to get session info:', error)
      return null
    }
  }

  /**
   * Generate secure session ID
   */
  private static generateSessionId(): string {
    const timestamp = Date.now().toString()
    const random = Math.random().toString(36).substring(2)
    return DataEncryption.hash(timestamp + random).substring(0, 32)
  }
}

/**
 * Privacy utilities for GDPR compliance
 */
export class PrivacyManager {
  private static readonly CONSENT_KEY = 'smart_leerdoel_privacy_consent'
  private static readonly DATA_RETENTION_DAYS = 365 // 1 year

  /**
   * Check if user has given privacy consent
   */
  static hasConsent(): boolean {
    try {
      const consent = localStorage.getItem(this.CONSENT_KEY)
      if (!consent) return false

      const consentData = JSON.parse(consent)
      const now = Date.now()
      const consentAge = now - consentData.timestamp

      // Consent expires after 1 year
      if (consentAge > this.DATA_RETENTION_DAYS * 24 * 60 * 60 * 1000) {
        this.revokeConsent()
        return false
      }

      return consentData.granted === true
    } catch (error) {
      console.error('Failed to check consent:', error)
      return false
    }
  }

  /**
   * Grant privacy consent
   */
  static grantConsent(consentTypes: string[] = ['functional', 'analytics']): void {
    try {
      const consentData = {
        granted: true,
        timestamp: Date.now(),
        types: consentTypes,
        version: '1.0'
      }

      localStorage.setItem(this.CONSENT_KEY, JSON.stringify(consentData))
    } catch (error) {
      console.error('Failed to grant consent:', error)
    }
  }

  /**
   * Revoke privacy consent and clear data
   */
  static revokeConsent(): void {
    try {
      localStorage.removeItem(this.CONSENT_KEY)
      this.clearAllUserData()
    } catch (error) {
      console.error('Failed to revoke consent:', error)
    }
  }

  /**
   * Export all user data (GDPR right to data portability)
   */
  static exportUserData(): string {
    try {
      const userData = {
        formData: localStorage.getItem('smartLeerdoel_autosave'),
        consent: localStorage.getItem(this.CONSENT_KEY),
        session: localStorage.getItem('smart_leerdoel_session'),
        exportDate: new Date().toISOString(),
        dataRetentionDays: this.DATA_RETENTION_DAYS
      }

      return JSON.stringify(userData, null, 2)
    } catch (error) {
      console.error('Failed to export user data:', error)
      return JSON.stringify({ error: 'Export failed' })
    }
  }

  /**
   * Clear all user data (GDPR right to erasure)
   */
  static clearAllUserData(): void {
    try {
      const keysToRemove = [
        'smartLeerdoel_autosave',
        'smart_leerdoel_session',
        this.CONSENT_KEY
      ]

      keysToRemove.forEach(key => {
        localStorage.removeItem(key)
      })

      // Clear any other app-specific data
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('smart_leerdoel_') || key.startsWith('smartLeerdoel_')) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('Failed to clear user data:', error)
    }
  }

  /**
   * Get data retention info
   */
  static getDataRetentionInfo(): { retentionDays: number; dataAge: number | null } {
    try {
      const autosave = localStorage.getItem('smartLeerdoel_autosave')
      let dataAge = null

      if (autosave) {
        const data = JSON.parse(autosave)
        if (data.timestamp) {
          dataAge = Date.now() - new Date(data.timestamp).getTime()
        }
      }

      return {
        retentionDays: this.DATA_RETENTION_DAYS,
        dataAge
      }
    } catch (error) {
      console.error('Failed to get data retention info:', error)
      return { retentionDays: this.DATA_RETENTION_DAYS, dataAge: null }
    }
  }
}

/**
 * Security headers and CSP utilities
 */
export class SecurityHeaders {
  /**
   * Generate Content Security Policy
   */
  static generateCSP(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self'",
      "media-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'"
    ].join('; ')
  }

  /**
   * Validate origin for CSRF protection
   */
  static validateOrigin(origin: string, allowedOrigins: string[]): boolean {
    return allowedOrigins.includes(origin)
  }
}