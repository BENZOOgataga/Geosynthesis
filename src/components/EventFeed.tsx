import React from 'react';
import { GlobalEvent } from '../lib/worldgen';

interface EventFeedProps {
  events: GlobalEvent[];
  turn: number;
}

export default function EventFeed({ events, turn }: EventFeedProps) {
  const getEventIcon = (type: string): string => {
    switch (type) {
      case 'crisis': return '⚠️';
      case 'opportunity': return '✨';
      case 'war': return '⚔️';
      case 'info': return 'ℹ️';
      default: return '📋';
    }
  };

  const getEventColor = (type: string): string => {
    switch (type) {
      case 'crisis': return '#ef4444';
      case 'opportunity': return '#22c55e';
      case 'war': return '#dc2626';
      case 'info': return '#3b82f6';
      default: return '#64748b';
    }
  };

  const recentEvents = events.slice(-10).reverse();

  return (
    <div className="panel event-feed">
      <div className="panel-header">
        <h2>Global Events</h2>
        <div className="panel-subtitle">Turn {turn}</div>
      </div>

      <div className="panel-content">
        {recentEvents.length === 0 ? (
          <div className="empty-state">
            No recent events
          </div>
        ) : (
          <div className="events-list">
            {recentEvents.map(event => (
              <div
                key={event.id}
                className="event-item"
                style={{ borderLeftColor: getEventColor(event.type) }}
              >
                <div className="event-header">
                  <span className="event-icon">{getEventIcon(event.type)}</span>
                  <span className="event-turn">Turn {event.turn}</span>
                </div>
                
                <div className="event-title">{event.title}</div>
                <div className="event-description">{event.description}</div>
                
                {Object.keys(event.effects).length > 0 && (
                  <div className="event-effects">
                    <strong>Effects:</strong>
                    <ul>
                      {Object.entries(event.effects).map(([key, value]) => (
                        <li key={key}>
                          {key}: {typeof value === 'number' ? `${(value * 100).toFixed(0)}%` : value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
