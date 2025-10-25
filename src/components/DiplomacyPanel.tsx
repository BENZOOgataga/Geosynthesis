import React from 'react';
import { GameState, Nation } from '../lib/worldgen';

interface DiplomacyPanelProps {
  state: GameState;
  playerNation: Nation;
  onRelationChange: (targetId: string, change: number) => void;
}

export default function DiplomacyPanel({ state, playerNation, onRelationChange }: DiplomacyPanelProps) {
  const traitNames: Record<string, string> = {
    industrial_hub: 'Pôle industriel',
    tech_leader: 'Leader technologique',
    oil_rich: 'Riche en pétrole',
    eco_friendly: 'Écologique',
    high_population: 'Forte population',
    island_nation: 'Nation insulaire',
    solar_potential: 'Potentiel solaire',
    mining_power: 'Puissance minière',
    agricultural_giant: 'Géant agricole',
    democratic: 'Démocratique',
    authoritarian: 'Autoritaire',
    temperate_climate: 'Climat tempéré'
  };

  const getRelationStatus = (value: number): { label: string; color: string } => {
    if (value >= 80) return { label: 'Allié', color: '#22c55e' };
    if (value >= 60) return { label: 'Amical', color: '#84cc16' };
    if (value >= 40) return { label: 'Neutre', color: '#eab308' };
    if (value >= 20) return { label: 'Tendu', color: '#f97316' };
    return { label: 'Hostile', color: '#ef4444' };
  };

  const improveRelations = (nationId: string) => {
    const cost = 10000;
    if (playerNation.gdp < cost) {
      alert('Fonds insuffisants pour une mission diplomatique');
      return;
    }
    
    playerNation.gdp -= cost;
    onRelationChange(nationId, 10);
  };

  const otherNations = state.nations.filter(n => !n.isPlayer);

  return (
    <div className="panel diplomacy-panel">
      <div className="panel-header">
        <h2>Diplomatie & Relations</h2>
        <div className="panel-subtitle">Gérer les relations internationales</div>
      </div>

      <div className="panel-content">
        <div className="diplomacy-overview">
          <div className="stat-box">
            <div className="stat-label">Alliés</div>
            <div className="stat-value">
              {Object.values(playerNation.relations).filter(r => r >= 80).length}
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Nations amies</div>
            <div className="stat-value">
              {Object.values(playerNation.relations).filter(r => r >= 60 && r < 80).length}
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Nations hostiles</div>
            <div className="stat-value">
              {Object.values(playerNation.relations).filter(r => r < 40).length}
            </div>
          </div>
        </div>

        <div className="relations-list">
          {otherNations.map(nation => {
            const relationValue = playerNation.relations[nation.id] || 50;
            const status = getRelationStatus(relationValue);

            return (
              <div key={nation.id} className="relation-item">
                <div className="relation-header">
                  <div className="nation-info">
                    <h4>{nation.name}</h4>
                    <div className="nation-details">
                      Tech Niv {nation.techLevel} • PIB ${(nation.gdp / 1000000).toFixed(1)}T
                    </div>
                  </div>
                  <div className="relation-status" style={{ color: status.color }}>
                    {status.label}
                  </div>
                </div>

                <div className="relation-bar-container">
                  <div className="relation-bar">
                    <div
                      className="relation-bar-fill"
                      style={{
                        width: `${relationValue}%`,
                        backgroundColor: status.color
                      }}
                    />
                  </div>
                  <div className="relation-value">{relationValue}/100</div>
                </div>

                <div className="relation-actions">
                  <button
                    onClick={() => improveRelations(nation.id)}
                    className="btn btn-small"
                    disabled={relationValue >= 100}
                  >
                    Améliorer les relations (10K$)
                  </button>
                  
                  {relationValue >= 60 && (
                    <div className="relation-benefits">
                      ✓ Commerce disponible
                    </div>
                  )}
                  
                  {relationValue >= 80 && (
                    <div className="relation-benefits">
                      ✓ Partage technologique
                    </div>
                  )}
                </div>

                <div className="nation-traits">
                  {nation.traits.slice(0, 3).map(trait => (
                    <span key={trait} className="trait-badge">
                      {traitNames[trait] || trait.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
