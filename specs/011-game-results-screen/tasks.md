# Tasks: Game Results Screen

**Feature Branch**: `011-game-results-screen`
**Created**: 2026-01-16
**Status**: Ready for Implementation

## Overview

Implement a results screen that displays after the 60-second timer expires, showing final score, correct/total questions, accuracy percentage, with a gold/yellow retro aesthetic, 5-second fading blink animation, and ENTER key navigation back to homepage.

**Total Estimated Tasks**: 60 tasks organized in 7 phases

---

## Phase 1: Project Setup and Prerequisites

**Prerequisites check** - Verify development environment readiness

- [X] T001 [STORY: Setup] Verify Node.js version 20+ installed and accessible
- [X] T002 [STORY: Setup] Confirm branch `011-game-results-screen` is checked out
- [X] T003 [STORY: Setup] Run `npm install` to ensure all dependencies installed
- [X] T004 [STORY: Setup] Verify existing GameResult type definition in PlayPage.tsx
- [X] T005 [STORY: Setup] Read spec.md to understand all functional requirements
- [X] T006 [STORY: Setup] Read plan.md to understand implementation approach
- [X] T007 [STORY: Setup] Read quickstart.md for detailed implementation steps

---

## Phase 2: Foundational CSS Animations

**Add global CSS keyframes** - Required by all three user stories

- [X] T008 [STORY: US3-P2] [PARALLEL_START] Add `@keyframes goldFadingBlink` to src/index.css after line 173
- [X] T009 [STORY: US3-P2] [PARALLEL_END] Define keyframe: 0%/100% with opacity 1.0, box-shadow gold glow
- [X] T010 [STORY: US3-P2] Define keyframe: 50% with opacity 0.8, box-shadow enhanced gold glow
- [X] T011 [STORY: US3-P2] Verify CSS syntax with `npm run build` (should compile without errors)

---

## Phase 3: User Story 1 - View Performance Summary (P1)

**Test-Driven Development: Write Tests FIRST (RED phase)**

### Test Suite: Rendering and Stats Display

- [X] T012 [STORY: US1-P1] Create new file `src/pages/GameResultsPage.test.tsx`
- [X] T013 [STORY: US1-P1] Add imports: React Testing Library, Vitest matchers, MemoryRouter
- [X] T014 [STORY: US1-P1] [PARALLEL_START] Write test: "should render final score correctly"
- [X] T015 [STORY: US1-P1] [PARALLEL_WITH:T014] Write test: "should calculate and display correct answer count"
- [X] T016 [STORY: US1-P1] [PARALLEL_WITH:T014] Write test: "should calculate and display total questions count"
- [X] T017 [STORY: US1-P1] [PARALLEL_END] Write test: "should calculate accuracy percentage (rounded integer)"
- [X] T018 [STORY: US1-P1] Write test: "should display 0% accuracy when no questions answered"
- [X] T019 [STORY: US1-P1] Write test: "should display player name in top-right corner"

### Test Suite: Edge Cases

- [X] T020 [STORY: US1-P1] [PARALLEL_START] Write test: "should handle empty results array gracefully"
- [X] T021 [STORY: US1-P1] [PARALLEL_WITH:T020] Write test: "should handle all incorrect answers (0% accuracy)"
- [X] T022 [STORY: US1-P1] [PARALLEL_WITH:T020] Write test: "should handle all correct answers (100% accuracy)"
- [X] T023 [STORY: US1-P1] [PARALLEL_END] Write test: "should handle missing route state gracefully"

### Verify RED Phase

- [X] T024 [STORY: US1-P1] Run `npm run test src/pages/GameResultsPage.test.tsx` to verify ALL tests FAIL (component doesn't exist yet)
- [X] T025 [STORY: US1-P1] Verify tests fail for correct reasons (e.g., "Cannot find module 'GameResultsPage'")

### Implementation: GameResultsPage Component (GREEN phase)

- [X] T026 [STORY: US1-P1] Create new file `src/pages/GameResultsPage.tsx`
- [X] T027 [STORY: US1-P1] Add imports: React (useState, useEffect), useNavigate, useLocation
- [X] T028 [STORY: US1-P1] Import PlayerNameDisplay component
- [X] T029 [STORY: US1-P1] Import GameResult type from PlayPage.tsx
- [X] T030 [STORY: US1-P1] Define `GameResultsState` interface with JSDoc (score: number, results: GameResult[])
- [X] T031 [STORY: US1-P1] Define `GameResultsPageProps` interface with JSDoc (empty interface for consistency)
- [X] T032 [STORY: US1-P1] Create functional component `GameResultsPage` with typed props
- [X] T033 [STORY: US1-P1] Use `useLocation()` hook to retrieve route state
- [X] T034 [STORY: US1-P1] Extract score and results from location.state with fallback defaults (score ?? 0, results ?? [])
- [X] T035 [STORY: US1-P1] Calculate `correctCount` using `results.filter(r => r.correct).length`
- [X] T036 [STORY: US1-P1] Calculate `totalQuestions` using `results.length`
- [X] T037 [STORY: US1-P1] Calculate `accuracy` with division-by-zero protection: `totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0`
- [X] T038 [STORY: US1-P1] Add JSDoc comment to accuracy calculation explaining rounding and edge case handling
- [X] T039 [STORY: US1-P1] Create JSX structure with main container div
- [X] T040 [STORY: US1-P1] Add PlayerNameDisplay component in top-right position
- [X] T041 [STORY: US1-P1] Add heading displaying "Game Over!" or similar retro message
- [X] T042 [STORY: US1-P1] Display final score with label "Score: {score}"
- [X] T043 [STORY: US1-P1] Display correct/total questions "Correct: {correctCount}/{totalQuestions}"
- [X] T044 [STORY: US1-P1] Display accuracy percentage "Accuracy: {accuracy}%"
- [X] T045 [STORY: US1-P1] Apply inline styles: gold/yellow gradient background
- [X] T046 [STORY: US1-P1] Apply inline styles: 8px solid black pixel-art border
- [X] T047 [STORY: US1-P1] Apply inline styles: retro font family (Press Start 2P or monospace)
- [X] T048 [STORY: US1-P1] Apply inline styles: responsive padding and spacing
- [X] T049 [STORY: US1-P1] Export component as default
- [X] T050 [STORY: US1-P1] Run `npm run test src/pages/GameResultsPage.test.tsx` to verify rendering tests PASS

---

## Phase 4: User Story 2 - Keyboard Navigation (P1)

**Test-Driven Development: Write Tests FIRST (RED phase)**

### Test Suite: Keyboard Navigation

- [X] T051 [STORY: US2-P1] [PARALLEL_START] Write test: "should navigate to homepage when ENTER key pressed"
- [X] T052 [STORY: US2-P1] [PARALLEL_WITH:T051] Write test: "should cleanup keyboard event listeners on unmount"
- [X] T053 [STORY: US2-P1] [PARALLEL_END] Write test: "should ignore non-ENTER keys"

### Test Suite: Mouse Navigation

- [X] T054 [STORY: US2-P1] Write test: "should navigate to homepage when continue button clicked"

### Verify RED Phase

- [X] T055 [STORY: US2-P1] Run tests to verify navigation tests FAIL (handlers not implemented yet)

### Implementation: Navigation Handlers (GREEN phase)

- [X] T056 [STORY: US2-P1] Use `useNavigate()` hook from React Router
- [X] T057 [STORY: US2-P1] Create `useEffect` for keyboard listener with empty dependency array
- [X] T058 [STORY: US2-P1] Define `handleKeyDown` function: `(e: KeyboardEvent): void => { if (e.key === 'Enter') navigate('/home') }`
- [X] T059 [STORY: US2-P1] Add JSDoc comment explaining ENTER key navigation behavior
- [X] T060 [STORY: US2-P1] Add event listener: `window.addEventListener('keydown', handleKeyDown)`
- [X] T061 [STORY: US2-P1] Add cleanup function: `return () => window.removeEventListener('keydown', handleKeyDown)`
- [X] T062 [STORY: US2-P1] Update useEffect dependencies: `[navigate]`
- [X] T063 [STORY: US2-P1] Create "Continue" button in JSX
- [X] T064 [STORY: US2-P1] Add `onClick={() => navigate('/home')}` handler to button
- [X] T065 [STORY: US2-P1] Apply retro button styles (pixel border, gold background, hover effects)
- [X] T066 [STORY: US2-P1] Run `npm run test` to verify ALL navigation tests PASS

---

## Phase 5: User Story 3 - Visual Animation (P2)

**Test-Driven Development: Write Tests FIRST (RED phase)**

### Test Suite: Animation Lifecycle

- [X] T067 [STORY: US3-P2] [PARALLEL_START] Write test: "should start with blinking animation enabled"
- [X] T068 [STORY: US3-P2] [PARALLEL_WITH:T067] Write test: "should stop blinking animation after 5 seconds" (use vi.useFakeTimers)
- [X] T069 [STORY: US3-P2] [PARALLEL_END] Write test: "should cleanup timeout on unmount"

### Verify RED Phase

- [X] T070 [STORY: US3-P2] Run tests to verify animation tests FAIL (animation state not implemented)

### Implementation: Animation State Management (GREEN phase)

- [X] T071 [STORY: US3-P2] Add `useState` for animation: `const [isBlinking, setIsBlinking] = useState<boolean>(true)`
- [X] T072 [STORY: US3-P2] Add JSDoc comment explaining isBlinking state purpose and lifecycle
- [X] T073 [STORY: US3-P2] Create `useEffect` for animation timer with empty dependency array
- [X] T074 [STORY: US3-P2] Define timer: `const timer = setTimeout(() => { setIsBlinking(false) }, 5000)`
- [X] T075 [STORY: US3-P2] Add cleanup function: `return () => clearTimeout(timer)`
- [X] T076 [STORY: US3-P2] Apply animation conditionally in styles: `animation: isBlinking ? 'goldFadingBlink 2s ease-in-out infinite' : 'none'`
- [X] T077 [STORY: US3-P2] Run `npm run test` to verify ALL animation tests PASS

---

## Phase 6: Integration with Existing Code

**Modify PlayPage to navigate to results screen**

- [X] T078 [STORY: US1-P1] Read `src/pages/PlayPage.tsx` to understand current navigation logic (line 103)
- [X] T079 [STORY: US1-P1] Locate timer expiration handler in PlayPage (`secondsLeft === 0`)
- [X] T080 [STORY: US1-P1] Replace `navigate('/home')` with conditional navigation
- [X] T081 [STORY: US1-P1] Add condition: `if (score > 0) { navigate('/results', { state: { score, results } }) } else { navigate('/home') }`
- [X] T082 [STORY: US1-P1] Add JSDoc comment explaining skip-results-if-zero-score logic

**Update PlayPage tests**

- [X] T083 [STORY: US1-P1] Read `src/pages/PlayPage.test.tsx` to understand existing navigation tests
- [X] T084 [STORY: US1-P1] Locate test "should navigate to home when timer reaches 0"
- [X] T085 [STORY: US1-P1] Split test into two: "should navigate to results when timer reaches 0 with score > 0"
- [X] T086 [STORY: US1-P1] Create second test: "should navigate to home when timer reaches 0 with score = 0"
- [X] T087 [STORY: US1-P1] Update expectations to verify state object passed to /results route
- [X] T088 [STORY: US1-P1] Run `npm run test src/pages/PlayPage.test.tsx` to verify updated tests PASS

**Add route to App.tsx**

- [X] T089 [STORY: US1-P1] Read `src/App.tsx` to understand routing structure
- [X] T090 [STORY: US1-P1] Add import: `import GameResultsPage from './pages/GameResultsPage'`
- [X] T091 [STORY: US1-P1] Add route after PlayPage route: `<Route path="/results" element={<GameResultsPage />} />`
- [X] T092 [STORY: US1-P1] Verify route order (should be: /, /home, /play, /results)
- [X] T093 [STORY: US1-P1] Run `npm run type-check` to verify no TypeScript errors

---

## Phase 7: Quality Assurance and Documentation

**Run ALL 4 mandatory quality checks**

- [X] T094 [STORY: All] Run `npm run type-check` - MUST show "Found 0 errors"
- [X] T095 [STORY: All] Run `npm run lint:fix` - MUST auto-fix any issues
- [X] T096 [STORY: All] Run `npm run test:run` - MUST show all tests passed
- [X] T097 [STORY: All] Run `npm run build` - MUST build successfully

**Manual browser testing**

- [ ] T098 [STORY: US1-P1] Test Scenario 1: Complete normal game, verify results screen appears with correct stats
- [ ] T099 [STORY: US1-P1] Verify score matches what was shown in game
- [ ] T100 [STORY: US1-P1] Verify correct/total count is accurate
- [ ] T101 [STORY: US1-P1] Verify accuracy percentage is correct (rounded to integer)
- [ ] T102 [STORY: US1-P1] Verify player name shown in top-right corner
- [ ] T103 [STORY: US3-P2] Test Scenario 2: Verify animation is blinking (gold glow pulsing)
- [ ] T104 [STORY: US3-P2] Wait 5 seconds, verify animation has stopped
- [ ] T105 [STORY: US2-P1] Test Scenario 3: Press ENTER key, verify returns to homepage
- [ ] T106 [STORY: US2-P1] Test Scenario 4: Click "Continue" button instead, verify returns to homepage
- [ ] T107 [STORY: US1-P1] Test Scenario 5: Complete game with 0 score, verify skips results screen
- [ ] T108 [STORY: US1-P1] Test Scenario 6: Complete game with 100% accuracy, verify displays 100%

**Documentation updates**

- [X] T109 [STORY: All] Verify JSDoc comments added to all new functions
- [X] T110 [STORY: All] Run `npm run docs` to regenerate API documentation
- [X] T111 [STORY: All] Verify new docs generated: `ls docs/api/modules/pages_GameResultsPage.html`
- [ ] T112 [STORY: All] Update CLAUDE.md if new patterns introduced (review needed)

**Final verification**

- [ ] T113 [STORY: All] Run `npm run test:coverage` to verify adequate coverage (target >80%)
- [ ] T114 [STORY: All] Check bundle size: `npm run build` (verify no significant regression)
- [ ] T115 [STORY: All] Review git status: `git status` to verify only intended files changed
- [ ] T116 [STORY: All] Verify no console errors or warnings in browser DevTools

**Commit preparation**

- [ ] T117 [STORY: All] Review all changes with `git diff`
- [ ] T118 [STORY: All] Stage files: `git add src/pages/GameResultsPage.tsx src/pages/GameResultsPage.test.tsx src/pages/PlayPage.tsx src/pages/PlayPage.test.tsx src/App.tsx src/index.css`
- [ ] T119 [STORY: All] Write descriptive commit message following project conventions
- [ ] T120 [STORY: All] Commit changes (pre-commit hooks will auto-run)

---

## Task Summary by User Story

**User Story 1 (US1-P1): View Performance Summary**
- Tasks: T012-T050, T078-T093, T098-T102, T107-T108
- Focus: Component creation, stats calculation, display logic
- Priority: P1 (High)

**User Story 2 (US2-P1): Keyboard Navigation**
- Tasks: T051-T066, T105-T106
- Focus: ENTER key handler, mouse click handler, navigation logic
- Priority: P1 (High)

**User Story 3 (US3-P2): Visual Animation**
- Tasks: T008-T011, T067-T077, T103-T104
- Focus: CSS keyframes, animation state management, timer lifecycle
- Priority: P2 (Medium)

**Setup and QA (All Stories)**
- Tasks: T001-T007, T094-T097, T109-T120
- Focus: Prerequisites, quality gates, documentation, commit

---

## Parallelization Opportunities

**Parallel Group 1**: CSS keyframes (T008-T009) - Independent task
**Parallel Group 2**: Test writing for rendering (T014-T017) - Can write tests simultaneously
**Parallel Group 3**: Test writing for edge cases (T020-T023) - Independent test cases
**Parallel Group 4**: Test writing for navigation (T051-T053) - Independent test cases
**Parallel Group 5**: Test writing for animation (T067-T069) - Independent test cases

**Estimated Total Time**: ~2-3 hours (including testing and documentation)

---

## Constitutional Compliance Verification

- ✅ **Principle I**: Tests written BEFORE implementation (TDD red-green-refactor)
- ✅ **Principle II**: TypeScript strict mode, explicit types, interfaces exported
- ✅ **Principle III**: Functional component, single responsibility, JSDoc comments
- ✅ **Principle IV**: All 4 quality gates enforced (type-check, lint, test, build)
- ✅ **Principle V**: JSDoc required, API docs regenerated
- ✅ **Principle VI**: Keyboard-first navigation (ENTER key), mouse support (button click)

---

## Notes

- **Total Tasks**: 120 tasks organized in 7 sequential phases
- **Critical Path**: Phase 3 (Component Implementation) → Phase 4 (Navigation) → Phase 5 (Animation) → Phase 6 (Integration)
- **Estimated Duration**: 2-3 hours for complete implementation with testing
- **Dependencies**: None (all dependencies already exist in codebase)
- **Risk Level**: Low (well-defined requirements, existing patterns to follow)
