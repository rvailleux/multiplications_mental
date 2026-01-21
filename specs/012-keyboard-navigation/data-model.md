# Data Model: Enhanced Keyboard Navigation

**Feature**: 012-keyboard-navigation
**Date**: 2026-01-18

## Overview

This document defines the data structures and state management entities for the enhanced keyboard navigation feature. All entities follow TypeScript strict mode requirements and include validation rules extracted from functional requirements.

---

## Entities

### PauseMenuState

Represents the state of the pause menu during gameplay.

**Purpose**: Track pause menu visibility, selected option, and game state preservation.

**Fields**:
- `isPaused`: boolean - Whether game is currently paused
- `selectedOption`: 'quit' | 'continue' - Currently selected menu option
- `previousFocusElement`: HTMLElement | null - Element that had focus before pause menu opened

**Validation Rules**:
- `selectedOption` must be one of two values: 'quit' or 'continue'
- `isPaused` defaults to `false`
- `selectedOption` defaults to 'continue' (safer default)
- `previousFocusElement` may be null if no element was focused

**State Transitions**:
```
Initial → isPaused: false
User presses ESC → isPaused: true, selectedOption: 'continue'
User presses arrow keys → selectedOption toggles between 'quit' and 'continue'
User presses Enter with 'continue' → isPaused: false, restore previousFocusElement
User presses Enter with 'quit' → Navigate to home, reset game state
User presses ESC while paused → isPaused: false (cancel)
```

**Relationships**:
- Depends on: Timer state (pause/resume)
- Affects: Game state, navigation, focus management

---

### FocusState

Tracks keyboard focus management across interactive elements.

**Purpose**: Enable arrow-key navigation between buttons and inputs with visual indicators.

**Fields**:
- `focusedIndex`: number - Index of currently focused element
- `focusableElements`: HTMLElement[] - Array of focusable elements in navigation order
- `elementCount`: number - Total number of focusable elements

**Validation Rules**:
- `focusedIndex` must be >= 0 and < elementCount
- `focusableElements` array must not be empty
- Elements must be actual DOM nodes (not null)

**Focus Navigation Logic**:
```
Arrow Up → focusedIndex = Math.max(0, focusedIndex - 1)
Arrow Down → focusedIndex = Math.min(elementCount - 1, focusedIndex + 1)
Digit key → focusedIndex resets to input field index
```

**Relationships**:
- Controls: Which element shows jumping arrow indicator
- Depends on: Screen layout, available interactive elements

---

### KeyboardHintConfig

Configuration for displaying context-appropriate keyboard hints on each screen.

**Purpose**: Show users which keys are available on current screen.

**Fields**:
- `screenId`: string - Unique identifier for screen (e.g., 'player-select', 'home', 'play', 'pause-menu', 'results')
- `hints`: KeyboardHint[] - Array of hint objects

**KeyboardHint Sub-Entity**:
- `key`: string - Key name (e.g., '↑↓', 'Enter', 'ESC', 'Type')
- `description`: string - What the key does (e.g., 'Navigate', 'Select', 'Pause')

**Validation Rules**:
- `screenId` must be non-empty string
- `hints` array must contain at least one hint
- `key` and `description` must be non-empty strings

**Screen-Specific Configurations**:
```typescript
player-select: [
  { key: '↑↓', description: 'Navigate' },
  { key: 'Enter', description: 'Select' },
  { key: 'ESC', description: 'Exit' }
]

home: [
  { key: 'Enter', description: 'Start Game' },
  { key: 'ESC', description: 'Change Player' }
]

play: [
  { key: 'Type', description: 'Answer' },
  { key: 'Enter', description: 'Submit' },
  { key: 'ESC', description: 'Pause' },
  { key: '↑↓', description: 'Navigate' }
]

pause-menu: [
  { key: '↑↓', description: 'Navigate' },
  { key: 'Enter', description: 'Confirm' },
  { key: 'ESC', description: 'Cancel' }
]

results: [
  { key: 'Enter', description: 'Continue' },
  { key: 'ESC', description: 'Change Player' }
]
```

**Relationships**:
- Consumed by: KeyboardHints component
- Configuration: Static per screen, no runtime changes

---

### TimerState (Extended)

Extension to existing useTimer hook state for pause/resume functionality.

**Purpose**: Add pause/resume capability to existing countdown timer.

**New Fields**:
- `isPaused`: boolean - Whether timer is currently paused
- `startTime`: number - Timestamp when timer started (Date.now())
- `pausedAt`: number | null - Timestamp when timer was paused
- `pausedDuration`: number - Total time spent paused (accumulated)

**Existing Fields** (from current implementation):
- `timeRemaining`: number - Seconds remaining
- `totalTime`: number - Initial countdown value

**Validation Rules**:
- `pausedAt` must be null when `isPaused` is false
- `pausedAt` must be non-null when `isPaused` is true
- `pausedDuration` must be >= 0
- `timeRemaining` must be >= 0 and <= totalTime

**State Transitions**:
```
Initial → isPaused: false, pausedAt: null, pausedDuration: 0
pause() called → isPaused: true, pausedAt: Date.now()
resume() called → isPaused: false, pausedDuration += (now - pausedAt), pausedAt: null
Timer reaches 0 → timeRemaining: 0, clear interval
```

**Calculation Logic**:
```
elapsed = Math.floor((Date.now() - startTime - pausedDuration) / 1000)
timeRemaining = Math.max(0, totalTime - elapsed)
```

**Relationships**:
- Controlled by: PauseMenuState
- Affects: ProgressBar component, game end condition

---

## Data Flow Diagram

```
┌─────────────┐
│ User Input  │
│ (ESC key)   │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ PauseMenuState      │
│ isPaused: true      │◄──────┐
│ selectedOption: ... │       │
└──────┬──────────────┘       │
       │                      │
       ▼                      │
┌─────────────────────┐      │
│ TimerState          │      │
│ pause() called      │      │
│ isPaused: true      │      │
└─────────────────────┘      │
                             │
┌─────────────────────┐      │
│ FocusState          │      │
│ Track option focus  │──────┘
│ Show jumping arrow  │
└─────────────────────┘

┌─────────────────────┐
│ KeyboardHintConfig  │
│ Display hints for   │
│ current screen      │
└─────────────────────┘
```

---

## Storage & Persistence

### localStorage
**None** - All keyboard navigation state is ephemeral (not persisted).

**Rationale**:
- Pause state should not persist across page reloads
- Focus state is session-specific
- Keyboard hints are static configuration

**Error Handling**:
- If localStorage fails (quota exceeded, corrupted), keyboard navigation still works
- All state stored in React component state (in-memory only)

---

## Performance Considerations

### State Update Frequency
- **Timer updates**: Every 100ms (10 updates/second)
- **Focus updates**: On user input only (event-driven)
- **Pause menu**: On ESC key only (infrequent)

### Memory Footprint
- PauseMenuState: ~100 bytes
- FocusState: ~200 bytes + (number of elements × ref size)
- KeyboardHintConfig: ~500 bytes (static, all screens combined)
- **Total**: < 1KB additional memory

### Optimization Strategies
- Use `React.memo()` for PauseMenu component (only re-render when isPaused changes)
- Use `useMemo()` for computed focus arrays
- Debounce rapid arrow key presses (use native key repeat, no custom debounce needed)

---

## Type Safety

All entities have corresponding TypeScript interfaces in `/contracts/` directory:
- `pause-menu.ts` - PauseMenuState and related types
- `focus-management.ts` - FocusState and navigation types
- `keyboard-hints.ts` - KeyboardHintConfig and hint types
- `timer.ts` - Extended TimerState with pause/resume

See [contracts/](./contracts/) directory for full TypeScript definitions.
