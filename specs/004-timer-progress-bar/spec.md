# Feature Specification: Visual Progress Bar with Time-Based Colors

**Feature Branch**: `004-timer-progress-bar`
**Created**: 2026-01-13
**Status**: Completed (Implemented in previous commits)
**Input**: User description: "Design a visual progress bar that represents the remaining time in a 60-second countdown timer. The bar should fill from left to right (100% at start, 0% at end) and change colors based on time remaining to create urgency: green when plenty of time remains, transitioning to yellow, orange, and red as time runs low. Add a blinking animation when time is critically low (final 20% or less) to alert the player."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Timer Awareness (Priority: P1)

As a player during a timed multiplication game, I want to see a visual progress bar that clearly shows how much time I have remaining, so that I can pace myself appropriately without constantly checking the numeric timer.

**Why this priority**: This is the core value proposition of the feature - transforming abstract time into an intuitive visual representation. Without this, players must mentally calculate urgency from numeric seconds, which distracts from the game.

**Independent Test**: Can be fully tested by starting a game session and observing the progress bar behavior throughout the 60-second countdown. Delivers immediate value by improving time awareness without requiring any other features.

**Acceptance Scenarios**:

1. **Given** a player starts a new game session, **When** the timer begins at 60 seconds, **Then** the progress bar should display at 0% filled (empty) with a green color
2. **Given** the game is in progress, **When** time decreases from 60 to 30 seconds, **Then** the progress bar should smoothly fill from 0% to 50% while maintaining a calm green color
3. **Given** the timer has 15 seconds remaining, **When** the player glances at the interface, **Then** they can immediately understand their time status from the visual bar position without reading the numeric countdown

---

### User Story 2 - Urgency Escalation Through Color (Priority: P1)

As a player approaching the end of the time limit, I want the progress bar to change colors from green to yellow/orange to red as time runs out, so that I intuitively feel increasing urgency without needing to calculate percentages.

**Why this priority**: Color-based urgency communication is a critical UX pattern that aligns with universal human color associations (green=safe, red=danger). This transforms the progress bar from a passive indicator to an active emotional cue, enhancing game engagement and tension.

**Independent Test**: Can be tested by observing color transitions during a full game session or by manually setting timer values to trigger different color states. Delivers value by creating emotional engagement through visual feedback.

**Acceptance Scenarios**:

1. **Given** the timer has more than 10 seconds remaining, **When** the player observes the progress bar, **Then** it should display in green gradient colors indicating ample time
2. **Given** the timer reaches exactly 10 seconds, **When** the color transition occurs, **Then** the progress bar should smoothly change from green to orange gradient
3. **Given** the timer reaches 5 seconds or less, **When** the critical threshold is crossed, **Then** the progress bar should transition to red gradient indicating extreme urgency
4. **Given** a player is focused on answering questions, **When** the bar turns red in their peripheral vision, **Then** they should instinctively register that time is critically low

---

### User Story 3 - Critical Time Alert Animations (Priority: P2)

As a player in the final seconds of a game, I want the progress bar to visually pulse or blink when time is critically low, so that I receive an unmistakable alert even if I'm not directly looking at the timer.

**Why this priority**: Static color changes can be missed by players focused on answering questions. Animation ensures attention is captured through motion, which humans are biologically wired to notice. This is P2 because basic color changes (P1) already provide value, but animations enhance the experience.

**Independent Test**: Can be tested by observing the progress bar during the final 10-12 seconds of gameplay. Delivers value by improving critical-time awareness through motion-based alerts that work even in peripheral vision.

**Acceptance Scenarios**:

1. **Given** the timer reaches 10 seconds or less, **When** the progress bar enters orange state, **Then** it should display a subtle blinking animation (opacity change) at 1-second intervals
2. **Given** the timer reaches 5 seconds or less, **When** the bar turns red, **Then** it should display a more intense flashing animation at 0.5-second intervals with slight scale pulsing
3. **Given** a player is concentrating on a multiplication problem, **When** the red flashing animation activates, **Then** the motion should catch their peripheral vision and alert them to critical time status
4. **Given** the blinking animation is active, **When** the player observes the bar, **Then** the animation should be noticeable but not distracting enough to break concentration from the game

---

### User Story 4 - Smooth Progressive Filling (Priority: P2)

As a player watching the progress bar, I want it to fill smoothly and continuously from left to right as time elapses, so that I have a natural visual representation of time flow similar to watching sand in an hourglass.

**Why this priority**: Smooth transitions create a polished, professional feel and make the time progression feel natural rather than jarring. This is P2 because the feature works with discrete updates, but smooth animations significantly improve perceived quality.

**Independent Test**: Can be tested by observing the progress bar throughout a full game session and verifying smooth width transitions at each second interval. Delivers value by enhancing the premium feel of the game interface.

**Acceptance Scenarios**:

1. **Given** the timer decrements by 1 second, **When** the progress bar updates, **Then** the width should transition smoothly using CSS easing (0.3s duration) rather than jumping instantly
2. **Given** the game is running, **When** observing the bar over multiple seconds, **Then** the filling motion should appear continuous and natural, like liquid filling a container
3. **Given** a color transition occurs (e.g., green to orange at 10 seconds), **When** the change happens, **Then** both the width and color should transition smoothly without visual glitches
4. **Given** rapid screen updates are occurring (question changes, score popups), **When** the progress bar updates, **Then** it should maintain smooth animation performance without jank

---

### Edge Cases

- **What happens when the timer reaches exactly 0 seconds?** The progress bar should reach 100% filled and maintain its red color with flashing animation until the game-over logic redirects to the home page.

- **What happens if the player restarts the game mid-session?** The progress bar should instantly reset to 0% (empty) and return to green color, with all animations stopped and restarted appropriately.

- **How does the system handle rapid timer changes during development/testing?** The progress bar should gracefully handle non-standard timer values (e.g., starting at 15 seconds for testing) and calculate progress percentages correctly regardless of initial time.

- **What happens if CSS animations are disabled by user preferences (prefers-reduced-motion)?** The feature should respect accessibility preferences by providing static color changes without blinking/flashing animations.

- **How does the bar behave on very narrow mobile screens?** The progress bar should maintain its 30px height and full width responsiveness, with border thickness scaling appropriately to prevent excessive thickness on small screens.

- **What happens if the browser tab loses focus during gameplay?** The progress bar should continue updating when the tab regains focus, maintaining accurate synchronization with the timer (handled by the useTimer hook's setInterval).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a horizontal progress bar that visually represents elapsed time during gameplay sessions
- **FR-002**: Progress bar MUST fill from left to right, starting at 0% (empty) when timer begins at 60 seconds and reaching 100% (full) when timer reaches 0 seconds
- **FR-003**: Progress bar MUST calculate fill percentage using the formula: `progress = ((totalTime - secondsLeft) / totalTime) * 100`
- **FR-004**: Progress bar MUST display green gradient colors when time remaining is greater than 10 seconds
- **FR-005**: Progress bar MUST transition to orange gradient colors when time remaining is between 6-10 seconds inclusive
- **FR-006**: Progress bar MUST transition to red gradient colors when time remaining is 5 seconds or less
- **FR-007**: Progress bar MUST implement a subtle blinking animation (opacity variation) when displaying orange color (10 seconds or less remaining)
- **FR-008**: Progress bar MUST implement an intense flashing animation (opacity + scale variation) when displaying red color (5 seconds or less remaining)
- **FR-009**: Progress bar MUST use smooth CSS transitions (0.3s ease) for width changes to create fluid visual progression
- **FR-010**: Progress bar MUST reset to 0% filled and green color when the game timer is reset via the Restart button
- **FR-011**: Component MUST accept `progress` (number 0-100) and `timeRemaining` (number in seconds) as props
- **FR-012**: Component MUST use inline CSS-in-JS styling consistent with the project's pixel art aesthetic
- **FR-013**: Progress bar MUST display a black 4px solid border matching the game's retro UI theme
- **FR-014**: Progress bar MUST have a fixed height of 30px for consistent visual hierarchy
- **FR-015**: Progress bar MUST include a striped pattern overlay (repeating diagonal lines) for retro visual texture

### Non-Functional Requirements

- **NFR-001**: Color transitions MUST be smooth and visually pleasant without jarring color jumps
- **NFR-002**: Animation frame rates MUST maintain 60fps to prevent visual stuttering
- **NFR-003**: The component MUST be performant with minimal CPU usage (CSS animations only, no JavaScript animation loops)
- **NFR-004**: The component MUST be fully typed with TypeScript interfaces exported for reusability
- **NFR-005**: The component MUST include comprehensive JSDoc documentation for all props and behavior
- **NFR-006**: Animations SHOULD respect user accessibility preferences (prefers-reduced-motion media query)
- **NFR-007**: The progress bar MUST be visually distinguishable in all color states for users with color vision deficiencies (sufficient contrast + animation cues)

### Key Entities *(include if feature involves data)*

- **ProgressBarProps Interface**: Defines the component's input contract
  - `progress: number` - Percentage value between 0-100 representing completion
  - `timeRemaining?: number` - Optional seconds remaining for color logic (defaults to 60)

- **Timer State**: Managed by parent component (PlayPage) via useTimer hook
  - `secondsLeft: number` - Current countdown value in seconds
  - `totalTime: number` - Initial countdown value (60 seconds)
  - Relationship: Progress percentage is derived from `(totalTime - secondsLeft) / totalTime * 100`

- **Visual States**: Implicit state machine for color and animation
  - State 1: Green static (timeRemaining > 10)
  - State 2: Orange blinking (timeRemaining <= 10 && > 5)
  - State 3: Red flashing (timeRemaining <= 5)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can accurately estimate remaining time (within 5-second margin) by glancing at the progress bar without reading the numeric timer - verified through user testing
- **SC-002**: 90% of players report feeling increased urgency during final 10 seconds due to color changes and animations - measured via post-game surveys
- **SC-003**: Progress bar updates smoothly at 60fps with no visible jank or stuttering during gameplay - measured using browser DevTools performance profiling
- **SC-004**: Color transitions occur precisely at defined thresholds (10 seconds for orange, 5 seconds for red) with zero timing errors - verified through automated tests
- **SC-005**: The ProgressBar component maintains component-level test coverage of 90%+ including all color states and edge cases - measured via Vitest coverage reports
- **SC-006**: Visual regression tests confirm pixel-perfect rendering across Chrome, Firefox, and Safari browsers - verified via screenshot comparison tools
- **SC-007**: Accessibility audit confirms sufficient color contrast ratios (WCAG AA) and proper handling of prefers-reduced-motion - verified via Lighthouse/axe DevTools
- **SC-008**: Component bundle size impact is less than 2KB gzipped - measured via build analysis
- **SC-009**: The feature integrates seamlessly with existing PlayPage without breaking current game flow or timer functionality - verified through integration tests
- **SC-010**: JSDoc documentation generates complete API reference with all props, return types, and usage examples - verified via TypeDoc output

## Technical Implementation Details *(already implemented)*

### Component Architecture

The ProgressBar component is implemented as a functional React component using TypeScript:

**File**: `src/components/ProgressBar.tsx`

**Key Implementation Features**:
1. **Props Interface**: Exported `ProgressBarProps` with `progress` and optional `timeRemaining`
2. **Dynamic Styling**: `getProgressStyle()` function calculates color and animation based on `timeRemaining`
3. **Color Gradients**:
   - Green: `linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)` (default)
   - Orange: `linear-gradient(90deg, #ff9800 0%, #ffb74d 100%)` (≤10s)
   - Red: `linear-gradient(90deg, #f44336 0%, #e57373 100%)` (≤5s)
4. **Animations**:
   - `blinkOrange`: 1s infinite opacity variation (1 → 0.6 → 1)
   - `flashRed`: 0.5s infinite opacity + scale pulse (1/1 → 0.8/1.02 → 1/1)
5. **CSS-in-JS**: Inline styles with injected `<style>` tag for keyframe animations
6. **Pixel Art Styling**:
   - Black 4px border
   - 30px fixed height
   - Striped pattern overlay using `repeating-linear-gradient`
   - 0.3s ease transitions for smooth width/color changes

### Integration with PlayPage

**File**: `src/pages/PlayPage.tsx`

**Integration Points**:
1. Progress calculation: `progress = ((totalTime - secondsLeft) / totalTime) * 100`
2. Component usage: `<ProgressBar progress={progress} timeRemaining={secondsLeft} />`
3. Timer source: `useTimer(60)` hook provides `secondsLeft` state
4. Reset behavior: Restart button resets timer, which automatically resets progress bar

### Visual Design Specifications

**Color Palette**:
- Green safe zone: #4caf50 to #66bb6a gradient
- Orange warning zone: #ff9800 to #ffb74d gradient
- Red danger zone: #f44336 to #e57373 gradient
- Border: #000 (black) 4px solid
- Background: #000 (black)

**Dimensions**:
- Height: 30px (fixed)
- Width: 100% (responsive)
- Border: 4px solid
- Margin bottom: 20px

**Animation Timings**:
- Width transition: 0.3s ease
- Background transition: 0.3s ease
- Orange blink cycle: 1s infinite
- Red flash cycle: 0.5s infinite

## Testing Strategy *(already implemented)*

### Unit Tests Required

1. **Rendering Tests**:
   - Component renders without crashing with valid props
   - Progress bar displays correct width based on progress prop
   - TimeRemaining defaults to 60 when not provided

2. **Color State Tests**:
   - Green gradient when timeRemaining > 10
   - Orange gradient when timeRemaining ≤ 10 and > 5
   - Red gradient when timeRemaining ≤ 5
   - Boundary values (exactly 10s, exactly 5s, 0s)

3. **Animation Tests**:
   - No animation when timeRemaining > 10
   - blinkOrange animation when timeRemaining ≤ 10
   - flashRed animation when timeRemaining ≤ 5

4. **Progress Calculation Tests**:
   - 0% when progress=0
   - 50% when progress=50
   - 100% when progress=100
   - Handles decimal progress values correctly

### Integration Tests Required

1. **PlayPage Integration**:
   - ProgressBar receives correct progress values from timer
   - Progress bar resets when Restart button is clicked
   - Progress bar updates every second as timer decrements
   - Color changes occur at correct time thresholds during gameplay

### Manual Testing Checklist

1. **Visual Verification**:
   - Progress bar fills smoothly from left to right
   - Green color displays during first 50 seconds
   - Orange color appears at 10 seconds with blinking
   - Red color appears at 5 seconds with intense flashing
   - Animations are smooth and not distracting

2. **Edge Case Verification**:
   - Bar reaches 100% at timer=0
   - Restart button resets bar to 0% and green
   - Bar works correctly on mobile viewport widths
   - Bar maintains visual quality at different zoom levels

3. **Accessibility Verification**:
   - Color contrast meets WCAG AA standards
   - prefers-reduced-motion disables animations
   - Bar is perceivable by users with color blindness

## Documentation *(already implemented)*

### JSDoc Documentation

The component includes comprehensive JSDoc comments:
- Interface documentation for `ProgressBarProps`
- Component description with behavioral details
- Prop parameter documentation with types
- Usage examples with different configurations
- Return type documentation

### API Reference

Generated via TypeDoc (`npm run docs`):
- Exported interfaces and types
- Component props and default values
- Usage examples and code snippets

## Dependencies & Compatibility

### Required Dependencies
- React 19.0.0 (already installed)
- TypeScript 5.7.2 (already installed)

### Browser Compatibility
- Modern browsers supporting CSS gradients
- CSS animations (keyframes)
- CSS transitions
- CSS custom properties would enhance future extensibility

### No Breaking Changes
This feature is fully backward compatible and does not modify any existing APIs or components beyond integrating the new ProgressBar component into PlayPage.

---

## Implementation Status: COMPLETED ✅

This feature has been successfully implemented and deployed in the current codebase. The specification serves as retrospective documentation of the design decisions, requirements, and testing criteria used during development.

**Commit Reference**: Feature implemented in commit 2530fcb "Enhance progress bar with time-based visual indicators and animations"
