import React, { useState, useEffect } from 'react'

interface MultiplicationQuestionProps {
  onCorrectAnswer: () => void // Callback when the user answers correctly
  onBadAnswer: () => void // Callback when the user answers incorrectly
}

const MultiplicationQuestion: React.FC<MultiplicationQuestionProps> = ({ onCorrectAnswer, onBadAnswer }) => {
  const [factorA, setFactorA] = useState(1)
  const [factorB, setFactorB] = useState(1)
  const [userAnswer, setUserAnswer] = useState('')

  // Generate a new question
  const generateNewQuestion = () => {
    setFactorA(Math.floor(Math.random() * 10) + 1) // Random number between 1 and 10
    setFactorB(Math.floor(Math.random() * 10) + 1)
    setUserAnswer('') // Reset the input field
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const correctAnswer = factorA * factorB
    if (parseInt(userAnswer) === correctAnswer) {
      onCorrectAnswer() // Notify parent component of the correct answer
      generateNewQuestion() // Generate a new question
    } else {
      onBadAnswer()
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
          onChange={(e) => setUserAnswer(e.target.value)}
          autoFocus
          required
          inputMode="numeric"
          pattern="[0-9]*"
          style={styles.input}
        />
        <button type="submit" style={styles.button}>✅ Validate</button>
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
    appearance: 'none', // Removes up/down selectors
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