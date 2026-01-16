# Feature Specification: Player Name Display on All Screens

**Feature Branch**: `010-player-name-display`
**Created**: 2026-01-15
**Status**: Draft
**Input**: User description: "Add current players name on all screens at the top right."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Player Identity Awareness (Priority: P1)

As a player, when I navigate through different screens of the game (HomePage, PlayPage), I want to see my name consistently displayed at the top right of every screen so that I always know which player account I'm using.

**Why this priority**: Core feature that provides essential context to players throughout their gaming session. Without this, players cannot confirm their identity, especially in multi-player households.

**Independent Test**: Can be fully tested by logging in as a player and navigating between HomePage and PlayPage. Player name should be visible on both screens in the top right corner. Delivers immediate value by eliminating player confusion.

**Acceptance Scenarios**:

1. **Given** I am on the HomePage after selecting player "Jules", **When** I look at the top right corner of the screen, **Then** I see "Jules" displayed
2. **Given** I am on the PlayPage during an active game as player "Achille", **When** I look at the top right corner, **Then** I see "Achille" displayed
3. **Given** I navigate from HomePage to PlayPage, **When** I observe the top right corner on both screens, **Then** the same player name persists across both screens

---

### User Story 2 - Visual Consistency with Retro Aesthetic (Priority: P2)

As a player who enjoys the retro gaming aesthetic, I want the player name display to match the existing pixel art style (8-bit font, retro color scheme) so that the interface feels cohesive and immersive.

**Why this priority**: Enhances user experience by maintaining visual consistency with established design language. Not critical for functionality but important for polish and user engagement.

**Independent Test**: Can be tested by viewing the player name display on any screen and verifying it uses the same visual style (fonts, colors, pixel borders) as other UI elements. Delivers value by creating a professional, polished experience.

**Acceptance Scenarios**:

1. **Given** the player name is displayed on screen, **When** I compare its visual style to other text elements, **Then** the font, color scheme, and styling match the retro 8-bit aesthetic
2. **Given** I am viewing the player name display, **When** I check its visual appearance, **Then** it uses pixel-perfect rendering consistent with the game's pixel art theme
3. **Given** the interface uses a specific color palette for UI elements, **When** the player name is rendered, **Then** it uses colors from the same palette

---

### User Story 3 - Responsive Positioning (Priority: P3)

As a player using different screen sizes or devices, I want the player name display to remain visible and properly positioned in the top right corner regardless of viewport dimensions so that the information is always accessible.

**Why this priority**: Ensures accessibility across devices but is lower priority than core functionality. Most players will use desktop browsers with consistent screen sizes.

**Independent Test**: Can be tested by resizing the browser window or viewing on different devices. Player name should remain in top right corner without overlapping other elements. Delivers value for mobile/tablet users.

**Acceptance Scenarios**:

1. **Given** I am viewing the game on a desktop browser, **When** I resize the window to different dimensions, **Then** the player name remains in the top right corner without overlapping other content
2. **Given** I am on a mobile device in portrait orientation, **When** I view the HomePage or PlayPage, **Then** the player name is visible in the top right corner
3. **Given** the screen width is very narrow, **When** the player name display is rendered, **Then** it truncates gracefully or wraps without breaking the layout

---

### Edge Cases

- What happens when a player has a very long name (e.g., 20+ characters)?
  - Display should truncate with ellipsis or wrap to maintain layout integrity
- What happens when no player is currently selected?
  - Player name should not be displayed (or show a default placeholder like "Guest")
- What happens on the PlayerSelectPage?
  - Player name should NOT be displayed since the user is actively choosing a player
- What happens when a player name contains special characters or emojis?
  - Display should render characters correctly without breaking the layout

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display the current player's name on the HomePage in the top right corner of the screen
- **FR-002**: System MUST display the current player's name on the PlayPage in the top right corner of the screen
- **FR-003**: System MUST NOT display the player name on the PlayerSelectPage (since player is being selected)
- **FR-004**: System MUST retrieve the current player name from localStorage using the existing `getCurrentPlayer()` utility function
- **FR-005**: System MUST display the player name consistently across all applicable screens using the same visual styling
- **FR-006**: Player name display MUST use retro 8-bit pixel art styling matching the existing game aesthetic (pixel fonts, retro color palette)
- **FR-007**: Player name display MUST be positioned in the top right corner with appropriate spacing from screen edges and other UI elements
- **FR-008**: System MUST handle missing or null player data gracefully (e.g., show nothing or default text if no player selected)
- **FR-009**: Player name display MUST truncate long names (>12 characters) with ellipsis to prevent layout overflow
- **FR-010**: Player name display MUST be visible and non-interactive (display-only, no click handlers required)

### Key Entities

- **CurrentPlayer**: The player object retrieved from localStorage containing `id` (unique identifier) and `name` (display name). Represents the actively logged-in player whose name should be displayed across screens.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can identify which player account is active by viewing the top right corner of any game screen within 1 second
- **SC-002**: Player name display appears consistently in the exact same position (top right corner) across 100% of applicable screens (HomePage, PlayPage)
- **SC-003**: Visual styling of player name matches the existing retro 8-bit aesthetic with pixel-perfect font rendering
- **SC-004**: Player name display does not cause layout overflow or visual glitches on screens with widths between 320px (mobile) and 1920px (desktop)
- **SC-005**: Player name updates immediately (within 100ms) when a new player is selected from PlayerSelectPage and navigates to HomePage
- **SC-006**: 95% of user testing participants can correctly identify which player account is active without confusion or hesitation
- **SC-007**: Player name display maintains readability and visibility against all background variations used in the game screens
