import React, { useState, useEffect } from 'react';
import { Nation } from '../lib/worldgen';

interface Technology {
  id: string;
  name: string;
  tier: number;
  cost: number;
  requirements: string[];
  effects: Record<string, number>;
  unlocks: string[];
}

interface ResearchPanelProps {
  nation: Nation;
  onResearch: (techId: string) => void;
}

export default function ResearchPanel({ nation, onResearch }: ResearchPanelProps) {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [researched, setResearched] = useState<Set<string>>(new Set());
  const [selectedTech, setSelectedTech] = useState<Technology | null>(null);

  useEffect(() => {
    fetch('/mockdata/tech_tree.json')
      .then(res => res.json())
      .then(data => {
        setTechnologies(data.technologies);
      })
      .catch(err => console.error('Failed to load tech tree:', err));
  }, []);

  const canResearch = (tech: Technology): boolean => {
    if (researched.has(tech.id)) return false;
    if (nation.gdp < tech.cost) return false;
    
    return tech.requirements.every(req => researched.has(req));
  };

  const handleResearch = (tech: Technology) => {
    if (!canResearch(tech)) return;
    
    const newResearched = new Set(researched);
    newResearched.add(tech.id);
    setResearched(newResearched);
    onResearch(tech.id);
  };

  const getTierColor = (tier: number): string => {
    const colors = ['#64748b', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];
    return colors[tier - 1] || '#64748b';
  };

  const groupedTechs = technologies.reduce((acc, tech) => {
    if (!acc[tech.tier]) acc[tech.tier] = [];
    acc[tech.tier].push(tech);
    return acc;
  }, {} as Record<number, Technology[]>);

  return (
    <div className="panel research-panel">
      <div className="panel-header">
        <h2>Recherche & Développement</h2>
        <div className="panel-subtitle">Faites progresser votre technologie</div>
      </div>

      <div className="panel-content">
        <div className="research-stats">
          <div className="stat-box">
            <div className="stat-label">Budget recherche</div>
            <div className="stat-value">${(nation.gdp * 0.1).toLocaleString()}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Niveau tech actuel</div>
            <div className="stat-value">Niveau {nation.techLevel}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Technologies recherchées</div>
            <div className="stat-value">{researched.size}</div>
          </div>
        </div>

        <div className="tech-tree">
          {Object.keys(groupedTechs).sort().map(tierStr => {
            const tier = parseInt(tierStr);
            const techs = groupedTechs[tier];

            return (
              <div key={tier} className="tech-tier">
                <div className="tier-header" style={{ borderColor: getTierColor(tier) }}>
                  Palier {tier}
                </div>
                <div className="tech-grid">
                  {techs.map(tech => {
                    const isResearched = researched.has(tech.id);
                    const canDo = canResearch(tech);

                    return (
                      <div
                        key={tech.id}
                        className={`tech-card ${isResearched ? 'researched' : ''} ${canDo ? 'available' : 'locked'}`}
                        onClick={() => setSelectedTech(tech)}
                      >
                        <div className="tech-name">{tech.name}</div>
                        <div className="tech-cost">${tech.cost.toLocaleString()}</div>
                        
                        {isResearched && (
                          <div className="tech-status">✓ Terminé</div>
                        )}
                        
                        {!isResearched && canDo && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResearch(tech);
                            }}
                            className="btn btn-small"
                          >
                            Rechercher
                          </button>
                        )}
                        
                        {!isResearched && !canDo && (
                          <div className="tech-status locked">🔒 Verrouillé</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {selectedTech && (
          <div className="tech-details">
            <h3>{selectedTech.name}</h3>
            <div className="tech-info">
              <div><strong>Palier:</strong> {selectedTech.tier}</div>
              <div><strong>Coût:</strong> ${selectedTech.cost.toLocaleString()}</div>
              
              {selectedTech.requirements.length > 0 && (
                <div>
                  <strong>Prérequis:</strong>
                  <ul>
                    {selectedTech.requirements.map(req => (
                      <li key={req}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div>
                <strong>Effets:</strong>
                <ul>
                  {Object.entries(selectedTech.effects).map(([key, value]) => (
                    <li key={key}>
                      {key}: {typeof value === 'number' ? (value > 1 ? `+${((value - 1) * 100).toFixed(0)}%` : `${((1 - value) * 100).toFixed(0)}% de réduction`) : value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
