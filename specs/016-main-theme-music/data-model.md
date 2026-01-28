# Data Model: Main Theme Music

**Feature**: 016-main-theme-music
**Date**: 2026-01-27

## Entities

### MusicMode

Represents the current music playback mode.

| Field | Type | Description |
|-------|------|-------------|
| mode | `'menu' \| 'gameplay'` | Current music mode - menu screens vs gameplay |

**State Transitions**:
```
[Initial] → menu (on app load)
menu → gameplay (when navigating to /play)
gameplay → menu (when leaving /play - timer ends, quit, or results)
```

---

### MusicState

Internal state for the music context.

| Field | Type | Description |
|-------|------|-------------|
| isPlaying | `boolean` | Whether audio is currently playing |
| currentTrack | `string \| null` | Path to currently playing track (null if not playing) |
| mode | `MusicMode` | Current playback mode |
| autoplayBlocked | `boolean` | Whether browser blocked autoplay |

**Default Values**:
```typescript
{
  isPlaying: false,
  currentTrack: null,
  mode: 'menu',
  autoplayBlocked: false
}
```

---

### MusicContextValue

Public interface exposed by the music context.

| Field | Type | Description |
|-------|------|-------------|
| isPlaying | `boolean` | Read-only: whether audio is playing |
| currentTrack | `string \| null` | Read-only: current track path |
| mode | `MusicMode` | Read-only: current mode |
| playMainTheme | `() => Promise<void>` | Start/resume main theme |
| playGameplayMusic | `() => Promise<void>` | Switch to random gameplay track |
| stopMusic | `() => void` | Stop all music |

---

### Track Constants

Static configuration for audio tracks.

| Constant | Type | Value |
|----------|------|-------|
| `MAIN_THEME` | `string` | `'/audio/the-return-of-the-8-bit-era-301292.mp3'` |
| `ALL_TRACKS` | `readonly string[]` | Array of 7 track paths |
| `GAMEPLAY_TRACKS` | `string[]` | Array of 6 track paths (excludes main theme) |
| `MUSIC_VOLUME` | `number` | `0.3` (30%) |

---

## Validation Rules

### Track Path Validation
- All track paths must start with `/audio/`
- Track paths must end with `.mp3`
- Track files must exist in `/public/audio/` directory

### Mode Transitions
- Can only transition from `menu` to `gameplay` when on `/play` route
- Can only transition from `gameplay` to `menu` when leaving `/play` route
- Direct `menu` to `menu` transitions are no-ops (music continues)

### Audio State
- `isPlaying` can only be `true` if `currentTrack` is not `null`
- `currentTrack` must be either `MAIN_THEME` (when mode=menu) or one of `GAMEPLAY_TRACKS` (when mode=gameplay)

---

## Type Definitions

```typescript
/**
 * Music playback mode
 */
export type MusicMode = 'menu' | 'gameplay'

/**
 * Internal music state
 */
export interface MusicState {
  isPlaying: boolean
  currentTrack: string | null
  mode: MusicMode
  autoplayBlocked: boolean
}

/**
 * Public music context API
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
 */
export interface MusicProviderProps {
  children: React.ReactNode
}
```

---

## No Persistence Required

This feature does not require localStorage or any persistent storage:
- Music state is ephemeral (resets on page refresh)
- No user preferences for music (out of scope)
- No need to save/restore playback position
