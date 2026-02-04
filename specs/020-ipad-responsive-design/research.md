# Research: iPad Responsive Design

**Feature**: 020-ipad-responsive-design
**Date**: 2026-02-04
**Purpose**: Analyze current CSS patterns and identify responsive design best practices for iPad support

## Current State Analysis

### Existing Breakpoint System

**Decision**: The project has a single breakpoint defined at `$breakpoint-mobile: 600px` in `_tokens.scss`.

**Finding**: No iPad-specific breakpoints exist. The current system only handles "mobile" devices under 600px width.

**Gap**: iPad portrait (768px) and iPad Pro portrait (1024px) fall above the mobile breakpoint but may still need responsive adjustments.

### CSS Architecture

**Decision**: Project uses Sass CSS Modules with centralized tokens and mixins.

**Finding**: Well-structured design system with:
- `_tokens.scss`: Color palette, typography, spacing, shadows, z-index, breakpoints
- `_mixins.scss`: Button, card, container, text, input, and utility mixins
- Component-specific `.module.scss` files

**Files to Audit** (16 total):
- Components: `KeyboardHints`, `ProgressBar`, `MultiplicationQuestion`, `JumpingArrow`, `PauseMenu`, `AnswerFeedback`, `CreditsContent`, `Starfield`, `RainbowTitle`, `GameOverOverlay`, `PlayerNameDisplay`
- Pages: `PlayerSelectPage`, `HomePage`, `PlayPage`, `CreditsPage`, `GameResultsPage`

### Container Width Constraints

**Decision**: Main containers use `max-width: 600px` with `width: 100%`.

**Rationale**: The `@mixin main-game-container` sets:
```scss
max-width: 600px;
width: 100%;
padding: $spacing-xl; // 30px
```

**Implication for iPad**: At 768px viewport, the 600px container will be centered with ~84px margins on each side. This is acceptable but may feel small on iPad Pro (1024px) where margins would be ~212px each side.

**Alternatives Considered**:
1. **Keep 600px** - Maintains desktop parity, less testing surface
2. **Scale to 700px for iPad** - Better use of iPad real estate
3. **Full responsive with max-width 90%** - Flexible but may break pixel-perfect aesthetic

**Selected**: Option 1 (keep 600px) - The retro aesthetic benefits from fixed-width "game screen" feel. Larger iPads will have cinematic borders like a CRT TV frame.

### Touch Target Analysis

**Decision**: Touch targets must be minimum 44x44px per WCAG 2.5.5.

**Current State**:
- Buttons use `padding: $spacing-md $spacing-lg` (10px 20px) - height may be under 44px
- Pixel button mixin adds `padding: $spacing-lg $spacing-xl` (20px 30px) - likely meets target
- Player card was recently fixed to add `min-width: 44px; min-height: 44px`

**Risk Areas**:
- Score cards in leaderboard (may have small tap areas)
- Keyboard hints text (not interactive, but adjacent spacing matters)
- Form inputs (number input field)

### Responsive Mixin

**Decision**: Existing `@mixin mobile` wraps `@media (max-width: 600px)`.

**Gap**: Need iPad-specific mixin for 768px+ adjustments.

**Proposal**: Add `@mixin tablet` for iPad-specific overrides:
```scss
@mixin tablet {
  @media (min-width: 601px) and (max-width: 1024px) {
    @content;
  }
}
```

## Best Practices Research

### Playwright iPad Viewport Emulation

**Decision**: Use Playwright's built-in device emulation for iPad testing.

**Rationale**: Playwright provides accurate viewport emulation with:
- `viewport: { width: 768, height: 1024 }` for iPad portrait
- `viewport: { width: 1024, height: 768 }` for iPad landscape
- `hasTouch: true` for touch interaction simulation

**Pattern**:
```typescript
test.describe('iPad Portrait', () => {
  test.use({ viewport: { width: 768, height: 1024 }, hasTouch: true })

  test('layout renders correctly', async ({ page }) => {
    // Test implementation
  })
})
```

### CSS Overflow Detection

**Decision**: Use `document.documentElement.scrollWidth > window.innerWidth` to detect horizontal overflow.

**Rationale**: Standard approach for detecting layout overflow issues.

**E2E Test Pattern**:
```typescript
const hasOverflow = await page.evaluate(() =>
  document.documentElement.scrollWidth > window.innerWidth
)
expect(hasOverflow).toBe(false)
```

### Touch Target Measurement

**Decision**: Measure touch targets via `getComputedStyle` in E2E tests.

**Pattern**:
```typescript
const buttons = page.locator('button')
for (const button of await buttons.all()) {
  const box = await button.boundingBox()
  expect(box?.width).toBeGreaterThanOrEqual(44)
  expect(box?.height).toBeGreaterThanOrEqual(44)
}
```

## Technical Decisions

### Breakpoint Strategy

| Breakpoint | Width | Use Case |
|------------|-------|----------|
| Mobile | ≤600px | Phone, compact layouts |
| Tablet | 601px-1024px | iPad, iPad Pro portrait |
| Desktop | >1024px | Standard desktop, iPad Pro landscape |

**Decision**: Add `$breakpoint-tablet: 1024px` to tokens and `@mixin tablet` to mixins.

### Font Scaling Strategy

**Decision**: Keep pixel-based font sizes (no scaling for iPad).

**Rationale**:
- Retro pixel aesthetic requires fixed font sizes
- iPad screen density handles readability
- $font-size-base (14px) is already above minimum readable size
- Scaling would break the pixel-perfect 8-bit look

### Container Strategy

**Decision**: Keep `max-width: 600px` for game containers.

**Rationale**:
- Provides consistent "game screen" experience across devices
- iPad's extra space becomes a natural "border" (like arcade cabinet)
- Reduces testing surface (same layout on desktop and iPad)
- Matches retro gaming aesthetic of centered, fixed-width game area

### Padding/Margin Adjustments

**Decision**: May need to reduce some padding on iPad portrait to fit all content.

**Areas to Watch**:
- `.gameContainer` padding (currently 30px)
- `.statsBar` gap spacing
- Score card internal padding
- Modal content padding

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Horizontal overflow on iPad portrait | Medium | High | E2E overflow detection test |
| Touch targets too small | Medium | High | Automated size measurement |
| Desktop regression | Low | High | E2E tests for desktop viewport |
| Pixel fonts unreadable | Low | Medium | Manual testing verification |
| Modal doesn't fit iPad | Medium | Medium | Test pause menu explicitly |

## Recommendations

1. **Phase 1**: Create E2E test file with viewport configurations for iPad/iPad Pro
2. **Phase 2**: Run visual audit - capture screenshots of all screens at iPad viewports
3. **Phase 3**: Identify specific overflow or sizing issues from screenshots
4. **Phase 4**: Add CSS fixes with iPad-specific media queries if needed
5. **Phase 5**: Verify desktop regression protection via existing E2E tests

## References

- Apple Human Interface Guidelines: [44pt minimum touch target](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- WCAG 2.5.5: [Target Size (Enhanced)](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
- Playwright Devices: [iPad emulation](https://playwright.dev/docs/emulation#devices)
