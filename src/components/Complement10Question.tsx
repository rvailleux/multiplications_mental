import React, { useState, useEffect } from 'react'
import JumpingArrow from './JumpingArrow'
import styles from './Complement10Question.module.scss'

/**
 * Difficulty level for the Complement to 10 game.
 * Levels unlock as the player's score increases.
 * - 1: complement to 10 (numbers 1–9)
 * - 2: complement to multiples of 10 from 20 to 90
 * - 3: complement to 100 (numbers 1–99)
 * @public
 */
export type Complement10Level = 1 | 2 | 3

/**
 * Props for the Complement10Question component
 * @public
 */
export interface Complement10QuestionProps {
  /** Callback triggered when user provides the correct answer */
  onCorrectAnswer: (question: string) => void
  /** Callback triggered when user provides an incorrect answer */
  onBadAnswer: (question: string) => void
  /** Current combo count for multiplier display */
  combo?: number
  /** Score popup text to animate */
  scorePopup?: string
  /** Whether to show the score popup animation */
  showPopup?: boolean
  /** Whether to show the jumping arrow on the Valider button */
  showValiderArrow?: boolean
  /** Ref to the form element for programmatic submission */
  formRef?: React.RefObject<HTMLFormElement | null>
  /** Current difficulty level (derived from score by parent) */
  level?: Complement10Level
}

/**
 * Generate a question for the given difficulty level.
 * Returns `{ shown, target, answer }` where `shown + answer = target`.
 * @param level - Difficulty level
 * @returns Generated question data
 */
function generateQuestion(level: Complement10Level): { shown: number; target: number } {
  switch (level) {
    case 1: {
      // Complement to 10: shown is 1..9, target is 10
      const shown = Math.floor(Math.random() * 9) + 1
      return { shown, target: 10 }
    }
    case 2: {
      // Complement to a multiple of 10 between 20 and 90
      const target = (Math.floor(Math.random() * 8) + 2) * 10 // 20, 30, …, 90
      const shown = Math.floor(Math.random() * (target - 1)) + 1
      return { shown, target }
    }
    case 3: {
      // Complement to 100
      const shown = Math.floor(Math.random() * 99) + 1
      return { shown, target: 100 }
    }
  }
}

/**
 * Get the level badge label shown to the player.
 * @param level - Current difficulty level
 * @returns Human-readable level description
 */
function getLevelLabel(level: Complement10Level): string {
  switch (level) {
    case 1:
      return '🌱 à 10'
    case 2:
      return '🔥 aux dizaines'
    case 3:
      return '⚡ à 100'
  }
}

/**
 * Interactive question component for the "Complements" game.
 * Generates questions of the form `N + ___ = TARGET` and validates user input.
 *
 * @param props - Component properties
 * @returns {JSX.Element} The question interface
 *
 * @example
 * ```tsx
 * <Complement10Question
 *   onCorrectAnswer={(q) => handleCorrect(q)}
 *   onBadAnswer={(q) => handleBad(q)}
 *   level={1}
 * />
 * ```
 */
const Complement10Question: React.FC<Complement10QuestionProps> = ({
  onCorrectAnswer,
  onBadAnswer,
  combo = 0,
  scorePopup = '',
  showPopup = false,
  showValiderArrow = true,
  formRef,
  level = 1,
}) => {
  const [shown, setShown] = useState(1)
  const [target, setTarget] = useState(10)
  const [userAnswer, setUserAnswer] = useState('')

  /**
   * Generates a new question using the current level and clears user input.
   */
  const generateNewQuestion = (): void => {
    const q = generateQuestion(level)
    setShown(q.shown)
    setTarget(q.target)
    setUserAnswer('')
  }

  /**
   * Handles form submission, validates the answer, and triggers the appropriate callback.
   * @param e - Form submission event
   */
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    const correctAnswer = target - shown
    const questionLabel = `${shown} + ___ = ${target}`
    if (parseInt(userAnswer) === correctAnswer) {
      onCorrectAnswer(questionLabel)
      generateNewQuestion()
    } else {
      onBadAnswer(questionLabel)
    }
  }

  // Generate the first question when the component mounts or the level changes
  useEffect(() => {
    generateNewQuestion()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level])

  const getComboClass = (): string => {
    const classes = [styles.comboDisplay]
    if (combo > 1) classes.push(styles.shake)
    return classes.join(' ')
  }

  const getScorePopupClass = (): string => {
    const classes = [styles.scorePopup]
    if (showPopup) classes.push(styles.show)
    if (scorePopup.includes('✗')) {
      classes.push(styles.incorrect)
    } else {
      classes.push(styles.correct)
    }
    return classes.join(' ')
  }

  return (
    <>
      {/* Level badge */}
      <div className={styles.levelBadge}>{getLevelLabel(level)}</div>

      {/* Combo Display */}
      {combo > 1 && <div className={getComboClass()}>🔥 COMBO x{combo} 🔥</div>}

      {/* Question Area */}
      <div className={styles.questionArea}>
        <div className={styles.questionText}>
          {shown} + ___ = {target}
        </div>
        <form onSubmit={handleSubmit} className={styles.form} ref={formRef}>
          <input
            type="number"
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            className={styles.answerInput}
            autoFocus
            required
            inputMode="numeric"
            min={0}
            placeholder="?"
            maxLength={4}
          />
          <button
            type="submit"
            className={`${styles.pixelButton} ${showValiderArrow ? styles.pixelButtonSelected : ''}`}
          >
            <JumpingArrow visible={showValiderArrow} />✓ Valider
          </button>
        </form>

        {/* Score Popup */}
        <div className={getScorePopupClass()}>{scorePopup}</div>
      </div>
    </>
  )
}

export default Complement10Question
