import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react'
import { supabase } from '../utils/supabase'

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
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 18)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleGoogleSignIn = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      })
    } catch (err) {
      console.error('Google Sign-In Error:', err)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    navigate('/')
  }

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled
          ? 'rgba(5, 9, 20, 0.85)'
          : 'rgba(5, 9, 20, 0.65)',
        backdropFilter: 'blur(16px)',
        borderBottom: scrolled
          ? '1px solid rgba(79, 142, 247, 0.15)'
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
              color: '#f0f4ff',
              letterSpacing: '-0.03em',
            }}
          >
            Studytra
          </span>
        </a>

        {/* ── Desktop Nav ── */}
        <div
          className="desk-nav"
          style={{ display: 'flex', gap: 6, alignItems: 'center' }}
        >
          {navLinks.map(link =>
            link.dropdown ? (
              <div
                key={link.label}
                style={{ position: 'relative' }}
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    background: dropdownOpen ? 'rgba(79, 142, 247, 0.1)' : 'none',
                    color: dropdownOpen ? '#4f8ef7' : '#94a3b8',
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
                      transform: dropdownOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s',
                    }}
                  />
                </button>

                {dropdownOpen && (
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
                        background: '#0f2135',
                        borderRadius: 'var(--r-lg)',
                        boxShadow: 'var(--shadow-xl)',
                        border: '1px solid rgba(79, 142, 247, 0.15)',
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
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(79, 142, 247, 0.1)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                        >
                          <div
                            style={{
                              fontSize: '0.88rem',
                              fontWeight: 700,
                              color: '#f0f4ff',
                              marginBottom: 2,
                            }}
                          >
                            {item.label}
                          </div>
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: '#94a3b8',
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
                  color: '#94a3b8',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#4f8ef7'
                  e.currentTarget.style.background = 'rgba(79, 142, 247, 0.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '#94a3b8'
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
                color: '#94a3b8',
                transition: 'all 0.2s',
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#4f8ef7'
                e.currentTarget.style.background = 'rgba(79, 142, 247, 0.08)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#94a3b8'
                e.currentTarget.style.background = 'none'
              }}
            >
              Dashboard
            </a>
          )}
        </div>

        {/* ── CTA / Auth ── */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* User Avatar Circle */}
              <div
                onClick={() => navigate('/dashboard')}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4f8ef7 0%, #7c3aed 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f0f4ff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: '0 0 10px rgba(79,142,247,0.3)',
                }}
              >
                {user.email?.charAt(0).toUpperCase()}
              </div>

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="desk-nav"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  padding: '8px 16px',
                  borderRadius: 'var(--r-sm)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
              >
                <LogOut size={13} />
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              style={{
                background: 'linear-gradient(135deg, #4f8ef7 0%, #7c3aed 100%)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: 'var(--r-sm)',
                fontSize: '0.88rem',
                fontWeight: 700,
                boxShadow: '0 4px 16px rgba(79,142,247,0.25)',
                transition: 'all 0.2s',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(79,142,247,0.35)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,142,247,0.25)'
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
              <X size={22} color="#f0f4ff" />
            ) : (
              <Menu size={22} color="#f0f4ff" />
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div
          style={{
            background: '#0d1b2a',
            borderTop: '1px solid rgba(79, 142, 247, 0.15)',
            padding: '16px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {navLinks.map(link =>
            link.dropdown ? (
              <div key={link.label}>
                <div
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#64748b',
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
                      color: '#f0f4ff',
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
                  color: '#f0f4ff',
                  borderBottom: '1px solid rgba(79, 142, 247, 0.08)',
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
                  color: '#4f8ef7',
                  borderBottom: '1px solid rgba(79, 142, 247, 0.08)',
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
                handleGoogleSignIn()
              }}
              style={{
                marginTop: 12,
                background: 'linear-gradient(135deg, #4f8ef7 0%, #7c3aed 100%)',
                color: 'white',
                padding: 13,
                borderRadius: 'var(--r-sm)',
                fontWeight: 700,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Sign In with Google
            </button>
          )}
        </div>
      )}

      <style>{`
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
  )
}