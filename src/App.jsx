import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/Homepage'
import ChatPage from './pages/ChatPage'
import BudgetPlanner from './pages/BudgetPlanner'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/budget" element={<BudgetPlanner />} />
    </Routes>
  )
}
