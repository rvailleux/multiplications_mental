import { useEffect, useRef, useState } from 'react'

/**
 * Base URL for assets - handles GitHub Pages subdirectory deployment
 */
const BASE_URL = import.meta.env.BASE_URL

/**
 * Available background music tracks for the game
 */
const MUSIC_TRACKS = [
  `${BASE_URL}audio/8-bit-console-from-my-childhood-301286.mp3`,
  `${BASE_URL}audio/8-bit-music-no-copyright-background-instrumental-pixel-party-322342.mp3`,
  `${BASE_URL}audio/game-8-bit-on-278083.mp3`,
  `${BASE_URL}audio/level-vii-short-258782.mp3`,
  `${BASE_URL}audio/retro-8bit-happy-videogame-music-243997.mp3`,
  `${BASE_URL}audio/the-return-of-the-8-bit-era-301292.mp3`,
  `${BASE_URL}audio/the-world-of-8-bit-games-301273.mp3`,
]

/**
 * Custom hook for managing background music during gameplay
 * Randomly selects and plays a track in loop, with proper cleanup
 *
 * @deprecated Use useMusic from MusicContext instead for global music state management.
 * This hook creates new Audio instances per component mount, causing music restarts on navigation.
 * MusicContext provides a single Audio instance that persists across route changes.
 *
 * @returns Object with music controls and current track info
 * @example
 * // Old usage (deprecated):
 * // const { isPlaying, currentTrack, startMusic, stopMusic } = useBackgroundMusic()
 *
 * // New usage (recommended):
 * // const { isPlaying, currentTrack, playMainTheme, playGameplayMusic, stopMusic } = useMusic()
 */
export function useBackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<string | null>(null)

  /**
   * Randomly selects a music track from the available tracks
   * @returns {string} Path to the selected music file
   */
  const selectRandomTrack = (): string => {
    const randomIndex = Math.floor(Math.random() * MUSIC_TRACKS.length)
    return MUSIC_TRACKS[randomIndex]
  }

  /**
   * Starts playing a randomly selected background music track
   */
  const startMusic = async (): Promise<void> => {
    try {
      // Stop any existing music
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }

      // Select and load new track
      const selectedTrack = selectRandomTrack()
      const audio = new Audio(selectedTrack)

      // Configure audio settings
      audio.loop = true
      audio.volume = 0.3 // Set to 30% volume for background music

      // Set up audio reference
      audioRef.current = audio
      setCurrentTrack(selectedTrack)

      // Play the music
      await audio.play()
      setIsPlaying(true)
    } catch (error) {
      console.warn('Failed to play background music:', error)
      setIsPlaying(false)
      setCurrentTrack(null)
    }
  }

  /**
   * Stops the currently playing background music
   */
  const stopMusic = (): void => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setIsPlaying(false)
    setCurrentTrack(null)
  }

  /**
   * Cleanup music when component unmounts
   */
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  return {
    isPlaying,
    currentTrack,
    startMusic,
    stopMusic,
  }
}
