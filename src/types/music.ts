/**
 * Music playback mode
 * @public
 */
export type MusicMode = 'menu' | 'gameplay'

/**
 * Internal music state managed by MusicProvider
 * @public
 */
export interface MusicState {
  /** Whether audio is currently playing */
  isPlaying: boolean
  /** Path to currently playing track, or null if not playing */
  currentTrack: string | null
  /** Current playback mode */
  mode: MusicMode
  /** Whether browser blocked autoplay */
  autoplayBlocked: boolean
}

/**
 * Public music context API exposed by useMusic hook
 * @public
 */
export interface MusicContextValue {
  /** Whether audio is currently playing */
  isPlaying: boolean
  /** Path to current track or null */
  currentTrack: string | null
  /** Current playback mode */
  mode: MusicMode
  /** Start or resume main theme music */
  playMainTheme: () => Promise<void>
  /** Switch to random gameplay music */
  playGameplayMusic: () => Promise<void>
  /** Stop all music playback */
  stopMusic: () => void
}

/**
 * Props for MusicProvider component
 * @public
 */
export interface MusicProviderProps {
  /** Child components that can access music context */
  children: React.ReactNode
}
