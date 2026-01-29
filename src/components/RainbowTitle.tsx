import styles from './RainbowTitle.module.scss'

/**
 * Props for the RainbowTitle component
 * @public
 */
export interface RainbowTitleProps {
  /** Title text to display */
  title: string
  /** Additional CSS class name */
  className?: string
}

/**
 * Animated rainbow gradient title component
 * Displays text with a wave-like color animation through the rainbow spectrum.
 * Uses CSS gradient animation for GPU-accelerated performance.
 *
 * Colors follow 8-bit era palette: Red, Orange, Yellow, Green, Blue, Indigo, Violet.
 *
 * @param props - Component properties
 * @returns JSX element with animated rainbow title
 *
 * @example
 * ```tsx
 * <RainbowTitle title="Credits" />
 * ```
 */
export default function RainbowTitle({ title, className }: RainbowTitleProps) {
  return (
    <h1 className={`${styles.rainbowTitle} ${className || ''}`} data-testid="rainbow-title">
      {title}
    </h1>
  )
}
