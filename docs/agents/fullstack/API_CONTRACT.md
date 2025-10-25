# API_CONTRACT - Data Schemas and Interfaces

## Overview
This document defines the JSON schemas and TypeScript interfaces for all game data structures.

## Core Data Types

### GameState
Complete state of the game world.

```typescript
interface GameState {
  version: string;        // Schema version (e.g., "1.0.0")
  turn: number;           // Current turn number
  year: number;           // Current year
  playerNation: string;   // ID of player-controlled nation
  nations: Nation[];      // Array of all nations
  globalEvents: GlobalEvent[];  // History of global events
  tradeRoutes: TradeRoute[];    // Active trade routes
}
```

**JSON Example:**
```json
{
  "version": "1.0.0",
  "turn": 1,
  "year": 2025,
  "playerNation": "nordland",
  "nations": [...],
  "globalEvents": [...],
  "tradeRoutes": [...]
}
```

---

### Nation
Represents a single nation in the game.

```typescript
interface Nation {
  id: string;                     // Unique identifier
  name: string;                   // Display name
  isPlayer: boolean;              // Player-controlled flag
  x: number;                      // Map X coordinate
  y: number;                      // Map Y coordinate
  gdp: number;                    // Gross Domestic Product
  population: number;             // Total population
  techLevel: number;              // Technology level (1-10)
  pollution: number;              // Pollution index (0-1000)
  stability: number;              // Political stability (0-100)
  resources: Resources;           // Resource stockpiles
  industries: Industry[];         // Active industries
  traits: string[];               // Nation characteristics
  relations: Record<string, number>;  // Relations with other nations
}
```

**JSON Example:**
```json
{
  "id": "nordland",
  "name": "Nordland",
  "isPlayer": true,
  "x": 320,
  "y": 150,
  "gdp": 1500000,
  "population": 45000000,
  "techLevel": 3,
  "pollution": 120,
  "stability": 75,
  "resources": {
    "iron": 5000,
    "oil": 2000,
    "rare_earth": 500,
    "food": 8000,
    "power": 3000
  },
  "industries": [...],
  "traits": ["industrial_hub", "temperate_climate"],
  "relations": {
    "terranova": 65,
    "zenithia": 40
  }
}
```

---

### Resources
Resource stockpile for a nation.

```typescript
interface Resources {
  iron: number;        // Iron ore units
  oil: number;         // Oil barrels
  rare_earth: number;  // Rare earth elements
  food: number;        // Food units
  power: number;       // Energy units
}
```

**Constraints:**
- All values must be non-negative
- Integer values only
- Typical range: 0 to 100,000

---

### Industry
Industrial sector within a nation.

```typescript
interface Industry {
  type: string;    // Industry type identifier
  level: number;   // Upgrade level (1-10)
  output: number;  // Production output per turn
}
```

**Valid Industry Types:**
- mining
- manufacturing
- energy
- agriculture
- tech
- tourism
- renewable_energy
- finance

**JSON Example:**
```json
{
  "type": "manufacturing",
  "level": 3,
  "output": 1500
}
```

---

### GlobalEvent
World event affecting gameplay.

```typescript
interface GlobalEvent {
  id: string;          // Unique event identifier
  turn: number;        // Turn when event occurred
  type: 'info' | 'crisis' | 'opportunity' | 'war';
  title: string;       // Short event title
  description: string; // Detailed description
  effects: Record<string, any>;  // Game effect modifiers
}
```

**JSON Example:**
```json
{
  "id": "evt_001",
  "turn": 5,
  "type": "crisis",
  "title": "Oil Price Shock",
  "description": "Global oil prices surge by 40%",
  "effects": {
    "oil_price_multiplier": 1.4
  }
}
```

---

### TradeRoute
Active trade agreement between nations.

```typescript
interface TradeRoute {
  from: string;              // Exporting nation ID
  to: string;                // Importing nation ID
  resource: keyof Resources; // Resource being traded
  amount: number;            // Units per turn
  pricePerUnit: number;      // Price per resource unit
}
```

**JSON Example:**
```json
{
  "from": "nordland",
  "to": "solaria",
  "resource": "iron",
  "amount": 500,
  "pricePerUnit": 12
}
```

---

### Technology
Research technology definition.

```typescript
interface Technology {
  id: string;              // Unique tech identifier
  name: string;            // Display name
  tier: number;            // Tech tier (1-5)
  cost: number;            // Research cost
  requirements: string[];  // Required tech IDs
  effects: Record<string, number>;  // Gameplay effects
  unlocks: string[];       // Tech IDs this unlocks
}
```

**JSON Example:**
```json
{
  "id": "fusion_energy",
  "name": "Fusion Power",
  "tier": 4,
  "cost": 25000,
  "requirements": ["renewable_energy_2", "advanced_physics"],
  "effects": {
    "power_generation": 3.5,
    "pollution_reduction": 0.3
  },
  "unlocks": []
}
```

---

### GameSettings
User preferences and settings.

```typescript
interface GameSettings {
  autosaveEnabled: boolean;      // Enable autosave
  theme: 'dark' | 'light';       // UI theme
  soundEnabled: boolean;         // Enable sound effects
  animationsEnabled: boolean;    // Enable animations
}
```

**JSON Example:**
```json
{
  "autosaveEnabled": true,
  "theme": "dark",
  "soundEnabled": true,
  "animationsEnabled": true
}
```

---

## Save File Format

### LocalStorage Keys
- `geosynthesis_save`: Main save slot
- `geosynthesis_autosave`: Autosave slot
- `geosynthesis_settings`: User settings
- `geosynthesis_save_timestamp`: Save timestamp

### Save File Structure
Complete save file is a serialized GameState:

```json
{
  "version": "1.0.0",
  "turn": 42,
  "year": 2028,
  "playerNation": "nordland",
  "nations": [...],
  "globalEvents": [...],
  "tradeRoutes": [...]
}
```

---

## Validation Rules

### Nation Validation
- `id`: Must be unique, lowercase, no spaces
- `name`: 1-20 characters
- `gdp`: 0 to 1,000,000,000,000
- `population`: 1,000,000 to 10,000,000,000
- `techLevel`: 1 to 10
- `pollution`: 0 to 1000
- `stability`: 0 to 100
- `x`: 0 to 1000 (map width)
- `y`: 0 to 600 (map height)

### Resources Validation
- All values >= 0
- All values <= 1,000,000
- Integer values only

### Technology Validation
- `tier`: 1 to 5
- `cost`: 100 to 100,000
- `requirements`: Must reference existing tech IDs
- `unlocks`: Must reference existing tech IDs

### Trade Route Validation
- `amount`: 10 to 10,000
- `pricePerUnit`: 1 to 1,000
- `from` and `to`: Must be different nations
- `resource`: Must be valid Resources key

---

## Calculated Fields

### GDP Growth Rate
```typescript
growth = base_rate 
  + (techLevel * 0.005)
  - (pollution / 10000)
  + (stability - 50) / 5000
```

### Resource Consumption
```typescript
consumption = (population / 10,000,000) * base_consumption_rate
```

### Industry Output
```typescript
output = base_output * level * tech_multipliers
```

---

## Version Migration

### Version 1.0.0
Initial schema. No migration needed.

### Future Versions
Migration functions should:
1. Check `version` field
2. Apply transformations
3. Update `version` field
4. Validate result

Example migration function:
```typescript
function migrate_1_0_to_1_1(state: any): GameState {
  // Add new fields with defaults
  state.version = "1.1.0";
  state.nations.forEach(n => {
    n.newField = defaultValue;
  });
  return state as GameState;
}
```

---

## Error Codes

### Validation Errors
- `ERR_INVALID_JSON`: Malformed JSON
- `ERR_MISSING_FIELD`: Required field missing
- `ERR_INVALID_TYPE`: Type mismatch
- `ERR_OUT_OF_RANGE`: Value outside valid range
- `ERR_INVALID_REFERENCE`: Referenced ID not found

### Runtime Errors
- `ERR_INSUFFICIENT_RESOURCES`: Not enough resources
- `ERR_INVALID_ACTION`: Action not allowed
- `ERR_QUOTA_EXCEEDED`: LocalStorage full
- `ERR_SAVE_FAILED`: Save operation failed

---

## API Endpoints (Future)

Currently client-side only. Future multiplayer API:

### GET /api/state
Returns current game state

### POST /api/turn
Process next turn
Body: `{ actions: PlayerAction[] }`

### POST /api/save
Save game state
Body: `GameState`

### GET /api/load/:id
Load saved game

---

## Constants and Enums

### Resource Types
```typescript
type ResourceType = 'iron' | 'oil' | 'rare_earth' | 'food' | 'power';
```

### Industry Types
```typescript
type IndustryType = 
  | 'mining'
  | 'manufacturing'
  | 'energy'
  | 'agriculture'
  | 'tech'
  | 'tourism'
  | 'renewable_energy'
  | 'finance';
```

### Event Types
```typescript
type EventType = 'info' | 'crisis' | 'opportunity' | 'war';
```

### Nation Traits
```typescript
const VALID_TRAITS = [
  'industrial_hub',
  'tech_leader',
  'oil_rich',
  'eco_friendly',
  'high_population',
  'island_nation',
  'solar_potential',
  'mining_power',
  'agricultural_giant',
  'democratic',
  'authoritarian',
  'temperate_climate'
];
```

---

## Backward Compatibility

### Breaking Changes
Version increments when:
- Required fields added
- Field types changed
- Validation rules tightened

### Non-Breaking Changes
Patch version when:
- Optional fields added
- Validation rules relaxed
- Bug fixes

---

## Testing Data

### Minimal Valid GameState
```json
{
  "version": "1.0.0",
  "turn": 1,
  "year": 2025,
  "playerNation": "test",
  "nations": [{
    "id": "test",
    "name": "Test",
    "isPlayer": true,
    "x": 100,
    "y": 100,
    "gdp": 1000000,
    "population": 10000000,
    "techLevel": 1,
    "pollution": 50,
    "stability": 50,
    "resources": {
      "iron": 1000,
      "oil": 1000,
      "rare_earth": 100,
      "food": 1000,
      "power": 1000
    },
    "industries": [],
    "traits": [],
    "relations": {}
  }],
  "globalEvents": [],
  "tradeRoutes": []
}
```

### Edge Case Data
Available in `/public/mockdata/test_cases.json` (future)
