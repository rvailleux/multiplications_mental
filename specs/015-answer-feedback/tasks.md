# Tasks: Answer Feedback System

**Input**: Design documents from `/specs/015-answer-feedback/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: TDD is MANDATORY per Constitution Principle I. E2E tests MANDATORY per Principle VIII.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Sound files: `public/audio/sfx/`
- E2E tests: `tests/e2e/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Type definitions and sound asset preparation

- [x] T001 Create feedback type definitions in src/types/feedback.ts
- [x] T002 [P] Create sfx directory and add placeholder README at public/audio/sfx/README.md
- [x] T003 [P] Source and add 8-bit correct sound effect at public/audio/sfx/correct.mp3
- [x] T004 [P] Source and add 8-bit incorrect sound effect at public/audio/sfx/wrong.mp3

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core hook infrastructure that MUST be complete before ANY user story visual integration

**⚠️ CRITICAL**: Hook must be fully working before component integration

- [x] T005 Write failing tests for useAnswerFeedback hook in src/hooks/useAnswerFeedback.test.ts
  - Test playCorrect() triggers audio and sets state
  - Test playIncorrect() triggers audio and sets state
  - Test isPlaying state transitions (true → false after duration)
  - Test feedbackType returns correct value during playback
  - Test error handling when audio fails to load
  - Test rapid successive calls don't crash
- [x] T006 Implement useAnswerFeedback hook in src/hooks/useAnswerFeedback.ts
  - Follow useBackgroundMusic.ts pattern
  - Use HTML5 Audio API for sound playback
  - Set volume to 0.2 (20%)
  - Manage isPlaying and feedbackType state
  - Add try-catch for graceful audio failures
  - Add JSDoc documentation
- [x] T007 Verify hook tests pass - Run `npm run test -- useAnswerFeedback`

**Checkpoint**: Foundation ready - hook is working with audio playback

---

## Phase 3: User Story 1 - Immediate Audio Feedback on Answer (Priority: P1) 🎯 MVP

**Goal**: Play distinct 8-bit sound effects when player submits correct or incorrect answers

**Independent Test**: Submit answers and verify sounds play at 20% volume without overlap issues

### Tests for User Story 1 (TDD + E2E) ⚠️

> **NOTE: Write tests FIRST, ensure they FAIL before implementation**

**Unit Tests (TDD - Constitution Principle I)**:
- [x] T008 [P] [US1] Write failing test for PlayPage audio integration in src/pages/PlayPage.test.tsx
  - Test handleCorrectAnswer calls feedback.playCorrect()
  - Test handleBadAnswer calls feedback.playIncorrect()
  - Test audio error handling doesn't crash component

**E2E Tests (MANDATORY - Constitution Principle VIII)**:
- [x] T009 [US1] Create E2E test file for audio feedback at tests/e2e/answer-feedback.spec.ts
  - E2E-US1-001: Correct answer triggers positive sound (verify audio element created)
  - E2E-US1-002: Incorrect answer triggers negative sound
  - E2E-US1-003: Rapid submissions don't cause audio errors
  - Test keyboard submission (Enter key)
  - Test mouse click submission (Valider button)
  - Capture screenshots: `01-correct-answer-submitted.png`, `02-incorrect-answer-submitted.png`

### Implementation for User Story 1

- [x] T010 [US1] Integrate useAnswerFeedback hook into PlayPage.tsx
  - Import hook at top of file
  - Call playCorrect() in handleCorrectAnswer function (line ~147)
  - Call playIncorrect() in handleBadAnswer function (line ~163)
- [x] T011 [US1] Update PlayPage.test.tsx with audio integration tests
  - Mock Audio constructor in test setup
  - Verify hook is called correctly on answer submission

### E2E Validation for User Story 1 (MANDATORY)

- [x] T012 [US1] **Verify E2E tests pass** - Run `npx playwright test tests/e2e/answer-feedback.spec.ts --grep "US1"`
- [x] T013 [US1] **Review E2E screenshots** - Validate score popup appears with answer
- [ ] T014 [US1] **Manual verification** - Test audio plays in real browser with keyboard + mouse

**Checkpoint**: Audio feedback working independently - sounds play on correct/incorrect answers

---

## Phase 4: User Story 2 - Visual Animation Feedback on Answer (Priority: P1)

**Goal**: Display green flash for correct, red shake for incorrect answers (500ms animations)

**Independent Test**: Submit answers with audio muted and verify visual animations appear

### Tests for User Story 2 (TDD + E2E) ⚠️

**Unit Tests (TDD - Constitution Principle I)**:
- [x] T015 [P] [US2] Write failing tests for AnswerFeedback component in src/components/AnswerFeedback.test.tsx
  - Test renders nothing when isVisible=false
  - Test renders correct animation class when type='correct' and isVisible=true
  - Test renders incorrect animation class when type='incorrect' and isVisible=true
  - Test onAnimationEnd callback is called after animation
  - Test component doesn't crash with null type

**E2E Tests (MANDATORY - Constitution Principle VIII)**:
- [ ] T016 [US2] Add E2E tests for visual feedback to tests/e2e/answer-feedback.spec.ts
  - E2E-US2-001: Correct answer shows green flash animation
  - E2E-US2-002: Incorrect answer shows red shake animation
  - Verify animation completes within 500ms
  - Capture screenshots: `03-correct-animation-start.png`, `04-correct-animation-complete.png`
  - Capture screenshots: `05-incorrect-animation-start.png`, `06-incorrect-animation-complete.png`

### Implementation for User Story 2

- [x] T017 [P] [US2] Add correctFlash and incorrectFlash keyframes to src/styles/_animations.scss
  - correctFlash: green background flash (teal color, 0.3 opacity, 500ms)
  - incorrectFlash: red background flash with horizontal shake (±5px, 500ms)
- [x] T018 [P] [US2] Create AnswerFeedback component in src/components/AnswerFeedback.tsx
  - Accept type, isVisible, onAnimationEnd props
  - Render fixed overlay when visible
  - Apply correct/incorrect CSS class based on type
  - Call onAnimationEnd when animation completes
  - Add JSDoc documentation
- [x] T019 [P] [US2] Create component styles in src/components/AnswerFeedback.module.scss
  - .overlay: fixed position, full viewport, pointer-events: none, z-index: 100
  - .correct: apply correctFlash animation
  - .incorrect: apply incorrectFlash animation
  - Animation duration: 500ms ease-out
- [x] T020 [US2] Integrate AnswerFeedback component into PlayPage.tsx
  - Import AnswerFeedback component
  - Add component to JSX with feedback hook props
  - Wire isPlaying and feedbackType from hook

### E2E Validation for User Story 2 (MANDATORY)

- [ ] T021 [US2] **Verify E2E tests pass** - Run `npx playwright test tests/e2e/answer-feedback.spec.ts --grep "US2"`
- [ ] T022 [US2] **Review E2E screenshots** - Confirm green/red animations visible
- [ ] T023 [US2] **Manual verification** - Test animations with audio muted in real browser

**Checkpoint**: Visual feedback working independently - animations show without relying on audio

---

## Phase 5: User Story 3 - Relocated Lives Display (Priority: P2)

**Goal**: Move hearts (lives) display between question and timer progress bar

**Independent Test**: Navigate to play screen and verify hearts appear in new position

### Tests for User Story 3 (TDD + E2E) ⚠️

**Unit Tests (TDD - Constitution Principle I)**:
- [x] T024 [P] [US3] Write failing test for hearts position in src/pages/PlayPage.test.tsx
  - Test livesDisplay renders before ProgressBar in DOM order
  - Test hearts still animate when life is lost

**E2E Tests (MANDATORY - Constitution Principle VIII)**:
- [x] T025 [US3] Add E2E test for layout to tests/e2e/answer-feedback.spec.ts
  - E2E-US3-001: Hearts display appears between header and progress bar
  - Verify visual order: Header → Hearts → ProgressBar → Question → Buttons
  - Submit incorrect answer to verify heart animation in new position
  - Capture screenshots: `07-play-screen-initial.png`, `08-life-lost-new-position.png`

### Implementation for User Story 3

- [x] T026 [US3] Relocate livesDisplay in PlayPage.tsx JSX
  - Move hearts div (current lines 274-280) to after stats bar, before ProgressBar
  - Maintain existing styling and animation
- [x] T027 [US3] Adjust spacing in PlayPage.module.scss if needed
  - Ensure visual separation between hearts and adjacent elements
  - Maintain responsive behavior

### E2E Validation for User Story 3 (MANDATORY)

- [x] T028 [US3] **Verify E2E tests pass** - Run `npx playwright test tests/e2e/answer-feedback.spec.ts --grep "US3"`
- [x] T029 [US3] **Review E2E screenshots** - Confirm hearts in new position
- [ ] T030 [US3] **Manual verification** - Test layout at different viewport sizes

**Checkpoint**: Layout update complete - hearts display repositioned

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Quality gates, documentation, and final validation

### Quality Gates (Constitution Principle IV)

- [x] T031 [P] Run TypeScript type checking - `npm run type-check` (must pass with zero errors)
- [x] T032 [P] Run ESLint and fix issues - `npm run lint:fix`
- [x] T033 Run all unit tests - `npm run test:run` (all must pass)
- [x] T034 Run production build - `npm run build` (must succeed)

### E2E Regression Suite (Constitution Principle VIII)

- [x] T035 **Run full E2E test suite** - `npx playwright test tests/e2e/answer-feedback.spec.ts`
- [x] T036 **Run all project E2E tests** - `npx playwright test` (verify no regressions)
- [x] T037 **Review all E2E screenshots** - Check visual consistency across all tests

### Documentation (Constitution Principle V)

- [x] T038 [P] Add JSDoc to all new exports in src/types/feedback.ts
- [x] T039 [P] Add JSDoc to useAnswerFeedback hook
- [x] T040 [P] Add JSDoc to AnswerFeedback component
- [x] T041 Regenerate API documentation - `npm run docs`
- [x] T042 Update CLAUDE.md with new audio feedback patterns (if significant)

### Final Verification

- [ ] T043 Manual end-to-end test in browser
  - Test keyboard navigation (Enter to submit)
  - Test mouse click (Valider button)
  - Test audio plays correctly (20% volume)
  - Test visual animations (green flash, red shake)
  - Test hearts in new position
  - Test with audio muted (visual feedback works independently)
  - Test rapid answer submissions (no crashes)
- [ ] T044 Verify quickstart.md steps work for new developer setup

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on T001 (types) - hook needs type definitions
- **User Story 1 (Phase 3)**: Depends on Phase 2 (hook must be complete)
- **User Story 2 (Phase 4)**: Depends on Phase 2 (uses hook state) - can run parallel to US1
- **User Story 3 (Phase 5)**: Independent of hook - can run parallel to US1/US2
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational phase (hook) - audio feedback
- **User Story 2 (P1)**: Depends on Foundational phase (hook state) - visual feedback
- **User Story 3 (P2)**: No dependencies on US1/US2 - layout change only

### Within Each User Story

1. Tests MUST be written and FAIL before implementation (TDD)
2. Implementation tasks in dependency order
3. E2E validation MUST pass before story is complete

### Parallel Opportunities

**Phase 1 (Setup)**:
```
T002, T003, T004 can run in parallel (different files)
```

**Phase 2 (Foundational)**:
```
T005 → T006 → T007 (sequential - TDD cycle)
```

**Phase 3-5 (User Stories - after Phase 2 complete)**:
```
US1 (T008-T014) and US2 (T015-T023) can run in parallel
US3 (T024-T030) can run in parallel with US1 and US2
```

**Phase 6 (Polish)**:
```
T031, T032 can run in parallel (different checks)
T038, T039, T040 can run in parallel (different files)
```

---

## Parallel Example: After Foundational Phase

```bash
# Launch User Story 1 and User Story 2 in parallel:
Agent A: "T008 → T009 → T010 → T011 → T012-T014" (Audio feedback)
Agent B: "T015 → T016 → T017-T019 → T020 → T021-T023" (Visual feedback)
Agent C: "T024 → T025 → T026 → T027 → T028-T030" (Layout update)

# All agents complete independently, then:
Agent Any: "T031-T044" (Polish phase)
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2 Only)

1. Complete Phase 1: Setup (types + sound files)
2. Complete Phase 2: Foundational (hook with audio)
3. Complete Phase 3: User Story 1 (audio integration)
4. Complete Phase 4: User Story 2 (visual animation)
5. **STOP and VALIDATE**: Audio + Visual feedback working
6. Run quality gates and deploy

### Incremental Delivery

1. Setup + Foundational → Hook working with sounds
2. Add User Story 1 → Test independently → Audio feedback MVP!
3. Add User Story 2 → Test independently → Full feedback system!
4. Add User Story 3 → Test independently → Improved layout
5. Polish → Documentation, quality gates → Production ready

### Suggested MVP Scope

**Minimum Viable Product**: User Story 1 (Audio) + User Story 2 (Visual)
- These are both P1 priority and together deliver complete feedback experience
- User Story 3 (Layout) is P2 and can be deferred if needed

---

## Summary

| Phase | Tasks | Parallel Tasks | Story Coverage |
|-------|-------|----------------|----------------|
| Setup | T001-T004 | 3 | Shared |
| Foundational | T005-T007 | 0 | Shared (Hook) |
| US1 - Audio | T008-T014 | 2 | US1 (7 tasks) |
| US2 - Visual | T015-T023 | 4 | US2 (9 tasks) |
| US3 - Layout | T024-T030 | 1 | US3 (7 tasks) |
| Polish | T031-T044 | 5 | Cross-cutting |

**Total Tasks**: 44
**Tasks per User Story**: US1=7, US2=9, US3=7, Shared=21
**Parallel Opportunities**: 15 tasks can run in parallel

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- E2E tests are MANDATORY per Constitution Principle VIII
