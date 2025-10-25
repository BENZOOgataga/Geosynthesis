'use client';

import React, { useState, useEffect } from 'react';
import MapView from './components/MapView';
import ResourcePanel from './components/ResourcePanel';
import TradePanel from './components/TradePanel';
import ResearchPanel from './components/ResearchPanel';
import DiplomacyPanel from './components/DiplomacyPanel';
import EventFeed from './components/EventFeed';
import Tutorial from './components/Tutorial';
import AuthModal from './components/AuthModal';
import TurnSummary from './components/TurnSummary';
import { GameState, Nation, getPlayerNation } from './lib/worldgen';
import { processEconomicTurn } from './lib/economy';
import { processAITurns, generateRandomEvent } from './lib/ai';
import { saveGame, loadGame, autosave, exportSaveToFile, importSaveFromFile } from './lib/saveSystem';
import './styles/theme.css';
import './styles/panels.css';
import './styles/auth.css';
import './styles/turnSummary.css';

export default function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [previousGameState, setPreviousGameState] = useState<GameState | null>(null);
  const [selectedNation, setSelectedNation] = useState<Nation | null>(null);
  const [activePanel, setActivePanel] = useState<string>('resources');
  const [isPaused, setIsPaused] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showTurnSummary, setShowTurnSummary] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('auth_token');
    const savedUsername = localStorage.getItem('username');
    
    if (token && savedUsername) {
      setAuthToken(token);
      setUsername(savedUsername);
      setIsAuthenticated(true);
      initializeGame(token);
    } else {
      // Show auth modal if not authenticated
      setShowAuthModal(true);
    }
  }, []);

  // Keyboard shortcut: Space to advance turn
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && isPaused && gameState && !showTutorial && !showAuthModal) {
        e.preventDefault();
        processTurn();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPaused, gameState, showTutorial, showAuthModal]);

  const initializeGame = async (token?: string) => {
    // Check if tutorial has been completed
    const tutorialCompleted = localStorage.getItem('geosynthesis_tutorial_completed');
    
    // Try to load from database if authenticated
    if (token || authToken) {
      try {
        const response = await fetch('/api/game/save', {
          headers: {
            'Authorization': `Bearer ${token || authToken}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.gameState) {
            setGameState(data.gameState);
            const player = getPlayerNation(data.gameState);
            setSelectedNation(player || null);
            return;
          }
        }
      } catch (error) {
        console.error('Failed to load from database:', error);
      }
    }
    
    // Fallback to localStorage for guest mode
    const saved = loadGame();
    if (saved) {
      setGameState(saved);
      const player = getPlayerNation(saved);
      setSelectedNation(player || null);
    } else {
      // Load initial state from mockdata
      try {
        const response = await fetch('/mockdata/state.json');
        const initialState = await response.json();
        setGameState(initialState);
        const player = getPlayerNation(initialState);
        setSelectedNation(player || null);
        
        // Show tutorial for new players
        if (!tutorialCompleted) {
          setShowTutorial(true);
        }
      } catch (error) {
        console.error('Failed to load initial state:', error);
      }
    }
  };

  const processTurn = () => {
    if (!gameState) return;

    // Save current state for comparison
    setPreviousGameState({ ...gameState });

    const newState = { ...gameState };
    
    // Economic simulation
    processEconomicTurn(newState);
    
    // AI actions
    processAITurns(newState);
    
    // Random events
    generateRandomEvent(newState);
    
    // Increment turn
    newState.turn += 1;
    if (newState.turn % 12 === 0) {
      newState.year += 1;
    }
    
    setGameState(newState);
    
    // Show turn summary
    setShowTurnSummary(true);
    
    // Auto-save to database if authenticated, otherwise localStorage
    if (isAuthenticated && authToken) {
      saveToDatabase(newState);
    } else {
      autosave(newState);
    }
    
    // Update selected nation if it's the player
    const player = getPlayerNation(newState);
    if (selectedNation?.isPlayer && player) {
      setSelectedNation(player);
    }
  };

  const saveToDatabase = async (state: GameState) => {
    if (!authToken) return;
    
    try {
      const response = await fetch('/api/game/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          saveName: `${username || 'Joueur'} - Auto-save`,
          gameState: state
        })
      });
      
      if (!response.ok) {
        console.error('Failed to save to database');
        // Fallback to localStorage
        autosave(state);
      }
    } catch (error) {
      console.error('Error saving to database:', error);
      autosave(state);
    }
  };

  const handleSave = async () => {
    if (!gameState) return;
    
    if (isAuthenticated && authToken) {
      await saveToDatabase(gameState);
      alert('Partie sauvegardée dans le cloud !');
    } else if (saveGame(gameState)) {
      alert('Partie sauvegardée localement !');
    }
  };

  const handleLogout = () => {
    const confirmed = confirm('Voulez-vous vraiment vous déconnecter ? Assurez-vous d\'avoir sauvegardé votre progression.');
    if (confirmed) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('username');
      setAuthToken(null);
      setUsername(null);
      setIsAuthenticated(false);
      setShowAuthModal(true);
      // Save current game to localStorage before logout
      if (gameState) {
        saveGame(gameState);
      }
    }
  };

  const handleAuthSuccess = (token: string, user: string) => {
    setAuthToken(token);
    setUsername(user);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    initializeGame(token);
  };

  const handleGuestMode = () => {
    setIsGuestMode(true);
    setShowAuthModal(false);
    initializeGame();
  };

  const handleExport = () => {
    if (gameState) {
      exportSaveToFile(gameState);
    }
  };

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const imported = await importSaveFromFile(file);
          setGameState(imported);
          const player = getPlayerNation(imported);
          setSelectedNation(player || null);
          alert('Partie chargée avec succès !');
        } catch (error) {
          alert('Échec du chargement de la sauvegarde');
        }
      }
    };
    input.click();
  };

  const handleNewGame = async () => {
    const confirmed = confirm('Démarrer une nouvelle partie ? Votre progression actuelle sera perdue.');
    if (confirmed) {
      const response = await fetch('/mockdata/state.json');
      const initialState = await response.json();
      setGameState(initialState);
      const player = getPlayerNation(initialState);
      setSelectedNation(player || null);
      setIsPaused(true);
    }
  };

  if (!gameState || showAuthModal) {
    return (
      <>
        {!gameState && !showAuthModal && (
          <div className="loading-screen">
            <h1>Chargement de Geosynthesis...</h1>
          </div>
        )}
        {showAuthModal && (
          <AuthModal
            onSuccess={handleAuthSuccess}
            onGuestMode={handleGuestMode}
          />
        )}
      </>
    );
  }

  const playerNation = getPlayerNation(gameState);
  if (!playerNation) {
    return <div>Erreur: Nation du joueur introuvable</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>⚙️ Geosynthesis</h1>
          <div className="game-info">
            <span>Tour {gameState.turn}</span>
            <span>Année {gameState.year}</span>
            <span>{playerNation.name}</span>
            {isAuthenticated && username && (
              <span className="user-badge">👤 {username}</span>
            )}
            {isGuestMode && (
              <span className="guest-badge" title="Mode invité - Sauvegarde locale uniquement">
                👤 Invité ⚠️
              </span>
            )}
          </div>
        </div>
        
        <div className="header-right">
          <button onClick={handleNewGame} className="btn btn-small">Nouveau</button>
          <button onClick={handleSave} className="btn btn-small">
            {isAuthenticated ? '☁️ Sauvegarder' : '💾 Sauvegarder'}
          </button>
          <button onClick={handleExport} className="btn btn-small">Exporter</button>
          <button onClick={handleImport} className="btn btn-small">Importer</button>
          {isAuthenticated && (
            <button onClick={handleLogout} className="btn btn-small btn-warning">
              Déconnexion
            </button>
          )}
          <button onClick={() => setShowTutorial(true)} className="btn btn-small" title="Aide">
            ❓ Aide
          </button>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`btn ${isPaused ? 'btn-primary' : 'btn-warning'}`}
          >
            {isPaused ? '▶ Reprendre' : '⏸ Pause'}
          </button>
          <button onClick={processTurn} className="btn btn-success" disabled={!isPaused}>
            Tour suivant →
          </button>
        </div>
      </header>

      <div className="app-layout">
        <div className="left-sidebar">
          <MapView
            state={gameState}
            onNationClick={setSelectedNation}
            selectedNation={selectedNation}
          />
          
          <EventFeed events={gameState.globalEvents} turn={gameState.turn} />
        </div>

        <div className="main-content">
          <div className="panel-tabs">
            <button
              className={activePanel === 'resources' ? 'active' : ''}
              onClick={() => setActivePanel('resources')}
            >
              Ressources
            </button>
            <button
              className={activePanel === 'trade' ? 'active' : ''}
              onClick={() => setActivePanel('trade')}
            >
              Commerce
            </button>
            <button
              className={activePanel === 'research' ? 'active' : ''}
              onClick={() => setActivePanel('research')}
            >
              Recherche
            </button>
            <button
              className={activePanel === 'diplomacy' ? 'active' : ''}
              onClick={() => setActivePanel('diplomacy')}
            >
              Diplomatie
            </button>
          </div>

          <div className="panel-container">
            {activePanel === 'resources' && <ResourcePanel nation={selectedNation || playerNation} />}
            {activePanel === 'trade' && (
              <TradePanel
                state={gameState}
                playerNation={playerNation}
                onTradeCreated={() => setGameState({ ...gameState })}
              />
            )}
            {activePanel === 'research' && (
              <ResearchPanel
                nation={playerNation}
                onResearch={(techId) => {
                  console.log('Researched:', techId);
                  playerNation.techLevel += 0.1;
                  setGameState({ ...gameState });
                }}
              />
            )}
            {activePanel === 'diplomacy' && (
              <DiplomacyPanel
                state={gameState}
                playerNation={playerNation}
                onRelationChange={(targetId, change) => {
                  playerNation.relations[targetId] = Math.min(
                    100,
                    Math.max(0, playerNation.relations[targetId] + change)
                  );
                  setGameState({ ...gameState });
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && (
        <Tutorial
          onComplete={() => setShowTutorial(false)}
          onSkip={() => setShowTutorial(false)}
        />
      )}

      {/* Turn Summary */}
      {showTurnSummary && previousGameState && gameState && (
        <TurnSummary
          previousState={previousGameState}
          currentState={gameState}
          onClose={() => setShowTurnSummary(false)}
        />
      )}
    </div>
  );
}
