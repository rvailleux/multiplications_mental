/**
 * Type definitions for pause menu state and component props
 * Feature: 012-keyboard-navigation
 * @packageDocumentation
 */

/**
 * Pause menu option types
 * @public
 */
export type PauseMenuOption = 'quit' | 'continue'

/**
 * Pause menu state management
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
 * Props for PauseMenu component
 * @public
 */
export interface PauseMenuProps {
  /** Whether the pause menu is currently visible */
  isOpen: boolean
  /** Currently selected option (controlled component) */
  selectedOption: PauseMenuOption
  /** Callback when user selects an option and presses Enter */
  onConfirm: (option: PauseMenuOption) => void
  /** Callback when user cancels (ESC key) */
  onCancel: () => void
  /** Callback when selectedOption changes (arrow key navigation) */
  onOptionChange: (option: PauseMenuOption) => void
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
