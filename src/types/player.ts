/**
 * Player data structure for player management
 * @public
 */
export interface Player {
  /** Unique identifier for the player */
  id: string
  /** Display name of the player */
  name: string
}

/**
 * Get all available players from localStorage
 * @returns Array of Player objects
 */
export function getPlayers(): Player[] {
  try {
    const playersData = localStorage.getItem('players')
    return playersData ? JSON.parse(playersData) : getDefaultPlayers()
  } catch (error) {
    console.error('Error loading players:', error)
    return getDefaultPlayers()
  }
}

/**
 * Get default players (Jules and Achille)
 * @returns Array of default Player objects
 */
function getDefaultPlayers(): Player[] {
  return [
    { id: 'jules', name: 'Jules' },
    { id: 'achille', name: 'Achille' },
  ]
}

/**
 * Get the currently selected player ID from localStorage
 * @returns Player ID string or null if none selected
 */
export function getCurrentPlayerId(): string | null {
  return localStorage.getItem('currentPlayer')
}

/**
 * Set the currently selected player ID in localStorage
 * @param playerId - The player ID to set as current
 */
export function setCurrentPlayerId(playerId: string): void {
  localStorage.setItem('currentPlayer', playerId)
}

/**
 * Get the currently selected player object
 * @returns Player object or null if none selected
 */
export function getCurrentPlayer(): Player | null {
  const playerId = getCurrentPlayerId()
  if (!playerId) return null

  const players = getPlayers()
  return players.find(p => p.id === playerId) || null
}

/**
 * Initialize default players in localStorage if not already present
 */
export function initializePlayers(): void {
  const existing = localStorage.getItem('players')
  if (!existing) {
    localStorage.setItem('players', JSON.stringify(getDefaultPlayers()))
  }
}
