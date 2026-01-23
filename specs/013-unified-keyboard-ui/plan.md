# Implementation Plan: Unified Keyboard UI Navigation

**Branch**: `013-unified-keyboard-ui` | **Date**: 2026-01-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/013-unified-keyboard-ui/spec.md`

## Summary

Standardize the jumping arrow visual indicator across all application screens (HomePage, PlayPage, game results) and add keyboard hints at the bottom of every screen. This feature extends the existing jumping arrow pattern (currently only in PlayerSelectPage) to create a consistent keyboard-first navigation experience. The jumping arrow uses smooth CSS transform animation (0.6s bounce with 10px displacement) and is managed via the existing `JumpingArrow` component. Keyboard hints will display context-appropriate controls using the existing `KeyboardHints` component infrastructure.

## Technical Context

**Language/Version**: TypeScript 5.7.2 (strict mode)
**Primary Dependencies**: React 19.0.0, React Router DOM 7.5.0, Sass (CSS Modules)
**Storage**: localStorage (client-side persistence for selection state)
**Testing**: Vitest 4.0.16 + React Testing Library + Happy-DOM
**E2E Testing**: Playwright (MANDATORY per Constitution Principle VIII)
**Target Platform**: Web (Modern browsers supporting CSS transform animations)
**Project Type**: Single web application (React SPA)
**Performance Goals**: <100ms arrow key navigation response time, 60fps animation
**Constraints**:
- Must maintain retro 8-bit Super NES aesthetic
- Keyboard-first with mouse-secondary dual input support
- No external animation libraries (CSS-only animations)
- Existing JumpingArrow component must be reused

**Scale/Scope**:
- 5 screens total (PlayerSelectPage already has jumping arrow, 4 screens need updates)
- 2 new interactive navigation contexts (HomePage button, PlayPage Valider/Restart options)
- 1 reusable KeyboardHints component (already exists, needs screen-specific configs)
- Estimated ~8-12 new/modified components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Principle I: Test-First Development
- **Compliance**: PASS - Plan includes writing component tests before implementation
- **Action**: Write failing tests for jumping arrow on HomePage/PlayPage, keyboard hints display, and arrow key navigation on PlayPage before implementing
- **E2E Tests**: Must write Playwright tests for complete user journeys (player select → home → play with keyboard navigation)

### ✅ Principle II: TypeScript Type Safety
- **Compliance**: PASS - All new components will have explicit types
- **Action**:
  - Export `SelectedOption` type for PlayPage navigation state (`'valider' | 'restart'`)
  - Add type definitions for keyboard hints configuration per screen
  - Ensure strict mode compliance for all selection state management

### ✅ Principle III: Component-Based Architecture
- **Compliance**: PASS - Leveraging existing components, creating focused new components
- **Action**:
  - Reuse existing `JumpingArrow` component (no modification needed)
  - Extend `KeyboardHints` component with new screen configurations
  - Create custom hook `useNavigableOptions` for PlayPage arrow key navigation
  - Keep components focused: single responsibility principle

### ✅ Principle IV: Automated Quality Gates
- **Compliance**: PASS - All 4 quality commands will be run
- **Action**: Before commit, must pass:
  1. `npm run type-check` (zero TypeScript errors)
  2. `npm run lint:fix` (ESLint compliance)
  3. `npm run test:run` (all unit tests pass)
  4. `npm run build` (production build succeeds)
  5. `npx playwright test` (all E2E tests pass)

### ✅ Principle V: Documentation-Driven Development
- **Compliance**: PASS - JSDoc required, CLAUDE.md updates planned
- **Action**:
  - Add JSDoc to `useNavigableOptions` hook
  - Update CLAUDE.md with jumping arrow usage guidelines
  - Update constitution.md with arrow key navigation patterns
  - Document keyboard hints implementation in ARCHITECTURE.md

### ✅ Principle VI: Retro Gaming UX (Super NES 8-bit Aesthetic)
- **Compliance**: PASS - Feature explicitly enforces keyboard-first navigation
- **Action**:
  - Jumping arrow uses existing retro animation (0.6s bounce)
  - Keyboard hints styled with pixel font and gold borders
  - Dual input support: both keyboard AND mouse must work
  - Test both input methods in E2E tests

### ✅ Principle VII: Error Handling & Resilience
- **Compliance**: PASS - Minimal localStorage usage, selection state is UI-only
- **Action**:
  - Selection state persists during pause menu (clarification: preserve selection)
  - No critical localStorage operations for this feature
  - Guard clauses for edge cases (single option, rapid key presses)

### ✅ Principle VIII: End-to-End Testing with Playwright
- **Compliance**: PASS - E2E tests planned for each user story
- **Action**:
  - E2E-US1-001: Jumping arrow appears on HomePage
  - E2E-US1-002: Jumping arrow navigation on PlayPage
  - E2E-US2-001: Type answer and submit with keyboard
  - E2E-US2-002: Navigate between Valider/Restart options
  - E2E-US2-003: Backspace functionality in textbox
  - E2E-US3-001: Keyboard hints on HomePage
  - E2E-US3-002: Keyboard hints on PlayPage
  - E2E-US3-003: Keyboard hints on PlayerSelectPage
  - All tests include screenshots for visual validation

**GATE RESULT**: ✅ ALL PRINCIPLES SATISFIED - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/013-unified-keyboard-ui/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification (already exists)
├── research.md          # Phase 0 output (to be created)
├── data-model.md        # Phase 1 output (to be created)
├── quickstart.md        # Phase 1 output (to be created)
├── contracts/           # Phase 1 output (to be created, may be N/A for UI feature)
├── checklists/
│   └── requirements.md  # Spec quality checklist (already exists)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── JumpingArrow.tsx                # ✅ EXISTS - Reusable arrow indicator
│   ├── JumpingArrow.module.scss        # ✅ EXISTS - Arrow styling (bounce animation)
│   ├── JumpingArrow.test.tsx           # ✅ EXISTS - Arrow component tests
│   ├── KeyboardHints.tsx               # ✅ EXISTS - Keyboard hints display
│   ├── KeyboardHints.module.scss       # ✅ EXISTS - Hints styling
│   ├── KeyboardHints.test.tsx          # ⚠️  NEEDS UPDATE - Add new screen config tests
│   └── ...
│
├── hooks/
│   ├── usePlayerManagement.ts          # ✅ EXISTS - Player selection state pattern
│   ├── usePauseMenu.ts                 # ✅ EXISTS - Pause menu state management
│   ├── useFocusManagement.ts           # ✅ EXISTS - Focus management utilities
│   ├── useNavigableOptions.ts          # 🆕 CREATE - PlayPage option navigation hook
│   ├── useNavigableOptions.test.ts     # 🆕 CREATE - Hook tests
│   └── ...
│
├── pages/
│   ├── PlayerSelectPage.tsx            # ✅ EXISTS - Reference implementation for jumping arrow
│   ├── HomePage.tsx                    # ⚠️  NEEDS UPDATE - Add jumping arrow to Start Game button
│   ├── HomePage.module.scss            # ⚠️  NEEDS UPDATE - Add selected button styling
│   ├── HomePage.test.tsx               # ⚠️  NEEDS UPDATE - Add jumping arrow tests
│   ├── PlayPage.tsx                    # ⚠️  NEEDS UPDATE - Add arrow navigation for Valider/Restart
│   ├── PlayPage.module.scss            # ⚠️  NEEDS UPDATE - Add option selection styling
│   ├── PlayPage.test.tsx               # ⚠️  NEEDS UPDATE - Add navigation tests
│   ├── GameResultsPage.tsx             # ⚠️  NEEDS UPDATE - Add jumping arrow to Continue button
│   ├── GameResultsPage.module.scss     # ⚠️  NEEDS UPDATE - Add selected button styling
│   ├── GameResultsPage.test.tsx        # ⚠️  NEEDS UPDATE - Add jumping arrow tests
│   └── ...
│
├── styles/
│   ├── _animations.scss                # ✅ EXISTS - Contains bounce animation
│   ├── _tokens.scss                    # ✅ EXISTS - Design tokens (colors, spacing)
│   ├── _mixins.scss                    # ✅ EXISTS - Card styling mixins
│   └── main.scss                       # ✅ EXISTS - Entry point
│
└── types/
    └── navigation.ts                   # 🆕 CREATE - Types for navigable options

tests/
├── e2e/
│   └── unified-keyboard-ui.spec.ts     # 🆕 CREATE - E2E tests for user stories
│
└── (unit tests co-located with components)

docs/
└── api/                                # Auto-generated TypeDoc output
```

**Structure Decision**: Single web application structure. All UI components reside in `src/components/`, page components in `src/pages/`, custom hooks in `src/hooks/`. E2E tests in `tests/e2e/`. Styling uses Sass CSS Modules with shared design tokens in `src/styles/`. This matches the existing project structure and requires no restructuring.

## Complexity Tracking

> **No Constitution violations requiring justification**

All constitutional principles are satisfied:
- ✅ Test-first development enforced
- ✅ TypeScript strict mode maintained
- ✅ Component-based architecture followed
- ✅ All 4 quality gates will pass
- ✅ JSDoc documentation required
- ✅ Keyboard-first UX with dual input support
- ✅ Error handling patterns applied
- ✅ E2E tests with Playwright mandatory

**No complexity additions** - Feature leverages existing patterns and components. The jumping arrow component already exists and can be reused without modification. Keyboard hints infrastructure already exists. Only extension of existing patterns to new screens.

---

## Phase 0: Research - COMPLETE ✅

**Output**: `research.md` - 10 research questions answered with decisions, rationale, and alternatives

**Key Findings**:
- Reuse existing `JumpingArrow` component without modifications
- Use smooth CSS transform animation (user preference from clarification)
- Create `useNavigableOptions` hook following `usePlayerManagement` pattern
- Extend existing `KEYBOARD_HINTS_CONFIG` object
- All clarifications from `/speckit.clarify` integrated into design

**Status**: All unknowns resolved, no blockers

---

## Phase 1: Design & Contracts - COMPLETE ✅

**Outputs**:
- `data-model.md` - UI state model with 3 new type definitions, 1 new hook interface
- `quickstart.md` - Step-by-step implementation guide with code examples
- `contracts/README.md` - N/A for pure frontend feature
- `CLAUDE.md` - Updated with new technologies

**Key Artifacts**:
- Type definitions: `NavigableOption`, `NavigableOptionsConfig`, `SelectionState<T>`
- Hook: `useNavigableOptions` with `UseNavigableOptionsReturn` interface
- Configuration: Extended `KEYBOARD_HINTS_CONFIG` with updated screen hints

**Status**: Design complete, ready for task generation

---

## Post-Design Constitution Re-Check

*Re-evaluating all principles after Phase 1 design completion*

### ✅ Principle I: Test-First Development - STILL COMPLIANT
- Quickstart guide enforces test-first approach with failing tests written before implementation
- 30+ unit tests planned (hook tests, component tests)
- 8 E2E test scenarios planned with Playwright
- Each implementation step includes "Test First" section

### ✅ Principle II: TypeScript Type Safety - STILL COMPLIANT
- All new types defined in `src/types/navigation.ts`
- Hook return type explicitly defined: `UseNavigableOptionsReturn`
- No `any` types in design
- Strict mode maintained

### ✅ Principle III: Component-Based Architecture - STILL COMPLIANT
- Reusing existing `JumpingArrow` component (no modification)
- Custom hook `useNavigableOptions` for shared navigation logic
- Single responsibility maintained across all components

### ✅ Principle IV: Automated Quality Gates - STILL COMPLIANT
- Quickstart includes verification checklist with all 4 commands
- Pre-commit hooks will enforce quality (no bypass)

### ✅ Principle V: Documentation-Driven Development - STILL COMPLIANT
- JSDoc required for `useNavigableOptions` hook
- CLAUDE.md update section in quickstart (Step 6.1)
- constitution.md update section in quickstart (Step 6.2)

### ✅ Principle VI: Retro Gaming UX - STILL COMPLIANT
- Jumping arrow uses existing 0.6s bounce animation
- Keyboard-first with mouse-secondary dual input
- Quickstart includes "Dual Input Support" checklist
- E2E tests validate both keyboard and mouse paths

### ✅ Principle VII: Error Handling & Resilience - STILL COMPLIANT
- No critical localStorage operations (selection state is transient UI state)
- Edge cases handled: rapid key presses, single options, pause menu preservation

### ✅ Principle VIII: End-to-End Testing - STILL COMPLIANT
- 8 E2E test scenarios defined in quickstart
- Each test includes screenshots for visual regression
- Tests cover all user stories from spec.md

**FINAL GATE RESULT**: ✅ ALL PRINCIPLES SATISFIED POST-DESIGN

---

## Summary

**Branch**: `013-unified-keyboard-ui`
**Plan File**: `/home/romain/code/multiplication_game/specs/013-unified-keyboard-ui/plan.md`

**Generated Artifacts**:
1. ✅ `plan.md` - This file (technical context, constitution check, project structure)
2. ✅ `research.md` - 10 research questions with decisions and rationale
3. ✅ `data-model.md` - UI state model, type definitions, state transitions
4. ✅ `quickstart.md` - Step-by-step implementation guide with code examples
5. ✅ `contracts/README.md` - N/A note for pure frontend feature
6. ✅ `CLAUDE.md` - Updated with new technologies

**Phase Status**:
- Phase 0 (Research): ✅ COMPLETE
- Phase 1 (Design): ✅ COMPLETE
- Phase 2 (Tasks): ⏳ READY - Run `/speckit.tasks` to generate task breakdown

**Constitution Compliance**: ✅ ALL 8 PRINCIPLES SATISFIED

**Blockers**: NONE

**Next Command**: `/speckit.tasks` - Generate detailed task breakdown for implementation
