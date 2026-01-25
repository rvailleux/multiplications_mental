import { useState, useCallback } from 'react'

/**
 * Configuration for list navigation hook
 * @public
 */
export interface ListNavigationConfig<T> {
  /** Array of items to navigate through */
  items: readonly T[]
  /** Default selected index (defaults to 0) */
  defaultIndex?: number
  /** Callback when selection is confirmed */
  onSelect: (index: number) => void
}

/**
 * Return type for useListNavigation hook
 * @public
 */
export interface UseListNavigationReturn {
  /** Currently selected index */
  selectedIndex: number
  /** Update selected index directly */
  setSelectedIndex: (index: number) => void
  /** Navigate to previous item (wraps around) */
  navigateUp: () => void
  /** Navigate to next item (wraps around) */
  navigateDown: () => void
  /** Execute onSelect callback with current index */
  confirmSelection: () => void
  /** Reset selection to default index */
  resetToDefault: () => void
}

/**
 * Custom hook for managing list navigation with keyboard support
 *
 * Provides state and functions for navigating through a list of items
 * using arrow keys. Handles cyclic wrapping at boundaries.
 *
 * @param config - Configuration object with items, default index, and callback
 * @returns Selection state and navigation functions
 *
 * @example
 * ```typescript
 * const { selectedIndex, navigateUp, navigateDown, confirmSelection } =
 *   useListNavigation({
 *     items: players,
 *     defaultIndex: 0,
 *     onSelect: (index) => selectPlayer(index),
 *   })
 * ```
 */
export function useListNavigation<T>(config: ListNavigationConfig<T>): UseListNavigationReturn {
  const defaultIndex = config.defaultIndex ?? 0
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex)

  const navigateDown = useCallback((): void => {
    setSelectedIndex(current => {
      return (current + 1) % config.items.length
    })
  }, [config.items.length])

  const navigateUp = useCallback((): void => {
    setSelectedIndex(current => {
      return current === 0 ? config.items.length - 1 : current - 1
    })
  }, [config.items.length])

  const confirmSelection = useCallback((): void => {
    config.onSelect(selectedIndex)
  }, [selectedIndex, config])

  const resetToDefault = useCallback((): void => {
    setSelectedIndex(defaultIndex)
  }, [defaultIndex])

  return {
    selectedIndex,
    setSelectedIndex,
    navigateUp,
    navigateDown,
    confirmSelection,
    resetToDefault,
  }
}
