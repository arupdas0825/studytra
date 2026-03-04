import { useState, useEffect } from 'react'
import { GraduationCap, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = ['How It Works', 'Countries', 'Features', 'Reviews']

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(255,255,255,0.96)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid #e4e4df' : '1px solid transparent',
      transition: 'all 0.3s ease',
      padding: '0 24px',
    }}>
      <div style={{
        maxWidth: 1160, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        height: 68,
      }}>
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--navy)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <GraduationCap size={20} color="white" />
          </div>
          <span style={{
            fontFamily: 'Fraunces, serif',
            fontWeight: 700, fontSize: '1.3rem',
            color: 'var(--navy)',
            letterSpacing: '-0.02em',
          }}>Studytra</span>
        </a>

        {/* Desktop Links */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}
          className="desktop-nav">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`}
              style={{
                fontSize: '0.9rem', fontWeight: 500,
                color: 'var(--gray-600)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--navy)'}
              onMouseLeave={e => e.target.style.color = 'var(--gray-600)'}
            >{l}</a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button style={{
            display: 'none',
            background: 'none', color: 'var(--navy)', fontSize: '0.9rem',
            fontWeight: 500, padding: '8px 16px',
          }} className="sign-in-btn">Sign In</button>
          <button style={{
            background: 'var(--navy)', color: 'white',
            padding: '10px 22px', borderRadius: 10,
            fontSize: '0.88rem', fontWeight: 600,
            letterSpacing: '0.01em',
            transition: 'background 0.2s, transform 0.15s',
          }}
            onMouseEnter={e => { e.target.style.background = 'var(--navy-mid)'; e.target.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.target.style.background = 'var(--navy)'; e.target.style.transform = 'translateY(0)' }}
          >
            Start Planning →
          </button>
          <button
            style={{ background: 'none', display: 'none', padding: 6 }}
            className="menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} color="var(--navy)" /> : <Menu size={22} color="var(--navy)" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: 'white', borderTop: '1px solid var(--gray-200)',
          padding: '16px 24px 24px',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`}
              onClick={() => setMenuOpen(false)}
              style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--navy)' }}
            >{l}</a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .sign-in-btn { display: block !important; }
        }
      `}</style>
    </nav>
  )
}