import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PlayPage from './pages/PlayPage'

/**
 * Root application component that sets up routing for the mental math game
 * @returns {JSX.Element} Router with two main routes: home and play
 */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/play" element={<PlayPage />} />
      </Routes>
    </Router>
  )
}
