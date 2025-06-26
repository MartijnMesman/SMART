'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { FormData } from './useFormData'

export function useAutoSave(formData: FormData, currentStep: number) {
    const [saveStatus, setSaveStatus] = useState('AAN')
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const lastSaveRef = useRef<string>('')

    const autoSave = useCallback(() => {
        try {
            const dataToSave = JSON.stringify({
                formData,
                currentStep,
                timestamp: new Date().toISOString()
            });

            // Only save if data has actually changed
            if (dataToSave !== lastSaveRef.current) {
                localStorage.setItem('smartLeerdoel_autosave', dataToSave);
                lastSaveRef.current = dataToSave;
                setSaveStatus('AAN');
            }
        } catch (e) {
            console.error('Auto-save failed:', e);
            setSaveStatus('FOUT');
        }
    }, [formData, currentStep]);

    // Debounced auto-save to prevent excessive saves
    const debouncedAutoSave = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
            autoSave();
        }, 1000); // Save 1 second after last change
    }, [autoSave]);

    // Auto-save with debouncing
    useEffect(() => {
        debouncedAutoSave();
        
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [debouncedAutoSave]);

    // Periodic auto-save as backup
    useEffect(() => {
        const intervalId = setInterval(() => {
            autoSave();
        }, 120000); // Auto-save every 2 minutes as backup

        return () => clearInterval(intervalId);
    }, [autoSave]);

    const loadAutoSave = useCallback(() => {
        try {
            const saved = localStorage.getItem('smartLeerdoel_autosave');
            if (saved) {
                const data = JSON.parse(saved);
                if (data.formData && data.currentStep !== undefined) {
                    lastSaveRef.current = saved;
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