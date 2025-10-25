// AI Decision Making for NPC Nations
import { GameState, Nation, Resources } from './worldgen';
import { buildIndustry, createTradeRoute } from './economy';

export interface AIAction {
  nationId: string;
  action: 'build' | 'trade' | 'research' | 'diplomacy' | 'none';
  details: any;
}

export function processAITurns(state: GameState): AIAction[] {
  const actions: AIAction[] = [];
  
  state.nations.forEach(nation => {
    if (nation.isPlayer) return;
    
    const action = decideAction(nation, state);
    if (action.action !== 'none') {
      executeAIAction(action, state);
      actions.push(action);
    }
  });
  
  return actions;
}

function decideAction(nation: Nation, state: GameState): AIAction {
  // Priority system based on needs
  const priorities = analyzeNeeds(nation);
  
  // Random factor
  const roll = Math.random();
  
  if (priorities.needsPower && roll < 0.4) {
    return {
      nationId: nation.id,
      action: 'build',
      details: { industryType: 'renewable_energy', cost: 50000 }
    };
  }
  
  if (priorities.needsFood && roll < 0.3) {
    return {
      nationId: nation.id,
      action: 'build',
      details: { industryType: 'agriculture', cost: 40000 }
    };
  }
  
  if (priorities.canTrade && roll < 0.25) {
    const partner = findTradePartner(nation, state);
    if (partner) {
      return {
        nationId: nation.id,
        action: 'trade',
        details: {
          partner: partner.id,
          resource: priorities.excessResource,
          amount: 500
        }
      };
    }
  }
  
  if (nation.gdp > 100000 && roll < 0.2) {
    const industryType = chooseIndustryToBuild(nation);
    return {
      nationId: nation.id,
      action: 'build',
      details: { industryType, cost: 60000 }
    };
  }
  
  // Diplomacy - improve relations randomly
  if (roll < 0.15) {
    const targetId = Object.keys(nation.relations)[
      Math.floor(Math.random() * Object.keys(nation.relations).length)
    ];
    
    if (targetId && nation.relations[targetId] < 80) {
      nation.relations[targetId] = Math.min(100, nation.relations[targetId] + 5);
      return {
        nationId: nation.id,
        action: 'diplomacy',
        details: { target: targetId, change: 5 }
      };
    }
  }
  
  return { nationId: nation.id, action: 'none', details: {} };
}

interface NeedAnalysis {
  needsPower: boolean;
  needsFood: boolean;
  canTrade: boolean;
  excessResource?: keyof Resources;
}

function analyzeNeeds(nation: Nation): NeedAnalysis {
  const popFactor = nation.population / 10000000;
  
  const needsPower = nation.resources.power < popFactor * 500;
  const needsFood = nation.resources.food < popFactor * 800;
  
  let excessResource: keyof Resources | undefined;
  let maxExcess = 0;
  
  Object.keys(nation.resources).forEach(key => {
    const resourceKey = key as keyof Resources;
    const amount = nation.resources[resourceKey];
    const threshold = getResourceThreshold(resourceKey, popFactor);
    
    if (amount > threshold * 2) {
      const excess = amount - threshold;
      if (excess > maxExcess) {
        maxExcess = excess;
        excessResource = resourceKey;
      }
    }
  });
  
  return {
    needsPower,
    needsFood,
    canTrade: !!excessResource && maxExcess > 1000,
    excessResource
  };
}

function getResourceThreshold(resource: keyof Resources, popFactor: number): number {
  const thresholds: Record<keyof Resources, number> = {
    food: popFactor * 1000,
    power: popFactor * 600,
    oil: popFactor * 400,
    iron: popFactor * 300,
    rare_earth: popFactor * 100
  };
  
  return thresholds[resource];
}

function findTradePartner(nation: Nation, state: GameState): Nation | null {
  const candidates = state.nations.filter(n => {
    return n.id !== nation.id && nation.relations[n.id] > 40;
  });
  
  if (candidates.length === 0) return null;
  
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function chooseIndustryToBuild(nation: Nation): string {
  const options = ['manufacturing', 'mining', 'renewable_energy', 'agriculture', 'tech'];
  
  // Prefer industries not at max level
  const existing = nation.industries.map(i => i.type);
  const available = options.filter(opt => {
    const ind = nation.industries.find(i => i.type === opt);
    return !ind || ind.level < 5;
  });
  
  if (available.length > 0) {
    return available[Math.floor(Math.random() * available.length)];
  }
  
  return options[Math.floor(Math.random() * options.length)];
}

function executeAIAction(action: AIAction, state: GameState): void {
  const nation = state.nations.find(n => n.id === action.nationId);
  if (!nation) return;
  
  switch (action.action) {
    case 'build':
      buildIndustry(nation, action.details.industryType, action.details.cost);
      break;
    case 'trade':
      createTradeRoute(
        state,
        action.nationId,
        action.details.partner,
        action.details.resource,
        action.details.amount
      );
      break;
  }
}

export function generateRandomEvent(state: GameState): void {
  const eventRoll = Math.random();
  
  if (eventRoll > 0.7) {
    const eventTypes = [
      {
        type: 'crisis',
        title: 'Crise pétrolière',
        description: 'Les prix mondiaux du pétrole bondissent de 40% suite à une rupture d\'approvisionnement.',
        effects: { oil_price_multiplier: 1.4 }
      },
      {
        type: 'opportunity',
        title: 'Percée technologique',
        description: 'Nouvelle technologie de batterie découverte, stimulant les énergies renouvelables.',
        effects: { renewable_boost: 1.2 }
      },
      {
        type: 'info',
        title: 'Sommet climatique',
        description: 'Les nations s\'engagent à réduire leurs émissions de 15%.',
        effects: {}
      },
      {
        type: 'crisis',
        title: 'Échec des récoltes',
        description: 'La sécheresse affecte plusieurs régions, les prix alimentaires augmentent.',
        effects: { food_production_penalty: 0.85 }
      }
    ];
    
    const event = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    state.globalEvents.push({
      id: `evt_${state.turn}_${Math.random().toString(36).substr(2, 9)}`,
      turn: state.turn,
      type: event.type as any,
      title: event.title,
      description: event.description,
      effects: event.effects
    });
  }
}
