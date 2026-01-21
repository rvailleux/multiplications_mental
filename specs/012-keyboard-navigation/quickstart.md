# Quickstart: Enhanced Keyboard Navigation

**Feature**: 012-keyboard-navigation
**Audience**: Developers implementing or extending keyboard navigation
**Date**: 2026-01-18

## Overview

This guide helps developers:
- Add jumping arrow indicators to new interactive elements
- Configure keyboard hints for new screens
- Implement pausable components
- Test keyboard navigation patterns

---

## Adding Jumping Arrow to Interactive Elements

### Step 1: Import the Component

```typescript
import JumpingArrow from '../components/JumpingArrow'
```

### Step 2: Add Focus State Management

```typescript
import { useFocusManagement } from '../hooks/useFocusManagement'

function MyComponent() {
  const buttonCount = 2 // Number of focusable elements
  const { refs, focusIndex, moveFocus } = useFocusManagement(buttonCount)

  // ... keyboard event handling
}
```

### Step 3: Add Jumping Arrow to Elements

```typescript
return (
  <button ref={el => refs.current[0] = el}>
    <JumpingArrow visible={focusIndex === 0} />
    Button Text
  </button>
)
```

### Complete Example

```typescript
import { useEffect } from 'react'
import JumpingArrow from '../components/JumpingArrow'
import { useFocusManagement } from '../hooks/useFocusManagement'

export default function MyScreen() {
  const { refs, focusIndex, moveFocus } = useFocusManagement(3)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        moveFocus('up')
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        moveFocus('down')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [moveFocus])

  return (
    <div>
      <button ref={el => refs.current[0] = el}>
        <JumpingArrow visible={focusIndex === 0} />
        Option 1
      </button>
      <button ref={el => refs.current[1] = el}>
        <JumpingArrow visible={focusIndex === 1} />
        Option 2
      </button>
      <button ref={el => refs.current[2] = el}>
        <JumpingArrow visible={focusIndex === 2} />
        Option 3
      </button>
    </div>
  )
}
```

---

## Configuring Keyboard Hints for New Screens

### Step 1: Add Screen ID to Type Definition

Edit `contracts/keyboard-hints.ts`:

```typescript
export type ScreenId =
  | 'player-select'
  | 'home'
  | 'play'
  | 'pause-menu'
  | 'results'
  | 'my-new-screen'  // Add your screen here
```

### Step 2: Add Hints Configuration

In the same file, add to `KEYBOARD_HINTS_CONFIG`:

```typescript
export const KEYBOARD_HINTS_CONFIG: Record<ScreenId, KeyboardHint[]> = {
  // ... existing configs
  'my-new-screen': [
    { key: '↑↓', description: 'Navigate' },
    { key: 'Enter', description: 'Confirm' },
    { key: 'ESC', description: 'Back' }
  ]
}
```

### Step 3: Use KeyboardHints Component

```typescript
import KeyboardHints from '../components/KeyboardHints'

export default function MyNewScreen() {
  return (
    <div>
      {/* Your screen content */}

      <KeyboardHints screenId="my-new-screen" />
    </div>
  )
}
```

---

## Implementing Pausable Components

### Step 1: Extend useTimer Hook

The `useTimer` hook already supports pause/resume. Use it in your component:

```typescript
import { useTimer } from '../hooks/useTimer'

function MyGameComponent() {
  const { timeRemaining, isPaused, pause, resume } = useTimer(60)

  // Timer automatically provides pause/resume functionality
}
```

### Step 2: Integrate with Pause Menu

```typescript
import { usePauseMenu } from '../hooks/usePauseMenu'
import PauseMenu from '../components/PauseMenu'

function MyGameComponent() {
  const timer = useTimer(60)
  const pauseMenu = usePauseMenu({
    onQuit: () => navigate('/home'),
    onContinue: () => timer.resume()
  })

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        if (pauseMenu.state.isPaused) {
          pauseMenu.closePauseMenu()
          timer.resume()
        } else {
          timer.pause()
          pauseMenu.openPauseMenu()
        }
      }
    }

    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [pauseMenu, timer])

  return (
    <>
      {/* Your game content */}

      <PauseMenu
        isOpen={pauseMenu.state.isPaused}
        selectedOption={pauseMenu.state.selectedOption}
        onConfirm={pauseMenu.confirmSelection}
        onCancel={pauseMenu.closePauseMenu}
        onOptionChange={pauseMenu.toggleOption}
      />
    </>
  )
}
```

---

## Testing Keyboard Navigation Patterns

### Test Template

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import MyComponent from './MyComponent'

describe('MyComponent - Keyboard Navigation', () => {
  it('should navigate with arrow keys', () => {
    render(<MyComponent />)

    // Initially first element should be focused
    expect(screen.getByText('Option 1')).toHaveClass('focused')

    // Press down arrow
    fireEvent.keyDown(window, { key: 'ArrowDown' })
    expect(screen.getByText('Option 2')).toHaveClass('focused')

    // Press up arrow
    fireEvent.keyDown(window, { key: 'ArrowUp' })
    expect(screen.getByText('Option 1')).toHaveClass('focused')
  })

  it('should handle Enter key confirmation', () => {
    const onConfirm = vi.fn()
    render(<MyComponent onConfirm={onConfirm} />)

    fireEvent.keyDown(window, { key: 'Enter' })
    expect(onConfirm).toHaveBeenCalled()
  })

  it('should handle ESC key cancellation', () => {
    const onCancel = vi.fn()
    render(<MyComponent onCancel={onCancel} />)

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onCancel).toHaveBeenCalled()
  })

  it('should show jumping arrow on focused element', () => {
    render(<MyComponent />)

    const arrow = screen.getByText('▶')
    expect(arrow).toBeInTheDocument()

    // Arrow should move with focus
    fireEvent.keyDown(window, { key: 'ArrowDown' })
    // Verify arrow moved to second element
  })

  it('should support both keyboard and mouse navigation', () => {
    const onClick = vi.fn()
    render(<MyComponent onClick={onClick} />)

    // Mouse click should work
    fireEvent.click(screen.getByText('Option 1'))
    expect(onClick).toHaveBeenCalled()

    // Keyboard should also work
    fireEvent.keyDown(window, { key: 'Enter' })
    expect(onClick).toHaveBeenCalledTimes(2)
  })
})
```

### Testing Pause Menu

```typescript
describe('PauseMenu', () => {
  it('should pause game when ESC pressed', () => {
    const { pause } = useTimer(60)
    render(<GameWithPauseMenu />)

    fireEvent.keyDown(window, { key: 'Escape' })

    expect(screen.getByText('Quit Game')).toBeInTheDocument()
    expect(screen.getByText('Continue Playing')).toBeInTheDocument()
    // Verify timer is paused
  })

  it('should resume game when Continue selected', () => {
    const { resume } = useTimer(60)
    render(<GameWithPauseMenu />)

    // Open pause menu
    fireEvent.keyDown(window, { key: 'Escape' })

    // Select continue and confirm
    fireEvent.keyDown(window, { key: 'Enter' })

    // Pause menu should close
    expect(screen.queryByText('Quit Game')).not.toBeInTheDocument()
    // Verify timer resumed
  })

  it('should trap focus within modal', () => {
    render(<GameWithPauseMenu />)

    fireEvent.keyDown(window, { key: 'Escape' }) // Open

    // Focus should cycle within modal
    fireEvent.keyDown(window, { key: 'Tab' })
    expect(document.activeElement).toBeInTheDocument()
    // Verify focus stays in modal
  })
})
```

---

## Common Patterns

### Pattern 1: Auto-Focus Input on Digit Key

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (/^[0-9]$/.test(e.key) && document.activeElement !== inputRef.current) {
      e.preventDefault()
      inputRef.current?.focus()
      setAnswer(prev => prev + e.key)
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [])
```

### Pattern 2: Focus Restoration After Modal

```typescript
const previousFocusRef = useRef<HTMLElement | null>(null)

const openModal = () => {
  previousFocusRef.current = document.activeElement as HTMLElement
  setIsOpen(true)
}

const closeModal = () => {
  setIsOpen(false)
  previousFocusRef.current?.focus()
}
```

### Pattern 3: Prevent Event Bubbling Conflicts

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Only handle if not in modal
    if (isModalOpen) return

    if (e.key === 'ArrowDown') {
      e.preventDefault() // Prevent page scroll
      moveFocus('down')
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [isModalOpen, moveFocus])
```

---

## Troubleshooting

### Issue: Arrow Keys Scroll Page

**Solution**: Call `e.preventDefault()` in keyboard event handler:

```typescript
if (e.key === 'ArrowDown') {
  e.preventDefault() // Prevents default scroll behavior
  moveFocus('down')
}
```

### Issue: Focus Not Visible

**Solution**: Ensure focused element has visual styling:

```scss
button:focus {
  outline: 4px solid $color-gold;
  outline-offset: 2px;
}
```

### Issue: Jumping Arrow Animation Doesn't Restart

**Solution**: Use `key` prop to force re-mount:

```typescript
<JumpingArrow key={focusIndex} visible={focusIndex === 0} />
```

### Issue: Pause Menu Doesn't Trap Focus

**Solution**: Add Tab key handler in modal:

```typescript
useEffect(() => {
  if (!isOpen) return

  const handleTab = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      // Cycle focus within modal
    }
  }

  window.addEventListener('keydown', handleTab)
  return () => window.removeEventListener('keydown', handleTab)
}, [isOpen])
```

---

## Best Practices

1. **Always clean up event listeners** in useEffect return function
2. **Prevent default behavior** for arrow keys to avoid page scrolling
3. **Use refs for focus targets** - don't rely on querySelector
4. **Test both keyboard and mouse** paths in every component
5. **Provide visual focus indicators** for accessibility
6. **Document keyboard shortcuts** in keyboard hints
7. **Wrap state updates in try-catch** for error resilience
8. **Use TypeScript strict mode** - explicit types for all functions

---

## API Reference

For complete type definitions and interfaces, see:
- [contracts/pause-menu.ts](./contracts/pause-menu.ts)
- [contracts/focus-management.ts](./contracts/focus-management.ts)
- [contracts/keyboard-hints.ts](./contracts/keyboard-hints.ts)
- [contracts/timer.ts](./contracts/timer.ts)

For implementation patterns and research findings, see:
- [research.md](./research.md) - Technical decisions and patterns
- [data-model.md](./data-model.md) - Entity definitions and state management

---

## Next Steps

After implementing keyboard navigation, run:

```bash
npm run test:run        # All tests must pass
npm run type-check      # Zero TypeScript errors
npm run lint:fix        # Fix any linting issues
npm run build           # Verify production build
```

For task breakdown and implementation order, see:
- [tasks.md](./tasks.md) - Generated by `/speckit.tasks` command
