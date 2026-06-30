import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

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
        desc: 'Pre-departure + post-arrival roadmaps for 5 countries',
      },
      {
        label: '💰 Cost Estimator',
        href: '/budget',
        desc: 'Set your budget & calculate savings',
      },
      { label: '🏦 Loan Guide', href: '/loan', desc: 'Compare SBI, Credila, ICICI & more' },
      { label: '📄 CV Formats', href: '/tools/cv-formats', desc: 'Academic CVs for Germany, UK, Canada...' },
      { label: '📋 Resume Formats', href: '/tools/resume-formats', desc: 'ATS resumes for USA, Canada, UK, Australia' },
      { label: '✍️ SOP Guide', href: '/sop', desc: 'Country-specific SOP formats & writing guide' },
    ],
  },
  { label: 'Reviews', href: '/#reviews' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false)
  
  const { user, setAuthModalOpen } = useAuth()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 18)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setToolsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const handleNavClick = (e, link) => {
    if (link.href.startsWith('/#')) {
      // Allow scrolling to sections
      if (window.location.pathname !== '/') {
        e.preventDefault()
        navigate(link.href)
      }
      setMobileMenuOpen(false)
      return
    }
  }

  const handleAuthAction = () => {
    if (user) {
      navigate('/chat')
    } else {
      setAuthModalOpen(true)
    }
    setMobileMenuOpen(false)
  }

  return (
    <>
      <svg style={{ display: 'none' }}>
        <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
          <feTurbulence type="fractalNoise" baseFrequency="0.001 0.005" numOctaves="1" seed="17" result="turbulence" />
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
            <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
            <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
          </feComponentTransfer>
          <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
          <feSpecularLighting in="softMap" surfaceScale="5" specularConstant="1" specularExponent="100" lightingColor="white" result="specLight">
            <fePointLight x="-200" y="-200" z="300" />
          </feSpecularLighting>
          <feComposite in="specLight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litImage" />
          <feDisplacementMap in="SourceGraphic" in2="softMap" scale="200" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <nav className={`navbar liquid-glass-container ${scrolled ? 'scrolled' : ''}`}>
        {/* Liquid Glass Layers */}
        <div className="liquid-glass-distortion-layer" />
        <div 
          className="liquid-glass-color-layer" 
          style={{ 
            background: scrolled ? 'rgba(247, 245, 240, 0.88)' : 'rgba(247, 245, 240, 0.25)',
            transition: 'background 0.35s ease'
          }} 
        />
        <div className="liquid-glass-sheen-layer" />

        {/* Logo and Brand */}
        <Link to="/" className="navbar-logo" style={{ position: 'relative', zIndex: 10 }}>
          <img src="/studytra-logo.png" alt="Studytra Logo" />
          <span className="navbar-logo-text">Studytra</span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links navbar-desktop-links" style={{ display: 'none', position: 'relative', zIndex: 10 }}>
          {navLinks.map(link => 
            link.dropdown ? (
              <div 
                key={link.label} 
                ref={dropdownRef} 
                style={{ position: 'relative' }}
                onMouseEnter={() => setToolsDropdownOpen(true)}
                onMouseLeave={() => setToolsDropdownOpen(false)}
              >
                <button 
                  className={`nav-link ${toolsDropdownOpen ? 'active' : ''}`}
                  onClick={() => setToolsDropdownOpen(o => !o)}
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  {link.label}
                  <ChevronDown size={13} style={{ transform: toolsDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {toolsDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    paddingTop: 8,
                    zIndex: 999,
                    minWidth: 320,
                  }}>
                    <div style={{
                      background: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-default)',
                      boxShadow: 'var(--shadow-lg)',
                      padding: 10,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4
                    }}>
                      {link.dropdown.map(item => (
                        <Link
                          key={item.label}
                          to={item.href}
                          style={{
                            display: 'block',
                            padding: '10px 14px',
                            borderRadius: 'var(--radius-md)',
                            textDecoration: 'none',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                          <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
                            {item.label}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            {item.desc}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <a 
                key={link.label} 
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className="nav-link"
              >
                {link.label}
              </a>
            )
          )}
        </div>

        {/* Right Buttons */}
        <div className="navbar-right" style={{ position: 'relative', zIndex: 10 }}>
          {user ? (
            <button onClick={handleAuthAction} className="btn-signin-nav">
              Workspace →
            </button>
          ) : (
            <button onClick={handleAuthAction} className="btn-signin-nav">
              Sign In
            </button>
          )}

          {/* Mobile hamburger menu */}
          <button 
            className="navbar-mobile-toggle"
            onClick={() => setMobileMenuOpen(o => !o)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--navy)',
              padding: 4,
              display: 'none'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 64, left: 0, right: 0,
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)',
          padding: '16px 24px 24px',
          zIndex: 99998,
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}>
          {navLinks.map(link => 
            link.dropdown ? (
              <div key={link.label} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.08em', padding: '0 8px' }}>
                  {link.label}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 8 }}>
                  {link.dropdown.map(item => (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        padding: '8px 10px',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        textDecoration: 'none'
                      }}
                    >
                      {item.label.split(' ').slice(1).join(' ')} {/* Remove emoji prefix for mobile simplicity */}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <a 
                key={link.label} 
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                style={{
                  padding: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  textDecoration: 'none'
                }}
              >
                {link.label}
              </a>
            )
          )}
          
          <button 
            onClick={handleAuthAction}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 8 }}
          >
            {user ? 'Go to Workspace' : 'Sign In'}
          </button>
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          .navbar-desktop-links {
            display: flex !important;
          }
        }
        @media (max-width: 768px) {
          .navbar-mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </>
  )
}