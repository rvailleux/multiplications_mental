import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PlayPage from './pages/PlayPage'

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
