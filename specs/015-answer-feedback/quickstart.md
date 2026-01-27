# Quickstart: Answer Feedback System

**Feature Branch**: `015-answer-feedback`
**Date**: 2026-01-25

## Prerequisites

- Node.js 18+ installed
- Project dependencies installed (`npm install`)
- Development server running (`npm run dev`)

## Quick Setup

### 1. Switch to Feature Branch

```bash
git checkout 015-answer-feedback
```

### 2. Install Dependencies (if needed)

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
# Opens at http://localhost:5173
```

### 4. Run Tests in Watch Mode

```bash
npm run test
```

---

## Feature Overview

This feature adds audio and visual feedback when players answer questions:

| Correct Answer | Incorrect Answer |
|----------------|------------------|
| 🎵 Positive 8-bit sound | 🎵 Negative 8-bit sound |
| 💚 Green flash animation | ❤️ Red shake animation |
| Duration: 500ms | Duration: 500ms |
| Volume: 20% | Volume: 20% |

**Layout Change**: Hearts (lives) display moves from bottom to between question and timer.

---

## File Locations

### New Files to Create

```
src/types/feedback.ts           # Type definitions
src/hooks/useAnswerFeedback.ts  # Audio + visual feedback hook
src/hooks/useAnswerFeedback.test.ts  # Hook tests
src/components/AnswerFeedback.tsx    # Visual overlay component
src/components/AnswerFeedback.module.scss  # Component styles
src/components/AnswerFeedback.test.tsx  # Component tests
public/audio/sfx/correct.mp3    # Positive feedback sound
public/audio/sfx/wrong.mp3      # Negative feedback sound
tests/e2e/answer-feedback.spec.ts  # Playwright E2E tests
```

### Files to Modify

```
src/pages/PlayPage.tsx          # Integrate feedback, relocate hearts
src/pages/PlayPage.module.scss  # Layout adjustments
src/pages/PlayPage.test.tsx     # Add feedback tests
src/styles/_animations.scss     # Add new keyframes
```

---

## Development Workflow (TDD)

### Step 1: Create Type Definitions

```bash
# Create src/types/feedback.ts with all interfaces
# See data-model.md for complete type definitions
```

### Step 2: Write Hook Tests First (TDD)

```bash
# Create src/hooks/useAnswerFeedback.test.ts
# Tests should FAIL initially (Red phase)
npm run test -- useAnswerFeedback
```

### Step 3: Implement Hook

```bash
# Create src/hooks/useAnswerFeedback.ts
# Tests should PASS (Green phase)
npm run test -- useAnswerFeedback
```

### Step 4: Write Component Tests First (TDD)

```bash
# Create src/components/AnswerFeedback.test.tsx
# Tests should FAIL initially
npm run test -- AnswerFeedback
```

### Step 5: Implement Component

```bash
# Create src/components/AnswerFeedback.tsx
# Create src/components/AnswerFeedback.module.scss
# Tests should PASS
npm run test -- AnswerFeedback
```

### Step 6: Add Sound Effects

```bash
# Create directory
mkdir -p public/audio/sfx

# Add sound files (source from OpenGameArt.org or create with BFXR)
# correct.mp3 - coin/power-up sound
# incorrect.mp3 - buzz/error sound
```

### Step 7: Integrate into PlayPage

```bash
# Modify src/pages/PlayPage.tsx
# - Import and use useAnswerFeedback hook
# - Add AnswerFeedback component to JSX
# - Relocate hearts display
npm run test -- PlayPage
```

### Step 8: E2E Tests

```bash
# Create tests/e2e/answer-feedback.spec.ts
npx playwright test tests/e2e/answer-feedback.spec.ts
```

### Step 9: Quality Gates

```bash
npm run type-check   # Zero TypeScript errors
npm run lint:fix     # Fix lint issues
npm run test:run     # All tests pass
npm run build        # Build succeeds
```

---

## Key Code Patterns

### Hook Usage in PlayPage

```typescript
import { useAnswerFeedback } from '../hooks/useAnswerFeedback'
import AnswerFeedback from '../components/AnswerFeedback'

export default function PlayPage() {
  const feedback = useAnswerFeedback()

  const handleCorrectAnswer = (question: string) => {
    feedback.playCorrect()  // ← Trigger feedback
    // ... existing logic
  }

  const handleBadAnswer = (question: string) => {
    feedback.playIncorrect()  // ← Trigger feedback
    // ... existing logic
  }

  return (
    <div className={styles.gameContainer}>
      {/* Feedback overlay - renders on top */}
      <AnswerFeedback
        type={feedback.feedbackType}
        isVisible={feedback.isPlaying}
      />

      {/* ... rest of game UI */}
    </div>
  )
}
```

### Animation CSS Pattern

```scss
// In _animations.scss
@keyframes correctFlash {
  0% { background-color: transparent; }
  50% { background-color: rgba($color-teal, 0.3); }
  100% { background-color: transparent; }
}

@keyframes incorrectFlash {
  0% { background-color: transparent; transform: translateX(0); }
  25% { background-color: rgba($color-red, 0.3); transform: translateX(-5px); }
  75% { background-color: rgba($color-red, 0.3); transform: translateX(5px); }
  100% { background-color: transparent; transform: translateX(0); }
}

// In AnswerFeedback.module.scss
.overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 100;

  &.correct {
    animation: correctFlash 0.5s ease-out;
  }

  &.incorrect {
    animation: incorrectFlash 0.5s ease-out;
  }
}
```

### Error Handling Pattern

```typescript
const playSound = async (path: string): Promise<void> => {
  try {
    const audio = new Audio(path)
    audio.volume = 0.2
    await audio.play()
  } catch (error) {
    console.warn('Failed to play sound effect:', error)
    // Don't throw - visual feedback continues
  }
}
```

---

## Testing Commands

```bash
# Unit tests (watch mode)
npm run test

# Specific file
npm run test -- useAnswerFeedback

# All tests once
npm run test:run

# Coverage report
npm run test:coverage

# E2E tests
npx playwright test

# Specific E2E test
npx playwright test tests/e2e/answer-feedback.spec.ts

# E2E with UI
npx playwright test --ui
```

---

## Common Issues & Solutions

### Audio Not Playing

**Issue**: Sound effects don't play on first interaction

**Solution**: Browser autoplay policies require user interaction first. Background music already handles this - ensure game is started before expecting sounds.

### Animation Not Visible

**Issue**: Flash animation too subtle

**Solution**: Increase opacity in animation keyframes (e.g., `rgba($color-teal, 0.5)` instead of `0.3`).

### Tests Failing for Audio

**Issue**: Audio constructor throws in test environment

**Solution**: Mock the Audio constructor in test setup:
```typescript
global.Audio = vi.fn().mockImplementation(() => ({
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  volume: 1,
}))
```

### Hearts Not Repositioning

**Issue**: Layout not updating after JSX reorder

**Solution**: Check flexbox order - hearts should render before ProgressBar in JSX. May need `order` CSS property if flex order doesn't work.

---

## Quality Checklist

Before marking feature complete:

- [ ] Type definitions complete (`src/types/feedback.ts`)
- [ ] Hook tests pass (`useAnswerFeedback.test.ts`)
- [ ] Hook implemented (`useAnswerFeedback.ts`)
- [ ] Component tests pass (`AnswerFeedback.test.tsx`)
- [ ] Component implemented (`AnswerFeedback.tsx`)
- [ ] Animations added (`_animations.scss`)
- [ ] Sound files added (`/public/audio/sfx/`)
- [ ] PlayPage integrated (hook + component + layout)
- [ ] E2E tests pass (`answer-feedback.spec.ts`)
- [ ] All quality gates pass:
  - [ ] `npm run type-check` ✅
  - [ ] `npm run lint:fix` ✅
  - [ ] `npm run test:run` ✅
  - [ ] `npm run build` ✅
- [ ] Manual testing complete (keyboard + mouse)
- [ ] Documentation updated (JSDoc on all exports)

---

## Resources

- **Spec**: [specs/015-answer-feedback/spec.md](./spec.md)
- **Plan**: [specs/015-answer-feedback/plan.md](./plan.md)
- **Data Model**: [specs/015-answer-feedback/data-model.md](./data-model.md)
- **Research**: [specs/015-answer-feedback/research.md](./research.md)
- **Constitution**: [.specify/memory/constitution.md](../../.specify/memory/constitution.md)
- **Project Guide**: [CLAUDE.md](../../CLAUDE.md)
