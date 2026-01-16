import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PlayerSelectPage from './pages/PlayerSelectPage'
import HomePage from './pages/HomePage'
import PlayPage from './pages/PlayPage'

/**
 * Root application component that sets up routing for the mental math game
 * Supports GitHub Pages subdirectory deployment via basename prop
 * @returns {JSX.Element} Router with three main routes: player select, home, and play
 */
export default function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<PlayerSelectPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/play" element={<PlayPage />} />
      </Routes>
    </Router>
  )
}
