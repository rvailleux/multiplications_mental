import React, { useState, useEffect } from 'react'
import { useTimer } from '../hooks/useTimer'
import ProgressBar from '../components/ProgressBar'
import MultiplicationQuestion from '../components/MultiplicationQuestion'
import { useNavigate } from 'react-router-dom'

export default function PlayPage() {
  const navigate = useNavigate()
  const totalTime = 60 // Total time in seconds
  const { secondsLeft, reset } = useTimer(totalTime)
  const [score, setScore] = useState(0)
  const [results, setResults] = useState<{ question: string; correct: boolean }[]>([])

  // Calculate progress percentage
  const progress = ((totalTime - secondsLeft) / totalTime) * 100

  // Handle correct answer
  const handleCorrectAnswer = (question: string) => {
    setScore((prev) => prev + 1)
    setResults((prev) => [...prev, { question, correct: true }])
  }

  // Handle incorrect answer
  const handleBadAnswer = (question: string) => {
    setResults((prev) => [...prev, { question, correct: false }])
  }

  // Save score to local storage when time is up
  useEffect(() => {
    if (secondsLeft === 0) {
      const previousScores = JSON.parse(localStorage.getItem('scores') || '[]')
      localStorage.setItem('scores', JSON.stringify([...previousScores, { score, results }]))
      navigate('/') // Redirect to home page
    }
  }, [secondsLeft, score, results, navigate])

  return (
    <div style={styles.container}>
      <ProgressBar progress={progress} />
      <p style={styles.timer}>⏳ Time Left: {secondsLeft}s</p>
      <p style={styles.score}>🏆 Score: {score}</p>
      <MultiplicationQuestion
        onCorrectAnswer={(question) => handleCorrectAnswer(question)}
        onBadAnswer={(question) => handleBadAnswer(question)}
      />
      <button
        style={styles.resetButton}
        onClick={() => {
          reset() // Reset the timer
          setScore(0) // Reset the score
          setResults([]) // Clear the results
        }}
      >
        🔄 Restart
      </button>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    textAlign: 'center' as const,
    backgroundColor: '#f0f8ff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  timer: {
    fontSize: '2rem',
    fontWeight: 'bold' as const,
    color: '#ff4500',
    margin: '0px',
  },
  score: {
    fontSize: '2.5rem',
    fontWeight: 'bold' as const,
    color: '#32cd32',
    margin: '0px',
  },
  resetButton: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '1.5rem',
    fontWeight: 'bold' as const,
    color: '#fff',
    backgroundColor: '#1e90ff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
}