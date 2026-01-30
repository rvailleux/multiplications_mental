import { useEffect, useRef } from 'react'
import type { CreditsSection, ScrollState } from '../types/credits'
import { FINAL_CREDIT } from '../data/creditsData'
import styles from './CreditsContent.module.scss'

/**
 * Props for the CreditsContent component
 * @public
 */
export interface CreditsContentProps {
  /** Array of credits sections to display */
  creditsData: CreditsSection[]
  /** Current scroll state from useCreditsScroll hook */
  scrollState: ScrollState
  /** Callback when max scroll position is calculated (for scrolling all content off screen) */
  onMaxScrollCalculated?: (maxScroll: number) => void
}

/**
 * Scrolling credits content component
 * Displays all attribution sections in a vertically scrolling container.
 * Position is controlled by the scrollState from useCreditsScroll hook.
 *
 * Sections include:
 * - Music (with artist attribution)
 * - Sound Effects
 * - Made with (tech stack)
 * - Special Thanks
 *
 * @param props - Component properties
 * @returns JSX element with scrolling credits
 *
 * @example
 * ```tsx
 * const { scrollState } = useCreditsScroll()
 * <CreditsContent creditsData={CREDITS_DATA} scrollState={scrollState} />
 * ```
 */
export default function CreditsContent({
  creditsData,
  scrollState,
  onMaxScrollCalculated,
}: CreditsContentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const finalCreditRef = useRef<HTMLDivElement>(null)

  /**
   * Calculate max scroll position to scroll all content off screen
   * This runs once after initial render when refs are available
   */
  useEffect(() => {
    if (!onMaxScrollCalculated || !containerRef.current || !finalCreditRef.current) {
      return
    }

    // Get the container height (viewport area)
    const containerHeight = containerRef.current.offsetHeight

    // Get the final credit element's position and size
    const finalCreditTop = finalCreditRef.current.offsetTop
    const finalCreditHeight = finalCreditRef.current.offsetHeight

    // Calculate scroll position where entire content (including final credit) exits the top
    // We need to scroll until the bottom of the final credit moves past the top of viewport
    // This requires scrolling by: finalCreditTop + finalCreditHeight + some extra buffer
    const maxScroll = finalCreditTop + finalCreditHeight + containerHeight

    // Small delay to ensure layout is complete
    const timeoutId = setTimeout(() => {
      onMaxScrollCalculated(Math.max(0, maxScroll))
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [onMaxScrollCalculated])

  return (
    <div
      ref={containerRef}
      className={styles.creditsContent}
      data-testid="credits-content"
      data-scroll-position={Math.floor(scrollState.position)}
    >
      <div
        className={styles.scrollContainer}
        style={{
          transform: `translateY(-${scrollState.position}px)`,
        }}
      >
        {creditsData.map((section, sectionIndex) => (
          <div key={section.title} className={styles.section}>
            <h2 className={styles.sectionHeader}>
              {section.icon && <span className={styles.sectionIcon}>{section.icon}</span>}
              {section.title}
            </h2>

            <div className={styles.attributionList}>
              {section.items.map((item, itemIndex) => (
                <div key={`${section.title}-${itemIndex}`} className={styles.attributionItem}>
                  <span className={styles.attributionName}>{item.name}</span>
                  {item.description && (
                    <span className={styles.attributionDescription}>{item.description}</span>
                  )}
                  {item.author && <span className={styles.attributionAuthor}>{item.author}</span>}
                </div>
              ))}
            </div>

            {/* Add separator between sections (except last) */}
            {sectionIndex < creditsData.length - 1 && <div className={styles.separator} />}
          </div>
        ))}

        {/* Separator before final credit */}
        <div className={styles.separator} />

        {/* Final credit - scrolls off screen with rest of content */}
        <div ref={finalCreditRef} className={styles.finalCredit} data-testid="final-credit">
          {FINAL_CREDIT}
        </div>
      </div>
    </div>
  )
}
