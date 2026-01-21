import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useFocusManagement } from './useFocusManagement'

describe('useFocusManagement', () => {
  beforeEach(() => {
    // Clear DOM before each test
    document.body.innerHTML = ''
  })

  it('should initialize with focus on first element', () => {
    const { result } = renderHook(() => useFocusManagement(3))

    expect(result.current.focusIndex).toBe(0)
  })

  it('should move focus down', () => {
    const { result } = renderHook(() => useFocusManagement(3))

    act(() => {
      result.current.moveFocus('down')
    })

    expect(result.current.focusIndex).toBe(1)
  })

  it('should move focus up', () => {
    const { result } = renderHook(() => useFocusManagement(3))

    // Move down first
    act(() => {
      result.current.moveFocus('down')
    })

    expect(result.current.focusIndex).toBe(1)

    // Then move up
    act(() => {
      result.current.moveFocus('up')
    })

    expect(result.current.focusIndex).toBe(0)
  })

  it('should not move below 0 when at first element', () => {
    const { result } = renderHook(() => useFocusManagement(3))

    expect(result.current.focusIndex).toBe(0)

    act(() => {
      result.current.moveFocus('up')
    })

    expect(result.current.focusIndex).toBe(0)
  })

  it('should not move beyond last element', () => {
    const { result } = renderHook(() => useFocusManagement(3))

    // Move to last element (index 2)
    act(() => {
      result.current.moveFocus('down')
    })

    act(() => {
      result.current.moveFocus('down')
    })

    expect(result.current.focusIndex).toBe(2)

    // Try to move beyond
    act(() => {
      result.current.moveFocus('down')
    })

    expect(result.current.focusIndex).toBe(2)
  })

  it('should focus element programmatically', () => {
    const { result } = renderHook(() => useFocusManagement(3))

    // Create mock elements
    const element1 = document.createElement('button')
    const element2 = document.createElement('button')
    const element3 = document.createElement('button')
    document.body.appendChild(element1)
    document.body.appendChild(element2)
    document.body.appendChild(element3)

    // Assign refs
    result.current.refs.current[0] = element1
    result.current.refs.current[1] = element2
    result.current.refs.current[2] = element3

    act(() => {
      result.current.focusElement(1)
    })

    expect(document.activeElement).toBe(element2)
    expect(result.current.focusIndex).toBe(1)
  })

  it('should handle focus on null element gracefully', () => {
    const { result } = renderHook(() => useFocusManagement(3))

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Try to focus element that doesn't exist
    act(() => {
      result.current.focusElement(1)
    })

    // Should not crash, index should update
    expect(result.current.focusIndex).toBe(1)

    consoleErrorSpy.mockRestore()
  })

  it('should handle focus error gracefully', () => {
    const { result } = renderHook(() => useFocusManagement(3))

    const element = document.createElement('button')
    document.body.appendChild(element)

    // Mock focus to throw error
    const originalFocus = element.focus
    element.focus = vi.fn(() => {
      throw new Error('Focus failed')
    })

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    result.current.refs.current[0] = element

    act(() => {
      result.current.focusElement(0)
    })

    // Should log error but not crash
    expect(consoleErrorSpy).toHaveBeenCalledWith('Focus error:', expect.any(Error))

    consoleErrorSpy.mockRestore()
    element.focus = originalFocus
  })

  it('should provide refs array for element assignment', () => {
    const { result } = renderHook(() => useFocusManagement(3))

    expect(result.current.refs.current).toBeDefined()
    expect(Array.isArray(result.current.refs.current)).toBe(true)
  })
})
