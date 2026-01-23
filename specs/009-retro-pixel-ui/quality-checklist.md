# Quality Assurance Checklist: Retro Pixel Art UI Design

**Purpose**: Comprehensive validation checklist for verifying the retro pixel art UI design implementation across all pages, ensuring consistent aesthetic, keyboard-first navigation, accessibility compliance, and sprite-based animations.
**Created**: 2026-01-13
**Feature**: [spec.md](./spec.md)

## Visual Design Consistency

- [ ] CHK001 All primary containers (game containers, cards, buttons, inputs, headers) have 4px solid black borders on PlayerSelectPage
- [ ] CHK002 All primary containers have 4px solid black borders on HomePage
- [ ] CHK003 All primary containers have 4px solid black borders on PlayPage
- [ ] CHK004 All primary containers have 4px solid black borders on MultiplicationQuestion component
- [ ] CHK005 All primary containers have 4px solid black borders on ProgressBar component
- [ ] CHK006 No border-radius properties exist on interactive elements (buttons, cards, inputs, containers)
- [ ] CHK007 All text elements use "Press Start 2P" pixel font (verify in browser DevTools computed styles)
- [ ] CHK008 Color palette uses only defined colors: red #ff6b6b, blue #3498db, gold #ffd700, cyan #4ecdc4, sky blue #87ceeb, green #228b22, black #000, white #fff
- [ ] CHK009 Box shadows for depth are consistent: "0 6px 0 #000" on buttons, "12px 12px 0 0 rgba(0,0,0,0.3)" on containers
- [ ] CHK010 Inset box shadows create proper highlight/depth: "inset 0 4px 0 rgba(255,255,255,0.5)" on panels and cards
- [ ] CHK011 Visual design is identical across pages (no inconsistencies in borders, fonts, colors, shadows)
- [ ] CHK012 Pixel-perfect alignment: all elements align on pixel boundaries with no sub-pixel rendering
- [ ] CHK013 Image rendering is set to pixelated to prevent smoothing on high DPI displays

## Keyboard Navigation - PlayerSelectPage

- [ ] CHK014 ArrowDown key moves selection to next player in list
- [ ] CHK015 ArrowUp key moves selection to previous player in list
- [ ] CHK016 Selection stops at first item when pressing ArrowUp at top (no wrap)
- [ ] CHK017 Selection stops at last item when pressing ArrowDown at bottom (no wrap)
- [ ] CHK018 Enter key confirms player selection and navigates to HomePage
- [ ] CHK019 Visual focus indicator appears on selected player (golden glow, scale, or cursor)
- [ ] CHK020 Keyboard event listeners are properly cleaned up in useEffect return function
- [ ] CHK021 preventDefault() is called on ArrowUp/ArrowDown to prevent page scrolling

## Keyboard Navigation - HomePage

- [ ] CHK022 Tab key moves focus to "Start Game" button
- [ ] CHK023 Enter key activates "Start Game" button when focused
- [ ] CHK024 Space key activates "Start Game" button when focused
- [ ] CHK025 Escape key navigates back to PlayerSelectPage (or no-op if not implemented)
- [ ] CHK026 Visual focus indicator appears on "Start Game" button (4px golden outline or glow)
- [ ] CHK027 Initial focus is set to "Start Game" button on page load (or first interactive element)

## Keyboard Navigation - PlayPage

- [ ] CHK028 Tab key navigates between input field, submit button, and restart button
- [ ] CHK029 Enter key in input field submits the answer
- [ ] CHK030 Enter key on submit button (when focused) submits the answer
- [ ] CHK031 Enter key on restart button (when focused) resets the game
- [ ] CHK032 Escape key navigates back to HomePage (or shows pause menu)
- [ ] CHK033 Visual focus indicators appear on input field, submit button, restart button
- [ ] CHK034 Input field receives auto-focus on page load for immediate keyboard input
- [ ] CHK035 Tab navigation order is logical: input → submit → restart

## Mouse/Touch Navigation

- [ ] CHK036 Clicking on player card selects player and navigates to HomePage
- [ ] CHK037 Clicking "Start Game" button navigates to PlayPage
- [ ] CHK038 Clicking submit button validates and scores the answer
- [ ] CHK039 Clicking restart button resets timer, score, and question
- [ ] CHK040 Hover state appears on buttons (scale, color shift, or cursor change)
- [ ] CHK041 Hover state appears on player cards (scale, color shift, or cursor change)
- [ ] CHK042 Active/pressed state appears on buttons (translateY, reduced box-shadow)
- [ ] CHK043 All keyboard interactions have equivalent mouse interactions (no mouse-only or keyboard-only features)

## Focus Indicators

- [ ] CHK044 Focus indicators use high-contrast colors (golden #ffd700 or cyan #4ecdc4)
- [ ] CHK045 Focus indicators have 4px outline or box-shadow for visibility
- [ ] CHK046 Focus indicators are visible on all interactive elements when tabbed to
- [ ] CHK047 Focus indicators match the retro pixel aesthetic (no modern smooth glows)
- [ ] CHK048 :focus-visible pseudo-class is used to differentiate keyboard vs mouse focus
- [ ] CHK049 Focus outlines have sufficient contrast (3:1 minimum against background)

## Sprite-Based Animations

- [ ] CHK050 Score popup animation uses discrete steps (steps(3) or steps(5) easing function)
- [ ] CHK051 Combo shake animation uses discrete rotation steps or steps() timing function
- [ ] CHK052 Character bounce animation uses discrete vertical positions (e.g., 0px, -4px, -8px, -4px, 0px)
- [ ] CHK053 Cloud float animation uses discrete horizontal positions or steps() timing
- [ ] CHK054 Player selection cursor (▶) bounce uses discrete steps
- [ ] CHK055 Button press animation uses instant or discrete state changes (not smooth transitions)
- [ ] CHK056 Gold glow animation on top scores uses discrete steps or stepped easing
- [ ] CHK057 Progress bar color transitions (green → orange → red) occur in discrete steps, not gradients
- [ ] CHK058 All animations avoid smooth ease/linear timing unless explicitly required for gameplay

## Accessibility

- [ ] CHK059 All text meets WCAG AA contrast ratio 4.5:1 (verify with Lighthouse or axe DevTools)
- [ ] CHK060 All UI components meet WCAG AA contrast ratio 3:1 (buttons, cards, inputs)
- [ ] CHK061 Focus indicators meet WCAG AA contrast ratio 3:1 against background
- [ ] CHK062 prefers-reduced-motion media query is respected (animations disabled or simplified)
- [ ] CHK063 All interactive elements have accessible names (ARIA labels or visible text)
- [ ] CHK064 Keyboard focus order is logical and matches visual layout
- [ ] CHK065 No keyboard traps (users can navigate in and out of all sections)
- [ ] CHK066 Color is not the only means of conveying information (icons, labels, patterns used)

## Responsive Design

- [ ] CHK067 Retro aesthetic is preserved at mobile breakpoint (600px and below)
- [ ] CHK068 4px borders are maintained at all viewport sizes (not scaled down)
- [ ] CHK069 Layout stacks/compresses gracefully on small screens while maintaining aesthetic
- [ ] CHK070 Pixel font remains readable at mobile sizes (may require smaller font-size)
- [ ] CHK071 Button sizes are touch-friendly on mobile (min 44x44px touch target)
- [ ] CHK072 No horizontal scrolling occurs at any breakpoint
- [ ] CHK073 Retro aesthetic is preserved at 100% zoom level
- [ ] CHK074 Retro aesthetic is preserved at 150% zoom level
- [ ] CHK075 Retro aesthetic is preserved at 200% zoom level
- [ ] CHK076 Layout does not break at any zoom level (elements remain accessible)

## Code Quality

- [ ] CHK077 All inline styles use TypeScript `as const` type assertions where needed
- [ ] CHK078 No border-radius properties exist in style objects (verified with code search)
- [ ] CHK079 All keyboard event listeners have proper cleanup in useEffect return functions
- [ ] CHK080 No console errors or warnings related to styling or event handling
- [ ] CHK081 TypeScript type checking passes with no errors (npm run type-check)
- [ ] CHK082 ESLint passes with no errors (npm run lint)
- [ ] CHK083 Prettier formatting is consistent (npm run format:check)
- [ ] CHK084 No unused CSS/style properties in any component
- [ ] CHK085 Color values use hex format consistently (no rgb(), hsl(), or named colors except black/white)

## Functional Testing

- [ ] CHK086 Game is fully playable using only keyboard (manual test session without mouse)
- [ ] CHK087 Game is fully playable using only mouse (manual test session without keyboard)
- [ ] CHK088 Player selection flow works: PlayerSelectPage → select player → HomePage
- [ ] CHK089 Game start flow works: HomePage → Start Game → PlayPage
- [ ] CHK090 Gameplay flow works: PlayPage → answer questions → timer expires → HomePage with score saved
- [ ] CHK091 Restart functionality works: PlayPage → Restart → timer/score/question reset
- [ ] CHK092 All existing game mechanics remain intact (timer, scoring, question generation, localStorage)
- [ ] CHK093 No regressions in existing functionality (verify with existing test suite)

## Cross-Browser Compatibility

- [ ] CHK094 Visual design renders correctly in Chrome (latest version)
- [ ] CHK095 Visual design renders correctly in Firefox (latest version)
- [ ] CHK096 Visual design renders correctly in Safari (latest version)
- [ ] CHK097 Visual design renders correctly in Edge (latest version)
- [ ] CHK098 Keyboard navigation works in all browsers
- [ ] CHK099 Mouse navigation works in all browsers
- [ ] CHK100 Animations play correctly in all browsers (no missing steps() support)
- [ ] CHK101 Focus indicators display correctly in all browsers

## Performance

- [ ] CHK102 No animation jank or dropped frames (60fps maintained)
- [ ] CHK103 Keyboard event handlers do not cause lag or delay
- [ ] CHK104 Page load time is not significantly increased (no large font files or assets)
- [ ] CHK105 CSS animations use GPU-accelerated properties (transform, opacity)
- [ ] CHK106 No layout thrashing from excessive style recalculations

## Documentation

- [ ] CHK107 spec.md accurately reflects implemented design system
- [ ] CHK108 Code comments explain complex animation logic or keyboard handling
- [ ] CHK109 JSDoc comments are updated for any modified components
- [ ] CHK110 CLAUDE.md is updated with keyboard navigation patterns if new patterns introduced
- [ ] CHK111 README.md is updated if user-facing features changed
- [ ] CHK112 ARCHITECTURE.md is updated if architectural patterns changed

## Edge Cases

- [ ] CHK113 Rapid keyboard/mouse switching does not cause conflicts or visual glitches
- [ ] CHK114 Very long player names truncate with ellipsis or scale down while maintaining readability
- [ ] CHK115 localStorage disabled scenario does not break styling or layout
- [ ] CHK116 High DPI displays (Retina, 4K) render crisp pixels (image-rendering: pixelated)
- [ ] CHK117 Empty game state (no scores) still displays retro aesthetic correctly
- [ ] CHK118 Maximum score values (very large numbers) do not break layout
- [ ] CHK119 Rapid answer submissions do not cause animation overlap or visual bugs
- [ ] CHK120 Focus management works correctly when navigating back/forward in browser history

## Final Validation

- [ ] CHK121 Visual regression testing: screenshots match expected retro aesthetic
- [ ] CHK122 All acceptance scenarios from spec.md user stories are satisfied
- [ ] CHK123 All functional requirements (FR-001 to FR-020) are implemented
- [ ] CHK124 All success criteria (SC-001 to SC-012) are met and measurable
- [ ] CHK125 Manual QA session completed with no critical issues
- [ ] CHK126 Stakeholder review/approval obtained (if applicable)

## Notes

- Check items off as completed: `[x]`
- Add comments or findings inline after each item
- Link to relevant issue numbers, PR links, or screenshots
- Items are numbered sequentially for easy reference in reviews
- Priority: Complete all P1 user story items first, then P2, then P3
- Use browser DevTools to verify computed styles for borders, fonts, colors
- Use Lighthouse/axe DevTools for automated accessibility checks (CHK059-CHK066)
- Use "prefers-reduced-motion: reduce" in DevTools to test motion preferences (CHK062)
