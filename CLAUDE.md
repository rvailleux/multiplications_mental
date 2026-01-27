# Claude Code Context - Mental Math Game

## Project Overview
React TypeScript multiplication game with 60-second timer challenges, score tracking, and statistics.

**📋 Key Documentation:**
- **`.specify/memory/constitution.md`** - Project constitution (NON-NEGOTIABLE principles)
- **ARCHITECTURE.md** - Detailed technical architecture, patterns, and scalability
- **README.md** - Project overview, features, and setup instructions
- **docs/api/** - Auto-generated JSDoc documentation (run `npm run docs`)

**⚖️ Constitutional Authority**: This file provides **runtime development guidance** following the principles established in `.specify/memory/constitution.md`. When in doubt, the constitution supersedes this file.

## Constitutional Principles (Quick Reference)

The project follows six core non-negotiable principles:

1. **Test-First Development (NON-NEGOTIABLE)** - TDD with red-green-refactor cycle
2. **TypeScript Type Safety** - Strict mode, explicit types, no `any`
3. **Component-Based Architecture** - Functional components, custom hooks, single responsibility
4. **Automated Quality Gates** - Type check, lint, test, build before every commit
5. **Documentation-Driven Development** - JSDoc required, auto-generated API docs
6. **Retro Gaming UX (Super NES 8-bit Aesthetic)** - Keyboard-first navigation, mouse support, pixel art

See `.specify/memory/constitution.md` for full details.

## Architecture & Patterns

### Component Structure
```
src/
├── components/     # Reusable UI components
│   ├── *.tsx          # React components with JSDoc
│   └── *.test.tsx     # Component tests
├── pages/          # Route-level components
├── hooks/          # Custom React hooks
├── types/          # Shared TypeScript types and utilities
├── test/           # Test configuration and utilities
```

### Component Conventions
- **Functional components** with TypeScript
- **Props interfaces** exported and documented with JSDoc
- **CSS-in-JS** styling with inline styles object
- **Event handlers** prefixed with `handle` (e.g., `handleSubmit`)
- **State setters** use functional updates when depending on previous state

### TypeScript Standards
- **Strict mode** enabled in tsconfig.json
- **Explicit return types** for functions
- **Interface exports** for component props
- **Type definitions** for localStorage data structures

### State Management
- **React useState** for component state
- **localStorage** for persistent data (scores, players, current player)
- **React Router** for navigation state
- **Custom hooks** for shared stateful logic (useTimer, usePlayerManagement, useBackgroundMusic)

## Retro Gaming UX Design (Super NES 8-bit Aesthetic)

### Constitutional Requirement
All UI/UX MUST follow retro gaming design principles with **keyboard-first interaction** (Constitution Principle VI).

### Keyboard Navigation (PRIMARY Input Method)

#### Supported Keys
- **Arrow Up/Down** - Navigate menu items vertically
- **Arrow Left/Right** - Navigate options horizontally (if applicable)
- **Enter** - Confirm selection, start action
- **Escape** - Cancel, go back, close dialog

#### Implementation Pattern
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent): void => {
    // Prevent default browser behavior for game keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape'].includes(e.key)) {
      e.preventDefault()
    }

    switch (e.key) {
      case 'ArrowUp':
        setSelectedIndex(prev => Math.max(0, prev - 1))
        break
      case 'ArrowDown':
        setSelectedIndex(prev => Math.min(maxIndex, prev + 1))
        break
      case 'ArrowLeft':
        // Handle horizontal navigation if applicable
        break
      case 'ArrowRight':
        // Handle horizontal navigation if applicable
        break
      case 'Enter':
        handleConfirmSelection()
        break
      case 'Escape':
        handleCancel()
        break
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [selectedIndex, maxIndex])
```

#### Keyboard Navigation Best Practices
- **Always cleanup** event listeners in useEffect return function
- **Prevent default** browser scrolling for arrow keys in game contexts
- **Bound checking** with Math.max/Math.min to prevent index out of range
- **Visual feedback** - highlight selected item with distinct styling
- **Debouncing** if rapid key presses cause issues (usually not needed)

### Jumping Arrow Selection Indicator (MANDATORY)

Every selectable option MUST display a **jumping arrow indicator** (→) next to the currently selected option. This provides clear visual feedback for keyboard navigation.

#### JumpingArrow Component Usage

```typescript
import JumpingArrow from '../components/JumpingArrow'

// Single option (arrow always visible)
<button onClick={handleStartGame}>
  <JumpingArrow visible={true} />
  🚀 Start Game
</button>

// Multiple options (arrow moves based on selection state)
<button onClick={handleSubmit}>
  <JumpingArrow visible={selectedOption === 'valider'} />
  Valider
</button>
<button onClick={handleRestart}>
  <JumpingArrow visible={selectedOption === 'restart'} />
  ↻ Restart
</button>
```

#### Implementation Rules
- **Single arrow visible**: Only ONE jumping arrow should be visible at a time
- **State-driven**: Arrow visibility controlled by `selectedOption` or `selectedIndex` state
- **Inside button**: Arrow renders inside the button, before the label text
- **Animated**: The arrow uses CSS animation for a bouncing effect

### Multi-Option Navigation with useNavigableOptions Hook

For screens with multiple selectable options (e.g., PlayPage with Valider/Restart), use the `useNavigableOptions` hook for standardized navigation.

#### Hook Import and Setup

```typescript
import { useNavigableOptions } from '../hooks/useNavigableOptions'
import type { NavigableOption } from '../types/navigation'

// Define callbacks first
const handleSubmitAnswer = (): void => {
  formRef.current?.requestSubmit()
}

const handleRestartGame = (): void => {
  reset()
  setScore(0)
  // ... reset other state
}

// Initialize the hook
const {
  selectedOption,
  navigateUp,
  navigateDown,
  executeSelectedOption,
  resetToDefault,
} = useNavigableOptions({
  options: ['valider', 'restart'] as const,
  defaultOption: 'valider',
  onValider: handleSubmitAnswer,
  onRestart: handleRestartGame,
})
```

#### Keyboard Event Handler Integration

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent): void => {
    // Skip if modal/pause menu is open
    if (pauseMenu.state.isPaused) return

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      navigateUp()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      navigateDown()
    } else if (e.key === 'Enter') {
      e.preventDefault()
      executeSelectedOption()
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [navigateUp, navigateDown, executeSelectedOption])
```

#### Hook Features
- **Cyclic navigation**: Wraps around (last→first, first→last)
- **Type-safe options**: Uses `NavigableOption` type (`'valider' | 'restart'`)
- **Callback execution**: `executeSelectedOption()` calls the appropriate handler
- **Reset capability**: `resetToDefault()` returns to initial selection

### Mouse Support (SECONDARY Input Method)

#### Constitutional Requirement
All keyboard interactions MUST also work with mouse clicks. Users should be able to:
- **Click** to select menu items (same as Arrow keys + Enter)
- **Click** to confirm actions (same as Enter)
- **Click** close/cancel buttons (same as Escape)

#### Implementation Pattern
```typescript
// Dual input: keyboard AND mouse for same action
const handleSelectOption = (index: number): void => {
  setSelectedIndex(index)
}

const handleConfirmSelection = (): void => {
  // This function is called by both Enter key AND mouse click
  navigate('/next-page')
}

return (
  <div>
    {options.map((option, index) => (
      <div
        key={option.id}
        onClick={() => {
          handleSelectOption(index)
          handleConfirmSelection()
        }}
        style={{
          backgroundColor: selectedIndex === index ? '#ffcc00' : '#fff'
        }}
      >
        {option.label}
      </div>
    ))}
  </div>
)
```

### Visual Design Guidelines (Super NES 8-bit Aesthetic)

#### Color Palette
- **Primary colors**: Bold, saturated colors (NES/SNES era)
- **Backgrounds**: Solid colors or simple gradients
- **Highlights**: High contrast for selected items
- **Text**: Readable pixel fonts or web-safe sans-serif

#### Pixel Art Styling
```typescript
const pixelArtStyles = {
  border: '4px solid #000',
  boxShadow: '8px 8px 0 rgba(0, 0, 0, 0.3)',
  imageRendering: 'pixelated' as const,
  fontFamily: 'monospace', // Or pixel font via @font-face
  textTransform: 'uppercase' as const,
}

const retroButtonStyles = {
  padding: '16px 32px',
  fontSize: '20px',
  fontWeight: 'bold',
  border: '4px solid #000',
  borderRadius: '0', // Sharp corners, no border-radius
  cursor: 'pointer',
  transition: 'transform 0.1s',
  ':hover': {
    transform: 'scale(1.05)',
  },
  ':active': {
    transform: 'scale(0.95)',
  },
}
```

#### Animation Guidelines
- **Sprite-based** animations (frame-by-frame, not smooth transitions)
- **Short durations** - keep animations snappy (100-300ms)
- **Discrete steps** - avoid smooth easing, use `steps()` timing function
- **Pixel-perfect** - align to pixel grid, avoid sub-pixel rendering

```css
/* Retro animation example */
.retro-animation {
  animation: blink 0.5s steps(2) infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
```

#### Focus Indicators
```typescript
const focusedItemStyles = {
  backgroundColor: '#ffcc00', // Bright yellow highlight
  color: '#000',
  border: '4px solid #ff0000', // Red border for extra emphasis
  boxShadow: '0 0 20px rgba(255, 204, 0, 0.8)', // Glow effect
}

const unfocusedItemStyles = {
  backgroundColor: '#4a4a4a',
  color: '#fff',
  border: '4px solid #000',
}
```

### UX Testing Checklist (Dual Input Support)

#### For Every Interactive Component:
- [ ] **Keyboard navigation works**
  - [ ] Arrow keys navigate correctly
  - [ ] Enter key confirms selection
  - [ ] Escape key cancels/goes back
  - [ ] Tab key navigation works (accessibility)
  - [ ] No keyboard traps (can always navigate away)

- [ ] **Mouse navigation works**
  - [ ] Click events fire correctly
  - [ ] Hover states provide visual feedback
  - [ ] All keyboard actions have mouse equivalents

- [ ] **Visual feedback**
  - [ ] Current selection clearly highlighted
  - [ ] Hover states distinct from selected states
  - [ ] Pixel art aesthetic maintained
  - [ ] Retro color palette consistent

- [ ] **Accessibility**
  - [ ] Focus visible for keyboard users
  - [ ] Click targets minimum 44x44px (mobile)
  - [ ] No motion sickness triggers (rapid flashing)
  - [ ] Color contrast meets WCAG guidelines

#### Test Scenarios
```typescript
// Test example for dual input support
describe('RetroMenuComponent', () => {
  it('should navigate with arrow keys', () => {
    render(<RetroMenu items={mockItems} />)
    fireEvent.keyDown(window, { key: 'ArrowDown' })
    expect(screen.getByText('Item 2')).toHaveStyle({ backgroundColor: '#ffcc00' })
  })

  it('should confirm selection with Enter key', () => {
    const onSelect = vi.fn()
    render(<RetroMenu items={mockItems} onSelect={onSelect} />)
    fireEvent.keyDown(window, { key: 'Enter' })
    expect(onSelect).toHaveBeenCalled()
  })

  it('should select item on mouse click', () => {
    const onSelect = vi.fn()
    render(<RetroMenu items={mockItems} onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Item 1'))
    expect(onSelect).toHaveBeenCalledWith('item-1')
  })

  it('should cancel with Escape key', () => {
    const onCancel = vi.fn()
    render(<RetroMenu items={mockItems} onCancel={onCancel} />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onCancel).toHaveBeenCalled()
  })
})
```

## Development Commands

### Essential Commands
```bash
# Development server
npm run dev              # Start development server
npm run dev:clean        # Clean Vite cache + start dev

# Code Quality (Constitutional Requirement - ALL 4 MUST PASS)
npm run type-check       # TypeScript validation only
npm run lint:fix         # Auto-fix ESLint issues
npm run test:run         # Run tests once (all must pass)
npm run build            # Type check + production build

# Testing
npm run test            # Run tests in watch mode
npm run test:ui         # Open Vitest UI interface
npm run test:coverage   # Run tests with coverage report

# Documentation
npm run docs            # Generate TypeDoc API documentation
```

### Advanced Commands
```bash
# Clean development environment
rm -rf node_modules/.vite    # Clear Vite cache
rm -rf node_modules package-lock.json && npm install  # Clean reinstall

# Git workflow (automated via pre-commit hooks)
npx lint-staged             # Run linting on staged files
npx husky                   # Manage git hooks

# Manual quality checks
npx tsc --noEmit            # TypeScript check without build
npm run format:check        # Verify code formatting
```

## GitHub Pages Deployment

### Production URL
**Live Demo**: [https://rvailleux.github.io/multiplications_mental/](https://rvailleux.github.io/multiplications_mental/)

### Automated Deployment Workflow

The app is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

**Constitutional Compliance**: The deployment workflow enforces ALL 4 quality gates:
1. **Type checking** (`npm run type-check`) - Zero TypeScript errors
2. **Linting** (`npm run lint:fix`) - ESLint rules enforced
3. **Testing** (`npm run test:run`) - All tests must pass
4. **Building** (`npm run build`) - Production build succeeds

**Deployment is blocked** if any check fails - there is NO bypass mechanism.

### Workflow Architecture

```
┌─────────────────┐
│  quality-check  │  ← Job 1: Run all 4 quality gates
└────────┬────────┘
         │ (blocks on failure)
         ▼
┌─────────────────┐
│     deploy      │  ← Job 2: Deploy to GitHub Pages
└─────────────────┘
```

**Typical deployment time**: 3-5 minutes

### Local Testing of Production Build

To test the production build locally before deploying:

```bash
# Build with production base path
npm run build

# Preview production build locally
npm run preview
# Visit: http://localhost:4173/multiplications_mental/
```

### Base Path Configuration

The app uses environment-aware base paths for GitHub Pages subdirectory deployment:

- **Development**: `BASE_URL = '/'` (runs on `localhost:5173/`)
- **Production**: `BASE_URL = '/multiplications_mental/'` (GitHub Pages subdirectory)

**Configuration files**:
- `vite.config.ts` - Sets `base` path based on build mode
- `src/App.tsx` - Router uses `basename={import.meta.env.BASE_URL}`

**Why this matters**: GitHub Pages serves project sites from a subdirectory (`/multiplications_mental/`), not from the root. Without proper base path configuration, routing and asset loading would fail in production.

### Workflow Triggers

- **Automatic**: Push to `main` branch
- **Manual**: Run workflow from GitHub Actions tab

### Quality Gate Enforcement

The workflow uses a two-job architecture:

**Job 1: quality-check**
- Runs on Node.js v20
- Uses `npm ci` with dependency caching
- Executes `npm run quality-check` (all 4 gates)
- Uploads build artifacts on success
- **Fails entire workflow** if any check fails

**Job 2: deploy**
- Depends on `quality-check` success
- Downloads pre-built artifacts
- Deploys to GitHub Pages
- **Never runs** if quality-check fails

This architecture ensures that only code that passes ALL constitutional quality requirements can be deployed to production.

## Component Patterns

### Standard Component Template
```typescript
import React from 'react'

/**
 * Component description
 * @param props - Component properties
 * @returns JSX element
 */
export interface ComponentProps {
  /** Prop description */
  propName: type
}

export default function Component({ propName }: ComponentProps) {
  // Component logic
  return <div>Component JSX</div>
}
```

### Custom Hook Pattern
```typescript
/**
 * Hook description and purpose
 * @param parameter - Parameter description
 * @returns Hook state and functions
 */
export function useCustomHook(parameter: type) {
  // Hook logic
  return { state, actions }
}
```

### Available Custom Hooks
- **useTimer(totalTime)** - Countdown timer management with reset functionality
- **usePlayerManagement()** - Player selection state and localStorage persistence
- **useBackgroundMusic()** - Background music control (start, stop, volume)

## File Organization

### Naming Conventions
- **Components**: PascalCase (e.g., `MultiplicationQuestion.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useTimer.ts`)
- **Types**: PascalCase interfaces/types
- **Constants**: UPPER_SNAKE_CASE

### Import Order
1. React imports
2. Third-party libraries
3. Internal components/hooks
4. Types and interfaces
5. Utilities and constants

## Data Structures

### Player Data
```typescript
type Player = {
  id: string        // Unique identifier (e.g., "jules", "achille")
  name: string      // Display name
}
```

### Score Data
```typescript
type ScoreEntry = {
  score: number
  results: GameResult[]
}

type GameResult = {
  question: string  // e.g., "3 x 7"
  correct: boolean
}
```

### localStorage Keys
- `players`: Array of Player objects (default: Jules and Achille)
- `currentPlayer`: String ID of currently selected player
- `scores`: Array of ScoreEntry objects (global, will be per-player in future)

## Error Handling & Resilience

### localStorage Error Handling (MANDATORY)

**Constitutional Requirement**: All localStorage operations MUST be wrapped in try-catch blocks to prevent application crashes.

#### Common Failure Scenarios
1. **`JSON.parse()` throws `SyntaxError`** - Corrupted data in localStorage
2. **`localStorage.setItem()` throws `QuotaExceededError`** - Storage limit reached
3. **`localStorage.getItem()` returns `null`** - Key doesn't exist (handle with fallback)

#### Pattern: Reading from localStorage
```typescript
// ✅ CORRECT - Always wrap JSON.parse in try-catch
try {
  const previousScores = JSON.parse(localStorage.getItem('scores') || '[]')
  // Use data...
} catch (error) {
  console.error('Failed to load scores from localStorage:', error)
  // Fallback to default value
  const previousScores = []
}
```

#### Pattern: Writing to localStorage
```typescript
// ✅ CORRECT - Wrap both read AND write operations
try {
  const previousScores = JSON.parse(localStorage.getItem('scores') || '[]')
  localStorage.setItem('scores', JSON.stringify([...previousScores, { score, results }]))
} catch (error) {
  console.error('Failed to save score to localStorage:', error)
  // Continue critical flow - don't block navigation
}
navigate('/results', { state: { score, results } })
```

#### Pattern: Component Guard (Page Prerequisites)
```typescript
// ✅ CORRECT - All page components verify prerequisites
/** Redirect to player selection if no player is selected */
useEffect(() => {
  if (!currentPlayer) {
    navigate('/')
  }
}, [currentPlayer, navigate])
```

**Key Principle**: Critical user flows (navigation, game progression) MUST continue even if localStorage fails. Storage is a nice-to-have, not a blocker.

### Error Handling Tests (MANDATORY)

Every component using localStorage MUST have error handling tests:

```typescript
describe('Component - Error Handling', () => {
  it('should handle localStorage quota exceeded gracefully', () => {
    // Mock localStorage.setItem to throw quota exceeded error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key) => {
      if (key === 'scores') {
        throw new DOMException('QuotaExceededError')
      }
    })

    // Component should render without crashing
    render(<Component />)
    expect(screen.getByText(/expected content/i)).toBeInTheDocument()

    // Cleanup
    consoleErrorSpy.mockRestore()
    setItemSpy.mockRestore()
  })

  it('should handle corrupted localStorage data gracefully', () => {
    // Set corrupted data in localStorage
    localStorage.setItem('scores', '{invalid json}')
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Component should render without crashing
    render(<Component />)
    expect(screen.getByText(/expected content/i)).toBeInTheDocument()

    // Cleanup
    consoleErrorSpy.mockRestore()
  })
})
```

## Game Logic

### Core Game Flow
1. **PlayerSelectPage** → Select player (keyboard navigation ↑/↓ + Enter OR mouse click) → Navigate to HomePage
2. **HomePage** → Welcome [player name] + Start game button → Navigate to PlayPage
3. **PlayPage** → 60-second timer + random multiplication questions
4. **Timer expires** → Save score to localStorage → Navigate back to HomePage

### Player Selection Flow
- **Keyboard**: Arrow Up/Down keys navigate between players, Enter confirms
- **Mouse**: Click player to select and navigate
- Selected player saved to `localStorage['currentPlayer']`
- HomePage and PlayPage redirect to PlayerSelectPage if no player selected

### Question Generation
- Random factors between 1-10
- Format: "A x B" where A, B are random integers
- New question generated after each correct answer

### Scoring
- +1 point per correct answer
- Incorrect answers recorded but don't affect score
- All attempts saved to results array

## Testing Strategy

### Constitutional Requirement
**Test-First Development (NON-NEGOTIABLE)** - Tests MUST be written BEFORE implementation.

### Current Testing Setup
- **Vitest 4.0.16** - Modern test runner (faster than Jest)
- **React Testing Library** - Component testing utilities
- **Happy-DOM** - Lightweight DOM environment
- **@testing-library/jest-dom** - Custom DOM matchers

### Test Structure
```typescript
// Component test example
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<Component prop="value" />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  // UX Testing: Verify keyboard AND mouse interactions
  it('should handle keyboard navigation', () => {
    render(<Component />)
    fireEvent.keyDown(window, { key: 'ArrowDown' })
    expect(screen.getByRole('button')).toHaveFocus()
  })

  it('should handle mouse clicks', () => {
    const onClick = vi.fn()
    render(<Component onClick={onClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalled()
  })
})
```

### Test Files Location
- Co-located with components: `Component.test.tsx`
- Test setup: `src/test/setup.ts`
- Test config: `vitest.config.ts`

### Test Quality Standards (Constitutional Requirement)

#### Each Test Must Validate Distinct Behavior
- **Avoid duplicate assertions** - Each test should check a unique aspect of functionality
- **Test descriptions must match implementation** - What the test says it does should match what it actually tests
- **One behavior per test** - Don't combine multiple unrelated checks in a single test

**Example - WRONG (Duplicate Assertions)**:
```typescript
it('should calculate and display correct answer count', () => {
  render(<GameResultsPage />)
  expect(screen.getByText(/4\/5/)).toBeInTheDocument()  // Tests "4 correct out of 5"
})

it('should calculate and display total questions count', () => {
  render(<GameResultsPage />)
  expect(screen.getByText(/4\/5/)).toBeInTheDocument()  // ❌ DUPLICATE - same assertion!
})
```

**Example - CORRECT (Distinct Tests)**:
```typescript
it('should calculate and display correct answer count', () => {
  render(<GameResultsPage />)
  expect(screen.getByText(/4\/5/)).toBeInTheDocument()  // Tests "4 correct out of 5"
})

it('should calculate and display total questions count', () => {
  render(<GameResultsPage />)
  expect(screen.getByText(/\/5/)).toBeInTheDocument()  // ✅ Tests just the "/ 5" part
})
```

#### Error Handling Test Coverage
Every component using localStorage MUST test:
1. **Quota exceeded** - Mock `localStorage.setItem()` to throw `QuotaExceededError`
2. **Corrupted data** - Set invalid JSON in localStorage before rendering
3. **Component resilience** - Verify component renders without crashing
4. **Flow continuation** - Assert critical navigation/actions still work

See "Error Handling Tests (MANDATORY)" section above for complete examples.

### Testing Best Practices (Constitutional Compliance)
- **Test user behavior**, not implementation details
- **Use descriptive test names** that explain the expected behavior
- **Mock external dependencies** (timers, localStorage, etc.)
- **Test accessibility** with screen readers in mind
- **Test dual input** - Verify both keyboard AND mouse interactions work
- **Write tests FIRST** - Red-Green-Refactor cycle mandatory
- **Tests MUST fail** initially to prove they test the right behavior

## Performance Considerations

### Current Optimizations
- **Timer cleanup** in useEffect to prevent memory leaks
- **Functional state updates** to prevent stale closures
- **Minimal re-renders** with stable props and callbacks
- **Vite bundling** with automatic tree-shaking
- **Happy-DOM** for faster test execution

### Monitoring & Metrics
- **Bundle analysis**: Use `npm run build` to check bundle size
- **Type checking**: `npm run type-check` for fast validation
- **Test coverage**: `npm run test:coverage` for quality metrics (target >80%)
- **Build performance**: Vite provides build timing information

## Common Issues & Solutions

### TypeScript Issues
- **Type errors**: Run `npm run type-check` for fast validation
- **Build failures**: Run `npm run build` to catch type/build issues
- **Missing types**: Export interfaces with `@public` JSDoc tag
- **Import errors**: Ensure correct file extensions in imports

### Development Issues
- **Hot reload broken**: Run `npm run dev:clean` to clear cache
- **Lint errors**: Run `npm run lint:fix` for auto-fixes
- **Format inconsistencies**: Pre-commit hooks auto-format staged files
- **Test failures**: Check `src/test/setup.ts` configuration

### Git & Automation Issues
- **Pre-commit hook fails**: Check lint-staged configuration in package.json
- **Husky not working**: Run `npm run prepare` to reinstall hooks
- **Tests slow**: Happy-DOM is faster than jsdom for most cases

### UX Issues
- **Keyboard navigation not working**: Check event listener cleanup in useEffect
- **Focus not visible**: Ensure focus styles are defined and contrast meets WCAG
- **Mouse and keyboard out of sync**: Ensure both call same handler functions

## Feature Development Workflow

### 🔄 MANDATORY Process for New Features
**Constitutional Requirement**: Claude Code MUST follow this exact workflow for ALL feature development.

#### 1. Planning & Analysis (REQUIRED for complex features)
```bash
# ALWAYS start with TodoWrite for complex features
TodoWrite -> Break down feature into tasks
Grep/Task -> Analyze existing patterns
Read -> Review related components/files
```

#### 2. Test-First Development (REQUIRED - NON-NEGOTIABLE)
```bash
# Write tests BEFORE implementation
Write failing tests -> Component.test.tsx
  - Test keyboard navigation
  - Test mouse interactions
  - Test edge cases
  - Test error conditions
Validate approach with user -> Ensure coverage
Tests MUST FAIL initially -> Proves they test the right behavior
```

#### 3. Implementation Phase (REQUIRED)
```bash
# Follow existing patterns strictly
Read existing components -> Understand patterns
Implement feature -> Maintain consistency
  - Keyboard-first navigation
  - Mouse support for all actions
  - Retro pixel art styling
  - JSDoc comments while coding
Use TypeScript strictly -> Leverage type safety
```

#### 4. Quality Assurance (REQUIRED - ALL 4 COMMANDS MANDATORY)
```bash
npm run test         # MUST pass all tests
npm run type-check   # MUST have no type errors
npm run lint:fix     # MUST fix all lint issues
npm run build        # MUST build successfully
```

#### 5. Documentation Updates (REQUIRED)
```bash
Update JSDoc -> All new functions documented
npm run docs -> Regenerate API documentation
Update ARCHITECTURE.md -> Document arch changes
Update CLAUDE.md -> Add new patterns if needed
```

#### 6. Final Verification (REQUIRED)
```bash
npm run test:coverage -> Ensure adequate coverage (>80%)
Manual testing -> Verify in browser
  - Test keyboard navigation (ArrowUp/Down/Left/Right, Enter, Esc)
  - Test mouse clicks
  - Verify retro aesthetic consistency
Performance check -> No bundle size regression
```

#### 7. Commit Preparation (REQUIRED)
```bash
git status -> Verify intended changes only
Descriptive commit -> Follow project conventions
Pre-commit hooks -> Will auto-run (do not bypass)
```

### 🚨 ENFORCEMENT Rules (Constitutional Compliance)
- **NEVER skip tests** - All features must have tests first (TDD)
- **NEVER commit without running ALL 4 quality commands** - type-check, lint:fix, test:run, build
- **NEVER implement without JSDoc** - Document as you code
- **ALWAYS use TodoWrite** for multi-step features
- **ALWAYS validate approach** with user before major implementation
- **ALWAYS test dual input** - Keyboard AND mouse must both work
- **ALWAYS follow retro UX** - Super NES 8-bit aesthetic is mandatory

### Daily Development
1. **Start development**: `npm run dev`
2. **Write tests first** - TDD is mandatory
3. **Write code** with auto-formatting and linting
4. **Run tests**: `npm run test` (watch mode)
5. **Commit changes** (pre-commit hooks auto-run)

### Quality Assurance
1. **Type checking**: `npm run type-check`
2. **Code formatting**: `npm run format` (if needed)
3. **Lint checking**: `npm run lint:fix`
4. **Test coverage**: `npm run test:coverage`
5. **Documentation**: `npm run docs`

### Architecture References
- **`.specify/memory/constitution.md`** - Non-negotiable principles
- **ARCHITECTURE.md** - Complete technical architecture
- **Component patterns** - See existing components for examples
- **Test patterns** - Follow MultiplicationQuestion.test.tsx example
- **Type definitions** - Export interfaces for reusability

## Player Management Utilities

### Player Type and Utilities (src/types/player.ts)
```typescript
// Get all players from localStorage
const players = getPlayers()

// Get/set current player ID
const playerId = getCurrentPlayerId()
setCurrentPlayerId('jules')

// Get current player object
const player = getCurrentPlayer()

// Initialize default players if needed
initializePlayers()
```

### usePlayerManagement Hook Pattern
```typescript
const {
  players,           // Array of available players
  currentPlayer,     // Currently selected Player or null
  selectedIndex,     // Index for keyboard navigation
  setSelectedIndex,  // Update selected index
  selectPlayer,      // Select player and save to localStorage
  hasPlayerSelected  // Boolean flag
} = usePlayerManagement()
```

## Future Improvements
- **Add new players** dynamically with name input (max 12 chars alphanumeric)
- **Per-player score history** - separate leaderboards for each player
- **Last game stats display** - show recent game performance above leaderboard
- **Sound effects** - positive/negative feedback sounds (8-bit style, /public/audio/sfx/)
- **Difficulty levels** (different number ranges)
- **Statistics page** with performance analytics
- **PWA capabilities** for offline play
- **Other math operations** (division, addition)
- **User authentication** for cross-device scores
- **E2E testing** with Playwright or Cypress
- **Performance monitoring** with Web Vitals

## IDE Configuration

### Recommended VSCode Extensions
- **TypeScript and JavaScript Language Features** (built-in)
- **ES7+ React/Redux/React-Native snippets** - React snippets
- **Prettier - Code formatter** - Auto-formatting
- **ESLint** - Real-time linting
- **Vitest** - Test runner integration
- **Auto Rename Tag** - HTML/JSX tag synchronization

### Configured VSCode Settings
The project includes `.vscode/settings.json` with:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### Automation Features
- **Auto-formatting** on save via Prettier
- **Auto-linting** on save via ESLint
- **Pre-commit hooks** ensure code quality before commits
- **Import auto-completion** for better DX

---

## Quick Reference

### Most Used Commands
```bash
npm run dev          # Start development
npm run test         # Run tests in watch mode
npm run lint:fix     # Fix code issues
npm run docs         # Generate documentation
```

### Key Files to Know
- **`.specify/memory/constitution.md`** - Project constitution (NON-NEGOTIABLE)
- **ARCHITECTURE.md** - Complete technical documentation
- **vitest.config.ts** - Test configuration
- **CLAUDE.md** - This file (runtime development guidance)
- **.vscode/settings.json** - IDE automation settings

### Constitutional Principles Quick Check
Before committing, verify:
- ✅ Tests written FIRST and passed
- ✅ TypeScript strict mode compliance
- ✅ Functional components with JSDoc
- ✅ All 4 quality commands passed (type-check, lint:fix, test:run, build)
- ✅ Documentation updated
- ✅ Keyboard-first navigation implemented
- ✅ Mouse support for all actions
- ✅ Retro pixel art aesthetic maintained

This file helps Claude Code understand the project context, patterns, and conventions for efficient development with full constitutional compliance.

## Active Technologies
- TypeScript 5.7.2 (strict mode enabled) + React 19.0.0, React Router DOM 7.5.0 (010-player-name-display)
- localStorage (browser-based persistence) (010-player-name-display)
- TypeScript 5.7.2 (strict mode enabled) + React Router DOM 7.5.0 (for navigation) (011-game-results-screen)
- localStorage (browser-based persistence) - GameResult[] already saved by PlayPage (011-game-results-screen)
- TypeScript 5.7.2 (strict mode) + React 19.0.0, React Router DOM 7.5.0, Sass (CSS Modules) (012-keyboard-navigation)
- localStorage (client-side persistence for selection state) (013-unified-keyboard-ui)
- TypeScript 5.7.2 (strict mode) + React 19.0.0 + React, React Router DOM 7.5.0, Sass (CSS Modules), Vite 6.2+ (015-answer-feedback)
- localStorage (client-side persistence for scores) (015-answer-feedback)

## Recent Changes
- 010-player-name-display: Added TypeScript 5.7.2 (strict mode enabled) + React 19.0.0, React Router DOM 7.5.0
