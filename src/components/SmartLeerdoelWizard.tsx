'use client'

import { useState } from 'react'

interface SmartLeerdoelWizardProps {
  onBack: () => void
}

interface FormData {
  // Stap 1: Uitdagingen
  uitdagingen: string[]
  
  // Stap 2: Kernkwaliteiten
  kernkwaliteiten: string[]
  
  // Stap 3: BANGE check
  bangeCheck: {
    bewust: boolean
    acceptabel: boolean
    nodig: boolean
    gewenst: boolean
    energiek: boolean
  }
  
  // Stap 4: SMART leerdoel
  smartLeerdoel: {
    specifiek: string
    meetbaar: string
    acceptabel: string
    realistisch: string
    tijdgebonden: string
  }
  
  // Stap 5: Startpunt
  startpunt: number
  
  // Stap 6: Acties
  acties: string[]
  
  // Stap 7: Obstakels
  obstakels: string[]
  
  // Stap 8: Planning
  planning: {
    wanneer: string
    waar: string
    cues: string[]
  }
  
  // Stap 9: Reflectie
  reflectie: {
    evaluatieMoment: string
    succesIndicatoren: string[]
  }
}

const initialFormData: FormData = {
  uitdagingen: [],
  kernkwaliteiten: [],
  bangeCheck: {
    bewust: false,
    acceptabel: false,
    nodig: false,
    gewenst: false,
    energiek: false
  },
  smartLeerdoel: {
    specifiek: '',
    meetbaar: '',
    acceptabel: '',
    realistisch: '',
    tijdgebonden: ''
  },
  startpunt: 5,
  acties: [],
  obstakels: [],
  planning: {
    wanneer: '',
    waar: '',
    cues: []
  },
  reflectie: {
    evaluatieMoment: '',
    succesIndicatoren: []
  }
}

export default function SmartLeerdoelWizard({ onBack }: SmartLeerdoelWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [tempInput, setTempInput] = useState('')

  const totalSteps = 9

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const addToArray = (field: keyof FormData, value: string) => {
    if (value.trim()) {
      const currentArray = formData[field] as string[]
      updateFormData({ [field]: [...currentArray, value.trim()] })
      setTempInput('')
    }
  }

  const removeFromArray = (field: keyof FormData, index: number) => {
    const currentArray = formData[field] as string[]
    updateFormData({ [field]: currentArray.filter((_, i) => i !== index) })
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const generateSummary = () => {
    const bangeScore = Object.values(formData.bangeCheck).filter(Boolean).length
    const smartComplete = Object.values(formData.smartLeerdoel).every(v => v.trim() !== '')
    
    return {
      bangeScore,
      smartComplete,
      totalActions: formData.acties.length,
      totalObstacles: formData.obstakels.length,
      hasPlan: formData.planning.wanneer && formData.planning.waar
    }
  }

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-purple-700">Stap {currentStep} van {totalSteps}</span>
        <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% voltooid</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  )

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <div className="hero-icon">🤔</div>
            <h2 className="step-title">Stap 1: Bewust worden van uitdagingen</h2>
            
            <div className="info-box blue">
              <h3>💡 Waarom deze stap?</h3>
              <p className="text-gray-700">
                Door je uitdagingen bewust te maken, krijg je inzicht in waar je wilt groeien. 
                Dit vormt de basis voor een effectief leerdoel.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">
                Welke uitdagingen ervaar je momenteel in je studie of persoonlijke ontwikkeling?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="form-input"
                  value={tempInput}
                  onChange={(e) => setTempInput(e.target.value)}
                  placeholder="Bijvoorbeeld: tijdmanagement, presenteren, concentratie..."
                  onKeyPress={(e) => e.key === 'Enter' && addToArray('uitdagingen', tempInput)}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => addToArray('uitdagingen', tempInput)}
                >
                  Toevoegen
                </button>
              </div>
            </div>

            {formData.uitdagingen.length > 0 && (
              <div className="card">
                <h4 className="font-medium text-gray-800 mb-3">Jouw uitdagingen:</h4>
                <div className="space-y-2">
                  {formData.uitdagingen.map((uitdaging, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                      <span className="text-gray-700">{uitdaging}</span>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => removeFromArray('uitdagingen', index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div>
            <div className="hero-icon">💪</div>
            <h2 className="step-title">Stap 2: Kernkwaliteiten herkennen</h2>
            
            <div className="info-box green">
              <h3>🌟 Waarom deze stap?</h3>
              <p className="text-gray-700">
                Je kernkwaliteiten zijn je sterke punten. Door deze te herkennen, kun je ze inzetten 
                om je uitdagingen aan te pakken en je leerdoel te bereiken.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">
                Wat zijn jouw kernkwaliteiten?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="form-input"
                  value={tempInput}
                  onChange={(e) => setTempInput(e.target.value)}
                  placeholder="Bijvoorbeeld: doorzettingsvermogen, creativiteit, empathie..."
                  onKeyPress={(e) => e.key === 'Enter' && addToArray('kernkwaliteiten', tempInput)}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => addToArray('kernkwaliteiten', tempInput)}
                >
                  Toevoegen
                </button>
              </div>
            </div>

            {formData.kernkwaliteiten.length > 0 && (
              <div className="card">
                <h4 className="font-medium text-gray-800 mb-3">Jouw kernkwaliteiten:</h4>
                <div className="space-y-2">
                  {formData.kernkwaliteiten.map((kwaliteit, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                      <span className="text-gray-700">{kwaliteit}</span>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => removeFromArray('kernkwaliteiten', index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div>
            <div className="hero-icon">✅</div>
            <h2 className="step-title">Stap 3: BANGE-check</h2>
            
            <div className="info-box yellow">
              <h3>🎯 Wat is de BANGE-check?</h3>
              <p className="text-gray-700">
                De BANGE-check helpt je te bepalen of je leerdoel de juiste motivatie heeft. 
                Hoe meer vakjes je kunt aanvinken, hoe groter de kans op succes.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { key: 'bewust', label: 'Bewust', description: 'Ben je je bewust van waarom dit leerdoel belangrijk is?' },
                { key: 'acceptabel', label: 'Acceptabel', description: 'Vind je het acceptabel om tijd en energie in dit doel te investeren?' },
                { key: 'nodig', label: 'Nodig', description: 'Is dit leerdoel echt nodig voor jouw ontwikkeling?' },
                { key: 'gewenst', label: 'Gewenst', description: 'Wil je dit leerdoel echt bereiken?' },
                { key: 'energiek', label: 'Energiek', description: 'Geeft het denken aan dit leerdoel je energie?' }
              ].map(({ key, label, description }) => (
                <div key={key} className="checkbox-group">
                  <input
                    type="checkbox"
                    id={key}
                    className="checkbox mt-1"
                    checked={formData.bangeCheck[key as keyof typeof formData.bangeCheck]}
                    onChange={(e) => updateFormData({
                      bangeCheck: { ...formData.bangeCheck, [key]: e.target.checked }
                    })}
                  />
                  <div>
                    <label htmlFor={key} className="checkbox-label">{label}</label>
                    <p className="checkbox-description text-sm">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="card mt-6">
              <h4 className="font-medium text-gray-800 mb-2">Jouw BANGE-score:</h4>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-purple-600">
                  {Object.values(formData.bangeCheck).filter(Boolean).length}/5
                </span>
                <span className="text-gray-600">
                  {Object.values(formData.bangeCheck).filter(Boolean).length >= 4 
                    ? '🎉 Uitstekende motivatie!' 
                    : Object.values(formData.bangeCheck).filter(Boolean).length >= 3
                    ? '👍 Goede motivatie'
                    : '⚠️ Overweeg je motivatie nog eens'
                  }
                </span>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div>
            <div className="hero-icon">🎯</div>
            <h2 className="step-title">Stap 4: SMART leerdoel formuleren</h2>
            
            <div className="info-box purple">
              <h3>📝 SMART criteria</h3>
              <p className="text-gray-700">
                Een SMART leerdoel is Specifiek, Meetbaar, Acceptabel, Realistisch en Tijdgebonden. 
                Vul elk onderdeel zorgvuldig in.
              </p>
            </div>

            <div className="space-y-4">
              <div className="form-group">
                <label className="form-label">
                  <span className="smart-circle complete">S</span>
                  Specifiek - Wat wil je precies leren of bereiken?
                </label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={formData.smartLeerdoel.specifiek}
                  onChange={(e) => updateFormData({
                    smartLeerdoel: { ...formData.smartLeerdoel, specifiek: e.target.value }
                  })}
                  placeholder="Bijvoorbeeld: Ik wil mijn presentatievaardigheden verbeteren door..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="smart-circle complete">M</span>
                  Meetbaar - Hoe ga je meten of je je doel hebt bereikt?
                </label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={formData.smartLeerdoel.meetbaar}
                  onChange={(e) => updateFormData({
                    smartLeerdoel: { ...formData.smartLeerdoel, meetbaar: e.target.value }
                  })}
                  placeholder="Bijvoorbeeld: Ik kan een 10-minuten presentatie geven zonder..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="smart-circle complete">A</span>
                  Acceptabel - Waarom is dit doel belangrijk voor jou?
                </label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={formData.smartLeerdoel.acceptabel}
                  onChange={(e) => updateFormData({
                    smartLeerdoel: { ...formData.smartLeerdoel, acceptabel: e.target.value }
                  })}
                  placeholder="Bijvoorbeeld: Ik wil graag mijn ideeën op een heldere manier overbrengen op andere professionals..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="smart-circle complete">R</span>
                  Realistisch - Is dit doel haalbaar én voldoende uitdagend voor jou?
                </label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={formData.smartLeerdoel.realistisch}
                  onChange={(e) => updateFormData({
                    smartLeerdoel: { ...formData.smartLeerdoel, realistisch: e.target.value }
                  })}
                  placeholder="Bijvoorbeeld: Ja, want ik heb toegang tot... en kan oefenen door..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="smart-circle complete">T</span>
                  Tijdgebonden - Wanneer wil je dit doel bereikt hebben?
                </label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={formData.smartLeerdoel.tijdgebonden}
                  onChange={(e) => updateFormData({
                    smartLeerdoel: { ...formData.smartLeerdoel, tijdgebonden: e.target.value }
                  })}
                  placeholder="Bijvoorbeeld: Binnen 8 weken, voor het einde van dit semester..."
                />
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div>
            <div className="hero-icon">📊</div>
            <h2 className="step-title">Stap 5: Startpunt bepalen</h2>
            
            <div className="info-box blue">
              <h3>📈 Waarom je startpunt bepalen?</h3>
              <p className="text-gray-700">
                Door je huidige niveau in te schatten, kun je je vooruitgang beter meten en 
                realistische verwachtingen stellen.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">
                Op een schaal van 0-10, waar sta je nu met betrekking tot je leerdoel?
              </label>
              <div className="range-container">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={formData.startpunt}
                  onChange={(e) => updateFormData({ startpunt: parseInt(e.target.value) })}
                  className="range-input"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>0 - Helemaal niet</span>
                  <span className="font-bold text-purple-600 text-lg">{formData.startpunt}</span>
                  <span>10 - Volledig beheerst</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h4 className="font-medium text-gray-800 mb-2">Jouw startpunt: {formData.startpunt}/10</h4>
              <p className="text-gray-600">
                {formData.startpunt <= 3 && "Je staat aan het begin van je leertraject. Dat is prima - iedereen begint ergens!"}
                {formData.startpunt >= 4 && formData.startpunt <= 6 && "Je hebt al een goede basis. Nu is het tijd om verder te bouwen."}
                {formData.startpunt >= 7 && formData.startpunt <= 8 && "Je bent al goed op weg! Focus op verfijning en verdieping."}
                {formData.startpunt >= 9 && "Je bent al ver gevorderd. Zoek naar uitdagende aspecten om te perfectioneren."}
              </p>
            </div>
          </div>
        )

      case 6:
        return (
          <div>
            <div className="hero-icon">🚀</div>
            <h2 className="step-title">Stap 6: Concrete acties plannen</h2>
            
            <div className="info-box green">
              <h3>⚡ Van doel naar actie</h3>
              <p className="text-gray-700">
                Concrete acties maken je leerdoel werkbaar. Denk aan specifieke stappen die je kunt nemen.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">
                Welke concrete acties ga je ondernemen om je leerdoel te bereiken?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="form-input"
                  value={tempInput}
                  onChange={(e) => setTempInput(e.target.value)}
                  placeholder="Bijvoorbeeld: Elke week een presentatie oefenen voor de spiegel..."
                  onKeyPress={(e) => e.key === 'Enter' && addToArray('acties', tempInput)}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => addToArray('acties', tempInput)}
                >
                  Toevoegen
                </button>
              </div>
            </div>

            {formData.acties.length > 0 && (
              <div className="card">
                <h4 className="font-medium text-gray-800 mb-3">Jouw acties:</h4>
                <div className="space-y-2">
                  {formData.acties.map((actie, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                      <span className="text-gray-700">{actie}</span>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => removeFromArray('acties', index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 7:
        return (
          <div>
            <div className="hero-icon">⚠️</div>
            <h2 className="step-title">Stap 7: Obstakels anticiperen</h2>
            
            <div className="info-box yellow">
              <h3>🛡️ Voorbereid zijn op uitdagingen</h3>
              <p className="text-gray-700">
                Door mogelijke obstakels van tevoren te bedenken, kun je er beter mee omgaan als ze zich voordoen.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">
                Welke obstakels of uitdagingen zou je kunnen tegenkomen?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="form-input"
                  value={tempInput}
                  onChange={(e) => setTempInput(e.target.value)}
                  placeholder="Bijvoorbeeld: Gebrek aan tijd, zenuwen, technische problemen..."
                  onKeyPress={(e) => e.key === 'Enter' && addToArray('obstakels', tempInput)}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => addToArray('obstakels', tempInput)}
                >
                  Toevoegen
                </button>
              </div>
            </div>

            {formData.obstakels.length > 0 && (
              <div className="card">
                <h4 className="font-medium text-gray-800 mb-3">Mogelijke obstakels:</h4>
                <div className="space-y-2">
                  {formData.obstakels.map((obstakel, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                      <span className="text-gray-700">{obstakel}</span>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => removeFromArray('obstakels', index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 8:
        return (
          <div>
            <div className="hero-icon">📅</div>
            <h2 className="step-title">Stap 8: Planning & cues instellen</h2>
            
            <div className="info-box purple">
              <h3>⏰ Structuur voor succes</h3>
              <p className="text-gray-700">
                Een goede planning en duidelijke cues helpen je om consistent aan je leerdoel te werken.
              </p>
            </div>

            <div className="space-y-4">
              <div className="form-group">
                <label className="form-label">Wanneer ga je aan je leerdoel werken?</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.planning.wanneer}
                  onChange={(e) => updateFormData({
                    planning: { ...formData.planning, wanneer: e.target.value }
                  })}
                  placeholder="Bijvoorbeeld: Elke dinsdag en donderdag van 19:00-20:00"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Waar ga je aan je leerdoel werken?</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.planning.waar}
                  onChange={(e) => updateFormData({
                    planning: { ...formData.planning, waar: e.target.value }
                  })}
                  placeholder="Bijvoorbeeld: In mijn kamer, in de bibliotheek, online..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Welke cues of herinneringen ga je instellen?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="form-input"
                    value={tempInput}
                    onChange={(e) => setTempInput(e.target.value)}
                    placeholder="Bijvoorbeeld: Alarm op telefoon, notitie op bureau..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && tempInput.trim()) {
                        updateFormData({
                          planning: { 
                            ...formData.planning, 
                            cues: [...formData.planning.cues, tempInput.trim()] 
                          }
                        })
                        setTempInput('')
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      if (tempInput.trim()) {
                        updateFormData({
                          planning: { 
                            ...formData.planning, 
                            cues: [...formData.planning.cues, tempInput.trim()] 
                          }
                        })
                        setTempInput('')
                      }
                    }}
                  >
                    Toevoegen
                  </button>
                </div>
              </div>

              {formData.planning.cues.length > 0 && (
                <div className="card">
                  <h4 className="font-medium text-gray-800 mb-3">Jouw cues:</h4>
                  <div className="space-y-2">
                    {formData.planning.cues.map((cue, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                        <span className="text-gray-700">{cue}</span>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => {
                            const newCues = formData.planning.cues.filter((_, i) => i !== index)
                            updateFormData({
                              planning: { ...formData.planning, cues: newCues }
                            })
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 9:
        return (
          <div>
            <div className="hero-icon">🔄</div>
            <h2 className="step-title">Stap 9: Reflectie & vernieuwing</h2>
            
            <div className="info-box green">
              <h3>🎯 Evaluatie voor groei</h3>
              <p className="text-gray-700">
                Regelmatige reflectie helpt je bij te sturen en je leerdoel aan te passen waar nodig.
              </p>
            </div>

            <div className="space-y-4">
              <div className="form-group">
                <label className="form-label">Wanneer ga je je voortgang evalueren?</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.reflectie.evaluatieMoment}
                  onChange={(e) => updateFormData({
                    reflectie: { ...formData.reflectie, evaluatieMoment: e.target.value }
                  })}
                  placeholder="Bijvoorbeeld: Elke week vrijdag, halverwege de periode..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Wat zijn indicatoren dat je op de goede weg bent?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="form-input"
                    value={tempInput}
                    onChange={(e) => setTempInput(e.target.value)}
                    placeholder="Bijvoorbeeld: Ik voel me zekerder, ik krijg positieve feedback..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && tempInput.trim()) {
                        updateFormData({
                          reflectie: { 
                            ...formData.reflectie, 
                            succesIndicatoren: [...formData.reflectie.succesIndicatoren, tempInput.trim()] 
                          }
                        })
                        setTempInput('')
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      if (tempInput.trim()) {
                        updateFormData({
                          reflectie: { 
                            ...formData.reflectie, 
                            succesIndicatoren: [...formData.reflectie.succesIndicatoren, tempInput.trim()] 
                          }
                        })
                        setTempInput('')
                      }
                    }}
                  >
                    Toevoegen
                  </button>
                </div>
              </div>

              {formData.reflectie.succesIndicatoren.length > 0 && (
                <div className="card">
                  <h4 className="font-medium text-gray-800 mb-3">Jouw succesindicatoren:</h4>
                  <div className="space-y-2">
                    {formData.reflectie.succesIndicatoren.map((indicator, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                        <span className="text-gray-700">{indicator}</span>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => {
                            const newIndicatoren = formData.reflectie.succesIndicatoren.filter((_, i) => i !== index)
                            updateFormData({
                              reflectie: { ...formData.reflectie, succesIndicatoren: newIndicatoren }
                            })
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <h3 className="text-xl font-bold text-purple-800 mb-4">🎉 Gefeliciteerd!</h3>
              <p className="text-gray-700 mb-4">
                Je hebt alle 9 stappen doorlopen en een compleet SMART leerdoel ontwikkeld. 
                Hieronder zie je een samenvatting van je leerdoel.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-3 rounded border">
                  <strong>BANGE-score:</strong> {generateSummary().bangeScore}/5
                </div>
                <div className="bg-white p-3 rounded border">
                  <strong>SMART compleet:</strong> {generateSummary().smartComplete ? '✅ Ja' : '⚠️ Nog niet volledig'}
                </div>
                <div className="bg-white p-3 rounded border">
                  <strong>Aantal acties:</strong> {generateSummary().totalActions}
                </div>
                <div className="bg-white p-3 rounded border">
                  <strong>Planning gemaakt:</strong> {generateSummary().hasPlan ? '✅ Ja' : '⚠️ Nog niet volledig'}
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return <div>Onbekende stap</div>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-4 border-pink-600">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Terug
            </button>
            <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
              i
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SMART Leerdoel Creator</h1>
              <p className="text-sm text-pink-600 font-medium">9-stappen methode</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {renderProgressBar()}
          {renderStep()}
          
          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="btn btn-secondary"
              >
                ← Vorige stap
              </button>
            )}
            
            <button
              onClick={nextStep}
              disabled={currentStep === totalSteps}
              className={`btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed ${currentStep === 1 ? 'ml-auto' : ''}`}
            >
              {currentStep === totalSteps ? '🎯 Voltooid!' : 'Volgende stap →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}