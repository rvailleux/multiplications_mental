# Data Model: Game Results Screen

**Date**: 2026-01-16
**Feature**: Game Results Screen
**Purpose**: Define all data structures, types, and interfaces for the results screen

## Type Definitions

### GameResult (Existing)

```typescript
/**
 * Game result structure for tracking user answers
 * @public
 */
export type GameResult = {
  /** The multiplication question (e.g., "3 x 7") */
  question: string
  /** Whether the user answered correctly */
  correct: boolean
}
```

**Location**: `src/pages/PlayPage.tsx` (lines 14-19)
**Status**: Already exists, reused by GameResultsPage
**Usage**: Array of GameResult objects passed via route state

---

### GameResultsState (New)

```typescript
/**
 * Route state interface for GameResultsPage
 * Data passed from PlayPage when timer expires
 * @public
 */
export interface GameResultsState {
  /** Final score achieved during the game session */
  score: number
  /** Array of all questions and their results */
  results: GameResult[]
}
```

**Location**: `src/pages/GameResultsPage.tsx` (new file)
**Purpose**: Type-safe access to React Router location state
**Usage**:
```typescript
// PlayPage sends:
navigate('/results', {
  state: { score, results } as GameResultsState
})

// GameResultsPage receives:
const { score, results } = location.state as GameResultsState
```

---

### GameResultsPageProps (New)

```typescript
/**
 * Props for GameResultsPage component
 * Component receives all data from route state, not props
 * @public
 */
export interface GameResultsPageProps {
  // Intentionally empty - data comes from useLocation() hook
}
```

**Location**: `src/pages/GameResultsPage.tsx` (new file)
**Purpose**: Type definition for component props (empty but required for docs)
**Usage**: `export default function GameResultsPage({}: GameResultsPageProps)`

---

## Derived Data

### Stats Calculation (Computed in Component)

**Purpose**: Calculate display statistics from raw game data

#### Correct Count
```typescript
const correctCount: number = results.filter(r => r.correct).length
```
- **Type**: number
- **Range**: 0 to results.length
- **Description**: Count of questions answered correctly

#### Total Questions
```typescript
const totalQuestions: number = results.length
```
- **Type**: number
- **Range**: 0 to ∞ (practically 10-20 for 60-second game)
- **Description**: Total number of questions attempted

#### Accuracy Percentage
```typescript
const accuracy: number = totalQuestions > 0
  ? Math.round((correctCount / totalQuestions) * 100)
  : 0
```
- **Type**: number
- **Range**: 0 to 100 (integer percentage)
- **Description**: Percentage of correct answers, rounded to nearest integer
- **Edge case**: Returns 0 if totalQuestions === 0 (division by zero protection)

---

## State Management

### Component State

#### Animation State
```typescript
const [isBlinking, setIsBlinking] = useState<boolean>(true)
```
- **Initial value**: `true`
- **Purpose**: Controls whether gold fading blink animation is active
- **Lifecycle**:
  1. Starts as `true` (animation active)
  2. After 5000ms, becomes `false` (animation stops)
  3. Cleanup: Timer cleared on unmount

---

## Data Flow Diagram

```text
┌─────────────────────────────────────────────────────┐
│ PlayPage (Timer expires, score > 0)                │
│ --------------------------------------------------- │
│ State:                                              │
│   score: number  (calculated with combo system)    │
│   results: GameResult[]  (all question outcomes)   │
└────────────────────┬────────────────────────────────┘
                     │
                     │ navigate('/results', { state: { score, results } })
                     ▼
┌─────────────────────────────────────────────────────┐
│ React Router (location.state)                      │
│ --------------------------------------------------- │
│ Stores:                                             │
│   score: number                                     │
│   results: GameResult[]                             │
└────────────────────┬────────────────────────────────┘
                     │
                     │ useLocation().state
                     ▼
┌─────────────────────────────────────────────────────┐
│ GameResultsPage (Receives and Processes)           │
│ --------------------------------------------------- │
│ Inputs (from location.state):                      │
│   score: number                                     │
│   results: GameResult[]                             │
│                                                      │
│ Derived (calculated on render):                    │
│   correctCount = results.filter(r => r.correct).length │
│   totalQuestions = results.length                  │
│   accuracy = Math.round((correctCount/totalQuestions)*100) │
│                                                      │
│ Local State:                                        │
│   isBlinking: boolean  (animation control)         │
└────────────────────┬────────────────────────────────┘
                     │
                     │ User presses ENTER
                     ▼
┌─────────────────────────────────────────────────────┐
│ HomePage (Navigation destination)                  │
└─────────────────────────────────────────────────────┘
```

---

## Data Validation

### Route State Validation

**Problem**: User could navigate directly to /results without state

**Solution**: Type guard with fallback values
```typescript
interface LocationState {
  score?: number
  results?: GameResult[]
}

const location = useLocation()
const state = location.state as LocationState

const score = state?.score ?? 0
const results = state?.results ?? []
```

**Behavior**:
- If `state` is undefined → score = 0, results = []
- If `score` is missing → score = 0
- If `results` is missing → results = []
- Gracefully handles missing data without crashes

---

## Edge Cases and Boundaries

### Zero Questions (totalQuestions === 0)
- **Cause**: Timer expires before any question is displayed (unlikely but possible)
- **Behavior**: accuracy = 0, displays "0/0 correct, 0%"
- **UI**: Shows encouraging message or redirects to homepage

### Perfect Score (100% accuracy)
- **Cause**: All questions answered correctly
- **Behavior**: accuracy = 100, displays with gold styling and celebration
- **UI**: Visual emphasis on perfect score

### Zero Score (score === 0)
- **Cause**: All questions answered incorrectly or timer expires very quickly
- **Behavior**: Route to /results is SKIPPED by PlayPage
- **Navigation**: PlayPage navigates directly to `/home` instead
- **Rationale**: Follows existing pattern (score === 0 not saved to localStorage)

### Large Numbers
- **Score**: Can be hundreds or thousands with combo multipliers
- **Format**: Display with commas (e.g., "1,234 pts") for readability
- **Accuracy**: Always 0-100 (percentage), no special handling needed

---

## Type Safety Guarantees

### Compiler Checks
- ✅ `score` is typed as `number` (TypeScript enforced)
- ✅ `results` is typed as `GameResult[]` (TypeScript enforced)
- ✅ `accuracy` calculation returns `number` (inferred from Math.round)
- ✅ `isBlinking` is typed as `boolean` (useState generic)

### Runtime Checks
- ✅ Division by zero protection in accuracy calculation
- ✅ Null coalescing operator (??) for missing route state
- ✅ Array.filter and Array.length are safe operations (no undefined)

---

## Database/Storage Considerations

**Note**: GameResultsPage does NOT interact with localStorage

### Why No localStorage Access?
1. **Already saved**: PlayPage saves `{score, results}` to localStorage before navigation
2. **Session data**: Route state is sufficient for one-time display
3. **Separation of concerns**: GameResultsPage is a read-only display component
4. **No persistence needed**: Results screen is ephemeral (gone after ENTER press)

### localStorage Structure (Reference Only)
```typescript
// localStorage.getItem('scores')
type ScoreEntry = {
  score: number
  results: GameResult[]
}

const scores: ScoreEntry[] = [
  { score: 800, results: [{ question: '3 x 7', correct: true }, ...] },
  { score: 500, results: [{ question: '5 x 8', correct: false }, ...] },
  // ... up to 100 entries
]
```

**Accessed by**: HomePage (for leaderboard display)
**Not accessed by**: GameResultsPage (receives data via route state)

---

## Interface Contracts

### Input Contract (from PlayPage)
```typescript
// PlayPage MUST provide:
navigate('/results', {
  state: {
    score: number,      // Must be > 0 (or navigation skips to /home)
    results: GameResult[]  // Can be empty array (edge case)
  }
})
```

### Output Contract (to HomePage)
```typescript
// GameResultsPage MUST navigate:
navigate('/home')  // On ENTER key press or button click
// No data passed (HomePage reads from localStorage)
```

---

## Summary

**Data Model Complexity**: LOW
- Only 3 type definitions needed (1 existing, 2 new)
- Simple derived calculations (filter, length, arithmetic)
- No database queries or complex state management

**Type Safety**: HIGH
- All inputs and outputs typed
- TypeScript strict mode enforced
- Runtime validation for edge cases

**Reusability**: HIGH
- GameResult type already exists and well-defined
- Standard React Router patterns (useLocation, navigate)
- No custom abstractions or complex interfaces

**Ready for implementation**: ✅
