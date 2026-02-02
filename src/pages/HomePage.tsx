import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { getCurrentPlayer } from '../types/player'
import { getScorePlayerName } from '../types/score'
import PlayerNameDisplay from '../components/PlayerNameDisplay'
import JumpingArrow from '../components/JumpingArrow'
import KeyboardHints from '../components/KeyboardHints'
import styles from './HomePage.module.scss'

/**
 * Score data structure stored in localStorage
 * @public
 */
export type ScoreEntry = {
  /** Final score achieved in the game */
  score: number
  /** Array of all questions and results from the game session */
  results: Array<{
    question: string
    correct: boolean
  }>
  /** Unique identifier of the player who achieved this score */
  playerId?: string
  /** Display name of the player who achieved this score */
  playerName?: string
}

/**
 * Landing page component that displays game start button and score history
 * @returns {JSX.Element} Home page with start game button and previous scores list
 * @example
 * // Used in React Router as the main route
 * <Route path="/" element={<HomePage />} />
 */
/**
 * Represents a score with its rank information
 */
interface RankedScore extends ScoreEntry {
  rank: number
  medal?: string
}

/**
 * Represents calculated metrics for a game session
 */
interface GameMetrics {
  /** Accuracy percentage (0-100) */
  accuracy: number
  /** Average time per correct answer in seconds, or null if no correct answers */
  speed: number | null
  /** Number of correct answers */
  correctCount: number
  /** Total number of questions attempted */
  totalQuestions: number
}

/**
 * Calculate game metrics from results array
 * @param {Array<{question: string, correct: boolean}>} results - Game results
 * @returns {GameMetrics} Calculated metrics
 */
const calculateMetrics = (results: Array<{ question: string; correct: boolean }>): GameMetrics => {
  const correctCount = results.filter(r => r.correct).length
  const totalQuestions = results.length
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
  const GAME_DURATION_SECONDS = 60
  const speed = correctCount > 0 ? GAME_DURATION_SECONDS / correctCount : null

  return {
    accuracy,
    speed,
    correctCount,
    totalQuestions,
  }
}

/**
 * Find indices of scores with best metrics
 * @param {ScoreEntry[]} scores - Array of score entries
 * @returns {{bestSpeedIndices: number[], bestAccuracyIndices: number[]}}
 */
const findBestMetrics = (
  scores: ScoreEntry[]
): { bestSpeedIndices: number[]; bestAccuracyIndices: number[] } => {
  if (scores.length === 0) {
    return { bestSpeedIndices: [], bestAccuracyIndices: [] }
  }

  let bestSpeed: number | null = null
  let bestAccuracy = 0
  const bestSpeedIndices: number[] = []
  const bestAccuracyIndices: number[] = []

  // First pass: find best values
  scores.forEach(score => {
    const metrics = calculateMetrics(score.results)

    // Best speed is lowest time (faster)
    if (metrics.speed !== null) {
      if (bestSpeed === null || metrics.speed < bestSpeed) {
        bestSpeed = metrics.speed
      }
    }

    // Best accuracy is highest percentage
    if (metrics.accuracy > bestAccuracy) {
      bestAccuracy = metrics.accuracy
    }
  })

  // Second pass: collect indices of best metrics
  scores.forEach((score, index) => {
    const metrics = calculateMetrics(score.results)

    if (metrics.speed !== null && bestSpeed !== null && metrics.speed === bestSpeed) {
      bestSpeedIndices.push(index)
    }

    if (metrics.accuracy === bestAccuracy && bestAccuracy > 0) {
      bestAccuracyIndices.push(index)
    }
  })

  return { bestSpeedIndices, bestAccuracyIndices }
}

/**
 * Calculate ranks for scores, handling ties appropriately
 * @param {ScoreEntry[]} scores - Array of score entries
 * @returns {RankedScore[]} Scores with rank and medal information
 */
const calculateRanks = (scores: ScoreEntry[]): RankedScore[] => {
  // Sort scores by value (highest first)
  const sortedScores = [...scores].sort((a, b) => b.score - a.score)

  const rankedScores: RankedScore[] = []
  let currentRank = 1

  for (let i = 0; i < sortedScores.length; i++) {
    const score = sortedScores[i]

    // If not the first score and different from previous, update rank
    if (i > 0 && score.score !== sortedScores[i - 1].score) {
      currentRank = i + 1
    }

    // Assign medal for top 3 unique scores
    let medal: string | undefined
    if (currentRank === 1) medal = '🥇'
    else if (currentRank === 2) medal = '🥈'
    else if (currentRank === 3) medal = '🥉'

    rankedScores.push({
      ...score,
      rank: currentRank,
      medal,
    })
  }

  return rankedScores
}

export default function HomePage() {
  const navigate = useNavigate()
  const currentPlayer = getCurrentPlayer()

  /** Redirect to player selection if no player is selected */
  useEffect(() => {
    if (!currentPlayer) {
      navigate('/')
    }
  }, [currentPlayer, navigate])

  /** Keyboard navigation: ESC to go back, ENTER to start game, Ctrl+C to credits */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        navigate('/')
      } else if (e.key === 'Enter') {
        navigate('/play')
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault() // Prevent browser copy action
        navigate('/credits')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  /** Load score history from localStorage and limit to top 100 */
  const scores: ScoreEntry[] = JSON.parse(localStorage.getItem('scores') || '[]').slice(-100) // Keep only last 100 scores to prevent memory issues

  /** Calculate ranks and sort by score (highest first) */
  const rankedScores = calculateRanks(scores)
  const visibleScores = rankedScores

  /** Find best metrics across all scores for highlighting */
  const { bestSpeedIndices, bestAccuracyIndices } = findBestMetrics(scores)

  // Don't render if no player selected (will redirect)
  if (!currentPlayer) {
    return null
  }

  const getScoreCardClass = (rank: number) => {
    const classes = [styles.scoreCard]
    if (rank <= 3) classes.push(styles.topRank)
    return classes.join(' ')
  }

  const getScoreNumberClass = (rank: number) => {
    const classes = [styles.scoreNumber]
    if (rank <= 3) classes.push(styles.topRank)
    return classes.join(' ')
  }

  const getScoreValueClass = (rank: number) => {
    const classes = [styles.scoreValue]
    if (rank <= 3) classes.push(styles.topRank)
    return classes.join(' ')
  }

  const getMetricTextClass = (isBest: boolean) => {
    const classes = [styles.metricText]
    if (isBest) classes.push(styles.best)
    return classes.join(' ')
  }

  return (
    <div className={styles.gameContainer}>
      <PlayerNameDisplay player={currentPlayer} />
      <div className={styles.clouds}>
        <div className={styles.cloud}>☁️</div>
        <div className={styles.cloud}>☁️</div>
        <div className={styles.cloud}>☁️</div>
      </div>

      <div className={styles.gameHeader}>
        <h1 className={styles.gameTitle}>⭐ MATH QUEST ⭐</h1>
        <div className={styles.subtitle}>Welcome {currentPlayer.name}!</div>
      </div>

      <div className={styles.startButtonContainer}>
        <button className={styles.pixelButton} onClick={() => navigate('/play')}>
          <JumpingArrow visible={true} />
          🚀 Start Game
        </button>
      </div>

      {scores.length > 0 && (
        <>
          <h2 className={styles.scoresTitle}>🏆 Previous Scores 🏆</h2>
          <div className={styles.scoresContainer}>
            {visibleScores.map((entry: RankedScore, index: number) => {
              const metrics = calculateMetrics(entry.results)
              const originalIndex = scores.findIndex(
                s => s.score === entry.score && s.results === entry.results
              )
              const isBestSpeed = bestSpeedIndices.includes(originalIndex)
              const isBestAccuracy = bestAccuracyIndices.includes(originalIndex)

              const playerName = getScorePlayerName(entry)

              return (
                <div key={index} className={getScoreCardClass(entry.rank)}>
                  <div className={styles.scoreCardLeft}>
                    <div className={styles.scoreLeftGroup}>
                      <span className={getScoreNumberClass(entry.rank)}>
                        {entry.medal ? `${entry.medal} #${entry.rank}` : `#${entry.rank}`}
                      </span>
                      <span className={styles.playerName}>{playerName}</span>
                    </div>
                    <span className={getScoreValueClass(entry.rank)}>{entry.score} pts</span>
                  </div>

                  <div className={styles.metricsContainer} data-testid="metrics-container">
                    <span
                      className={getMetricTextClass(isBestAccuracy)}
                      data-metric="accuracy"
                      data-best={isBestAccuracy}
                    >
                      {metrics.accuracy}%
                    </span>
                    <span className={styles.metricSeparator}>•</span>
                    <span
                      className={getMetricTextClass(isBestSpeed)}
                      data-metric="speed"
                      data-best={isBestSpeed}
                    >
                      {metrics.speed !== null ? `${metrics.speed.toFixed(1)}"` : '-'}
                    </span>
                    <span className={styles.metricSeparator}>•</span>
                    <span className={styles.metricText}>
                      {metrics.correctCount}/{metrics.totalQuestions}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      <div className={styles.characterSprite}>🍄</div>

      <KeyboardHints screenId="home" />
    </div>
  )
}
