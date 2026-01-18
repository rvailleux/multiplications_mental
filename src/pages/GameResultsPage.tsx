import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import PlayerNameDisplay from '../components/PlayerNameDisplay'
import { getCurrentPlayer } from '../types/player'
import type { GameResult } from './PlayPage'

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

  // Styles
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)',
    padding: '20px',
    position: 'relative',
    animation: isBlinking ? 'goldFadingBlink 2s ease-in-out infinite' : 'none',
  }

  const cardStyles: React.CSSProperties = {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    border: '8px solid #000',
    borderRadius: '0',
    padding: '40px',
    maxWidth: '600px',
    width: '100%',
    boxShadow: '12px 12px 0 rgba(0, 0, 0, 0.5)',
    color: '#ffd700',
    textAlign: 'center',
  }

  const headingStyles: React.CSSProperties = {
    fontSize: '48px',
    marginBottom: '30px',
    textTransform: 'uppercase',
    letterSpacing: '4px',
    textShadow: '4px 4px 0 rgba(0, 0, 0, 0.5)',
  }

  const statStyles: React.CSSProperties = {
    fontSize: '32px',
    margin: '20px 0',
    color: '#fff',
  }

  const scoreStyles: React.CSSProperties = {
    fontSize: '64px',
    fontWeight: 'bold',
    margin: '30px 0',
    color: '#ffd700',
    textShadow: '6px 6px 0 rgba(0, 0, 0, 0.5)',
  }

  const buttonStyles: React.CSSProperties = {
    marginTop: '40px',
    padding: '20px 40px',
    fontSize: '24px',
    fontWeight: 'bold',
    backgroundColor: '#ffd700',
    color: '#000',
    border: '4px solid #000',
    borderRadius: '0',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    transition: 'transform 0.1s',
    boxShadow: '6px 6px 0 rgba(0, 0, 0, 0.3)',
  }

  return (
    <div style={containerStyles}>
      <PlayerNameDisplay player={currentPlayer} />

      <div style={cardStyles}>
        <h1 style={headingStyles}>Game Over!</h1>

        <div style={scoreStyles}>{score}</div>

        <div style={statStyles}>
          Correct: {correctCount}/{totalQuestions}
        </div>

        <div style={statStyles}>Accuracy: {accuracy}%</div>

        <div style={statStyles}>Speed: {speed}</div>

        <button
          onClick={() => navigate('/home')}
          style={buttonStyles}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
