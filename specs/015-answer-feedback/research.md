# Research: Answer Feedback System

**Feature Branch**: `015-answer-feedback`
**Date**: 2026-01-25

## Research Tasks Completed

### 1. Web Audio API vs HTML5 Audio for Sound Effects

**Decision**: Use native HTML5 `Audio` API

**Rationale**:
- Project already uses `Audio` API in `useBackgroundMusic.ts` (line 23-30) - consistency maintained
- `Audio` API is simpler for fire-and-forget sound effects
- Creating new `Audio` instances per play handles rapid succession without overlap issues
- No need for complex audio graph manipulation for short SFX

**Alternatives Considered**:
| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| HTML5 Audio API | Simple, consistent with codebase, sufficient for SFX | Less control over audio graph | ✅ Selected |
| Web Audio API | Precise timing, audio effects, mixing | Overkill complexity for short SFX | ❌ Rejected |
| Howler.js | Feature-rich, cross-browser | External dependency; project minimizes deps | ❌ Rejected |

**Implementation Pattern** (from existing `useBackgroundMusic.ts`):
```typescript
const audio = new Audio('/audio/sfx/correct.mp3')
audio.volume = 0.2  // 20% as specified
audio.play().catch(error => {
  console.warn('Failed to play sound effect:', error)
})
```

---

### 2. CSS Animation Patterns for Visual Feedback

**Decision**: Use CSS keyframe animations with existing Sass architecture

**Rationale**:
- Project has 27 existing keyframes in `_animations.scss`
- Existing `scorePopup` animation (lines 52-74 in `MultiplicationQuestion.module.scss`) provides reference
- CSS animations are hardware-accelerated and performant
- 500ms duration fits existing animation timing patterns (800ms for scorePopup)

**Existing Animation Reference**:
```scss
// From _animations.scss
@keyframes scorePopup {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
  100% { opacity: 0; transform: translate(-50%, -100%) scale(1); }
}
```

**New Animations to Create**:
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

---

### 3. Sound Effect File Format & Sourcing

**Decision**: MP3 format, royalty-free 8-bit style sounds

**Rationale**:
- MP3 has universal browser support (all modern browsers)
- Small file size (typically 10-50KB for short SFX)
- 8-bit style matches retro gaming aesthetic (Constitution Principle VI)

**Volume Configuration**:
- SFX: 20% (0.2) as specified in requirements
- Background music: 30% (0.3) for reference
- SFX slightly quieter to not overpower music

**Recommended Sources** (CC0 / Public Domain):
| Source | License | Notes |
|--------|---------|-------|
| OpenGameArt.org | CC0/CC-BY | Large collection of 8-bit sounds |
| Freesound.org | CC0 | Filter by "8-bit" or "chiptune" |
| BFXR | Generated | Free tool to create 8-bit sounds |

**Sound Characteristics**:
- **Correct**: Short "coin collect" or "power-up" sound (~200-500ms)
- **Incorrect**: Short "buzz" or "error" sound (~200-500ms)

---

### 4. PlayPage Layout Structure Analysis

**Decision**: Modify JSX render order (minimal CSS changes)

**Current Layout** (PlayPage.tsx lines 219-298):
```
┌─────────────────────────────────────┐
│  PlayerNameDisplay (top-right)       │
│  ═══════════════════════════════════│
│  ⭐ MATH QUEST ⭐                    │
│  Timer: 60s    Score: 0              │
│  ═══════════════════════════════════│
│  [████████████] ← ProgressBar        │
│  ═══════════════════════════════════│
│  7 x 8 ?       ← Question            │
│  [___] ← Input                       │
│  ═══════════════════════════════════│
│  [✓ Valider]  [↻ Restart]            │
│  ═══════════════════════════════════│
│  ❤️❤️❤️        ← Lives (MOVE UP)     │
│  ═══════════════════════════════════│
│  🍄 (character sprite, bottom-right) │
└─────────────────────────────────────┘
```

**New Layout** (after repositioning):
```
┌─────────────────────────────────────┐
│  PlayerNameDisplay (top-right)       │
│  ═══════════════════════════════════│
│  ⭐ MATH QUEST ⭐                    │
│  Timer: 60s    Score: 0              │
│  ═══════════════════════════════════│
│  ❤️❤️❤️        ← Lives (NEW POSITION)│
│  ═══════════════════════════════════│
│  [████████████] ← ProgressBar        │
│  ═══════════════════════════════════│
│  7 x 8 ?       ← Question            │
│  [___] ← Input                       │
│  ═══════════════════════════════════│
│  [✓ Valider]  [↻ Restart]            │
│  ═══════════════════════════════════│
│  🍄 (character sprite, bottom-right) │
└─────────────────────────────────────┘
```

**Implementation**: Move `livesDisplay` div (lines 274-280) to before `ProgressBar` (line 248).

---

### 5. Existing Code Integration Points

**Decision**: Extend existing handlers in `PlayPage.tsx`

**Handler Locations**:
- `handleCorrectAnswer`: Lines 147-161
- `handleBadAnswer`: Lines 163-171

**Current Implementation**:
```typescript
const handleCorrectAnswer = (question: string) => {
  const newCombo = combo + 1
  const points = 100 * newCombo
  setScore(prev => prev + points)
  setCombo(newCombo)
  setScorePopup(`+${points}`)
  setShowPopup(true)
  setTimeout(() => setShowPopup(false), 800)
  setResults(prev => [...prev, { question, correct: true }])
}

const handleBadAnswer = (question: string) => {
  setCombo(0)
  setLives(prev => Math.max(0, prev - 1))
  setScorePopup('✗')
  setShowPopup(true)
  setTimeout(() => setShowPopup(false), 800)
  setResults(prev => [...prev, { question, correct: false }])
}
```

**Integration Plan**:
```typescript
// Add to PlayPage.tsx
const feedback = useAnswerFeedback()

const handleCorrectAnswer = (question: string) => {
  feedback.playCorrect()  // NEW: Trigger audio + visual
  // ... existing logic unchanged
}

const handleBadAnswer = (question: string) => {
  feedback.playIncorrect()  // NEW: Trigger audio + visual
  // ... existing logic unchanged
}

// In JSX, add feedback overlay:
<AnswerFeedback
  type={feedback.feedbackType}
  isVisible={feedback.isPlaying}
/>
```

---

### 6. Error Handling Requirements

**Decision**: Graceful degradation with try-catch and console warnings

**Rationale**:
- Constitution Principle VII mandates error handling
- Audio playback can fail (autoplay restrictions, missing files, user permissions)
- Visual feedback must work independently of audio

**Error Handling Pattern**:
```typescript
const playSound = async (soundPath: string): Promise<void> => {
  try {
    const audio = new Audio(soundPath)
    audio.volume = 0.2
    await audio.play()
  } catch (error) {
    console.warn('Failed to play sound effect:', error)
    // Visual feedback continues - don't throw
  }
}
```

**Test Coverage Required**:
- Audio file load failure
- Audio play() rejection (autoplay blocked)
- Rapid successive plays
- Component rendering with audio disabled

---

### 7. Testing Strategy

**Decision**: TDD with unit tests → component tests → E2E tests

**Test Files to Create**:
| File | Purpose | Priority |
|------|---------|----------|
| `useAnswerFeedback.test.ts` | Hook behavior tests | P1 |
| `AnswerFeedback.test.tsx` | Component render tests | P1 |
| `PlayPage.test.tsx` (update) | Integration tests | P1 |
| `answer-feedback.spec.ts` | Playwright E2E tests | P1 |

**E2E Test Approach** (Audio Verification):
- Cannot directly verify audio playback in Playwright
- Use audio event spy or mock Audio constructor
- Verify visual feedback triggers
- Screenshot comparison for animation states

**Example E2E Pattern** (from existing tests):
```typescript
test('E2E-US1-001: Correct answer triggers feedback', async ({ page }) => {
  await page.goto('/')
  // Navigate to game...

  // Submit correct answer
  await page.fill('input[type="number"]', '42')
  await page.keyboard.press('Enter')

  // Verify visual feedback appears
  await expect(page.locator('.feedbackOverlay.correct')).toBeVisible()
  await page.screenshot({ path: 'test-results/feedback/correct-answer.png' })
})
```

---

## Summary: All Research Tasks Resolved

| Task | Status | Decision |
|------|--------|----------|
| Audio API choice | ✅ Resolved | HTML5 Audio API |
| Animation patterns | ✅ Resolved | CSS keyframes in Sass |
| Sound file format | ✅ Resolved | MP3, 20% volume |
| Layout reordering | ✅ Resolved | JSX order change |
| Integration points | ✅ Resolved | Extend existing handlers |
| Error handling | ✅ Resolved | Try-catch with warnings |
| Testing strategy | ✅ Resolved | TDD: unit → component → E2E |

**No NEEDS CLARIFICATION items remain.**
