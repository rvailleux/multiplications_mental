# Tasks: Player Card Navigation

**Input**: Design documents from `/specs/019-player-card-navigation/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Unit tests included per Constitutional Principle I (TDD). E2E tests MANDATORY per Principle VIII.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Paths relative to repository root

---

## Phase 1: Setup (No Changes Required)

**Purpose**: Project is already initialized. No setup tasks needed for this feature.

> This feature enhances existing components. No new project structure required.

**Checkpoint**: ✅ Ready - existing project structure supports this feature

---

## Phase 2: Foundational (Component Interface Enhancement)

**Purpose**: Enhance PlayerNameDisplay component interface to support click interaction. This MUST complete before user stories.

**⚠️ CRITICAL**: User story implementation depends on this interface being in place.

- [X] T001 Update PlayerNameDisplayProps interface to add optional `onClick?: () => void` prop in `src/components/PlayerNameDisplay.tsx`
- [X] T002 Update JSDoc documentation for PlayerNameDisplay component and new onClick prop in `src/components/PlayerNameDisplay.tsx`
- [X] T003 Implement conditional clickable behavior - apply `styles.clickable` class when onClick provided in `src/components/PlayerNameDisplay.tsx`
- [X] T004 Add role="button" and tabIndex={0} attributes when onClick provided for accessibility in `src/components/PlayerNameDisplay.tsx`
- [X] T005 Add keyboard Enter key handler to trigger onClick for accessibility in `src/components/PlayerNameDisplay.tsx`

**Checkpoint**: Component interface ready - onClick prop available for parent pages

---

## Phase 3: User Story 1 - Switch Player via Card Click (Priority: P1) 🎯 MVP

**Goal**: Users can click the player card to navigate back to player selection screen from any page.

**Independent Test**: Click player card on any screen → verify navigation to `/` (player selection)

### Unit Tests for User Story 1 (TDD - MANDATORY per Constitution Principle I) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T006 [P] [US1] Unit test: PlayerNameDisplay calls onClick when clicked in `src/components/PlayerNameDisplay.test.tsx`
- [X] T007 [P] [US1] Unit test: PlayerNameDisplay does NOT call onClick when not provided (display-only mode) in `src/components/PlayerNameDisplay.test.tsx`
- [X] T008 [P] [US1] Unit test: PlayerNameDisplay triggers onClick on keyboard Enter press in `src/components/PlayerNameDisplay.test.tsx`

### E2E Tests for User Story 1 (MANDATORY - Constitutional Requirement Principle VIII) ⚠️

- [X] T009 [US1] **E2E test E2E-US1-001: Click player card from HomePage** in `tests/e2e/player-card-navigation.spec.ts`
  - Navigate to HomePage with selected player
  - Capture screenshot: `01-homepage-with-player.png`
  - Click player card
  - Verify URL changed to `/`
  - Capture screenshot: `02-player-selection-screen.png`

- [X] T010 [US1] **E2E test E2E-US1-002: Click player card during active game** in `tests/e2e/player-card-navigation.spec.ts`
  - Navigate to PlayPage with active game
  - Capture screenshot: `01-active-game.png`
  - Click player card
  - Verify game ends and URL changed to `/`
  - Capture screenshot: `02-navigated-to-selection.png`

- [X] T011 [US1] **E2E test E2E-US1-003: Click player card from GameResultsPage** in `tests/e2e/player-card-navigation.spec.ts`
  - Navigate to GameResultsPage
  - Click player card
  - Verify URL changed to `/`

### Implementation for User Story 1

- [X] T012 [US1] Pass onClick navigation handler to PlayerNameDisplay in `src/pages/HomePage.tsx`
  - Import useNavigate from react-router-dom
  - Add `onClick={() => navigate('/')}` prop to PlayerNameDisplay

- [X] T013 [US1] Pass onClick navigation handler to PlayerNameDisplay in `src/pages/PlayPage.tsx`
  - Import useNavigate from react-router-dom
  - Add `onClick={() => navigate('/')}` prop to PlayerNameDisplay
  - Note: Game session ends naturally (no incomplete score saved)

- [X] T014 [US1] Pass onClick navigation handler to PlayerNameDisplay in `src/pages/GameResultsPage.tsx`
  - Import useNavigate from react-router-dom
  - Add `onClick={() => navigate('/')}` prop to PlayerNameDisplay

- [X] T015 [US1] Pass onClick navigation handler to PlayerNameDisplay in `src/pages/CreditsPage.tsx`
  - Import useNavigate from react-router-dom
  - Add `onClick={() => navigate('/')}` prop to PlayerNameDisplay

### E2E Validation for User Story 1 (MANDATORY)

- [X] T016 [US1] **Verify E2E tests pass** - Run `npx playwright test tests/e2e/player-card-navigation.spec.ts --grep "US1"`
- [X] T017 [US1] **Review E2E screenshots** - Validate navigation states are correct
- [ ] T018 [US1] **Manual verification** - Test click navigation in real browser from all 4 pages

**Checkpoint**: Click-to-navigate functional on all pages. US1 complete and independently testable.

---

## Phase 4: User Story 2 - Visual Feedback on Hover (Priority: P2)

**Goal**: Users see visual hover feedback on the player card indicating it's clickable.

**Independent Test**: Hover over player card → verify cursor changes and card shows glow/scale effect

### Unit Tests for User Story 2 (TDD - MANDATORY) ⚠️

- [X] T019 [P] [US2] Unit test: PlayerNameDisplay has pointer cursor when onClick provided in `src/components/PlayerNameDisplay.test.tsx`
- [X] T020 [P] [US2] Unit test: PlayerNameDisplay has default cursor when onClick NOT provided in `src/components/PlayerNameDisplay.test.tsx`

### E2E Tests for User Story 2 (MANDATORY - Constitutional Requirement Principle VIII) ⚠️

- [X] T021 [US2] **E2E test E2E-US2-001: Hover state on player card** in `tests/e2e/player-card-navigation.spec.ts`
  - Navigate to HomePage
  - Capture screenshot: `01-homepage.png`
  - Hover over player card
  - Capture screenshot: `02-hover-state.png`
  - Verify cursor is pointer (using getComputedStyle)
  - Move mouse away
  - Capture screenshot: `03-normal-state.png`

### Implementation for User Story 2

- [X] T022 [US2] Add `.clickable` class with cursor: pointer and transition properties in `src/components/PlayerNameDisplay.module.scss`
- [X] T023 [US2] Add hover state (`:hover`) with scale transform and glow box-shadow in `src/components/PlayerNameDisplay.module.scss`
  - `transform: scale(1.03)`
  - `box-shadow: 0 0 12px rgba(0, 255, 255, 0.6)` (retro cyan glow)
  - `transition: transform 0.1s, box-shadow 0.1s` (snappy 8-bit feel)

### E2E Validation for User Story 2 (MANDATORY)

- [X] T024 [US2] **Verify E2E tests pass** - Run `npx playwright test tests/e2e/player-card-navigation.spec.ts --grep "US2"`
- [X] T025 [US2] **Review E2E screenshots** - Validate hover visual is distinct and retro-styled
- [ ] T026 [US2] **Manual verification** - Test hover effect in real browser, verify 8-bit aesthetic maintained

**Checkpoint**: Hover feedback visible and consistent with retro aesthetic. US2 complete.

---

## Phase 5: User Story 3 - Touch Support for iPad (Priority: P2)

**Goal**: Touch device users can tap the player card with appropriate visual feedback.

**Independent Test**: Tap player card on touch device → verify navigation occurs with press feedback

### Unit Tests for User Story 3 (TDD - MANDATORY) ⚠️

- [X] T027 [US3] Unit test: PlayerNameDisplay onClick fires on touch/click event in `src/components/PlayerNameDisplay.test.tsx`
  - Note: React's onClick handles both mouse and touch - test verifies unified behavior

### E2E Tests for User Story 3 (MANDATORY - Constitutional Requirement Principle VIII) ⚠️

- [X] T028 [US3] **E2E test E2E-US3-001: Touch tap on player card (iPad viewport)** in `tests/e2e/player-card-navigation.spec.ts`
  - Set viewport to iPad dimensions (768x1024)
  - Navigate to HomePage
  - Tap player card (using Playwright touch action)
  - Verify navigation to player selection

### Implementation for User Story 3

- [X] T029 [US3] Add active state (`:active`) with pressed appearance in `src/components/PlayerNameDisplay.module.scss`
  - `transform: scale(0.98)` (subtle press-in effect)
  - Works for both mouse click and touch tap

### E2E Validation for User Story 3 (MANDATORY)

- [X] T030 [US3] **Verify E2E tests pass** - Run `npx playwright test tests/e2e/player-card-navigation.spec.ts --grep "US3"`
- [ ] T031 [US3] **Manual verification on touch device** - Test on actual iPad or Chrome DevTools touch simulation

**Checkpoint**: Touch interaction works identically to click. US3 complete.

---

## Phase 6: Polish & Quality Gates

**Purpose**: Final validation and documentation updates

- [X] T032 [P] Run all unit tests: `npm run test:run`
- [X] T033 [P] Run TypeScript type check: `npm run type-check`
- [X] T034 [P] Run linting with auto-fix: `npm run lint:fix`
- [X] T035 Build production bundle: `npm run build`
- [X] T036 **E2E regression suite** - Run all E2E tests: `npx playwright test tests/e2e/`
- [X] T037 **E2E visual review** - Review all screenshots for visual consistency
- [X] T038 Update JSDoc documentation: `npm run docs`
- [ ] T039 Manual full regression - Test all 4 pages with keyboard (ESC still works) + mouse + touch

**Checkpoint**: All quality gates pass. Feature complete.

---

## Dependencies & Execution Order

### Phase Dependencies

```text
Phase 1 (Setup)         → N/A (already complete)
         │
         ▼
Phase 2 (Foundational)  → T001-T005 must complete
         │
         ├──────────────────────────────┐
         ▼                              ▼
Phase 3 (US1 - P1)              Phase 4 (US2 - P2)
Click Navigation                 Hover Feedback
         │                              │
         │                              ▼
         │                      Phase 5 (US3 - P2)
         │                      Touch Support
         │                              │
         └──────────────────────────────┘
                       │
                       ▼
              Phase 6 (Polish)
```

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Phase 2 (Foundational). No dependency on US2/US3.
- **User Story 2 (P2)**: Depends on Phase 2 (Foundational). No dependency on US1/US3.
- **User Story 3 (P2)**: Depends on Phase 2 (Foundational) and Phase 4 (US2) for `:active` to follow `:hover` pattern.

### Within Each User Story

1. **Tests FIRST** - Write unit tests and E2E tests, verify they FAIL
2. **Implementation** - Write code to make tests pass
3. **Validation** - Run E2E tests, review screenshots, manual verification

### Parallel Opportunities

**Phase 2 (Foundational)**:
- T001-T005 are sequential (same file: PlayerNameDisplay.tsx)

**Phase 3 (US1 Tests)**:
```bash
# These unit tests can run in parallel (same test file, different test cases):
Task T006: Unit test onClick called
Task T007: Unit test onClick not called when not provided
Task T008: Unit test Enter key triggers onClick
```

**Phase 3 (US1 Implementation)**:
```bash
# Page updates can run in parallel (different files):
Task T012: HomePage.tsx
Task T013: PlayPage.tsx
Task T014: GameResultsPage.tsx
Task T015: CreditsPage.tsx
```

**Phase 4 (US2 Tests)**:
```bash
# These unit tests can run in parallel:
Task T019: Unit test pointer cursor when clickable
Task T020: Unit test default cursor when not clickable
```

**Phase 6 (Quality Gates)**:
```bash
# These checks can run in parallel:
Task T032: npm run test:run
Task T033: npm run type-check
Task T034: npm run lint:fix
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. ✅ Phase 1: Setup (already complete)
2. Complete Phase 2: Foundational (T001-T005)
3. Complete Phase 3: User Story 1 (T006-T018)
4. **STOP and VALIDATE**: Test clicking player card from all 4 pages
5. Deploy/demo if ready - core functionality working

### Incremental Delivery

1. Phase 2 (Foundational) → Interface ready
2. Add US1 (Click Navigation) → Test independently → **MVP deployed!**
3. Add US2 (Hover Feedback) → Test independently → Enhanced UX
4. Add US3 (Touch Support) → Test independently → iPad support complete
5. Phase 6 (Polish) → Full quality validation

### Recommended Execution Order

For a single developer:
1. T001-T005 (Foundational - interface setup)
2. T006-T008 (US1 unit tests - TDD)
3. T009-T011 (US1 E2E tests - TDD)
4. T012-T015 (US1 implementation)
5. T016-T018 (US1 validation)
6. **Checkpoint: MVP complete - test before continuing**
7. T019-T020 (US2 unit tests)
8. T021 (US2 E2E test)
9. T022-T023 (US2 implementation)
10. T024-T026 (US2 validation)
11. T027-T028 (US3 tests)
12. T029 (US3 implementation)
13. T030-T031 (US3 validation)
14. T032-T039 (Polish & quality gates)

---

## Notes

- **[P] tasks**: Different files, no dependencies - can run in parallel
- **[Story] label**: Maps task to specific user story for traceability
- **TDD Mandatory**: Tests must be written FIRST and FAIL before implementation
- **E2E Mandatory**: Constitutional Principle VIII requires E2E tests
- **Commit Strategy**: Commit after each phase or logical group
- **Quality Gates**: All 4 commands must pass before final commit
