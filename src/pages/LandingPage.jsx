import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Menu, X, ChevronDown, Sparkles, AlertCircle, Compass, CheckCircle2,
  DollarSign, FileText, Landmark, BarChart3, Star, Github, ArrowRight,
  TrendingUp, Globe, Clock, ArrowUpRight, LogOut, LayoutDashboard, MessageSquare, Settings
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useTheme } from '../context/ThemeContext'
import AuthModal from '../components/auth/AuthModal'
import { COUNTRIES } from '../constants/countries'
import '../styles/landing.css'

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn"
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}


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
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: 1200,
        zIndex: 1000,
        background: 'var(--navbar-bg)',
        backdropFilter: 'var(--glass-blur)',
        border: '1px solid var(--navbar-border)',
        borderRadius: '999px',
        boxShadow: 'var(--shadow-card)',
        transition: 'all 0.3s ease',
        height: 64,
        display: 'flex', alignItems: 'center'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {/* Logo */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: 'var(--gradient-main)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <Compass size={18} color="white" />
            </div>
            <span style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800,
              fontSize: '1.25rem', color: 'var(--text-primary)', letterSpacing: '-0.02em'
            }}>Studytra</span>
          </a>

          {/* Center Links (Desktop) */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} className="desk-nav">
            <a href="#how-it-works" style={{ padding: '8px 16px', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--accent-primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>How It Works</a>
            <a href="#countries" style={{ padding: '8px 16px', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--accent-primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>Countries</a>
            
            {/* Tools Dropdown */}
            <div style={{ position: 'relative' }} onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none',
                padding: '8px 16px', fontSize: '0.88rem', fontWeight: 600, color: dropdownOpen ? 'var(--accent-primary)' : 'var(--text-secondary)',
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
                    background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)',
                    padding: 8, boxShadow: 'var(--shadow-xl)'
                  }}>
                    <a href="/budget" style={{ display: 'block', padding: '10px 14px', borderRadius: 10, textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--theme-icon-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>💰 Budget Estimator</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>Evaluate living costs in INR with live rates.</div>
                    </a>
                    <a href="/tools/sop-guide" style={{ display: 'block', padding: '10px 14px', borderRadius: 10, textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--theme-icon-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>✍️ SOP Writing Framework</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>Country-specific structures and samples.</div>
                    </a>
                    <a href="/loans" style={{ display: 'block', padding: '10px 14px', borderRadius: 10, textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--theme-icon-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>🏦 Education Loan Advisor</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>Compare interest rates and checklists.</div>
                    </a>
                  </div>
                </div>
              )}
            </div>

            <a href="#reviews" style={{ padding: '8px 16px', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--accent-primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>Reviews</a>
          </div>

          {/* Right Action buttons */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <ThemeToggle />
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
                      border: '2px solid var(--primary)',
                      boxShadow: 'var(--shadow-sm)',
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
                      background: 'var(--gradient-main)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-inverse, #ffffff)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    {getInitials()}
                  </div>
                )}

                {/* Avatar Dropdown Panel */}
                {avatarDropdownOpen && (
                  <div style={{
                    position: 'absolute', top: '120%', right: 0,
                    width: 240, background: 'var(--bg-card)',
                    backdropFilter: 'blur(20px)', border: '1px solid var(--border)',
                    borderRadius: 16, padding: '14px', zIndex: 1000,
                    boxShadow: 'var(--shadow-xl)',
                    animation: 'avatarDropdownFadeUp 0.18s ease',
                    textAlign: 'left'
                  }}>
                    {/* User info */}
                    <div style={{ marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.displayName || "Studytra Student"}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
                        {user.email}
                      </div>
                    </div>

                    {/* Navigation links */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                      <a href="/dashboard" onClick={() => setAvatarDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, fontSize: '0.82rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--theme-icon-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                        <LayoutDashboard size={14} color="var(--primary)" />
                        <span>Dashboard</span>
                      </a>
                      <a href="/chat" onClick={() => setAvatarDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, fontSize: '0.82rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--theme-icon-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                        <MessageSquare size={14} color="var(--accent)" />
                        <span>My Chats</span>
                      </a>
                      <a href="/app" onClick={() => setAvatarDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, fontSize: '0.82rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--theme-icon-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                        <Settings size={14} color="var(--text-muted)" />
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
              {mobileMenuOpen ? <X size={24} color="var(--text-primary)" /> : <Menu size={24} color="var(--text-primary)" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed', top: 72, left: 0, right: 0, background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-default)', padding: '20px 24px',
          display: 'flex', flexDirection: 'column', gap: 16, zIndex: 999,
          boxShadow: 'var(--shadow-lg)'
        }}>
          {/* Mobile Theme Toggle Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 8px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>Theme</span>
            <ThemeToggle />
          </div>

          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>How It Works</a>
          <a href="#countries" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>Countries</a>
          <a href="/budget" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>💰 Budget Estimator</a>
          <a href="/tools/sop-guide" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>✍️ SOP Guide</a>
          <a href="/loans" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>🏦 Loan Guide</a>
          <a href="#reviews" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>Reviews</a>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
            {user ? (
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: '12px',
                marginBottom: 8
              }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)' }}>{user.displayName || "Studytra Student"}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 12 }}>{user.email}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <a href="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '0.84rem', color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <LayoutDashboard size={14} /> Dashboard
                  </a>
                  <a href="/chat" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '0.84rem', color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
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
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '140px 24px 80px', position: 'relative',
        background: 'var(--gradient-hero)'
      }}>
        <div className="container" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          maxWidth: 960, width: '100%'
        }}>
          {/* AI Pill Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(37, 99, 235, 0.06)', border: '1px solid rgba(37, 99, 235, 0.15)',
            borderRadius: 30, padding: '6px 16px', marginBottom: 24
          }}>
            <Sparkles size={13} color="#2563EB" />
            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#2563EB', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              AI-Powered Study Abroad Platform
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-display" style={{
            color: 'var(--text-primary)', marginBottom: 20,
            fontSize: 'clamp(2.8rem, 6.5vw, 5.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1.12,
            maxWidth: 900
          }}>
            Your Global Education Journey,<br />
            <span className="gradient-text hero-accent" style={{ background: 'var(--gradient-main)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Powered by AI.
            </span>
            <br />
            <span style={{ fontSize: '0.85em', fontWeight: 700, color: 'var(--text-secondary)' }}>
              From Dream University to Student Visa.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-body-lg" style={{
            maxWidth: 680, 
            color: 'var(--text-secondary)',
            fontSize: '1.15rem',
            lineHeight: 1.65,
            margin: '0 auto 36px'
          }}>
            Build your personalized roadmap, estimate costs, discover universities, prepare SOPs and track every step of your study abroad journey.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', width: '100%', marginBottom: 54 }}>
            <a href="/app" className="btn-primary" style={{ padding: '16px 36px', fontSize: '1.05rem', borderRadius: 30, textDecoration: 'none' }}>
              Start Planning Free →
            </a>
            <a href="#features" className="btn-ghost" style={{ 
              padding: '16px 32px', fontSize: '1.05rem', borderRadius: 30,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              boxShadow: 'var(--shadow-xs)',
              textDecoration: 'none'
            }}>
              Explore Features
            </a>
          </div>

          {/* Centered Preview Card */}
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', position: 'relative' }}>
            {/* Ambient backglow */}
            <div style={{
              position: 'absolute', width: 320, height: 320, background: '#2563EB',
              borderRadius: '50%', filter: 'blur(120px)', opacity: 0.08, top: '10%',
              zIndex: 0, pointerEvents: 'none'
            }} />

            <div className="glass-card floating-card" style={{
              width: '100%',
              maxWidth: 480,
              padding: 28,
              border: '1px solid var(--border-card)',
              background: 'var(--glass-bg)',
              backdropFilter: 'var(--glass-blur)',
              boxShadow: 'var(--shadow-card)',
              borderRadius: 24,
              textAlign: 'left',
              position: 'relative',
              zIndex: 10
            }}>
              {/* Card top */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  AI Roadmap Preview
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', background: 'rgba(37, 99, 235, 0.08)', padding: '4px 12px', borderRadius: 20 }}>
                  🇦🇹 Austria · M.Sc CS
                </span>
              </div>

              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                Arup Das · StudyAbroad Plan
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 24px' }}>
                Target Intake: Fall 2028 · Budget Range: ₹10L–20L
              </p>

              {/* Progress Steps list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.86rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)', fontWeight: 600 }}>
                    <CheckCircle2 size={15} color="#10B981" />
                    <span>IELTS Preparation</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.08)', padding: '2px 8px', borderRadius: 4 }}>
                    Active
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.86rem', opacity: 0.7 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid var(--text-secondary)' }} />
                    <span>University Shortlist</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Pending
                  </span>
                </div>
              </div>

              {/* Progress bar info */}
              <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Roadmap Progress</span>
                  <strong style={{ color: '#10B981', fontWeight: 800 }}>30%</strong>
                </div>
                <div style={{ background: 'rgba(37, 99, 235, 0.08)', borderRadius: 10, height: 8, overflow: 'hidden' }}>
                  <div className="progress-fill" style={{ background: 'linear-gradient(90deg, #2563EB 0%, #10B981 100%)', height: '100%', borderRadius: 10, width: '30%' }} />
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
        background: 'var(--bg-secondary)', padding: '100px 24px', position: 'relative',
        borderTop: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto 60px' }} className="fade-in">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.15)',
              borderRadius: 30, padding: '5px 14px', marginBottom: 16
            }}>
              <AlertCircle size={13} color="var(--accent-error)" />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-error)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                The Harsh Reality
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800,
              lineHeight: 1.2, color: 'var(--text-primary)'
            }}>
              Indian Students Spend ₹2–5 Lakh on Consultancies That Do What AI Can Do for Free.
            </h2>
          </div>

          {/* Problem Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 56 }} className="fade-in">
            {/* Card 1 */}
            <div className="glass-card" style={{ padding: 32, background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 24, boxShadow: 'var(--shadow-card)' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: 'rgba(239, 68, 68, 0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
                marginBottom: 20
              }}>😤</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>Scattered Information</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Visa steps on government portals, living costs on Reddit, university details on outdated blogs, and SOP tips on YouTube. It's overwhelming and highly unreliable.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass-card" style={{ padding: 32, background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 24, boxShadow: 'var(--shadow-card)' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: 'rgba(239, 68, 68, 0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
                marginBottom: 20
              }}>💸</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>Expensive Consultancies</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Traditional agents charge ₹50,000 to ₹2,00,000 for standard guidelines and university filing. They push you toward high-commission partners instead of your dream school.
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass-card" style={{ padding: 32, background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 24, boxShadow: 'var(--shadow-card)' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: 'rgba(239, 68, 68, 0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
                marginBottom: 20
              }}>⏰</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>Missed Deadlines</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Application windows are extremely tight, and documentation rules vary. One missed document, incorrect CV layout, or wrong deadline can push your dreams back by an entire year.
              </p>
            </div>
          </div>

          {/* Subheading text */}
          <div style={{ textAlign: 'center' }} className="fade-in">
            <p style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              <span className="gradient-text" style={{ background: 'var(--gradient-main)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Studytra fixes all three — for free.</span>
            </p>
          </div>
        </div>

        {/* ── Statistics Strip ── */}
        <div className="container stats-row" style={{
          marginTop: 80, borderTop: '1px solid var(--border-default)', paddingTop: 56,
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'Plus Jakarta Sans' }}>
              <CountUp target={15480} suffix="+" />
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              AI Sessions Started
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#7c3aed', fontFamily: 'Plus Jakarta Sans' }}>
              <CountUp target={6} />
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Target Countries
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#06b6d4', fontFamily: 'Plus Jakarta Sans' }}>
              ₹<CountUp target={3} suffix=" Cr+" />
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Saved in Consultancy Fees
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          4. HOW IT WORKS
      ══════════════════════════════ */}
      <section id="how-it-works" style={{ padding: '100px 24px', background: 'var(--bg-primary)' }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 72 }} className="fade-in">
            <span style={{
              display: 'inline-block', background: 'rgba(37, 99, 235, 0.06)',
              border: '1px solid rgba(37, 99, 235, 0.15)', color: 'var(--accent-primary)',
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '5px 14px', borderRadius: 30, marginBottom: 16
            }}>
              Process
            </span>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800,
              color: 'var(--text-primary)', fontFamily: 'Plus Jakarta Sans, sans-serif'
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
                <div style={{ fontSize: '2.8rem', fontWeight: 800, color: 'rgba(37, 99, 235, 0.15)', marginBottom: 8 }}>
                  01
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>
                  Tell Us Your Dream
                </h3>
                <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
                  Fill in a quick, secure profile about your current education, university background, budget limits, and dream destinations. It takes less than 2 minutes and needs no login.
                </p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={15} color="var(--accent-primary)" />
                  <span>Interactive country, degree, and intake onboarding</span>
                </div>
              </div>
              {/* Mockup */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="glass-card" style={{
                  width: '100%', maxWidth: 380, padding: 20, background: 'var(--bg-card)',
                  border: '1px solid var(--border-card)', borderRadius: 24, boxShadow: 'var(--shadow-card)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginLeft: 6 }}>onboarding_form.jsx</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 10, fontWeight: 700, textTransform: 'uppercase' }}>
                    1. Select Dream Country
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                    <div style={{ border: '1px solid var(--accent-primary)', background: 'var(--theme-icon-hover)', padding: 8, borderRadius: 8, textAlign: 'center', fontSize: '0.76rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                      🇩🇪 Germany
                    </div>
                    <div style={{ border: '1px solid var(--border-default)', padding: 8, borderRadius: 8, textAlign: 'center', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                      🇦🇹 Austria
                    </div>
                    <div style={{ border: '1px solid var(--border-default)', padding: 8, borderRadius: 8, textAlign: 'center', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                      🇺🇸 USA
                    </div>
                    <div style={{ border: '1px solid var(--border-default)', padding: 8, borderRadius: 8, textAlign: 'center', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                      🇨🇦 Canada
                    </div>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 700 }}>
                    2. Target Course / Degree
                  </div>
                  <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-default)', padding: '10px 12px', borderRadius: 8, fontSize: '0.76rem', color: 'var(--text-primary)' }}>
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
                  width: '100%', maxWidth: 380, padding: 20, background: 'var(--bg-card)',
                  border: '1px solid var(--border-card)', borderRadius: 24, boxShadow: 'var(--shadow-card)'
                }}>
                  {/* Chat Bubbles */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', color: 'white', fontWeight: 800 }}>AI</div>
                    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', padding: 10, borderRadius: '0 12px 12px 12px', fontSize: '0.72rem', color: 'var(--text-secondary)', maxWidth: '80%', lineHeight: 1.4 }}>
                      Hello Arjun! Excellent choice. Germany has **no tuition fees** at public universities. Let's lock your intakes. Are you aiming for **Winter** or **Summer** semester?
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                    <div style={{ background: 'var(--gradient-main)', padding: 10, borderRadius: '12px 12px 0 12px', fontSize: '0.72rem', color: '#ffffff', maxWidth: '80%' }}>
                      I am aiming for Winter 2028 (Oct).
                    </div>
                  </div>
                  {/* Quick Action options */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <div style={{ background: 'var(--theme-icon-bg)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '4px 8px', fontSize: '0.62rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                      What exams do I need?
                    </div>
                    <div style={{ background: 'var(--theme-icon-bg)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '4px 8px', fontSize: '0.62rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                      Blocked account costs
                    </div>
                  </div>
                </div>
              </div>
              {/* Text */}
              <div>
                <div style={{ fontSize: '2.8rem', fontWeight: 800, color: 'rgba(124, 58, 237, 0.15)', marginBottom: 8 }}>
                  02
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>
                  Get Your AI Roadmap
                </h3>
                <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
                  Studytra AI maps out your entire destination timeline immediately. Ask specific questions about entrance exams (GRE, IELTS, TestAS), blocked account requirements, visa interviews, or scholarship applications.
                </p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={15} color="var(--accent-primary)" />
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
                <div style={{ fontSize: '2.8rem', fontWeight: 800, color: 'rgba(6, 182, 212, 0.15)', marginBottom: 8 }}>
                  03
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>
                  Execute with Confidence
                </h3>
                <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
                  Save your roadmap, sync document progress checklists, analyze living costs compared to savings targets, and review visa procedures. Everything remains synchronized in your student dashboard.
                </p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={15} color="var(--accent-primary)" />
                  <span>Progress checkpoints saved to Supabase dynamically</span>
                </div>
              </div>
              {/* Mockup */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="glass-card" style={{
                  width: '100%', maxWidth: 380, padding: 20, background: 'var(--bg-card)',
                  border: '1px solid var(--border-card)', borderRadius: 24, boxShadow: 'var(--shadow-card)'
                }}>
                  {/* Dashboard mock */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)' }}>Checklist Tracker</span>
                    <span style={{ fontSize: '0.64rem', color: 'var(--accent-success)', background: 'rgba(16, 185, 129, 0.08)', padding: '2px 6px', borderRadius: 4 }}>
                      Synced
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.74rem', color: 'var(--text-primary)' }}>
                      <input type="checkbox" defaultChecked style={{ accentColor: '#2563EB' }} readOnly />
                      <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>Draft SOP Statement</span>
                    </div>
                    <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.74rem', color: 'var(--text-primary)' }}>
                      <input type="checkbox" defaultChecked style={{ accentColor: '#2563EB' }} readOnly />
                      <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>Book IELTS Exam Slot</span>
                    </div>
                    <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.74rem', color: 'var(--text-primary)' }}>
                      <input type="checkbox" style={{ accentColor: '#2563EB' }} readOnly />
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
      <section id="features" style={{ background: 'var(--bg-secondary)', padding: '100px 24px', borderTop: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)' }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 60 }} className="fade-in">
            <span style={{
              display: 'inline-block', background: 'rgba(6, 182, 212, 0.06)',
              border: '1px solid rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)',
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '5px 14px', borderRadius: 30, marginBottom: 16
            }}>
              Features
            </span>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800,
              color: 'var(--text-primary)', fontFamily: 'Plus Jakarta Sans, sans-serif'
            }}>
              Everything You Need. Nothing You Don't.
            </h2>
          </div>

          {/* Features Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }} className="fade-in">
            {/* Feature 1 */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 24, boxShadow: 'var(--shadow-card)' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: 'rgba(37, 99, 235, 0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: 20
              }}>🤖</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>AI Study Abroad Advisor</h3>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 6px', borderRadius: 4 }}>LIVE</span>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }}>
                Chat 24/7 with Studytra AI. Get precise, instant answers about university deadlines, blocked account procedures, visa details, and local checklists.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 24, boxShadow: 'var(--shadow-card)' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: 'rgba(37, 99, 235, 0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: 20
              }}>🗺️</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Country Roadmaps</h3>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--accent-primary)', background: 'rgba(37, 99, 235, 0.08)', padding: '2px 6px', borderRadius: 4 }}>6 Countries</span>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }}>
                Detailed pre-departure and post-arrival execution timelines configured specifically for Germany, Austria, United Kingdom, USA, Canada, and Australia.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 24, boxShadow: 'var(--shadow-card)' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: 'rgba(37, 99, 235, 0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: 20
              }}>💰</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Real-Time Budget Estimator</h3>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--accent-primary)', background: 'rgba(37, 99, 235, 0.08)', padding: '2px 6px', borderRadius: 4 }}>Live Rates</span>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }}>
                Calculate tuition costs and monthly living expenses. Convert directly to INR using real-time API exchange rates to secure your finances correctly.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 24, boxShadow: 'var(--shadow-card)' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: 'rgba(37, 99, 235, 0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: 20
              }}>📄</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>SOP Writing Guides</h3>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--accent-primary)', background: 'rgba(37, 99, 235, 0.08)', padding: '2px 6px', borderRadius: 4 }}>Free</span>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }}>
                Access country-specific Statement of Purpose (SOP) structures, outlines, writing templates, and structural tips to write a high-impact profile statement.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 24, boxShadow: 'var(--shadow-card)' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: 'rgba(37, 99, 235, 0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: 20
              }}>🏦</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Education Loan Advisor</h3>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--accent-primary)', background: 'rgba(37, 99, 235, 0.08)', padding: '2px 6px', borderRadius: 4 }}>India-Specific</span>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }}>
                Understand collateral vs non-collateral options from Indian banks (SBI, HDFC Credila, etc.), verify interest rates, and check document rules.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', opacity: 0.6, background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 24 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: 'rgba(100, 116, 139, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: 20
              }}>📊</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-muted)', margin: 0 }}>Progress Checklist Sync</h3>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#64748b', background: 'rgba(100, 116, 139, 0.15)', padding: '2px 6px', borderRadius: 4 }}>SOON</span>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6, flex: 1 }}>
                Advanced features to upload documents directly, track reviews from community alumni, and synchronize your progress seamlessly across multiple devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          6. COUNTRIES SECTION
      ══════════════════════════════ */}
      <section id="countries" style={{ padding: '100px 24px', background: 'var(--bg-primary)' }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 60 }} className="fade-in">
            <span style={{
              display: 'inline-block', background: 'rgba(37, 99, 235, 0.06)',
              border: '1px solid rgba(37, 99, 235, 0.15)', color: 'var(--accent-primary)',
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '5px 14px', borderRadius: 30, marginBottom: 16
            }}>
              Destinations
            </span>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800,
              color: 'var(--text-primary)', fontFamily: 'Plus Jakarta Sans, sans-serif'
            }}>
              Where Will You Go?
            </h2>
            <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', marginTop: 8 }}>
              Studytra covers the most popular destinations for Indian students.
            </p>
          </div>

          {/* Countries Slider Grid */}
          <div className="countries-horizontal-scroll" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24
          }}>
            {/* Germany */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 24, boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: '2.5rem' }}>🇩🇪</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Germany</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, flex: 1 }}>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>🎓 <strong>Tuition:</strong> ~€500/sem (Public unis)</div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>💰 <strong>Living:</strong> €900–1,200/month</div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>✨ <strong>Highlights:</strong> Free public universities, solid engineering, 18-month job search visa.</div>
              </div>
              <a href="/app?country=Germany" className="btn-ghost" style={{ padding: '8px 16px', fontSize: '0.78rem', width: '100%', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, textDecoration: 'none', background: 'var(--bg-primary)', border: '1px solid var(--border-default)' }}>
                Explore Roadmap <ArrowUpRight size={13} />
              </a>
            </div>

            {/* Austria */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', position: 'relative', background: 'var(--bg-card)', border: '1px solid var(--accent-success)', borderRadius: 24, boxShadow: 'var(--shadow-card)' }}>
              <div style={{ position: 'absolute', top: 12, right: 12, background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', fontSize: '0.62rem', fontWeight: 800, padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                🆕 New
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: '2.5rem' }}>🇦🇹</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Austria</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, flex: 1 }}>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>🎓 <strong>Tuition:</strong> €1,500–3,000/year</div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>💰 <strong>Living:</strong> €700–1,100/month</div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>✨ <strong>Highlights:</strong> #1 most livable city (Vienna), no blocked account required, affordable fees.</div>
              </div>
              <a href="/app?country=Austria" className="btn-ghost" style={{ padding: '8px 16px', fontSize: '0.78rem', width: '100%', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, textDecoration: 'none', border: '1px solid var(--accent-success)', color: 'var(--accent-success)', background: 'rgba(16, 185, 129, 0.04)' }}>
                Explore Roadmap <ArrowUpRight size={13} />
              </a>
            </div>

            {/* UK */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 24, boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: '2.5rem' }}>🇬🇧</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>United Kingdom</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, flex: 1 }}>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>🎓 <strong>Tuition:</strong> £15,000–30,000/year</div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>💰 <strong>Living:</strong> £1,200–1,800/month</div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>✨ <strong>Highlights:</strong> 1-year master programs, 2-year Graduate Route PSW visa.</div>
              </div>
              <a href="/app?country=UK" className="btn-ghost" style={{ padding: '8px 16px', fontSize: '0.78rem', width: '100%', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, textDecoration: 'none', background: 'var(--bg-primary)', border: '1px solid var(--border-default)' }}>
                Explore Roadmap <ArrowUpRight size={13} />
              </a>
            </div>

            {/* USA */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 24, boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: '2.5rem' }}>🇺🇸</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>United States</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, flex: 1 }}>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>🎓 <strong>Tuition:</strong> $20,000–50,000/year</div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>💰 <strong>Living:</strong> $1,200–2,000/month</div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>✨ <strong>Highlights:</strong> OPT + STEM extensions (up to 3 years), world-class research hubs.</div>
              </div>
              <a href="/app?country=USA" className="btn-ghost" style={{ padding: '8px 16px', fontSize: '0.78rem', width: '100%', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, textDecoration: 'none', background: 'var(--bg-primary)', border: '1px solid var(--border-default)' }}>
                Explore Roadmap <ArrowUpRight size={13} />
              </a>
            </div>

            {/* Canada */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 24, boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: '2.5rem' }}>🇨🇦</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Canada</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, flex: 1 }}>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>🎓 <strong>Tuition:</strong> CAD 15,000–35,000/year</div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>💰 <strong>Living:</strong> CAD 1,200–2,000/month</div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>✨ <strong>Highlights:</strong> Up to 3-year PGWP work permit, structured Permanent Residency (PR) pathways.</div>
              </div>
              <a href="/app?country=Canada" className="btn-ghost" style={{ padding: '8px 16px', fontSize: '0.78rem', width: '100%', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, textDecoration: 'none', background: 'var(--bg-primary)', border: '1px solid var(--border-default)' }}>
                Explore Roadmap <ArrowUpRight size={13} />
              </a>
            </div>

            {/* Australia */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 24, boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: '2.5rem' }}>🇦🇺</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Australia</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, flex: 1 }}>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>🎓 <strong>Tuition:</strong> AUD 25,000–45,000/year</div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>💰 <strong>Living:</strong> AUD 1,500–2,200/month</div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>✨ <strong>Highlights:</strong> Post-study work visa (485 Graduate Stream), high minimum wage, top quality of life.</div>
              </div>
              <a href="/app?country=Australia" className="btn-ghost" style={{ padding: '8px 16px', fontSize: '0.78rem', width: '100%', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, textDecoration: 'none', background: 'var(--bg-primary)', border: '1px solid var(--border-default)' }}>
                Explore Roadmap <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          7. TESTIMONIALS / SOCIAL PROOF
      ══════════════════════════════ */}
      <section id="reviews" style={{ background: 'var(--bg-secondary)', padding: '100px 24px', borderTop: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)' }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 60 }} className="fade-in">
            <span style={{
              display: 'inline-block', background: 'rgba(37, 99, 235, 0.06)',
              border: '1px solid rgba(37, 99, 235, 0.15)', color: 'var(--accent-primary)',
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '5px 14px', borderRadius: 30, marginBottom: 16
            }}>
              Testimonials
            </span>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800,
              color: 'var(--text-primary)', fontFamily: 'Plus Jakarta Sans, sans-serif'
            }}>
              Indian Students Who Used Studytra
            </h2>
          </div>

          {/* Testimonial Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 52 }} className="fade-in">
            {/* Priya */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 24, boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="#fbbf24" color="#fbbf24" />)}
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.65, fontStyle: 'italic', flex: 1, marginBottom: 20 }}>
                "I was spending hours sorting through Reddit threads and YouTube videos. Studytra gave me a complete, structured Germany admission roadmap in 10 minutes. The AI understood exactly what I needed as an Indian B.Tech student."
              </p>
              <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 14 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 2px' }}>Priya Sharma</h4>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0 }}>B.Tech CSE → M.Sc AI, TU München</p>
              </div>
            </div>

            {/* Rahul */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', border: '1px solid var(--accent-success)', borderRadius: 24, boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="#fbbf24" color="#fbbf24" />)}
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.65, fontStyle: 'italic', flex: 1, marginBottom: 20 }}>
                "The budget calculator with live INR exchange rates was a total game-changer. I was able to estimate my monthly living costs in Vienna down to the rupee. I knew exactly how much education loan to secure."
              </p>
              <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 14 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-success)', margin: '0 0 2px' }}>Rahul Nair</h4>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0 }}>B.Com → MBA, University of Vienna</p>
              </div>
            </div>

            {/* Ankita */}
            <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', border: '1px solid var(--accent-success)', borderRadius: 24, boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="#fbbf24" color="#fbbf24" />)}
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.65, fontStyle: 'italic', flex: 1, marginBottom: 20 }}>
                "My local consultancy was charging ₹80,000 for standard applications. Studytra gave me better structured templates, checklists, and timelines for free. Completed my Austria paperwork successfully on my own!"
              </p>
              <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 14 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-success)', margin: '0 0 2px' }}>Ankita Das</h4>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0 }}>B.Pharm → M.Sc Biotechnology, University of Vienna</p>
              </div>
            </div>
          </div>

          {/* Social Proof CTA */}
          <div style={{ textAlign: 'center' }} className="fade-in">
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: 24, fontWeight: 500 }}>Join thousands of Indian students planning smarter.</p>
            <a href="/app" className="btn-primary" style={{ textDecoration: 'none' }}>
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
              display: 'inline-block', background: 'rgba(37, 99, 235, 0.06)',
              border: '1px solid rgba(37, 99, 235, 0.15)', color: 'var(--accent-primary)',
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '5px 14px', borderRadius: 30, marginBottom: 16
            }}>
              Pricing
            </span>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800,
              color: 'var(--text-primary)', fontFamily: 'Plus Jakarta Sans, sans-serif'
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
              border: '2px solid var(--accent-primary)', background: 'var(--bg-card)',
              boxShadow: 'var(--shadow-card)'
            }}>
              <div style={{
                position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                background: 'var(--gradient-main)', color: 'white',
                fontSize: '0.68rem', fontWeight: 800, padding: '4px 14px', borderRadius: 30,
                textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: 'var(--shadow-button)'
              }}>
                Most Popular
              </div>
              <div style={{ marginBottom: 24, textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Free Forever</h3>
                <div style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Plus Jakarta Sans' }}>
                  ₹0
                </div>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 4 }}>No credit card required. No hidden fees.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.84rem' }}>
                  <CheckCircle2 size={15} color="var(--accent-primary)" />
                  <span style={{ color: 'var(--text-primary)' }}>AI Study Abroad Advisor Chat</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.84rem' }}>
                  <CheckCircle2 size={15} color="var(--accent-primary)" />
                  <span style={{ color: 'var(--text-primary)' }}>6 Country Timelines & Roadmaps</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.84rem' }}>
                  <CheckCircle2 size={15} color="var(--accent-primary)" />
                  <span style={{ color: 'var(--text-primary)' }}>Budget Planner (Live Rates)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.84rem' }}>
                  <CheckCircle2 size={15} color="var(--accent-primary)" />
                  <span style={{ color: 'var(--text-primary)' }}>SOP Guides & ATS Resume Tips</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.84rem' }}>
                  <CheckCircle2 size={15} color="var(--accent-primary)" />
                  <span style={{ color: 'var(--text-primary)' }}>Education Loan Checklists</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.84rem' }}>
                  <CheckCircle2 size={15} color="var(--accent-primary)" />
                  <span style={{ color: 'var(--text-primary)' }}>Progress Checklist Dashboard</span>
                </div>
              </div>

              <a href="/app" className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                Start Planning Free →
              </a>
            </div>

            {/* Card 2: Consultancies */}
            <div className="glass-card" style={{ padding: '36px 28px', display: 'flex', flexDirection: 'column', opacity: 0.85, background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--border-default)' }}>
              <div style={{ marginBottom: 24, textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-error)', marginBottom: 8 }}>Traditional Consultancy</h3>
                <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--accent-error)', fontFamily: 'Plus Jakarta Sans' }}>
                  ₹50,000 - ₹2,00,000
                </div>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 4 }}>Standard commission-driven pricing.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.84rem', opacity: 0.8 }}>
                  <span style={{ color: 'var(--accent-error)' }}>❌</span>
                  <span style={{ color: 'var(--text-primary)' }}>Same static instructions, human-delivered</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.84rem', opacity: 0.8 }}>
                  <span style={{ color: 'var(--accent-error)' }}>❌</span>
                  <span style={{ color: 'var(--text-primary)' }}>Biased toward partner universities</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.84rem', opacity: 0.8 }}>
                  <span style={{ color: 'var(--accent-error)' }}>❌</span>
                  <span style={{ color: 'var(--text-primary)' }}>No real-time cost-saving estimators</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.84rem', opacity: 0.8 }}>
                  <span style={{ color: 'var(--accent-error)' }}>❌</span>
                  <span style={{ color: 'var(--text-primary)' }}>No instant AI queries, slow responses</span>
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '14px', fontSize: '0.84rem', color: 'var(--accent-error)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, fontWeight: 700, background: 'rgba(239, 68, 68, 0.04)' }}>
                High Costs & Hidden Biases
              </div>
            </div>

            {/* Card 3: What You Save */}
            <div className="glass-card" style={{ padding: '36px 28px', display: 'flex', flexDirection: 'column', border: '1.5px solid var(--accent-success)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ marginBottom: 24, textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-success)', marginBottom: 8 }}>What You Save</h3>
                <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--accent-success)', fontFamily: 'Plus Jakarta Sans' }}>
                  Smart & Efficient
                </div>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 4 }}>Your savings on using Studytra platform.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, justifyContent: 'center' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.25rem' }}>💰</span>
                  <div>
                    <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>₹50,000–2,00,000 saved</h4>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 2 }}>Keep your hard-earned funds for actual university fees & travel.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.25rem' }}>⏰</span>
                  <div>
                    <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>100+ Hours Saved</h4>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 2 }}>Skip reading endless scattered blogs. AI has digested all datasets.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.25rem' }}>😰</span>
                  <div>
                    <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>Zero Scattered Stress</h4>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 2 }}>Checklists, timelines, live rates, SOP structure, all in one browser window.</p>
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
        background: 'var(--bg-secondary)',
        padding: '90px 24px', position: 'relative', overflow: 'hidden',
        borderTop: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)'
      }} className="fade-in">
        <div style={{
          position: 'absolute', width: 450, height: 450, background: 'var(--accent-primary)',
          borderRadius: '50%', filter: 'blur(150px)', opacity: 0.06, top: '-10%', left: '5%',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', width: 450, height: 450, background: '#7c3aed',
          borderRadius: '50%', filter: 'blur(150px)', opacity: 0.05, bottom: '-10%', right: '5%',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 800 }}>
          <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: 16 }}>
            Ready to Start?
          </span>
          
          <h2 style={{
            fontSize: 'clamp(2.1rem, 5vw, 3.2rem)', fontWeight: 800,
            color: 'var(--text-primary)', marginBottom: 18, lineHeight: 1.2,
            fontFamily: 'Plus Jakarta Sans, sans-serif'
          }}>
            Your Dream University<br />Is One Plan Away.
          </h2>

          <p style={{
            fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6,
            maxWidth: 580, margin: '0 auto 36px'
          }}>
            Join thousands of Indian students who chose smart preparation over expensive agents. No sign-up required. Start planning in under 2 minutes.
          </p>

          <a href="/app" className="btn-primary" style={{
            padding: '16px 36px', fontSize: '1.05rem', fontWeight: 700,
            display: 'inline-block', boxShadow: 'var(--shadow-button)'
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            Start Planning Free →
          </a>

          <div style={{
            display: 'flex', justifyContent: 'center', gap: 18, flexWrap: 'wrap',
            marginTop: 40, fontSize: '0.76rem', color: 'var(--text-muted)'
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
      <footer style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', padding: '72px 24px 36px', borderTop: '1px solid var(--border-default)' }}>
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
                  fontSize: '1.15rem', color: 'var(--text-primary)'
                }}>Studytra</span>
              </a>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 280, marginBottom: 24 }}>
                AI-powered study abroad planning engine for Indian students. Built with ❤️ for smart applicants.
              </p>
              
              {/* GitHub Link */}
              <a 
                href="https://github.com/arupdas0825" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  fontSize: '0.84rem', color: 'var(--text-primary)', background: 'var(--bg-primary)',
                  border: '1px solid var(--border-default)', borderRadius: 10,
                  padding: '8px 14px', textDecoration: 'none', transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.borderColor = 'var(--accent-primary)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-primary)'; e.currentTarget.style.borderColor = 'var(--border-default)' }}
              >
                <Github size={14} />
                <span>github.com/arupdas0825</span>
              </a>
            </div>

            {/* Platform links */}
            <div>
              <h4 style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18 }}>
                Platform
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a href="#how-it-works" style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--accent-primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>How It Works</a>
                <a href="#countries" style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--accent-primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>Countries</a>
                <a href="/budget" style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--accent-primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>Budget Calculator</a>
                <a href="/tools/sop-guide" style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--accent-primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>SOP Writing Guide</a>
                <a href="/dashboard" style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--accent-primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>Dashboard Checklist</a>
              </div>
            </div>

            {/* Resources links */}
            <div>
              <h4 style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18 }}>
                Resources
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a href="/loans" style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--accent-primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>Loan Guidance</a>
                <a href="/dashboard?tab=visa" style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--accent-primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>Visa Steps Tracker</a>
                <a href="/tools/cv-formats" style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--accent-primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>Academic CV Formats</a>
                <a href="/tools/resume-formats" style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--accent-primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>ATS Resume Formats</a>
              </div>
            </div>

            {/* Countries links */}
            <div>
              <h4 style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18 }}>
                Countries
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a href="/app?country=Germany" style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--accent-primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>🇩🇪 Germany</a>
                <a href="/app?country=Austria" style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--accent-primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>🇦🇹 Austria</a>
                <a href="/app?country=UK" style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--accent-primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>🇬🇧 United Kingdom</a>
                <a href="/app?country=USA" style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--accent-primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>🇺🇸 United States</a>
                <a href="/app?country=Canada" style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--accent-primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>🇨🇦 Canada</a>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div style={{
            borderTop: '1px solid var(--border-default)', paddingTop: 24,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12
          }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              © 2026 Studytra. Built for Indian students. Contact: dasarup0804@gmail.com
            </span>
            <div style={{ display: 'flex', gap: 18, fontSize: '0.78rem' }}>
              <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a>
              <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</a>
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
