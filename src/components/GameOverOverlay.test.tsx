import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import GameOverOverlay from './GameOverOverlay'

describe('GameOverOverlay', () => {
  const mockOnAnimationComplete = vi.fn()

  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Visibility', () => {
    it('should render overlay when isVisible is true', () => {
      render(<GameOverOverlay isVisible={true} onAnimationComplete={mockOnAnimationComplete} />)
      expect(screen.getByTestId('game-over-overlay')).toBeInTheDocument()
    })

    it('should not render when isVisible is false', () => {
      const { container } = render(
        <GameOverOverlay isVisible={false} onAnimationComplete={mockOnAnimationComplete} />
      )
      expect(container.firstChild).toBeNull()
    })

    it('should display "GAME OVER" text', () => {
      render(<GameOverOverlay isVisible={true} onAnimationComplete={mockOnAnimationComplete} />)
      expect(screen.getByText(/GAME OVER/i)).toBeInTheDocument()
    })

    it('should display "No Lives Remaining" subtitle', () => {
      render(<GameOverOverlay isVisible={true} onAnimationComplete={mockOnAnimationComplete} />)
      expect(screen.getByText(/No Lives Remaining/i)).toBeInTheDocument()
    })
  })

  describe('Auto-navigation Timer', () => {
    it('should call onAnimationComplete after 1.5 seconds', () => {
      render(<GameOverOverlay isVisible={true} onAnimationComplete={mockOnAnimationComplete} />)

      expect(mockOnAnimationComplete).not.toHaveBeenCalled()

      act(() => {
        vi.advanceTimersByTime(1500)
      })

      expect(mockOnAnimationComplete).toHaveBeenCalledTimes(1)
    })

    it('should not call onAnimationComplete before 1.5 seconds', () => {
      render(<GameOverOverlay isVisible={true} onAnimationComplete={mockOnAnimationComplete} />)

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(mockOnAnimationComplete).not.toHaveBeenCalled()
    })

    it('should not start timer when isVisible is false', () => {
      render(<GameOverOverlay isVisible={false} onAnimationComplete={mockOnAnimationComplete} />)

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      expect(mockOnAnimationComplete).not.toHaveBeenCalled()
    })

    it('should cleanup timer on unmount', () => {
      const { unmount } = render(
        <GameOverOverlay isVisible={true} onAnimationComplete={mockOnAnimationComplete} />
      )

      unmount()

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      expect(mockOnAnimationComplete).not.toHaveBeenCalled()
    })

    it('should restart timer when component becomes visible', () => {
      const { rerender } = render(
        <GameOverOverlay isVisible={false} onAnimationComplete={mockOnAnimationComplete} />
      )

      // Make it visible
      rerender(<GameOverOverlay isVisible={true} onAnimationComplete={mockOnAnimationComplete} />)

      act(() => {
        vi.advanceTimersByTime(1500)
      })

      expect(mockOnAnimationComplete).toHaveBeenCalledTimes(1)
    })
  })

  describe('Styling', () => {
    it('should have overlay styling with correct test ID', () => {
      render(<GameOverOverlay isVisible={true} onAnimationComplete={mockOnAnimationComplete} />)
      const overlay = screen.getByTestId('game-over-overlay')
      expect(overlay).toBeInTheDocument()
    })

    it('should have content container with correct test ID', () => {
      render(<GameOverOverlay isVisible={true} onAnimationComplete={mockOnAnimationComplete} />)
      const content = screen.getByTestId('game-over-content')
      expect(content).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<GameOverOverlay isVisible={true} onAnimationComplete={mockOnAnimationComplete} />)
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent(/GAME OVER/i)
    })

    it('should have aria-live for screen readers', () => {
      render(<GameOverOverlay isVisible={true} onAnimationComplete={mockOnAnimationComplete} />)
      const overlay = screen.getByTestId('game-over-overlay')
      expect(overlay).toHaveAttribute('aria-live', 'assertive')
    })
  })

  describe('Edge Cases', () => {
    it('should only call onAnimationComplete once', () => {
      render(<GameOverOverlay isVisible={true} onAnimationComplete={mockOnAnimationComplete} />)

      act(() => {
        vi.advanceTimersByTime(3000) // Advance well past the 1.5s threshold
      })

      expect(mockOnAnimationComplete).toHaveBeenCalledTimes(1)
    })

    it('should handle rapid visibility toggles gracefully', () => {
      const { rerender } = render(
        <GameOverOverlay isVisible={true} onAnimationComplete={mockOnAnimationComplete} />
      )

      act(() => {
        vi.advanceTimersByTime(500)
      })

      rerender(<GameOverOverlay isVisible={false} onAnimationComplete={mockOnAnimationComplete} />)

      rerender(<GameOverOverlay isVisible={true} onAnimationComplete={mockOnAnimationComplete} />)

      act(() => {
        vi.advanceTimersByTime(1500)
      })

      expect(mockOnAnimationComplete).toHaveBeenCalledTimes(1)
    })
  })
})
