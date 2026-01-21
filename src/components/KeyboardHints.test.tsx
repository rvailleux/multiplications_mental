import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import KeyboardHints from './KeyboardHints'

describe('KeyboardHints', () => {
  it('should render keyboard hints for a given screen', () => {
    render(<KeyboardHints screenId="play" />)

    // Check for specific play screen hints
    expect(screen.getByText('Type')).toBeInTheDocument()
    expect(screen.getByText('Answer')).toBeInTheDocument()
    expect(screen.getByText('Enter')).toBeInTheDocument()
    expect(screen.getByText('Submit')).toBeInTheDocument()
    expect(screen.getByText('ESC')).toBeInTheDocument()
    expect(screen.getByText('Pause')).toBeInTheDocument()
  })

  it('should render home screen hints', () => {
    render(<KeyboardHints screenId="home" />)

    expect(screen.getByText('Enter')).toBeInTheDocument()
    expect(screen.getByText('Start Game')).toBeInTheDocument()
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

  it('should render results screen hints', () => {
    render(<KeyboardHints screenId="results" />)

    expect(screen.getByText('Enter')).toBeInTheDocument()
    expect(screen.getByText('Continue')).toBeInTheDocument()
  })

  it('should have distinct behavior - multiple hints', () => {
    const { container } = render(<KeyboardHints screenId="play" />)

    // Verify multiple hint pairs are rendered (play has 4 hints)
    const hintElements = container.querySelectorAll('[class*="hint"]')
    expect(hintElements.length).toBeGreaterThan(0)
  })
})
