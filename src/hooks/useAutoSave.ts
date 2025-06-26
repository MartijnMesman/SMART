'use client'

import { useState, useEffect, useCallback } from 'react'
import { FormData } from './useFormData'

export function useAutoSave(formData: FormData, currentStep: number) {
    const [saveStatus, setSaveStatus] = useState('AAN')

    const autoSave = useCallback(() => {
        try {
            localStorage.setItem('smartLeerdoel_autosave', JSON.stringify({
                formData,
                currentStep,
                timestamp: new Date().toISOString()
            }));
            setSaveStatus('AAN');
        } catch (e) {
            console.error('Auto-save failed:', e);
            setSaveStatus('FOUT');
        }
    }, [formData, currentStep]);

    // Auto-save and load
    useEffect(() => {
        const intervalId = setInterval(() => {
            autoSave();
        }, 120000); // Auto-save every 2 minutes

        return () => clearInterval(intervalId);
    }, [autoSave]);

    const loadAutoSave = useCallback(() => {
        try {
            const saved = localStorage.getItem('smartLeerdoel_autosave');
            if (saved) {
                const data = JSON.parse(saved);
                if (data.formData && data.currentStep !== undefined) {
                    return data;
                }
            }
        } catch (e) {
            console.error('Error loading auto-saved data:', e);
        }
        return null;
    }, []);

    return {
        saveStatus,
        autoSave,
        loadAutoSave
    }
}