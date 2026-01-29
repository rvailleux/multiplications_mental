import { useState, useCallback, useEffect, useRef } from 'react'
import type { ScrollState } from '../types/credits'
import { SPEED_LEVELS } from '../types/credits'

/**
 * Return type for the useCreditsScroll hook
 * @public
 */
/**
 * Configuration options for useCreditsScroll hook
 * @public
 */
export interface UseCreditsScrollConfig {
  /** Maximum scroll position - scrolling stops when reached */
  maxScroll?: number
}

export interface UseCreditsScrollReturn {
  /** Current scroll state */
  scrollState: ScrollState
  /** Increase scroll speed (move to higher speed level) */
  increaseSpeed: () => void
  /** Decrease scroll speed (move to lower speed level) */
  decreaseSpeed: () => void
  /** Reset scroll to initial position */
  resetScroll: () => void
  /** Set maximum scroll position */
  setMaxScroll: (max: number) => void
  /** Current speed multiplier value */
  speedMultiplier: number
  /** Current speed level name for display */
  speedLabel: string
  /** Whether scroll has reached the end */
  hasReachedEnd: boolean
}

/**
 * Speed level labels for UI display
 */
const SPEED_LABELS: Record<number, string> = {
  0: 'Paused',
  0.5: '0.5x',
  1: '1x',
  1.5: '1.5x',
  2: '2x',
  3: '3x',
}

/**
 * Base scroll speed in pixels per second
 */
const BASE_SCROLL_SPEED = 40

/**
 * Default speed index (1x speed)
 */
const DEFAULT_SPEED_INDEX = 2

/**
 * Hook for managing credits scroll state and speed control
 * Uses requestAnimationFrame for smooth 60fps scrolling.
 *
 * Speed levels: 0 (paused), 0.5x, 1x, 1.5x, 2x, 3x
 * Arrow Up increases speed, Arrow Down decreases speed.
 *
 * @returns Object with scroll state and control functions
 *
 * @example
 * ```tsx
 * const { scrollState, increaseSpeed, decreaseSpeed } = useCreditsScroll()
 *
 * useEffect(() => {
 *   const handleKeyDown = (e: KeyboardEvent) => {
 *     if (e.key === 'ArrowUp') increaseSpeed()
 *     if (e.key === 'ArrowDown') decreaseSpeed()
 *   }
 *   window.addEventListener('keydown', handleKeyDown)
 *   return () => window.removeEventListener('keydown', handleKeyDown)
 * }, [increaseSpeed, decreaseSpeed])
 * ```
 */
export function useCreditsScroll(config?: UseCreditsScrollConfig): UseCreditsScrollReturn {
  const [scrollState, setScrollState] = useState<ScrollState>({
    position: 0,
    speedIndex: DEFAULT_SPEED_INDEX,
    isScrolling: true,
  })
  const [maxScroll, setMaxScrollState] = useState<number | null>(config?.maxScroll ?? null)
  const [hasReachedEnd, setHasReachedEnd] = useState(false)

  const lastTimeRef = useRef<number>(0)
  const animationFrameRef = useRef<number | null>(null)

  const speedMultiplier = SPEED_LEVELS[scrollState.speedIndex]
  const speedLabel = SPEED_LABELS[speedMultiplier] || `${speedMultiplier}x`

  /**
   * Set maximum scroll position dynamically
   */
  const setMaxScroll = useCallback((max: number) => {
    setMaxScrollState(max)
  }, [])

  /**
   * Increase scroll speed (move up in speed levels array)
   */
  const increaseSpeed = useCallback(() => {
    setScrollState(prev => ({
      ...prev,
      speedIndex: Math.min(prev.speedIndex + 1, SPEED_LEVELS.length - 1),
      isScrolling: true,
    }))
  }, [])

  /**
   * Decrease scroll speed (move down in speed levels array)
   */
  const decreaseSpeed = useCallback(() => {
    setScrollState(prev => {
      const newIndex = Math.max(prev.speedIndex - 1, 0)
      return {
        ...prev,
        speedIndex: newIndex,
        isScrolling: newIndex > 0,
      }
    })
  }, [])

  /**
   * Reset scroll to initial position and default speed
   */
  const resetScroll = useCallback(() => {
    setScrollState({
      position: 0,
      speedIndex: DEFAULT_SPEED_INDEX,
      isScrolling: true,
    })
  }, [])

  /**
   * Animation loop using requestAnimationFrame
   * Calculates delta time for frame-rate-independent scrolling
   * Stops when maxScroll is reached (if set)
   */
  useEffect(() => {
    const animate = (currentTime: number): void => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime
      }

      const deltaTime = (currentTime - lastTimeRef.current) / 1000 // Convert to seconds
      lastTimeRef.current = currentTime

      setScrollState(prev => {
        // Don't scroll if paused or already stopped
        if (!prev.isScrolling || SPEED_LEVELS[prev.speedIndex] === 0) {
          return prev
        }

        // Check if we've reached the maximum scroll position
        if (maxScroll !== null && prev.position >= maxScroll) {
          setHasReachedEnd(true)
          return {
            ...prev,
            position: maxScroll, // Clamp to exact position
            isScrolling: false,
          }
        }

        const scrollIncrement = BASE_SCROLL_SPEED * SPEED_LEVELS[prev.speedIndex] * deltaTime
        const newPosition = prev.position + scrollIncrement

        // Clamp to maxScroll if we would exceed it
        if (maxScroll !== null && newPosition >= maxScroll) {
          setHasReachedEnd(true)
          return {
            ...prev,
            position: maxScroll,
            isScrolling: false,
          }
        }

        return {
          ...prev,
          position: newPosition,
        }
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [maxScroll])

  return {
    scrollState,
    increaseSpeed,
    decreaseSpeed,
    resetScroll,
    setMaxScroll,
    speedMultiplier,
    speedLabel,
    hasReachedEnd,
  }
}
