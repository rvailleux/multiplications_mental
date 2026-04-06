import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { getCurrentPlayer } from '../types/player'
import type { ScoreEntry } from '../types/score'
import { getScorePlayerName } from '../types/score'
import { calculateMetrics, calculateRanks, findBestMetrics } from '../utils/scoreUtils'
import type { RankedScore } from '../utils/scoreUtils'
import PlayerNameDisplay from '../components/PlayerNameDisplay'
import JumpingArrow from '../components/JumpingArrow'
import KeyboardHints from '../components/KeyboardHints'
import styles from './Complement10HomePage.module.scss'

/**
 * localStorage key for complement-to-10 scores
 * @public
 */
export const COMPLEMENT10_SCORES_KEY = 'complement10_scores'

/**
 * Home page for the "Compléments" game module.
 * Shows a start button and leaderboard for complement-to-10 scores.
 * @returns {JSX.Element} Complement10 home page
 * @example
 * <Route path="/complement10" element={<Complement10HomePage />} />
 */
export default function Complement10HomePage() {
  const navigate = useNavigate()
  const currentPlayer = getCurrentPlayer()

  /** Redirect to player selection if no player is selected */
  useEffect(() => {
    if (!currentPlayer) {
      navigate('/')
    }
  }, [currentPlayer, navigate])

  /** Keyboard navigation: ESC → game select, ENTER → start game */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        navigate('/select-game')
      } else if (e.key === 'Enter') {
        navigate('/play/complement10')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  /** Load complement10 score history from localStorage (last 100) */
  const scores: ScoreEntry[] = (() => {
    try {
      return JSON.parse(localStorage.getItem(COMPLEMENT10_SCORES_KEY) || '[]').slice(-100)
    } catch {
      return []
    }
  })()

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
      <PlayerNameDisplay player={currentPlayer} onClick={() => navigate('/')} />
      <div className={styles.clouds}>
        <div className={styles.cloud}>☁️</div>
        <div className={styles.cloud}>☁️</div>
        <div className={styles.cloud}>☁️</div>
      </div>

      <div className={styles.gameHeader}>
        <h1 className={styles.gameTitle}>➕ COMPLÉMENTS ➕</h1>
        <div className={styles.subtitle}>Welcome {currentPlayer.name}!</div>
      </div>

      <div className={styles.startButtonContainer}>
        <button className={styles.pixelButton} onClick={() => navigate('/play/complement10')}>
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

      <KeyboardHints screenId="complement10" />
    </div>
  )
}
