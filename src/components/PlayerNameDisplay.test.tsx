import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
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
})
