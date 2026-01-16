# Feature Specification: Combo System for Consecutive Correct Answers

**Feature Branch**: `005-combo-system`
**Created**: 2026-01-13
**Status**: Draft
**Input**: User description: "Implement a combo reward system that tracks consecutive correct answers during a game session. Display the current combo count prominently on screen and award bonus points when players maintain streaks. Reset the combo counter to zero whenever an incorrect answer is given. Use visual indicators like animations or color changes to celebrate when combos are achieved or broken."

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories are PRIORITIZED as user journeys ordered by importance.
  Each user story/journey is INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
-->

### User Story 1 - Basic Combo Tracking and Display (Priority: P1)

A player wants to see immediate feedback when they answer questions correctly in succession, building a streak that motivates them to continue.

**Why this priority**: This is the core MVP functionality. Without tracking and displaying the combo, the feature provides no value. This can be delivered independently and immediately improves engagement.

**Independent Test**: Can be fully tested by answering 3 questions correctly and verifying the combo counter increments from 0→1→2→3, delivering immediate visual feedback without needing bonus points or animations.

**Acceptance Scenarios**:

1. **Given** a player starts a new game, **When** they answer the first question correctly, **Then** the combo counter should display "COMBO x1" or similar indicator
2. **Given** a player has a combo of 3, **When** they answer another question correctly, **Then** the combo counter should increment to 4
3. **Given** a player has a combo of 5, **When** they answer a question incorrectly, **Then** the combo counter should reset to 0 and disappear from view
4. **Given** a player has no combo (0), **When** they answer incorrectly, **Then** the combo counter should remain hidden/at 0
5. **Given** a player's combo resets to 0, **When** they answer the next question correctly, **Then** the combo counter should start again at 1

---

### User Story 2 - Visual Celebration and Feedback (Priority: P2)

A player wants to feel rewarded when achieving combo milestones through visual effects that celebrate their success and make the experience more engaging.

**Why this priority**: Visual feedback enhances the gaming experience and provides dopamine hits that increase engagement. This builds on P1 (combo tracking) but isn't required for basic functionality.

**Independent Test**: Can be tested by achieving combos of different levels (1, 3, 5, 10+) and verifying appropriate visual animations trigger (color changes, particle effects, screen shake, etc.) without requiring the bonus point system.

**Acceptance Scenarios**:

1. **Given** a player achieves a combo of 1, **When** the combo display appears, **Then** it should use subtle animation (fade in, slight scale)
2. **Given** a player achieves a combo of 3, **When** the combo increments, **Then** the display should show enhanced animation (pulsing, fire emoji 🔥)
3. **Given** a player achieves a combo of 5, **When** the combo increments, **Then** the display should trigger celebration effects (color shift to gold, larger scale, sparkle)
4. **Given** a player achieves a combo of 10+, **When** the combo increments, **Then** the display should trigger maximum celebration (rainbow effect, screen shake, particle burst)
5. **Given** a player's combo breaks, **When** they answer incorrectly, **Then** the display should show a "break" animation (fade to red, shake, disappear)
6. **Given** combo visual effects are playing, **When** the game timer expires, **Then** animations should cleanly stop without errors

---

### User Story 3 - Bonus Point Multiplier System (Priority: P3)

A player wants to earn more points for maintaining longer combos, incentivizing accuracy and creating strategic depth in the scoring system.

**Why this priority**: Bonus points add game depth and replayability but depend on P1 (combo tracking). This is an enhancement that can be added after core functionality exists.

**Independent Test**: Can be tested by achieving various combo levels and verifying point calculations match the multiplier formula (e.g., combo x1 = 100pts, combo x2 = 200pts, combo x3 = 300pts, etc.), delivering measurable score improvements.

**Acceptance Scenarios**:

1. **Given** a player has no combo, **When** they answer correctly, **Then** they should earn base points (e.g., 100 points) and combo increments to 1
2. **Given** a player has a combo of 2, **When** they answer correctly, **Then** they should earn 200 points (100 × 2) and combo increments to 3
3. **Given** a player has a combo of 5, **When** they answer correctly, **Then** they should earn 500 points (100 × 5) and combo increments to 6
4. **Given** a player earns bonus points, **When** the score updates, **Then** an animated popup should display the points earned (e.g., "+300!")
5. **Given** a player has a combo of 10, **When** they answer incorrectly, **Then** they should earn 0 points, combo resets to 0, and no bonus is applied
6. **Given** a game session ends, **When** final score is calculated, **Then** it should include all bonus points earned from combos throughout the session

---

### User Story 4 - Combo History and Statistics (Priority: P4)

A player wants to review their combo performance after a game session to understand their consistency and track improvement over time.

**Why this priority**: This is a nice-to-have analytics feature that builds on P1-P3. It provides long-term engagement but isn't essential for the immediate gameplay experience.

**Independent Test**: Can be tested by completing a game with various combos and verifying the post-game screen displays combo statistics (highest combo, average combo, total combos broken, etc.), delivering performance insights.

**Acceptance Scenarios**:

1. **Given** a game session completes, **When** the results screen displays, **Then** it should show "Highest Combo: X"
2. **Given** a game session completes, **When** the results screen displays, **Then** it should show "Total Combos Broken: Y"
3. **Given** a player has multiple game sessions, **When** viewing leaderboard, **Then** highest combo achieved should be displayed alongside score
4. **Given** a player views game history, **When** reviewing past sessions, **Then** combo statistics should persist in localStorage

---

### Edge Cases

- **What happens when a player submits an empty answer?** - Should be treated as incorrect, breaking the combo and resetting to 0
- **What happens when the timer expires mid-combo?** - Combo progress should be preserved in the score but not carried to next game session
- **What happens when the combo reaches very high numbers (50+)?** - Display should scale appropriately without UI breaking, consider max multiplier cap
- **What happens if combo display overlaps with other UI elements?** - Combo display should have appropriate z-index and positioning to avoid obscuring critical game elements
- **What happens when animations lag on slower devices?** - Animations should be CSS-based with fallbacks, not blocking gameplay
- **What happens when a player restarts the game mid-combo?** - Combo should reset to 0 when the restart button is clicked
- **How does combo interact with the lives system?** - Losing a life should break the combo (currently in PlayPage.tsx, lives decrement on wrong answers)
- **What happens when combo display shows during score popup animation?** - Both animations should play without conflict, combo display should be positioned to avoid overlap
- **What happens if a player rapidly submits answers?** - Combo should increment reliably without race conditions or missed updates

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST track consecutive correct answers as a "combo" counter starting from 1 after the first correct answer
- **FR-002**: System MUST increment the combo counter by 1 for each consecutive correct answer
- **FR-003**: System MUST reset the combo counter to 0 when an incorrect answer is submitted
- **FR-004**: System MUST hide the combo display when combo count is 0 or 1 (display only appears at combo 2+)
- **FR-005**: System MUST display the current combo count prominently on screen during gameplay (e.g., "🔥 COMBO x3 🔥")
- **FR-006**: System MUST apply visual effects to the combo display based on combo level:
  - Combo 2-3: Standard display with subtle animation
  - Combo 4-6: Enhanced animation with fire emoji 🔥
  - Combo 7-9: Stronger visual effects (color change, scale increase)
  - Combo 10+: Maximum celebration effects (rainbow, particles, screen shake)
- **FR-007**: System MUST calculate bonus points using the formula: `points = basePoints × comboMultiplier` where `comboMultiplier = combo count`
- **FR-008**: System MUST display an animated popup showing the points earned after each correct answer (e.g., "+300")
- **FR-009**: System MUST animate the combo display when it appears, increments, or breaks
- **FR-010**: System MUST reset combo to 0 when the game restarts or when a new game session begins
- **FR-011**: System MUST maintain combo state throughout the 60-second game session
- **FR-012**: System MUST stop all combo animations when the game timer expires
- **FR-013**: System MUST persist combo statistics (highest combo, total bonuses) in the game result saved to localStorage
- **FR-014**: System MUST ensure combo display does not obscure the question, answer input, or timer
- **FR-015**: System MUST handle rapid answer submissions without race conditions in combo state

### Key Entities *(include if feature involves data)*

- **Combo State**: Current consecutive correct answer count (number, 0 to infinity)
  - Tracks current streak during active game session
  - Resets to 0 on incorrect answer or game restart
  - Increments by 1 on each correct answer

- **Combo Statistics** (stored in GameResult): Historical combo performance data
  - `highestCombo`: Maximum combo achieved during the game session (number)
  - `totalBonusPoints`: Total bonus points earned from combos (number)
  - `comboBrokenCount`: Number of times combo was broken during session (number)
  - Persisted to localStorage with game results

- **Combo Visual State**: UI rendering state for animations
  - `showComboDisplay`: Boolean flag controlling visibility
  - `comboAnimationLevel`: Enum or number determining which visual effect tier to display
  - `comboBreakAnimation`: Boolean flag triggering break animation

- **Point Calculation**: Relationship between combo and score
  - `basePoints`: Fixed point value per correct answer (100)
  - `bonusMultiplier`: Derived from combo count (multiplier = combo)
  - `totalPoints`: `basePoints × bonusMultiplier`

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can see the combo counter increment visually within 100ms of answering correctly
- **SC-002**: Combo counter resets to 0 and disappears within 100ms when an incorrect answer is submitted
- **SC-003**: Visual effects for combo milestones (3, 5, 10) trigger reliably and complete within 800ms
- **SC-004**: Bonus point calculations are accurate for all combo levels (tested from combo 1 to combo 20+)
- **SC-005**: Score popup displays the correct bonus points for each combo level
- **SC-006**: Combo state persists throughout the entire 60-second game session without bugs
- **SC-007**: Combo display is positioned to avoid overlap with question area, answer input, timer, and score display
- **SC-008**: All combo animations run smoothly at 60fps on modern browsers (Chrome, Firefox, Safari)
- **SC-009**: Combo statistics (highest combo, total bonus points) are correctly saved to localStorage after game session
- **SC-010**: System handles edge cases gracefully: empty submissions, rapid answers, game restarts, timer expiration
- **SC-011**: Test coverage for combo system is >90% (unit tests for logic, component tests for UI)
- **SC-012**: Keyboard-first and mouse interaction both work correctly with combo system (no input-specific bugs)
- **SC-013**: Players report increased engagement and motivation due to combo system (qualitative feedback or A/B testing shows improvement)

## Technical Considerations

### Existing Implementation Analysis

**Current Combo Implementation (PlayPage.tsx lines 35-80)**:
- Combo state already exists: `const [combo, setCombo] = useState(0)`
- Combo increments on correct answer: `setCombo(newCombo)` where `newCombo = combo + 1`
- Bonus points calculated: `const points = 100 * newCombo`
- Combo resets on incorrect answer: `setCombo(0)`
- Score popup exists: `setScorePopup('+${points}')` with `showPopup` state

**Current Combo Display (MultiplicationQuestion.tsx lines 74-84)**:
- Basic combo display exists: Shows "🔥 COMBO x{combo} 🔥" when `combo > 1`
- Simple animation: `comboShake 0.5s ease` applied when combo > 1
- Positioned above question area with `marginBottom: '15px'`

**Gaps to Address**:
1. Enhanced visual effects for different combo tiers (currently only one animation)
2. Combo break animation (currently just disappears)
3. Combo statistics persistence in GameResult structure
4. More sophisticated visual celebration effects (color changes, particles, screen shake)
5. Performance optimization for rapid submissions
6. Accessibility considerations (reduced motion preference)

### Integration Points

- **PlayPage.tsx**: Manages combo state, handles increment/reset logic, calculates bonus points
- **MultiplicationQuestion.tsx**: Displays combo counter and animations, receives combo as prop
- **GameResult type**: Extended to include combo statistics for localStorage persistence
- **CSS animations**: New keyframe animations for different combo tier effects
- **ProgressBar.tsx**: Potential integration for combo-based progress effects (stretch goal)

### Performance Considerations

- **Animation Performance**: Use CSS transforms and opacity (GPU-accelerated) instead of layout-triggering properties
- **State Updates**: Batch state updates to prevent unnecessary re-renders
- **Animation Cleanup**: Ensure setTimeout/setInterval are cleaned up to prevent memory leaks
- **Reduced Motion**: Respect `prefers-reduced-motion` media query for accessibility
- **Z-index Management**: Establish clear z-index hierarchy to prevent overlap issues

### Testing Strategy

1. **Unit Tests (Vitest)**:
   - Combo increment logic
   - Combo reset logic
   - Bonus point calculation formula
   - Edge case handling (negative values, very high combos)

2. **Component Tests (React Testing Library)**:
   - Combo display visibility based on combo value
   - Combo animations trigger correctly
   - Score popup displays correct values
   - Accessibility (keyboard navigation, reduced motion)

3. **Integration Tests**:
   - Full game flow with combos (start → correct answers → incorrect answer → reset)
   - localStorage persistence of combo statistics
   - Interaction with lives system
   - Timer expiration with active combo

4. **Manual Testing Checklist**:
   - Visual appearance across different combo tiers
   - Animation smoothness on different devices
   - Overlap detection with other UI elements
   - Performance with rapid submissions
   - Keyboard and mouse input consistency

## Open Questions

1. Should there be a maximum combo multiplier cap to prevent score inflation? (e.g., cap at 10x)
2. Should combo statistics be displayed on the leaderboard/home page?
3. Should there be audio feedback for combo milestones? (8-bit sound effects already available in `/public/audio/sfx/`)
4. Should combo breaking trigger a negative sound effect or visual punishment (beyond just losing the multiplier)?
5. Should there be different combo tiers with special names? (e.g., "Hot Streak" at 5, "On Fire" at 10, "Unstoppable" at 15)
6. Should the base points value (100) be configurable or remain hardcoded?
7. Should combo affect the difficulty of subsequent questions (progressive difficulty based on skill)?

## Dependencies

- **React 19.0.0**: useState, useEffect hooks for combo state management
- **TypeScript 5.7.2**: Type definitions for combo statistics in GameResult
- **CSS Animations**: Keyframe animations for visual effects (no external animation library required)
- **localStorage**: Persistence of combo statistics with game results
- **Existing Components**: PlayPage.tsx, MultiplicationQuestion.tsx as integration points

## Future Enhancements

- **Combo Leaderboard**: Separate leaderboard for highest combo achieved across all sessions
- **Combo Challenges**: Special achievements for maintaining combos (e.g., "Get a 15x combo")
- **Combo Sound Effects**: 8-bit retro sounds for combo milestones and breaks
- **Combo Particles**: Canvas-based particle effects for visual celebration
- **Combo Heat Map**: Visual representation of combo performance over time
- **Multiplayer Combo Battle**: Compete with other players for longest combo in real-time
- **Adaptive Difficulty**: Questions get harder as combo increases, creating risk/reward dynamic
