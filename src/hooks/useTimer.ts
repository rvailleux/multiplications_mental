import { useState, useEffect, useRef } from 'react'

/**
 * Return type for useTimer hook
 * @public
 */
export interface UseTimerResult {
  /** Current seconds remaining in the countdown */
  secondsLeft: number
  /** Whether the timer is currently paused */
  isPaused: boolean
  /** Function to reset timer back to initial value */
  reset: () => void
  /** Function to pause the timer */
  pause: () => void
  /** Function to resume the timer */
  resume: () => void
}

/**
 * Custom hook that provides countdown timer functionality with pause/resume capability
 * Uses timestamp-based tracking for accurate time management without drift.
 * Supports multiple pause/resume cycles and maintains accuracy across all states.
 *
 * @param initialSeconds - The starting countdown value in seconds
 * @returns Timer state and controls
 *
 * @example
 * ```tsx
 * const { secondsLeft, isPaused, pause, resume, reset } = useTimer(60)
 *
 * // Timer starts at 60 and decrements every second
 * // Press ESC to pause
 * // Call resume() to continue
 * // Call reset() to restart from 60
 * ```
 */
export function useTimer(initialSeconds: number): UseTimerResult {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
  const [isPaused, setIsPaused] = useState(false)
  const startTimeRef = useRef<number>(Date.now())
  const pausedAtRef = useRef<number | null>(null)
  const pausedDurationRef = useRef<number>(0)

  /**
   * Pause the timer
   * Stores current timestamp and stops timer updates
   */
  const pause = (): void => {
    if (!isPaused) {
      try {
        pausedAtRef.current = Date.now()
        setIsPaused(true)
      } catch (error) {
        console.error('Error pausing timer:', error)
      }
    }
  }

  /**
   * Resume the timer
   * Calculates paused duration and resumes timer updates
   */
  const resume = (): void => {
    if (isPaused && pausedAtRef.current !== null) {
      try {
        const pausedDuration = Date.now() - pausedAtRef.current
        pausedDurationRef.current += pausedDuration
        pausedAtRef.current = null
        setIsPaused(false)
      } catch (error) {
        console.error('Error resuming timer:', error)
      }
    }
  }

  /**
   * Reset timer to initial value
   * Maintains pause state but resets time and timestamps
   */
  const reset = (): void => {
    try {
      setSecondsLeft(initialSeconds)
      startTimeRef.current = Date.now()
      pausedDurationRef.current = 0
      if (isPaused && pausedAtRef.current !== null) {
        pausedAtRef.current = Date.now()
      }
    } catch (error) {
      console.error('Error resetting timer:', error)
    }
  }

  useEffect(() => {
    if (isPaused) {
      return
    }

    const interval = setInterval(() => {
      try {
        const elapsed = Math.floor(
          (Date.now() - startTimeRef.current - pausedDurationRef.current) / 1000
        )
        const remaining = Math.max(0, initialSeconds - elapsed)
        setSecondsLeft(remaining)

        if (remaining === 0) {
          clearInterval(interval)
        }
      } catch (error) {
        console.error('Error updating timer:', error)
      }
    }, 100) // Update every 100ms for smooth countdown

    return () => clearInterval(interval)
  }, [isPaused, initialSeconds])

  return {
    secondsLeft,
    isPaused,
    reset,
    pause,
    resume,
  }
}
