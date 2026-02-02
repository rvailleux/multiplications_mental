/**
 * Type definitions for the credits screen feature
 * @module types/credits
 */

/**
 * Represents a section in the credits (e.g., "Music", "Made with")
 * @public
 */
export interface CreditsSection {
  /** Section title displayed as header */
  title: string
  /** Icon emoji displayed before title (optional) */
  icon?: string
  /** List of attribution items in this section */
  items: AttributionItem[]
}

/**
 * Individual credit entry within a section
 * @public
 */
export interface AttributionItem {
  /** Name or title of the credited item */
  name: string
  /** Optional description or additional info */
  description?: string
  /** Optional author/creator name */
  author?: string
  /** Optional source URL (for reference, not displayed) */
  sourceUrl?: string
}

/**
 * Configuration for a single parallax star layer
 * @public
 */
export interface StarLayerConfig {
  /** Unique identifier for the layer */
  id: string
  /** Size of stars in pixels */
  starSize: number
  /** Number of stars in the layer */
  starCount: number
  /** Animation duration in seconds (lower = faster) */
  animationDuration: number
  /** Opacity of stars (0-1) */
  opacity: number
  /** Color of stars (CSS color value) */
  color: string
}

/**
 * Current state of credits scrolling
 * @public
 */
export interface ScrollState {
  /** Current scroll position in pixels */
  position: number
  /** Current speed level index (0 = paused, 2 = normal) */
  speedIndex: number
  /** Whether scrolling is active */
  isScrolling: boolean
}

/**
 * Speed level multipliers
 * Index 0 = paused, index 2 = normal (1x)
 * @public
 */
export const SPEED_LEVELS: readonly number[] = [0, 0.5, 1, 1.5, 2, 3] as const
