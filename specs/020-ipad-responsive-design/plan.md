# Implementation Plan: iPad Responsive Design

**Branch**: `020-ipad-responsive-design` | **Date**: 2026-02-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/020-ipad-responsive-design/spec.md`

## Summary

Ensure the multiplication game renders correctly on iPad screen sizes (768x1024, 1024x1366) in both portrait and landscape orientations. Audit all screens for layout issues, overflow problems, and touch target sizes. Fix any responsive design issues while maintaining the retro 8-bit aesthetic and ensuring no desktop regression.

## Technical Context

**Language/Version**: TypeScript 5.7.2 (strict mode enabled)
**Primary Dependencies**: React 19.0.0, React Router DOM 7.5.0, Sass (CSS Modules)
**Storage**: N/A (no new persistence required)
**Testing**: Vitest 4.0+ for unit tests
**E2E Testing**: Playwright (MANDATORY per Constitution Principle VIII) - viewport emulation for iPad testing
**Target Platform**: Web (iPad Safari via viewport emulation, Chrome/Firefox desktop)
**Project Type**: Single React web application
**Performance Goals**: 60fps animations, instant layout recalculation on orientation change
**Constraints**: Zero horizontal overflow, minimum 44x44px touch targets (WCAG 2.5.5)
**Scale/Scope**: 6 screens to audit (PlayerSelect, Home, Play, Results, Credits, Pause Menu)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Test-First Development | ✅ PASS | E2E tests will validate iPad layouts before/during CSS fixes |
| II. TypeScript Type Safety | ✅ PASS | No new types required; CSS-only changes |
| III. Component-Based Architecture | ✅ PASS | No component changes; CSS/style updates only |
| IV. Automated Quality Gates | ✅ PASS | All 4 commands will run before commit |
| V. Documentation-Driven Development | ✅ PASS | JSDoc not required for CSS changes |
| VI. Retro Gaming UX | ✅ PASS | 8-bit aesthetic maintained per FR-006 |
| VII. Error Handling & Resilience | ✅ PASS | No localStorage/error handling changes |
| VIII. E2E Testing with Playwright | ✅ PASS | iPad viewport E2E tests mandatory |

**Gate Status**: ✅ ALL GATES PASS - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/020-ipad-responsive-design/
├── plan.md              # This file
├── research.md          # Phase 0: Current CSS patterns, responsive best practices
├── data-model.md        # Phase 1: Viewport breakpoints and touch target specs
├── quickstart.md        # Phase 1: Quick implementation guide
└── tasks.md             # Phase 2: Implementation tasks (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── components/          # Component CSS Modules to audit
│   ├── *.module.scss    # Component-specific styles
│   └── *.tsx            # Components (no changes expected)
├── pages/               # Page CSS Modules to audit
│   ├── *.module.scss    # Page-specific styles
│   └── *.tsx            # Pages (no changes expected)
└── styles/              # Global styles and design tokens
    ├── _tokens.scss     # May need iPad-specific tokens
    ├── _mixins.scss     # May need responsive mixins
    └── _animations.scss # Verify animations work on iPad

tests/
└── e2e/
    └── ipad-responsive.spec.ts  # NEW: iPad viewport E2E tests (MANDATORY)
```

**Structure Decision**: This feature modifies existing SCSS files only. No new components or pages required. One new E2E test file will validate iPad responsiveness.

## Complexity Tracking

> No constitution violations. This is a CSS-focused audit and fix feature with minimal complexity.

| Aspect | Assessment |
|--------|------------|
| New files | 1 (E2E test file) |
| Modified files | ~10-15 SCSS files (estimated) |
| Complexity | Low - CSS media queries and touch target sizing |
| Risk | Low - SC-007 ensures desktop regression protection |
