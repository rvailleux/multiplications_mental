/**
 * Type definitions for focus management and keyboard navigation
 * Feature: 012-keyboard-navigation
 * @packageDocumentation
 */

/**
 * Direction for focus navigation
 * @public
 */
export type FocusDirection = 'up' | 'down'

/**
 * Focus state tracking
 * @public
 */
export interface FocusState {
  /** Index of currently focused element */
  focusedIndex: number
  /** Array of focusable elements in navigation order */
  focusableElements: (HTMLElement | null)[]
  /** Total number of focusable elements */
  elementCount: number
}

/**
 * Props for useFocusManagement hook
 * @public
 */
export interface UseFocusManagementProps {
  /** Number of focusable elements */
  elementCount: number
  /** Initial focused index (default: 0) */
  initialIndex?: number
  /** Whether to auto-focus first element on mount */
  autoFocusOnMount?: boolean
}

/**
 * Return type for useFocusManagement hook
 * @public
 */
export interface UseFocusManagementResult {
  /** Refs array for focusable elements */
  refs: React.MutableRefObject<(HTMLElement | null)[]>
  /** Current focus index */
  focusIndex: number
  /** Move focus in specified direction */
  moveFocus: (direction: FocusDirection) => void
  /** Focus specific element by index */
  focusElement: (index: number) => void
  /** Set focus index without actually focusing element */
  setFocusIndex: (index: number) => void
}

/**
 * Props for JumpingArrow component
 * @public
 */
export interface JumpingArrowProps {
  /** Whether the arrow should be visible */
  visible: boolean
  /** Additional CSS class names */
  className?: string
}
