import React, { useState } from 'react'
import { useTimer } from '../hooks/useTimer'
import ProgressBar from '../components/ProgressBar'
import MultiplicationQuestion from '../components/MultiplicationQuestion'

export default function PlayPage() {
  const totalTime = 60 // Total time in seconds
  const { secondsLeft, reset } = useTimer(totalTime)
  const [score, setScore] = useState(0)

  // Calculate progress percentage
  const progress = ((totalTime - secondsLeft) / totalTime) * 100

  // Handle correct answer
  const handleCorrectAnswer = () => {
     setScore(score + 1) // Increment the score
  }

  // Handle incorrect answer   
  const handleBadAnswer = () => {
    // Blink the screen in red
    const body = document.body;
    body.style.backgroundColor = 'red';
    setTimeout(() => {
      body.style.backgroundColor = '';
    }, 200);
  }
  

  return (
    <div>
      <ProgressBar progress={progress} />
      <h1>Multiplication Challenge</h1>
      <p>Time Left: {secondsLeft}s</p>
      <p>Score: {score}</p>
      <MultiplicationQuestion onCorrectAnswer={handleCorrectAnswer} onBadAnswer={handleBadAnswer} />
    </div>
  )
}