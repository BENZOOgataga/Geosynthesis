# ORG_NOTES - Project Organization and Standards

## Directory Structure

```
/geosynthesis-web/
├── /docs/agents/fullstack/     Documentation for development
├── /public/                     Static assets and data
│   └── /mockdata/              Initial game data files
├── /src/                       Source code
│   ├── /app/                   Next.js app directory
│   ├── /components/            React components
│   ├── /lib/                   Core game logic
│   └── /styles/                CSS files
├── package.json                Dependencies and scripts
├── tsconfig.json              TypeScript configuration
├── next.config.js             Next.js configuration
└── README.md                   User-facing documentation
```

## File Naming Conventions

### TypeScript/React Files
- Components: PascalCase (e.g., MapView.tsx)
- Libraries: camelCase (e.g., worldgen.ts)
- Types: PascalCase interfaces (e.g., GameState)
- Pages: lowercase (e.g., page.tsx)

### CSS Files
- Global: lowercase (e.g., theme.css)
- Component styles: match component name
- Use kebab-case for classes (e.g., panel-header)

### Data Files
- JSON: lowercase with underscores (e.g., tech_tree.json)
- Configuration: lowercase (e.g., package.json)

## Code Organization

### Component Structure
```typescript
// Imports
import React from 'react';
import { Type } from '../lib/module';

// Interface definitions
interface ComponentProps {
  prop1: Type;
  prop2: Type;
}

// Component function
export default function Component({ prop1, prop2 }: ComponentProps) {
  // State hooks
  const [state, setState] = useState<Type>(initial);
  
  // Effect hooks
  useEffect(() => {
    // side effects
  }, [dependencies]);
  
  // Helper functions
  const helperFunction = () => {
    // implementation
  };
  
  // Render
  return (
    <div className="component">
      {/* JSX */}
    </div>
  );
}
```

### Library Module Structure
```typescript
// Type definitions
export interface Type {
  field: string;
}

// Constants
const CONSTANT = 'value';

// Private functions
function privateHelper() {
  // implementation
}

// Public exported functions
export function publicFunction(param: Type): ReturnType {
  // implementation
}
```

## Coding Standards

### TypeScript
- Use explicit types for function parameters
- Use type inference for variable declarations
- Prefer interfaces over types for objects
- Use const for immutable values
- Use let for mutable values (never var)
- Enable strict mode in tsconfig.json

### React
- Functional components only (no classes)
- Use hooks for state and effects
- Props destructuring in parameters
- Key prop for list items
- Conditional rendering with ternary or &&
- Event handlers prefixed with 'handle'

### CSS
- BEM-like naming for complex components
- Use CSS variables for theme values
- Mobile-first responsive design
- Avoid !important unless absolutely necessary
- Group related properties
- Use shorthand where appropriate

### Formatting
- 2 spaces for indentation
- Single quotes for strings
- Semicolons required
- Trailing commas in multiline
- Max line length: 100 characters (flexible)
- Blank lines between logical sections

## Import Organization

Order of imports:
1. React and Next.js
2. Third-party libraries
3. Local components
4. Local libraries
5. Types/interfaces
6. CSS files

Example:
```typescript
import React, { useState } from 'react';
import { GameState } from '../lib/worldgen';
import MapView from './components/MapView';
import { processEconomicTurn } from '../lib/economy';
import './styles/theme.css';
```

## State Management Guidelines

### Local State (useState)
- Component-specific UI state
- Form inputs
- Toggle states
- Temporary data

### Lifted State
- Shared between siblings
- Parent manages, passes to children
- Game state in App.tsx

### Not Using
- Redux (too complex for this scale)
- Context API (not needed yet)
- External state libraries

## Component Responsibilities

### App.tsx
- Root component
- Game state management
- Save/load orchestration
- Turn processing
- Top-level UI layout

### MapView.tsx
- World map rendering
- Nation visualization
- Interactive tooltips
- Selection handling

### ResourcePanel.tsx
- Display resources and stats
- Show industries
- Format numbers
- Read-only view

### TradePanel.tsx
- Trade route creation
- Active trades display
- Trade form validation
- Trade mutations

### ResearchPanel.tsx
- Technology tree display
- Research actions
- Tech unlocking logic
- Tech details view

### DiplomacyPanel.tsx
- Relations display
- Diplomatic actions
- Relation improvements
- Nation information

### EventFeed.tsx
- Display global events
- Event history
- Event formatting
- Read-only view

## Library Responsibilities

### worldgen.ts
- World initialization
- Nation generation
- Type definitions
- Helper functions

### economy.ts
- Economic calculations
- Resource production
- Resource consumption
- Trade execution
- Industry building

### ai.ts
- AI decision making
- Need analysis
- Action execution
- Event generation

### saveSystem.ts
- Save to LocalStorage
- Load from LocalStorage
- Export to file
- Import from file
- Settings management

## Data Flow Patterns

### Top-Down
```
App.tsx (state)
  ↓ props
Component (display)
```

### Event Bubbling
```
Component (user action)
  ↓ callback prop
App.tsx (state update)
  ↓ re-render
Component (updated display)
```

### Simulation Loop
```
User clicks "Next Turn"
  ↓
processEconomicTurn()
  ↓
processAITurns()
  ↓
generateRandomEvent()
  ↓
State update
  ↓
UI re-render
  ↓
Autosave
```

## Testing Strategy (Not Implemented)

### Unit Tests
- Pure functions in /lib/
- Calculation correctness
- Edge case handling
- Type validation

### Component Tests
- Rendering with props
- User interactions
- Conditional rendering
- Event handling

### Integration Tests
- Full turn processing
- Save/load cycle
- Component interactions
- State propagation

### E2E Tests
- Complete game flow
- Multi-turn progression
- All panels accessible
- Save persistence

## Git Workflow (Recommended)

### Branch Naming
- feature/feature-name
- bugfix/bug-description
- hotfix/critical-fix
- docs/documentation-update

### Commit Messages
```
type(scope): short description

Longer explanation if needed.

Fixes #123
```

Types: feat, fix, docs, style, refactor, test, chore

### Pull Request Template
```
Summary: What changed
Why: Reason for change
Testing: How it was tested
Screenshots: If UI change
Breaking Changes: If any
```

## Documentation Standards

### Code Comments
- Why, not what (code should be self-documenting)
- Complex algorithms explained
- Non-obvious behaviors noted
- TODOs marked with ticket numbers

### README Files
- ASCII only (no emojis in docs/)
- Short bullet points
- Code examples where helpful
- External links when relevant

### API Documentation
- Function purpose
- Parameter types and meanings
- Return value description
- Example usage
- Edge cases

## Performance Guidelines

### React Optimization
- Avoid inline function definitions
- Use React.memo for expensive components
- Minimize state updates
- Batch related updates
- Use keys properly in lists

### CSS Performance
- Avoid expensive selectors
- Use transforms over position
- Minimize repaints
- GPU-accelerated properties
- Avoid layout thrashing

### JavaScript Performance
- Minimize array iterations
- Cache calculations
- Debounce frequent updates
- Lazy load when possible
- Profile before optimizing

## Accessibility Guidelines

### Keyboard Navigation
- Tab order logical
- Focus indicators visible
- Enter/Space for activation
- Escape to dismiss

### Screen Readers
- Semantic HTML
- ARIA labels where needed
- Alt text for images
- Role attributes

### Visual
- Sufficient contrast ratios
- Text readable at 200% zoom
- No color-only information
- Focus indicators visible

## Security Considerations

### Input Validation
- Validate imported JSON
- Sanitize user inputs
- Check array bounds
- Validate numeric ranges

### Data Storage
- No sensitive data in LocalStorage
- No authentication tokens
- Save files not encrypted
- User controls data export

## Build and Deployment

### Development
```
npm install      Install dependencies
npm run dev      Start dev server
npm run lint     Check code quality
```

### Production
```
npm run build    Create optimized build
npm start        Serve production build
```

### Deployment Options
- Static export: next export
- Vercel: automatic deployment
- Netlify: drag and drop
- GitHub Pages: static hosting

## Version Control Exclusions

### .gitignore
```
node_modules/
.next/
out/
*.log
.env.local
.DS_Store
```

## Code Review Checklist

- [ ] TypeScript types defined
- [ ] No console.log statements
- [ ] Error handling present
- [ ] Comments for complex logic
- [ ] Naming conventions followed
- [ ] Imports organized
- [ ] Tests passing (if implemented)
- [ ] No performance regressions
- [ ] Accessibility considered
- [ ] Documentation updated
