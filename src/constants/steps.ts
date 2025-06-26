export interface Step {
  id: string
  title: string
  icon: string
}

export const steps: Step[] = [
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
]