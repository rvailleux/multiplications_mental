import React, { useEffect } from 'react'
import styles from './GameOverOverlay.module.scss'

/**
 * Props for the GameOverOverlay component
 * @public
 */
export interface GameOverOverlayProps {
  /** Whether the overlay should be visible */
  isVisible: boolean
  /** Callback function called after the 1.5 second display period */
  onAnimationComplete: () => void
}

/** Duration the overlay is displayed before calling onAnimationComplete (ms) */
const OVERLAY_DISPLAY_DURATION = 1500

/**
 * Full-screen "GAME OVER" overlay displayed when player loses all lives
 * Auto-navigates after 1.5 seconds by calling onAnimationComplete callback
 * Follows retro 8-bit aesthetic with zoom animation
 *
 * @param props - Component properties
 * @returns JSX element or null when not visible
 * @example
 * <GameOverOverlay
 *   isVisible={isGameOver}
 *   onAnimationComplete={handleNavigateToResults}
 * />
 * @public
 */
export default function GameOverOverlay({
  isVisible,
  onAnimationComplete,
}: GameOverOverlayProps): React.ReactElement | null {
  /**
   * Timer effect: calls onAnimationComplete after OVERLAY_DISPLAY_DURATION
   * Only runs when isVisible is true
   * Cleans up timer on unmount or when isVisible becomes false
   */
  useEffect(() => {
    if (!isVisible) {
      return
    }

    const timer = setTimeout(() => {
      onAnimationComplete()
    }, OVERLAY_DISPLAY_DURATION)

    return () => clearTimeout(timer)
  }, [isVisible, onAnimationComplete])

  if (!isVisible) {
    return null
  }

  return (
    <div className={styles.overlay} data-testid="game-over-overlay" aria-live="assertive">
      <div className={styles.content} data-testid="game-over-content">
        <h1 className={styles.title}>GAME OVER</h1>
        <p className={styles.subtitle}>No Lives Remaining</p>
      </div>
    </div>
  )
}
