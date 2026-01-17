import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { getCurrentPlayer } from '../types/player'
import PlayerNameDisplay from '../components/PlayerNameDisplay'

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

  /** Keyboard navigation: ESC to go back, ENTER to start game */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        navigate('/')
      } else if (e.key === 'Enter') {
        navigate('/play')
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

  return (
    <div style={styles.gameContainer}>
      <PlayerNameDisplay player={currentPlayer} />
      <div style={styles.clouds}>
        <div style={styles.cloud}>☁️</div>
        <div style={styles.cloud}>☁️</div>
        <div style={styles.cloud}>☁️</div>
      </div>

      <div style={styles.gameHeader}>
        <h1 style={styles.gameTitle}>⭐ MATH QUEST ⭐</h1>
        <div style={styles.subtitle}>Welcome {currentPlayer.name}!</div>
      </div>

      <div style={styles.startButtonContainer}>
        <button style={styles.pixelButton} onClick={() => navigate('/play')}>
          🚀 Start Game
        </button>
      </div>

      {scores.length > 0 && (
        <>
          <h2 style={styles.scoresTitle}>🏆 Previous Scores 🏆</h2>
          <div style={styles.scoresContainer}>
            {visibleScores.map((entry: RankedScore, index: number) => {
              const metrics = calculateMetrics(entry.results)
              const originalIndex = scores.findIndex(
                s => s.score === entry.score && s.results === entry.results
              )
              const isBestSpeed = bestSpeedIndices.includes(originalIndex)
              const isBestAccuracy = bestAccuracyIndices.includes(originalIndex)

              return (
                <div
                  key={index}
                  style={{
                    ...styles.scoreCard,
                    ...(entry.rank <= 3 ? styles.topRankCard : {}),
                  }}
                >
                  <div style={styles.scoreCardLeft}>
                    <span
                      style={{
                        ...styles.scoreNumber,
                        ...(entry.rank <= 3 ? styles.topRankNumber : {}),
                      }}
                    >
                      {entry.medal ? `${entry.medal} #${entry.rank}` : `#${entry.rank}`}
                    </span>
                    <span
                      style={{
                        ...styles.scoreValue,
                        ...(entry.rank <= 3 ? styles.topRankValue : {}),
                      }}
                    >
                      {entry.score} pts
                    </span>
                  </div>

                  <div style={styles.metricsContainer} data-testid="metrics-container">
                    <span
                      style={{
                        ...styles.metricText,
                        ...(isBestAccuracy ? styles.bestMetric : {}),
                      }}
                      data-metric="accuracy"
                      data-best={isBestAccuracy}
                    >
                      {metrics.accuracy}%
                    </span>
                    <span style={styles.metricSeparator}>•</span>
                    <span
                      style={{
                        ...styles.metricText,
                        ...(isBestSpeed ? styles.bestMetric : {}),
                      }}
                      data-metric="speed"
                      data-best={isBestSpeed}
                    >
                      {metrics.speed !== null ? `${metrics.speed.toFixed(1)}"` : '-'}
                    </span>
                    <span style={styles.metricSeparator}>•</span>
                    <span style={styles.metricText}>
                      {metrics.correctCount}/{metrics.totalQuestions}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      <div style={styles.characterSprite}>🍄</div>
    </div>
  )
}

const styles = {
  gameContainer: {
    background: '#fff',
    border: '8px solid #000',
    boxShadow: `
      0 0 0 4px #fff,
      0 0 0 8px #000,
      12px 12px 0 0 rgba(0,0,0,0.3)
    `,
    maxWidth: '600px',
    width: '100%',
    padding: '30px',
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  clouds: {
    position: 'absolute' as const,
    top: '20px',
    left: '0',
    right: '0',
    display: 'flex',
    justifyContent: 'space-around',
    pointerEvents: 'none' as const,
  },
  cloud: {
    fontSize: '24px',
    opacity: 0.7,
    animation: 'float 8s ease-in-out infinite',
  },
  gameHeader: {
    background: 'linear-gradient(180deg, #ff6b6b 0%, #ee5a5a 100%)',
    border: '4px solid #000',
    padding: '20px',
    marginBottom: '30px',
    position: 'relative' as const,
    boxShadow: 'inset 0 -4px 0 rgba(0,0,0,0.2)',
    width: '100%',
    textAlign: 'center' as const,
  },
  gameTitle: {
    color: '#fff',
    fontSize: '20px',
    textShadow: `
      4px 4px 0 #000,
      -2px -2px 0 #000
    `,
    marginBottom: '10px',
    letterSpacing: '2px',
  },
  subtitle: {
    color: '#fff',
    fontSize: '12px',
    textShadow: '2px 2px 0 #000',
  },
  startButtonContainer: {
    marginBottom: '30px',
  },
  pixelButton: {
    background: 'linear-gradient(180deg, #4ecdc4 0%, #44b3aa 100%)',
    color: '#fff',
    fontSize: '16px',
    padding: '18px 30px',
    border: '4px solid #000',
    cursor: 'pointer',
    position: 'relative' as const,
    transition: 'all 0.1s',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    boxShadow: '0 6px 0 #000',
    animation: 'softBlink 2s ease-in-out infinite',
  },
  scoresTitle: {
    color: '#ff6b6b',
    fontSize: '16px',
    marginBottom: '20px',
    textAlign: 'center' as const,
  },
  scoresContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    marginBottom: '20px',
    width: '100%',
    maxHeight: '300px', // Increased height for better scrolling experience
    overflowY: 'auto' as const,
  },
  scoreCard: {
    background: 'linear-gradient(180deg, #87ceeb 0%, #fff 100%)',
    border: '4px solid #000',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.5)',
  },
  scoreCardLeft: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topRankCard: {
    background: 'linear-gradient(180deg, #ffd700 0%, #fff8dc 100%)',
    border: '4px solid #b8860b',
    boxShadow: `
      inset 0 4px 0 rgba(255,255,255,0.7),
      0 0 12px rgba(255, 215, 0, 0.5)
    `,
    animation: 'goldGlow 2s ease-in-out infinite alternate',
  },
  scoreNumber: {
    fontSize: '14px',
    color: '#000',
    fontWeight: 'bold' as const,
  },
  topRankNumber: {
    color: '#8b4513',
    fontSize: '16px',
    textShadow: '2px 2px 0 #fff',
  },
  scoreValue: {
    fontSize: '14px',
    color: '#ffd700',
    textShadow: '2px 2px 0 #000',
  },
  topRankValue: {
    color: '#ff6b47',
    fontSize: '16px',
    textShadow: '2px 2px 0 #fff',
    fontWeight: 'bold' as const,
  },
  characterSprite: {
    position: 'absolute' as const,
    bottom: '-50px',
    right: '20px',
    fontSize: '64px',
    animation: 'bounce 1s ease-in-out infinite',
  },
  metricsContainer: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    fontSize: '12px',
    color: '#4a4a4a', // Dark grey 8-bit style
    fontFamily: 'monospace',
  },
  metricText: {
    color: '#4a4a4a', // Dark grey for regular metrics
    fontWeight: 'bold' as const,
  },
  metricSeparator: {
    color: '#4a4a4a',
    opacity: 0.5,
  },
  bestMetric: {
    color: '#ff6b47', // Highlighted color for best metrics
    textShadow: '1px 1px 0 rgba(255, 107, 71, 0.3)',
    animation: 'softBlink 2s ease-in-out infinite',
  },
}
