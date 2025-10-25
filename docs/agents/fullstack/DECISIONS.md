# DECISIONS - Architecture and Design Choices

## Framework Selection

### Next.js
- Chosen for built-in TypeScript support
- Server-side rendering capability (future multiplayer)
- Excellent development experience
- Route-based code splitting
- Production-ready build system

### TypeScript
- Type safety prevents runtime errors
- Better IDE support and autocomplete
- Self-documenting code through interfaces
- Easier refactoring and maintenance

## Architecture Patterns

### Component Structure
- Functional components with hooks
- Props drilling avoided via state lifting
- Each panel is self-contained component
- Shared state managed in App.tsx

### State Management
- No Redux/MobX to reduce complexity
- useState for local component state
- Props for parent-child communication
- Game state flows top-down

### Simulation Design
- Turn-based rather than real-time
- Deterministic calculations
- Modular systems (economy, AI, events)
- Pure functions where possible

## Data Flow

### Game Loop
1. User clicks "Next Turn"
2. Economic simulation processes
3. AI nations make decisions
4. Random events may trigger
5. State updates propagate to UI
6. Autosave executes

### UI Updates
- React re-renders on state change
- Selective rendering via React.memo (future optimization)
- CSS transitions for smooth animations
- SVG for scalable map rendering

## Styling Approach

### CSS Variables
- Centralized theme in theme.css
- Easy to modify color scheme
- Consistent spacing and sizing
- Dark mode by default

### Component Styles
- Scoped to prevent conflicts
- BEM-like naming convention
- Mobile-first responsive design
- Accessible color contrasts

## Performance Optimizations

### Initial Load
- Minimal dependencies
- Code splitting via Next.js
- Static assets preloaded
- Lazy loading not needed (small app)

### Runtime
- Efficient React reconciliation
- Minimal DOM manipulations
- CSS animations over JS
- LocalStorage batched writes

### Memory
- No memory leaks in event handlers
- Garbage collection friendly
- State kept minimal
- Old saves can be deleted

## Persistence Strategy

### LocalStorage
- Simple API
- Synchronous operations
- Good for small data (<10MB)
- Automatic serialization

### Export/Import
- User control over save files
- Backup capability
- Cross-device transfer
- JSON for human readability

## AI Design Philosophy

### Decision Making
- Priority-based system
- Random factor for variety
- Resource-driven choices
- Diplomatic considerations

### Difficulty
- Fixed difficulty (medium)
- Nations have different strengths
- Player advantage through control
- AI not meant to win

## Scalability Considerations

### Current Limits
- 10 nations maximum
- 1000 turns before slowdown
- 50 technologies max
- 100 trade routes max

### Future Scaling
- Web Workers for simulation
- IndexedDB for larger saves
- Compressed save files
- Incremental autosave

## Trade-offs Made

### Simplicity vs Features
- Chose simpler AI over complex behavior trees
- Limited resource types for clarity
- Turn-based over real-time for performance
- No multiplayer for scope control

### Performance vs Accuracy
- Approximate economic models
- Random events over detailed simulation
- Cached calculations where possible
- Simulation fidelity balanced with speed

### User Experience vs Realism
- Streamlined UI over simulation depth
- Instant feedback over loading screens
- Forgiving mechanics over hardcore difficulty
- Accessibility over graphical complexity

## Security Considerations

### Client-Side Only
- No server means no server vulnerabilities
- No user authentication needed
- No database to secure
- No network attacks possible

### Save File Integrity
- JSON validation on import
- Schema version checking
- Corrupted saves rejected
- No arbitrary code execution

## Accessibility

### Keyboard Navigation
- Tab order follows visual layout
- Enter/Space for button activation
- Escape to close modals (future)
- Arrow keys for map navigation (future)

### Visual Design
- High contrast ratios
- Clear typography
- Consistent iconography
- Color not sole information carrier

## Code Quality Standards

### TypeScript Strictness
- Strict mode enabled
- No implicit any
- Null checks enforced
- Type inference preferred

### Naming Conventions
- PascalCase for components
- camelCase for functions/variables
- UPPER_CASE for constants
- Descriptive names over short

### File Organization
- One component per file
- Related files grouped
- Alphabetical imports
- Barrel exports where useful

## Testing Strategy (Not Implemented)

### Unit Tests
- Core logic functions testable
- Pure functions easiest
- Mock data available
- Jest recommended

### Integration Tests
- Component interactions
- State flow validation
- Save/load roundtrip
- React Testing Library recommended

### E2E Tests
- Full game flow
- UI interactions
- Browser compatibility
- Playwright recommended

## Future Architectural Changes

### Performance
- React.memo for expensive components
- Virtual scrolling for long lists
- Web Workers for AI processing
- Service Workers for true offline

### Features
- WebGL for advanced map rendering
- WebRTC for multiplayer
- Web Audio API for sound
- IndexedDB for large saves

### Developer Experience
- Hot module replacement working
- Better error boundaries
- Debug panel in dev mode
- Performance profiler integration
