# HANDOFF - Quick Reference for Future Agents

## Project Summary
Offline web strategy game built with Next.js and TypeScript. Player manages nation in turn-based global simulation.

## Quick Start
```
npm install
npm run dev
```
Access at localhost:3000

## Architecture
- App.tsx: Main game state and UI orchestration
- /lib/: Core simulation engine (worldgen, economy, ai, saveSystem)
- /components/: React UI panels (Map, Resources, Trade, Research, Diplomacy, Events)
- /public/mockdata/: Initial game data (state.json, tech_tree.json)

## Key Files
- App.tsx: Game loop and state management
- worldgen.ts: Nation and world generation
- economy.ts: Resource simulation
- ai.ts: NPC decision making
- saveSystem.ts: LocalStorage persistence

## Data Flow
User action → State update → Simulation tick → UI re-render → Autosave

## Common Tasks

### Add New Resource
1. Update Resources interface in worldgen.ts
2. Add to initial state.json
3. Update ResourcePanel display logic
4. Modify economy calculations

### Add New Technology
1. Add entry to tech_tree.json
2. Ensure requirements reference existing techs
3. Test research flow in ResearchPanel

### Modify AI Behavior
1. Edit decideAction() in ai.ts
2. Adjust priority values
3. Test with multiple nations

### Change UI Theme
1. Edit CSS variables in theme.css
2. Update component styles in panels.css
3. Test contrast ratios

## Known Issues
- No mobile optimization (desktop-first)
- AI difficulty fixed (no slider)
- LocalStorage can fill up over time
- No undo functionality

## Next Priorities
1. Install dependencies and browser test
2. Mobile responsive layout
3. Performance test with 10 nations
4. Tutorial/onboarding system
5. Sound effects integration

## Technical Debt
- No unit tests implemented
- Some TypeScript any types in event handlers
- No React.memo optimizations
- Save file size not optimized

## Dependencies
- Next.js 14
- React 18
- TypeScript 5
- No other runtime dependencies

## Contact Points
- README.md: User documentation
- DECISIONS.md: Architecture rationale
- BUGS.md: Issue tracking
- API_CONTRACT.md: Data schemas
