# Data Model: Credits Screen

**Feature**: 017-credits-screen
**Date**: 2026-01-29

## Overview

The credits screen uses static data structures (no persistence). All data is defined at build time and rendered at runtime.

## Type Definitions

### Credits Section

```typescript
/**
 * Represents a section in the credits (e.g., "Music", "Made with")
 * @public
 */
export interface CreditsSection {
  /** Section title displayed as header */
  title: string
  /** Icon emoji displayed before title (optional) */
  icon?: string
  /** List of attribution items in this section */
  items: AttributionItem[]
}
```

### Attribution Item

```typescript
/**
 * Individual credit entry within a section
 * @public
 */
export interface AttributionItem {
  /** Name or title of the credited item */
  name: string
  /** Optional description or additional info */
  description?: string
  /** Optional author/creator name */
  author?: string
  /** Optional source URL (for reference, not displayed) */
  sourceUrl?: string
}
```

### Star Layer Configuration

```typescript
/**
 * Configuration for a single parallax star layer
 * @public
 */
export interface StarLayerConfig {
  /** Unique identifier for the layer */
  id: string
  /** Size of stars in pixels */
  starSize: number
  /** Number of stars in the layer */
  starCount: number
  /** Animation duration in seconds (lower = faster) */
  animationDuration: number
  /** Opacity of stars (0-1) */
  opacity: number
  /** Color of stars (CSS color value) */
  color: string
}
```

### Scroll State

```typescript
/**
 * Current state of credits scrolling
 * @public
 */
export interface ScrollState {
  /** Current scroll position in pixels */
  position: number
  /** Current speed level index (0 = paused, 2 = normal) */
  speedIndex: number
  /** Whether scrolling is active */
  isScrolling: boolean
}

/**
 * Speed level multipliers
 * Index 0 = paused, index 2 = normal (1x)
 */
export const SPEED_LEVELS: readonly number[] = [0, 0.5, 1, 1.5, 2, 3] as const
```

## Static Data Structure

### Credits Data (`creditsData.ts`)

```typescript
/**
 * Complete credits content for the game
 * @public
 */
export const CREDITS_DATA: CreditsSection[] = [
  {
    title: 'Music',
    icon: '🎵',
    items: [
      { name: 'The Return of the 8-Bit Era', author: 'Pixabay', description: 'Main Theme' },
      { name: '8-Bit Console from My Childhood', author: 'Pixabay' },
      { name: 'Pixel Party', author: 'Pixabay' },
      { name: 'Game 8-Bit On', author: 'Pixabay' },
      { name: 'Level VII (Short)', author: 'Pixabay' },
      { name: 'Retro 8-Bit Happy Videogame Music', author: 'Pixabay' },
      { name: 'The World of 8-Bit Games', author: 'Pixabay' },
    ],
  },
  {
    title: 'Sound Effects',
    icon: '🔊',
    items: [
      { name: 'Correct Answer SFX', description: '8-bit positive feedback' },
      { name: 'Wrong Answer SFX', description: '8-bit negative feedback' },
    ],
  },
  {
    title: 'Made with',
    icon: '🛠️',
    items: [
      { name: 'React', description: 'UI Framework' },
      { name: 'TypeScript', description: 'Language' },
      { name: 'Vite', description: 'Build Tool' },
    ],
  },
  {
    title: 'Special Thanks',
    icon: '💖',
    items: [
      { name: 'The Players', description: 'For playing and enjoying the game' },
      { name: 'Open Source Community', description: 'For amazing tools and libraries' },
    ],
  },
]
```

### Starfield Configuration

```typescript
/**
 * Default starfield layer configurations
 * Three layers for parallax depth effect
 * @public
 */
export const STARFIELD_CONFIG: StarLayerConfig[] = [
  {
    id: 'distant',
    starSize: 1,
    starCount: 80,
    animationDuration: 20,
    opacity: 0.5,
    color: '#ffffff',
  },
  {
    id: 'medium',
    starSize: 2,
    starCount: 50,
    animationDuration: 12,
    opacity: 0.7,
    color: '#ffffff',
  },
  {
    id: 'near',
    starSize: 3,
    starCount: 30,
    animationDuration: 8,
    opacity: 1.0,
    color: '#ffffff',
  },
]
```

## Entity Relationships

```text
CreditsPage
├── Starfield
│   └── StarLayerConfig[] (3 layers)
├── RainbowTitle
│   └── title: string
└── CreditsContent
    ├── ScrollState
    ├── SPEED_LEVELS
    └── CreditsSection[]
        └── AttributionItem[]
```

## State Management

| State | Owner | Persistence |
|-------|-------|-------------|
| `scrollPosition` | CreditsContent | None (resets on mount) |
| `speedIndex` | CreditsContent | None (resets on mount) |
| `isScrolling` | CreditsContent | None (always true on mount) |

**Note**: No localStorage usage. All state is ephemeral - credits reset to beginning each time the screen is opened (per spec FR-015 acceptance scenario 2).

## Validation Rules

| Field | Rule |
|-------|------|
| `CreditsSection.title` | Required, non-empty string |
| `CreditsSection.items` | Required, at least 1 item |
| `AttributionItem.name` | Required, non-empty string |
| `StarLayerConfig.starSize` | Positive integer, 1-5 px |
| `StarLayerConfig.starCount` | Positive integer, 10-100 |
| `StarLayerConfig.animationDuration` | Positive number, 5-30 seconds |
| `speedIndex` | 0 to SPEED_LEVELS.length - 1 |
