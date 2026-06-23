import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { db } from '../lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import Sidebar from '../components/dashboard/Sidebar'
import Overview from '../components/dashboard/Overview'
import Timeline from '../components/dashboard/Timeline'
import DocumentChecklist from '../components/dashboard/DocumentChecklist'
import VisaGuide from '../components/dashboard/VisaGuide'
import { Landmark, ArrowLeft, RefreshCw } from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, userProfile, loading: authLoading, logout, signInWithGoogle } = useAuth()
  const [progressLoading, setProgressLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [completedSteps, setCompletedSteps] = useState([])
  const [completedDocs, setCompletedDocs] = useState([])
  const [syncing, setSyncing] = useState(false)

  // Map camelCase studyPlan to snake_case profile expected by dashboard components
  const profile = userProfile?.studyPlan ? {
    full_name: userProfile.studyPlan.fullName,
    dream_country: userProfile.studyPlan.dreamCountry,
    target_degree: userProfile.studyPlan.targetDegree,
    target_course: userProfile.studyPlan.targetCourse,
    current_level: userProfile.studyPlan.currentLevel,
    current_university: userProfile.studyPlan.currentUniversity,
    age: userProfile.studyPlan.age
  } : null;

  const loading = authLoading || progressLoading;

  // Load progress once auth loading completes
  useEffect(() => {
    if (authLoading) return

    if (!user) {
      setProgressLoading(false)
      return
    }

    const loadProgress = async () => {
      try {
        const progressRef = doc(db, "progress", user.uid)
        const progressSnap = await getDoc(progressRef)
        if (progressSnap.exists()) {
          const data = progressSnap.data()
          setCompletedSteps(data.completedSteps || data.completed_steps || [])
          setCompletedDocs(data.completedDocs || data.completed_docs || [])
        }
      } catch (err) {
        console.error("Error loading progress from Firestore: ", err)
      } finally {
        setProgressLoading(false)
      }
    }

    loadProgress()
  }, [user, authLoading])

  // Save progress change in Firestore
  const saveProgress = async (newSteps, newDocs) => {
    if (!user) return
    setSyncing(true)
    try {
      const progressRef = doc(db, "progress", user.uid)
      await setDoc(progressRef, {
        uid: user.uid,
        completedSteps: newSteps,
        completed_steps: newSteps,
        completedDocs: newDocs,
        completed_docs: newDocs,
        updatedAt: new Date().toISOString()
      }, { merge: true })
    } catch (err) {
      console.error('Error saving progress to Firestore:', err)
    } finally {
      setSyncing(false)
    }
  }

  const handleToggleStep = (stepId) => {
    const updated = completedSteps.includes(stepId)
      ? completedSteps.filter(id => id !== stepId)
      : [...completedSteps, stepId]
    setCompletedSteps(updated)
    saveProgress(updated, completedDocs)
  }

  const handleToggleDoc = (docId) => {
    const updated = completedDocs.includes(docId)
      ? completedDocs.filter(id => id !== docId)
      : [...completedDocs, docId]
    setCompletedDocs(updated)
    saveProgress(completedSteps, updated)
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (err) {
      console.error('Google Sign-In Error:', err)
    }
  }

  const handleSignOut = async () => {
    try {
      await logout()
      navigate('/')
    } catch (err) {
      console.error('Sign Out Error:', err)
    }
  }

  // ── Rendering states ──

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#050914',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16
      }}>
        <RefreshCw size={36} color="#4f8ef7" className="spin-loader" />
        <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>Loading Dashboard...</span>
        <style>{`
          .spin-loader { animation: spin 1s linear infinite; }
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    )
  }

  // If user is not authenticated, render login page
  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#050914',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow Effects */}
        <div style={{
          position: 'absolute', width: 300, height: 300, background: '#4f8ef7',
          borderRadius: '50%', filter: 'blur(120px)', opacity: 0.12, top: '20%', left: '10%'
        }} />
        <div style={{
          position: 'absolute', width: 300, height: 300, background: '#7c3aed',
          borderRadius: '50%', filter: 'blur(120px)', opacity: 0.12, bottom: '20%', right: '10%'
        }} />

        <div style={{
          maxWidth: 420,
          width: '100%',
          background: 'rgba(15, 33, 53, 0.6)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(79, 142, 247, 0.15)',
          borderRadius: 24,
          padding: '40px 32px',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, #4f8ef7, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(79, 142, 247, 0.25)'
          }}>
            <Landmark size={28} color="#f0f4ff" />
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f0f4ff', margin: '0 0 10px' }}>
            Studytra Dashboard
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: 30 }}>
            Sign in with Google to sync your study abroad checklist, save document progress, and unlock timelines.
          </p>

          <button
            onClick={handleGoogleSignIn}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '13px',
              borderRadius: 12,
              background: '#ffffff',
              color: '#07112a',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              transition: 'transform 0.1s, box-shadow 0.2s',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            {/* Google Icon */}
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.909c1.702-1.567 2.683-3.874 2.683-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.909-2.258c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.707a5.416 5.416 0 0 1-.282-1.707c0-.596.102-1.174.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.579c1.32 0 2.508.454 3.44 1.345l2.582-2.58C13.463.894 11.428 0 9 0A8.997 8.997 0 0 0 .957 4.961l3.007 2.332C4.672 5.163 6.656 3.579 9 3.579z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: 'none',
              border: 'none',
              color: '#4f8ef7',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              margin: '24px auto 0'
            }}
          >
            <ArrowLeft size={14} /> Back to Home
          </button>
        </div>
      </div>
    )
  }

  // If user is authenticated but profile is not completed
  if (!profile) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#050914',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: '#f0f4ff',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: 420,
          background: 'rgba(15, 33, 53, 0.6)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(79, 142, 247, 0.15)',
          borderRadius: 20,
          padding: 32,
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🤔</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8 }}>Profile Incomplete</h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: 24 }}>
            We couldn't find a study plan for your account. Please complete our quick onboarding questions to create your planner!
          </p>
          <button
            onClick={() => navigate('/chat')}
            style={{
              padding: '12px 24px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #4f8ef7 0%, #7c3aed 100%)',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              border: 'none'
            }}
          >
            Start Onboarding Form
          </button>
        </div>
      </div>
    )
  }

  // Render the full dashboard
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#050914',
      color: '#f0f4ff',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        profile={profile}
        onSignOut={handleSignOut}
      />

      {/* Main panel */}
      <main style={{
        flex: 1,
        padding: '32px 36px 80px',
        overflowY: 'auto',
        maxHeight: '100vh',
      }} className="db-main-content">
        
        {/* Top Sync Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: 20,
          height: 24,
        }}>
          {syncing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4f8ef7', fontSize: '0.75rem', fontWeight: 600 }}>
              <RefreshCw size={12} className="spin-loader" />
              Syncing with Supabase...
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#34d399', fontSize: '0.75rem', fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} />
              Progress Saved to Database
            </div>
          )}
        </div>

        {/* Dynamic Tab Body */}
        {activeTab === 'overview' && (
          <Overview
            profile={profile}
            user={user}
            completedSteps={completedSteps}
            completedDocs={completedDocs}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 'timeline' && (
          <Timeline
            profile={profile}
            completedSteps={completedSteps}
            onToggleStep={handleToggleStep}
          />
        )}
        {activeTab === 'documents' && (
          <DocumentChecklist
            completedDocs={completedDocs}
            onToggleDoc={handleToggleDoc}
          />
        )}
        {activeTab === 'visa' && (
          <VisaGuide
            profile={profile}
          />
        )}
      </main>

      <style>{`
        .spin-loader { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        @media (max-width: 768px) {
          .db-main-content {
            padding: 20px 16px 100px !important;
          }
        }
      `}</style>
    </div>
  )
}
