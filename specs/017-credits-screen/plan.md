# Implementation Plan: Credits Screen

**Branch**: `017-credits-screen` | **Date**: 2026-01-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/017-credits-screen/spec.md`

## Summary

Add a credits screen accessible from the leaderboard (HomePage) via Ctrl+C keyboard shortcut. The credits screen features:
- **Starfield parallax background** with 3 animated layers at different speeds
- **Rainbow-animated "Credits" title** with wave color effect
- **Auto-scrolling credits content** with all audio/music/SFX attributions, tech stack ("Made with" section), and Special Thanks
- **Speed control** via Up/Down arrow keys (faster/slower/pause)
- **Escape to return** to leaderboard (HomePage)

The credits screen will be implemented as a new page component (`CreditsPage`) following existing patterns, with a new route `/credits` and Ctrl+C shortcut handler in HomePage.

## Technical Context

**Language/Version**: TypeScript 5.7.2 (strict mode enabled)
**Primary Dependencies**: React 19.0.0, React Router DOM 7.5.0, Sass (CSS Modules)
**Storage**: N/A (no persistence required for credits screen state)
**Testing**: Vitest 4.0+ with React Testing Library, Happy-DOM
**E2E Testing**: Playwright (MANDATORY per Constitution Principle VIII)
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge) on desktop
**Project Type**: Web application (React SPA)
**Performance Goals**: 60fps animation for starfield, smooth scrolling at all speed levels
**Constraints**: < 100ms response time for keyboard input, animations must not impact page performance
**Scale/Scope**: Single new page, modifications to 2 existing files (HomePage.tsx, App.tsx, KeyboardHints.tsx)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Test-First Development | ✅ PASS | Unit tests for CreditsPage, Starfield, RainbowTitle components will be written first |
| II. TypeScript Type Safety | ✅ PASS | All new components will have typed props interfaces with JSDoc |
| III. Component-Based Architecture | ✅ PASS | CreditsPage, Starfield, RainbowTitle, CreditsContent as separate components |
| IV. Automated Quality Gates | ✅ PASS | All 4 commands will pass before commit |
| V. Documentation-Driven Development | ✅ PASS | JSDoc for all exports, CLAUDE.md update if new patterns |
| VI. Retro Gaming UX | ✅ PASS | Keyboard-first (Ctrl+C, Arrows, Escape), SNES 8-bit aesthetic |
| VII. Error Handling & Resilience | ✅ PASS | No localStorage; component guards already in HomePage |
| VIII. E2E Testing (Playwright) | ✅ PASS | E2E tests for all 4 user stories mandatory |

**Gate Status**: ✅ PASSED - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/017-credits-screen/
├── plan.md              # This file
├── research.md          # Phase 0 output - audio attributions, animation patterns
├── data-model.md        # Phase 1 output - credits data structure
├── quickstart.md        # Phase 1 output - implementation steps
├── contracts/           # N/A (no API contracts for this feature)
├── checklists/
│   └── requirements.md  # Specification quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── Starfield.tsx              # NEW: Parallax starfield background
│   ├── Starfield.module.scss      # NEW: Starfield styles
│   ├── Starfield.test.tsx         # NEW: Starfield tests
│   ├── RainbowTitle.tsx           # NEW: Animated rainbow text
│   ├── RainbowTitle.module.scss   # NEW: Rainbow animation styles
│   ├── RainbowTitle.test.tsx      # NEW: RainbowTitle tests
│   ├── CreditsContent.tsx         # NEW: Scrolling credits content
│   ├── CreditsContent.module.scss # NEW: Credits content styles
│   ├── CreditsContent.test.tsx    # NEW: CreditsContent tests
│   └── KeyboardHints.tsx          # MODIFY: Add 'credits' screenId
├── pages/
│   ├── CreditsPage.tsx            # NEW: Main credits page
│   ├── CreditsPage.module.scss    # NEW: Credits page styles
│   ├── CreditsPage.test.tsx       # NEW: Credits page tests
│   └── HomePage.tsx               # MODIFY: Add Ctrl+C handler
├── hooks/
│   └── useCreditsScroll.ts        # NEW: Scroll speed control hook
├── types/
│   └── credits.ts                 # NEW: Credits data types
├── data/
│   └── creditsData.ts             # NEW: Static credits content
└── App.tsx                        # MODIFY: Add /credits route

tests/
└── e2e/
    └── credits.spec.ts            # NEW: E2E tests for credits feature
```

**Structure Decision**: Following existing React SPA structure with components, pages, hooks separation. New components (Starfield, RainbowTitle, CreditsContent) are reusable and testable. CreditsPage orchestrates these components.

## Complexity Tracking

> No violations - plan follows all constitutional principles.

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| Component count | 4 new components | Each has single responsibility: Starfield (background), RainbowTitle (title animation), CreditsContent (scrolling content), CreditsPage (orchestration) |
| New route | /credits | Simple addition to existing router |
| Keyboard handling | Extend existing pattern | Same pattern as HomePage Escape/Enter handling |
