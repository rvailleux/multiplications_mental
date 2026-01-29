/**
 * Static data for the credits screen
 * @module data/creditsData
 */

import type { CreditsSection, StarLayerConfig } from '../types/credits'

/**
 * Complete credits content for the game
 * Contains all audio attributions, tech stack, and special thanks
 * @public
 */
/**
 * Final credit text displayed at the end
 * Scroll stops when this reaches the center of the screen
 * @public
 */
export const FINAL_CREDIT = '@rvailleux'

export const CREDITS_DATA: CreditsSection[] = [
  {
    title: 'Music',
    icon: '🎵',
    items: [
      {
        name: 'The Return of the 8-Bit Era',
        author: 'Krzysztof Szymanski',
        description: 'Main Theme',
      },
      { name: '8-Bit Console from My Childhood', author: 'Krzysztof Szymanski' },
      { name: 'Game 8-Bit On', author: 'Vlad Krotov' },
      { name: 'Level VII (Short)', author: 'Vlad Krotov' },
      { name: 'Retro 8-Bit Happy Videogame Music', author: 'NiKneT_Art' },
      { name: 'The World of 8-Bit Games', author: 'Krzysztof Szymanski' },
      {
        name: '8 bit music no copyright background instrumental Pixel Party',
        author: 'NoCopyrightSound633',
      },
    ],
  },
  {
    title: 'Sound Effects',
    icon: '🔊',
    items: [
      { name: 'Correct Answer SFX', description: '8-bit positive feedback' },
      { name: 'Wrong Answer SFX', description: '8-bit negative feedback' },
    ],
  },
  {
    title: 'Made with',
    icon: '🛠️',
    items: [
      { name: 'React', description: 'UI Framework' },
      { name: 'TypeScript', description: 'Language' },
      { name: 'Vite', description: 'Build Tool' },
    ],
  },
  {
    title: 'Special Thanks',
    icon: '💖',
    items: [
      { name: 'The Players', description: 'For playing and enjoying the game' },
      { name: 'Open Source Community', description: 'For amazing tools and libraries' },
    ],
  },
]

/**
 * Default starfield layer configurations
 * Three layers for parallax depth effect
 * - Distant: Small, slow stars for depth
 * - Medium: Mid-sized stars at medium speed
 * - Near: Large, fast stars for foreground
 * @public
 */
export const STARFIELD_CONFIG: StarLayerConfig[] = [
  {
    id: 'distant',
    starSize: 1,
    starCount: 80,
    animationDuration: 20,
    opacity: 0.5,
    color: '#ffffff',
  },
  {
    id: 'medium',
    starSize: 2,
    starCount: 50,
    animationDuration: 12,
    opacity: 0.7,
    color: '#ffffff',
  },
  {
    id: 'near',
    starSize: 3,
    starCount: 30,
    animationDuration: 8,
    opacity: 1.0,
    color: '#ffffff',
  },
]
