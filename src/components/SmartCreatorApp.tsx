'use client'

import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react'

// Import UI components
import Header from './ui/Header'
import ProgressBar from './ui/ProgressBar'
import StepNavigation from './ui/StepNavigation'
import FooterNavigation from './ui/FooterNavigation'
import SuccessMessage from './ui/SuccessMessage'
import PrivacyBanner from './ui/PrivacyBanner'
import PrivacyControls from './ui/PrivacyControls'
import SecurityStatus from './ui/SecurityStatus'

// Import hooks
import { useFormData } from '../hooks/useFormData'
import { useSecureAutoSave } from '../hooks/useSecureAutoSave'
import { useExport } from '../hooks/useExport'

// Import security utilities
import { SessionManager, PrivacyManager, InputSanitizer } from '../utils/security'

// Import constants
import { steps } from '../constants/steps'

// Lazy load step components for better performance
const StartStep = lazy(() => import('./steps/StartStep'))
const InfoStep = lazy(() => import('./steps/InfoStep'))
const BewustwordingStep = lazy(() => import('./steps/BewustwordingStep'))
const EigenschapStep = lazy(() => import('./steps/EigenschapStep'))
const GroeiStep = lazy(() => import('./steps/GroeiStep'))
const SmartStep = lazy(() => import('./steps/SmartStep'))
const StartpuntStep = lazy(() => import('./steps/StartpuntStep'))
const ActiesStep = lazy(() => import('./steps/ActiesStep'))
const ObstakelsStep = lazy(() => import('./steps/ObstakelsStep'))
const PlanningStep = lazy(() => import('./steps/PlanningStep'))
const ReflectieStep = lazy(() => import('./steps/ReflectieStep'))
const OverzichtStep = lazy(() => import('./steps/OverzichtStep'))

// Loading component for Suspense
const StepLoader = () => (
  <div className="flex items-center justify-center py-12">
    <div className="flex items-center space-x-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      <span className="text-gray-600">Stap wordt geladen...</span>
    </div>
  </div>
)

export default function SmartCreatorApp() {
    const [currentStep, setCurrentStep] = useState(0)
    const [hasPrivacyConsent, setHasPrivacyConsent] = useState(false)
    const successMessageRef = useRef<HTMLDivElement>(null)

    // Use custom hooks
    const {
        formData,
        setFormData,
        updateFormData,
        getNestedValue,
        addActie,
        removeActie,
        updateObstakel,
        addObstakel,
        removeObstakel,
        updatePlanningItem,
        addPlanningItem,
        removePlanningItem
    } = useFormData()

    const { saveStatus, autoSave, loadAutoSave, isSessionValid } = useSecureAutoSave(formData, currentStep)
    const { exportAsText, exportAsMarkdown, saveProgress } = useExport(formData, currentStep)

    // Initialize security and privacy on mount
    useEffect(() => {
        // Check privacy consent
        const consent = PrivacyManager.hasConsent()
        setHasPrivacyConsent(consent)

        // Initialize session if consent is given
        if (consent && !SessionManager.validateSession()) {
            SessionManager.createSession()
        }

        // Load auto-saved data if consent is given
        if (consent) {
            const savedData = loadAutoSave()
            if (savedData) {
                setFormData(savedData.formData)
                setCurrentStep(savedData.currentStep)
            }
        }
    }, [loadAutoSave, setFormData])

    // Enhanced updateFormData with input sanitization
    const secureUpdateFormData = useCallback((path: string, value: any) => {
        let sanitizedValue = value

        // Sanitize string inputs
        if (typeof value === 'string') {
            sanitizedValue = InputSanitizer.sanitizeText(value)
        }

        updateFormData(path, sanitizedValue)
        
        // Auto-save if privacy consent is given
        if (hasPrivacyConsent) {
            autoSave()
        }
    }, [updateFormData, autoSave, hasPrivacyConsent])

    // Navigation functions with useCallback for performance
    const goToStep = useCallback((step: number) => {
        setCurrentStep(step)
        if (hasPrivacyConsent) {
            autoSave()
        }
    }, [autoSave, hasPrivacyConsent])

    const nextStep = useCallback(() => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1)
            if (hasPrivacyConsent) {
                autoSave()
            }
        }
    }, [currentStep, autoSave, hasPrivacyConsent])

    const previousStep = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
            if (hasPrivacyConsent) {
                autoSave()
            }
        }
    }, [currentStep, autoSave, hasPrivacyConsent])

    // File operations with useCallback and security validation
    const handleSaveProgress = useCallback(() => {
        if (!hasPrivacyConsent) {
            alert('⚠️ Privacy toestemming vereist voor het opslaan van gegevens.')
            return
        }

        if (!isSessionValid) {
            alert('⚠️ Sessie is verlopen. Vernieuw de pagina en probeer opnieuw.')
            return
        }

        saveProgress()
        showSuccessMessage()
    }, [saveProgress, hasPrivacyConsent, isSessionValid])

    const loadProgress = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if (!hasPrivacyConsent) {
            alert('⚠️ Privacy toestemming vereist voor het laden van gegevens.')
            return
        }

        const file = event.target.files?.[0]
        if (file) {
            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('❌ Bestand is te groot. Maximum grootte is 10MB.')
                return
            }

            // Validate file type
            if (!file.name.endsWith('.json')) {
                alert('❌ Alleen JSON bestanden zijn toegestaan.')
                return
            }

            const reader = new FileReader()
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target?.result as string)
                    
                    // Validate data structure
                    if (!data.formData || data.currentStep === undefined) {
                        throw new Error('Invalid file format')
                    }

                    // Sanitize loaded data
                    const sanitizedData = sanitizeFormData(data.formData)
                    
                    setFormData(sanitizedData)
                    setCurrentStep(data.currentStep)
                    showSuccessMessage()
                } catch (error) {
                    console.error('Load error:', error)
                    alert('❌ Fout bij het laden van het bestand. Controleer of het een geldig SMART Leerdoel bestand is.')
                }
            }
            reader.onerror = () => {
                alert('❌ Fout bij het lezen van het bestand.')
            }
            reader.readAsText(file)
        }
    }, [setFormData, hasPrivacyConsent])

    const showSuccessMessage = useCallback(() => {
        if (successMessageRef.current) {
            successMessageRef.current.style.display = 'block'
            setTimeout(() => {
                if (successMessageRef.current) {
                    successMessageRef.current.style.display = 'none'
                }
            }, 3000)
        }
    }, [])

    // Handle privacy consent changes
    const handleConsentChange = useCallback((consent: boolean) => {
        setHasPrivacyConsent(consent)
        
        if (consent) {
            // Initialize session when consent is given
            if (!SessionManager.validateSession()) {
                SessionManager.createSession()
            }
        } else {
            // Clear data when consent is revoked
            SessionManager.destroySession()
            setFormData({} as any) // Reset form data
            setCurrentStep(0)
        }
    }, [setFormData])

    // Memoized step props to prevent unnecessary re-renders
    const stepProps = useCallback(() => ({
        formData,
        updateFormData: secureUpdateFormData,
        getNestedValue,
        addActie, 
        removeActie,
        updateObstakel, 
        addObstakel, 
        removeObstakel,
        updatePlanningItem, 
        addPlanningItem, 
        removePlanningItem,
        exportAsText, 
        exportAsMarkdown, 
        saveProgress: handleSaveProgress
    }), [
        formData,
        secureUpdateFormData,
        getNestedValue,
        addActie,
        removeActie,
        updateObstakel,
        addObstakel,
        removeObstakel,
        updatePlanningItem,
        addPlanningItem,
        removePlanningItem,
        exportAsText,
        exportAsMarkdown,
        handleSaveProgress
    ])

    const renderStepContent = useCallback(() => {
        // Don't render content if no privacy consent
        if (!hasPrivacyConsent) {
            return (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔒</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Privacy Toestemming Vereist</h3>
                    <p className="text-gray-600">
                        Geef toestemming voor gegevensbescherming om de applicatie te gebruiken.
                    </p>
                </div>
            )
        }

        const props = stepProps()

        switch (steps[currentStep].id) {
            case 'start': return <StartStep {...props} />
            case 'info': return <InfoStep {...props} />
            case 'bewustwording': return <BewustwordingStep {...props} />
            case 'eigenschap': return <EigenschapStep {...props} />
            case 'groei': return <GroeiStep {...props} />
            case 'smart': return <SmartStep {...props} />
            case 'startpunt': return <StartpuntStep {...props} />
            case 'acties': return <ActiesStep {...props} />
            case 'obstakels': return <ObstakelsStep {...props} />
            case 'planning': return <PlanningStep {...props} />
            case 'reflectie': return <ReflectieStep {...props} />
            case 'overzicht': return <OverzichtStep {...props} />
            default: return <div>Stap niet gevonden</div>
        }
    }, [currentStep, stepProps, hasPrivacyConsent])

    return (
        <div className="font-sans leading-relaxed text-gray-700 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
            <Header 
                saveStatus={saveStatus} 
                securityStatus={<SecurityStatus isSessionValid={isSessionValid} saveStatus={saveStatus} />}
            />
            <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
            <StepNavigation 
                steps={steps} 
                currentStep={currentStep} 
                onStepClick={goToStep}
                disabled={!hasPrivacyConsent}
            />

            {/* Main Content with Suspense for lazy loading */}
            <div className="max-w-screen-lg mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div id="step-content">
                        <Suspense fallback={<StepLoader />}>
                            {renderStepContent()}
                        </Suspense>
                    </div>
                </div>
            </div>

            <FooterNavigation
                currentStep={currentStep}
                totalSteps={steps.length}
                onPrevious={previousStep}
                onNext={nextStep}
                onSave={handleSaveProgress}
                onLoad={loadProgress}
                disabled={!hasPrivacyConsent}
            />

            <SuccessMessage ref={successMessageRef} />
            <PrivacyBanner onConsentChange={handleConsentChange} />
            {hasPrivacyConsent && <PrivacyControls />}
        </div>
    )
}

/**
 * Sanitize form data recursively
 */
function sanitizeFormData(data: any): any {
    if (typeof data === 'string') {
        return InputSanitizer.sanitizeText(data)
    }
    
    if (Array.isArray(data)) {
        return data.map(item => sanitizeFormData(item))
    }
    
    if (typeof data === 'object' && data !== null) {
        const sanitized: any = {}
        for (const [key, value] of Object.entries(data)) {
            sanitized[key] = sanitizeFormData(value)
        }
        return sanitized
    }
    
    return data
}