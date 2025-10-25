import React, { useState } from 'react';
import { GameState, Nation, Resources } from '../lib/worldgen';
import { createTradeRoute } from '../lib/economy';

interface TradePanelProps {
  state: GameState;
  playerNation: Nation;
  onTradeCreated: () => void;
}

export default function TradePanel({ state, playerNation, onTradeCreated }: TradePanelProps) {
  const [selectedPartner, setSelectedPartner] = useState<string>('');
  const [selectedResource, setSelectedResource] = useState<keyof Resources>('iron');
  const [tradeAmount, setTradeAmount] = useState<number>(100);

  const otherNations = state.nations.filter(n => !n.isPlayer);

  const handleCreateTrade = () => {
    if (!selectedPartner) {
      alert('Veuillez sélectionner un partenaire commercial');
      return;
    }

    const success = createTradeRoute(
      state,
      playerNation.id,
      selectedPartner,
      selectedResource,
      tradeAmount
    );

    if (success) {
      alert(`Route commerciale créée: ${tradeAmount} ${selectedResource} vers ${selectedPartner}`);
      onTradeCreated();
      setTradeAmount(100);
    } else {
      alert('Échec de la création de la route. Vérifiez vos ressources.');
    }
  };

  const playerTrades = state.tradeRoutes.filter(
    t => t.from === playerNation.id || t.to === playerNation.id
  );

  return (
    <div className="panel trade-panel">
      <div className="panel-header">
        <h2>Commerce & Échanges</h2>
        <div className="panel-subtitle">Gérer les exportations et importations</div>
      </div>

      <div className="panel-content">
        <div className="trade-creator">
          <h3>Créer une nouvelle route commerciale</h3>
          
          <div className="form-group">
            <label>Partenaire commercial</label>
            <select
              value={selectedPartner}
              onChange={(e) => setSelectedPartner(e.target.value)}
              className="select-input"
            >
              <option value="">Sélectionner une nation</option>
              {otherNations.map(nation => {
                const relation = playerNation.relations[nation.id];
                return (
                  <option key={nation.id} value={nation.id}>
                    {nation.name} (Relations: {relation})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group">
            <label>Ressource</label>
            <select
              value={selectedResource}
              onChange={(e) => setSelectedResource(e.target.value as keyof Resources)}
              className="select-input"
            >
              <option value="iron">Fer ({playerNation.resources.iron})</option>
              <option value="oil">Pétrole ({playerNation.resources.oil})</option>
              <option value="rare_earth">Terres rares ({playerNation.resources.rare_earth})</option>
              <option value="food">Nourriture ({playerNation.resources.food})</option>
              <option value="power">Énergie ({playerNation.resources.power})</option>
            </select>
          </div>

          <div className="form-group">
            <label>Quantité par tour</label>
            <input
              type="number"
              value={tradeAmount}
              onChange={(e) => setTradeAmount(Number(e.target.value))}
              min="10"
              max="5000"
              step="10"
              className="number-input"
            />
          </div>

          <button onClick={handleCreateTrade} className="btn btn-primary">
            Établir une route commerciale
          </button>
        </div>

        <div className="active-trades">
          <h3>Routes commerciales actives</h3>
          {playerTrades.length === 0 ? (
            <div className="empty-state">Aucune route commerciale active</div>
          ) : (
            <div className="trades-list">
              {playerTrades.map((trade, idx) => {
                const isExport = trade.from === playerNation.id;
                const partner = state.nations.find(n => 
                  n.id === (isExport ? trade.to : trade.from)
                );
                const revenue = trade.amount * trade.pricePerUnit;

                return (
                  <div key={idx} className="trade-item">
                    <div className="trade-direction">
                      {isExport ? '📤 Export' : '📥 Import'}
                    </div>
                    <div className="trade-details">
                      <div className="trade-partner">{partner?.name}</div>
                      <div className="trade-resource">
                        {trade.amount} {trade.resource}
                      </div>
                      <div className="trade-value" style={{ color: isExport ? '#22c55e' : '#ef4444' }}>
                        {isExport ? '+' : '-'}${revenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
