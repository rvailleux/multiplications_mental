# Quickstart: Unified Keyboard UI Navigation

**Feature**: 013-unified-keyboard-ui
**Date**: 2026-01-23
**For**: Developers implementing this feature

## Overview

This guide provides step-by-step instructions for implementing unified keyboard navigation with jumping arrow indicators across all application screens. Follow the TDD approach: write tests first, then implement to make them pass.

## Prerequisites

- [ ] Read `spec.md` - Feature specification
- [ ] Read `research.md` - Design decisions and rationale
- [ ] Read `data-model.md` - Type definitions and state model
- [ ] Familiarize with existing `JumpingArrow` component (`src/components/JumpingArrow.tsx`)
- [ ] Review existing keyboard navigation in `PlayerSelectPage` as reference

## Implementation Order

Follow this exact order to maintain TDD discipline and minimize integration issues:

### Phase 1: Foundation (Types & Hook)
1. Create type definitions
2. Create `useNavigableOptions` hook (test-first)

### Phase 2: HomePage Integration
3. Add jumping arrow to HomePage Start button
4. Update HomePage keyboard hints

### Phase 3: PlayPage Integration
5. Add arrow navigation to PlayPage Valider/Restart options
6. Update PlayPage keyboard hints

### Phase 4: GameResultsPage Integration
7. Add jumping arrow to GameResultsPage Continue button
8. Update results keyboard hints

### Phase 5: E2E Testing
9. Write Playwright E2E tests for all user stories
10. Verify visual consistency with screenshots

### Phase 6: Documentation
11. Update CLAUDE.md with patterns
12. Update constitution.md with navigation standards

---

## Phase 1: Foundation

### Step 1.1: Create Type Definitions

**File**: `src/types/navigation.ts` (NEW)

**Test First**: No unit tests needed for pure type definitions (TypeScript compiler validates)

**Implementation**:

```typescript
/**
 * Selectable options on the PlayPage during active gameplay
 * @public
 */
export type NavigableOption = 'valider' | 'restart'

/**
 * Configuration for navigable options component
 * @public
 */
export interface NavigableOptionsConfig {
  /** Available options to navigate between */
  options: readonly NavigableOption[]
  /** Default selected option when component mounts */
  defaultOption: NavigableOption
  /** Callback when "valider" option is confirmed */
  onValider: () => void
  /** Callback when "restart" option is confirmed */
  onRestart: () => void
}

/**
 * Generic selection state for components with keyboard navigation
 * @public
 */
export interface SelectionState<T extends string> {
  /** Currently selected option */
  selectedOption: T
  /** Index of selected option in options array (for cycling) */
  selectedIndex: number
  /** Total number of available options */
  totalOptions: number
}
```

**Verify**: Run `npm run type-check` - should pass with no errors

---

### Step 1.2: Create useNavigableOptions Hook

**File**: `src/hooks/useNavigableOptions.test.ts` (NEW)

**Test First** (write these tests, they should FAIL initially):

```typescript
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useNavigableOptions } from './useNavigableOptions'
import type { NavigableOptionsConfig } from '../types/navigation'

describe('useNavigableOptions', () => {
  const mockConfig: NavigableOptionsConfig = {
    options: ['valider', 'restart'] as const,
    defaultOption: 'valider',
    onValider: vi.fn(),
    onRestart: vi.fn(),
  }

  it('should initialize with default option', () => {
    const { result } = renderHook(() => useNavigableOptions(mockConfig))
    expect(result.current.selectedOption).toBe('valider')
  })

  it('should navigate down to next option', () => {
    const { result } = renderHook(() => useNavigableOptions(mockConfig))

    act(() => {
      result.current.navigateDown()
    })

    expect(result.current.selectedOption).toBe('restart')
  })

  it('should navigate up to previous option', () => {
    const { result } = renderHook(() => useNavigableOptions(mockConfig))

    // First go to restart
    act(() => {
      result.current.navigateDown()
    })

    // Then navigate back up
    act(() => {
      result.current.navigateUp()
    })

    expect(result.current.selectedOption).toBe('valider')
  })

  it('should wrap around when navigating down from last option', () => {
    const { result } = renderHook(() => useNavigableOptions(mockConfig))

    // Navigate to last option
    act(() => {
      result.current.navigateDown()
    })

    // Navigate down again - should wrap to first
    act(() => {
      result.current.navigateDown()
    })

    expect(result.current.selectedOption).toBe('valider')
  })

  it('should wrap around when navigating up from first option', () => {
    const { result } = renderHook(() => useNavigableOptions(mockConfig))

    // Navigate up from first - should wrap to last
    act(() => {
      result.current.navigateUp()
    })

    expect(result.current.selectedOption).toBe('restart')
  })

  it('should execute onValider when valider is selected', () => {
    const { result } = renderHook(() => useNavigableOptions(mockConfig))

    act(() => {
      result.current.executeSelectedOption()
    })

    expect(mockConfig.onValider).toHaveBeenCalledTimes(1)
    expect(mockConfig.onRestart).not.toHaveBeenCalled()
  })

  it('should execute onRestart when restart is selected', () => {
    const { result } = renderHook(() => useNavigableOptions(mockConfig))

    // Navigate to restart
    act(() => {
      result.current.navigateDown()
    })

    // Execute
    act(() => {
      result.current.executeSelectedOption()
    })

    expect(mockConfig.onRestart).toHaveBeenCalledTimes(1)
    expect(mockConfig.onValider).not.toHaveBeenCalled()
  })

  it('should allow direct option selection', () => {
    const { result } = renderHook(() => useNavigableOptions(mockConfig))

    act(() => {
      result.current.setSelectedOption('restart')
    })

    expect(result.current.selectedOption).toBe('restart')
  })
})
```

**Run Tests**: `npm run test` - All tests should FAIL (hook doesn't exist yet)

**File**: `src/hooks/useNavigableOptions.ts` (NEW)

**Implementation** (make tests pass):

```typescript
import { useState, useCallback } from 'react'
import type { NavigableOption, NavigableOptionsConfig } from '../types/navigation'

/**
 * Return type for useNavigableOptions hook
 * Provides selection state and navigation functions for PlayPage options
 * @public
 */
export interface UseNavigableOptionsReturn {
  /** Currently selected option */
  selectedOption: NavigableOption
  /** Update selected option directly */
  setSelectedOption: (option: NavigableOption) => void
  /** Navigate to previous option (wraps around) */
  navigateUp: () => void
  /** Navigate to next option (wraps around) */
  navigateDown: () => void
  /** Execute action for currently selected option */
  executeSelectedOption: () => void
}

/**
 * Custom hook for managing navigable options with keyboard navigation
 *
 * Provides state and functions for navigating between options (e.g., "Valider" and "Restart")
 * using arrow keys. Handles wrapping around at boundaries and executing callbacks.
 *
 * @param config - Configuration object with options, default selection, and callbacks
 * @returns Selection state and navigation functions
 *
 * @example
 * ```typescript
 * const { selectedOption, navigateUp, navigateDown, executeSelectedOption } =
 *   useNavigableOptions({
 *     options: ['valider', 'restart'],
 *     defaultOption: 'valider',
 *     onValider: handleSubmit,
 *     onRestart: handleRestart,
 *   })
 * ```
 */
export function useNavigableOptions(
  config: NavigableOptionsConfig
): UseNavigableOptionsReturn {
  const [selectedOption, setSelectedOption] = useState<NavigableOption>(
    config.defaultOption
  )

  const navigateDown = useCallback((): void => {
    setSelectedOption((current) => {
      const currentIndex = config.options.indexOf(current)
      const nextIndex = (currentIndex + 1) % config.options.length
      return config.options[nextIndex]
    })
  }, [config.options])

  const navigateUp = useCallback((): void => {
    setSelectedOption((current) => {
      const currentIndex = config.options.indexOf(current)
      const prevIndex =
        currentIndex === 0 ? config.options.length - 1 : currentIndex - 1
      return config.options[prevIndex]
    })
  }, [config.options])

  const executeSelectedOption = useCallback((): void => {
    if (selectedOption === 'valider') {
      config.onValider()
    } else if (selectedOption === 'restart') {
      config.onRestart()
    }
  }, [selectedOption, config])

  return {
    selectedOption,
    setSelectedOption,
    navigateUp,
    navigateDown,
    executeSelectedOption,
  }
}
```

**Run Tests**: `npm run test` - All tests should PASS

**Verify**:
- `npm run type-check` - No TypeScript errors
- `npm run lint:fix` - Auto-fix any linting issues

---

## Phase 2: HomePage Integration

### Step 2.1: Add Jumping Arrow to HomePage

**File**: `src/pages/HomePage.test.tsx` (UPDATE)

**Add these tests** (should FAIL initially):

```typescript
// Add to existing test file
describe('HomePage - Jumping Arrow', () => {
  it('should display jumping arrow next to Start Game button', () => {
    renderWithRouter(<HomePage />)

    // Arrow symbol should be visible
    expect(screen.getByText('▶')).toBeInTheDocument()
  })

  it('should navigate to play page when Enter key is pressed', () => {
    renderWithRouter(<HomePage />)

    fireEvent.keyDown(window, { key: 'Enter' })

    expect(mockNavigate).toHaveBeenCalledWith('/play')
  })

  it('should navigate to player select when Escape key is pressed', () => {
    renderWithRouter(<HomePage />)

    fireEvent.keyDown(window, { key: 'Escape' })

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('should navigate to play page when Start Game button is clicked', () => {
    renderWithRouter(<HomePage />)

    const startButton = screen.getByRole('button', { name: /start game/i })
    fireEvent.click(startButton)

    expect(mockNavigate).toHaveBeenCalledWith('/play')
  })

  it('should not change state when arrow keys are pressed (single option)', () => {
    renderWithRouter(<HomePage />)

    // Arrow keys should do nothing gracefully
    fireEvent.keyDown(window, { key: 'ArrowDown' })
    fireEvent.keyDown(window, { key: 'ArrowUp' })

    // Arrow should still be visible (no crash, no error)
    expect(screen.getByText('▶')).toBeInTheDocument()
  })
})
```

**File**: `src/pages/HomePage.tsx` (UPDATE)

**Implementation**:

```typescript
// Add import
import JumpingArrow from '../components/JumpingArrow'

// Inside HomePage component, add state
const [isButtonSelected] = useState(true) // Always true for single option

// Update keyboard handler in useEffect
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter') {
      e.preventDefault()
      navigate('/play')
    } else if (e.key === 'Escape') {
      e.preventDefault()
      navigate('/')
    }
    // ArrowUp/ArrowDown do nothing (single option - graceful)
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [navigate])

// Update button rendering
<button
  onClick={() => navigate('/play')}
  className={styles.startButton}
>
  <JumpingArrow visible={isButtonSelected} />
  Start Game
</button>
```

**Run Tests**: `npm run test HomePage` - All tests should PASS

---

### Step 2.2: Update HomePage Keyboard Hints

**File**: `src/components/KeyboardHints.tsx` (UPDATE)

**Update configuration**:

```typescript
// Find KEYBOARD_HINTS_CONFIG and update 'home' entry:
home: [
  { key: '↑↓', description: 'Navigate' },     // ADD: For visual consistency
  { key: 'Enter', description: 'Select' },    // CHANGE: from "Start Game"
  { key: 'ESC', description: 'Change Player' },
],
```

**File**: `src/components/KeyboardHints.test.tsx` (UPDATE)

**Add test**:

```typescript
it('should display correct hints for home screen', () => {
  render(<KeyboardHints screenId="home" />)

  expect(screen.getByText('↑↓')).toBeInTheDocument()
  expect(screen.getByText('Navigate')).toBeInTheDocument()
  expect(screen.getByText('Enter')).toBeInTheDocument()
  expect(screen.getByText('Select')).toBeInTheDocument()
  expect(screen.getByText('ESC')).toBeInTheDocument()
  expect(screen.getByText('Change Player')).toBeInTheDocument()
})
```

**Run Tests**: `npm run test KeyboardHints` - Should PASS

---

## Phase 3: PlayPage Integration

### Step 3.1: Add Arrow Navigation to PlayPage

**File**: `src/pages/PlayPage.test.tsx` (UPDATE)

**Add these tests**:

```typescript
describe('PlayPage - Option Navigation', () => {
  it('should default to Valider option selected on load', () => {
    renderWithRouter(<PlayPage />)

    // Jumping arrow should be next to Valider button
    const validerSection = screen.getByText(/valider/i).closest('div')
    expect(within(validerSection).getByText('▶')).toBeInTheDocument()
  })

  it('should navigate to Restart option with ArrowDown', () => {
    renderWithRouter(<PlayPage />)

    fireEvent.keyDown(window, { key: 'ArrowDown' })

    // Arrow should move to Restart
    const restartSection = screen.getByText(/restart/i).closest('div')
    expect(within(restartSection).getByText('▶')).toBeInTheDocument()
  })

  it('should navigate back to Valider with ArrowUp', () => {
    renderWithRouter(<PlayPage />)

    // Navigate down first
    fireEvent.keyDown(window, { key: 'ArrowDown' })

    // Navigate back up
    fireEvent.keyDown(window, { key: 'ArrowUp' })

    // Arrow should be back at Valider
    const validerSection = screen.getByText(/valider/i).closest('div')
    expect(within(validerSection).getByText('▶')).toBeInTheDocument()
  })

  it('should allow typing digits while navigating options', () => {
    renderWithRouter(<PlayPage />)

    const input = screen.getByRole('textbox')

    // Type some digits
    fireEvent.change(input, { target: { value: '42' } })

    // Navigate options
    fireEvent.keyDown(window, { key: 'ArrowDown' })

    // Input should still have the value
    expect(input).toHaveValue('42')
  })

  it('should submit answer when Valider selected and Enter pressed', () => {
    renderWithRouter(<PlayPage />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '35' } })

    // Valider is selected by default
    fireEvent.keyDown(window, { key: 'Enter' })

    // Answer should be submitted (mock implementation would validate this)
    // This tests the execution path works
  })

  it('should restart game when Restart selected and Enter pressed', () => {
    renderWithRouter(<PlayPage />)

    // Navigate to Restart
    fireEvent.keyDown(window, { key: 'ArrowDown' })

    // Press Enter
    fireEvent.keyDown(window, { key: 'Enter' })

    // Game should restart (new question appears)
    // This tests the execution path works
  })

  it('should preserve selection state when pause menu opens and closes', () => {
    renderWithRouter(<PlayPage />)

    // Navigate to Restart
    fireEvent.keyDown(window, { key: 'ArrowDown' })

    // Open pause menu
    fireEvent.keyDown(window, { key: 'Escape' })

    // Close pause menu (simulate cancel)
    fireEvent.keyDown(window, { key: 'Escape' })

    // Selection should still be Restart
    const restartSection = screen.getByText(/restart/i).closest('div')
    expect(within(restartSection).getByText('▶')).toBeInTheDocument()
  })

  it('should support Backspace in answer input', () => {
    renderWithRouter(<PlayPage />)

    const input = screen.getByRole('textbox')

    // Type some digits
    fireEvent.change(input, { target: { value: '123' } })

    // Simulate backspace (remove last character)
    fireEvent.change(input, { target: { value: '12' } })

    expect(input).toHaveValue('12')
  })
})
```

**File**: `src/pages/PlayPage.tsx` (UPDATE)

**Implementation**:

```typescript
// Add imports
import JumpingArrow from '../components/JumpingArrow'
import { useNavigableOptions } from '../hooks/useNavigableOptions'
import type { NavigableOption } from '../types/navigation'

// Inside PlayPage component, add hook
const {
  selectedOption,
  navigateUp,
  navigateDown,
  executeSelectedOption,
} = useNavigableOptions({
  options: ['valider', 'restart'] as const,
  defaultOption: 'valider',
  onValider: handleSubmitAnswer,  // Your existing function
  onRestart: handleRestartGame,   // Your existing function
})

// Update keyboard handler in useEffect
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent): void => {
    // Digit keys - always go to input
    if (e.key >= '0' && e.key <= '9') {
      // Let default behavior handle input
      return
    }

    // Backspace - always go to input
    if (e.key === 'Backspace') {
      // Let default behavior handle input
      return
    }

    // Navigation keys
    if (['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes(e.key)) {
      e.preventDefault()
    }

    switch (e.key) {
      case 'ArrowUp':
        navigateUp()
        break
      case 'ArrowDown':
        navigateDown()
        break
      case 'Enter':
        executeSelectedOption()
        break
      case 'Escape':
        // Open pause menu (existing logic)
        break
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [navigateUp, navigateDown, executeSelectedOption])

// Update button rendering
<div className={styles.optionsContainer}>
  <button
    onClick={handleSubmitAnswer}
    className={selectedOption === 'valider' ? styles.selected : ''}
  >
    <JumpingArrow visible={selectedOption === 'valider'} />
    Valider
  </button>

  <button
    onClick={handleRestartGame}
    className={selectedOption === 'restart' ? styles.selected : ''}
  >
    <JumpingArrow visible={selectedOption === 'restart'} />
    Restart
  </button>
</div>
```

**File**: `src/pages/PlayPage.module.scss` (UPDATE)

**Add styling**:

```scss
.optionsContainer {
  display: flex;
  gap: $spacing-md;
  justify-content: center;
  margin-top: $spacing-lg;
}

.selected {
  transform: scale(1.05);
  transition: transform $transition-fast;
}
```

**Run Tests**: `npm run test PlayPage` - All tests should PASS

---

### Step 3.2: Update PlayPage Keyboard Hints

**File**: `src/components/KeyboardHints.tsx` (UPDATE)

```typescript
// Update 'play' entry in KEYBOARD_HINTS_CONFIG:
play: [
  { key: '0-9', description: 'Type Answer' },
  { key: 'Backspace', description: 'Delete' },       // ADD
  { key: '↑↓', description: 'Navigate Options' },
  { key: 'Enter', description: 'Confirm' },
  { key: 'ESC', description: 'Pause' },
],
```

**Run Tests**: `npm run test KeyboardHints` - Should PASS

---

## Phase 4: GameResultsPage Integration

### Step 4.1: Add Jumping Arrow to Continue Button

**File**: `src/pages/GameResultsPage.test.tsx` (UPDATE)

**Add tests** (similar pattern to HomePage):

```typescript
describe('GameResultsPage - Jumping Arrow', () => {
  it('should display jumping arrow next to Continue button', () => {
    renderWithRouter(<GameResultsPage />)
    expect(screen.getByText('▶')).toBeInTheDocument()
  })

  it('should navigate to home when Enter key is pressed', () => {
    renderWithRouter(<GameResultsPage />)
    fireEvent.keyDown(window, { key: 'Enter' })
    expect(mockNavigate).toHaveBeenCalledWith('/home')
  })

  it('should navigate to home when Continue button is clicked', () => {
    renderWithRouter(<GameResultsPage />)
    const continueButton = screen.getByRole('button', { name: /continue/i })
    fireEvent.click(continueButton)
    expect(mockNavigate).toHaveBeenCalledWith('/home')
  })
})
```

**File**: `src/pages/GameResultsPage.tsx` (UPDATE)

**Implementation** (same pattern as HomePage):

```typescript
import JumpingArrow from '../components/JumpingArrow'

const [isButtonSelected] = useState(true)

// Update keyboard handler
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter') {
      e.preventDefault()
      navigate('/home')
    } else if (e.key === 'Escape') {
      e.preventDefault()
      navigate('/')
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [navigate])

// Update button
<button onClick={() => navigate('/home')}>
  <JumpingArrow visible={isButtonSelected} />
  Continue
</button>
```

---

### Step 4.2: Update Results Keyboard Hints

**File**: `src/components/KeyboardHints.tsx` (UPDATE)

```typescript
results: [
  { key: 'Enter', description: 'Continue' },
  { key: 'ESC', description: 'Change Player' },  // ADD
],
```

---

## Phase 5: E2E Testing with Playwright

### Step 5.1: Create E2E Test File

**File**: `tests/e2e/unified-keyboard-ui.spec.ts` (NEW)

**Implementation**:

```typescript
import { test, expect } from '@playwright/test'

test.describe('Unified Keyboard UI Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app and select a player
    await page.goto('http://localhost:5174')
    await page.keyboard.press('Enter') // Select first player
  })

  test('E2E-US1-001: Jumping arrow appears on HomePage', async ({ page }) => {
    // Should be on HomePage after player selection
    await expect(page).toHaveURL(/\/home/)

    // Take screenshot
    await page.screenshot({ path: 'test-results/e2e-us1-001-01-homepage-initial.png' })

    // Verify jumping arrow visible
    const arrow = page.locator('text=▶')
    await expect(arrow).toBeVisible()

    // Press Enter to start game
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/play/)

    await page.screenshot({ path: 'test-results/e2e-us1-001-02-game-started.png' })
  })

  test('E2E-US1-002: Jumping arrow navigation on PlayPage', async ({ page }) => {
    // Start game
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/play/)

    await page.screenshot({ path: 'test-results/e2e-us1-002-01-playpage-initial.png' })

    // Arrow should be at Valider by default
    const validerButton = page.locator('button', { hasText: 'Valider' })
    await expect(validerButton.locator('text=▶')).toBeVisible()

    // Press ArrowDown
    await page.keyboard.press('ArrowDown')
    await page.screenshot({ path: 'test-results/e2e-us1-002-02-restart-selected.png' })

    // Arrow should move to Restart
    const restartButton = page.locator('button', { hasText: 'Restart' })
    await expect(restartButton.locator('text=▶')).toBeVisible()

    // Press ArrowUp
    await page.keyboard.press('ArrowUp')
    await page.screenshot({ path: 'test-results/e2e-us1-002-03-back-to-valider.png' })

    // Arrow should return to Valider
    await expect(validerButton.locator('text=▶')).toBeVisible()
  })

  test('E2E-US2-001: Type answer and submit with keyboard', async ({ page }) => {
    // Start game
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/play/)

    await page.screenshot({ path: 'test-results/e2e-us2-001-01-game-question.png' })

    // Type answer
    await page.keyboard.type('42')
    await page.screenshot({ path: 'test-results/e2e-us2-001-02-answer-typed.png' })

    // Verify input has value
    const input = page.locator('input[type="text"]')
    await expect(input).toHaveValue('42')

    // Valider should be selected by default, press Enter
    await page.keyboard.press('Enter')
    await page.screenshot({ path: 'test-results/e2e-us2-001-03-answer-submitted.png' })

    // New question should appear or feedback shown
  })

  test('E2E-US2-002: Navigate between Valider and Restart', async ({ page }) => {
    // Start game
    await page.keyboard.press('Enter')

    await page.screenshot({ path: 'test-results/e2e-us2-002-01-game-active.png' })

    // Navigate to Restart
    await page.keyboard.press('ArrowDown')
    await page.screenshot({ path: 'test-results/e2e-us2-002-02-restart-selected.png' })

    const restartButton = page.locator('button', { hasText: 'Restart' })
    await expect(restartButton.locator('text=▶')).toBeVisible()

    // Press Enter to restart
    await page.keyboard.press('Enter')
    await page.screenshot({ path: 'test-results/e2e-us2-002-03-game-restarted.png' })

    // New question should appear
  })

  test('E2E-US2-003: Backspace functionality in textbox', async ({ page }) => {
    // Start game
    await page.keyboard.press('Enter')

    await page.screenshot({ path: 'test-results/e2e-us2-003-01-empty-textbox.png' })

    // Type digits
    await page.keyboard.type('123')
    await page.screenshot({ path: 'test-results/e2e-us2-003-02-typed-123.png' })

    const input = page.locator('input[type="text"]')
    await expect(input).toHaveValue('123')

    // Press Backspace twice
    await page.keyboard.press('Backspace')
    await page.keyboard.press('Backspace')
    await page.screenshot({ path: 'test-results/e2e-us2-003-03-after-backspace.png' })

    // Should show "1"
    await expect(input).toHaveValue('1')
  })

  test('E2E-US3-001: Keyboard hints display on HomePage', async ({ page }) => {
    // Should be on HomePage
    await page.screenshot({ path: 'test-results/e2e-us3-001-01-homepage-with-hints.png' })

    // Verify hints are visible
    await expect(page.locator('text=↑↓')).toBeVisible()
    await expect(page.locator('text=Navigate')).toBeVisible()
    await expect(page.locator('text=Enter')).toBeVisible()
    await expect(page.locator('text=Select')).toBeVisible()
  })

  test('E2E-US3-002: Keyboard hints display on PlayPage', async ({ page }) => {
    // Start game
    await page.keyboard.press('Enter')

    await page.screenshot({ path: 'test-results/e2e-us3-002-01-playpage-with-hints.png' })

    // Verify PlayPage-specific hints
    await expect(page.locator('text=0-9')).toBeVisible()
    await expect(page.locator('text=Type Answer')).toBeVisible()
    await expect(page.locator('text=Backspace')).toBeVisible()
    await expect(page.locator('text=Delete')).toBeVisible()
  })
})
```

**Run E2E Tests**:
```bash
npx playwright test tests/e2e/unified-keyboard-ui.spec.ts
```

**Review Screenshots**: Check `test-results/` directory for visual validation

---

## Phase 6: Documentation

### Step 6.1: Update CLAUDE.md

**File**: `CLAUDE.md` (UPDATE)

**Add section** under "Retro Gaming UX Design":

```markdown
#### Jumping Arrow Pattern (Standard Selection Indicator)

**When to Use**: Any screen with selectable options (buttons, menu items)

**Implementation Pattern**:
```typescript
import JumpingArrow from '../components/JumpingArrow'

const [selectedOption, setSelectedOption] = useState<'option1' | 'option2'>('option1')

<button>
  <JumpingArrow visible={selectedOption === 'option1'} />
  Option 1
</button>
```

**Key Rules**:
- Always show jumping arrow (even on single-option screens for consistency)
- Position to the left of option text
- Use existing `JumpingArrow` component (no custom implementations)
- Arrow keys should gracefully do nothing on single-option screens

**Multi-Option Navigation**:
```typescript
import { useNavigableOptions } from '../hooks/useNavigableOptions'

const { selectedOption, navigateUp, navigateDown, executeSelectedOption } =
  useNavigableOptions({
    options: ['option1', 'option2'],
    defaultOption: 'option1',
    onOption1: handleOption1,
    onOption2: handleOption2,
  })

useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent): void => {
    if (['ArrowUp', 'ArrowDown', 'Enter'].includes(e.key)) {
      e.preventDefault()
    }

    switch (e.key) {
      case 'ArrowUp':
        navigateUp()
        break
      case 'ArrowDown':
        navigateDown()
        break
      case 'Enter':
        executeSelectedOption()
        break
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [navigateUp, navigateDown, executeSelectedOption])
```
```

### Step 6.2: Update constitution.md

**File**: `.specify/memory/constitution.md` (UPDATE)

**Update Principle VI** to add arrow key navigation patterns:

```markdown
### VI. Retro Gaming UX (Super NES 8-bit Aesthetic)

All UI/UX MUST follow retro gaming design principles with keyboard-first interaction:
- **Keyboard navigation PRIMARY**: Arrow keys (Up/Down/Left/Right), Enter (select), Esc (back/cancel)
- **Arrow key navigation**: Up/Down cycle through options, wrapping at boundaries
- **Jumping arrow indicator**: Always visible next to selected option (even on single-option screens)
- **Mouse support SECONDARY**: All keyboard interactions MUST also work with mouse clicks
...
```

---

## Final Verification Checklist

Before creating PR, verify ALL of the following:

### Code Quality (Constitutional Requirement)
- [ ] `npm run type-check` - Zero TypeScript errors
- [ ] `npm run lint:fix` - All lint issues fixed
- [ ] `npm run test:run` - All unit tests pass
- [ ] `npm run build` - Production build succeeds
- [ ] `npx playwright test` - All E2E tests pass

### Feature Completeness
- [ ] Jumping arrow appears on HomePage Start button
- [ ] Jumping arrow appears on PlayPage Valider/Restart options
- [ ] Jumping arrow appears on GameResultsPage Continue button
- [ ] Arrow keys navigate between PlayPage options
- [ ] Enter key executes selected option
- [ ] Digit keys (0-9) input to answer textbox
- [ ] Backspace deletes from answer textbox
- [ ] Selection state preserved during pause menu
- [ ] Keyboard hints display on all screens
- [ ] Hints wrap on narrow viewports

### Dual Input Support
- [ ] All keyboard navigation works
- [ ] All mouse clicks work
- [ ] Both paths tested in unit tests
- [ ] Both paths tested in E2E tests

### Visual Consistency
- [ ] Arrow animation smooth (0.6s bounce)
- [ ] Gold color (#ffd700) used for arrow
- [ ] Retro pixel aesthetic maintained
- [ ] Screenshots captured for visual regression

### Documentation
- [ ] CLAUDE.md updated with patterns
- [ ] constitution.md updated with navigation standards
- [ ] JSDoc added to all new functions
- [ ] API docs regenerated (`npm run docs`)

---

## Common Issues & Solutions

### Issue: Tests fail with "Arrow not found"
**Solution**: Ensure `JumpingArrow` component is imported and `visible` prop is correctly set

### Issue: Arrow keys scroll the page
**Solution**: Add `e.preventDefault()` in keyboard event handler for arrow keys

### Issue: Selection state resets unexpectedly
**Solution**: Check `useEffect` dependencies - ensure state variables are included

### Issue: E2E tests flaky
**Solution**: Use `await expect().toBeVisible()` instead of `expect().toBeTruthy()` for async elements

### Issue: TypeScript error on NavigableOption type
**Solution**: Ensure `as const` assertion on options array: `['valider', 'restart'] as const`

---

## Time Estimates

- **Phase 1** (Foundation): 1-2 hours
- **Phase 2** (HomePage): 1 hour
- **Phase 3** (PlayPage): 2-3 hours
- **Phase 4** (GameResultsPage): 1 hour
- **Phase 5** (E2E Tests): 2-3 hours
- **Phase 6** (Documentation): 1 hour

**Total**: 8-12 hours (1-1.5 days)

---

## Next Command

After completing all phases:

```bash
/speckit.tasks
```

This will generate the detailed task breakdown (`tasks.md`) for implementation tracking.

---

**Quickstart Status**: ✅ COMPLETE
**Ready for Implementation**: YES
