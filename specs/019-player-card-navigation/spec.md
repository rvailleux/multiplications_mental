# Feature Specification: Player Card Navigation

**Feature Branch**: `019-player-card-navigation`
**Created**: 2026-02-04
**Status**: Draft
**Input**: User description: "Click on the current player card (top right of the screen) should navigate back to player selection screen"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Switch Player via Card Click (Priority: P1)

A player currently engaged in a game session wants to switch to a different player profile. They see their name displayed in the player card at the top right corner of the screen. They click on this card and are taken back to the player selection screen where they can choose a different player.

**Why this priority**: This is the core functionality requested. Without this, users must use keyboard shortcuts (ESC) to navigate back, which may not be intuitive for mouse/touch users, especially on iPad where keyboard isn't always available.

**Independent Test**: Can be fully tested by clicking the player card on any screen and verifying navigation to player selection screen.

**Acceptance Scenarios**:

1. **Given** a user is on the HomePage with a selected player, **When** they click on the player name card (top right), **Then** they are navigated to the player selection screen
2. **Given** a user is on the PlayPage (during active game), **When** they click on the player name card, **Then** they are navigated to the player selection screen (game session ends)
3. **Given** a user is on the GameResultsPage after completing a game, **When** they click on the player name card, **Then** they are navigated to the player selection screen

---

### User Story 2 - Visual Feedback on Hover (Priority: P2)

A user hovering their mouse over the player card should receive visual feedback indicating the card is clickable, maintaining the retro 8-bit aesthetic while providing clear interaction cues.

**Why this priority**: Important for discoverability and user experience, but the feature works without it. Visual affordance helps users understand the card is interactive.

**Independent Test**: Can be tested by hovering over the player card and observing visual changes (cursor, styling).

**Acceptance Scenarios**:

1. **Given** a user is on any screen showing the player card, **When** they hover their mouse over the card, **Then** the cursor changes to a pointer and the card displays a hover state (e.g., glow, color shift, or scale effect consistent with 8-bit aesthetic)
2. **Given** a user is viewing the player card, **When** they hover and then move the mouse away, **Then** the card returns to its normal visual state

---

### User Story 3 - Touch Support for iPad (Priority: P2)

Users on touch devices (iPad) can tap the player card to navigate to player selection, with appropriate touch feedback.

**Why this priority**: Equal priority with hover since iPad is a key target platform mentioned in the todo.md roadmap. Touch interaction must work seamlessly.

**Independent Test**: Can be tested on a touch device by tapping the player card.

**Acceptance Scenarios**:

1. **Given** a user is on any screen on a touch device, **When** they tap the player card, **Then** they are navigated to the player selection screen
2. **Given** a user is on a touch device, **When** they tap the player card, **Then** there is visual feedback (e.g., brief press state) before navigation

---

### Edge Cases

- What happens if the player card is clicked during an active game timer? Navigation should proceed immediately, ending the current game session without saving an incomplete score.
- What happens if user rapidly double-clicks the card? Navigation should only trigger once, preventing duplicate route changes.
- What happens on the PlayerSelectPage itself? The player card should not be displayed on the player selection screen (it currently isn't), so no action needed.

## E2E Test Scenarios *(mandatory)*

### E2E-US1-001: Click Player Card from HomePage

**User Story**: User Story 1 - Switch Player via Card Click

**Test Flow**:
1. **Navigate** to application home page with a selected player
   - Screenshot: `01-homepage-with-player.png`
2. **Verify** player card is visible in top right corner showing player name
3. **Mouse Interaction**: Click on the player card
   - Screenshot: `02-player-card-clicked.png`
4. **Verify State**: URL changed to player selection route (`/`)
5. **Verify** player selection screen is displayed with player options
   - Screenshot: `03-player-selection-screen.png`

**Expected Outcome**: User is navigated from HomePage to PlayerSelectPage after clicking the player card.

**Visual Validation**: Player card should be visible and clickable, player selection screen should display after click.

---

### E2E-US1-002: Click Player Card During Active Game

**User Story**: User Story 1 - Switch Player via Card Click

**Test Flow**:
1. **Navigate** to PlayPage with an active game in progress
   - Screenshot: `01-active-game.png`
2. **Verify** game timer is running and player card is visible
3. **Mouse Interaction**: Click on the player card
4. **Verify State**: Game ends and URL changes to player selection route
   - Screenshot: `02-navigated-to-selection.png`

**Expected Outcome**: Active game session ends immediately and user is taken to player selection without incomplete score being saved.

---

### E2E-US1-003: Click Player Card from Game Results

**User Story**: User Story 1 - Switch Player via Card Click

**Test Flow**:
1. **Navigate** to GameResultsPage after completing a game
   - Screenshot: `01-results-page.png`
2. **Mouse Interaction**: Click on the player card
3. **Verify State**: URL changed to player selection route
   - Screenshot: `02-player-selection.png`

**Expected Outcome**: User navigates from results screen to player selection.

---

### E2E-US2-001: Hover State on Player Card

**User Story**: User Story 2 - Visual Feedback on Hover

**Test Flow**:
1. **Navigate** to HomePage with a selected player
   - Screenshot: `01-homepage.png`
2. **Mouse Interaction**: Hover over the player card
   - Screenshot: `02-hover-state.png`
3. **Verify Visual**: Cursor changes to pointer, card shows hover styling
4. **Mouse Interaction**: Move mouse away from card
   - Screenshot: `03-normal-state.png`

**Expected Outcome**: Player card shows clear visual hover state with pointer cursor.

**Visual Validation**: Cursor should be pointer, card should have noticeable visual change (glow, color, or scale).

---

### E2E-US3-001: Touch Tap on Player Card (iPad)

**User Story**: User Story 3 - Touch Support for iPad

**Test Flow**:
1. **Navigate** to HomePage on touch device viewport
2. **Touch Interaction**: Tap on the player card
3. **Verify State**: Navigation to player selection occurs

**Expected Outcome**: Touch tap triggers same navigation as mouse click.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST make the player name card clickable on all screens where it is displayed (HomePage, PlayPage, GameResultsPage, CreditsPage)
- **FR-002**: System MUST navigate to the player selection screen (`/`) when the player card is clicked
- **FR-003**: System MUST display a pointer cursor when hovering over the player card
- **FR-004**: System MUST display a visual hover state on the player card consistent with 8-bit retro aesthetic
- **FR-005**: System MUST support touch/tap interaction on the player card for touch devices
- **FR-006**: System MUST end any active game session when player card is clicked during gameplay (no incomplete score saved)
- **FR-007**: System MUST prevent duplicate navigation events from rapid clicks (debounce or single-trigger)

### Key Entities *(include if feature involves data)*

- **PlayerNameDisplay Component**: Existing component that displays player name in top right corner. Will be enhanced to support click interaction and navigation.
- **Navigation State**: React Router navigation used to redirect to player selection route.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can switch players with a single click/tap on the player card, completing the action in under 1 second
- **SC-002**: 100% of screens displaying the player card support the click-to-navigate functionality
- **SC-003**: Visual hover feedback is visible and recognizable within 100ms of mouse entering the card area
- **SC-004**: Touch interaction works identically to click on all supported touch devices
- **SC-005**: Zero incomplete game scores are saved when player exits via card click during active gameplay
