import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
export default function HomePage() {
  const navigate = useNavigate()
  /** Load and reverse score history from localStorage to show newest first */
  const scores: ScoreEntry[] = JSON.parse(localStorage.getItem('scores') || '[]').reverse()
  const [showAll, setShowAll] = useState(false)

  /** Determine which scores to display based on showAll state */
  const visibleScores = showAll ? scores : scores.slice(0, 5)

  return (
    <div style={styles.gameContainer}>
      <div style={styles.clouds}>
        <div style={styles.cloud}>☁️</div>
        <div style={styles.cloud}>☁️</div>
        <div style={styles.cloud}>☁️</div>
      </div>

      <div style={styles.gameHeader}>
        <h1 style={styles.gameTitle}>⭐ MATH QUEST ⭐</h1>
        <div style={styles.subtitle}>Welcome to Mental Maths!</div>
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
            {visibleScores.map((entry: { score: number }, index: number) => (
              <div key={index} style={styles.scoreCard}>
                <span style={styles.scoreNumber}>#{scores.length - index}</span>
                <span style={styles.scoreValue}>{entry.score} pts</span>
              </div>
            ))}
          </div>
          {scores.length > 5 && !showAll && (
            <button style={styles.expandButton} onClick={() => setShowAll(true)}>
              Show More...
            </button>
          )}
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
    maxHeight: '200px',
    overflowY: 'auto' as const,
  },
  scoreCard: {
    background: 'linear-gradient(180deg, #87ceeb 0%, #fff 100%)',
    border: '4px solid #000',
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.5)',
  },
  scoreNumber: {
    fontSize: '14px',
    color: '#000',
    fontWeight: 'bold' as const,
  },
  scoreValue: {
    fontSize: '14px',
    color: '#ffd700',
    textShadow: '2px 2px 0 #000',
  },
  expandButton: {
    background: 'linear-gradient(180deg, #3498db 0%, #2980b9 100%)',
    color: '#fff',
    fontSize: '12px',
    padding: '10px 20px',
    border: '4px solid #000',
    cursor: 'pointer',
    boxShadow: '0 4px 0 #000',
  },
  characterSprite: {
    position: 'absolute' as const,
    bottom: '-50px',
    right: '20px',
    fontSize: '64px',
    animation: 'bounce 1s ease-in-out infinite',
  },
}
