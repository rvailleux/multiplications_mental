import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useNavigableOptions } from './useNavigableOptions'
import type { NavigableOptionsConfig } from '../types/navigation'

describe('useNavigableOptions', () => {
  let mockConfig: NavigableOptionsConfig

  beforeEach(() => {
    mockConfig = {
      options: ['valider', 'restart'] as const,
      defaultOption: 'valider',
      onValider: vi.fn(),
      onRestart: vi.fn(),
    }
  })

  it('should initialize with default option', () => {
    const { result } = renderHook(() => useNavigableOptions(mockConfig))
    expect(result.current.selectedOption).toBe('valider')
  })

  it('should navigate down to next option', () => {
    const { result } = renderHook(() => useNavigableOptions(mockConfig))

    act(() => {
      result.current.navigateDown()
    })

    expect(result.current.selectedOption).toBe('restart')
  })

  it('should navigate up to previous option', () => {
    const { result } = renderHook(() => useNavigableOptions(mockConfig))

    // First go to restart
    act(() => {
      result.current.navigateDown()
    })

    // Then navigate back up
    act(() => {
      result.current.navigateUp()
    })

    expect(result.current.selectedOption).toBe('valider')
  })

  it('should wrap around when navigating down from last option', () => {
    const { result } = renderHook(() => useNavigableOptions(mockConfig))

    // Navigate to last option
    act(() => {
      result.current.navigateDown()
    })

    // Navigate down again - should wrap to first
    act(() => {
      result.current.navigateDown()
    })

    expect(result.current.selectedOption).toBe('valider')
  })

  it('should wrap around when navigating up from first option', () => {
    const { result } = renderHook(() => useNavigableOptions(mockConfig))

    // Navigate up from first - should wrap to last
    act(() => {
      result.current.navigateUp()
    })

    expect(result.current.selectedOption).toBe('restart')
  })

  it('should execute onValider when valider is selected', () => {
    const { result } = renderHook(() => useNavigableOptions(mockConfig))

    act(() => {
      result.current.executeSelectedOption()
    })

    expect(mockConfig.onValider).toHaveBeenCalledTimes(1)
    expect(mockConfig.onRestart).not.toHaveBeenCalled()
  })

  it('should execute onRestart when restart is selected', () => {
    const { result } = renderHook(() => useNavigableOptions(mockConfig))

    // Navigate to restart
    act(() => {
      result.current.navigateDown()
    })

    // Execute
    act(() => {
      result.current.executeSelectedOption()
    })

    expect(mockConfig.onRestart).toHaveBeenCalledTimes(1)
    expect(mockConfig.onValider).not.toHaveBeenCalled()
  })

  it('should allow direct option selection', () => {
    const { result } = renderHook(() => useNavigableOptions(mockConfig))

    act(() => {
      result.current.setSelectedOption('restart')
    })

    expect(result.current.selectedOption).toBe('restart')
  })

  it('should reset to default option when resetToDefault is called', () => {
    const { result } = renderHook(() => useNavigableOptions(mockConfig))

    // Navigate to restart
    act(() => {
      result.current.navigateDown()
    })
    expect(result.current.selectedOption).toBe('restart')

    // Reset to default
    act(() => {
      result.current.resetToDefault()
    })

    expect(result.current.selectedOption).toBe('valider')
  })
})
