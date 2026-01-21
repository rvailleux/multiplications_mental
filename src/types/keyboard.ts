/**
 * Keyboard event types and constants for enhanced keyboard navigation
 * @packageDocumentation
 */

/**
 * Valid keyboard keys for navigation
 */
export type NavigationKey =
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Enter'
  | 'Escape'

/**
 * Direction for focus movement
 */
export type FocusDirection = 'up' | 'down' | 'left' | 'right'

/**
 * Keyboard event handler type
 * @param event - The keyboard event
 */
export type KeyboardHandler = (event: KeyboardEvent) => void

/**
 * Pause menu option values
 */
export type PauseMenuOption = 'quit' | 'continue'

/**
 * Check if a key is a navigation key
 * @param key - The key to check
 * @returns True if the key is a navigation key
 */
export function isNavigationKey(key: string): key is NavigationKey {
  return ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape'].includes(key)
}

/**
 * Check if a key is a digit (0-9)
 * @param key - The key to check
 * @returns True if the key is a digit
 */
export function isDigitKey(key: string): boolean {
  return /^[0-9]$/.test(key)
}
