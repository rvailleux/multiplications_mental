import React, { useState, useEffect } from 'react'
import JumpingArrow from './JumpingArrow'
import styles from './MultiplicationQuestion.module.scss'

/**
 * Props for the MultiplicationQuestion component
 * @public
 */
export interface MultiplicationQuestionProps {
  /** Callback function triggered when user provides correct answer */
  onCorrectAnswer: (question: string) => void
  /** Callback function triggered when user provides incorrect answer */
  onBadAnswer: (question: string) => void
  /** Current combo count for score multiplier display */
  combo?: number
  /** Score popup text to display */
  scorePopup?: string
  /** Whether to show score popup animation */
  showPopup?: boolean
  /** Whether to show jumping arrow next to Valider button */
  showValiderArrow?: boolean
  /** Optional ref to the form element for programmatic submission */
  formRef?: React.RefObject<HTMLFormElement | null>
}

/**
 * Interactive multiplication question component that generates random problems and validates user answers
 * @param {MultiplicationQuestionProps} props - Component properties
 * @param {Function} props.onCorrectAnswer - Callback for correct answers, receives question string
 * @param {Function} props.onBadAnswer - Callback for incorrect answers, receives question string
 * @returns {JSX.Element} Rendered multiplication question interface
 * @example
 * <MultiplicationQuestion
 *   onCorrectAnswer={(q) => setScore(score + 1)}
 *   onBadAnswer={(q) => console.log(`Wrong: ${q}`)}
 * />
 */
const MultiplicationQuestion: React.FC<MultiplicationQuestionProps> = ({
  onCorrectAnswer,
  onBadAnswer,
  combo = 0,
  scorePopup = '',
  showPopup = false,
  showValiderArrow = true,
  formRef,
}) => {
  const [factorA, setFactorA] = useState(1)
  const [factorB, setFactorB] = useState(1)
  const [userAnswer, setUserAnswer] = useState('')

  /**
   * Generates a new multiplication question with random factors (1-10) and clears user input
   */
  const generateNewQuestion = () => {
    setFactorA(Math.floor(Math.random() * 10) + 1) // Random number between 1 and 10
    setFactorB(Math.floor(Math.random() * 10) + 1)
    setUserAnswer('') // Reset the input field
  }

  /**
   * Handles form submission, validates user answer, and triggers appropriate callbacks
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const correctAnswer = factorA * factorB
    if (parseInt(userAnswer) === correctAnswer) {
      onCorrectAnswer(`${factorA} x ${factorB}`) // Notify parent component of the correct answer
      generateNewQuestion() // Generate a new question
    } else {
      onBadAnswer(`${factorA} x ${factorB}`) // Notify parent component of the incorrect answer
    }
  }

  // Generate the first question on component mount
  useEffect(() => {
    generateNewQuestion()
  }, [])

  const getComboClass = () => {
    const classes = [styles.comboDisplay]
    if (combo > 1) classes.push(styles.shake)
    return classes.join(' ')
  }

  const getScorePopupClass = () => {
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
      {/* Combo Display */}
      {combo > 1 && <div className={getComboClass()}>🔥 COMBO x{combo} 🔥</div>}

      {/* Question Area */}
      <div className={styles.questionArea}>
        <div className={styles.questionText}>
          {factorA} x {factorB}?
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
            pattern="[0-9]*"
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

export default MultiplicationQuestion
