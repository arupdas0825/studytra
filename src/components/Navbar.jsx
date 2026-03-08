import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'

const navLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Countries', href: '#countries' },
  {
    label: 'Tools', href: '#',
    dropdown: [
      { label: '🗺️ Roadmap Planner', href: '#roadmap', desc: 'Stage-by-stage visual roadmap' },
      { label: '💰 Cost Estimator', href: '/budget', desc: 'Set your budget & calculate savings' },
      { label: '🏦 Loan Guide', href: '#loans', desc: 'Compare SBI, HDFC Credila & more' },
    ]
  },
  { label: 'Reviews', href: '#reviews' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 18)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: scrolled ? '1px solid var(--gray-200)' : '1px solid transparent',
      transition: 'all 0.3s ease',
    }}>
      <div className="container" style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 68,
      }}>
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #1a3a8c 0%, #2563eb 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(26,58,140,0.35)',
            flexShrink: 0,
          }}>
            {/* Graduation cap + airplane combined SVG */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Graduation cap */}
              <polygon points="12,3 22,8 12,13 2,8" fill="white" opacity="0.95" />
              <path d="M6 10.5v4.5c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              {/* Airplane */}
              <path d="M19 16.5 l-3.5-2 -5.5 3 1-4L7 11l4.5-.5L13 7l1.5 3.5L19 11l-2.5 1.5z" fill="#93c5fd" stroke="white" strokeWidth="0.4" />
            </svg>
          </div>
          <span style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontWeight: 800, fontSize: '1.25rem',
            color: 'var(--blue-900)', letterSpacing: '-0.03em',
          }}>Studytra</span>
        </a>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }} className="desk-nav">
          {navLinks.map(link => (
            link.dropdown ? (
              <div key={link.label} style={{ position: 'relative' }}
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    background: dropdownOpen ? 'var(--blue-50)' : 'none',
                    color: dropdownOpen ? 'var(--blue-700)' : 'var(--gray-500)',
                    padding: '8px 14px', borderRadius: 'var(--r-sm)',
                    fontSize: '0.88rem', fontWeight: 500, transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                >
                  {link.label} <ChevronDown size={13} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {/* Padding bridge: eliminates the gap so cursor doesn't lose hover state */}
                {dropdownOpen && (
                  <div style={{
                    position: 'absolute', top: '100%', left: '50%',
                    transform: 'translateX(-50%)',
                    paddingTop: 6,       /* bridge gap — NO marginTop */
                    zIndex: 999,
                    minWidth: 260,
                  }}>
                    <div style={{
                      background: 'white', borderRadius: 'var(--r-lg)',
                      boxShadow: 'var(--shadow-xl)',
                      border: '1px solid var(--gray-200)',
                      padding: 8,
                      animation: 'fadeUp 0.18s ease',
                    }}>
                      {link.dropdown.map(item => (
                        <a key={item.label} href={item.href} style={{
                          display: 'block', padding: '10px 14px',
                          borderRadius: 'var(--r-md)',
                          transition: 'background 0.15s',
                          textDecoration: 'none',
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-50)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--blue-950)', marginBottom: 2 }}>{item.label}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{item.desc}</div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <a key={link.label} href={link.href} style={{
                padding: '8px 14px', borderRadius: 'var(--r-sm)',
                fontSize: '0.88rem', fontWeight: 500,
                color: 'var(--gray-500)', transition: 'all 0.2s',
                textDecoration: 'none',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--blue-700)'; e.currentTarget.style.background = 'var(--blue-50)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--gray-500)'; e.currentTarget.style.background = 'none' }}
              >{link.label}</a>
            )
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
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(26,58,140,0.25)' }}
          >Start Planning →</button>

          <button className="burger" onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', padding: 6, display: 'none' }}>
            {menuOpen ? <X size={22} color="var(--blue-900)" /> : <Menu size={22} color="var(--blue-900)" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'white', borderTop: '1px solid var(--gray-200)',
          padding: '16px 24px 24px',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {navLinks.map(link => (
            link.dropdown ? (
              <div key={link.label}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray-400)', padding: '12px 8px 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tools</div>
                {link.dropdown.map(item => (
                  <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)} style={{
                    display: 'block', padding: '10px 8px',
                    fontSize: '0.92rem', fontWeight: 600, color: 'var(--blue-900)',
                  }}>{item.label}</a>
                ))}
              </div>
            ) : (
              <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)} style={{
                display: 'block', padding: '12px 8px',
                fontSize: '1rem', fontWeight: 600, color: 'var(--blue-900)',
                borderBottom: '1px solid var(--gray-100)',
              }}>{link.label}</a>
            )
          ))}
          <button onClick={() => { setMenuOpen(false); navigate('/chat') }} style={{
            marginTop: 12,
            background: 'var(--blue-700)', color: 'white',
            padding: 13, borderRadius: 'var(--r-sm)',
            fontWeight: 700, fontSize: '0.95rem',
          }}>Start Planning →</button>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) { .desk-nav { display: none !important; } .burger { display: flex !important; } }
      `}</style>
    </nav>
  )
}