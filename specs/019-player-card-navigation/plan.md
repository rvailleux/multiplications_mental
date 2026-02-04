# Implementation Plan: Player Card Navigation

**Branch**: `019-player-card-navigation` | **Date**: 2026-02-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/019-player-card-navigation/spec.md`

## Summary

Make the existing `PlayerNameDisplay` component clickable to navigate users back to the player selection screen. This is a focused UI enhancement that adds click/tap interaction to an existing display-only component, supporting mouse users and touch devices (iPad) alongside the existing keyboard navigation (ESC key).

**Technical approach**: Enhance `PlayerNameDisplay` component to accept an `onClick` callback prop, add hover/active CSS states, and pass navigation handler from parent pages.

## Technical Context

**Language/Version**: TypeScript 5.7.2 (strict mode enabled)
**Primary Dependencies**: React 19.0.0, React Router DOM 7.5.0, Sass (CSS Modules)
**Storage**: N/A (no new persistence required)
**Testing**: Vitest 4.0+ with React Testing Library, Happy-DOM
**E2E Testing**: Playwright (MANDATORY per Constitution Principle VIII)
**Target Platform**: Web (desktop + iPad touch)
**Project Type**: Single React SPA
**Performance Goals**: Navigation response < 1 second, hover feedback < 100ms
**Constraints**: 8-bit retro aesthetic must be maintained, dual input support (keyboard + mouse/touch)
**Scale/Scope**: 1 component enhancement, 4 pages consume component

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Test-First Development | ✅ WILL COMPLY | Unit tests for PlayerNameDisplay click behavior + E2E tests for navigation |
| II. TypeScript Type Safety | ✅ WILL COMPLY | Add `onClick` prop to interface with proper typing |
| III. Component-Based Architecture | ✅ WILL COMPLY | Enhance existing component, follow single responsibility |
| IV. Automated Quality Gates | ✅ WILL COMPLY | All 4 gates will pass before commit |
| V. Documentation-Driven | ✅ WILL COMPLY | Update JSDoc for new prop |
| VI. Retro Gaming UX | ✅ WILL COMPLY | Add hover state with 8-bit aesthetic, cursor: pointer |
| VII. Error Handling | ✅ WILL COMPLY | Navigation is non-critical (no localStorage involved) |
| VIII. E2E Testing (Playwright) | ✅ WILL COMPLY | Create `player-card-navigation.spec.ts` E2E tests |

**Gate Status**: ✅ PASS - All principles will be complied with.

## Project Structure

### Documentation (this feature)

```text
specs/019-player-card-navigation/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (minimal for this feature)
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── PlayerNameDisplay.tsx          # MODIFY: Add onClick prop, cursor, hover state
│   ├── PlayerNameDisplay.module.scss  # MODIFY: Add hover/active styles
│   └── PlayerNameDisplay.test.tsx     # MODIFY: Add click behavior tests
├── pages/
│   ├── HomePage.tsx                   # MODIFY: Pass onClick handler to PlayerNameDisplay
│   ├── PlayPage.tsx                   # MODIFY: Pass onClick handler to PlayerNameDisplay
│   ├── GameResultsPage.tsx            # MODIFY: Pass onClick handler to PlayerNameDisplay
│   └── CreditsPage.tsx                # MODIFY: Pass onClick handler to PlayerNameDisplay

tests/
└── e2e/
    └── player-card-navigation.spec.ts  # CREATE: E2E tests for click navigation
```

**Structure Decision**: Minimal changes to existing React SPA structure. Single component modification with prop changes propagated to 4 consumer pages.

## Complexity Tracking

> No constitution violations identified. This is a straightforward enhancement.

| Aspect | Assessment |
|--------|------------|
| Component changes | 1 component, minor interface extension |
| Page changes | 4 pages, simple prop addition |
| New files | 1 E2E test file |
| Risk | Low - isolated change, no side effects |
