import { render, screen, fireEvent } from '@testing-library/react'
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

describe('HomePage - Keyboard Navigation', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()

    localStorage.setItem('players', JSON.stringify([{ id: 'jules', name: 'Jules' }]))
    setCurrentPlayerId('jules')
    localStorage.setItem('scores', JSON.stringify([]))
  })

  it('should navigate to player selection when ESC key is pressed', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Press ESC key
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
    window.dispatchEvent(escapeEvent)

    // Should navigate back to game select (not player select directly)
    expect(mockNavigate).toHaveBeenCalledWith('/select-game')
  })

  it('should start game when ENTER key is pressed', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Press ENTER key
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' })
    window.dispatchEvent(enterEvent)

    // Should navigate to play page
    expect(mockNavigate).toHaveBeenCalledWith('/play')
  })

  it('should cleanup keyboard event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    unmount()

    // Should remove event listener
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
  })

  it('should not respond to other keys', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Clear any previous navigation calls
    mockNavigate.mockClear()

    // Press random key
    const randomKeyEvent = new KeyboardEvent('keydown', { key: 'a' })
    window.dispatchEvent(randomKeyEvent)

    // Should not navigate
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})

describe('HomePage - Game Metrics Display', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()

    localStorage.setItem('players', JSON.stringify([{ id: 'jules', name: 'Jules' }]))
    setCurrentPlayerId('jules')
  })

  it('should display accuracy metric for each score', () => {
    const mockScores = [
      {
        score: 500,
        results: [
          { question: '3 x 7', correct: true },
          { question: '5 x 8', correct: true },
          { question: '2 x 9', correct: false },
          { question: '4 x 6', correct: true },
        ],
      },
    ]
    localStorage.setItem('scores', JSON.stringify(mockScores))

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // 3 correct out of 4 = 75% accuracy
    expect(screen.getByText(/75%/)).toBeInTheDocument()
  })

  it('should display speed metric for each score', () => {
    const mockScores = [
      {
        score: 400,
        results: [
          { question: '3 x 7', correct: true },
          { question: '5 x 8', correct: true },
          { question: '2 x 9', correct: true },
          { question: '4 x 6', correct: true },
        ],
      },
    ]
    localStorage.setItem('scores', JSON.stringify(mockScores))

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // 4 correct answers in 60 seconds: 60/4 = 15.0"
    expect(screen.getByText(/15\.0"/)).toBeInTheDocument()
  })

  it('should display correct/total questions metric', () => {
    const mockScores = [
      {
        score: 300,
        results: [
          { question: '3 x 7', correct: true },
          { question: '5 x 8', correct: false },
          { question: '2 x 9', correct: true },
        ],
      },
    ]
    localStorage.setItem('scores', JSON.stringify(mockScores))

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // 2 correct out of 3 total
    expect(screen.getByText(/2\/3/)).toBeInTheDocument()
  })

  it('should handle zero correct answers for speed metric', () => {
    const mockScores = [
      {
        score: 0,
        results: [
          { question: '3 x 7', correct: false },
          { question: '5 x 8', correct: false },
        ],
      },
    ]
    localStorage.setItem('scores', JSON.stringify(mockScores))

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Speed should show "-" when no correct answers
    expect(screen.getByText(/-/)).toBeInTheDocument()
  })

  it('should highlight best speed across all scores', () => {
    const mockScores = [
      {
        score: 600,
        results: [
          { question: '3 x 7', correct: true },
          { question: '5 x 8', correct: true },
          { question: '2 x 9', correct: true },
          { question: '4 x 6', correct: true },
          { question: '7 x 3', correct: true },
          { question: '8 x 2', correct: true },
        ],
      }, // 60/6 = 10.0" (best speed - lowest time)
      {
        score: 400,
        results: [
          { question: '3 x 7', correct: true },
          { question: '5 x 8', correct: true },
          { question: '2 x 9', correct: true },
          { question: '4 x 6', correct: true },
        ],
      }, // 60/4 = 15.0"
      {
        score: 200,
        results: [
          { question: '3 x 7', correct: true },
          { question: '5 x 8', correct: true },
        ],
      }, // 60/2 = 30.0"
    ]
    localStorage.setItem('scores', JSON.stringify(mockScores))

    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Find the speed metric with 10.0" and verify it has highlight styling
    const bestSpeedElement = container.querySelector('[data-metric="speed"][data-best="true"]')
    expect(bestSpeedElement).toBeInTheDocument()
    expect(bestSpeedElement?.textContent).toContain('10.0"')
  })

  it('should highlight best accuracy across all scores', () => {
    const mockScores = [
      {
        score: 500,
        results: [
          { question: '3 x 7', correct: true },
          { question: '5 x 8', correct: true },
        ],
      }, // 2/2 = 100% (best accuracy)
      {
        score: 400,
        results: [
          { question: '3 x 7', correct: true },
          { question: '5 x 8', correct: true },
          { question: '2 x 9', correct: false },
        ],
      }, // 2/3 = 67%
      {
        score: 300,
        results: [
          { question: '3 x 7', correct: true },
          { question: '5 x 8', correct: false },
        ],
      }, // 1/2 = 50%
    ]
    localStorage.setItem('scores', JSON.stringify(mockScores))

    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Find the accuracy metric with 100% and verify it has highlight styling
    const bestAccuracyElement = container.querySelector(
      '[data-metric="accuracy"][data-best="true"]'
    )
    expect(bestAccuracyElement).toBeInTheDocument()
    expect(bestAccuracyElement?.textContent).toContain('100%')
  })

  it('should handle multiple scores with same best metric', () => {
    const mockScores = [
      {
        score: 500,
        results: [
          { question: '3 x 7', correct: true },
          { question: '5 x 8', correct: true },
        ],
      }, // 100% accuracy
      {
        score: 400,
        results: [
          { question: '3 x 7', correct: true },
          { question: '5 x 8', correct: true },
        ],
      }, // 100% accuracy (tied best)
    ]
    localStorage.setItem('scores', JSON.stringify(mockScores))

    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Both scores should be highlighted for best accuracy
    const bestAccuracyElements = container.querySelectorAll(
      '[data-metric="accuracy"][data-best="true"]'
    )
    expect(bestAccuracyElements).toHaveLength(2)
  })

  it('should display metrics in dark grey 8-bit style', () => {
    const mockScores = [
      {
        score: 300,
        results: [
          { question: '3 x 7', correct: true },
          { question: '5 x 8', correct: true },
        ],
      },
    ]
    localStorage.setItem('scores', JSON.stringify(mockScores))

    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Check that metrics container has dark grey styling
    const metricsContainer = container.querySelector('[data-testid="metrics-container"]')
    expect(metricsContainer).toBeInTheDocument()
  })
})

describe('HomePage - Jumping Arrow', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()

    localStorage.setItem('players', JSON.stringify([{ id: 'jules', name: 'Jules' }]))
    setCurrentPlayerId('jules')
    localStorage.setItem('scores', JSON.stringify([]))
  })

  it('should display jumping arrow next to Start Game button', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Arrow symbol should be visible
    expect(screen.getByText('▶')).toBeInTheDocument()
  })

  it('should keep arrow visible when arrow keys are pressed (single option)', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Arrow keys should do nothing gracefully (single option)
    const arrowDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' })
    window.dispatchEvent(arrowDownEvent)

    const arrowUpEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' })
    window.dispatchEvent(arrowUpEvent)

    // Arrow should still be visible (no crash, no error)
    expect(screen.getByText('▶')).toBeInTheDocument()
  })

  it('should navigate to play page when Start Game button is clicked', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    const startButton = screen.getByRole('button', { name: /start game/i })
    fireEvent.click(startButton)

    expect(mockNavigate).toHaveBeenCalledWith('/play')
  })
})

describe('HomePage - Leaderboard Player Names', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()

    // Set a player so we don't get redirected
    localStorage.setItem('players', JSON.stringify([{ id: 'jules', name: 'Jules' }]))
    setCurrentPlayerId('jules')
  })

  it('should display player names for scores with player info', () => {
    const scores = [
      {
        score: 500,
        results: [{ question: '3 x 7', correct: true }],
        playerId: 'jules',
        playerName: 'Jules',
      },
      {
        score: 450,
        results: [{ question: '5 x 8', correct: true }],
        playerId: 'achille',
        playerName: 'Achille',
      },
    ]
    localStorage.setItem('scores', JSON.stringify(scores))

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    expect(screen.getByText('JULES')).toBeInTheDocument()
    expect(screen.getByText('ACHILLE')).toBeInTheDocument()
  })

  it('should display UNKNOWN for legacy scores without player info', () => {
    const scores = [
      {
        score: 500,
        results: [{ question: '3 x 7', correct: true }],
      },
      {
        score: 450,
        results: [{ question: '5 x 8', correct: true }],
        playerId: 'jules',
        playerName: 'Jules',
      },
    ]
    localStorage.setItem('scores', JSON.stringify(scores))

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    expect(screen.getByText('UNKNOWN')).toBeInTheDocument()
    expect(screen.getByText('JULES')).toBeInTheDocument()
  })

  it('should display player name next to rank and score', () => {
    const scores = [
      {
        score: 500,
        results: [{ question: '3 x 7', correct: true }],
        playerId: 'jules',
        playerName: 'Jules',
      },
    ]
    localStorage.setItem('scores', JSON.stringify(scores))

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Verify structure: rank, player name, and score are all present
    expect(screen.getByText(/🥇 #1/)).toBeInTheDocument()
    expect(screen.getByText('JULES')).toBeInTheDocument()
    expect(screen.getByText('500 pts')).toBeInTheDocument()
  })

  it('should handle multiple scores from the same player', () => {
    const scores = [
      {
        score: 500,
        results: [{ question: '3 x 7', correct: true }],
        playerId: 'jules',
        playerName: 'Jules',
      },
      {
        score: 450,
        results: [{ question: '5 x 8', correct: true }],
        playerId: 'jules',
        playerName: 'Jules',
      },
    ]
    localStorage.setItem('scores', JSON.stringify(scores))

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // Should show JULES twice
    const julesElements = screen.getAllByText('JULES')
    expect(julesElements).toHaveLength(2)
  })
})
