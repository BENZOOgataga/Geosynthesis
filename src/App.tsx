'use client';

import React, { useState, useEffect } from 'react';
import MapView from './components/MapView';
import ResourcePanel from './components/ResourcePanel';
import TradePanel from './components/TradePanel';
import ResearchPanel from './components/ResearchPanel';
import DiplomacyPanel from './components/DiplomacyPanel';
import EventFeed from './components/EventFeed';
import { GameState, Nation, getPlayerNation } from './lib/worldgen';
import { processEconomicTurn } from './lib/economy';
import { processAITurns, generateRandomEvent } from './lib/ai';
import { saveGame, loadGame, autosave, exportSaveToFile, importSaveFromFile } from './lib/saveSystem';
import './styles/theme.css';
import './styles/panels.css';

export default function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedNation, setSelectedNation] = useState<Nation | null>(null);
  const [activePanel, setActivePanel] = useState<string>('resources');
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = async () => {
    // Try to load saved game first
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
      } catch (error) {
        console.error('Failed to load initial state:', error);
      }
    }
  };

  const processTurn = () => {
    if (!gameState) return;

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
    autosave(newState);
    
    // Update selected nation if it's the player
    const player = getPlayerNation(newState);
    if (selectedNation?.isPlayer && player) {
      setSelectedNation(player);
    }
  };

  const handleSave = () => {
    if (gameState && saveGame(gameState)) {
      alert('Game saved successfully!');
    }
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
          alert('Game loaded successfully!');
        } catch (error) {
          alert('Failed to import save file');
        }
      }
    };
    input.click();
  };

  const handleNewGame = async () => {
    const confirmed = confirm('Start a new game? Current progress will be lost.');
    if (confirmed) {
      const response = await fetch('/mockdata/state.json');
      const initialState = await response.json();
      setGameState(initialState);
      const player = getPlayerNation(initialState);
      setSelectedNation(player || null);
      setIsPaused(true);
    }
  };

  if (!gameState) {
    return (
      <div className="loading-screen">
        <h1>Loading Geosynthesis...</h1>
      </div>
    );
  }

  const playerNation = getPlayerNation(gameState);
  if (!playerNation) {
    return <div>Error: Player nation not found</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>⚙️ Geosynthesis</h1>
          <div className="game-info">
            <span>Turn {gameState.turn}</span>
            <span>Year {gameState.year}</span>
            <span>{playerNation.name}</span>
          </div>
        </div>
        
        <div className="header-right">
          <button onClick={handleNewGame} className="btn btn-small">New Game</button>
          <button onClick={handleSave} className="btn btn-small">Save</button>
          <button onClick={handleExport} className="btn btn-small">Export</button>
          <button onClick={handleImport} className="btn btn-small">Import</button>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`btn ${isPaused ? 'btn-primary' : 'btn-warning'}`}
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>
          <button onClick={processTurn} className="btn btn-success" disabled={!isPaused}>
            Next Turn →
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
              Resources
            </button>
            <button
              className={activePanel === 'trade' ? 'active' : ''}
              onClick={() => setActivePanel('trade')}
            >
              Trade
            </button>
            <button
              className={activePanel === 'research' ? 'active' : ''}
              onClick={() => setActivePanel('research')}
            >
              Research
            </button>
            <button
              className={activePanel === 'diplomacy' ? 'active' : ''}
              onClick={() => setActivePanel('diplomacy')}
            >
              Diplomacy
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
    </div>
  );
}
