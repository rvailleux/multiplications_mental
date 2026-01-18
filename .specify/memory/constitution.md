<!--
SYNC IMPACT REPORT:
Version Change: 1.1.0 → 1.2.0
Modified Principles:
  - Principle I (Test-First Development): Added error handling test requirements, test quality standards
Added Sections:
  - Principle VII: Error Handling & Resilience (NON-NEGOTIABLE)
    - localStorage operations error handling patterns
    - Component guard patterns for prerequisites
    - Test coverage requirements for error scenarios
Removed Sections: None
Templates Status:
  ✅ plan-template.md - Reviewed, no updates required
  ✅ spec-template.md - Should include error handling requirements for localStorage operations
  ✅ tasks-template.md - Should include error handling tasks for localStorage-heavy features
  ⚠ CLAUDE.md - Should document localStorage error handling patterns and component guard examples
Follow-up TODOs:
  - Update CLAUDE.md with localStorage error handling code examples
  - Document component guard pattern for page prerequisites
  - Add error handling test examples to testing documentation
  - Create error handling checklist for code reviews
Rationale: MINOR version bump - Added new principle VII establishing mandatory error handling and resilience patterns, particularly for localStorage operations and component guards. Prevents application crashes from storage failures and ensures graceful degradation. Expands test requirements to include error scenarios and test quality standards.
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

**Rationale**: Keyboard-first navigation provides a superior gaming experience reminiscent of classic consoles while maintaining modern web accessibility. Dual input support ensures the game is playable on both desktop (keyboard preferred) and touch/mobile devices (click/tap). The retro aesthetic creates an immersive, nostalgic experience that enhances engagement.

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

## Development Workflow

### Feature Development Process

1. **Planning & Analysis** (REQUIRED for complex features)
   - Use TodoWrite to break down multi-step features
   - Analyze existing patterns with Grep/Task before implementing
   - Review related components with Read tool

2. **Test-First Implementation** (REQUIRED)
   - Write failing tests first (`.test.tsx` files)
   - Validate approach with stakeholders
   - Test edge cases and error conditions
   - **Error handling tests**: MUST test localStorage failures, corrupted data, quota exceeded
   - **Test quality**: Each test must validate distinct behavior (no duplicate assertions)
   - **Test descriptions**: Must accurately match what's being tested
   - **UX Testing**: Verify both keyboard AND mouse interactions work
   - Implement feature to pass tests
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
   - Manual browser testing (keyboard navigation + mouse clicks)
   - Performance check (no bundle size regression)
   - UX validation (retro aesthetic consistency)

6. **Commit Preparation** (REQUIRED)
   - `git status` - Verify only intended changes
   - Descriptive commit message following project conventions
   - Pre-commit hooks will auto-run (do not bypass)

### Code Review Standards

- All PRs must verify constitution compliance
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

**Version**: 1.2.0 | **Ratified**: 2026-01-13 | **Last Amended**: 2026-01-18
