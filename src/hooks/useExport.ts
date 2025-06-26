'use client'

import { useCallback, useMemo } from 'react'
import { FormData } from './useFormData'

export function useExport(formData: FormData, currentStep: number) {
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
    }, []);

    // Memoize filename generation to prevent recalculation
    const baseFilename = useMemo(() => {
        const name = formData.algemeneInfo.naam.replace(/\s+/g, '_') || 'SMART_Leerdoel';
        const date = new Date().toISOString().split('T')[0];
        return `${name}_${date}`;
    }, [formData.algemeneInfo.naam]);

    // Memoize content generation for better performance
    const textContent = useMemo(() => {
        return `SMART LEERDOEL - ${formData.algemeneInfo.naam}
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
    }, [formData]);

    const markdownContent = useMemo(() => {
        return `# SMART Leerdoel - ${formData.algemeneInfo.naam}

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
    }, [formData]);

    const exportAsText = useCallback(() => {
        downloadFile(textContent, `${baseFilename}.txt`, 'text/plain');
    }, [textContent, baseFilename, downloadFile]);

    const exportAsMarkdown = useCallback(() => {
        downloadFile(markdownContent, `${baseFilename}.md`, 'text/markdown');
    }, [markdownContent, baseFilename, downloadFile]);

    const saveProgress = useCallback(() => {
        const saveData = {
            formData,
            currentStep,
            timestamp: new Date().toISOString(),
            version: '2.0'
        };

        downloadFile(JSON.stringify(saveData, null, 2), `${baseFilename}_Progress.json`, 'application/json');
    }, [formData, currentStep, baseFilename, downloadFile]);

    return {
        exportAsText,
        exportAsMarkdown,
        saveProgress
    }
}