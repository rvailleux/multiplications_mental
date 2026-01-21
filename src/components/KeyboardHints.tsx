import styles from './KeyboardHints.module.scss'

/**
 * Screen identifiers for keyboard hint configuration
 * @public
 */
export type ScreenId = 'player-select' | 'home' | 'play' | 'pause-menu' | 'results'

/**
 * Individual keyboard hint
 * @public
 */
export interface KeyboardHint {
  /** Key or key combination (e.g., '↑↓', 'Enter', 'ESC') */
  key: string
  /** Description of what the key does */
  description: string
}

/**
 * Props for the KeyboardHints component
 * @public
 */
export interface KeyboardHintsProps {
  /** Screen identifier to display hints for */
  screenId: ScreenId
  /** Additional CSS class names */
  className?: string
}

/**
 * Complete hint configuration map for all screens
 * @public
 */
export const KEYBOARD_HINTS_CONFIG: Record<ScreenId, KeyboardHint[]> = {
  'player-select': [
    { key: '↑↓', description: 'Navigate' },
    { key: 'Enter', description: 'Select' },
    { key: 'ESC', description: 'Exit' },
  ],
  home: [
    { key: 'Enter', description: 'Start Game' },
    { key: 'ESC', description: 'Change Player' },
  ],
  play: [
    { key: 'Type', description: 'Answer' },
    { key: 'Enter', description: 'Submit' },
    { key: 'ESC', description: 'Pause' },
    { key: '↑↓', description: 'Navigate' },
  ],
  'pause-menu': [
    { key: '↑↓', description: 'Navigate' },
    { key: 'Enter', description: 'Confirm' },
    { key: 'ESC', description: 'Cancel' },
  ],
  results: [
    { key: 'Enter', description: 'Continue' },
    { key: 'ESC', description: 'Change Player' },
  ],
}

/**
 * Keyboard hints component
 * Displays context-appropriate keyboard hints for the current screen.
 * Shows which keys are available and what they do in a retro-styled bar
 * at the bottom of the screen.
 *
 * @param props - Component properties
 * @returns JSX element with keyboard hints
 *
 * @example
 * ```tsx
 * <KeyboardHints screenId="play" />
 * ```
 */
export default function KeyboardHints({ screenId, className }: KeyboardHintsProps) {
  const hints = KEYBOARD_HINTS_CONFIG[screenId]

  return (
    <div className={`${styles.keyboardHints} ${className || ''}`}>
      {hints.map((hint, index) => (
        <div key={index} className={styles.hint}>
          <span className={styles.key}>{hint.key}</span>
          <span className={styles.description}>{hint.description}</span>
        </div>
      ))}
    </div>
  )
}
