import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import MultiplicationQuestion from './MultiplicationQuestion'

describe('MultiplicationQuestion', () => {
  const mockOnCorrectAnswer = vi.fn()
  const mockOnBadAnswer = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders a multiplication question', () => {
    render(
      <MultiplicationQuestion onCorrectAnswer={mockOnCorrectAnswer} onBadAnswer={mockOnBadAnswer} />
    )

    // Should show a multiplication question format
    expect(screen.getByText(/\d+ x \d+\?/)).toBeInTheDocument()
    expect(screen.getByRole('spinbutton')).toBeInTheDocument()
    expect(screen.getByText('✓ Valider')).toBeInTheDocument()
  })

  it('calls onCorrectAnswer when answer is correct', () => {
    render(
      <MultiplicationQuestion onCorrectAnswer={mockOnCorrectAnswer} onBadAnswer={mockOnBadAnswer} />
    )

    // Get the question text and calculate the answer
    const questionText = screen.getByText(/\d+ x \d+\?/).textContent!
    const [a, b] = questionText.match(/\d+/g)!.map(Number)
    const correctAnswer = a * b

    const input = screen.getByRole('spinbutton')
    const submitButton = screen.getByText('✓ Valider')

    fireEvent.change(input, { target: { value: correctAnswer.toString() } })
    fireEvent.click(submitButton)

    expect(mockOnCorrectAnswer).toHaveBeenCalledWith(`${a} x ${b}`)
    expect(mockOnBadAnswer).not.toHaveBeenCalled()
  })

  it('calls onBadAnswer when answer is incorrect', () => {
    render(
      <MultiplicationQuestion onCorrectAnswer={mockOnCorrectAnswer} onBadAnswer={mockOnBadAnswer} />
    )

    const questionText = screen.getByText(/\d+ x \d+\?/).textContent!
    const [a, b] = questionText.match(/\d+/g)!.map(Number)

    const input = screen.getByRole('spinbutton')
    const submitButton = screen.getByText('✓ Valider')

    fireEvent.change(input, { target: { value: '999' } }) // Definitely wrong
    fireEvent.click(submitButton)

    expect(mockOnBadAnswer).toHaveBeenCalledWith(`${a} x ${b}`)
    expect(mockOnCorrectAnswer).not.toHaveBeenCalled()
  })
})
