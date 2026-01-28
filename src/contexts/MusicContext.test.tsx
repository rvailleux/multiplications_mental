import { render, screen, renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MusicProvider, useMusic, MAIN_THEME, GAMEPLAY_TRACKS, MUSIC_VOLUME } from './MusicContext'

// Create fresh mock for each test
const createMockAudio = () => ({
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  currentTime: 0,
  volume: 1,
  loop: false,
  src: '',
})

let mockAudioInstance = createMockAudio()

// Mock Audio as a constructor function
class MockAudio {
  play = mockAudioInstance.play
  pause = mockAudioInstance.pause
  addEventListener = mockAudioInstance.addEventListener
  removeEventListener = mockAudioInstance.removeEventListener
  currentTime = mockAudioInstance.currentTime
  volume = mockAudioInstance.volume
  loop = mockAudioInstance.loop
  src = mockAudioInstance.src
}

vi.stubGlobal('Audio', MockAudio)

describe('MusicContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAudioInstance = createMockAudio()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('MusicProvider', () => {
    it('should render children', () => {
      render(
        <MusicProvider>
          <div data-testid="child">Test Child</div>
        </MusicProvider>
      )
      expect(screen.getByTestId('child')).toBeInTheDocument()
    })
  })

  describe('useMusic hook', () => {
    it('should throw error when used outside MusicProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        renderHook(() => useMusic())
      }).toThrow('useMusic must be used within MusicProvider')

      consoleSpy.mockRestore()
    })

    it('should return initial state values', () => {
      const { result } = renderHook(() => useMusic(), {
        wrapper: MusicProvider,
      })

      expect(result.current.isPlaying).toBe(false)
      expect(result.current.currentTrack).toBe(null)
      expect(result.current.mode).toBe('menu')
    })

    it('should provide playMainTheme function', () => {
      const { result } = renderHook(() => useMusic(), {
        wrapper: MusicProvider,
      })

      expect(typeof result.current.playMainTheme).toBe('function')
    })

    it('should provide playGameplayMusic function', () => {
      const { result } = renderHook(() => useMusic(), {
        wrapper: MusicProvider,
      })

      expect(typeof result.current.playGameplayMusic).toBe('function')
    })

    it('should provide stopMusic function', () => {
      const { result } = renderHook(() => useMusic(), {
        wrapper: MusicProvider,
      })

      expect(typeof result.current.stopMusic).toBe('function')
    })
  })

  describe('Constants', () => {
    it('should export MAIN_THEME constant', () => {
      expect(MAIN_THEME).toBe('/audio/the-return-of-the-8-bit-era-301292.mp3')
    })

    it('should export GAMEPLAY_TRACKS without main theme', () => {
      expect(GAMEPLAY_TRACKS).not.toContain(MAIN_THEME)
      expect(GAMEPLAY_TRACKS.length).toBe(6)
    })

    it('should export MUSIC_VOLUME constant', () => {
      expect(MUSIC_VOLUME).toBe(0.3)
    })
  })

  describe('User Story 1: playMainTheme', () => {
    it('should set mode to menu when playing main theme', async () => {
      const { result } = renderHook(() => useMusic(), {
        wrapper: MusicProvider,
      })

      await act(async () => {
        await result.current.playMainTheme()
      })

      expect(result.current.mode).toBe('menu')
    })

    it('should set isPlaying to true on success', async () => {
      const { result } = renderHook(() => useMusic(), {
        wrapper: MusicProvider,
      })

      await act(async () => {
        await result.current.playMainTheme()
      })

      expect(result.current.isPlaying).toBe(true)
    })

    it('should set currentTrack to MAIN_THEME path', async () => {
      const { result } = renderHook(() => useMusic(), {
        wrapper: MusicProvider,
      })

      await act(async () => {
        await result.current.playMainTheme()
      })

      expect(result.current.currentTrack).toBe(MAIN_THEME)
    })

    it('should handle autoplay blocked gracefully (no throw)', async () => {
      // Mock audio play to throw NotAllowedError
      mockAudioInstance.play = vi
        .fn()
        .mockRejectedValue(
          Object.assign(new Error('Autoplay blocked'), { name: 'NotAllowedError' })
        )

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const { result } = renderHook(() => useMusic(), {
        wrapper: MusicProvider,
      })

      // Should not throw
      await act(async () => {
        await result.current.playMainTheme()
      })

      expect(result.current.isPlaying).toBe(false)
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Autoplay blocked - music will start on first user interaction'
      )

      consoleWarnSpy.mockRestore()
    })
  })

  describe('User Story 1: Autoplay fallback', () => {
    it('should add user interaction listeners when autoplay blocked', async () => {
      // Mock audio play to throw NotAllowedError
      mockAudioInstance.play = vi
        .fn()
        .mockRejectedValue(
          Object.assign(new Error('Autoplay blocked'), { name: 'NotAllowedError' })
        )

      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const { result } = renderHook(() => useMusic(), {
        wrapper: MusicProvider,
      })

      await act(async () => {
        await result.current.playMainTheme()
      })

      // Verify interaction listeners were added
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
        expect.objectContaining({ once: true })
      )
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function),
        expect.objectContaining({ once: true })
      )

      addEventListenerSpy.mockRestore()
      consoleWarnSpy.mockRestore()
    })
  })

  describe('User Story 2: playGameplayMusic', () => {
    it('should set mode to gameplay', async () => {
      const { result } = renderHook(() => useMusic(), {
        wrapper: MusicProvider,
      })

      await act(async () => {
        await result.current.playGameplayMusic()
      })

      expect(result.current.mode).toBe('gameplay')
    })

    it('should select track from GAMEPLAY_TRACKS (not MAIN_THEME)', async () => {
      const { result } = renderHook(() => useMusic(), {
        wrapper: MusicProvider,
      })

      await act(async () => {
        await result.current.playGameplayMusic()
      })

      expect(result.current.currentTrack).not.toBe(MAIN_THEME)
      expect(GAMEPLAY_TRACKS).toContain(result.current.currentTrack)
    })

    it('should set isPlaying to true', async () => {
      const { result } = renderHook(() => useMusic(), {
        wrapper: MusicProvider,
      })

      await act(async () => {
        await result.current.playGameplayMusic()
      })

      expect(result.current.isPlaying).toBe(true)
    })

    it('should stop current audio before playing new track', async () => {
      const { result } = renderHook(() => useMusic(), {
        wrapper: MusicProvider,
      })

      // Play main theme first
      await act(async () => {
        await result.current.playMainTheme()
      })

      const pauseSpy = mockAudioInstance.pause

      // Then switch to gameplay
      await act(async () => {
        await result.current.playGameplayMusic()
      })

      expect(pauseSpy).toHaveBeenCalled()
    })
  })

  describe('User Story 2: stopMusic', () => {
    it('should pause audio', async () => {
      const { result } = renderHook(() => useMusic(), {
        wrapper: MusicProvider,
      })

      // Start playing
      await act(async () => {
        await result.current.playMainTheme()
      })

      const pauseSpy = mockAudioInstance.pause

      // Stop
      act(() => {
        result.current.stopMusic()
      })

      expect(pauseSpy).toHaveBeenCalled()
    })

    it('should set isPlaying to false', async () => {
      const { result } = renderHook(() => useMusic(), {
        wrapper: MusicProvider,
      })

      await act(async () => {
        await result.current.playMainTheme()
      })

      act(() => {
        result.current.stopMusic()
      })

      expect(result.current.isPlaying).toBe(false)
    })

    it('should set currentTrack to null', async () => {
      const { result } = renderHook(() => useMusic(), {
        wrapper: MusicProvider,
      })

      await act(async () => {
        await result.current.playMainTheme()
      })

      act(() => {
        result.current.stopMusic()
      })

      expect(result.current.currentTrack).toBe(null)
    })

    it('should preserve mode after stopping', async () => {
      const { result } = renderHook(() => useMusic(), {
        wrapper: MusicProvider,
      })

      // Play gameplay music
      await act(async () => {
        await result.current.playGameplayMusic()
      })

      expect(result.current.mode).toBe('gameplay')

      // Stop
      act(() => {
        result.current.stopMusic()
      })

      // Mode should be preserved
      expect(result.current.mode).toBe('gameplay')
    })
  })

  describe('User Story 2: Track selection', () => {
    it('should never select main theme in gameplay tracks array', () => {
      expect(GAMEPLAY_TRACKS).not.toContain(MAIN_THEME)
    })

    it('should have 6 gameplay tracks', () => {
      expect(GAMEPLAY_TRACKS.length).toBe(6)
    })

    it('should select random gameplay track (100 iterations)', async () => {
      // Run multiple times to ensure randomness never selects main theme
      for (let i = 0; i < 100; i++) {
        const { result } = renderHook(() => useMusic(), {
          wrapper: MusicProvider,
        })

        await act(async () => {
          await result.current.playGameplayMusic()
        })

        expect(result.current.currentTrack).not.toBe(MAIN_THEME)
      }
    })
  })

  describe('User Story 3: Music continuity', () => {
    it('should be no-op if already playing main theme', async () => {
      const { result } = renderHook(() => useMusic(), {
        wrapper: MusicProvider,
      })

      // Play main theme
      await act(async () => {
        await result.current.playMainTheme()
      })

      const initialTrack = result.current.currentTrack
      expect(result.current.isPlaying).toBe(true)

      // Reset the play mock to track if it's called again
      mockAudioInstance.play.mockClear()

      // Call playMainTheme again - should be no-op
      await act(async () => {
        await result.current.playMainTheme()
      })

      // play() should NOT have been called again (no-op behavior)
      expect(mockAudioInstance.play).not.toHaveBeenCalled()
      expect(result.current.currentTrack).toBe(initialTrack)
    })

    it('should not restart audio on mode transition menu→menu', async () => {
      const { result } = renderHook(() => useMusic(), {
        wrapper: MusicProvider,
      })

      // Play main theme
      await act(async () => {
        await result.current.playMainTheme()
      })

      expect(result.current.mode).toBe('menu')

      // Reset the play mock
      mockAudioInstance.play.mockClear()

      // Play main theme again (simulating navigation between menu screens)
      await act(async () => {
        await result.current.playMainTheme()
      })

      // Should still be menu mode, play() not called again
      expect(result.current.mode).toBe('menu')
      expect(mockAudioInstance.play).not.toHaveBeenCalled()
    })
  })
})
