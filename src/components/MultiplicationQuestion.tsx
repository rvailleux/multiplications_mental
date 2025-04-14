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
    <div>
      <p>
        What is {factorA} x {factorB}?
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          autoFocus
          required
          inputMode="numeric"
          pattern="[0-9]*"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default MultiplicationQuestion