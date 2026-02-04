# Quickstart: Player Card Navigation

**Feature**: 019-player-card-navigation
**Date**: 2026-02-04

## Prerequisites

- Node.js v20+
- npm v10+
- Project dependencies installed (`npm install`)

## Development Commands

```bash
# Start development server
npm run dev

# Run unit tests in watch mode
npm run test

# Run single test file
npm run test -- PlayerNameDisplay

# Run E2E tests
npx playwright test tests/e2e/player-card-navigation.spec.ts

# Quality gates (run all before commit)
npm run type-check
npm run lint:fix
npm run test:run
npm run build
```

## Implementation Overview

### Files to Modify

1. **`src/components/PlayerNameDisplay.tsx`**
   - Add optional `onClick` prop to interface
   - Make container div clickable when onClick provided
   - Add appropriate ARIA attributes for accessibility

2. **`src/components/PlayerNameDisplay.module.scss`**
   - Add `.clickable` class with cursor: pointer
   - Add hover state with glow effect
   - Add active state for press feedback

3. **`src/components/PlayerNameDisplay.test.tsx`**
   - Add test: renders without onClick (no click behavior)
   - Add test: calls onClick when clicked
   - Add test: has pointer cursor when clickable

4. **Pages using PlayerNameDisplay** (HomePage, PlayPage, GameResultsPage, CreditsPage)
   - Import useNavigate hook
   - Pass `onClick={() => navigate('/')}` prop

5. **`tests/e2e/player-card-navigation.spec.ts`** (new file)
   - Test clicking player card navigates to selection
   - Test from each page (HomePage, PlayPage, GameResultsPage)
   - Test hover state visual feedback

## Key Implementation Pattern

### Component Enhancement

```typescript
// PlayerNameDisplay.tsx
export interface PlayerNameDisplayProps {
  player: Player | null
  onClick?: () => void  // NEW: optional click handler
}

export default function PlayerNameDisplay({
  player,
  onClick,
}: PlayerNameDisplayProps): React.ReactElement | null {
  if (!player) return null

  const containerClass = onClick
    ? `${styles.playerNameContainer} ${styles.clickable}`
    : styles.playerNameContainer

  return (
    <div
      className={containerClass}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <span className={styles.playerNameText}>{player.name}</span>
    </div>
  )
}
```

### Page Usage

```typescript
// In any page component
const navigate = useNavigate()

return (
  <PlayerNameDisplay
    player={currentPlayer}
    onClick={() => navigate('/')}
  />
)
```

### CSS Hover State

```scss
// PlayerNameDisplay.module.scss
.clickable {
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 0 12px rgba(0, 255, 255, 0.6);
  }

  &:active {
    transform: scale(0.98);
  }
}
```

## Testing Checklist

### Unit Tests
- [ ] Component renders without onClick prop (display only)
- [ ] Component calls onClick when clicked
- [ ] Component has pointer cursor when onClick provided
- [ ] Component has no pointer cursor when onClick not provided
- [ ] Keyboard Enter triggers onClick (accessibility)

### E2E Tests
- [ ] Click player card from HomePage → navigates to player selection
- [ ] Click player card from PlayPage → ends game, navigates to player selection
- [ ] Click player card from GameResultsPage → navigates to player selection
- [ ] Hover state visible on player card

## Common Issues

### Click not working
- Ensure `onClick` prop is being passed from parent
- Check if component returns null (player is null)
- Verify CSS `.clickable` class is applied

### Hover state not visible
- Check SCSS is imported correctly
- Verify transition properties are set
- Test in browser dev tools hover state

### E2E test flaky
- Use proper Playwright locators (getByRole, getByTestId)
- Add explicit waits for navigation completion
- Screenshot at key states for debugging
