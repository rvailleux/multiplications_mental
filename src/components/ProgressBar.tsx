import React from 'react'

interface ProgressBarProps {
  progress: number // Progress value between 0 and 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div style={styles.container}>
      <div style={{ ...styles.bar, width: `${progress}%` }} />
    </div>
  )
}



const styles = {
  container: {
    width: '100%',
    height: '5px', // Thin height
    backgroundColor: '#e0e0e0', // Light gray background
    position: 'fixed', // Sticks to the top
    top: 0,
    left: 0,
    zIndex: 1000, // Ensures it stays on top
  },
  bar: {
    height: '100%',
    backgroundColor: '#4285f4', // Blue color for the progress
    transition: 'width 0.2s ease-in-out', // Smooth transition
  },
}

export default ProgressBar