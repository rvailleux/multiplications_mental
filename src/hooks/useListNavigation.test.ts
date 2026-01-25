import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useListNavigation } from './useListNavigation'

describe('useListNavigation', () => {
  const mockItems = ['item1', 'item2', 'item3']
  const mockOnSelect = vi.fn()

  beforeEach(() => {
    mockOnSelect.mockClear()
  })

  describe('initialization', () => {
    it('should start with selectedIndex 0 by default', () => {
      const { result } = renderHook(() =>
        useListNavigation({
          items: mockItems,
          onSelect: mockOnSelect,
        })
      )

      expect(result.current.selectedIndex).toBe(0)
    })

    it('should start with custom defaultIndex if provided', () => {
      const { result } = renderHook(() =>
        useListNavigation({
          items: mockItems,
          defaultIndex: 2,
          onSelect: mockOnSelect,
        })
      )

      expect(result.current.selectedIndex).toBe(2)
    })
  })

  describe('navigateDown', () => {
    it('should move to next item', () => {
      const { result } = renderHook(() =>
        useListNavigation({
          items: mockItems,
          onSelect: mockOnSelect,
        })
      )

      act(() => {
        result.current.navigateDown()
      })

      expect(result.current.selectedIndex).toBe(1)
    })

    it('should wrap around to first item when at last', () => {
      const { result } = renderHook(() =>
        useListNavigation({
          items: mockItems,
          defaultIndex: 2,
          onSelect: mockOnSelect,
        })
      )

      act(() => {
        result.current.navigateDown()
      })

      expect(result.current.selectedIndex).toBe(0)
    })
  })

  describe('navigateUp', () => {
    it('should move to previous item', () => {
      const { result } = renderHook(() =>
        useListNavigation({
          items: mockItems,
          defaultIndex: 1,
          onSelect: mockOnSelect,
        })
      )

      act(() => {
        result.current.navigateUp()
      })

      expect(result.current.selectedIndex).toBe(0)
    })

    it('should wrap around to last item when at first', () => {
      const { result } = renderHook(() =>
        useListNavigation({
          items: mockItems,
          onSelect: mockOnSelect,
        })
      )

      act(() => {
        result.current.navigateUp()
      })

      expect(result.current.selectedIndex).toBe(2)
    })
  })

  describe('confirmSelection', () => {
    it('should call onSelect with current index', () => {
      const { result } = renderHook(() =>
        useListNavigation({
          items: mockItems,
          onSelect: mockOnSelect,
        })
      )

      act(() => {
        result.current.confirmSelection()
      })

      expect(mockOnSelect).toHaveBeenCalledWith(0)
    })

    it('should call onSelect with navigated index', () => {
      const { result } = renderHook(() =>
        useListNavigation({
          items: mockItems,
          onSelect: mockOnSelect,
        })
      )

      act(() => {
        result.current.navigateDown()
      })
      act(() => {
        result.current.navigateDown()
      })
      act(() => {
        result.current.confirmSelection()
      })

      expect(mockOnSelect).toHaveBeenCalledWith(2)
    })
  })

  describe('resetToDefault', () => {
    it('should reset to default index', () => {
      const { result } = renderHook(() =>
        useListNavigation({
          items: mockItems,
          defaultIndex: 1,
          onSelect: mockOnSelect,
        })
      )

      act(() => {
        result.current.navigateDown()
        result.current.resetToDefault()
      })

      expect(result.current.selectedIndex).toBe(1)
    })

    it('should reset to 0 if no default provided', () => {
      const { result } = renderHook(() =>
        useListNavigation({
          items: mockItems,
          onSelect: mockOnSelect,
        })
      )

      act(() => {
        result.current.navigateDown()
        result.current.navigateDown()
        result.current.resetToDefault()
      })

      expect(result.current.selectedIndex).toBe(0)
    })
  })
})
