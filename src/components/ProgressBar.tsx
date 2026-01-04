import React from 'react'

/**
 * Props for the ProgressBar component
 * @public
 */
export interface ProgressBarProps {
  /** Progress value between 0 and 100 representing completion percentage */
  progress: number
}

/**
 * Pixel art style progress bar with golden gradient and striped pattern
 * @param {ProgressBarProps} props - Component properties
 * @param {number} props.progress - Progress percentage (0-100)
 * @returns {JSX.Element} Retro style progress bar with pixel art aesthetics
 * @example
 * <ProgressBar progress={75} />  // Golden striped progress bar
 */
const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div style={styles.progressBar}>
      <div
        style={{
          ...styles.progressFill,
          width: `${progress}%`,
        }}
      />
    </div>
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
    background: 'linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)',
    transition: 'width 0.5s ease',
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
