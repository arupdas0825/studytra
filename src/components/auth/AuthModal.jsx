import { useState } from "react";
import { X, Compass, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const getErrorMessage = (code) => ({
  "auth/popup-closed-by-user": "Sign-in was cancelled.",
  "auth/popup-blocked": "Popup was blocked. Please allow popups for this site.",
  "auth/network-request-failed": "Network error. Check your connection.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/cancelled-popup-request": "Sign-in was cancelled.",
})[code] || "Something went wrong. Please try again.";

export default function AuthModal({ isOpen, onClose, onGuestContinue }) {
  const { signInWithGoogle, signInWithApple, authError } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setLocalError(null);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err) {
      setLocalError(getErrorMessage(err.code || err.message));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setAppleLoading(true);
    setLocalError(null);
    try {
      await signInWithApple();
      onClose();
    } catch (err) {
      setLocalError(getErrorMessage(err.code || err.message));
    } finally {
      setAppleLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 3000,
      background: 'rgba(4, 8, 15, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      {/* Modal Card */}
      <div className="glass-card" style={{
        width: '100%', maxWidth: 420,
        background: '#0c1a2e',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: 24,
        padding: '40px 32px',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6), inset 0 2px 20px rgba(255,255,255,0.03)',
        animation: 'authModalFadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        {/* Close button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: 20, right: 20,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%', width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s', color: '#94a3b8'
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f1f5f9'; e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
        >
          <X size={15} />
        </button>

        {/* Logo and Headings */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)'
          }}>
            <Compass size={22} color="white" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9', marginBottom: 8, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Welcome to Studytra
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
            Sign in to save your study plans, sync document checklists, and unlock vertical timelines.
          </p>
        </div>

        {/* Error message display */}
        {(localError || authError) && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: 12, padding: '10px 14px',
            fontSize: '0.78rem', color: '#f87171',
            marginBottom: 24, textAlign: 'center'
          }}>
            {localError || authError}
          </div>
        )}

        {/* Social login buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {/* Google Button */}
          <button 
            onClick={handleGoogleLogin} 
            disabled={googleLoading || appleLoading}
            className="btn-google"
            style={{
              background: '#ffffff',
              color: '#1f1f1f',
              border: 'none',
              padding: '14px 20px',
              borderRadius: 12,
              fontSize: '15px',
              fontWeight: 600,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
              opacity: appleLoading ? 0.6 : 1
            }}
          >
            {googleLoading ? (
              <span className="spinner" />
            ) : (
              <><GoogleIcon /> Continue with Google</>
            )}
          </button>

          {/* Apple Button */}
          <button 
            onClick={handleAppleLogin} 
            disabled={googleLoading || appleLoading}
            className="btn-apple"
            style={{
              background: '#000000',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.15)',
              padding: '14px 20px',
              borderRadius: 12,
              fontSize: '15px',
              fontWeight: 600,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              opacity: googleLoading ? 0.6 : 1
            }}
          >
            {appleLoading ? (
              <span className="spinner" />
            ) : (
              <><AppleIcon /> Continue with Apple</>
            )}
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 24px', opacity: 0.25 }}>
          <div style={{ flex: 1, height: 1, background: '#f1f5f9' }} />
          <span style={{ fontSize: '0.74rem', color: '#f1f5f9', textTransform: 'uppercase', fontWeight: 600 }}>or</span>
          <div style={{ flex: 1, height: 1, background: '#f1f5f9' }} />
        </div>

        {/* Guest option */}
        <button 
          onClick={() => {
            if (onGuestContinue) onGuestContinue();
            onClose();
          }}
          className="btn-ghost"
          style={{
            width: '100%',
            padding: '12px 20px',
            borderRadius: 12,
            fontSize: '0.86rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6
          }}
        >
          Continue without signing in <ArrowRight size={14} />
        </button>

        {/* Fine print */}
        <p style={{ fontSize: '0.68rem', color: '#475569', textAlign: 'center', marginTop: 24, lineHeight: 1.4 }}>
          By continuing, you agree to our Terms of Service. <br />
          Your study plan data remains private and secure.
        </p>
      </div>

      <style>{`
        @keyframes authModalFadeUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(0,0,0,0.1);
          border-top-color: currentColor;
          border-radius: 50%;
          animation: authSpinnerSpin 0.6s linear infinite;
        }
        .btn-apple .spinner {
          border: 2px solid rgba(255,255,255,0.15);
          border-top-color: #ffffff;
        }
        @keyframes authSpinnerSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
