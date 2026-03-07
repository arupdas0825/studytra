import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 18)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Countries', href: '#countries' },
    { label: 'Features', href: '#features' },
    { label: 'Reviews', href: '#reviews' },
  ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
      backdropFilter: scrolled ? 'blur(14px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--gray-200)' : '1px solid transparent',
      transition: 'all 0.3s ease',
    }}>
      <div className="container" style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 68,
      }}>
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11,
            background: 'linear-gradient(135deg, var(--blue-700) 0%, var(--blue-500) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(26,58,140,0.3)',
          }}>
            <GraduationCap size={20} color="white" />
          </div>
          <span style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontWeight: 800, fontSize: '1.25rem',
            color: 'var(--blue-900)',
            letterSpacing: '-0.03em',
          }}>Studytra</span>
        </a>

        {/* Desktop nav */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="desk-nav">
          {links.map(l => (
            <a key={l.label} href={l.href} style={{
              fontSize: '0.88rem', fontWeight: 500,
              color: 'var(--gray-500)',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = 'var(--blue-700)'}
              onMouseLeave={e => e.target.style.color = 'var(--gray-500)'}
            >{l.label}</a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => navigate('/chat')} style={{
            background: 'linear-gradient(135deg, var(--blue-700) 0%, var(--blue-500) 100%)',
            color: 'white', padding: '10px 22px', borderRadius: 'var(--r-sm)',
            fontSize: '0.88rem', fontWeight: 600,
            boxShadow: '0 4px 16px rgba(26,58,140,0.25)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(26,58,140,0.35)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(26,58,140,0.25)' }}
          >Start Planning →</button>

          <button className="burger"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', padding: 6, display: 'none' }}
          >
            {menuOpen ? <X size={22} color="var(--blue-900)" /> : <Menu size={22} color="var(--blue-900)" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'white', borderTop: '1px solid var(--gray-200)',
          padding: '16px 24px 24px',
          display: 'flex', flexDirection: 'column', gap: 18,
        }}>
          {links.map(l => (
            <a key={l.label} href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--blue-900)' }}
            >{l.label}</a>
          ))}
          <button onClick={() => { setMenuOpen(false); navigate('/chat') }} style={{
            background: 'var(--blue-700)', color: 'white',
            padding: '13px', borderRadius: 'var(--r-sm)',
            fontWeight: 700, fontSize: '0.95rem',
          }}>Start Planning →</button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desk-nav { display: none !important; }
          .burger { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}