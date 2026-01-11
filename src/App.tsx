import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PlayerSelectPage from './pages/PlayerSelectPage'
import HomePage from './pages/HomePage'
import PlayPage from './pages/PlayPage'

/**
 * Root application component that sets up routing for the mental math game
 * @returns {JSX.Element} Router with three main routes: player select, home, and play
 */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PlayerSelectPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/play" element={<PlayPage />} />
      </Routes>
    </Router>
  )
}
