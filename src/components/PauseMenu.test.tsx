import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import PauseMenu from './PauseMenu'

describe('PauseMenu', () => {
  const mockOnContinue = vi.fn()
  const mockOnQuit = vi.fn()
  const mockOnToggle = vi.fn()
  const mockOnClose = vi.fn()

  const defaultProps = {
    isPaused: true,
    selectedOption: 'continue' as const,
    onContinue: mockOnContinue,
    onQuit: mockOnQuit,
    onToggle: mockOnToggle,
    onClose: mockOnClose,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render pause menu when isPaused is true', () => {
      render(<PauseMenu {...defaultProps} />)
      expect(screen.getByText(/PAUSE/i)).toBeInTheDocument()
    })

    it('should not render when isPaused is false', () => {
      const { container } = render(<PauseMenu {...defaultProps} isPaused={false} />)
      expect(container.firstChild).toBeNull()
    })

    it('should render both continue and quit options', () => {
      render(<PauseMenu {...defaultProps} />)
      expect(screen.getByText(/Continue/i)).toBeInTheDocument()
      expect(screen.getByText(/Quit/i)).toBeInTheDocument()
    })

    it('should highlight continue option when selected', () => {
      render(<PauseMenu {...defaultProps} selectedOption="continue" />)
      const continueButton = screen.getByText(/Continue/i).closest('button')
      const quitButton = screen.getByText(/Quit/i).closest('button')

      expect(continueButton?.className).toContain('selected')
      expect(quitButton?.className).not.toContain('selected')
    })

    it('should highlight quit option when selected', () => {
      render(<PauseMenu {...defaultProps} selectedOption="quit" />)
      const continueButton = screen.getByText(/Continue/i).closest('button')
      const quitButton = screen.getByText(/Quit/i).closest('button')

      expect(continueButton?.className).not.toContain('selected')
      expect(quitButton?.className).toContain('selected')
    })

    it('should have correct styling structure with CSS Modules', () => {
      render(<PauseMenu {...defaultProps} />)
      const overlay = screen.getByTestId('pause-overlay')
      const menuContainer = screen.getByTestId('pause-menu-container')

      expect(overlay).toBeInTheDocument()
      expect(menuContainer).toBeInTheDocument()
    })
  })

  describe('Keyboard Navigation', () => {
    it('should toggle option when ArrowDown is pressed', () => {
      render(<PauseMenu {...defaultProps} />)
      fireEvent.keyDown(window, { key: 'ArrowDown' })
      expect(mockOnToggle).toHaveBeenCalledTimes(1)
    })

    it('should toggle option when ArrowUp is pressed', () => {
      render(<PauseMenu {...defaultProps} />)
      fireEvent.keyDown(window, { key: 'ArrowUp' })
      expect(mockOnToggle).toHaveBeenCalledTimes(1)
    })

    it('should call onContinue when Enter is pressed with continue selected', () => {
      render(<PauseMenu {...defaultProps} selectedOption="continue" />)
      fireEvent.keyDown(window, { key: 'Enter' })
      expect(mockOnContinue).toHaveBeenCalledTimes(1)
      expect(mockOnQuit).not.toHaveBeenCalled()
    })

    it('should call onQuit when Enter is pressed with quit selected', () => {
      render(<PauseMenu {...defaultProps} selectedOption="quit" />)
      fireEvent.keyDown(window, { key: 'Enter' })
      expect(mockOnQuit).toHaveBeenCalledTimes(1)
      expect(mockOnContinue).not.toHaveBeenCalled()
    })

    it('should call onClose when Escape is pressed', () => {
      render(<PauseMenu {...defaultProps} />)
      fireEvent.keyDown(window, { key: 'Escape' })
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should prevent default behavior for navigation keys', () => {
      render(<PauseMenu {...defaultProps} />)
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
      window.dispatchEvent(event)
      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('should not handle keyboard events when not paused', () => {
      render(<PauseMenu {...defaultProps} isPaused={false} />)
      fireEvent.keyDown(window, { key: 'ArrowDown' })
      expect(mockOnToggle).not.toHaveBeenCalled()
    })

    it('should cleanup keyboard event listeners on unmount', () => {
      const { unmount } = render(<PauseMenu {...defaultProps} />)
      unmount()
      fireEvent.keyDown(window, { key: 'ArrowDown' })
      expect(mockOnToggle).not.toHaveBeenCalled()
    })
  })

  describe('Mouse Interactions', () => {
    it('should call onContinue when continue button is clicked', () => {
      render(<PauseMenu {...defaultProps} />)
      const continueButton = screen.getByText(/Continue/i).closest('button')
      fireEvent.click(continueButton!)
      expect(mockOnContinue).toHaveBeenCalledTimes(1)
    })

    it('should call onQuit when quit button is clicked', () => {
      render(<PauseMenu {...defaultProps} />)
      const quitButton = screen.getByText(/Quit/i).closest('button')
      fireEvent.click(quitButton!)
      expect(mockOnQuit).toHaveBeenCalledTimes(1)
    })

    it('should call onClose when clicking outside the menu (overlay)', () => {
      render(<PauseMenu {...defaultProps} />)
      const overlay = screen.getByTestId('pause-overlay')
      fireEvent.click(overlay)
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should not close when clicking inside the menu', () => {
      render(<PauseMenu {...defaultProps} />)
      const menuContainer = screen.getByTestId('pause-menu-container')
      fireEvent.click(menuContainer)
      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('should have proper button roles', () => {
      render(<PauseMenu {...defaultProps} />)
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(2)
    })

    it('should have descriptive button text', () => {
      render(<PauseMenu {...defaultProps} />)
      expect(screen.getByText(/Continue/i)).toBeInTheDocument()
      expect(screen.getByText(/Quit/i)).toBeInTheDocument()
    })

    it('should show visual feedback for selected option', () => {
      render(<PauseMenu {...defaultProps} selectedOption="continue" />)
      const continueButton = screen.getByText(/Continue/i).closest('button')
      expect(continueButton?.className).toContain('selected')
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid key presses gracefully', () => {
      render(<PauseMenu {...defaultProps} />)
      fireEvent.keyDown(window, { key: 'ArrowDown' })
      fireEvent.keyDown(window, { key: 'ArrowDown' })
      fireEvent.keyDown(window, { key: 'ArrowDown' })
      expect(mockOnToggle).toHaveBeenCalledTimes(3)
    })

    it('should handle rapid Enter key presses', () => {
      render(<PauseMenu {...defaultProps} selectedOption="continue" />)
      fireEvent.keyDown(window, { key: 'Enter' })
      fireEvent.keyDown(window, { key: 'Enter' })
      expect(mockOnContinue).toHaveBeenCalledTimes(2)
    })

    it('should ignore non-navigation keys', () => {
      render(<PauseMenu {...defaultProps} />)
      fireEvent.keyDown(window, { key: 'a' })
      fireEvent.keyDown(window, { key: '1' })
      fireEvent.keyDown(window, { key: 'Space' })
      expect(mockOnToggle).not.toHaveBeenCalled()
      expect(mockOnContinue).not.toHaveBeenCalled()
      expect(mockOnQuit).not.toHaveBeenCalled()
      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })
})
