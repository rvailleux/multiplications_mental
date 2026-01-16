import React from 'react'
import { Player } from '../types/player'

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
    <div style={styles.playerNameContainer} className="player-name-display">
      <span style={styles.playerNameText}>{player.name}</span>
    </div>
  )
}

const styles = {
  playerNameContainer: {
    position: 'fixed' as const,
    top: '20px',
    right: '20px',
    zIndex: 1000,
    background: 'linear-gradient(180deg, #4ecdc4 0%, #44b3aa 100%)',
    border: '4px solid #000',
    padding: '8px 16px',
    boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.3)',
  },
  playerNameText: {
    color: '#fff',
    fontSize: '14px',
    textShadow: '2px 2px 0 #000',
    maxWidth: '200px',
    overflow: 'hidden' as const,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    fontWeight: 'bold' as const,
  },
}
