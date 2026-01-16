# Quality Assurance Checklist: Persistent Player and Score Data

**Purpose**: Validation checklist for verifying the already-implemented localStorage persistence feature meets specification requirements
**Created**: 2026-01-13
**Feature**: [spec.md](./spec.md)

**Note**: This checklist validates existing implementation against the specification, focusing on test coverage, error handling, and documentation gaps.

## User Story Validation

- [ ] CHK001 Verify default players (Jules, Achille) persist across browser sessions (close and reopen)
- [ ] CHK002 Verify selected player persists when browser is closed mid-session and reopened
- [ ] CHK003 Verify game scores persist across browser sessions and appear in HomePage leaderboard
- [ ] CHK004 Verify detailed GameResult data (question, correct) is stored for each question attempt
- [ ] CHK005 Verify empty games (score = 0) are NOT saved to localStorage['scores']

## Functional Requirements Testing

- [ ] CHK006 Verify localStorage['players'] contains array of Player objects with structure { id: string, name: string }
- [ ] CHK007 Verify default players are initialized on first load if localStorage['players'] is empty
- [ ] CHK008 Verify localStorage['currentPlayer'] stores selected player ID as string
- [ ] CHK009 Verify getCurrentPlayer() retrieves full Player object by matching ID against players array
- [ ] CHK010 Verify localStorage['scores'] contains array of ScoreEntry objects with structure { score: number, results: GameResult[] }
- [ ] CHK011 Verify new ScoreEntry is appended to localStorage['scores'] when timer expires (secondsLeft === 0) AND score > 0
- [ ] CHK012 Verify ScoreEntry.results is an array of GameResult objects with structure { question: string, correct: boolean }
- [ ] CHK013 Verify localStorage errors (parse failures, quota exceeded) are handled gracefully without crashing
- [ ] CHK014 Verify all localStorage read operations are wrapped in try/catch blocks with appropriate fallback values
- [ ] CHK015 Verify users are redirected to PlayerSelectPage if getCurrentPlayer() returns null
- [ ] CHK016 Verify PlayerSelectPage calls initializePlayers() on mount
- [ ] CHK017 Verify PlayPage saves score data to localStorage before navigating to HomePage when timer expires

## Edge Case Testing

- [ ] CHK018 Test localStorage quota exceeded (QuotaExceededError) - verify graceful fallback to in-memory data
- [ ] CHK019 Test corrupted JSON in localStorage['players'] - verify fallback to default players
- [ ] CHK020 Test corrupted JSON in localStorage['scores'] - verify fallback to empty array
- [ ] CHK021 Test user clearing localStorage while game is running - verify game continues with in-memory state
- [ ] CHK022 Test getCurrentPlayerId() returning ID that doesn't exist in players array - verify getCurrentPlayer() returns null and triggers redirect
- [ ] CHK023 Test large score array (100+ entries) - verify no performance degradation on HomePage load
- [ ] CHK024 Test concurrent tab sessions modifying localStorage - document "last write wins" behavior

## Success Criteria Validation

- [ ] CHK025 Verify default players persist after closing and reopening browser (SC-001)
- [ ] CHK026 Verify selected player persists across browser sessions (SC-002)
- [ ] CHK027 Verify all 5 scores are visible after completing 5 games across 2 browser sessions (SC-003)
- [ ] CHK028 Verify ScoreEntry.results array enables future analytics features (SC-004)
- [ ] CHK029 Verify system handles localStorage errors gracefully without crashing (SC-005)
- [ ] CHK030 Verify zero data loss between sessions for valid localStorage data (SC-006)
- [ ] CHK031 Verify empty games (score = 0) do not clutter leaderboard (SC-007)

## Test Coverage Gaps

- [ ] CHK032 Create unit tests for src/types/player.ts (player.test.ts does not exist)
  - Test getPlayers() with and without localStorage data
  - Test getCurrentPlayer() with valid/invalid/missing currentPlayer
  - Test error handling with corrupted JSON
  - Test initializePlayers() first-load initialization

- [ ] CHK033 Review existing src/hooks/usePlayerManagement.test.ts for localStorage persistence coverage
  - Verify tests cover localStorage read/write operations
  - Verify tests cover initialization on mount
  - Add tests for error scenarios if missing

- [ ] CHK034 Create integration tests for src/pages/PlayPage.tsx (PlayPage.test.tsx does not exist)
  - Test score saving on timer expiration (secondsLeft === 0)
  - Test filtering of empty games (score = 0)
  - Test GameResult array structure in saved ScoreEntry
  - Test navigation to HomePage after score save

- [ ] CHK035 Create integration tests for src/pages/HomePage.tsx (HomePage.test.tsx may not exist)
  - Test loading and displaying scores from localStorage
  - Test score sorting (descending order)
  - Test "Show All" toggle for leaderboard (if implemented)

- [ ] CHK036 Plan E2E tests for future Playwright/Cypress implementation
  - Complete game session, close browser, reopen, verify score persists
  - Select player, close browser, reopen, verify player still selected

## Code Quality Validation

- [ ] CHK037 Run `npm run type-check` - verify zero TypeScript errors
- [ ] CHK038 Run `npm run lint:fix` - verify zero ESLint errors
- [ ] CHK039 Run `npm run test` - verify all existing tests pass
- [ ] CHK040 Run `npm run build` - verify production build succeeds
- [ ] CHK041 Run `npm run test:coverage` - verify adequate coverage (>80% target)

## Documentation Review

- [ ] CHK042 Verify ARCHITECTURE.md documents localStorage structure (lines 132-149, 200-224)
- [ ] CHK043 Verify CLAUDE.md documents Player utilities and usePlayerManagement pattern (lines 134-169)
- [ ] CHK044 Verify README.md mentions data persistence as a key feature
- [ ] CHK045 Verify all functions in src/types/player.ts have JSDoc comments
- [ ] CHK046 Verify all functions in src/hooks/usePlayerManagement.ts have JSDoc comments
- [ ] CHK047 Run `npm run docs` - verify TypeDoc API documentation generates successfully

## Constitutional Compliance

- [ ] CHK048 Principle I (Test-First): Verify tests exist for all localStorage operations (GAPS IDENTIFIED - see CHK032-035)
- [ ] CHK049 Principle II (Type Safety): Verify all localStorage data has TypeScript interfaces (Player, ScoreEntry, GameResult)
- [ ] CHK050 Principle III (Component-Based): Verify logic separated into types/player.ts utilities and custom hooks
- [ ] CHK051 Principle IV (Quality Gates): Verify code passes all quality gates (type-check, lint, test, build)
- [ ] CHK052 Principle V (Documentation): Verify all functions have JSDoc comments
- [ ] CHK053 Principle VI (Retro Gaming UX): Verify persistence enhances retro gaming experience without UI disruption

## Future Enhancement Planning

- [ ] CHK054 Document requirement for per-player score history (add playerId field to ScoreEntry)
- [ ] CHK055 Document requirement for data migration strategy (version tracking)
- [ ] CHK056 Document requirement for IndexedDB migration plan (for large datasets)
- [ ] CHK057 Document requirement for cross-tab sync (storage event listeners)
- [ ] CHK058 Document requirement for data export/import feature
- [ ] CHK059 Document requirement for performance analytics (accuracy, weak tables, progress charts)

## Notes

- Check items off as completed: `[x]`
- This is a **validation checklist** for an already-implemented feature
- Primary focus: Identify test coverage gaps and verify existing implementation meets spec
- Test coverage gaps identified in CHK032-036 should be addressed before feature is considered "complete"
- All quality gates (CHK037-041) must pass before closing this checklist
- Documentation review (CHK042-047) ensures feature is properly documented for future developers
