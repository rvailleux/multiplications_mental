# Feature Specification: Player Selection System

**Feature Branch**: `001-player-selection`
**Created**: 2026-01-14
**Status**: Implemented
**Input**: User description: "Create a player selection screen where users can choose between predefined players (Jules and Achille) before starting the game. Users should be able to navigate the list using arrow keys (up/down) and confirm selection with Enter key or mouse click. The selected player should be saved and persist across sessions. The screen should use a retro NES-style pixel art design with visual highlighting for the currently selected player."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - First-Time Player Selection (Priority: P1)

When a new user launches the game for the first time, they need to select which player they are before they can start playing. The system should present a clear, intuitive selection screen that works with both keyboard and mouse.

**Why this priority**: This is the entry point to the entire application. Without player selection, users cannot access any other features. This is the minimum viable product (MVP) that gates all other functionality.

**Independent Test**: Can be fully tested by launching the application without any prior localStorage data, selecting a player using keyboard or mouse, and verifying the selection persists and allows navigation to the home screen.

**Acceptance Scenarios**:

1. **Given** no player has been selected previously, **When** the user launches the application, **Then** they see the PlayerSelectPage with two players (Jules and Achille) displayed
2. **Given** the PlayerSelectPage is displayed, **When** the user presses the down arrow key, **Then** the visual selection cursor (▶) moves from Jules to Achille
3. **Given** Achille is visually selected, **When** the user presses the up arrow key, **Then** the cursor moves back to Jules
4. **Given** Jules is selected, **When** the user presses Enter, **Then** Jules is saved to localStorage and the user is navigated to /home
5. **Given** the PlayerSelectPage is displayed, **When** the user clicks directly on Achille's card, **Then** Achille is selected, saved, and the user is navigated to /home

---

### User Story 2 - Persistent Player Identity (Priority: P2)

When a user has previously selected a player, the system should remember their choice across browser sessions. When they return, they should see their selected player's name displayed on the home screen without having to reselect.

**Why this priority**: This provides continuity and personalization to the user experience. Users shouldn't have to reselect their identity every time they use the application. However, this is secondary to the initial selection flow.

**Independent Test**: Can be tested by selecting a player, closing the browser, reopening the application, and verifying the HomePage displays the correct player name without requiring reselection.

**Acceptance Scenarios**:

1. **Given** Jules has been selected in a previous session, **When** the user navigates to /home, **Then** they see "Welcome Jules!" without being redirected to player selection
2. **Given** no player is currently selected, **When** the user attempts to navigate directly to /home, **Then** they are redirected to the PlayerSelectPage (/)
3. **Given** Achille was selected previously, **When** the application loads localStorage data, **Then** currentPlayer is set to 'achille' and subsequent pages use this data

---

### User Story 3 - Retro Gaming Aesthetic (Priority: P3)

The player selection screen should provide a visually appealing retro gaming experience reminiscent of NES-era games, creating an engaging and nostalgic atmosphere that sets the tone for the math game.

**Why this priority**: Visual polish enhances user engagement and makes the experience memorable, but the core functionality (selection and persistence) is more critical. This can be refined after basic functionality works.

**Independent Test**: Can be tested by visual inspection of the PlayerSelectPage, verifying pixel art styling, animations (bounce, float), color schemes, borders, and retro typography are present and working.

**Acceptance Scenarios**:

1. **Given** the PlayerSelectPage is displayed, **When** the user observes the visual design, **Then** they see pixel-art style borders (8px solid black), retro color gradients, and shadow effects
2. **Given** a player card is selected, **When** the selection state changes, **Then** the selected card displays a golden gradient background, special border color (#b8860b), and glow effect
3. **Given** the page is rendered, **When** observing animations, **Then** the mushroom character and cursor exhibit a bouncing animation, and clouds float across the screen
4. **Given** the user views the title and instructions, **When** reading text elements, **Then** they see text with retro-style shadows, appropriate emoji decorations (⭐, 🚀, 🍄, ☁️), and clear typography

---

### Edge Cases

- What happens when the user tries to navigate up from the first player (Jules)?
  - The selection stays on the first player without wrapping
- What happens when the user tries to navigate down from the last player (Achille)?
  - The selection stays on the last player without wrapping
- What happens if localStorage is corrupted or contains invalid player data?
  - The system falls back to default players (Jules and Achille) via error handling in getPlayers()
- What happens if a previously selected player no longer exists in the players array?
  - getCurrentPlayer() returns null, triggering a redirect to player selection
- What happens if the user presses keys other than Arrow keys or Enter?
  - The keys are ignored; only ArrowUp, ArrowDown, and Enter are handled

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a player selection screen as the default route (/) of the application
- **FR-002**: System MUST provide two predefined default players: Jules (id: 'jules') and Achille (id: 'achille')
- **FR-003**: System MUST support keyboard navigation using Arrow Up and Arrow Down keys to move between players
- **FR-004**: System MUST support selection confirmation using the Enter key
- **FR-005**: System MUST support mouse-click selection by clicking directly on a player card
- **FR-006**: System MUST visually indicate the currently selected player with a cursor symbol (▶) and distinct styling
- **FR-007**: System MUST persist the selected player ID to localStorage under the key 'currentPlayer'
- **FR-008**: System MUST persist the list of available players to localStorage under the key 'players'
- **FR-009**: System MUST initialize default players in localStorage if no players data exists
- **FR-010**: System MUST navigate to /home after a player is successfully selected
- **FR-011**: System MUST redirect users from /home back to / if no player is currently selected
- **FR-012**: System MUST prevent navigation beyond the first player (no wrap-around at top)
- **FR-013**: System MUST prevent navigation beyond the last player (no wrap-around at bottom)
- **FR-014**: System MUST display clear keyboard navigation instructions ("↑ ↓ Arrow Keys to Navigate", "↵ Enter to Select")
- **FR-015**: System MUST apply retro NES-style pixel art aesthetics including thick borders, shadow effects, and retro color schemes
- **FR-016**: System MUST apply distinct visual styling to the selected player card (golden gradient, glow effect, scale transformation)

### Key Entities

- **Player**: Represents a user identity in the game
  - Attributes: id (unique string identifier), name (display name)
  - Persistence: Stored in localStorage under 'players' key as JSON array
  - Default instances: [{ id: 'jules', name: 'Jules' }, { id: 'achille', name: 'Achille' }]

- **Current Player Selection**: Represents the currently active player
  - Persistence: Stored in localStorage under 'currentPlayer' key as a string ID
  - Relationship: References a Player by ID
  - Lifetime: Persists across browser sessions until explicitly changed

- **Selection State**: Represents the temporary UI selection state (keyboard navigation)
  - Attributes: selectedIndex (number, 0-based index into players array)
  - Lifetime: Component-level state, resets when component unmounts
  - Initial value: 0 (first player) or the index of the current player if one exists

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully select a player using keyboard navigation (Arrow keys + Enter) within 5 seconds of first viewing the screen
- **SC-002**: Users can successfully select a player using mouse click within 2 seconds of first viewing the screen
- **SC-003**: Selected player data persists correctly across browser sessions 100% of the time (verified by closing and reopening the application)
- **SC-004**: The system correctly redirects users to player selection when accessing protected routes without a selected player 100% of the time
- **SC-005**: All visual elements (borders, shadows, gradients, animations) render consistently across modern browsers (Chrome, Firefox, Safari, Edge)
- **SC-006**: The component passes all automated tests including navigation boundaries, selection persistence, and keyboard/mouse interaction
- **SC-007**: localStorage operations handle errors gracefully and fall back to default players when data is corrupted
- **SC-008**: The selected player's name displays correctly on the HomePage after selection ("Welcome [PlayerName]!")
- **SC-009**: Arrow key navigation respects boundaries (no errors when trying to navigate beyond first or last player)
- **SC-010**: Component properly cleans up keyboard event listeners on unmount to prevent memory leaks

## Technical Implementation Notes

### Components

**PlayerSelectPage** (`src/pages/PlayerSelectPage.tsx`)
- Route: `/` (default route)
- Responsibilities: Display player list, handle keyboard/mouse input, navigate to /home on selection
- Dependencies: usePlayerManagement hook, react-router-dom (useNavigate)

### Hooks

**usePlayerManagement** (`src/hooks/usePlayerManagement.ts`)
- Purpose: Manage player selection state and localStorage persistence
- Returns: { players, currentPlayer, selectedIndex, setSelectedIndex, selectPlayer, hasPlayerSelected }
- Side effects: Initializes localStorage with default players if needed

### Type Utilities

**Player type utilities** (`src/types/player.ts`)
- Functions: getPlayers(), getCurrentPlayerId(), setCurrentPlayerId(), getCurrentPlayer(), initializePlayers()
- Error handling: Falls back to default players on localStorage errors

### Styling Approach

- CSS-in-JS using inline style objects
- Retro NES aesthetic with:
  - 8px solid black borders
  - Multiple layered box-shadows for 3D effects
  - Gradient backgrounds (red header, blue cards, golden selection, teal instructions)
  - Text shadows for depth
  - Animations (bounce for character/cursor, float for clouds)
  - Emoji decorations for visual interest

### Testing

**PlayerSelectPage.test.tsx**
- Coverage: Rendering, keyboard navigation (up/down/enter), mouse click selection, boundary cases, localStorage persistence, default player initialization
- Mocks: useNavigate from react-router-dom
- Test utilities: render with BrowserRouter wrapper

### localStorage Schema

```typescript
// Key: 'players'
// Value: Array of Player objects
[
  { "id": "jules", "name": "Jules" },
  { "id": "achille", "name": "Achille" }
]

// Key: 'currentPlayer'
// Value: String player ID
"jules"
```

### Accessibility Considerations

- Keyboard navigation fully supported (arrow keys, enter)
- Visual cursor indicator (▶) shows current selection
- Clear text instructions for keyboard controls
- High contrast styling for visibility
- Hover states for mouse users (click target clear)

### Future Enhancements (Out of Scope)

- Dynamic player addition (allowing users to create new players)
- Player avatars/icons beyond emoji
- Player deletion/management interface
- Multi-language support for player names
- Voice/audio feedback for selection
- Gamepad/controller support
