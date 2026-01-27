import { useState, useCallback, useRef, useEffect } from 'react'
import type {
  FeedbackType,
  UseAnswerFeedbackReturn,
  UseAnswerFeedbackOptions,
} from '../types/feedback'
import { SOUND_PATHS, FEEDBACK_DEFAULTS } from '../types/feedback'

/**
 * Custom hook for managing answer feedback (audio + visual)
 * Plays 8-bit sound effects and manages visual feedback state for correct/incorrect answers
 *
 * @param options - Optional configuration for feedback behavior
 * @returns Object with feedback controls and state
 *
 * @example
 * ```tsx
 * const { playCorrect, playIncorrect, isPlaying, feedbackType } = useAnswerFeedback()
 *
 * const handleCorrectAnswer = () => {
 *   playCorrect()  // Plays positive sound, sets visual state
 * }
 *
 * // In JSX:
 * <AnswerFeedback type={feedbackType} isVisible={isPlaying} />
 * ```
 */
export function useAnswerFeedback(options: UseAnswerFeedbackOptions = {}): UseAnswerFeedbackReturn {
  const {
    duration = FEEDBACK_DEFAULTS.duration,
    volume = FEEDBACK_DEFAULTS.volume,
    enableSound = FEEDBACK_DEFAULTS.enableSound,
  } = options

  const [isPlaying, setIsPlaying] = useState(false)
  const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /**
   * Clears any existing timeout to prevent stale state updates
   */
  const clearExistingTimeout = useCallback((): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  /**
   * Plays a sound effect asynchronously
   * Handles errors gracefully without blocking visual feedback
   *
   * @param soundPath - Path to the sound file
   */
  const playSound = useCallback(
    async (soundPath: string): Promise<void> => {
      if (!enableSound) return

      try {
        const audio = new Audio(soundPath)
        audio.volume = Math.max(0, Math.min(1, volume)) // Clamp between 0 and 1
        await audio.play()
      } catch (error) {
        // Log warning but don't throw - visual feedback continues
        console.warn('Failed to play sound effect:', error)
      }
    },
    [enableSound, volume]
  )

  /**
   * Triggers feedback for a given type
   * Sets visual state immediately, plays sound async
   *
   * @param type - Type of feedback to trigger
   */
  const triggerFeedback = useCallback(
    (type: FeedbackType): void => {
      // Clear any existing timeout
      clearExistingTimeout()

      // Set visual state immediately
      setIsPlaying(true)
      setFeedbackType(type)

      // Play sound (async, doesn't block)
      const soundPath = type === 'correct' ? SOUND_PATHS.correct : SOUND_PATHS.incorrect
      playSound(soundPath)

      // Reset state after duration
      timeoutRef.current = setTimeout(() => {
        setIsPlaying(false)
        setFeedbackType(null)
      }, duration)
    },
    [clearExistingTimeout, playSound, duration]
  )

  /**
   * Trigger positive feedback for correct answer
   * Plays success sound and shows green flash animation
   */
  const playCorrect = useCallback((): void => {
    triggerFeedback('correct')
  }, [triggerFeedback])

  /**
   * Trigger negative feedback for incorrect answer
   * Plays error sound and shows red shake animation
   */
  const playIncorrect = useCallback((): void => {
    triggerFeedback('incorrect')
  }, [triggerFeedback])

  /**
   * Cleanup timeout on unmount
   */
  useEffect(() => {
    return () => {
      clearExistingTimeout()
    }
  }, [clearExistingTimeout])

  return {
    playCorrect,
    playIncorrect,
    isPlaying,
    feedbackType,
  }
}
