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
    <div style={styles.container}>
      <p style={styles.question}>
        {factorA} x {factorB}?
      </p>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="number"
          value={userAnswer}
          onChange={e => setUserAnswer(e.target.value)}
          autoFocus
          required
          inputMode="numeric"
          pattern="[0-9]*"
        />
        <button type="submit" style={styles.button}>
          ✅ Validate
        </button>
      </form>
    </div>
  )
}

const styles = {
  container: {
    textAlign: 'center' as const,
    margin: '0 0',
  },
  question: {
    fontSize: '3rem',
    fontWeight: 'bold' as const,
    color: '#333',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  input: {
    fontSize: '2rem',
    padding: '10px',
    width: '100px',
    textAlign: 'center' as const,
    border: '2px solid #ccc',
    borderRadius: '5px',
    outline: 'none',
    appearance: 'none' as const, // Removes up/down selectors
    MozAppearance: 'textfield', // Removes selectors in Firefox
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '1.5rem',
    fontWeight: 'bold' as const,
    color: '#fff',
    backgroundColor: '#4caf50',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
}

export default MultiplicationQuestion
