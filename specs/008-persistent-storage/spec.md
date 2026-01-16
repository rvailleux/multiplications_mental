# Feature Specification: Persistent Player and Score Data

**Feature Branch**: `008-persistent-storage`
**Created**: 2026-01-13
**Status**: Draft
**Input**: User description: "Implement a persistent data storage system using browser localStorage to save player information and game scores. Store the list of available players (with unique IDs and display names), the currently selected player ID, and an array of all game scores (each containing the score value and detailed results of each question attempt). Data should persist across browser sessions so players can see their historical performance when they return to the game."

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Player Data Persistence Across Sessions (Priority: P1)

When players close their browser and return to the game later, they should find their player profiles (Jules, Achille) still available without requiring reconfiguration. The system automatically initializes default players on first load and preserves player data across all future sessions.

**Why this priority**: This is the foundational requirement that enables all other persistence features. Without persistent player data, users cannot have continuity between sessions, making the game feel ephemeral and frustrating.

**Independent Test**: Can be fully tested by opening the game, verifying default players exist (Jules, Achille), closing the browser, reopening, and confirming the same players are still available. Delivers immediate value by providing a consistent starting state.

**Acceptance Scenarios**:

1. **Given** a first-time user opens the game, **When** the PlayerSelectPage loads, **Then** localStorage['players'] contains default players [{ id: 'jules', name: 'Jules' }, { id: 'achille', name: 'Achille' }]
2. **Given** players exist in localStorage, **When** the user reopens the game after closing the browser, **Then** the same player list is displayed without re-initialization
3. **Given** localStorage is empty, **When** initializePlayers() is called, **Then** default players are created and persisted
4. **Given** corrupted player data in localStorage, **When** getPlayers() attempts to parse, **Then** it falls back to default players without crashing

---

### User Story 2 - Current Player Selection Persistence (Priority: P1)

When a player selects their profile (e.g., Jules), starts a game, then closes the browser mid-session, upon returning they should not need to reselect their player. The system remembers who was playing last and maintains this selection across sessions.

**Why this priority**: This is equally critical as P1 because it provides continuity of identity across sessions. Users expect the game to "remember" them, and requiring re-selection every session creates friction and poor UX.

**Independent Test**: Can be fully tested by selecting a player (Jules), navigating to HomePage, closing the browser, reopening to PlayerSelectPage, and verifying Jules is still highlighted as the current player. Delivers value by eliminating repetitive selection steps.

**Acceptance Scenarios**:

1. **Given** a user selects player "Jules" on PlayerSelectPage, **When** selectPlayer(0) is called, **Then** localStorage['currentPlayer'] is set to 'jules'
2. **Given** currentPlayer is 'jules' in localStorage, **When** HomePage loads, **Then** it displays "Bienvenue Jules !" using getCurrentPlayer()
3. **Given** no player has been selected, **When** HomePage or PlayPage loads, **Then** user is redirected to PlayerSelectPage
4. **Given** a player was selected in a previous session, **When** the user returns and opens PlayerSelectPage, **Then** selectedIndex defaults to the current player's position in the list

---

### User Story 3 - Game Score Persistence and History (Priority: P2)

After completing a 60-second game session with a score of 1500 points and 15 questions answered, when the player returns to the HomePage, they should see this score in the leaderboard along with all previous scores from past sessions, sorted by highest score first.

**Why this priority**: While important for engagement and progression tracking, this is secondary to player identity persistence. Users can still play the game without score history, but it significantly enhances retention and motivation.

**Independent Test**: Can be fully tested by completing one game (60s timer expires), verifying the score appears in HomePage leaderboard, closing browser, reopening, and confirming the score is still visible. Delivers value by providing historical performance tracking.

**Acceptance Scenarios**:

1. **Given** a game ends with score = 1500 and results = [{ question: "3 x 7", correct: true }, ...], **When** secondsLeft === 0 in PlayPage, **Then** localStorage['scores'] contains a new ScoreEntry { score: 1500, results: [...] }
2. **Given** multiple ScoreEntry objects in localStorage['scores'], **When** HomePage loads, **Then** scores are displayed sorted by score value (descending)
3. **Given** a game ends with score = 0, **When** the timer expires, **Then** no entry is added to localStorage['scores'] to avoid cluttering leaderboard with empty games
4. **Given** localStorage['scores'] contains 10 scores, **When** HomePage displays the leaderboard, **Then** by default only top 5 are shown with a "Show All" toggle option

---

### User Story 4 - Detailed Game Results Storage (Priority: P3)

When a player completes a game answering 20 questions (15 correct, 5 incorrect), the system should store each individual question attempt ("3 x 7", correct: true) so that future features can analyze performance patterns, identify weak multiplication tables, and show per-question review screens.

**Why this priority**: This provides the data foundation for advanced analytics features but is not immediately visible to users. The game remains fully functional without this granular detail, making it lower priority than core persistence.

**Independent Test**: Can be fully tested by completing a game, inspecting localStorage['scores'][latest].results array, and verifying each question attempt is recorded with question string and correct boolean. Delivers value by enabling future performance analysis features.

**Acceptance Scenarios**:

1. **Given** a user answers "3 x 7 = 21" correctly, **When** handleCorrectAnswer("3 x 7") is called, **Then** results array contains { question: "3 x 7", correct: true }
2. **Given** a user answers "5 x 8 = 30" incorrectly, **When** handleBadAnswer("5 x 8") is called, **Then** results array contains { question: "5 x 8", correct: false }
3. **Given** a game session with 20 question attempts, **When** the game ends, **Then** the ScoreEntry.results array has exactly 20 GameResult objects
4. **Given** ScoreEntry.results contains mixed correct/incorrect answers, **When** future analytics features read this data, **Then** they can calculate accuracy percentage, identify weak areas, and show question-by-question review

---

### Edge Cases

- **What happens when localStorage is full (quota exceeded)?** - getPlayers(), getCurrentPlayer(), and score saving should gracefully handle QuotaExceededError by logging the error and continuing with in-memory fallback data
- **How does the system handle corrupted JSON in localStorage?** - All JSON.parse() calls are wrapped in try/catch blocks that fall back to default values (default players, null for currentPlayer, empty array for scores)
- **What if a user clears localStorage while the game is running?** - The running game session continues with in-memory state, but on navigation/reload, the system re-initializes with defaults (data loss is acceptable since user explicitly cleared storage)
- **How does the system handle concurrent tab sessions modifying the same localStorage keys?** - This is a known limitation of localStorage (no cross-tab synchronization); last write wins. Future enhancement could use storage event listeners to sync tabs
- **What happens when score array grows to hundreds of entries (performance)?** - localStorage has typical 5-10MB limits; with ~100 bytes per ScoreEntry, this allows ~50,000-100,000 scores before issues. Future enhancement could implement data pruning (keep top 100 scores) or migration to IndexedDB
- **What if getCurrentPlayerId() returns an ID that no longer exists in players array?** - getCurrentPlayer() returns null in this case, triggering redirect to PlayerSelectPage for re-selection

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST persist an array of Player objects to localStorage['players'] with structure [{ id: string, name: string }, ...]
- **FR-002**: System MUST initialize default players [{ id: 'jules', name: 'Jules' }, { id: 'achille', name: 'Achille' }] on first load if localStorage['players'] does not exist
- **FR-003**: System MUST persist the currently selected player ID to localStorage['currentPlayer'] as a string value
- **FR-004**: System MUST provide a getCurrentPlayer() utility that retrieves the full Player object by matching localStorage['currentPlayer'] against the players array
- **FR-005**: System MUST persist an array of ScoreEntry objects to localStorage['scores'] with structure [{ score: number, results: GameResult[] }, ...]
- **FR-006**: System MUST append a new ScoreEntry to localStorage['scores'] when a game session ends (secondsLeft === 0) ONLY if score > 0
- **FR-007**: Each ScoreEntry.results MUST be an array of GameResult objects with structure { question: string, correct: boolean }
- **FR-008**: System MUST handle localStorage errors (parse failures, quota exceeded) by falling back to default values without crashing
- **FR-009**: All localStorage read operations MUST be wrapped in try/catch blocks with appropriate fallback values
- **FR-010**: System MUST redirect users to PlayerSelectPage if getCurrentPlayer() returns null (no player selected)
- **FR-011**: PlayerSelectPage MUST call initializePlayers() on mount to ensure default players exist
- **FR-012**: PlayPage MUST save score data to localStorage before navigating to HomePage when timer expires

### Key Entities

- **Player**: Represents a game player profile with unique identifier and display name
  - Attributes: id (string, unique, e.g., "jules"), name (string, display name, e.g., "Jules")
  - Storage: localStorage['players'] as JSON array
  - Relationships: One player can be "current" (referenced by localStorage['currentPlayer'])

- **ScoreEntry**: Represents a completed game session with final score and detailed question history
  - Attributes: score (number, final points), results (array of GameResult objects)
  - Storage: localStorage['scores'] as JSON array
  - Relationships: Future enhancement will link ScoreEntry to Player via playerId field for per-player leaderboards

- **GameResult**: Represents a single question attempt within a game session
  - Attributes: question (string, e.g., "3 x 7"), correct (boolean, true if answered correctly)
  - Storage: Nested within ScoreEntry.results array
  - Relationships: Many GameResult objects belong to one ScoreEntry

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can close and reopen the browser, and default players (Jules, Achille) remain available without requiring re-initialization (verifiable by checking localStorage['players'] persistence)
- **SC-002**: When a player selects their profile and closes the browser mid-session, upon reopening, the same player is automatically selected (verifiable by getCurrentPlayer() returning the same player)
- **SC-003**: After completing 5 games across 2 different browser sessions (close and reopen between games), all 5 scores are visible in the HomePage leaderboard (verifiable by localStorage['scores'].length === 5)
- **SC-004**: ScoreEntry data includes granular question-by-question results, enabling future analytics features to calculate accuracy percentage and identify weak multiplication tables (verifiable by inspecting results array structure)
- **SC-005**: System handles localStorage errors gracefully without crashing, falling back to default players and empty scores array (verifiable by manually corrupting localStorage and observing console errors + functional fallback)
- **SC-006**: Zero data loss between sessions for valid localStorage data (verifiable by completing a game, closing browser, reopening, and confirming score persists)
- **SC-007**: Empty games (score = 0) do not clutter the leaderboard, as they are filtered out before saving to localStorage (verifiable by ending a game without answering questions and checking localStorage['scores'] does not increase)

## Technical Implementation Notes

### Existing Code Analysis

The feature is **already fully implemented** in the codebase with the following components:

**1. Player Type and Utilities (`src/types/player.ts`)**:
- `Player` interface: `{ id: string, name: string }`
- `getPlayers()`: Retrieves players from localStorage['players'] with fallback to defaults
- `getCurrentPlayerId()`: Gets localStorage['currentPlayer']
- `setCurrentPlayerId(id)`: Sets localStorage['currentPlayer']
- `getCurrentPlayer()`: Gets full Player object by matching ID
- `initializePlayers()`: Initializes default players if not present

**2. Player Management Hook (`src/hooks/usePlayerManagement.ts`)**:
- Provides `players`, `currentPlayer`, `selectedIndex`, `selectPlayer()`, `hasPlayerSelected`
- Calls `initializePlayers()` on mount
- Manages player selection state with localStorage persistence

**3. Score Persistence (`src/pages/PlayPage.tsx`)**:
- Lines 94-105: useEffect that saves score to localStorage when `secondsLeft === 0`
- Filters out empty games (score > 0 check)
- Stores ScoreEntry with structure `{ score, results }`
- GameResult type defined as `{ question: string, correct: boolean }`

**4. Navigation Guards**:
- HomePage and PlayPage redirect to PlayerSelectPage if `!getCurrentPlayer()`
- PlayerSelectPage initializes players on mount

### localStorage Schema (Already Implemented)

```typescript
// localStorage['players']
[
  { "id": "jules", "name": "Jules" },
  { "id": "achille", "name": "Achille" }
]

// localStorage['currentPlayer']
"jules"

// localStorage['scores']
[
  {
    "score": 1500,
    "results": [
      { "question": "3 x 7", "correct": true },
      { "question": "5 x 8", "correct": false },
      // ... more results
    ]
  },
  // ... more scores
]
```

### Error Handling (Already Implemented)

```typescript
// getPlayers() - lines 16-24 of player.ts
try {
  const playersData = localStorage.getItem('players')
  return playersData ? JSON.parse(playersData) : getDefaultPlayers()
} catch (error) {
  console.error('Error loading players:', error)
  return getDefaultPlayers()
}

// PlayPage score saving - lines 98-99
const previousScores = JSON.parse(localStorage.getItem('scores') || '[]')
// Fallback to empty array if parse fails
```

### Future Enhancements (Not Yet Implemented)

1. **Per-Player Score History**: Add `playerId` field to ScoreEntry to separate leaderboards per player
2. **Data Migration**: Implement version tracking and migration logic for schema changes
3. **IndexedDB Migration**: For larger datasets, migrate from localStorage to IndexedDB
4. **Cross-Tab Sync**: Use storage event listeners to synchronize state across browser tabs
5. **Data Export/Import**: Allow users to backup/restore their game data
6. **Performance Analytics**: Calculate accuracy, identify weak tables, show progress charts

### Testing Strategy

Since the feature is already implemented, testing should focus on:

1. **Unit Tests** (src/types/player.test.ts - not yet created):
   - Test getPlayers() with and without localStorage data
   - Test getCurrentPlayer() with valid/invalid/missing currentPlayer
   - Test error handling with corrupted JSON

2. **Hook Tests** (src/hooks/usePlayerManagement.test.ts - already exists):
   - Verify existing tests cover localStorage persistence
   - Add tests for initialization on mount

3. **Integration Tests** (PlayPage.test.tsx - not yet created):
   - Test score saving on timer expiration
   - Test filtering of empty games (score = 0)
   - Test GameResult array structure

4. **E2E Tests** (Future - Playwright/Cypress):
   - Complete game session, close browser, reopen, verify score persists
   - Select player, close browser, reopen, verify player still selected

### Constitutional Compliance

This specification adheres to the project constitution:

- **Principle I (Test-First)**: Tests must be written before any new features are added
- **Principle II (Type Safety)**: All localStorage data has TypeScript interfaces (Player, ScoreEntry, GameResult)
- **Principle III (Component-Based)**: Logic separated into types/player.ts utilities and custom hooks
- **Principle IV (Quality Gates)**: Existing code passes type-check, lint, test, build
- **Principle V (Documentation)**: All functions have JSDoc comments
- **Principle VI (Retro Gaming UX)**: Persistence enhances retro gaming experience by maintaining game state

### Documentation Requirements

Since the feature is already implemented, documentation should be updated to:

1. **ARCHITECTURE.md** - Already documents localStorage structure (lines 132-149, 200-224)
2. **CLAUDE.md** - Already documents Player utilities and usePlayerManagement pattern (lines 134-169)
3. **README.md** - Should mention data persistence as a key feature (if not already present)
4. **TypeDoc** - API documentation already generated from JSDoc comments

---

**Note**: This specification documents an **already-implemented feature**. The primary value of this spec is to:
1. Provide comprehensive documentation of the existing implementation
2. Define success criteria for validation testing
3. Identify gaps in test coverage
4. Outline future enhancement opportunities
5. Serve as a reference for similar persistence features

The workflow should focus on **validation** (ensuring existing implementation meets spec) rather than **implementation** (building from scratch).
