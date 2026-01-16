# Feature Specification: Retro Pixel Art UI Design

**Feature Branch**: `009-retro-pixel-ui`
**Created**: 2026-01-13
**Status**: Draft
**Input**: User description: "Design the entire game interface with a Super NES / 1990s Nintendo-style retro pixel art aesthetic. Use bold, saturated colors reminiscent of 8-bit games, thick pixel borders (4px solid black), box shadows for depth, and sharp corners (no border-radius). Implement pixel-perfect alignment, sprite-based animations with discrete steps (not smooth transitions), and monospace or pixel fonts. All interactive elements should support both keyboard-first navigation (arrow keys, Enter, Escape) and mouse clicks as a secondary input method. Visual focus indicators must clearly highlight the current selection with high contrast colors."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consistent Retro Visual Identity (Priority: P1)

As a player, I expect every screen in the game to have a consistent Super NES / 8-bit pixel art aesthetic so that I feel immersed in a nostalgic gaming experience reminiscent of classic 1990s Nintendo games.

**Why this priority**: This is the foundation of the entire feature. Without consistent visual styling across all pages, the retro gaming experience falls apart. Every other aspect of this feature depends on establishing this base aesthetic.

**Independent Test**: Can be fully tested by visually inspecting each page (PlayerSelectPage, HomePage, PlayPage) and verifying that all visual elements follow the retro design system: thick 4px black borders, saturated colors, pixel fonts, sharp corners, and appropriate box shadows for depth.

**Acceptance Scenarios**:

1. **Given** I am on the PlayerSelectPage, **When** I observe the visual design, **Then** I should see thick 4px solid black borders on all containers, bold saturated colors (primary reds, blues, yellows), the Press Start 2P pixel font, and sharp corners with no border-radius
2. **Given** I am on the HomePage, **When** I observe the visual design, **Then** the page maintains the same retro aesthetic with consistent border thickness, color palette, typography, and shadow depth as the PlayerSelectPage
3. **Given** I am on the PlayPage, **When** I observe the visual design, **Then** all game elements (question area, progress bar, buttons, stats) follow the same retro design system with pixel-perfect alignment
4. **Given** I navigate between different pages, **When** transitions occur, **Then** the visual consistency is maintained without jarring design inconsistencies
5. **Given** I resize the browser window, **When** responsive breakpoints trigger, **Then** the retro aesthetic is preserved at all viewport sizes with appropriate scaling

---

### User Story 2 - Keyboard-First Navigation with Visual Focus Indicators (Priority: P1)

As a keyboard user, I expect to navigate the entire game using arrow keys (Up/Down/Left/Right), Enter to select, and Escape to cancel/go back, with clear visual indicators showing my current selection at all times.

**Why this priority**: Keyboard navigation is PRIMARY per the constitution (Principle VI). This is a core requirement that makes the game accessible and provides the authentic retro gaming experience. Without this, the game fails to meet its fundamental UX requirements.

**Independent Test**: Can be fully tested by disconnecting the mouse and navigating the entire game using only the keyboard. Every interactive element must be reachable, selectable, and have a high-contrast visual focus indicator.

**Acceptance Scenarios**:

1. **Given** I am on the PlayerSelectPage with the keyboard, **When** I press the ArrowDown key, **Then** the selection highlight moves to the next player in the list with a visual indicator (golden glow, animated cursor, or scale transform)
2. **Given** I am on the PlayerSelectPage with the keyboard, **When** I press the ArrowUp key, **Then** the selection highlight moves to the previous player in the list (wrapping is not required, stops at first/last)
3. **Given** I have selected a player using arrow keys, **When** I press the Enter key, **Then** the player is confirmed and I navigate to the HomePage
4. **Given** I am on the HomePage, **When** I press the Tab key or use navigation keys, **Then** the "Start Game" button receives visible focus with a high-contrast indicator (e.g., 4px golden outline, glow effect)
5. **Given** I am on the PlayPage answering questions, **When** I navigate using Tab key, **Then** the input field and submit button receive clear focus indicators matching the retro aesthetic
6. **Given** I am on the PlayPage, **When** I press the Escape key, **Then** I should navigate back to the HomePage (or show a pause/quit confirmation)
7. **Given** I am using keyboard navigation, **When** an element receives focus, **Then** the visual indicator uses high-contrast colors (gold #ffd700 or bright cyan #4ecdc4) with pixel-style borders or glow effects

---

### User Story 3 - Mouse/Touch Support as Secondary Input Method (Priority: P2)

As a mouse or touch user, I expect to be able to click or tap on any interactive element to perform the same actions available via keyboard, with the same visual feedback and responsiveness.

**Why this priority**: While keyboard is PRIMARY, mouse/touch support is required for accessibility and to support users on different devices. This is a P2 because the game must work with keyboard FIRST (P1), but mouse support is still mandatory per the constitution.

**Independent Test**: Can be fully tested by using only the mouse (no keyboard) to navigate the entire game from player selection through gameplay and back to home. All interactions must work identically to keyboard navigation.

**Acceptance Scenarios**:

1. **Given** I am on the PlayerSelectPage with a mouse, **When** I click on a player card, **Then** the player is immediately selected and I navigate to the HomePage (same behavior as keyboard ArrowDown + Enter)
2. **Given** I am on the HomePage with a mouse, **When** I click the "Start Game" button, **Then** I navigate to the PlayPage
3. **Given** I am on the PlayPage with a mouse, **When** I click the "Submit" button after entering an answer, **Then** the answer is validated and scored
4. **Given** I am on the PlayPage with a mouse, **When** I click the "Restart" button, **Then** the timer, score, and question are reset
5. **Given** I hover over a clickable element with the mouse, **When** the cursor enters the element, **Then** the element shows a hover state (slight scale, color change, or cursor change) that matches the retro aesthetic
6. **Given** I click a button with the mouse, **When** the click occurs, **Then** the button shows an active/pressed state (translateY transform, reduced box-shadow) for tactile feedback

---

### User Story 4 - Discrete Step Sprite-Based Animations (Priority: P2)

As a player, I expect animations to use discrete steps reminiscent of sprite-based animations from 8-bit games, rather than smooth CSS transitions, to enhance the retro gaming aesthetic.

**Why this priority**: This is what differentiates true retro pixel art from modern web design with retro fonts. The animations are a key part of the immersive experience, but the game can function without perfecting this aspect (hence P2).

**Independent Test**: Can be fully tested by triggering animations (score popup, combo shake, character bounce, cloud float) and visually verifying they use discrete steps or stepped easing functions rather than smooth linear/ease transitions.

**Acceptance Scenarios**:

1. **Given** I answer a question correctly, **When** the score popup animation plays, **Then** the animation uses discrete scale steps (e.g., steps(3) or steps(5)) rather than smooth easing
2. **Given** I achieve a combo multiplier, **When** the combo shake animation triggers, **Then** the rotation changes in discrete steps with a stepped easing function
3. **Given** decorative sprites (clouds, mushroom character) are animated, **When** the animations play, **Then** they use stepped functions or keyframe-based discrete positions to mimic sprite movement
4. **Given** the progress bar fills during gameplay, **When** time elapses, **Then** the bar width changes smoothly BUT color transitions (green → orange → red) occur in discrete steps, not gradients
5. **Given** the player selection cursor (▶) is animated, **When** the bounce animation plays, **Then** the vertical position changes in discrete pixel values (e.g., 0px, -4px, -8px, -4px, 0px) rather than smooth interpolation

---

### User Story 5 - High Contrast Color Palette with Accessibility (Priority: P3)

As a player with visual needs, I expect the game to use a high-contrast color palette with bold, saturated colors that are easily distinguishable, ensuring readability and visual clarity throughout the game.

**Why this priority**: This enhances the retro aesthetic while improving accessibility. It's P3 because the existing color scheme already has good contrast, but this story formalizes and optimizes the palette systematically.

**Independent Test**: Can be fully tested using browser accessibility tools (e.g., Lighthouse, axe DevTools) to verify WCAG AA contrast ratios (4.5:1 for text, 3:1 for UI components) across all text and interactive elements.

**Acceptance Scenarios**:

1. **Given** I view any text in the game, **When** I check the contrast ratio, **Then** it meets WCAG AA standards (4.5:1 minimum) with high-contrast combinations like white text on dark backgrounds or black text on light backgrounds
2. **Given** I view the color palette, **When** I analyze the primary colors, **Then** they are bold and saturated (e.g., primary red #ff6b6b, primary blue #3498db, golden yellow #ffd700, bright cyan #4ecdc4) reminiscent of NES/SNES palettes
3. **Given** I view interactive elements (buttons, cards, inputs), **When** I observe their states, **Then** they use distinct high-contrast colors for different states (default, hover, active, focus, disabled)
4. **Given** I view the focus indicators, **When** an element is focused, **Then** the indicator uses a bright contrasting color (golden #ffd700 or cyan #4ecdc4) with at least 3:1 contrast against the background
5. **Given** I view the progress bar color states, **When** time progresses, **Then** the colors transition from green (safe) → orange (warning) → red (critical) with sufficient contrast differences to be distinguishable

---

### Edge Cases

- What happens when a user rapidly switches between keyboard and mouse input methods (should seamlessly support both without conflicts or visual glitches)?
- How does the system handle focus management when navigating between pages (focus should move to the first interactive element or main heading on page load)?
- What happens when a user zooms in/out of the browser (retro aesthetic and pixel alignment should be maintained at 100%, 150%, 200% zoom levels)?
- How does the system handle very small viewport sizes on mobile devices (pixel borders should remain 4px, but layout may stack/compress while maintaining aesthetic)?
- What happens when CSS animations are disabled by user preference (prefers-reduced-motion) (essential interactions still work, but animations are simplified or removed)?
- How does the system handle extremely long player names that exceed the card width (text should truncate with ellipsis or scale down while maintaining readability)?
- What happens when localStorage is disabled or unavailable (game should still render with default styling, possibly show a warning)?
- How does the system handle high DPI displays (Retina, 4K) where pixels may appear blurry (image-rendering: pixelated should be applied to maintain crisp pixel art)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST apply consistent 4px solid black borders to all primary containers (game containers, cards, buttons, inputs, headers) across all pages
- **FR-002**: System MUST use the "Press Start 2P" pixel font (or equivalent monospace pixel font) for all text elements throughout the application
- **FR-003**: System MUST use a defined color palette of bold, saturated colors: primary red (#ff6b6b), primary blue (#3498db), golden yellow (#ffd700), bright cyan (#4ecdc4), sky blue (#87ceeb), forest green (#228b22), black (#000), white (#fff)
- **FR-004**: System MUST remove all border-radius properties from interactive elements, maintaining sharp 90-degree corners consistent with 8-bit aesthetic
- **FR-005**: System MUST implement keyboard navigation on PlayerSelectPage supporting ArrowUp, ArrowDown, and Enter keys with proper event listeners
- **FR-006**: System MUST implement keyboard navigation on HomePage supporting Tab, Enter, and Escape keys for the Start Game button
- **FR-007**: System MUST implement keyboard navigation on PlayPage supporting Tab, Enter, and Escape keys for input field, submit button, and restart button
- **FR-008**: System MUST provide visual focus indicators using high-contrast colors (golden #ffd700 or cyan glow) with 4px outline or box-shadow when elements receive keyboard focus
- **FR-009**: System MUST maintain mouse/touch click support on all interactive elements as an alternative to keyboard navigation
- **FR-010**: System MUST implement hover states on buttons and clickable cards with retro-style visual feedback (scale transform, color shift, or cursor change)
- **FR-011**: System MUST implement active/pressed states on buttons with pixel-style tactile feedback (translateY and reduced box-shadow)
- **FR-012**: System MUST use box-shadow for depth effects on containers, buttons, and cards (e.g., "0 6px 0 #000" for buttons, "12px 12px 0 0 rgba(0,0,0,0.3)" for containers)
- **FR-013**: System MUST implement sprite-based animations using CSS keyframes with steps() easing function or discrete step values for retro feel
- **FR-014**: System MUST apply "image-rendering: pixelated" CSS property to prevent pixel smoothing on high DPI displays
- **FR-015**: System MUST ensure all text meets WCAG AA contrast ratio requirements (4.5:1 for normal text, 3:1 for large text and UI components)
- **FR-016**: System MUST handle prefers-reduced-motion media query to disable or simplify animations for users with motion sensitivity
- **FR-017**: System MUST maintain pixel-perfect alignment with grid-based layouts, ensuring elements align on pixel boundaries
- **FR-018**: System MUST implement responsive design that preserves retro aesthetic at mobile breakpoints (600px and below) while maintaining 4px borders
- **FR-019**: System MUST use inset box-shadows ("inset 0 4px 0 rgba(255,255,255,0.5)") to create depth and highlight effects on panels and cards
- **FR-020**: System MUST prevent focus loss when navigating between pages, setting initial focus to the first interactive element or main heading

### Key Entities *(include if feature involves data)*

- **VisualTheme**: Defines the retro pixel art aesthetic, including color palette, border styles, shadow depths, and font specifications
- **FocusState**: Tracks which interactive element currently has keyboard focus and applies appropriate visual indicators
- **AnimationProfile**: Defines animation characteristics (duration, easing function, keyframes) for sprite-based discrete animations
- **ColorPalette**: Structured set of named colors with hex values, contrast ratios, and usage guidelines (primary, secondary, accent, state colors)
- **ComponentStyle**: Reusable style objects for common UI patterns (buttons, cards, inputs, containers) ensuring consistency

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of interactive elements (buttons, cards, inputs) on all three pages (PlayerSelectPage, HomePage, PlayPage) have 4px solid black borders and no border-radius
- **SC-002**: 100% of text elements use the "Press Start 2P" pixel font or an equivalent monospace pixel font with consistent sizing
- **SC-003**: All text and UI components meet WCAG AA contrast requirements (verified via automated accessibility audit tools like Lighthouse or axe)
- **SC-004**: 100% of keyboard navigation paths work without requiring mouse input: player selection (Arrow keys + Enter) → home page (Tab + Enter) → game play (Tab + Enter/Escape) → home page
- **SC-005**: 100% of mouse interaction paths work without requiring keyboard input: click player → click Start Game → enter answer + click Submit → click Restart
- **SC-006**: All interactive elements show visible focus indicators when tabbed to or selected via keyboard, using golden #ffd700 or cyan #4ecdc4 with 4px outline or glow
- **SC-007**: At least 5 animations (score popup, combo shake, character bounce, cloud float, button press) use discrete steps or stepped easing functions (steps(3) or higher) instead of smooth transitions
- **SC-008**: Visual regression testing confirms consistent retro aesthetic across all pages (pixel borders, color palette, typography, shadows) with zero design inconsistencies
- **SC-009**: The game is fully playable and navigable using only keyboard controls, verified by a manual test session without touching the mouse
- **SC-010**: The game is fully playable and navigable using only mouse controls, verified by a manual test session without touching the keyboard
- **SC-011**: All animations respect prefers-reduced-motion media query, disabling or simplifying motion when user preference is set
- **SC-012**: The retro aesthetic is preserved at 3 zoom levels (100%, 150%, 200%) without layout breaking or pixel borders becoming inconsistent

## Technical Considerations

### Implementation Approach

1. **Global CSS Foundation**: Update `src/index.css` to include retro design tokens (CSS custom properties for colors, borders, shadows, spacing)
2. **Component-Level Styling**: Audit and update inline styles in all components (`PlayerSelectPage.tsx`, `HomePage.tsx`, `PlayPage.tsx`, `MultiplicationQuestion.tsx`, `ProgressBar.tsx`) to use consistent border thickness, remove border-radius, and apply proper shadows
3. **Animation Refinement**: Refactor existing CSS keyframes to use `animation-timing-function: steps(n)` or discrete step values in keyframe percentages
4. **Keyboard Event Handlers**: Ensure all pages have proper keyboard event listeners with cleanup in useEffect hooks
5. **Focus Management**: Add explicit focus styling via CSS `:focus` and `:focus-visible` pseudo-classes with retro-appropriate indicators
6. **Accessibility Testing**: Run automated tests (Lighthouse, axe) and manual keyboard-only navigation to verify compliance

### Constraints and Dependencies

- **No External UI Libraries**: Must use CSS-in-JS (inline styles) as per project patterns, no Material-UI or other component libraries
- **Preserve Existing Functionality**: All current game mechanics (timer, scoring, question generation, localStorage) must remain intact
- **Backward Compatibility**: Existing localStorage data structures must continue to work without migration
- **Performance**: CSS animations must not cause jank or reduced frame rates (use transform and opacity properties for GPU acceleration)
- **TypeScript Strict Mode**: All style objects must maintain TypeScript type safety with proper `as const` type assertions
- **Press Start 2P Font**: Already imported in `src/index.css`, must ensure it loads properly or provide fallback pixel font

### Testing Strategy

1. **Visual Regression Testing**: Capture screenshots of all pages before/after changes and compare for consistency
2. **Keyboard Navigation Testing**: Manual test session using only keyboard to navigate entire game flow
3. **Mouse Navigation Testing**: Manual test session using only mouse to navigate entire game flow
4. **Accessibility Audit**: Run Lighthouse and axe DevTools to verify WCAG AA compliance
5. **Animation Quality Testing**: Visually inspect all animations to confirm discrete steps vs. smooth transitions
6. **Responsive Testing**: Test at mobile (375px), tablet (768px), and desktop (1200px) breakpoints
7. **Zoom Testing**: Test at 100%, 150%, 200% browser zoom levels
8. **Motion Preference Testing**: Test with `prefers-reduced-motion: reduce` enabled in browser settings
9. **Cross-Browser Testing**: Verify in Chrome, Firefox, Safari, and Edge for consistent rendering

## Out of Scope

- **Adding new gameplay features**: This feature is purely visual/UX, no new game mechanics
- **Sound design for UI interactions**: Sound effects (button clicks, selection sounds) are future work
- **Custom pixel art sprites**: Using emoji/unicode characters is acceptable, custom SVG/PNG sprites are future work
- **Localization/internationalization**: Text remains in current language (French/English mix), no translation work
- **Backend/API integration**: Client-side only, no server communication
- **User-customizable themes**: Single fixed retro theme, no theme switcher or dark mode
- **Advanced accessibility features**: Beyond WCAG AA (e.g., screen reader optimization, high contrast mode, custom color schemes)
- **Performance optimization beyond CSS**: No code splitting, lazy loading, or bundle size optimization in this feature
- **Cross-device state synchronization**: localStorage remains device-local, no cloud sync

## Dependencies

- **Press Start 2P Font** (already integrated via Google Fonts in `src/index.css`)
- **React Router** (already integrated for page navigation)
- **TypeScript** (existing project language)
- **CSS Custom Properties** (for design tokens, supported in all modern browsers)
- **CSS Keyframe Animations** (for sprite-based animations, widely supported)
- **Modern Browser Support** (Chrome, Firefox, Safari, Edge - last 2 versions)

## Future Enhancements

- **Custom pixel art sprite assets**: Replace emoji with hand-drawn pixel art characters and UI elements
- **8-bit sound effects library**: Add retro sound effects for button clicks, correct/incorrect answers, combo achievements
- **CRT screen effect overlay**: Subtle scanlines or curvature effect for authentic retro monitor feel
- **Particle effects**: Pixel-based explosion/sparkle effects on correct answers using canvas or CSS
- **Screen shake on errors**: Discrete shake animation when incorrect answer is submitted
- **Pixelated transitions**: Wipe or mosaic transitions between pages using canvas or CSS clip-path
- **Achievement badges**: Pixel art badges for milestones (10 correct, 20 correct, perfect game) displayed on HomePage
- **Color palette variants**: Multiple retro console themes (NES, SNES, Game Boy, Genesis) selectable by user
- **Animated background elements**: More interactive background sprites (birds, coins, power-ups) with discrete animations
- **Gamepad support**: Support for USB/Bluetooth game controllers for authentic retro input method
