# Research: Main Theme Music

**Feature**: 016-main-theme-music
**Date**: 2026-01-27

## Research Tasks

### 1. Global Music State Management Pattern

**Context**: Music must persist across route changes (Player Select → Home → Play → Results). Current `useBackgroundMusic` hook creates new Audio instances per component, causing music restarts on navigation.

**Decision**: Use React Context + useRef for global Audio instance

**Rationale**:
- React Context provides app-wide state without prop drilling
- Single Audio instance persists across route changes
- useRef prevents re-renders when audio plays (no state changes for playback position)
- Pattern already used in project for other cross-cutting concerns
- Simpler than external state management (Redux/Zustand not in project)

**Alternatives Considered**:

| Alternative | Why Rejected |
|-------------|--------------|
| Zustand/Jotai | Adds new dependency; project minimizes deps (constitution) |
| Redux | Overkill for single audio instance; not in project |
| Lift state to App.tsx | Would require prop drilling through Router |
| Singleton Audio module | Breaks React rendering model; hard to test |
| Web Audio API | More complex; HTML5 Audio sufficient for requirements |

**Implementation Pattern**:
```typescript
// MusicContext.tsx
interface MusicContextValue {
  playMainTheme: () => Promise<void>
  playGameplayMusic: () => Promise<void>
  stopMusic: () => void
  isPlaying: boolean
}

const MusicContext = createContext<MusicContextValue | null>(null)

export function MusicProvider({ children }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  // ... implementation
  return <MusicContext.Provider value={...}>{children}</MusicContext.Provider>
}

export function useMusic() {
  const context = useContext(MusicContext)
  if (!context) throw new Error('useMusic must be used within MusicProvider')
  return context
}
```

---

### 2. Audio Track Separation Pattern

**Context**: Need to separate main theme from gameplay tracks. Current `MUSIC_TRACKS` array includes all 7 tracks.

**Decision**: Define constants for main theme and filtered gameplay tracks

**Rationale**:
- Simple array filtering at module level (computed once)
- Type-safe with const assertions
- Easy to test in isolation
- No runtime filtering needed

**Implementation Pattern**:
```typescript
const MAIN_THEME = '/audio/the-return-of-the-8-bit-era-301292.mp3'

const ALL_TRACKS = [
  '/audio/8-bit-console-from-my-childhood-301286.mp3',
  '/audio/8-bit-music-no-copyright-background-instrumental-pixel-party-322342.mp3',
  '/audio/game-8-bit-on-278083.mp3',
  '/audio/level-vii-short-258782.mp3',
  '/audio/retro-8bit-happy-videogame-music-243997.mp3',
  '/audio/the-return-of-the-8-bit-era-301292.mp3',
  '/audio/the-world-of-8-bit-games-301273.mp3',
] as const

const GAMEPLAY_TRACKS = ALL_TRACKS.filter(track => track !== MAIN_THEME)
```

---

### 3. Browser Autoplay Policy Handling

**Context**: Modern browsers block autoplay without user interaction. Need to handle this gracefully.

**Decision**: Attempt autoplay on mount, trigger on first user interaction if blocked

**Rationale**:
- Standard web pattern; matches user expectations
- Console warning (not error) when autoplay blocked
- First keyboard/click event triggers music
- No intrusive "click to play" modal needed

**Implementation Pattern**:
```typescript
// In MusicProvider
const [autoplayBlocked, setAutoplayBlocked] = useState(false)

const playMainTheme = async () => {
  try {
    await audioRef.current?.play()
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      setAutoplayBlocked(true)
      // Will play on next user interaction
    }
  }
}

// In App or pages - listen for first interaction
useEffect(() => {
  if (autoplayBlocked) {
    const handleInteraction = () => {
      playMainTheme()
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
    }
    window.addEventListener('click', handleInteraction, { once: true })
    window.addEventListener('keydown', handleInteraction, { once: true })
  }
}, [autoplayBlocked])
```

---

### 4. Music Continuity Across Navigation

**Context**: Main theme should continue playing when navigating between menu screens without restarting.

**Decision**: Keep Audio instance alive in Context; only switch tracks when entering/exiting gameplay

**Rationale**:
- Single Audio instance never destroyed during menu navigation
- Only pause/switch when transitioning to PlayPage
- Resume (or restart) main theme when leaving PlayPage
- React Router navigation doesn't unmount Context provider

**Key Points**:
- MusicProvider wraps entire Router in App.tsx
- Menu screens (/, /home, /results) share continuous main theme
- Only /play triggers gameplay music switch
- useLocation hook to detect route changes

---

### 5. E2E Testing Audio in Playwright

**Context**: Constitution requires E2E tests for all features. Audio state testing is challenging in browser automation.

**Decision**: Test audio indirectly via exposed state + verify no console errors

**Rationale**:
- Playwright can't directly verify audio playback in headless mode
- Can verify:
  - No JavaScript errors during audio operations
  - Music context state exposed via data attributes or test IDs
  - Console warnings captured and validated
  - Audio element presence in DOM (if rendered)
- Manual verification supplements E2E tests

**Implementation Pattern**:
```typescript
// E2E test
test('main theme plays on player select', async ({ page }) => {
  await page.goto('/')

  // Trigger user interaction (required for autoplay)
  await page.keyboard.press('ArrowDown')

  // Verify no errors
  const errors: string[] = []
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text())
  })

  // Navigate through menu screens
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/home/)

  // Verify no music-related errors occurred
  expect(errors.filter(e => e.includes('audio'))).toHaveLength(0)
})
```

---

## Summary of Technical Decisions

| Aspect | Decision | Justification |
|--------|----------|---------------|
| State Management | React Context + useRef | Project standard; no new deps; persists across routes |
| Track Separation | Module-level constants | Simple; type-safe; computed once |
| Autoplay Handling | Try/catch with interaction fallback | Standard web pattern; graceful degradation |
| Music Continuity | Single Audio instance in Context | Never destroyed during menu navigation |
| E2E Testing | Indirect state verification | Playwright limitations with audio; no errors = success |

## Files to Create/Modify

### New Files
- `src/contexts/MusicContext.tsx` - Global music state provider and hook
- `src/contexts/MusicContext.test.tsx` - Unit tests for music context
- `tests/e2e/main-theme-music.spec.ts` - E2E tests for music feature

### Modified Files
- `src/App.tsx` - Wrap Router with MusicProvider
- `src/pages/PlayerSelectPage.tsx` - Trigger main theme on mount
- `src/pages/HomePage.tsx` - Main theme continues (no action needed if already playing)
- `src/pages/PlayPage.tsx` - Switch to gameplay music; restore main theme on exit
- `src/pages/GameResultsPage.tsx` - Resume main theme
- `src/hooks/useBackgroundMusic.ts` - Potentially refactor or replace with context

## Unresolved Questions

None - all technical decisions are clear and follow project patterns.
