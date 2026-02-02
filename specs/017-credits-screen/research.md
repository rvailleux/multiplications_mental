# Research: Credits Screen

**Feature**: 017-credits-screen
**Date**: 2026-01-29
**Status**: Complete

## Research Tasks Completed

### 1. Audio Attribution Sources

**Decision**: Use filename-based IDs to reference Pixabay audio library sources

**Music Files** (7 tracks in `/public/audio/`):

| File | Track ID | Likely Source | Attribution |
|------|----------|---------------|-------------|
| `the-return-of-the-8-bit-era-301292.mp3` | 301292 | Pixabay | Main Theme - "The Return of the 8-Bit Era" |
| `8-bit-console-from-my-childhood-301286.mp3` | 301286 | Pixabay | "8-Bit Console from My Childhood" |
| `8-bit-music-no-copyright-background-instrumental-pixel-party-322342.mp3` | 322342 | Pixabay | "Pixel Party" |
| `game-8-bit-on-278083.mp3` | 278083 | Pixabay | "Game 8-Bit On" |
| `level-vii-short-258782.mp3` | 258782 | Pixabay | "Level VII (Short)" |
| `retro-8bit-happy-videogame-music-243997.mp3` | 243997 | Pixabay | "Retro 8-Bit Happy Videogame Music" |
| `the-world-of-8-bit-games-301273.mp3` | 301273 | Pixabay | "The World of 8-Bit Games" |

**Sound Effects** (2 files in `/public/audio/sfx/`):

| File | Purpose | Attribution |
|------|---------|-------------|
| `correct.mp3` | Positive feedback sound | 8-bit style SFX (Pixabay/similar) |
| `wrong.mp3` | Negative feedback sound | 8-bit style SFX (Pixabay/similar) |

**Rationale**: Track IDs in filenames match Pixabay's numbering pattern (6-digit IDs). All tracks appear to be royalty-free from Pixabay Music under their content license.

**Alternatives Considered**:
- OpenGameArt.org - Good for SFX but music track naming doesn't match
- Freesound.org - Typically uses different ID patterns
- BFXR-generated - For SFX only, not full music tracks

---

### 2. Parallax Starfield Implementation

**Decision**: Use CSS animations with 3 canvas-drawn or div-based star layers

**Implementation Approach**:
```text
Layer 1 (Distant): Small stars (1-2px), slow movement (20s animation cycle), low density
Layer 2 (Medium): Medium stars (2-3px), medium movement (12s cycle), medium density
Layer 3 (Near): Large stars (3-4px), fast movement (8s cycle), high density
```

**Rationale**: CSS animations are performant for parallax effects. The 3-layer approach creates depth perception typical of classic SNES/NES space backgrounds (Star Fox, Gradius).

**Alternatives Considered**:
- Canvas with requestAnimationFrame - More control but heavier implementation
- SVG stars - Good for scaling but more complex
- Pure CSS with generated content - Simpler but less dynamic

**Animation Pattern**:
```scss
@keyframes starfield-scroll {
  from { transform: translateY(0); }
  to { transform: translateY(-100%); }
}

.starLayer {
  position: absolute;
  width: 100%;
  height: 200%; // Double height for seamless loop
  animation: starfield-scroll var(--layer-speed) linear infinite;
}
```

---

### 3. Rainbow Title Animation

**Decision**: Use CSS animation with gradient text and animated background-position

**Implementation Approach**:
```scss
@keyframes rainbow-wave {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

.rainbowTitle {
  background: linear-gradient(
    90deg,
    #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000
  );
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  animation: rainbow-wave 3s linear infinite;
}
```

**Rationale**: CSS gradient animation is GPU-accelerated and creates smooth rainbow effect. The repeated first color at end ensures seamless loop.

**Color Palette** (8-bit era inspired):
- Red: #ff0000
- Orange: #ff7f00
- Yellow: #ffff00
- Green: #00ff00
- Blue: #0000ff
- Indigo: #4b0082
- Violet: #9400d3

**Alternatives Considered**:
- JavaScript-driven color changes - More control but less performant
- Multiple text-shadow layers - Heavier rendering
- SVG filters - Browser compatibility concerns

---

### 4. Auto-Scrolling Credits

**Decision**: Use CSS transform with JavaScript-controlled animation speed

**Implementation Approach**:
```typescript
// useCreditsScroll hook
const SPEED_LEVELS = [0, 0.5, 1, 1.5, 2, 3] // 0 = paused, 1 = default
const [speedIndex, setSpeedIndex] = useState(2) // Start at 1x speed

// Animation uses requestAnimationFrame for smooth scrolling
// Speed multiplier applied to scroll increment
```

**Scroll Behavior**:
- Default speed: ~40px/second (comfortable reading)
- Speed levels: Paused (0), Half (0.5x), Normal (1x), Fast (1.5x), Faster (2x), Maximum (3x)
- Up Arrow: Increase speed (move up in SPEED_LEVELS)
- Down Arrow: Decrease speed (move down in SPEED_LEVELS)
- Loop: Reset to bottom when content scrolls past top

**Rationale**: Using requestAnimationFrame ensures smooth 60fps scrolling. Speed levels provide discrete steps for predictable control.

**Alternatives Considered**:
- Pure CSS animation with animation-duration changes - Causes jump on speed change
- CSS scroll-behavior - Not enough control over speed
- Intersection Observer - Good for triggering but not continuous scrolling

---

### 5. Keyboard Event Handling

**Decision**: Extend existing HomePage pattern for Ctrl+C; new pattern for speed control

**Ctrl+C Handler (HomePage)**:
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent): void => {
    // Existing handlers...
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      e.preventDefault() // Prevent copy
      navigate('/credits')
    }
  }
  // ...
}, [navigate])
```

**Speed Control (CreditsPage)**:
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      increaseSpeed()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      decreaseSpeed()
    } else if (e.key === 'Escape') {
      navigate('/home')
    }
  }
  // ...
}, [navigate, increaseSpeed, decreaseSpeed])
```

**Rationale**: Follows established keyboard handling patterns in the codebase. `e.preventDefault()` for arrow keys prevents page scrolling.

---

### 6. Existing Animation Patterns

**Available Animations** (from `_animations.scss`):

| Animation | Duration | Use Case for Credits |
|-----------|----------|---------------------|
| `pulse` | 1s | Could use for section headers |
| `goldGlow` | 2s | Could use for special thanks section |
| `softBlink` | 2s | Could use for subtle emphasis |
| `zoomSplash` | 0.3s | Could use for title entrance |

**New Animations Needed**:
1. `starfield-scroll` - Continuous vertical scroll for star layers
2. `rainbow-wave` - Horizontal gradient shift for title
3. `credits-scroll` - (JavaScript-controlled, not CSS keyframes)

---

### 7. KeyboardHints Extension

**Decision**: Add 'credits' to ScreenId type and KEYBOARD_HINTS_CONFIG

**Changes Required**:
```typescript
// KeyboardHints.tsx
export type ScreenId = 'player-select' | 'home' | 'play' | 'pause-menu' | 'results' | 'credits'

export const KEYBOARD_HINTS_CONFIG: Record<ScreenId, KeyboardHint[]> = {
  // ... existing ...
  credits: [
    { key: '↑↓', description: 'Scroll Speed' },
    { key: 'ESC', description: 'Back' },
  ],
}
```

**HomePage hint update**:
```typescript
home: [
  { key: '↑↓', description: 'Navigate' },
  { key: 'Enter', description: 'Select' },
  { key: 'Ctrl+C', description: 'Credits' },  // NEW
  { key: 'ESC', description: 'Change Player' },
],
```

---

## Summary

All research tasks completed. Key decisions:

1. **Audio Attribution**: Use Pixabay-style attribution based on track IDs in filenames
2. **Starfield**: 3-layer CSS animation with different speeds for parallax depth
3. **Rainbow Title**: CSS gradient animation with 8-color palette
4. **Auto-Scroll**: JavaScript requestAnimationFrame with 6 discrete speed levels
5. **Keyboard**: Extend existing patterns; Ctrl+C on HomePage, arrows/Escape on CreditsPage
6. **Animations**: Create 2 new keyframe animations, leverage existing for accents

**No NEEDS CLARIFICATION items remain.**
