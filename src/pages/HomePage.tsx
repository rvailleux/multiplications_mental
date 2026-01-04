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
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Mental Maths!</h1>
      <button style={styles.startButton} onClick={() => navigate('/play')}>
        🚀 Start Game
      </button>
      <h2 style={styles.subtitle}>Previous Scores:</h2>
      <ul style={styles.scoreList}>
        {visibleScores.map((entry: { score: number }, index: number) => (
          <li key={index} style={styles.scoreItem}>
            Game {scores.length - index}: {entry.score} points
          </li>
        ))}
      </ul>
      {scores.length > 5 && !showAll && (
        <button style={styles.expandButton} onClick={() => setShowAll(true)}>
          ...
        </button>
      )}
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f8ff',
    padding: '20px',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold' as const,
    color: '#333',
  },
  startButton: {
    marginTop: '20px',
    padding: '15px 30px',
    fontSize: '1.5rem',
    fontWeight: 'bold' as const,
    color: '#fff',
    backgroundColor: '#4caf50',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  subtitle: {
    marginTop: '30px',
    fontSize: '2rem',
    color: '#555',
  },
  scoreList: {
    listStyleType: 'none' as const,
    padding: 0,
  },
  scoreItem: {
    fontSize: '1.5rem',
    color: '#333',
  },
  expandButton: {
    marginTop: '10px',
    padding: '5px 10px',
    fontSize: '1rem',
    fontWeight: 'bold' as const,
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
}
