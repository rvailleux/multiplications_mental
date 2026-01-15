# Tasks: Player Name Display on All Screens

**Input**: Design documents from `/specs/010-player-name-display/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: This feature follows Test-Driven Development (TDD) as mandated by project constitution Principle I. All test tasks are REQUIRED before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, tests co-located with components
- Paths assume React SPA structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Environment preparation and verification

**Tasks**:

- [X] T001 Verify feature branch 010-player-name-display is checked out
- [X] T002 [P] Verify development server can start with `npm run dev`
- [X] T003 [P] Verify test runner works with `npm run test`
- [X] T004 [P] Review existing HomePage.tsx styling patterns in src/pages/HomePage.tsx (lines 151-284)
- [X] T005 [P] Review existing PlayPage.tsx structure in src/pages/PlayPage.tsx

**Checkpoint**: Development environment ready, existing patterns understood

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Verify existing utilities and types are available

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

**Tasks**:

- [X] T006 Verify getCurrentPlayer() utility exists in src/types/player.ts
- [X] T007 Verify Player type definition exists in src/types/player.ts
- [X] T008 Confirm parent containers have position: 'relative' in HomePage.tsx (line 163) and PlayPage.tsx

**Checkpoint**: All required utilities and types are available - user story implementation can now begin

---

## Phase 3: User Story 1 - Player Identity Awareness (Priority: P1) 🎯 MVP

**Goal**: Display current player's name in top right corner of HomePage and PlayPage so players always know which account they're using

**Independent Test**: Log in as player "Jules", navigate to HomePage and PlayPage - player name "Jules" should be visible in top right corner of both screens

### Tests for User Story 1 (TDD - Write FIRST, ensure FAIL)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T009 [P] [US1] Write test: "should render player name when player exists" in src/components/PlayerNameDisplay.test.tsx
- [X] T010 [P] [US1] Write test: "should render nothing when player is null" in src/components/PlayerNameDisplay.test.tsx
- [X] T011 [P] [US1] Write test: "should render player name with different player" in src/components/PlayerNameDisplay.test.tsx
- [X] T012 [P] [US1] Write test: "should have correct styling structure" in src/components/PlayerNameDisplay.test.tsx
- [X] T013 [P] [US1] Write integration test: "should display current player name" in src/pages/HomePage.test.tsx
- [X] T014 [P] [US1] Write integration test: "should display current player name during gameplay" in src/pages/PlayPage.test.tsx
- [X] T015 [US1] Run tests with `npm run test:run` - verify all 6 new tests FAIL (component doesn't exist yet)

**TDD Checkpoint**: All tests written and failing - ready for implementation

### Implementation for User Story 1

- [X] T016 [US1] Create PlayerNameDisplay component in src/components/PlayerNameDisplay.tsx with PlayerNameDisplayProps interface
- [X] T017 [US1] Implement null check logic in PlayerNameDisplay (return null if no player)
- [X] T018 [US1] Add basic retro styling (absolute positioning, teal gradient, 4px border, white text with shadow) to PlayerNameDisplay
- [X] T019 [US1] Import PlayerNameDisplay in src/pages/HomePage.tsx
- [X] T020 [US1] Add `<PlayerNameDisplay player={currentPlayer} />` to HomePage.tsx JSX (after opening gameContainer div)
- [X] T021 [US1] Import PlayerNameDisplay in src/pages/PlayPage.tsx
- [X] T022 [US1] Add `<PlayerNameDisplay player={currentPlayer} />` to PlayPage.tsx JSX (after opening gameContainer div)
- [X] T023 [US1] Run tests with `npm run test:run` - verify all 6 new tests PASS

**TDD Checkpoint**: Tests pass - core functionality working

### Quality Assurance for User Story 1

- [X] T024 [US1] Run TypeScript type check with `npm run type-check` - verify no errors
- [X] T025 [US1] Run linting with `npm run lint:fix` - verify no issues
- [X] T026 [US1] Run full test suite with `npm run test:run` - verify all tests pass (72 existing + 6 new = 78 total)
- [X] T027 [US1] Run production build with `npm run build` - verify build succeeds

**Quality Checkpoint**: All constitution quality gates pass

### Manual Testing for User Story 1

- [X] T028 [US1] Start dev server, navigate to HomePage - verify player name "Jules" appears in top right corner
- [X] T029 [US1] Navigate to PlayPage - verify player name "Jules" appears in top right corner
- [X] T030 [US1] Verify player name doesn't overlap with clouds, header, or timer
- [X] T031 [US1] Switch to player "Achille" in browser console - verify name updates to "Achille"

**User Story 1 Complete**: ✅ Core functionality delivered and tested independently

---

## Phase 4: User Story 2 - Visual Consistency with Retro Aesthetic (Priority: P2)

**Goal**: Ensure player name display matches existing pixel art style (8-bit font, retro colors) for cohesive, immersive experience

**Independent Test**: View player name on HomePage and PlayPage - styling should match existing UI elements (pixel borders, retro colors, text shadows)

### Tests for User Story 2 (TDD - Write FIRST, ensure FAIL)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T032 [P] [US2] Write test: "should match retro styling with pixel border and gradient" in src/components/PlayerNameDisplay.test.tsx
- [X] T033 [P] [US2] Write test: "should have text shadow for depth effect" in src/components/PlayerNameDisplay.test.tsx
- [X] T034 [US2] Run tests with `npm run test:run` - verify 2 new styling tests FAIL

**TDD Checkpoint**: Styling tests written and failing

### Implementation for User Story 2

- [X] T035 [US2] Verify teal gradient background matches existing button gradient (#4ecdc4 to #44b3aa) in PlayerNameDisplay.tsx
- [X] T036 [US2] Verify 4px solid black border for pixel-perfect aesthetic in PlayerNameDisplay.tsx
- [X] T037 [US2] Verify white text (#fff) with 2px black text shadow (2px 2px 0 #000) in PlayerNameDisplay.tsx
- [X] T038 [US2] Verify inset box shadow for 3D effect (inset 0 2px 0 rgba(255,255,255,0.3)) in PlayerNameDisplay.tsx
- [X] T039 [US2] Set font size to 14px with bold weight in PlayerNameDisplay.tsx
- [X] T040 [US2] Set padding to 8px vertical, 16px horizontal in PlayerNameDisplay.tsx
- [X] T041 [US2] Run tests with `npm run test:run` - verify styling tests PASS

**TDD Checkpoint**: Styling tests pass

### Manual Testing for User Story 2

- [X] T042 [US2] Compare player name styling to existing button styling on HomePage - verify gradient matches
- [X] T043 [US2] Compare player name border to existing card borders - verify 4px consistency
- [X] T044 [US2] Compare player name text shadow to existing title text - verify shadow style matches
- [X] T045 [US2] Take screenshot of player name on HomePage - verify pixel-perfect retro aesthetic

**User Story 2 Complete**: ✅ Visual consistency achieved and tested independently

---

## Phase 5: User Story 3 - Responsive Positioning (Priority: P3)

**Goal**: Ensure player name remains visible and properly positioned in top right corner across different screen sizes (320px-1920px viewports)

**Independent Test**: Resize browser window from 320px to 1920px width - player name should remain in top right corner without overlapping or layout issues

### Tests for User Story 3 (TDD - Write FIRST, ensure FAIL)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T046 [P] [US3] Write test: "should handle long player names with ellipsis truncation" in src/components/PlayerNameDisplay.test.tsx
- [X] T047 [P] [US3] Write test: "should handle special characters and emojis" in src/components/PlayerNameDisplay.test.tsx
- [X] T048 [US3] Run tests with `npm run test:run` - verify 2 new edge case tests FAIL (if truncation not implemented)

**TDD Checkpoint**: Edge case tests written

### Implementation for User Story 3

- [X] T049 [US3] Add maxWidth: '200px' to playerNameText style in PlayerNameDisplay.tsx
- [X] T050 [US3] Add overflow: 'hidden' to playerNameText style in PlayerNameDisplay.tsx
- [X] T051 [US3] Add textOverflow: 'ellipsis' to playerNameText style in PlayerNameDisplay.tsx
- [X] T052 [US3] Add whiteSpace: 'nowrap' to playerNameText style in PlayerNameDisplay.tsx
- [X] T053 [US3] Verify zIndex: 100 is set in playerNameContainer to ensure visibility above decorative elements
- [X] T054 [US3] Run tests with `npm run test:run` - verify edge case tests PASS

**TDD Checkpoint**: Edge case tests pass

### Manual Testing for User Story 3

- [X] T055 [US3] Resize browser to 320px width - verify player name visible in top right, no overflow
- [X] T056 [US3] Resize browser to 768px width (tablet) - verify player name positioned correctly
- [X] T057 [US3] Resize browser to 1920px width (desktop) - verify player name positioned correctly
- [X] T058 [US3] Create test player with long name "VeryLongPlayerNameThatExceedsMaxWidth" - verify truncation with ellipsis
- [X] T059 [US3] Create test player with emoji "Player 🎮" - verify emoji renders correctly

**User Story 3 Complete**: ✅ Responsive positioning and edge cases handled

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final documentation, cleanup, and validation

### Documentation

- [X] T060 [P] Regenerate TypeDoc API documentation with `npm run docs`
- [ ] T061 [P] Verify PlayerNameDisplay and PlayerNameDisplayProps appear in docs/
- [ ] T062 Review ARCHITECTURE.md - confirm no updates needed (follows existing patterns)

### Final Validation

- [ ] T063 Run complete quality check with `npm run quality-check` (type-check, lint, test, build)
- [ ] T064 Verify test coverage with `npm run test:coverage` - ensure adequate coverage (>80%)
- [ ] T065 Run quickstart.md validation - verify all steps work as documented
- [ ] T066 [P] Clean build artifacts with `npm run build` and verify bundle size impact (<2KB)

### Commit Preparation

- [ ] T067 Review changes with `git status` - verify only intended files modified
- [ ] T068 Stage all changes with `git add src/components/PlayerNameDisplay.* src/pages/HomePage.* src/pages/PlayPage.*`
- [ ] T069 Commit with descriptive message following project conventions (include feature number, changelog, co-author)

**Polish Phase Complete**: ✅ Feature ready for code review and merge

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories CAN proceed in parallel (if staffed) since they modify the same component incrementally
  - OR sequentially in priority order: US1 → US2 → US3 (recommended for single developer)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after US1 OR in parallel - Enhances US1 styling, independently testable
- **User Story 3 (P3)**: Can start after US1 OR in parallel - Adds responsive behavior, independently testable

**Note**: While user stories CAN be done in parallel, they all modify PlayerNameDisplay.tsx, so sequential execution (P1→P2→P3) is recommended to avoid merge conflicts.

### Within Each User Story

**TDD Workflow** (Constitution Principle I):
1. Tests FIRST - write all tests, verify they FAIL
2. Implementation - write code to make tests PASS
3. Quality checks - type-check, lint, test, build
4. Manual testing - verify in browser
5. Story complete - checkpoint before next story

### Parallel Opportunities

**Within Phase 3 (User Story 1)**:
- T009-T014: All 6 test tasks can be written in parallel (different test cases)
- T013-T014: HomePage and PlayPage integration tests can be written in parallel

**Within Phase 4 (User Story 2)**:
- T032-T033: Both styling tests can be written in parallel
- T035-T040: All styling verification tasks are read-only, can be done in parallel

**Within Phase 5 (User Story 3)**:
- T046-T047: Both edge case tests can be written in parallel
- T049-T053: All CSS truncation properties can be added in parallel (same styles object)

**Within Phase 6 (Polish)**:
- T060-T062: Documentation tasks can run in parallel
- T066: Bundle size check can run in parallel with other validation tasks

---

## Parallel Example: User Story 1 TDD

```bash
# Launch all test writing tasks for User Story 1 together:
Task: "Write test: should render player name when player exists in src/components/PlayerNameDisplay.test.tsx"
Task: "Write test: should render nothing when player is null in src/components/PlayerNameDisplay.test.tsx"
Task: "Write test: should render player name with different player in src/components/PlayerNameDisplay.test.tsx"
Task: "Write test: should have correct styling structure in src/components/PlayerNameDisplay.test.tsx"
Task: "Write integration test: should display current player name in src/pages/HomePage.test.tsx"
Task: "Write integration test: should display current player name during gameplay in src/pages/PlayPage.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

**Recommended for fastest value delivery**:

1. Complete Phase 1: Setup (5 tasks, ~5 minutes)
2. Complete Phase 2: Foundational (3 tasks, ~5 minutes)
3. Complete Phase 3: User Story 1 (23 tasks, ~1.5 hours)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Commit and deploy/demo if ready

**Result**: Core player name display working on both pages (~2 hours total)

### Incremental Delivery

**Recommended for iterative improvement**:

1. Complete Setup + Foundational → Foundation ready (~10 minutes)
2. Add User Story 1 → Test independently → Commit (MVP!) (~1.5 hours)
3. Add User Story 2 → Test independently → Commit (Visual polish) (~45 minutes)
4. Add User Story 3 → Test independently → Commit (Responsive) (~45 minutes)
5. Polish phase → Final commit and PR (~30 minutes)

**Total Time**: ~3.5 hours for complete feature with all user stories

### Sequential Strategy (Recommended for Single Developer)

**Why sequential**: All user stories modify the same file (PlayerNameDisplay.tsx), so sequential execution avoids merge conflicts:

1. Team completes Setup + Foundational together (~10 minutes)
2. Implement User Story 1 completely → Checkpoint (~1.5 hours)
3. Implement User Story 2 completely → Checkpoint (~45 minutes)
4. Implement User Story 3 completely → Checkpoint (~45 minutes)
5. Polish phase → Final validation (~30 minutes)

**Result**: Clean, incremental progress with no merge conflicts

---

## Task Summary

**Total Tasks**: 69 tasks across 6 phases

**Task Count by Phase**:
- Phase 1 (Setup): 5 tasks
- Phase 2 (Foundational): 3 tasks
- Phase 3 (User Story 1): 23 tasks (6 tests + 7 implementation + 4 QA + 4 manual + 2 checkpoints)
- Phase 4 (User Story 2): 14 tasks (3 tests + 7 implementation + 4 manual + checkpoints)
- Phase 5 (User Story 3): 14 tasks (3 tests + 6 implementation + 5 manual + checkpoints)
- Phase 6 (Polish): 10 tasks (3 docs + 4 validation + 3 commit)

**Task Count by User Story**:
- User Story 1 (Player Identity Awareness): 23 tasks
- User Story 2 (Visual Consistency): 14 tasks
- User Story 3 (Responsive Positioning): 14 tasks

**Parallel Opportunities**: 24 tasks marked [P] can be executed in parallel within their phases

**Independent Test Criteria**:
- **US1**: Player name "Jules" visible in top right corner on HomePage and PlayPage
- **US2**: Player name styling matches existing retro pixel art aesthetic (teal gradient, 4px border, text shadow)
- **US3**: Player name visible and truncates correctly on viewports 320px-1920px, handles long names and emojis

**Suggested MVP Scope**: User Story 1 only (23 tasks, ~1.5 hours) - delivers core functionality

**Format Validation**: ✅ All 69 tasks follow checklist format with:
- Checkbox `- [ ]`
- Task ID (T001-T069)
- [P] marker where applicable (24 tasks)
- [Story] label for user story tasks (51 tasks: 23 US1, 14 US2, 14 US3)
- Clear description with file paths

---

## Notes

- **[P] tasks** = different files or independent operations, can run in parallel
- **[Story] label** maps task to specific user story for traceability and independent testing
- **TDD workflow**: Write tests FIRST (verify FAIL) → Implement → Run tests (verify PASS) → Manual testing
- **Constitution compliance**: All quality gates enforced (type-check, lint, test, build)
- **Incremental commits**: Commit after each user story completion for clean git history
- **Stop at any checkpoint**: Each user story is independently functional and testable
- **Avoid**: Implementing before tests pass, skipping quality checks, modifying files without reading first
