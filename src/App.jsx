import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
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
import AuthModal from './components/auth/AuthModal'
import AppLayout from './layouts/AppLayout'
import PublicLayout from './layouts/PublicLayout'
import AuthConditionalLayout from './layouts/AuthConditionalLayout'
import UniversitiesPage from './pages/UniversitiesPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import OnboardingPage from './pages/OnboardingPage'

function AppContent() {
  const { user, userProfile, loading, authModalOpen, setAuthModalOpen } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Wait until auth state is fully resolved before any redirect
    if (loading) return;
    if (user && userProfile) {
      const isOnboardingDone = userProfile.onboardingCompleted || userProfile.onboardingComplete
      if (!isOnboardingDone) {
        if (location.pathname !== '/onboarding') {
          navigate('/onboarding', { replace: true })
        }
      } else {
        if (location.pathname === '/onboarding') {
          navigate('/chat', { replace: true })
        }
        // If authenticated and onboarding completed, redirect homepage visits to /chat
        if (location.pathname === '/' || location.pathname === '/home' || location.pathname === '/app') {
          navigate('/chat', { replace: true })
        }
      }
    }
  }, [user, userProfile, loading, navigate, location.pathname])

  return (
    <>
      <Routes>
        {/* Strictly Public Layout */}
        <Route element={<PublicLayout />}>
          <Route path="/"                       element={<HomePage />} />
          <Route path="/app"                    element={<HomePage />} />
          <Route path="/home"                   element={<HomePage />} />
        </Route>
        
        {/* Strictly Protected Layout */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/chat"                   element={<ChatPage />} />
          <Route path="/dashboard"              element={<Dashboard />} />
          <Route path="/roadmap"                element={<RoadmapPage />} />
          <Route path="/settings"               element={<SettingsPage />} />
          <Route path="/profile"                element={<ProfilePage />} />
        </Route>
        
        {/* Standalone Protected Page (No sidebar/top nav) */}
        <Route path="/onboarding"             element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
        
        {/* Shared/Conditional Tools Layout */}
        <Route element={<AuthConditionalLayout />}>
          <Route path="/budget"                 element={<BudgetPlanner />} />
          <Route path="/countries"              element={<UniversitiesPage />} />
          <Route path="/universities"           element={<UniversitiesPage />} />
          
          <Route path="/sop"                    element={<SOPGuidePage />} />
          <Route path="/tools/sop-guide"        element={<SOPGuidePage />} />
          
          <Route path="/loan"                   element={<LoanGuidance />} />
          <Route path="/loans"                  element={<LoanGuidance />} />
          
          <Route path="/tools/execution-guides" element={<CountryRoadmapsSection />} />
          <Route path="/tools/cv-formats"       element={<CVFormatPage />} />
          <Route path="/tools/resume-formats"   element={<ResumeFormatPage />} />
        </Route>
        
        <Route path="*" element={
          <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif', background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h2>404 - Page Not Found</h2>
            <a href="/" style={{ color: 'var(--accent-primary)', marginTop: 12, fontWeight: 700 }}>Go Home</a>
          </div>
        } />
      </Routes>

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
