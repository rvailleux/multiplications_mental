# Quickstart: Main Theme Music

**Feature**: 016-main-theme-music
**Date**: 2026-01-27

## Overview

Add a dedicated main theme song that plays on all menu screens (Player Select, Home, Game Results), while gameplay uses a separate random track playlist that excludes the main theme.

## Prerequisites

- Node.js 18+ installed
- Project dependencies installed (`npm install`)
- Familiarity with React Context API
- Understanding of HTML5 Audio API

## Development Setup

```bash
# 1. Checkout feature branch
git checkout 016-main-theme-music

# 2. Install dependencies (if not already done)
npm install

# 3. Start development server
npm run dev

# 4. Run tests in watch mode (separate terminal)
npm run test
```

## Key Files to Create

### 1. Music Context (`src/contexts/MusicContext.tsx`)

The core of this feature - provides global music state.

```typescript
// Minimal structure
import { createContext, useContext, useRef, useState, ReactNode } from 'react'

const MAIN_THEME = '/audio/the-return-of-the-8-bit-era-301292.mp3'
const GAMEPLAY_TRACKS = [
  '/audio/8-bit-console-from-my-childhood-301286.mp3',
  '/audio/8-bit-music-no-copyright-background-instrumental-pixel-party-322342.mp3',
  // ... other tracks (NOT main theme)
]

interface MusicContextValue {
  isPlaying: boolean
  playMainTheme: () => Promise<void>
  playGameplayMusic: () => Promise<void>
  stopMusic: () => void
}

const MusicContext = createContext<MusicContextValue | null>(null)

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Implementation here...

  return (
    <MusicContext.Provider value={{ isPlaying, playMainTheme, playGameplayMusic, stopMusic }}>
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const context = useContext(MusicContext)
  if (!context) throw new Error('useMusic must be used within MusicProvider')
  return context
}
```

### 2. Wrap App with Provider (`src/App.tsx`)

```typescript
import { MusicProvider } from './contexts/MusicContext'

export default function App() {
  return (
    <MusicProvider>
      <Router basename={import.meta.env.BASE_URL}>
        {/* existing routes */}
      </Router>
    </MusicProvider>
  )
}
```

### 3. Update Page Components

**PlayerSelectPage** - Start main theme:
```typescript
const { playMainTheme } = useMusic()

useEffect(() => {
  playMainTheme()
}, [playMainTheme])
```

**PlayPage** - Switch to gameplay music:
```typescript
const { playGameplayMusic, stopMusic } = useMusic()

useEffect(() => {
  playGameplayMusic()
  return () => stopMusic()
}, [playGameplayMusic, stopMusic])
```

**GameResultsPage** - Resume main theme:
```typescript
const { playMainTheme } = useMusic()

useEffect(() => {
  playMainTheme()
}, [playMainTheme])
```

## Testing

### Unit Tests

```bash
# Run specific tests
npm run test -- MusicContext

# Run all tests
npm run test:run
```

### E2E Tests

```bash
# Run Playwright tests
npx playwright test tests/e2e/main-theme-music.spec.ts

# Run with UI
npx playwright test --ui
```

## Quality Checks (Required before commit)

```bash
# All 4 quality gates must pass
npm run type-check   # TypeScript validation
npm run lint:fix     # ESLint
npm run test:run     # Unit tests
npm run build        # Production build

# Or run all at once
npm run quality-check
```

## Quick Verification Steps

1. **Start app**: `npm run dev`
2. **Player Select**: Main theme should play (or after first click if autoplay blocked)
3. **Navigate to Home**: Music continues without restart
4. **Start Game**: Different random music plays
5. **End Game/View Results**: Main theme resumes
6. **Return to Home**: Main theme continues

## Common Issues

### Music doesn't play on page load
- Browser autoplay policy - click anywhere or press any key to trigger
- Check browser console for warnings

### Music restarts on navigation
- Verify `MusicProvider` wraps the entire `Router`
- Check that pages aren't calling `playMainTheme()` unnecessarily

### Main theme plays during gameplay
- Verify `GAMEPLAY_TRACKS` array doesn't include main theme
- Check `selectRandomTrack()` uses correct array

## Documentation

After completing the feature:

```bash
# Generate API docs
npm run docs

# Update CLAUDE.md if new patterns introduced
# Update ARCHITECTURE.md if significant changes
```
