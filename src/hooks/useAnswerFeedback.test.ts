import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAnswerFeedback } from './useAnswerFeedback'

// Mock Audio constructor
const mockPlay = vi.fn().mockResolvedValue(undefined)
const mockPause = vi.fn()

class MockAudio {
  src: string = ''
  volume: number = 1
  play = mockPlay
  pause = mockPause

  constructor(src?: string) {
    if (src) this.src = src
  }
}

// Store original Audio
const OriginalAudio = global.Audio

describe('useAnswerFeedback', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    // Mock Audio globally
    global.Audio = MockAudio as unknown as typeof Audio
  })

  afterEach(() => {
    vi.useRealTimers()
    // Restore original Audio
    global.Audio = OriginalAudio
  })

  describe('initial state', () => {
    it('should initialize with isPlaying false', () => {
      const { result } = renderHook(() => useAnswerFeedback())

      expect(result.current.isPlaying).toBe(false)
    })

    it('should initialize with feedbackType null', () => {
      const { result } = renderHook(() => useAnswerFeedback())

      expect(result.current.feedbackType).toBeNull()
    })

    it('should provide playCorrect function', () => {
      const { result } = renderHook(() => useAnswerFeedback())

      expect(typeof result.current.playCorrect).toBe('function')
    })

    it('should provide playIncorrect function', () => {
      const { result } = renderHook(() => useAnswerFeedback())

      expect(typeof result.current.playIncorrect).toBe('function')
    })
  })

  describe('playCorrect', () => {
    it('should set isPlaying to true when called', () => {
      const { result } = renderHook(() => useAnswerFeedback())

      act(() => {
        result.current.playCorrect()
      })

      expect(result.current.isPlaying).toBe(true)
    })

    it('should set feedbackType to correct when called', () => {
      const { result } = renderHook(() => useAnswerFeedback())

      act(() => {
        result.current.playCorrect()
      })

      expect(result.current.feedbackType).toBe('correct')
    })

    it('should trigger audio playback with correct sound file', () => {
      const { result } = renderHook(() => useAnswerFeedback())

      act(() => {
        result.current.playCorrect()
      })

      expect(mockPlay).toHaveBeenCalled()
    })

    it('should reset state after duration expires', () => {
      const { result } = renderHook(() => useAnswerFeedback())

      act(() => {
        result.current.playCorrect()
      })

      expect(result.current.isPlaying).toBe(true)

      act(() => {
        vi.advanceTimersByTime(500)
      })

      expect(result.current.isPlaying).toBe(false)
      expect(result.current.feedbackType).toBeNull()
    })
  })

  describe('playIncorrect', () => {
    it('should set isPlaying to true when called', () => {
      const { result } = renderHook(() => useAnswerFeedback())

      act(() => {
        result.current.playIncorrect()
      })

      expect(result.current.isPlaying).toBe(true)
    })

    it('should set feedbackType to incorrect when called', () => {
      const { result } = renderHook(() => useAnswerFeedback())

      act(() => {
        result.current.playIncorrect()
      })

      expect(result.current.feedbackType).toBe('incorrect')
    })

    it('should trigger audio playback with incorrect sound file', () => {
      const { result } = renderHook(() => useAnswerFeedback())

      act(() => {
        result.current.playIncorrect()
      })

      expect(mockPlay).toHaveBeenCalled()
    })

    it('should reset state after duration expires', () => {
      const { result } = renderHook(() => useAnswerFeedback())

      act(() => {
        result.current.playIncorrect()
      })

      expect(result.current.isPlaying).toBe(true)

      act(() => {
        vi.advanceTimersByTime(500)
      })

      expect(result.current.isPlaying).toBe(false)
      expect(result.current.feedbackType).toBeNull()
    })
  })

  describe('error handling', () => {
    it('should handle audio play failure gracefully', () => {
      // Mock play to reject
      mockPlay.mockRejectedValueOnce(new Error('Audio playback failed'))

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const { result } = renderHook(() => useAnswerFeedback())

      // Should not throw
      expect(() => {
        act(() => {
          result.current.playCorrect()
        })
      }).not.toThrow()

      consoleWarnSpy.mockRestore()
    })

    it('should continue visual feedback even if audio fails', async () => {
      // Mock play to reject
      mockPlay.mockRejectedValueOnce(new Error('Audio playback failed'))

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const { result } = renderHook(() => useAnswerFeedback())

      act(() => {
        result.current.playCorrect()
      })

      // Visual state should still be set
      expect(result.current.isPlaying).toBe(true)
      expect(result.current.feedbackType).toBe('correct')

      consoleWarnSpy.mockRestore()
    })
  })

  describe('rapid successive calls', () => {
    it('should handle rapid playCorrect calls without crashing', () => {
      const { result } = renderHook(() => useAnswerFeedback())

      expect(() => {
        act(() => {
          result.current.playCorrect()
          result.current.playCorrect()
          result.current.playCorrect()
        })
      }).not.toThrow()
    })

    it('should handle rapid alternating calls without crashing', () => {
      const { result } = renderHook(() => useAnswerFeedback())

      expect(() => {
        act(() => {
          result.current.playCorrect()
          result.current.playIncorrect()
          result.current.playCorrect()
        })
      }).not.toThrow()
    })

    it('should use latest feedback type after rapid calls', () => {
      const { result } = renderHook(() => useAnswerFeedback())

      act(() => {
        result.current.playCorrect()
        result.current.playIncorrect()
      })

      expect(result.current.feedbackType).toBe('incorrect')
    })
  })

  describe('custom options', () => {
    it('should respect custom duration option', () => {
      const { result } = renderHook(() => useAnswerFeedback({ duration: 1000 }))

      act(() => {
        result.current.playCorrect()
      })

      expect(result.current.isPlaying).toBe(true)

      // After 500ms (default), should still be playing
      act(() => {
        vi.advanceTimersByTime(500)
      })

      expect(result.current.isPlaying).toBe(true)

      // After 1000ms (custom), should be done
      act(() => {
        vi.advanceTimersByTime(500)
      })

      expect(result.current.isPlaying).toBe(false)
    })

    it('should disable sound when enableSound is false', () => {
      const { result } = renderHook(() => useAnswerFeedback({ enableSound: false }))

      act(() => {
        result.current.playCorrect()
      })

      // Audio should not be played
      expect(mockPlay).not.toHaveBeenCalled()

      // But visual state should still be set
      expect(result.current.isPlaying).toBe(true)
      expect(result.current.feedbackType).toBe('correct')
    })
  })
})
