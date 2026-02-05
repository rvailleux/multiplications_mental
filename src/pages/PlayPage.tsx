import { useState, useEffect, useRef, useCallback } from 'react'
import { useTimer } from '../hooks/useTimer'
import { useMusic } from '../contexts/MusicContext'
import { usePauseMenu } from '../hooks/usePauseMenu'
import { useNavigableOptions } from '../hooks/useNavigableOptions'
import { useAnswerFeedback } from '../hooks/useAnswerFeedback'
import AnswerFeedback from '../components/AnswerFeedback'
import ProgressBar from '../components/ProgressBar'
import MultiplicationQuestion from '../components/MultiplicationQuestion'
import PauseMenu from '../components/PauseMenu'
import GameOverOverlay from '../components/GameOverOverlay'
import JumpingArrow from '../components/JumpingArrow'
import KeyboardHints from '../components/KeyboardHints'
import { useNavigate } from 'react-router-dom'
import { getCurrentPlayer } from '../types/player'
import PlayerNameDisplay from '../components/PlayerNameDisplay'
import type { GameEndReason } from '../types/score'
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
  const { secondsLeft, reset, pause, resume } = useTimer(totalTime)
  const { playGameplayMusic, stopMusic } = useMusic()
  const { playCorrect, playIncorrect, isPlaying, feedbackType } = useAnswerFeedback()
  const [score, setScore] = useState(0)
  const [results, setResults] = useState<GameResult[]>([])
  const [combo, setCombo] = useState(0)
  const [scorePopup, setScorePopup] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [lives, setLives] = useState(3)
  const [isGameOver, setIsGameOver] = useState(false)
  const [gameEndReason, setGameEndReason] = useState<GameEndReason | null>(null)

  // Ref for form submission (allows Enter key to submit when Valider is selected)
  const formRef = useRef<HTMLFormElement>(null)

  /**
   * Submit answer handler - submits the current form
   * @returns void
   */
  const handleSubmitAnswer = (): void => {
    if (formRef.current) {
      formRef.current.requestSubmit()
    }
  }

  /**
   * Core restart logic - resets all game state
   * @returns void
   */
  const doRestart = (): void => {
    reset() // Reset the timer
    setScore(0) // Reset the score
    setResults([]) // Clear the results
    setCombo(0) // Reset combo
    setLives(3) // Reset lives
    setIsGameOver(false) // Clear game over state
    setGameEndReason(null) // Clear end reason
    playGameplayMusic() // Start new random gameplay music (never main theme)
  }

  /**
   * Saves current score to localStorage with player info and end reason
   * Handles localStorage errors gracefully without blocking navigation
   * @param endReason - The reason the game ended
   */
  const saveScoreToStorage = useCallback(
    (endReason: GameEndReason): void => {
      if (score <= 0) return // Don't save zero scores

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
              endReason,
            },
          ])
        )
      } catch (error) {
        console.error('Failed to save score to localStorage:', error)
        // Continue to results page even if save fails
      }
    },
    [score, results, currentPlayer]
  )

  /**
   * Handler called when game over overlay animation completes
   * Saves score and navigates to results page
   */
  const handleGameOverComplete = useCallback((): void => {
    if (gameEndReason) {
      saveScoreToStorage(gameEndReason)
      navigate('/results', { state: { score, results, endReason: gameEndReason } })
    }
  }, [score, results, gameEndReason, navigate, saveScoreToStorage])

  // Setup navigable options for Valider/Restart selection
  const { selectedOption, navigateUp, navigateDown, executeSelectedOption, resetToDefault } =
    useNavigableOptions({
      options: ['valider', 'restart'] as const,
      defaultOption: 'valider',
      onValider: handleSubmitAnswer,
      onRestart: () => {
        doRestart()
        // Note: resetToDefault is called after via useEffect below
      },
    })

  // Reset selection to default after restart to prevent Enter from re-triggering restart
  useEffect(() => {
    // When score resets to 0 and results are empty (restart condition), reset selection
    if (score === 0 && results.length === 0) {
      resetToDefault()
    }
  }, [score, results.length, resetToDefault])

  // Setup pause menu
  const pauseMenu = usePauseMenu({
    onQuit: () => {
      stopMusic()
      navigate('/home')
    },
    onContinue: () => {
      resume()
    },
  })

  /** Redirect to player selection if no player is selected */
  useEffect(() => {
    if (!currentPlayer) {
      navigate('/')
    }
  }, [currentPlayer, navigate])

  /**
   * Detect game over when all lives are lost
   * Triggers game-over overlay and stops timer/music
   */
  useEffect(() => {
    if (lives === 0 && !isGameOver) {
      setIsGameOver(true)
      setGameEndReason('lives_depleted')
      pause() // Stop the timer
      stopMusic() // Stop gameplay music
    }
  }, [lives, isGameOver, pause, stopMusic])

  /** Handle keyboard navigation: ESC for pause, Arrow keys for option navigation */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      // Don't handle keys when pause menu is open
      if (pauseMenu.state.isPaused) {
        return
      }

      if (e.key === 'Escape') {
        e.preventDefault()
        pause()
        pauseMenu.openPauseMenu()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        navigateUp()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        navigateDown()
      } else if (e.key === 'Enter') {
        e.preventDefault()
        executeSelectedOption()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [pauseMenu.state.isPaused, pause, navigateUp, navigateDown, executeSelectedOption])

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

    // Play audio feedback for correct answer
    playCorrect()

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

    // Play audio feedback for incorrect answer
    playIncorrect()

    // Show negative popup animation
    setScorePopup('✗')
    setShowPopup(true)
    setTimeout(() => setShowPopup(false), 800)
  }

  /**
   * Start gameplay music when component mounts
   * Uses MusicContext to play random track (excludes main theme)
   */
  useEffect(() => {
    playGameplayMusic()

    // Cleanup music when component unmounts (let results page or home handle transition)
    return () => {
      stopMusic()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependencies - run only once on mount

  // Save score to local storage when time is up (only if score > 0)
  useEffect(() => {
    // Skip if game already over (lives depleted handles its own navigation)
    if (secondsLeft === 0 && !isGameOver) {
      stopMusic() // Stop music before navigation
      const endReason: GameEndReason = 'timer_expired'
      // Only save scores greater than zero to prevent empty games cluttering leaderboard
      if (score > 0) {
        saveScoreToStorage(endReason)
        // Navigate to results screen with game data including end reason
        navigate('/results', { state: { score, results, endReason } })
      } else {
        // Skip results screen for zero scores
        navigate('/home')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]) // Only depend on secondsLeft to prevent duplicate saves

  return (
    <div className={styles.gameContainer}>
      <PlayerNameDisplay player={currentPlayer} onClick={() => navigate('/')} />
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

      {/* Lives display - positioned between header and progress bar */}
      <div className={styles.livesDisplay}>
        {Array.from({ length: lives }, (_, i) => (
          <span key={i} className={styles.heart}>
            ❤️
          </span>
        ))}
      </div>

      <ProgressBar progress={progress} timeRemaining={secondsLeft} />

      <MultiplicationQuestion
        onCorrectAnswer={question => handleCorrectAnswer(question)}
        onBadAnswer={question => handleBadAnswer(question)}
        combo={combo}
        scorePopup={scorePopup}
        showPopup={showPopup}
        showValiderArrow={selectedOption === 'valider'}
        formRef={formRef}
      />

      <div className={styles.buttonGroup}>
        <button
          className={`${styles.pixelButton} ${selectedOption === 'restart' ? styles.pixelButtonSelected : ''}`}
          onClick={() => {
            doRestart()
            resetToDefault()
          }}
        >
          <JumpingArrow visible={selectedOption === 'restart'} />↻ Restart
        </button>
      </div>

      <div className={styles.characterSprite}>🍄</div>

      <KeyboardHints screenId="play" />

      <PauseMenu
        isPaused={pauseMenu.state.isPaused}
        selectedOption={pauseMenu.state.selectedOption}
        onContinue={() => {
          pauseMenu.closePauseMenu()
          resume()
        }}
        onQuit={() => {
          pauseMenu.closePauseMenu()
          stopMusic()
          navigate('/home')
        }}
        onToggle={pauseMenu.toggleOption}
        onClose={() => {
          pauseMenu.closePauseMenu()
          resume()
        }}
      />

      {/* Visual feedback overlay for answer feedback */}
      <AnswerFeedback type={feedbackType} isVisible={isPlaying} />

      {/* Game over overlay when all lives are lost */}
      <GameOverOverlay
        isVisible={isGameOver && gameEndReason === 'lives_depleted'}
        onAnimationComplete={handleGameOverComplete}
      />
    </div>
  )
}
