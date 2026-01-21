# Research: Enhanced Keyboard Navigation Implementation

**Feature**: 012-keyboard-navigation
**Date**: 2026-01-18
**Status**: Complete

## RT-001: Pause Menu Modal Patterns in React

### Decision
Use React portal-based modal with focus trap using native DOM manipulation and keyboard event handlers.

### Rationale
- **React Portals**: Render modal at document root to avoid z-index stacking issues
- **Focus Trap**: Use `useEffect` with keyboard event listeners to cycle focus within modal
- **No External Libraries**: Project constitution emphasizes minimal dependencies; focus trap is simple enough to implement
- **Z-Index Strategy**: Use existing `$z-index-overlay` (500) and `$z-index-popup` (100) from tokens

### Implementation Pattern
```typescript
// Focus trap within modal
useEffect(() => {
  if (!isOpen) return

  const modalElement = modalRef.current
  const focusableElements = modalElement?.querySelectorAll(
    'button, [tabindex]:not([tabindex="-1"])'
  )

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      // Cycle through focusable elements
    }
  }

  modalElement?.addEventListener('keydown', handleKeyDown)
  return () => modalElement?.removeEventListener('keydown', handleKeyDown)
}, [isOpen])
```

### Animation Timing
- **Zoom/Splash Duration**: 300ms (standard for perceived responsiveness)
- **Animation Type**: `transform: scale()` with `ease-out` timing
- **CSS Keyframes**: Use Sass `@keyframes` in `_animations.scss`

### Alternatives Considered
- **react-modal library**: Rejected - adds unnecessary dependency
- **Headless UI**: Rejected - too heavy for simple pause menu
- **Manual div overlay**: Selected - full control, aligns with constitution

---

## RT-002: Timer Pause/Resume Implementation

### Decision
Use `useRef` to track elapsed time with `Date.now()` timestamps instead of interval counter.

### Rationale
- **Accuracy**: Timestamp-based approach eliminates drift from interval delays
- **Pause/Resume**: Store `pausedAt` timestamp and calculate remaining time on resume
- **Error Resilience**: Wrap state updates in try-catch for graceful degradation
- **Testing**: Easier to mock `Date.now()` than `setInterval` in tests

### Implementation Pattern
```typescript
function useTimer(totalSeconds: number) {
  const [timeRemaining, setTimeRemaining] = useState(totalSeconds)
  const [isPaused, setIsPaused] = useState(false)
  const startTimeRef = useRef<number>(Date.now())
  const pausedAtRef = useRef<number | null>(null)

  const pause = () => {
    if (!isPaused) {
      pausedAtRef.current = Date.now()
      setIsPaused(true)
    }
  }

  const resume = () => {
    if (isPaused && pausedAtRef.current) {
      const pausedDuration = Date.now() - pausedAtRef.current
      startTimeRef.current += pausedDuration
      pausedAtRef.current = null
      setIsPaused(false)
    }
  }

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      const remaining = Math.max(0, totalSeconds - elapsed)
      setTimeRemaining(remaining)

      if (remaining === 0) {
        clearInterval(interval)
      }
    }, 100) // Update every 100ms for smooth progress bar

    return () => clearInterval(interval)
  }, [isPaused, totalSeconds])

  return { timeRemaining, isPaused, pause, resume }
}
```

### Error Handling
- Wrap `setTimeRemaining` in try-catch
- Log errors to console but continue game
- Default to resuming if error during pause

### Testing Strategy
- Mock `Date.now()` with vi.spyOn
- Mock `setInterval` with vi.useFakeTimers()
- Test pause during mid-game
- Test resume accuracy
- Test timer expiring while paused

### Alternatives Considered
- **Counter-based interval**: Rejected - accumulates drift over time
- **requestAnimationFrame**: Rejected - overkill for 100ms updates
- **Third-party timer library**: Rejected - constitution favors minimal dependencies

---

## RT-003: Focus Management Across Screens

### Decision
Use custom `useFocusManagement` hook with refs array and index-based focus control.

### Rationale
- **Programmatic Control**: Arrow keys move focus, not native tab order
- **Focus Restoration**: Store previous focus before modal opens
- **Accessibility**: Maintain focus outline for keyboard users
- **Reusability**: Single hook pattern for all screens

### Implementation Pattern
```typescript
function useFocusManagement(elementCount: number) {
  const [focusIndex, setFocusIndex] = useState(0)
  const refs = useRef<(HTMLElement | null)[]>([])

  const focusElement = (index: number) => {
    const element = refs.current[index]
    if (element) {
      try {
        element.focus()
        setFocusIndex(index)
      } catch (error) {
        console.error('Focus error:', error)
      }
    }
  }

  const moveFocus = (direction: 'up' | 'down') => {
    const newIndex = direction === 'up'
      ? Math.max(0, focusIndex - 1)
      : Math.min(elementCount - 1, focusIndex + 1)
    focusElement(newIndex)
  }

  return { refs, focusIndex, moveFocus, focusElement }
}
```

### Focus Restoration Pattern
```typescript
// Before opening modal
const previousFocus = document.activeElement as HTMLElement

// After closing modal
useEffect(() => {
  if (!modalOpen && previousFocus) {
    try {
      previousFocus.focus()
    } catch (error) {
      console.error('Failed to restore focus:', error)
    }
  }
}, [modalOpen, previousFocus])
```

### Screen Reader Compatibility
- Use `aria-label` on focusable elements
- `role="dialog"` on modal
- `aria-modal="true"` on pause menu
- Focus first element on modal open

### Alternatives Considered
- **Native tab order**: Rejected - doesn't match retro gaming UX
- **roving tabindex**: Rejected - more complex than needed
- **Focus management library**: Rejected - simple enough to implement

---

## RT-004: Retro Animation Performance

### Decision
Use CSS keyframe animations with `transform` and `opacity` for GPU acceleration.

### Rationale
- **60fps Guarantee**: GPU-accelerated properties (`transform`, `opacity`) avoid reflows
- **CSS vs JS**: CSS animations run on compositor thread, freeing main thread
- **Animation Restart**: Change `animation-name` to force restart on focus change
- **Sass Integration**: Keyframes defined once in `_animations.scss`, reused everywhere

### Implementation Pattern
```scss
// _animations.scss
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

// Component styles
.jumpingArrow {
  animation: bounce 1s ease-in-out infinite;
  will-change: transform; // Hint to browser for GPU layer
}
```

### Animation Restart Strategy
```typescript
// Force animation restart by toggling class
const [animationKey, setAnimationKey] = useState(0)

useEffect(() => {
  setAnimationKey(prev => prev + 1) // Forces re-render and animation restart
}, [focusIndex])

// In styles
<span className={styles.cursor} key={animationKey}>▶</span>
```

### Performance Optimization
1. **will-change**: Hint browser to create GPU layer
2. **transform over top/left**: Hardware accelerated
3. **opacity over visibility**: Smoother transitions
4. **Avoid box-shadow in animations**: Expensive to animate

### Performance Monitoring
- Chrome DevTools Performance tab
- Target: Maintain 60fps (16.67ms per frame)
- Watch for "Layout Shift" warnings
- Monitor paint operations

### Alternatives Considered
- **JavaScript animations**: Rejected - main thread bottleneck
- **CSS transitions**: Rejected - don't loop infinitely as smoothly
- **SVG animations**: Rejected - overkill for simple arrow

---

## RT-005: Auto-Focus Input Pattern

### Decision
Use global window keyboard listener with digit detection and programmatic input focus.

### Rationale
- **Global Scope**: Listen at window level to catch digits from any focus state
- **Ref-Based Focus**: Use `inputRef.current.focus()` for programmatic control
- **Value Injection**: Set input value after focus to ensure digit appears
- **Event Cleanup**: Remove listener on unmount to prevent memory leaks

### Implementation Pattern
```typescript
function PlayScreen() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [answer, setAnswer] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only digits 0-9
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault()

        // Focus input if not already focused
        if (document.activeElement !== inputRef.current) {
          try {
            inputRef.current?.focus()
          } catch (error) {
            console.error('Auto-focus failed:', error)
          }
        }

        // Append digit to current value
        setAnswer(prev => prev + e.key)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return <input ref={inputRef} value={answer} onChange={e => setAnswer(e.target.value)} />
}
```

### Event Propagation Handling
- Use `e.preventDefault()` to prevent default browser behavior
- Don't use `e.stopPropagation()` - allow other handlers to run
- Filter by active element to avoid conflicts with modal

### Accessibility Considerations
- Announce focus change to screen readers with `aria-live="polite"`
- Provide visual indication of auto-focus
- Don't trap users - they can still tab away
- Document behavior in keyboard hints

### Conflict Prevention
```typescript
// Don't auto-focus if modal is open
if (isPauseMenuOpen) return

// Don't auto-focus if already typing
if (document.activeElement === inputRef.current) return
```

### Testing Strategy
```typescript
it('should auto-focus input when digit typed', () => {
  render(<PlayScreen />)
  const input = screen.getByRole('textbox')

  fireEvent.keyDown(window, { key: '5' })

  expect(input).toHaveFocus()
  expect(input).toHaveValue('5')
})
```

### Alternatives Considered
- **Input event listener**: Rejected - doesn't capture all keyboard events
- **KeyboardEvent at component level**: Rejected - doesn't capture when button focused
- **Debouncing**: Rejected - adds unnecessary delay

---

## Summary of Decisions

| Research Area | Decision | Key Benefit |
|---------------|----------|-------------|
| Modal Pattern | React Portal + Custom Focus Trap | No dependencies, full control |
| Timer Pause | `Date.now()` Timestamps | Drift-free, accurate timing |
| Focus Management | Custom Hook with Refs Array | Reusable, programmatic control |
| Animations | CSS Keyframes with GPU Acceleration | 60fps guaranteed performance |
| Auto-Focus Input | Window-Level Keyboard Listener | Works from any focus state |

All decisions prioritize:
- ✅ Constitutional compliance (no unnecessary dependencies)
- ✅ Performance (60fps, <100ms response)
- ✅ Testability (mockable, unit-testable)
- ✅ Accessibility (screen reader compatible)
- ✅ Error resilience (try-catch, graceful degradation)
