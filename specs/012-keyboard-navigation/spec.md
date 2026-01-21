# Feature Specification: Enhanced Keyboard Navigation with Pause Menu

**Feature Branch**: `012-keyboard-navigation`
**Created**: 2026-01-18
**Status**: Draft
**Input**: User description: "Enhanced keyboard navigation with ESC pause menu and unified jumping arrow UI pattern"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Pause Game During Play (Priority: P1)

During an active game session, players need the ability to pause and choose whether to continue playing or quit. Players press the ESC key to open a pause menu that displays in a retro 8-bit/SNES style with a zoom/splash animation. The menu presents two options: "Quit Game" and "Continue Playing". Players navigate between options using arrow keys, with a jumping arrow indicator showing the selected option. Pressing Enter confirms the selection.

**Why this priority**: Core safety feature that prevents accidental game loss. Players may need to pause for interruptions without losing their progress. This is a fundamental UX expectation in gaming.

**Independent Test**: Can be fully tested by starting a game, pressing ESC, and verifying the pause menu appears with keyboard navigation working correctly. Delivers immediate value by allowing players to safely interrupt gameplay.

**Acceptance Scenarios**:

1. **Given** a player is in an active game session, **When** player presses ESC key, **Then** game timer pauses and pause menu appears with zoom/splash animation
2. **Given** pause menu is displayed, **When** player uses up/down arrow keys, **Then** jumping arrow moves between "Quit Game" and "Continue Playing" options
3. **Given** "Continue Playing" is selected, **When** player presses Enter, **Then** pause menu closes and game timer resumes
4. **Given** "Quit Game" is selected, **When** player presses Enter, **Then** current game ends and player returns to home screen
5. **Given** pause menu is displayed, **When** player presses ESC again, **Then** pause menu closes and game timer resumes (ESC acts as cancel)

---

### User Story 2 - Unified Jumping Arrow Navigation (Priority: P2)

All interactive elements across all screens use a consistent jumping arrow to indicate the selected option. On the home screen, the "Start Game" button shows a jumping arrow when focused. On the play screen, "Valider" and "Restart" buttons can be selected with up/down arrows, with the jumping arrow showing which is active. The jumping arrow provides visual consistency and clear feedback matching the retro gaming aesthetic.

**Why this priority**: Creates consistent UX patterns across the entire application. Players learn one navigation pattern that works everywhere. Essential for accessibility and usability.

**Independent Test**: Can be tested by navigating through each screen and verifying the jumping arrow appears and animates consistently on all interactive elements. Delivers value by making navigation intuitive and predictable.

**Acceptance Scenarios**:

1. **Given** player is on home screen, **When** "Start Game" button is focused, **Then** jumping arrow appears before the button text
2. **Given** player is on play screen with input field active, **When** player presses up/down arrow, **Then** focus moves to "Valider" or "Restart" buttons with jumping arrow indicator
3. **Given** "Valider" button is selected, **When** player presses down arrow, **Then** jumping arrow moves to "Restart" button
4. **Given** "Restart" button is selected, **When** player presses up arrow, **Then** jumping arrow moves to "Valider" button
5. **Given** player is on any screen with jumping arrow, **When** arrow is displayed, **Then** arrow animates with continuous bounce/jump motion

---

### User Story 3 - Enhanced Play Screen Input Handling (Priority: P2)

During gameplay, players can seamlessly input answers and navigate between validation and restart options using keyboard only. Typing any number automatically focuses the answer input field and enters the digit. Backspace works naturally within the input field. Up/down arrows switch focus between the input field and action buttons. At all times, keyboard hints are displayed at the bottom of the screen showing available keys.

**Why this priority**: Eliminates need for mouse, creating pure keyboard-driven gameplay. Faster input and better retro gaming feel. Keyboard hints reduce learning curve.

**Independent Test**: Can be tested by playing a game and verifying all input methods work without touching the mouse. Delivers value by enabling faster, more accessible gameplay.

**Acceptance Scenarios**:

1. **Given** player is on play screen, **When** player types any digit (0-9), **Then** input field automatically receives focus and digit is entered
2. **Given** player is typing in input field, **When** player presses Backspace, **Then** last digit is deleted as expected
3. **Given** input field is focused, **When** player presses up arrow, **Then** focus moves to "Valider" button with jumping arrow indicator
4. **Given** "Valider" button is focused, **When** player presses down arrow, **Then** focus moves to "Restart" button
5. **Given** any button is focused, **When** player types a digit, **Then** focus returns to input field and digit is entered
6. **Given** player is on any screen, **When** screen loads, **Then** keyboard hints display at bottom showing available keys (e.g., "ESC: Pause | ↑↓: Navigate | Enter: Confirm")

---

### User Story 4 - Keyboard Hints on All Screens (Priority: P3)

Every screen in the application displays context-appropriate keyboard hints at the bottom, outside the main game container. Hints show what keys are available on the current screen (e.g., "ESC: Back | ↑↓: Navigate | Enter: Select" on player selection, "ESC: Pause | Type: Answer | Enter: Submit" on play screen). Hints use retro styling consistent with the overall aesthetic.

**Why this priority**: Reduces learning curve for new players and serves as quick reference. Improves discoverability of keyboard shortcuts. Nice-to-have that enhances UX but not critical for core functionality.

**Independent Test**: Can be tested by navigating through each screen and verifying appropriate hints are displayed. Delivers value by making keyboard-only navigation self-documenting.

**Acceptance Scenarios**:

1. **Given** player is on player selection screen, **When** screen loads, **Then** hints display "↑↓: Navigate | Enter: Select | ESC: Exit"
2. **Given** player is on home screen, **When** screen loads, **Then** hints display "Enter: Start Game | ESC: Change Player"
3. **Given** player is on play screen, **When** screen loads, **Then** hints display "Type: Answer | Enter: Submit | ESC: Pause | ↑↓: Navigate"
4. **Given** pause menu is open, **When** menu displays, **Then** hints display "↑↓: Navigate | Enter: Confirm | ESC: Cancel"
5. **Given** player is on game results screen, **When** screen loads, **Then** hints display "Enter: Continue | ESC: Change Player"
6. **Given** keyboard hints are displayed, **When** viewed, **Then** hints appear outside main game container in consistent position and retro styling

---

### Edge Cases

- What happens when player presses ESC while pause menu is already open? (Menu should close, game resumes - ESC acts as toggle/cancel)
- What happens when player tries to type letters instead of numbers on play screen? (Letters should be ignored, only digits 0-9 accepted)
- What happens when input field is empty and player presses Backspace? (No error, Backspace has no effect)
- What happens if player rapidly presses up/down arrows? (Navigation should handle rapid input smoothly without visual glitches)
- What happens to jumping arrow animation when switching between options quickly? (Animation should reset/restart on each focus change)
- What happens when pause menu is open and timer reaches zero? (Game should remain paused until player makes selection)
- What happens if player presses Enter while no option is focused? (Should default to last valid focus or first option)

## Requirements *(mandatory)*

### Functional Requirements

#### Pause Menu (ESC Key)

- **FR-001**: System MUST pause game timer when ESC key is pressed during active gameplay
- **FR-002**: System MUST display pause menu overlay with zoom/splash animation when ESC is pressed
- **FR-003**: Pause menu MUST use 8-bit/SNES retro styling consistent with existing game aesthetic
- **FR-004**: Pause menu MUST present two options: "Quit Game" and "Continue Playing"
- **FR-005**: System MUST allow players to navigate between pause menu options using up/down arrow keys
- **FR-006**: System MUST display jumping arrow indicator on currently selected pause menu option
- **FR-007**: System MUST close pause menu and resume game when "Continue Playing" is selected and Enter is pressed
- **FR-008**: System MUST close pause menu and resume game when ESC is pressed while menu is open (ESC as cancel)
- **FR-009**: System MUST end current game and return to home screen when "Quit Game" is selected and Enter is pressed
- **FR-010**: System MUST prevent game timer from advancing while pause menu is displayed

#### Unified Jumping Arrow Navigation

- **FR-011**: System MUST display jumping arrow indicator before all interactive elements when focused/selected
- **FR-012**: Jumping arrow MUST animate with continuous bounce/jump motion matching existing player selection animation
- **FR-013**: System MUST apply jumping arrow to "Start Game" button on home screen when focused
- **FR-014**: System MUST apply jumping arrow to "Valider" and "Restart" buttons on play screen when focused
- **FR-015**: System MUST allow up/down arrow keys to switch focus between "Valider" and "Restart" buttons on play screen
- **FR-016**: System MUST visually distinguish focused button with jumping arrow indicator
- **FR-017**: Jumping arrow animation MUST be consistent across all screens (same speed, same motion pattern)

#### Enhanced Play Screen Input

- **FR-018**: System MUST automatically focus answer input field when any digit (0-9) is typed on play screen
- **FR-019**: System MUST enter typed digit into answer input field when field receives auto-focus
- **FR-020**: System MUST support Backspace key for deleting digits in answer input field
- **FR-021**: System MUST allow up arrow to move focus from input field to "Valider" button
- **FR-022**: System MUST allow down arrow to move focus from "Valider" to "Restart" button
- **FR-023**: System MUST allow up arrow to move focus from "Restart" to "Valider" button
- **FR-024**: System MUST return focus to input field when any digit is typed while button is focused
- **FR-025**: System MUST ignore non-numeric key inputs (letters, symbols) on play screen
- **FR-026**: System MUST trigger validation when Enter is pressed while "Valider" button is focused
- **FR-027**: System MUST trigger restart when Enter is pressed while "Restart" button is focused

#### Keyboard Hints Display

- **FR-028**: System MUST display keyboard hints at the bottom of every screen
- **FR-029**: Keyboard hints MUST appear outside the main game container in a consistent position
- **FR-030**: Keyboard hints MUST use retro styling consistent with game aesthetic
- **FR-031**: System MUST display context-appropriate hints for each screen
- **FR-032**: Player selection screen hints MUST show: "↑↓: Navigate | Enter: Select | ESC: Exit"
- **FR-033**: Home screen hints MUST show: "Enter: Start Game | ESC: Change Player"
- **FR-034**: Play screen hints MUST show: "Type: Answer | Enter: Submit | ESC: Pause | ↑↓: Navigate"
- **FR-035**: Pause menu hints MUST show: "↑↓: Navigate | Enter: Confirm | ESC: Cancel"
- **FR-036**: Game results screen hints MUST show: "Enter: Continue | ESC: Change Player"

#### Documentation & Guidance Updates

- **FR-037**: Project constitution MUST be updated to reflect keyboard-only navigation as a core principle
- **FR-038**: CLAUDE.md MUST document jumping arrow pattern and usage guidelines for future features
- **FR-039**: Documentation MUST specify that all new interactive elements MUST use jumping arrow pattern

### Key Entities

- **Pause Menu State**: Represents whether game is paused, which option is selected, and previous game state
- **Focus State**: Tracks which interactive element currently has focus across all screens
- **Keyboard Hint Configuration**: Defines which hints to display for each screen/context

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can pause and resume games in under 2 seconds using only keyboard
- **SC-002**: Players can complete entire game session (selection to results) without touching mouse
- **SC-003**: 95% of players successfully navigate pause menu on first attempt
- **SC-004**: Keyboard hints are visible and readable on all supported screen sizes
- **SC-005**: Jumping arrow animation performs smoothly at 60fps on target devices
- **SC-006**: Players can switch between input field and buttons in under 0.5 seconds
- **SC-007**: Zero accidental game quits due to unclear pause menu navigation
- **SC-008**: All keyboard interactions respond within 100ms of key press
- **SC-009**: Keyboard hints accurately reflect available actions on each screen (100% accuracy)
- **SC-010**: Pause menu overlay renders within 200ms of ESC key press

## Assumptions *(optional)*

- Jumping arrow animation uses same bounce pattern as existing player selection (1s duration, ease-in-out infinite)
- Pause menu overlay uses modal pattern that prevents interaction with game behind it
- Keyboard hints display area does not interfere with main game container visibility
- Game timer precision is sufficient to accurately pause/resume (no time drift)
- Focus management integrates with existing React state management patterns
- Zoom/splash animation for pause menu duration is approximately 300ms
- Keyboard hints font size is readable at minimum supported screen size (320px width)
- All keyboard event handlers properly clean up on component unmount
- ESC key is not captured by browser or OS for other purposes during gameplay

## Dependencies *(optional)*

- Existing keyboard navigation infrastructure (arrow key handlers, Enter key handlers)
- Existing animation system (bounce animation from player selection)
- Existing modal/overlay styling patterns (if any)
- React component lifecycle and state management
- Existing game timer implementation

## Out of Scope *(optional)*

- Customizable keyboard shortcuts (fixed key bindings only)
- Gamepad/controller support
- Touch screen gesture equivalents for keyboard shortcuts
- Accessibility features beyond keyboard navigation (screen readers, high contrast, etc.)
- Keyboard shortcut cheat sheet modal/help screen
- Configurable jumping arrow animation speed/style
- Multiple simultaneous key combinations (key chords)
- Keyboard repeat rate configuration
