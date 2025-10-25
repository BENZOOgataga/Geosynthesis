import React, { useState, useEffect } from 'react';

interface TutorialStep {
  title: string;
  content: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface TutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Bienvenue dans Geosynthesis!",
    content: "Vous dirigez maintenant une nation dans un monde en développement. Votre objectif est de gérer vos ressources, développer votre économie, et coopérer ou rivaliser avec d'autres nations.",
    position: 'bottom'
  },
  {
    title: "Votre Nation",
    content: "En haut à gauche, vous pouvez voir le nom de votre nation, le tour actuel et l'année. Chaque tour représente un mois de jeu.",
    position: 'bottom'
  },
  {
    title: "La Carte du Monde",
    content: "À gauche, la carte montre toutes les nations. Votre nation est en bleu. Cliquez sur une nation pour voir ses détails. Les lignes pointillées représentent les routes commerciales actives.",
    position: 'right'
  },
  {
    title: "Panneau Ressources",
    content: "Consultez vos ressources (Fer, Pétrole, Terres rares, Nourriture, Énergie), votre PIB, population et industries. Ce panneau est essentiel pour planifier votre développement.",
    position: 'top'
  },
  {
    title: "Commerce",
    content: "Établissez des routes commerciales avec d'autres nations pour échanger des ressources. Le commerce génère des revenus et améliore les relations diplomatiques.",
    position: 'top'
  },
  {
    title: "Recherche",
    content: "Investissez dans des technologies pour améliorer votre production, réduire la pollution, et débloquer de nouvelles capacités. Chaque technologie a un coût en PIB.",
    position: 'top'
  },
  {
    title: "Diplomatie",
    content: "Gérez vos relations avec les autres nations. De meilleures relations permettent le commerce et le partage technologique. Vous pouvez investir 10K$ pour améliorer vos relations.",
    position: 'top'
  },
  {
    title: "Événements Mondiaux",
    content: "Des événements aléatoires se produisent et peuvent affecter toutes les nations. Surveillez le fil d'événements pour rester informé.",
    position: 'right'
  },
  {
    title: "Tour Suivant",
    content: "Cliquez sur 'Tour suivant' pour faire progresser le temps. Vos ressources seront produites, les IA agiront, et de nouveaux événements peuvent survenir. Planifiez bien!",
    position: 'left'
  },
  {
    title: "Conseils de Démarrage",
    content: "1) Surveillez votre PIB et vos ressources\n2) Établissez des routes commerciales rapidement\n3) Investissez dans la recherche dès que possible\n4) Maintenez de bonnes relations avec vos voisins\n5) Sauvegardez régulièrement!",
    position: 'bottom'
  }
];

export default function Tutorial({ onComplete, onSkip }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem('geosynthesis_tutorial_completed', 'true');
    onComplete();
  };

  const handleSkip = () => {
    setIsVisible(false);
    localStorage.setItem('geosynthesis_tutorial_completed', 'true');
    onSkip();
  };

  if (!isVisible) return null;

  const step = tutorialSteps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="tutorial-overlay" />
      
      {/* Tutorial Modal */}
      <div className="tutorial-modal">
        <div className="tutorial-header">
          <h2>{step.title}</h2>
          <div className="tutorial-progress">
            Étape {currentStep + 1} sur {tutorialSteps.length}
          </div>
        </div>

        <div className="tutorial-content">
          <p style={{ whiteSpace: 'pre-line' }}>{step.content}</p>
        </div>

        <div className="tutorial-footer">
          <button onClick={handleSkip} className="btn btn-small">
            Ignorer le tutoriel
          </button>
          
          <div className="tutorial-nav">
            <button 
              onClick={handlePrevious} 
              className="btn btn-small"
              disabled={currentStep === 0}
            >
              ← Précédent
            </button>
            
            <div className="tutorial-dots">
              {tutorialSteps.map((_, index) => (
                <span
                  key={index}
                  className={`tutorial-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                  onClick={() => setCurrentStep(index)}
                />
              ))}
            </div>
            
            <button onClick={handleNext} className="btn btn-primary">
              {currentStep === tutorialSteps.length - 1 ? 'Commencer!' : 'Suivant →'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
