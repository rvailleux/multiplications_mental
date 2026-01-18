import React from 'react'
import styles from './ProgressBar.module.scss'

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
  // Determine color class based on time remaining
  const getProgressClass = () => {
    const baseClasses = [styles.progressFill]

    if (timeRemaining <= 5) {
      // Red flashing for last 5 seconds
      baseClasses.push(styles.progressRed)
    } else if (timeRemaining <= 10) {
      // Orange blinking for last 10 seconds
      baseClasses.push(styles.progressOrange)
    } else {
      // Green for normal time
      baseClasses.push(styles.progressGreen)
    }

    return baseClasses.join(' ')
  }

  return (
    <div className={styles.progressBar}>
      <div className={getProgressClass()} style={{ width: `${progress}%` }} />
    </div>
  )
}

export default ProgressBar
