import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import BudgetPlanner from './pages/BudgetPlanner'
import Dashboard from './pages/Dashboard'
import RoadmapPage from './pages/RoadmapPage'
import CountryRoadmapsSection from './components/tools/CountryRoadmapsSection'
import LoanGuidance from './components/dashboard/LoanGuidance'

export default function App() {
  return (
    <Routes>
      <Route path="/"                       element={<HomePage />} />
      <Route path="/chat"                   element={<ChatPage />} />
      <Route path="/budget"                 element={<BudgetPlanner />} />
      <Route path="/dashboard"              element={<Dashboard />} />
      <Route path="/roadmap"                element={<RoadmapPage />} />
      <Route path="/tools/execution-guides" element={<CountryRoadmapsSection />} />
      <Route path="/loans"                  element={<LoanGuidance />} />
      <Route path="*" element={
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2>404 - Page Not Found</h2>
          <a href="/">Go Home</a>
        </div>
      } />
    </Routes>
  )
}