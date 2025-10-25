import React, { useState } from 'react';
import { GameState, Nation } from '../lib/worldgen';

interface MapViewProps {
  state: GameState;
  onNationClick: (nation: Nation) => void;
  selectedNation: Nation | null;
}

export default function MapView({ state, onNationClick, selectedNation }: MapViewProps) {
  const [hoveredNation, setHoveredNation] = useState<Nation | null>(null);

  const renderConnections = () => {
    return state.tradeRoutes.map((route, idx) => {
      const from = state.nations.find(n => n.id === route.from);
      const to = state.nations.find(n => n.id === route.to);
      
      if (!from || !to) return null;
      
      return (
        <line
          key={`trade-${idx}`}
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke="#4ade80"
          strokeWidth="2"
          strokeDasharray="5,5"
          opacity="0.4"
        />
      );
    });
  };

  const getNationColor = (nation: Nation): string => {
    if (nation.isPlayer) return '#3b82f6';
    if (nation.pollution > 250) return '#ef4444';
    if (nation.techLevel >= 4) return '#8b5cf6';
    return '#64748b';
  };

  const getNationRadius = (nation: Nation): number => {
    return Math.min(Math.max(nation.population / 2000000, 15), 40);
  };

  return (
    <div className="map-container">
      <svg width="100%" height="100%" viewBox="0 0 1000 600" className="world-map">
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#1e293b" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="1000" height="600" fill="url(#grid)" />
        
        {/* Trade routes */}
        <g className="trade-routes">
          {renderConnections()}
        </g>
        
        {/* Nations */}
        <g className="nations">
          {state.nations.map(nation => {
            const radius = getNationRadius(nation);
            const isHovered = hoveredNation?.id === nation.id;
            const isSelected = selectedNation?.id === nation.id;
            
            return (
              <g
                key={nation.id}
                className="nation-node"
                onMouseEnter={() => setHoveredNation(nation)}
                onMouseLeave={() => setHoveredNation(null)}
                onClick={() => onNationClick(nation)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={nation.x}
                  cy={nation.y}
                  r={radius}
                  fill={getNationColor(nation)}
                  opacity={isHovered || isSelected ? 1 : 0.7}
                  stroke={isSelected ? '#fbbf24' : isHovered ? '#fff' : 'none'}
                  strokeWidth={isSelected ? 4 : 2}
                  className="nation-circle"
                />
                
                {nation.isPlayer && (
                  <circle
                    cx={nation.x}
                    cy={nation.y}
                    r={radius + 5}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    opacity="0.5"
                  />
                )}
                
                <text
                  x={nation.x}
                  y={nation.y - radius - 8}
                  textAnchor="middle"
                  fill="#e2e8f0"
                  fontSize="14"
                  fontWeight="500"
                  className="nation-label"
                >
                  {nation.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      
      {/* Tooltip */}
      {hoveredNation && (
        <div className="map-tooltip">
          <h3>{hoveredNation.name}</h3>
          <div className="tooltip-stats">
            <div>PIB: ${(hoveredNation.gdp / 1000000).toFixed(1)}T</div>
            <div>Pop: {(hoveredNation.population / 1000000).toFixed(1)}M</div>
            <div>Tech: Niv {hoveredNation.techLevel}</div>
            <div>Pollution: {hoveredNation.pollution}</div>
            <div>Stabilité: {hoveredNation.stability}%</div>
          </div>
        </div>
      )}
    </div>
  );
}
