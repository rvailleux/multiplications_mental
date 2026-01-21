/**
 * Type definitions for timer pause/resume functionality
 * Feature: 012-keyboard-navigation
 * @packageDocumentation
 */

/**
 * Extended timer state with pause/resume capability
 * @public
 */
export interface TimerState {
  /** Seconds remaining in countdown */
  timeRemaining: number
  /** Initial countdown value in seconds */
  totalTime: number
  /** Whether timer is currently paused */
  isPaused: boolean
  /** Timestamp when timer started (Date.now()) */
  startTime: number
  /** Timestamp when timer was paused (null if not paused) */
  pausedAt: number | null
  /** Total accumulated paused duration in milliseconds */
  pausedDuration: number
}

/**
 * Props for useTimer hook (extended)
 * @public
 */
export interface UseTimerProps {
  /** Total time in seconds */
  totalTime: number
  /** Callback when timer reaches zero */
  onComplete?: () => void
  /** Whether to start paused */
  startPaused?: boolean
}

/**
 * Return type for useTimer hook (extended)
 * @public
 */
export interface UseTimerResult {
  /** Seconds remaining */
  timeRemaining: number
  /** Whether timer is paused */
  isPaused: boolean
  /** Pause the timer */
  pause: () => void
  /** Resume the timer */
  resume: () => void
  /** Reset timer to initial value */
  reset: () => void
  /** Progress percentage (0-100) */
  progress: number
}
