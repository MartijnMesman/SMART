'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'

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

// Define types for formData for better type safety
interface FormData {
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
        routines: string[]; // Added from original HTML, though not used in JS
    };
    stap9_reflectie: {
        eigenGemaakt: string;
        nieuweUitdaging: string;
        vervolgOntwikkeling: string;
    };
}

const initialFormData: FormData = {
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
};

const steps = [
    { id: 'start', title: 'Welkom', icon: '🎯' },
    { id: 'info', title: 'Algemene Info', icon: '📄' },
    { id: 'bewustwording', title: 'Bewust worden', icon: '👁️' },
    { id: 'eigenschap', title: 'Eigenschap herkennen', icon: '🧠' },
    { id: 'groei', title: 'BANGE-check', icon: '⭐' },
    { id: 'smart', title: 'SMART formulering', icon: '✅' },
    { id: 'startpunt', title: 'Startpunt (0-10)', icon: '📍' },
    { id: 'acties', title: 'Concrete acties', icon: '⚡' },
    { id: 'obstakels', title: 'Obstakels herkennen', icon: '🛡️' },
    { id: 'planning', title: 'Planning & uitvoering', icon: '📅' },
    { id: 'reflectie', title: 'Reflectie & vernieuwing', icon: '🔄' },
    { id: 'overzicht', title: 'Overzicht & Export', icon: '📥' }
];

export default function SmartCreatorApp() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [saveStatus, setSaveStatus] = useState('AAN');
    const successMessageRef = useRef<HTMLDivElement>(null);

    // Utility functions for nested form data
    const setNestedValue = useCallback((obj: any, path: string, value: any) => {
        const keys = path.split('.');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        return { ...obj }; // Return a new object to trigger state update
    }, []);

    const getNestedValue = useCallback((obj: any, path: string) => {
        return path.split('.').reduce((current, key) => current && current[key], obj) || '';
    }, []);

    // Auto-save and load
    useEffect(() => {
        const loadAutoSave = () => {
            try {
                const saved = localStorage.getItem('smartLeerdoel_autosave');
                if (saved) {
                    const data = JSON.parse(saved);
                    if (data.formData && data.currentStep !== undefined) {
                        setFormData(data.formData);
                        setCurrentStep(data.currentStep);
                    }
                }
            } catch (e) {
                console.error('Error loading auto-saved data:', e);
            }
        };

        loadAutoSave();

        const intervalId = setInterval(() => {
            autoSave();
        }, 120000); // Auto-save every 2 minutes

        return () => clearInterval(intervalId);
    }, []);

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

    // Navigation functions
    const goToStep = useCallback((step: number) => {
        setCurrentStep(step);
        autoSave();
    }, [autoSave]);

    const nextStep = useCallback(() => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            autoSave();
        }
    }, [currentStep, autoSave]);

    const previousStep = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            autoSave();
        }
    }, [currentStep, autoSave]);

    // Progress update
    const updateProgress = useCallback(() => {
        const percentage = Math.round(((currentStep + 1) / steps.length) * 100);
        // This function will primarily update the UI based on currentStep and formData
        // The actual UI elements will be in the JSX
        return percentage;
    }, [currentStep]);

    // Data management functions (simplified for now, will be passed to step components)
    const updateFormData = useCallback((path: string, value: any) => {
        setFormData(prev => setNestedValue(prev, path, value));
    }, [setNestedValue]);

    const addActie = useCallback(() => {
        setFormData(prev => {
            const newActies = [...prev.stap6_acties, { actie: '', type: 'regulier', moeilijkheid: 3, impact: 3 }];
            return { ...prev, stap6_acties: newActies };
        });
        autoSave();
    }, [autoSave]);

    const removeActie = useCallback((index: number) => {
        setFormData(prev => {
            const newActies = prev.stap6_acties.filter((_, i) => i !== index);
            return { ...prev, stap6_acties: newActies };
        });
        autoSave();
    }, [autoSave]);

    const updateObstakel = useCallback((index: number, field: keyof FormData['stap7_obstakels'][0], value: string) => {
        setFormData(prev => {
            const newObstakels = [...prev.stap7_obstakels];
            newObstakels[index] = { ...newObstakels[index], [field]: value };
            return { ...prev, stap7_obstakels: newObstakels };
        });
        autoSave();
    }, [autoSave]);

    const addObstakel = useCallback(() => {
        setFormData(prev => {
            const newObstakels = [...prev.stap7_obstakels, { obstakel: '', alsDanPlan: '' }];
            return { ...prev, stap7_obstakels: newObstakels };
        });
        autoSave();
    }, [autoSave]);

    const removeObstakel = useCallback((index: number) => {
        setFormData(prev => {
            const newObstakels = prev.stap7_obstakels.filter((_, i) => i !== index);
            return { ...prev, stap7_obstakels: newObstakels };
        });
        autoSave();
    }, [autoSave]);

    const updatePlanningItem = useCallback((category: keyof FormData['stap8_planning'], index: number, value: string) => {
        setFormData(prev => {
            const newItems = [...(prev.stap8_planning[category] || [])];
            newItems[index] = value;
            return { ...prev, stap8_planning: { ...prev.stap8_planning, [category]: newItems } };
        });
        autoSave();
    }, [autoSave]);

    const addPlanningItem = useCallback((category: keyof FormData['stap8_planning']) => {
        setFormData(prev => {
            const newItems = [...(prev.stap8_planning[category] || [])];
            newItems.push('');
            return { ...prev, stap8_planning: { ...prev.stap8_planning, [category]: newItems } };
        });
        autoSave();
    }, [autoSave]);

    const removePlanningItem = useCallback((category: keyof FormData['stap8_planning'], index: number) => {
        setFormData(prev => {
            const newItems = (prev.stap8_planning[category] || []).filter((_, i) => i !== index);
            return { ...prev, stap8_planning: { ...prev.stap8_planning, [category]: newItems } };
        });
        autoSave();
    }, [autoSave]);

    // Export functions
    const downloadFile = useCallback((content: string, filename: string, mimeType: string) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showSuccessMessage();
    }, []);

    const exportAsText = useCallback(() => {
        const content = `SMART LEERDOEL - ${formData.algemeneInfo.naam}
Datum: ${new Date().toLocaleDateString('nl-NL')}
Opleiding: ${formData.algemeneInfo.opleiding}
Studiejaar: ${formData.algemeneInfo.studiejaar}
Vak: ${formData.algemeneInfo.vak}

=== LEERDOEL ===
${formData.stap4_smart.leerdoel}

=== STAP 1: BEWUSTWORDING ===
Lastige situatie: ${formData.stap1_bewustwording.lastigeSituatie}
Gevoel: ${formData.stap1_bewustwording.gevoel}

=== STAP 2: EIGENSCHAP HERKENNEN ===
Reactie: ${formData.stap2_eigenschap.reactie}
Kernkwaliteit: ${formData.stap2_eigenschap.kernkwaliteit}
Valkuil: ${formData.stap2_eigenschap.valkuil}

=== STAP 3: ONTWIKKELWENS & BANGE-CHECK ===
Ontwikkelwens: ${formData.stap3_groei.ontwikkelwens}
Motivatie: ${formData.stap3_groei.motivatie}
BANGE-check:
- Belangrijk: ${formData.stap3_groei.belangrijk ? '✓' : '✗'}
- Authentiek: ${formData.stap3_groei.authentiek ? '✓' : '✗'}
- Nuttig: ${formData.stap3_groei.nuttig ? '✓' : '✗'}
- Geloofwaardig: ${formData.stap3_groei.geloofwaardig ? '✓' : '✗'}
- Enthousiasmerend: ${formData.stap3_groei.enthousiasmerend ? '✓' : '✗'}

=== STAP 4: SMART CRITERIA ===
- Specifiek: ${formData.stap4_smart.specifiek}
- Meetbaar: ${formData.stap4_smart.meetbaar}
- Acceptabel: ${formData.stap4_smart.acceptabel}
- Realistisch: ${formData.stap4_smart.realistisch}
- Tijdgebonden: ${formData.stap4_smart.tijdgebonden}

=== STAP 5: STARTPUNT ===
Huidige score: ${formData.stap5_startpunt.huidigeScore}/10
Waarom niet 0: ${formData.stap5_startpunt.waaromNietNul}
Succesmoment: ${formData.stap5_startpunt.succesSituatie}
Hoe gelukt: ${formData.stap5_startpunt.hoeGelukt}
Volgende stap: ${formData.stap5_startpunt.volgendStap}

=== STAP 6: CONCRETE ACTIES ===
${formData.stap6_acties.map((actie, index) =>
            `${index + 1}. ${actie.actie} ${index === 0 ? '(STARTactie)' : ''}`
        ).join('\n')}

=== STAP 7: OBSTAKELS ===
${formData.stap7_obstakels.map((item, index) =>
            `${index + 1}. Obstakel: ${item.obstakel}
     Als-dan plan: ${item.alsDanPlan}`
        ).join('\n')}

=== STAP 8: PLANNING ===
Agenda items: ${(formData.stap8_planning.agendaItems || []).join(', ')}
Cues: ${(formData.stap8_planning.cues || []).join(', ')}
Beloningen: ${(formData.stap8_planning.beloningen || []).join(', ')}

=== STAP 9: REFLECTIE ===
Eigenschap eigen gemaakt: ${formData.stap9_reflectie.eigenGemaakt}
Nieuwe uitdaging: ${formData.stap9_reflectie.nieuweUitdaging}

Gegenereerd door SMART Leerdoel Creator - inholland hogeschool`;

        downloadFile(content, `SMART_Leerdoel_${formData.algemeneInfo.naam.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`, 'text/plain');
    }, [formData, downloadFile]);

    const exportAsMarkdown = useCallback(() => {
        const content = `# SMART Leerdoel - ${formData.algemeneInfo.naam}

**Datum:** ${new Date().toLocaleDateString('nl-NL')}  
**Opleiding:** ${formData.algemeneInfo.opleiding}  
**Studiejaar:** ${formData.algemeneInfo.studiejaar}  
**Vak:** ${formData.algemeneInfo.vak}  

## 🎯 SMART Leerdoel
> ${formData.stap4_smart.leerdoel}

## 👁️ Stap 1: Bewustwording
**Lastige situatie:** ${formData.stap1_bewustwording.lastigeSituatie}  
**Gevoel:** ${formData.stap1_bewustwording.gevoel}

## 🧠 Stap 2: Eigenschap herkennen
**Reactie:** ${formData.stap2_eigenschap.reactie}  
**Kernkwaliteit:** ${formData.stap2_eigenschap.kernkwaliteit}  
**Valkuil:** ${formData.stap2_eigenschap.valkuil}

## ⭐ Stap 3: Ontwikkelwens & BANGE-check
**Ontwikkelwens:** ${formData.stap3_groei.ontwikkelwens}  
**Motivatie:** ${formData.stap3_groei.motivatie}

### BANGE-check
- **Belangrijk:** ${formData.stap3_groei.belangrijk ? '✅' : '❌'}
- **Authentiek:** ${formData.stap3_groei.authentiek ? '✅' : '❌'}
- **Nuttig:** ${formData.stap3_groei.nuttig ? '✅' : '❌'}
- **Geloofwaardig:** ${formData.stap3_groei.geloofwaardig ? '✅' : '❌'}
- **Enthousiasmerend:** ${formData.stap3_groei.enthousiasmerend ? '✅' : '❌'}

## ✅ Stap 4: SMART Criteria
- **Specifiek:** ${formData.stap4_smart.specifiek}
- **Meetbaar:** ${formData.stap4_smart.meetbaar}
- **Acceptabel:** ${formData.stap4_smart.acceptabel}
- **Realistisch:** ${formData.stap4_smart.realistisch}
- **Tijdgebonden:** ${formData.stap4_smart.tijdgebonden}

## 📍 Stap 5: Startpunt
**Huidige score:** ${formData.stap5_startpunt.huidigeScore}/10  
**Waarom niet 0:** ${formData.stap5_startpunt.waaromNietNul}  
**Succesmoment:** ${formData.stap5_startpunt.succesSituatie}  
**Volgende stap:** ${formData.stap5_startpunt.volgendStap}

## ⚡ Stap 6: Concrete acties
${formData.stap6_acties.map((actie, index) =>
            `${index + 1}. **${actie.actie}** ${index === 0 ? '*(STARTactie)*' : ''}`
        ).join('\n')}

## 🛡️ Stap 7: Obstakels
${formData.stap7_obstakels.map((item, index) =>
            `${index + 1}. **Obstakel:** ${item.obstakel}  
   **Als-dan plan:** ${item.alsDanPlan}`
        ).join('\n')}

## 📅 Stap 8: Planning
**Agenda items:** ${(formData.stap8_planning.agendaItems || []).join(', ')}  
**Cues:** ${(formData.stap8_planning.cues || []).join(', ')}  
**Beloningen:** ${(formData.stap8_planning.beloningen || []).join(', ')}

## 🔄 Stap 9: Reflectie
**Eigenschap eigen gemaakt:** ${formData.stap9_reflectie.eigenGemaakt}  
**Nieuwe uitdaging:** ${formData.stap9_reflectie.nieuweUitdaging}

---
*Gegenereerd door SMART Leerdoel Creator - inholland hogeschool*`;

        downloadFile(content, `SMART_Leerdoel_${formData.algemeneInfo.naam.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.md`, 'text/markdown');
    }, [formData, downloadFile]);

    const saveProgress = useCallback(() => {
        const saveData = {
            formData,
            currentStep,
            timestamp: new Date().toISOString(),
            version: '2.0'
        };

        downloadFile(JSON.stringify(saveData, null, 2), `SMART_Leerdoel_Progress_${formData.algemeneInfo.naam.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
    }, [formData, currentStep, downloadFile]);

    const loadProgress = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target?.result as string);
                    setFormData(data.formData);
                    setCurrentStep(data.currentStep);
                    showSuccessMessage();
                } catch (error) {
                    alert('Error loading file. Please check if it\'s a valid SMART Leerdoel file.');
                }
            };
            reader.readAsText(file);
        }
    }, []);

    const showSuccessMessage = useCallback(() => {
        if (successMessageRef.current) {
            successMessageRef.current.style.display = 'block';
            setTimeout(() => {
                if (successMessageRef.current) {
                    successMessageRef.current.style.display = 'none';
                }
            }, 3000);
        }
    }, []);

    const getNavButtonClass = (index: number) => {
        if (index === currentStep) return 'current';
        if (index < currentStep) return 'completed';
        return 'pending';
    };

    const renderStepContent = () => {
        const stepProps = {
            formData,
            updateFormData,
            getNestedValue,
            addActie, removeActie,
            updateObstakel, addObstakel, removeObstakel,
            updatePlanningItem, addPlanningItem, removePlanningItem,
            exportAsText, exportAsMarkdown, saveProgress
        };

        switch (steps[currentStep].id) {
            case 'start': return <StartStep {...stepProps} />;
            case 'info': return <InfoStep {...stepProps} />;
            case 'bewustwording': return <BewustwordingStep {...stepProps} />;
            case 'eigenschap': return <EigenschapStep {...stepProps} />;
            case 'groei': return <GroeiStep {...stepProps} />;
            case 'smart': return <SmartStep {...stepProps} />;
            case 'startpunt': return <StartpuntStep {...stepProps} />;
            case 'acties': return <ActiesStep {...stepProps} />;
            case 'obstakels': return <ObstakelsStep {...stepProps} />;
            case 'planning': return <PlanningStep {...stepProps} />;
            case 'reflectie': return <ReflectieStep {...stepProps} />;
            case 'overzicht': return <OverzichtStep {...stepProps} />;
            default: return <div>Stap niet gevonden</div>;
        }
    };

    const progressPercentage = updateProgress();

    return (
        <>
            {/* Header */}
            <div className="header">
                <div className="header-content max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="logo-section flex items-center gap-4">
                        <div className="logo">i</div>
                        <div className="title-section">
                            <h1>SMART Leerdoel Creator</h1>
                            <p>inholland hogeschool</p>
                        </div>
                    </div>
                    <div id="auto-save-status" className="text-xs text-gray-600">
                        Auto-save: <span id="save-status">{saveStatus}</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="progress-section">
                <div className="progress-content max-w-screen-xl mx-auto px-4 py-2">
                    <div className="progress-info flex justify-between text-xs text-gray-600 mb-2">
                        <span>Stap <span id="current-step-number">{currentStep + 1}</span> van <span id="total-steps">{steps.length}</span></span>
                        <span><span id="progress-percentage">{progressPercentage}</span>% voltooid</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="nav-section">
                <div className="nav-content max-w-screen-xl mx-auto px-4 py-3">
                    <div className="nav-buttons flex gap-1 min-w-max">
                        {steps.map((step, index) => (
                            <button
                                key={step.id}
                                className={`nav-button flex items-center gap-2 px-3 py-2 rounded-lg text-sm border-none cursor-pointer transition-all duration-200 whitespace-nowrap ${getNavButtonClass(index)}`}
                                onClick={() => goToStep(index)}
                            >
                                {step.icon} {step.title}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content max-w-screen-lg mx-auto px-4 py-8">
                <div className="step-container">
                    <div id="step-content">
                        {renderStepContent()}
                    </div>
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="footer-nav">
                <div className="footer-content max-w-screen-lg mx-auto px-4 py-4 flex justify-between items-center">
                    <button
                        className="btn btn-secondary"
                        id="prev-btn"
                        onClick={previousStep}
                        disabled={currentStep === 0}
                    >
                        ← Vorige
                    </button>
                    <div className="flex gap-4">
                        <button className="btn btn-success" onClick={saveProgress}>💾 Opslaan</button>
                        <label className="btn btn-primary cursor-pointer">
                            📁 Laden
                            <input type="file" accept=".json" onChange={loadProgress} className="hidden" />
                        </label>
                    </div>
                    <button
                        className="btn btn-primary"
                        id="next-btn"
                        onClick={nextStep}
                        disabled={currentStep === steps.length - 1}
                    >
                        Volgende →
                    </button>
                </div>
            </div>

            {/* Success Message */}
            <div className="success-message" ref={successMessageRef}>
                ✅ Succesvol opgeslagen!
            </div>
        </>
    );
}