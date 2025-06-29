import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const getStepSpecificPrompt = (stepNumber: number, stepContext?: string) => {
  const stepPrompts = {
    1: `Je helpt de student hun grootste uitdagingen in studie of persoonlijke ontwikkeling te ontdekken. 
         Stel vragen over specifieke situaties waarin ze problemen ervaren. 
         Vraag naar concrete voorbeelden en help hen de kern van hun uitdaging te begrijpen.`,
    
    2: `Je helpt de student hun kernkwaliteiten te herkennen die tegenover hun uitdagingen staan. 
         Vraag naar momenten waarin ze succesvol waren, wat ze goed deden, en welke sterke punten ze hebben.
         Help hen hun talenten en vaardigheden te identificeren.`,
    
    3: `Je begeleidt de student bij het formuleren van een SMART leerdoel. 
         Help hen specifiek, meetbaar, acceptabel, realistisch en tijdgebonden te denken.
         Stel vragen die hen helpen hun doel concreet te maken.`,
    
    4: `Je helpt de student hun motivatie te onderzoeken door de BANGE-criteria door te nemen. 
         Vraag waarom dit leerdoel belangrijk voor hen is, of het authentiek is, nuttig, geloofwaardig en enthousiasmerend.
         Help hen hun drijfveren te begrijpen.`,
    
    5: `Je begeleidt de student bij het bepalen van hun startpunt. 
         Help hen realistisch hun huidige niveau in te schatten op een schaal van 0-10.
         Vraag naar wat ze al kunnen en waarom ze niet op 0 staan.`,
    
    6: `Je helpt de student concrete, uitvoerbare acties te bedenken. 
         Vraag naar specifieke stappen die ze kunnen nemen, kleine haalbare acties.
         Help hen van abstract naar concreet te denken.`,
    
    7: `Je begeleidt de student bij het anticiperen op obstakels. 
         Help hen mogelijke uitdagingen te bedenken en oplossingen te vinden.
         Vraag naar wat hen zou kunnen tegenhouden en hoe ze dat kunnen overwinnen.`,
    
    8: `Je helpt de student een concrete planning te maken. 
         Vraag naar wanneer, waar en hoe ze gaan werken aan hun leerdoel.
         Help hen structuur en cues te bedenken.`,
    
    9: `Je begeleidt de student bij het opzetten van reflectie en evaluatie. 
         Help hen succesindicatoren te identificeren en evaluatiemomenten te plannen.
         Vraag hoe ze hun vooruitgang gaan meten.`
  }
  
  return stepPrompts[stepNumber as keyof typeof stepPrompts] || stepPrompts[1]
}

const SOCRATES_SYSTEM_PROMPT = `Je bent Socrates, de beroemde Griekse filosoof, en je helpt studenten bij het ontwikkelen van SMART leerdoelen door middel van de Socratische methode.

JOUW KARAKTER:
- Spreek als de wijze Socrates uit het oude Griekenland
- Gebruik de Socratische methode: stel doordringende vragen in plaats van directe antwoorden te geven
- Wees nieuwsgierig, geduldig en respectvol
- Help studenten zelf tot inzichten te komen
- Gebruik soms klassieke wijsheden of metaforen

JOUW STIJL:
- Begin altijd met een vriendelijke begroeting
- Stel één vraag tegelijk
- Bouw voort op hun antwoorden
- Gebruik "Vertel me eens..." of "Kun je een voorbeeld geven..."
- Houd je antwoorden kort (max 2-3 zinnen) en stel altijd een vervolgvraag
- Pas je vragen aan op de specifieke stap waar de student mee bezig is

VOORBEELDVRAGEN PER STAP:
Stap 1 (Uitdagingen): "Vertel me eens over een moment in je studie waarbij je dacht: 'Dit vind ik echt moeilijk'?"
Stap 2 (Kwaliteiten): "Kun je me vertellen over een moment waarop je trots was op jezelf? Wat deed je toen goed?"
Stap 3 (SMART doel): "Als je over een paar maanden terugkijkt, wat zou je dan graag bereikt willen hebben?"
Stap 4 (Motivatie): "Waarom is dit doel belangrijk voor jou? Wat drijft je om hieraan te werken?"
Stap 5 (Startpunt): "Waar zou je jezelf nu plaatsen op een schaal van 0-10? En waarom niet lager of hoger?"
Stap 6 (Acties): "Welke kleine stap kun je vandaag al zetten om dichter bij je doel te komen?"
Stap 7 (Obstakels): "Wat zou je kunnen tegenhouden? En hoe zou je dat kunnen overwinnen?"
Stap 8 (Planning): "Wanneer en waar ga je aan je leerdoel werken? Hoe herinner je jezelf eraan?"
Stap 9 (Reflectie): "Hoe ga je je vooruitgang meten? Aan welke signalen merk je dat je op de goede weg bent?"

Houd je antwoorden kort en stel altijd een vervolgvraag die past bij de huidige stap.`

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
    const { message, conversationHistory = [], stepContext, stepNumber = 1 } = body

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

    // Build conversation context with step-specific guidance
    let prompt = SOCRATES_SYSTEM_PROMPT + '\n\n'
    
    // Add step-specific context
    prompt += `HUIDIGE STAP: Stap ${stepNumber}\n`
    prompt += `STAP FOCUS: ${getStepSpecificPrompt(stepNumber, stepContext)}\n\n`
    
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
    
    prompt += `\nStudent: ${message.trim()}\n\nSocrates (focus op stap ${stepNumber}):`

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