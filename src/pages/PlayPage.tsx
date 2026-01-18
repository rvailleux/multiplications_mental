import { useState, useEffect } from 'react'
import { useTimer } from '../hooks/useTimer'
import { useBackgroundMusic } from '../hooks/useBackgroundMusic'
import ProgressBar from '../components/ProgressBar'
import MultiplicationQuestion from '../components/MultiplicationQuestion'
import { useNavigate } from 'react-router-dom'
import { getCurrentPlayer } from '../types/player'
import PlayerNameDisplay from '../components/PlayerNameDisplay'
import styles from './PlayPage.module.scss'

/**
 * Game result structure for tracking user answers
 * @public
 */
export type GameResult = {
  /** The multiplication question (e.g., "3 x 7") */
  question: string
  /** Whether the user answered correctly */
  correct: boolean
}

/**
 * Main game page component that orchestrates the multiplication game experience
 * @returns {JSX.Element} The complete game interface with timer, score, and question
 * @example
 * // Used in React Router
 * <Route path="/play" element={<PlayPage />} />
 */
export default function PlayPage() {
  const navigate = useNavigate()
  const currentPlayer = getCurrentPlayer()
  const totalTime = 60 // Total time in seconds
  const { secondsLeft, reset } = useTimer(totalTime)
  const { startMusic, stopMusic } = useBackgroundMusic()
  const [score, setScore] = useState(0)
  const [results, setResults] = useState<GameResult[]>([])
  const [combo, setCombo] = useState(0)
  const [scorePopup, setScorePopup] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [lives, setLives] = useState(3)

  /** Redirect to player selection if no player is selected */
  useEffect(() => {
    if (!currentPlayer) {
      navigate('/')
    }
  }, [currentPlayer, navigate])

  /** Calculate progress percentage based on elapsed time */
  const progress = ((totalTime - secondsLeft) / totalTime) * 100

  /**
   * Handles correct answer submission by incrementing score, combo, and recording result
   * @param {string} question - The multiplication question that was answered correctly
   */
  const handleCorrectAnswer = (question: string) => {
    const newCombo = combo + 1
    const points = 100 * newCombo
    setScore(prev => prev + points)
    setCombo(newCombo)
    setResults(prev => [...prev, { question, correct: true }])

    // Show score popup animation
    setScorePopup(`+${points}`)
    setShowPopup(true)
    setTimeout(() => setShowPopup(false), 800)
  }

  /**
   * Handles incorrect answer submission by recording the failed attempt and resetting combo
   * @param {string} question - The multiplication question that was answered incorrectly
   */
  const handleBadAnswer = (question: string) => {
    setCombo(0)
    setLives(prev => Math.max(0, prev - 1))
    setResults(prev => [...prev, { question, correct: false }])

    // Show negative popup animation
    setScorePopup('✗')
    setShowPopup(true)
    setTimeout(() => setShowPopup(false), 800)
  }

  // Start background music when component mounts
  useEffect(() => {
    startMusic()

    // Cleanup music when component unmounts
    return () => {
      stopMusic()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependencies - run only once on mount

  // Save score to local storage when time is up (only if score > 0)
  useEffect(() => {
    if (secondsLeft === 0) {
      stopMusic() // Stop music before navigation
      // Only save scores greater than zero to prevent empty games cluttering leaderboard
      if (score > 0) {
        try {
          const previousScores = JSON.parse(localStorage.getItem('scores') || '[]')
          localStorage.setItem(
            'scores',
            JSON.stringify([
              ...previousScores,
              {
                score,
                results,
                playerId: currentPlayer?.id,
                playerName: currentPlayer?.name,
              },
            ])
          )
        } catch (error) {
          console.error('Failed to save score to localStorage:', error)
          // Continue to results page even if save fails
        }
        // Navigate to results screen with game data
        navigate('/results', { state: { score, results } })
      } else {
        // Skip results screen for zero scores
        navigate('/home')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]) // Only depend on secondsLeft to prevent duplicate saves

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

        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>⏱️</span>
            <div>
              <div className={styles.statLabel}>Temps</div>
              <div className={styles.statValue}>{secondsLeft}s</div>
            </div>
          </div>

          <div className={styles.statItem}>
            <span className={styles.statIcon}>🏆</span>
            <div>
              <div className={styles.statLabel}>Score</div>
              <div className={styles.statValue}>{score}</div>
            </div>
          </div>
        </div>
      </div>

      <ProgressBar progress={progress} timeRemaining={secondsLeft} />

      <MultiplicationQuestion
        onCorrectAnswer={question => handleCorrectAnswer(question)}
        onBadAnswer={question => handleBadAnswer(question)}
        combo={combo}
        scorePopup={scorePopup}
        showPopup={showPopup}
      />

      <div className={styles.buttonGroup}>
        <button
          className={styles.pixelButton}
          onClick={() => {
            reset() // Reset the timer
            setScore(0) // Reset the score
            setResults([]) // Clear the results
            setCombo(0) // Reset combo
            setLives(3) // Reset lives
            startMusic() // Start new random music
          }}
        >
          ↻ Restart
        </button>
      </div>

      <div className={styles.livesDisplay}>
        {Array.from({ length: lives }, (_, i) => (
          <span key={i} className={styles.heart}>
            ❤️
          </span>
        ))}
      </div>

      <div className={styles.characterSprite}>🍄</div>
    </div>
  )
}
