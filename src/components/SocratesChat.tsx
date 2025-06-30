'use client'

import { useState, useRef, useEffect } from 'react'
import { aiService } from '@/services/AIService'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface SocratesChatProps {
  onInsightGained?: (insight: string) => void
  stepContext?: string
  stepNumber?: number
}

export default function SocratesChat({ onInsightGained, stepContext, stepNumber = 1 }: SocratesChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fallbackWarning, setFallbackWarning] = useState<string | null>(null)
  const [aiStatus, setAiStatus] = useState({ primaryAvailable: true, fallbacksAvailable: 0, totalProviders: 0 })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Step-specific initial messages
  const getInitialMessage = (step: number) => {
    const initialMessages = {
      1: 'Welkom, jonge student! Ik ben Socrates. Laten we samen je grootste uitdaging onderzoeken met behulp van het 6G-model. Dit helpt ons de situatie grondig te begrijpen. Kun je me een specifieke situatie beschrijven waarin je deze uitdaging recent hebt ervaren?',
      2: 'Uitstekend! Nu we je uitdaging kennen, gaan we dieper graven met het kernkwadrant van Ofman. Dit helpt je je sterke punten én je valkuilen te begrijpen. Laten we beginnen: welke sterke eigenschap van jezelf herken je in de uitdagende situatie die je beschreef?',
      3: 'Nu gaan we je leerdoel SMART maken - dat betekent Specifiek, Meetbaar, Acceptabel, Realistisch en Tijdgebonden. Laten we beginnen met het specifiek maken van je doel. Wat wil je precies leren of bereiken?',
      4: 'Laten we je motivatie onderzoeken. Waarom is dit leerdoel belangrijk voor jou? Wat drijft je om hieraan te werken?',
      5: 'Tijd voor zelfreflectie. Als je je huidige vaardigheden op een schaal van 0-10 zou zetten, waar zou je jezelf plaatsen? En waarom niet lager of hoger?',
      6: 'Nu wordt het praktisch! Welke concrete stappen kun je vandaag al zetten om dichter bij je doel te komen? Denk aan kleine, haalbare acties.',
      7: 'Wees eerlijk met jezelf: wat zou je kunnen tegenhouden? Welke obstakels zie je al aankomen? En hoe zou je deze kunnen overwinnen?',
      8: 'Structuur is de sleutel tot succes. Wanneer en waar ga je aan je leerdoel werken? Hoe ga je jezelf eraan herinneren?',
      9: 'Bijna klaar! Hoe ga je je vooruitgang meten? Aan welke signalen merk je dat je op de goede weg bent?'
    }
    return initialMessages[step as keyof typeof initialMessages] || initialMessages[1]
  }

  // Initialize with step-specific message when component mounts or step changes
  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: getInitialMessage(stepNumber),
      timestamp: new Date()
    }])
    
    // Check AI service status
    updateAIStatus()
  }, [stepNumber])

  const updateAIStatus = async () => {
    const status = aiService.getStatus()
    setAiStatus(status)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setError(null)
    setFallbackWarning(null)

    try {
      // Use the new AI service with fallback
      const aiResponse = await aiService.generateResponse(inputMessage.trim(), {
        conversationHistory: messages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        stepContext: stepContext,
        stepNumber: stepNumber
      })

      // Show fallback warning if needed
      if (aiResponse.fallbackUsed && aiResponse.success) {
        setFallbackWarning(`Gebruikt ${aiResponse.provider} (backup systeem)`)
      }

      // Show error if all providers failed
      if (!aiResponse.success) {
        setError(aiResponse.error || 'Alle AI systemen zijn momenteel niet beschikbaar')
      }
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: aiResponse.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // Update AI status
      updateAIStatus()

    } catch (error: any) {
      console.error('Chat error:', error)
      setError(error.message || 'Er ging iets mis bij het versturen van je bericht')
      
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Mijn excuses, er ging iets mis. Kun je je vraag opnieuw stellen? Je kunt ook doorgaan naar de volgende stap.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const extractInsights = () => {
    const userMessages = messages
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content)
      .join(' ')
    
    if (onInsightGained && userMessages.length > 50) {
      onInsightGained(userMessages)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const clearFallbackWarning = () => {
    setFallbackWarning(null)
  }

  // Step-specific titles and descriptions
  const getStepInfo = (step: number) => {
    const stepInfo = {
      1: { 
        title: 'Analyseer je uitdaging met het 6G-model', 
        description: 'Socrates helpt je door gerichte vragen je uitdaging grondig te analyseren: Gebeurtenis, Gevoel, Gedachten, Gedrag, Gevolgen en Gewenst resultaat.' 
      },
      2: { 
        title: 'Ontdek je kernkwaliteiten met het kernkwadrant', 
        description: 'Socrates begeleidt je door het kernkwadrant van Ofman om je sterke punten, valkuilen, uitdagingen en allergieën te herkennen.' 
      },
      3: { 
        title: 'Formuleer een SMART leerdoel', 
        description: 'Socrates stelt gerichte vragen om je doel Specifiek, Meetbaar, Acceptabel, Realistisch en Tijdgebonden te maken.' 
      },
      4: { 
        title: 'Onderzoek je motivatie', 
        description: 'Verken waarom dit doel belangrijk is. Socrates helpt je je drijfveren en motivatie te begrijpen.' 
      },
      5: { 
        title: 'Bepaal je startpunt', 
        description: 'Reflecteer op je huidige niveau. Socrates helpt je realistisch inschatten waar je nu staat.' 
      },
      6: { 
        title: 'Plan concrete acties', 
        description: 'Brainstorm over praktische stappen. Socrates helpt je van ideeën naar uitvoerbare acties te komen.' 
      },
      7: { 
        title: 'Anticipeer obstakels', 
        description: 'Denk na over mogelijke uitdagingen. Socrates helpt je obstakels voorzien en oplossingen bedenken.' 
      },
      8: { 
        title: 'Maak een planning', 
        description: 'Organiseer je leerproces. Socrates helpt je structuur aanbrengen in wanneer, waar en hoe je gaat werken.' 
      },
      9: { 
        title: 'Stel reflectie in', 
        description: 'Plan je evaluatie. Socrates helpt je bedenken hoe je je vooruitgang gaat meten en bijsturen.' 
      }
    }
    return stepInfo[step as keyof typeof stepInfo] || stepInfo[1]
  }

  const stepInfo = getStepInfo(stepNumber)

  if (!isExpanded) {
    return (
      <div className="mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            {/* AI Status Indicator */}
            <div className="relative">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shadow-lg transition-all duration-300 ${
                aiStatus.primaryAvailable 
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600 animate-pulse' 
                  : aiStatus.fallbacksAvailable > 0
                  ? 'bg-gradient-to-br from-yellow-500 to-orange-500'
                  : 'bg-gradient-to-br from-red-500 to-red-600'
              }`}>
                🏛️
              </div>
              
              {/* Status indicator */}
              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                aiStatus.primaryAvailable 
                  ? 'bg-green-500' 
                  : aiStatus.fallbacksAvailable > 0
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}></div>
              
              {/* Floating wisdom particles */}
              {aiStatus.primaryAvailable && (
                <>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                </>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                Stap {stepNumber}: {stepInfo.title}
                {!aiStatus.primaryAvailable && aiStatus.fallbacksAvailable > 0 && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                    Backup modus
                  </span>
                )}
                {aiStatus.fallbacksAvailable === 0 && !aiStatus.primaryAvailable && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    Offline modus
                  </span>
                )}
              </h3>
              <p className="text-sm text-blue-600">{stepInfo.description}</p>
            </div>
          </div>
          
          {/* AI Status Warning */}
          {!aiStatus.primaryAvailable && (
            <div className={`mb-4 p-3 rounded-lg border ${
              aiStatus.fallbacksAvailable > 0 
                ? 'bg-yellow-50 border-yellow-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <p className={`text-sm ${
                aiStatus.fallbacksAvailable > 0 
                  ? 'text-yellow-700' 
                  : 'text-red-700'
              }`}>
                {aiStatus.fallbacksAvailable > 0 
                  ? '⚠️ Primaire AI is niet beschikbaar. Backup systeem actief.'
                  : '🔴 AI systemen zijn niet beschikbaar. Statische vragen beschikbaar.'
                }
              </p>
            </div>
          )}
          
          <p className="text-gray-700 text-sm mb-4">
            {stepInfo.description}
          </p>
          <button
            onClick={() => setIsExpanded(true)}
            className="btn btn-primary hover:scale-105 transition-transform"
          >
            🗣️ Start gesprek met Socrates
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* Header with AI Status */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* AI Status Avatar */}
              <div className="relative">
                <div className={`w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${
                  isLoading ? 'animate-pulse scale-110' : 'hover:scale-105'
                }`}>
                  🏛️
                </div>
                
                {/* Status indicator */}
                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white ${
                  aiStatus.primaryAvailable 
                    ? 'bg-green-400' 
                    : aiStatus.fallbacksAvailable > 0
                    ? 'bg-yellow-400'
                    : 'bg-red-400'
                }`}></div>
                
                {/* Thinking animation when loading */}
                {isLoading && (
                  <>
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-300 rounded-full animate-bounce opacity-80"></div>
                    <div className="absolute -top-3 right-0 w-2 h-2 bg-yellow-200 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                    <div className="absolute -top-1 -right-3 w-1 h-1 bg-yellow-100 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  Socrates - Stap {stepNumber}
                  {isLoading && (
                    <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full animate-pulse">
                      denkt na...
                    </span>
                  )}
                  {!aiStatus.primaryAvailable && aiStatus.fallbacksAvailable > 0 && (
                    <span className="text-xs bg-yellow-400 bg-opacity-20 px-2 py-1 rounded-full">
                      backup
                    </span>
                  )}
                </h3>
                <p className="text-sm opacity-90">{stepInfo.title}</p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200 hover:scale-110"
              title="Gesprek minimaliseren"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 animate-slideIn">
            <div className="flex items-center justify-between">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-600 transition-colors hover:scale-110"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Fallback Warning Banner */}
        {fallbackWarning && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 animate-slideIn">
            <div className="flex items-center justify-between">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">{fallbackWarning}</p>
                </div>
              </div>
              <button
                onClick={clearFallbackWarning}
                className="text-yellow-400 hover:text-yellow-600 transition-colors hover:scale-110"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                    : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 shadow-md border border-gray-200'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs">🏛️</span>
                    <span className="text-xs font-medium text-blue-600">Socrates</span>
                    {!aiStatus.primaryAvailable && (
                      <span className="text-xs bg-yellow-100 text-yellow-600 px-1 rounded">backup</span>
                    )}
                  </div>
                )}
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString('nl-NL', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 px-4 py-2 rounded-lg max-w-xs shadow-md border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg animate-bounce">🏛️</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 animate-pulse">Socrates overweegt zijn woorden...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Typ je antwoord aan Socrates..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 focus:scale-105"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          
          {/* AI Status Info */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  aiStatus.primaryAvailable 
                    ? 'bg-green-500' 
                    : aiStatus.fallbacksAvailable > 0
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}></div>
                <span>
                  {aiStatus.primaryAvailable 
                    ? 'AI volledig operationeel'
                    : aiStatus.fallbacksAvailable > 0
                    ? `Backup systeem actief (${aiStatus.fallbacksAvailable} beschikbaar)`
                    : 'Offline modus - statische vragen'
                  }
                </span>
              </div>
              
              {messages.filter(m => m.role === 'user').length > 2 && (
                <button
                  onClick={extractInsights}
                  className="text-purple-600 hover:text-purple-700 font-medium transition-all duration-200 hover:scale-105 flex items-center gap-1"
                >
                  <span className="animate-pulse">💡</span>
                  Gebruik inzichten
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}