# ARCHITECTURE DIAGRAM

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     GEOSYNTHESIS WEB APP                     │
│                    (Offline Browser Game)                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      USER INTERFACE LAYER                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  App.tsx (Root Component)                                    │
│  ├─ Header (Controls, Turn Info, Save/Load)                 │
│  ├─ Left Sidebar                                             │
│  │   ├─ MapView (SVG World Map)                             │
│  │   └─ EventFeed (Global Events)                           │
│  └─ Main Content                                             │
│      ├─ Panel Tabs (Resources, Trade, Research, Diplomacy)  │
│      └─ Active Panel                                         │
│          ├─ ResourcePanel                                    │
│          ├─ TradePanel                                       │
│          ├─ ResearchPanel                                    │
│          └─ DiplomacyPanel                                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ Props & Callbacks
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT LAYER                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  React useState (in App.tsx)                                 │
│  ├─ gameState: GameState                                     │
│  ├─ selectedNation: Nation                                   │
│  ├─ activePanel: string                                      │
│  └─ isPaused: boolean                                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ State Updates
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    SIMULATION ENGINE LAYER                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  /src/lib/                                                   │
│  │                                                            │
│  ├─ worldgen.ts                                              │
│  │   ├─ generateWorld()                                      │
│  │   ├─ getPlayerNation()                                    │
│  │   └─ Type Definitions                                     │
│  │                                                            │
│  ├─ economy.ts                                               │
│  │   ├─ processEconomicTurn()                                │
│  │   ├─ calculateProduction()                                │
│  │   ├─ calculateConsumption()                               │
│  │   ├─ createTradeRoute()                                   │
│  │   └─ buildIndustry()                                      │
│  │                                                            │
│  ├─ ai.ts                                                    │
│  │   ├─ processAITurns()                                     │
│  │   ├─ decideAction()                                       │
│  │   ├─ analyzeNeeds()                                       │
│  │   └─ generateRandomEvent()                                │
│  │                                                            │
│  └─ saveSystem.ts                                            │
│      ├─ saveGame()                                           │
│      ├─ loadGame()                                           │
│      ├─ exportSaveToFile()                                   │
│      ├─ importSaveFromFile()                                 │
│      └─ Settings Management                                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ Read/Write
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      PERSISTENCE LAYER                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Browser LocalStorage                                        │
│  ├─ geosynthesis_save (Main save)                           │
│  ├─ geosynthesis_autosave (Auto save)                       │
│  └─ geosynthesis_settings (User preferences)                │
│                                                               │
│  File System (via downloads)                                 │
│  └─ *.json export files                                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ Initial Load
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         DATA LAYER                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  /public/mockdata/                                           │
│  ├─ state.json (Initial game state)                         │
│  └─ tech_tree.json (Technology definitions)                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘

## Data Flow

┌───────────────┐
│  User Action  │
└───────┬───────┘
        │
        ▼
┌───────────────────────────┐
│  Component Event Handler  │
└───────────┬───────────────┘
            │
            ▼
    ┌───────────────┐
    │  Update State │
    └───────┬───────┘
            │
            ▼
    ┌────────────────────┐
    │  Run Simulation    │ (Turn Processing)
    │  ├─ Economy        │
    │  ├─ AI Actions     │
    │  └─ Events         │
    └────────┬───────────┘
             │
             ▼
    ┌────────────────┐
    │  Update State  │
    └────────┬───────┘
             │
             ▼
    ┌────────────────┐
    │  React Render  │
    └────────┬───────┘
             │
             ▼
    ┌────────────────┐
    │   Autosave     │
    └────────────────┘

## Component Communication

```
App.tsx
  │
  ├─► MapView
  │     │
  │     └─► onNationClick() ──► Updates selectedNation
  │
  ├─► ResourcePanel
  │     │
  │     └─► Displays data (read-only)
  │
  ├─► TradePanel
  │     │
  │     └─► onTradeCreated() ──► Modifies gameState
  │
  ├─► ResearchPanel
  │     │
  │     └─► onResearch() ──► Updates nation tech
  │
  ├─► DiplomacyPanel
  │     │
  │     └─► onRelationChange() ──► Updates relations
  │
  └─► EventFeed
        │
        └─► Displays data (read-only)
```

## Technology Stack Layers

```
┌──────────────────────────────┐
│  Next.js 14 (Framework)      │
├──────────────────────────────┤
│  React 18 (UI Library)       │
├──────────────────────────────┤
│  TypeScript 5 (Language)     │
├──────────────────────────────┤
│  CSS3 (Styling)              │
├──────────────────────────────┤
│  Web APIs (Storage, File)    │
├──────────────────────────────┤
│  Browser (Chrome, Firefox)   │
└──────────────────────────────┘
```

## Turn Processing Flow

```
Player clicks "Next Turn"
        │
        ▼
┌────────────────────────────┐
│  processEconomicTurn()     │
│  ├─ For each nation:       │
│  │   ├─ Calculate output   │
│  │   ├─ Subtract costs     │
│  │   ├─ Update GDP         │
│  │   └─ Update pollution   │
│  └─ Process trade routes   │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│  processAITurns()          │
│  ├─ For each AI nation:    │
│  │   ├─ Analyze needs      │
│  │   ├─ Choose action      │
│  │   └─ Execute action     │
│  └─ Return action log      │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│  generateRandomEvent()     │
│  ├─ 30% chance             │
│  ├─ Select event type      │
│  └─ Add to event history   │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│  Update Turn & Year        │
│  ├─ Increment turn         │
│  └─ Update year if needed  │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│  React Re-render           │
│  └─ All components update  │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│  autosave()                │
│  └─ Save to LocalStorage   │
└────────────────────────────┘
```

## File Structure Tree

```
geosynthesis-web/
│
├── docs/
│   └── agents/
│       └── fullstack/
│           ├── README.md
│           ├── DECISIONS.md
│           ├── BUGS.md
│           ├── CHANGELOG.md
│           ├── ORG_NOTES.md
│           ├── HANDOFF.md
│           ├── RUNLOG.md
│           ├── API_CONTRACT.md
│           └── COMPLETE.md
│
├── public/
│   └── mockdata/
│       ├── state.json
│       └── tech_tree.json
│
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── MapView.tsx
│   │   ├── ResourcePanel.tsx
│   │   ├── TradePanel.tsx
│   │   ├── ResearchPanel.tsx
│   │   ├── DiplomacyPanel.tsx
│   │   └── EventFeed.tsx
│   │
│   ├── lib/
│   │   ├── worldgen.ts
│   │   ├── economy.ts
│   │   ├── ai.ts
│   │   └── saveSystem.ts
│   │
│   ├── styles/
│   │   ├── theme.css
│   │   └── panels.css
│   │
│   └── App.tsx
│
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
├── README.md
└── GETTING_STARTED.md
```
