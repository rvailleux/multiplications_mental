import { useState, useEffect, useRef, useCallback } from 'react'
import { useTimer } from '../hooks/useTimer'
import { useMusic } from '../contexts/MusicContext'
import { usePauseMenu } from '../hooks/usePauseMenu'
import { useNavigableOptions } from '../hooks/useNavigableOptions'
import { useAnswerFeedback } from '../hooks/useAnswerFeedback'
import AnswerFeedback from '../components/AnswerFeedback'
import ProgressBar from '../components/ProgressBar'
import Complement10Question from '../components/Complement10Question'
import type { Complement10Level } from '../components/Complement10Question'
import PauseMenu from '../components/PauseMenu'
import GameOverOverlay from '../components/GameOverOverlay'
import JumpingArrow from '../components/JumpingArrow'
import KeyboardHints from '../components/KeyboardHints'
import { useNavigate } from 'react-router-dom'
import { getCurrentPlayer } from '../types/player'
import PlayerNameDisplay from '../components/PlayerNameDisplay'
import type { GameEndReason } from '../types/score'
import { COMPLEMENT10_SCORES_KEY } from './Complement10HomePage'
import styles from './Complement10PlayPage.module.scss'

/**
 * Game result structure for the Complement-to-10 game
 * @public
 */
export type GameResult = {
  /** The complement question (e.g., "7 + ___ = 10") */
  question: string
  /** Whether the user answered correctly */
  correct: boolean
}

/**
 * Score threshold to unlock each difficulty level
 * - Level 1: 0 → complements to 10
 * - Level 2: 300 → complements to multiples of 10 (20–90)
 * - Level 3: 1200 → complements to 100
 */
const LEVEL_THRESHOLDS: Record<Complement10Level, number> = {
  1: 0,
  2: 300,
  3: 1200,
}

/**
 * Derive the current difficulty level from the player's score.
 * @param score - Current score
 * @returns Difficulty level (1, 2, or 3)
 */
function getLevelFromScore(score: number): Complement10Level {
  if (score >= LEVEL_THRESHOLDS[3]) return 3
  if (score >= LEVEL_THRESHOLDS[2]) return 2
  return 1
}

/**
 * Full game page for the "Compléments" (Complement-to-10) module.
 * 60-second timer · 3 lives · combo multiplier · progressive difficulty
 * Music plays during the game via MusicContext.
 *
 * @returns {JSX.Element} The complete complement game interface
 * @example
 * <Route path="/play/complement10" element={<Complement10PlayPage />} />
 */
export default function Complement10PlayPage() {
  const navigate = useNavigate()
  const currentPlayer = getCurrentPlayer()
  const totalTime = 60
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

  /** Current difficulty level derived from score */
  const level = getLevelFromScore(score)

  const formRef = useRef<HTMLFormElement>(null)

  /**
   * Submit answer handler — submits the current form
   */
  const handleSubmitAnswer = (): void => {
    if (formRef.current) {
      formRef.current.requestSubmit()
    }
  }

  /**
   * Core restart logic — resets all game state
   */
  const doRestart = (): void => {
    reset()
    setScore(0)
    setResults([])
    setCombo(0)
    setLives(3)
    setIsGameOver(false)
    setGameEndReason(null)
    playGameplayMusic()
  }

  /**
   * Saves current score to localStorage under the complement10 key.
   * Handles localStorage errors without blocking navigation.
   * @param endReason - Why the game ended
   */
  const saveScoreToStorage = useCallback(
    (endReason: GameEndReason): void => {
      if (score <= 0) return

      try {
        const previousScores = JSON.parse(localStorage.getItem(COMPLEMENT10_SCORES_KEY) || '[]')
        localStorage.setItem(
          COMPLEMENT10_SCORES_KEY,
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
        console.error('Failed to save complement10 score to localStorage:', error)
      }
    },
    [score, results, currentPlayer]
  )

  /**
   * Called when the game-over overlay animation completes.
   * Saves score and navigates to the results screen.
   */
  const handleGameOverComplete = useCallback((): void => {
    if (gameEndReason) {
      saveScoreToStorage(gameEndReason)
      navigate('/results', {
        state: { score, results, endReason: gameEndReason, gameModule: 'complement10' },
      })
    }
  }, [score, results, gameEndReason, navigate, saveScoreToStorage])

  const { selectedOption, navigateUp, navigateDown, executeSelectedOption, resetToDefault } =
    useNavigableOptions({
      options: ['valider', 'restart'] as const,
      defaultOption: 'valider',
      onValider: handleSubmitAnswer,
      onRestart: () => {
        doRestart()
      },
    })

  // Reset selection to "valider" after restart (when score/results clear)
  useEffect(() => {
    if (score === 0 && results.length === 0) {
      resetToDefault()
    }
  }, [score, results.length, resetToDefault])

  const pauseMenu = usePauseMenu({
    onQuit: () => {
      stopMusic()
      navigate('/complement10')
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
   */
  useEffect(() => {
    if (lives === 0 && !isGameOver) {
      setIsGameOver(true)
      setGameEndReason('lives_depleted')
      pause()
      stopMusic()
    }
  }, [lives, isGameOver, pause, stopMusic])

  /** Handle keyboard navigation */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (pauseMenu.state.isPaused) return

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

  const progress = ((totalTime - secondsLeft) / totalTime) * 100

  /**
   * Handles a correct answer
   * @param question - The question that was answered correctly
   */
  const handleCorrectAnswer = (question: string): void => {
    const newCombo = combo + 1
    const points = 100 * newCombo
    setScore(prev => prev + points)
    setCombo(newCombo)
    setResults(prev => [...prev, { question, correct: true }])
    playCorrect()
    setScorePopup(`+${points}`)
    setShowPopup(true)
    setTimeout(() => setShowPopup(false), 800)
  }

  /**
   * Handles an incorrect answer
   * @param question - The question that was answered incorrectly
   */
  const handleBadAnswer = (question: string): void => {
    setCombo(0)
    setLives(prev => Math.max(0, prev - 1))
    setResults(prev => [...prev, { question, correct: false }])
    playIncorrect()
    setScorePopup('✗')
    setShowPopup(true)
    setTimeout(() => setShowPopup(false), 800)
  }

  /** Start gameplay music on mount */
  useEffect(() => {
    playGameplayMusic()
    return () => {
      stopMusic()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Save score and navigate when timer runs out
  useEffect(() => {
    if (secondsLeft === 0 && !isGameOver) {
      stopMusic()
      const endReason: GameEndReason = 'timer_expired'
      if (score > 0) {
        saveScoreToStorage(endReason)
        navigate('/results', {
          state: { score, results, endReason, gameModule: 'complement10' },
        })
      } else {
        navigate('/complement10')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft])

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

      {/* Lives display */}
      <div className={styles.livesDisplay}>
        {Array.from({ length: lives }, (_, i) => (
          <span key={i} className={styles.heart}>
            ❤️
          </span>
        ))}
      </div>

      <ProgressBar progress={progress} timeRemaining={secondsLeft} />

      <Complement10Question
        onCorrectAnswer={question => handleCorrectAnswer(question)}
        onBadAnswer={question => handleBadAnswer(question)}
        combo={combo}
        scorePopup={scorePopup}
        showPopup={showPopup}
        showValiderArrow={selectedOption === 'valider'}
        formRef={formRef}
        level={level}
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

      <KeyboardHints screenId="complement10-play" />

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
          navigate('/complement10')
        }}
        onToggle={pauseMenu.toggleOption}
        onClose={() => {
          pauseMenu.closePauseMenu()
          resume()
        }}
      />

      <AnswerFeedback type={feedbackType} isVisible={isPlaying} />

      <GameOverOverlay
        isVisible={isGameOver && gameEndReason === 'lives_depleted'}
        onAnimationComplete={handleGameOverComplete}
      />
    </div>
  )
}
