# Feature Specification: Game Results Screen

**Feature Branch**: `011-game-results-screen`
**Created**: 2026-01-16
**Status**: Draft
**Input**: User description: "At the end of a game, display a screen with the game score. Show score, number of correct answers over total questions, and accuracy percentage. Use gold/yellow colors with nice framing. Softly fading blink animation for 5 seconds after a game, then stops. When player press enter, return to homepage."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Game Performance Summary (Priority: P1)

After completing a timed multiplication game, the player sees a summary screen displaying their performance statistics so they can understand how well they did and learn from the session.

**Why this priority**: Core feature value - provides immediate feedback on game performance, which is essential for player engagement and learning. Without this, players have no way to see detailed results after a game ends.

**Independent Test**: Can be fully tested by completing any multiplication game session and verifying that performance statistics are displayed correctly. Delivers immediate value by showing players their game results.

**Acceptance Scenarios**:

1. **Given** a player has just completed a 60-second multiplication game with 8 correct answers out of 10 total questions, **When** the timer expires, **Then** the results screen displays: score (8), correct answers (8/10), and accuracy percentage (80%)

2. **Given** a player has just completed a game with perfect accuracy (10/10 correct), **When** the timer expires, **Then** the results screen displays 100% accuracy with appropriate visual celebration

3. **Given** a player has just completed a game with 0 correct answers, **When** the timer expires, **Then** the results screen displays 0% accuracy with encouraging messaging

---

### User Story 2 - Return to Home via Keyboard (Priority: P1)

After viewing game results, the player can press the ENTER key to return to the home page and start a new game or view the leaderboard.

**Why this priority**: Essential for game flow and navigation - players need a clear way to continue playing. Maintains keyboard-first retro gaming UX established in the app.

**Independent Test**: Can be fully tested by displaying the results screen and pressing ENTER to verify navigation back to homepage. Delivers value by enabling seamless game-to-game flow.

**Acceptance Scenarios**:

1. **Given** the results screen is displayed, **When** the player presses the ENTER key, **Then** the player is navigated to the home page

2. **Given** the results screen is displayed and still animating (within first 5 seconds), **When** the player presses ENTER, **Then** navigation still works immediately (doesn't wait for animation to complete)

---

### User Story 3 - Visual Celebration with Animation (Priority: P2)

When game results are displayed, the screen features a visually appealing presentation with gold/yellow colors and a soft blinking animation for the first 5 seconds to celebrate the achievement.

**Why this priority**: Enhances player experience and engagement but is not essential for core functionality. Adds polish and retro gaming aesthetic consistent with the app's design.

**Independent Test**: Can be tested by observing the results screen appearance and animation behavior over a 5-second period. Delivers value through improved user experience and visual feedback.

**Acceptance Scenarios**:

1. **Given** a game has just ended, **When** the results screen appears, **Then** the screen displays gold/yellow color scheme with retro pixel-art framing

2. **Given** the results screen has just appeared, **When** the screen is visible for less than 5 seconds, **Then** a soft fading blink animation is active

3. **Given** the results screen has been visible for 5 or more seconds, **When** observing the screen, **Then** the animation has stopped and the screen is static

4. **Given** the results screen is animating, **When** multiple animation cycles occur, **Then** the animation is smooth and not jarring (soft fade effect, not harsh blinking)

---

### Edge Cases

- What happens when a player scores 0 points (no correct answers)? Display 0/[total] with 0% accuracy and encouraging message
- What happens if the player navigates away or refreshes during animation? Animation should restart if they return to results, or skip if they navigate elsewhere
- What happens when total questions is 0 (edge case if timer expires before any questions shown)? Display appropriate message or redirect to homepage
- How does the screen handle very long score numbers or accuracy percentages? Use appropriate number formatting (e.g., "1,234 pts", "99.5%")

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a results screen immediately after a game session ends (when 60-second timer expires)

- **FR-002**: Results screen MUST show the player's final score (total points earned during the session)

- **FR-003**: Results screen MUST display the number of correct answers over total questions attempted (format: "X/Y" where X is correct, Y is total)

- **FR-004**: Results screen MUST calculate and display accuracy percentage (correct answers ÷ total questions × 100, rounded to nearest whole number)

- **FR-005**: Results screen MUST use gold/yellow color scheme consistent with retro gaming aesthetic (similar to existing leaderboard gold medals)

- **FR-006**: Results screen MUST include decorative pixel-art framing/borders consistent with the app's Super NES 8-bit design language

- **FR-007**: Results screen MUST display a soft fading blink animation that runs for exactly 5 seconds after the screen appears, then stops

- **FR-008**: Animation MUST use opacity changes (fade in/out) rather than harsh on/off visibility changes

- **FR-009**: Results screen MUST navigate to home page when the player presses the ENTER key

- **FR-010**: Navigation via ENTER key MUST work at any time (even during animation period)

- **FR-011**: Results screen MUST be skipped if the final score is 0 (existing behavior: games with 0 score are not saved to leaderboard)

- **FR-012**: System MUST maintain existing player name display in top-right corner on results screen

### Key Entities

- **GameResult**: Represents the outcome of a completed game session
  - Final score (numeric)
  - Correct answer count (numeric)
  - Total questions attempted (numeric)
  - Accuracy percentage (calculated: correct/total × 100)
  - Results array (existing: list of question/answer pairs)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players see their game results within 1 second of timer expiring

- **SC-002**: 100% of completed games (with score > 0) display accurate statistics (score, correct/total, accuracy %)

- **SC-003**: Results screen animation completes exactly 5 seconds after appearing, then becomes static

- **SC-004**: Players can navigate from results screen to homepage in under 1 second using ENTER key

- **SC-005**: Results screen is visually consistent with existing retro gaming aesthetic (uses gold/yellow colors, pixel borders, retro font)

- **SC-006**: Animation provides positive feedback without causing eye strain or discomfort (soft fade, not harsh blink)

## Assumptions

- **Display Duration**: The results screen remains visible indefinitely until the player presses ENTER (no auto-dismiss after animation ends)

- **Animation Style**: "Soft fading blink" means smooth opacity transitions (e.g., 1.0 → 0.7 → 1.0) over approximately 2-second cycles for 5 seconds total

- **Score Calculation**: Uses existing game logic - score is already calculated and saved by PlayPage

- **Zero Score Behavior**: Follows existing pattern - games with 0 score are not saved to leaderboard, so results screen may be skipped entirely for zero-score games (or shown with encouraging message)

- **Navigation**: Only ENTER key triggers navigation (ESC key behavior to be determined - may trigger same navigation or be ignored)

- **Sound Effects**: No sound effects required for this feature (separate todo item exists for adding positive/negative feedback sounds)

- **Mobile Support**: Touch interactions not specified, but clicking anywhere on screen could also trigger navigation to maintain mouse support (consistent with existing dual-input pattern)

## Dependencies

- Existing PlayPage timer completion logic (game end trigger)
- Existing GameResult data structure and scoring calculation
- Existing navigation system (React Router)
- Existing retro pixel-art styling (CSS animations, color palette, fonts)
- Existing PlayerNameDisplay component (to show player name on results screen)

## Out of Scope

- Sound effects (covered by separate todo item)
- Social sharing of results
- Detailed question-by-question breakdown (just summary stats)
- Comparison to previous games or leaderboard position
- Awards/badges/achievements based on performance
- Retry/restart game button (player returns to homepage first)
- Animation customization or configuration options
