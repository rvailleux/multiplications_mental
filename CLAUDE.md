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
├── test/           # Test configuration and utilities
└── types/          # Shared TypeScript types (future)
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
- **localStorage** for persistent score data
- **React Router** for navigation state
- **Custom hooks** for shared stateful logic

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
- `scores`: Array of ScoreEntry objects

## Game Logic

### Core Game Flow
1. **HomePage** → Start game button → Navigate to PlayPage
2. **PlayPage** → 60-second timer + random multiplication questions
3. **Timer expires** → Save score to localStorage → Navigate to HomePage

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

## Development Workflow

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

## Future Improvements
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