/**
 * Navigation type definitions for keyboard-first UI navigation
 * @module types/navigation
 */

/**
 * Selectable options on the PlayPage during active gameplay
 * @public
 */
export type NavigableOption = 'valider' | 'restart'

/**
 * Configuration for navigable options component
 * @public
 */
export interface NavigableOptionsConfig {
  /** Available options to navigate between */
  options: readonly NavigableOption[]
  /** Default selected option when component mounts */
  defaultOption: NavigableOption
  /** Callback when "valider" option is confirmed */
  onValider: () => void
  /** Callback when "restart" option is confirmed */
  onRestart: () => void
}

/**
 * Generic selection state for components with keyboard navigation
 * @public
 */
export interface SelectionState<T extends string> {
  /** Currently selected option */
  selectedOption: T
  /** Index of selected option in options array (for cycling) */
  selectedIndex: number
  /** Total number of available options */
  totalOptions: number
}
