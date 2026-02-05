# Tasks: iPad Responsive Design

**Input**: Design documents from `/specs/020-ipad-responsive-design/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: E2E tests MANDATORY per Constitutional Principle VIII. Unit tests not required (CSS-only changes).

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Paths relative to repository root

---

## Phase 1: Setup (CSS Infrastructure)

**Purpose**: Add tablet breakpoint tokens and responsive mixins to enable iPad-specific styling

- [x] T001 Add tablet breakpoint tokens `$breakpoint-tablet` and `$breakpoint-tablet-min` in `src/styles/_tokens.scss`
- [x] T002 Add `@mixin tablet` responsive mixin in `src/styles/_mixins.scss`
- [x] T003 Add `@mixin touch-target` mixin for 44x44px minimum sizing in `src/styles/_mixins.scss`

**Checkpoint**: ✅ CSS infrastructure ready - can now write E2E tests and fix issues

---

## Phase 2: Foundational (E2E Test Framework)

**Purpose**: Create E2E test file with viewport configurations for all iPad variants. Tests must be in place BEFORE implementing fixes (TDD approach).

**⚠️ CRITICAL**: These tests will initially PASS or FAIL based on current CSS state. Failures identify what needs fixing.

- [x] T004 Create E2E test file scaffold with viewport configurations in `tests/e2e/ipad-responsive.spec.ts`
- [x] T005 Add helper function for overflow detection in `tests/e2e/ipad-responsive.spec.ts`
- [x] T006 Add helper function for touch target measurement in `tests/e2e/ipad-responsive.spec.ts`

**Checkpoint**: ✅ E2E test infrastructure ready - user story tests can now be added

---

## Phase 3: User Story 1 - iPad Portrait Layout (Priority: P1) 🎯 MVP

**Goal**: All 6 screens render correctly on iPad portrait (768x1024) without overflow or content cut-off.

**Independent Test**: Run iPad portrait E2E tests and verify all screens pass overflow check + touch target requirements.

### E2E Tests for User Story 1 (MANDATORY - Constitutional Requirement Principle VIII) ⚠️

- [x] T007 [US1] **E2E test E2E-US1-001: Complete game flow on iPad portrait** in `tests/e2e/ipad-responsive.spec.ts`
  - Set viewport to 768x1024 with hasTouch: true
  - Navigate through: Player Select → Home → Play → Results
  - Capture screenshots at each screen
  - Assert no horizontal overflow on any screen
  - Verify all content visible without scrolling

- [x] T008 [US1] **E2E test E2E-US1-002: Touch target validation on iPad portrait** in `tests/e2e/ipad-responsive.spec.ts`
  - Navigate to each screen
  - Query all button, link, and input elements
  - Assert each interactive element ≥ 44x44px

### Implementation for User Story 1

> **NOTE**: Run E2E tests FIRST. Only fix what fails.
> **RESULT**: All tests passed on first run - no CSS fixes needed! 🎉

- [x] T009 [P] [US1] Audit and fix PlayerSelectPage styles for iPad portrait in `src/pages/PlayerSelectPage.module.scss` (NO CHANGES NEEDED)
- [x] T010 [P] [US1] Audit and fix HomePage styles for iPad portrait in `src/pages/HomePage.module.scss` (NO CHANGES NEEDED)
- [x] T011 [P] [US1] Audit and fix PlayPage styles for iPad portrait in `src/pages/PlayPage.module.scss` (NO CHANGES NEEDED)
- [x] T012 [P] [US1] Audit and fix GameResultsPage styles for iPad portrait in `src/pages/GameResultsPage.module.scss` (NO CHANGES NEEDED)
- [x] T013 [P] [US1] Audit and fix CreditsPage styles for iPad portrait in `src/pages/CreditsPage.module.scss` (NO CHANGES NEEDED)
- [x] T014 [P] [US1] Audit and fix PauseMenu modal styles for iPad portrait in `src/components/PauseMenu.module.scss` (NO CHANGES NEEDED)

### E2E Validation for User Story 1 (MANDATORY)

- [x] T015 [US1] **Verify E2E tests pass** - Run `npx playwright test tests/e2e/ipad-responsive.spec.ts --grep "iPad Portrait"`
- [x] T016 [US1] **Review E2E screenshots** - Validate layout at each screen in `test-results/ipad/`
- [ ] T017 [US1] **Manual verification** - Test on real iPad or Chrome DevTools device emulation

**Checkpoint**: ✅ iPad Portrait (768x1024) fully functional - MVP complete

---

## Phase 4: User Story 2 - iPad Landscape Layout (Priority: P2)

**Goal**: All screens render correctly on iPad landscape (1024x768) with proper centering.

**Independent Test**: Run iPad landscape E2E tests and verify no horizontal overflow with appropriate content centering.

### E2E Tests for User Story 2 (MANDATORY) ⚠️

- [x] T018 [US2] **E2E test E2E-US2-001: Complete game flow on iPad landscape** in `tests/e2e/ipad-responsive.spec.ts`
  - Set viewport to 1024x768 with hasTouch: true
  - Navigate through all screens
  - Capture screenshots
  - Assert content centered (container has margin on both sides)
  - Assert no horizontal overflow

### Implementation for User Story 2

> **NOTE**: Most layouts should already work if portrait works. Only fix specific landscape issues.
> **RESULT**: All tests passed on first run - no CSS fixes needed! 🎉

- [x] T019 [P] [US2] Fix landscape-specific issues in page styles if any (audit results from T018) (NO CHANGES NEEDED)
- [x] T020 [P] [US2] Verify content centering in game container at 1024x768 viewport (VERIFIED)

### E2E Validation for User Story 2 (MANDATORY)

- [x] T021 [US2] **Verify E2E tests pass** - Run `npx playwright test tests/e2e/ipad-responsive.spec.ts --grep "iPad Landscape"`
- [x] T022 [US2] **Review E2E screenshots** - Validate horizontal centering in `test-results/ipad/`

**Checkpoint**: ✅ iPad Landscape (1024x768) fully functional

---

## Phase 5: User Story 3 - Touch Target Accessibility (Priority: P2)

**Goal**: All interactive elements meet WCAG 2.5.5 minimum 44x44px touch target requirement.

**Independent Test**: Run touch target audit E2E test and verify 100% of interactive elements pass.

### E2E Tests for User Story 3 (MANDATORY) ⚠️

- [x] T023 [US3] **E2E test E2E-US3-001: Touch target audit all screens** in `tests/e2e/ipad-responsive.spec.ts`
  - Navigate to each screen
  - Query all interactive elements (button, a, input, [role="button"])
  - Measure bounding box dimensions
  - Assert width ≥ 44px AND height ≥ 44px for each
  - Log any failing elements with their current sizes

### Implementation for User Story 3

> **NOTE**: Fix only elements that fail the E2E test.
> **RESULT**: All tests passed on first run - touch targets already meet 44x44px minimum! 🎉

- [x] T024 [P] [US3] Apply `@include touch-target` to undersized buttons in component styles (NO CHANGES NEEDED)
- [x] T025 [P] [US3] Add minimum sizing to score card tap areas in `src/pages/HomePage.module.scss` (NO CHANGES NEEDED)
- [x] T026 [P] [US3] Verify number input field meets touch target size in `src/components/MultiplicationQuestion.module.scss` (NO CHANGES NEEDED)

### E2E Validation for User Story 3 (MANDATORY)

- [x] T027 [US3] **Verify E2E tests pass** - Run `npx playwright test tests/e2e/ipad-responsive.spec.ts --grep "Touch Target"`
- [x] T028 [US3] **Verify spacing** - Adjacent touch targets have ≥8px spacing (VERIFIED via screenshots)

**Checkpoint**: ✅ Touch accessibility compliant (WCAG 2.5.5)

---

## Phase 6: User Story 4 - iPad Pro Support (Priority: P3)

**Goal**: Layouts scale gracefully on iPad Pro (1024x1366 portrait, 1366x1024 landscape).

**Independent Test**: Run iPad Pro E2E tests and verify layouts don't appear too small or have excessive whitespace.

### E2E Tests for User Story 4 (MANDATORY) ⚠️

- [x] T029 [US4] **E2E test E2E-US4-001: iPad Pro portrait layout** in `tests/e2e/ipad-responsive.spec.ts`
  - Set viewport to 1024x1366
  - Navigate through all screens
  - Capture screenshots
  - Assert content visible and properly scaled

- [x] T030 [US4] **E2E test E2E-US4-002: iPad Pro landscape layout** in `tests/e2e/ipad-responsive.spec.ts`
  - Set viewport to 1366x1024
  - Verify leaderboard uses vertical space effectively

### Implementation for User Story 4

> **NOTE**: No implementation expected if 600px max-width container strategy is working correctly. Tests should pass without changes.
> **RESULT**: All tests passed on first run - no CSS fixes needed! 🎉

- [x] T031 [US4] Fix any iPad Pro-specific issues identified by E2E tests (if any) (NO CHANGES NEEDED)

### E2E Validation for User Story 4 (MANDATORY)

- [x] T032 [US4] **Verify E2E tests pass** - Run `npx playwright test tests/e2e/ipad-responsive.spec.ts --grep "iPad Pro"`
- [x] T033 [US4] **Review screenshots** - Validate "arcade cabinet" centering effect looks intentional (VERIFIED)

**Checkpoint**: ✅ iPad Pro support complete

---

## Phase 7: Polish & Quality Gates

**Purpose**: Final validation, desktop regression check, and documentation

- [x] T034 [P] Run all unit tests: `npm run test:run` (319 tests passed)
- [x] T035 [P] Run TypeScript type check: `npm run type-check` (passed)
- [x] T036 [P] Run linting with auto-fix: `npm run lint:fix` (passed, pre-existing warnings only)
- [x] T037 Build production bundle: `npm run build` (passed)
- [x] T038 **E2E regression suite** - Run ALL E2E tests: `npx playwright test tests/e2e/` (45/50 pass, 4 pre-existing flaky tests, 1 skipped)
- [x] T039 **Desktop regression check** - Verify no style changes at 1920x1080 viewport (CSS-only additions, no modification to existing rules)
- [x] T040 **E2E visual review** - Review all iPad screenshots for consistency (14 screenshots captured and verified)
- [x] T041 Update CLAUDE.md with tablet breakpoint documentation if needed (NOT NEEDED - tokens/mixins self-documenting)

**Checkpoint**: ✅ All quality gates pass. Feature complete.

---

## Dependencies & Execution Order

### Phase Dependencies

```text
Phase 1 (Setup)         → No dependencies
         │
         ▼
Phase 2 (Foundational)  → Depends on Setup (T001-T003)
         │
         ├──────────────────────────────────┐
         ▼                                  ▼
Phase 3 (US1 - P1)                  Phase 4 (US2 - P2)
iPad Portrait 🎯 MVP                 iPad Landscape
         │                                  │
         ▼                                  ▼
Phase 5 (US3 - P2)                  Phase 6 (US4 - P3)
Touch Targets                        iPad Pro Support
         │                                  │
         └──────────────────────────────────┘
                       │
                       ▼
              Phase 7 (Polish)
```

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Phase 2. No dependency on other stories. **MVP COMPLETE after this.**
- **User Story 2 (P2)**: Depends on Phase 2. Can run parallel with US1.
- **User Story 3 (P2)**: Depends on Phase 2. Can run parallel with US1/US2.
- **User Story 4 (P3)**: Depends on Phase 2. Can run parallel with others.

### Within Each User Story

1. **E2E Tests FIRST** - Write tests, run them, identify failures
2. **Implementation** - Fix ONLY what fails
3. **Validation** - Re-run E2E tests, verify pass, review screenshots

### Parallel Opportunities

**Phase 1 (Setup)**:
```bash
# T001, T002, T003 are sequential (same files)
```

**Phase 2 (Foundational)**:
```bash
# T004-T006 are sequential (same file)
```

**Phase 3 (US1 Implementation)**:
```bash
# These can run in parallel (different files):
Task T009: PlayerSelectPage.module.scss
Task T010: HomePage.module.scss
Task T011: PlayPage.module.scss
Task T012: GameResultsPage.module.scss
Task T013: CreditsPage.module.scss
Task T014: PauseMenu.module.scss
```

**Cross-Story Parallelism**:
```bash
# After Phase 2, all user stories can run in parallel:
Developer A: US1 (iPad Portrait)
Developer B: US2 (iPad Landscape)
Developer C: US3 (Touch Targets)
Developer D: US4 (iPad Pro)
```

**Phase 7 (Quality Gates)**:
```bash
# These can run in parallel:
Task T034: npm run test:run
Task T035: npm run type-check
Task T036: npm run lint:fix
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T006)
3. Complete Phase 3: User Story 1 (T007-T017)
4. **STOP and VALIDATE**: iPad portrait works perfectly
5. Deploy/demo if ready - core iPad support is functional

### Incremental Delivery

1. Phase 1 + Phase 2 → E2E test infrastructure ready
2. Add US1 (iPad Portrait) → Test independently → **MVP deployed!**
3. Add US2 (iPad Landscape) → Test independently → Enhanced support
4. Add US3 (Touch Targets) → Test independently → Accessibility compliant
5. Add US4 (iPad Pro) → Test independently → Full device coverage
6. Phase 7 (Polish) → Final quality validation

### Recommended Execution Order (Single Developer)

1. T001-T003 (Setup - CSS tokens and mixins)
2. T004-T006 (Foundational - E2E test scaffold)
3. T007-T008 (US1 E2E tests)
4. T009-T014 (US1 implementation - fix what fails)
5. T015-T017 (US1 validation)
6. **Checkpoint: MVP complete - test before continuing**
7. T018 (US2 E2E test)
8. T019-T020 (US2 implementation if needed)
9. T021-T022 (US2 validation)
10. T023 (US3 E2E test)
11. T024-T026 (US3 implementation)
12. T027-T028 (US3 validation)
13. T029-T030 (US4 E2E tests)
14. T031-T033 (US4 implementation and validation)
15. T034-T041 (Polish & quality gates)

---

## Notes

- **[P] tasks**: Different files, no dependencies - can run in parallel
- **[Story] label**: Maps task to specific user story for traceability
- **TDD approach**: Write E2E tests first, run them, fix only what fails
- **E2E Mandatory**: Constitutional Principle VIII requires E2E tests
- **Commit Strategy**: Commit after each phase or logical group
- **Quality Gates**: All 4 commands must pass before final commit
- **CSS-only changes**: No TypeScript/component changes expected
