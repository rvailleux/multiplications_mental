import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import type { GameResult } from './PlayPage'

// Mock navigate function
const mockNavigate = vi.fn()

// Mock location state - will be modified per test
let mockLocationState: { score: number; results: GameResult[] } | undefined = {
  score: 500,
  results: [
    { question: '3 x 7', correct: true },
    { question: '5 x 8', correct: true },
    { question: '2 x 9', correct: false },
    { question: '4 x 6', correct: true },
    { question: '7 x 3', correct: true },
  ],
}

// Mock react-router-dom hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      state: mockLocationState,
    }),
  }
})

// Mock PlayerNameDisplay component
vi.mock('../components/PlayerNameDisplay', () => ({
  default: () => <div data-testid="player-name-display">Player Name</div>,
}))

// Mock getCurrentPlayer
vi.mock('../types/player', () => ({
  getCurrentPlayer: () => ({ id: 'jules', name: 'Jules' }),
}))

// Import component after mocks
const { default: GameResultsPage } = await import('./GameResultsPage')

describe('GameResultsPage - Rendering and Stats Display', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocationState = {
      score: 500,
      results: [
        { question: '3 x 7', correct: true },
        { question: '5 x 8', correct: true },
        { question: '2 x 9', correct: false },
        { question: '4 x 6', correct: true },
        { question: '7 x 3', correct: true },
      ],
    }
  })

  it('should render final score correctly', () => {
    render(
      <MemoryRouter>
        <GameResultsPage />
      </MemoryRouter>
    )
    expect(screen.getByText(/500/)).toBeInTheDocument()
  })

  it('should calculate and display correct answer count', () => {
    render(
      <MemoryRouter>
        <GameResultsPage />
      </MemoryRouter>
    )
    // 4 correct out of 5 total
    expect(screen.getByText(/4\/5/)).toBeInTheDocument()
  })

  it('should calculate and display total questions count', () => {
    render(
      <MemoryRouter>
        <GameResultsPage />
      </MemoryRouter>
    )
    // Total of 5 questions
    expect(screen.getByText(/4\/5/)).toBeInTheDocument()
  })

  it('should calculate accuracy percentage (rounded integer)', () => {
    render(
      <MemoryRouter>
        <GameResultsPage />
      </MemoryRouter>
    )
    // 4/5 = 80%
    expect(screen.getByText(/80%/)).toBeInTheDocument()
  })

  it('should display 0% accuracy when no questions answered', () => {
    mockLocationState = {
      score: 0,
      results: [],
    }

    render(
      <MemoryRouter>
        <GameResultsPage />
      </MemoryRouter>
    )
    expect(screen.getByText(/0%/)).toBeInTheDocument()
  })

  it('should display player name in top-right corner', () => {
    render(
      <MemoryRouter>
        <GameResultsPage />
      </MemoryRouter>
    )
    expect(screen.getByTestId('player-name-display')).toBeInTheDocument()
  })
})

describe('GameResultsPage - Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle empty results array gracefully', () => {
    mockLocationState = {
      score: 0,
      results: [],
    }

    render(
      <MemoryRouter>
        <GameResultsPage />
      </MemoryRouter>
    )
    // Should display 0/0 and 0%
    expect(screen.getByText(/0\/0/)).toBeInTheDocument()
    expect(screen.getByText(/0%/)).toBeInTheDocument()
  })

  it('should handle all incorrect answers (0% accuracy)', () => {
    mockLocationState = {
      score: 0,
      results: [
        { question: '3 x 7', correct: false },
        { question: '5 x 8', correct: false },
      ],
    }

    render(
      <MemoryRouter>
        <GameResultsPage />
      </MemoryRouter>
    )
    expect(screen.getByText(/0%/)).toBeInTheDocument()
  })

  it('should handle all correct answers (100% accuracy)', () => {
    mockLocationState = {
      score: 1000,
      results: [
        { question: '3 x 7', correct: true },
        { question: '5 x 8', correct: true },
      ],
    }

    render(
      <MemoryRouter>
        <GameResultsPage />
      </MemoryRouter>
    )
    expect(screen.getByText(/100%/)).toBeInTheDocument()
  })

  it('should handle missing route state gracefully', () => {
    mockLocationState = undefined

    render(
      <MemoryRouter>
        <GameResultsPage />
      </MemoryRouter>
    )
    // Should fallback to 0 score and empty results
    expect(screen.getByText(/0\/0/)).toBeInTheDocument()
  })
})

describe('GameResultsPage - Keyboard Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocationState = {
      score: 500,
      results: [
        { question: '3 x 7', correct: true },
        { question: '5 x 8', correct: true },
      ],
    }
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it('should navigate to homepage when ENTER key pressed', () => {
    render(
      <MemoryRouter>
        <GameResultsPage />
      </MemoryRouter>
    )

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' })
    window.dispatchEvent(enterEvent)

    expect(mockNavigate).toHaveBeenCalledWith('/home')
  })

  it('should cleanup keyboard event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = render(
      <MemoryRouter>
        <GameResultsPage />
      </MemoryRouter>
    )

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    removeEventListenerSpy.mockRestore()
  })

  it('should ignore non-ENTER keys', () => {
    render(
      <MemoryRouter>
        <GameResultsPage />
      </MemoryRouter>
    )

    mockNavigate.mockClear()

    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
    window.dispatchEvent(escapeEvent)

    expect(mockNavigate).not.toHaveBeenCalled()
  })
})

describe('GameResultsPage - Mouse Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocationState = {
      score: 500,
      results: [{ question: '3 x 7', correct: true }],
    }
  })

  it('should navigate to homepage when continue button clicked', () => {
    render(
      <MemoryRouter>
        <GameResultsPage />
      </MemoryRouter>
    )

    const continueButton = screen.getByRole('button', { name: /continue/i })
    fireEvent.click(continueButton)

    expect(mockNavigate).toHaveBeenCalledWith('/home')
  })
})

describe('GameResultsPage - Animation Lifecycle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    mockLocationState = {
      score: 500,
      results: [{ question: '3 x 7', correct: true }],
    }
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should start with blinking animation enabled', () => {
    const { container } = render(
      <MemoryRouter>
        <GameResultsPage />
      </MemoryRouter>
    )

    const mainContainer = container.firstChild as HTMLElement
    expect(mainContainer.style.animation).toContain('goldFadingBlink')
  })

  it('should stop blinking animation after 5 seconds', () => {
    const { container } = render(
      <MemoryRouter>
        <GameResultsPage />
      </MemoryRouter>
    )

    const mainContainer = container.firstChild as HTMLElement

    // Initially animating
    expect(mainContainer.style.animation).toContain('goldFadingBlink')

    // Fast-forward 5 seconds with act() to ensure React state updates
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    // Animation should be stopped (check after state update)
    expect(mainContainer.style.animation).toBe('none')
  })

  it('should cleanup timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

    const { unmount } = render(
      <MemoryRouter>
        <GameResultsPage />
      </MemoryRouter>
    )

    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
    clearTimeoutSpy.mockRestore()
  })
})
