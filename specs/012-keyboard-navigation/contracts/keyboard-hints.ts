/**
 * Type definitions for keyboard hints display system
 * Feature: 012-keyboard-navigation
 * @packageDocumentation
 */

/**
 * Screen identifiers for keyboard hint configuration
 * @public
 */
export type ScreenId =
  | 'player-select'
  | 'home'
  | 'play'
  | 'pause-menu'
  | 'results'

/**
 * Individual keyboard hint
 * @public
 */
export interface KeyboardHint {
  /** Key or key combination (e.g., '↑↓', 'Enter', 'ESC') */
  key: string
  /** Description of what the key does */
  description: string
}

/**
 * Keyboard hint configuration for a specific screen
 * @public
 */
export interface KeyboardHintConfig {
  /** Unique screen identifier */
  screenId: ScreenId
  /** Array of hints for this screen */
  hints: KeyboardHint[]
}

/**
 * Props for KeyboardHints component
 * @public
 */
export interface KeyboardHintsProps {
  /** Screen identifier to display hints for */
  screenId: ScreenId
  /** Additional CSS class names */
  className?: string
}

/**
 * Return type for useKeyboardHints hook
 * @public
 */
export interface UseKeyboardHintsResult {
  /** Current screen's keyboard hints */
  hints: KeyboardHint[]
  /** Get hints for specific screen */
  getHints: (screenId: ScreenId) => KeyboardHint[]
}

/**
 * Complete hint configuration map for all screens
 * @public
 */
export const KEYBOARD_HINTS_CONFIG: Record<ScreenId, KeyboardHint[]> = {
  'player-select': [
    { key: '↑↓', description: 'Navigate' },
    { key: 'Enter', description: 'Select' },
    { key: 'ESC', description: 'Exit' }
  ],
  'home': [
    { key: 'Enter', description: 'Start Game' },
    { key: 'ESC', description: 'Change Player' }
  ],
  'play': [
    { key: 'Type', description: 'Answer' },
    { key: 'Enter', description: 'Submit' },
    { key: 'ESC', description: 'Pause' },
    { key: '↑↓', description: 'Navigate' }
  ],
  'pause-menu': [
    { key: '↑↓', description: 'Navigate' },
    { key: 'Enter', description: 'Confirm' },
    { key: 'ESC', description: 'Cancel' }
  ],
  'results': [
    { key: 'Enter', description: 'Continue' },
    { key: 'ESC', description: 'Change Player' }
  ]
}
