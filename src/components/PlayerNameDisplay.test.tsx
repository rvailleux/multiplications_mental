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

  it('should have correct styling structure with fixed positioning', () => {
    const player = { id: 'jules', name: 'Jules' }
    const { container } = render(<PlayerNameDisplay player={player} />)
    const playerNameDiv = container.firstChild as HTMLElement
    expect(playerNameDiv).toHaveStyle({ position: 'fixed' })
  })

  it('should match retro styling with pixel border and gradient', () => {
    const player = { id: 'jules', name: 'Jules' }
    const { container } = render(<PlayerNameDisplay player={player} />)
    const playerNameDiv = container.firstChild as HTMLElement
    expect(playerNameDiv).toHaveStyle({
      border: '4px solid #000',
    })
  })

  it('should have text shadow for depth effect', () => {
    const player = { id: 'jules', name: 'Jules' }
    render(<PlayerNameDisplay player={player} />)
    const textSpan = screen.getByText('Jules')
    expect(textSpan).toHaveStyle({
      textShadow: '2px 2px 0 #000',
    })
  })

  it('should handle long player names with ellipsis truncation', () => {
    const player = { id: 'test', name: 'VeryLongPlayerNameThatExceedsMaxWidth' }
    render(<PlayerNameDisplay player={player} />)
    // React renders full text, CSS truncates visually
    expect(screen.getByText('VeryLongPlayerNameThatExceedsMaxWidth')).toBeInTheDocument()
    const textSpan = screen.getByText('VeryLongPlayerNameThatExceedsMaxWidth')
    expect(textSpan).toHaveStyle({
      maxWidth: '200px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    })
  })

  it('should handle special characters and emojis', () => {
    const player = { id: 'test', name: '日本語 🎮' }
    render(<PlayerNameDisplay player={player} />)
    expect(screen.getByText('日本語 🎮')).toBeInTheDocument()
  })
})
