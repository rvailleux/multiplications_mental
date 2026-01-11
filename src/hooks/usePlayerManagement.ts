import { useState, useEffect } from 'react'
import {
  Player,
  getPlayers,
  getCurrentPlayer,
  setCurrentPlayerId,
  initializePlayers,
} from '../types/player'

/**
 * Hook return type for player management
 * @public
 */
export interface UsePlayerManagementReturn {
  /** Array of available players */
  players: Player[]
  /** Currently selected player or null */
  currentPlayer: Player | null
  /** Index of currently selected player in the list */
  selectedIndex: number
  /** Set the selected index */
  setSelectedIndex: (index: number) => void
  /** Select a player by index and save to localStorage */
  selectPlayer: (index: number) => void
  /** Check if a player is currently selected */
  hasPlayerSelected: boolean
}

/**
 * Custom hook for managing player selection and state
 * @returns Player management state and functions
 * @example
 * const { players, selectedIndex, selectPlayer } = usePlayerManagement()
 */
export function usePlayerManagement(): UsePlayerManagementReturn {
  // Initialize players in localStorage on first load
  useEffect(() => {
    initializePlayers()
  }, [])

  const [players] = useState<Player[]>(() => getPlayers())
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(() => getCurrentPlayer())
  const [selectedIndex, setSelectedIndex] = useState<number>(() => {
    // Set initial selected index based on current player
    const current = getCurrentPlayer()
    if (current) {
      const index = players.findIndex(p => p.id === current.id)
      return index !== -1 ? index : 0
    }
    return 0
  })

  /**
   * Select a player by index and persist to localStorage
   * @param index - Index of the player to select
   */
  const selectPlayer = (index: number): void => {
    if (index >= 0 && index < players.length) {
      const player = players[index]
      setCurrentPlayerId(player.id)
      setCurrentPlayer(player)
    }
  }

  const hasPlayerSelected = currentPlayer !== null

  return {
    players,
    currentPlayer,
    selectedIndex,
    setSelectedIndex,
    selectPlayer,
    hasPlayerSelected,
  }
}
