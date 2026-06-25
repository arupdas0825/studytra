import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF" style={{ flexShrink: 0 }}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

export default function AuthModal({ isOpen, onClose }) {
  const { signInWithGoogle, signInWithApple, authError } = useAuth()
  const { showSuccess, showError } = useToast()
  const navigate = useNavigate()
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [loadingApple, setLoadingApple] = useState(false)

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleGoogle = async () => {
    setLoadingGoogle(true)
    try {
      const result = await signInWithGoogle()
      if (result) {
        showSuccess('Signed in successfully ✓')
        onClose()
        navigate('/chat')
      }
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        showError(err.message || 'Sign-in failed.')
      }
    } finally { setLoadingGoogle(false) }
  }

  const handleApple = async () => {
    setLoadingApple(true)
    try {
      const result = await signInWithApple()
      if (result) {
        showSuccess('Signed in with Apple ✓')
        onClose()
        navigate('/chat')
      }
    } catch (err) {
      showError(err.message || 'Apple sign-in failed.')
    } finally { setLoadingApple(false) }
  }

  return (
    <div className="auth-backdrop" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>

        {/* Back / close */}
        <button className="auth-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {/* Brand */}
        <div className="auth-brand">
          <img src="/studytra-logo.png" alt="Studytra" className="auth-logo" />
          <span className="auth-brand-text">Studytra</span>
        </div>

        {/* Heading */}
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-desc">Sign in to save your roadmap and track your progress.</p>

        {/* Benefit chips */}
        <div className="auth-chips">
          <span className="auth-chip">✓ Personalized Roadmaps</span>
          <span className="auth-chip">✓ Visa Checklists</span>
          <span className="auth-chip">✓ Budget Calculators</span>
          <span className="auth-chip">✓ AI Chat History</span>
        </div>

        {/* Buttons */}
        <div className="auth-btns">
          <button className="auth-btn-google" onClick={handleGoogle} disabled={loadingGoogle || loadingApple}>
            {loadingGoogle ? <span className="auth-spinner dark" /> : <GoogleIcon />}
            <span>{loadingGoogle ? 'Signing in…' : 'Continue with Google'}</span>
          </button>
          <button className="auth-btn-apple" onClick={handleApple} disabled={loadingGoogle || loadingApple}>
            {loadingApple ? <span className="auth-spinner white" /> : <AppleIcon />}
            <span>{loadingApple ? 'Signing in…' : 'Continue with Apple'}</span>
          </button>
        </div>

        {authError && <div className="auth-error">{authError}</div>}

        <div className="auth-or"><span /><span>or</span><span /></div>

        <button className="auth-guest-btn" onClick={onClose}>
          Continue without signing in →
        </button>

        <p className="auth-legal">By continuing, you agree to Studytra's Terms of Service.</p>

      </div>
    </div>
  )
}
