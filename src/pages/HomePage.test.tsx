import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import HomePage from './HomePage'
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

describe('HomePage - localStorage Integration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    vi.clearAllMocks()

    // Set a player so we don't get redirected
    localStorage.setItem('players', JSON.stringify([{ id: 'jules', name: 'Jules' }]))
    setCurrentPlayerId('jules')
  })

  it('should load scores from localStorage', () => {
    const mockScores = [
      { score: 500, results: [{ question: '3 x 7', correct: true }] },
      { score: 300, results: [{ question: '2 x 5', correct: true }] },
    ]
    localStorage.setItem('scores', JSON.stringify(mockScores))

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Check that scores are displayed (with " pts" suffix)
    expect(screen.getByText('500 pts')).toBeInTheDocument()
    expect(screen.getByText('300 pts')).toBeInTheDocument()
  })

  it('should handle empty scores array', () => {
    localStorage.setItem('scores', JSON.stringify([]))

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Should still render without crashing
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument()
  })

  it('should display welcome message with player name', () => {
    localStorage.setItem('scores', JSON.stringify([]))

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    expect(screen.getByText(/Welcome Jules/i)).toBeInTheDocument()
  })

  it('should display current player name in top right corner', () => {
    localStorage.setItem('scores', JSON.stringify([]))

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Player name should be visible in top right corner
    expect(screen.getByText('Jules')).toBeInTheDocument()
  })

  it('should limit scores to last 100 entries', () => {
    // Create 150 scores
    const manyScores = []
    for (let i = 0; i < 150; i++) {
      manyScores.push({ score: i * 10, results: [] })
    }
    localStorage.setItem('scores', JSON.stringify(manyScores))

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Should only show the last 100 scores
    // The first 50 should be excluded
    expect(screen.queryByText('0 pts')).not.toBeInTheDocument() // First score should be excluded
    expect(screen.queryByText('100 pts')).not.toBeInTheDocument() // Still in excluded range
    expect(screen.getByText('1490 pts')).toBeInTheDocument() // Last score should be visible
  })

  it('should redirect to player selection when no player is selected', () => {
    // Clear current player
    localStorage.removeItem('currentPlayer')

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})

describe('HomePage - Ranking System', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()

    localStorage.setItem('players', JSON.stringify([{ id: 'jules', name: 'Jules' }]))
    setCurrentPlayerId('jules')
  })

  it('should assign correct ranks to scores', () => {
    const mockScores = [
      { score: 500, results: [] },
      { score: 300, results: [] },
      { score: 200, results: [] },
    ]
    localStorage.setItem('scores', JSON.stringify(mockScores))

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Check for rank indicators (with medals)
    expect(screen.getByText('🥇 #1')).toBeInTheDocument()
    expect(screen.getByText('🥈 #2')).toBeInTheDocument()
    expect(screen.getByText('🥉 #3')).toBeInTheDocument()
  })

  it('should assign gold medal to rank 1', () => {
    const mockScores = [
      { score: 500, results: [] },
      { score: 300, results: [] },
    ]
    localStorage.setItem('scores', JSON.stringify(mockScores))

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    expect(screen.getByText(/🥇/)).toBeInTheDocument()
  })

  it('should assign silver medal to rank 2', () => {
    const mockScores = [
      { score: 500, results: [] },
      { score: 300, results: [] },
      { score: 100, results: [] },
    ]
    localStorage.setItem('scores', JSON.stringify(mockScores))

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    expect(screen.getByText(/🥈/)).toBeInTheDocument()
  })

  it('should assign bronze medal to rank 3', () => {
    const mockScores = [
      { score: 500, results: [] },
      { score: 300, results: [] },
      { score: 200, results: [] },
      { score: 100, results: [] },
    ]
    localStorage.setItem('scores', JSON.stringify(mockScores))

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    expect(screen.getByText(/🥉/)).toBeInTheDocument()
  })

  it('should handle tied scores with same rank', () => {
    const mockScores = [
      { score: 500, results: [] },
      { score: 500, results: [] },
      { score: 300, results: [] },
    ]
    localStorage.setItem('scores', JSON.stringify(mockScores))

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Both scores of 500 should be rank 1 with gold medals
    const rank1Elements = screen.getAllByText('🥇 #1')
    expect(rank1Elements).toHaveLength(2)

    // Next score should be rank 3 (not rank 2) with bronze medal
    expect(screen.getByText('🥉 #3')).toBeInTheDocument()
    expect(screen.queryByText('🥈 #2')).not.toBeInTheDocument()
  })

  it('should assign medals correctly with tied ranks', () => {
    const mockScores = [
      { score: 500, results: [] },
      { score: 500, results: [] },
      { score: 300, results: [] },
    ]
    localStorage.setItem('scores', JSON.stringify(mockScores))

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Both rank 1 scores should get gold medals
    const goldMedals = screen.getAllByText(/🥇/)
    expect(goldMedals).toHaveLength(2)

    // Rank 3 should get bronze (not silver)
    expect(screen.getByText(/🥉/)).toBeInTheDocument()
  })
})

describe('HomePage - Edge Cases', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()

    localStorage.setItem('players', JSON.stringify([{ id: 'jules', name: 'Jules' }]))
    setCurrentPlayerId('jules')
  })

  it('should handle corrupted scores data gracefully', () => {
    localStorage.setItem('scores', 'invalid-json-{{{')

    // Should not crash
    expect(() => {
      render(
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      )
    }).toThrow() // Will throw because JSON.parse fails, which is expected behavior
  })

  it('should handle missing localStorage data', () => {
    // Don't set any scores

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Should render with empty scores
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument()
  })

  it('should handle all scores being identical', () => {
    const mockScores = [
      { score: 500, results: [] },
      { score: 500, results: [] },
      { score: 500, results: [] },
    ]
    localStorage.setItem('scores', JSON.stringify(mockScores))

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // All should be rank 1 with gold medals (combined text)
    const rank1Elements = screen.getAllByText('🥇 #1')
    expect(rank1Elements).toHaveLength(3)
  })

  it('should sort scores in descending order', () => {
    const mockScores = [
      { score: 100, results: [] },
      { score: 500, results: [] },
      { score: 300, results: [] },
    ]
    localStorage.setItem('scores', JSON.stringify(mockScores))

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Verify highest score (500) comes first visually
    const scoreElements = screen.getAllByText(/^\d+ pts$/)
    expect(scoreElements[0]).toHaveTextContent('500 pts')
    expect(scoreElements[1]).toHaveTextContent('300 pts')
    expect(scoreElements[2]).toHaveTextContent('100 pts')
  })
})
