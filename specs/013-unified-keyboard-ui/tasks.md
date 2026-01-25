# Tasks: Unified Keyboard UI Navigation

**Input**: Design documents from `/specs/013-unified-keyboard-ui/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Unit/integration tests included per Constitution Principle I (Test-First Development). E2E tests MANDATORY per Constitution Principle VIII.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths follow existing project structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Type definitions and core hook creation

- [x] T001 [P] Create navigation type definitions in src/types/navigation.ts
- [x] T002 [P] Write failing unit tests for useNavigableOptions hook in src/hooks/useNavigableOptions.test.ts
- [x] T003 Implement useNavigableOptions hook in src/hooks/useNavigableOptions.ts (depends on T001, T002)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Verify existing components meet requirements - MUST complete before user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Verify existing JumpingArrow component works with visible prop in src/components/JumpingArrow.tsx
- [x] T005 Verify existing KeyboardHints component structure supports configuration updates in src/components/KeyboardHints.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Jumping Arrow Selection Indicator (Priority: P1) 🎯 MVP

**Goal**: Display jumping arrow visual indicator next to currently selected option on HomePage, PlayPage, and GameResultsPage

**Independent Test**: Navigate through all screens with keyboard, verify jumping arrow appears next to selected option on each screen

### Tests for User Story 1 (Unit + E2E - MANDATORY) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

**Unit Tests (Constitutional Requirement Principle I)**:
- [x] T006 [P] [US1] Write failing tests for HomePage jumping arrow in src/pages/HomePage.test.tsx
- [x] T007 [P] [US1] Write failing tests for GameResultsPage jumping arrow in src/pages/GameResultsPage.test.tsx

**E2E Tests (Constitutional Requirement Principle VIII)**:
- [ ] T008 [US1] **E2E test for jumping arrow on HomePage** in tests/e2e/unified-keyboard-ui.spec.ts
  - Map to E2E-US1-001 from spec.md
  - Navigate to HomePage, verify arrow visible next to Start Game button
  - Press Enter to navigate, verify game starts
  - Capture screenshots at key states
- [ ] T009 [US1] **E2E test for jumping arrow navigation on PlayPage** in tests/e2e/unified-keyboard-ui.spec.ts
  - Map to E2E-US1-002 from spec.md
  - Verify arrow at Valider by default
  - Press ArrowDown, verify arrow moves to Restart
  - Press ArrowUp, verify arrow returns to Valider
  - Capture screenshots

### Implementation for User Story 1

- [x] T010 [US1] Add JumpingArrow import and state to HomePage in src/pages/HomePage.tsx
- [x] T011 [US1] Add keyboard event handler (Enter, Escape, ArrowUp/Down do nothing) to HomePage in src/pages/HomePage.tsx
- [x] T012 [US1] Update HomePage button rendering with JumpingArrow component in src/pages/HomePage.tsx
- [x] T013 [US1] Add selected button styling to HomePage in src/pages/HomePage.module.scss
- [x] T014 [US1] Add JumpingArrow import and state to GameResultsPage in src/pages/GameResultsPage.tsx
- [x] T015 [US1] Add keyboard event handler (Enter, Escape) to GameResultsPage in src/pages/GameResultsPage.tsx
- [x] T016 [US1] Update GameResultsPage button rendering with JumpingArrow component in src/pages/GameResultsPage.tsx
- [x] T017 [US1] Add selected button styling to GameResultsPage in src/pages/GameResultsPage.module.scss

### E2E Validation for User Story 1 (MANDATORY)

- [ ] T018 [US1] **Verify E2E tests pass** - Run `npx playwright test tests/e2e/unified-keyboard-ui.spec.ts --grep "US1"`
- [ ] T019 [US1] **Review E2E screenshots** - Validate visual state at each step in test-results/
- [ ] T020 [US1] **Manual E2E verification** - Test keyboard + mouse paths in real browser for HomePage and GameResultsPage

**Checkpoint**: At this point, User Story 1 should be fully functional - jumping arrow visible on all screens

---

## Phase 4: User Story 2 - Arrow Key Navigation on PlayPage (Priority: P2)

**Goal**: Enable arrow key navigation between Valider and Restart options, digit input in textbox, and Backspace support

**Independent Test**: Start game, type numbers in answer box, press arrow keys to switch between options, verify arrow moves and Enter executes selected action

### Tests for User Story 2 (Unit + E2E - MANDATORY) ⚠️

**Unit Tests (Constitutional Requirement Principle I)**:
- [x] T021 [P] [US2] Write failing tests for PlayPage option navigation in src/pages/PlayPage.test.tsx
- [x] T022 [P] [US2] Write failing tests for digit input and backspace in src/pages/PlayPage.test.tsx
- [x] T023 [P] [US2] Write failing tests for selection state preservation during pause menu in src/pages/PlayPage.test.tsx

**E2E Tests (Constitutional Requirement Principle VIII)**:
- [ ] T024 [US2] **E2E test for typing answer and submit** in tests/e2e/unified-keyboard-ui.spec.ts
  - Map to E2E-US2-001 from spec.md
  - Type digits, verify input, press Enter to submit
  - Capture screenshots
- [ ] T025 [US2] **E2E test for navigating between Valider and Restart** in tests/e2e/unified-keyboard-ui.spec.ts
  - Map to E2E-US2-002 from spec.md
  - Navigate to Restart, press Enter to restart game
  - Capture screenshots
- [ ] T026 [US2] **E2E test for Backspace functionality** in tests/e2e/unified-keyboard-ui.spec.ts
  - Map to E2E-US2-003 from spec.md
  - Type digits, press Backspace, verify deletion
  - Capture screenshots

### Implementation for User Story 2

- [x] T027 [US2] Import useNavigableOptions hook and NavigableOption type in PlayPage in src/pages/PlayPage.tsx
- [x] T028 [US2] Initialize useNavigableOptions with Valider/Restart options and callbacks in src/pages/PlayPage.tsx
- [x] T029 [US2] Update keyboard event handler to use navigateUp/navigateDown/executeSelectedOption in src/pages/PlayPage.tsx
- [x] T030 [US2] Ensure digit keys (0-9) pass through to input without interference in src/pages/PlayPage.tsx
- [x] T031 [US2] Ensure Backspace passes through to input without interference in src/pages/PlayPage.tsx
- [x] T032 [US2] Update PlayPage button rendering with JumpingArrow and selectedOption state in src/pages/PlayPage.tsx
- [x] T033 [US2] Add options container and selected button styling in src/pages/PlayPage.module.scss
- [x] T034 [US2] Verify selection state persists when pause menu opens/closes in src/pages/PlayPage.tsx

### E2E Validation for User Story 2 (MANDATORY)

- [ ] T035 [US2] **Verify E2E tests pass** - Run `npx playwright test tests/e2e/unified-keyboard-ui.spec.ts --grep "US2"`
- [ ] T036 [US2] **Review E2E screenshots** - Validate navigation and input behavior
- [ ] T037 [US2] **Manual E2E verification** - Test full gameplay with keyboard-only (type answer, navigate, submit, restart)

**Checkpoint**: At this point, User Story 2 should be fully functional - complete keyboard gameplay works

---

## Phase 5: User Story 3 - Keyboard Hints Display (Priority: P3)

**Goal**: Display context-appropriate keyboard hints at bottom of every screen

**Independent Test**: Navigate through all screens, verify appropriate keyboard hints appear at bottom of each screen, verify hints wrap on narrow viewports

### Tests for User Story 3 (Unit + E2E - MANDATORY) ⚠️

**Unit Tests (Constitutional Requirement Principle I)**:
- [x] T038 [P] [US3] Write/update tests for HomePage keyboard hints configuration in src/components/KeyboardHints.test.tsx
- [x] T039 [P] [US3] Write/update tests for PlayPage keyboard hints configuration in src/components/KeyboardHints.test.tsx
- [x] T040 [P] [US3] Write/update tests for GameResultsPage keyboard hints configuration in src/components/KeyboardHints.test.tsx

**E2E Tests (Constitutional Requirement Principle VIII)**:
- [ ] T041 [US3] **E2E test for keyboard hints on HomePage** in tests/e2e/unified-keyboard-ui.spec.ts
  - Map to E2E-US3-001 from spec.md
  - Verify hints display Navigate, Select, Change Player
  - Capture screenshots
- [ ] T042 [US3] **E2E test for keyboard hints on PlayPage** in tests/e2e/unified-keyboard-ui.spec.ts
  - Map to E2E-US3-002 from spec.md
  - Verify hints display Type Answer, Delete, Navigate Options, Confirm, Pause
  - Capture screenshots
- [ ] T043 [US3] **E2E test for keyboard hints on PlayerSelectPage** in tests/e2e/unified-keyboard-ui.spec.ts
  - Map to E2E-US3-003 from spec.md
  - Verify hints display Navigate, Select, Exit
  - Capture screenshots

### Implementation for User Story 3

- [x] T044 [US3] Update KEYBOARD_HINTS_CONFIG 'home' entry with Navigate, Select, Change Player hints in src/components/KeyboardHints.tsx
- [x] T045 [US3] Update KEYBOARD_HINTS_CONFIG 'play' entry with Type Answer, Delete, Navigate Options, Confirm, Pause hints in src/components/KeyboardHints.tsx
- [x] T046 [US3] Update KEYBOARD_HINTS_CONFIG 'results' entry with Continue, Change Player hints in src/components/KeyboardHints.tsx
- [x] T047 [US3] Verify KeyboardHints component renders on HomePage with screenId="home" in src/pages/HomePage.tsx
- [x] T048 [US3] Verify KeyboardHints component renders on PlayPage with screenId="play" in src/pages/PlayPage.tsx
- [x] T049 [US3] Verify KeyboardHints component renders on GameResultsPage with screenId="results" in src/pages/GameResultsPage.tsx
- [x] T050 [US3] Verify flex-wrap styling allows hints to wrap on narrow viewports in src/components/KeyboardHints.module.scss

### E2E Validation for User Story 3 (MANDATORY)

- [ ] T051 [US3] **Verify E2E tests pass** - Run `npx playwright test tests/e2e/unified-keyboard-ui.spec.ts --grep "US3"`
- [ ] T052 [US3] **Review E2E screenshots** - Validate hints display and positioning
- [ ] T053 [US3] **Manual E2E verification** - Test hints on all screens, test wrap behavior on narrow viewport

**Checkpoint**: At this point, User Story 3 should be fully functional - keyboard hints visible on all screens

---

## Phase 6: User Story 4 - Documentation Updates (Priority: P4)

**Goal**: Update CLAUDE.md and constitution.md with keyboard navigation patterns and guidelines

**Independent Test**: Review documentation files to verify jumping arrow patterns, arrow key navigation standards, and keyboard hints implementation guidelines are present

### Implementation for User Story 4

- [ ] T054 [P] [US4] Add "Jumping Arrow Pattern" section to CLAUDE.md under "Retro Gaming UX Design"
- [ ] T055 [P] [US4] Add "Multi-Option Navigation with useNavigableOptions" example to CLAUDE.md
- [ ] T056 [US4] Update constitution.md Principle VI with arrow key navigation and jumping arrow requirements in .specify/memory/constitution.md
- [ ] T057 [US4] Update ARCHITECTURE.md with new hook and type documentation (if applicable)
- [ ] T058 [US4] Regenerate API documentation with `npm run docs`

**Checkpoint**: At this point, all documentation reflects new keyboard navigation standards

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, cleanup, and quality assurance

- [x] T059 Run `npm run type-check` - verify zero TypeScript errors
- [x] T060 Run `npm run lint:fix` - fix all linting issues
- [x] T061 Run `npm run test:run` - verify all unit tests pass
- [x] T062 Run `npm run build` - verify production build succeeds
- [ ] T063 **E2E regression suite** - Run `npx playwright test` - all E2E tests pass
- [ ] T064 **E2E visual review** - Check all screenshots in test-results/ for consistency
- [x] T065 Review and update JSDoc comments for all new/modified functions
- [ ] T066 Run quickstart.md validation checklist (Final Verification section)
- [x] T067 Code cleanup - remove any console.log statements, unused imports

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001-T003) - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **User Story 2 (Phase 4)**: Depends on Foundational phase completion + T003 (useNavigableOptions hook)
- **User Story 3 (Phase 5)**: Depends on Foundational phase completion (can run parallel to US1/US2)
- **User Story 4 (Phase 6)**: Depends on US1, US2, US3 completion (documents implemented patterns)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Uses useNavigableOptions from Phase 1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent of US1/US2
- **User Story 4 (P4)**: Depends on US1-US3 completion (documents the patterns)

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD)
- Unit tests can be written in parallel within a story
- Implementation follows: tests → component logic → styling → validation
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)**:
- T001 and T002 can run in parallel (types and tests)

**Phase 3 (US1)**:
- T006 and T007 can run in parallel (different test files)

**Phase 4 (US2)**:
- T021, T022, T023 can run in parallel (different test scenarios)

**Phase 5 (US3)**:
- T038, T039, T040 can run in parallel (different config tests)

**Phase 6 (US4)**:
- T054 and T055 can run in parallel (different doc sections)

**Cross-Phase**:
- US1, US2, US3 can be worked on in parallel once Foundational is complete (different pages/components)

---

## Parallel Example: User Stories 1, 2, and 3

```bash
# After Foundational phase completes, launch all user stories in parallel:

# Developer A: User Story 1 (HomePage + GameResultsPage)
Task: "Write failing tests for HomePage jumping arrow"
Task: "Write failing tests for GameResultsPage jumping arrow"

# Developer B: User Story 2 (PlayPage navigation)
Task: "Write failing tests for PlayPage option navigation"
Task: "Write failing tests for digit input and backspace"

# Developer C: User Story 3 (Keyboard hints)
Task: "Write/update tests for HomePage keyboard hints configuration"
Task: "Write/update tests for PlayPage keyboard hints configuration"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (types + hook)
2. Complete Phase 2: Foundational (verify existing components)
3. Complete Phase 3: User Story 1 (jumping arrow on all screens)
4. **STOP and VALIDATE**: Test jumping arrow independently
5. Deploy/demo if ready - users can see selection indicator

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Demo (visual indicator MVP!)
3. Add User Story 2 → Test independently → Demo (keyboard gameplay complete!)
4. Add User Story 3 → Test independently → Demo (hints for discoverability!)
5. Add User Story 4 → Review docs → Complete feature!

### Parallel Team Strategy

With 3 developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (HomePage + GameResultsPage arrows)
   - Developer B: User Story 2 (PlayPage navigation)
   - Developer C: User Story 3 (keyboard hints)
3. All reconvene for User Story 4 (documentation) and Polish phase

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All E2E tests MANDATORY per Constitution Principle VIII
- Dual input (keyboard + mouse) must be tested for every interaction
