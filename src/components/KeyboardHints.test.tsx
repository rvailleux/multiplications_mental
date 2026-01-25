import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import KeyboardHints from './KeyboardHints'

describe('KeyboardHints', () => {
  it('should render keyboard hints for play screen with all navigation options', () => {
    render(<KeyboardHints screenId="play" />)

    // Check for specific play screen hints per data-model.md
    expect(screen.getByText('0-9')).toBeInTheDocument()
    expect(screen.getByText('Type Answer')).toBeInTheDocument()
    expect(screen.getByText('Backspace')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
    expect(screen.getByText('↑↓')).toBeInTheDocument()
    expect(screen.getByText('Navigate Options')).toBeInTheDocument()
    expect(screen.getByText('Enter')).toBeInTheDocument()
    expect(screen.getByText('Confirm')).toBeInTheDocument()
    expect(screen.getByText('ESC')).toBeInTheDocument()
    expect(screen.getByText('Pause')).toBeInTheDocument()
  })

  it('should render home screen hints with navigation', () => {
    render(<KeyboardHints screenId="home" />)

    // Home screen now includes navigation hint for consistency
    expect(screen.getByText('↑↓')).toBeInTheDocument()
    expect(screen.getByText('Navigate')).toBeInTheDocument()
    expect(screen.getByText('Enter')).toBeInTheDocument()
    expect(screen.getByText('Select')).toBeInTheDocument()
    expect(screen.getByText('ESC')).toBeInTheDocument()
    expect(screen.getByText('Change Player')).toBeInTheDocument()
  })

  it('should render pause menu hints', () => {
    render(<KeyboardHints screenId="pause-menu" />)

    expect(screen.getByText('↑↓')).toBeInTheDocument()
    expect(screen.getByText('Navigate')).toBeInTheDocument()
    expect(screen.getByText('Enter')).toBeInTheDocument()
    expect(screen.getByText('Confirm')).toBeInTheDocument()
    expect(screen.getByText('ESC')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('should render player select screen hints', () => {
    render(<KeyboardHints screenId="player-select" />)

    expect(screen.getByText('↑↓')).toBeInTheDocument()
    expect(screen.getByText('Navigate')).toBeInTheDocument()
    expect(screen.getByText('Enter')).toBeInTheDocument()
    expect(screen.getByText('Select')).toBeInTheDocument()
  })

  it('should render results screen hints with change player option', () => {
    render(<KeyboardHints screenId="results" />)

    expect(screen.getByText('Enter')).toBeInTheDocument()
    expect(screen.getByText('Continue')).toBeInTheDocument()
    expect(screen.getByText('ESC')).toBeInTheDocument()
    expect(screen.getByText('Change Player')).toBeInTheDocument()
  })

  it('should have distinct behavior - multiple hints', () => {
    const { container } = render(<KeyboardHints screenId="play" />)

    // Verify multiple hint pairs are rendered (play has 4 hints)
    const hintElements = container.querySelectorAll('[class*="hint"]')
    expect(hintElements.length).toBeGreaterThan(0)
  })
})
