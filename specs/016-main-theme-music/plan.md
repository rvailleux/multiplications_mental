# Implementation Plan: Main Theme Music

**Branch**: `016-main-theme-music` | **Date**: 2026-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/016-main-theme-music/spec.md`

## Summary

Implement a dedicated main theme song (`the-return-of-the-8-bit-era-301292.mp3`) that plays continuously on all menu screens (Player Select, Home, Game Results), while gameplay uses a random track from the remaining 6 songs. The solution uses React Context for global music state management, ensuring music continuity across route navigation without restarts.

## Technical Context

**Language/Version**: TypeScript 5.7.2 (strict mode enabled)
**Primary Dependencies**: React 19.0.0, React Router DOM 7.5.0, HTML5 Audio API
**Storage**: N/A (no persistence required for music state)
**Testing**: Vitest 4.0.16 with React Testing Library 16.3.1
**E2E Testing**: Playwright 1.57.0 (MANDATORY per Constitution Principle VIII)
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Single web application (React SPA)
**Performance Goals**: Music starts within 2 seconds of user interaction; transitions within 500ms
**Constraints**: Handle browser autoplay restrictions gracefully; maintain 30% volume
**Scale/Scope**: 4 screens affected (PlayerSelect, Home, Play, Results); 1 new context, 1 new hook

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Test-First Development (NON-NEGOTIABLE)
- [x] **Compliant**: Unit tests for MusicContext before implementation
- [x] **Compliant**: E2E tests for complete user journeys
- [ ] **To Verify**: Tests fail first (red-green-refactor)

### Principle II: TypeScript Type Safety
- [x] **Compliant**: All types defined in data-model.md
- [x] **Compliant**: MusicContextValue interface with explicit types
- [x] **Compliant**: No `any` types in design

### Principle III: Component-Based Architecture
- [x] **Compliant**: New custom hook `useMusic()` pattern
- [x] **Compliant**: Context provider wraps Router (single responsibility)
- [x] **Compliant**: Event handlers follow `handle*` naming

### Principle IV: Automated Quality Gates
- [ ] **To Run**: `npm run type-check`
- [ ] **To Run**: `npm run lint:fix`
- [ ] **To Run**: `npm run test:run`
- [ ] **To Run**: `npm run build`

### Principle V: Documentation-Driven Development
- [x] **Compliant**: JSDoc planned for all public functions
- [x] **Compliant**: API contract documented in contracts/
- [ ] **To Do**: Run `npm run docs` after implementation

### Principle VI: Retro Gaming UX
- [x] **Compliant**: No UI changes required (audio only)
- [x] **Compliant**: Keyboard interaction triggers music (autoplay fallback)

### Principle VII: Error Handling & Resilience
- [x] **Compliant**: Try-catch for audio operations
- [x] **Compliant**: Graceful degradation if audio fails
- [x] **Compliant**: Console.warn (not error) for non-critical failures

### Principle VIII: E2E Testing with Playwright (NON-NEGOTIABLE)
- [ ] **To Create**: `tests/e2e/main-theme-music.spec.ts`
- [ ] **To Verify**: At least 1 E2E test per user story
- [ ] **To Verify**: Keyboard + mouse validation

## Project Structure

### Documentation (this feature)

```text
specs/016-main-theme-music/
├── plan.md              # This file
├── research.md          # Phase 0 output (complete)
├── data-model.md        # Phase 1 output (complete)
├── quickstart.md        # Phase 1 output (complete)
├── contracts/           # Phase 1 output (complete)
│   └── music-context-api.md
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── contexts/                    # NEW: Context providers
│   ├── MusicContext.tsx         # NEW: Global music state provider
│   └── MusicContext.test.tsx    # NEW: Context unit tests
├── pages/
│   ├── PlayerSelectPage.tsx     # MODIFY: Call playMainTheme on mount
│   ├── HomePage.tsx             # VERIFY: Main theme continues
│   ├── PlayPage.tsx             # MODIFY: Switch to gameplay music
│   └── GameResultsPage.tsx      # MODIFY: Resume main theme
├── hooks/
│   └── useBackgroundMusic.ts    # KEEP: May refactor internals
└── App.tsx                      # MODIFY: Wrap with MusicProvider

tests/
└── e2e/
    └── main-theme-music.spec.ts # NEW: E2E tests for feature
```

**Structure Decision**: Single web application structure. New `contexts/` directory follows React conventions for Context providers. All changes are additive except for page component modifications to integrate the new music context.

## Design Decisions

### Audio State Management

| Aspect | Approach | Justification |
|--------|----------|---------------|
| State Location | React Context | Persists across route changes; no new deps |
| Audio Instance | Single useRef in provider | Prevents restarts; handles lifecycle |
| Track Separation | Module-level constants | Simple; type-safe; computed once |
| Autoplay Handling | Try-catch with fallback | Standard web pattern |

### Music Flow

```
[App Mount]
    │
    ▼
[PlayerSelectPage Mount]
    │
    ▼
[playMainTheme()] ──────────────────────────────────────┐
    │                                                    │
    ▼                                                    │
[Main Theme Playing] ◄──────────────────────────────────┤
    │                                                    │
    ▼ (navigate to /home)                               │
[HomePage - music continues]                            │
    │                                                    │
    ▼ (start game)                                      │
[PlayPage Mount]                                        │
    │                                                    │
    ▼                                                    │
[playGameplayMusic()] ── stops main theme               │
    │                                                    │
    ▼                                                    │
[Gameplay Music Playing]                                │
    │                                                    │
    ▼ (game ends)                                       │
[PlayPage Unmount → GameResultsPage Mount]             │
    │                                                    │
    ▼                                                    │
[playMainTheme()] ──────────────────────────────────────┘
```

## Complexity Tracking

No constitution violations requiring justification. Design is minimal and follows all principles.

## Next Steps

1. Run `/speckit.tasks` to generate implementation task list
2. Follow TDD workflow: write failing tests first
3. Implement MusicContext
4. Integrate with page components
5. Create E2E tests
6. Run quality checks
7. Create PR

## Research Summary

See [research.md](./research.md) for detailed technical decisions:
- React Context + useRef for global audio state
- Module-level track constants for separation
- Try-catch with interaction fallback for autoplay
- Indirect E2E testing via state verification
