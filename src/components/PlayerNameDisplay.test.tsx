import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PlayerNameDisplay from './PlayerNameDisplay'

describe('PlayerNameDisplay', () => {
  it('should render player name when player exists', () => {
    const player = { id: 'jules', name: 'Jules' }
    render(<PlayerNameDisplay player={player} />)
    expect(screen.getByText('Jules')).toBeInTheDocument()
  })

  it('should render nothing when player is null', () => {
    const { container } = render(<PlayerNameDisplay player={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render player name with different player', () => {
    const player = { id: 'achille', name: 'Achille' }
    render(<PlayerNameDisplay player={player} />)
    expect(screen.getByText('Achille')).toBeInTheDocument()
  })

  it('should have correct styling structure with CSS Modules', () => {
    const player = { id: 'jules', name: 'Jules' }
    const { container } = render(<PlayerNameDisplay player={player} />)
    const playerNameDiv = container.firstChild as HTMLElement
    // Verify CSS Module class is applied (styles are in .module.scss)
    expect(playerNameDiv.className).toContain('playerNameContainer')
    expect(playerNameDiv.className).toContain('player-name-display')
  })

  it('should match retro styling with CSS Modules', () => {
    const player = { id: 'jules', name: 'Jules' }
    const { container } = render(<PlayerNameDisplay player={player} />)
    const playerNameDiv = container.firstChild as HTMLElement
    // Verify CSS Module classes are applied (styles defined in SCSS)
    expect(playerNameDiv.className).toContain('playerNameContainer')
  })

  it('should have text styling via CSS Modules', () => {
    const player = { id: 'jules', name: 'Jules' }
    render(<PlayerNameDisplay player={player} />)
    const textSpan = screen.getByText('Jules')
    // Verify CSS Module class is applied
    expect(textSpan.className).toContain('playerNameText')
  })

  it('should handle long player names with ellipsis truncation', () => {
    const player = { id: 'test', name: 'VeryLongPlayerNameThatExceedsMaxWidth' }
    render(<PlayerNameDisplay player={player} />)
    // React renders full text, CSS truncates visually via CSS Modules
    expect(screen.getByText('VeryLongPlayerNameThatExceedsMaxWidth')).toBeInTheDocument()
    const textSpan = screen.getByText('VeryLongPlayerNameThatExceedsMaxWidth')
    // Verify truncation styles are applied via CSS Module
    expect(textSpan.className).toContain('playerNameText')
  })

  it('should handle special characters and emojis', () => {
    const player = { id: 'test', name: '日本語 🎮' }
    render(<PlayerNameDisplay player={player} />)
    expect(screen.getByText('日本語 🎮')).toBeInTheDocument()
  })

  // === User Story 1: Click Navigation Tests (T006-T008) ===

  describe('onClick behavior', () => {
    it('T006: should call onClick when clicked', () => {
      const player = { id: 'jules', name: 'Jules' }
      const handleClick = vi.fn()
      render(<PlayerNameDisplay player={player} onClick={handleClick} />)

      const container = screen.getByRole('button')
      fireEvent.click(container)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('T007: should NOT call onClick when not provided (display-only mode)', () => {
      const player = { id: 'jules', name: 'Jules' }
      const { container } = render(<PlayerNameDisplay player={player} />)

      const playerDiv = container.firstChild as HTMLElement
      // Verify no role="button" when not clickable
      expect(playerDiv.getAttribute('role')).toBeNull()
      // Verify no tabIndex when not clickable
      expect(playerDiv.getAttribute('tabIndex')).toBeNull()
    })

    it('T008: should trigger onClick on keyboard Enter press', () => {
      const player = { id: 'jules', name: 'Jules' }
      const handleClick = vi.fn()
      render(<PlayerNameDisplay player={player} onClick={handleClick} />)

      const container = screen.getByRole('button')
      fireEvent.keyDown(container, { key: 'Enter' })

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should NOT trigger onClick on other keyboard keys', () => {
      const player = { id: 'jules', name: 'Jules' }
      const handleClick = vi.fn()
      render(<PlayerNameDisplay player={player} onClick={handleClick} />)

      const container = screen.getByRole('button')
      fireEvent.keyDown(container, { key: 'Space' })
      fireEvent.keyDown(container, { key: 'Escape' })
      fireEvent.keyDown(container, { key: 'ArrowDown' })

      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  // === User Story 2: Visual Feedback Tests (T019-T020) ===

  describe('visual feedback', () => {
    it('T019: should have clickable class when onClick provided', () => {
      const player = { id: 'jules', name: 'Jules' }
      const handleClick = vi.fn()
      const { container } = render(<PlayerNameDisplay player={player} onClick={handleClick} />)

      const playerDiv = container.firstChild as HTMLElement
      expect(playerDiv.className).toContain('clickable')
    })

    it('T020: should NOT have clickable class when onClick NOT provided', () => {
      const player = { id: 'jules', name: 'Jules' }
      const { container } = render(<PlayerNameDisplay player={player} />)

      const playerDiv = container.firstChild as HTMLElement
      expect(playerDiv.className).not.toContain('clickable')
    })

    it('should have role="button" when onClick provided', () => {
      const player = { id: 'jules', name: 'Jules' }
      const handleClick = vi.fn()
      render(<PlayerNameDisplay player={player} onClick={handleClick} />)

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should have tabIndex={0} when onClick provided for keyboard focus', () => {
      const player = { id: 'jules', name: 'Jules' }
      const handleClick = vi.fn()
      render(<PlayerNameDisplay player={player} onClick={handleClick} />)

      const button = screen.getByRole('button')
      expect(button.getAttribute('tabIndex')).toBe('0')
    })
  })

  // === User Story 3: Touch Support Test (T027) ===

  describe('touch support', () => {
    it('T027: should fire onClick on click event (unified mouse/touch behavior)', () => {
      // React's onClick handles both mouse clicks and touch taps
      const player = { id: 'jules', name: 'Jules' }
      const handleClick = vi.fn()
      render(<PlayerNameDisplay player={player} onClick={handleClick} />)

      const container = screen.getByRole('button')
      // Standard click event works for both mouse and touch
      fireEvent.click(container)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })
})
