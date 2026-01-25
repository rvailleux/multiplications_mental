# Feature Specification: Unified Keyboard UI Navigation

**Feature Branch**: `013-unified-keyboard-ui`
**Created**: 2026-01-23
**Status**: Draft
**Input**: User description: "apply the jumping arrow on option when selected to start game button on homescreen, valider and restart options on the gamingscreen. on the gaming screen, make up and down arrow to switch selection between valider option and restart option. typing any figure during the gaming screen must input in the answer textbox. backspace must simply works as expected in the textbox. at all time, at the very bottom of the screen, outside the inner box display what keys can be used on each screen. update constitution and other guidance to make sure next feature will follow these keyboard-only navigation instructions."

## Clarifications

### Session 2026-01-23

- Q: When the PlayPage loads with a new question, what should be the default selected option? → A: "Valider" is always selected by default (primary action)
- Q: What animation style should the jumping arrow use to match the retro 8-bit aesthetic? → A: Smooth CSS transform animation (modern approach, less retro-authentic)
- Q: When a user opens the pause menu (Esc) during gameplay and then cancels back to the game, what should happen to the selection state on PlayPage? → A: Preserve selection state (selected option remains the same when returning)
- Q: When keyboard hints are too long for the viewport width, should the system wrap them to multiple lines or abbreviate them? → A: Always wrap to multiple lines (ensures all controls visible)
- Q: When a screen has only one selectable option, should the jumping arrow appear and arrow key navigation be enabled? → A: Always show jumping arrow, arrow keys do nothing (visual consistency)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Jumping Arrow Selection Indicator (Priority: P1)

Users need a consistent visual indicator across all screens to understand which option is currently selected when navigating with keyboard controls. The jumping arrow (already implemented for player selection) should become the standard selection indicator throughout the entire application.

**Why this priority**: This is the foundational visual language for keyboard navigation. Without consistent selection indicators, users cannot confidently navigate the application with keyboard controls. All other keyboard improvements depend on this being in place.

**Independent Test**: Can be fully tested by navigating through HomePage, PlayPage, and game results screen with keyboard, verifying that the jumping arrow appears next to the currently selected option on each screen.

**Acceptance Scenarios**:

1. **Given** user is on the HomePage, **When** page loads, **Then** the jumping arrow appears next to the "Start Game" button (default selection)
2. **Given** user is playing a game on PlayPage, **When** user navigates with arrow keys, **Then** jumping arrow moves between "Valider" and "Restart" options
3. **Given** user is on the game results screen, **When** screen loads, **Then** jumping arrow appears next to the default action button
4. **Given** user selects any option with the jumping arrow indicator, **When** user presses Enter, **Then** the selected action is executed

---

### User Story 2 - Arrow Key Navigation on PlayPage (Priority: P2)

During active gameplay, users need to switch between the answer submission button ("Valider") and the restart option using up/down arrow keys while maintaining focus on the input textbox for typing answers.

**Why this priority**: This enables keyboard-only gameplay, which is essential for the retro gaming experience. However, it depends on the jumping arrow indicator (P1) being implemented first to show which option is selected.

**Independent Test**: Can be tested by starting a game, typing numbers in the answer box, then pressing arrow keys to switch between "Valider" and "Restart", verifying the jumping arrow moves and Enter key executes the selected action.

**Acceptance Scenarios**:

1. **Given** user navigates to PlayPage or a new question appears, **When** the page/question loads, **Then** "Valider" option is selected by default with jumping arrow indicator visible
2. **Given** user is on PlayPage with an active game, **When** user types any digit (0-9), **Then** the digit appears in the answer textbox regardless of current selection state
3. **Given** user has typed digits in the answer textbox, **When** user presses Backspace, **Then** the last digit is removed from the textbox
4. **Given** user is on PlayPage, **When** user presses ArrowDown, **Then** selection moves to the next option ("Valider" or "Restart") and jumping arrow updates
5. **Given** user is on PlayPage, **When** user presses ArrowUp, **Then** selection moves to the previous option and jumping arrow updates
6. **Given** user has "Valider" option selected, **When** user presses Enter, **Then** answer is submitted for validation
7. **Given** user has "Restart" option selected, **When** user presses Enter, **Then** current game restarts with a new question and "Valider" becomes the default selection again

---

### User Story 3 - Keyboard Hints Display (Priority: P3)

Users need to see available keyboard controls for each screen displayed at the bottom of the screen, outside the main content area. This provides discoverability and reduces the learning curve for keyboard navigation.

**Why this priority**: This is a quality-of-life enhancement that improves user experience but isn't strictly required for functionality. Users can learn keyboard controls through experimentation, but explicit hints make the experience more user-friendly.

**Independent Test**: Can be tested by navigating through all application screens and verifying that appropriate keyboard hints appear at the bottom of each screen, updating as the screen context changes.

**Acceptance Scenarios**:

1. **Given** user is on any screen in the application, **When** the screen renders, **Then** keyboard hints are displayed at the very bottom of the viewport, outside the main game container
2. **Given** user is on the HomePage, **When** screen loads, **Then** keyboard hints display: "↑↓: Navigate | Enter: Select"
3. **Given** user is on the PlayPage during active gameplay, **When** screen renders, **Then** keyboard hints display: "0-9: Type Answer | Backspace: Delete | ↑↓: Navigate Options | Enter: Confirm | Esc: Quit"
4. **Given** user is on the player selection screen, **When** screen renders, **Then** keyboard hints display: "↑↓: Select Player | Enter: Confirm"
5. **Given** user is on the game results screen, **When** screen renders, **Then** keyboard hints display: "Enter: Continue"
6. **Given** keyboard hints overflow the available width, **When** screen is narrow, **Then** hints wrap to multiple lines to ensure all keyboard controls remain visible

---

### User Story 4 - Documentation Updates (Priority: P4)

Project documentation (constitution and guidance files) must be updated to reflect the new keyboard-first navigation standards established by this feature, ensuring future development maintains consistency.

**Why this priority**: This is essential for long-term maintainability but doesn't directly impact user experience. It can be completed after all user-facing features are implemented and tested.

**Independent Test**: Can be tested by reviewing CLAUDE.md, constitution.md, and ARCHITECTURE.md to verify they include updated keyboard navigation patterns, jumping arrow usage guidelines, and keyboard hints implementation standards.

**Acceptance Scenarios**:

1. **Given** the jumping arrow pattern is implemented, **When** reviewing CLAUDE.md, **Then** documentation includes guidelines for using jumping arrow as the standard selection indicator
2. **Given** arrow key navigation is implemented on PlayPage, **When** reviewing constitution.md, **Then** keyboard-first navigation principles explicitly mention arrow key navigation patterns
3. **Given** keyboard hints are implemented, **When** reviewing documentation, **Then** guidelines specify keyboard hints should appear at the bottom of every screen
4. **Given** new keyboard patterns are documented, **When** a developer reads the documentation, **Then** they have clear examples and patterns to follow for implementing keyboard navigation in future features

---

### Edge Cases

- What happens when user presses arrow keys rapidly while typing in the answer textbox? (Selection should update without interfering with text input)
- When a screen has only one selectable option (e.g., HomePage "Start Game" button), the jumping arrow must still appear to maintain visual consistency, and arrow keys do nothing (no navigation needed)
- When keyboard hints are too long for narrow viewports, they must wrap to multiple lines to ensure all controls remain visible
- When user triggers the pause menu (Esc) and then cancels back to gameplay, the previously selected option must remain selected to maintain user context
- What happens when user presses Enter without any option selected? (Default to first option or primary action)

## E2E Test Scenarios *(mandatory)*

### E2E-US1-001: Jumping Arrow Appears on HomePage

**User Story**: User Story 1 - Jumping Arrow Selection Indicator

**Test Flow**:
1. **Navigate** to application home page (<http://localhost:5173/>)
   - Screenshot: `01-homepage-initial.png`
2. **Visual Verification**: Confirm jumping arrow appears next to "Start Game" button
   - Screenshot: `02-homepage-arrow-visible.png`
3. **Keyboard Interaction**: Press Enter to start game
   - Screenshot: `03-game-started.png`
4. **Verify State**: Check URL changed to /play and game timer started

**Expected Outcome**: HomePage loads with jumping arrow indicator next to the default action button. Pressing Enter navigates to the game.

**Visual Validation**: Jumping arrow should be animated (bouncing/jumping) and positioned to the left of the "Start Game" button text.

---

### E2E-US1-002: Jumping Arrow on PlayPage Navigation

**User Story**: User Story 1 - Jumping Arrow Selection Indicator

**Test Flow**:
1. **Navigate** to PlayPage (start a game)
   - Screenshot: `01-playpage-initial.png`
2. **Visual Verification**: Confirm jumping arrow appears next to "Valider" (default selection)
   - Screenshot: `02-valider-selected.png`
3. **Keyboard Interaction**: Press ArrowDown
   - Screenshot: `03-restart-selected.png`
4. **Verify**: Jumping arrow moves to "Restart" option
5. **Keyboard Interaction**: Press ArrowUp
   - Screenshot: `04-back-to-valider.png`
6. **Verify**: Jumping arrow returns to "Valider" option

**Expected Outcome**: Jumping arrow visibly indicates current selection and moves responsively to arrow key input.

**Visual Validation**: Jumping arrow animation should be smooth and consistently styled across different options.

---

### E2E-US2-001: Type Answer and Submit on PlayPage

**User Story**: User Story 2 - Arrow Key Navigation on PlayPage

**Test Flow**:
1. **Navigate** to PlayPage (start a game)
   - Screenshot: `01-game-question.png`
2. **Keyboard Interaction**: Type digits (e.g., "42")
   - Screenshot: `02-answer-typed.png`
3. **Verify**: Digits appear in answer textbox
4. **Keyboard Interaction**: Press ArrowDown to select "Valider"
   - Screenshot: `03-valider-selected.png`
5. **Verify**: Jumping arrow appears next to "Valider"
6. **Keyboard Interaction**: Press Enter to submit answer
   - Screenshot: `04-answer-submitted.png`
7. **Verify**: New question appears or feedback is shown

**Expected Outcome**: User can type answer, navigate to submit button using arrow keys, and submit using Enter - all without touching the mouse.

**Visual Validation**: Answer textbox should retain focus visually while selection indicator shows which button will be activated by Enter.

---

### E2E-US2-002: Navigate Between Valider and Restart Options

**User Story**: User Story 2 - Arrow Key Navigation on PlayPage

**Test Flow**:
1. **Navigate** to PlayPage (start a game)
   - Screenshot: `01-game-active.png`
2. **Keyboard Interaction**: Press ArrowDown
   - Screenshot: `02-restart-selected.png`
3. **Verify**: Jumping arrow moves to "Restart" option
4. **Keyboard Interaction**: Press Enter
   - Screenshot: `03-game-restarted.png`
5. **Verify**: Game restarts with new question and timer resets

**Expected Outcome**: User can navigate to restart option and activate it using only keyboard.

**Visual Validation**: "Restart" option should be clearly highlighted when selected.

---

### E2E-US2-003: Backspace Functionality in Answer Textbox

**User Story**: User Story 2 - Arrow Key Navigation on PlayPage

**Test Flow**:
1. **Navigate** to PlayPage (start a game)
   - Screenshot: `01-empty-textbox.png`
2. **Keyboard Interaction**: Type "123"
   - Screenshot: `02-typed-123.png`
3. **Verify**: "123" appears in textbox
4. **Keyboard Interaction**: Press Backspace twice
   - Screenshot: `03-after-backspace.png`
5. **Verify**: Textbox shows "1" (last two digits removed)

**Expected Outcome**: Backspace key removes digits from the textbox as expected in standard text input.

**Visual Validation**: Textbox content updates immediately after each Backspace press.

---

### E2E-US3-001: Keyboard Hints Display on HomePage

**User Story**: User Story 3 - Keyboard Hints Display

**Test Flow**:
1. **Navigate** to HomePage
   - Screenshot: `01-homepage-with-hints.png`
2. **Visual Verification**: Confirm keyboard hints appear at bottom of screen
3. **Verify Content**: Hints display "↑↓: Navigate | Enter: Select" or similar
4. **Verify Position**: Hints are outside the main game container, at the very bottom

**Expected Outcome**: Keyboard hints are clearly visible and positioned below all other UI elements.

**Visual Validation**: Hints should have retro styling consistent with the 8-bit aesthetic, using readable font and contrasting colors.

---

### E2E-US3-002: Keyboard Hints Display on PlayPage

**User Story**: User Story 3 - Keyboard Hints Display

**Test Flow**:
1. **Navigate** to PlayPage (start a game)
   - Screenshot: `01-playpage-with-hints.png`
2. **Visual Verification**: Confirm keyboard hints appear at bottom of screen
3. **Verify Content**: Hints display "0-9: Type Answer | Backspace: Delete | ↑↓: Navigate Options | Enter: Confirm | Esc: Quit"
4. **Verify Position**: Hints remain visible and stationary even during gameplay

**Expected Outcome**: Comprehensive keyboard hints are displayed throughout active gameplay.

**Visual Validation**: Hints should not interfere with game UI or timer display.

---

### E2E-US3-003: Keyboard Hints on Player Selection Screen

**User Story**: User Story 3 - Keyboard Hints Display

**Test Flow**:
1. **Navigate** to player selection screen (first screen after app load)
   - Screenshot: `01-player-selection-hints.png`
2. **Visual Verification**: Confirm keyboard hints appear at bottom
3. **Verify Content**: Hints display "↑↓: Select Player | Enter: Confirm"

**Expected Outcome**: Player selection screen displays appropriate keyboard hints for that context.

**Visual Validation**: Hints match the retro aesthetic of the player selection screen.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a jumping arrow visual indicator next to the currently selected option on all screens (HomePage, PlayPage, game results screen, player selection)
- **FR-001a**: System MUST display the jumping arrow even when only one option is available on a screen (for visual consistency), and arrow key presses should have no effect in this case
- **FR-002**: System MUST position the jumping arrow consistently (to the left of option text) across all screens
- **FR-003**: System MUST animate the jumping arrow using smooth CSS transform animation with bouncing/jumping motion to draw visual attention to the current selection
- **FR-004**: Users MUST be able to navigate between "Valider" and "Restart" options on PlayPage using ArrowUp and ArrowDown keys
- **FR-004a**: System MUST default to "Valider" option as the selected option when PlayPage loads or when a new question appears (primary action prioritized over destructive restart action)
- **FR-005**: System MUST maintain answer textbox input functionality when user types digit keys (0-9) regardless of current option selection state
- **FR-006**: System MUST support Backspace key to delete characters from the answer textbox
- **FR-007**: System MUST execute the currently selected option (indicated by jumping arrow) when user presses Enter key
- **FR-008**: System MUST display keyboard hints at the bottom of every screen, positioned outside the main game container
- **FR-009**: System MUST update keyboard hints dynamically based on the current screen context (HomePage shows different hints than PlayPage)
- **FR-010**: Keyboard hints MUST include visual representations of keys (e.g., arrow symbols ↑↓, key names like "Enter", "Esc")
- **FR-011**: System MUST maintain selection state (jumping arrow position) when user interacts with the answer textbox
- **FR-011a**: System MUST preserve selection state (jumping arrow position) when user opens the pause menu (Esc) and then cancels back to gameplay
- **FR-012**: System MUST wrap keyboard hints to multiple lines when viewport width is insufficient to display full hints on a single line, ensuring all keyboard controls remain visible and discoverable
- **FR-013**: Documentation files (CLAUDE.md, constitution.md, ARCHITECTURE.md) MUST be updated to reflect jumping arrow pattern, arrow key navigation standards, and keyboard hints implementation guidelines

### Key Entities

This feature primarily affects UI components and interaction patterns rather than data entities. The following UI components are involved:

- **Jumping Arrow Indicator**: Visual component (animated graphic or styled element) that indicates current selection
- **Keyboard Hints Component**: Reusable component that displays available keyboard controls for the current screen context
- **Option Selection State**: UI state tracking which option is currently selected (for jumping arrow positioning and Enter key action)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete an entire game session (from player selection to viewing results) using only keyboard controls, without touching the mouse
- **SC-002**: 100% of interactive screens display the jumping arrow indicator next to the currently selected option
- **SC-003**: 100% of application screens display contextually appropriate keyboard hints at the bottom of the viewport
- **SC-004**: Users can type answers in the textbox and submit them using only keyboard (0-9 keys for input, Enter for submission) within 2 seconds
- **SC-005**: Arrow key navigation responds within 100ms of key press, with visible jumping arrow position update
- **SC-006**: New developers reading updated documentation can implement keyboard navigation patterns without referencing existing code examples
- **SC-007**: Users can discover all keyboard controls by reading the on-screen hints without external documentation
- **SC-008**: Zero mouse interactions required for any game functionality (keyboard-only gameplay is fully functional)
