import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import PlayerSelectPage from './PlayerSelectPage'

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Helper to render component with Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('PlayerSelectPage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    mockNavigate.mockClear()
  })

  it('should render the page title', () => {
    renderWithRouter(<PlayerSelectPage />)
    expect(screen.getByText('⭐ MATH QUEST ⭐')).toBeInTheDocument()
    expect(screen.getByText('Choose Your Player')).toBeInTheDocument()
  })

  it('should display two default players (Jules and Achille)', () => {
    renderWithRouter(<PlayerSelectPage />)
    expect(screen.getByText('Jules')).toBeInTheDocument()
    expect(screen.getByText('Achille')).toBeInTheDocument()
  })

  it('should display keyboard hints via KeyboardHints component', () => {
    renderWithRouter(<PlayerSelectPage />)
    // KeyboardHints component renders these for player-select screen
    expect(screen.getByText('Navigate')).toBeInTheDocument()
    expect(screen.getByText('Select')).toBeInTheDocument()
  })

  it('should show JumpingArrow on first player by default', () => {
    renderWithRouter(<PlayerSelectPage />)
    // JumpingArrow renders '▶' character
    const arrows = screen.getAllByText('▶')
    expect(arrows.length).toBe(1)
  })

  it('should navigate to next player with ArrowDown key', () => {
    renderWithRouter(<PlayerSelectPage />)

    // Press ArrowDown to select second player
    fireEvent.keyDown(window, { key: 'ArrowDown' })

    // The arrow should now be on the second player card
    const achilleCard = screen.getByText('Achille').closest('div')
    expect(achilleCard).toHaveTextContent('▶')
  })

  it('should navigate to previous player with ArrowUp key', () => {
    renderWithRouter(<PlayerSelectPage />)

    // Press ArrowDown first to move to second player
    fireEvent.keyDown(window, { key: 'ArrowDown' })

    // Press ArrowUp to go back to first player
    fireEvent.keyDown(window, { key: 'ArrowUp' })

    const julesCard = screen.getByText('Jules').closest('div')
    expect(julesCard).toHaveTextContent('▶')
  })

  it('should wrap around to last player when pressing ArrowUp at first', () => {
    renderWithRouter(<PlayerSelectPage />)

    // Press ArrowUp when already at first player - should wrap to last
    fireEvent.keyDown(window, { key: 'ArrowUp' })

    const achilleCard = screen.getByText('Achille').closest('div')
    expect(achilleCard).toHaveTextContent('▶')
  })

  it('should wrap around to first player when pressing ArrowDown at last', () => {
    renderWithRouter(<PlayerSelectPage />)

    // Navigate to last player
    fireEvent.keyDown(window, { key: 'ArrowDown' })

    // Press ArrowDown again - should wrap to first
    fireEvent.keyDown(window, { key: 'ArrowDown' })

    const julesCard = screen.getByText('Jules').closest('div')
    expect(julesCard).toHaveTextContent('▶')
  })

  it('should select player and navigate to home on Enter key', () => {
    renderWithRouter(<PlayerSelectPage />)

    // Press Enter to select first player
    fireEvent.keyDown(window, { key: 'Enter' })

    // Should save to localStorage and navigate to /home
    expect(localStorage.getItem('currentPlayer')).toBe('jules')
    expect(mockNavigate).toHaveBeenCalledWith('/home')
  })

  it('should select player on click', () => {
    renderWithRouter(<PlayerSelectPage />)

    // Click on second player
    const achilleCard = screen.getByText('Achille').closest('div')
    if (achilleCard) {
      fireEvent.click(achilleCard)
    }

    // Should save to localStorage and navigate to /home
    expect(localStorage.getItem('currentPlayer')).toBe('achille')
    expect(mockNavigate).toHaveBeenCalledWith('/home')
  })

  it('should initialize default players in localStorage', () => {
    renderWithRouter(<PlayerSelectPage />)

    // Check that players are initialized in localStorage
    const players = JSON.parse(localStorage.getItem('players') || '[]')
    expect(players).toHaveLength(2)
    expect(players[0]).toEqual({ id: 'jules', name: 'Jules' })
    expect(players[1]).toEqual({ id: 'achille', name: 'Achille' })
  })
})
