import React from 'react';
import { Nation, Resources } from '../lib/worldgen';

interface ResourcePanelProps {
  nation: Nation;
}

export default function ResourcePanel({ nation }: ResourcePanelProps) {
  const resourceIcons: Record<keyof Resources, string> = {
    iron: '⚙️',
    oil: '🛢️',
    rare_earth: '💎',
    food: '🌾',
    power: '⚡'
  };

  const resourceColors: Record<keyof Resources, string> = {
    iron: '#94a3b8',
    oil: '#78350f',
    rare_earth: '#a855f7',
    food: '#22c55e',
    power: '#eab308'
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getStorageLevel = (resource: keyof Resources, amount: number): number => {
    const thresholds: Record<keyof Resources, number> = {
      iron: 10000,
      oil: 10000,
      rare_earth: 3000,
      food: 15000,
      power: 10000
    };
    
    return Math.min((amount / thresholds[resource]) * 100, 100);
  };

  return (
    <div className="panel resource-panel">
      <div className="panel-header">
        <h2>Resources - {nation.name}</h2>
        <div className="panel-subtitle">Storage & Production</div>
      </div>
      
      <div className="panel-content">
        <div className="resource-grid">
          {(Object.keys(nation.resources) as Array<keyof Resources>).map(resource => {
            const amount = nation.resources[resource];
            const storageLevel = getStorageLevel(resource, amount);
            const color = resourceColors[resource];
            
            return (
              <div key={resource} className="resource-item">
                <div className="resource-header">
                  <span className="resource-icon">{resourceIcons[resource]}</span>
                  <span className="resource-name">{resource.replace('_', ' ')}</span>
                </div>
                
                <div className="resource-amount">
                  {formatNumber(amount)}
                </div>
                
                <div className="resource-bar">
                  <div
                    className="resource-bar-fill"
                    style={{
                      width: `${storageLevel}%`,
                      backgroundColor: color
                    }}
                  />
                </div>
                
                <div className="resource-status">
                  {storageLevel > 80 ? 'High' : storageLevel > 40 ? 'Medium' : 'Low'}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="nation-stats">
          <div className="stat-row">
            <span className="stat-label">GDP:</span>
            <span className="stat-value">${formatNumber(nation.gdp)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Population:</span>
            <span className="stat-value">{formatNumber(nation.population)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Tech Level:</span>
            <span className="stat-value">Level {nation.techLevel}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Pollution:</span>
            <span className="stat-value" style={{ color: nation.pollution > 200 ? '#ef4444' : '#22c55e' }}>
              {nation.pollution}
            </span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Stability:</span>
            <span className="stat-value">{nation.stability}%</span>
          </div>
        </div>
        
        <div className="industries-section">
          <h3>Industries</h3>
          <div className="industries-list">
            {nation.industries.map((industry, idx) => (
              <div key={idx} className="industry-item">
                <div className="industry-name">{industry.type}</div>
                <div className="industry-details">
                  <span>Lvl {industry.level}</span>
                  <span>Output: {formatNumber(industry.output)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
