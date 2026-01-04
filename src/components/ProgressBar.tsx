import React from 'react'
import { CSSProperties } from 'react'

/**
 * Props for the ProgressBar component
 * @public
 */
export interface ProgressBarProps {
  /** Progress value between 0 and 100 representing completion percentage */
  progress: number
}

/**
 * Fixed position progress bar that shows game completion progress with visual alerts
 * @param {ProgressBarProps} props - Component properties
 * @param {number} props.progress - Progress percentage (0-100), triggers orange blinking at ≥80%
 * @returns {JSX.Element} Fixed progress bar at top of screen
 * @example
 * <ProgressBar progress={75} />  // Blue progress bar
 * <ProgressBar progress={85} />  // Orange blinking progress bar
 */
const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const isBlinking = progress >= 80

  return (
    <div style={styles.container as CSSProperties}>
      <div
        style={{
          ...styles.bar,
          width: `${progress}%`,
          backgroundColor: isBlinking ? '#ffa500' : '#4285f4', // Orange when blinking
          animation: isBlinking ? 'blink 1s infinite' : 'none', // Apply blinking animation
        }}
      />
      <style>
        {`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  )
}

const styles = {
  container: {
    width: '100%',
    height: '10px', // Slightly thicker for better visibility
    backgroundColor: '#e0e0e0', // Light gray background
    position: 'fixed', // Sticks to the top
    top: 0,
    left: 0,
    zIndex: 1000, // Ensures it stays on top
  },
  bar: {
    height: '100%',
    transition: 'width 0.2s ease-in-out', // Smooth transition
  },
}

export default ProgressBar
