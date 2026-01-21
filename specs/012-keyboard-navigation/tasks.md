# Tasks: Enhanced Keyboard Navigation with Pause Menu

**Input**: Design documents from `/specs/012-keyboard-navigation/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are MANDATORY per constitutional requirement (TDD - Test-First Development)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

All paths are relative to repository root `/home/romain/code/multiplication_game/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Type definitions and shared utilities

- [X] T001 [P] Create keyboard event types in src/types/keyboard.ts
- [X] T002 [P] Add zoom/splash animation to src/styles/_animations.scss
- [X] T003 [P] Add modal mixin to src/styles/_mixins.scss

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core reusable components that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### JumpingArrow Component (Used by ALL Stories)

- [X] T004 Write tests for JumpingArrow in src/components/JumpingArrow.test.tsx (MUST FAIL)
- [X] T005 Create JumpingArrow component in src/components/JumpingArrow.tsx
- [X] T006 Create JumpingArrow styles in src/components/JumpingArrow.module.scss
- [X] T007 Verify JumpingArrow tests pass

### KeyboardHints Component (Used by US3 and US4)

- [X] T008 Write tests for KeyboardHints in src/components/KeyboardHints.test.tsx (MUST FAIL)
- [X] T009 Create KeyboardHints component in src/components/KeyboardHints.tsx
- [X] T010 Create KeyboardHints styles in src/components/KeyboardHints.module.scss
- [X] T011 Verify KeyboardHints tests pass

### Custom Hooks (Used by Multiple Stories)

- [X] T012 Write tests for useFocusManagement in src/hooks/useFocusManagement.test.ts (MUST FAIL)
- [X] T013 Implement useFocusManagement hook in src/hooks/useFocusManagement.ts
- [X] T014 Verify useFocusManagement tests pass

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Pause Game During Play (Priority: P1) 🎯 MVP

**Goal**: Players can pause gameplay with ESC key, showing a retro-styled pause menu with "Quit Game" and "Continue Playing" options. Timer pauses while menu is open. Players navigate with arrow keys and jumping arrow indicator.

**Independent Test**: Start a game, press ESC, verify pause menu appears with zoom animation, timer stops, navigate options with arrows, confirm with Enter or cancel with ESC.

### Tests for User Story 1 (TDD - MUST WRITE FIRST)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T015 [P] [US1] Write timer pause/resume tests in src/hooks/useTimer.test.ts (extend existing tests)
- [X] T016 [P] [US1] Write usePauseMenu hook tests in src/hooks/usePauseMenu.test.ts (MUST FAIL)
- [ ] T017 [P] [US1] Write PauseMenu component tests in src/components/PauseMenu.test.tsx (MUST FAIL)
- [ ] T018 [P] [US1] Write PlayPage pause integration tests in src/pages/PlayPage.test.tsx (extend existing tests)

### Implementation for User Story 1

- [X] T019 [US1] Extend useTimer hook with pause/resume in src/hooks/useTimer.ts
- [X] T020 [US1] Implement usePauseMenu hook in src/hooks/usePauseMenu.ts
- [ ] T021 [US1] Create PauseMenu component in src/components/PauseMenu.tsx
- [ ] T022 [US1] Create PauseMenu styles in src/components/PauseMenu.module.scss
- [ ] T023 [US1] Integrate pause menu into PlayPage in src/pages/PlayPage.tsx
- [ ] T024 [US1] Update PlayPage styles for pause menu in src/pages/PlayPage.module.scss
- [ ] T025 [US1] Add ESC key handler to PlayPage for pause menu
- [ ] T026 [US1] Connect timer pause/resume to pause menu state
- [ ] T027 [US1] Verify all US1 tests pass

### Error Handling & Edge Cases for User Story 1

- [ ] T028 [US1] Add try-catch for timer pause/resume state updates
- [ ] T029 [US1] Handle ESC while pause menu already open (close menu)
- [ ] T030 [US1] Handle timer reaching zero while paused (stay paused)
- [ ] T031 [US1] Test error handling scenarios

**Checkpoint**: User Story 1 complete - Pause menu fully functional and independently testable

---

## Phase 4: User Story 2 - Unified Jumping Arrow Navigation (Priority: P2)

**Goal**: All interactive elements across all screens use consistent jumping arrow to indicate focus. Home screen "Start Game" button shows jumping arrow. PlayPage "Valider" and "Restart" buttons navigable with arrows and show jumping arrow. Consistent animation everywhere.

**Independent Test**: Navigate through each screen (Home, Play) and verify jumping arrow appears on focused elements with consistent bounce animation.

### Tests for User Story 2 (TDD - MUST WRITE FIRST)

- [ ] T032 [P] [US2] Write HomePage jumping arrow tests in src/pages/HomePage.test.tsx (extend existing tests)
- [ ] T033 [P] [US2] Write PlayPage button navigation tests in src/pages/PlayPage.test.tsx (extend existing tests)

### Implementation for User Story 2

- [ ] T034 [US2] Add jumping arrow to HomePage Start Game button in src/pages/HomePage.tsx
- [ ] T035 [US2] Add focus state management to HomePage in src/pages/HomePage.tsx
- [ ] T036 [US2] Update HomePage styles for jumping arrow in src/pages/HomePage.module.scss
- [ ] T037 [US2] Add jumping arrows to PlayPage Valider and Restart buttons in src/pages/PlayPage.tsx
- [ ] T038 [US2] Add arrow key navigation between buttons on PlayPage in src/pages/PlayPage.tsx
- [ ] T039 [US2] Update PlayPage styles for button focus states in src/pages/PlayPage.module.scss
- [ ] T040 [US2] Ensure jumping arrow animation restarts on focus change
- [ ] T041 [US2] Verify all US2 tests pass

### Edge Cases for User Story 2

- [ ] T042 [US2] Handle rapid arrow key presses without visual glitches
- [ ] T043 [US2] Test jumping arrow animation performance (60fps)
- [ ] T044 [US2] Verify animation consistency across all screens

**Checkpoint**: User Story 2 complete - Jumping arrow works consistently across Home and Play screens

---

## Phase 5: User Story 3 - Enhanced Play Screen Input Handling (Priority: P2)

**Goal**: Typing any digit auto-focuses input field and enters the digit. Backspace works naturally. Up/down arrows move focus between input field and buttons. Keyboard hints show available keys at bottom of screen.

**Independent Test**: Play a game without touching mouse - type digits, use backspace, navigate with arrows, submit with Enter. Verify keyboard hints display correctly.

### Tests for User Story 3 (TDD - MUST WRITE FIRST)

- [ ] T045 [P] [US3] Write auto-focus input tests in src/pages/PlayPage.test.tsx (extend existing tests)
- [ ] T046 [P] [US3] Write arrow navigation input↔button tests in src/pages/PlayPage.test.tsx
- [ ] T047 [P] [US3] Write backspace handling tests in src/pages/PlayPage.test.tsx
- [ ] T048 [P] [US3] Write keyboard hints display tests for PlayPage in src/pages/PlayPage.test.tsx

### Implementation for User Story 3

- [ ] T049 [US3] Add global digit key listener to PlayPage in src/pages/PlayPage.tsx
- [ ] T050 [US3] Implement auto-focus input field on digit typed in src/pages/PlayPage.tsx
- [ ] T051 [US3] Add arrow key navigation between input and buttons in src/pages/PlayPage.tsx
- [ ] T052 [US3] Ensure Backspace only affects input field in src/pages/PlayPage.tsx
- [ ] T053 [US3] Filter non-numeric keys (ignore letters) in src/pages/PlayPage.tsx
- [ ] T054 [US3] Add KeyboardHints to PlayPage in src/pages/PlayPage.tsx
- [ ] T055 [US3] Verify all US3 tests pass

### Error Handling & Edge Cases for User Story 3

- [ ] T056 [US3] Handle empty input field + backspace (no error)
- [ ] T057 [US3] Prevent keyboard conflicts with pause menu
- [ ] T058 [US3] Test focus state synchronization

**Checkpoint**: User Story 3 complete - Full keyboard-only gameplay with hints

---

## Phase 6: User Story 4 - Keyboard Hints on All Screens (Priority: P3)

**Goal**: Every screen displays context-appropriate keyboard hints at bottom. Player selection, home, play, pause menu, and results screens all show relevant key bindings in retro styling.

**Independent Test**: Navigate through all 5 screens and verify each displays correct keyboard hints in consistent position with retro styling.

### Tests for User Story 4 (TDD - MUST WRITE FIRST)

- [ ] T059 [P] [US4] Write keyboard hints tests for PlayerSelectPage in src/pages/PlayerSelectPage.test.tsx
- [ ] T060 [P] [US4] Write keyboard hints tests for HomePage in src/pages/HomePage.test.tsx
- [ ] T061 [P] [US4] Write keyboard hints tests for GameResultsPage in src/pages/GameResultsPage.test.tsx
- [ ] T062 [P] [US4] Write keyboard hints tests for PauseMenu in src/components/PauseMenu.test.tsx

### Implementation for User Story 4

- [ ] T063 [P] [US4] Add KeyboardHints to PlayerSelectPage in src/pages/PlayerSelectPage.tsx
- [ ] T064 [P] [US4] Add KeyboardHints to HomePage in src/pages/HomePage.tsx
- [ ] T065 [P] [US4] Add KeyboardHints to GameResultsPage in src/pages/GameResultsPage.tsx
- [ ] T066 [P] [US4] Add KeyboardHints to PauseMenu in src/components/PauseMenu.tsx
- [ ] T067 [US4] Ensure hints appear outside main game container on all screens
- [ ] T068 [US4] Verify hints use consistent retro styling across all screens
- [ ] T069 [US4] Verify all US4 tests pass

### Visual Polish for User Story 4

- [ ] T070 [US4] Verify hints readable at minimum screen size (320px)
- [ ] T071 [US4] Ensure hints don't interfere with game content
- [ ] T072 [US4] Test hints visibility on all supported screens

**Checkpoint**: User Story 4 complete - All screens have keyboard hints

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, final testing, and quality assurance

### Documentation Updates (Constitutional Requirement)

- [ ] T073 [P] Update CLAUDE.md with jumping arrow pattern documentation
- [ ] T074 [P] Update CLAUDE.md with pause menu pattern documentation
- [ ] T075 [P] Update CLAUDE.md with keyboard hints usage guidelines
- [ ] T076 [P] Update CLAUDE.md with focus management patterns
- [ ] T077 [P] Add JSDoc to all new components and hooks
- [ ] T078 Regenerate API documentation with npm run docs

### Constitution & Architecture Updates

- [ ] T079 [P] Review constitution compliance for keyboard-first principle
- [ ] T080 [P] Update ARCHITECTURE.md with new component patterns (if needed)

### Final Quality Gates (Constitutional Requirement)

- [ ] T081 Run npm run type-check (MUST pass - zero TypeScript errors)
- [ ] T082 Run npm run lint:fix (MUST pass - fix all lint issues)
- [ ] T083 Run npm run test:run (MUST pass - all tests including new ones)
- [ ] T084 Run npm run build (MUST pass - production build succeeds)
- [ ] T085 Run npm run test:coverage (verify >80% coverage)

### Final Integration Testing

- [ ] T086 Manual test: Complete game session using only keyboard
- [ ] T087 Manual test: Verify 60fps animation performance
- [ ] T088 Manual test: Verify <100ms keyboard response times
- [ ] T089 Manual test: Verify <200ms pause menu render time
- [ ] T090 Manual test: Verify mouse alternatives work for all keyboard actions
- [ ] T091 Manual test: Test on mobile/touch devices (secondary support)

### Performance Validation

- [ ] T092 Run bundle size check (ensure no significant regression)
- [ ] T093 Test animation frame rate with Chrome DevTools Performance tab
- [ ] T094 Verify keyboard event cleanup (no memory leaks)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (US1 → US2 → US3 → US4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational (T004-T014) - No dependencies on other stories
  - Uses: JumpingArrow component (T004-T007)
  - Uses: useFocusManagement hook (T012-T014)

- **User Story 2 (P2)**: Depends on Foundational (T004-T014) - Independent of US1
  - Uses: JumpingArrow component (T004-T007)
  - Uses: useFocusManagement hook (T012-T014)
  - Can be implemented in parallel with US1

- **User Story 3 (P2)**: Depends on Foundational (T008-T014) - Extends US2 on PlayPage
  - Uses: KeyboardHints component (T008-T011)
  - Uses: useFocusManagement hook (T012-T014)
  - Recommended after US2 for PlayPage (avoids merge conflicts)

- **User Story 4 (P3)**: Depends on Foundational (T008-T011) - Independent of all stories
  - Uses: KeyboardHints component (T008-T011)
  - Can be implemented in parallel with US1, US2, US3

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD requirement)
- Component tests before component implementation
- Hook tests before hook implementation
- Integration tests can be written alongside or after unit tests
- All tests must pass before moving to next story

### Parallel Opportunities

**Setup Phase**: All 3 tasks (T001-T003) can run in parallel

**Foundational Phase**:
- JumpingArrow component tasks (T004-T007) can run in parallel with KeyboardHints (T008-T011)
- useFocusManagement hook (T012-T014) can run in parallel with components

**User Story 1**: All test tasks (T015-T018) can be written in parallel

**User Story 2**: Both test tasks (T032-T033) can be written in parallel

**User Story 3**: All 4 test tasks (T045-T048) can be written in parallel

**User Story 4**: All 4 test tasks (T059-T062) can be written in parallel, and all 4 implementation tasks (T063-T066) can be implemented in parallel (different files)

**Polish Phase**: Most documentation tasks (T073-T080) can run in parallel

---

## Parallel Example: User Story 1

```bash
# Write all tests for User Story 1 together (TDD):
Task T015: "Write timer pause/resume tests in src/hooks/useTimer.test.ts"
Task T016: "Write usePauseMenu hook tests in src/hooks/usePauseMenu.test.ts"
Task T017: "Write PauseMenu component tests in src/components/PauseMenu.test.tsx"
Task T018: "Write PlayPage pause integration tests in src/pages/PlayPage.test.tsx"

# After tests fail, implement in sequence:
Task T019: "Extend useTimer hook" (foundation for pause menu)
Task T020: "Implement usePauseMenu hook" (depends on T019)
Task T021-T022: "Create PauseMenu component + styles" (depends on T020)
Task T023-T027: "Integrate into PlayPage" (depends on T021-T022)
```

---

## Parallel Example: User Story 4

```bash
# All keyboard hints additions can run in parallel (different files):
Task T063: "Add KeyboardHints to PlayerSelectPage"
Task T064: "Add KeyboardHints to HomePage"
Task T065: "Add KeyboardHints to GameResultsPage"
Task T066: "Add KeyboardHints to PauseMenu"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T014) - CRITICAL
3. Complete Phase 3: User Story 1 (T015-T031)
4. **STOP and VALIDATE**: Test pause menu independently
5. Run quality gates (T081-T084)
6. Deploy/demo if ready

**MVP Deliverable**: Players can pause gameplay with ESC key, navigate pause menu with keyboard, and resume or quit.

### Incremental Delivery

1. **Foundation** (Setup + Foundational) → JumpingArrow, KeyboardHints, useFocusManagement ready
2. **+ User Story 1** → Test independently → Deploy/Demo (Pause Menu MVP!)
3. **+ User Story 2** → Test independently → Deploy/Demo (Unified Navigation)
4. **+ User Story 3** → Test independently → Deploy/Demo (Enhanced Input)
5. **+ User Story 4** → Test independently → Deploy/Demo (Keyboard Hints)
6. **+ Polish** → Final quality gates → Production ready

Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. **Team completes Setup + Foundational together** (T001-T014)
2. **Once Foundational is done**:
   - Developer A: User Story 1 (T015-T031) - Pause menu
   - Developer B: User Story 2 (T032-T044) - Jumping arrows
   - Developer C: User Story 4 (T059-T072) - Keyboard hints
3. **User Story 3** (T045-T058) - Assigned after US2 complete (same file conflicts)
4. Stories complete and integrate independently

---

## File Change Summary

### New Files (18 total)

**Components** (9 files):
- src/components/JumpingArrow.tsx
- src/components/JumpingArrow.module.scss
- src/components/JumpingArrow.test.tsx
- src/components/KeyboardHints.tsx
- src/components/KeyboardHints.module.scss
- src/components/KeyboardHints.test.tsx
- src/components/PauseMenu.tsx
- src/components/PauseMenu.module.scss
- src/components/PauseMenu.test.tsx

**Hooks** (6 files):
- src/hooks/usePauseMenu.ts
- src/hooks/usePauseMenu.test.ts
- src/hooks/useKeyboardHints.ts (optional - may be inline)
- src/hooks/useKeyboardHints.test.ts (if separate hook)
- src/hooks/useFocusManagement.ts
- src/hooks/useFocusManagement.test.ts

**Types** (1 file):
- src/types/keyboard.ts

**Styles** (2 files):
- src/styles/_animations.scss (MODIFIED - add zoom/splash)
- src/styles/_mixins.scss (MODIFIED - add modal mixin)

### Modified Files (9 total)

**Hooks**:
- src/hooks/useTimer.ts (add pause/resume)
- src/hooks/useTimer.test.ts (extend tests)

**Pages** (6 files):
- src/pages/HomePage.tsx (jumping arrow on Start button, keyboard hints)
- src/pages/HomePage.module.scss (jumping arrow styles)
- src/pages/HomePage.test.tsx (jumping arrow tests)
- src/pages/PlayPage.tsx (pause menu, jumping arrows, auto-focus, keyboard hints)
- src/pages/PlayPage.module.scss (button focus states, pause menu integration)
- src/pages/PlayPage.test.tsx (pause, focus, input, hints tests)
- src/pages/GameResultsPage.tsx (keyboard hints)
- src/pages/PlayerSelectPage.tsx (keyboard hints)

**Documentation** (2 files):
- CLAUDE.md (pattern documentation)
- ARCHITECTURE.md (optional - if new patterns added)

### Total Impact

- **New**: 18 files
- **Modified**: 11 files
- **Total**: 29 files
- **Test Coverage**: 12 test files (TDD compliant)

---

## Notes

- [P] tasks = different files, no dependencies within same phase
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **TDD Required**: Verify tests FAIL before implementing (constitutional requirement)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All 4 quality gates (type-check, lint, test, build) MUST pass before completion
- Performance targets: 60fps animations, <100ms keyboard response, <200ms modal render
