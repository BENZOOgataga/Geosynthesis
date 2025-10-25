// World Generation and Initialization Logic
export interface Nation {
  id: string;
  name: string;
  isPlayer: boolean;
  x: number;
  y: number;
  gdp: number;
  population: number;
  techLevel: number;
  pollution: number;
  stability: number;
  resources: Resources;
  industries: Industry[];
  traits: string[];
  relations: Record<string, number>;
}

export interface Resources {
  iron: number;
  oil: number;
  rare_earth: number;
  food: number;
  power: number;
}

export interface Industry {
  type: string;
  level: number;
  output: number;
}

export interface GameState {
  version: string;
  turn: number;
  year: number;
  playerNation: string;
  nations: Nation[];
  globalEvents: GlobalEvent[];
  tradeRoutes: TradeRoute[];
}

export interface GlobalEvent {
  id: string;
  turn: number;
  type: 'info' | 'crisis' | 'opportunity' | 'war';
  title: string;
  description: string;
  effects: Record<string, any>;
}

export interface TradeRoute {
  from: string;
  to: string;
  resource: keyof Resources;
  amount: number;
  pricePerUnit: number;
}

const NATION_NAMES = [
  'Nordland', 'Terranova', 'Zenithia', 'Aqualis', 'Solaria',
  'Erebus', 'Luminos', 'Australix', 'Borealis', 'Meridian'
];

const TRAITS = [
  'industrial_hub', 'tech_leader', 'oil_rich', 'eco_friendly',
  'high_population', 'island_nation', 'solar_potential', 'mining_power',
  'agricultural_giant', 'democratic', 'authoritarian', 'temperate_climate'
];

const INDUSTRY_TYPES = [
  'mining', 'manufacturing', 'energy', 'agriculture', 
  'tech', 'tourism', 'renewable_energy', 'finance'
];

export function generateWorld(numNations: number = 8): GameState {
  const nations: Nation[] = [];
  const mapWidth = 1000;
  const mapHeight = 600;

  for (let i = 0; i < numNations; i++) {
    const nation: Nation = {
      id: NATION_NAMES[i].toLowerCase().replace(/\s/g, '_'),
      name: NATION_NAMES[i],
      isPlayer: i === 0,
      x: Math.random() * (mapWidth - 100) + 50,
      y: Math.random() * (mapHeight - 100) + 50,
      gdp: Math.floor(Math.random() * 2000000 + 500000),
      population: Math.floor(Math.random() * 80000000 + 20000000),
      techLevel: Math.floor(Math.random() * 3 + 2),
      pollution: Math.floor(Math.random() * 200 + 50),
      stability: Math.floor(Math.random() * 40 + 50),
      resources: {
        iron: Math.floor(Math.random() * 5000 + 1000),
        oil: Math.floor(Math.random() * 5000 + 500),
        rare_earth: Math.floor(Math.random() * 1500 + 100),
        food: Math.floor(Math.random() * 8000 + 4000),
        power: Math.floor(Math.random() * 5000 + 1000)
      },
      industries: generateIndustries(),
      traits: selectRandomTraits(2, 3),
      relations: {}
    };

    nations.push(nation);
  }

  // Generate relations
  nations.forEach(nation => {
    nations.forEach(other => {
      if (nation.id !== other.id) {
        nation.relations[other.id] = Math.floor(Math.random() * 60 + 20);
      }
    });
  });

  return {
    version: '1.0.0',
    turn: 1,
    year: 2025,
    playerNation: nations[0].id,
    nations,
    globalEvents: [],
    tradeRoutes: []
  };
}

function generateIndustries(): Industry[] {
  const count = Math.floor(Math.random() * 3 + 2);
  const selected = INDUSTRY_TYPES.sort(() => Math.random() - 0.5).slice(0, count);
  
  return selected.map(type => ({
    type,
    level: Math.floor(Math.random() * 3 + 1),
    output: Math.floor(Math.random() * 1500 + 500)
  }));
}

function selectRandomTraits(min: number, max: number): string[] {
  const count = Math.floor(Math.random() * (max - min + 1) + min);
  return TRAITS.sort(() => Math.random() - 0.5).slice(0, count);
}

export function getPlayerNation(state: GameState): Nation | undefined {
  return state.nations.find(n => n.id === state.playerNation);
}

export function getNationById(state: GameState, id: string): Nation | undefined {
  return state.nations.find(n => n.id === id);
}
