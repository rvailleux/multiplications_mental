import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PlayPage from './pages/PlayPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PlayPage />} />
      </Routes>
    </Router>
  )
}

export default App
