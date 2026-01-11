import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePlayerManagement } from './usePlayerManagement'
import { setCurrentPlayerId } from '../types/player'

describe('usePlayerManagement', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  it('should initialize with default players', () => {
    const { result } = renderHook(() => usePlayerManagement())

    expect(result.current.players).toHaveLength(2)
    expect(result.current.players[0]).toEqual({ id: 'jules', name: 'Jules' })
    expect(result.current.players[1]).toEqual({ id: 'achille', name: 'Achille' })
  })

  it('should start with no current player if none is set', () => {
    const { result } = renderHook(() => usePlayerManagement())

    expect(result.current.currentPlayer).toBeNull()
    expect(result.current.hasPlayerSelected).toBe(false)
  })

  it('should load current player from localStorage if set', () => {
    // Set a player in localStorage before rendering hook
    setCurrentPlayerId('jules')

    const { result } = renderHook(() => usePlayerManagement())

    expect(result.current.currentPlayer).toEqual({ id: 'jules', name: 'Jules' })
    expect(result.current.hasPlayerSelected).toBe(true)
  })

  it('should start with selectedIndex 0 when no player is set', () => {
    const { result } = renderHook(() => usePlayerManagement())

    expect(result.current.selectedIndex).toBe(0)
  })

  it('should start with correct selectedIndex when player is set', () => {
    // Set second player (Achille) as current
    setCurrentPlayerId('achille')

    const { result } = renderHook(() => usePlayerManagement())

    expect(result.current.selectedIndex).toBe(1)
    expect(result.current.currentPlayer).toEqual({ id: 'achille', name: 'Achille' })
  })

  it('should update selectedIndex when setSelectedIndex is called', () => {
    const { result } = renderHook(() => usePlayerManagement())

    expect(result.current.selectedIndex).toBe(0)

    act(() => {
      result.current.setSelectedIndex(1)
    })

    expect(result.current.selectedIndex).toBe(1)
  })

  it('should select a player and save to localStorage', () => {
    const { result } = renderHook(() => usePlayerManagement())

    act(() => {
      result.current.selectPlayer(1)
    })

    expect(result.current.currentPlayer).toEqual({ id: 'achille', name: 'Achille' })
    expect(localStorage.getItem('currentPlayer')).toBe('achille')
    expect(result.current.hasPlayerSelected).toBe(true)
  })

  it('should not select player with invalid index', () => {
    const { result } = renderHook(() => usePlayerManagement())

    act(() => {
      result.current.selectPlayer(-1)
    })

    expect(result.current.currentPlayer).toBeNull()
    expect(localStorage.getItem('currentPlayer')).toBeNull()

    act(() => {
      result.current.selectPlayer(999)
    })

    expect(result.current.currentPlayer).toBeNull()
    expect(localStorage.getItem('currentPlayer')).toBeNull()
  })

  it('should persist players to localStorage on initialization', () => {
    renderHook(() => usePlayerManagement())

    const players = JSON.parse(localStorage.getItem('players') || '[]')
    expect(players).toHaveLength(2)
    expect(players[0]).toEqual({ id: 'jules', name: 'Jules' })
    expect(players[1]).toEqual({ id: 'achille', name: 'Achille' })
  })

  it('should not override existing players in localStorage', () => {
    // Set custom players first
    const customPlayers = [
      { id: 'custom1', name: 'Custom 1' },
      { id: 'custom2', name: 'Custom 2' },
    ]
    localStorage.setItem('players', JSON.stringify(customPlayers))

    const { result } = renderHook(() => usePlayerManagement())

    // Should load the custom players, not defaults
    expect(result.current.players).toEqual(customPlayers)
  })
})
