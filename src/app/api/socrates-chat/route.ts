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
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error('GEMINI_API_KEY not found in environment variables')
      return NextResponse.json(
        { error: 'Gemini API key niet geconfigureerd. Voeg GEMINI_API_KEY toe aan je .env.local bestand en herstart de server.' },
        { status: 500 }
      )
    }

    // Validate API key format
    if (!apiKey.startsWith('AIza')) {
      console.error('Invalid GEMINI_API_KEY format')
      return NextResponse.json(
        { error: 'Ongeldige Gemini API key format. Controleer je API key.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { message, conversationHistory = [] } = body

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Ongeldig bericht' },
        { status: 400 }
      )
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      }
    })

    // Build conversation context
    let prompt = SOCRATES_SYSTEM_PROMPT + '\n\n'
    
    // Add conversation history if exists
    if (conversationHistory.length > 0) {
      prompt += 'GESPREKGESCHIEDENIS:\n'
      conversationHistory.forEach((msg: any) => {
        if (msg && msg.role && msg.content) {
          const role = msg.role === 'user' ? 'Student' : 'Socrates'
          prompt += `${role}: ${msg.content}\n`
        }
      })
    }
    
    prompt += `\nStudent: ${message.trim()}\n\nSocrates:`

    // Generate response with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    try {
      const result = await model.generateContent(prompt)
      clearTimeout(timeoutId)
      
      if (!result.response) {
        throw new Error('Geen response ontvangen van Gemini API')
      }

      const responseText = result.response.text()

      if (!responseText || responseText.trim().length === 0) {
        throw new Error('Lege response ontvangen van Gemini API')
      }

      return NextResponse.json({ 
        response: responseText.trim(),
        success: true 
      })

    } catch (generateError: any) {
      clearTimeout(timeoutId)
      throw generateError
    }

  } catch (error: any) {
    console.error('Socrates chat error:', error)
    
    // More specific error handling
    let errorMessage = 'Er is een onbekende fout opgetreden bij het gesprek met Socrates'
    let statusCode = 500
    
    if (error.message?.includes('API key')) {
      errorMessage = 'API key probleem. Controleer je Gemini API key configuratie.'
      statusCode = 401
    } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
      errorMessage = 'API quota overschreden. Probeer het later opnieuw.'
      statusCode = 429
    } else if (error.message?.includes('network') || error.message?.includes('fetch') || error.name === 'AbortError') {
      errorMessage = 'Netwerkfout of timeout. Controleer je internetverbinding en probeer opnieuw.'
      statusCode = 503
    } else if (error.message?.includes('Invalid API key')) {
      errorMessage = 'Ongeldige API key. Controleer je Gemini API key.'
      statusCode = 401
    } else if (error.message) {
      errorMessage = `Fout: ${error.message}`
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
}