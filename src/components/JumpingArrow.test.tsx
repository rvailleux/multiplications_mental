import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import JumpingArrow from './JumpingArrow'

describe('JumpingArrow', () => {
  it('should render arrow when visible', () => {
    render(<JumpingArrow visible={true} />)

    const arrow = screen.getByText('▶')
    expect(arrow).toBeInTheDocument()
  })

  it('should not render arrow when not visible', () => {
    render(<JumpingArrow visible={false} />)

    const arrow = screen.queryByText('▶')
    expect(arrow).not.toBeInTheDocument()
  })

  it('should have jumping arrow styling when visible', () => {
    render(<JumpingArrow visible={true} />)

    const arrow = screen.getByText('▶')
    // Verify the element has a class (CSS Module class name is hashed)
    expect(arrow.className).toBeTruthy()
  })

  it('should render as inline element for text flow', () => {
    render(<JumpingArrow visible={true} />)

    const arrow = screen.getByText('▶')
    // Verify the element exists and has styling class
    expect(arrow).toBeInTheDocument()
    expect(arrow.tagName.toLowerCase()).toBe('span')
  })
})
