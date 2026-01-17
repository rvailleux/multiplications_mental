# Implementation Plan: Game Results Screen

**Branch**: `011-game-results-screen` | **Date**: 2026-01-16 | **Spec**: [spec.md](./spec.md)

## Summary

Create a results screen that displays after the 60-second timer expires, showing final score, correct/total questions, accuracy percentage, with a gold/yellow retro aesthetic, 5-second fading blink animation, and ENTER key navigation back to homepage. The screen should skip display if the score is 0 (following existing pattern).

## Technical Context

**Language/Version**: TypeScript 5.7.2 (strict mode enabled)
**Framework**: React 19.0.0
**Primary Dependencies**: React Router DOM 7.5.0 (for navigation)
**Storage**: localStorage (browser-based persistence) - GameResult[] already saved by PlayPage
**Testing**: Vitest 4.0.16 with React Testing Library, Happy-DOM
**Build Tool**: Vite 6.2.0
**Styling**: CSS-in-JS with inline styles + global CSS keyframes in index.css
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Single-page web application
**Performance Goals**: <100ms render time, no layout shift, smooth animation
**Constraints**: Must maintain retro 8-bit aesthetic, keyboard-first navigation
**Scale/Scope**: Single new page component, 1 new route, ~200 lines of code

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Test-First Development (NON-NEGOTIABLE)
**STATUS**: ✅ PASS (with implementation commitment)
- Tests will be written FIRST before implementing GameResultsPage component
- Tests must cover: navigation from PlayPage, stats calculation, ENTER key handler, animation lifecycle, zero-score skip behavior
- Red-Green-Refactor cycle will be followed

### Principle II: TypeScript Type Safety
**STATUS**: ✅ PASS
- GameResult type already exists in PlayPage.tsx
- New GameResultsPageProps interface will be defined with JSDoc
- Explicit return types for all functions
- Strict mode compliance verified

### Principle III: Component-Based Architecture
**STATUS**: ✅ PASS
- New functional component: GameResultsPage (pages/GameResultsPage.tsx)
- Single responsibility: Display game results and handle navigation
- CSS-in-JS inline styles with pixel-art aesthetic
- Props interface exported with JSDoc
- Reuses existing PlayerNameDisplay component

### Principle IV: Automated Quality Gates
**STATUS**: ✅ PASS (with pre-commit commitment)
- All 4 commands will be run before commit:
  - `npm run type-check` - Zero TypeScript errors
  - `npm run lint:fix` - ESLint compliance
  - `npm run test:run` - All tests pass
  - `npm run build` - Production build succeeds

### Principle V: Documentation-Driven Development
**STATUS**: ✅ PASS
- JSDoc required for GameResultsPage component and props interface
- JSDoc for calculateAccuracy helper function
- JSDoc for animation control logic
- API docs will be regenerated with `npm run docs`

### Principle VI: Retro Gaming UX (Super NES 8-bit Aesthetic)
**STATUS**: ✅ PASS
- Keyboard navigation PRIMARY: ENTER key navigates to homepage
- Mouse support SECONDARY: Click button also navigates
- Visual style: Gold/yellow pixel-art aesthetic with borders and retro fonts
- Soft fading blink animation (5 seconds, then stops)
- Focus indicators for accessibility

## Project Structure

### Documentation (this feature)

```text
specs/011-game-results-screen/
├── plan.md              # This file
├── research.md          # Phase 0 output (research findings)
├── data-model.md        # Phase 1 output (data structures)
├── quickstart.md        # Phase 1 output (developer guide)
└── spec.md              # Feature specification
```

### Source Code (repository root)

```text
src/
├── pages/
│   ├── GameResultsPage.tsx          # NEW - Results screen component
│   ├── GameResultsPage.test.tsx     # NEW - Component tests (TDD)
│   ├── PlayPage.tsx                 # MODIFY - Navigate to /results instead of /home
│   ├── PlayPage.test.tsx            # MODIFY - Update navigation expectations
│   ├── HomePage.tsx                 # No changes needed
│   └── PlayerSelectPage.tsx         # No changes needed
├── components/
│   └── PlayerNameDisplay.tsx        # REUSE - Already exists
├── types/
│   └── player.ts                    # No changes needed
├── App.tsx                          # MODIFY - Add /results route
└── index.css                        # MODIFY - Add @keyframes goldFadingBlink
```

**Structure Decision**: Single project structure maintained. New GameResultsPage component follows existing pattern in `pages/` directory. Tests co-located with components per project convention.

## Complexity Tracking

**No violations detected. Constitution compliance is complete.**

---

## Implementation Design

### Critical Files for Implementation

1. **src/pages/GameResultsPage.test.tsx** (NEW) - Write tests FIRST (TDD)
   - Test stats calculation (score, correct/total, accuracy %)
   - Test keyboard navigation (ENTER key → homepage)
   - Test mouse navigation (click button → homepage)
   - Test animation lifecycle (starts blinking, stops after 5 seconds)
   - Test edge cases (0 questions, 0% accuracy, 100% accuracy)

2. **src/pages/GameResultsPage.tsx** (NEW) - Main results component
   - Receive score and results from route state
   - Calculate accuracy: `Math.round((correctCount / totalQuestions) * 100)`
   - Manage animation state with `useState` and `setTimeout`
   - Handle ENTER key navigation with `useEffect` keyboard listener
   - Render gold/yellow retro-styled UI with stats display

3. **src/pages/PlayPage.tsx** (MODIFY) - Update timer expiration logic
   - Line 103: Change `navigate('/home')` to conditional navigation
   - If `score > 0`: `navigate('/results', { state: { score, results } })`
   - If `score === 0`: `navigate('/home')` (skip results screen)

4. **src/App.tsx** (MODIFY) - Add new route
   - Import GameResultsPage component
   - Add route: `<Route path="/results" element={<GameResultsPage />} />`

5. **src/index.css** (MODIFY) - Add animation keyframes
   - Add `@keyframes goldFadingBlink` after line 173
   - Opacity: 1.0 → 0.8 → 1.0 (soft fade)
   - Box-shadow: Pulsing gold glow effect

### Data Flow

```text
PlayPage (timer expires, score > 0)
    ↓
navigate('/results', { state: { score, results } })
    ↓
GameResultsPage receives route state
    ↓
Calculate: correctCount, totalQuestions, accuracy
    ↓
Render: Stats + Animation (5 seconds) + ENTER key listener
    ↓
User presses ENTER (or clicks button)
    ↓
navigate('/home')
```

### Animation Lifecycle

```text
Component mounts
    ↓
isBlinking = true (animation active)
    ↓
setTimeout(() => setIsBlinking(false), 5000)
    ↓
After 5 seconds: isBlinking = false (animation stops)
    ↓
Component unmount: clearTimeout (cleanup)
```

### Testing Strategy (TDD - TESTS FIRST)

#### Test Suites

**Suite 1: Rendering and Stats Display**
- Render final score correctly
- Calculate and display correct answers count
- Calculate and display total questions count
- Calculate accuracy percentage (rounded to nearest integer)
- Display 0% accuracy when no questions answered
- Display player name in top-right corner (PlayerNameDisplay)

**Suite 2: Keyboard Navigation**
- Navigate to homepage when ENTER key pressed
- Cleanup keyboard event listeners on unmount
- Ignore other keys (not ENTER)

**Suite 3: Mouse Navigation**
- Navigate to homepage when continue button clicked

**Suite 4: Animation Lifecycle**
- Start with blinking animation enabled
- Stop blinking animation after 5 seconds
- Cleanup timeout on unmount

**Suite 5: Edge Cases**
- Handle empty results array gracefully
- Handle all incorrect answers (0% accuracy)
- Handle all correct answers (100% accuracy)
- Handle missing route state gracefully

### Implementation Sequence (TDD Workflow)

**Step 1: Write Failing Tests (RED)**
1. Create `GameResultsPage.test.tsx` with all test suites
2. Run `npm run test` - ALL TESTS FAIL (component doesn't exist)
3. Verify tests fail for the right reasons

**Step 2: Minimal Implementation (GREEN)**
1. Create `GameResultsPage.tsx` with basic structure
2. Implement stats calculation
3. Implement keyboard navigation (ENTER key)
4. Implement animation lifecycle (5-second timer)
5. Add styling with gold/yellow theme
6. Run `npm run test` - ALL TESTS PASS

**Step 3: Refactor and Polish (REFACTOR)**
1. Extract helper functions if needed
2. Optimize styling for mobile responsiveness
3. Add JSDoc comments to all functions
4. Run `npm run test` - TESTS STILL PASS

**Step 4: Integration**
1. Modify PlayPage.tsx navigation logic (line 103)
2. Update PlayPage.test.tsx expectations
3. Add route to App.tsx (after line 17)
4. Add `@keyframes goldFadingBlink` to index.css (after line 173)
5. Run `npm run test` - ALL TESTS PASS

**Step 5: Quality Assurance (ALL 4 MANDATORY)**
1. `npm run type-check` - Must pass
2. `npm run lint:fix` - Must pass
3. `npm run test:run` - Must pass
4. `npm run build` - Must pass

**Step 6: Documentation**
1. Add JSDoc to all new functions
2. Run `npm run docs` to regenerate API documentation
3. Manual browser testing (keyboard + mouse)

**Step 7: Commit**
1. Review changes with `git status`
2. Commit with descriptive message following project conventions
3. Pre-commit hooks auto-run (do not bypass)

---

## Risk Assessment

### Low Risk Items
- TypeScript compliance: GameResult type already exists
- Styling patterns: Following existing pixel-art patterns
- Testing patterns: Following existing test structure
- Route state: React Router supports location.state natively

### Medium Risk Items
- **Animation timing**: Must ensure setTimeout cleanup prevents memory leaks
  - **Mitigation**: Follow useEffect cleanup pattern from useTimer hook
- **Zero-score skip logic**: Must test both paths (score > 0 and score === 0)
  - **Mitigation**: Explicit test coverage for both branches

### No High Risk Items

---

## Acceptance Criteria Verification

- ✅ **FR-001**: Display immediately after timer expires → PlayPage navigates to /results when secondsLeft === 0 && score > 0
- ✅ **FR-007**: Animation runs for exactly 5 seconds then stops → useEffect with setTimeout(5000) to toggle isBlinking state
- ✅ **FR-009**: ENTER key navigates to homepage → useEffect with keyboard listener for 'Enter' key
- ✅ **FR-011**: Skip screen if score is 0 → Conditional navigation in PlayPage (score > 0 ? /results : /home)
- ✅ Display final score → Receive score from route state, render in JSX
- ✅ Display correct/total questions → Calculate from results array
- ✅ Display accuracy percentage → (correctCount / totalQuestions) * 100, rounded
- ✅ Gold/yellow retro aesthetic → Gold gradient background, yellow borders, pixel-art styling
- ✅ Player name displayed top-right → Reuse PlayerNameDisplay component
