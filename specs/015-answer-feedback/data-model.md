# Data Model: Answer Feedback System

**Feature Branch**: `015-answer-feedback`
**Date**: 2026-01-25

## Overview

This document defines the TypeScript types and interfaces for the Answer Feedback System feature. All types will be defined in `src/types/feedback.ts`.

---

## Type Definitions

### FeedbackType

Enum representing the type of feedback to display.

```typescript
/**
 * Type of answer feedback
 * @public
 */
export type FeedbackType = 'correct' | 'incorrect'
```

**Usage**: Determines which sound effect to play and which animation to show.

---

### FeedbackState

Internal state managed by the `useAnswerFeedback` hook.

```typescript
/**
 * Internal state for feedback system
 * @internal
 */
interface FeedbackState {
  /** Whether feedback animation/sound is currently playing */
  isPlaying: boolean
  /** Current feedback type being displayed, or null if idle */
  currentType: FeedbackType | null
}
```

**State Transitions**:
```
IDLE (isPlaying: false, currentType: null)
  ↓ playCorrect() or playIncorrect()
PLAYING (isPlaying: true, currentType: 'correct' | 'incorrect')
  ↓ Animation ends (~500ms)
IDLE (isPlaying: false, currentType: null)
```

---

### UseAnswerFeedbackReturn

Public interface returned by the `useAnswerFeedback` hook.

```typescript
/**
 * Return type for useAnswerFeedback hook
 * @public
 */
export interface UseAnswerFeedbackReturn {
  /**
   * Trigger positive feedback (correct answer)
   * Plays success sound and triggers green flash animation
   */
  playCorrect: () => void

  /**
   * Trigger negative feedback (incorrect answer)
   * Plays error sound and triggers red shake animation
   */
  playIncorrect: () => void

  /**
   * Whether feedback is currently being displayed
   * Use to control visual overlay visibility
   */
  isPlaying: boolean

  /**
   * Current feedback type, or null if not playing
   * Use to determine animation style
   */
  feedbackType: FeedbackType | null
}
```

**Example Usage**:
```typescript
const feedback = useAnswerFeedback()

// In answer handler
const handleCorrectAnswer = () => {
  feedback.playCorrect()
  // ... other logic
}

// In JSX
<AnswerFeedback
  type={feedback.feedbackType}
  isVisible={feedback.isPlaying}
/>
```

---

### AnswerFeedbackProps

Props interface for the `AnswerFeedback` component.

```typescript
/**
 * Props for AnswerFeedback component
 * @public
 */
export interface AnswerFeedbackProps {
  /**
   * Type of feedback to display
   * null means no feedback (component not visible)
   */
  type: FeedbackType | null

  /**
   * Whether the feedback overlay is visible
   * Controls CSS visibility and animation trigger
   */
  isVisible: boolean

  /**
   * Optional callback when animation completes
   * Used to reset state after visual feedback ends
   */
  onAnimationEnd?: () => void
}
```

**Component Behavior**:
- When `isVisible` is `false`: Component renders nothing (or hidden)
- When `isVisible` is `true` and `type` is `'correct'`: Green flash animation
- When `isVisible` is `true` and `type` is `'incorrect'`: Red shake animation

---

### SoundEffectConfig

Configuration for sound effect files.

```typescript
/**
 * Sound effect configuration
 * @internal
 */
interface SoundEffectConfig {
  /** Path to the correct answer sound file */
  correctSound: string
  /** Path to the incorrect answer sound file */
  incorrectSound: string
  /** Volume level (0.0 to 1.0) */
  volume: number
}

/**
 * Default sound effect configuration
 */
export const DEFAULT_SOUND_CONFIG: SoundEffectConfig = {
  correctSound: '/audio/sfx/correct.mp3',
  incorrectSound: '/audio/sfx/incorrect.mp3',
  volume: 0.2, // 20% as specified
}
```

---

### UseAnswerFeedbackOptions

Optional configuration for the hook.

```typescript
/**
 * Options for useAnswerFeedback hook
 * @public
 */
export interface UseAnswerFeedbackOptions {
  /**
   * Duration of feedback display in milliseconds
   * @default 500
   */
  duration?: number

  /**
   * Volume for sound effects (0.0 to 1.0)
   * @default 0.2
   */
  volume?: number

  /**
   * Whether to play sound effects
   * Set to false for visual-only feedback
   * @default true
   */
  enableSound?: boolean
}
```

**Example with Options**:
```typescript
const feedback = useAnswerFeedback({
  duration: 500,
  volume: 0.2,
  enableSound: true,
})
```

---

## Entity Relationships

```
┌─────────────────────────────────────────────────────────┐
│                    PlayPage.tsx                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │  useAnswerFeedback()                            │    │
│  │  ├── playCorrect()                              │    │
│  │  ├── playIncorrect()                            │    │
│  │  ├── isPlaying: boolean                         │    │
│  │  └── feedbackType: FeedbackType | null          │    │
│  └─────────────────────────────────────────────────┘    │
│                         │                                │
│                         │ props                          │
│                         ▼                                │
│  ┌─────────────────────────────────────────────────┐    │
│  │  <AnswerFeedback />                             │    │
│  │  ├── type: FeedbackType | null                  │    │
│  │  ├── isVisible: boolean                         │    │
│  │  └── onAnimationEnd?: () => void                │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘

Sound Files:
  /public/audio/sfx/
  ├── correct.mp3    (positive feedback)
  └── incorrect.mp3  (negative feedback)
```

---

## Validation Rules

### FeedbackType
- Must be exactly `'correct'` or `'incorrect'`
- TypeScript union type enforces this at compile time

### Volume
- Must be between 0.0 and 1.0 (inclusive)
- Default: 0.2 (20%)
- Validation: `Math.max(0, Math.min(1, volume))`

### Duration
- Must be positive integer
- Default: 500ms
- Maximum recommended: 1000ms (to not block gameplay)

---

## File Structure

```
src/types/
└── feedback.ts           # All type definitions above

src/hooks/
└── useAnswerFeedback.ts  # Hook implementation using types

src/components/
└── AnswerFeedback.tsx    # Component using AnswerFeedbackProps

public/audio/sfx/
├── correct.mp3           # Positive feedback sound (~200-500ms)
└── incorrect.mp3         # Negative feedback sound (~200-500ms)
```

---

## Complete Type File

The complete `src/types/feedback.ts` file:

```typescript
/**
 * Type definitions for the Answer Feedback System
 * @module types/feedback
 */

/**
 * Type of answer feedback
 * @public
 */
export type FeedbackType = 'correct' | 'incorrect'

/**
 * Return type for useAnswerFeedback hook
 * @public
 */
export interface UseAnswerFeedbackReturn {
  /** Trigger positive feedback (correct answer) */
  playCorrect: () => void
  /** Trigger negative feedback (incorrect answer) */
  playIncorrect: () => void
  /** Whether feedback is currently being displayed */
  isPlaying: boolean
  /** Current feedback type, or null if not playing */
  feedbackType: FeedbackType | null
}

/**
 * Options for useAnswerFeedback hook
 * @public
 */
export interface UseAnswerFeedbackOptions {
  /** Duration of feedback display in milliseconds @default 500 */
  duration?: number
  /** Volume for sound effects (0.0 to 1.0) @default 0.2 */
  volume?: number
  /** Whether to play sound effects @default true */
  enableSound?: boolean
}

/**
 * Props for AnswerFeedback component
 * @public
 */
export interface AnswerFeedbackProps {
  /** Type of feedback to display */
  type: FeedbackType | null
  /** Whether the feedback overlay is visible */
  isVisible: boolean
  /** Optional callback when animation completes */
  onAnimationEnd?: () => void
}

/**
 * Sound effect file paths
 * @internal
 */
export const SOUND_PATHS = {
  correct: '/audio/sfx/correct.mp3',
  incorrect: '/audio/sfx/incorrect.mp3',
} as const

/**
 * Default feedback configuration
 * @internal
 */
export const FEEDBACK_DEFAULTS = {
  duration: 500,
  volume: 0.2,
  enableSound: true,
} as const
```
