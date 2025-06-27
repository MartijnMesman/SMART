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
import ErrorBoundary from './ui/ErrorBoundary'

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

// Error fallback for step loading
const StepErrorFallback = ({ error, retry }: { error: Error; retry: () => void }) => (
  <div className="text-center py-12">
    <div className="text-6xl mb-4">⚠️</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">Stap kan niet worden geladen</h3>
    <p className="text-gray-600 mb-4">Er is een probleem opgetreden bij het laden van deze stap.</p>
    <button
      onClick={retry}
      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
    >
      🔄 Probeer opnieuw
    </button>
  </div>
)

export default function SmartCreatorApp() {
    const [currentStep, setCurrentStep] = useState(0)
    const [hasPrivacyConsent, setHasPrivacyConsent] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)
    const [initError, setInitError] = useState<string | null>(null)
    const successMessageRef = useRef<HTMLDivElement>(null)

    // Use custom hooks with error handling
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

    // Initialize security and privacy on mount with error handling
    useEffect(() => {
        const initializeApp = async () => {
            try {
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

                setIsInitialized(true)
            } catch (error) {
                console.error('App initialization failed:', error)
                setInitError(error instanceof Error ? error.message : 'Initialisatie mislukt')
                setIsInitialized(true) // Still set to true to show error state
            }
        }

        initializeApp()
    }, [loadAutoSave, setFormData])

    // Enhanced updateFormData with input sanitization and error handling
    const secureUpdateFormData = useCallback((path: string, value: any) => {
        try {
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
        } catch (error) {
            console.error('Failed to update form data:', error)
        }
    }, [updateFormData, autoSave, hasPrivacyConsent])

    // Navigation functions with useCallback for performance and error handling
    const goToStep = useCallback((step: number) => {
        try {
            if (step >= 0 && step < steps.length) {
                setCurrentStep(step)
                if (hasPrivacyConsent) {
                    autoSave()
                }
            }
        } catch (error) {
            console.error('Failed to navigate to step:', error)
        }
    }, [autoSave, hasPrivacyConsent])

    const nextStep = useCallback(() => {
        try {
            if (currentStep < steps.length - 1) {
                setCurrentStep(prev => prev + 1)
                if (hasPrivacyConsent) {
                    autoSave()
                }
            }
        } catch (error) {
            console.error('Failed to go to next step:', error)
        }
    }, [currentStep, autoSave, hasPrivacyConsent])

    const previousStep = useCallback(() => {
        try {
            if (currentStep > 0) {
                setCurrentStep(prev => prev - 1)
                if (hasPrivacyConsent) {
                    autoSave()
                }
            }
        } catch (error) {
            console.error('Failed to go to previous step:', error)
        }
    }, [currentStep, autoSave, hasPrivacyConsent])

    // File operations with useCallback and security validation
    const handleSaveProgress = useCallback(() => {
        try {
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
        } catch (error) {
            console.error('Failed to save progress:', error)
            alert('❌ Fout bij het opslaan. Probeer het opnieuw.')
        }
    }, [saveProgress, hasPrivacyConsent, isSessionValid])

    const loadProgress = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        try {
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
        } catch (error) {
            console.error('Failed to load progress:', error)
            alert('❌ Fout bij het laden. Probeer het opnieuw.')
        }
    }, [setFormData, hasPrivacyConsent])

    const showSuccessMessage = useCallback(() => {
        try {
            if (successMessageRef.current) {
                successMessageRef.current.style.display = 'block'
                setTimeout(() => {
                    if (successMessageRef.current) {
                        successMessageRef.current.style.display = 'none'
                    }
                }, 3000)
            }
        } catch (error) {
            console.error('Failed to show success message:', error)
        }
    }, [])

    // Handle privacy consent changes
    const handleConsentChange = useCallback((consent: boolean) => {
        try {
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
        } catch (error) {
            console.error('Failed to handle consent change:', error)
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
        // Show initialization error if present
        if (initError) {
            return (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🛑</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Initialisatie Fout</h3>
                    <p className="text-gray-600 mb-4">{initError}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        🔄 Pagina vernieuwen
                    </button>
                </div>
            )
        }

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

        try {
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
                default: 
                    return (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">❓</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Stap niet gevonden</h3>
                            <p className="text-gray-600">De opgevraagde stap bestaat niet.</p>
                        </div>
                    )
            }
        } catch (error) {
            console.error('Error rendering step content:', error)
            return <StepErrorFallback error={error as Error} retry={() => window.location.reload()} />
        }
    }, [currentStep, stepProps, hasPrivacyConsent, initError])

    // Show loading state during initialization
    if (!isInitialized) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">SMART Leerdoel Creator wordt geïnitialiseerd...</p>
                </div>
            </div>
        )
    }

    return (
        <ErrorBoundary>
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
                            <ErrorBoundary fallback={
                                <StepErrorFallback 
                                    error={new Error('Stap kan niet worden geladen')} 
                                    retry={() => window.location.reload()} 
                                />
                            }>
                                <Suspense fallback={<StepLoader />}>
                                    {renderStepContent()}
                                </Suspense>
                            </ErrorBoundary>
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
        </ErrorBoundary>
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