# Data Model: Player Card Navigation

**Feature**: 019-player-card-navigation
**Date**: 2026-02-04

## Overview

This feature does not introduce new data entities. It enhances an existing UI component with click interaction.

## Existing Entities (No Changes)

### Player
Already defined in `src/types/player.ts`:
```typescript
type Player = {
  id: string     // Unique identifier (e.g., "jules", "achille")
  name: string   // Display name
}
```

No modifications required.

## Component Interface Changes

### PlayerNameDisplayProps (Modified)

**Current interface** (`src/components/PlayerNameDisplay.tsx`):
```typescript
interface PlayerNameDisplayProps {
  player: Player | null
}
```

**New interface**:
```typescript
interface PlayerNameDisplayProps {
  /** Current player object to display. If null, component renders nothing. */
  player: Player | null
  /** Optional click handler. When provided, card becomes clickable with hover state. */
  onClick?: () => void
}
```

### CSS State Classes (New)

**New styles** to add in `PlayerNameDisplay.module.scss`:

| Class | Purpose |
|-------|---------|
| `.clickable` | Applied when `onClick` prop provided - adds cursor, transitions |
| `:hover` state | Visual feedback on mouse hover (glow, slight scale) |
| `:active` state | Visual feedback on click/tap (pressed appearance) |

## State Transitions

```
PlayerNameDisplay States:
┌─────────────────┐
│  Default        │ (no onClick prop)
│  Display Only   │
└─────────────────┘

┌─────────────────┐      hover       ┌─────────────────┐
│  Clickable      │ ───────────────► │  Hovered        │
│  (onClick prop) │ ◄─────────────── │  (glow effect)  │
└─────────────────┘    mouse out     └─────────────────┘
        │                                    │
        │ click/tap                          │ click/tap
        ▼                                    ▼
┌─────────────────┐                 ┌─────────────────┐
│  Active         │                 │  Active         │
│  (pressed)      │                 │  (pressed)      │
└─────────────────┘                 └─────────────────┘
        │                                    │
        │ onClick() called                   │ onClick() called
        ▼                                    ▼
    Navigation to player selection page
```

## No New Storage Required

- No localStorage changes
- No new persistent data
- Navigation handled by React Router (in-memory)
