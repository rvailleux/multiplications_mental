# Research: Player Name Display on All Screens

**Feature**: 010-player-name-display
**Date**: 2026-01-15
**Status**: Completed

## Overview

This document consolidates research findings for implementing a persistent player name display component in the top right corner of game screens (HomePage, PlayPage). All research questions from Phase 0 planning have been resolved with concrete decisions, rationales, and implementation strategies.

## Research Questions & Decisions

### RQ-001: Text Truncation Strategy

**Question**: How to implement responsive text truncation with ellipsis in CSS-in-JS while maintaining pixel-perfect retro aesthetic?

**Decision**: Use CSS `textOverflow: 'ellipsis'`, `overflow: 'hidden'`, `whiteSpace: 'nowrap'` combined with `maxWidth` constraint

**Rationale**:
- Standard CSS approach that works across all browsers without polyfills
- Maintains layout integrity by preventing text overflow
- Automatically handles dynamic viewport changes without JavaScript
- Preserves retro aesthetic by allowing precise width control
- No additional bundle size impact (pure CSS solution)

**Alternatives Considered**:
1. **JavaScript string slicing**:
   - Requires state management and re-rendering logic
   - Doesn't adapt to font size changes or viewport resizing
   - Adds unnecessary complexity to a simple display component
   - **Rejected**: Over-engineered for a pure presentation concern

2. **CSS `@supports` with fallback**:
   - Modern browsers universally support text-overflow
   - Adds unnecessary code for no practical benefit
   - **Rejected**: Over-engineered for well-supported CSS features

**Implementation**:
```typescript
const styles = {
  playerNameText: {
    maxWidth: '200px',
    overflow: 'hidden' as const,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  }
}
```

**Testing Strategy**: Visual inspection + snapshot test to verify truncation behavior

---

### RQ-002: Positioning Strategy

**Question**: What is the optimal positioning strategy to avoid layout conflicts with existing page elements (clouds, header, character sprites)?

**Decision**: Absolute positioning with `position: 'absolute'`, `top: '20px'`, `right: '20px'`, `zIndex: 100`

**Rationale**:
- Removes component from normal document flow, preventing layout disruption
- Matches existing sprite positioning patterns (e.g., character sprite at bottom right)
- Parent containers (HomePage.tsx, PlayPage.tsx) already have `position: 'relative'` in `styles.gameContainer`
- Predictable positioning across different viewport sizes
- No impact on flexbox/grid layouts of other elements

**Alternatives Considered**:
1. **Fixed positioning (`position: 'fixed'`)**:
   - Would stay visible during scrolling
   - Current pages don't scroll, making this unnecessary
   - Could cause issues if future features add scrolling
   - **Rejected**: Over-engineered for current requirements

2. **Flexbox positioning within gameHeader**:
   - Would require restructuring existing gameHeader layout
   - Affects spacing of existing elements (title, subtitle)
   - Harder to maintain consistent positioning across HomePage/PlayPage
   - **Rejected**: Violates "avoid over-engineering" principle, disrupts existing layouts

**Implementation**:
```typescript
const styles = {
  playerNameContainer: {
    position: 'absolute' as const,
    top: '20px',
    right: '20px',
    zIndex: 100,
  }
}
```

**Verification**: Existing parent containers already use `position: 'relative'` (HomePage.tsx line 163, PlayPage.tsx similar pattern)

---

### RQ-003: Component Reusability

**Question**: Should PlayerNameDisplay be a reusable component or page-specific implementation?

**Decision**: Reusable component in `src/components/PlayerNameDisplay.tsx`

**Rationale**:
- **Single Responsibility Principle**: Component does one thing (display player name)
- **DRY (Don't Repeat Yourself)**: Avoid duplicating styling and logic across pages
- **Easier testing**: Test once in isolation, not in each page integration test
- **Future-proof**: If additional pages are added, component is ready for reuse
- **Consistency**: Guarantees identical appearance and behavior across all screens

**Alternatives Considered**:
1. **Inline implementation in each page**:
   - Code duplication (same JSX and styles in HomePage.tsx and PlayPage.tsx)
   - Harder to maintain consistency (style changes require updating multiple files)
   - Violates DRY principle
   - **Rejected**: Increases technical debt and maintenance burden

2. **Higher-order component (HOC) wrapper**:
   - Over-engineered for a simple display component
   - Adds unnecessary abstraction layers
   - Harder to understand for future developers
   - **Rejected**: Violates "avoid over-engineering" principle

**Implementation**:
- Create `src/components/PlayerNameDisplay.tsx`
- Export interface `PlayerNameDisplayProps`
- Import in `src/pages/HomePage.tsx` and `src/pages/PlayPage.tsx`
- Pass `player` prop from parent pages (result of `getCurrentPlayer()`)

**Benefit Analysis**:
- Lines of code: ~50 lines (component) vs ~100 lines (duplicate inline implementations)
- Maintenance effort: Single file vs 2+ files
- Test coverage: 1 component test suite vs multiple integration test suites

---

### RQ-004: Special Characters Handling

**Question**: How to handle edge case where player name contains emojis or special Unicode characters?

**Decision**: No special handling required - React automatically escapes and renders text safely

**Rationale**:
- React's default JSX text rendering escapes dangerous characters (prevents XSS)
- Modern browsers natively support Unicode characters and emojis
- CSS `font-family` inherits from parent, supporting system fonts with emoji rendering
- No security concerns with localStorage data (same-origin policy isolation)
- Existing player selection allows special characters without validation

**Alternatives Considered**:
1. **Emoji detection and removal**:
   - Unnecessary restriction on user input
   - Reduces user expression and personalization
   - Requires regex patterns or Unicode libraries (bundle size increase)
   - **Rejected**: No technical or UX justification for removing valid characters

2. **Special Unicode sanitization**:
   - React already sanitizes to prevent XSS attacks
   - Over-engineered for no security benefit
   - **Rejected**: Duplicate existing React safety mechanisms

**Implementation**:
```tsx
<span style={styles.playerNameText}>{player.name}</span>
```
Standard JSX text rendering without preprocessing or sanitization.

**Test Case**: Include test with special characters (`'日本語 🎮'`) to verify correct rendering

---

### RQ-005: Z-Index Layering

**Question**: What z-index value ensures player name displays above decorative elements (clouds, sprites) but doesn't interfere with modals/overlays?

**Decision**: `zIndex: 100` for player name display

**Rationale**:
- **Higher than decorative elements**: Clouds (no z-index, default 0), character sprite (no z-index, default 0)
- **Lower than potential future modals**: Conventional modal z-index ranges (1000+)
- **Room for intermediate layers**: Space between 100-1000 for future UI elements (tooltips ~200, dropdowns ~500)
- **Predictable stacking context**: Avoids z-index wars with high arbitrary values

**Alternatives Considered**:
1. **`zIndex: 1`**:
   - Too low, might conflict with future positioned elements
   - No safety margin for intermediate layers
   - **Rejected**: Insufficient separation from default stacking order

2. **`zIndex: 9999`**:
   - Unnecessarily high, common anti-pattern
   - Could interfere with future modals/overlays
   - Makes future z-index management difficult
   - **Rejected**: Violates best practices for z-index management

**Implementation**:
```typescript
const styles = {
  playerNameContainer: {
    position: 'absolute' as const,
    top: '20px',
    right: '20px',
    zIndex: 100,
  }
}
```

**Reference**: Existing cloud elements use no z-index (default 0), character sprite at bottom also uses no z-index

---

## Best Practices Research

### BP-001: React Component Testing

**Topic**: React component testing with React Testing Library (RTL)

**Key Findings**:
1. **User-centric testing**: Test what users see/interact with, not implementation details
2. **Query priorities**:
   - `screen.getByText()` for visible text content
   - `screen.queryByText()` for conditional rendering checks (returns null if not found)
3. **Mocking strategy**:
   - Props-based testing: Pass mock data via props (preferred for reusable components)
   - Module mocking: Use `vi.mock()` for external dependencies only when necessary
4. **Snapshot testing**: Useful for visual regression detection, but combine with specific assertions
5. **Co-location pattern**: Tests live next to components (`Component.test.tsx`)

**Source**:
- Existing test patterns in `src/components/MultiplicationQuestion.test.tsx`
- React Testing Library documentation
- Project testing standards (Vitest + Happy-DOM)

**Application to PlayerNameDisplay**:
```typescript
// Test structure preview
describe('PlayerNameDisplay', () => {
  it('should render player name when player exists', () => {
    render(<PlayerNameDisplay player={{ id: 'jules', name: 'Jules' }} />)
    expect(screen.getByText('Jules')).toBeInTheDocument()
  })

  it('should render nothing when player is null', () => {
    const { container } = render(<PlayerNameDisplay player={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('should truncate long names with ellipsis', () => {
    render(<PlayerNameDisplay player={{ id: 'test', name: 'VeryLongPlayerNameThatExceeds' }} />)
    // Verify text is present (React renders full string, CSS truncates visually)
    expect(screen.getByText('VeryLongPlayerNameThatExceeds')).toBeInTheDocument()
  })
})
```

---

### BP-002: CSS-in-JS Retro Styling Patterns

**Topic**: CSS-in-JS styling patterns for retro pixel art aesthetic

**Key Findings**:
1. **Pixel borders**: Use multiples of 4px for pixel-perfect appearance (`border: '4px solid #000'`)
2. **Text shadows**: Solid shadows without blur for retro depth effect (`textShadow: '2px 2px 0 #000'`)
3. **Box shadows**: Inset shadows for 3D button effects (`boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.5)'`)
4. **Color palette**: Consistent use of project colors:
   - Primary red: `#ff6b6b` (headers, titles)
   - Accent teal: `#4ecdc4` (buttons, interactive elements)
   - Gold: `#ffd700` (scores, highlights)
   - Black: `#000` (borders, shadows)
   - White: `#fff` (backgrounds, text)
5. **TypeScript typing**: Use `as const` for CSS property values to enable type safety
6. **Gradients**: Linear gradients for depth (`linear-gradient(180deg, #ff6b6b 0%, #ee5a5a 100%)`)

**Source**:
- Existing styles in `src/pages/HomePage.tsx` (lines 151-284)
- Existing styles in `src/pages/PlayPage.tsx` (similar patterns)

**Application to PlayerNameDisplay**:
```typescript
const styles = {
  playerNameContainer: {
    position: 'absolute' as const,
    top: '20px',
    right: '20px',
    zIndex: 100,
    background: 'linear-gradient(180deg, #4ecdc4 0%, #44b3aa 100%)',
    border: '4px solid #000',
    padding: '8px 16px',
    boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.3)',
  },
  playerNameText: {
    color: '#fff',
    fontSize: '14px',
    textShadow: '2px 2px 0 #000',
    maxWidth: '200px',
    overflow: 'hidden' as const,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    fontWeight: 'bold' as const,
  }
}
```

**Design Rationale**:
- Teal gradient matches existing buttons (`styles.pixelButton` in HomePage)
- White text with black shadow ensures readability against gradient background
- 4px border maintains pixel-perfect theme consistency
- Padding (8px, 16px) provides comfortable hit area while staying compact

---

### BP-003: Component Props Interface Design

**Topic**: Props interface design for display-only components

**Key Findings**:
1. **Zero-props pattern**: Components can retrieve data internally if tightly coupled to context
2. **Props-based pattern**: Accept data as props for better testability and reusability (preferred)
3. **Optional vs required props**: Use `Type | null` for optional data that affects rendering
4. **JSDoc documentation**: Document each prop with `@param` or inline comments in interface

**Source**:
- React component best practices
- Existing project patterns (MultiplicationQuestion accepts `onCorrect`, `onBad` callbacks)

**Decision for PlayerNameDisplay**: Accept `player` as prop for testing flexibility

**Rationale**:
- **Testability**: Easy to pass mock player objects in tests without mocking `getCurrentPlayer()`
- **Reusability**: Component doesn't assume data source, can be used in different contexts
- **Separation of concerns**: Parent pages handle data fetching, component handles presentation
- **Follows existing patterns**: MultiplicationQuestion receives callbacks as props, not internal state

**Implementation**:
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

**Alternative (rejected)**: Zero-props component that calls `getCurrentPlayer()` internally
- **Downside**: Harder to test (requires mocking `getCurrentPlayer()` module)
- **Downside**: Less reusable (tightly coupled to localStorage implementation)

---

## Summary

All research questions resolved with concrete implementation strategies. Key decisions:

1. **Truncation**: CSS-only solution with `textOverflow: 'ellipsis'`
2. **Positioning**: Absolute positioning at `top: 20px, right: 20px, zIndex: 100`
3. **Architecture**: Reusable component in `src/components/`
4. **Special characters**: No preprocessing, rely on React's safe rendering
5. **Styling**: Retro pixel aesthetic with teal gradient, 4px borders, text shadows
6. **Testing**: Props-based approach for better testability

**Design Status**: ✅ Ready for implementation
**Next Phase**: Generate data model and quickstart guide
