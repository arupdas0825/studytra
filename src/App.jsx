import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import BudgetPlanner from './pages/BudgetPlanner'
import Dashboard from './pages/Dashboard'
import RoadmapPage from './pages/RoadmapPage'
import CountryRoadmapsSection from './components/tools/CountryRoadmapsSection'
import LoanGuidance from './components/dashboard/LoanGuidance'
import CVFormatPage from './pages/CVFormatPage'
import SOPGuidePage from './pages/SOPGuidePage'
import ResumeFormatPage from './pages/ResumeFormatPage'
import CountriesPage from './pages/CountriesPage'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/"                       element={<LandingPage />} />
          <Route path="/app"                    element={<HomePage />} />
          
          {/* Compatibility routes */}
          <Route path="/home"                   element={<HomePage />} />
          <Route path="/countries"              element={<CountriesPage />} />
          <Route path="/budget"                 element={<BudgetPlanner />} />
          
          {/* Protected routes */}
          <Route path="/chat"                   element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/dashboard"              element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          <Route path="/roadmap"                element={<RoadmapPage />} />
          
          {/* SOP guidance routes */}
          <Route path="/sop"                    element={<SOPGuidePage />} />
          <Route path="/tools/sop-guide"        element={<SOPGuidePage />} />
          
          {/* Loan guidance routes */}
          <Route path="/loan"                   element={<LoanGuidance />} />
          <Route path="/loans"                  element={<LoanGuidance />} />
          
          {/* Tools routes */}
          <Route path="/tools/execution-guides" element={<CountryRoadmapsSection />} />
          <Route path="/tools/cv-formats"       element={<CVFormatPage />} />
          <Route path="/tools/resume-formats"   element={<ResumeFormatPage />} />
          
          <Route path="*" element={
            <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif', background: '#050914', color: '#f1f5f9', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <h2>404 - Page Not Found</h2>
              <a href="/" style={{ color: '#3b82f6', marginTop: 12, fontWeight: 700 }}>Go Home</a>
            </div>
          } />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  )
}
