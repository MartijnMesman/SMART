// AI Service with comprehensive fallback system
interface AIProvider {
  name: string
  generateResponse(prompt: string, context?: any): Promise<string>
  isAvailable(): Promise<boolean>
  getCost(): number // Cost per request in credits
}

interface AIResponse {
  response: string
  provider: string
  success: boolean
  fallbackUsed: boolean
  error?: string
}

class GeminiProvider implements AIProvider {
  name = 'Gemini'
  private apiKey: string
  private retryCount = 0
  private maxRetries = 3

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch('/api/socrates-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: 'test', 
          stepNumber: 1,
          isHealthCheck: true 
        })
      })
      return response.ok
    } catch {
      return false
    }
  }

  async generateResponse(prompt: string, context?: any): Promise<string> {
    const response = await fetch('/api/socrates-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: prompt,
        conversationHistory: context?.conversationHistory || [],
        stepContext: context?.stepContext,
        stepNumber: context?.stepNumber || 1
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }

    const data = await response.json()
    return data.response
  }

  getCost(): number {
    return 1 // 1 credit per request
  }
}

class StaticResponseProvider implements AIProvider {
  name = 'Static Fallback'
  
  private stepResponses = {
    1: [
      "Kun je me meer vertellen over deze specifieke situatie? Wat gebeurde er precies?",
      "Interessant. Welke emoties voelde je toen dit gebeurde?",
      "Wat voor gedachten gingen er door je hoofd op dat moment?",
      "Hoe reageerde je in deze situatie? Wat deed je precies?",
      "Wat was het gevolg van je reactie? Hoe voelde dat?",
      "Hoe zou je het graag anders hebben aangepakt?"
    ],
    2: [
      "Welke sterke eigenschap van jezelf herken je in deze situatie?",
      "Kun je me een voorbeeld geven van wanneer deze kwaliteit je goed van pas kwam?",
      "Wanneer slaat deze kwaliteit door? Wat gebeurt er als je hierin doorschiet?",
      "Wat zou je willen ontwikkelen om meer in balans te komen?",
      "Welk gedrag van anderen irriteert je het meest?"
    ],
    3: [
      "Wat wil je precies leren of bereiken? Kun je me een concreet voorbeeld geven?",
      "Hoe ga je meten of je dit bereikt? Wat zou een duidelijk teken van succes zijn?",
      "Waarom is dit doel belangrijk voor jou? Wat motiveert je?",
      "Is dit haalbaar voor jou? Welke middelen heb je nodig?",
      "Wanneer wil je dit bereikt hebben? Wat is een realistische tijdlijn?"
    ],
    4: [
      "Waarom is dit leerdoel belangrijk voor jou?",
      "Wat drijft je om hieraan te werken?",
      "Hoe past dit bij je waarden en ambities?"
    ],
    5: [
      "Waar zou je jezelf nu plaatsen op een schaal van 0-10?",
      "Waarom sta je niet op 0? Wat kun je al?",
      "Wat zou je naar een hoger niveau brengen?"
    ],
    6: [
      "Welke kleine stap kun je vandaag al zetten?",
      "Wat is de eerste concrete actie die je kunt ondernemen?",
      "Hoe ga je deze acties in je routine inbouwen?"
    ],
    7: [
      "Wat zou je kunnen tegenhouden?",
      "Welke obstakels zie je al aankomen?",
      "Hoe zou je deze uitdagingen kunnen overwinnen?"
    ],
    8: [
      "Wanneer ga je aan je leerdoel werken?",
      "Waar ga je dit doen?",
      "Hoe herinner je jezelf eraan?"
    ],
    9: [
      "Hoe ga je je vooruitgang meten?",
      "Aan welke signalen merk je dat je op de goede weg bent?",
      "Wanneer ga je evalueren hoe het gaat?"
    ]
  }

  private responseIndex = new Map<number, number>()

  async isAvailable(): Promise<boolean> {
    return true // Always available
  }

  async generateResponse(prompt: string, context?: any): Promise<string> {
    const stepNumber = context?.stepNumber || 1
    const responses = this.stepResponses[stepNumber as keyof typeof this.stepResponses] || this.stepResponses[1]
    
    // Get current index for this step
    const currentIndex = this.responseIndex.get(stepNumber) || 0
    const response = responses[currentIndex % responses.length]
    
    // Increment index for next time
    this.responseIndex.set(stepNumber, currentIndex + 1)
    
    // Add some variation based on user input
    const variations = [
      "Dat is een interessante gedachte. ",
      "Ik begrijp je. ",
      "Dank je voor het delen. ",
      "Dat klinkt uitdagend. ",
      ""
    ]
    
    const variation = variations[Math.floor(Math.random() * variations.length)]
    return variation + response
  }

  getCost(): number {
    return 0 // Free
  }
}

class OpenAIFallbackProvider implements AIProvider {
  name = 'OpenAI Fallback'
  private apiKey?: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey
  }

  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) return false
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 1
        })
      })
      return response.ok
    } catch {
      return false
    }
  }

  async generateResponse(prompt: string, context?: any): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const systemPrompt = this.getSystemPrompt(context?.stepNumber || 1)
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'Ik kan je vraag niet beantwoorden.'
  }

  private getSystemPrompt(stepNumber: number): string {
    const prompts = {
      1: "Je bent Socrates en helpt studenten hun uitdagingen analyseren met het 6G-model. Stel korte, doordringende vragen.",
      2: "Je bent Socrates en helpt studenten hun kernkwaliteiten ontdekken met het kernkwadrant van Ofman.",
      3: "Je bent Socrates en helpt studenten SMART leerdoelen formuleren door gerichte vragen te stellen.",
      // ... meer prompts voor andere stappen
    }
    
    return prompts[stepNumber as keyof typeof prompts] || prompts[1]
  }

  getCost(): number {
    return 2 // 2 credits per request (more expensive than Gemini)
  }
}

export class AIService {
  private providers: AIProvider[] = []
  private currentProviderIndex = 0
  private failureCount = new Map<string, number>()
  private lastFailureTime = new Map<string, number>()
  private circuitBreakerThreshold = 3
  private circuitBreakerTimeout = 300000 // 5 minutes

  constructor() {
    this.initializeProviders()
  }

  private initializeProviders() {
    // Primary provider: Gemini
    const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY
    if (geminiKey) {
      this.providers.push(new GeminiProvider(geminiKey))
    }

    // Secondary provider: OpenAI (if configured)
    const openaiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY
    if (openaiKey) {
      this.providers.push(new OpenAIFallbackProvider(openaiKey))
    }

    // Always available fallback
    this.providers.push(new StaticResponseProvider())
  }

  private isCircuitBreakerOpen(providerName: string): boolean {
    const failures = this.failureCount.get(providerName) || 0
    const lastFailure = this.lastFailureTime.get(providerName) || 0
    const now = Date.now()

    // Reset circuit breaker after timeout
    if (now - lastFailure > this.circuitBreakerTimeout) {
      this.failureCount.set(providerName, 0)
      return false
    }

    return failures >= this.circuitBreakerThreshold
  }

  private recordFailure(providerName: string) {
    const currentFailures = this.failureCount.get(providerName) || 0
    this.failureCount.set(providerName, currentFailures + 1)
    this.lastFailureTime.set(providerName, Date.now())
  }

  private recordSuccess(providerName: string) {
    this.failureCount.set(providerName, 0)
  }

  async generateResponse(prompt: string, context?: any): Promise<AIResponse> {
    let lastError: Error | null = null
    let fallbackUsed = false

    // Try each provider in order
    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[i]
      
      // Skip if circuit breaker is open
      if (this.isCircuitBreakerOpen(provider.name)) {
        console.warn(`Circuit breaker open for ${provider.name}, skipping`)
        continue
      }

      try {
        // Check if provider is available (with timeout)
        const isAvailable = await Promise.race([
          provider.isAvailable(),
          new Promise<boolean>((_, reject) => 
            setTimeout(() => reject(new Error('Availability check timeout')), 5000)
          )
        ])

        if (!isAvailable) {
          throw new Error(`${provider.name} is not available`)
        }

        // Generate response (with timeout)
        const response = await Promise.race([
          provider.generateResponse(prompt, context),
          new Promise<string>((_, reject) => 
            setTimeout(() => reject(new Error('Response timeout')), 30000)
          )
        ])

        // Success!
        this.recordSuccess(provider.name)
        
        return {
          response,
          provider: provider.name,
          success: true,
          fallbackUsed: i > 0 // True if not using primary provider
        }

      } catch (error) {
        console.error(`${provider.name} failed:`, error)
        lastError = error as Error
        this.recordFailure(provider.name)
        
        // If this is not the last provider, continue to next
        if (i < this.providers.length - 1) {
          fallbackUsed = true
          continue
        }
      }
    }

    // All providers failed
    return {
      response: "Ik ondervind momenteel technische problemen. Probeer het over een paar minuten opnieuw, of ga door naar de volgende stap.",
      provider: 'Error Fallback',
      success: false,
      fallbackUsed: true,
      error: lastError?.message || 'All AI providers failed'
    }
  }

  // Health check for monitoring
  async healthCheck(): Promise<{
    providers: Array<{
      name: string
      available: boolean
      circuitBreakerOpen: boolean
      failures: number
    }>
  }> {
    const results = await Promise.all(
      this.providers.map(async (provider) => ({
        name: provider.name,
        available: await provider.isAvailable().catch(() => false),
        circuitBreakerOpen: this.isCircuitBreakerOpen(provider.name),
        failures: this.failureCount.get(provider.name) || 0
      }))
    )

    return { providers: results }
  }

  // Get current status for UI
  getStatus(): {
    primaryAvailable: boolean
    fallbacksAvailable: number
    totalProviders: number
  } {
    const primaryAvailable = this.providers.length > 0 && 
      !this.isCircuitBreakerOpen(this.providers[0].name)
    
    const fallbacksAvailable = this.providers.slice(1).filter(
      provider => !this.isCircuitBreakerOpen(provider.name)
    ).length

    return {
      primaryAvailable,
      fallbacksAvailable,
      totalProviders: this.providers.length
    }
  }
}

// Singleton instance
export const aiService = new AIService()