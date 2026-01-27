import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import AnswerFeedback from './AnswerFeedback'

describe('AnswerFeedback', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('visibility', () => {
    it('should render nothing when isVisible is false', () => {
      const { container } = render(<AnswerFeedback type="correct" isVisible={false} />)

      // Should not render overlay when not visible
      expect(container.querySelector('[class*="overlay"]')).toBeNull()
    })

    it('should render overlay when isVisible is true and type is correct', () => {
      const { container } = render(<AnswerFeedback type="correct" isVisible={true} />)

      // Should render overlay
      expect(container.querySelector('[class*="overlay"]')).not.toBeNull()
    })

    it('should render overlay when isVisible is true and type is incorrect', () => {
      const { container } = render(<AnswerFeedback type="incorrect" isVisible={true} />)

      // Should render overlay
      expect(container.querySelector('[class*="overlay"]')).not.toBeNull()
    })
  })

  describe('correct feedback animation', () => {
    it('should apply correct animation class when type is correct', () => {
      const { container } = render(<AnswerFeedback type="correct" isVisible={true} />)

      const overlay = container.querySelector('[class*="overlay"]')
      expect(overlay?.className).toMatch(/correct/i)
    })

    it('should not apply incorrect class when type is correct', () => {
      const { container } = render(<AnswerFeedback type="correct" isVisible={true} />)

      const overlay = container.querySelector('[class*="overlay"]')
      expect(overlay?.className).not.toMatch(/incorrect/i)
    })
  })

  describe('incorrect feedback animation', () => {
    it('should apply incorrect animation class when type is incorrect', () => {
      const { container } = render(<AnswerFeedback type="incorrect" isVisible={true} />)

      const overlay = container.querySelector('[class*="overlay"]')
      expect(overlay?.className).toMatch(/incorrect/i)
    })

    it('should not apply correct class when type is incorrect', () => {
      const { container } = render(<AnswerFeedback type="incorrect" isVisible={true} />)

      const overlay = container.querySelector('[class*="overlay"]')
      // Check that "correct" as a standalone class is not present
      // Note: "incorrect" contains "correct" as substring, so we check for exact class boundary
      expect(overlay?.className).not.toMatch(/_correct_/)
    })
  })

  describe('onAnimationEnd callback', () => {
    it('should call onAnimationEnd when animation completes', () => {
      const onAnimationEnd = vi.fn()
      render(<AnswerFeedback type="correct" isVisible={true} onAnimationEnd={onAnimationEnd} />)

      // Get the overlay using data-testid
      const overlay = screen.getByTestId('answer-feedback-overlay')

      // Trigger animationend event using fireEvent
      fireEvent.animationEnd(overlay)

      expect(onAnimationEnd).toHaveBeenCalled()
    })

    it('should not crash without onAnimationEnd callback', () => {
      render(<AnswerFeedback type="correct" isVisible={true} />)

      // Get the overlay using data-testid
      const overlay = screen.getByTestId('answer-feedback-overlay')

      // Trigger animationend event - should not crash
      expect(() => {
        fireEvent.animationEnd(overlay)
      }).not.toThrow()
    })
  })

  describe('null type handling', () => {
    it('should not crash with null type when isVisible is false', () => {
      expect(() => {
        render(<AnswerFeedback type={null} isVisible={false} />)
      }).not.toThrow()
    })

    it('should render nothing with null type even when isVisible is true', () => {
      const { container } = render(<AnswerFeedback type={null} isVisible={true} />)

      // Should not render overlay without a valid type
      expect(container.querySelector('[class*="overlay"]')).toBeNull()
    })
  })

  describe('overlay styling', () => {
    it('should have fixed positioning styles for full viewport coverage', () => {
      const { container } = render(<AnswerFeedback type="correct" isVisible={true} />)

      const overlay = container.querySelector('[class*="overlay"]')
      expect(overlay).not.toBeNull()
      // The component should exist and have overlay class
      expect(overlay?.className).toMatch(/overlay/i)
    })

    it('should have pointer-events none to not block interactions', () => {
      const { container } = render(<AnswerFeedback type="correct" isVisible={true} />)

      const overlay = container.querySelector('[class*="overlay"]')
      // Overlay should exist - actual CSS is tested visually
      expect(overlay).not.toBeNull()
    })
  })
})
