# Research: Unified Keyboard UI Navigation

**Feature**: 013-unified-keyboard-ui
**Date**: 2026-01-23
**Status**: Complete

## Overview

This document consolidates research findings for implementing unified keyboard navigation with jumping arrow indicators across all application screens. Research focused on understanding existing patterns, animation approaches, and best practices for keyboard-first interfaces.

## Research Questions & Findings

### R1: Jumping Arrow Component Reusability

**Question**: Can the existing `JumpingArrow` component be reused without modifications for HomePage, PlayPage, and GameResultsPage?

**Decision**: ✅ YES - Reuse existing component without modifications

**Rationale**:
- Current implementation is already a pure, reusable component
- Takes a single `visible: boolean` prop for conditional rendering
- Animation is handled via CSS Module (`.jumpingArrow` class with bounce keyframe)
- Arrow character (`▶`) and styling are hardcoded but match design requirements
- No component-specific logic or dependencies

**Existing Implementation** (`src/components/JumpingArrow.tsx`):
```typescript
export interface JumpingArrowProps {
  visible: boolean
}

export default function JumpingArrow({ visible }: JumpingArrowProps): JSX.Element | null {
  if (!visible) return null
  return <span className={styles.jumpingArrow}>▶</span>
}
```

**Alternatives Considered**:
1. Create new component with customizable arrow character - REJECTED: No requirement for different arrows
2. Modify existing component to accept position prop - REJECTED: Position is handled by parent layout
3. Create separate components per page - REJECTED: Violates DRY principle

**Usage Pattern**:
```typescript
<JumpingArrow visible={isSelected} />
<button>Start Game</button>
```

---

### R2: Animation Approach (Clarification Resolution)

**Question**: Which animation technique should be used for the jumping arrow: sprite-based frames, CSS steps, or smooth CSS transforms?

**Decision**: ✅ Smooth CSS Transform Animation

**Rationale** (from clarification session):
- User selected Option C: "Smooth CSS transform animation (modern approach, less retro-authentic)"
- Aligns with existing implementation in `JumpingArrow.module.scss`
- Uses `@keyframes bounce` with `transform: translateY()` for vertical displacement
- Performance optimized with `will-change: transform` property
- No additional libraries or assets required

**Existing Animation** (`src/styles/_animations.scss`):
```scss
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);  // 10px vertical displacement
  }
}
```

**Applied Styling** (`src/components/JumpingArrow.module.scss`):
```scss
.jumpingArrow {
  display: inline-block;
  margin-right: $spacing-sm;              // 8px
  color: $color-gold;                     // #ffd700
  font-size: $font-size-lg;               // 20px
  animation: bounce 0.6s ease-in-out infinite;
  will-change: transform;                 // GPU optimization
  text-shadow: $text-shadow-black-lg;     // 6px 6px 0 rgba(#000, 0.5)
}
```

**Alternatives Considered**:
1. Sprite-based frame animation (2-4 frames) - REJECTED: User preferred smooth approach
2. CSS keyframe with discrete steps() - REJECTED: User preferred smooth approach
3. JavaScript-based animation - REJECTED: CSS-only is more performant

---

### R3: PlayPage Navigation State Management

**Question**: How should PlayPage manage selection state for "Valider" and "Restart" options while allowing digit input in the textbox?

**Decision**: ✅ Create `useNavigableOptions` custom hook following `usePlayerManagement` pattern

**Rationale**:
- Existing `usePlayerManagement` hook demonstrates proven pattern for selection state + keyboard navigation
- Separates concerns: hook manages state, component handles rendering
- Enables easy testing of navigation logic independently from UI
- Follows Constitution Principle III (Component-Based Architecture)

**Hook Interface** (to be created):
```typescript
export interface UseNavigableOptionsReturn {
  selectedOption: 'valider' | 'restart'
  setSelectedOption: (option: 'valider' | 'restart') => void
  navigateUp: () => void
  navigateDown: () => void
  executeSelectedOption: () => void
}

// Usage in PlayPage:
const {
  selectedOption,
  navigateUp,
  navigateDown,
  executeSelectedOption
} = useNavigableOptions({
  options: ['valider', 'restart'],
  defaultOption: 'valider',  // From clarification: always default to "valider"
  onValider: handleSubmitAnswer,
  onRestart: handleRestartGame
})
```

**Alternatives Considered**:
1. Inline useState in PlayPage component - REJECTED: Not reusable, harder to test
2. Reuse useFocusManagement hook - REJECTED: Different domain (button selection vs focus management)
3. Global state management (Context/Redux) - REJECTED: Over-engineering for local UI state

---

### R4: Keyboard Hints Configuration Extension

**Question**: How should keyboard hints be updated to support new screen contexts?

**Decision**: ✅ Extend existing `KEYBOARD_HINTS_CONFIG` object with updated configurations

**Rationale**:
- `KeyboardHints` component already exists with config-based architecture
- Current implementation uses `Record<ScreenId, KeyboardHint[]>` pattern
- Simply add/modify screen configs in existing configuration object
- No component changes required

**Existing Config** (`src/components/KeyboardHints.tsx`):
```typescript
export const KEYBOARD_HINTS_CONFIG: Record<ScreenId, KeyboardHint[]> = {
  'player-select': [...],
  home: [...],
  play: [...],
  'pause-menu': [...],
  results: [...]
}
```

**Required Updates**:
```typescript
// HomePage hints (update existing):
home: [
  { key: '↑↓', description: 'Navigate' },  // ADD: For consistency (even with single option)
  { key: 'Enter', description: 'Select' }, // CHANGE: from "Start Game"
  { key: 'ESC', description: 'Change Player' },
]

// PlayPage hints (update existing):
play: [
  { key: '0-9', description: 'Type Answer' },
  { key: 'Backspace', description: 'Delete' },  // ADD: New hint
  { key: '↑↓', description: 'Navigate Options' },
  { key: 'Enter', description: 'Confirm' },
  { key: 'ESC', description: 'Pause' },
]

// Results hints (update existing):
results: [
  { key: 'Enter', description: 'Continue' },
  { key: 'ESC', description: 'Change Player' },  // ADD: For consistency
]
```

**Alternatives Considered**:
1. Create separate hints component per screen - REJECTED: Violates DRY
2. Pass hints as props to each page - REJECTED: Centralized config is cleaner
3. Dynamic hint generation based on screen props - REJECTED: Static config is simpler

---

### R5: Default Selection Behavior (Clarification Resolution)

**Question**: What should be the default selected option when PlayPage loads or when a new question appears?

**Decision**: ✅ "Valider" is always selected by default (primary action prioritized)

**Rationale** (from clarification session):
- Follows standard form UX patterns where primary action (submit) is default
- Reduces accidental game restarts (destructive action requires explicit navigation)
- Aligns with principle of least surprise
- Consistent with "Continue" being default on results screen

**Implementation Impact**:
- `useNavigableOptions` hook sets `defaultOption: 'valider'`
- After answer submission → new question → selection resets to 'valider'
- After restart → new game → selection defaults to 'valider'

**Alternatives Considered**:
1. "Restart" as default - REJECTED: Destructive action shouldn't be default
2. No default selection - REJECTED: Requires extra keypress before Enter works
3. Remember last selection - REJECTED: Could lead to accidental restarts

---

### R6: Pause Menu Selection State Persistence (Clarification Resolution)

**Question**: When user opens pause menu (Esc) and then cancels back to gameplay, should PlayPage selection state be preserved or reset?

**Decision**: ✅ Preserve selection state (selected option remains the same when returning)

**Rationale** (from clarification session):
- Better user experience: maintains navigation context
- Users won't lose their position if they accidentally press Esc
- Consistent with other state preservation (answer textbox content persists)
- No technical complexity added

**Implementation Impact**:
- PlayPage selection state (`selectedOption`) is NOT reset when pause menu opens/closes
- Hook state persists across pause menu lifecycle
- Only reset selection state on: new question appears, game restarts

**Alternatives Considered**:
1. Reset to "Valider" default - REJECTED: Loses user context
2. Clear selection entirely - REJECTED: Worse UX than reset
3. Save state to localStorage - REJECTED: Over-engineering for transient UI state

---

### R7: Keyboard Hints Overflow Strategy (Clarification Resolution)

**Question**: When keyboard hints are too long for viewport width, should they wrap to multiple lines or be abbreviated?

**Decision**: ✅ Always wrap to multiple lines (ensures all controls visible)

**Rationale** (from clarification session):
- Discoverability is critical for keyboard-first navigation
- Abbreviation could hide important controls
- Keyboard hints are at bottom of screen (vertical space less constrained)
- Wrapping maintains complete information

**Implementation Impact**:
- CSS for `.keyboardHints` container uses `flex-wrap: wrap`
- No max-height or overflow:hidden constraints
- Hints wrap naturally when container width insufficient

**Current Styling** (`src/components/KeyboardHints.module.scss`):
```scss
.hintsContainer {
  display: flex;
  gap: $spacing-md;
  flex-wrap: wrap;  // ✅ Already supports wrapping
  justify-content: center;
}
```

**Alternatives Considered**:
1. Always abbreviate (single line) - REJECTED: Could hide controls
2. Wrap first, abbreviate if >3 lines - REJECTED: Added complexity unnecessary
3. Horizontal scroll - REJECTED: Poor mobile UX

---

### R8: Single Option Selection Behavior (Clarification Resolution)

**Question**: When a screen has only one selectable option (e.g., HomePage "Start Game"), should the jumping arrow appear and should arrow keys work?

**Decision**: ✅ Always show jumping arrow, arrow keys do nothing (visual consistency)

**Rationale** (from clarification session):
- Visual consistency reinforces keyboard-first interaction pattern
- Users immediately understand Enter will activate the option
- Arrow keys gracefully do nothing (no error, no feedback)
- Simpler implementation: no special-case logic per screen

**Implementation Impact**:
- HomePage: Shows jumping arrow next to "Start Game" button
- GameResultsPage: Shows jumping arrow next to "Continue" button
- Arrow key handlers simply don't navigate when `options.length === 1`

**Alternatives Considered**:
1. Hide arrow on single-option screens - REJECTED: Inconsistent visual language
2. Dim/static animation on single option - REJECTED: Adds complexity, confusing UX
3. Arrow keys cycle to same option - REJECTED: Unnecessary, potentially confusing

---

### R9: Testing Strategy for Dual Input Support

**Question**: How should tests validate both keyboard AND mouse input methods work for all interactions?

**Decision**: ✅ Write parallel test cases for each interaction: one keyboard test, one mouse test

**Rationale**:
- Constitution Principle VI mandates dual input support
- Each test validates one interaction method (clear, focused assertions)
- Easier to debug failures (know exactly which input method broke)
- Follows existing test patterns in PlayerSelectPage

**Test Pattern**:
```typescript
// Keyboard test
it('should select option with Enter key', () => {
  render(<Component />)
  fireEvent.keyDown(window, { key: 'Enter' })
  expect(mockNavigate).toHaveBeenCalledWith('/expected-route')
})

// Mouse test
it('should select option with mouse click', () => {
  render(<Component />)
  const button = screen.getByText('Start Game')
  fireEvent.click(button)
  expect(mockNavigate).toHaveBeenCalledWith('/expected-route')
})
```

**E2E Test Pattern** (Playwright):
```typescript
// Validate both keyboard and mouse in same test
test('User can navigate with keyboard and mouse', async ({ page }) => {
  await page.goto('http://localhost:5174')

  // Keyboard navigation
  await page.keyboard.press('ArrowDown')
  await page.screenshot({ path: '01-arrow-moved.png' })

  // Mouse interaction
  await page.click('text=Start Game')
  await page.screenshot({ path: '02-clicked.png' })

  expect(page.url()).toContain('/play')
})
```

**Alternatives Considered**:
1. Single test with both methods - REJECTED: Harder to isolate failures
2. Only test keyboard (assume mouse works) - REJECTED: Violates constitution
3. Randomize input method per test run - REJECTED: Non-deterministic tests are bad

---

### R10: Component Architecture for HomePage/GameResultsPage

**Question**: Should HomePage and GameResultsPage use the same pattern as PlayerSelectPage (inline selection state) or create a shared component?

**Decision**: ✅ Use inline selection state (no shared component needed)

**Rationale**:
- HomePage has only 1 button (no actual navigation, just visual indicator)
- GameResultsPage has only 1 button (no actual navigation)
- Creating abstraction for 1-button case would be over-engineering
- Each page has unique layout requirements

**Implementation Pattern** (HomePage example):
```typescript
export default function HomePage(): JSX.Element {
  const [isButtonSelected] = useState(true)  // Always selected (single option)

  const handleStartGame = (): void => {
    navigate('/play')
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleStartGame()
      } else if (e.key === 'Escape') {
        navigate('/')
      }
      // ArrowUp/ArrowDown do nothing (single option)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  return (
    <button onClick={handleStartGame}>
      <JumpingArrow visible={isButtonSelected} />
      Start Game
    </button>
  )
}
```

**Alternatives Considered**:
1. Create `SingleOptionButton` component - REJECTED: Premature abstraction
2. Use `useNavigableOptions` hook for single option - REJECTED: Over-engineering
3. No selection state at all - REJECTED: Arrow wouldn't appear

---

## Best Practices Applied

### Keyboard Navigation
- **Bound checking**: Use `Math.max(0, index - 1)` and `Math.min(maxIndex, index + 1)`
- **Event prevention**: Call `e.preventDefault()` on Arrow keys to stop scrolling
- **Cleanup**: Always return cleanup function from `useEffect` to remove listeners
- **Dependencies**: Include all state/callbacks in `useEffect` dependency array

### Component Design
- **Reusability**: `JumpingArrow` component is pure, no side effects
- **Composition**: Components compose existing components rather than reimplementing
- **Single Responsibility**: Each component/hook has one focused purpose

### Animation Performance
- **GPU Acceleration**: Use `transform` instead of `top`/`left` for position changes
- **will-change**: Hint browser about upcoming animations
- **Infinite Loops**: Use `infinite` keyword for continuous animations

### Testing
- **User-Centric**: Test what users see/do, not implementation details
- **Both Input Methods**: Validate keyboard AND mouse for every interaction
- **Visual Validation**: E2E tests capture screenshots at key states

---

## Technology Choices Summary

| Decision Area | Choice | Rationale |
|---------------|--------|-----------|
| **Arrow Component** | Reuse existing `JumpingArrow` | Already perfect, no modifications needed |
| **Animation Style** | Smooth CSS transform | User preference, existing implementation |
| **State Management** | Custom `useNavigableOptions` hook | Proven pattern from `usePlayerManagement` |
| **Hints Extension** | Update existing config object | No component changes required |
| **Default Selection** | "Valider" always default | Primary action prioritized |
| **Pause State** | Preserve selection state | Better UX, maintains context |
| **Hints Overflow** | Wrap to multiple lines | Discoverability over aesthetics |
| **Single Option** | Show arrow, keys do nothing | Visual consistency |
| **Test Strategy** | Parallel tests per input method | Clear, focused, debuggable |
| **Page Architecture** | Inline state for simple pages | No over-engineering |

---

## Open Questions Resolved

✅ All research questions answered
✅ All clarifications from /speckit.clarify integrated
✅ No blockers remaining for implementation

---

## Next Steps

Proceed to **Phase 1: Design & Contracts** to create:
1. data-model.md - UI state model and type definitions
2. quickstart.md - Implementation steps and code examples
3. contracts/ - N/A for pure UI feature (no API contracts)

---

**Research Status**: ✅ COMPLETE
**Ready for Phase 1**: YES
**Blockers**: NONE
