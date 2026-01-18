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
}

/**
 * Displays the current player's name in the top right corner with retro 8-bit styling.
 * Truncates names longer than 12 characters with ellipsis.
 * Positioned fixed at the top right of the screen (viewport), not the game container.
 * @param {PlayerNameDisplayProps} props - Component props
 * @returns {React.ReactElement | null} Player name display or null if no player
 * @public
 */
export default function PlayerNameDisplay({
  player,
}: PlayerNameDisplayProps): React.ReactElement | null {
  if (!player) return null

  return (
    <div className={`${styles.playerNameContainer} player-name-display`}>
      <span className={styles.playerNameText}>{player.name}</span>
    </div>
  )
}
