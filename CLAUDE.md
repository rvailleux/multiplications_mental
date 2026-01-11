# Claude Code Context - Mental Math Game

## Project Overview
React TypeScript multiplication game with 60-second timer challenges, score tracking, and statistics.

**📋 Key Documentation:**
- **ARCHITECTURE.md** - Detailed technical architecture, patterns, and scalability
- **README.md** - Project overview, features, and setup instructions
- **docs/api/** - Auto-generated JSDoc documentation (run `npm run docs`)

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

## Development Commands

### Essential Commands
```bash
# Development server
npm run dev              # Start development server
npm run dev:clean        # Clean Vite cache + start dev

# Code Quality
npm run type-check       # TypeScript validation only
npm run build           # Type check + production build
npm run lint            # ESLint code analysis
npm run lint:fix        # Auto-fix ESLint issues
npm run format          # Format code with Prettier
npm run format:check    # Check formatting without changes

# Testing
npm run test            # Run tests in watch mode
npm run test:run        # Run tests once
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

## Game Logic

### Core Game Flow
1. **PlayerSelectPage** → Select player (keyboard navigation ↑/↓ + Enter) → Navigate to HomePage
2. **HomePage** → Welcome [player name] + Start game button → Navigate to PlayPage
3. **PlayPage** → 60-second timer + random multiplication questions
4. **Timer expires** → Save score to localStorage → Navigate back to HomePage

### Player Selection Flow
- Arrow Up/Down keys navigate between players
- Enter key or mouse click validates selection
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
})
```

### Test Files Location
- Co-located with components: `Component.test.tsx`
- Test setup: `src/test/setup.ts`
- Test config: `vitest.config.ts`

### Testing Best Practices
- **Test user behavior**, not implementation details
- **Use descriptive test names** that explain the expected behavior
- **Mock external dependencies** (timers, localStorage, etc.)
- **Test accessibility** with screen readers in mind

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
- **Test coverage**: `npm run test:coverage` for quality metrics
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

## Feature Development Workflow

### 🔄 MANDATORY Process for New Features
Claude Code MUST follow this exact workflow for ALL feature development:

#### 1. Planning & Analysis (REQUIRED)
```bash
# ALWAYS start with TodoWrite for complex features
TodoWrite -> Break down feature into tasks
Grep/Task -> Analyze existing patterns  
Read -> Review related components/files
```

#### 2. Test-First Development (REQUIRED)
```bash
# Write tests BEFORE implementation
Write failing tests -> Component.test.tsx
Validate approach with user -> Ensure coverage
Test edge cases -> Error conditions, boundaries
```

#### 3. Implementation Phase (REQUIRED)
```bash
# Follow existing patterns strictly
Read existing components -> Understand patterns
Implement feature -> Maintain consistency
Add JSDoc comments -> Document while coding
Use TypeScript strictly -> Leverage type safety
```

#### 4. Quality Assurance (REQUIRED - ALL COMMANDS)
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
npm run test:coverage -> Ensure adequate coverage
Manual testing -> Verify in browser
Performance check -> No bundle size regression
```

#### 7. Commit Preparation (REQUIRED)
```bash
git status -> Verify intended changes only
Descriptive commit -> Follow project conventions
```

### 🚨 ENFORCEMENT Rules
- **NEVER skip tests** - All features must have tests first
- **NEVER commit without running quality commands** - All 4 QA commands required
- **NEVER implement without JSDoc** - Document as you code
- **ALWAYS use TodoWrite** for multi-step features
- **ALWAYS validate approach** with user before major implementation

### Daily Development
1. **Start development**: `npm run dev`
2. **Write code** with auto-formatting and linting
3. **Write tests** for new components/features
4. **Run tests**: `npm run test` (watch mode)
5. **Commit changes** (pre-commit hooks auto-run)

### Quality Assurance
1. **Type checking**: `npm run type-check`
2. **Code formatting**: `npm run format` (if needed)
3. **Lint checking**: `npm run lint:fix`
4. **Test coverage**: `npm run test:coverage`
5. **Documentation**: `npm run docs`

### Architecture References
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

### Keyboard Navigation Pattern
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'ArrowUp') {
      setSelectedIndex(Math.max(0, selectedIndex - 1))
    }
    if (e.key === 'ArrowDown') {
      setSelectedIndex(Math.min(players.length - 1, selectedIndex + 1))
    }
    if (e.key === 'Enter') {
      selectPlayer(selectedIndex)
      navigate('/home')
    }
  }
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [selectedIndex, players.length])
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
- **ARCHITECTURE.md** - Complete technical documentation
- **vitest.config.ts** - Test configuration
- **CLAUDE.md** - This file (project context)
- **.vscode/settings.json** - IDE automation settings

This file helps Claude Code understand the project context, patterns, and conventions for efficient development with full tooling support.