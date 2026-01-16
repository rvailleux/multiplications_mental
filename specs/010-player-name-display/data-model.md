# Data Model: Player Name Display Component

**Feature**: 010-player-name-display
**Date**: 2026-01-15
**Status**: Completed

## Overview

This document defines the data structures and interfaces for the PlayerNameDisplay component. This is a stateless presentational component with minimal data complexity - it receives player data as props and renders it without local state management.

## Entities

### PlayerNameDisplay Component

**Type**: React Functional Component (Stateless)

**Description**: A presentational component that displays the current player's name in the top right corner of game screens with retro 8-bit pixel art styling. The component is purely display-oriented with no interactive behavior or state management.

**Props Interface**:

```typescript
/**
 * Props for PlayerNameDisplay component
 * @public
 */
export interface PlayerNameDisplayProps {
  /**
   * Current player object to display. If null, component renders nothing.
   * Retrieved from localStorage via getCurrentPlayer() in parent components.
   */
  player: Player | null
}
```

**Attributes**:
- **player** (Player | null):
  - **Type**: Object or null
  - **Required**: Yes (but value can be null)
  - **Source**: Parent component (HomePage.tsx, PlayPage.tsx) via `getCurrentPlayer()` utility
  - **Validation**: None required (null check handled in component logic)
  - **Purpose**: Determines what name to display; null player results in no rendering

---

### Player Entity (Existing)

**Type**: TypeScript type (defined in `src/types/player.ts`)

**Description**: Represents a player in the multiplication game. This is an existing entity used throughout the application for player management and identification.

**Type Definition**:

```typescript
/**
 * Player data structure
 * @public
 */
type Player = {
  /** Unique identifier (e.g., "jules", "achille") */
  id: string
  /** Display name shown in UI */
  name: string
}
```

**Attributes**:
- **id** (string):
  - **Type**: string
  - **Required**: Yes
  - **Format**: Lowercase alphanumeric (e.g., "jules", "achille")
  - **Purpose**: Unique identifier for localStorage key, player selection logic
  - **Constraints**: No validation in PlayerNameDisplay (validated at player creation)

- **name** (string):
  - **Type**: string
  - **Required**: Yes
  - **Format**: Any string (Unicode characters, emojis supported)
  - **Recommended length**: ≤12 characters (longer names truncated with ellipsis)
  - **Purpose**: Human-readable display name shown in UI
  - **Constraints**:
    - CSS truncation at 200px max-width (approximately 12-15 characters depending on font)
    - No JavaScript validation or preprocessing

**Source**: `src/types/player.ts` (existing entity)

**Usage in PlayerNameDisplay**: Component displays `player.name` property only; `id` is not used

---

## Component State

**Type**: Stateless Component (No React State)

**Description**: PlayerNameDisplay does not manage any local state. All rendering decisions are based solely on the `player` prop.

**State Variables**: None

**Rationale**:
- Component is purely presentational (display-only, no interactions)
- No user input or dynamic updates originating from this component
- All data comes from parent components via props
- Stateless design simplifies testing and reduces complexity

---

## Data Flow

### Input Data Flow

```
localStorage ('players', 'currentPlayer')
  ↓
getCurrentPlayer() utility (src/types/player.ts)
  ↓
Parent component (HomePage.tsx or PlayPage.tsx)
  ↓
PlayerNameDisplay component (via props)
  ↓
Conditional rendering logic (if player null → return null)
  ↓
JSX rendering (<span>{player.name}</span>)
```

**Step-by-step**:
1. Parent component (HomePage or PlayPage) calls `getCurrentPlayer()`
2. `getCurrentPlayer()` retrieves player ID from `localStorage['currentPlayer']`
3. `getCurrentPlayer()` finds matching player from `localStorage['players']`
4. Parent component passes result (Player object or null) to `<PlayerNameDisplay player={currentPlayer} />`
5. PlayerNameDisplay checks if `player` is null:
   - If null → `return null` (no rendering)
   - If Player object → render player.name in styled container

### Output Data Flow

**Type**: None (read-only component)

**Description**: PlayerNameDisplay does not modify any data, emit events, or update localStorage. It is a pure presentational component with one-way data flow (props → rendering).

---

## Validation Rules

### Prop Validation

**Rule VR-001**: Null Player Handling
- **Condition**: `player === null`
- **Action**: Component returns `null` (no rendering)
- **Rationale**: User has not selected a player (e.g., first load before player selection)
- **Test Case**: TC-002 in testing strategy

**Rule VR-002**: Name Length Truncation
- **Condition**: `player.name.length > ~12 characters` (visual approximation)
- **Action**: CSS truncates with ellipsis (`textOverflow: 'ellipsis'`)
- **Implementation**: CSS-only (no JavaScript validation)
- **Test Case**: TC-003 in testing strategy

**Rule VR-003**: Special Characters
- **Condition**: `player.name` contains Unicode, emojis, or special characters
- **Action**: Render as-is (React automatically escapes for XSS prevention)
- **Rationale**: No restriction on valid Unicode characters
- **Test Case**: TC-007 in testing strategy

### No Backend Validation

**Rationale**: This is a client-side UI component with no server communication. All validation occurs at the player creation/selection phase, not in the display component.

---

## State Transitions

**Status**: Not Applicable

**Rationale**: PlayerNameDisplay is a stateless component with no internal state management. It does not have state transitions or lifecycle-based behavior beyond React's standard rendering lifecycle.

**Rendering Lifecycle**:
1. **Mount**: Component receives `player` prop → Render if player exists
2. **Update**: Parent passes new `player` prop (e.g., user switches players) → Re-render with new name
3. **Unmount**: Component removed from DOM (e.g., navigation to PlayerSelectPage)

**No State Transitions**: Component behavior is purely reactive to prop changes, with no internal state to transition between.

---

## Relationships

### Component Relationships

**Parent Components** (1:N relationship):
- **HomePage.tsx**: Renders PlayerNameDisplay with `currentPlayer` prop
- **PlayPage.tsx**: Renders PlayerNameDisplay with `currentPlayer` prop

**Dependency Relationships**:
- **Player type** (src/types/player.ts): Import type for prop interface
- **getCurrentPlayer()** utility: Indirect dependency (used by parent components, not directly by PlayerNameDisplay)

**Sibling Components** (no direct relationships):
- **MultiplicationQuestion**: No interaction
- **ProgressBar**: No interaction
- PlayerNameDisplay is visually positioned independently via absolute positioning

### Data Relationships

**Player → PlayerNameDisplay**:
- **Type**: 1:1 (one player displayed per component instance)
- **Cardinality**: Optional (player can be null)
- **Direction**: Unidirectional (parent → child via props)

**No localStorage Relationships**:
- Component does not read from or write to localStorage
- All localStorage interactions handled by parent components via `getCurrentPlayer()`

---

## TypeScript Type Definitions

### Component Props

```typescript
import { Player } from '../types/player'

/**
 * Props for PlayerNameDisplay component
 * @public
 */
export interface PlayerNameDisplayProps {
  /**
   * Current player object to display. If null, component renders nothing.
   * Retrieved from localStorage via getCurrentPlayer() in parent components.
   */
  player: Player | null
}
```

### Component Signature

```typescript
/**
 * Displays the current player's name in the top right corner with retro 8-bit styling.
 * Truncates names longer than 12 characters with ellipsis.
 * @param {PlayerNameDisplayProps} props - Component props
 * @returns {JSX.Element | null} Player name display or null if no player
 * @public
 */
export default function PlayerNameDisplay({
  player
}: PlayerNameDisplayProps): JSX.Element | null
```

### Styles Object Type

```typescript
const styles: {
  playerNameContainer: React.CSSProperties
  playerNameText: React.CSSProperties
}
```

**Note**: Inline style objects use TypeScript `as const` assertions for literal type preservation.

---

## Data Constraints

### Performance Constraints

**PC-001**: Render Time
- **Constraint**: Component must render in <100ms
- **Rationale**: Success criterion SC-005 (immediate update when player changes)
- **Implementation**: Stateless component with minimal JSX → inherently fast
- **Verification**: Performance profiling in React DevTools

**PC-002**: Bundle Size
- **Constraint**: Component adds <2KB to bundle size
- **Rationale**: Technical context requirement (minimal bundle impact)
- **Implementation**: No external dependencies, inline styles only
- **Verification**: Bundle analysis after build

### Display Constraints

**DC-001**: Text Truncation
- **Constraint**: Names >200px width must truncate with ellipsis
- **Rationale**: Functional requirement FR-009
- **Implementation**: CSS `maxWidth: '200px'` + `textOverflow: 'ellipsis'`

**DC-002**: Responsive Positioning
- **Constraint**: Component must render correctly on viewports 320px-1920px
- **Rationale**: Success criterion SC-004
- **Implementation**: Absolute positioning with responsive max-width

---

## Summary

**Data Model Complexity**: ✅ **MINIMAL**

- Single prop interface with 1 property (`player: Player | null`)
- No local state management
- No data transformations or computations
- Purely presentational component with one-way data flow
- Existing `Player` type reused (no new entities defined)

**Design Status**: ✅ Ready for implementation

**Next Phase**: Generate quickstart guide and update agent context
