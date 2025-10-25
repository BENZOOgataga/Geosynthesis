# README - Geosynthesis Fullstack Implementation

## What Was Built

A complete offline web-based global strategy simulation game where players manage a nation in a dynamic world with economic systems, diplomacy, trade, and technological advancement.

## Technology Stack

- Next.js 14 (React framework)
- TypeScript (type safety)
- CSS Modules (styling)
- LocalStorage/IndexedDB (persistence)
- No external dependencies for game logic

## How to Run

### Development Mode
```
npm install
npm run dev
```
Access at http://localhost:3000

### Production Build
```
npm run build
npm start
```

### Offline Mode
The application runs entirely offline after initial load. All game logic executes client-side.

## Project Structure

```
/src/
  /lib/              Core simulation engine
    worldgen.ts      World generation and nation management
    economy.ts       Economic simulation and resource flow
    ai.ts            AI decision making for NPC nations
    saveSystem.ts    Save/load functionality
  /components/       React UI components
    MapView.tsx      Interactive world map with SVG rendering
    ResourcePanel.tsx Resource management interface
    TradePanel.tsx   Trade route creation and management
    ResearchPanel.tsx Technology tree interface
    DiplomacyPanel.tsx Relations management
    EventFeed.tsx    Global events display
  /styles/
    theme.css        Global theme and variables
    panels.css       Component-specific styles
  /app/
    page.tsx         Main entry point
    layout.tsx       Next.js layout wrapper
/public/
  /mockdata/
    state.json       Initial game state
    tech_tree.json   Technology definitions
```

## Core Systems

### 1. Simulation Engine
- Turn-based processing
- Economic production/consumption cycles
- AI nation behaviors
- Random event generation
- Resource management

### 2. UI Components
- Interactive SVG map with zoom and tooltips
- Panel-based interface with tabs
- Real-time state updates
- Smooth animations and transitions

### 3. Persistence
- LocalStorage for autosave
- Export/import JSON save files
- Settings persistence
- Multiple save slot support

## Key Features

- Procedural world with 5+ nations
- 5 resource types (iron, oil, rare earth, food, power)
- Industry building and management
- Trade route establishment
- Technology research tree (12+ technologies)
- Diplomacy and relations system
- Global events affecting gameplay
- Save/load system with export/import

## Performance Notes

- All simulation runs client-side
- No network calls after initial asset load
- State updates use React optimization patterns
- Autosave on each turn (configurable)
- Smooth 60fps animations

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires JavaScript enabled
- Requires LocalStorage enabled

## Known Limitations

- Single player only (no multiplayer)
- AI difficulty not adjustable
- Maximum 10 nations (performance)
- Save files not encrypted

## Future Enhancements

- Advanced AI difficulty settings
- More complex economic models
- Military/warfare systems
- Climate and environmental mechanics
- Mod support via JSON configuration

## Troubleshooting

### Game won't start
- Clear browser cache
- Check browser console for errors
- Verify JavaScript enabled

### Save not loading
- Check LocalStorage not full
- Verify save file JSON validity
- Try importing save file manually

### Performance issues
- Close other browser tabs
- Disable browser extensions
- Reduce number of active nations

## Credits

Built with Next.js, React, and TypeScript.
Procedural generation algorithms based on industry best practices.
UI design inspired by modern strategy games.
