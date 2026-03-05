import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  )
}