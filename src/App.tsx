import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MusicProvider } from './contexts/MusicContext'
import PlayerSelectPage from './pages/PlayerSelectPage'
import GameSelectPage from './pages/GameSelectPage'
import HomePage from './pages/HomePage'
import PlayPage from './pages/PlayPage'
import GameResultsPage from './pages/GameResultsPage'
import CreditsPage from './pages/CreditsPage'
import Complement10HomePage from './pages/Complement10HomePage'
import Complement10PlayPage from './pages/Complement10PlayPage'

/**
 * Root application component that sets up routing for the multi-module math game.
 * Supports GitHub Pages subdirectory deployment via basename prop.
 * MusicProvider wraps Router to persist audio across route changes.
 *
 * Routes:
 * - `/`                → Player selection
 * - `/select-game`     → Game module selection (Multiplications / Compléments)
 * - `/home`            → Multiplication game hub + leaderboard
 * - `/play`            → Multiplication game
 * - `/complement10`    → Complement-to-10 game hub + leaderboard
 * - `/play/complement10` → Complement-to-10 game
 * - `/results`         → Game results + leaderboard (shared by both modules)
 * - `/credits`         → Credits scroll
 *
 * @returns {JSX.Element} Router with all game routes
 */
export default function App() {
  return (
    <MusicProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<PlayerSelectPage />} />
          <Route path="/select-game" element={<GameSelectPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/play" element={<PlayPage />} />
          <Route path="/complement10" element={<Complement10HomePage />} />
          <Route path="/play/complement10" element={<Complement10PlayPage />} />
          <Route path="/results" element={<GameResultsPage />} />
          <Route path="/credits" element={<CreditsPage />} />
        </Routes>
      </Router>
    </MusicProvider>
  )
}
