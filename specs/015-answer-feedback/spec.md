# Feature Specification: Answer Feedback System

**Feature Branch**: `015-answer-feedback`
**Created**: 2026-01-25
**Status**: Draft
**Input**: User description: "Add positive and negative feedback sounds and visual animation when good or bad answer are given. Find simple 8-bit style sound effects, store in /public/audio/sfx/ folder, use reasonable default volume (20%). In the play screen, move the hearts (lives) up between the question and the time progress bar."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Immediate Audio Feedback on Answer (Priority: P1)

As a player, I want to hear distinct 8-bit sound effects when I submit an answer so that I get instant auditory feedback on whether my answer was correct or incorrect, enhancing the retro gaming experience.

**Why this priority**: Audio feedback is the core feature request. Instant sound cues are fundamental to arcade-style gaming and provide immediate reward/punishment signals that reinforce learning through positive and negative reinforcement.

**Independent Test**: Can be fully tested by playing a game, submitting correct and incorrect answers, and verifying that distinct sounds play for each outcome. Delivers immediate satisfaction/feedback value.

**Acceptance Scenarios**:

1. **Given** a player is on the play screen with a multiplication question displayed, **When** the player submits a correct answer, **Then** a positive/success 8-bit sound effect plays at 20% volume.
2. **Given** a player is on the play screen with a multiplication question displayed, **When** the player submits an incorrect answer, **Then** a negative/error 8-bit sound effect plays at 20% volume.
3. **Given** a player has audio enabled, **When** multiple answers are submitted in quick succession, **Then** each answer triggers its respective sound without delay or overlap issues.

---

### User Story 2 - Visual Animation Feedback on Answer (Priority: P1)

As a player, I want to see visual animations when I answer correctly or incorrectly so that I get clear visual confirmation of my answer outcome, making the game feel more responsive and engaging.

**Why this priority**: Visual feedback complements audio feedback and is essential for players who may have audio muted or hearing difficulties. Together with audio, this creates a complete sensory feedback loop.

**Independent Test**: Can be fully tested by playing a game with audio muted, submitting correct and incorrect answers, and verifying that distinct visual animations appear for each outcome.

**Acceptance Scenarios**:

1. **Given** a player is on the play screen and submits a correct answer, **When** the answer is validated, **Then** a positive visual animation (green flash, checkmark, or celebration effect) is displayed briefly.
2. **Given** a player is on the play screen and submits an incorrect answer, **When** the answer is validated, **Then** a negative visual animation (red flash, X mark, or shake effect) is displayed briefly.
3. **Given** the visual feedback animation is playing, **When** the animation completes (within 500ms), **Then** the game returns to normal display and the next question is shown.

---

### User Story 3 - Relocated Lives Display (Priority: P2)

As a player, I want to see my remaining lives (hearts) positioned between the question and the timer progress bar so that all game status information is logically grouped and easier to monitor during gameplay.

**Why this priority**: This is a UI layout improvement that enhances information architecture. While valuable for usability, it doesn't affect core gameplay feedback mechanics.

**Independent Test**: Can be fully tested by navigating to the play screen and verifying the hearts display appears between the question area and the timer progress bar.

**Acceptance Scenarios**:

1. **Given** a player navigates to the play screen, **When** the screen renders, **Then** the hearts (lives) display is positioned vertically between the multiplication question and the timer progress bar.
2. **Given** a player loses a life during gameplay, **When** the life is deducted, **Then** the heart removal animation occurs in the new position between question and timer.

---

### Edge Cases

- What happens when the player mutes system audio? Visual feedback must still work independently.
- What happens if sound files fail to load? Game must continue without crashing; log error silently.
- How does system handle rapid answer submissions? Sounds should queue or overlap gracefully without audio glitches.
- What happens if the animation is interrupted by timer expiry? End-of-game transition takes precedence.
- What if the player uses the Restart button mid-animation? Game state resets immediately, animation stops.

## E2E Test Scenarios *(mandatory)*

### E2E-US1-001: Correct Answer Audio Feedback

**User Story**: User Story 1 - Immediate Audio Feedback on Answer

**Test Flow**:
1. **Navigate** to player selection, select a player using Arrow keys + Enter
2. **Navigate** to home screen, start game using Enter
3. **Enter** a correct multiplication answer in the input field
4. **Press** Enter or click "Valider" to submit
   - Screenshot: `01-correct-answer-submitted.png`
5. **Verify** that positive sound effect plays (audio event triggered)
6. **Verify** game continues to next question

**Expected Outcome**: A positive 8-bit sound effect plays immediately upon correct answer submission.

**Visual Validation**: Game continues normally, score increments by 1.

---

### E2E-US1-002: Incorrect Answer Audio Feedback

**User Story**: User Story 1 - Immediate Audio Feedback on Answer

**Test Flow**:
1. **Navigate** to play screen with an active game
2. **Enter** an incorrect multiplication answer
3. **Submit** the answer using Enter key
   - Screenshot: `02-incorrect-answer-submitted.png`
4. **Verify** that negative sound effect plays (audio event triggered)
5. **Verify** life is deducted and question regenerates

**Expected Outcome**: A negative 8-bit sound effect plays immediately upon incorrect answer submission.

---

### E2E-US2-001: Correct Answer Visual Animation

**User Story**: User Story 2 - Visual Animation Feedback on Answer

**Test Flow**:
1. **Navigate** to play screen with active game
2. **Submit** a correct answer
   - Screenshot: `03-correct-animation-start.png`
3. **Wait** for animation to complete (max 500ms)
   - Screenshot: `04-correct-animation-complete.png`
4. **Verify** positive visual indicator appears (green flash or checkmark)
5. **Verify** game screen returns to normal state

**Expected Outcome**: A brief positive visual animation displays and completes within 500ms.

**Visual Validation**: Green color scheme or checkmark indicator visible during animation.

---

### E2E-US2-002: Incorrect Answer Visual Animation

**User Story**: User Story 2 - Visual Animation Feedback on Answer

**Test Flow**:
1. **Navigate** to play screen with active game
2. **Submit** an incorrect answer
   - Screenshot: `05-incorrect-animation-start.png`
3. **Wait** for animation to complete
   - Screenshot: `06-incorrect-animation-complete.png`
4. **Verify** negative visual indicator appears (red flash or X mark)
5. **Verify** game screen returns to normal state

**Expected Outcome**: A brief negative visual animation displays and completes within 500ms.

**Visual Validation**: Red color scheme or X indicator visible during animation.

---

### E2E-US3-001: Lives Display Repositioned

**User Story**: User Story 3 - Relocated Lives Display

**Test Flow**:
1. **Navigate** to play screen
   - Screenshot: `07-play-screen-initial.png`
2. **Verify** visual layout: question is at top, hearts below it, timer progress bar below hearts
3. **Submit** an incorrect answer to lose a life
   - Screenshot: `08-life-lost-new-position.png`
4. **Verify** heart removal animation plays in the new position

**Expected Outcome**: Hearts display appears between question and timer, maintaining retro aesthetic.

**Visual Validation**: Vertical layout order is: Question > Hearts > Timer Progress Bar > Answer Input.

---

### E2E-US1-003: Rapid Answer Submissions

**User Story**: User Story 1 - Immediate Audio Feedback on Answer

**Test Flow**:
1. **Navigate** to play screen with active game
2. **Submit** correct answer
3. **Immediately** submit another answer (within 200ms of first sound starting)
4. **Verify** both sounds play without crash or audio distortion

**Expected Outcome**: Multiple rapid submissions don't cause audio system errors.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST play a positive 8-bit sound effect when a correct answer is submitted.
- **FR-002**: System MUST play a negative 8-bit sound effect when an incorrect answer is submitted.
- **FR-003**: Sound effects MUST play at 20% volume by default.
- **FR-004**: Sound effect files MUST be stored in `/public/audio/sfx/` directory.
- **FR-005**: Sound effects MUST be in a web-compatible format (MP3 or WAV).
- **FR-006**: System MUST display a positive visual animation (green theme) on correct answer.
- **FR-007**: System MUST display a negative visual animation (red theme) on incorrect answer.
- **FR-008**: Visual animations MUST complete within 500 milliseconds.
- **FR-009**: Visual animations MUST follow the 8-bit/Super NES retro aesthetic.
- **FR-010**: The hearts (lives) display MUST be repositioned between the question and timer progress bar on the play screen.
- **FR-011**: System MUST continue to function if audio files fail to load (graceful degradation).
- **FR-012**: Visual feedback MUST work independently of audio feedback.

### Key Entities

- **SoundEffect**: Represents an audio file for feedback, with properties: type (positive/negative), file path, default volume level.
- **FeedbackAnimation**: Represents a visual animation state, with properties: type (correct/incorrect), duration, color scheme, animation style.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players receive audio feedback within 100ms of answer submission.
- **SC-002**: Players receive visual feedback within 100ms of answer submission.
- **SC-003**: Visual animations complete within 500ms, allowing smooth gameplay flow.
- **SC-004**: 100% of correct answers trigger positive feedback (sound + visual).
- **SC-005**: 100% of incorrect answers trigger negative feedback (sound + visual).
- **SC-006**: Game remains playable with audio disabled (visual-only feedback works).
- **SC-007**: Hearts display is visually positioned between question and timer in all viewport sizes.
- **SC-008**: Sound effects are audible but not jarring at default 20% volume.

## Assumptions

- The game already has a lives system with hearts display implemented.
- The timer progress bar already exists on the play screen.
- The project uses React with TypeScript and follows the existing audio patterns from the background music feature.
- 8-bit style sound effects will be sourced as royalty-free or created for the project.
- The visual animations will use CSS animations/transitions consistent with existing retro styling.

## Out of Scope

- Volume controls or mute toggle for sound effects (uses system defaults).
- Different sound effects for different multiplication tables.
- Combo-specific sound variations.
- Accessibility features like visual alternatives for deaf users beyond existing visual feedback.
