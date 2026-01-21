import { useState, useRef } from 'react'
import type { FocusDirection } from '../types/keyboard'

/**
 * Return type for useFocusManagement hook
 * @public
 */
export interface UseFocusManagementResult {
  /** Array of refs for focusable elements */
  refs: React.MutableRefObject<(HTMLElement | null)[]>
  /** Current focused element index */
  focusIndex: number
  /** Move focus in a direction */
  moveFocus: (direction: FocusDirection) => void
  /** Focus element at specific index */
  focusElement: (index: number) => void
}

/**
 * Custom hook for managing focus across multiple elements
 * Provides programmatic focus control with arrow key navigation support.
 * Handles focus restoration and graceful error handling.
 *
 * @param elementCount - Number of focusable elements to manage
 * @returns Focus management state and functions
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { refs, focusIndex, moveFocus } = useFocusManagement(3)
 *
 *   useEffect(() => {
 *     const handleKeyDown = (e: KeyboardEvent) => {
 *       if (e.key === 'ArrowDown') {
 *         e.preventDefault()
 *         moveFocus('down')
 *       } else if (e.key === 'ArrowUp') {
 *         e.preventDefault()
 *         moveFocus('up')
 *       }
 *     }
 *     window.addEventListener('keydown', handleKeyDown)
 *     return () => window.removeEventListener('keydown', handleKeyDown)
 *   }, [moveFocus])
 *
 *   return (
 *     <div>
 *       <button ref={el => refs.current[0] = el}>Option 1</button>
 *       <button ref={el => refs.current[1] = el}>Option 2</button>
 *       <button ref={el => refs.current[2] = el}>Option 3</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useFocusManagement(elementCount: number): UseFocusManagementResult {
  const [focusIndex, setFocusIndex] = useState(0)
  const refs = useRef<(HTMLElement | null)[]>([])

  /**
   * Focus element at specific index
   * @param index - Index of element to focus
   */
  const focusElement = (index: number): void => {
    const element = refs.current[index]
    if (element) {
      try {
        element.focus()
        setFocusIndex(index)
      } catch (error) {
        console.error('Focus error:', error)
      }
    } else {
      // Update index even if element doesn't exist yet
      setFocusIndex(index)
    }
  }

  /**
   * Move focus in a direction
   * @param direction - Direction to move focus
   */
  const moveFocus = (direction: FocusDirection): void => {
    let newIndex = focusIndex

    if (direction === 'up') {
      newIndex = Math.max(0, focusIndex - 1)
    } else if (direction === 'down') {
      newIndex = Math.min(elementCount - 1, focusIndex + 1)
    } else if (direction === 'left') {
      newIndex = Math.max(0, focusIndex - 1)
    } else if (direction === 'right') {
      newIndex = Math.min(elementCount - 1, focusIndex + 1)
    }

    focusElement(newIndex)
  }

  return {
    refs,
    focusIndex,
    moveFocus,
    focusElement,
  }
}
