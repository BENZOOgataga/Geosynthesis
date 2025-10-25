import React from 'react';
import { GameState } from '../lib/worldgen';

interface TurnSummaryProps {
  previousState: GameState;
  currentState: GameState;
  onClose: () => void;
}

export default function TurnSummary({ previousState, currentState, onClose }: TurnSummaryProps) {
  const playerNation = currentState.nations.find(n => n.isPlayer);
  const prevPlayerNation = previousState.nations.find(n => n.isPlayer);

  if (!playerNation || !prevPlayerNation) return null;

  // Calculate GDP change
  const gdpChange = playerNation.gdp - prevPlayerNation.gdp;
  const gdpChangePercent = ((gdpChange / prevPlayerNation.gdp) * 100).toFixed(1);

  // Get new events
  const newEvents = currentState.globalEvents.filter(
    e => e.turn === currentState.turn
  );

  // Check diplomatic changes
  const diplomaticChanges = currentState.nations
    .filter(n => !n.isPlayer)
    .map(nation => {
      const prevRelation = prevPlayerNation.relations[nation.id] || 0;
      const currentRelation = playerNation.relations[nation.id] || 0;
      const change = currentRelation - prevRelation;
      return { nation: nation.name, change };
    })
    .filter(d => d.change !== 0);

  return (
    <div className="turn-summary-overlay" onClick={onClose}>
      <div className="turn-summary-modal" onClick={(e) => e.stopPropagation()}>
        <div className="turn-summary-header">
          <h2>📊 Résumé du Tour {currentState.turn}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="turn-summary-content">
          {/* Economic Summary */}
          <div className="summary-section">
            <h3>💰 Économie</h3>
            <div className="stat-row">
              <span>PIB:</span>
              <span className={gdpChange >= 0 ? 'positive' : 'negative'}>
                {playerNation.gdp.toFixed(2)}T$
                {gdpChange >= 0 ? ' ▲' : ' ▼'} {Math.abs(Number(gdpChangePercent))}%
              </span>
            </div>
            <div className="stat-row">
              <span>Ressources:</span>
              <span>{Object.keys(playerNation.resources).length} types</span>
            </div>
          </div>

          {/* New Events */}
          {newEvents.length > 0 && (
            <div className="summary-section">
              <h3>🌍 Événements mondiaux</h3>
              {newEvents.map((event, idx) => (
                <div key={idx} className={`event-item event-${event.type}`}>
                  <strong>{event.title}</strong>
                  <p>{event.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Diplomatic Changes */}
          {diplomaticChanges.length > 0 && (
            <div className="summary-section">
              <h3>🤝 Relations diplomatiques</h3>
              {diplomaticChanges.map((change, idx) => (
                <div key={idx} className="stat-row">
                  <span>{change.nation}:</span>
                  <span className={change.change > 0 ? 'positive' : 'negative'}>
                    {change.change > 0 ? '+' : ''}{change.change}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Production Summary */}
          <div className="summary-section">
            <h3>🏭 Production</h3>
            <div className="stat-row">
              <span>Industries actives:</span>
              <span>{playerNation.industries.length}</span>
            </div>
            <div className="stat-row">
              <span>Niveau technologique:</span>
              <span>{playerNation.techLevel.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="turn-summary-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Continuer →
          </button>
        </div>
      </div>
    </div>
  );
}
