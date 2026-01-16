# Multiplications Mental Game

**🎮 [Play Live Demo](https://rvailleux.github.io/multiplications_mental/)**

This project is a fun and interactive **mental math game** built with **React**, **TypeScript**, and **Vite**. The goal is to solve as many multiplication problems as possible within a time limit. The app tracks your scores and provides statistics to help you improve your skills.

## Features

- 👥 **Player Selection**: Choose between Jules and Achille with keyboard navigation (Arrow keys + Enter)
- 🎮 **Play Mode**: Solve multiplication problems within a 60-second timer
- 🏆 **Ranked Leaderboard**: Previous scores ranked with gold/silver/bronze medals for top 3
- 🎨 **Retro Pixel Art Design**: 1990s Nintendo-style aesthetics with pixel borders and animations
- 🎵 **Background Music**: Immersive gaming experience with background music during gameplay
- ⭐ **Combo System**: Earn bonus points with consecutive correct answers
- ❤️ **Lives System**: Track your mistakes with a visual lives indicator
- 💾 **Persistent Data**: Player selection and scores saved in localStorage

## Pages

### 1. **Player Select Page** (New! ✨)
- Choose between Jules and Achille before starting
- Keyboard navigation: Arrow Up/Down to select, Enter to confirm
- Mouse click also supported for player selection
- Retro NES-style design with pixel art borders
- Selected player persists across sessions

### 2. **Home Page**
- Displays personalized welcome message for selected player
- Shows ranked leaderboard with top 100 scores
- Gold/silver/bronze medals for top 3 positions
- Handles tied scores with same rank
- "Start Game" button to begin a new session

### 3. **Play Page**
- Solve multiplication problems within a 60-second timer
- Visual progress bar with time-based color indicators
- Combo system rewards consecutive correct answers
- Lives system tracks mistakes
- Background music during gameplay
- Saves score to localStorage when timer ends (scores > 0 only)

## Technologies Used

- **React 19.0.0**: Modern UI library with hooks
- **TypeScript 5.7.2**: Type-safe development
- **Vite 6.2.0**: Lightning-fast build tool and dev server
- **React Router DOM 7.5.0**: Client-side routing and navigation
- **Vitest 4.0.16**: Fast unit testing framework
- **React Testing Library 16.3.1**: Component testing utilities
- **ESLint & Prettier**: Code quality and formatting
- **Husky & lint-staged**: Pre-commit hooks for automated quality checks
- **TypeDoc**: Automated API documentation generation
- **Local Storage**: Persistent data for players and scores

## Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/multiplications-mental.git
   cd multiplications-mental
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open the app in your browser at [http://localhost:5173](http://localhost:5173).

### Build for Production

To build the app for production, run:
```bash
npm run build
```
The production-ready files will be in the `dist` folder.

### Deployment

The app is automatically deployed to **GitHub Pages** when changes are pushed to the `main` branch.

**Quality Gates**: Every deployment must pass:
- ✅ Type checking (`npm run type-check`)
- ✅ Linting (`npm run lint:fix`)
- ✅ All tests (`npm run test:run`)
- ✅ Production build (`npm run build`)

Deployment is **blocked** if any check fails. This ensures only quality-verified code reaches production.

## Project Structure

```
multiplication_game/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ProgressBar.tsx
│   │   ├── MultiplicationQuestion.tsx
│   │   └── *.test.tsx        # Component tests
│   ├── pages/                # Route-level components
│   │   ├── PlayerSelectPage.tsx  # Player selection screen
│   │   ├── HomePage.tsx          # Home with leaderboard
│   │   ├── PlayPage.tsx          # Main game page
│   │   └── *.test.tsx        # Page tests
│   ├── hooks/                # Custom React hooks
│   │   ├── useTimer.ts
│   │   ├── usePlayerManagement.ts
│   │   ├── useBackgroundMusic.ts
│   │   └── *.test.ts         # Hook tests
│   ├── types/                # TypeScript types and utilities
│   │   └── player.ts         # Player types and localStorage utils
│   ├── test/                 # Test configuration
│   │   └── setup.ts
│   ├── App.tsx               # Root component with routing
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles and animations
├── public/                   # Static assets
│   └── audio/                # Audio files (music, SFX)
├── docs/                     # Auto-generated API documentation
├── ARCHITECTURE.md           # Detailed technical architecture
├── CLAUDE.md                 # Project context for Claude Code
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite build configuration
└── vitest.config.ts          # Vitest test configuration
```

## Scripts

### Development
- `npm run dev`: Start development server with hot reload
- `npm run dev:clean`: Clear Vite cache and start dev server

### Testing
- `npm run test`: Run tests in watch mode
- `npm run test:run`: Run tests once (CI mode)
- `npm run test:ui`: Open Vitest UI interface
- `npm run test:coverage`: Run tests with coverage report

### Code Quality
- `npm run type-check`: TypeScript validation only
- `npm run lint`: ESLint code analysis
- `npm run lint:fix`: Auto-fix ESLint issues
- `npm run format`: Format code with Prettier
- `npm run format:check`: Check formatting without changes

### Build & Documentation
- `npm run build`: Type check + production build
- `npm run preview`: Preview the production build
- `npm run docs`: Generate TypeDoc API documentation

## Future Improvements

### In Progress (todo.md)
- ✅ Player selection screen with keyboard navigation (Completed!)
- 🔄 Display last game score above leaderboard with stats
- 🔄 Add positive/negative feedback sound effects (8-bit style)
- 🔄 Enable adding new players dynamically
- 🔄 Separate score histories per player

### Planned Features
- Difficulty levels (easy, medium, hard number ranges)
- Other math operations (division, addition, subtraction)
- Statistics page with performance analytics
- PWA capabilities for offline play
- User authentication for cross-device syncing
- Multiplayer mode with real-time competition
- Achievement system and badges

## License

This project is licensed under the [MIT License](LICENSE).

---

Enjoy the game and improve your mental math skills! 🎉
