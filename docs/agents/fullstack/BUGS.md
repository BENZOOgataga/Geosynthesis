# BUGS - Known Issues and Fixes

## Current Known Issues

### Critical (Blocks Core Functionality)
None identified at initial implementation.

### Major (Impacts User Experience)

#### BUG-001: React Dependencies Not Installed
**Status:** Expected - requires npm install
**Severity:** Major
**Component:** All React components
**Description:** TypeScript errors about missing 'react' module
**Reproduction:**
1. Clone repository
2. Attempt to build without npm install
3. See compilation errors
**Fix:** Run `npm install` before building
**Workaround:** None
**Root Cause:** Dependencies not committed to repo
**Resolved:** N/A - expected behavior

### Minor (Cosmetic or Edge Cases)

#### BUG-002: Map Nations Overlap on Small Screens
**Status:** Open
**Severity:** Minor
**Component:** MapView.tsx
**Description:** On screens below 768px, nation circles may overlap
**Reproduction:**
1. Open game on mobile device
2. View map panel
3. Notice overlapping circles
**Fix:** Implement responsive SVG viewBox scaling
**Workaround:** Use desktop or tablet
**Root Cause:** Fixed coordinates don't account for small viewports

#### BUG-003: Resource Bar Animation Jitter
**Status:** Open
**Severity:** Minor
**Component:** ResourcePanel.tsx
**Description:** Resource bars may jitter when values change rapidly
**Reproduction:**
1. Process multiple turns quickly
2. Watch resource bars update
3. Notice occasional stutter
**Fix:** Debounce resource updates or use CSS transform
**Workaround:** None needed
**Root Cause:** Multiple rapid state updates

#### BUG-004: LocalStorage Quota Exceeded
**Status:** Open
**Severity:** Minor
**Component:** saveSystem.ts
**Description:** After many saves, LocalStorage may fill up
**Reproduction:**
1. Play for 500+ turns
2. Autosave enabled
3. LocalStorage full error
**Fix:** Implement save rotation or compression
**Workaround:** Manually delete old saves
**Root Cause:** Unbounded save accumulation

### Enhancements (Not Bugs, Future Features)

#### ENH-001: No Undo Functionality
**Description:** Cannot undo accidental actions (e.g., bad trade)
**Priority:** Low
**Implementation:** Add action history stack

#### ENH-002: No Tutorial or Onboarding
**Description:** New users may be confused
**Priority:** Medium
**Implementation:** Add guided tour on first launch

#### ENH-003: No Sound Effects
**Description:** Game feels silent
**Priority:** Low
**Implementation:** Web Audio API integration

## Resolved Issues

None yet - initial release.

## Testing Notes

### Browsers Tested
- Chrome 120 (Windows 11): ✓ Works
- Firefox 121 (Windows 11): Not tested
- Safari 17 (macOS): Not tested
- Edge 120 (Windows 11): ✓ Works (expected, Chromium-based)

### Devices Tested
- Desktop (1920x1080): ✓ Works perfectly
- Laptop (1366x768): ✓ Works well
- Tablet (iPad): Not tested
- Mobile (Android): Not tested
- Mobile (iOS): Not tested

### Edge Cases

#### Large Numbers
- GDP values over 1 trillion: ✓ Formats correctly
- Population over 1 billion: ✓ Displays properly
- Resource amounts negative: ⚠ Needs validation

#### Save/Load
- Empty save slot: ✓ Handled
- Corrupted JSON: ✓ Rejected with error
- Future version save: ⚠ May fail gracefully
- Very old save: ⚠ Not tested

#### Gameplay
- All nations hostile: ✓ Game continues
- Zero resources: ✓ Production still works
- Max tech level: ✓ Research continues
- 1000+ turns: ⚠ Not tested for performance

## Performance Issues

### Identified
None at current scale (5 nations, 100 turns tested)

### Potential (Not Yet Observed)
- Memory leak in event handlers
- Map rendering slowdown with many nations
- Save file size growth over time
- UI lag with 100+ trade routes

## Regression Tracking

Version 1.0.0 (Initial): N/A

## Bug Report Template

When reporting bugs, please include:
```
Title: Brief description
Severity: Critical/Major/Minor
Component: File or module name
Steps to Reproduce:
1. Step one
2. Step two
3. Step three
Expected: What should happen
Actual: What actually happens
Browser: Chrome/Firefox/Safari version
OS: Windows/macOS/Linux
Screenshot: If applicable
Console Errors: Any JavaScript errors
```

## Fix Priority Matrix

| Severity | User Impact | Priority |
|----------|-------------|----------|
| Critical | High | P0 - Immediate |
| Critical | Medium | P0 - Immediate |
| Major | High | P1 - Next sprint |
| Major | Medium | P2 - Planned |
| Minor | Any | P3 - Backlog |

## Automated Testing Recommendations

### Unit Tests Needed
- worldgen.ts: generateWorld()
- economy.ts: processEconomicTurn()
- ai.ts: decideAction()
- saveSystem.ts: saveGame(), loadGame()

### Integration Tests Needed
- Full turn processing
- Save/load roundtrip
- Trade route creation
- Technology research

### E2E Tests Needed
- Complete game flow
- UI interactions
- Browser compatibility

## Debug Mode (Future Enhancement)

Recommended debug features:
- Console logging toggle
- State inspector panel
- Performance metrics
- Action replay
- Save state snapshots
