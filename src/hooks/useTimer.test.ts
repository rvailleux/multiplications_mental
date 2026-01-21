import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useTimer } from './useTimer'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with given seconds', () => {
    const { result } = renderHook(() => useTimer(60))

    expect(result.current.secondsLeft).toBe(60)
    expect(result.current.isPaused).toBe(false)
  })

  it('should decrement seconds every second', () => {
    const { result } = renderHook(() => useTimer(5))

    expect(result.current.secondsLeft).toBe(5)

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.secondsLeft).toBe(4)

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.secondsLeft).toBe(3)
  })

  it('should reset timer to initial value', () => {
    const { result } = renderHook(() => useTimer(10))

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(result.current.secondsLeft).toBe(7)

    act(() => {
      result.current.reset()
    })

    expect(result.current.secondsLeft).toBe(10)
  })

  it('should not go below zero', () => {
    const { result } = renderHook(() => useTimer(2))

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.secondsLeft).toBe(0)
  })

  // === NEW TESTS FOR PAUSE/RESUME ===

  it('should pause timer when pause() is called', () => {
    const { result } = renderHook(() => useTimer(60))

    expect(result.current.secondsLeft).toBe(60)

    // Let some time pass
    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(result.current.secondsLeft).toBe(58)

    // Pause the timer
    act(() => {
      result.current.pause()
    })

    expect(result.current.isPaused).toBe(true)

    // Time should not advance while paused
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.secondsLeft).toBe(58) // Should still be 58
  })

  it('should resume timer when resume() is called', () => {
    const { result } = renderHook(() => useTimer(60))

    // Pause immediately
    act(() => {
      result.current.pause()
    })

    expect(result.current.isPaused).toBe(true)

    // Time should not advance while paused
    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(result.current.secondsLeft).toBe(60)

    // Resume the timer
    act(() => {
      result.current.resume()
    })

    expect(result.current.isPaused).toBe(false)

    // Time should now advance
    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(result.current.secondsLeft).toBe(58)
  })

  it('should handle multiple pause/resume cycles', () => {
    const { result } = renderHook(() => useTimer(100))

    const initialValue = result.current.secondsLeft
    expect(initialValue).toBe(100)

    // Pause immediately
    act(() => {
      result.current.pause()
    })

    expect(result.current.isPaused).toBe(true)

    // Advance time while paused (should not affect timer)
    act(() => {
      vi.advanceTimersByTime(10000)
    })

    expect(result.current.secondsLeft).toBe(100) // Still 100

    // Resume
    act(() => {
      result.current.resume()
    })

    expect(result.current.isPaused).toBe(false)

    // Let run for 2 seconds
    act(() => {
      vi.advanceTimersByTime(2000)
    })

    // Should have decreased
    expect(result.current.secondsLeft).toBeLessThan(100)
    expect(result.current.secondsLeft).toBeGreaterThanOrEqual(97)

    // Pause again
    act(() => {
      result.current.pause()
    })

    const secondPauseValue = result.current.secondsLeft

    // Advance time while paused again
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    // Should not change
    expect(result.current.secondsLeft).toBe(secondPauseValue)
  })

  it('should handle pause when timer is at 0', () => {
    const { result } = renderHook(() => useTimer(2))

    // Let timer expire
    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(result.current.secondsLeft).toBe(0)

    // Pause should still work
    act(() => {
      result.current.pause()
    })

    expect(result.current.isPaused).toBe(true)
  })

  it('should ignore pause when already paused', () => {
    const { result } = renderHook(() => useTimer(60))

    act(() => {
      result.current.pause()
    })

    expect(result.current.isPaused).toBe(true)

    // Pause again (should be no-op)
    act(() => {
      result.current.pause()
    })

    expect(result.current.isPaused).toBe(true)
  })

  it('should ignore resume when not paused', () => {
    const { result } = renderHook(() => useTimer(60))

    expect(result.current.isPaused).toBe(false)

    // Resume when not paused (should be no-op)
    act(() => {
      result.current.resume()
    })

    expect(result.current.isPaused).toBe(false)
  })

  it('should handle error during pause gracefully', () => {
    const { result } = renderHook(() => useTimer(60))

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Pause should work even if there's an error
    act(() => {
      result.current.pause()
    })

    // Timer should be paused
    expect(result.current.isPaused).toBe(true)

    consoleErrorSpy.mockRestore()
  })

  it('should reset timer and maintain pause state', () => {
    const { result } = renderHook(() => useTimer(60))

    // Run timer for a bit
    act(() => {
      vi.advanceTimersByTime(10000)
    })

    expect(result.current.secondsLeft).toBe(50)

    // Pause
    act(() => {
      result.current.pause()
    })

    // Reset while paused
    act(() => {
      result.current.reset()
    })

    expect(result.current.secondsLeft).toBe(60)
    expect(result.current.isPaused).toBe(true) // Should remain paused
  })
})
