# Feature Specification: Credits Screen

**Feature Branch**: `017-credits-screen`
**Created**: 2026-01-29
**Status**: Draft
**Input**: User description: "Add a credits screen accessible from the leaderboard via Ctrl+C (with subtle 'Ctrl+C: Credits' hint in footer). Features: (1) Auto-scrolling credits that move up like classic movie/game credits with arrow key speed control, (2) Starfield parallax background animation (multiple star layers at different speeds), (3) Large pixelated 'Credits' title with colorful rainbow/wave animation, (4) Full content: audio music/SFX attributions, 'Made with' tech stack section (React, TypeScript, Vite), and Special Thanks. Press Escape to return to leaderboard. SNES/8-bit aesthetic throughout."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Access Credits from Leaderboard (Priority: P1)

A player viewing the leaderboard notices a subtle hint in the footer showing "Ctrl+C: Credits". When they press Ctrl+C, the credits screen appears with a beautiful starfield background and an animated "Credits" title. This provides acknowledgment of all contributors and resources used in the game.

**Why this priority**: This is the core entry point to the credits feature. Without the ability to access credits, no other functionality matters. The keyboard shortcut follows the established pattern of keyboard-first navigation.

**Independent Test**: Can be fully tested by pressing Ctrl+C on the leaderboard and verifying the credits screen appears with the animated title and starfield background.

**Acceptance Scenarios**:

1. **Given** the player is on the leaderboard screen, **When** they press Ctrl+C, **Then** the credits screen is displayed with starfield background and animated title
2. **Given** the player is on the leaderboard screen, **When** they look at the footer, **Then** they see a subtle "Ctrl+C: Credits" hint that doesn't distract from the leaderboard content
3. **Given** the player is on any other screen (not leaderboard), **When** they press Ctrl+C, **Then** nothing happens (shortcut only works on leaderboard)

---

### User Story 2 - View Auto-Scrolling Credits Content (Priority: P2)

Once on the credits screen, the player sees the credits content automatically scrolling upward like classic movie or game end credits. The content includes audio/music attributions, SFX attributions, the technology stack used (React, TypeScript, Vite), and a Special Thanks section. The scrolling maintains a comfortable reading pace.

**Why this priority**: The auto-scrolling credits are the main content of this feature. Without readable, well-formatted content, the credits screen would be empty decoration.

**Independent Test**: Can be tested by opening the credits screen and observing the content scrolling upward at a readable pace, with all attribution sections visible.

**Acceptance Scenarios**:

1. **Given** the credits screen is displayed, **When** the screen loads, **Then** credits content starts scrolling upward automatically at a comfortable reading speed
2. **Given** the credits screen is displayed, **When** viewing the content, **Then** the player sees all sections: Audio/Music Credits, SFX Credits, "Made with" (React, TypeScript, Vite), and Special Thanks
3. **Given** the credits have finished scrolling, **When** all content has passed the top of the screen, **Then** the credits loop back to the beginning seamlessly

---

### User Story 3 - Control Scrolling Speed with Arrow Keys (Priority: P3)

While viewing credits, the player can use arrow keys to control the scrolling speed. Pressing Up Arrow increases speed (scrolls faster), Down Arrow decreases speed (scrolls slower or even pauses). This allows the player to read at their preferred pace or quickly skip through sections.

**Why this priority**: Speed control enhances the viewing experience but is not essential for basic functionality. Players can still view all credits without this feature.

**Independent Test**: Can be tested by pressing Up/Down arrow keys and observing the credits scroll speed change accordingly.

**Acceptance Scenarios**:

1. **Given** the credits are scrolling, **When** the player presses Up Arrow, **Then** the scrolling speed increases
2. **Given** the credits are scrolling, **When** the player presses Down Arrow, **Then** the scrolling speed decreases (minimum is paused/stationary)
3. **Given** the credits are paused (minimum speed), **When** the player presses Up Arrow, **Then** the scrolling resumes at a slow speed
4. **Given** the credits are at maximum speed, **When** the player presses Up Arrow, **Then** the speed remains at maximum (no further increase)

---

### User Story 4 - Return to Leaderboard (Priority: P1)

The player can exit the credits screen at any time by pressing Escape. This returns them to the leaderboard exactly where they left off.

**Why this priority**: Equal to P1 because without an exit mechanism, players would be trapped in the credits screen. This is essential for usability.

**Independent Test**: Can be tested by pressing Escape on the credits screen and verifying return to the leaderboard.

**Acceptance Scenarios**:

1. **Given** the player is on the credits screen, **When** they press Escape, **Then** they return to the leaderboard screen
2. **Given** the player is on the credits screen with credits partially scrolled, **When** they press Escape and later return via Ctrl+C, **Then** the credits restart from the beginning

---

### Edge Cases

- What happens when Ctrl+C is pressed rapidly multiple times on leaderboard? (Should only trigger once, ignore repeated presses while transitioning)
- What happens when player presses both Up and Down arrows simultaneously? (Last key pressed takes precedence)
- How does the starfield animation perform on lower-end devices? (Should maintain 30fps minimum, can reduce star count if needed)
- What happens if player holds down arrow key? (Speed changes continuously while held, with reasonable limits)

## E2E Test Scenarios *(mandatory)*

### E2E-US1-001: Access Credits via Keyboard Shortcut

**User Story**: User Story 1 - Access Credits from Leaderboard

**Test Flow**:
1. **Navigate** to application and select a player
   - Screenshot: `01-player-select.png`
2. **Navigate** to home screen, then to leaderboard
   - Screenshot: `02-leaderboard.png`
3. **Verify** footer shows "Ctrl+C: Credits" hint
   - Screenshot: `03-footer-hint.png`
4. **Keyboard Interaction**: Press Ctrl+C
   - Screenshot: `04-credits-screen.png`
5. **Verify State**: Credits screen is displayed with:
   - Starfield background animation visible
   - "Credits" title with rainbow animation visible
   - Auto-scrolling content visible

**Expected Outcome**: Credits screen appears with all visual elements active (starfield, animated title, scrolling content)

**Visual Validation**: Starfield has multiple parallax layers, title has colorful animation, 8-bit aesthetic maintained

---

### E2E-US1-002: Shortcut Only Works on Leaderboard

**User Story**: User Story 1 - Access Credits from Leaderboard

**Test Flow**:
1. **Navigate** to home screen
   - Screenshot: `01-home-screen.png`
2. **Keyboard Interaction**: Press Ctrl+C
3. **Verify State**: Nothing happens, still on home screen
   - Screenshot: `02-still-home.png`
4. **Navigate** to leaderboard
5. **Keyboard Interaction**: Press Ctrl+C
6. **Verify State**: Credits screen appears
   - Screenshot: `03-credits-from-leaderboard.png`

**Expected Outcome**: Ctrl+C only triggers credits when on leaderboard screen

---

### E2E-US2-001: View All Credits Content Sections

**User Story**: User Story 2 - View Auto-Scrolling Credits Content

**Test Flow**:
1. **Navigate** to credits screen via Ctrl+C from leaderboard
2. **Wait** for content to scroll, capturing screenshots at intervals
   - Screenshot: `01-credits-title-section.png`
   - Screenshot: `02-audio-music-section.png`
   - Screenshot: `03-sfx-section.png`
   - Screenshot: `04-made-with-section.png`
   - Screenshot: `05-special-thanks-section.png`
3. **Verify** each section is readable and properly formatted

**Expected Outcome**: All content sections scroll past and are visible/readable

**Visual Validation**: Content uses 8-bit styling, proper spacing between sections, readable font sizes

---

### E2E-US3-001: Control Scrolling Speed

**User Story**: User Story 3 - Control Scrolling Speed with Arrow Keys

**Test Flow**:
1. **Navigate** to credits screen
2. **Observe** default scrolling speed
   - Screenshot: `01-default-speed.png`
3. **Keyboard Interaction**: Press Up Arrow 3 times
4. **Observe** faster scrolling
   - Screenshot: `02-fast-speed.png`
5. **Keyboard Interaction**: Press Down Arrow 5 times
6. **Observe** paused or very slow scrolling
   - Screenshot: `03-slow-speed.png`
7. **Keyboard Interaction**: Press Up Arrow once
8. **Observe** scrolling resumes

**Expected Outcome**: Scrolling speed responds to arrow key input

---

### E2E-US4-001: Return to Leaderboard via Escape

**User Story**: User Story 4 - Return to Leaderboard

**Test Flow**:
1. **Navigate** to credits screen from leaderboard
   - Screenshot: `01-credits-screen.png`
2. **Keyboard Interaction**: Press Escape
   - Screenshot: `02-back-to-leaderboard.png`
3. **Verify State**: URL is leaderboard, leaderboard content visible

**Expected Outcome**: Player returns to leaderboard immediately upon pressing Escape

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a credits screen when user presses Ctrl+C on the leaderboard screen
- **FR-002**: System MUST show a subtle "Ctrl+C: Credits" hint in the leaderboard footer that does not distract from leaderboard content
- **FR-003**: Credits screen MUST display an animated starfield background with multiple parallax layers moving at different speeds
- **FR-004**: Credits screen MUST display a large "Credits" title with colorful rainbow/wave text animation
- **FR-005**: Credits content MUST auto-scroll upward like classic movie/game credits
- **FR-006**: System MUST allow users to increase scrolling speed by pressing Up Arrow
- **FR-007**: System MUST allow users to decrease scrolling speed by pressing Down Arrow (minimum speed is paused)
- **FR-008**: System MUST return user to leaderboard when Escape is pressed on credits screen
- **FR-009**: Credits content MUST include Audio/Music attribution section with proper credits for all music used
- **FR-010**: Credits content MUST include Sound Effects attribution section with proper credits for all SFX used
- **FR-011**: Credits content MUST include "Made with" section listing React, TypeScript, and Vite
- **FR-012**: Credits content MUST include Special Thanks section
- **FR-013**: Credits screen MUST maintain SNES/8-bit aesthetic consistent with rest of application
- **FR-014**: Ctrl+C shortcut MUST only work when on the leaderboard screen (not on other screens)
- **FR-015**: Credits MUST loop back to beginning when all content has scrolled past

### Key Entities

- **Credits Section**: A titled block of content within the credits (e.g., "Audio/Music", "Made with"). Contains a section title and list of attribution items.
- **Attribution Item**: An individual credit entry with name/title and optional description or link reference.
- **Star Layer**: A parallax layer in the starfield background with properties for speed, density, and star size.
- **Scroll State**: Current state of credits scrolling including position, speed level, and direction.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can access credits screen within 1 second of pressing Ctrl+C on leaderboard
- **SC-002**: Credits content is readable at default scrolling speed (users can read each line before it exits view)
- **SC-003**: Speed control responds immediately to arrow key presses (within 100ms perceived response time)
- **SC-004**: Starfield animation maintains smooth visual appearance across common devices
- **SC-005**: All music and sound effect sources are properly attributed in the credits
- **SC-006**: Users can return to leaderboard within 1 second of pressing Escape
- **SC-007**: Credits screen maintains consistent 8-bit/SNES aesthetic that matches the rest of the game

## Assumptions

- The leaderboard screen already has a footer area or space where the "Ctrl+C: Credits" hint can be placed
- Audio/music and SFX files have known sources that can be attributed (from previous development)
- The game maintains consistent 8-bit styling across screens that this feature will follow
- Users are familiar with keyboard navigation (established pattern in this game)
- Default scrolling speed will be approximately 30-50 pixels per second (comfortable reading pace)
- Starfield will have 3 parallax layers: distant (slow, small stars), medium, and near (fast, larger stars)
- Rainbow animation on title cycles through 6-8 colors with smooth wave effect
