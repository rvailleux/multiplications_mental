# Implementation Plan: Enhanced Keyboard Navigation with Pause Menu

**Branch**: `012-keyboard-navigation` | **Date**: 2026-01-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/012-keyboard-navigation/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement comprehensive keyboard-first navigation across all screens with ESC pause menu, unified jumping arrow UI pattern, enhanced input handling on play screen, and context-aware keyboard hints. Primary technical approach involves creating reusable keyboard navigation hooks, pause menu modal component with retro animations, and a global keyboard hints system. All implementations must follow existing Sass CSS Modules architecture, React functional components pattern, and constitutional requirements for test-first development and error handling.

## Technical Context

**Language/Version**: TypeScript 5.7.2 (strict mode)
**Primary Dependencies**: React 19.0.0, React Router DOM 7.5.0, Sass (CSS Modules)
**Storage**: localStorage (browser-based persistence)
**Testing**: Vitest 4.0.16, React Testing Library, Happy-DOM
**Target Platform**: Modern web browsers (desktop primary, mobile secondary)
**Project Type**: Single web application (React SPA)
**Performance Goals**: 60fps animations, <100ms keyboard response, <200ms modal render
**Constraints**: Keyboard-first UX (mouse secondary), retro 8-bit aesthetic, no backend dependencies
**Scale/Scope**: 6 screens (PlayerSelect, Home, Play, GameResults + PauseMenu modal), ~15 interactive elements

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Test-First Development ✅
- **Compliance**: ALL components MUST have tests written BEFORE implementation
- **Requirements**:
  - Tests for pause menu keyboard navigation (ESC, arrows, Enter)
  - Tests for jumping arrow focus states across all screens
  - Tests for input field auto-focus on digit typing
  - Tests for keyboard hints rendering on each screen
  - Error handling tests for timer pause/resume failures
  - UX tests for both keyboard AND mouse interactions
  - Test quality: Each test validates distinct behavior (no duplicate assertions)

### Principle II: TypeScript Type Safety ✅
- **Compliance**: All features use strict TypeScript
- **Requirements**:
  - Type definitions for pause menu state (isPaused, selectedOption)
  - Type definitions for focus state management
  - Type definitions for keyboard hint configurations
  - Exported interfaces for all component props
  - Explicit return types for all functions
  - No `any` types

### Principle III: Component-Based Architecture ✅
- **Compliance**: Functional components with custom hooks
- **Requirements**:
  - PauseMenu component (reusable modal)
  - KeyboardHints component (per-screen configuration)
  - JumpingArrow component or reusable pattern
  - Custom hooks: `usePauseMenu()`, `useKeyboardHints()`, `useFocusManagement()`
  - Sass CSS Modules for all styling (no inline styles)
  - Single responsibility per component

### Principle IV: Automated Quality Gates ✅
- **Compliance**: All 4 quality commands MUST pass
- **Requirements**:
  - `npm run type-check` - Zero TypeScript errors
  - `npm run lint:fix` - ESLint compliance
  - `npm run test:run` - All tests pass
  - `npm run build` - Production build succeeds

### Principle V: Documentation-Driven Development ✅
- **Compliance**: JSDoc required for all public APIs
- **Requirements**:
  - JSDoc for all components (PauseMenu, KeyboardHints, etc.)
  - JSDoc for custom hooks (usePauseMenu, useKeyboardHints, etc.)
  - Update CLAUDE.md with jumping arrow pattern documentation
  - Update ARCHITECTURE.md if new patterns introduced
  - Regenerate API docs with `npm run docs`

### Principle VI: Retro Gaming UX ✅
- **Compliance**: Keyboard-first with mouse secondary
- **Requirements**:
  - ESC, Arrow keys, Enter keyboard navigation
  - All keyboard interactions MUST have mouse equivalents
  - Jumping arrow animation consistent with player selection (bounce animation)
  - Retro 8-bit/SNES styling for pause menu
  - Visual focus indicators on all interactive elements
  - Test both keyboard AND mouse paths

### Principle VII: Error Handling & Resilience ✅
- **Compliance**: Graceful error handling required
- **Requirements**:
  - Timer pause/resume wrapped in try-catch (state update errors)
  - Focus management handles missing refs gracefully
  - Keyboard event handlers with proper cleanup
  - Component guards: Game screen requires active game state
  - Error handling tests for timer failures
  - Continue critical flows even if localStorage fails (keyboard hints config)

**GATE RESULT**: ✅ **PASSED** - All constitutional principles align with feature requirements. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/012-keyboard-navigation/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── keyboard-events.ts  # Keyboard event type definitions
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── PauseMenu.tsx                    # NEW: Pause menu modal component
│   ├── PauseMenu.module.scss            # NEW: Pause menu styles
│   ├── PauseMenu.test.tsx               # NEW: Pause menu tests
│   ├── KeyboardHints.tsx                # NEW: Keyboard hints component
│   ├── KeyboardHints.module.scss        # NEW: Keyboard hints styles
│   ├── KeyboardHints.test.tsx           # NEW: Keyboard hints tests
│   ├── JumpingArrow.tsx                 # NEW: Jumping arrow indicator component
│   ├── JumpingArrow.module.scss         # NEW: Jumping arrow animation styles
│   └── JumpingArrow.test.tsx            # NEW: Jumping arrow tests
├── hooks/
│   ├── usePauseMenu.ts                  # NEW: Pause menu state management hook
│   ├── usePauseMenu.test.ts             # NEW: Pause menu hook tests
│   ├── useKeyboardHints.ts              # NEW: Keyboard hints configuration hook
│   ├── useKeyboardHints.test.ts         # NEW: Keyboard hints tests
│   ├── useFocusManagement.ts            # NEW: Focus state management hook
│   ├── useFocusManagement.test.ts       # NEW: Focus management tests
│   └── useTimer.ts                      # MODIFIED: Add pause/resume functionality
├── pages/
│   ├── HomePage.tsx                     # MODIFIED: Add jumping arrow to Start button
│   ├── HomePage.module.scss             # MODIFIED: Add jumping arrow styles
│   ├── HomePage.test.tsx                # MODIFIED: Add jumping arrow tests
│   ├── PlayPage.tsx                     # MODIFIED: Add pause menu, jumping arrows, auto-focus
│   ├── PlayPage.module.scss             # MODIFIED: Add focus states for buttons
│   ├── PlayPage.test.tsx                # MODIFIED: Add pause, focus, input tests
│   ├── GameResultsPage.tsx              # MODIFIED: Add keyboard hints
│   └── PlayerSelectPage.tsx             # MODIFIED: Add keyboard hints
├── styles/
│   ├── _animations.scss                 # MODIFIED: Add zoom/splash animation
│   └── _mixins.scss                     # MODIFIED: Add pause menu modal mixin
└── types/
    └── keyboard.ts                      # NEW: Keyboard event and focus state types

tests/
└── (test files co-located with components)
```

**Structure Decision**: Single web application following existing React architecture. All new components use Sass CSS Modules pattern established in feature 011. Co-located test files following constitutional TDD requirement.

## Complexity Tracking

> **No violations - This section intentionally left empty**

All constitutional principles are satisfied without exceptions. Feature complexity is justified by user requirements and aligns with existing architecture patterns.

---

## Phase 0: Outline & Research

### Research Tasks

#### RT-001: Pause Menu Modal Patterns in React
**Question**: What are React best practices for modal pause menus with keyboard navigation?
**Focus Areas**:
- Modal focus trap patterns (prevent focus leaving modal)
- Keyboard event handling while modal is open
- Z-index and overlay best practices
- Animation timing for zoom/splash effect
- React state management for pause state

#### RT-002: Timer Pause/Resume Implementation
**Question**: How to safely pause and resume React timers with state preservation?
**Focus Areas**:
- setInterval vs useRef patterns for pausable timers
- State preservation during pause
- Accurate time tracking without drift
- Error handling for timer state updates
- Testing strategies for timer behavior

#### RT-003: Focus Management Across Screens
**Question**: What are React patterns for programmatic focus management?
**Focus Areas**:
- useRef for focus targets
- Automatic focus on component mount
- Focus restoration after modal close
- Keyboard navigation between focusable elements
- Screen reader compatibility

#### RT-004: Retro Animation Performance
**Question**: How to ensure 60fps performance for jumping arrow animations?
**Focus Areas**:
- CSS vs JavaScript animation performance
- GPU acceleration with transform/opacity
- Animation restart strategies on focus change
- Sass keyframe animation patterns
- Performance monitoring tools

#### RT-005: Auto-Focus Input Pattern
**Question**: How to implement auto-focus input field on any digit key press?
**Focus Areas**:
- Global keyboard event listeners in React
- Preventing event propagation issues
- Input field ref management
- Focus state synchronization
- Accessibility considerations

**Research Output**: See [research.md](./research.md)

---

## Phase 1: Design & Contracts

### Data Model

**Output**: See [data-model.md](./data-model.md)

**Key Entities**:
- PauseMenuState (isPaused, selectedOption, previousTimerValue)
- FocusState (activeElement, focusableElements, currentIndex)
- KeyboardHintConfig (screenId, hints[])

### API Contracts

**Output**: See [contracts/](./contracts/)

**Contracts**:
- keyboard-events.ts - Type definitions for keyboard event handlers
- pause-menu.ts - PauseMenu component props interface
- keyboard-hints.ts - KeyboardHints configuration interface

### Quickstart Guide

**Output**: See [quickstart.md](./quickstart.md)

Developer guide for:
- Adding jumping arrow to new interactive elements
- Configuring keyboard hints for new screens
- Implementing pausable components
- Testing keyboard navigation patterns

### Agent Context Update

**Action**: Run `.specify/scripts/bash/update-agent-context.sh claude`

**Updates**:
- Add pause menu modal pattern to CLAUDE.md
- Add jumping arrow usage guidelines
- Add keyboard hints configuration examples
- Document focus management patterns

---

## Phase 2: Tasks (NOT CREATED BY THIS COMMAND)

**Next Command**: `/speckit.tasks`

This will generate the implementation task breakdown in `tasks.md` based on user stories prioritized in the spec.

---

## Implementation Notes

### Critical Path (P1 User Story)
1. Pause menu modal with ESC keyboard handling
2. Timer pause/resume functionality
3. Jumping arrow navigation in pause menu
4. Focus trap within modal

### Secondary Features (P2 User Stories)
1. Unified jumping arrow on all screens
2. Play screen enhanced input handling
3. Focus management between buttons and input

### Polish (P3 User Story)
1. Keyboard hints on all screens

### Integration Points
- useTimer hook modification for pause/resume
- Existing bounce animation reuse for jumping arrow
- Sass _animations.scss for zoom/splash effect
- React Router integration for pause -> quit -> home navigation

### Risk Mitigation
- **Timer drift during pause**: Use Date.now() instead of setInterval counter
- **Focus trap conflicts**: Ensure modal focus trap releases on close
- **Animation performance**: Use transform/opacity for GPU acceleration
- **Keyboard event conflicts**: Use event.stopPropagation() carefully to avoid breaking existing navigation
