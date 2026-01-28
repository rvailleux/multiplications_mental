# Feature Specification: Main Theme Music

**Feature Branch**: `016-main-theme-music`
**Created**: 2026-01-27
**Status**: Draft
**Input**: User description: "Make the-return-of-the-8-bit-era-301292.mp3 the main music theme of the game. Play the music on each screen except when playing the game (there, keep a random song to be played, but remove the-return-of-the-8-bit-era-301292.mp3 from the playlist)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Main Theme on Non-Game Screens (Priority: P1)

As a player, I want to hear the main theme song ("the-return-of-the-8-bit-era-301292.mp3") playing continuously on all menu screens (Player Select, Home, Game Results) so that the game has a consistent and immersive retro gaming atmosphere.

**Why this priority**: The main theme establishes the game's identity and provides immediate audio branding. This is the core requirement that differentiates menu screens from gameplay.

**Independent Test**: Can be fully tested by navigating through Player Select, Home, and Game Results screens and verifying the main theme plays on each. Delivers the primary value of consistent audio branding.

**Acceptance Scenarios**:

1. **Given** the player launches the game, **When** the Player Select screen loads, **Then** the main theme music starts playing automatically
2. **Given** the player is on the Player Select screen with music playing, **When** the player selects a player and navigates to Home screen, **Then** the main theme continues playing without interruption or restart
3. **Given** the player is on the Home screen with music playing, **When** the player completes a game and reaches Game Results screen, **Then** the main theme starts playing (after gameplay music stops)
4. **Given** the player is on any menu screen with music playing, **When** the player navigates to another menu screen, **Then** the music does not restart from the beginning
5. **Given** the browser restricts autoplay, **When** the player interacts with the page (clicks/presses key), **Then** the music starts playing gracefully after user interaction

---

### User Story 2 - Gameplay Music Without Main Theme (Priority: P2)

As a player, I want to hear a random background song (excluding the main theme) during gameplay so that gameplay feels distinct from menu navigation and provides variety.

**Why this priority**: Builds on existing gameplay music functionality but excludes the main theme from the playlist. Important for differentiation but depends on P1 establishing the main theme.

**Independent Test**: Can be tested by starting a game and verifying that a random song plays but never the main theme. Delivers musical variety during gameplay.

**Acceptance Scenarios**:

1. **Given** the player is on the Home screen with main theme playing, **When** the player starts a game, **Then** the main theme stops and a random gameplay song starts
2. **Given** the player is playing the game, **When** a song is selected randomly, **Then** "the-return-of-the-8-bit-era-301292.mp3" is never selected
3. **Given** the player is playing the game, **When** multiple games are played, **Then** gameplay songs are selected from the 6 available tracks (excluding main theme)
4. **Given** the game timer ends, **When** the Game Results screen loads, **Then** gameplay music stops and main theme resumes

---

### User Story 3 - Music Continuity Across Navigation (Priority: P3)

As a player, I want the music to transition smoothly between screens without jarring restarts so that my gaming experience feels polished and professional.

**Why this priority**: Enhances user experience but is a refinement of P1 functionality. The game is functional without perfectly smooth transitions.

**Independent Test**: Can be tested by rapidly navigating between menu screens and verifying the main theme doesn't restart each time. Delivers a polished audio experience.

**Acceptance Scenarios**:

1. **Given** the main theme is playing on Player Select screen at 30 seconds in, **When** the player navigates to Home screen, **Then** the music continues from the same position (not restarting)
2. **Given** the main theme is playing on Home screen, **When** the player opens the game and then quits immediately via Escape, **Then** the main theme resumes (may restart due to gameplay interruption)
3. **Given** the player completes a game, **When** the Game Results screen loads, **Then** the main theme starts from the beginning (acceptable since gameplay interrupted it)

---

### Edge Cases

- What happens when the browser blocks autoplay? Music starts after first user interaction (click or keypress)
- What happens if audio files fail to load? System logs warning and continues without music (graceful degradation)
- What happens if the main theme file is missing? Gameplay music playlist is used as fallback
- What happens during rapid screen navigation? Music state is managed globally to prevent overlap or conflicts
- What happens if user navigates back to menu during gameplay? Main theme resumes, gameplay music stops

## E2E Test Scenarios *(mandatory)*

### E2E-US1-001: Main Theme Plays on Player Select Screen

**User Story**: User Story 1 - Main Theme on Non-Game Screens

**Test Flow**:
1. **Navigate** to application root URL
   - Screenshot: `01-player-select-loaded.png`
2. **Wait** for any audio autoplay or user interaction trigger
3. **Verify** the main theme is playing (if autoplay succeeded) or is ready to play
4. **Keyboard Interaction**: Press ArrowDown to select second player
   - Screenshot: `02-player-selected.png`
5. **Verify Audio State**: Main theme should be playing or have been triggered by keyboard interaction
6. **Keyboard Interaction**: Press Enter to confirm selection
   - Screenshot: `03-navigated-to-home.png`

**Expected Outcome**: Main theme plays on Player Select and continues to Home without restart

**Visual Validation**: Player select screen shows with jumping arrow indicator; music icon or indicator may be present

---

### E2E-US1-002: Main Theme Continues to Home Screen

**User Story**: User Story 1 - Main Theme on Non-Game Screens

**Test Flow**:
1. **Setup**: Complete player selection to reach Home screen
2. **Verify** Home screen loaded with welcome message
   - Screenshot: `04-home-screen.png`
3. **Verify Audio State**: Main theme continues playing
4. **Wait** 5 seconds to confirm music doesn't restart
5. **Mouse Interaction**: Click on Start Game button
   - Screenshot: `05-game-starting.png`

**Expected Outcome**: Home screen displays correctly with continuous main theme music

---

### E2E-US2-001: Gameplay Music is Different from Main Theme

**User Story**: User Story 2 - Gameplay Music Without Main Theme

**Test Flow**:
1. **Setup**: Navigate through Player Select to Home screen
2. **Start Game**: Press Enter or click Start Game
   - Screenshot: `06-gameplay-started.png`
3. **Verify Audio Transition**: Main theme stops, gameplay music starts
4. **Verify** gameplay music is NOT the main theme (the-return-of-the-8-bit-era)
5. **Play Game**: Answer one question
   - Screenshot: `07-gameplay-in-progress.png`
6. **End Game**: Wait for timer or quit via Escape

**Expected Outcome**: Gameplay uses random music from 6 tracks (excluding main theme)

---

### E2E-US2-002: Main Theme Resumes After Gameplay

**User Story**: User Story 2 - Gameplay Music Without Main Theme

**Test Flow**:
1. **Setup**: Complete a game (wait for timer or answer questions)
2. **Verify** Game Results screen loads
   - Screenshot: `08-game-results.png`
3. **Verify Audio State**: Main theme resumes playing
4. **Keyboard Interaction**: Press Enter to return to Home
   - Screenshot: `09-back-to-home.png`
5. **Verify** Main theme continues playing

**Expected Outcome**: Main theme resumes on Game Results and continues to Home

---

### E2E-US3-001: Music Continuity During Menu Navigation

**User Story**: User Story 3 - Music Continuity Across Navigation

**Test Flow**:
1. **Navigate** to Player Select screen
2. **Wait** 10 seconds for music to progress
3. **Select player** and navigate to Home
4. **Verify** music position is beyond initial seconds (not restarted)
5. **Return** to Player Select (if navigation allows) or complete game cycle
   - Screenshot: `10-navigation-complete.png`

**Expected Outcome**: Music maintains playback position during menu navigation

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST play "the-return-of-the-8-bit-era-301292.mp3" as the main theme on all non-gameplay screens (Player Select, Home, Game Results)
- **FR-002**: System MUST stop the main theme when gameplay begins (Start Game action)
- **FR-003**: System MUST play a random song during gameplay from a playlist that excludes "the-return-of-the-8-bit-era-301292.mp3"
- **FR-004**: System MUST resume the main theme when gameplay ends (timer expires or player quits)
- **FR-005**: System MUST maintain music continuity when navigating between non-gameplay screens (music should not restart from beginning)
- **FR-006**: System MUST handle browser autoplay restrictions gracefully by starting music on first user interaction
- **FR-007**: System MUST maintain the existing gameplay music volume level (30%)
- **FR-008**: System MUST maintain the existing main theme music in loop mode

### Key Entities *(include if feature involves data)*

- **Music Track**: Audio file with path, used for playback
  - Main Theme: `/audio/the-return-of-the-8-bit-era-301292.mp3`
  - Gameplay Tracks: 6 remaining tracks from existing playlist

- **Music State**: Global state tracking current playback
  - Current mode: "menu" or "gameplay"
  - Is playing: boolean
  - Current track: string path

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players hear the main theme within 2 seconds of first user interaction on any menu screen
- **SC-002**: 100% of gameplay sessions use a random track that is NOT the main theme
- **SC-003**: Menu navigation between Player Select, Home, and Game Results maintains continuous music playback (no restarts detected by user)
- **SC-004**: Music transitions between menu and gameplay occur within 500ms of screen change
- **SC-005**: System handles autoplay restrictions without errors (graceful fallback to user-triggered playback)

## Assumptions

- The audio file "the-return-of-the-8-bit-era-301292.mp3" already exists in `/public/audio/` (verified)
- The existing `useBackgroundMusic` hook provides a foundation that can be extended or refactored
- Browser autoplay policies may require user interaction before audio can play (standard web behavior)
- Music volume should remain consistent with existing gameplay music (30% volume)
- The main theme should loop continuously on menu screens until gameplay interrupts it

## Dependencies

- Existing audio files in `/public/audio/` directory
- Existing `useBackgroundMusic` hook in `/src/hooks/useBackgroundMusic.ts`
- React Router for detecting screen/route changes
- Browser Web Audio API support

## Out of Scope

- Volume controls or mute button UI
- Music selection or preferences UI
- Saving music preferences to localStorage
- Crossfade or other audio transition effects
- Different themes for different players
