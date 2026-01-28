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
 * Base URL for assets - handles GitHub Pages subdirectory deployment
 */
const BASE_URL = import.meta.env.BASE_URL

/**
 * Sound effect file paths
 * @internal
 */
export const SOUND_PATHS = {
  correct: `${BASE_URL}audio/sfx/correct.mp3`,
  incorrect: `${BASE_URL}audio/sfx/wrong.mp3`,
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
