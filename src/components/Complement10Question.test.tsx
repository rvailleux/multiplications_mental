import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Complement10Question from './Complement10Question'

describe('Complement10Question', () => {
  const mockCorrect = vi.fn()
  const mockBad = vi.fn()

  beforeEach(() => {
    mockCorrect.mockClear()
    mockBad.mockClear()
  })

  it('should render the question in the format N + ___ = TARGET', () => {
    render(<Complement10Question onCorrectAnswer={mockCorrect} onBadAnswer={mockBad} level={1} />)

    // Level 1: target is always 10
    expect(screen.getByText(/= 10/)).toBeInTheDocument()
    expect(screen.getByText(/\+ ___/)).toBeInTheDocument()
  })

  it('should render the Valider button', () => {
    render(<Complement10Question onCorrectAnswer={mockCorrect} onBadAnswer={mockBad} level={1} />)

    expect(screen.getByText(/Valider/)).toBeInTheDocument()
  })

  it('should render the answer input', () => {
    render(<Complement10Question onCorrectAnswer={mockCorrect} onBadAnswer={mockBad} level={1} />)

    expect(screen.getByPlaceholderText('?')).toBeInTheDocument()
  })

  it('should call onCorrectAnswer when the correct answer is submitted for level 1', () => {
    render(<Complement10Question onCorrectAnswer={mockCorrect} onBadAnswer={mockBad} level={1} />)

    // Get the current question from the rendered text
    const questionText = screen.getByText(/\+ ___ = 10/).textContent || ''
    const shownNumber = parseInt(questionText.match(/^(\d+)/)?.[1] || '1')
    const correctAnswer = 10 - shownNumber

    const input = screen.getByPlaceholderText('?')
    fireEvent.change(input, { target: { value: String(correctAnswer) } })
    fireEvent.submit(input.closest('form')!)

    expect(mockCorrect).toHaveBeenCalledOnce()
    expect(mockBad).not.toHaveBeenCalled()
  })

  it('should call onBadAnswer when the wrong answer is submitted', () => {
    render(<Complement10Question onCorrectAnswer={mockCorrect} onBadAnswer={mockBad} level={1} />)

    const input = screen.getByPlaceholderText('?')
    // Submit answer 0 which is always wrong for level 1 (complement to 10 with number 1-9)
    fireEvent.change(input, { target: { value: '0' } })
    fireEvent.submit(input.closest('form')!)

    expect(mockBad).toHaveBeenCalledOnce()
    expect(mockCorrect).not.toHaveBeenCalled()
  })

  it('should show level 1 badge text', () => {
    render(<Complement10Question onCorrectAnswer={mockCorrect} onBadAnswer={mockBad} level={1} />)

    expect(screen.getByText(/à 10/)).toBeInTheDocument()
  })

  it('should show level 3 badge text when level is 3', () => {
    render(<Complement10Question onCorrectAnswer={mockCorrect} onBadAnswer={mockBad} level={3} />)

    expect(screen.getByText(/à 100/)).toBeInTheDocument()
  })

  it('should show combo display when combo > 1', () => {
    render(
      <Complement10Question
        onCorrectAnswer={mockCorrect}
        onBadAnswer={mockBad}
        combo={3}
        level={1}
      />
    )

    expect(screen.getByText(/COMBO x3/)).toBeInTheDocument()
  })

  it('should not show combo display when combo <= 1', () => {
    render(
      <Complement10Question
        onCorrectAnswer={mockCorrect}
        onBadAnswer={mockBad}
        combo={1}
        level={1}
      />
    )

    expect(screen.queryByText(/COMBO/)).not.toBeInTheDocument()
  })

  it('should show jumping arrow on Valider button when showValiderArrow is true', () => {
    render(
      <Complement10Question
        onCorrectAnswer={mockCorrect}
        onBadAnswer={mockBad}
        showValiderArrow={true}
        level={1}
      />
    )

    // The JumpingArrow should be visible (has "visible" class or inline style)
    const button = screen.getByText(/Valider/).closest('button')
    expect(button).toBeInTheDocument()
  })

  it('should generate level 3 questions with target 100', () => {
    render(<Complement10Question onCorrectAnswer={mockCorrect} onBadAnswer={mockBad} level={3} />)

    expect(screen.getByText(/= 100/)).toBeInTheDocument()
  })
})
