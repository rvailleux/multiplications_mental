# Feature Development Checklist

## Before Starting Any Feature

- [ ] **TodoWrite used** - Break down feature into manageable tasks
- [ ] **Existing patterns analyzed** - Understand current codebase structure  
- [ ] **Architecture reviewed** - Ensure feature fits existing patterns

## Test-First Development (MANDATORY)

- [ ] **Tests written FIRST** - Define expected behavior through tests
- [ ] **Test coverage validated** - Edge cases and error conditions covered
- [ ] **Tests failing initially** - Confirm tests actually test the feature
- [ ] **User validated approach** - Tests reviewed and approved

## Implementation Phase

- [ ] **Existing patterns followed** - Code style and structure consistent
- [ ] **JSDoc added** - All new functions and components documented
- [ ] **TypeScript strict** - No `any` types, proper interfaces
- [ ] **Minimal implementation** - Start simple, iterate

## Quality Assurance (ALL REQUIRED)

- [ ] **Tests pass** - `npm run test:run` succeeds
- [ ] **Types valid** - `npm run type-check` succeeds  
- [ ] **Linting clean** - `npm run lint:fix` succeeds
- [ ] **Build successful** - `npm run build` succeeds

## Documentation Updates

- [ ] **JSDoc complete** - All new code documented
- [ ] **API docs regenerated** - `npm run docs` executed
- [ ] **Architecture updated** - ARCHITECTURE.md reflects changes if needed
- [ ] **CLAUDE.md updated** - New patterns documented if introduced

## Final Verification

- [ ] **Test coverage checked** - `npm run test:coverage` adequate
- [ ] **Manual testing done** - Feature works in browser
- [ ] **Performance verified** - No bundle size regressions
- [ ] **Accessibility tested** - Keyboard navigation, screen readers

## Commit Preparation

- [ ] **Git status clean** - Only intended files modified
- [ ] **Commit message descriptive** - Follows project conventions
- [ ] **Pre-commit hooks pass** - Automated checks succeed

## 🚨 Red Flags - NEVER PROCEED IF:

- ❌ Tests were not written first
- ❌ Quality commands fail  
- ❌ Documentation is missing
- ❌ Code doesn't follow existing patterns
- ❌ User hasn't validated test approach

## Quick Commands Reference

```bash
# Start feature development
npm run pre-feature

# Complete feature development  
npm run post-feature

# All quality checks at once
npm run quality-check
```