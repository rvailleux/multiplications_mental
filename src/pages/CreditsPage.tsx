import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import Starfield from '../components/Starfield'
import RainbowTitle from '../components/RainbowTitle'
import CreditsContent from '../components/CreditsContent'
import KeyboardHints from '../components/KeyboardHints'
import { useCreditsScroll } from '../hooks/useCreditsScroll'
import { CREDITS_DATA } from '../data/creditsData'
import styles from './CreditsPage.module.scss'

/**
 * Credits page component
 * Displays cinematic credits with parallax starfield background,
 * animated rainbow title, and auto-scrolling attribution content.
 *
 * Keyboard controls:
 * - Escape: Return to HomePage (leaderboard)
 * - ArrowUp: Increase scroll speed
 * - ArrowDown: Decrease scroll speed (can pause)
 *
 * @returns JSX element with full credits screen
 *
 * @example
 * ```tsx
 * <Route path="/credits" element={<CreditsPage />} />
 * ```
 */
export default function CreditsPage() {
  const navigate = useNavigate()
  const { scrollState, increaseSpeed, decreaseSpeed, speedLabel, setMaxScroll } = useCreditsScroll()
  const [showSpeedIndicator, setShowSpeedIndicator] = useState(false)
  const [speedIndicatorTimeout, setSpeedIndicatorTimeout] = useState<NodeJS.Timeout | null>(null)

  /**
   * Show speed indicator briefly when speed changes
   */
  const showSpeedChange = useCallback(() => {
    setShowSpeedIndicator(true)

    // Clear previous timeout if exists
    if (speedIndicatorTimeout) {
      clearTimeout(speedIndicatorTimeout)
    }

    // Hide after 1.5 seconds
    const timeout = setTimeout(() => {
      setShowSpeedIndicator(false)
    }, 1500)

    setSpeedIndicatorTimeout(timeout)
  }, [speedIndicatorTimeout])

  /**
   * Handle speed increase with visual feedback
   */
  const handleIncreaseSpeed = useCallback(() => {
    increaseSpeed()
    showSpeedChange()
  }, [increaseSpeed, showSpeedChange])

  /**
   * Handle speed decrease with visual feedback
   */
  const handleDecreaseSpeed = useCallback(() => {
    decreaseSpeed()
    showSpeedChange()
  }, [decreaseSpeed, showSpeedChange])

  /**
   * Keyboard navigation handler
   * - Escape: Navigate back to home
   * - ArrowUp: Increase scroll speed
   * - ArrowDown: Decrease scroll speed
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      switch (e.key) {
        case 'Escape':
          navigate('/home')
          break
        case 'ArrowUp':
          e.preventDefault() // Prevent page scroll
          handleIncreaseSpeed()
          break
        case 'ArrowDown':
          e.preventDefault() // Prevent page scroll
          handleDecreaseSpeed()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate, handleIncreaseSpeed, handleDecreaseSpeed])

  /**
   * Cleanup timeout on unmount
   */
  useEffect(() => {
    return () => {
      if (speedIndicatorTimeout) {
        clearTimeout(speedIndicatorTimeout)
      }
    }
  }, [speedIndicatorTimeout])

  return (
    <div className={styles.creditsContainer}>
      {/* Parallax starfield background */}
      <Starfield />

      {/* Animated title */}
      <div className={styles.titleContainer}>
        <RainbowTitle title="Credits" />
      </div>

      {/* Scrolling credits content */}
      <div className={styles.contentLayer}>
        <CreditsContent
          creditsData={CREDITS_DATA}
          scrollState={scrollState}
          onMaxScrollCalculated={setMaxScroll}
        />
      </div>

      {/* Speed indicator (shows when speed changes) */}
      <div className={`${styles.speedIndicator} ${showSpeedIndicator ? styles.visible : ''}`}>
        Speed: {speedLabel}
      </div>

      {/* Keyboard hints */}
      <KeyboardHints screenId="credits" className={styles.keyboardHints} />
    </div>
  )
}
