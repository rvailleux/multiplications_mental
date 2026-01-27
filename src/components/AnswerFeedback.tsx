import type React from 'react'
import type { AnswerFeedbackProps } from '../types/feedback'
import styles from './AnswerFeedback.module.scss'

/**
 * Visual feedback overlay for answer submissions
 * Displays a full-viewport flash animation for correct (green) or incorrect (red shake) answers
 *
 * @param props - Component properties
 * @param props.type - Type of feedback ('correct' | 'incorrect' | null)
 * @param props.isVisible - Whether the overlay should be rendered
 * @param props.onAnimationEnd - Optional callback when animation completes
 * @returns JSX element or null when hidden
 *
 * @example
 * ```tsx
 * const { isPlaying, feedbackType } = useAnswerFeedback()
 *
 * <AnswerFeedback
 *   type={feedbackType}
 *   isVisible={isPlaying}
 *   onAnimationEnd={() => console.log('Animation complete')}
 * />
 * ```
 */
export default function AnswerFeedback({
  type,
  isVisible,
  onAnimationEnd,
}: AnswerFeedbackProps): React.JSX.Element | null {
  // Don't render if not visible or no type specified
  if (!isVisible || type === null) {
    return null
  }

  // Determine animation class based on feedback type
  const animationClass = type === 'correct' ? styles.correct : styles.incorrect

  return (
    <div
      className={`${styles.overlay} ${animationClass}`}
      onAnimationEnd={onAnimationEnd}
      aria-hidden="true" // Decorative, not for screen readers
      data-testid="answer-feedback-overlay"
    />
  )
}
