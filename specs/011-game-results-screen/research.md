# Research Findings: Game Results Screen

**Date**: 2026-01-16
**Feature**: Game Results Screen
**Purpose**: Document technical research and decisions for implementing the results screen

## Research Questions

### Q1: Timed Animation Stop Pattern

**Question**: How to implement an animation that runs for exactly 5 seconds then stops in React?

**Decision**: CSS keyframe animation + React state + setTimeout

**Rationale**:
- **CSS keyframes** provide smooth, performant animations (GPU-accelerated)
- **React state** (`isBlinking`) controls whether animation CSS class is applied
- **setTimeout** with 5000ms delay toggles state to stop animation
- **useEffect cleanup** prevents memory leaks if component unmounts before timer expires

**Implementation Pattern**:
```typescript
const [isBlinking, setIsBlinking] = useState(true)

useEffect(() => {
  const timer = setTimeout(() => {
    setIsBlinking(false)
  }, 5000)

  return () => clearTimeout(timer)
}, [])

// In styles:
const resultCard = {
  ...baseStyles,
  animation: isBlinking ? 'goldFadingBlink 2s ease-in-out infinite' : 'none'
}
```

**Alternatives Considered**:
1. **JavaScript requestAnimationFrame loop**: More complex, requires manual animation calculation, no benefit over CSS
2. **CSS animation-iteration-count with calculated value**: Cannot stop mid-animation precisely at 5 seconds
3. **React Spring or Framer Motion library**: Overkill for simple opacity fade, adds dependency

**Reference**: Similar pattern used in ProgressBar.tsx (lines 54-66) with inline keyframes

---

### Q2: Route Navigation and Data Passing

**Question**: How should PlayPage pass game data (score, results) to GameResultsPage?

**Decision**: React Router location state via `navigate('/results', { state: { score, results } })`

**Rationale**:
- **Type-safe**: React Router types state object automatically
- **Session-scoped**: State exists only during navigation, not persisted
- **No localStorage pollution**: Results already saved to localStorage by PlayPage, no need to duplicate
- **Clean API**: GameResultsPage receives data via `useLocation().state`

**Implementation Pattern**:
```typescript
// PlayPage (sender)
navigate('/results', {
  state: {
    score: number,
    results: GameResult[]
  }
})

// GameResultsPage (receiver)
const location = useLocation()
const { score, results } = location.state as GameResultsState
```

**Alternatives Considered**:
1. **URL query parameters**: Requires serializing results array, URL becomes very long, poor UX
2. **localStorage temporary key**: Unnecessary complexity, requires cleanup, race conditions possible
3. **Context API**: Overkill for one-time data pass between pages
4. **Redux/Zustand state**: No global state management exists in project, violates simplicity principle

**Reference**: React Router 7.5.0 supports location.state natively, type-safe with TypeScript

---

### Q3: Score Calculation Strategy

**Question**: Should GameResultsPage recalculate stats or receive pre-calculated values?

**Decision**: Receive score from route state, calculate accuracy from results array

**Rationale**:
- **Score**: Already calculated by PlayPage during gameplay (combo system, lives), pass as-is
- **Accuracy**: Simple calculation `(correctCount / totalQuestions) * 100`, derive from results array
- **Correctness**: Count correct answers from `results.filter(r => r.correct).length`
- **Total questions**: `results.length` (includes both correct and incorrect)
- **Single source of truth**: PlayPage creates `{score, results}`, GameResultsPage derives remaining stats

**Implementation Pattern**:
```typescript
const correctCount = results.filter(r => r.correct).length
const totalQuestions = results.length
const accuracy = totalQuestions > 0
  ? Math.round((correctCount / totalQuestions) * 100)
  : 0
```

**Alternatives Considered**:
1. **Pass all calculated stats**: Violates DRY, increases coupling between PlayPage and GameResultsPage
2. **Recalculate score**: Score includes combo multipliers and complex logic, should not duplicate
3. **Fetch from localStorage**: Unnecessary I/O, data already available in route state

**Edge Cases Handled**:
- **Division by zero**: totalQuestions === 0 returns 0% accuracy
- **Rounding**: `Math.round()` for clean integer percentages (80%, not 80.5%)

---

### Q4: Animation Style and Timing

**Question**: What specific CSS animation creates a "soft fading blink" effect?

**Decision**: Opacity fade (1.0 → 0.8 → 1.0) + box-shadow glow pulse over 2-second cycles

**Rationale**:
- **Soft fade**: Opacity change is gentle (only 20% reduction), not harsh
- **Retro aesthetic**: Gold box-shadow glow matches existing leaderboard gold medal effect
- **Non-jarring**: 2-second cycle duration is slow enough to be comfortable
- **Total duration**: 5 seconds allows for ~2.5 animation cycles before stopping

**CSS Implementation**:
```css
@keyframes goldFadingBlink {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
  }
  50% {
    opacity: 0.8;
    box-shadow: 0 0 40px rgba(255, 215, 0, 1);
  }
}
```

**Alternatives Considered**:
1. **Visibility toggle (display: block/none)**: Too harsh, causes layout shift
2. **Scale transform**: Creates zoom effect, not a "blink", causes layout reflow
3. **Color change**: Less retro feel, gold/yellow are already the primary colors

**Reference**: Existing `goldGlow` animation in index.css (lines 152-163) provides similar pulsing effect

---

### Q5: Keyboard Navigation Pattern

**Question**: How to implement ENTER key navigation while maintaining event listener cleanup?

**Decision**: useEffect with keyboard listener + cleanup function (same pattern as existing pages)

**Rationale**:
- **Consistency**: HomePage and PlayerSelectPage use identical pattern
- **Memory safety**: Cleanup function removes listener on unmount
- **Event delegation**: Listen on `window` to catch all keyboard events
- **Type safety**: TypeScript KeyboardEvent type enforced

**Implementation Pattern**:
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter') {
      navigate('/home')
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [navigate])
```

**Alternatives Considered**:
1. **onKeyDown prop on container div**: Requires div to have focus, not keyboard-first UX
2. **document.addEventListener**: Works but `window` is more conventional for global listeners
3. **useHotkeys library**: Unnecessary dependency for single key binding

**Reference**: HomePage.tsx (lines 82-94) uses exact same pattern for ESC and ENTER keys

---

## Best Practices Applied

### React Patterns
- **Functional components only**: No class components
- **Hooks for side effects**: useState, useEffect, useNavigate, useLocation
- **Event listener cleanup**: Return cleanup function from useEffect
- **Type-safe props**: Interface with JSDoc for all components

### TypeScript Patterns
- **Strict mode**: No `any` types
- **Explicit return types**: All functions have return type annotations
- **Type assertions**: `location.state as GameResultsState` with interface
- **Exported interfaces**: Props and state interfaces public for docs

### Testing Patterns
- **Test-Driven Development**: Tests written BEFORE implementation
- **React Testing Library**: User-centric queries (getByText, getByRole)
- **Happy-DOM environment**: Lightweight, fast test execution
- **Vitest matchers**: `toBeInTheDocument`, `toHaveBeenCalledWith`

### CSS Patterns
- **CSS-in-JS**: Inline styles object for component-specific styles
- **Global keyframes**: Animation definitions in index.css for reusability
- **Retro aesthetic**: Gold/yellow gradients, pixel borders, Press Start 2P font
- **Responsive design**: Mobile-friendly spacing and sizing

---

## Technology Stack Summary

**Core Technologies** (Existing):
- React 19.0.0 - Modern hooks, concurrent features
- TypeScript 5.7.2 - Strict mode, explicit types
- React Router DOM 7.5.0 - Client-side routing with location state
- Vite 6.2.0 - Fast build tool, HMR, optimized production builds
- Vitest 4.0.16 - Modern test runner, compatible with Vite
- Happy-DOM 20.0.11 - Lightweight DOM environment for tests

**No New Dependencies Required**:
- All functionality achievable with existing stack
- CSS animations (no animation library needed)
- Route state (no state management library needed)
- Keyboard listeners (no hotkey library needed)

---

## Performance Considerations

### Animation Performance
- **GPU-accelerated properties**: Opacity and box-shadow use GPU compositing
- **No layout thrashing**: Opacity changes don't trigger reflow
- **Animation stop**: Removing animation class after 5 seconds prevents unnecessary GPU work

### Render Performance
- **Single render on mount**: Data received from route state, no fetching
- **Minimal re-renders**: Only animation state toggle after 5 seconds
- **No expensive calculations**: Accuracy calculation is O(n) where n = number of questions (~10-20)

### Memory Management
- **setTimeout cleanup**: Prevents memory leaks on unmount
- **Event listener cleanup**: Removes keyboard listener on unmount
- **No DOM leaks**: All refs and event handlers properly cleaned up

---

## Accessibility Considerations

### Keyboard Navigation
- **ENTER key**: Primary action (navigate to homepage)
- **Focus indicators**: Button has visible focus state for keyboard users
- **Screen readers**: Semantic HTML (button, headings) for proper announcement

### Visual Accessibility
- **High contrast**: Gold/yellow on dark backgrounds meets WCAG AA
- **Animation**: Soft fade (not rapid flashing) prevents photosensitive issues
- **Font size**: Retro font is large and readable (minimum 16px)

---

## Security Considerations

### Data Validation
- **Route state validation**: Check for missing state, default to safe values
- **Number validation**: Ensure score and accuracy are valid numbers
- **Array validation**: Verify results is an array before filtering

### XSS Prevention
- **No dangerouslySetInnerHTML**: All content rendered via React (auto-escaped)
- **No user-generated HTML**: Question strings are pre-defined multiplication equations
- **localStorage isolation**: Results are JSON, no code execution risk

---

## Conclusion

All research questions resolved with concrete decisions. Implementation can proceed with:
- Clear animation strategy (CSS + state + timer)
- Defined data passing mechanism (route state)
- Established calculation approach (derive from results array)
- Proven navigation pattern (reuse existing keyboard listener pattern)

**Ready for Phase 1: Data Model and Implementation**
