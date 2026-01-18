import { useState, useEffect } from 'react'
import { useTimer } from '../hooks/useTimer'
import { useBackgroundMusic } from '../hooks/useBackgroundMusic'
import ProgressBar from '../components/ProgressBar'
import MultiplicationQuestion from '../components/MultiplicationQuestion'
import { useNavigate } from 'react-router-dom'
import { getCurrentPlayer } from '../types/player'
import PlayerNameDisplay from '../components/PlayerNameDisplay'

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
    <div style={styles.gameContainer}>
      <PlayerNameDisplay player={currentPlayer} />
      <div style={styles.clouds}>
        <div style={styles.cloud}>☁️</div>
        <div style={styles.cloud}>☁️</div>
        <div style={styles.cloud}>☁️</div>
      </div>

      <div style={styles.gameHeader}>
        <h1 style={styles.gameTitle}>⭐ MATH QUEST ⭐</h1>

        <div style={styles.statsBar}>
          <div style={styles.statItem}>
            <span style={styles.statIcon}>⏱️</span>
            <div>
              <div style={styles.statLabel}>Temps</div>
              <div style={styles.statValue}>{secondsLeft}s</div>
            </div>
          </div>

          <div style={styles.statItem}>
            <span style={styles.statIcon}>🏆</span>
            <div>
              <div style={styles.statLabel}>Score</div>
              <div style={styles.statValue}>{score}</div>
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

      <div style={styles.buttonGroup}>
        <button
          style={styles.pixelButton}
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

      <div style={styles.livesDisplay}>
        {Array.from({ length: lives }, (_, i) => (
          <span key={i} style={styles.heart}>
            ❤️
          </span>
        ))}
      </div>

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
  },
  gameTitle: {
    color: '#fff',
    textAlign: 'center' as const,
    fontSize: '20px',
    textShadow: `
      4px 4px 0 #000,
      -2px -2px 0 #000
    `,
    marginBottom: '20px',
    letterSpacing: '2px',
  },
  statsBar: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
  },
  statItem: {
    background: '#000',
    padding: '10px 15px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1,
  },
  statIcon: {
    fontSize: '20px',
  },
  statValue: {
    color: '#ffd700',
    fontSize: '14px',
  },
  statLabel: {
    color: '#fff',
    fontSize: '10px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    marginBottom: '25px',
  },
  pixelButton: {
    background: 'linear-gradient(180deg, #3498db 0%, #2980b9 100%)',
    color: '#fff',
    fontSize: '14px',
    padding: '18px 30px',
    border: '4px solid #000',
    cursor: 'pointer',
    position: 'relative' as const,
    transition: 'all 0.1s',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    boxShadow: '0 6px 0 #000',
  },
  livesDisplay: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '20px',
  },
  heart: {
    fontSize: '32px',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  characterSprite: {
    position: 'absolute' as const,
    bottom: '-50px',
    right: '20px',
    fontSize: '64px',
    animation: 'bounce 1s ease-in-out infinite',
  },
}
