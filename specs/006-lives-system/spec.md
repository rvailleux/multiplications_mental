# Feature Specification: Lives System for Mistake Tracking

**Feature Branch**: `006-lives-system`
**Created**: 2026-01-13
**Status**: Draft
**Input**: User description: "Add a lives system that visually tracks player mistakes during a game session. Start each game with 3 lives represented by heart icons or similar visual indicators. Deduct one life for each incorrect answer. Display the remaining lives prominently on screen so players can see their mistake allowance at a glance. The game should continue even when lives reach zero (lives are for tracking only, not game-ending)."

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Visual Lives Display (Priority: P1)

As a player, I want to see my remaining lives displayed prominently on screen during gameplay so that I can track how many mistakes I've made at a glance.

**Why this priority**: Core visual feedback mechanism that provides immediate awareness of mistake count. This is the foundation of the feature - without visual display, the lives system has no purpose. Delivers immediate value by making mistake tracking visible.

**Independent Test**: Can be fully tested by starting a game and verifying that 3 heart icons are visible on screen. Delivers value by showing players their mistake allowance before any incorrect answers are made.

**Acceptance Scenarios**:

1. **Given** a player starts a new game, **When** the PlayPage loads, **Then** 3 heart icons (❤️) should be displayed prominently on screen
2. **Given** the game is in progress, **When** the player looks at the screen, **Then** the lives display should be clearly visible and distinguishable from other UI elements
3. **Given** hearts are displayed, **When** the player has all 3 lives, **Then** all 3 hearts should be rendered with full opacity/color
4. **Given** the game is reset, **When** the restart button is clicked, **Then** the lives display should reset to 3 hearts

---

### User Story 2 - Lives Deduction on Wrong Answers (Priority: P2)

As a player, when I answer a multiplication question incorrectly, I want one heart to disappear from the display so that I receive visual feedback about my mistake and can see my remaining mistake allowance.

**Why this priority**: Implements the core interaction logic between incorrect answers and lives. This is the behavioral component that makes the lives system functional. Requires User Story 1 (visual display) to be valuable.

**Independent Test**: Can be fully tested by answering questions incorrectly and verifying hearts disappear. Delivers value by providing real-time mistake tracking and visual consequence for errors.

**Acceptance Scenarios**:

1. **Given** a player has 3 lives displayed, **When** they submit an incorrect answer, **Then** the lives count should decrease to 2 hearts
2. **Given** a player has 2 lives displayed, **When** they submit another incorrect answer, **Then** the lives count should decrease to 1 heart
3. **Given** a player has 1 life displayed, **When** they submit another incorrect answer, **Then** the lives count should decrease to 0 hearts (no hearts visible)
4. **Given** a player has 0 lives, **When** they submit another incorrect answer, **Then** the lives count should remain at 0 (cannot go negative)
5. **Given** a player submits a correct answer, **When** the answer is validated, **Then** the lives count should NOT change (lives only decrease on wrong answers)

---

### User Story 3 - Non-Blocking Lives System (Priority: P3)

As a player, when my lives reach zero, I want the game to continue without ending so that I can keep practicing and improving my score regardless of how many mistakes I've made.

**Why this priority**: Ensures the lives system is informational rather than punitive. This differentiates the feature from traditional "game over" mechanics and supports the educational/practice-focused nature of the game. Depends on User Stories 1 & 2 to be meaningful.

**Independent Test**: Can be fully tested by making 3+ incorrect answers and verifying the game continues. Delivers value by removing fear of failure and encouraging continued practice.

**Acceptance Scenarios**:

1. **Given** a player has 0 lives remaining, **When** they submit a correct answer, **Then** the game should accept the answer, increment score, and generate a new question
2. **Given** a player has 0 lives remaining, **When** they submit an incorrect answer, **Then** the game should accept the answer, record the mistake, and generate a new question
3. **Given** a player has 0 lives remaining, **When** the timer continues to count down, **Then** the game should NOT trigger any "game over" state or end early
4. **Given** a player has 0 lives remaining, **When** the 60-second timer expires naturally, **Then** the game should end normally and save the score to localStorage

---

### User Story 4 - Retro Gaming Visual Design (Priority: P4)

As a player, I want the lives display to match the retro 8-bit pixel art aesthetic of the game so that the visual design feels cohesive and immersive.

**Why this priority**: Enhances user experience through consistent visual design. This is a polish/UX enhancement that improves aesthetics but doesn't change core functionality. Requires User Story 1 (visual display) as foundation.

**Independent Test**: Can be fully tested by visual inspection of the lives display during gameplay. Delivers value by maintaining design consistency and enhancing the nostalgic gaming experience.

**Acceptance Scenarios**:

1. **Given** the lives display is rendered, **When** the player views the screen, **Then** the hearts should use emoji or pixel art style consistent with other game elements
2. **Given** the retro gaming theme uses specific fonts/colors, **When** the lives display is shown, **Then** it should use complementary styling (borders, shadows, animations) matching the game's aesthetic
3. **Given** hearts are animated (pulse/bounce), **When** the player views the display, **Then** animations should use CSS keyframes with retro-gaming timing (discrete steps, not smooth transitions)
4. **Given** the game uses positioned elements (clouds, sprites), **When** the lives display is positioned, **Then** it should be clearly separated from other UI elements with proper spacing and visual hierarchy

---

### Edge Cases

- **What happens when a player makes 10 incorrect answers in a row?** - Lives should cap at 0 (cannot go negative), game continues, all mistakes are recorded in results array
- **What happens when lives are at 0 and the player gets a combo streak?** - Combo multiplier should still work normally, lives remain at 0, visual combo indicator displays correctly
- **What happens when the restart button is clicked with 0 lives?** - Lives should reset to 3, along with score/timer/results reset
- **How does the system handle rapid incorrect answers?** - Each incorrect answer should decrement lives by exactly 1 (no race conditions), lives cannot skip values (3→1 should not happen without showing 2)
- **What happens if localStorage is full when saving a 0-lives game?** - The existing score-saving logic should handle this (scores > 0 are saved, regardless of lives count)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST initialize each game session with exactly 3 lives
- **FR-002**: System MUST display the current lives count as visual heart indicators on the gameplay screen
- **FR-003**: System MUST decrement lives by 1 when an incorrect answer is submitted
- **FR-004**: System MUST NOT decrement lives when a correct answer is submitted
- **FR-005**: System MUST prevent lives count from going below 0 (minimum value is 0)
- **FR-006**: System MUST allow gameplay to continue even when lives reach 0 (no game-ending logic triggered)
- **FR-007**: System MUST reset lives to 3 when the game is restarted
- **FR-008**: System MUST display hearts prominently in a clearly visible location on the gameplay screen
- **FR-009**: System MUST render the number of heart indicators matching the current lives count (3 hearts = 3 lives visible)
- **FR-010**: System MUST apply visual styling to hearts that matches the retro gaming aesthetic of the application

### Key Entities *(include if feature involves data)*

- **Lives State**: Integer value (0-3) representing current lives count
  - Initialized to 3 on game start
  - Decremented on incorrect answers
  - Reset to 3 on game restart
  - Never negative (clamped to minimum 0)
  - Does NOT affect game ending logic (informational only)

- **Heart Display**: Visual representation of lives
  - Array of heart emoji (❤️) rendered with React `key` prop
  - Length of array equals current lives count
  - Styled with pixel art aesthetic (animations, sizing)
  - Positioned prominently on PlayPage (centered, bottom area)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can see exactly how many lives remain at any moment during gameplay without UI confusion (verified by user testing with 5+ players confirming immediate understanding)
- **SC-002**: Players with 0 lives can complete a full 60-second game session without encountering "game over" screens or forced navigation
- **SC-003**: Lives system correctly tracks mistakes across rapid-fire incorrect answers (verified by submitting 10 consecutive wrong answers in 5 seconds with correct count maintained)
- **SC-004**: Visual design of hearts is consistent with the existing retro gaming aesthetic (verified by visual comparison showing matching color palette, font styles, and animation patterns)
- **SC-005**: Lives reset correctly 100% of the time when restart button is clicked across 100 test iterations (no state errors)
- **SC-006**: Lives decrement exactly once per incorrect answer and remain unchanged for correct answers (verified across all game scenarios)
- **SC-007**: Lives count stays synchronized with answer validation logic without timing issues or race conditions (verified by rapid interaction testing)

## Implementation Notes

### Current State Analysis

Based on code review of `/src/pages/PlayPage.tsx` (as of 2026-01-13), the lives system has already been **partially implemented**:

**Existing Implementation**:
- ✅ Lives state initialized: `const [lives, setLives] = useState(3)` (line 38)
- ✅ Lives decrement on wrong answers: `setLives(prev => Math.max(0, prev - 1))` (line 73)
- ✅ Lives reset on restart: `setLives(3)` (line 155)
- ✅ Visual display with hearts: `<div style={styles.livesDisplay}>` (lines 163-169)
- ✅ Heart animation: `pulse` keyframe animation (line 275)

**Implementation Quality**:
- ✅ Uses functional state update pattern (`prev => ...`) to prevent stale state bugs
- ✅ Uses `Math.max(0, prev - 1)` to prevent negative lives
- ✅ Uses `Array.from({ length: lives }, ...)` for dynamic rendering
- ✅ Follows retro gaming aesthetic with emoji hearts and CSS animations

**Gaps/Missing Elements**:
- ❌ **No component tests** for lives system functionality
- ❌ **No integration tests** verifying lives synchronization with answer callbacks
- ❌ **No edge case tests** (0 lives game continuation, rapid decrements, reset validation)
- ❌ **No JSDoc documentation** for lives-related state/functions
- ❌ **Lives display could be more prominent** (currently at bottom, could be in stats bar)
- ❌ **No visual differentiation** for 0 lives state (could fade hearts or show ghost hearts)

### Implementation Plan (Testing Focus)

Since the core functionality is already implemented, the primary work is:

1. **Test Coverage** (Priority 1 - NON-NEGOTIABLE per Constitution)
   - Write comprehensive component tests for PlayPage lives logic
   - Test lives initialization, decrement, reset, clamping at 0
   - Test interaction with handleBadAnswer/handleCorrectAnswer
   - Test visual rendering of hearts at different life counts

2. **Documentation** (Priority 2 - Required per Constitution)
   - Add JSDoc comments for lives state and related logic
   - Document lives system behavior in component header comment
   - Update ARCHITECTURE.md if pattern is reusable

3. **UX Enhancements** (Priority 3 - Optional improvements)
   - Consider moving lives display to stats bar for better visibility
   - Add visual state differentiation for 0 lives (e.g., ghost hearts)
   - Add sound effects for lives lost (8-bit style, if sfx system exists)

4. **Quality Assurance** (Priority 4 - Required per Constitution)
   - Run `npm run type-check` - ensure no TypeScript errors
   - Run `npm run lint:fix` - fix any linting issues
   - Run `npm run build` - verify production build succeeds
   - Run `npm run test:coverage` - verify >80% coverage

### Technical Constraints

- **React 19.0.0**: Must use modern functional component patterns
- **TypeScript 5.7+**: Lives state must be explicitly typed as `number`
- **Vitest 4.0+**: Tests must use React Testing Library with user-centric assertions
- **localStorage**: Lives are session-state only (not persisted between game sessions)
- **Retro Gaming UX (Constitution VI)**: Lives display must match 8-bit pixel art aesthetic

### Testing Strategy

**Unit Tests** (PlayPage.test.tsx):
```typescript
describe('Lives System', () => {
  it('should initialize with 3 lives', () => { ... })
  it('should decrement lives on incorrect answer', () => { ... })
  it('should not decrement lives on correct answer', () => { ... })
  it('should clamp lives at 0 (no negative values)', () => { ... })
  it('should reset lives to 3 on restart', () => { ... })
  it('should continue game with 0 lives', () => { ... })
  it('should render correct number of heart icons', () => { ... })
})
```

**Integration Tests**:
```typescript
describe('Lives System Integration', () => {
  it('should synchronize lives with answer submissions', () => { ... })
  it('should handle rapid incorrect answers without race conditions', () => { ... })
  it('should save scores correctly with 0 lives', () => { ... })
})
```

### Accessibility Considerations

- **Keyboard Navigation**: Lives are display-only (no interaction required)
- **Screen Readers**: Consider adding aria-label for lives count (e.g., `aria-label="3 lives remaining"`)
- **Color Blindness**: Heart emoji is universally recognizable (red not critical)
- **Low Vision**: Hearts use 32px font size (line 275) - sufficiently large

### Future Enhancements (Out of Scope)

- **Lives Recovery**: Gain a life back after X consecutive correct answers (combo reward)
- **Difficulty Modes**: Easy (5 lives), Normal (3 lives), Hard (1 life)
- **Lives Persistence**: Save lives count to localStorage for resume-game feature
- **Lives Leaderboard**: Track "fewest mistakes" alongside highest score
- **Sound Effects**: 8-bit "damage" sound when life is lost
- **Visual Effects**: Shake animation when life is lost, celebratory effect when all lives preserved
- **Per-Player Lives**: Track lives separately for each player profile

---

**Version**: 1.0.0
**Last Updated**: 2026-01-13
**Next Steps**: Proceed to `/plan` workflow to generate implementation plan and tasks
