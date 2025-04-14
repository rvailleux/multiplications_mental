# Multiplications Mental Game

This project is a fun and interactive **mental math game** built with **React**, **TypeScript**, and **Vite**. The goal is to solve as many multiplication problems as possible within a time limit. The app tracks your scores and provides statistics to help you improve your skills.

## Features

- 🎮 **Play Mode**: Solve multiplication problems within a 60-second timer.
- 📊 **Statistics**: View average scores for each multiplication pair based on your last 5 games.
- 🏆 **Score Tracking**: Previous scores are saved and displayed on the home page.
- 🚀 **Responsive Design**: Child-friendly interface with bold, playful components.

## Pages

### 1. **Home Page**
- Displays the 5 most recent scores.
- Option to expand and view all previous scores.
- A "Start Game" button to begin a new session.

### 2. **Play Page**
- Solve multiplication problems within a 60-second timer.
- Tracks correct and incorrect answers.
- Saves your score and results to local storage after the game ends.

### 3. **Stats Page**
- Displays the average score for each multiplication pair based on the last 5 games.
- Helps identify strengths and areas for improvement.

## Technologies Used

- **React**: For building the user interface.
- **TypeScript**: For type-safe development.
- **Vite**: For fast development and build tooling.
- **React Router**: For navigation between pages.
- **Local Storage**: For saving scores and results.

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

## Project Structure

```
multiplications_mental/
├── src/
│   ├── components/       # Reusable components (e.g., ProgressBar, MultiplicationQuestion)
│   ├── hooks/            # Custom hooks (e.g., useTimer)
│   ├── pages/            # Page components (HomePage, PlayPage, StatsPage)
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── public/               # Static assets
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the app for production.
- `npm run preview`: Preview the production build.
- `npm run lint`: Run ESLint to check for code quality issues.

## Future Improvements

- Add difficulty levels (e.g., easy, medium, hard).
- Include division, addition, and subtraction problems.
- Add user authentication to save scores across devices.

## License

This project is licensed under the [MIT License](LICENSE).

---

Enjoy the game and improve your mental math skills! 🎉
