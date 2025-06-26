'use client'

import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react'

// Import UI components
import Header from './ui/Header'
import ProgressBar from './ui/ProgressBar'
import StepNavigation from './ui/StepNavigation'
import FooterNavigation from './ui/FooterNavigation'
import SuccessMessage from './ui/SuccessMessage'

// Import hooks
import { useFormData } from '../hooks/useFormData'
import { useAutoSave } from '../hooks/useAutoSave'
import { useExport } from '../hooks/useExport'

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

    const { saveStatus, autoSave, loadAutoSave } = useAutoSave(formData, currentStep)
    const { exportAsText, exportAsMarkdown, saveProgress } = useExport(formData, currentStep)

    // Load auto-saved data on mount
    useEffect(() => {
        const savedData = loadAutoSave()
        if (savedData) {
            setFormData(savedData.formData)
            setCurrentStep(savedData.currentStep)
        }
    }, [loadAutoSave, setFormData])

    // Navigation functions with useCallback for performance
    const goToStep = useCallback((step: number) => {
        setCurrentStep(step)
        autoSave()
    }, [autoSave])

    const nextStep = useCallback(() => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1)
            autoSave()
        }
    }, [currentStep, autoSave])

    const previousStep = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
            autoSave()
        }
    }, [currentStep, autoSave])

    // File operations with useCallback
    const handleSaveProgress = useCallback(() => {
        saveProgress()
        showSuccessMessage()
    }, [saveProgress])

    const loadProgress = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target?.result as string)
                    setFormData(data.formData)
                    setCurrentStep(data.currentStep)
                    showSuccessMessage()
                } catch (error) {
                    alert('Error loading file. Please check if it\'s a valid SMART Leerdoel file.')
                }
            }
            reader.readAsText(file)
        }
    }, [setFormData])

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

    // Memoized step props to prevent unnecessary re-renders
    const stepProps = useCallback(() => ({
        formData,
        updateFormData,
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
        updateFormData,
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
    }, [currentStep, stepProps])

    return (
        <div className="font-sans leading-relaxed text-gray-700 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
            <Header saveStatus={saveStatus} />
            <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
            <StepNavigation 
                steps={steps} 
                currentStep={currentStep} 
                onStepClick={goToStep} 
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
            />

            <SuccessMessage ref={successMessageRef} />
        </div>
    )
}