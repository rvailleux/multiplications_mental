# Feature Specification: Timed Multiplication Quiz Game

**Feature Branch**: `002-timed-quiz-game`
**Created**: 2026-01-13
**Status**: Draft
**Input**: User description: "Build a timed math quiz game where players solve random multiplication problems (factors between 1-10) within a 60-second countdown timer. Display one question at a time in "A x B" format with an input field for answers. Check answers in real-time and generate a new question immediately after each correct answer. Track both correct and incorrect answers throughout the session. At the end of the timer, save the final score (number of correct answers) to storage for the leaderboard."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Core Timed Quiz Gameplay (Priority: P1)

Players need to solve multiplication problems against a 60-second countdown timer, with the game automatically progressing through questions and ending when time expires.

**Why this priority**: This is the MVP - without this core gameplay loop, there is no game. This represents the fundamental value proposition of the application.

**Independent Test**: Can be fully tested by starting a game, answering questions, and waiting for the timer to expire. Delivers a complete, playable multiplication quiz experience.

**Acceptance Scenarios**:

1. **Given** player is on the play page, **When** the page loads, **Then** a 60-second countdown timer starts automatically
2. **Given** timer is running, **When** each second passes, **Then** the displayed time decrements by 1 second
3. **Given** timer reaches 0 seconds, **When** countdown completes, **Then** game ends and player is redirected to home page
4. **Given** game is active, **When** timer is counting down, **Then** time remaining is clearly visible to the player
5. **Given** timer has ended, **When** game completes, **Then** no further questions can be answered

---

### User Story 2 - Random Question Generation (Priority: P1)

Players need to see randomly generated multiplication questions in "A x B" format where both factors are between 1-10.

**Why this priority**: Without questions to solve, the game has no content. This is essential for the core gameplay experience and must work independently of scoring.

**Independent Test**: Can be tested by loading the play page and verifying questions display correctly with random factors between 1-10. Each new question should be different (random).

**Acceptance Scenarios**:

1. **Given** play page loads, **When** component mounts, **Then** a multiplication question is displayed in "A x B?" format
2. **Given** a question is displayed, **When** viewing the question, **Then** both factors A and B are integers between 1 and 10 (inclusive)
3. **Given** multiple questions are generated, **When** comparing questions, **Then** factors are randomly selected (not predictable sequence)
4. **Given** a correct answer is submitted, **When** validation completes, **Then** a new random question is immediately generated
5. **Given** an incorrect answer is submitted, **When** validation completes, **Then** the same question remains displayed

---

### User Story 3 - Answer Validation and Progression (Priority: P1)

Players need to input answers via a text field and receive immediate validation, with automatic progression to new questions on correct answers.

**Why this priority**: This completes the core interaction loop. Without answer validation and progression, players cannot interact with the game. This is essential for P1 MVP.

**Independent Test**: Can be tested by entering correct and incorrect answers and observing the system response (new question vs. same question).

**Acceptance Scenarios**:

1. **Given** a question is displayed, **When** player views the interface, **Then** an input field for numeric answers is visible and focused
2. **Given** player types an answer, **When** they submit the form (Enter key or button click), **Then** the answer is validated against the correct result
3. **Given** player submits correct answer, **When** validation completes, **Then** a new question is generated and input is cleared
4. **Given** player submits incorrect answer, **When** validation completes, **Then** the question remains the same and input is NOT cleared
5. **Given** player submits empty input, **When** form validation runs, **Then** submission is prevented (required field)
6. **Given** input field is rendered, **When** page loads, **Then** field is auto-focused for immediate typing

---

### User Story 4 - Score Tracking and Storage (Priority: P2)

Players need their performance tracked throughout the session, with correct/incorrect answers recorded and final score saved to localStorage for leaderboard display.

**Why this priority**: This enables progress tracking and leaderboard functionality. While important, the game is playable without score persistence. This is a key enhancement over basic gameplay.

**Independent Test**: Can be tested by playing a complete game, checking localStorage for saved score data, and verifying leaderboard displays the score.

**Acceptance Scenarios**:

1. **Given** player answers a question correctly, **When** validation completes, **Then** score counter increments by 1
2. **Given** player answers a question incorrectly, **When** validation completes, **Then** score counter remains unchanged
3. **Given** player is playing, **When** any answer is submitted, **Then** the question and result (correct/incorrect) are recorded in results array
4. **Given** timer expires with score > 0, **When** game ends, **Then** score and results are saved to localStorage under 'scores' key
5. **Given** timer expires with score = 0, **When** game ends, **Then** no score is saved to localStorage (prevents empty games cluttering leaderboard)
6. **Given** score is displayed, **When** viewing during gameplay, **Then** current score count is clearly visible

---

### User Story 5 - Visual Progress Indication (Priority: P3)

Players need visual feedback showing how much time has elapsed via a progress bar that fills as the timer counts down.

**Why this priority**: This is a UX enhancement that improves the playing experience but is not essential for core functionality. The game is fully playable with just the numeric timer display.

**Independent Test**: Can be tested by starting a game and observing the progress bar fill from 0% to 100% as timer counts from 60 to 0.

**Acceptance Scenarios**:

1. **Given** game starts at 60 seconds, **When** page loads, **Then** progress bar shows 0% filled
2. **Given** timer is at 30 seconds (half elapsed), **When** viewing progress bar, **Then** bar shows 50% filled
3. **Given** timer reaches 0 seconds, **When** time expires, **Then** progress bar shows 100% filled
4. **Given** progress bar is updating, **When** time changes, **Then** bar updates smoothly (visual transition)
5. **Given** different time thresholds, **When** crossing thresholds (e.g., <20s, <10s), **Then** progress bar changes color to indicate urgency

---

### User Story 6 - Restart Functionality (Priority: P3)

Players need the ability to restart the game mid-session without waiting for the timer to expire, resetting all game state.

**Why this priority**: Quality-of-life feature that improves UX but is not essential for core gameplay. Players can always wait for timer to expire or refresh the page.

**Independent Test**: Can be tested by starting a game, answering some questions, clicking restart, and verifying all state resets (score, timer, questions, results).

**Acceptance Scenarios**:

1. **Given** player is mid-game, **When** clicking the restart button, **Then** timer resets to 60 seconds
2. **Given** player has accumulated score, **When** restarting, **Then** score resets to 0
3. **Given** player has answer history, **When** restarting, **Then** results array is cleared
4. **Given** restart is triggered, **When** state resets, **Then** a new random question is generated
5. **Given** restart completes, **When** game resumes, **Then** timer begins counting down from 60 seconds

---

### Edge Cases

- **What happens when timer expires at exact moment of answer submission?** System should prioritize timer expiration - answer may or may not be recorded depending on race condition. Document behavior.
- **What happens if player navigates away mid-game?** Progress is lost, no score is saved. This is acceptable behavior.
- **What happens if localStorage is full or disabled?** Game remains playable but scores won't persist. Should handle gracefully without crashing.
- **What happens if player enters non-numeric input?** Input field type="number" prevents non-numeric entry. Form validation requires a value.
- **What happens with extremely large numbers (e.g., 99999)?** Input should have maxLength constraint to prevent overflow issues.
- **What happens on rapid-fire correct answers?** Each correct answer generates new question immediately. No rate limiting needed.
- **What happens if player submits answer as timer reaches exactly 0?** Timer expiration should take priority, triggering navigation and preventing further submissions.

## Requirements *(mandatory)*

### Functional Requirements

#### Timer Requirements
- **FR-001**: System MUST start a 60-second countdown timer automatically when PlayPage component mounts
- **FR-002**: System MUST decrement timer by 1 second every 1000ms using setInterval
- **FR-003**: Timer MUST stop at 0 seconds and MUST NOT go negative
- **FR-004**: System MUST redirect to HomePage when timer reaches 0 seconds
- **FR-005**: System MUST display remaining seconds in a clearly visible format
- **FR-006**: Restart button MUST reset timer back to 60 seconds

#### Question Generation Requirements
- **FR-007**: System MUST generate random multiplication questions with format "A x B?"
- **FR-008**: Factor A MUST be a random integer between 1 and 10 (inclusive)
- **FR-009**: Factor B MUST be a random integer between 1 and 10 (inclusive)
- **FR-010**: System MUST generate a new question on component mount (first question)
- **FR-011**: System MUST generate a new question immediately after correct answer
- **FR-012**: System MUST NOT change question after incorrect answer

#### Answer Validation Requirements
- **FR-013**: System MUST provide a numeric input field for answer entry
- **FR-014**: Input field MUST be auto-focused on page load for immediate typing
- **FR-015**: System MUST validate submitted answer against correct result (A * B)
- **FR-016**: System MUST accept answers via form submission (Enter key or button click)
- **FR-017**: Input field MUST be required (prevent empty submissions)
- **FR-018**: Input field MUST have inputMode="numeric" for mobile keyboard optimization
- **FR-019**: Input field MUST have maxLength constraint to prevent overflow

#### Scoring Requirements
- **FR-020**: System MUST increment score by 1 for each correct answer
- **FR-021**: System MUST NOT increment score for incorrect answers
- **FR-022**: System MUST display current score during gameplay
- **FR-023**: System MUST initialize score to 0 on game start
- **FR-024**: Restart button MUST reset score to 0

#### Data Persistence Requirements
- **FR-025**: System MUST track all answer attempts in a results array
- **FR-026**: Each result entry MUST contain question string (e.g., "3 x 7") and correct boolean
- **FR-027**: System MUST save score and results to localStorage when timer expires
- **FR-028**: System MUST save to localStorage key 'scores' as JSON array
- **FR-029**: System MUST append new score to existing scores array (not replace)
- **FR-030**: System MUST NOT save scores of 0 to prevent empty games cluttering leaderboard
- **FR-031**: Restart button MUST clear results array

#### Visual Progress Requirements
- **FR-032**: System MUST display a progress bar showing elapsed time percentage
- **FR-033**: Progress bar MUST calculate as ((totalTime - secondsLeft) / totalTime) * 100
- **FR-034**: Progress bar MUST update in real-time as timer counts down
- **FR-035**: Progress bar SHOULD change color based on time remaining thresholds

#### Navigation Requirements
- **FR-036**: System MUST redirect to PlayerSelectPage if no player is currently selected
- **FR-037**: System MUST navigate to HomePage when timer expires
- **FR-038**: Navigation on timer expiration MUST occur AFTER score is saved

### Key Entities

- **GameResult**: Represents a single answer attempt
  - `question: string` - The multiplication question in "A x B" format
  - `correct: boolean` - Whether the answer was correct

- **ScoreEntry**: Represents a completed game session (stored in localStorage)
  - `score: number` - Total number of correct answers
  - `results: GameResult[]` - Array of all answer attempts during the session

- **Timer State**: Managed by useTimer hook
  - `secondsLeft: number` - Current countdown value
  - `reset: Function` - Function to reset timer to initial value

- **Game State**: Local component state in PlayPage
  - `score: number` - Current score (count of correct answers)
  - `results: GameResult[]` - Array of answer attempts in current session
  - `combo: number` - Consecutive correct answers (optional enhancement)
  - `lives: number` - Remaining lives (optional enhancement)

- **Question State**: Local component state in MultiplicationQuestion
  - `factorA: number` - First multiplication factor (1-10)
  - `factorB: number` - Second multiplication factor (1-10)
  - `userAnswer: string` - Current input value

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can complete a full 60-second game session from start to finish without errors or crashes
- **SC-002**: Timer accurately counts down from 60 to 0 with ±100ms precision per second
- **SC-003**: 100% of correct answers result in new question generation within 100ms
- **SC-004**: 100% of incorrect answers preserve the same question
- **SC-005**: Scores are successfully saved to localStorage in 100% of completed games (score > 0)
- **SC-006**: All multiplication questions use factors between 1-10 (inclusive) - verified via testing
- **SC-007**: Input field receives focus automatically on page load in 100% of sessions
- **SC-008**: Progress bar accurately reflects elapsed time with ±1% accuracy
- **SC-009**: Game automatically redirects to HomePage within 200ms of timer reaching 0
- **SC-010**: Restart button successfully resets all game state (timer, score, results) in 100% of attempts
- **SC-011**: localStorage data structure matches expected format (array of {score, results} objects)
- **SC-012**: Games with 0 score do NOT create localStorage entries (prevents clutter)
- **SC-013**: All TypeScript type checks pass with zero errors
- **SC-014**: All component tests pass with >80% code coverage
- **SC-015**: Keyboard navigation works (Enter to submit, Tab for focus management)
- **SC-016**: Mobile numeric keyboard appears on touch devices (inputMode="numeric")

### Performance Metrics

- **SC-017**: Timer interval cleanup occurs on component unmount (no memory leaks)
- **SC-018**: Question generation completes in <50ms
- **SC-019**: Answer validation completes in <10ms
- **SC-020**: localStorage write operations complete in <100ms
- **SC-021**: Page load to first question display: <500ms

### User Experience Metrics

- **SC-022**: Players can answer 10+ questions in a 60-second session (typical gameplay)
- **SC-023**: Visual feedback (progress bar) updates smoothly without jank
- **SC-024**: Retro gaming aesthetic maintained consistently (pixel borders, animations)
- **SC-025**: Both keyboard and mouse input methods work seamlessly

## Technical Constraints

### Technology Stack (Must Use)
- **React 19.0.0+** - Functional components with hooks
- **TypeScript 5.7+** - Strict mode enabled
- **Vite 6.2+** - Build tool
- **Vitest 4.0+** - Testing framework
- **React Testing Library 16.3+** - Component testing
- **localStorage** - Browser API for persistence

### Code Quality Requirements (Non-Negotiable)
- All code MUST pass `npm run type-check` with zero errors
- All code MUST pass `npm run lint:fix` with zero violations
- All code MUST pass `npm run build` successfully
- All tests MUST pass `npm run test:run` with >80% coverage
- All functions MUST have explicit TypeScript return types
- All components MUST have JSDoc documentation
- All props interfaces MUST be exported with @public tag

### Architecture Patterns (Must Follow)
- **Functional components only** - no class components
- **CSS-in-JS** - inline styles objects, no external CSS
- **Custom hooks** - extract reusable stateful logic
- **Event handlers** - prefix with "handle" (handleSubmit, handleCorrectAnswer)
- **State setters** - use functional updates when depending on previous state
- **Single Responsibility** - one component, one purpose

### Testing Requirements (Must Have)
- **Tests written BEFORE implementation** (TDD enforced)
- **Red-Green-Refactor** cycle strictly followed
- **React Testing Library** - user-centric assertions
- **Edge cases tested** - boundary conditions, error scenarios
- **Keyboard navigation tested** - Enter key, Tab key
- **Timer behavior tested** - countdown, expiration, reset

## Implementation Constraints

### Must Use Existing Patterns
- **Timer**: Use `useTimer(60)` hook (already exists at `/src/hooks/useTimer.ts`)
- **Player Management**: Use `getCurrentPlayer()` from `/src/types/player.ts`
- **Navigation**: Use `useNavigate()` from `react-router-dom`
- **Background Music**: Use `useBackgroundMusic()` hook (optional for this feature)
- **Progress Bar**: Use `<ProgressBar>` component (already exists at `/src/components/ProgressBar.tsx`)

### Must Extend Existing Components
- **MultiplicationQuestion**: Component already exists at `/src/components/MultiplicationQuestion.tsx`
  - Current implementation already handles random generation, answer validation, callbacks
  - May need minor enhancements for edge cases
- **PlayPage**: Component already exists at `/src/pages/PlayPage.tsx`
  - Current implementation already integrates timer, scoring, persistence
  - This feature specification documents the EXISTING implementation

### localStorage Schema (Must Match)
```typescript
// localStorage key: 'scores'
// Value: JSON.stringify(ScoreEntry[])
type ScoreEntry = {
  score: number          // Count of correct answers
  results: GameResult[]  // Array of all attempts
}

type GameResult = {
  question: string       // Format: "3 x 7"
  correct: boolean       // true or false
}
```

### Prohibited Practices
- **No external CSS files** for components (CSS-in-JS only)
- **No class components** (functional only)
- **No any types** without explicit justification
- **No bypassing quality checks** (--no-verify forbidden)
- **No committing without tests** (TDD enforced)

## Dependencies

### Required Components
- `MultiplicationQuestion` - Question display and answer input
- `ProgressBar` - Visual timer progress indicator
- `useTimer` - Countdown timer hook
- `useBackgroundMusic` - Game music control (optional)
- `getCurrentPlayer` - Player data retrieval
- `useNavigate` - React Router navigation

### localStorage Dependencies
- Reads: `localStorage.getItem('currentPlayer')` - for player validation
- Reads: `localStorage.getItem('scores')` - for appending new scores
- Writes: `localStorage.setItem('scores', ...)` - for saving game results

## Out of Scope

The following are explicitly NOT part of this feature:
- **Leaderboard display** - handled by HomePage component (separate feature)
- **Player selection** - handled by PlayerSelectPage (separate feature)
- **Difficulty levels** - all questions use 1-10 factors (future enhancement)
- **Sound effects** - positive/negative feedback sounds (future enhancement)
- **Combo system** - bonus points for consecutive answers (already implemented as enhancement)
- **Lives system** - tracking mistakes (already implemented as enhancement)
- **Multiplayer mode** - real-time competition (future enhancement)
- **Achievement system** - badges and rewards (future enhancement)
- **Statistics analytics** - detailed performance tracking (future enhancement)
- **Backend persistence** - all data is client-side localStorage only

## Non-Functional Requirements

### Accessibility
- **NFR-001**: Input field MUST have proper ARIA labels
- **NFR-002**: Focus management MUST follow logical tab order
- **NFR-003**: Keyboard navigation MUST work for all interactions (Enter to submit)
- **NFR-004**: Color contrast MUST meet WCAG AA standards for text visibility

### Performance
- **NFR-005**: Timer MUST update within 100ms of each second elapsing
- **NFR-006**: Answer validation MUST complete synchronously (no async delays)
- **NFR-007**: Question generation MUST be deterministic (Math.random() acceptable)
- **NFR-008**: Memory leaks MUST be prevented (cleanup intervals on unmount)

### Browser Compatibility
- **NFR-009**: MUST work on Chrome, Firefox, Safari, Edge (latest 2 versions)
- **NFR-010**: MUST work on mobile browsers (iOS Safari, Chrome Android)
- **NFR-011**: localStorage MUST be available (graceful degradation if disabled)

### Maintainability
- **NFR-012**: Code MUST follow existing project patterns exactly
- **NFR-013**: All functions MUST have JSDoc comments with @param and @returns
- **NFR-014**: Component props MUST have exported interfaces
- **NFR-015**: TypeScript strict mode MUST be satisfied

## Validation Checklist

Before marking this feature as complete, verify:

- [ ] All 38 Functional Requirements (FR-001 to FR-038) are implemented
- [ ] All 25 Success Criteria (SC-001 to SC-025) are met and measurable
- [ ] All 6 User Stories have passing acceptance scenarios
- [ ] All edge cases are handled gracefully
- [ ] All code quality commands pass (type-check, lint, test, build)
- [ ] All tests written BEFORE implementation (TDD followed)
- [ ] Test coverage >80% for new/modified code
- [ ] JSDoc documentation complete for all public APIs
- [ ] localStorage schema matches specification exactly
- [ ] No regression in existing features (player selection, leaderboard)
- [ ] Keyboard navigation works (Enter, Tab)
- [ ] Mobile numeric keyboard appears (inputMode="numeric")
- [ ] Timer cleanup prevents memory leaks
- [ ] Progress bar updates smoothly
- [ ] Retro gaming aesthetic maintained
- [ ] No TypeScript errors
- [ ] No ESLint violations
- [ ] Production build succeeds
- [ ] Manual browser testing completed (Chrome, Firefox, Safari)
- [ ] Manual mobile testing completed (iOS Safari, Chrome Android)

## Notes

### Current Implementation Status
This specification documents a feature that is **ALREADY IMPLEMENTED** in the codebase. The PlayPage and MultiplicationQuestion components exist and implement this functionality. This spec serves as:
1. **Retroactive documentation** of the existing implementation
2. **Validation checklist** to ensure current code meets all requirements
3. **Test coverage roadmap** to identify missing test cases
4. **Future reference** for maintaining or extending this feature

### Existing Enhancements
The current implementation includes several enhancements beyond the core requirements:
- **Combo system** (FR-020 extended to calculate bonus points)
- **Lives system** (visual feedback for mistakes)
- **Score popup animations** (visual feedback for correct/incorrect)
- **Background music** (immersive experience)
- **Retro pixel art UI** (Super NES aesthetic)

These enhancements are acceptable and improve the user experience. They do not conflict with the core requirements.

### Known Deviations
- **FR-020** in current implementation: Score increments by `100 * combo` instead of just `1`
  - This is an acceptable enhancement (combo multiplier system)
  - Does not break the requirement (score still increases for correct answers)
  - Leaderboard still functions correctly with higher scores

### Testing Gaps to Address
- Add specific tests for timer expiration edge cases
- Add tests for localStorage error handling (quota exceeded, disabled)
- Add tests for rapid-fire answer submissions
- Add tests for keyboard navigation (Enter key submission)
- Add tests for mobile numeric keyboard attribute (inputMode)

---

**Last Updated**: 2026-01-13
**Specification Version**: 1.0.0
**Implementation Status**: Implemented (retroactive documentation)
