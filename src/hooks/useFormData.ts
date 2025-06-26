'use client'

import { useState, useCallback, useMemo } from 'react'

// Define types for formData for better type safety
export interface FormData {
    algemeneInfo: {
        naam: string;
        opleiding: string;
        studiejaar: string;
        vak: string;
        periode: string;
    };
    stap1_bewustwording: {
        lastigeSituatie: string;
        gevoel: string;
    };
    stap2_eigenschap: {
        reactie: string;
        kernkwaliteit: string;
        valkuil: string;
        gedragBeschrijving: string;
    };
    stap3_groei: {
        ontwikkelwens: string;
        belangrijk: boolean;
        authentiek: boolean;
        nuttig: boolean;
        geloofwaardig: boolean;
        enthousiasmerend: boolean;
        motivatie: string;
    };
    stap4_smart: {
        specifiek: string;
        meetbaar: string;
        acceptabel: string;
        realistisch: string;
        tijdgebonden: string;
        leerdoel: string;
        smartChecklist: {
            specifiek: boolean;
            meetbaar: boolean;
            acceptabel: boolean;
            realistisch: boolean;
            tijdgebonden: boolean;
        };
    };
    stap5_startpunt: {
        huidigeScore: number;
        waaromNietNul: string;
        succesSituatie: string;
        hoeGelukt: string;
        volgendStap: string;
        watNodig: string;
    };
    stap6_acties: Array<{ actie: string; type: string; moeilijkheid: number; impact: number }>;
    stap7_obstakels: Array<{ obstakel: string; alsDanPlan: string }>;
    stap8_planning: {
        agendaItems: string[];
        cues: string[];
        beloningen: string[];
        routines: string[];
    };
    stap9_reflectie: {
        eigenGemaakt: string;
        nieuweUitdaging: string;
        vervolgOntwikkeling: string;
    };
}

// Memoized initial form data to prevent recreation on every render
const getInitialFormData = (): FormData => ({
    algemeneInfo: {
        naam: '',
        opleiding: 'Leisure and Events Management',
        studiejaar: '',
        vak: '',
        periode: ''
    },
    stap1_bewustwording: {
        lastigeSituatie: '',
        gevoel: ''
    },
    stap2_eigenschap: {
        reactie: '',
        kernkwaliteit: '',
        valkuil: '',
        gedragBeschrijving: ''
    },
    stap3_groei: {
        ontwikkelwens: '',
        belangrijk: false,
        authentiek: false,
        nuttig: false,
        geloofwaardig: false,
        enthousiasmerend: false,
        motivatie: ''
    },
    stap4_smart: {
        specifiek: '',
        meetbaar: '',
        acceptabel: '',
        realistisch: '',
        tijdgebonden: '',
        leerdoel: '',
        smartChecklist: {
            specifiek: false,
            meetbaar: false,
            acceptabel: false,
            realistisch: false,
            tijdgebonden: false
        }
    },
    stap5_startpunt: {
        huidigeScore: 5,
        waaromNietNul: '',
        succesSituatie: '',
        hoeGelukt: '',
        volgendStap: '',
        watNodig: ''
    },
    stap6_acties: [
        { actie: '', type: 'start', moeilijkheid: 3, impact: 3 }
    ],
    stap7_obstakels: [
        { obstakel: '', alsDanPlan: '' }
    ],
    stap8_planning: {
        agendaItems: [],
        cues: [],
        beloningen: [],
        routines: []
    },
    stap9_reflectie: {
        eigenGemaakt: '',
        nieuweUitdaging: '',
        vervolgOntwikkeling: ''
    }
});

export function useFormData() {
    const initialFormData = useMemo(() => getInitialFormData(), [])
    const [formData, setFormData] = useState<FormData>(initialFormData)

    // Utility functions for nested form data with performance optimizations
    const setNestedValue = useCallback((obj: any, path: string, value: any) => {
        const keys = path.split('.');
        const newObj = { ...obj };
        let current = newObj;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current[keys[i]] = { ...current[keys[i]] };
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        return newObj;
    }, []);

    const getNestedValue = useCallback((obj: any, path: string) => {
        return path.split('.').reduce((current, key) => current && current[key], obj) || '';
    }, []);

    const updateFormData = useCallback((path: string, value: any) => {
        setFormData(prev => setNestedValue(prev, path, value));
    }, [setNestedValue]);

    // Action management functions with performance optimizations
    const addActie = useCallback(() => {
        setFormData(prev => ({
            ...prev,
            stap6_acties: [...prev.stap6_acties, { actie: '', type: 'regulier', moeilijkheid: 3, impact: 3 }]
        }));
    }, []);

    const removeActie = useCallback((index: number) => {
        setFormData(prev => ({
            ...prev,
            stap6_acties: prev.stap6_acties.filter((_, i) => i !== index)
        }));
    }, []);

    // Obstacle management functions with performance optimizations
    const updateObstakel = useCallback((index: number, field: keyof FormData['stap7_obstakels'][0], value: string) => {
        setFormData(prev => {
            const newObstakels = [...prev.stap7_obstakels];
            newObstakels[index] = { ...newObstakels[index], [field]: value };
            return { ...prev, stap7_obstakels: newObstakels };
        });
    }, []);

    const addObstakel = useCallback(() => {
        setFormData(prev => ({
            ...prev,
            stap7_obstakels: [...prev.stap7_obstakels, { obstakel: '', alsDanPlan: '' }]
        }));
    }, []);

    const removeObstakel = useCallback((index: number) => {
        setFormData(prev => ({
            ...prev,
            stap7_obstakels: prev.stap7_obstakels.filter((_, i) => i !== index)
        }));
    }, []);

    // Planning management functions with performance optimizations
    const updatePlanningItem = useCallback((category: keyof FormData['stap8_planning'], index: number, value: string) => {
        setFormData(prev => {
            const newItems = [...(prev.stap8_planning[category] || [])];
            newItems[index] = value;
            return { 
                ...prev, 
                stap8_planning: { 
                    ...prev.stap8_planning, 
                    [category]: newItems 
                } 
            };
        });
    }, []);

    const addPlanningItem = useCallback((category: keyof FormData['stap8_planning']) => {
        setFormData(prev => {
            const newItems = [...(prev.stap8_planning[category] || []), ''];
            return { 
                ...prev, 
                stap8_planning: { 
                    ...prev.stap8_planning, 
                    [category]: newItems 
                } 
            };
        });
    }, []);

    const removePlanningItem = useCallback((category: keyof FormData['stap8_planning'], index: number) => {
        setFormData(prev => {
            const newItems = (prev.stap8_planning[category] || []).filter((_, i) => i !== index);
            return { 
                ...prev, 
                stap8_planning: { 
                    ...prev.stap8_planning, 
                    [category]: newItems 
                } 
            };
        });
    }, []);

    return {
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
    }
}