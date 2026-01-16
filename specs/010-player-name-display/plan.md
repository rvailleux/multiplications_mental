# Implementation Plan: Player Name Display on All Screens

**Branch**: `010-player-name-display` | **Date**: 2026-01-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/010-player-name-display/spec.md`

## Summary

Add a persistent player name display component in the top right corner of HomePage and PlayPage screens. The component will retrieve the current player from localStorage using the existing `getCurrentPlayer()` utility, render the player's name with retro 8-bit pixel art styling matching the existing game aesthetic, and handle edge cases like long names (>12 characters) with ellipsis truncation. The component will be display-only (non-interactive), positioned with absolute positioning to avoid layout disruption, and will maintain visual consistency with existing UI elements (pixel borders, retro color palette, text shadows).

## Technical Context

**Language/Version**: TypeScript 5.7.2 (strict mode enabled)
**Primary Dependencies**: React 19.0.0, React Router DOM 7.5.0
**Storage**: localStorage (browser-based persistence)
**Testing**: Vitest 4.0.16 with React Testing Library 16.3.1, Happy-DOM environment
**Target Platform**: Web browsers (desktop and mobile, 320px-1920px viewport widths)
**Project Type**: Single-page web application (React SPA)
**Performance Goals**: Component renders in <100ms, name updates immediately on player change (<100ms)
**Constraints**: Must maintain retro 8-bit aesthetic, handle names >12 characters with truncation, no layout overflow on narrow viewports (320px minimum)
**Scale/Scope**: 2 screens affected (HomePage, PlayPage), 1 new shared component, minimal bundle size impact (<2KB)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Test-First Development ✅ COMPLIANT
- **Status**: Will be enforced
- **Plan**: Write tests for PlayerNameDisplay component BEFORE implementation
  - Test: Renders player name when player exists
  - Test: Renders nothing when no player selected
  - Test: Truncates long names (>12 chars) with ellipsis
  - Test: Matches retro styling (snapshot test)
  - Test: Updates when player changes (integration test with HomePage/PlayPage)
- **Gate**: No implementation until tests written and approved

### Principle II: TypeScript Type Safety ✅ COMPLIANT
- **Status**: Fully compliant
- **Plan**:
  - Export `PlayerNameDisplayProps` interface with JSDoc
  - Explicit return type `JSX.Element | null` for conditional rendering
  - Leverage existing `Player` type from `src/types/player.ts`
  - No `any` types used
- **Gate**: `npm run type-check` must pass

### Principle III: Component-Based Architecture ✅ COMPLIANT
- **Status**: Fully compliant
- **Plan**:
  - Create reusable functional component: `src/components/PlayerNameDisplay.tsx`
  - Single Responsibility: Display current player name only (no navigation, no interactions)
  - CSS-in-JS with inline styles object matching existing patterns
  - Props interface with JSDoc documentation
  - Use existing `getCurrentPlayer()` hook from `src/types/player.ts`
- **Pattern**: Follows existing component patterns (MultiplicationQuestion.tsx, ProgressBar.tsx)

### Principle IV: Automated Quality Gates ✅ COMPLIANT
- **Status**: Will be enforced
- **Plan**: All 4 commands required before commit
  1. `npm run type-check` - Zero TypeScript errors
  2. `npm run lint:fix` - ESLint compliance
  3. `npm run test:run` - All tests pass (including new PlayerNameDisplay tests)
  4. `npm run build` - Production build succeeds
- **Gate**: Pre-commit hooks enforce automatically

### Principle V: Documentation-Driven Development ✅ COMPLIANT
- **Status**: Will be enforced
- **Plan**:
  - JSDoc for `PlayerNameDisplay` component with `@param`, `@returns`, `@public` tags
  - JSDoc for `PlayerNameDisplayProps` interface
  - Run `npm run docs` to regenerate TypeDoc API documentation
  - Update ARCHITECTURE.md if new patterns introduced (likely not needed)
- **Gate**: Documentation generated before commit

### Principle VI: Retro Gaming UX ✅ COMPLIANT (PRIMARY FOCUS)
- **Status**: Core requirement of this feature
- **Plan**:
  - **Visual Style**: Pixel borders (4px solid #000), retro color palette (matching existing buttons/headers)
  - **Typography**: Text shadow for depth (2px 2px 0 #000), uppercase letters, retro font rendering
  - **Positioning**: Absolute positioning top right with appropriate spacing (20px from edges)
  - **Keyboard Navigation**: Not applicable (display-only, non-interactive component)
  - **Mouse Support**: Not applicable (display-only, non-interactive component)
  - **Testing**: Visual snapshot tests + manual browser verification
- **Pattern**: Match existing styles in HomePage.tsx (styles.gameTitle, styles.subtitle)

### Summary: ✅ ALL GATES PASSED
No violations detected. Feature aligns with all constitution principles.

## Project Structure

### Documentation (this feature)

```text
specs/010-player-name-display/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification (completed)
├── research.md          # Phase 0 output (to be generated)
├── data-model.md        # Phase 1 output (to be generated)
├── quickstart.md        # Phase 1 output (to be generated)
├── contracts/           # Phase 1 output (N/A - no API contracts for UI component)
├── checklists/
│   └── requirements.md  # Specification quality checklist (completed)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── MultiplicationQuestion.tsx         # Existing component
│   ├── MultiplicationQuestion.test.tsx    # Existing tests
│   ├── ProgressBar.tsx                    # Existing component
│   ├── PlayerNameDisplay.tsx              # NEW: Player name display component
│   └── PlayerNameDisplay.test.tsx         # NEW: Component tests (TDD)
├── pages/
│   ├── HomePage.tsx                       # MODIFIED: Add PlayerNameDisplay
│   ├── HomePage.test.tsx                  # MODIFIED: Verify player name renders
│   ├── PlayPage.tsx                       # MODIFIED: Add PlayerNameDisplay
│   └── PlayPage.test.tsx                  # MODIFIED: Verify player name renders
├── types/
│   └── player.ts                          # Existing (getCurrentPlayer() utility)
└── hooks/
    ├── useTimer.ts                        # Existing
    └── useBackgroundMusic.ts              # Existing

tests/ (N/A - tests co-located with components)
```

**Structure Decision**: Single project structure (Option 1). React SPA with component-based architecture. Tests co-located with components following existing pattern. No backend/API layer needed - all data from localStorage via existing player utilities. New component added to `src/components/` with corresponding test file. Two pages modified to import and render the new component in top right corner.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**Status**: ✅ No violations - table not applicable

All constitution principles are fully compliant. No complexity justifications needed.

## Phase 0: Research & Unknowns

### Research Questions

**RQ-001**: How to implement responsive text truncation with ellipsis in CSS-in-JS while maintaining pixel-perfect retro aesthetic?

**Decision**: Use CSS `textOverflow: 'ellipsis'`, `overflow: 'hidden'`, `whiteSpace: 'nowrap'` combined with `maxWidth` constraint
- **Rationale**: Standard CSS approach that works across all browsers, maintains layout integrity
- **Alternatives considered**:
  - JavaScript string slicing: More complex, requires state management, doesn't handle dynamic viewport changes
  - CSS `@supports` with fallback: Over-engineered for simple requirement
- **Implementation**: `maxWidth: '200px'` in styles object, CSS truncation properties

**RQ-002**: What is the optimal positioning strategy to avoid layout conflicts with existing page elements (clouds, header, character sprites)?

**Decision**: Absolute positioning with `position: 'absolute'`, `top: '20px'`, `right: '20px'`, parent container needs `position: 'relative'`
- **Rationale**: Removes component from normal document flow, prevents layout disruption, matches existing sprite positioning patterns
- **Alternatives considered**:
  - Fixed positioning: Would stay visible on scroll, but unnecessary for current screen layouts
  - Flexbox positioning: Would affect other elements' layout, requires restructuring existing components
- **Implementation**: Parent containers (HomePage, PlayPage) already have `position: 'relative'` in `styles.gameContainer`

**RQ-003**: Should PlayerNameDisplay be a reusable component or page-specific implementation?

**Decision**: Reusable component in `src/components/PlayerNameDisplay.tsx`
- **Rationale**: Single Responsibility Principle, DRY (Don't Repeat Yourself), easier testing, future-proof for additional pages
- **Alternatives considered**:
  - Inline implementation in each page: Code duplication, harder to maintain consistency, violates DRY
  - Higher-order component (HOC): Over-engineered for simple display component
- **Implementation**: Create shared component, import in HomePage and PlayPage

**RQ-004**: How to handle edge case where player name contains emojis or special Unicode characters?

**Decision**: No special handling required - React automatically escapes and renders text safely
- **Rationale**: React's default text rendering handles Unicode correctly, emojis render natively in modern browsers
- **Alternatives considered**:
  - Emoji detection and removal: Unnecessary restriction on user input
  - Special Unicode sanitization: React already sanitizes to prevent XSS
- **Implementation**: Standard `{currentPlayer.name}` JSX rendering

**RQ-005**: What z-index value ensures player name displays above decorative elements (clouds, sprites) but doesn't interfere with modals/overlays?

**Decision**: `zIndex: 100` for player name display
- **Rationale**: Higher than decorative elements (clouds have no z-index, default stacking), lower than potential future modals (typically 1000+)
- **Alternatives considered**:
  - `zIndex: 1`: Too low, might be covered by future stacking contexts
  - `zIndex: 9999`: Unnecessarily high, could interfere with modals
- **Implementation**: Add `zIndex: 100` to PlayerNameDisplay styles

### Best Practices Research

**BP-001**: React component testing with React Testing Library

**Findings**:
- Test user-visible behavior, not implementation details
- Use `screen.getByText()` for text content assertions
- Mock `getCurrentPlayer()` for controlled test scenarios
- Snapshot testing for visual regression detection
- Co-locate tests with components (`.test.tsx` files)

**Source**: Existing test patterns in `src/components/MultiplicationQuestion.test.tsx`, React Testing Library documentation

**BP-002**: CSS-in-JS styling patterns for retro pixel art aesthetic

**Findings**:
- Inline styles objects with TypeScript type annotations (`as const`)
- Pixel borders: `border: '4px solid #000'` (multiple of 4px for pixel-perfect)
- Text shadows for depth: `textShadow: '2px 2px 0 #000'` (solid shadow, no blur)
- Box shadows for 3D effect: `boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.5)'`
- Color palette consistency: Use existing palette from HomePage (#ff6b6b, #4ecdc4, #ffd700, #000, #fff)

**Source**: Existing styles in `src/pages/HomePage.tsx` (lines 151-284)

**BP-003**: Component props interface design for display-only components

**Findings**:
- PlayerNameDisplay can be a zero-props component (retrieves player internally via `getCurrentPlayer()`)
- Alternative: Accept `player: Player | null` as prop for better testability and reusability
- Decision: **Accept player as prop** for testing flexibility while still using `getCurrentPlayer()` in parent pages

**Source**: React component best practices, existing project patterns

## Phase 1: Design Artifacts

### Data Model (`data-model.md`)

**Entity**: PlayerNameDisplay Component State

**Description**: This is a stateless display component that receives player data as props. No local state or complex data transformations required.

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

**Player Type** (existing):
```typescript
type Player = {
  id: string        // Unique identifier (e.g., "jules", "achille")
  name: string      // Display name (max recommended: 12 characters)
}
```

**State Transitions**: None (stateless component)

**Validation Rules**:
- If `player` is null → render nothing (`return null`)
- If `player.name.length > 12` → truncate with CSS ellipsis (not JavaScript)
- No empty string validation needed (player selection enforces non-empty names)

### API Contracts (`contracts/`)

**Status**: N/A - Not applicable

**Rationale**: This is a client-side UI component with no backend API interactions. All data sourced from localStorage via existing utilities. No REST/GraphQL endpoints involved.

### Integration Points

**IP-001**: HomePage Integration
- **Location**: `src/pages/HomePage.tsx`
- **Change**: Import PlayerNameDisplay, add to JSX above game header
- **Code**:
  ```tsx
  import PlayerNameDisplay from '../components/PlayerNameDisplay'

  // Inside return statement, before gameHeader div:
  <PlayerNameDisplay player={currentPlayer} />
  ```

**IP-002**: PlayPage Integration
- **Location**: `src/pages/PlayPage.tsx`
- **Change**: Import PlayerNameDisplay, add to JSX in absolute positioned container
- **Code**:
  ```tsx
  import PlayerNameDisplay from '../components/PlayerNameDisplay'

  // Inside return statement, as first child of main container:
  <PlayerNameDisplay player={currentPlayer} />
  ```

**IP-003**: Player Utility Integration
- **Location**: `src/types/player.ts`
- **Change**: None required (already exports `getCurrentPlayer()` and `Player` type)
- **Usage**: Parent pages call `getCurrentPlayer()` and pass result to PlayerNameDisplay

### Component Design

**PlayerNameDisplay Component Structure**:

```typescript
/**
 * Displays the current player's name in the top right corner with retro 8-bit styling.
 * Truncates names longer than 12 characters with ellipsis.
 * @param {PlayerNameDisplayProps} props - Component props
 * @returns {JSX.Element | null} Player name display or null if no player
 * @public
 */
export default function PlayerNameDisplay({ player }: PlayerNameDisplayProps): JSX.Element | null {
  if (!player) return null

  return (
    <div style={styles.playerNameContainer}>
      <span style={styles.playerNameText}>{player.name}</span>
    </div>
  )
}
```

**Styling Strategy**:
- Container: Absolute positioning (top: 20px, right: 20px, zIndex: 100)
- Background: Retro pixel border with color matching existing UI (#4ecdc4 gradient)
- Typography: Text shadow for depth, uppercase optional (test both)
- Truncation: maxWidth + CSS ellipsis properties
- Responsive: Adjust maxWidth for mobile viewports (<500px)

### Testing Strategy

**Test Cases** (TDD - write before implementation):

1. **TC-001**: Renders player name when player exists
   - Given: `player = { id: 'jules', name: 'Jules' }`
   - When: Component renders
   - Then: Screen displays "Jules"

2. **TC-002**: Renders nothing when player is null
   - Given: `player = null`
   - When: Component renders
   - Then: Component returns `null`, nothing in DOM

3. **TC-003**: Truncates long names with ellipsis
   - Given: `player = { id: 'test', name: 'VeryLongPlayerNameThatExceeds' }`
   - When: Component renders
   - Then: Name is visually truncated (test via snapshot or computed styles)

4. **TC-004**: Matches retro styling (snapshot test)
   - Given: `player = { id: 'jules', name: 'Jules' }`
   - When: Component renders
   - Then: Snapshot matches expected retro styling

5. **TC-005**: Integration with HomePage
   - Given: HomePage renders with currentPlayer set
   - When: Page loads
   - Then: Player name visible in top right corner

6. **TC-006**: Integration with PlayPage
   - Given: PlayPage renders with currentPlayer set
   - When: Page loads
   - Then: Player name visible in top right corner

7. **TC-007**: Handles special characters and emojis
   - Given: `player = { id: 'test', name: '日本語 🎮' }`
   - When: Component renders
   - Then: Name renders correctly without errors

### File Modifications Summary

**New Files** (2):
1. `src/components/PlayerNameDisplay.tsx` (~50 lines)
2. `src/components/PlayerNameDisplay.test.tsx` (~100 lines)

**Modified Files** (4):
1. `src/pages/HomePage.tsx` (+2 lines: import, JSX addition)
2. `src/pages/HomePage.test.tsx` (+10 lines: verify player name renders)
3. `src/pages/PlayPage.tsx` (+2 lines: import, JSX addition)
4. `src/pages/PlayPage.test.tsx` (+10 lines: verify player name renders)

**Total Impact**: ~174 lines added/modified, minimal bundle size increase (<2KB)

## Phase 2: Implementation Tasks

**Status**: Tasks will be generated by `/speckit.tasks` command (not included in `/speckit.plan` output)

**Preview** (for reference only):
1. Write tests for PlayerNameDisplay component (TDD)
2. Implement PlayerNameDisplay component
3. Integrate PlayerNameDisplay into HomePage
4. Integrate PlayerNameDisplay into PlayPage
5. Update tests for HomePage and PlayPage
6. Run quality checks (type-check, lint, test, build)
7. Regenerate API documentation
8. Manual browser testing (verify styling, truncation, responsiveness)

## Quickstart Guide

See [quickstart.md](./quickstart.md) for development setup and implementation steps.

## Re-evaluation: Constitution Check (Post-Design)

### Principle I: Test-First Development ✅ COMPLIANT
- **Status**: Enforced in Phase 2 tasks
- **Evidence**: 7 test cases defined before implementation, TDD workflow mandated

### Principle II: TypeScript Type Safety ✅ COMPLIANT
- **Status**: Fully type-safe design
- **Evidence**: `PlayerNameDisplayProps` interface exported, explicit return types, no `any` usage

### Principle III: Component-Based Architecture ✅ COMPLIANT
- **Status**: Single-responsibility component
- **Evidence**: PlayerNameDisplay focused solely on displaying player name, reusable across pages

### Principle IV: Automated Quality Gates ✅ COMPLIANT
- **Status**: All 4 commands required
- **Evidence**: Pre-commit hooks enforce type-check, lint, test, build

### Principle V: Documentation-Driven Development ✅ COMPLIANT
- **Status**: JSDoc required for component and props
- **Evidence**: Documentation templates included in component design, TypeDoc regeneration in tasks

### Principle VI: Retro Gaming UX ✅ COMPLIANT
- **Status**: Core design requirement
- **Evidence**: Pixel borders, retro color palette, text shadows, absolute positioning, 8-bit aesthetic maintained

### Summary: ✅ ALL GATES STILL PASSED
No violations introduced during design phase. Implementation can proceed.

---

**Plan Status**: ✅ COMPLETE - Ready for `/speckit.tasks` command

**Next Steps**:
1. Review this plan for approval
2. Run `/speckit.tasks` to generate actionable implementation tasks
3. Begin TDD workflow: Write tests → Implement → Verify quality gates
