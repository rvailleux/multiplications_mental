# Quickstart: Credits Screen Implementation

**Feature**: 017-credits-screen
**Date**: 2026-01-29

## Prerequisites

- Branch `017-credits-screen` checked out
- `npm install` completed
- Development server running (`npm run dev`)

## Implementation Order

Follow this order to maintain TDD and minimize dependencies:

### Phase 1: Foundation (Types & Data)

1. **Create `src/types/credits.ts`**
   - Define `CreditsSection`, `AttributionItem`, `StarLayerConfig`, `ScrollState` interfaces
   - Export `SPEED_LEVELS` constant

2. **Create `src/data/creditsData.ts`**
   - Define `CREDITS_DATA` with all attribution sections
   - Define `STARFIELD_CONFIG` with 3 layer configurations

### Phase 2: Components (Test-First)

3. **Starfield Component**
   - Create `src/components/Starfield.test.tsx` (write tests first)
   - Create `src/components/Starfield.tsx`
   - Create `src/components/Starfield.module.scss`
   - Tests: renders 3 layers, applies animation, handles star positioning

4. **RainbowTitle Component**
   - Create `src/components/RainbowTitle.test.tsx` (write tests first)
   - Create `src/components/RainbowTitle.tsx`
   - Create `src/components/RainbowTitle.module.scss`
   - Tests: renders title text, applies rainbow animation class

5. **CreditsContent Component**
   - Create `src/hooks/useCreditsScroll.ts` (scroll state management)
   - Create `src/components/CreditsContent.test.tsx` (write tests first)
   - Create `src/components/CreditsContent.tsx`
   - Create `src/components/CreditsContent.module.scss`
   - Tests: renders all sections, scrolls content, responds to speed changes

### Phase 3: Page Integration

6. **CreditsPage Component**
   - Create `src/pages/CreditsPage.test.tsx` (write tests first)
   - Create `src/pages/CreditsPage.tsx`
   - Create `src/pages/CreditsPage.module.scss`
   - Tests: keyboard navigation, component composition, Escape to return

7. **Modify Existing Files**
   - Update `src/App.tsx`: Add `/credits` route
   - Update `src/pages/HomePage.tsx`: Add Ctrl+C handler
   - Update `src/components/KeyboardHints.tsx`: Add 'credits' screenId and update 'home' hints

### Phase 4: E2E Tests (Mandatory)

8. **Create Playwright E2E Tests**
   - Create `tests/e2e/credits.spec.ts`
   - Test: Access via Ctrl+C from leaderboard
   - Test: Shortcut only works on leaderboard
   - Test: View all credits sections
   - Test: Speed control with arrow keys
   - Test: Return to leaderboard via Escape

### Phase 5: Quality Gates

9. **Run All Quality Checks**
   ```bash
   npm run type-check    # Zero TypeScript errors
   npm run lint:fix      # Fix lint issues
   npm run test:run      # All unit tests pass
   npm run build         # Production build succeeds
   npx playwright test   # All E2E tests pass
   ```

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/types/credits.ts` | Type definitions |
| `src/data/creditsData.ts` | Static credits content |
| `src/components/Starfield.tsx` | Parallax background |
| `src/components/RainbowTitle.tsx` | Animated title |
| `src/components/CreditsContent.tsx` | Scrolling content |
| `src/hooks/useCreditsScroll.ts` | Scroll speed hook |
| `src/pages/CreditsPage.tsx` | Main credits page |
| `tests/e2e/credits.spec.ts` | E2E test suite |

## Testing Commands

```bash
# Unit tests (watch mode)
npm run test

# Unit tests (single run)
npm run test:run

# E2E tests
npx playwright test tests/e2e/credits.spec.ts

# E2E tests (headed mode for debugging)
npx playwright test tests/e2e/credits.spec.ts --headed
```

## Common Patterns to Follow

### Keyboard Event Handler

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      // handle up
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      // handle down
    } else if (e.key === 'Escape') {
      navigate('/home')
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [navigate])
```

### CSS Module Import

```typescript
import styles from './ComponentName.module.scss'

// Usage
<div className={styles.container}>
```

### Animation Keyframes

```scss
@keyframes animation-name {
  from { /* start state */ }
  to { /* end state */ }
}

.animated-element {
  animation: animation-name duration timing-function iteration-count;
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Starfield not animating | Check animation-duration CSS property |
| Ctrl+C not working | Ensure `e.preventDefault()` is called |
| Scroll jumps on speed change | Use requestAnimationFrame, not CSS animation |
| Rainbow not showing | Check `background-clip: text` browser support |
| E2E test flaky | Add `await page.waitForSelector()` before assertions |
