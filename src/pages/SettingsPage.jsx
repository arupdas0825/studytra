import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useNavigate } from 'react-router-dom'
import { Settings, Shield, Trash2, RotateCcw, AlertTriangle, RefreshCw, Info } from 'lucide-react'
import { db } from '../lib/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { AI_CONFIG } from '../services/ai/config'

export default function SettingsPage() {
  const { user, userProfile, logout } = useAuth()
  const { showSuccess, showError, showInfo } = useToast()
  const navigate = useNavigate()
  const [resetting, setResetting] = useState(false)

  const handleResetOnboarding = async () => {
    if (!user) return
    const confirmReset = window.confirm(
      "Are you sure you want to reset your onboarding?\n\nThis will clear your personalized study abroad profile details and require you to complete the onboarding questionnaire again."
    )
    
    if (!confirmReset) return
    
    setResetting(true)
    try {
      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, {
        onboardingComplete: false,
        studyPlan: null
      })
      
      // Clear local sessionStorage cache too
      sessionStorage.removeItem('studentProfile')
      
      showSuccess("Onboarding reset successfully! Redirecting...")
      
      // Trigger hard reload to re-run onboarding modal
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
    } catch (err) {
      console.error(err)
      showError("Failed to reset onboarding preferences.")
    } finally {
      setResetting(false)
    }
  }

  const handleClearLocalCache = () => {
    sessionStorage.clear()
    localStorage.removeItem('chat_sessions_local')
    showSuccess("Local browser cache cleared successfully!")
  }

  return (
    <div style={{
      maxWidth: 800,
      margin: '0 auto',
      padding: '40px 24px 80px',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      {/* Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF'
        }}>
          <Settings size={20} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Settings & Control Panel</h1>
          <p style={{ color: '#64748B', fontSize: '0.88rem', margin: '4px 0 0' }}>Configure account preferences, clear data, and reset system status.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Account Info Card */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid rgba(15, 23, 42, 0.08)',
          borderRadius: 24,
          padding: '30px',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
        }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={18} color="#2563EB" /> Account Security
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(15,23,42,0.04)', paddingBottom: 10 }}>
              <span style={{ fontSize: '0.88rem', color: '#64748B', fontWeight: 500 }}>Email Address</span>
              <span style={{ fontSize: '0.88rem', color: '#0F172A', fontWeight: 700 }}>{user?.email || 'Guest Student'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 4 }}>
              <span style={{ fontSize: '0.88rem', color: '#64748B', fontWeight: 500 }}>Authentication Provider</span>
              <span style={{ fontSize: '0.88rem', color: '#2563EB', fontWeight: 700, textTransform: 'capitalize' }}>
                {user?.providerData?.[0]?.providerId || 'Email/Password'}
              </span>
            </div>
          </div>
        </div>

        {/* Data Management Card */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid rgba(15, 23, 42, 0.08)',
          borderRadius: 24,
          padding: '30px',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
        }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={18} color="#EF4444" /> Danger Zone
          </h3>
          
          <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.5, marginBottom: 20 }}>
            Configure sensitive actions to reset your study profile state or clear locally stored browser preferences.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Action 1: Reset Onboarding */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              gap: 20, 
              padding: '16px',
              border: '1px solid rgba(239, 68, 68, 0.12)',
              background: 'rgba(239, 68, 68, 0.01)',
              borderRadius: 16 
            }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>Reset Onboarding Checklist</h4>
                <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '4px 0 0', lineHeight: 1.4 }}>
                  Clears onboarding details and forces you to run through the questionnaire to rebuild your study roadmaps.
                </p>
              </div>
              <button
                onClick={handleResetOnboarding}
                disabled={resetting}
                style={{
                  padding: '10px 20px',
                  borderRadius: 10,
                  background: '#EF4444',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                {resetting ? <RefreshCw size={14} className="spin-loader" /> : <RotateCcw size={14} />}
                Reset Profile
              </button>
            </div>

            {/* Action 2: Clear Cache */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              gap: 20, 
              padding: '16px',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              borderRadius: 16 
            }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>Clear Local Browser Data</h4>
                <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '4px 0 0', lineHeight: 1.4 }}>
                  Clears local session storage cache, restoring the default state without deleting database profiles.
                </p>
              </div>
              <button
                onClick={handleClearLocalCache}
                style={{
                  padding: '10px 20px',
                  borderRadius: 10,
                  background: '#FFFFFF',
                  color: '#64748B',
                  border: '1px solid rgba(15, 23, 42, 0.12)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(15,23,42,0.03)'; e.currentTarget.style.color = '#0F172A' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = '#64748B' }}
              >
                <Trash2 size={14} />
                Clear Local Data
              </button>
            </div>
          </div>
        </div>

        {/* System Info Card */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid rgba(15, 23, 42, 0.08)',
          borderRadius: 24,
          padding: '30px',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
        }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Info size={18} color="#2563EB" /> System Information
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.8rem', color: '#64748B' }}>
            <div>App Version: <span style={{ fontWeight: 700, color: '#0F172A' }}>0.0.1</span></div>
            <div>AI Core: <span style={{ fontWeight: 700, color: '#0F172A' }}>Groq ({AI_CONFIG.model})</span></div>
            <div>Environment: <span style={{ fontWeight: 700, color: '#0F172A' }}>Development</span></div>
          </div>
        </div>
      </div>

      <style>{`
        .spin-loader { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
