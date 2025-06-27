'use client'

import { useState } from 'react'
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType } from 'docx'

interface FormData {
  uitdagingen: string[]
  kernkwaliteiten: string[]
  smartLeerdoel: {
    specifiek: string
    meetbaar: string
    acceptabel: string
    realistisch: string
    tijdgebonden: string
  }
  bangeCheck: {
    bewust: boolean
    acceptabel: boolean
    nodig: boolean
    gewenst: boolean
    energiek: boolean
  }
  startpunt: number
  startpuntVragen: {
    huidigePositie: string
    waaromNietNul: string
    dichtstBijTien: string
    hoeGelukt: string
    eenStapVerder: string
  }
  acties: string[]
  obstakelsMetOverwinningen: Array<{
    obstakel: string
    overwinning: string
  }>
  planning: {
    wanneer: string
    waar: string
    cues: string[]
  }
  reflectie: {
    evaluatieMoment: string
    succesIndicatoren: string[]
  }
}

interface DownloadButtonProps {
  formData: FormData
  className?: string
}

export default function DownloadButton({ formData, className = '' }: DownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [downloadType, setDownloadType] = useState<'word' | 'pdf'>('word')

  const generateWordDocument = async (): Promise<Document> => {
    const doc = new Document({
      creator: "SMART Leerdoel Creator",
      title: "Mijn SMART Leerdoel Plan",
      description: "Persoonlijk ontwikkelingsplan gemaakt met de SMART Leerdoel Creator",
      sections: [{
        properties: {},
        children: [
          // Titel
          new Paragraph({
            children: [
              new TextRun({
                text: "MIJN SMART LEERDOEL PLAN",
                bold: true,
                size: 32,
                color: "7C3AED"
              })
            ],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Gegenereerd op: ${new Date().toLocaleDateString('nl-NL')}`,
                italics: true,
                size: 20,
                color: "666666"
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 }
          }),

          // Stap 1: Uitdagingen
          new Paragraph({
            children: [
              new TextRun({
                text: "STAP 1: BEWUST WORDEN VAN UITDAGINGEN",
                bold: true,
                size: 24,
                color: "7C3AED"
              })
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Mijn uitdagingen:",
                bold: true,
                size: 22
              })
            ],
            spacing: { after: 120 }
          }),

          ...formData.uitdagingen.map(uitdaging => 
            new Paragraph({
              children: [
                new TextRun({ text: "• " }),
                new TextRun({ text: uitdaging })
              ],
              spacing: { after: 80 },
              indent: { left: 400 }
            })
          ),

          // Stap 2: Kernkwaliteiten
          new Paragraph({
            children: [
              new TextRun({
                text: "STAP 2: KERNKWADRANT HERKENNEN",
                bold: true,
                size: 24,
                color: "7C3AED"
              })
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Mijn kernkwaliteiten:",
                bold: true,
                size: 22
              })
            ],
            spacing: { after: 120 }
          }),

          ...formData.kernkwaliteiten.map(kwaliteit => 
            new Paragraph({
              children: [
                new TextRun({ text: "• " }),
                new TextRun({ text: kwaliteit })
              ],
              spacing: { after: 80 },
              indent: { left: 400 }
            })
          ),

          // Stap 3: SMART Leerdoel
          new Paragraph({
            children: [
              new TextRun({
                text: "STAP 3: SMART LEERDOEL FORMULEREN",
                bold: true,
                size: 24,
                color: "7C3AED"
              })
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "S - Specifiek:",
                bold: true,
                size: 20,
                color: "059669"
              })
            ],
            spacing: { after: 80 }
          }),
          new Paragraph({
            children: [new TextRun({ text: formData.smartLeerdoel.specifiek || "Nog niet ingevuld" })],
            spacing: { after: 160 },
            indent: { left: 400 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "M - Meetbaar:",
                bold: true,
                size: 20,
                color: "059669"
              })
            ],
            spacing: { after: 80 }
          }),
          new Paragraph({
            children: [new TextRun({ text: formData.smartLeerdoel.meetbaar || "Nog niet ingevuld" })],
            spacing: { after: 160 },
            indent: { left: 400 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "A - Acceptabel:",
                bold: true,
                size: 20,
                color: "059669"
              })
            ],
            spacing: { after: 80 }
          }),
          new Paragraph({
            children: [new TextRun({ text: formData.smartLeerdoel.acceptabel || "Nog niet ingevuld" })],
            spacing: { after: 160 },
            indent: { left: 400 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "R - Realistisch:",
                bold: true,
                size: 20,
                color: "059669"
              })
            ],
            spacing: { after: 80 }
          }),
          new Paragraph({
            children: [new TextRun({ text: formData.smartLeerdoel.realistisch || "Nog niet ingevuld" })],
            spacing: { after: 160 },
            indent: { left: 400 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "T - Tijdgebonden:",
                bold: true,
                size: 20,
                color: "059669"
              })
            ],
            spacing: { after: 80 }
          }),
          new Paragraph({
            children: [new TextRun({ text: formData.smartLeerdoel.tijdgebonden || "Nog niet ingevuld" })],
            spacing: { after: 160 },
            indent: { left: 400 }
          }),

          // Stap 4: BANGE Check
          new Paragraph({
            children: [
              new TextRun({
                text: "STAP 4: BANGE-CHECK",
                bold: true,
                size: 24,
                color: "7C3AED"
              })
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `BANGE-score: ${Object.values(formData.bangeCheck).filter(Boolean).length}/5`,
                bold: true,
                size: 22,
                color: Object.values(formData.bangeCheck).filter(Boolean).length >= 4 ? "059669" : 
                      Object.values(formData.bangeCheck).filter(Boolean).length >= 3 ? "D97706" : "DC2626"
              })
            ],
            spacing: { after: 160 }
          }),

          new Paragraph({
            children: [
              new TextRun({ text: `✓ Belangrijk: ${formData.bangeCheck.bewust ? 'Ja' : 'Nee'}` })
            ],
            spacing: { after: 80 },
            indent: { left: 400 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `✓ Authentiek: ${formData.bangeCheck.acceptabel ? 'Ja' : 'Nee'}` })
            ],
            spacing: { after: 80 },
            indent: { left: 400 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `✓ Nuttig: ${formData.bangeCheck.nodig ? 'Ja' : 'Nee'}` })
            ],
            spacing: { after: 80 },
            indent: { left: 400 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `✓ Geloofwaardig: ${formData.bangeCheck.gewenst ? 'Ja' : 'Nee'}` })
            ],
            spacing: { after: 80 },
            indent: { left: 400 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `✓ Enthousiasmerend: ${formData.bangeCheck.energiek ? 'Ja' : 'Nee'}` })
            ],
            spacing: { after: 160 },
            indent: { left: 400 }
          }),

          // Stap 5: Startpunt
          new Paragraph({
            children: [
              new TextRun({
                text: "STAP 5: STARTPUNT BEPALEN",
                bold: true,
                size: 24,
                color: "7C3AED"
              })
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Mijn startpunt: ${formData.startpunt}/10`,
                bold: true,
                size: 22,
                color: "2563EB"
              })
            ],
            spacing: { after: 160 }
          }),

          ...(formData.startpuntVragen.huidigePositie ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Huidige positie:",
                  bold: true,
                  size: 20
                })
              ],
              spacing: { after: 80 }
            }),
            new Paragraph({
              children: [new TextRun({ text: formData.startpuntVragen.huidigePositie })],
              spacing: { after: 160 },
              indent: { left: 400 }
            })
          ] : []),

          ...(formData.startpuntVragen.waaromNietNul ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Waarom niet op 0:",
                  bold: true,
                  size: 20
                })
              ],
              spacing: { after: 80 }
            }),
            new Paragraph({
              children: [new TextRun({ text: formData.startpuntVragen.waaromNietNul })],
              spacing: { after: 160 },
              indent: { left: 400 }
            })
          ] : []),

          // Stap 6: Acties
          new Paragraph({
            children: [
              new TextRun({
                text: "STAP 6: CONCRETE ACTIES PLANNEN",
                bold: true,
                size: 24,
                color: "7C3AED"
              })
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Mijn acties:",
                bold: true,
                size: 22
              })
            ],
            spacing: { after: 120 }
          }),

          ...formData.acties.map((actie, index) => 
            new Paragraph({
              children: [
                new TextRun({ text: `${index + 1}. ` }),
                new TextRun({ text: actie })
              ],
              spacing: { after: 80 },
              indent: { left: 400 }
            })
          ),

          // Stap 7: Obstakels
          new Paragraph({
            children: [
              new TextRun({
                text: "STAP 7: OBSTAKELS ANTICIPEREN",
                bold: true,
                size: 24,
                color: "7C3AED"
              })
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),

          ...(formData.obstakelsMetOverwinningen.length > 0 ? [
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({
                        children: [new TextRun({ text: "Obstakel", bold: true })],
                        alignment: AlignmentType.CENTER
                      })],
                      width: { size: 50, type: WidthType.PERCENTAGE }
                    }),
                    new TableCell({
                      children: [new Paragraph({
                        children: [new TextRun({ text: "Overwinning", bold: true })],
                        alignment: AlignmentType.CENTER
                      })],
                      width: { size: 50, type: WidthType.PERCENTAGE }
                    })
                  ]
                }),
                ...formData.obstakelsMetOverwinningen.map(item => 
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({
                          children: [new TextRun({ text: item.obstakel })]
                        })]
                      }),
                      new TableCell({
                        children: [new Paragraph({
                          children: [new TextRun({ text: item.overwinning })]
                        })]
                      })
                    ]
                  })
                )
              ]
            })
          ] : [
            new Paragraph({
              children: [new TextRun({ text: "Nog geen obstakels toegevoegd", italics: true, color: "666666" })],
              spacing: { after: 160 }
            })
          ]),

          // Stap 8: Planning
          new Paragraph({
            children: [
              new TextRun({
                text: "STAP 8: PLANNING & CUES INSTELLEN",
                bold: true,
                size: 24,
                color: "7C3AED"
              })
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Wanneer:",
                bold: true,
                size: 20
              })
            ],
            spacing: { after: 80 }
          }),
          new Paragraph({
            children: [new TextRun({ text: formData.planning.wanneer || "Nog niet ingevuld" })],
            spacing: { after: 160 },
            indent: { left: 400 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Waar:",
                bold: true,
                size: 20
              })
            ],
            spacing: { after: 80 }
          }),
          new Paragraph({
            children: [new TextRun({ text: formData.planning.waar || "Nog niet ingevuld" })],
            spacing: { after: 160 },
            indent: { left: 400 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Cues:",
                bold: true,
                size: 20
              })
            ],
            spacing: { after: 80 }
          }),

          ...(formData.planning.cues.length > 0 ? 
            formData.planning.cues.map(cue => 
              new Paragraph({
                children: [
                  new TextRun({ text: "• " }),
                  new TextRun({ text: cue })
                ],
                spacing: { after: 80 },
                indent: { left: 400 }
              })
            ) : [
              new Paragraph({
                children: [new TextRun({ text: "Nog geen cues toegevoegd", italics: true, color: "666666" })],
                spacing: { after: 160 },
                indent: { left: 400 }
              })
            ]
          ),

          // Stap 9: Reflectie
          new Paragraph({
            children: [
              new TextRun({
                text: "STAP 9: REFLECTIE & VERNIEUWING",
                bold: true,
                size: 24,
                color: "7C3AED"
              })
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Evaluatiemoment:",
                bold: true,
                size: 20
              })
            ],
            spacing: { after: 80 }
          }),
          new Paragraph({
            children: [new TextRun({ text: formData.reflectie.evaluatieMoment || "Nog niet ingevuld" })],
            spacing: { after: 160 },
            indent: { left: 400 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Succesindicatoren:",
                bold: true,
                size: 20
              })
            ],
            spacing: { after: 80 }
          }),

          ...(formData.reflectie.succesIndicatoren.length > 0 ? 
            formData.reflectie.succesIndicatoren.map(indicator => 
              new Paragraph({
                children: [
                  new TextRun({ text: "• " }),
                  new TextRun({ text: indicator })
                ],
                spacing: { after: 80 },
                indent: { left: 400 }
              })
            ) : [
              new Paragraph({
                children: [new TextRun({ text: "Nog geen succesindicatoren toegevoegd", italics: true, color: "666666" })],
                spacing: { after: 160 },
                indent: { left: 400 }
              })
            ]
          ),

          // Footer
          new Paragraph({
            children: [
              new TextRun({
                text: "Gegenereerd door SMART Leerdoel Creator - Inholland Hogeschool",
                italics: true,
                size: 18,
                color: "666666"
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 600, after: 200 }
          })
        ]
      }]
    })

    return doc
  }

  const generatePDF = async () => {
    // Dynamic import to avoid SSR issues
    const jsPDF = (await import('jspdf')).default

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20
    let yPosition = margin

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize: number = 12, isBold: boolean = false, color: string = '#000000') => {
      pdf.setFontSize(fontSize)
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal')
      pdf.setTextColor(color)
      
      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin)
      
      // Check if we need a new page
      if (yPosition + (lines.length * fontSize * 0.5) > pageHeight - margin) {
        pdf.addPage()
        yPosition = margin
      }
      
      pdf.text(lines, margin, yPosition)
      yPosition += lines.length * fontSize * 0.5 + 5
    }

    // Title
    addText('MIJN SMART LEERDOEL PLAN', 20, true, '#7C3AED')
    addText(`Gegenereerd op: ${new Date().toLocaleDateString('nl-NL')}`, 10, false, '#666666')
    yPosition += 10

    // Stap 1
    addText('STAP 1: BEWUST WORDEN VAN UITDAGINGEN', 16, true, '#7C3AED')
    addText('Mijn uitdagingen:', 12, true)
    formData.uitdagingen.forEach(uitdaging => {
      addText(`• ${uitdaging}`, 11)
    })
    yPosition += 5

    // Stap 2
    addText('STAP 2: KERNKWADRANT HERKENNEN', 16, true, '#7C3AED')
    addText('Mijn kernkwaliteiten:', 12, true)
    formData.kernkwaliteiten.forEach(kwaliteit => {
      addText(`• ${kwaliteit}`, 11)
    })
    yPosition += 5

    // Stap 3
    addText('STAP 3: SMART LEERDOEL FORMULEREN', 16, true, '#7C3AED')
    addText('S - Specifiek:', 12, true, '#059669')
    addText(formData.smartLeerdoel.specifiek || 'Nog niet ingevuld', 11)
    addText('M - Meetbaar:', 12, true, '#059669')
    addText(formData.smartLeerdoel.meetbaar || 'Nog niet ingevuld', 11)
    addText('A - Acceptabel:', 12, true, '#059669')
    addText(formData.smartLeerdoel.acceptabel || 'Nog niet ingevuld', 11)
    addText('R - Realistisch:', 12, true, '#059669')
    addText(formData.smartLeerdoel.realistisch || 'Nog niet ingevuld', 11)
    addText('T - Tijdgebonden:', 12, true, '#059669')
    addText(formData.smartLeerdoel.tijdgebonden || 'Nog niet ingevuld', 11)
    yPosition += 5

    // Stap 4
    addText('STAP 4: BANGE-CHECK', 16, true, '#7C3AED')
    const bangeScore = Object.values(formData.bangeCheck).filter(Boolean).length
    addText(`BANGE-score: ${bangeScore}/5`, 12, true, bangeScore >= 4 ? '#059669' : bangeScore >= 3 ? '#D97706' : '#DC2626')
    addText(`✓ Belangrijk: ${formData.bangeCheck.bewust ? 'Ja' : 'Nee'}`, 11)
    addText(`✓ Authentiek: ${formData.bangeCheck.acceptabel ? 'Ja' : 'Nee'}`, 11)
    addText(`✓ Nuttig: ${formData.bangeCheck.nodig ? 'Ja' : 'Nee'}`, 11)
    addText(`✓ Geloofwaardig: ${formData.bangeCheck.gewenst ? 'Ja' : 'Nee'}`, 11)
    addText(`✓ Enthousiasmerend: ${formData.bangeCheck.energiek ? 'Ja' : 'Nee'}`, 11)
    yPosition += 5

    // Stap 5
    addText('STAP 5: STARTPUNT BEPALEN', 16, true, '#7C3AED')
    addText(`Mijn startpunt: ${formData.startpunt}/10`, 12, true, '#2563EB')
    if (formData.startpuntVragen.huidigePositie) {
      addText('Huidige positie:', 12, true)
      addText(formData.startpuntVragen.huidigePositie, 11)
    }
    yPosition += 5

    // Stap 6
    addText('STAP 6: CONCRETE ACTIES PLANNEN', 16, true, '#7C3AED')
    addText('Mijn acties:', 12, true)
    formData.acties.forEach((actie, index) => {
      addText(`${index + 1}. ${actie}`, 11)
    })
    yPosition += 5

    // Stap 7
    addText('STAP 7: OBSTAKELS ANTICIPEREN', 16, true, '#7C3AED')
    formData.obstakelsMetOverwinningen.forEach((item, index) => {
      addText(`Obstakel ${index + 1}: ${item.obstakel}`, 11, true, '#DC2626')
      addText(`Overwinning: ${item.overwinning}`, 11, false, '#059669')
      yPosition += 2
    })

    // Stap 8
    addText('STAP 8: PLANNING & CUES INSTELLEN', 16, true, '#7C3AED')
    addText('Wanneer:', 12, true)
    addText(formData.planning.wanneer || 'Nog niet ingevuld', 11)
    addText('Waar:', 12, true)
    addText(formData.planning.waar || 'Nog niet ingevuld', 11)
    addText('Cues:', 12, true)
    formData.planning.cues.forEach(cue => {
      addText(`• ${cue}`, 11)
    })
    yPosition += 5

    // Stap 9
    addText('STAP 9: REFLECTIE & VERNIEUWING', 16, true, '#7C3AED')
    addText('Evaluatiemoment:', 12, true)
    addText(formData.reflectie.evaluatieMoment || 'Nog niet ingevuld', 11)
    addText('Succesindicatoren:', 12, true)
    formData.reflectie.succesIndicatoren.forEach(indicator => {
      addText(`• ${indicator}`, 11)
    })

    // Footer
    yPosition += 10
    addText('Gegenereerd door SMART Leerdoel Creator - Inholland Hogeschool', 10, false, '#666666')

    return pdf
  }

  const handleDownload = async () => {
    setIsGenerating(true)
    
    try {
      if (downloadType === 'word') {
        // Generate Word document
        const doc = await generateWordDocument()
        const { Packer } = await import('docx')
        const blob = await Packer.toBlob(doc)
        
        // Create download link
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `SMART_Leerdoel_Plan_${new Date().toISOString().slice(0, 10)}.docx`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } else {
        // Generate PDF
        const pdf = await generatePDF()
        pdf.save(`SMART_Leerdoel_Plan_${new Date().toISOString().slice(0, 10)}.pdf`)
      }
    } catch (error) {
      console.error('Download failed:', error)
      alert('Er is een fout opgetreden bij het genereren van het bestand. Probeer het opnieuw.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <select
          value={downloadType}
          onChange={(e) => setDownloadType(e.target.value as 'word' | 'pdf')}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={isGenerating}
        >
          <option value="word">Word (.docx)</option>
          <option value="pdf">PDF (.pdf)</option>
        </select>
        
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isGenerating
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              Genereren...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download {downloadType === 'word' ? 'Word' : 'PDF'}
            </>
          )}
        </button>
      </div>
    </div>
  )
}