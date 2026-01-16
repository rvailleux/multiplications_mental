# Feature Specification: Ranked Leaderboard with Medals

**Feature Branch**: `003-ranked-leaderboard`
**Created**: 2026-01-13
**Status**: Implemented
**Input**: User description: "Create a ranked leaderboard that displays up to 100 previous game scores in descending order. Show rank numbers for each score, with special visual medals (gold/silver/bronze) for the top 3 positions. Handle tied scores by assigning them the same rank number and adjusting subsequent ranks accordingly (e.g., if two players tie for rank 2, the next rank is 4, not 3). Display the leaderboard on a home page with a personalized welcome message showing the currently selected player's name."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Ranked Leaderboard with Medals (Priority: P1)

Players can view their historical game scores in a ranked leaderboard that displays the top 100 scores in descending order, with gold, silver, and bronze medals highlighting the top 3 positions.

**Why this priority**: This is the core feature that provides players with feedback on their performance and creates competitive motivation. Without this, the leaderboard would be a simple list without visual hierarchy or gamification elements.

**Independent Test**: Can be fully tested by completing multiple games with varying scores and verifying the leaderboard displays correctly ranked scores with appropriate medals for positions 1-3.

**Acceptance Scenarios**:

1. **Given** a player has completed 5 games with scores [45, 23, 78, 23, 56], **When** they view the home page, **Then** they should see scores ranked as: #1 (🥇 78 pts), #2 (🥈 56 pts), #3 (🥉 45 pts), #4 (23 pts), #4 (23 pts)
2. **Given** a player has no previous game scores, **When** they view the home page, **Then** they should see the welcome message and start button but no leaderboard section
3. **Given** a player has completed 150 games, **When** they view the leaderboard, **Then** only the most recent 100 scores should be displayed
4. **Given** multiple scores exist, **When** displayed in the leaderboard, **Then** each score should show its rank number (with medal emoji for top 3) and point value

---

### User Story 2 - Proper Rank Calculation for Tied Scores (Priority: P1)

Players with identical scores receive the same rank number, and subsequent ranks adjust accordingly using standard competition ranking (e.g., 1, 2, 2, 4 instead of 1, 2, 2, 3).

**Why this priority**: Accurate ranking is essential for fairness and competitive integrity. Incorrect ranking would undermine player trust and make the leaderboard meaningless.

**Independent Test**: Can be fully tested by creating specific score scenarios with ties and verifying the rank numbers follow the correct competition ranking algorithm.

**Acceptance Scenarios**:

1. **Given** scores of [100, 90, 90, 80], **When** ranks are calculated, **Then** they should be #1, #2, #2, #4 (not #1, #2, #3, #4)
2. **Given** scores of [50, 50, 50, 40], **When** ranks are calculated, **Then** they should be #1, #1, #1, #4
3. **Given** three tied scores at position 2, **When** medals are assigned, **Then** all three receive the silver medal (🥈) and rank #2
4. **Given** scores change after each game, **When** the leaderboard updates, **Then** ranks recalculate correctly maintaining tie handling

---

### User Story 3 - Personalized Welcome Message (Priority: P2)

Players see a personalized welcome message on the home page showing their selected player name, creating a more engaging and personal experience.

**Why this priority**: While important for user engagement, the welcome message is not critical to the leaderboard functionality. It enhances the experience but the feature would work without it.

**Independent Test**: Can be fully tested by selecting different players and verifying the welcome message displays the correct player name.

**Acceptance Scenarios**:

1. **Given** "Jules" is the selected player, **When** viewing the home page, **Then** the welcome message should display "Welcome Jules!"
2. **Given** "Achille" is the selected player, **When** viewing the home page, **Then** the welcome message should display "Welcome Achille!"
3. **Given** no player is selected, **When** attempting to view the home page, **Then** the user should be redirected to the player selection page

---

### User Story 4 - Visual Distinction for Top Performers (Priority: P2)

Top 3 ranked scores have distinct visual styling (golden background, special animations, larger fonts) to make them stand out from other scores.

**Why this priority**: Visual distinction enhances the gamification and motivation aspects, but the feature would be functional with basic styling. This is a polish feature that improves user experience.

**Independent Test**: Can be fully tested by inspecting the visual styling of top 3 scores versus other scores in the leaderboard.

**Acceptance Scenarios**:

1. **Given** scores exist in the leaderboard, **When** viewing ranks 1-3, **Then** they should have a golden gradient background and glow animation
2. **Given** scores exist in the leaderboard, **When** viewing ranks 4+, **Then** they should have the standard blue gradient background
3. **Given** a top 3 score, **When** rendered, **Then** it should have larger font size and distinct text shadow effects
4. **Given** a rank 1 score, **When** rendered, **Then** it should display the gold medal emoji (🥇) before the rank number

---

### Edge Cases

- **What happens when there are exactly 100 scores?** All 100 scores are displayed without truncation.
- **What happens when there are more than 100 scores?** Only the last 100 scores are kept in localStorage, older scores are discarded.
- **What happens when all scores are identical?** All scores receive rank #1 and the gold medal (🥇).
- **What happens when there are ties at position 3?** All tied scores at position 3 receive the bronze medal (🥉) and rank #3.
- **What happens when localStorage is corrupted or empty?** The system gracefully handles this by defaulting to an empty array and showing no leaderboard section.
- **What happens when a player is selected but then deleted from localStorage?** The system redirects to the player selection page.
- **What happens with extremely large scores (e.g., 999999)?** The system displays them correctly with proper formatting ("999999 pts").
- **What happens when viewing on small screens?** The leaderboard has a scrollable container (max-height: 300px) to handle many scores without breaking layout.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display up to 100 previous game scores in the leaderboard
- **FR-002**: System MUST sort scores in descending order (highest score first)
- **FR-003**: System MUST calculate ranks using standard competition ranking (ties receive same rank, next rank skips numbers)
- **FR-004**: System MUST display medals for top 3 ranks: 🥇 (rank 1), 🥈 (rank 2), 🥉 (rank 3)
- **FR-005**: System MUST assign medals based on rank number, not position (tied scores at same rank get same medal)
- **FR-006**: System MUST display rank number and point value for each score
- **FR-007**: System MUST show personalized welcome message with current player's name
- **FR-008**: System MUST redirect to player selection page if no player is selected
- **FR-009**: System MUST persist scores in localStorage with key "scores"
- **FR-010**: System MUST limit stored scores to most recent 100 entries to prevent memory issues
- **FR-011**: System MUST handle empty score arrays gracefully (hide leaderboard section)
- **FR-012**: System MUST apply distinct visual styling to top 3 ranked scores
- **FR-013**: System MUST provide scrollable container for leaderboard when content exceeds viewport

### Key Entities

- **ScoreEntry**: Represents a game session result
  - Attributes: score (number), results (array of question/correct pairs)
  - Storage: localStorage key "scores" as JSON array
  - Relationships: Referenced by RankedScore

- **RankedScore**: Extended ScoreEntry with ranking metadata
  - Attributes: All ScoreEntry attributes plus rank (number) and medal (optional string emoji)
  - Computed: Dynamically calculated from ScoreEntry array
  - Relationships: Derived from ScoreEntry, not persisted separately

- **Player**: Represents a game player
  - Attributes: id (string), name (string)
  - Storage: localStorage key "currentPlayer" for selected player
  - Relationships: Associated with welcome message and navigation guards

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Leaderboard correctly displays and ranks up to 100 scores in descending order
- **SC-002**: Tied scores receive identical rank numbers with correct subsequent rank calculation (verified by test cases)
- **SC-003**: Top 3 ranks display correct medal emojis (🥇, 🥈, 🥉) based on rank number
- **SC-004**: Welcome message displays current player's name accurately
- **SC-005**: Visual distinction between top 3 scores and others is clearly visible (golden glow vs standard blue)
- **SC-006**: Leaderboard handles edge cases gracefully (empty, corrupted data, >100 scores, all tied)
- **SC-007**: Page redirects to player selection when no player is selected
- **SC-008**: Leaderboard remains responsive and scrollable with maximum 100 entries
- **SC-009**: Score calculation algorithm correctly implements standard competition ranking in all scenarios
- **SC-010**: System prevents memory issues by limiting localStorage to 100 most recent scores

## Technical Implementation Notes

### Algorithm: Rank Calculation

The `calculateRanks()` function implements standard competition ranking:
1. Sort scores in descending order (highest first)
2. Initialize rank counter at 1
3. For each score:
   - If score differs from previous, set rank = current position (i + 1)
   - If score equals previous, maintain same rank
   - Assign medal if rank ≤ 3
4. Return array of RankedScore objects

### Data Structures

```typescript
// Base score entry
type ScoreEntry = {
  score: number
  results: Array<{
    question: string
    correct: boolean
  }>
}

// Ranked score with medal
interface RankedScore extends ScoreEntry {
  rank: number
  medal?: string  // '🥇' | '🥈' | '🥉'
}
```

### Visual Styling Approach

- **Top 3 scores**: Golden gradient background (#ffd700 to #fff8dc), gold border (#b8860b), glow animation
- **Other scores**: Sky blue gradient (#87ceeb to #fff), black border, no animation
- **Medal display**: Emoji prefixes rank number (e.g., "🥇 #1", "🥈 #2", "#4")
- **Scrolling**: max-height 300px with auto overflow for >10 scores

### Player Integration

- Uses `getCurrentPlayer()` utility from `types/player.ts`
- Redirects to "/" (player selection) if no current player via `useEffect` hook
- Displays player.name in welcome message subtitle

### Performance Considerations

- Slice to 100 scores happens at load time: `.slice(-100)`
- Rank calculation is O(n log n) due to sorting
- Renders all visible scores (no virtualization needed for max 100 items)
- No expensive operations in render loop

## Testing Strategy

### Unit Tests Required

1. `calculateRanks()` function:
   - Handles empty array
   - Handles single score
   - Handles no ties
   - Handles ties at various positions
   - Handles all tied scores
   - Assigns correct medals for top 3
   - Handles ties at medal positions

2. Component rendering:
   - Shows welcome message with player name
   - Redirects when no player selected
   - Hides leaderboard when no scores
   - Displays all ranked scores correctly
   - Applies correct styling to top 3 vs others

### Integration Tests Required

1. End-to-end flow:
   - Select player → view home page → see personalized welcome
   - Complete games → scores persist → leaderboard updates
   - Verify >100 scores truncates to last 100

### Edge Case Tests Required

1. All scores tied
2. Exactly 100 scores
3. More than 100 scores
4. Empty localStorage
5. Corrupted localStorage data
6. Ties at each medal position (1, 2, 3)

## Future Enhancements

- Per-player leaderboards (currently global)
- Last game stats display above leaderboard
- Filter/sort options (by date, by player)
- Export leaderboard data
- Share scores functionality
- Animations when new high scores achieved
- Sound effects for top 3 placements
