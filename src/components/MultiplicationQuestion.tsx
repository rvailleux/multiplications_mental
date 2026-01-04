import React, { useState, useEffect } from 'react'

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

  return (
    <>
      {/* Combo Display */}
      {combo > 1 && (
        <div
          style={{
            ...styles.comboDisplay,
            animation: combo > 1 ? 'comboShake 0.5s ease' : 'none',
          }}
        >
          🔥 COMBO x{combo} 🔥
        </div>
      )}

      {/* Question Area */}
      <div style={styles.questionArea}>
        <div style={styles.questionText}>
          {factorA} x {factorB}?
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="number"
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            style={styles.answerInput}
            autoFocus
            required
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="?"
            maxLength={4}
          />
          <button type="submit" style={styles.pixelButton}>
            ✓ Valider
          </button>
        </form>

        {/* Score Popup */}
        <div
          style={{
            ...styles.scorePopup,
            animation: showPopup ? 'scorePopup 0.8s ease-out' : 'none',
            color: scorePopup.includes('✗') ? '#ff6b6b' : '#4ecdc4',
          }}
        >
          {scorePopup}
        </div>
      </div>
    </>
  )
}

const styles = {
  comboDisplay: {
    textAlign: 'center' as const,
    marginBottom: '15px',
    color: '#ff6b6b',
    fontSize: '12px',
    minHeight: '20px',
  },
  questionArea: {
    background: 'linear-gradient(180deg, #87ceeb 0%, #fff 100%)',
    border: '6px solid #000',
    padding: '40px',
    marginBottom: '25px',
    textAlign: 'center' as const,
    position: 'relative' as const,
    boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.5)',
  },
  questionText: {
    fontSize: '42px',
    color: '#000',
    textShadow: '3px 3px 0 rgba(255,255,255,0.8)',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '20px',
  },
  answerInput: {
    width: '200px',
    height: '60px',
    fontSize: '28px',
    textAlign: 'center' as const,
    border: '4px solid #000',
    background: '#fff',
    boxShadow: 'inset 0 4px 0 rgba(0,0,0,0.1)',
    outline: 'none',
    transition: 'all 0.2s',
  },
  pixelButton: {
    background: 'linear-gradient(180deg, #4ecdc4 0%, #44b3aa 100%)',
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
  scorePopup: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '48px',
    fontWeight: 'bold' as const,
    opacity: 0,
    pointerEvents: 'none' as const,
    zIndex: 100,
  },
}

export default MultiplicationQuestion
