import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import PlayerNameDisplay from '../components/PlayerNameDisplay'
import { getCurrentPlayer } from '../types/player'
import type { GameResult } from './PlayPage'
import styles from './GameResultsPage.module.scss'

/**
 * Route state interface for GameResultsPage
 * Data passed from PlayPage when timer expires
 * @public
 */
export interface GameResultsState {
  /** Final score achieved during the game session */
  score: number
  /** Array of all questions and their results */
  results: GameResult[]
}

/**
 * Game results screen displayed after 60-second timer expires
 * Shows final score, correct/total questions, accuracy percentage, and speed (avg time per correct answer)
 * Includes gold/yellow retro aesthetic with soft fading blink animation
 * ENTER key or Continue button navigates back to homepage
 *
 * Component receives data from route state (useLocation hook), not props
 *
 * @returns JSX element displaying game results
 * @public
 */
export default function GameResultsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPlayer = getCurrentPlayer()

  // Extract score and results from route state with fallback defaults
  const state = location.state as GameResultsState | undefined
  const score = state?.score ?? 0
  const results = state?.results ?? []

  /** Redirect to player selection if no player is selected */
  useEffect(() => {
    if (!currentPlayer) {
      navigate('/')
    }
  }, [currentPlayer, navigate])

  // Calculate stats from results array
  const correctCount = results.filter(r => r.correct).length
  const totalQuestions = results.length

  /**
   * Calculate accuracy percentage with division-by-zero protection
   * Returns rounded integer percentage (0-100)
   */
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

  /**
   * Calculate average time per correct answer (speed metric)
   * Total game time is fixed at 60 seconds
   * Returns formatted string with 1 decimal place and " character for seconds
   * Returns "-" when no correct answers to avoid division by zero
   */
  const GAME_DURATION_SECONDS = 60
  const speed = correctCount > 0 ? `${(GAME_DURATION_SECONDS / correctCount).toFixed(1)}"` : '-'

  // Animation state management
  const [isBlinking, setIsBlinking] = useState<boolean>(true)

  /**
   * Animation lifecycle: Stop blinking after 5 seconds
   * Cleanup timer on unmount to prevent memory leaks
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBlinking(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  /**
   * Keyboard navigation: ENTER key navigates to homepage
   * Cleanup event listener on unmount
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Enter') {
        navigate('/home')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  const getContainerClass = () => {
    const classes = [styles.container]
    if (isBlinking) classes.push(styles.blinking)
    return classes.join(' ')
  }

  return (
    <div className={getContainerClass()}>
      <PlayerNameDisplay player={currentPlayer} />

      <div className={styles.card}>
        <h1 className={styles.heading}>Game Over!</h1>

        <div className={styles.score}>{score}</div>

        <div className={styles.stat}>
          Correct: {correctCount}/{totalQuestions}
        </div>

        <div className={styles.stat}>Accuracy: {accuracy}%</div>

        <div className={styles.stat}>Speed: {speed}</div>

        <button onClick={() => navigate('/home')} className={styles.button}>
          Continue
        </button>
      </div>
    </div>
  )
}
