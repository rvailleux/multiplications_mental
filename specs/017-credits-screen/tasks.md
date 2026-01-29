# Tasks: Credits Screen

**Input**: Design documents from `/specs/017-credits-screen/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Unit tests OPTIONAL (not explicitly requested). E2E tests MANDATORY (per Constitution Principle VIII).

**Organization**: Tasks grouped by user story. US1 and US4 combined (both P1, both handle navigation).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1, US2, US3, US1+US4)
- Exact file paths included in descriptions

---

## Phase 1: Setup (Types & Data Foundation)

**Purpose**: Create type definitions and static data that all components will use

- [X] T001 [P] Create credits type definitions in src/types/credits.ts
  - Define `CreditsSection`, `AttributionItem`, `StarLayerConfig`, `ScrollState` interfaces
  - Export `SPEED_LEVELS` constant array
- [X] T002 [P] Create credits static data in src/data/creditsData.ts
  - Define `CREDITS_DATA` with Music, Sound Effects, Made with, Special Thanks sections
  - Define `STARFIELD_CONFIG` with 3 layer configurations (distant, medium, near)

---

## Phase 2: Foundational Components (Visual Building Blocks)

**Purpose**: Create reusable visual components that CreditsPage will compose

**⚠️ CRITICAL**: These components must be complete before CreditsPage can be built

- [X] T003 [P] Create Starfield component styles in src/components/Starfield.module.scss
  - Define `starfield-scroll` keyframe animation
  - Style 3 parallax layers with different speeds (20s, 12s, 8s)
- [X] T004 [P] Create Starfield component in src/components/Starfield.tsx
  - Render 3 star layers using `STARFIELD_CONFIG`
  - Generate random star positions within each layer
  - Apply CSS animation classes from module
- [X] T005 [P] Create RainbowTitle component styles in src/components/RainbowTitle.module.scss
  - Define `rainbow-wave` keyframe animation
  - Style gradient text with 8-color palette
- [X] T006 [P] Create RainbowTitle component in src/components/RainbowTitle.tsx
  - Accept `title` prop
  - Apply rainbow gradient animation via CSS class

**Checkpoint**: Visual building blocks ready for integration

---

## Phase 3: User Story 1 + 4 - Access & Exit Credits (Priority: P1) 🎯 MVP

**Goal**: Users can enter credits via Ctrl+C from leaderboard and exit via Escape

**Independent Test**: Press Ctrl+C on leaderboard → credits screen appears → Press Escape → returns to leaderboard

### E2E Tests for US1 + US4 (MANDATORY)

- [X] T007 [US1+US4] **E2E test for credits access and exit** in tests/e2e/credits.spec.ts
  - E2E-US1-001: Access Credits via Keyboard Shortcut
  - E2E-US1-002: Shortcut Only Works on Leaderboard
  - E2E-US4-001: Return to Leaderboard via Escape
  - Test keyboard navigation (Ctrl+C, Escape)
  - Capture screenshots at key states

### Implementation for US1 + US4

- [X] T008 [US1+US4] Create useCreditsScroll hook in src/hooks/useCreditsScroll.ts
  - Manage `scrollPosition`, `speedIndex`, `isScrolling` state
  - Expose `increaseSpeed()`, `decreaseSpeed()`, `resetScroll()` functions
  - Use requestAnimationFrame for smooth scrolling
- [X] T009 [US1+US4] Create CreditsPage styles in src/pages/CreditsPage.module.scss
  - Full-screen container with dark background
  - Layer positioning for Starfield, Title, Content
  - 8-bit aesthetic (pixel borders, retro fonts)
- [X] T010 [US1+US4] Create CreditsPage component in src/pages/CreditsPage.tsx
  - Compose Starfield, RainbowTitle components
  - Placeholder for CreditsContent (Phase 4)
  - Handle Escape key → navigate to /home
  - Handle ArrowUp/Down keys → speed control (for US3)
- [X] T011 [US1+US4] Add /credits route in src/App.tsx
  - Import CreditsPage component
  - Add Route element for path="/credits"
- [X] T012 [US1+US4] Add Ctrl+C handler in src/pages/HomePage.tsx
  - Listen for Ctrl+C (and Cmd+C on Mac) keydown
  - Call `e.preventDefault()` to prevent copy
  - Navigate to /credits
- [X] T013 [US1+US4] Update KeyboardHints in src/components/KeyboardHints.tsx
  - Add 'credits' to ScreenId type
  - Add credits config: `{ key: '↑↓', description: 'Scroll Speed' }, { key: 'ESC', description: 'Back' }`
  - Update 'home' config: Add `{ key: 'Ctrl+C', description: 'Credits' }`

### E2E Validation for US1 + US4 (MANDATORY)

- [X] T014 [US1+US4] **Verify E2E tests pass** - Run `npx playwright test tests/e2e/credits.spec.ts`
- [X] T015 [US1+US4] **Manual verification** - Test Ctrl+C and Escape in real browser

**Checkpoint**: MVP complete - users can access and exit credits screen

---

## Phase 4: User Story 2 - View Auto-Scrolling Credits (Priority: P2)

**Goal**: Credits content auto-scrolls upward with all attribution sections visible

**Independent Test**: Open credits → content scrolls automatically → all sections readable → loops back

### E2E Tests for US2 (MANDATORY)

- [X] T016 [US2] **E2E test for credits content** in tests/e2e/credits.spec.ts
  - E2E-US2-001: View All Credits Content Sections
  - Verify Music, SFX, Made with, Special Thanks sections scroll past
  - Capture screenshots at each section
  - Verify content loops after scrolling completes

### Implementation for US2

- [X] T017 [P] [US2] Create CreditsContent styles in src/components/CreditsContent.module.scss
  - Scrolling container with hidden overflow
  - Section header styling (with icon support)
  - Attribution item styling (name, description, author)
  - 8-bit retro typography
- [X] T018 [US2] Create CreditsContent component in src/components/CreditsContent.tsx
  - Accept `creditsData`, `scrollState` props
  - Render all CreditsSection items with icons
  - Apply scroll position from scrollState
  - Loop content when fully scrolled
- [X] T019 [US2] Integrate CreditsContent into CreditsPage in src/pages/CreditsPage.tsx
  - Replace placeholder with actual CreditsContent
  - Pass CREDITS_DATA and scroll state from useCreditsScroll
  - Ensure seamless loop behavior

### E2E Validation for US2 (MANDATORY)

- [X] T020 [US2] **Verify E2E tests pass** - Run content visibility tests
- [X] T021 [US2] **Manual verification** - Read through all credits sections

**Checkpoint**: Full credits experience - visual background, animated title, scrolling content

---

## Phase 5: User Story 3 - Speed Control (Priority: P3)

**Goal**: Users can control scroll speed with Up/Down arrow keys

**Independent Test**: Open credits → press Up Arrow → speed increases → press Down Arrow → speed decreases/pauses

### E2E Tests for US3 (MANDATORY)

- [X] T022 [US3] **E2E test for speed control** in tests/e2e/credits.spec.ts
  - E2E-US3-001: Control Scrolling Speed
  - Test Up Arrow increases speed
  - Test Down Arrow decreases speed (to paused)
  - Test speed boundaries (min paused, max 3x)
  - Capture screenshots showing speed indicator (if any)

### Implementation for US3

- [X] T023 [US3] Enhance useCreditsScroll hook in src/hooks/useCreditsScroll.ts
  - Add visual speed indicator state (optional display)
  - Ensure speed boundaries are enforced (index 0 to SPEED_LEVELS.length-1)
  - Add brief visual feedback when speed changes
- [X] T024 [US3] Add speed indicator UI (optional) in src/pages/CreditsPage.tsx
  - Show current speed level when changed (fade out after 1s)
  - Use retro styling consistent with game
- [X] T025 [US3] Ensure keyboard handlers are responsive in src/pages/CreditsPage.tsx
  - Verify ArrowUp/Down call increaseSpeed/decreaseSpeed from hook
  - Verify e.preventDefault() prevents page scroll

### E2E Validation for US3 (MANDATORY)

- [X] T026 [US3] **Verify E2E tests pass** - Run speed control tests
- [X] T027 [US3] **Manual verification** - Test speed changes feel responsive

**Checkpoint**: Complete feature - all user stories functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Quality gates and final validation

- [X] T028 Run TypeScript check - `npm run type-check`
- [X] T029 Run lint fix - `npm run lint:fix`
- [X] T030 Run all unit tests - `npm run test:run`
- [X] T031 Run production build - `npm run build`
- [X] T032 **E2E regression suite** - Run `npx playwright test tests/e2e/credits.spec.ts`
- [X] T033 **E2E visual review** - Check all screenshots for 8-bit aesthetic consistency
- [X] T034 Manual browser testing - Verify full flow on Chrome, Firefox, Safari
- [X] T035 Performance check - Verify starfield maintains 60fps
- [X] T036 Update JSDoc comments - Ensure all exports documented

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 types
- **Phase 3 (US1+US4)**: Depends on Phase 2 components
- **Phase 4 (US2)**: Depends on Phase 3 page structure
- **Phase 5 (US3)**: Depends on Phase 4 scroll mechanism
- **Phase 6 (Polish)**: Depends on all user stories complete

### User Story Dependencies

- **US1+US4 (P1)**: Can start after Foundational - MVP entry/exit
- **US2 (P2)**: Builds on US1+US4 page - adds content
- **US3 (P3)**: Builds on US2 scroll - adds control

### Within Each Phase

- Tasks marked [P] can run in parallel
- E2E tests should be written before implementation tasks start
- Verify E2E tests FAIL before implementing

### Parallel Opportunities

Phase 1:
```bash
# Both type and data files can be created simultaneously
Task T001: "Create credits type definitions in src/types/credits.ts"
Task T002: "Create credits static data in src/data/creditsData.ts"
```

Phase 2:
```bash
# All component files can be created in parallel
Task T003: "Starfield styles"
Task T004: "Starfield component"
Task T005: "RainbowTitle styles"
Task T006: "RainbowTitle component"
```

---

## Implementation Strategy

### MVP First (US1 + US4)

1. Complete Phase 1: Types & Data
2. Complete Phase 2: Foundational Components
3. Complete Phase 3: US1+US4 (Access & Exit)
4. **STOP and VALIDATE**: Test entry/exit flow independently
5. Can deploy MVP - users can see credits screen (basic visual)

### Full Feature (All Stories)

1. After MVP: Add Phase 4 (US2) - scrolling content
2. Add Phase 5 (US3) - speed control
3. Complete Phase 6: Quality gates

### Estimated Scope

| Phase | Tasks | Files |
|-------|-------|-------|
| Phase 1: Setup | 2 | 2 |
| Phase 2: Foundational | 4 | 4 |
| Phase 3: US1+US4 | 9 | 5 (+1 E2E) |
| Phase 4: US2 | 6 | 2 (+1 E2E addition) |
| Phase 5: US3 | 6 | 1 (+1 E2E addition) |
| Phase 6: Polish | 9 | 0 |
| **Total** | **36** | **14+** |

---

## Notes

- Constitution Principle VIII requires E2E tests for ALL user stories
- Unit tests not explicitly requested - E2E tests provide coverage
- Starfield animation uses CSS for performance (GPU-accelerated)
- Rainbow title uses CSS gradient animation
- Credits scroll uses requestAnimationFrame for smoothness
- All keyboard handlers must prevent default to avoid browser conflicts
