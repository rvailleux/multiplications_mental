import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import GameSelectPage from './GameSelectPage'
import { MusicProvider } from '../contexts/MusicContext'

// Mock react-router-dom navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock useMusic
vi.mock('../contexts/MusicContext', async () => {
  const actual = await vi.importActual('../contexts/MusicContext')
  return {
    ...actual,
    useMusic: () => ({
      playMainTheme: vi.fn(),
      playGameplayMusic: vi.fn(),
      stopMusic: vi.fn(),
      isPlaying: false,
      currentTrack: null,
      mode: 'menu',
    }),
  }
})

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <MusicProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </MusicProvider>
  )
}

describe('GameSelectPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    localStorage.clear()
    // Set a current player so the redirect guard doesn't trigger
    localStorage.setItem('currentPlayer', 'jules')
    localStorage.setItem(
      'players',
      JSON.stringify([
        { id: 'jules', name: 'Jules' },
        { id: 'achille', name: 'Achille' },
      ])
    )
  })

  it('should render the game selection screen', () => {
    renderWithProviders(<GameSelectPage />)

    expect(screen.getByText('⭐ MATH QUEST ⭐')).toBeInTheDocument()
    expect(screen.getByText('Choose Your Game')).toBeInTheDocument()
  })

  it('should show both game modules', () => {
    renderWithProviders(<GameSelectPage />)

    expect(screen.getByText('MULTIPLICATIONS')).toBeInTheDocument()
    expect(screen.getByText('COMPLÉMENTS')).toBeInTheDocument()
  })

  it('should redirect to player select when no player is selected', () => {
    localStorage.removeItem('currentPlayer')
    renderWithProviders(<GameSelectPage />)

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('should navigate to /home on Enter when multiplications is selected (default)', () => {
    renderWithProviders(<GameSelectPage />)

    fireEvent.keyDown(window, { key: 'Enter' })

    expect(mockNavigate).toHaveBeenCalledWith('/home')
  })

  it('should navigate to /complement10 when complement module is selected and Enter is pressed', () => {
    renderWithProviders(<GameSelectPage />)

    // Navigate down to second option (Compléments)
    fireEvent.keyDown(window, { key: 'ArrowDown' })
    // Confirm selection
    fireEvent.keyDown(window, { key: 'Enter' })

    expect(mockNavigate).toHaveBeenCalledWith('/complement10')
  })

  it('should navigate to player select on ESC', () => {
    renderWithProviders(<GameSelectPage />)

    fireEvent.keyDown(window, { key: 'Escape' })

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('should navigate to /home when multiplications card is clicked', () => {
    renderWithProviders(<GameSelectPage />)

    const multiCard = screen.getByText('MULTIPLICATIONS').closest('[class*="moduleCard"]')
    expect(multiCard).not.toBeNull()
    fireEvent.click(multiCard!)

    expect(mockNavigate).toHaveBeenCalledWith('/home')
  })

  it('should navigate to /complement10 when complement card is clicked', () => {
    renderWithProviders(<GameSelectPage />)

    const complementCard = screen.getByText('COMPLÉMENTS').closest('[class*="moduleCard"]')
    expect(complementCard).not.toBeNull()
    fireEvent.click(complementCard!)

    expect(mockNavigate).toHaveBeenCalledWith('/complement10')
  })

  it('should show keyboard hints', () => {
    renderWithProviders(<GameSelectPage />)

    expect(screen.getByText('↑↓')).toBeInTheDocument()
    expect(screen.getByText('Navigate')).toBeInTheDocument()
  })

  it('should navigate up with ArrowUp key (cyclic wrapping)', () => {
    renderWithProviders(<GameSelectPage />)

    // From first item (Multiplications), ArrowUp wraps to last (Compléments)
    fireEvent.keyDown(window, { key: 'ArrowUp' })
    fireEvent.keyDown(window, { key: 'Enter' })

    expect(mockNavigate).toHaveBeenCalledWith('/complement10')
  })
})
