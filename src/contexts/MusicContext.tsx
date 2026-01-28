import { createContext, useContext, useRef, useState, useCallback, ReactNode } from 'react'
import type { MusicMode, MusicContextValue } from '../types/music'

/**
 * Base URL for assets - handles GitHub Pages subdirectory deployment
 */
const BASE_URL = import.meta.env.BASE_URL

/**
 * Main theme song path - played on all menu screens
 * @public
 */
export const MAIN_THEME = `${BASE_URL}audio/the-return-of-the-8-bit-era-301292.mp3`

/**
 * All available music tracks
 */
const ALL_TRACKS = [
  `${BASE_URL}audio/8-bit-console-from-my-childhood-301286.mp3`,
  `${BASE_URL}audio/8-bit-music-no-copyright-background-instrumental-pixel-party-322342.mp3`,
  `${BASE_URL}audio/game-8-bit-on-278083.mp3`,
  `${BASE_URL}audio/level-vii-short-258782.mp3`,
  `${BASE_URL}audio/retro-8bit-happy-videogame-music-243997.mp3`,
  `${BASE_URL}audio/the-return-of-the-8-bit-era-301292.mp3`,
  `${BASE_URL}audio/the-world-of-8-bit-games-301273.mp3`,
]

/**
 * Gameplay tracks - excludes main theme
 * @public
 */
export const GAMEPLAY_TRACKS = ALL_TRACKS.filter(track => track !== MAIN_THEME)

/**
 * Standard music volume (30%)
 * @public
 */
export const MUSIC_VOLUME = 0.3

/**
 * Music context - null by default, provided by MusicProvider
 */
const MusicContext = createContext<MusicContextValue | null>(null)

/**
 * Props for MusicProvider component
 */
interface MusicProviderProps {
  children: ReactNode
}

/**
 * Global music state provider
 * Wraps the application and provides music controls to all child components
 * Uses a single Audio instance that persists across route changes
 * @param props - Provider props containing children
 * @returns Provider component wrapping children
 * @example
 * ```tsx
 * <MusicProvider>
 *   <Router>
 *     <App />
 *   </Router>
 * </MusicProvider>
 * ```
 */
export function MusicProvider({ children }: MusicProviderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<string | null>(null)
  const [mode, setMode] = useState<MusicMode>('menu')
  // Track autoplay blocked state for potential UI feedback
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)
  // Use underscore prefix pattern to indicate intentionally unused variable
  void autoplayBlocked // Satisfy TS - value tracked but not exposed

  /**
   * Helper function to setup user interaction listeners for autoplay fallback
   */
  const setupInteractionListeners = useCallback((playFunction: () => Promise<void>) => {
    const handleInteraction = async () => {
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
      setAutoplayBlocked(false)
      await playFunction()
    }
    window.addEventListener('click', handleInteraction, { once: true })
    window.addEventListener('keydown', handleInteraction, { once: true })
  }, [])

  /**
   * Plays the main theme song
   * If already playing main theme, returns early (no restart)
   * Handles browser autoplay restrictions gracefully
   */
  const playMainTheme = useCallback(async (): Promise<void> => {
    // Early return if already playing main theme (music continuity)
    if (currentTrack === MAIN_THEME && isPlaying) {
      return
    }

    try {
      // Stop any current audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }

      // Create and configure new audio
      const audio = new Audio(MAIN_THEME)
      audio.loop = true
      audio.volume = MUSIC_VOLUME

      audioRef.current = audio
      setCurrentTrack(MAIN_THEME)
      setMode('menu')

      await audio.play()
      setIsPlaying(true)
    } catch (error) {
      if (error instanceof Error && error.name === 'NotAllowedError') {
        console.warn('Autoplay blocked - music will start on first user interaction')
        setAutoplayBlocked(true)
        setupInteractionListeners(playMainTheme)
      } else {
        console.warn('Failed to play main theme:', error)
      }
      setIsPlaying(false)
    }
  }, [currentTrack, isPlaying, setupInteractionListeners])

  /**
   * Plays random gameplay music (excludes main theme)
   * Selects from GAMEPLAY_TRACKS array
   */
  const playGameplayMusic = useCallback(async (): Promise<void> => {
    try {
      // Stop any current audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }

      // Select random track from gameplay tracks (never main theme)
      const randomIndex = Math.floor(Math.random() * GAMEPLAY_TRACKS.length)
      const selectedTrack = GAMEPLAY_TRACKS[randomIndex]

      // Create and configure new audio
      const audio = new Audio(selectedTrack)
      audio.loop = true
      audio.volume = MUSIC_VOLUME

      audioRef.current = audio
      setCurrentTrack(selectedTrack)
      setMode('gameplay')

      await audio.play()
      setIsPlaying(true)
    } catch (error) {
      if (error instanceof Error && error.name === 'NotAllowedError') {
        console.warn('Autoplay blocked - music will start on first user interaction')
        setAutoplayBlocked(true)
        setupInteractionListeners(playGameplayMusic)
      } else {
        console.warn('Failed to play gameplay music:', error)
      }
      setIsPlaying(false)
    }
  }, [setupInteractionListeners])

  /**
   * Stops all music playback
   * Resets audio position but preserves mode for potential resume
   */
  const stopMusic = useCallback((): void => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setIsPlaying(false)
    setCurrentTrack(null)
    // Note: mode is preserved for potential resume
  }, [])

  const value: MusicContextValue = {
    isPlaying,
    currentTrack,
    mode,
    playMainTheme,
    playGameplayMusic,
    stopMusic,
  }

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
}

/**
 * Hook to access music context
 * Must be used within a MusicProvider
 * @returns Music context value with state and controls
 * @throws Error if used outside MusicProvider
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { playMainTheme, isPlaying } = useMusic()
 *   // ...
 * }
 * ```
 */
export function useMusic(): MusicContextValue {
  const context = useContext(MusicContext)
  if (!context) {
    throw new Error('useMusic must be used within MusicProvider')
  }
  return context
}
