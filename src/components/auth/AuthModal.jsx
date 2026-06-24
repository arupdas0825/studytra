import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Mail, Lock, User, ArrowRight } from "lucide-react";
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

const getErrorMessage = (code) => ({
  "auth/popup-closed-by-user": "Sign-in was cancelled.",
  "auth/popup-blocked": "Popup was blocked. Please allow popups for this site.",
  "auth/network-request-failed": "Network error. Check your connection.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/cancelled-popup-request": "Sign-in was cancelled.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/email-already-in-use": "An account already exists with this email.",
  "auth/weak-password": "Password should be at least 6 characters.",
})[code] || "Authentication failed. Please try again.";

export default function AuthModal({ isOpen, onClose }) {
  const { signInWithGoogle, signInWithApple, loginWithEmail, registerWithEmail } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  
  // Modal Views: 'options', 'login', 'register'
  const [view, setView] = useState('options');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Email form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Escape key close listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const updateField = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    setError(null);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      showSuccess("Signed in successfully with Google 🎉");
      onClose();
      navigate('/chat');
    } catch (err) {
      setError(getErrorMessage(err.code || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithApple();
      showSuccess("Signed in successfully with Apple 🎉");
      onClose();
      navigate('/chat');
    } catch (err) {
      setError(getErrorMessage(err.code || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      if (view === 'login') {
        await loginWithEmail(form.email, form.password);
        showSuccess("Logged in successfully ✓");
      } else {
        if (!form.name.trim()) {
          setError("Name is required to create an account.");
          setLoading(false);
          return;
        }
        await registerWithEmail(form.email, form.password, form.name);
        showSuccess("Account created successfully 🎉");
      }
      onClose();
      navigate('/chat');
    } catch (err) {
      setError(getErrorMessage(err.code || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    onClose();
    navigate('/budget'); // Take guest to budget calculator as a trial
  };

  return (
    <div className="auth-backdrop" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button onClick={onClose} className="auth-close" aria-label="Close modal">
          <X size={16} />
        </button>

        {/* Brand Header */}
        <div className="auth-brand">
          <img src="/studytra-logo.png" alt="Studytra Logo" className="auth-logo" />
          <span className="auth-brand-name">Studytra</span>
        </div>

        {/* Dynamic Titles */}
        <h2 className="auth-title">
          {view === 'options' && "Welcome to Studytra"}
          {view === 'login' && "Sign In"}
          {view === 'register' && "Create Account"}
        </h2>
        <p className="auth-subtitle">
          {view === 'options' && "Join thousands of Indian students mapping out their study abroad journey."}
          {view === 'login' && "Enter your credentials below to access your workspace."}
          {view === 'register' && "Create an account to start building your study abroad profile."}
        </p>

        {/* Interactive Benefit Chips */}
        {view === 'options' && (
          <div className="auth-benefits">
            <div className="auth-benefit-chip">
              <span className="check">✓</span> Personalized Roadmaps
            </div>
            <div className="auth-benefit-chip">
              <span className="check">✓</span> Visa Checklists
            </div>
            <div className="auth-benefit-chip">
              <span className="check">✓</span> Budget Calculators
            </div>
            <div className="auth-benefit-chip">
              <span className="check">✓</span> Free Templates
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div style={{
            background: 'rgba(220, 38, 38, 0.08)',
            border: '1px solid rgba(220, 38, 38, 0.2)',
            color: '#dc2626',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            fontSize: '12.5px',
            fontWeight: 600,
            marginBottom: 20,
            lineHeight: 1.4
          }}>
            {error}
          </div>
        )}

        {/* View 1: Main Login Options */}
        {view === 'options' && (
          <div className="auth-buttons">
            <button onClick={handleGoogleLogin} disabled={loading} className="btn-auth-google">
              <GoogleIcon />
              Continue with Google
            </button>
            <button onClick={handleAppleLogin} disabled={loading} className="btn-auth-apple">
              <AppleIcon />
              Continue with Apple
            </button>

            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">or</span>
              <div className="auth-divider-line" />
            </div>

            <button 
              onClick={() => { setView('login'); setError(null); }} 
              className="btn btn-md btn-soft btn-pill"
              style={{ width: '100%' }}
            >
              <Mail size={16} /> Continue with Email
            </button>
            
            <button 
              onClick={() => { setView('register'); setError(null); }} 
              className="btn btn-md btn-ghost btn-pill"
              style={{ width: '100%', marginTop: 4 }}
            >
              Create Email Account
            </button>

            <div className="auth-divider" style={{ marginTop: 8 }} />

            <button onClick={handleGuestLogin} className="btn-auth-guest">
              Skip & Continue as Guest →
            </button>
          </div>
        )}

        {/* View 2 & 3: Email Forms */}
        {view !== 'options' && (
          <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {view === 'register' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                  <input 
                    type="text" 
                    placeholder="e.g. Arup Das" 
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    style={{ width: '100%', paddingLeft: 40 }}
                    required
                  />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  style={{ width: '100%', paddingLeft: 40 }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input 
                  type="password" 
                  placeholder="At least 6 characters" 
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  style={{ width: '100%', paddingLeft: 40 }}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-md btn-primary btn-pill"
              style={{ width: '100%', marginTop: 8 }}
            >
              {loading ? (
                <span className="btn-spinner" />
              ) : (
                <>
                  <span>{view === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <button 
              type="button"
              onClick={() => { setView('options'); setError(null); }}
              className="btn btn-md btn-ghost btn-pill"
              style={{ width: '100%' }}
            >
              Back to all options
            </button>
          </form>
        )}

        {/* Legal Disclaimer */}
        <p className="auth-legal" style={{ marginTop: 16 }}>
          By continuing, you agree to Studytra's Terms of Service.<br />
          Your study plan data remains private and secure.
        </p>
      </div>
    </div>
  );
}
