import React, { useEffect } from 'react'
import type { PauseMenuOption } from '../types/keyboard'
import styles from './PauseMenu.module.scss'

/**
 * Props for PauseMenu component
 * @public
 */
export interface PauseMenuProps {
  /** Whether the pause menu is currently visible */
  isPaused: boolean
  /** Currently selected menu option */
  selectedOption: PauseMenuOption
  /** Callback when user selects continue */
  onContinue: () => void
  /** Callback when user selects quit */
  onQuit: () => void
  /** Callback when user toggles between options */
  onToggle: () => void
  /** Callback when user closes the menu (Escape or click outside) */
  onClose: () => void
}

/**
 * Pause menu overlay component with keyboard and mouse navigation.
 * Displays a modal with Continue and Quit options.
 * Supports keyboard navigation (ArrowUp/Down, Enter, Escape) and mouse clicks.
 *
 * @param {PauseMenuProps} props - Component props
 * @returns {React.ReactElement | null} Pause menu overlay or null if not paused
 * @public
 *
 * @example
 * ```tsx
 * <PauseMenu
 *   isPaused={isPaused}
 *   selectedOption={selectedOption}
 *   onContinue={() => resumeGame()}
 *   onQuit={() => navigate('/home')}
 *   onToggle={() => toggleOption()}
 *   onClose={() => closePauseMenu()}
 * />
 * ```
 */
export default function PauseMenu({
  isPaused,
  selectedOption,
  onContinue,
  onQuit,
  onToggle,
  onClose,
}: PauseMenuProps): React.ReactElement | null {
  // Handle keyboard navigation
  useEffect(() => {
    if (!isPaused) return

    const handleKeyDown = (e: KeyboardEvent): void => {
      // Prevent default browser behavior for navigation keys
      if (['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes(e.key)) {
        e.preventDefault()
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
          onToggle()
          break
        case 'Enter':
          if (selectedOption === 'continue') {
            onContinue()
          } else {
            onQuit()
          }
          break
        case 'Escape':
          onClose()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPaused, selectedOption, onContinue, onQuit, onToggle, onClose])

  // Don't render if not paused
  if (!isPaused) return null

  /**
   * Handle overlay click (click outside menu)
   * @param {React.MouseEvent} e - Click event
   */
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    // Only close if clicking the overlay itself, not its children
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick} data-testid="pause-overlay">
      <div className={styles.menuContainer} data-testid="pause-menu-container">
        <h2 className={styles.title}>⏸ PAUSE ⏸</h2>

        <div className={styles.buttonGroup}>
          <button
            className={`${styles.menuButton} ${
              selectedOption === 'continue' ? styles.selected : ''
            }`}
            onClick={onContinue}
          >
            {selectedOption === 'continue' && '▶ '}Continue
          </button>

          <button
            className={`${styles.menuButton} ${selectedOption === 'quit' ? styles.selected : ''}`}
            onClick={onQuit}
          >
            {selectedOption === 'quit' && '▶ '}Quit
          </button>
        </div>

        <p className={styles.hint}>↑↓ Navigate • Enter Confirm • Esc Close</p>
      </div>
    </div>
  )
}
