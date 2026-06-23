import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
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
import PremiumOnboardingModal from './components/auth/PremiumOnboardingModal'
import AuthModal from './components/auth/AuthModal'

function AppContent() {
  const { user, userProfile, authModalOpen, setAuthModalOpen } = useAuth()
  const [onboardingOpen, setOnboardingOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (user && userProfile) {
      if (!userProfile.onboardingCompleted && !userProfile.onboardingComplete) {
        setOnboardingOpen(true)
      } else {
        setOnboardingOpen(false)
        // If authenticated and onboarding completed, redirect homepage visits to /dashboard
        if (window.location.pathname === '/' || window.location.pathname === '/home' || window.location.pathname === '/app') {
          navigate('/dashboard')
        }
      }
    } else {
      setOnboardingOpen(false)
    }
  }, [user, userProfile, navigate])

  return (
    <>
      <Routes>
        {/* Public route */}
        <Route path="/"                       element={<HomePage />} />
        
        {/* Compatibility routes */}
        <Route path="/app"                    element={<HomePage />} />
        <Route path="/home"                   element={<HomePage />} />
        <Route path="/countries"              element={<HomePage />} />
        
        {/* Protected routes */}
        <Route path="/chat"                   element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/dashboard"              element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/budget"                 element={<ProtectedRoute><BudgetPlanner /></ProtectedRoute>} />
        <Route path="/roadmap"                element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} />
        
        {/* SOP guidance routes */}
        <Route path="/sop"                    element={<ProtectedRoute><SOPGuidePage /></ProtectedRoute>} />
        <Route path="/tools/sop-guide"        element={<ProtectedRoute><SOPGuidePage /></ProtectedRoute>} />
        
        {/* Loan guidance routes */}
        <Route path="/loan"                   element={<ProtectedRoute><LoanGuidance /></ProtectedRoute>} />
        <Route path="/loans"                  element={<ProtectedRoute><LoanGuidance /></ProtectedRoute>} />
        
        {/* Tools routes */}
        <Route path="/tools/execution-guides" element={<ProtectedRoute><CountryRoadmapsSection /></ProtectedRoute>} />
        <Route path="/tools/cv-formats"       element={<ProtectedRoute><CVFormatPage /></ProtectedRoute>} />
        <Route path="/tools/resume-formats"   element={<ProtectedRoute><ResumeFormatPage /></ProtectedRoute>} />
        
        <Route path="*" element={
          <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif', background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h2>404 - Page Not Found</h2>
            <a href="/" style={{ color: 'var(--accent-primary)', marginTop: 12, fontWeight: 700 }}>Go Home</a>
          </div>
        } />
      </Routes>
      
      <PremiumOnboardingModal 
        isOpen={onboardingOpen} 
        isDismissible={false} 
        onClose={() => setOnboardingOpen(false)} 
      />

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  )
}
