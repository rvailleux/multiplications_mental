# Quickstart Guide: Game Results Screen Implementation

**Feature**: Game Results Screen
**Branch**: `011-game-results-screen`
**Target Developers**: React/TypeScript developers implementing the feature

## Prerequisites

Before starting implementation, ensure you have:
- ✅ Node.js 20+ installed
- ✅ Branch `011-game-results-screen` checked out
- ✅ Read [spec.md](./spec.md) - Feature requirements
- ✅ Read [plan.md](./plan.md) - Implementation strategy
- ✅ Read [data-model.md](./data-model.md) - Type definitions

## Quick Setup

```bash
# Verify you're on the correct branch
git branch --show-current
# Should output: 011-game-results-screen

# Install dependencies (if not already done)
npm install

# Run tests in watch mode (for TDD)
npm run test
```

---

## Implementation Checklist

### Phase 1: Write Tests (TDD - RED)

**File**: `src/pages/GameResultsPage.test.tsx` (NEW)

```bash
# Create test file
touch src/pages/GameResultsPage.test.tsx
```

**Test Suites to Write** (BEFORE any implementation):

1. **Rendering and Stats Display** (6 tests)
   - [ ] Renders final score correctly
   - [ ] Calculates and displays correct answer count
   - [ ] Calculates and displays total questions count
   - [ ] Calculates accuracy percentage (rounded integer)
   - [ ] Displays 0% accuracy when no questions answered
   - [ ] Displays player name in top-right corner

2. **Keyboard Navigation** (3 tests)
   - [ ] Navigates to homepage when ENTER key pressed
   - [ ] Cleans up keyboard event listeners on unmount
   - [ ] Ignores non-ENTER keys

3. **Mouse Navigation** (1 test)
   - [ ] Navigates to homepage when button clicked

4. **Animation Lifecycle** (3 tests)
   - [ ] Starts with blinking animation enabled
   - [ ] Stops blinking animation after 5 seconds
   - [ ] Cleans up timeout on unmount

5. **Edge Cases** (4 tests)
   - [ ] Handles empty results array gracefully
   - [ ] Handles all incorrect answers (0% accuracy)
   - [ ] Handles all correct answers (100% accuracy)
   - [ ] Handles missing route state gracefully

**Run tests** (they should ALL FAIL):
```bash
npm run test src/pages/GameResultsPage.test.tsx
# Expected: 0 pass, 17 fail
```

---

### Phase 2: Implement Component (TDD - GREEN)

**File**: `src/pages/GameResultsPage.tsx` (NEW)

```bash
# Create component file
touch src/pages/GameResultsPage.tsx
```

**Implementation Steps**:

1. **Basic Structure** (5 minutes)
   ```typescript
   import { useNavigate, useLocation } from 'react-router-dom'
   import { useState, useEffect } from 'react'
   import { getCurrentPlayer } from '../types/player'
   import PlayerNameDisplay from '../components/PlayerNameDisplay'
   import type { GameResult } from './PlayPage'

   export interface GameResultsState {
     score: number
     results: GameResult[]
   }

   export interface GameResultsPageProps {}

   export default function GameResultsPage({}: GameResultsPageProps) {
     // Implementation here
   }
   ```

2. **Data Retrieval** (5 minutes)
   ```typescript
   const navigate = useNavigate()
   const location = useLocation()
   const currentPlayer = getCurrentPlayer()

   const state = location.state as GameResultsState | undefined
   const score = state?.score ?? 0
   const results = state?.results ?? []
   ```

3. **Stats Calculation** (5 minutes)
   ```typescript
   const correctCount = results.filter(r => r.correct).length
   const totalQuestions = results.length
   const accuracy = totalQuestions > 0
     ? Math.round((correctCount / totalQuestions) * 100)
     : 0
   ```

4. **Animation State** (5 minutes)
   ```typescript
   const [isBlinking, setIsBlinking] = useState(true)

   useEffect(() => {
     const timer = setTimeout(() => {
       setIsBlinking(false)
     }, 5000)

     return () => clearTimeout(timer)
   }, [])
   ```

5. **Keyboard Navigation** (5 minutes)
   ```typescript
   useEffect(() => {
     const handleKeyDown = (e: KeyboardEvent): void => {
       if (e.key === 'Enter') {
         navigate('/home')
       }
     }

     window.addEventListener('keydown', handleKeyDown)
     return () => window.removeEventListener('keydown', handleKeyDown)
   }, [navigate])
   ```

6. **JSX and Styling** (15 minutes)
   - Gold/yellow gradient background
   - Pixel-art borders (8px solid black)
   - Display: score, correct/total, accuracy%
   - Continue button with click handler
   - PlayerNameDisplay component

**Run tests** (they should ALL PASS):
```bash
npm run test src/pages/GameResultsPage.test.tsx
# Expected: 17 pass, 0 fail
```

---

### Phase 3: Integration Changes

#### A. Update PlayPage Navigation

**File**: `src/pages/PlayPage.tsx` (MODIFY line 103)

**Current Code**:
```typescript
navigate('/home')
```

**New Code**:
```typescript
if (score > 0) {
  navigate('/results', { state: { score, results } })
} else {
  navigate('/home')
}
```

**Full Context** (lines 94-106):
```typescript
useEffect(() => {
  if (secondsLeft === 0) {
    stopMusic()
    if (score > 0) {
      const previousScores = JSON.parse(localStorage.getItem('scores') || '[]')
      localStorage.setItem('scores', JSON.stringify([...previousScores, { score, results }]))
      navigate('/results', { state: { score, results } })
    } else {
      navigate('/home')
    }
  }
}, [secondsLeft, score, results, navigate, stopMusic])
```

#### B. Update PlayPage Tests

**File**: `src/pages/PlayPage.test.tsx` (MODIFY)

Find the test "should navigate to home when timer reaches 0" and split it:

```typescript
it('should navigate to results page when timer reaches 0 with score > 0', async () => {
  // Test navigation to /results with state
  expect(mockNavigate).toHaveBeenCalledWith('/results', {
    state: expect.objectContaining({
      score: expect.any(Number),
      results: expect.any(Array)
    })
  })
})

it('should navigate to home page when timer reaches 0 with score = 0', async () => {
  // Test navigation to /home (skip results)
  expect(mockNavigate).toHaveBeenCalledWith('/home')
})
```

#### C. Add Route to App.tsx

**File**: `src/App.tsx` (MODIFY line 17)

**Add import**:
```typescript
import GameResultsPage from './pages/GameResultsPage'
```

**Add route** (after PlayPage route):
```typescript
<Route path="/results" element={<GameResultsPage />} />
```

**Full context**:
```typescript
<Routes>
  <Route path="/" element={<PlayerSelectPage />} />
  <Route path="/home" element={<HomePage />} />
  <Route path="/play" element={<PlayPage />} />
  <Route path="/results" element={<GameResultsPage />} />
</Routes>
```

#### D. Add Animation Keyframes

**File**: `src/index.css` (MODIFY after line 173)

```css
@keyframes goldFadingBlink {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
  }
  50% {
    opacity: 0.8;
    box-shadow: 0 0 40px rgba(255, 215, 0, 1);
  }
}
```

---

### Phase 4: Quality Assurance

Run ALL 4 quality checks (MANDATORY):

```bash
# 1. Type checking
npm run type-check
# Must show: "Found 0 errors"

# 2. Linting
npm run lint:fix
# Must auto-fix any issues

# 3. All tests
npm run test:run
# Must show: All tests passed

# 4. Production build
npm run build
# Must build successfully
```

---

### Phase 5: Manual Testing

#### Test Scenario 1: Normal Game Completion
1. Start dev server: `npm run dev`
2. Navigate to player selection
3. Select a player
4. Click "Start Game"
5. Answer some questions correctly, some incorrectly
6. Wait for timer to expire
7. **Verify**:
   - Results screen appears immediately
   - Score matches what was shown in game
   - Correct/total count is accurate
   - Accuracy percentage is correct
   - Animation is blinking (gold glow pulsing)
   - Player name shown in top-right corner
8. Wait 5 seconds
9. **Verify**: Animation has stopped (no more blinking)
10. Press ENTER key
11. **Verify**: Returns to homepage

#### Test Scenario 2: Zero Score
1. Start a new game
2. Answer all questions incorrectly (or let timer expire immediately)
3. **Verify**: Skips results screen, goes directly to homepage

#### Test Scenario 3: Perfect Score
1. Start a new game
2. Answer all questions correctly
3. **Verify**: Results screen shows 100% accuracy with celebration styling

#### Test Scenario 4: Mouse Navigation
1. Complete a normal game
2. On results screen, click the "Continue" button instead of pressing ENTER
3. **Verify**: Returns to homepage

---

## File Summary

### New Files (2)
- `src/pages/GameResultsPage.tsx` (~150 lines)
- `src/pages/GameResultsPage.test.tsx` (~250 lines)

### Modified Files (4)
- `src/pages/PlayPage.tsx` (line 103: navigation logic)
- `src/pages/PlayPage.test.tsx` (split navigation test into 2)
- `src/App.tsx` (add /results route)
- `src/index.css` (add goldFadingBlink keyframes)

### Total Impact
- **Lines added**: ~450
- **Lines modified**: ~10
- **Tests added**: 17
- **Components added**: 1 page component

---

## Common Issues and Solutions

### Issue: "Cannot find module 'GameResult'"
**Solution**: Import from PlayPage:
```typescript
import type { GameResult } from './PlayPage'
```

### Issue: Tests fail with "location.state is undefined"
**Solution**: Mock location state in tests:
```typescript
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useLocation: () => ({
    state: { score: 500, results: [...] }
  })
}))
```

### Issue: Animation doesn't stop after 5 seconds in tests
**Solution**: Use fake timers in Vitest:
```typescript
vi.useFakeTimers()
// ... render component
vi.advanceTimersByTime(5000)
// ... expect animation to be stopped
vi.useRealTimers()
```

### Issue: "Property 'state' does not exist on type 'Location'"
**Solution**: Define interface and use type assertion:
```typescript
interface LocationState {
  score?: number
  results?: GameResult[]
}
const state = location.state as LocationState
```

---

## Performance Benchmarks

**Target Performance**:
- ✅ Component render: <100ms
- ✅ Stats calculation: <1ms
- ✅ Animation frame rate: 60fps
- ✅ Navigation: <1 second from ENTER press to homepage

**How to Measure** (Chrome DevTools):
```bash
# 1. Open Chrome DevTools
# 2. Performance tab
# 3. Record while navigating from PlayPage to GameResultsPage
# 4. Check:
#    - FCP (First Contentful Paint): <100ms
#    - TBT (Total Blocking Time): <50ms
#    - No layout shifts (CLS = 0)
```

---

## Accessibility Checklist

- [x] ENTER key navigation (keyboard-first)
- [x] Continue button clickable (mouse support)
- [x] Player name visible (PlayerNameDisplay)
- [x] High contrast (gold/yellow on dark meets WCAG AA)
- [x] No rapid flashing (soft fade, not harsh blink)
- [x] Semantic HTML (button, headings)
- [x] Focus indicators on interactive elements

---

## Documentation Updates

After implementation is complete:

```bash
# Regenerate API documentation
npm run docs

# Verify new docs generated
ls docs/api/modules/pages_GameResultsPage.html
# Should exist if docs generation succeeded
```

---

## Commit Checklist

Before committing:
- [ ] All tests passing (`npm run test:run`)
- [ ] Type checking passing (`npm run type-check`)
- [ ] Linting passing (`npm run lint`)
- [ ] Production build successful (`npm run build`)
- [ ] Manual browser testing complete
- [ ] JSDoc comments added to all new functions
- [ ] API docs regenerated (`npm run docs`)

**Commit Message Template**:
```
Add game results screen with stats and animation

Implement results screen displayed after 60-second game:
- Show score, correct/total questions, accuracy percentage
- Gold/yellow retro aesthetic with pixel-art framing
- Soft fading blink animation for 5 seconds, then stops
- ENTER key navigates back to homepage
- Skip results screen if score is 0 (follows existing pattern)

Test-Driven Development:
- Added 17 tests for GameResultsPage (all pass)
- Updated PlayPage tests for new navigation logic
- All quality gates passed (type-check, lint, test, build)

Constitutional Compliance:
- Principle I: Test-First Development (TDD red-green-refactor)
- Principle VI: Keyboard-first navigation + mouse support

Files modified:
- src/pages/GameResultsPage.tsx (NEW)
- src/pages/GameResultsPage.test.tsx (NEW)
- src/pages/PlayPage.tsx (navigation logic)
- src/App.tsx (add /results route)
- src/index.css (goldFadingBlink keyframes)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

---

## Next Steps

After this feature is complete:
1. Merge PR to main branch
2. Deploy to GitHub Pages (automatic via workflow)
3. Move to next todo.md item (likely: Pause/Quit popin during game)

---

## Support

**Questions?** Refer to:
- [spec.md](./spec.md) - Feature requirements
- [plan.md](./plan.md) - Technical approach
- [data-model.md](./data-model.md) - Type definitions
- [CLAUDE.md](../../CLAUDE.md) - Project conventions
- [.specify/memory/constitution.md](../../.specify/memory/constitution.md) - Core principles

**Estimated Implementation Time**: 2-3 hours (including testing)
