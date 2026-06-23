import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, LogOut, User as UserIcon, LayoutDashboard, MessageSquare, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AuthModal from './auth/AuthModal'
import { useToast } from '../context/ToastContext'
import { useTheme } from '../context/ThemeContext'

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


const navLinks = [
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Countries', href: '/#countries' },
  {
    label: 'Tools',
    href: '#',
    dropdown: [
      {
        label: '📋 Student Execution Guides',
        href: '/tools/execution-guides',
        desc: 'Pre-departure + post-arrival roadmaps for 6 countries',
      },
      {
        label: '💰 Cost Estimator',
        href: '/budget',
        desc: 'Set your budget & calculate savings',
      },
      { label: '🏦 Loan Guide', href: '/loans', desc: 'Compare SBI, HDFC Credila & more' },
      { label: '📄 CV Formats', href: '/tools/cv-formats', desc: 'Academic CVs for Germany, Austria, UK, Canada, Australia' },
      { label: '📋 Resume Formats', href: '/tools/resume-formats', desc: 'ATS resumes for USA, Canada, UK, Australia' },
      { label: '✍️ SOP Guide', href: '/tools/sop-guide', desc: 'Country-specific SOP formats & writing guide' },
    ],
  },
  { label: 'Reviews', href: '/#reviews' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false)
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  
  const { user, logout } = useAuth()
  const { showSuccess } = useToast()
  const navigate = useNavigate()
  
  const avatarDropdownRef = useRef(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 18)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

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

  const handleSignOut = async () => {
    try {
      await logout()
      showSuccess("Successfully signed out ✓")
      setAvatarDropdownOpen(false)
      navigate('/')
    } catch (err) {
      console.error("Sign out failed: ", err)
    }
  }

  // Get initials for initials-based fallback avatar
  const getInitials = () => {
    if (!user) return "?"
    if (user.displayName) return user.displayName.charAt(0).toUpperCase()
    if (user.email) return user.email.charAt(0).toUpperCase()
    return "?"
  }

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: scrolled
            ? 'var(--navbar-bg)'
            : 'var(--glass-bg)',
          backdropFilter: 'blur(16px)',
          borderBottom: scrolled
            ? '1px solid var(--navbar-border)'
            : '1px solid transparent',
          transition: 'all 0.3s ease',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 68,
          }}
        >
          {/* ── Logo ── */}
          <a
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              textDecoration: 'none',
            }}
          >
            <img 
              src="/studytra-logo.png" 
              alt="Studytra Logo" 
              style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 12, 
                boxShadow: '0 4px 14px rgba(79,142,247,0.3)', 
                flexShrink: 0,
                objectFit: 'contain'
              }} 
            />
            <span
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 800,
                fontSize: '1.25rem',
                color: 'var(--text-primary)',
                letterSpacing: '-0.03em',
              }}
            >
              Studytra
            </span>
          </a>

          {/* ── Desktop Nav Links ── */}
          <div
            className="desk-nav"
            style={{ display: 'flex', gap: 6, alignItems: 'center' }}
          >
            {navLinks.map(link =>
              link.dropdown ? (
                <div
                  key={link.label}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => setToolsDropdownOpen(true)}
                  onMouseLeave={() => setToolsDropdownOpen(false)}
                >
                  <button
                    onClick={() => setToolsDropdownOpen(o => !o)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      background: toolsDropdownOpen ? 'var(--theme-icon-hover)' : 'none',
                      color: toolsDropdownOpen ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      padding: '8px 14px',
                      borderRadius: 'var(--r-sm)',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                      border: 'none',
                    }}
                  >
                    {link.label}
                    <ChevronDown
                      size={13}
                      style={{
                        transform: toolsDropdownOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s',
                      }}
                    />
                  </button>

                  {toolsDropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        paddingTop: 6,
                        zIndex: 999,
                        minWidth: 280,
                      }}
                    >
                      <div
                        style={{
                          background: 'var(--bg-card)',
                          borderRadius: 'var(--r-lg)',
                          boxShadow: 'var(--shadow-xl)',
                          border: '1px solid var(--border-default)',
                          padding: 8,
                          animation: 'fadeUp 0.18s ease',
                        }}
                      >
                        {link.dropdown.map(item => (
                          <a
                            key={item.label}
                            href={item.href}
                            style={{
                              display: 'block',
                              padding: '10px 14px',
                              borderRadius: 'var(--r-md)',
                              transition: 'background 0.15s',
                              textDecoration: 'none',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--theme-icon-hover)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                          >
                            <div
                              style={{
                                fontSize: '0.88rem',
                                fontWeight: 700,
                                color: 'var(--text-primary)',
                                marginBottom: 2,
                              }}
                            >
                              {item.label}
                            </div>
                            <div
                              style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-secondary)',
                              }}
                            >
                              {item.desc}
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--r-sm)',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'var(--accent-primary)'
                    e.currentTarget.style.background = 'var(--theme-icon-hover)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'var(--text-secondary)'
                    e.currentTarget.style.background = 'none'
                  }}
                >
                  {link.label}
                </a>
              )
            )}
            {user && (
              <a
                href="/dashboard"
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--r-sm)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--accent-primary)'
                  e.currentTarget.style.background = 'var(--theme-icon-hover)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--text-secondary)'
                  e.currentTarget.style.background = 'none'
                }}
              >
                Dashboard
              </a>
            )}
          </div>

          {/* ── Auth State Buttons ── */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
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
                    position: 'absolute', top: '110%', right: 0,
                    width: 240, background: 'var(--bg-card)',
                    backdropFilter: 'blur(20px)', border: '1px solid var(--border)',
                    borderRadius: 16, padding: '14px', zIndex: 1000,
                    boxShadow: 'var(--shadow-xl)',
                    animation: 'avatarDropdownFadeUp 0.18s ease'
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
              <button
                onClick={() => setAuthModalOpen(true)}
                style={{
                  background: 'var(--gradient-main)',
                  color: 'var(--text-inverse, white)',
                  padding: '10px 20px',
                  borderRadius: 'var(--r-sm)',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  boxShadow: 'var(--shadow-button)',
                  transition: 'all 0.2s',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none'
                }}
              >
                Sign In
              </button>
            )}

            <button
              className="burger"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'none', padding: 6, display: 'none', border: 'none', cursor: 'pointer' }}
            >
              {menuOpen ? (
                <X size={22} color="var(--text-primary)" />
              ) : (
                <Menu size={22} color="var(--text-primary)" />
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {menuOpen && (
          <div
            style={{
              background: 'var(--bg-secondary)',
              borderTop: '1px solid var(--border)',
              padding: '16px 24px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            {/* Mobile Theme Toggle Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 8px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>Theme</span>
              <ThemeToggle />
            </div>

            {navLinks.map(link =>
              link.dropdown ? (
                <div key={link.label}>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      padding: '12px 8px 6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    Tools
                  </div>
                  {link.dropdown.map(item => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      style={{
                        display: 'block',
                        padding: '10px 8px',
                        fontSize: '0.92rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        textDecoration: 'none',
                      }}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '12px 8px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    borderBottom: '1px solid var(--border)',
                    textDecoration: 'none',
                  }}
                >
                  {link.label}
                </a>
              )
            )}
            {user ? (
              <>
                <a
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '12px 8px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'var(--primary)',
                    borderBottom: '1px solid var(--border)',
                    textDecoration: 'none',
                  }}
                >
                  Dashboard
                </a>
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    handleSignOut()
                  }}
                  style={{
                    marginTop: 12,
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    padding: 13,
                    borderRadius: 'var(--r-sm)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false)
                  setAuthModalOpen(true)
                }}
                style={{
                  marginTop: 12,
                  background: 'var(--gradient-main)',
                  color: 'var(--text-inverse, white)',
                  padding: 13,
                  borderRadius: 'var(--r-sm)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Sign In
              </button>
            )}
          </div>
        )}

        <style>{`
          @keyframes avatarDropdownFadeUp {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateX(-50%) translateY(6px); }
            to   { opacity: 1; transform: translateX(-50%) translateY(0); }
          }
          @media (max-width: 900px) {
            .desk-nav { display: none !important; }
            .burger   { display: flex !important; }
          }
        `}</style>
      </nav>

      {/* Render the Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onGuestContinue={() => {
          showSuccess("Continuing as guest");
        }}
      />
    </>
  )
}