import { useState, useCallback } from 'react'
import type { NavigableOption, NavigableOptionsConfig } from '../types/navigation'

/**
 * Return type for useNavigableOptions hook
 * Provides selection state and navigation functions for PlayPage options
 * @public
 */
export interface UseNavigableOptionsReturn {
  /** Currently selected option */
  selectedOption: NavigableOption
  /** Update selected option directly */
  setSelectedOption: (option: NavigableOption) => void
  /** Navigate to previous option (wraps around) */
  navigateUp: () => void
  /** Navigate to next option (wraps around) */
  navigateDown: () => void
  /** Execute action for currently selected option */
  executeSelectedOption: () => void
  /** Reset selection to default option */
  resetToDefault: () => void
}

/**
 * Custom hook for managing navigable options with keyboard navigation
 *
 * Provides state and functions for navigating between options (e.g., "Valider" and "Restart")
 * using arrow keys. Handles wrapping around at boundaries and executing callbacks.
 *
 * @param config - Configuration object with options, default selection, and callbacks
 * @returns Selection state and navigation functions
 *
 * @example
 * ```typescript
 * const { selectedOption, navigateUp, navigateDown, executeSelectedOption } =
 *   useNavigableOptions({
 *     options: ['valider', 'restart'],
 *     defaultOption: 'valider',
 *     onValider: handleSubmit,
 *     onRestart: handleRestart,
 *   })
 * ```
 */
export function useNavigableOptions(config: NavigableOptionsConfig): UseNavigableOptionsReturn {
  const [selectedOption, setSelectedOption] = useState<NavigableOption>(config.defaultOption)

  const navigateDown = useCallback((): void => {
    setSelectedOption(current => {
      const currentIndex = config.options.indexOf(current)
      const nextIndex = (currentIndex + 1) % config.options.length
      return config.options[nextIndex]
    })
  }, [config.options])

  const navigateUp = useCallback((): void => {
    setSelectedOption(current => {
      const currentIndex = config.options.indexOf(current)
      const prevIndex = currentIndex === 0 ? config.options.length - 1 : currentIndex - 1
      return config.options[prevIndex]
    })
  }, [config.options])

  const executeSelectedOption = useCallback((): void => {
    if (selectedOption === 'valider') {
      config.onValider()
    } else if (selectedOption === 'restart') {
      config.onRestart()
    }
  }, [selectedOption, config])

  const resetToDefault = useCallback((): void => {
    setSelectedOption(config.defaultOption)
  }, [config.defaultOption])

  return {
    selectedOption,
    setSelectedOption,
    navigateUp,
    navigateDown,
    executeSelectedOption,
    resetToDefault,
  }
}
