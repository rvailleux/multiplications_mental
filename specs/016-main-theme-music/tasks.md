# Tasks: Main Theme Music

**Input**: Design documents from `/specs/016-main-theme-music/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Unit/Integration tests follow TDD (Constitution Principle I). E2E tests MANDATORY (Constitution Principle VIII).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths follow project structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create new directories and type definitions needed for the feature

- [X] T001 Create contexts directory at src/contexts/
- [X] T002 [P] Create type definitions for MusicMode, MusicState, MusicContextValue in src/types/music.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core MusicContext infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Unit Tests for MusicContext (TDD - Write First, Fail First)

- [X] T003 [P] Create MusicContext unit tests for provider setup and hook access in src/contexts/MusicContext.test.tsx
  - Test MusicProvider renders children
  - Test useMusic throws error outside provider
  - Test initial state values (isPlaying: false, currentTrack: null, mode: 'menu')

### Implementation

- [X] T004 Implement MusicContext provider with useRef for audio instance in src/contexts/MusicContext.tsx
  - Define MAIN_THEME constant
  - Define GAMEPLAY_TRACKS array (excludes main theme)
  - Define MUSIC_VOLUME constant (0.3)
  - Create context with null default
  - Implement MusicProvider component with audioRef and state
  - Export useMusic hook with provider validation

- [X] T005 Integrate MusicProvider into App.tsx - wrap Router with MusicProvider

### Validation

- [X] T006 Run unit tests to verify MusicContext foundation works: `npm run test -- MusicContext`

**Checkpoint**: MusicContext foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Main Theme on Non-Game Screens (Priority: P1) 🎯 MVP

**Goal**: Play the main theme song continuously on all menu screens (Player Select, Home, Game Results) with consistent retro gaming atmosphere

**Independent Test**: Navigate through Player Select → Home → Game Results and verify main theme plays on each screen

### E2E Tests for User Story 1 (MANDATORY - Constitution Principle VIII) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T007 [US1] **E2E test: Main theme plays on Player Select screen** in tests/e2e/main-theme-music.spec.ts
  - Map to E2E-US1-001 from spec.md
  - Navigate to application root URL
  - Trigger user interaction (keyboard/click) for autoplay policy
  - Verify no audio-related errors in console
  - Capture screenshot: player-select-loaded.png

- [X] T008 [US1] **E2E test: Main theme continues to Home screen** in tests/e2e/main-theme-music.spec.ts
  - Map to E2E-US1-002 from spec.md
  - Complete player selection with Enter key
  - Verify navigation to /home
  - Wait 5 seconds to confirm music doesn't restart
  - Verify no errors during transition
  - Capture screenshot: home-screen.png

### Unit Tests for User Story 1 (TDD)

- [X] T009 [P] [US1] Unit test for playMainTheme function in src/contexts/MusicContext.test.tsx
  - Test sets mode to 'menu'
  - Test sets isPlaying to true on success
  - Test handles autoplay blocked gracefully (no throw)
  - Test sets currentTrack to MAIN_THEME path

- [X] T010 [P] [US1] Unit test for autoplay fallback in src/contexts/MusicContext.test.tsx
  - Test autoplayBlocked state is set on NotAllowedError
  - Test user interaction listener is added when blocked
  - Test music plays after user interaction

### Implementation for User Story 1

- [X] T011 [US1] Implement playMainTheme function in src/contexts/MusicContext.tsx
  - Load /audio/the-return-of-the-8-bit-era-301292.mp3
  - Set volume to 0.3, loop to true
  - Handle autoplay restrictions with try-catch
  - Set autoplayBlocked state and add interaction listeners on failure

- [X] T012 [US1] Modify PlayerSelectPage.tsx to call playMainTheme on mount
  - Import useMusic hook
  - Add useEffect to call playMainTheme() on mount
  - Handle autoplay user interaction fallback

- [X] T013 [US1] Modify GameResultsPage.tsx to resume main theme
  - Import useMusic hook
  - Add useEffect to call playMainTheme() on mount

- [X] T014 [US1] Verify HomePage continues main theme (no changes needed - music persists from context)
  - Confirm no conflicting audio operations in HomePage.tsx

### E2E Validation for User Story 1 (MANDATORY)

- [X] T015 [US1] **Verify E2E tests pass** - Run `npx playwright test tests/e2e/main-theme-music.spec.ts --grep "US1"`
- [X] T016 [US1] **Review E2E screenshots** - Validate visual state at player-select and home screens
- [X] T017 [US1] **Manual E2E verification** - Test keyboard + mouse paths in real browser

**Checkpoint**: User Story 1 complete - Main theme plays on all menu screens

---

## Phase 4: User Story 2 - Gameplay Music Without Main Theme (Priority: P2)

**Goal**: Play random gameplay music (excluding main theme) during gameplay, switch back to main theme when game ends

**Independent Test**: Start a game and verify a random song plays (never the main theme); end game and verify main theme resumes

### E2E Tests for User Story 2 (MANDATORY - Constitution Principle VIII) ⚠️

- [X] T018 [US2] **E2E test: Gameplay music is different from main theme** in tests/e2e/main-theme-music.spec.ts
  - Map to E2E-US2-001 from spec.md
  - Navigate through Player Select to Home
  - Start game with Enter or click
  - Verify audio transition (no errors)
  - Capture screenshot: gameplay-started.png

- [X] T019 [US2] **E2E test: Main theme resumes after gameplay** in tests/e2e/main-theme-music.spec.ts
  - Map to E2E-US2-002 from spec.md
  - Complete a game (wait for timer)
  - Verify Game Results screen loads
  - Verify no audio errors during transition
  - Capture screenshot: game-results.png

### Unit Tests for User Story 2 (TDD)

- [X] T020 [P] [US2] Unit test for playGameplayMusic function in src/contexts/MusicContext.test.tsx
  - Test sets mode to 'gameplay'
  - Test selects track from GAMEPLAY_TRACKS (not MAIN_THEME)
  - Test sets isPlaying to true
  - Test stops current audio before playing new track

- [X] T021 [P] [US2] Unit test for stopMusic function in src/contexts/MusicContext.test.tsx
  - Test pauses audio
  - Test resets playback position to 0
  - Test sets isPlaying to false
  - Test sets currentTrack to null
  - Test preserves mode

- [X] T022 [P] [US2] Unit test for track selection never includes main theme in src/contexts/MusicContext.test.tsx
  - Test GAMEPLAY_TRACKS array excludes MAIN_THEME
  - Test random selection 100 times never returns MAIN_THEME

### Implementation for User Story 2

- [X] T023 [US2] Implement playGameplayMusic function in src/contexts/MusicContext.tsx
  - Stop any current audio
  - Select random track from GAMEPLAY_TRACKS
  - Play selected track with volume 0.3, loop true
  - Set mode to 'gameplay', update isPlaying and currentTrack

- [X] T024 [US2] Implement stopMusic function in src/contexts/MusicContext.tsx
  - Pause audio if playing
  - Reset audio currentTime to 0
  - Set isPlaying to false, currentTrack to null
  - Preserve mode for potential resume

- [X] T025 [US2] Modify PlayPage.tsx to use gameplay music
  - Import useMusic hook
  - Add useEffect to call playGameplayMusic() on mount
  - Return cleanup function to transition back (stopMusic or let Results handle)

- [X] T026 [US2] Remove old useBackgroundMusic usage from PlayPage.tsx
  - Remove import of useBackgroundMusic hook
  - Remove any direct audio manipulation
  - Ensure only MusicContext controls audio

### E2E Validation for User Story 2 (MANDATORY)

- [X] T027 [US2] **Verify E2E tests pass** - Run `npx playwright test tests/e2e/main-theme-music.spec.ts --grep "US2"`
- [X] T028 [US2] **Review E2E screenshots** - Validate gameplay and results screen states
- [X] T029 [US2] **Manual E2E verification** - Complete full game cycle, verify music transitions

**Checkpoint**: User Story 2 complete - Gameplay uses random music (never main theme), main theme resumes after

---

## Phase 5: User Story 3 - Music Continuity Across Navigation (Priority: P3)

**Goal**: Music transitions smoothly between screens without jarring restarts during menu navigation

**Independent Test**: Navigate between menu screens rapidly and verify music doesn't restart from beginning

### E2E Tests for User Story 3 (MANDATORY - Constitution Principle VIII) ⚠️

- [X] T030 [US3] **E2E test: Music continuity during menu navigation** in tests/e2e/main-theme-music.spec.ts
  - Map to E2E-US3-001 from spec.md
  - Navigate to Player Select screen
  - Wait 10 seconds for music to progress
  - Select player and navigate to Home
  - Verify no audio errors (music didn't restart)
  - Capture screenshot: navigation-complete.png

### Unit Tests for User Story 3 (TDD)

- [X] T031 [P] [US3] Unit test for music continuity in src/contexts/MusicContext.test.tsx
  - Test playMainTheme is no-op if already playing main theme
  - Test mode transition menu→menu doesn't restart audio
  - Test audio instance persists across multiple playMainTheme calls

### Implementation for User Story 3

- [X] T032 [US3] Add early return check in playMainTheme for already-playing state in src/contexts/MusicContext.tsx
  - Check if currentTrack === MAIN_THEME && isPlaying
  - Return early if already playing (no restart)
  - Log debug message for skipped play

- [X] T033 [US3] Ensure audio instance is not recreated on route changes
  - Verify useRef holds single audio instance
  - Confirm MusicProvider placement outside Router in App.tsx

### E2E Validation for User Story 3 (MANDATORY)

- [X] T034 [US3] **Verify E2E tests pass** - Run `npx playwright test tests/e2e/main-theme-music.spec.ts --grep "US3"`
- [X] T035 [US3] **Review E2E screenshots** - Check navigation flow completes
- [X] T036 [US3] **Manual E2E verification** - Rapidly navigate menu screens, verify seamless music

**Checkpoint**: User Story 3 complete - Music flows seamlessly across all menu navigation

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories, documentation, cleanup

- [X] T037 [P] Add JSDoc documentation to all public functions in src/contexts/MusicContext.tsx
- [X] T038 [P] Add JSDoc documentation to type definitions in src/types/music.ts
- [X] T039 Run `npm run docs` to generate API documentation
- [X] T040 [P] Review and deprecate/remove old useBackgroundMusic hook if no longer needed (src/hooks/useBackgroundMusic.ts)
- [X] T041 Run all quality checks: `npm run type-check && npm run lint:fix && npm run test:run && npm run build`
- [X] T042 **E2E regression suite** - Run all E2E tests (`npx playwright test tests/e2e/main-theme-music.spec.ts`)
- [X] T043 **E2E visual review** - Check all screenshots for consistency
- [X] T044 Run quickstart.md validation - Follow manual verification steps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User Story 1 (P1): MVP - Can proceed independently
  - User Story 2 (P2): Builds on US1 context but independently testable
  - User Story 3 (P3): Refinement of US1 behavior but independently testable
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Uses same MusicContext, independently testable
- **User Story 3 (P3)**: Can start after US1 - Refines playMainTheme behavior from US1

### Within Each User Story

- E2E tests MUST be written FIRST to define expected behavior
- Unit tests MUST be written and FAIL before implementation (TDD)
- Implementation follows tests
- Validation confirms tests pass
- Story complete before moving to next priority

### Parallel Opportunities

- T002 (types) can run parallel with T001 (directory creation)
- T003 (context tests) in Phase 2
- T009, T010 (US1 unit tests) can run in parallel
- T020, T021, T022 (US2 unit tests) can run in parallel
- Different user stories can be worked on in parallel by different developers after Phase 2

---

## Parallel Example: Phase 2 - Foundational

```bash
# After T001 completes:
# Launch these tasks in parallel:
Task T002: "Create type definitions for MusicMode, MusicState, MusicContextValue in src/types/music.ts"
Task T003: "Create MusicContext unit tests for provider setup and hook access in src/contexts/MusicContext.test.tsx"
```

## Parallel Example: User Story 1

```bash
# After T008 (E2E tests defined), launch unit tests in parallel:
Task T009: "Unit test for playMainTheme function in src/contexts/MusicContext.test.tsx"
Task T010: "Unit test for autoplay fallback in src/contexts/MusicContext.test.tsx"
```

## Parallel Example: User Story 2

```bash
# Launch all US2 unit tests in parallel:
Task T020: "Unit test for playGameplayMusic function"
Task T021: "Unit test for stopMusic function"
Task T022: "Unit test for track selection never includes main theme"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: Foundational (T003-T006)
3. Complete Phase 3: User Story 1 (T007-T017)
4. **STOP and VALIDATE**: Main theme plays on menu screens independently
5. Deploy/demo MVP

### Incremental Delivery

1. Setup + Foundational → MusicContext ready
2. Add User Story 1 → Main theme on menus → **Demo MVP**
3. Add User Story 2 → Gameplay music separation → Demo
4. Add User Story 3 → Smooth transitions → Demo (Polish)
5. Each story adds value without breaking previous stories

### Sequential Solo Strategy

For single developer:
1. Complete Phases 1-2 (Setup + Foundation)
2. Complete User Story 1 → Validate
3. Complete User Story 2 → Validate
4. Complete User Story 3 → Validate
5. Polish phase → Final PR

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- E2E tests MANDATORY per Constitution Principle VIII
- Unit tests MUST fail before implementation (TDD - Principle I)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Total: 44 tasks across 6 phases
