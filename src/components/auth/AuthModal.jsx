import { useState } from "react";
import { X, Compass, Mail, Lock, User, ArrowRight } from "lucide-react";
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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000" style={{ flexShrink: 0 }}>
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
    } catch (err) {
      setError(getErrorMessage(err.code || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      {/* Modal Card */}
      <div style={styles.modalCard}>
        {/* Close Button */}
        <button onClick={onClose} style={styles.closeBtn} aria-label="Close modal">
          <X size={18} />
        </button>

        {/* Logo and Headings */}
        <div style={styles.header}>
          <div style={styles.logoCircle}>
            <Compass size={24} color="#2563EB" />
          </div>
          <h2 style={styles.title}>
            {view === 'options' && "Welcome to Studytra"}
            {view === 'login' && "Sign in to Studytra"}
            {view === 'register' && "Create your account"}
          </h2>
          <p style={styles.subtitle}>
            {view === 'options' && "Your global study journey starts here. Sign in to unlock roadmaps, budget estimators, and templates."}
            {view === 'login' && "Enter your email credentials to access your personalized workspace."}
            {view === 'register' && "Create an account to start planning your international education journey."}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div style={styles.errorBanner}>
            {error}
          </div>
        )}

        {/* ── View 1: Main Login Options ── */}
        {view === 'options' && (
          <div style={styles.optionsContainer}>
            {/* Google Login */}
            <button 
              onClick={handleGoogleLogin} 
              disabled={loading}
              style={styles.googleBtn}
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>

            {/* Apple Login */}
            <button 
              onClick={handleAppleLogin} 
              disabled={loading}
              style={styles.appleBtn}
            >
              <AppleIcon />
              <span>Continue with Apple</span>
            </button>

            {/* Email Login Button */}
            <button 
              onClick={() => { setView('login'); setError(null); }}
              style={styles.emailOptionBtn}
            >
              <Mail size={18} color="#64748B" />
              <span>Continue with Email</span>
            </button>

            <div style={styles.dividerRow}>
              <div style={styles.dividerLine} />
              <span style={styles.dividerText}>or</span>
              <div style={styles.dividerLine} />
            </div>

            {/* Create Account Toggle */}
            <button 
              onClick={() => { setView('register'); setError(null); }}
              style={styles.registerToggleBtn}
            >
              Create an Account
            </button>
          </div>
        )}

        {/* ── View 2: Email Sign In or View 3: Registration Form ── */}
        {view !== 'options' && (
          <form onSubmit={handleEmailSubmit} style={styles.form}>
            {view === 'register' && (
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Full Name</label>
                <div style={styles.inputContainer}>
                  <User size={18} style={styles.inputIcon} />
                  <input 
                    type="text" 
                    placeholder="e.g. Arup Das" 
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    style={styles.input}
                    required
                  />
                </div>
              </div>
            )}

            <div style={styles.inputWrapper}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputContainer}>
                <Mail size={18} style={styles.inputIcon} />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.inputWrapper}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputContainer}>
                <Lock size={18} style={styles.inputIcon} />
                <input 
                  type="password" 
                  placeholder="Enter your password" 
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={styles.submitBtn}
            >
              {loading ? (
                <span className="spinner" style={styles.spinner} />
              ) : (
                <>
                  <span>{view === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <button 
              type="button"
              onClick={() => { setView('options'); setError(null); }}
              style={styles.backBtn}
            >
              Back to all options
            </button>
          </form>
        )}

        {/* Footer info */}
        <p style={styles.fineprint}>
          By continuing, you agree to our Terms of Service. <br />
          Your study plan data remains private and secure.
        </p>
      </div>

      <style>{`
        @keyframes authModalFadeUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: 'rgba(252, 252, 253, 0.85)',
    backdropFilter: 'blur(16px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
  },
  modalCard: {
    width: '100%',
    maxWidth: 440,
    background: '#FFFFFF',
    border: '1px solid rgba(15, 23, 42, 0.08)',
    borderRadius: 28,
    padding: '40px 32px 32px',
    position: 'relative',
    boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)',
    animation: 'authModalFadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
  },
  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    background: '#FFFFFF',
    border: '1px solid rgba(15, 23, 42, 0.08)',
    borderRadius: '50%',
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#64748B',
    transition: 'all 0.2s',
    '&:hover': {
      background: '#F8FAFC',
      color: '#0F172A'
    }
  },
  header: {
    textAlign: 'center',
    marginBottom: 28
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: '#EFF6FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px'
  },
  title: {
    fontSize: '1.45rem',
    fontWeight: 800,
    color: '#0F172A',
    margin: '0 0 8px',
    letterSpacing: '-0.02em'
  },
  subtitle: {
    fontSize: '0.86rem',
    color: '#64748B',
    lineHeight: 1.5,
    margin: 0
  },
  errorBanner: {
    background: '#FEF2F2',
    border: '1px solid #FEE2E2',
    borderRadius: 12,
    padding: '10px 14px',
    fontSize: '0.8rem',
    color: '#EF4444',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 500
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  googleBtn: {
    background: '#FFFFFF',
    color: '#0F172A',
    border: '1px solid rgba(15, 23, 42, 0.08)',
    padding: '0 24px',
    height: 56,
    borderRadius: 16,
    fontSize: '0.94rem',
    fontWeight: 700,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
  },
  appleBtn: {
    background: '#FFFFFF',
    color: '#000000',
    border: '1px solid rgba(15, 23, 42, 0.08)',
    padding: '0 24px',
    height: 56,
    borderRadius: 16,
    fontSize: '0.94rem',
    fontWeight: 700,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
  },
  emailOptionBtn: {
    background: '#FFFFFF',
    color: '#0F172A',
    border: '1px solid rgba(15, 23, 42, 0.08)',
    padding: '0 24px',
    height: 56,
    borderRadius: 16,
    fontSize: '0.94rem',
    fontWeight: 700,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
  },
  dividerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: '12px 0',
    opacity: 0.8
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: 'rgba(15, 23, 42, 0.06)'
  },
  dividerText: {
    fontSize: '0.76rem',
    color: '#64748B',
    textTransform: 'uppercase',
    fontWeight: 700
  },
  registerToggleBtn: {
    width: '100%',
    border: '1.5px dashed rgba(37, 99, 235, 0.2)',
    background: 'rgba(37, 99, 235, 0.02)',
    color: '#2563EB',
    height: 56,
    borderRadius: 16,
    fontSize: '0.94rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      background: 'rgba(37, 99, 235, 0.05)',
      borderColor: '#2563EB'
    }
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6
  },
  label: {
    fontSize: '0.82rem',
    fontWeight: 700,
    color: '#0F172A'
  },
  inputContainer: {
    position: 'relative'
  },
  inputIcon: {
    position: 'absolute',
    left: 18,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#64748B',
    pointerEvents: 'none'
  },
  input: {
    width: '100%',
    background: '#FFFFFF',
    border: '1px solid rgba(15, 23, 42, 0.08)',
    borderRadius: 16,
    padding: '0 20px 0 46px',
    height: 56,
    color: '#0F172A',
    fontSize: '0.96rem',
    fontWeight: 500,
    outline: 'none',
    transition: 'all 0.25s',
    boxSizing: 'border-box',
    '&:focus': {
      borderColor: '#2563EB',
      boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.08)'
    }
  },
  submitBtn: {
    background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
    color: '#FFFFFF',
    border: 'none',
    height: 56,
    borderRadius: 16,
    fontSize: '0.96rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    cursor: 'pointer',
    marginTop: 8,
    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.2)',
    transition: 'all 0.2s'
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#64748B',
    fontSize: '0.86rem',
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'center',
    padding: '4px 0',
    transition: 'all 0.2s',
    '&:hover': {
      color: '#0F172A'
    }
  },
  fineprint: {
    fontSize: '0.68rem',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 1.45
  },
  spinner: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.2)',
    borderTopColor: 'white',
    animation: 'spin 0.8s linear infinite',
  }
};
