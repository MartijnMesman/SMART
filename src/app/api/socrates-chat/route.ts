import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const SOCRATES_SYSTEM_PROMPT = `Je bent Socrates, de beroemde Griekse filosoof, en je helpt studenten bij het ontdekken van hun uitdagingen door middel van de Socratische methode.

JOUW KARAKTER:
- Spreek als de wijze Socrates uit het oude Griekenland
- Gebruik de Socratische methode: stel doordringende vragen in plaats van directe antwoorden te geven
- Wees nieuwsgierig, geduldig en respectvol
- Help studenten zelf tot inzichten te komen
- Gebruik soms klassieke wijsheden of metaforen

JOUW DOEL:
- Help de student hun grootste uitdaging in studie of persoonlijke ontwikkeling te ontdekken
- Stel vragen die hen laten nadenken over specifieke situaties
- Leid hen naar concrete voorbeelden uit hun studieleven
- Help hen de kern van hun uitdaging te begrijpen

JOUW STIJL:
- Begin altijd met een vriendelijke begroeting
- Stel één vraag tegelijk
- Bouw voort op hun antwoorden
- Gebruik "Vertel me eens..." of "Kun je een voorbeeld geven..."
- Eindig met een samenvatting van wat je hebt geleerd over hun uitdaging

VOORBEELDVRAGEN:
- "Vertel me eens over een moment in je studie waarbij je dacht: 'Dit vind ik echt moeilijk'?"
- "Kun je een specifieke situatie beschrijven waarin deze uitdaging zich voordeed?"
- "Wat gebeurde er precies in die situatie?"
- "Hoe voelde je je toen?"
- "Wat denk je dat de onderliggende oorzaak is?"

Houd je antwoorden kort (max 2-3 zinnen) en stel altijd een vervolgvraag.`

export async function POST(request: NextRequest) {
  try {
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables')
      return NextResponse.json(
        { error: 'Gemini API key niet geconfigureerd. Voeg GEMINI_API_KEY toe aan je .env.local bestand.' },
        { status: 500 }
      )
    }

    const { message, conversationHistory = [] } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Ongeldig bericht' },
        { status: 400 }
      )
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // Build conversation context
    let conversationContext = SOCRATES_SYSTEM_PROMPT + '\n\nGESPREKSGESCHIEDENIS:\n'
    
    // Add conversation history
    conversationHistory.forEach((msg: any) => {
      if (msg && msg.role && msg.content) {
        conversationContext += `${msg.role === 'user' ? 'Student' : 'Socrates'}: ${msg.content}\n`
      }
    })
    
    conversationContext += `Student: ${message}\nSocrates:`

    // Generate response
    const result = await model.generateContent(conversationContext)
    
    if (!result.response) {
      throw new Error('Geen response ontvangen van Gemini API')
    }

    const response = result.response.text()

    if (!response) {
      throw new Error('Lege response ontvangen van Gemini API')
    }

    return NextResponse.json({ 
      response: response.trim(),
      success: true 
    })

  } catch (error: any) {
    console.error('Socrates chat error:', error)
    
    // More specific error handling
    let errorMessage = 'Er is een onbekende fout opgetreden bij het gesprek met Socrates'
    
    if (error.message?.includes('API key')) {
      errorMessage = 'API key probleem. Controleer je Gemini API key configuratie.'
    } else if (error.message?.includes('quota')) {
      errorMessage = 'API quota overschreden. Probeer het later opnieuw.'
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      errorMessage = 'Netwerkfout. Controleer je internetverbinding.'
    } else if (error.message) {
      errorMessage = `Fout: ${error.message}`
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}