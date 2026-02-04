# Data Model: iPad Responsive Design

**Feature**: 020-ipad-responsive-design
**Date**: 2026-02-04
**Purpose**: Define viewport breakpoints, touch target specifications, and CSS token additions

## Viewport Breakpoints

### Supported Devices

| Device | Orientation | Width | Height | Pixel Ratio | Notes |
|--------|-------------|-------|--------|-------------|-------|
| iPad 10th Gen | Portrait | 768px | 1024px | 2x | Primary target |
| iPad 10th Gen | Landscape | 1024px | 768px | 2x | Secondary target |
| iPad Pro 11" | Portrait | 834px | 1194px | 2x | Similar to standard iPad |
| iPad Pro 12.9" | Portrait | 1024px | 1366px | 2x | Large tablet |
| iPad Pro 12.9" | Landscape | 1366px | 1024px | 2x | Wide viewport |

### Breakpoint Tokens (New)

```scss
// _tokens.scss additions
$breakpoint-mobile: 600px;     // Existing
$breakpoint-tablet: 1024px;    // NEW: iPad Pro portrait max
$breakpoint-tablet-min: 601px; // NEW: Tablet range start
```

### Breakpoint Ranges

| Range | Name | Condition | Description |
|-------|------|-----------|-------------|
| Mobile | ≤600px | `max-width: 600px` | Phones, compact layouts |
| Tablet | 601px-1024px | `min-width: 601px and max-width: 1024px` | iPads, tablets |
| Desktop | >1024px | `min-width: 1025px` | Desktop, iPad Pro landscape |

## Touch Target Specifications

### WCAG 2.5.5 Requirements

| Metric | Minimum | Recommended | Notes |
|--------|---------|-------------|-------|
| Target Size | 44x44px | 48x48px | Apple HIG recommends 44pt |
| Target Spacing | 8px | 12px | Between adjacent targets |
| Hit Slop | 0px | 8px | Invisible touch area extension |

### Interactive Elements Audit

| Element | Component | Current Size (est.) | Action Required |
|---------|-----------|---------------------|-----------------|
| Start Game button | HomePage | ~60x50px | ✅ Meets target |
| Player card | PlayerNameDisplay | min 44x44px | ✅ Recently fixed |
| Score card | HomePage | Full width | ⚠️ Verify tap area |
| Valider button | PlayPage | ~80x50px | ✅ Meets target |
| Restart button | PlayPage | ~80x50px | ✅ Meets target |
| Pause menu options | PauseMenu | ~200x50px | ✅ Meets target |
| Number input | PlayPage | ~150x50px | ⚠️ Verify height |
| Player options | PlayerSelectPage | Full width | ⚠️ Verify tap area |

## CSS Mixin Additions

### Tablet Responsive Mixin (New)

```scss
// _mixins.scss addition
@mixin tablet {
  @media (min-width: $breakpoint-tablet-min) and (max-width: $breakpoint-tablet) {
    @content;
  }
}

// Usage example:
.container {
  padding: 30px;

  @include tablet {
    padding: 20px; // Reduce padding on tablet
  }

  @include mobile {
    padding: 15px; // Further reduce on mobile
  }
}
```

### Touch Target Mixin (New)

```scss
// _mixins.scss addition
@mixin touch-target {
  min-width: 44px;
  min-height: 44px;
}

// Usage:
.interactiveElement {
  @include touch-target;
}
```

## Container Sizing Model

### Main Game Container

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                        iPad Portrait (768px)                            │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                     Margin (84px each side)                       │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │                                                             │  │  │
│  │  │              Game Container (max-width: 600px)              │  │  │
│  │  │                    padding: 30px                            │  │  │
│  │  │                                                             │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘

Content Width = 600px - 60px (padding) = 540px usable
```

### iPad Pro Portrait

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          iPad Pro Portrait (1024px)                             │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                       Margin (212px each side)                            │  │
│  │  ┌─────────────────────────────────────────────────────────────────────┐  │  │
│  │  │                                                                     │  │  │
│  │  │                  Game Container (max-width: 600px)                  │  │  │
│  │  │                                                                     │  │  │
│  │  └─────────────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘

Note: Larger margins create "arcade cabinet" frame effect (desirable for retro aesthetic)
```

## Overflow Prevention Rules

### Horizontal Overflow Causes

| Cause | Solution |
|-------|----------|
| Fixed pixel widths | Use `max-width` with `width: 100%` |
| Whitespace: nowrap | Allow wrapping or use `text-overflow: ellipsis` |
| Padding/margin overflow | Use `box-sizing: border-box` (already default) |
| Absolute positioned elements | Contain within parent bounds |
| Large font sizes | Test at all viewports |

### Vertical Overflow Considerations

| Element | Current Height | iPad Portrait Space | Notes |
|---------|----------------|---------------------|-------|
| Header | ~100px | ~924px remaining | OK |
| Leaderboard | 300px max | Scrollable | OK |
| Game UI | ~400px | Plenty of space | OK |
| Pause Modal | ~350px | Needs testing | ⚠️ Verify |

## State Model

No new state required. This feature modifies CSS only.

## Validation Rules

| Rule | Target | Threshold |
|------|--------|-----------|
| Touch target size | All interactive elements | ≥44x44px |
| Element spacing | Adjacent interactive elements | ≥8px |
| Font readability | Body text | ≥14px |
| Container overflow | All screens | scrollWidth ≤ viewportWidth |
