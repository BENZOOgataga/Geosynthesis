# Geosynthesis Web

A fully offline web-based global strategy simulation game built with Next.js, React, and TypeScript.

## Features

- Complete offline functionality (no external API calls)
- Procedural world generation with nations, resources, and industries
- Economic simulation with production, consumption, and trade
- AI-driven NPC nations
- Research and technology tree
- Diplomacy and international relations
- Save/Load system using LocalStorage
- Export/Import save files as JSON
- Modern, responsive UI with animations

## Installation

```bash
npm install
```

## Running the Game

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
npm start
```

## Game Controls

- **Next Turn**: Process one turn of simulation
- **Pause/Resume**: Control automatic turn processing
- **Save**: Save current game state to LocalStorage
- **Export**: Download save file as JSON
- **Import**: Load save file from JSON
- **New Game**: Start fresh game (resets to initial state)

## Panels

1. **Resources**: View and manage your nation's resources and industries
2. **Trade**: Create trade routes with other nations
3. **Research**: Unlock new technologies to boost your nation
4. **Diplomacy**: Improve relations with other nations

## Architecture

```
/src/
  /lib/          - Core game logic (simulation engine)
  /components/   - React UI components
  /styles/       - CSS styling
  /app/          - Next.js pages and routing
/public/
  /mockdata/     - Initial game state and tech tree data
```

## Data Files

- `state.json`: Initial world state with nations, resources, relations
- `tech_tree.json`: Research technologies and their effects

All game state is stored locally in browser storage and can be exported/imported as JSON files.
