/**
 * Represents a single game score entry with player information
 * @public
 */
export interface ScoreEntry {
  /** Total score achieved in the game */
  score: number
  /** Array of individual question results */
  results: Array<{
    /** The multiplication question (e.g., "3 x 7") */
    question: string
    /** Whether the answer was correct */
    correct: boolean
  }>
  /** Unique identifier of the player who achieved this score */
  playerId?: string
  /** Display name of the player who achieved this score */
  playerName?: string
}

/**
 * Gets the display name for a score entry, handling legacy entries
 * Returns the player name in uppercase for retro aesthetic, or "UNKNOWN" for entries without player information
 * @param entry - The score entry to extract a name from
 * @returns The player name in uppercase or "UNKNOWN" for legacy entries
 * @public
 */
export function getScorePlayerName(entry: ScoreEntry): string {
  return entry.playerName?.toUpperCase() || 'UNKNOWN'
}

/**
 * Checks if a score entry has valid player information
 * Returns true only if both playerId and playerName are present and non-empty
 * @param entry - The score entry to validate
 * @returns True if the entry has both playerId and playerName
 * @public
 */
export function hasPlayerInfo(entry: ScoreEntry): boolean {
  return Boolean(entry.playerId && entry.playerName)
}
