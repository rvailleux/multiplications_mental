import React from 'react'
import { Player } from '../types/player'
import styles from './PlayerNameDisplay.module.scss'

/**
 * Props for PlayerNameDisplay component
 * @public
 */
export interface PlayerNameDisplayProps {
  /**
   * Current player object to display. If null, component renders nothing.
   * Retrieved from localStorage via getCurrentPlayer() in parent components.
   */
  player: Player | null
  /**
   * Optional click handler. When provided, the card becomes clickable with hover state
   * and appropriate accessibility attributes (role="button", tabIndex={0}).
   * Typically used to navigate back to player selection screen.
   */
  onClick?: () => void
}

/**
 * Displays the current player's name in the top right corner with retro 8-bit styling.
 * Truncates names longer than 12 characters with ellipsis.
 * Positioned fixed at the top right of the screen (viewport), not the game container.
 *
 * When onClick is provided, the component becomes clickable with:
 * - Pointer cursor and hover/active visual states
 * - Keyboard accessibility (Enter key triggers click)
 * - ARIA role="button" for screen readers
 *
 * @param {PlayerNameDisplayProps} props - Component props
 * @returns {React.ReactElement | null} Player name display or null if no player
 * @public
 */
export default function PlayerNameDisplay({
  player,
  onClick,
}: PlayerNameDisplayProps): React.ReactElement | null {
  if (!player) return null

  /**
   * Handles keyboard interaction for accessibility.
   * Triggers onClick when Enter key is pressed.
   * Stops propagation to prevent parent page handlers from also firing.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (onClick && e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      onClick()
    }
  }

  const containerClass = onClick
    ? `${styles.playerNameContainer} ${styles.clickable} player-name-display`
    : `${styles.playerNameContainer} player-name-display`

  return (
    <div
      className={containerClass}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <span className={styles.playerNameText}>{player.name}</span>
    </div>
  )
}
