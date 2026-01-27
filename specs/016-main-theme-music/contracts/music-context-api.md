# Music Context API Contract

**Feature**: 016-main-theme-music
**Type**: React Context API (Internal)

## Overview

This is an internal React Context API, not a REST/GraphQL API. The contract defines the public interface of the `MusicContext` that components will consume.

## Context Provider

### `MusicProvider`

Wraps the application and provides global music state.

**Usage**:
```tsx
// In App.tsx
import { MusicProvider } from './contexts/MusicContext'

function App() {
  return (
    <MusicProvider>
      <Router>
        {/* routes */}
      </Router>
    </MusicProvider>
  )
}
```

**Props**:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| children | `React.ReactNode` | Yes | Child components |

---

## Consumer Hook

### `useMusic()`

Returns the music context value. Must be used within `MusicProvider`.

**Returns**: `MusicContextValue`

**Throws**: `Error` if used outside of `MusicProvider`

**Usage**:
```tsx
import { useMusic } from '../contexts/MusicContext'

function MyComponent() {
  const { playMainTheme, playGameplayMusic, stopMusic, isPlaying, mode } = useMusic()

  // Use music controls...
}
```

---

## Context Value Interface

### Properties (Read-Only)

| Property | Type | Description |
|----------|------|-------------|
| `isPlaying` | `boolean` | `true` if audio is currently playing |
| `currentTrack` | `string \| null` | Path to current track, or `null` if not playing |
| `mode` | `'menu' \| 'gameplay'` | Current playback mode |

### Methods

#### `playMainTheme(): Promise<void>`

Starts playing the main theme song. If already playing main theme, no-op.

**Behavior**:
- Stops any currently playing gameplay music
- Loads and plays `/audio/the-return-of-the-8-bit-era-301292.mp3`
- Sets `mode` to `'menu'`
- Sets `isPlaying` to `true` on success
- Handles autoplay restrictions gracefully (console.warn, not throw)

**Error Handling**:
- If autoplay blocked: Marks internal state, will retry on user interaction
- If audio file fails to load: Logs warning, continues without music

---

#### `playGameplayMusic(): Promise<void>`

Switches to random gameplay music (excludes main theme).

**Behavior**:
- Stops main theme if playing
- Selects random track from gameplay playlist (6 tracks)
- Loads and plays selected track
- Sets `mode` to `'gameplay'`
- Sets `isPlaying` to `true` on success

**Track Selection**:
- Random selection from:
  - `8-bit-console-from-my-childhood-301286.mp3`
  - `8-bit-music-no-copyright-background-instrumental-pixel-party-322342.mp3`
  - `game-8-bit-on-278083.mp3`
  - `level-vii-short-258782.mp3`
  - `retro-8bit-happy-videogame-music-243997.mp3`
  - `the-world-of-8-bit-games-301273.mp3`
- **Never** selects `the-return-of-the-8-bit-era-301292.mp3`

---

#### `stopMusic(): void`

Stops all music playback.

**Behavior**:
- Pauses current audio
- Resets playback position to 0
- Sets `isPlaying` to `false`
- Sets `currentTrack` to `null`
- Does NOT change `mode` (preserves for potential resume)

---

## Audio Configuration

| Setting | Value | Description |
|---------|-------|-------------|
| Volume | `0.3` (30%) | Consistent with existing gameplay music |
| Loop | `true` | Music loops continuously |
| Format | MP3 | All tracks are MP3 format |

---

## Error Scenarios

| Scenario | Behavior | User Impact |
|----------|----------|-------------|
| Autoplay blocked | Stores pending play, triggers on first user interaction | Brief silence until first click/keypress |
| Audio file missing | Logs warning, continues without music | Silent experience, no crash |
| Audio decode error | Logs warning, continues without music | Silent experience, no crash |

---

## Integration Points

### Components That Call `useMusic()`

| Component | Action | When |
|-----------|--------|------|
| `PlayerSelectPage` | `playMainTheme()` | On mount (first screen) |
| `HomePage` | (none) | Main theme continues from context |
| `PlayPage` | `playGameplayMusic()` on mount, `stopMusic()` on unmount | Start/end of gameplay |
| `GameResultsPage` | `playMainTheme()` | On mount (after gameplay) |

### No External APIs

This feature is purely client-side. No network requests, REST APIs, or server communication required.
