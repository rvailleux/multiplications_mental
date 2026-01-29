import { useMemo } from 'react'
import type { StarLayerConfig } from '../types/credits'
import { STARFIELD_CONFIG } from '../data/creditsData'
import styles from './Starfield.module.scss'

/**
 * Props for the Starfield component
 * @public
 */
export interface StarfieldProps {
  /** Custom layer configurations (defaults to STARFIELD_CONFIG) */
  layers?: StarLayerConfig[]
  /** Additional CSS class name */
  className?: string
}

/**
 * Represents a single star's position and properties
 */
interface Star {
  id: string
  x: number
  y: number
  size: number
  opacity: number
  color: string
}

/**
 * Generate random stars for a layer
 * Stars are positioned randomly within a 200% height container for seamless looping
 * @param layer - Layer configuration
 * @returns Array of star objects with positions
 */
const generateStars = (layer: StarLayerConfig): Star[] => {
  const stars: Star[] = []
  for (let i = 0; i < layer.starCount; i++) {
    stars.push({
      id: `${layer.id}-star-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 200, // 200% height for seamless loop
      size: layer.starSize,
      opacity: layer.opacity,
      color: layer.color,
    })
  }
  return stars
}

/**
 * Parallax starfield background component
 * Creates an animated space background with 3 layers of stars
 * moving at different speeds for depth perception.
 *
 * Uses CSS animations for GPU-accelerated performance.
 *
 * @param props - Component properties
 * @returns JSX element with animated starfield
 *
 * @example
 * ```tsx
 * <Starfield />
 * // or with custom layers
 * <Starfield layers={customLayers} />
 * ```
 */
export default function Starfield({ layers = STARFIELD_CONFIG, className }: StarfieldProps) {
  // Memoize star positions to avoid regenerating on every render
  const starLayers = useMemo(() => {
    return layers.map(layer => ({
      ...layer,
      stars: generateStars(layer),
    }))
  }, [layers])

  return (
    <div
      className={`${styles.starfield} ${className || ''}`}
      data-testid="starfield"
      aria-hidden="true"
    >
      {starLayers.map(layer => (
        <div
          key={layer.id}
          className={styles.starLayer}
          data-testid={`star-layer-${layer.id}`}
          style={
            {
              '--animation-duration': `${layer.animationDuration}s`,
            } as React.CSSProperties
          }
        >
          {layer.stars.map(star => (
            <div
              key={star.id}
              className={styles.star}
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
                backgroundColor: star.color,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
