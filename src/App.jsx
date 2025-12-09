import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TopicPage from './pages/TopicPage'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/topic/:id" element={<TopicPage />} />
      </Routes>
    </div>
  )
}

export default App

