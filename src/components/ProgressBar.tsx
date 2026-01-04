import React from 'react'

/**
 * Props for the ProgressBar component
 * @public
 */
export interface ProgressBarProps {
  /** Progress value between 0 and 100 representing completion percentage */
  progress: number
  /** Time remaining in seconds for color and animation logic */
  timeRemaining?: number
}

/**
 * Pixel art style progress bar with time-based color indicators and animations
 * @param {ProgressBarProps} props - Component properties
 * @param {number} props.progress - Progress percentage (0-100)
 * @param {number} props.timeRemaining - Time remaining in seconds for color logic
 * @returns {JSX.Element} Retro style progress bar with dynamic colors and animations
 * @example
 * <ProgressBar progress={75} timeRemaining={30} />  // Green progress bar
 * <ProgressBar progress={90} timeRemaining={8} />   // Orange blinking bar
 * <ProgressBar progress={95} timeRemaining={3} />   // Red flashing bar
 */
const ProgressBar: React.FC<ProgressBarProps> = ({ progress, timeRemaining = 60 }) => {
  // Determine color and animation based on time remaining
  const getProgressStyle = () => {
    let backgroundColor = 'linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)' // Green default
    let animation = 'none'

    if (timeRemaining <= 5) {
      // Red flashing for last 5 seconds
      backgroundColor = 'linear-gradient(90deg, #f44336 0%, #e57373 100%)'
      animation = 'flashRed 0.5s infinite'
    } else if (timeRemaining <= 10) {
      // Orange blinking for last 10 seconds
      backgroundColor = 'linear-gradient(90deg, #ff9800 0%, #ffb74d 100%)'
      animation = 'blinkOrange 1s infinite'
    }

    return {
      ...styles.progressFill,
      width: `${progress}%`,
      background: backgroundColor,
      animation,
    }
  }

  return (
    <>
      <div style={styles.progressBar}>
        <div style={getProgressStyle()} />
      </div>
      <style>
        {`
          @keyframes blinkOrange {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
          @keyframes flashRed {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.02); }
          }
        `}
      </style>
    </>
  )
}

const styles = {
  progressBar: {
    background: '#000',
    border: '4px solid #000',
    height: '30px',
    marginBottom: '20px',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    width: '100%',
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.3s ease, background 0.3s ease',
    position: 'relative' as const,
    backgroundImage: `repeating-linear-gradient(
      90deg,
      transparent 0px,
      transparent 8px,
      rgba(255,255,255,0.3) 8px,
      rgba(255,255,255,0.3) 16px
    )`,
  },
}

export default ProgressBar
