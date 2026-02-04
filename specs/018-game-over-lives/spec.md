# Feature Specification: Game Over When Lives Depleted

**Feature Branch**: `018-game-over-lives`
**Created**: 2026-02-03
**Status**: Draft
**Input**: User description: "End the game when the player consumed all their lives/hearts. A game ends when the player loses and they don't have any heart left. The player loses when they answer the 4th wrong answer."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Game Ends When All Lives Lost (Priority: P1)

As a player, when I answer incorrectly 4 times during a game, my game should end immediately so that I understand the consequence of wrong answers and can try again.

The current game has a lives system that displays 3 hearts, but the game only ends when the 60-second timer expires. This feature adds a second game-ending condition: losing all lives by answering incorrectly 4 times.

**Why this priority**: This is the core feature - without game-over on lives depleted, the lives display is purely decorative with no gameplay impact.

**Independent Test**: Can be fully tested by intentionally answering 4 questions incorrectly and verifying the game ends before the timer expires.

**Acceptance Scenarios**:

1. **Given** a player is in an active game with 3 lives (hearts displayed), **When** they answer incorrectly for the 4th time (reaching 0 lives), **Then** the game ends immediately and navigates to the Game Results screen.

2. **Given** a player has 1 life remaining, **When** they answer incorrectly, **Then** the game ends immediately (not waiting for timer).

3. **Given** a player has 0 lives, **When** the game ends, **Then** the results screen shows the score achieved and all question results.

---

### User Story 2 - Visual Feedback on Final Life Lost (Priority: P2)

As a player, when I lose my last life, I want clear visual feedback indicating the game is over so that I understand why the game ended.

**Why this priority**: Enhances user experience but not essential for core functionality. The game ends correctly even without this, but the transition may feel abrupt.

**Independent Test**: Can be tested by losing the final life and observing the visual transition before navigation to results.

**Acceptance Scenarios**:

1. **Given** a player has 1 life remaining, **When** they answer incorrectly, **Then** a brief "Game Over" visual indicator appears before transitioning to results.

2. **Given** a player loses their last life, **When** the game-over state triggers, **Then** the last heart visually breaks/disappears with animation before the game ends.

---

### User Story 3 - Distinguish Timer End vs Lives Depleted (Priority: P3)

As a player viewing my results, I want to know whether my game ended because time ran out or because I lost all lives, so I can understand my performance better.

**Why this priority**: Nice-to-have context for player improvement, but not essential for core game mechanics.

**Independent Test**: Can be tested by ending games via both methods and comparing the results display.

**Acceptance Scenarios**:

1. **Given** a player's game ends due to losing all lives, **When** viewing the results screen, **Then** an indicator shows the game ended due to "No Lives Remaining" (or similar).

2. **Given** a player's game ends due to timer expiring, **When** viewing the results screen, **Then** an indicator shows the game ended due to "Time's Up" (or similar).

---

### Edge Cases

- What happens if the player loses their last life at the exact moment the timer expires? The lives-depleted condition should take precedence since it triggers first.
- What happens if the player has answered no questions correctly but loses all lives? The results screen should still display with a score of 0.
- What if the player navigates away (Escape/Quit) while having 0 lives? The pause menu should still work normally.

## E2E Test Scenarios *(mandatory)*

### E2E-US1-001: Game Ends After 4th Wrong Answer

**User Story**: User Story 1 - Game Ends When All Lives Lost

**Test Flow**:
1. **Navigate** to Player Select page
   - Screenshot: `01-player-select.png`
2. **Select Player**: Press ArrowDown, then Enter to select a player
3. **Start Game**: Navigate to Home, click "Start Game"
   - Screenshot: `02-game-started-3-lives.png`
4. **Answer Incorrectly**: Type a wrong answer, press Enter
   - Screenshot: `03-after-first-wrong-2-lives.png`
5. **Answer Incorrectly**: Type a wrong answer, press Enter
   - Screenshot: `04-after-second-wrong-1-life.png`
6. **Answer Incorrectly**: Type a wrong answer, press Enter
   - Screenshot: `05-after-third-wrong-0-lives.png`
7. **Answer Incorrectly**: Type a wrong answer, press Enter
   - Screenshot: `06-game-over-transition.png`
8. **Verify State**: Check URL changed to /results

**Expected Outcome**: After the 4th wrong answer, game immediately ends and navigates to Game Results page.

**Visual Validation**: Results page shows score achieved, timer should NOT have expired (still time remaining when game ended).

---

### E2E-US1-002: Game Ends with Mixed Correct and Wrong Answers

**User Story**: User Story 1 - Game Ends When All Lives Lost

**Test Flow**:
1. **Start Game**: Complete player selection and start game
2. **Answer Correctly**: Type correct answer, press Enter (score increases)
3. **Answer Incorrectly**: Type wrong answer 4 times (with some correct answers interspersed)
4. **Verify**: Game ends on 4th wrong answer regardless of correct answers

**Expected Outcome**: Game tracks wrong answers independently of correct answers; ends on 4th wrong.

---

### E2E-US1-003: Lives Reset on Game Restart

**User Story**: User Story 1 - Game Ends When All Lives Lost

**Test Flow**:
1. **Play Game**: Lose all lives, reach Game Over
2. **Return to Home**: Navigate back to home screen
3. **Start New Game**: Click Start Game
4. **Verify Lives**: Confirm 3 hearts are displayed

**Expected Outcome**: New game starts fresh with 3 lives, previous game's lives do not carry over.

---

### E2E-US2-001: Visual Game Over Indicator

**User Story**: User Story 2 - Visual Feedback on Final Life Lost

**Test Flow**:
1. **Start Game**: Begin with 3 lives
2. **Lose Lives**: Answer incorrectly 3 times (1 life remaining)
3. **Lose Final Life**: Answer incorrectly
   - Screenshot: `07-game-over-visual.png`
4. **Observe**: Brief game-over visual before navigation

**Expected Outcome**: Visual "Game Over" indicator displays momentarily before results screen.

---

### E2E-US3-001: Results Show Game End Reason

**User Story**: User Story 3 - Distinguish Timer End vs Lives Depleted

**Test Flow**:
1. **Scenario A - Lives Depleted**:
   - Start game, answer incorrectly 4 times
   - Check results screen for "No Lives" indicator
   - Screenshot: `08-results-lives-depleted.png`
2. **Scenario B - Timer Expired**:
   - Start game, answer correctly until timer runs out
   - Check results screen for "Time's Up" indicator
   - Screenshot: `09-results-timer-expired.png`

**Expected Outcome**: Results screen clearly indicates why the game ended.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST end the game immediately when the player's lives reach 0.
- **FR-002**: System MUST navigate to the Game Results screen when game ends due to lives depleted.
- **FR-003**: System MUST save the player's score and question results when game ends due to lives depleted (same as timer expiry).
- **FR-004**: System MUST display a brief visual "Game Over" indicator when the last life is lost.
- **FR-005**: System MUST reset lives to 3 when a new game starts.
- **FR-006**: System MUST stop the timer when game ends due to lives depleted.
- **FR-007**: System MUST stop gameplay music when game ends due to lives depleted.
- **FR-008**: Results screen MUST indicate whether the game ended due to lives depleted or timer expiry.

### Key Entities

- **Lives**: Integer counter starting at 3, decremented on each wrong answer, triggers game-over at 0.
- **GameEndReason**: Categorical value indicating why the game ended ("lives_depleted" or "timer_expired").
- **GameResult**: Extended to include the reason the game ended.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of games where player answers incorrectly 4 times end immediately (not waiting for timer).
- **SC-002**: Game-over transition completes within 2 seconds of the 4th wrong answer.
- **SC-003**: Players can distinguish between timer-end and lives-end scenarios on the results screen.
- **SC-004**: Lives reset correctly 100% of the time when starting a new game after game-over.

## Assumptions

- The existing lives counter (starting at 3) and heart display are already implemented and functional.
- The current game flow already supports saving results and navigating to the results page on timer expiry.
- The "wrong answer" detection is already implemented and triggers the lives decrement.
- The game-over visual indicator should maintain the retro 8-bit aesthetic consistent with the rest of the application.
- The game-over transition should be brief (under 2 seconds) to maintain game pacing.

## Dependencies

- Existing PlayPage component with lives state management.
- Existing GameResultsPage component for displaying end-of-game information.
- Existing navigation flow between game and results pages.
- Answer feedback system (feature 015-answer-feedback) for visual/audio cues.
