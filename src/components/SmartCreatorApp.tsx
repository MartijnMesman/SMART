'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'

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

// Import step components
import StartStep from './steps/StartStep'
import InfoStep from './steps/InfoStep'
import BewustwordingStep from './steps/BewustwordingStep'
import EigenschapStep from './steps/EigenschapStep'
import GroeiStep from './steps/GroeiStep'
import SmartStep from './steps/SmartStep'
import StartpuntStep from './steps/StartpuntStep'
import ActiesStep from './steps/ActiesStep'
import ObstakelsStep from './steps/ObstakelsStep'
import PlanningStep from './steps/PlanningStep'
import ReflectieStep from './steps/ReflectieStep'
import OverzichtStep from './steps/OverzichtStep'

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

    // Navigation functions
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

    // File operations
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

    const renderStepContent = () => {
        const stepProps = {
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
        }

        switch (steps[currentStep].id) {
            case 'start': return <StartStep {...stepProps} />
            case 'info': return <InfoStep {...stepProps} />
            case 'bewustwording': return <BewustwordingStep {...stepProps} />
            case 'eigenschap': return <EigenschapStep {...stepProps} />
            case 'groei': return <GroeiStep {...stepProps} />
            case 'smart': return <SmartStep {...stepProps} />
            case 'startpunt': return <StartpuntStep {...stepProps} />
            case 'acties': return <ActiesStep {...stepProps} />
            case 'obstakels': return <ObstakelsStep {...stepProps} />
            case 'planning': return <PlanningStep {...stepProps} />
            case 'reflectie': return <ReflectieStep {...stepProps} />
            case 'overzicht': return <OverzichtStep {...stepProps} />
            default: return <div>Stap niet gevonden</div>
        }
    }

    return (
        <div className="font-sans leading-relaxed text-gray-700 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
            <Header saveStatus={saveStatus} />
            <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
            <StepNavigation 
                steps={steps} 
                currentStep={currentStep} 
                onStepClick={goToStep} 
            />

            {/* Main Content */}
            <div className="max-w-screen-lg mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div id="step-content">
                        {renderStepContent()}
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