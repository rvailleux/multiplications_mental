# Implementation Plan: Answer Feedback System

**Branch**: `015-answer-feedback` | **Date**: 2026-01-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/015-answer-feedback/spec.md`

## Summary

Add immediate audio and visual feedback when players submit answers in the multiplication game. This includes:
- **Audio**: 8-bit sound effects (positive/negative) at 20% volume stored in `/public/audio/sfx/`
- **Visual**: Green flash for correct answers, red flash for incorrect answers (500ms animations)
- **Layout**: Relocate hearts (lives) display between the question and timer progress bar

## Technical Context

**Language/Version**: TypeScript 5.7.2 (strict mode) + React 19.0.0
**Primary Dependencies**: React, React Router DOM 7.5.0, Sass (CSS Modules), Vite 6.2+
**Storage**: localStorage (client-side persistence for scores)
**Testing**: Vitest 4.0.16 + React Testing Library + Happy-DOM
**E2E Testing**: Playwright (MANDATORY per Constitution Principle VIII)
**Target Platform**: Web browser (desktop-first, responsive)
**Project Type**: Single web application (frontend only)
**Performance Goals**: Audio/visual feedback within 100ms of answer submission; animations complete within 500ms
**Constraints**: 20% volume for SFX; graceful degradation if audio fails; visual feedback works independently
**Scale/Scope**: Single game page modification + new hook + new CSS animations

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Test-First Development | ✅ PASS | Tests written before implementation; TDD cycle enforced |
| II. TypeScript Type Safety | ✅ PASS | Strict mode; explicit return types; typed props interfaces |
| III. Component-Based Architecture | ✅ PASS | Functional components; custom hook for feedback; JSDoc documented |
| IV. Automated Quality Gates | ✅ PASS | All 4 commands required before commit |
| V. Documentation-Driven Development | ✅ PASS | JSDoc for all exports; update CLAUDE.md with new patterns |
| VI. Retro Gaming UX | ✅ PASS | 8-bit aesthetic for animations; existing keyboard navigation preserved |
| VII. Error Handling & Resilience | ✅ PASS | Graceful degradation for audio failures; try-catch for Audio API |
| VIII. E2E Testing with Playwright | ✅ PASS | E2E tests for all user stories; screenshot validation |

**Gate Status**: ✅ ALL GATES PASS - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/015-answer-feedback/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no API)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── AnswerFeedback.tsx           # NEW: Visual feedback overlay component
│   ├── AnswerFeedback.module.scss   # NEW: Feedback animations
│   ├── AnswerFeedback.test.tsx      # NEW: Component tests
│   └── MultiplicationQuestion.tsx   # MODIFY: Integrate feedback
├── pages/
│   ├── PlayPage.tsx                 # MODIFY: Relocate hearts, integrate audio
│   ├── PlayPage.module.scss         # MODIFY: Update layout order
│   └── PlayPage.test.tsx            # MODIFY: Add feedback tests
├── hooks/
│   ├── useAnswerFeedback.ts         # NEW: Audio + visual feedback hook
│   └── useAnswerFeedback.test.ts    # NEW: Hook tests
├── styles/
│   └── _animations.scss             # MODIFY: Add feedback keyframes
├── types/
│   └── feedback.ts                  # NEW: Feedback type definitions
└── test/
    └── setup.ts                     # Existing test config

public/
└── audio/
    └── sfx/                         # NEW: Sound effects directory
        ├── correct.mp3              # NEW: Positive feedback sound
        └── incorrect.mp3            # NEW: Negative feedback sound

tests/
└── e2e/
    └── answer-feedback.spec.ts      # NEW: E2E tests for feature
```

**Structure Decision**: Single web application structure. New files follow existing patterns:
- Hook follows `useBackgroundMusic.ts` pattern
- Component follows `MultiplicationQuestion.tsx` pattern
- Tests follow existing `*.test.tsx` patterns
- E2E follows `keyboard-navigation-pause-menu.spec.ts` pattern

## Complexity Tracking

> No violations identified. Feature follows existing patterns.

| Aspect | Approach | Justification |
|--------|----------|---------------|
| Audio handling | New `useAnswerFeedback` hook | Follows existing `useBackgroundMusic` pattern; separation of concerns |
| Visual feedback | New `AnswerFeedback` component | Single responsibility; reusable; testable in isolation |
| Layout change | CSS Module update | Minimal change; existing flex layout supports reordering |

---

## Phase 0: Research Summary

### Research Task 1: Web Audio API Best Practices for Sound Effects

**Decision**: Use native HTML5 `Audio` API (not Web Audio API)

**Rationale**:
- Project already uses `Audio` API in `useBackgroundMusic.ts` - consistency maintained
- `Audio` API is simpler for fire-and-forget sound effects
- Creating new `Audio` instances per play handles rapid succession without overlap issues
- No need for complex audio graph manipulation

**Alternatives Considered**:
- Web Audio API: More powerful but overkill for simple sound effects; adds complexity
- Howler.js: External dependency; project prefers minimal dependencies

### Research Task 2: CSS Animation Patterns for Feedback

**Decision**: Use CSS keyframe animations with existing Sass architecture

**Rationale**:
- Project has established animation patterns in `_animations.scss` (27 existing keyframes)
- Existing `scorePopup` animation provides reference implementation
- CSS animations are hardware-accelerated and performant
- 500ms duration fits existing animation timing patterns

**Implementation Pattern**:
```scss
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
```

### Research Task 3: Sound Effect File Format & Sources

**Decision**: MP3 format at 20% (0.2) volume

**Rationale**:
- MP3 has universal browser support
- Small file size (typically <50KB for short SFX)
- 20% volume specified in requirements; aligns with background music at 30%

**Source Strategy**:
- Use royalty-free 8-bit sound effects
- Recommended sources: OpenGameArt.org, Freesound.org (CC0 license)
- Typical sounds: "coin collect" for correct, "buzz/error" for incorrect

### Research Task 4: Layout Reordering Strategy

**Decision**: Modify JSX render order in `PlayPage.tsx`

**Rationale**:
- Current layout uses flexbox with `flex-direction: column`
- Simply moving the `livesDisplay` JSX block achieves the goal
- No CSS restructuring needed beyond potential spacing adjustments

**Current Order** (PlayPage.tsx lines 219-298):
1. Header (title, stats)
2. ProgressBar
3. MultiplicationQuestion
4. Button Group
5. Lives Display ← Move this UP
6. Character Sprite

**New Order**:
1. Header (title, stats)
2. ProgressBar
3. **Lives Display** ← NEW POSITION
4. MultiplicationQuestion
5. Button Group
6. Character Sprite

### Research Task 5: Existing Feedback Integration Points

**Decision**: Extend `handleCorrectAnswer` and `handleBadAnswer` in `PlayPage.tsx`

**Rationale**:
- These handlers already exist (lines 147-171)
- Currently trigger `scorePopup` state for visual feedback
- Adding audio trigger is a single function call addition
- Hook will manage audio/visual state internally

**Integration Points**:
```typescript
// In PlayPage.tsx
const feedback = useAnswerFeedback()

const handleCorrectAnswer = (question: string) => {
  feedback.playCorrect() // NEW
  // ... existing logic
}

const handleBadAnswer = (question: string) => {
  feedback.playIncorrect() // NEW
  // ... existing logic
}
```

---

## Phase 1: Design & Contracts

### Data Model

See [data-model.md](./data-model.md) for complete entity definitions.

**Key Entities**:

1. **FeedbackType** (enum): `'correct' | 'incorrect'`

2. **FeedbackState** (interface):
   ```typescript
   interface FeedbackState {
     isPlaying: boolean
     currentType: FeedbackType | null
   }
   ```

3. **UseAnswerFeedbackReturn** (interface):
   ```typescript
   interface UseAnswerFeedbackReturn {
     playCorrect: () => void
     playIncorrect: () => void
     isPlaying: boolean
     feedbackType: FeedbackType | null
   }
   ```

4. **AnswerFeedbackProps** (interface):
   ```typescript
   interface AnswerFeedbackProps {
     type: FeedbackType | null
     isVisible: boolean
     onAnimationEnd?: () => void
   }
   ```

### Contracts

No external API contracts required - this is a frontend-only feature.

**Internal Contract**: Hook ↔ Component communication via props/state.

### Quickstart

See [quickstart.md](./quickstart.md) for development setup instructions.

---

## Implementation Phases (for /speckit.tasks)

### Phase A: Foundation (P1 - Audio Feedback)

1. Create type definitions (`src/types/feedback.ts`)
2. Create `useAnswerFeedback` hook with audio playback
3. Write hook tests (TDD - tests first)
4. Add sound effect files to `/public/audio/sfx/`
5. Integrate hook into `PlayPage.tsx`

### Phase B: Visual Feedback (P1)

1. Create `AnswerFeedback` component
2. Add CSS animations to `_animations.scss`
3. Write component tests (TDD)
4. Create component CSS module
5. Integrate component into `PlayPage.tsx`

### Phase C: Layout Update (P2)

1. Relocate hearts display in `PlayPage.tsx` JSX
2. Adjust CSS spacing if needed
3. Update layout tests
4. Verify responsive behavior

### Phase D: E2E Testing & Polish

1. Create Playwright E2E tests (`tests/e2e/answer-feedback.spec.ts`)
2. Add screenshot checkpoints
3. Test keyboard + mouse interactions
4. Run full quality gate checks
5. Update documentation (CLAUDE.md if new patterns)

---

## Constitution Re-Check (Post Phase 1 Design)

| Principle | Status | Verification |
|-----------|--------|--------------|
| I. Test-First Development | ✅ PASS | Hook tests, component tests, E2E tests all planned before implementation |
| II. TypeScript Type Safety | ✅ PASS | All interfaces defined in `feedback.ts`; strict types throughout |
| III. Component-Based Architecture | ✅ PASS | `useAnswerFeedback` hook + `AnswerFeedback` component; single responsibility |
| IV. Automated Quality Gates | ✅ PASS | Quality gates integrated into Phase D |
| V. Documentation-Driven Development | ✅ PASS | JSDoc required for all exports; quickstart.md created |
| VI. Retro Gaming UX | ✅ PASS | 8-bit sound effects; pixel-style animations |
| VII. Error Handling & Resilience | ✅ PASS | Try-catch for Audio API; visual works independently |
| VIII. E2E Testing with Playwright | ✅ PASS | E2E tests in Phase D; screenshot validation planned |

**Final Gate Status**: ✅ ALL GATES PASS - Ready for task generation
