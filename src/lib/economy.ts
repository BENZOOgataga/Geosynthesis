// Economic Simulation and Resource Management
import { GameState, Nation, Resources, Industry, TradeRoute } from './worldgen';

export interface EconomyTick {
  gdpChange: Record<string, number>;
  resourceChanges: Record<string, Partial<Resources>>;
  pollutionChange: Record<string, number>;
}

export function processEconomicTurn(state: GameState): EconomyTick {
  const tick: EconomyTick = {
    gdpChange: {},
    resourceChanges: {},
    pollutionChange: {}
  };

  state.nations.forEach(nation => {
    // Production phase
    const production = calculateProduction(nation);
    tick.resourceChanges[nation.id] = production;
    
    // Apply production to nation
    Object.keys(production).forEach(key => {
      const resourceKey = key as keyof Resources;
      nation.resources[resourceKey] += production[resourceKey] || 0;
    });

    // Consumption phase
    const consumption = calculateConsumption(nation);
    Object.keys(consumption).forEach(key => {
      const resourceKey = key as keyof Resources;
      nation.resources[resourceKey] -= consumption[resourceKey] || 0;
      if (nation.resources[resourceKey] < 0) {
        nation.resources[resourceKey] = 0;
      }
    });

    // GDP calculation
    const gdpGrowth = calculateGDPGrowth(nation);
    nation.gdp = Math.floor(nation.gdp * (1 + gdpGrowth));
    tick.gdpChange[nation.id] = gdpGrowth;

    // Pollution calculation
    const pollutionChange = calculatePollution(nation);
    nation.pollution = Math.max(0, nation.pollution + pollutionChange);
    tick.pollutionChange[nation.id] = pollutionChange;

    // Population growth
    const popGrowth = Math.floor(nation.population * 0.01);
    nation.population += popGrowth;
  });

  // Process trade routes
  state.tradeRoutes.forEach(route => {
    const fromNation = state.nations.find(n => n.id === route.from);
    const toNation = state.nations.find(n => n.id === route.to);
    
    if (fromNation && toNation) {
      const available = fromNation.resources[route.resource];
      const actualAmount = Math.min(available, route.amount);
      
      fromNation.resources[route.resource] -= actualAmount;
      toNation.resources[route.resource] += actualAmount;
      
      const revenue = actualAmount * route.pricePerUnit;
      fromNation.gdp += revenue;
      toNation.gdp -= revenue;
    }
  });

  return tick;
}

function calculateProduction(nation: Nation): Partial<Resources> {
  const production: Partial<Resources> = {
    iron: 0,
    oil: 0,
    rare_earth: 0,
    food: 0,
    power: 0
  };

  nation.industries.forEach(industry => {
    const baseOutput = industry.output * industry.level;
    
    switch (industry.type) {
      case 'mining':
        production.iron = (production.iron || 0) + baseOutput * 0.6;
        production.rare_earth = (production.rare_earth || 0) + baseOutput * 0.1;
        break;
      case 'energy':
        production.power = (production.power || 0) + baseOutput;
        production.oil = (production.oil || 0) + baseOutput * 0.3;
        break;
      case 'renewable_energy':
        production.power = (production.power || 0) + baseOutput * 0.8;
        break;
      case 'agriculture':
        production.food = (production.food || 0) + baseOutput * 1.2;
        break;
      case 'manufacturing':
        production.iron = (production.iron || 0) + baseOutput * 0.2;
        break;
    }
  });

  return production;
}

function calculateConsumption(nation: Nation): Partial<Resources> {
  const popFactor = nation.population / 10000000;
  
  return {
    food: Math.floor(popFactor * 100),
    power: Math.floor(popFactor * 80),
    oil: Math.floor(popFactor * 30),
    iron: Math.floor(popFactor * 20),
    rare_earth: Math.floor(popFactor * 5)
  };
}

function calculateGDPGrowth(nation: Nation): number {
  let growth = 0.02; // Base 2%
  
  growth += nation.techLevel * 0.005;
  growth -= (nation.pollution / 10000);
  growth += (nation.stability - 50) / 5000;
  
  // Industry bonuses
  nation.industries.forEach(industry => {
    growth += industry.level * 0.003;
  });
  
  return Math.max(-0.05, Math.min(0.15, growth));
}

function calculatePollution(nation: Nation): number {
  let pollutionChange = 0;
  
  nation.industries.forEach(industry => {
    switch (industry.type) {
      case 'mining':
        pollutionChange += industry.output * 0.05;
        break;
      case 'energy':
        pollutionChange += industry.output * 0.08;
        break;
      case 'manufacturing':
        pollutionChange += industry.output * 0.06;
        break;
      case 'renewable_energy':
        pollutionChange -= industry.output * 0.02;
        break;
    }
  });
  
  pollutionChange -= nation.techLevel * 2;
  
  return Math.floor(pollutionChange);
}

export function createTradeRoute(
  state: GameState,
  from: string,
  to: string,
  resource: keyof Resources,
  amount: number
): boolean {
  const fromNation = state.nations.find(n => n.id === from);
  const toNation = state.nations.find(n => n.id === to);
  
  if (!fromNation || !toNation) return false;
  if (fromNation.resources[resource] < amount) return false;
  
  const pricePerUnit = getResourcePrice(resource);
  
  state.tradeRoutes.push({
    from,
    to,
    resource,
    amount,
    pricePerUnit
  });
  
  return true;
}

function getResourcePrice(resource: keyof Resources): number {
  const prices: Record<keyof Resources, number> = {
    iron: 12,
    oil: 25,
    rare_earth: 150,
    food: 3,
    power: 8
  };
  
  return prices[resource];
}

export function buildIndustry(
  nation: Nation,
  industryType: string,
  cost: number
): boolean {
  if (nation.gdp < cost) return false;
  
  const existing = nation.industries.find(i => i.type === industryType);
  
  if (existing) {
    existing.level += 1;
    existing.output = Math.floor(existing.output * 1.3);
  } else {
    nation.industries.push({
      type: industryType,
      level: 1,
      output: 500
    });
  }
  
  nation.gdp -= cost;
  return true;
}
