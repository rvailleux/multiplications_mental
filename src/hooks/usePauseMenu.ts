import { useState } from 'react'
import type { PauseMenuOption } from '../types/keyboard'

/**
 * Pause menu state
 * @public
 */
export interface PauseMenuState {
  /** Whether the game is currently paused */
  isPaused: boolean
  /** Currently selected menu option */
  selectedOption: PauseMenuOption
  /** Element that had focus before pause menu opened (for restoration) */
  previousFocusElement: HTMLElement | null
}

/**
 * Options for usePauseMenu hook
 * @public
 */
export interface UsePauseMenuOptions {
  /** Callback when user selects quit */
  onQuit: () => void
  /** Callback when user selects continue */
  onContinue: () => void
}

/**
 * Return type for usePauseMenu hook
 * @public
 */
export interface UsePauseMenuResult {
  /** Current pause menu state */
  state: PauseMenuState
  /** Open the pause menu */
  openPauseMenu: () => void
  /** Close the pause menu */
  closePauseMenu: () => void
  /** Toggle between quit and continue options */
  toggleOption: () => void
  /** Confirm current selection */
  confirmSelection: () => void
}

/**
 * Custom hook for managing pause menu state
 * Handles pause menu visibility, option selection, and focus restoration.
 * Stores the previously focused element and restores it when the menu closes.
 *
 * @param options - Configuration options
 * @returns Pause menu state and control functions
 *
 * @example
 * ```tsx
 * const pauseMenu = usePauseMenu({
 *   onQuit: () => navigate('/home'),
 *   onContinue: () => timer.resume()
 * })
 *
 * // Open pause menu on ESC key
 * useEffect(() => {
 *   const handleEsc = (e: KeyboardEvent) => {
 *     if (e.key === 'Escape') {
 *       pauseMenu.openPauseMenu()
 *     }
 *   }
 *   window.addEventListener('keydown', handleEsc)
 *   return () => window.removeEventListener('keydown', handleEsc)
 * }, [pauseMenu])
 * ```
 */
export function usePauseMenu(options: UsePauseMenuOptions): UsePauseMenuResult {
  const { onQuit, onContinue } = options

  const [state, setState] = useState<PauseMenuState>({
    isPaused: false,
    selectedOption: 'continue',
    previousFocusElement: null,
  })

  /**
   * Open the pause menu
   * Stores currently focused element for later restoration
   */
  const openPauseMenu = (): void => {
    const previousElement = document.activeElement as HTMLElement

    setState({
      isPaused: true,
      selectedOption: 'continue', // Always default to continue when opening
      previousFocusElement: previousElement,
    })
  }

  /**
   * Close the pause menu
   * Restores focus to previously focused element
   */
  const closePauseMenu = (): void => {
    const previousElement = state.previousFocusElement

    setState({
      isPaused: false,
      selectedOption: 'continue',
      previousFocusElement: null,
    })

    // Restore focus
    if (previousElement) {
      try {
        previousElement.focus()
      } catch (error) {
        console.error('Failed to restore focus:', error)
      }
    }
  }

  /**
   * Toggle between quit and continue options
   */
  const toggleOption = (): void => {
    setState(prev => ({
      ...prev,
      selectedOption: prev.selectedOption === 'continue' ? 'quit' : 'continue',
    }))
  }

  /**
   * Confirm current selection
   * Calls appropriate callback and closes menu
   */
  const confirmSelection = (): void => {
    if (state.selectedOption === 'quit') {
      onQuit()
    } else {
      onContinue()
    }

    closePauseMenu()
  }

  return {
    state,
    openPauseMenu,
    closePauseMenu,
    toggleOption,
    confirmSelection,
  }
}
