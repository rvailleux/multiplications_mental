import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useMusic } from '../contexts/MusicContext'
import PlayerNameDisplay from '../components/PlayerNameDisplay'
import JumpingArrow from '../components/JumpingArrow'
import KeyboardHints from '../components/KeyboardHints'
import { getCurrentPlayer } from '../types/player'
import type { GameResult } from './PlayPage'
import type { GameEndReason, ScoreEntry } from '../types/score'
import { getScorePlayerName } from '../types/score'
import styles from './GameResultsPage.module.scss'

/**
 * Supported game module identifiers
 * @public
 */
export type GameModule = 'multiplication' | 'complement10'

/**
 * Route state interface for GameResultsPage
 * Data passed from PlayPage when game ends (timer expires or lives depleted)
 * @public
 */
export interface GameResultsState {
  /** Final score achieved during the game session */
  score: number
  /** Array of all questions and their results */
  results: GameResult[]
  /** Reason why the game ended (optional for backward compatibility) */
  endReason?: GameEndReason
  /** Which game module was played */
  gameModule?: GameModule
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
  const { playMainTheme } = useMusic()

  // Extract score, results, endReason, and gameModule from route state with fallback defaults
  const state = location.state as GameResultsState | undefined
  const score = state?.score ?? 0
  const results = state?.results ?? []
  const endReason = state?.endReason
  const gameModule = state?.gameModule ?? 'multiplication'

  /** Home path to navigate to based on which game was played */
  const homePath = gameModule === 'complement10' ? '/complement10' : '/home'

  /** localStorage key for the current game module's scores */
  const scoresKey = gameModule === 'complement10' ? 'complement10_scores' : 'scores'

  /**
   * Get display text based on game end reason
   * Returns contextual message for lives depleted, timer expired, or legacy fallback
   * @param reason - The reason the game ended
   * @returns Display text for the heading
   */
  const getEndReasonText = (reason?: GameEndReason): string => {
    switch (reason) {
      case 'lives_depleted':
        return 'No Lives Remaining'
      case 'timer_expired':
        return "Time's Up!"
      default:
        return 'Game Over!' // Legacy fallback for old entries without endReason
    }
  }

  /**
   * Determine if the game ended due to lives being depleted
   * Used for conditional styling (red vs gold heading)
   */
  const isLivesDepleted = endReason === 'lives_depleted'

  /** Redirect to player selection if no player is selected */
  useEffect(() => {
    if (!currentPlayer) {
      navigate('/')
    }
  }, [currentPlayer, navigate])

  /**
   * Resume main theme music when entering results page
   * This switches back from gameplay music to menu theme
   */
  useEffect(() => {
    playMainTheme()
  }, [playMainTheme])

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
   * Keyboard navigation: ENTER navigates to appropriate home, ESC to player select
   * Cleanup event listener on unmount
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Enter') {
        navigate(homePath)
      } else if (e.key === 'Escape') {
        navigate('/')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate, homePath])

  /**
   * Generate container class name based on state
   * Applies blinking animation and lives-depleted variant styling
   */
  const getContainerClass = (): string => {
    const classes = [styles.container]
    if (isBlinking) classes.push(styles.blinking)
    if (isLivesDepleted) classes.push(styles.livesDepleted)
    return classes.join(' ')
  }

  /**
   * Generate heading class name based on end reason
   * Uses red styling for lives depleted, gold for timer expired
   */
  const getHeadingClass = (): string => {
    const classes = [styles.heading]
    if (isLivesDepleted) classes.push(styles.headingRed)
    return classes.join(' ')
  }

  /** Load top scores for the leaderboard from the current game module */
  const topScores: ScoreEntry[] = (() => {
    try {
      const raw = localStorage.getItem(scoresKey) || '[]'
      const all: ScoreEntry[] = JSON.parse(raw)
      return [...all].sort((a, b) => b.score - a.score).slice(0, 5)
    } catch {
      return []
    }
  })()

  const getMedalForRank = (rank: number): string => {
    if (rank === 0) return '🥇'
    if (rank === 1) return '🥈'
    if (rank === 2) return '🥉'
    return `${rank + 1}.`
  }

  return (
    <div className={getContainerClass()}>
      <PlayerNameDisplay player={currentPlayer} onClick={() => navigate('/')} />

      <div className={styles.card}>
        <h1 className={getHeadingClass()}>{getEndReasonText(endReason)}</h1>

        <div className={styles.score}>{score}</div>

        <div className={styles.stat}>
          Correct: {correctCount}/{totalQuestions}
        </div>

        <div className={styles.stat}>Accuracy: {accuracy}%</div>

        <div className={styles.stat}>Speed: {speed}</div>

        <button onClick={() => navigate(homePath)} className={styles.button}>
          <JumpingArrow visible={true} />
          Continue
        </button>
      </div>

      {topScores.length > 0 && (
        <div className={styles.leaderboard}>
          <h2 className={styles.leaderboardTitle}>🏆 Leaderboard 🏆</h2>
          <div className={styles.leaderboardList}>
            {topScores.map((entry, index) => {
              const playerName = getScorePlayerName(entry)
              const isCurrentScore =
                entry.score === score && entry.playerName === currentPlayer?.name
              return (
                <div
                  key={index}
                  className={`${styles.leaderboardRow} ${isCurrentScore ? styles.leaderboardRowCurrent : ''}`}
                >
                  <span className={styles.leaderboardMedal}>{getMedalForRank(index)}</span>
                  <span className={styles.leaderboardName}>{playerName}</span>
                  <span className={styles.leaderboardScore}>{entry.score} pts</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <KeyboardHints screenId="results" />
    </div>
  )
}
