# Research: Player Card Navigation

**Feature**: 019-player-card-navigation
**Date**: 2026-02-04

## Overview

This feature is straightforward with no significant unknowns. Research focuses on confirming existing patterns and best practices.

## Research Findings

### 1. Existing PlayerNameDisplay Component Pattern

**Question**: How is PlayerNameDisplay currently implemented?

**Decision**: Component accepts `player: Player | null` prop, renders fixed-position element in top right corner, uses CSS Modules for styling.

**Rationale**: Current implementation follows project patterns. Enhancement will add optional `onClick` prop following the same architectural approach.

**Alternatives considered**:
- Wrapping component in a clickable container - Rejected: More complex, breaks existing CSS positioning
- Creating new ClickablePlayerCard component - Rejected: Duplication, existing component is the right place

### 2. Click Handler Pattern in Project

**Question**: How do other clickable elements in the project handle navigation?

**Decision**: Use React Router's `useNavigate` hook in parent component, pass callback function as prop.

**Rationale**: This is the established pattern throughout the codebase (HomePage buttons, PauseMenu, etc.). The component receives an `onClick` callback rather than handling navigation internally, maintaining separation of concerns.

**Alternatives considered**:
- Using `useNavigate` inside PlayerNameDisplay - Rejected: Couples component to routing, reduces reusability
- Using anchor/Link component - Rejected: Not semantic for a display card that happens to be clickable

### 3. Hover State Styling Pattern

**Question**: How should hover states be styled to match 8-bit aesthetic?

**Decision**: Use CSS Module hover pseudo-class with:
- `cursor: pointer` for click affordance
- Subtle glow effect using `box-shadow`
- Slight scale transform (1.02-1.05) for tactile feedback
- Transition duration ~100ms (fast, responsive feel)

**Rationale**: Consistent with existing retro button patterns in the codebase. Fast transitions maintain the snappy 8-bit game feel.

**Alternatives considered**:
- Color change on hover - Could work but glow effect is more consistent with existing UI
- No hover feedback - Rejected: Poor UX, users won't know card is clickable

### 4. Touch/iPad Support

**Question**: Are there special considerations for touch devices?

**Decision**: Standard click handlers work for touch devices. Use `:active` pseudo-class for press feedback instead of `:hover` (which can be sticky on touch).

**Rationale**: React's onClick handles both mouse clicks and touch taps. CSS `:active` provides immediate visual feedback on touch.

**Alternatives considered**:
- Adding touch-specific event handlers (onTouchStart) - Rejected: Unnecessary complexity, onClick works
- Using a button element - Could improve semantics but would require more CSS adjustments

### 5. Debouncing/Double-Click Prevention

**Question**: How to prevent duplicate navigation from rapid clicks?

**Decision**: React Router's `navigate()` is inherently safe against duplicate calls during the same render cycle. No explicit debouncing needed.

**Rationale**: Testing confirms React Router handles this gracefully. Adding debounce would add unnecessary complexity.

**Alternatives considered**:
- Adding explicit debounce - Rejected: Over-engineering for this use case
- Using state to track "navigating" - Rejected: Navigation happens fast enough that state tracking is unnecessary

## No Unknowns Remaining

All technical questions have been resolved. The implementation approach is clear:

1. Add optional `onClick?: () => void` prop to `PlayerNameDisplayProps`
2. Make container div clickable with proper styling
3. Pass `() => navigate('/')` from each parent page
4. Add hover/active CSS states
5. Write unit tests for click behavior
6. Write E2E tests for navigation flow

## References

- Existing component: `src/components/PlayerNameDisplay.tsx`
- Existing styles: `src/components/PlayerNameDisplay.module.scss`
- Similar clickable pattern: `src/components/PauseMenu.tsx` (resume/quit buttons)
- React Router usage: `src/pages/HomePage.tsx` (navigate to /play)
