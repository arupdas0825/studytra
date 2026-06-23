import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Menu, X, ChevronDown, Sparkles, AlertCircle, Compass, CheckCircle2,
  DollarSign, FileText, Landmark, BarChart3, Star, Github, ArrowRight,
  TrendingUp, Globe, Clock, ArrowUpRight, LogOut, LayoutDashboard, MessageSquare, Settings
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import AuthModal from '../components/auth/AuthModal'
import { COUNTRIES } from '../constants/countries'
import '../styles/landing.css'

// Reusable CountUp Component using IntersectionObserver
function CountUp({ target, suffix = '', duration = 1500 }) {
  const [count, setCount] = useState(0)
  const elementRef = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        let start = 0
        const step = target / (duration / 16)
        const timer = setInterval(() => {
          start += step
          if (start >= target) {
            setCount(target)
            clearInterval(timer)
          } else {
            setCount(Math.floor(start))
          }
        }, 16)
      }
    }, { threshold: 0.1 })

    obs.observe(el)
    return () => obs.disconnect()
  }, [target, duration])

  return <span ref={elementRef}>{count.toLocaleString('en-IN')}{suffix}</span>
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { showSuccess } = useToast()
  
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false) // tools dropdown
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  const avatarDropdownRef = useRef(null)

  // Outside click listener for avatar dropdown self-closure
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (avatarDropdownRef.current && !avatarDropdownRef.current.contains(e.target)) {
        setAvatarDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  // Scroll detection for Navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fade-in trigger on scroll
  useEffect(() => {
    const els = document.querySelectorAll('.fade-in')
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.08 })
    
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const handleSignOut = async () => {
    try {
      await logout()
      showSuccess("Successfully signed out ✓")
      setAvatarDropdownOpen(false)
    } catch (err) {
      console.error("Sign out failed: ", err)
    }
  }

  const getInitials = () => {
    if (!user) return "?"
    if (user.displayName) return user.displayName.charAt(0).toUpperCase()
    if (user.email) return user.email.charAt(0).toUpperCase()
    return "?"
  }

  return (
    <div className="landing-root">
      {/* Background radial blurs */}
      <div className="bg-blob-1" />
      <div className="bg-blob-2" />

      {/* ══════════════════════════════
          1. NAVBAR
      ══════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(4, 8, 15, 0.92)' : 'rgba(4, 8, 15, 0.65)',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(59, 130, 246, 0.15)' : '1px solid transparent',
        transition: 'all 0.3s ease',
        height: 72,
        display: 'flex', alignItems: 'center'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {/* Logo */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)'
            }}>
              <Compass size={18} color="white" />
            </div>
            <span style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800,
              fontSize: '1.25rem', color: '#f1f5f9', letterSpacing: '-0.02em'
            }}>Studytra</span>
          </a>

          {/* Center Links (Desktop) */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} className="desk-nav">
            <a href="#how-it-works" style={{ padding: '8px 16px', fontSize: '0.88rem', fontWeight: 600, color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#3b82f6'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>How It Works</a>
            <a href="#countries" style={{ padding: '8px 16px', fontSize: '0.88rem', fontWeight: 600, color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#3b82f6'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>Countries</a>
            
            {/* Tools Dropdown */}
            <div style={{ position: 'relative' }} onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none',
                padding: '8px 16px', fontSize: '0.88rem', fontWeight: 600, color: dropdownOpen ? '#3b82f6' : '#94a3b8',
                cursor: 'pointer', transition: 'color 0.2s'
              }}>
                Tools <ChevronDown size={14} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {dropdownOpen && (
                <div style={{
                  position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                  paddingTop: 8, minWidth: 260, zIndex: 999
                }}>
                  <div style={{
                    background: '#0c1a2e', borderRadius: 16, border: '1px solid rgba(59, 130, 246, 0.15)',
                    padding: 8, boxShadow: 'var(--glow-card)'
                  }}>
                    <a href="/budget" style={{ display: 'block', padding: '10px 14px', borderRadius: 10, textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f1f5f9' }}>💰 Budget Estimator</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>Evaluate living costs in INR with live rates.</div>
                    </a>
                    <a href="/tools/sop-guide" style={{ display: 'block', padding: '10px 14px', borderRadius: 10, textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f1f5f9' }}>✍️ SOP Writing Framework</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>Country-specific structures and samples.</div>
                    </a>
                    <a href="/loans" style={{ display: 'block', padding: '10px 14px', borderRadius: 10, textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f1f5f9' }}>🏦 Education Loan Advisor</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>Compare interest rates and checklists.</div>
                    </a>
                  </div>
                </div>
              )}
            </div>

            <a href="#reviews" style={{ padding: '8px 16px', fontSize: '0.88rem', fontWeight: 600, color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#3b82f6'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>Reviews</a>
          </div>

          {/* Right Action buttons */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {user ? (
              <div style={{ position: 'relative' }} ref={avatarDropdownRef}>
                {/* User Avatar Circle */}
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      cursor: 'pointer',
                      border: '2px solid #3b82f6',
                      boxShadow: '0 0 10px rgba(59,130,246,0.3)',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div
                    onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#f1f5f9',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      boxShadow: '0 0 10px rgba(59,130,246,0.3)',
                    }}
                  >
                    {getInitials()}
                  </div>
                )}

                {/* Avatar Dropdown Panel */}
                {avatarDropdownOpen && (
                  <div style={{
                    position: 'absolute', top: '120%', right: 0,
                    width: 240, background: 'rgba(12, 26, 46, 0.96)',
                    backdropFilter: 'blur(20px)', border: '1px solid rgba(59, 130, 246, 0.18)',
                    borderRadius: 16, padding: '14px', zIndex: 1000,
                    boxShadow: 'var(--glow-card)',
                    animation: 'avatarDropdownFadeUp 0.18s ease',
                    textAlign: 'left'
                  }}>
                    {/* User info */}
                    <div style={{ marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.displayName || "Studytra Student"}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
                        {user.email}
                      </div>
                    </div>

                    {/* Navigation links */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                      <a href="/dashboard" onClick={() => setAvatarDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, fontSize: '0.82rem', color: '#cbd5e1', textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                        <LayoutDashboard size={14} color="#3b82f6" />
                        <span>Dashboard</span>
                      </a>
                      <a href="/chat" onClick={() => setAvatarDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, fontSize: '0.82rem', color: '#cbd5e1', textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                        <MessageSquare size={14} color="#7c3aed" />
                        <span>My Chats</span>
                      </a>
                      <a href="/app" onClick={() => setAvatarDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, fontSize: '0.82rem', color: '#cbd5e1', textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                        <Settings size={14} color="#94a3b8" />
                        <span>Planning Home</span>
                      </a>
                    </div>

                    {/* Sign Out Button */}
                    <button
                      onClick={handleSignOut}
                      style={{
                        width: '100%', background: 'rgba(239, 68, 68, 0.08)',
                        color: '#ef4444', padding: '8px', border: '1px solid rgba(239, 68, 68, 0.15)',
                        borderRadius: 10, fontSize: '0.78rem', fontWeight: 700,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)' }}
                    >
                      <LogOut size={13} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button onClick={() => setAuthModalOpen(true)} className="btn-ghost desk-nav" style={{ padding: '8px 18px', fontSize: '0.82rem', borderRadius: 30, border: 'none' }}>
                  Sign In
                </button>
                <a href="/app" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.82rem', borderRadius: 30 }}>
                  Start Planning →
                </a>
              </>
            )}

            {/* Mobile Hamburger toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }} 
              className="burger"
            >
              {mobileMenuOpen ? <X size={24} color="#f1f5f9" /> : <Menu size={24} color="#f1f5f9" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed', top: 72, left: 0, right: 0, background: '#080f1a',
          borderBottom: '1px solid rgba(59, 130, 246, 0.15)', padding: '20px 24px',
          display: 'flex', flexDirection: 'column', gap: 16, zIndex: 999,
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: '#f1f5f9', textDecoration: 'none' }}>How It Works</a>
          <a href="#countries" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: '#f1f5f9', textDecoration: 'none' }}>Countries</a>
          <a href="/budget" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: '#f1f5f9', textDecoration: 'none' }}>💰 Budget Estimator</a>
          <a href="/tools/sop-guide" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: '#f1f5f9', textDecoration: 'none' }}>✍️ SOP Guide</a>
          <a href="/loans" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: '#f1f5f9', textDecoration: 'none' }}>🏦 Loan Guide</a>
          <a href="#reviews" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: '#f1f5f9', textDecoration: 'none' }}>Reviews</a>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
            {user ? (
              <div style={{
                background: 'rgba(59, 130, 246, 0.05)',
                border: '1px solid rgba(59, 130, 246, 0.15)',
                borderRadius: 12,
                padding: '12px',
                marginBottom: 8
              }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#f1f5f9' }}>{user.displayName || "Studytra Student"}</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: 12 }}>{user.email}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <a href="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '0.84rem', color: '#3b82f6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <LayoutDashboard size={14} /> Dashboard
                  </a>
                  <a href="/chat" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '0.84rem', color: '#7c3aed', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MessageSquare size={14} /> My Chats
                  </a>
                  <button onClick={() => { setMobileMenuOpen(false); handleSignOut(); }} style={{
                    background: 'none', border: 'none', color: '#ef4444', textAlign: 'left',
                    fontSize: '0.84rem', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                  }}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => { setMobileMenuOpen(false); setAuthModalOpen(true); }} style={{ padding: '12px', width: '100%' }} className="btn-ghost">
                Sign In / Sign Up
              </button>
            )}
            <a href="/app" onClick={() => setMobileMenuOpen(false)} style={{ padding: '12px', width: '100%', textAlign: 'center' }} className="btn-primary">
              Start Planning Free →
            </a>
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          2. HERO SECTION
      ══════════════════════════════ */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        padding: '120px 24px 80px', position: 'relative'
      }}>
        <div className="container hero-grid" style={{
          display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'center',
          width: '100%'
        }}>
          
          {/* Left Text Column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} className="hero-text-col">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.25)',
              borderRadius: 30, padding: '6px 16px', marginBottom: 24
            }}>
              <Sparkles size={13} color="#60a5fa" />
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#60a5fa', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                AI-Powered Study Abroad Platform
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.4rem, 6vw, 4.2rem)', fontWeight: 800,
              lineHeight: 1.1, color: '#f1f5f9', marginBottom: 12
            }}>
              Plan Your Future<br />
              <span className="gradient-text">Abroad with AI.</span>
            </h1>

            <h3 style={{
              fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 700,
              color: '#a78bfa', marginBottom: 20
            }}>
              Zero Confusion. Zero Consultancy Fees.
            </h3>

            <p style={{
              fontSize: '1.05rem', color: '#94a3b8', lineHeight: 1.7,
              maxWidth: 560, marginBottom: 36
            }}>
              Studytra gives Indian students a personalized roadmap to study in Europe, USA, Canada & more — with real-time AI guidance, checklists, budget tools, and writing guides. All 100% free.
            </p>

            {/* Trust Pills */}
            <div style={{
              display: 'flex', gap: 14, flexWrap: 'wrap',
              fontSize: '0.84rem', fontWeight: 600, color: '#cbd5e1',
              marginBottom: 36, borderBottom: '1px solid rgba(59,130,246,0.1)',
              paddingBottom: 16, width: '100%', maxWidth: 500
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>🎓 AI Chatbot</span>
              <span style={{ color: 'rgba(59,130,246,0.2)' }}>|</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>🌍 6 Destinations</span>
              <span style={{ color: 'rgba(59,130,246,0.2)' }}>|</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>✅ 100% Free Forever</span>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', width: '100%' }}>
              <a href="/app" className="btn-primary" style={{ padding: '16px 36px', fontSize: '1.05rem' }}>
                Start Planning Free →
              </a>
              <a href="#how-it-works" className="btn-ghost" style={{ padding: '16px 32px', fontSize: '1.05rem' }}>
                Watch How It Works ↓
              </a>
            </div>
          </div>

          {/* Right Visual Floating Card Column */}
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            {/* Ambient backglow */}
            <div style={{
              position: 'absolute', width: 280, height: 280, background: '#3b82f6',
              borderRadius: '50%', filter: 'blur(100px)', opacity: 0.2, top: '20%', left: '20%',
              zIndex: 0
            }} />

            {/* Floating Active Plan Card */}
            <div className="glass-card floating-card" style={{
              width: '100%', maxWidth: 360, padding: 24, zIndex: 10,
              border: '1px solid rgba(59, 130, 246, 0.25)',
              background: 'rgba(12, 26, 46, 0.85)',
              position: 'relative'
            }}>
              {/* Card top */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#3b82f6', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Active Plan
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f1f5f9', background: 'rgba(59, 130, 246, 0.12)', padding: '3px 10px', borderRadius: 20 }}>
                  🇩🇪 Germany
                </span>
              </div>

              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f1f5f9', margin: '0 0 6px' }}>
                Germany · M.Sc CS
              </h4>
              <p style={{ fontSize: '0.76rem', color: '#94a3b8', margin: '0 0 24px' }}>
                Target Intake: October 2028
              </p>

              {/* Progress Steps list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f1f5f9', fontWeight: 600 }}>
                    <CheckCircle2 size={15} color="#34d399" />
                    <span>IELTS Preparation</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700, background: 'rgba(52, 211, 153, 0.1)', padding: '2px 8px', borderRadius: 4 }}>
                    Active
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem', opacity: 0.65 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8' }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid #94a3b8' }} />
                    <span>University Shortlist</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                    Pending
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem', opacity: 0.65 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8' }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid #94a3b8' }} />
                    <span>SOP Writing Guide</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                    Pending
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem', opacity: 0.65 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8' }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid #94a3b8' }} />
                    <span>Student Visa Application</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                    Pending
                  </span>
                </div>
              </div>

              {/* Progress bar info */}
              <div style={{ borderTop: '1px solid rgba(59, 130, 246, 0.12)', paddingTop: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: '0.78rem' }}>
                  <span style={{ color: '#94a3b8' }}>Overall Roadmap Progress</span>
                  <strong style={{ color: '#34d399', fontWeight: 800 }}>25%</strong>
                </div>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', borderRadius: 10, height: 8, overflow: 'hidden' }}>
                  <div className="progress-fill" style={{ background: 'linear-gradient(90deg, #3b82f6 0%, #10b981 100%)', height: '100%', borderRadius: 10, width: 0 }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll bouncing Indicator */}
        <div style={{
          position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, zIndex: 10
        }} className="desk-nav">
          <span style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scroll Down</span>
          <div style={{
            width: 14, height: 22, borderRadius: 10, border: '1.5px solid #64748b',
            display: 'flex', justifyContent: 'center', padding: '3px 0'
          }}>
            <div style={{
              width: 3, height: 5, borderRadius: '50%', background: '#60a5fa',
              animation: 'bounce-wheel 1.5s infinite'
            }} />
          </div>
          <style>{`
            @keyframes bounce-wheel {
              0% { transform: translateY(0); opacity: 1; }
              50% { transform: translateY(6px); opacity: 0.3; }
              100% { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
      </section>

      {/* ══════════════════════════════
          3. PROBLEM STATEMENT
      ══════════════════════════════ */}
      <section style={{
        background: '#080f1a', padding: '100px 24px', position: 'relative',
        borderTop: '1px solid rgba(59, 130, 246, 0.1)', borderBottom: '1px solid rgba(59, 130, 246, 0.1)'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto 60px' }} className="fade-in">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 30, padding: '5px 14px', marginBottom: 16
            }}>
              <AlertCircle size={13} color="#f87171" />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f87171', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                The Harsh Reality
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800,
              lineHeight: 1.2, color: '#f1f5f9'
            }}>
              Indian Students Spend ₹2–5 Lakh on Consultancies That Do What AI Can Do for Free.
            </h2>
          </div>

          {/* Problem Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 56 }} className="fade-in">
            {/* Card 1 */}
            <div className="glass-card" style={{ padding: 32 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: 'rgba(239, 68, 68, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
                marginBottom: 20
              }}>😤</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 12, color: '#f1f5f9' }}>Scattered Information</h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6 }}>
                Visa steps on government portals, living costs on Reddit, university details on outdated blogs, and SOP tips on YouTube. It's overwhelming and highly unreliable.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass-card" style={{ padding: 32 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: 'rgba(239, 68, 68, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
                marginBottom: 20
              }}>💸</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 12, color: '#f1f5f9' }}>Expensive Consultancies</h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6 }}>
                Traditional agents charge ₹50,000 to ₹2,00,000 for standard guidelines and university filing. They push you toward high-commission partners instead of your dream school.
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass-card" style={{ padding: 32 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: 'rgba(239, 68, 68, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
                marginBottom: 20
              }}>⏰</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 12, color: '#f1f5f9' }}>Missed Deadlines</h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6 }}>
                Application windows are extremely tight, and documentation rules vary. One missed document, incorrect CV layout, or wrong deadline can push your dreams back by an entire year.
              </p>
            </div>
          </div>

          {/* Subheading text */}
          <div style={{ textAlign: 'center' }} className="fade-in">
            <p style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              <span className="gradient-text">Studytra fixes all three — for free.</span>
            </p>
          </div>
        </div>

        {/* ── Statistics Strip ── */}
        <div className="container stats-row" style={{
          marginTop: 80, borderTop: '1px solid rgba(59,130,246,0.1)', paddingTop: 56,
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#3b82f6', fontFamily: 'Plus Jakarta Sans' }}>
              <CountUp target={15480} suffix="+" />
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              AI Sessions Started
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#7c3aed', fontFamily: 'Plus Jakarta Sans' }}>
              <CountUp target={6} />
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Target Countries
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#06b6d4', fontFamily: 'Plus Jakarta Sans' }}>
              ₹<CountUp target={3} suffix=" Cr+" />
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Saved in Consultancy Fees
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          4. HOW IT WORKS
      ══════════════════════════════ */}
      <section id="how-it-works" style={{ padding: '100px 24px' }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 72 }} className="fade-in">
            <span style={{
              display: 'inline-block', background: 'rgba(124, 58, 237, 0.1)',
              border: '1px solid rgba(124, 58, 237, 0.25)', color: '#a78bfa',
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '5px 14px', borderRadius: 30, marginBottom: 16
            }}>
              Process
            </span>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800,
              color: '#f1f5f9', fontFamily: 'Plus Jakarta Sans, sans-serif'
            }}>
              From Confusion to Clarity in 3 Steps
            </h2>
          </div>

          {/* Steps blocks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 110 }}>
            {/* Step 1 */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 48, alignItems: 'center'
            }} className="step-block fade-in">
              {/* Text */}
              <div>
                <div style={{ fontSize: '2.8rem', fontWeight: 800, color: 'rgba(59, 130, 246, 0.25)', marginBottom: 8 }}>
                  01
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f1f5f9', marginBottom: 16 }}>
                  Tell Us Your Dream
                </h3>
                <p style={{ fontSize: '0.94rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: 20 }}>
                  Fill in a quick, secure profile about your current education, university background, budget limits, and dream destinations. It takes less than 2 minutes and needs no login.
                </p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: '0.86rem', color: '#cbd5e1' }}>
                  <CheckCircle2 size={15} color="#3b82f6" />
                  <span>Interactive country, degree, and intake onboarding</span>
                </div>
              </div>
              {/* Mockup */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="glass-card" style={{
                  width: '100%', maxWidth: 380, padding: 20, background: '#0c1a2e',
                  border: '1px solid rgba(59, 130, 246, 0.15)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ fontSize: '0.65rem', color: '#475569', marginLeft: 6 }}>onboarding_form.jsx</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: 10, fontWeight: 700, textTransform: 'uppercase' }}>
                    1. Select Dream Country
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                    <div style={{ border: '1px solid #3b82f6', background: 'rgba(59,130,246,0.12)', padding: 8, borderRadius: 8, textAlign: 'center', fontSize: '0.76rem', color: '#f1f5f9', fontWeight: 700 }}>
                      🇩🇪 Germany
                    </div>
                    <div style={{ border: '1px solid rgba(59,130,246,0.1)', padding: 8, borderRadius: 8, textAlign: 'center', fontSize: '0.76rem', color: '#94a3b8' }}>
                      🇦🇹 Austria
                    </div>
                    <div style={{ border: '1px solid rgba(59,130,246,0.1)', padding: 8, borderRadius: 8, textAlign: 'center', fontSize: '0.76rem', color: '#94a3b8' }}>
                      🇺🇸 USA
                    </div>
                    <div style={{ border: '1px solid rgba(59,130,246,0.1)', padding: 8, borderRadius: 8, textAlign: 'center', fontSize: '0.76rem', color: '#94a3b8' }}>
                      🇨🇦 Canada
                    </div>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: 6, fontWeight: 700 }}>
                    2. Target Course / Degree
                  </div>
                  <div style={{ background: '#04080f', border: '1.5px solid rgba(59, 130, 246, 0.2)', padding: '10px 12px', borderRadius: 8, fontSize: '0.76rem', color: '#f1f5f9' }}>
                    M.Sc. Artificial Intelligence
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 48, alignItems: 'center'
            }} className="step-block step-reverse fade-in">
              {/* Mockup */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="glass-card" style={{
                  width: '100%', maxWidth: 380, padding: 20, background: '#0c1a2e',
                  border: '1px solid rgba(124, 58, 237, 0.15)'
                }}>
                  {/* Chat Bubbles */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', color: 'white', fontWeight: 800 }}>AI</div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: 10, borderRadius: '0 12px 12px 12px', fontSize: '0.72rem', color: '#e2e8f0', maxWidth: '80%', lineHeight: 1.4 }}>
                      Hello Arjun! Excellent choice. Germany has **no tuition fees** at public universities. Let's lock your intakes. Are you aiming for **Winter** or **Summer** semester?
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                    <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)', padding: 10, borderRadius: '12px 12px 0 12px', fontSize: '0.72rem', color: '#ffffff', maxWidth: '80%' }}>
                      I am aiming for Winter 2028 (Oct).
                    </div>
                  </div>
                  {/* Quick Action options */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.15)', borderRadius: 10, padding: '4px 8px', fontSize: '0.62rem', color: '#3b82f6', fontWeight: 600 }}>
                      What exams do I need?
                    </div>
                    <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.15)', borderRadius: 10, padding: '4px 8px', fontSize: '0.62rem', color: '#3b82f6', fontWeight: 600 }}>
                      Blocked account costs
                    </div>
                  </div>
                </div>
              </div>
              {/* Text */}
              <div>
                <div style={{ fontSize: '2.8rem', fontWeight: 800, color: 'rgba(124, 58, 237, 0.25)', marginBottom: 8 }}>
                  02
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f1f5f9', marginBottom: 16 }}>
                  Get Your AI Roadmap
                </h3>
                <p style={{ fontSize: '0.94rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: 20 }}>
                  Studytra AI maps out your entire destination timeline immediately. Ask specific questions about entrance exams (GRE, IELTS, TestAS), blocked account requirements, visa interviews, or scholarship applications.
                </p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: '0.86rem', color: '#cbd5e1' }}>
                  <CheckCircle2 size={15} color="#a78bfa" />
                  <span>24/7 dedicated study abroad advisor powered by Gemini</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 48, alignItems: 'center'
            }} className="step-block fade-in">
              {/* Text */}
              <div>
                <div style={{ fontSize: '2.8rem', fontWeight: 800, color: 'rgba(6, 182, 212, 0.25)', marginBottom: 8 }}>
                  03
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f1f5f9', marginBottom: 16 }}>
                  Execute with Confidence
                </h3>
                <p style={{ fontSize: '0.94rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: 20 }}>
                  Save your roadmap, sync document progress checklists, analyze living costs compared to savings targets, and review visa procedures. Everything remains synchronized in your student dashboard.
                </p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: '0.86rem', color: '#cbd5e1' }}>
                  <CheckCircle2 size={15} color="#06b6d4" />
                  <span>Progress checkpoints saved to Supabase dynamically</span>
                </div>
              </div>
              {/* Mockup */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="glass-card" style={{
                  width: '100%', maxWidth: 380, padding: 20, background: '#0c1a2e',
                  border: '1px solid rgba(6, 182, 212, 0.15)'
                }}>
                  {/* Dashboard mock */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#f1f5f9' }}>Checklist Tracker</span>
                    <span style={{ fontSize: '0.64rem', color: '#34d399', background: 'rgba(52, 211, 153, 0.1)', padding: '2px 6px', borderRadius: 4 }}>
                      Synced
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ background: '#04080f', border: '1px solid rgba(59,130,246,0.1)', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.74rem', color: '#f1f5f9' }}>
                      <input type="checkbox" defaultChecked style={{ accentColor: '#06b6d4' }} readOnly />
                      <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>Draft SOP Statement</span>
                    </div>
                    <div style={{ background: '#04080f', border: '1px solid rgba(59,130,246,0.1)', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.74rem', color: '#f1f5f9' }}>
                      <input type="checkbox" defaultChecked style={{ accentColor: '#06b6d4' }} readOnly />
                      <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>Book IELTS Exam Slot</span>
                    </div>
                    <div style={{ background: '#04080f', border: '1px solid rgba(59,130,246,0.1)', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.74rem', color: '#f1f5f9' }}>
                      <input type="checkbox" style={{ accentColor: '#06b6d4' }} readOnly />
                      <span>Prepare Letter of Recommendation (LOR)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .step-reverse { direction: ltr; }
          @media (max-width: 768px) {
            .step-block {
              grid-template-columns: 1fr !important;
              gap: 28px !important;
              text-align: center;
            }
            .step-block > div {
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .step-reverse {
              display: flex !important;
              flex-direction: column-reverse !important;
            }
          }
        `}</style>
      </section>

      {/* ══════════════════════════════
          5. FEATURES SECTION
      ══════════════════════════════ */}
      <section id="features" style={{ background: '#080f1a', padding: '100px 24px', borderTop: '1px solid rgba(59, 130, 246, 0.1)', borderBottom: '1px solid rgba(59, 130, 246, 0.1)' }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 60 }} className="fade-in">
            <span style={{
              display: 'inline-block', background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.25)', color: '#06b6d4',
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '5px 14px', borderRadius: 30, marginBottom: 16
            }}>
              Features
            </span>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800,
              color: '#f1f5f9', fontFamily: 'Plus Jakarta Sans, sans-serif'
            }}>
              Everything You Need. Nothing You Don't.
            </h2>
          </div>

          {/* Features Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }} className="fade-in">
            {/* Feature 1 */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: 'rgba(59, 130, 246, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: 20
              }}>🤖</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>AI Study Abroad Advisor</h3>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 6px', borderRadius: 4 }}>LIVE</span>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.6, flex: 1 }}>
                Chat 24/7 with Studytra AI. Get precise, instant answers about university deadlines, blocked account procedures, visa details, and local checklists.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: 'rgba(59, 130, 246, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: 20
              }}>🗺️</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Country Roadmaps</h3>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#3b82f6', background: 'rgba(59, 130, 246, 0.15)', padding: '2px 6px', borderRadius: 4 }}>6 Countries</span>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.6, flex: 1 }}>
                Detailed pre-departure and post-arrival execution timelines configured specifically for Germany, Austria, United Kingdom, USA, Canada, and Australia.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: 'rgba(59, 130, 246, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: 20
              }}>💰</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Real-Time Budget Estimator</h3>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#3b82f6', background: 'rgba(59, 130, 246, 0.15)', padding: '2px 6px', borderRadius: 4 }}>Live Rates</span>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.6, flex: 1 }}>
                Calculate tuition costs and monthly living expenses. Convert directly to INR using real-time API exchange rates to secure your finances correctly.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: 'rgba(59, 130, 246, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: 20
              }}>📄</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>SOP Writing Guides</h3>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#3b82f6', background: 'rgba(59, 130, 246, 0.15)', padding: '2px 6px', borderRadius: 4 }}>Free</span>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.6, flex: 1 }}>
                Access country-specific Statement of Purpose (SOP) structures, outlines, writing templates, and structural tips to write a high-impact profile statement.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: 'rgba(59, 130, 246, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: 20
              }}>🏦</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Education Loan Advisor</h3>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#3b82f6', background: 'rgba(59, 130, 246, 0.15)', padding: '2px 6px', borderRadius: 4 }}>India-Specific</span>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.6, flex: 1 }}>
                Understand collateral vs non-collateral options from Indian banks (SBI, HDFC Credila, etc.), verify interest rates, and check document rules.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', opacity: 0.5 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: 'rgba(71, 85, 105, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: 20
              }}>📊</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#94a3b8', margin: 0 }}>Progress Checklist Sync</h3>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#64748b', background: 'rgba(100, 116, 139, 0.15)', padding: '2px 6px', borderRadius: 4 }}>SOON</span>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.6, flex: 1 }}>
                Advanced features to upload documents directly, track reviews from community alumni, and synchronize your progress seamlessly across multiple devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          6. COUNTRIES SECTION
      ══════════════════════════════ */}
      <section id="countries" style={{ padding: '100px 24px' }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 60 }} className="fade-in">
            <span style={{
              display: 'inline-block', background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.25)', color: '#3b82f6',
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '5px 14px', borderRadius: 30, marginBottom: 16
            }}>
              Destinations
            </span>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800,
              color: '#f1f5f9', fontFamily: 'Plus Jakarta Sans, sans-serif'
            }}>
              Where Will You Go?
            </h2>
            <p style={{ fontSize: '0.96rem', color: '#94a3b8', marginTop: 8 }}>
              Studytra covers the most popular destinations for Indian students.
            </p>
          </div>

          {/* Countries Slider Grid */}
          <div className="countries-horizontal-scroll" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24
          }}>
            {/* Germany */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: '2.5rem' }}>🇩🇪</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f1f5f9' }}>Germany</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, flex: 1 }}>
                <div style={{ fontSize: '0.86rem', color: '#e2e8f0' }}>🎓 <strong>Tuition:</strong> ~€500/sem (Public unis)</div>
                <div style={{ fontSize: '0.86rem', color: '#e2e8f0' }}>💰 <strong>Living:</strong> €900–1,200/month</div>
                <div style={{ fontSize: '0.86rem', color: '#e2e8f0' }}>✨ <strong>Highlights:</strong> Free public universities, solid engineering, 18-month job search visa.</div>
              </div>
              <a href="/app?country=Germany" className="btn-ghost" style={{ padding: '8px 16px', fontSize: '0.78rem', width: '100%', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                Explore Roadmap <ArrowUpRight size={13} />
              </a>
            </div>

            {/* Austria */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', position: 'relative', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              <div style={{ position: 'absolute', top: 12, right: 12, background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', fontSize: '0.62rem', fontWeight: 800, padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                🆕 New
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: '2.5rem' }}>🇦🇹</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f1f5f9' }}>Austria</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, flex: 1 }}>
                <div style={{ fontSize: '0.86rem', color: '#e2e8f0' }}>🎓 <strong>Tuition:</strong> €1,500–3,000/year</div>
                <div style={{ fontSize: '0.86rem', color: '#e2e8f0' }}>💰 <strong>Living:</strong> €700–1,100/month</div>
                <div style={{ fontSize: '0.86rem', color: '#e2e8f0' }}>✨ <strong>Highlights:</strong> #1 most livable city (Vienna), no blocked account required, affordable fees.</div>
              </div>
              <a href="/app?country=Austria" className="btn-ghost" style={{ padding: '8px 16px', fontSize: '0.78rem', width: '100%', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, borderColor: 'rgba(16, 185, 129, 0.4)', color: '#34d399' }}>
                Explore Roadmap <ArrowUpRight size={13} />
              </a>
            </div>

            {/* UK */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: '2.5rem' }}>🇬🇧</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f1f5f9' }}>United Kingdom</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, flex: 1 }}>
                <div style={{ fontSize: '0.86rem', color: '#e2e8f0' }}>🎓 <strong>Tuition:</strong> £15,000–30,000/year</div>
                <div style={{ fontSize: '0.86rem', color: '#e2e8f0' }}>💰 <strong>Living:</strong> £1,200–1,800/month</div>
                <div style={{ fontSize: '0.86rem', color: '#e2e8f0' }}>✨ <strong>Highlights:</strong> 1-year master programs, 2-year Graduate Route PSW visa.</div>
              </div>
              <a href="/app?country=UK" className="btn-ghost" style={{ padding: '8px 16px', fontSize: '0.78rem', width: '100%', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                Explore Roadmap <ArrowUpRight size={13} />
              </a>
            </div>

            {/* USA */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: '2.5rem' }}>🇺🇸</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f1f5f9' }}>United States</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, flex: 1 }}>
                <div style={{ fontSize: '0.86rem', color: '#e2e8f0' }}>🎓 <strong>Tuition:</strong> $20,000–50,000/year</div>
                <div style={{ fontSize: '0.86rem', color: '#e2e8f0' }}>💰 <strong>Living:</strong> $1,200–2,000/month</div>
                <div style={{ fontSize: '0.86rem', color: '#e2e8f0' }}>✨ <strong>Highlights:</strong> OPT + STEM extensions (up to 3 years), world-class research hubs.</div>
              </div>
              <a href="/app?country=USA" className="btn-ghost" style={{ padding: '8px 16px', fontSize: '0.78rem', width: '100%', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                Explore Roadmap <ArrowUpRight size={13} />
              </a>
            </div>

            {/* Canada */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: '2.5rem' }}>🇨🇦</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f1f5f9' }}>Canada</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, flex: 1 }}>
                <div style={{ fontSize: '0.86rem', color: '#e2e8f0' }}>🎓 <strong>Tuition:</strong> CAD 15,000–35,000/year</div>
                <div style={{ fontSize: '0.86rem', color: '#e2e8f0' }}>💰 <strong>Living:</strong> CAD 1,200–2,000/month</div>
                <div style={{ fontSize: '0.86rem', color: '#e2e8f0' }}>✨ <strong>Highlights:</strong> Up to 3-year PGWP work permit, structured Permanent Residency (PR) pathways.</div>
              </div>
              <a href="/app?country=Canada" className="btn-ghost" style={{ padding: '8px 16px', fontSize: '0.78rem', width: '100%', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                Explore Roadmap <ArrowUpRight size={13} />
              </a>
            </div>

            {/* Australia */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: '2.5rem' }}>🇦🇺</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f1f5f9' }}>Australia</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, flex: 1 }}>
                <div style={{ fontSize: '0.86rem', color: '#e2e8f0' }}>🎓 <strong>Tuition:</strong> AUD 25,000–45,000/year</div>
                <div style={{ fontSize: '0.86rem', color: '#e2e8f0' }}>💰 <strong>Living:</strong> AUD 1,500–2,200/month</div>
                <div style={{ fontSize: '0.86rem', color: '#e2e8f0' }}>✨ <strong>Highlights:</strong> Post-study work visa (485 Graduate Stream), high minimum wage, top quality of life.</div>
              </div>
              <a href="/app?country=Australia" className="btn-ghost" style={{ padding: '8px 16px', fontSize: '0.78rem', width: '100%', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                Explore Roadmap <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          7. TESTIMONIALS / SOCIAL PROOF
      ══════════════════════════════ */}
      <section id="reviews" style={{ background: '#080f1a', padding: '100px 24px', borderTop: '1px solid rgba(59, 130, 246, 0.1)', borderBottom: '1px solid rgba(59, 130, 246, 0.1)' }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 60 }} className="fade-in">
            <span style={{
              display: 'inline-block', background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.25)', color: '#3b82f6',
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '5px 14px', borderRadius: 30, marginBottom: 16
            }}>
              Testimonials
            </span>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800,
              color: '#f1f5f9', fontFamily: 'Plus Jakarta Sans, sans-serif'
            }}>
              Indian Students Who Used Studytra
            </h2>
          </div>

          {/* Testimonial Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 52 }} className="fade-in">
            {/* Priya */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="#fbbf24" color="#fbbf24" />)}
              </div>
              <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.65, fontStyle: 'italic', flex: 1, marginBottom: 20 }}>
                "I was spending hours sorting through Reddit threads and YouTube videos. Studytra gave me a complete, structured Germany admission roadmap in 10 minutes. The AI understood exactly what I needed as an Indian B.Tech student."
              </p>
              <div style={{ borderTop: '1px solid rgba(59, 130, 246, 0.12)', paddingTop: 14 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f1f5f9', margin: '0 0 2px' }}>Priya Sharma</h4>
                <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: 0 }}>B.Tech CSE → M.Sc AI, TU München</p>
              </div>
            </div>

            {/* Rahul */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="#fbbf24" color="#fbbf24" />)}
              </div>
              <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.65, fontStyle: 'italic', flex: 1, marginBottom: 20 }}>
                "The budget calculator with live INR exchange rates was a total game-changer. I was able to estimate my monthly living costs in Vienna down to the rupee. I knew exactly how much education loan to secure."
              </p>
              <div style={{ borderTop: '1px solid rgba(59, 130, 246, 0.12)', paddingTop: 14 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#34d399', margin: '0 0 2px' }}>Rahul Nair</h4>
                <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: 0 }}>B.Com → MBA, University of Vienna</p>
              </div>
            </div>

            {/* Ankita */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="#fbbf24" color="#fbbf24" />)}
              </div>
              <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.65, fontStyle: 'italic', flex: 1, marginBottom: 20 }}>
                "My local consultancy was charging ₹80,000 for standard applications. Studytra gave me better structured templates, checklists, and timelines for free. Completed my Austria paperwork successfully on my own!"
              </p>
              <div style={{ borderTop: '1px solid rgba(59, 130, 246, 0.12)', paddingTop: 14 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#34d399', margin: '0 0 2px' }}>Ankita Das</h4>
                <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: 0 }}>B.Pharm → M.Sc Biotechnology, University of Vienna</p>
              </div>
            </div>
          </div>

          {/* Social Proof CTA */}
          <div style={{ textAlign: 'center' }} className="fade-in">
            <p style={{ fontSize: '1rem', color: '#cbd5e1', marginBottom: 24, fontWeight: 500 }}>Join thousands of Indian students planning smarter.</p>
            <a href="/app" className="btn-primary">
              Start Planning Free →
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          8. PRICING SECTION
      ══════════════════════════════ */}
      <section style={{ padding: '100px 24px' }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 60 }} className="fade-in">
            <span style={{
              display: 'inline-block', background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.25)', color: '#3b82f6',
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '5px 14px', borderRadius: 30, marginBottom: 16
            }}>
              Pricing
            </span>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800,
              color: '#f1f5f9', fontFamily: 'Plus Jakarta Sans, sans-serif'
            }}>
              Simple Pricing. No Surprises.
            </h2>
          </div>

          {/* Pricing cards grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'stretch'
          }} className="fade-in">
            {/* Card 1: Free Forever */}
            <div className="glass-card" style={{
              padding: '36px 28px', display: 'flex', flexDirection: 'column', position: 'relative',
              border: '2px solid #3b82f6', background: 'rgba(12, 26, 46, 0.85)'
            }}>
              <div style={{
                position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', color: 'white',
                fontSize: '0.68rem', fontWeight: 800, padding: '4px 14px', borderRadius: 30,
                textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 4px 10px rgba(59,130,246,0.3)'
              }}>
                Most Popular
              </div>
              <div style={{ marginBottom: 24, textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Free Forever</h3>
                <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#f1f5f9', fontFamily: 'Plus Jakarta Sans' }}>
                  ₹0
                </div>
                <p style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: 4 }}>No credit card required. No hidden fees.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.84rem' }}>
                  <CheckCircle2 size={15} color="#3b82f6" />
                  <span style={{ color: '#cbd5e1' }}>AI Study Abroad Advisor Chat</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.84rem' }}>
                  <CheckCircle2 size={15} color="#3b82f6" />
                  <span style={{ color: '#cbd5e1' }}>6 Country Timelines & Roadmaps</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.84rem' }}>
                  <CheckCircle2 size={15} color="#3b82f6" />
                  <span style={{ color: '#cbd5e1' }}>Budget Planner (Live Rates)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.84rem' }}>
                  <CheckCircle2 size={15} color="#3b82f6" />
                  <span style={{ color: '#cbd5e1' }}>SOP Guides & ATS Resume Tips</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.84rem' }}>
                  <CheckCircle2 size={15} color="#3b82f6" />
                  <span style={{ color: '#cbd5e1' }}>Education Loan Checklists</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.84rem' }}>
                  <CheckCircle2 size={15} color="#3b82f6" />
                  <span style={{ color: '#cbd5e1' }}>Progress Checklist Dashboard</span>
                </div>
              </div>

              <a href="/app" className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                Start Planning Free →
              </a>
            </div>

            {/* Card 2: Consultancies */}
            <div className="glass-card" style={{ padding: '36px 28px', display: 'flex', flexDirection: 'column', opacity: 0.85 }}>
              <div style={{ marginBottom: 24, textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f87171', marginBottom: 8 }}>Traditional Consultancy</h3>
                <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#f87171', fontFamily: 'Plus Jakarta Sans' }}>
                  ₹50,000 - ₹2,00,000
                </div>
                <p style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: 4 }}>Standard commission-driven pricing.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.84rem', opacity: 0.6 }}>
                  <span style={{ color: '#ef4444' }}>❌</span>
                  <span style={{ color: '#cbd5e1' }}>Same static instructions, human-delivered</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.84rem', opacity: 0.6 }}>
                  <span style={{ color: '#ef4444' }}>❌</span>
                  <span style={{ color: '#cbd5e1' }}>Biased toward partner universities</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.84rem', opacity: 0.6 }}>
                  <span style={{ color: '#ef4444' }}>❌</span>
                  <span style={{ color: '#cbd5e1' }}>No real-time cost-saving estimators</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.84rem', opacity: 0.6 }}>
                  <span style={{ color: '#ef4444' }}>❌</span>
                  <span style={{ color: '#cbd5e1' }}>No instant AI queries, slow responses</span>
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '14px', fontSize: '0.84rem', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, fontWeight: 700 }}>
                High Costs & Hidden Biases
              </div>
            </div>

            {/* Card 3: What You Save */}
            <div className="glass-card" style={{ padding: '36px 28px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              <div style={{ marginBottom: 24, textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399', marginBottom: 8 }}>What You Save</h3>
                <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#34d399', fontFamily: 'Plus Jakarta Sans' }}>
                  Smart & Efficient
                </div>
                <p style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: 4 }}>Your savings on using Studytra platform.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, justifyContent: 'center' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.25rem' }}>💰</span>
                  <div>
                    <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f1f5f9' }}>₹50,000–2,00,000 saved</h4>
                    <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>Keep your hard-earned funds for actual university fees & travel.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.25rem' }}>⏰</span>
                  <div>
                    <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f1f5f9' }}>100+ Hours Saved</h4>
                    <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>Skip reading endless scattered blogs. AI has digested all datasets.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.25rem' }}>😰</span>
                  <div>
                    <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f1f5f9' }}>Zero Scattered Stress</h4>
                    <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>Checklists, timelines, live rates, SOP structure, all in one browser window.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          9. FINAL CTA SECTION
      ══════════════════════════════ */}
      <section style={{
        background: 'linear-gradient(135deg, #0e1e38 0%, #2e0854 100%)',
        padding: '90px 24px', position: 'relative', overflow: 'hidden',
        borderTop: '1px solid rgba(59, 130, 246, 0.15)', borderBottom: '1px solid rgba(59, 130, 246, 0.15)'
      }} className="fade-in">
        <div style={{
          position: 'absolute', width: 450, height: 450, background: '#3b82f6',
          borderRadius: '50%', filter: 'blur(150px)', opacity: 0.1, top: '-10%', left: '5%',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', width: 450, height: 450, background: '#7c3aed',
          borderRadius: '50%', filter: 'blur(150px)', opacity: 0.1, bottom: '-10%', right: '5%',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 800 }}>
          <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: 16 }}>
            Ready to Start?
          </span>
          
          <h2 style={{
            fontSize: 'clamp(2.1rem, 5vw, 3.2rem)', fontWeight: 800,
            color: '#ffffff', marginBottom: 18, lineHeight: 1.2,
            fontFamily: 'Plus Jakarta Sans, sans-serif'
          }}>
            Your Dream University<br />Is One Plan Away.
          </h2>

          <p style={{
            fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.6,
            maxWidth: 580, margin: '0 auto 36px'
          }}>
            Join thousands of Indian students who chose smart preparation over expensive agents. No sign-up required. Start planning in under 2 minutes.
          </p>

          <a href="/app" className="btn-primary" style={{
            background: '#ffffff', color: '#04080f',
            padding: '16px 36px', fontSize: '1.05rem', fontWeight: 700,
            boxShadow: '0 8px 30px rgba(255, 255, 255, 0.15)'
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            Start Planning Free →
          </a>

          <div style={{
            display: 'flex', justifyContent: 'center', gap: 18, flexWrap: 'wrap',
            marginTop: 40, fontSize: '0.76rem', color: '#94a3b8'
          }}>
            <span>✦ No consultancy fees</span>
            <span>✦ No hidden costs</span>
            <span>✦ AI-powered</span>
            <span>✦ Always free</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          10. FOOTER
      ══════════════════════════════ */}
      <footer style={{ background: '#020608', color: '#94a3b8', padding: '72px 24px 36px', borderTop: '1px solid rgba(59, 130, 246, 0.08)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 48, marginBottom: 56 }} className="foot-grid">
            {/* Logo details */}
            <div>
              <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 18 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Compass size={16} color="white" />
                </div>
                <span style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800,
                  fontSize: '1.15rem', color: '#f1f5f9'
                }}>Studytra</span>
              </a>
              <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.7, maxWidth: 280, marginBottom: 24 }}>
                AI-powered study abroad planning engine for Indian students. Built with ❤️ for smart applicants.
              </p>
              
              {/* GitHub Link */}
              <a 
                href="https://github.com/arupdas0825" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  fontSize: '0.84rem', color: '#f1f5f9', background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
                  padding: '8px 14px', textDecoration: 'none', transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderColor = '#3b82f6' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
              >
                <Github size={14} />
                <span>github.com/arupdas0825</span>
              </a>
            </div>

            {/* Platform links */}
            <div>
              <h4 style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18 }}>
                Platform
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a href="#how-it-works" style={{ fontSize: '0.86rem', color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#3b82f6'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>How It Works</a>
                <a href="#countries" style={{ fontSize: '0.86rem', color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#3b82f6'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>Countries</a>
                <a href="/budget" style={{ fontSize: '0.86rem', color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#3b82f6'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>Budget Calculator</a>
                <a href="/tools/sop-guide" style={{ fontSize: '0.86rem', color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#3b82f6'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>SOP Writing Guide</a>
                <a href="/dashboard" style={{ fontSize: '0.86rem', color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#3b82f6'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>Dashboard Checklist</a>
              </div>
            </div>

            {/* Resources links */}
            <div>
              <h4 style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18 }}>
                Resources
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a href="/loans" style={{ fontSize: '0.86rem', color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#3b82f6'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>Loan Guidance</a>
                <a href="/dashboard?tab=visa" style={{ fontSize: '0.86rem', color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#3b82f6'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>Visa Steps Tracker</a>
                <a href="/tools/cv-formats" style={{ fontSize: '0.86rem', color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#3b82f6'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>Academic CV Formats</a>
                <a href="/tools/resume-formats" style={{ fontSize: '0.86rem', color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#3b82f6'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>ATS Resume Formats</a>
              </div>
            </div>

            {/* Countries links */}
            <div>
              <h4 style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18 }}>
                Countries
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a href="/app?country=Germany" style={{ fontSize: '0.86rem', color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#3b82f6'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>🇩🇪 Germany</a>
                <a href="/app?country=Austria" style={{ fontSize: '0.86rem', color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#3b82f6'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>🇦🇹 Austria</a>
                <a href="/app?country=UK" style={{ fontSize: '0.86rem', color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#3b82f6'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>🇬🇧 United Kingdom</a>
                <a href="/app?country=USA" style={{ fontSize: '0.86rem', color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#3b82f6'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>🇺🇸 United States</a>
                <a href="/app?country=Canada" style={{ fontSize: '0.86rem', color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#3b82f6'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>🇨🇦 Canada</a>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12
          }}>
            <span style={{ fontSize: '0.78rem', color: '#475569' }}>
              © 2026 Studytra. Built for Indian students. Contact: dasarup0804@gmail.com
            </span>
            <div style={{ display: 'flex', gap: 18, fontSize: '0.78rem' }}>
              <a href="#" style={{ color: '#475569', textDecoration: 'none' }}>Privacy Policy</a>
              <a href="#" style={{ color: '#475569', textDecoration: 'none' }}>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* Embedded CSS rules for layout adjustments */}
      <style>{`
        .hero-grid {
          grid-template-columns: 1.2fr 1fr;
        }
        @media (max-width: 900px) {
          .desk-nav { display: none !important; }
          .burger   { display: block !important; }
        }
        @media (min-width: 901px) {
          .burger { display: none !important; }
        }
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .hero-text-col {
            align-items: center !important;
          }
          .stats-row {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .foot-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
        }
      `}</style>
    </div>
  )
}
