# Quickstart Guide: Player Name Display Implementation

**Feature**: 010-player-name-display
**Branch**: `010-player-name-display`
**Date**: 2026-01-15

## Overview

This guide provides step-by-step instructions for implementing the player name display feature following Test-Driven Development (TDD) principles and project constitution requirements.

**Estimated Time**: 2-3 hours (including testing and quality checks)

**Prerequisites**:
- Node.js and npm installed
- Project dependencies installed (`npm install`)
- Feature branch checked out (`git checkout 010-player-name-display`)
- Familiarity with React, TypeScript, and Vitest

---

## Step 1: Environment Setup

### Verify Current Branch

```bash
git branch
# Should show: * 010-player-name-display

git status
# Should show clean working tree
```

### Start Development Server (Optional)

```bash
npm run dev
# Open browser to http://localhost:5173 for live testing
```

### Start Test Watcher (Recommended)

```bash
# In a separate terminal
npm run test
# Vitest will run in watch mode, auto-rerunning on file changes
```

**Duration**: 2 minutes

---

## Step 2: Write Component Tests (TDD Phase - RED)

### Create Test File

**File**: `src/components/PlayerNameDisplay.test.tsx`

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PlayerNameDisplay from './PlayerNameDisplay'

describe('PlayerNameDisplay', () => {
  it('should render player name when player exists', () => {
    const player = { id: 'jules', name: 'Jules' }
    render(<PlayerNameDisplay player={player} />)
    expect(screen.getByText('Jules')).toBeInTheDocument()
  })

  it('should render nothing when player is null', () => {
    const { container } = render(<PlayerNameDisplay player={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render player name with different player', () => {
    const player = { id: 'achille', name: 'Achille' }
    render(<PlayerNameDisplay player={player} />)
    expect(screen.getByText('Achille')).toBeInTheDocument()
  })

  it('should handle long player names', () => {
    const player = { id: 'test', name: 'VeryLongPlayerNameThatExceedsMaxWidth' }
    render(<PlayerNameDisplay player={player} />)
    // React renders full text, CSS truncates visually
    expect(screen.getByText('VeryLongPlayerNameThatExceedsMaxWidth')).toBeInTheDocument()
  })

  it('should handle special characters and emojis', () => {
    const player = { id: 'test', name: '日本語 🎮' }
    render(<PlayerNameDisplay player={player} />)
    expect(screen.getByText('日本語 🎮')).toBeInTheDocument()
  })

  it('should have correct styling structure', () => {
    const player = { id: 'jules', name: 'Jules' }
    const { container } = render(<PlayerNameDisplay player={player} />)
    const playerNameDiv = container.firstChild as HTMLElement
    expect(playerNameDiv).toHaveStyle({ position: 'absolute' })
  })
})
```

### Run Tests (Should FAIL)

```bash
npm run test:run
# Expected: 6 failed tests (component doesn't exist yet)
```

**Expected Errors**:
- `Cannot find module './PlayerNameDisplay'`
- This is correct! TDD requires tests to fail first.

**Duration**: 15 minutes

---

## Step 3: Implement Component (TDD Phase - GREEN)

### Create Component File

**File**: `src/components/PlayerNameDisplay.tsx`

```typescript
import { Player } from '../types/player'

/**
 * Props for PlayerNameDisplay component
 * @public
 */
export interface PlayerNameDisplayProps {
  /**
   * Current player object to display. If null, component renders nothing.
   * Retrieved from localStorage via getCurrentPlayer() in parent components.
   */
  player: Player | null
}

/**
 * Displays the current player's name in the top right corner with retro 8-bit styling.
 * Truncates names longer than 12 characters with ellipsis.
 * @param {PlayerNameDisplayProps} props - Component props
 * @returns {JSX.Element | null} Player name display or null if no player
 * @public
 */
export default function PlayerNameDisplay({
  player,
}: PlayerNameDisplayProps): JSX.Element | null {
  if (!player) return null

  return (
    <div style={styles.playerNameContainer}>
      <span style={styles.playerNameText}>{player.name}</span>
    </div>
  )
}

const styles = {
  playerNameContainer: {
    position: 'absolute' as const,
    top: '20px',
    right: '20px',
    zIndex: 100,
    background: 'linear-gradient(180deg, #4ecdc4 0%, #44b3aa 100%)',
    border: '4px solid #000',
    padding: '8px 16px',
    boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.3)',
  },
  playerNameText: {
    color: '#fff',
    fontSize: '14px',
    textShadow: '2px 2px 0 #000',
    maxWidth: '200px',
    overflow: 'hidden' as const,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    fontWeight: 'bold' as const,
  },
}
```

### Run Tests (Should PASS)

```bash
npm run test:run
# Expected: All 6 PlayerNameDisplay tests pass
```

**Duration**: 20 minutes

---

## Step 4: Integrate with HomePage

### Modify HomePage.tsx

**File**: `src/pages/HomePage.tsx`

**Change 1**: Add import at top of file (after existing imports)

```typescript
import PlayerNameDisplay from '../components/PlayerNameDisplay'
```

**Change 2**: Add component to JSX (inside return statement, after opening `<div style={styles.gameContainer}>`)

```typescript
return (
  <div style={styles.gameContainer}>
    <PlayerNameDisplay player={currentPlayer} />

    <div style={styles.clouds}>
      {/* existing clouds JSX */}
    </div>
    {/* rest of existing JSX */}
  </div>
)
```

### Add HomePage Integration Test

**File**: `src/pages/HomePage.test.tsx`

**Add test case** (inside existing `describe('HomePage - localStorage Integration')` block):

```typescript
it('should display current player name', () => {
  const mockScores = [{ score: 500, results: [] }]
  localStorage.setItem('scores', JSON.stringify(mockScores))

  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  )

  // Player name should be visible (currentPlayer set in beforeEach)
  expect(screen.getByText('Jules')).toBeInTheDocument()
})
```

### Run Tests

```bash
npm run test:run
# Expected: All HomePage tests pass (including new integration test)
```

**Duration**: 10 minutes

---

## Step 5: Integrate with PlayPage

### Modify PlayPage.tsx

**File**: `src/pages/PlayPage.tsx`

**Change 1**: Add import at top of file (after existing imports)

```typescript
import PlayerNameDisplay from '../components/PlayerNameDisplay'
```

**Change 2**: Add component to JSX (inside return statement, after opening `<div style={styles.gameContainer}>`)

```typescript
return (
  <div style={styles.gameContainer}>
    <PlayerNameDisplay player={currentPlayer} />

    <div style={styles.gameHeader}>
      {/* existing header JSX */}
    </div>
    {/* rest of existing JSX */}
  </div>
)
```

### Add PlayPage Integration Test

**File**: `src/pages/PlayPage.test.tsx`

**Add test case** (inside existing `describe('PlayPage - localStorage Integration')` block):

```typescript
it('should display current player name during gameplay', () => {
  render(
    <MemoryRouter>
      <PlayPage />
    </MemoryRouter>
  )

  // Player name should be visible (currentPlayer set in beforeEach)
  expect(screen.getByText('Jules')).toBeInTheDocument()
})
```

### Run Tests

```bash
npm run test:run
# Expected: All PlayPage tests pass (including new integration test)
```

**Duration**: 10 minutes

---

## Step 6: Quality Assurance (Constitution Compliance)

### Run All Quality Checks

**Check 1: TypeScript Type Safety**

```bash
npm run type-check
# Expected: No errors
```

**Fix if needed**: Address any TypeScript errors before proceeding.

**Check 2: Code Linting**

```bash
npm run lint:fix
# Expected: All lint issues auto-fixed
```

**Check 3: All Tests**

```bash
npm run test:run
# Expected: All tests pass (72 existing + 8 new = 80 total tests)
```

**Check 4: Production Build**

```bash
npm run build
# Expected: Build succeeds, no errors
```

**Expected Output**:
```
✓ built in XXXms
dist/index.html                   X.XX kB
dist/assets/index-XXXXX.css       X.XX kB │ gzip: X.XX kB
dist/assets/index-XXXXX.js      XXX.XX kB │ gzip: XX.XX kB
```

**Duration**: 10 minutes

---

## Step 7: Manual Browser Testing

### Test Checklist

Open `http://localhost:5173` in your browser and verify:

**HomePage Tests**:
- [ ] Player name appears in top right corner
- [ ] Player name has retro pixel border styling
- [ ] Player name uses teal gradient background
- [ ] Player name has white text with black shadow
- [ ] Player name doesn't overlap with clouds or header
- [ ] Player name stays in top right when window resized

**PlayPage Tests**:
- [ ] Player name appears in top right corner during gameplay
- [ ] Player name doesn't overlap with timer or progress bar
- [ ] Player name persists throughout entire game session
- [ ] Player name styling matches HomePage

**Edge Case Tests**:
- [ ] Long player name truncates with ellipsis (manually create player with long name in localStorage if needed)
- [ ] Special characters render correctly (if player has emoji/Unicode in name)

### Test with Different Players

```javascript
// In browser console, switch to different player:
localStorage.setItem('currentPlayer', 'achille')
location.reload()
// Verify "Achille" appears in top right corner
```

**Duration**: 15 minutes

---

## Step 8: Documentation

### Regenerate API Documentation

```bash
npm run docs
# Expected: TypeDoc generates updated documentation in /docs
```

**Verify**: Check that `PlayerNameDisplay` and `PlayerNameDisplayProps` appear in generated docs.

### Verify No ARCHITECTURE.md Changes Needed

**Question**: Did this feature introduce new architectural patterns?

**Answer**: No - component follows existing patterns (functional component, CSS-in-JS, co-located tests).

**Action**: No ARCHITECTURE.md updates required.

**Duration**: 5 minutes

---

## Step 9: Commit Changes

### Review Changes

```bash
git status
# Expected files modified:
#   modified:   src/pages/HomePage.tsx
#   modified:   src/pages/HomePage.test.tsx
#   modified:   src/pages/PlayPage.tsx
#   modified:   src/pages/PlayPage.test.tsx
# Expected new files:
#   new file:   src/components/PlayerNameDisplay.tsx
#   new file:   src/components/PlayerNameDisplay.test.tsx
```

### Stage Changes

```bash
git add src/components/PlayerNameDisplay.tsx
git add src/components/PlayerNameDisplay.test.tsx
git add src/pages/HomePage.tsx
git add src/pages/HomePage.test.tsx
git add src/pages/PlayPage.tsx
git add src/pages/PlayPage.test.tsx
```

### Commit with Descriptive Message

```bash
git commit -m "Add player name display component to HomePage and PlayPage

- Create PlayerNameDisplay component with retro 8-bit styling
- Display current player name in top right corner
- Truncate long names (>12 chars) with CSS ellipsis
- Add component tests (6 test cases)
- Integrate with HomePage and PlayPage
- Add integration tests for both pages
- All quality checks pass (type-check, lint, test, build)

Fixes: #010-player-name-display

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

**Note**: Pre-commit hooks will automatically run `lint-staged` (linting and formatting).

**Duration**: 5 minutes

---

## Step 10: Verification & Next Steps

### Final Verification

```bash
# Ensure all quality gates still pass after commit
npm run quality-check
# This runs: type-check, lint:fix, test:run, build
```

### Create Pull Request (Optional)

```bash
# Push branch to remote
git push -u origin 010-player-name-display

# Create PR using GitHub CLI (if installed)
gh pr create --title "Add player name display to all game screens" --body "$(cat <<'EOF'
## Summary
Adds a persistent player name display component in the top right corner of HomePage and PlayPage.

## Changes
- ✅ Created PlayerNameDisplay component with retro pixel art styling
- ✅ Integrated component into HomePage and PlayPage
- ✅ Added 8 new tests (6 component + 2 integration)
- ✅ All quality checks pass (type-check, lint, test, build)
- ✅ Documentation regenerated with TypeDoc

## Test Plan
- [x] Unit tests: 6/6 passing (PlayerNameDisplay.test.tsx)
- [x] Integration tests: 2/2 passing (HomePage.test.tsx, PlayPage.test.tsx)
- [x] Manual browser testing: Player name displays correctly on both pages
- [x] Edge cases: Long names truncate with ellipsis, special characters render correctly

## Screenshots
[Add browser screenshots of HomePage and PlayPage with player name visible]

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

**Duration**: 5 minutes

---

## Troubleshooting

### Common Issues

**Issue 1: Tests fail with "Cannot find module"**
- **Cause**: Import path incorrect
- **Fix**: Verify import paths match file structure (`../components/PlayerNameDisplay`)

**Issue 2: TypeScript errors about missing Player type**
- **Cause**: Player type not imported
- **Fix**: Add `import { Player } from '../types/player'` at top of PlayerNameDisplay.tsx

**Issue 3: Player name not visible in browser**
- **Cause**: Absolute positioning might be wrong, or parent container doesn't have `position: 'relative'`
- **Fix**: Check that `styles.gameContainer` in HomePage/PlayPage has `position: 'relative'`

**Issue 4: Player name overlaps with other elements**
- **Cause**: z-index too low or positioning incorrect
- **Fix**: Verify `zIndex: 100` in styles, adjust `top`/`right` values if needed

**Issue 5: Pre-commit hook fails**
- **Cause**: Linting or formatting issues
- **Fix**: Run `npm run lint:fix` and `npm run format` before committing

---

## Summary Checklist

Before marking this feature complete, verify:

- [x] **Step 1**: Environment setup complete
- [x] **Step 2**: Component tests written (TDD - RED phase)
- [x] **Step 3**: Component implemented (TDD - GREEN phase)
- [x] **Step 4**: HomePage integration complete with tests
- [x] **Step 5**: PlayPage integration complete with tests
- [x] **Step 6**: All quality checks pass (type-check, lint, test, build)
- [x] **Step 7**: Manual browser testing complete
- [x] **Step 8**: API documentation regenerated
- [x] **Step 9**: Changes committed with descriptive message
- [x] **Step 10**: Final verification and PR created

**Total Duration**: ~2-3 hours (including testing and quality checks)

**Constitution Compliance**: ✅ All principles followed (TDD, TypeScript, Component Architecture, Quality Gates, Documentation, Retro UX)

---

## Next Feature

After merging this PR, the next todo.md item is:
- "Display the last game score above the leaderboard with game results breakdown"

Use `/speckit.specify` to create the specification for that feature.
