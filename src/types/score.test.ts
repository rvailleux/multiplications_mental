import { describe, it, expect } from 'vitest'
import { getScorePlayerName, hasPlayerInfo } from './score'
import type { ScoreEntry } from './score'

describe('Score Utilities', () => {
  describe('getScorePlayerName', () => {
    it('should return uppercase player name for entries with playerName', () => {
      const entry: ScoreEntry = {
        score: 500,
        results: [],
        playerId: 'jules',
        playerName: 'Jules',
      }
      expect(getScorePlayerName(entry)).toBe('JULES')
    })

    it('should return UNKNOWN for legacy entries without playerName', () => {
      const entry: ScoreEntry = {
        score: 500,
        results: [],
      }
      expect(getScorePlayerName(entry)).toBe('UNKNOWN')
    })

    it('should return UNKNOWN for entries with empty playerName', () => {
      const entry: ScoreEntry = {
        score: 500,
        results: [],
        playerId: 'jules',
        playerName: '',
      }
      expect(getScorePlayerName(entry)).toBe('UNKNOWN')
    })

    it('should handle mixed case player names', () => {
      const entry: ScoreEntry = {
        score: 500,
        results: [],
        playerId: 'test',
        playerName: 'TeSt UsEr',
      }
      expect(getScorePlayerName(entry)).toBe('TEST USER')
    })

    it('should handle lowercase player names', () => {
      const entry: ScoreEntry = {
        score: 500,
        results: [],
        playerId: 'achille',
        playerName: 'achille',
      }
      expect(getScorePlayerName(entry)).toBe('ACHILLE')
    })
  })

  describe('hasPlayerInfo', () => {
    it('should return true for entries with both playerId and playerName', () => {
      const entry: ScoreEntry = {
        score: 500,
        results: [],
        playerId: 'jules',
        playerName: 'Jules',
      }
      expect(hasPlayerInfo(entry)).toBe(true)
    })

    it('should return false for legacy entries without player info', () => {
      const entry: ScoreEntry = {
        score: 500,
        results: [],
      }
      expect(hasPlayerInfo(entry)).toBe(false)
    })

    it('should return false for entries with only playerId', () => {
      const entry: ScoreEntry = {
        score: 500,
        results: [],
        playerId: 'jules',
      }
      expect(hasPlayerInfo(entry)).toBe(false)
    })

    it('should return false for entries with only playerName', () => {
      const entry: ScoreEntry = {
        score: 500,
        results: [],
        playerName: 'Jules',
      }
      expect(hasPlayerInfo(entry)).toBe(false)
    })

    it('should return false for entries with empty strings', () => {
      const entry: ScoreEntry = {
        score: 500,
        results: [],
        playerId: '',
        playerName: '',
      }
      expect(hasPlayerInfo(entry)).toBe(false)
    })
  })
})
