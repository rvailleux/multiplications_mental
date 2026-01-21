import styles from './JumpingArrow.module.scss'

/**
 * Props for the JumpingArrow component
 * @public
 */
export interface JumpingArrowProps {
  /** Whether the arrow should be visible */
  visible: boolean
}

/**
 * Jumping arrow indicator for focused elements
 * Displays a bouncing arrow (▶) next to the currently focused interactive element.
 * Used for keyboard navigation to show which element will respond to Enter key.
 *
 * @param props - Component properties
 * @returns JSX element or null if not visible
 *
 * @example
 * ```tsx
 * <button>
 *   <JumpingArrow visible={focusIndex === 0} />
 *   Button Text
 * </button>
 * ```
 */
export default function JumpingArrow({ visible }: JumpingArrowProps) {
  if (!visible) {
    return null
  }

  return <span className={styles.jumpingArrow}>▶</span>
}
