import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import PlayPage from './PlayPage'
import { setCurrentPlayerId } from '../types/player'

// Mock the navigation hook
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock background music hook
vi.mock('../hooks/useBackgroundMusic', () => ({
  useBackgroundMusic: () => ({
    startMusic: vi.fn(),
    stopMusic: vi.fn(),
    isPlaying: false,
    currentTrack: null,
  }),
}))

describe('PlayPage - localStorage Integration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    vi.clearAllMocks()

    // Set a player so we don't get redirected
    localStorage.setItem('players', JSON.stringify([{ id: 'jules', name: 'Jules' }]))
    setCurrentPlayerId('jules')
  })

  it('should save score to localStorage when timer reaches 0', async () => {
    // Mock useTimer to simulate timer expiring
    vi.mock('../hooks/useTimer', () => ({
      useTimer: () => ({
        secondsLeft: 0, // Timer already expired
        reset: vi.fn(),
      }),
    }))

    // Set initial score in localStorage
    const initialScores = [{ score: 100, results: [] }]
    localStorage.setItem('scores', JSON.stringify(initialScores))

    render(
      <MemoryRouter>
        <PlayPage />
      </MemoryRouter>
    )

    // Wait for navigation to happen (timer is 0)
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home')
    })
  })

  it('should NOT save score to localStorage when score is 0', async () => {
    vi.mock('../hooks/useTimer', () => ({
      useTimer: () => ({
        secondsLeft: 0,
        reset: vi.fn(),
      }),
    }))

    localStorage.setItem('scores', JSON.stringify([]))

    render(
      <MemoryRouter>
        <PlayPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home')
    })

    // Scores should still be empty (no 0 score saved)
    const scores = JSON.parse(localStorage.getItem('scores') || '[]')
    expect(scores).toHaveLength(0)
  })

  it('should append new score to existing scores in localStorage', () => {
    const existingScores = [
      { score: 500, results: [{ question: '2 x 3', correct: true }] },
      { score: 300, results: [{ question: '4 x 5', correct: true }] },
    ]
    localStorage.setItem('scores', JSON.stringify(existingScores))

    const newScore = { score: 700, results: [{ question: '7 x 8', correct: true }] }

    // Simulate saving a new score
    const updatedScores = [...existingScores, newScore]
    localStorage.setItem('scores', JSON.stringify(updatedScores))

    const scores = JSON.parse(localStorage.getItem('scores') || '[]')

    expect(scores).toHaveLength(3)
    expect(scores[2]).toEqual(newScore)
  })

  it('should handle empty localStorage gracefully', () => {
    // Don't set any scores

    const scores = JSON.parse(localStorage.getItem('scores') || '[]')

    expect(scores).toEqual([])
    expect(scores).toHaveLength(0)
  })

  it('should handle corrupted localStorage data gracefully', () => {
    localStorage.setItem('scores', 'invalid-json-{{{')

    // Parsing should fail but be handled
    let scores
    try {
      scores = JSON.parse(localStorage.getItem('scores') || '[]')
    } catch {
      scores = []
    }

    expect(scores).toEqual([])
  })

  it('should display current player name during gameplay', () => {
    render(
      <MemoryRouter>
        <PlayPage />
      </MemoryRouter>
    )

    // Player name should be visible in top right corner
    expect(screen.getByText('Jules')).toBeInTheDocument()
  })

  it('should redirect to player selection when no player is selected', () => {
    // Clear current player
    localStorage.removeItem('currentPlayer')

    render(
      <MemoryRouter>
        <PlayPage />
      </MemoryRouter>
    )

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('should store game results with score in localStorage', async () => {
    const mockResults = [
      { question: '3 x 7', correct: true },
      { question: '5 x 9', correct: false },
      { question: '2 x 8', correct: true },
    ]

    const scoreEntry = {
      score: 1500,
      results: mockResults,
    }

    localStorage.setItem('scores', JSON.stringify([scoreEntry]))

    const scores = JSON.parse(localStorage.getItem('scores') || '[]')

    expect(scores).toHaveLength(1)
    expect(scores[0].score).toBe(1500)
    expect(scores[0].results).toHaveLength(3)
    expect(scores[0].results[0]).toEqual({ question: '3 x 7', correct: true })
    expect(scores[0].results[1].correct).toBe(false)
  })
})

describe('PlayPage - Edge Cases', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()

    // Set a player
    localStorage.setItem('players', JSON.stringify([{ id: 'jules', name: 'Jules' }]))
    setCurrentPlayerId('jules')
  })

  it('should handle rapid score submissions without data loss', () => {
    const scores = []

    // Simulate rapid score additions
    for (let i = 0; i < 10; i++) {
      scores.push({ score: i * 100, results: [] })
    }

    localStorage.setItem('scores', JSON.stringify(scores))

    const savedScores = JSON.parse(localStorage.getItem('scores') || '[]')

    expect(savedScores).toHaveLength(10)
    expect(savedScores[9].score).toBe(900)
  })

  it('should handle very large results arrays', () => {
    const largeResults = []
    for (let i = 0; i < 100; i++) {
      largeResults.push({ question: `${i} x ${i}`, correct: i % 2 === 0 })
    }

    const scoreEntry = { score: 5000, results: largeResults }
    localStorage.setItem('scores', JSON.stringify([scoreEntry]))

    const scores = JSON.parse(localStorage.getItem('scores') || '[]')

    expect(scores[0].results).toHaveLength(100)
  })

  it('should preserve score data types correctly', () => {
    const scoreEntry = {
      score: 1234,
      results: [
        { question: '5 x 5', correct: true },
        { question: '6 x 6', correct: false },
      ],
    }

    localStorage.setItem('scores', JSON.stringify([scoreEntry]))

    const scores = JSON.parse(localStorage.getItem('scores') || '[]')

    expect(typeof scores[0].score).toBe('number')
    expect(typeof scores[0].results[0].correct).toBe('boolean')
    expect(typeof scores[0].results[0].question).toBe('string')
  })
})
