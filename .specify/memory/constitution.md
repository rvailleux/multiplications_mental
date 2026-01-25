<!--
SYNC IMPACT REPORT:
Version Change: 1.3.0 → 1.3.1
Modified Principles:
  - Principle VIII (E2E Testing): Strengthened requirement that EVERY new feature MUST have meaningful Playwright tests
Added Sections:
  - "Mandatory E2E Tests for New Features" subsection in Principle VIII
  - Feature completion checklist requiring E2E tests
Removed Sections: None
Templates Status:
  ✅ spec-template.md - Already requires E2E Test Scenarios section
  ✅ tasks-template.md - Already includes E2E testing tasks
  ✅ plan-template.md - Already includes E2E testing in technical context
  ⚠ CLAUDE.md - Should document Playwright testing patterns and examples
Follow-up TODOs:
  - Update CLAUDE.md with Playwright E2E testing code examples
  - Document E2E test patterns for keyboard navigation
  - Add E2E testing checklist for feature completion
Rationale: PATCH version bump - Strengthened and clarified existing E2E testing requirements to emphasize that meaningful Playwright tests are mandatory for every new feature. No new principles added; existing Principle VIII enhanced with explicit feature-driven requirements and completion criteria.
Previous Changes (1.2.0 → 1.3.0):
  - Added Principle VIII: End-to-End Testing with Playwright
Previous Changes (1.1.0 → 1.2.0):
  - Added Principle VII: Error Handling & Resilience
Previous Changes (1.0.0 → 1.1.0):
  - Added Principle VI: Retro Gaming UX (Super NES 8-bit aesthetic)
  - Established keyboard-first navigation with mouse support
-->

# Multiplications Mental Game Constitution

## Core Principles

### I. Test-First Development (NON-NEGOTIABLE)

All features MUST follow Test-Driven Development (TDD):
- Tests written BEFORE implementation
- Tests MUST fail initially to prove they test the right behavior
- Red-Green-Refactor cycle strictly enforced
- Implementation only proceeds after tests are written and approved
- Component tests use React Testing Library with user-centric assertions
- Hook tests validate behavior, not implementation details

**Rationale**: Testing first ensures features are testable, requirements are clear, and regressions are caught immediately. This prevents technical debt accumulation and maintains code quality as the project scales.

### II. TypeScript Type Safety

Strict type safety is mandatory across the entire codebase:
- TypeScript strict mode enabled (`tsconfig.json`)
- All functions MUST have explicit return types
- Props interfaces MUST be exported with JSDoc documentation
- No `any` types without explicit justification
- Type checking MUST pass before any commit (`npm run type-check`)
- localStorage data structures MUST have type definitions

**Rationale**: Type safety catches errors at compile time, serves as living documentation, enables refactoring confidence, and improves IDE autocomplete. The small upfront cost prevents runtime errors and debugging time.

### III. Component-Based Architecture

React components follow strict patterns and separation of concerns:
- Functional components only (no class components)
- Custom hooks for shared stateful logic (`useTimer`, `usePlayerManagement`, `useBackgroundMusic`)
- CSS-in-JS with inline styles objects (no external CSS for components)
- Props interfaces with JSDoc for all components
- Event handlers prefixed with `handle` (e.g., `handleSubmit`)
- State setters use functional updates when depending on previous state
- Single Responsibility Principle: one component, one purpose

**Rationale**: Consistent patterns reduce cognitive load, enable parallel development, simplify testing, and make the codebase approachable for new contributors. Component composition scales better than monolithic structures.

### IV. Automated Quality Gates

All code MUST pass automated quality checks before commit:
- **Type checking**: `npm run type-check` - Zero TypeScript errors
- **Linting**: `npm run lint:fix` - ESLint rules enforced
- **Testing**: `npm run test:run` - All tests pass
- **Building**: `npm run build` - Production build succeeds
- Pre-commit hooks automatically run linting and formatting
- No manual bypassing of quality checks (`--no-verify` forbidden except emergencies)

**Rationale**: Automation removes human error, enforces consistency, prevents broken code from entering the repository, and maintains code quality without relying on code review alone.

### V. Documentation-Driven Development

Documentation is a first-class deliverable, not an afterthought:
- JSDoc comments required for all public functions, components, and hooks
- `@param`, `@returns`, and description for all exports
- API documentation auto-generated with TypeDoc (`npm run docs`)
- Architecture decisions documented in ARCHITECTURE.md
- Project patterns and conventions in CLAUDE.md
- README.md kept up-to-date with features and setup instructions

**Rationale**: Documentation enables onboarding, reduces bus factor, serves as specification during development, and ensures knowledge is preserved. Auto-generated docs stay in sync with code through enforcement.

### VI. Retro Gaming UX (Super NES 8-bit Aesthetic)

All UI/UX MUST follow retro gaming design principles with keyboard-first interaction:
- **Keyboard navigation PRIMARY**: Arrow keys (Up/Down/Left/Right), Enter (select), Esc (back/cancel)
- **Mouse support SECONDARY**: All keyboard interactions MUST also work with mouse clicks
- **Visual style**: Super NES 8-bit pixel art aesthetic (pixel borders, retro fonts, animations)
- **Menu navigation**: List-based selection with visual highlight/focus indicator
- **Accessibility**: Both input methods (keyboard + mouse) must be equally functional
- **Event handlers**: Implement keyboard listeners with proper cleanup in useEffect
- **Testing**: Verify both keyboard and mouse paths work in component tests

#### Jumping Arrow Selection Indicator (MANDATORY)
All selectable options MUST display a **jumping arrow indicator** (→) next to the currently selected option:
- **Visual feedback**: Animated arrow bounces to draw attention to current selection
- **Single selection**: Only ONE arrow visible at a time across all options
- **State-driven**: Arrow visibility controlled by `selectedOption` state
- **Component**: Use `JumpingArrow` component with `visible` prop

**Example Pattern**:
```typescript
// Single option (always selected)
<button onClick={handleAction}>
  <JumpingArrow visible={true} />
  Start Game
</button>

// Multiple options (arrow moves between them)
<button onClick={handleSubmit}>
  <JumpingArrow visible={selectedOption === 'valider'} />
  Valider
</button>
<button onClick={handleRestart}>
  <JumpingArrow visible={selectedOption === 'restart'} />
  Restart
</button>
```

#### Multi-Option Navigation with useNavigableOptions Hook
For screens with multiple selectable options, use the `useNavigableOptions` hook:
- **Cyclic navigation**: Arrow keys wrap around (last → first, first → last)
- **State management**: Hook manages `selectedOption` state and navigation functions
- **Action execution**: `executeSelectedOption()` calls the callback for current selection

**Hook Usage Pattern**:
```typescript
const {
  selectedOption,
  navigateUp,
  navigateDown,
  executeSelectedOption,
} = useNavigableOptions({
  options: ['valider', 'restart'] as const,
  defaultOption: 'valider',
  onValider: () => formRef.current?.requestSubmit(),
  onRestart: () => handleRestartGame(),
})

// In keyboard event handler:
if (e.key === 'ArrowUp') navigateUp()
if (e.key === 'ArrowDown') navigateDown()
if (e.key === 'Enter') executeSelectedOption()
```

**Rationale**: Keyboard-first navigation provides a superior gaming experience reminiscent of classic consoles while maintaining modern web accessibility. Dual input support ensures the game is playable on both desktop (keyboard preferred) and touch/mobile devices (click/tap). The retro aesthetic creates an immersive, nostalgic experience that enhances engagement. The jumping arrow indicator provides clear visual feedback of the current selection, essential for keyboard navigation where mouse cursor position isn't relevant.

### VII. Error Handling & Resilience (NON-NEGOTIABLE)

All code MUST handle errors gracefully to prevent application crashes:

#### localStorage Operations
- **ALWAYS wrap in try-catch**: `JSON.parse()` and `localStorage.setItem()` can throw exceptions
- **Continue critical flows**: Navigation and core functionality must proceed even if localStorage fails
- **Log errors appropriately**: Use `console.error()` for storage failures
- **Common failure scenarios**:
  - `JSON.parse()` throws `SyntaxError` on corrupted data
  - `localStorage.setItem()` throws `QuotaExceededError` when storage limit reached
  - `localStorage.getItem()` returns `null` for missing keys (handle with fallback values)

**Example Pattern**:
```typescript
try {
  const data = JSON.parse(localStorage.getItem('key') || '[]')
  localStorage.setItem('key', JSON.stringify(newData))
} catch (error) {
  console.error('Failed to save to localStorage:', error)
  // Continue critical flow - don't block navigation
}
```

#### Component Guard Patterns
- **Page prerequisites**: All page components MUST verify prerequisites before rendering
- **Player selection guard**: Pages requiring a selected player MUST redirect to `/` if no player selected
- **Consistent pattern**: Use `useEffect` for guard logic with dependency on prerequisite state
- **Early exit**: Guard checks should be among first useEffect hooks in component

**Example Pattern**:
```typescript
/** Redirect to player selection if no player is selected */
useEffect(() => {
  if (!currentPlayer) {
    navigate('/')
  }
}, [currentPlayer, navigate])
```

#### Test Coverage for Error Handling
- **localStorage failures**: Test quota exceeded, corrupted data, and JSON parse errors
- **Component resilience**: Verify components render without crashing despite errors
- **Flow continuation**: Assert critical navigation/flows proceed even when persistence fails
- **Error logging**: Verify errors are logged appropriately (mock `console.error`)

**Rationale**: Error handling is fundamental to application stability. localStorage operations are unreliable by nature (user privacy settings, quota limits, data corruption). Graceful degradation ensures users can continue using the app even when non-critical features fail. Testing error paths prevents production crashes and ensures resilience.

### VIII. End-to-End Testing with Playwright (NON-NEGOTIABLE)

All features MUST have automated end-to-end tests validating complete user journeys:

#### Mandatory E2E Tests for New Features (CRITICAL)

**Every new feature MUST include meaningful Playwright E2E tests before it can be considered complete.**

This is a NON-NEGOTIABLE requirement:
- **No feature merges without E2E tests**: PRs adding new features MUST include corresponding E2E tests
- **User journey coverage**: E2E tests MUST validate the complete user flow, not just isolated actions
- **Meaningful assertions**: Tests MUST verify actual user-visible outcomes, not implementation details
- **Keyboard + mouse validation**: Tests MUST cover both input methods (constitutional UX requirement)
- **Visual state capture**: Screenshots MUST be captured at key states for regression detection

**Feature Completion Checklist** (all items MUST be checked before feature is complete):
- [ ] E2E test file created in `tests/e2e/[feature-name].spec.ts`
- [ ] At least one E2E test per user story/acceptance scenario
- [ ] Keyboard navigation tested (ArrowUp/Down, Enter, Escape)
- [ ] Mouse interactions tested (clicks, hover states)
- [ ] Screenshots captured at key states
- [ ] All E2E tests pass locally (`npx playwright test`)
- [ ] No flaky tests (deterministic, no arbitrary timeouts)

#### E2E Test Requirements
- **Feature-level E2E tests**: Every user story MUST have at least one E2E test validating the complete flow
- **Playwright framework**: Use Playwright for browser automation (already configured in project)
- **Real browser testing**: Tests run in actual browser environment, not simulated DOM
- **User journey validation**: E2E tests follow exact user paths from spec.md acceptance scenarios
- **Visual validation**: Include screenshots at key states for visual regression detection
- **Keyboard navigation**: Validate keyboard-first interactions (arrows, Enter, Escape) work as expected
- **Mouse interactions**: Validate mouse clicks and interactions work as expected
- **Multi-step flows**: Test complete workflows (player selection → game play → results → leaderboard)

#### E2E Test Structure
```typescript
// Example E2E test pattern for user story
test('User Story 1: Player selects character and starts game', async ({ page }) => {
  // Navigate to app
  await page.goto('http://localhost:5174')

  // Screenshot initial state
  await page.screenshot({ path: 'test-results/01-player-select.png' })

  // Validate keyboard navigation
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')

  // Validate navigation occurred
  expect(page.url()).toContain('/home')

  // Screenshot after navigation
  await page.screenshot({ path: 'test-results/02-home-page.png' })

  // Continue user journey...
})
```

#### Test Organization
- **File location**: `tests/e2e/[feature-name].spec.ts`
- **One file per feature/user story**: Group related scenarios together
- **Descriptive test names**: Match acceptance scenarios from spec.md
- **Screenshot naming**: `[step-number]-[description].png` for visual tracking
- **Test data cleanup**: Reset localStorage/state between tests
- **Deterministic tests**: No flaky tests - use proper waits, not arbitrary timeouts

#### When to Write E2E Tests
- **For EVERY new feature**: This is mandatory, not optional
- **After unit tests pass**: E2E tests come after component/unit tests in TDD cycle
- **Before feature completion**: E2E tests MUST pass before marking user story complete
- **For each user story**: Minimum one E2E test per user story in spec.md
- **For critical paths**: Additional E2E tests for happy path + error scenarios
- **For regressions**: Add E2E test when bug found in production

#### E2E Test Quality Standards
- **Test independence**: Each test can run in isolation without dependencies
- **Fast execution**: Optimize for speed - use shortcuts where appropriate (direct navigation vs full flow)
- **Clear assertions**: Use descriptive expects that match acceptance criteria
- **Screenshot evidence**: Capture key states for debugging and visual validation
- **Keyboard + mouse coverage**: Validate both input methods work (constitutional requirement)

**Rationale**: E2E tests validate the complete user experience in a real browser, catching issues that unit and integration tests miss. Playwright enables reliable browser automation with excellent developer experience. E2E tests serve as living documentation of user journeys and prevent regressions in complex multi-step flows. For a gaming application with keyboard-first navigation, E2E tests are essential to validate the actual user experience matches the design. Making E2E tests mandatory for every new feature ensures consistent quality and prevents technical debt accumulation.

## Development Workflow

### Feature Development Process

1. **Planning & Analysis** (REQUIRED for complex features)
   - Use TodoWrite to break down multi-step features
   - Analyze existing patterns with Grep/Task before implementing
   - Review related components with Read tool

2. **Test-First Implementation** (REQUIRED)
   - Write failing unit tests first (`.test.tsx` files)
   - Validate approach with stakeholders
   - Test edge cases and error conditions
   - **Error handling tests**: MUST test localStorage failures, corrupted data, quota exceeded
   - **Test quality**: Each test must validate distinct behavior (no duplicate assertions)
   - **Test descriptions**: Must accurately match what's being tested
   - **UX Testing**: Verify both keyboard AND mouse interactions work
   - Implement feature to pass unit tests
   - **Write E2E tests**: Create Playwright tests for user journeys from spec.md (MANDATORY)
   - **Validate E2E tests fail**: Ensure E2E tests fail before full integration
   - Complete implementation to pass all tests (unit + E2E)
   - Never skip tests or implement before testing

3. **Quality Assurance** (ALL COMMANDS REQUIRED)
   - `npm run test` - Must pass all tests
   - `npm run type-check` - Must have zero type errors
   - `npm run lint:fix` - Must fix all lint issues
   - `npm run build` - Must build successfully

4. **Documentation Updates** (REQUIRED)
   - Add JSDoc to all new functions
   - Run `npm run docs` to regenerate API documentation
   - Update ARCHITECTURE.md if architectural changes made
   - Update CLAUDE.md if new patterns introduced

5. **Final Verification** (REQUIRED)
   - `npm run test:coverage` - Ensure adequate coverage (>80%)
   - **E2E test execution**: Run all Playwright tests for feature (`npx playwright test tests/e2e/[feature].spec.ts`)
   - **E2E test screenshots**: Review screenshots for visual regressions
   - Manual browser testing (keyboard navigation + mouse clicks)
   - Performance check (no bundle size regression)
   - UX validation (retro aesthetic consistency)

6. **Commit Preparation** (REQUIRED)
   - `git status` - Verify only intended changes
   - Descriptive commit message following project conventions
   - Pre-commit hooks will auto-run (do not bypass)

### Code Review Standards

- All PRs must verify constitution compliance
- **E2E tests required**: PRs adding features MUST include E2E tests (no exceptions)
- Complexity must be justified in PR description
- Breaking changes require migration plan
- Test coverage must not decrease
- Documentation must be updated alongside code
- UX must maintain keyboard-first + mouse-secondary pattern

### Technology Constraints

- **React 19.0.0+** - Modern hooks and concurrent features
- **TypeScript 5.7+** - Latest language features
- **Vite 6.2+** - Fast build tool (no Webpack)
- **Vitest 4.0+** - Modern test runner (no Jest)
- **Playwright** - E2E browser automation testing
- **Happy-DOM** - Lightweight test environment
- **ESLint + Prettier** - Consistent code style
- **localStorage** - Client-side persistence (no backend yet)

## Governance

### Amendment Process

1. Propose amendment with clear rationale
2. Document impact on existing code
3. Update affected templates and documentation
4. Increment version according to semantic versioning:
   - **MAJOR**: Backward incompatible principle removals/redefinitions
   - **MINOR**: New principle added or materially expanded guidance
   - **PATCH**: Clarifications, wording fixes, non-semantic refinements
5. Update Sync Impact Report
6. Get stakeholder approval
7. Create migration plan if needed

### Compliance Review

- Constitution supersedes all other practices
- All PRs/reviews must verify compliance
- Violations require explicit justification in PR
- Technical debt tracked when principles temporarily violated
- Regular audits to ensure adherence

### Version Control

- Constitution changes tracked in git
- Sync Impact Report documents all modifications
- Templates kept synchronized with constitution
- Breaking changes communicated to all contributors

### Runtime Guidance

Use **CLAUDE.md** for runtime development guidance and project context. The constitution defines non-negotiable principles; CLAUDE.md provides practical implementation patterns.

**Version**: 1.3.1 | **Ratified**: 2026-01-13 | **Last Amended**: 2026-01-24
