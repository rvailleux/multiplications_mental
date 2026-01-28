import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { MusicProvider } from '../contexts/MusicContext'
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

// Mock Audio for MusicContext
vi.stubGlobal(
  'Audio',
  class {
    play = vi.fn().mockResolvedValue(undefined)
    pause = vi.fn()
    addEventListener = vi.fn()
    removeEventListener = vi.fn()
    currentTime = 0
    volume = 1
    loop = false
    src = ''
  }
)

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

// Helper to render with MusicProvider
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MusicProvider>
      <MemoryRouter>{component}</MemoryRouter>
    </MusicProvider>
  )
}

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
    renderWithProviders(<GameResultsPage />)
    expect(screen.getByText(/500/)).toBeInTheDocument()
  })

  it('should calculate and display correct answer count', () => {
    renderWithProviders(<GameResultsPage />)
    // 4 correct out of 5 total
    expect(screen.getByText(/4\/5/)).toBeInTheDocument()
  })

  it('should calculate and display total questions count', () => {
    renderWithProviders(<GameResultsPage />)
    // Verify 5 total questions are reflected
    expect(screen.getByText(/\/5/)).toBeInTheDocument()
  })

  it('should calculate accuracy percentage (rounded integer)', () => {
    renderWithProviders(<GameResultsPage />)
    // 4/5 = 80%
    expect(screen.getByText(/80%/)).toBeInTheDocument()
  })

  it('should calculate and display speed (average time per correct answer)', () => {
    renderWithProviders(<GameResultsPage />)
    // 4 correct answers, 60 seconds total: 60/4 = 15.0"
    expect(screen.getByText(/Speed: 15\.0"/)).toBeInTheDocument()
  })

  it('should display 0% accuracy when no questions answered', () => {
    mockLocationState = {
      score: 0,
      results: [],
    }

    renderWithProviders(<GameResultsPage />)
    expect(screen.getByText(/0%/)).toBeInTheDocument()
  })

  it('should display player name in top-right corner', () => {
    renderWithProviders(<GameResultsPage />)
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

    renderWithProviders(<GameResultsPage />)
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

    renderWithProviders(<GameResultsPage />)
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

    renderWithProviders(<GameResultsPage />)
    expect(screen.getByText(/100%/)).toBeInTheDocument()
  })

  it('should handle missing route state gracefully', () => {
    mockLocationState = undefined

    renderWithProviders(<GameResultsPage />)
    // Should fallback to 0 score and empty results
    expect(screen.getByText(/0\/0/)).toBeInTheDocument()
  })

  it('should display "-" for speed when no correct answers', () => {
    mockLocationState = {
      score: 0,
      results: [
        { question: '3 x 7', correct: false },
        { question: '5 x 8', correct: false },
      ],
    }

    renderWithProviders(<GameResultsPage />)
    // When zero correct answers, speed should show "-"
    expect(screen.getByText(/Speed: -/)).toBeInTheDocument()
  })

  it('should calculate speed with single correct answer', () => {
    mockLocationState = {
      score: 100,
      results: [
        { question: '3 x 7', correct: true },
        { question: '5 x 8', correct: false },
      ],
    }

    renderWithProviders(<GameResultsPage />)
    // 1 correct answer in 60 seconds: 60/1 = 60.0"
    expect(screen.getByText(/Speed: 60\.0"/)).toBeInTheDocument()
  })

  it('should display speed with one decimal place', () => {
    mockLocationState = {
      score: 300,
      results: [
        { question: '3 x 7', correct: true },
        { question: '5 x 8', correct: true },
        { question: '2 x 9', correct: true },
      ],
    }

    renderWithProviders(<GameResultsPage />)
    // 3 correct answers in 60 seconds: 60/3 = 20.0"
    expect(screen.getByText(/Speed: 20\.0"/)).toBeInTheDocument()
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
    renderWithProviders(<GameResultsPage />)

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' })
    window.dispatchEvent(enterEvent)

    expect(mockNavigate).toHaveBeenCalledWith('/home')
  })

  it('should cleanup keyboard event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = renderWithProviders(<GameResultsPage />)

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    removeEventListenerSpy.mockRestore()
  })

  it('should ignore non-navigation keys', () => {
    renderWithProviders(<GameResultsPage />)

    mockNavigate.mockClear()

    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' })
    window.dispatchEvent(spaceEvent)

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
    renderWithProviders(<GameResultsPage />)

    const continueButton = screen.getByRole('button', { name: /continue/i })
    fireEvent.click(continueButton)

    expect(mockNavigate).toHaveBeenCalledWith('/home')
  })
})

describe('GameResultsPage - Jumping Arrow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocationState = {
      score: 500,
      results: [{ question: '3 x 7', correct: true }],
    }
  })

  it('should display jumping arrow next to Continue button', () => {
    renderWithProviders(<GameResultsPage />)

    // Arrow symbol should be visible
    expect(screen.getByText('▶')).toBeInTheDocument()
  })

  it('should navigate to player select when Escape key is pressed', () => {
    renderWithProviders(<GameResultsPage />)

    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
    window.dispatchEvent(escapeEvent)

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('should keep arrow visible when arrow keys are pressed (single option)', () => {
    renderWithProviders(<GameResultsPage />)

    // Arrow keys should do nothing gracefully (single option)
    const arrowDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' })
    window.dispatchEvent(arrowDownEvent)

    const arrowUpEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' })
    window.dispatchEvent(arrowUpEvent)

    // Arrow should still be visible (no crash, no error)
    expect(screen.getByText('▶')).toBeInTheDocument()
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
    const { container } = renderWithProviders(<GameResultsPage />)

    const mainContainer = container.firstChild as HTMLElement
    // Check for CSS Module class instead of inline style
    expect(mainContainer.className).toContain('blinking')
  })

  it('should stop blinking animation after 5 seconds', () => {
    const { container } = renderWithProviders(<GameResultsPage />)

    const mainContainer = container.firstChild as HTMLElement

    // Initially animating - check for CSS Module class instead of inline style
    expect(mainContainer.className).toContain('blinking')

    // Fast-forward 5 seconds with act() to ensure React state updates
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    // Animation should be stopped - blinking class should be removed
    expect(mainContainer.className).not.toContain('blinking')
  })

  it('should cleanup timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

    const { unmount } = renderWithProviders(<GameResultsPage />)

    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
    clearTimeoutSpy.mockRestore()
  })
})
