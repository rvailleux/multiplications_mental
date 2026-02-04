# Quickstart: iPad Responsive Design

**Feature**: 020-ipad-responsive-design
**Time Estimate**: 2-4 hours
**Complexity**: Low (CSS-only changes)

## Prerequisites

- [ ] Node.js 18+ installed
- [ ] Project dependencies installed (`npm install`)
- [ ] Playwright installed (`npx playwright install`)
- [ ] Development server running (`npm run dev`)

## Quick Implementation Guide

### Step 1: Create iPad E2E Test File

Create `tests/e2e/ipad-responsive.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

// iPad Portrait viewport
test.describe('iPad Portrait (768x1024)', () => {
  test.use({ viewport: { width: 768, height: 1024 }, hasTouch: true })

  test('homepage renders without horizontal overflow', async ({ page }) => {
    await page.goto('/')
    // Select player first
    await page.click('text=Jules', { force: true })
    await page.waitForURL(/\/home/)

    // Check for overflow
    const hasOverflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > window.innerWidth
    )
    expect(hasOverflow).toBe(false)
    await page.screenshot({ path: 'test-results/ipad/01-homepage-portrait.png' })
  })
})
```

### Step 2: Add Tablet Breakpoint Token

In `src/styles/_tokens.scss`, add:

```scss
// === BREAKPOINTS ===
$breakpoint-mobile: 600px;
$breakpoint-tablet: 1024px;      // NEW
$breakpoint-tablet-min: 601px;   // NEW
```

### Step 3: Add Tablet Mixin

In `src/styles/_mixins.scss`, add:

```scss
// === RESPONSIVE MIXINS ===

@mixin mobile {
  @media (max-width: $breakpoint-mobile) {
    @content;
  }
}

// NEW: Tablet mixin
@mixin tablet {
  @media (min-width: $breakpoint-tablet-min) and (max-width: $breakpoint-tablet) {
    @content;
  }
}

// NEW: Touch target enforcement
@mixin touch-target {
  min-width: 44px;
  min-height: 44px;
}
```

### Step 4: Run Visual Audit

```bash
# Run E2E tests for iPad viewport screenshots
npx playwright test tests/e2e/ipad-responsive.spec.ts --headed

# View screenshots
open test-results/ipad/
```

### Step 5: Fix Any Issues Found

Common fixes:

```scss
// Reduce padding if content overflows
.container {
  padding: $spacing-2xl; // 40px

  @include tablet {
    padding: $spacing-xl; // 30px - slightly less on tablet
  }
}

// Ensure touch targets meet minimum
.interactiveButton {
  @include touch-target;
  padding: $spacing-md $spacing-lg;
}
```

## Verification Checklist

- [ ] `npm run type-check` passes
- [ ] `npm run lint:fix` passes
- [ ] `npm run test:run` passes (all 319+ unit tests)
- [ ] `npm run build` succeeds
- [ ] `npx playwright test tests/e2e/ipad-responsive.spec.ts` passes
- [ ] No horizontal scrollbar on any screen at 768x1024
- [ ] All buttons/interactive elements ≥44x44px
- [ ] Desktop viewport still works (no regression)

## Common Patterns

### Checking Touch Target Size in E2E

```typescript
test('buttons meet touch target requirements', async ({ page }) => {
  const buttons = page.locator('button')
  const count = await buttons.count()

  for (let i = 0; i < count; i++) {
    const box = await buttons.nth(i).boundingBox()
    if (box) {
      expect(box.width).toBeGreaterThanOrEqual(44)
      expect(box.height).toBeGreaterThanOrEqual(44)
    }
  }
})
```

### Checking for Horizontal Overflow

```typescript
test('no horizontal overflow', async ({ page }) => {
  const hasOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth
  })
  expect(hasOverflow).toBe(false)
})
```

### Screenshot Comparisons

```typescript
test('visual regression check', async ({ page }) => {
  await page.screenshot({
    path: `test-results/ipad/${testInfo.title}.png`,
    fullPage: true
  })
})
```

## Troubleshooting

### Issue: Content overflows horizontally

**Solution**: Check for fixed widths or `white-space: nowrap`. Use `max-width: 100%` instead.

### Issue: Touch targets too small

**Solution**: Add `@include touch-target` mixin or explicit `min-width/min-height: 44px`.

### Issue: Text too small

**Solution**: Verify font sizes are at least 14px. Project uses pixel fonts which should already meet this.

### Issue: Modal doesn't fit

**Solution**: Check modal `max-width` and padding. May need tablet-specific override.

## Files Modified

Typical changes for this feature:

| File | Change Type |
|------|-------------|
| `src/styles/_tokens.scss` | Add tablet breakpoint |
| `src/styles/_mixins.scss` | Add tablet and touch-target mixins |
| `tests/e2e/ipad-responsive.spec.ts` | NEW: E2E test file |
| Various `.module.scss` files | Responsive fixes as needed |

## Time Breakdown

| Phase | Time |
|-------|------|
| Create E2E tests | 30 min |
| Run visual audit | 15 min |
| Add tokens/mixins | 15 min |
| Fix identified issues | 1-2 hours |
| Final verification | 30 min |
| **Total** | **2-4 hours** |
