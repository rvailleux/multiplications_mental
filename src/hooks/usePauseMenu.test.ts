import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { usePauseMenu } from './usePauseMenu'

describe('usePauseMenu', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('should initialize with pause menu closed', () => {
    const { result } = renderHook(() =>
      usePauseMenu({
        onQuit: vi.fn(),
        onContinue: vi.fn(),
      })
    )

    expect(result.current.state.isPaused).toBe(false)
    expect(result.current.state.selectedOption).toBe('continue')
    expect(result.current.state.previousFocusElement).toBeNull()
  })

  it('should open pause menu', () => {
    const { result } = renderHook(() =>
      usePauseMenu({
        onQuit: vi.fn(),
        onContinue: vi.fn(),
      })
    )

    act(() => {
      result.current.openPauseMenu()
    })

    expect(result.current.state.isPaused).toBe(true)
    expect(result.current.state.selectedOption).toBe('continue') // Default to continue
  })

  it('should close pause menu', () => {
    const { result } = renderHook(() =>
      usePauseMenu({
        onQuit: vi.fn(),
        onContinue: vi.fn(),
      })
    )

    act(() => {
      result.current.openPauseMenu()
    })

    expect(result.current.state.isPaused).toBe(true)

    act(() => {
      result.current.closePauseMenu()
    })

    expect(result.current.state.isPaused).toBe(false)
  })

  it('should toggle between options', () => {
    const { result } = renderHook(() =>
      usePauseMenu({
        onQuit: vi.fn(),
        onContinue: vi.fn(),
      })
    )

    act(() => {
      result.current.openPauseMenu()
    })

    expect(result.current.state.selectedOption).toBe('continue')

    act(() => {
      result.current.toggleOption()
    })

    expect(result.current.state.selectedOption).toBe('quit')

    act(() => {
      result.current.toggleOption()
    })

    expect(result.current.state.selectedOption).toBe('continue')
  })

  it('should call onContinue when confirming continue option', () => {
    const onContinue = vi.fn()
    const onQuit = vi.fn()

    const { result } = renderHook(() =>
      usePauseMenu({
        onQuit,
        onContinue,
      })
    )

    act(() => {
      result.current.openPauseMenu()
    })

    expect(result.current.state.selectedOption).toBe('continue')

    act(() => {
      result.current.confirmSelection()
    })

    expect(onContinue).toHaveBeenCalledTimes(1)
    expect(onQuit).not.toHaveBeenCalled()
    expect(result.current.state.isPaused).toBe(false) // Should close menu
  })

  it('should call onQuit when confirming quit option', () => {
    const onContinue = vi.fn()
    const onQuit = vi.fn()

    const { result } = renderHook(() =>
      usePauseMenu({
        onQuit,
        onContinue,
      })
    )

    act(() => {
      result.current.openPauseMenu()
      result.current.toggleOption() // Switch to quit
    })

    expect(result.current.state.selectedOption).toBe('quit')

    act(() => {
      result.current.confirmSelection()
    })

    expect(onQuit).toHaveBeenCalledTimes(1)
    expect(onContinue).not.toHaveBeenCalled()
    expect(result.current.state.isPaused).toBe(false) // Should close menu
  })

  it('should store previous focus element when opening', () => {
    const button = document.createElement('button')
    document.body.appendChild(button)
    button.focus()

    const { result } = renderHook(() =>
      usePauseMenu({
        onQuit: vi.fn(),
        onContinue: vi.fn(),
      })
    )

    expect(document.activeElement).toBe(button)

    act(() => {
      result.current.openPauseMenu()
    })

    expect(result.current.state.previousFocusElement).toBe(button)
  })

  it('should restore focus when closing', () => {
    const button = document.createElement('button')
    document.body.appendChild(button)
    button.focus()

    const { result } = renderHook(() =>
      usePauseMenu({
        onQuit: vi.fn(),
        onContinue: vi.fn(),
      })
    )

    act(() => {
      result.current.openPauseMenu()
    })

    // Simulate focus moving elsewhere
    document.body.focus()

    act(() => {
      result.current.closePauseMenu()
    })

    expect(document.activeElement).toBe(button) // Focus restored
  })

  it('should handle null previous focus gracefully', () => {
    const { result } = renderHook(() =>
      usePauseMenu({
        onQuit: vi.fn(),
        onContinue: vi.fn(),
      })
    )

    // No element focused
    expect(document.activeElement).toBe(document.body)

    act(() => {
      result.current.openPauseMenu()
      result.current.closePauseMenu()
    })

    // Should not crash
    expect(result.current.state.isPaused).toBe(false)
  })

  it('should reset to continue option when reopening', () => {
    const { result } = renderHook(() =>
      usePauseMenu({
        onQuit: vi.fn(),
        onContinue: vi.fn(),
      })
    )

    act(() => {
      result.current.openPauseMenu()
      result.current.toggleOption() // Select quit
    })

    expect(result.current.state.selectedOption).toBe('quit')

    act(() => {
      result.current.closePauseMenu()
      result.current.openPauseMenu() // Reopen
    })

    expect(result.current.state.selectedOption).toBe('continue') // Reset to continue
  })

  it('should handle focus restoration error gracefully', () => {
    const button = document.createElement('button')
    document.body.appendChild(button)
    button.focus()

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { result } = renderHook(() =>
      usePauseMenu({
        onQuit: vi.fn(),
        onContinue: vi.fn(),
      })
    )

    act(() => {
      result.current.openPauseMenu()
    })

    // Mock focus to throw error AFTER opening (so it fails on restore)
    const originalFocus = button.focus
    button.focus = vi.fn(() => {
      throw new Error('Focus failed')
    })

    act(() => {
      result.current.closePauseMenu()
    })

    // Should log error but not crash
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to restore focus:', expect.any(Error))

    consoleErrorSpy.mockRestore()
    button.focus = originalFocus
  })
})
