import React from 'react'
import { GraduationCap, Twitter, Linkedin, Instagram, Github, ArrowRight } from 'lucide-react'
import { COUNTRIES } from '../constants/countries'
import { useAuth } from '../context/AuthContext'

export default function Footer() {
  const { user, setAuthModalOpen } = useAuth()

  const cols = {
    Platform: [
      { label: 'Admission Roadmap', href: '/chat' },
      { label: 'Visa Process Tracker', href: '/dashboard' },
      { label: 'Cost & Budget Estimator', href: '/budget' },
      { label: 'Checklist Manager', href: '/dashboard' },
    ],
    Countries: COUNTRIES.map(c => ({
      label: `${c.flag} ${c.name}`,
      href: `/chat?country=${encodeURIComponent(c.name)}`,
    })),
    Resources: [
      { label: 'SOP Writing Guidelines', href: '/tools/sop-guide' },
      { label: 'Academic CV Formats', href: '/tools/cv-formats' },
      { label: 'ATS Resume Formats', href: '/tools/resume-formats' },
      { label: 'Education Loan Guide', href: '/loans' },
    ],
  }

  const handleLinkClick = (e, href) => {
    if (!href.startsWith('/#') && !user) {
      e.preventDefault()
      setAuthModalOpen(true)
    }
  }

  return (
    <>
      {/* ── Premium CTA Banner ── */}
      <section style={{
        background: '#f7f5f0',
        padding: '92px 24px',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(26,20,8,0.07)',
      }}>
        {/* Depth glows */}
        <div style={{
          position: 'absolute', width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(29,52,97,0.06) 0%, transparent 65%)',
          borderRadius: '50%', top: '-100px', left: '8%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 360, height: 360,
          background: 'radial-gradient(circle, rgba(184,146,42,0.05) 0%, transparent 65%)',
          borderRadius: '50%', bottom: '-80px', right: '8%', pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 880 }}>
          <div style={{
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(32px) saturate(1.8)',
            border: '1px solid rgba(255,255,255,0.95)',
            borderRadius: 28,
            padding: '56px 44px',
            boxShadow:
              '0 2px 0 rgba(255,255,255,1) inset, 0 32px 80px rgba(26,20,8,0.10), 0 8px 24px rgba(26,20,8,0.06)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Top sheen */}
            <div style={{
              position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,1) 40%, rgba(255,255,255,1) 60%, transparent)',
              pointerEvents: 'none',
            }} />

            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 18,
              lineHeight: 1.18,
              letterSpacing: '-0.02em',
            }}>
              Ready to Lock Your Abroad Roadmap?
            </h2>
            <p style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              maxWidth: 580,
              margin: '0 auto 36px',
            }}>
              Connect with our intelligent planner to lock destination timelines,
              verify checklists, and calculate your target intakes today.
            </p>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="/chat"
                onClick={(e) => handleLinkClick(e, '/chat')}
                style={{
                  background: 'var(--gradient-primary)',
                  color: 'white',
                  padding: '14px 30px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.92rem', fontWeight: 700,
                  fontFamily: 'var(--font-ui)',
                  boxShadow: '0 4px 18px rgba(29,52,97,0.28), inset 0 1px 0 rgba(255,255,255,0.12)',
                  transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  textDecoration: 'none',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(29,52,97,0.36)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 18px rgba(29,52,97,0.28)' }}
              >
                🚀 Plan with Studytra AI <ArrowRight size={15} />
              </a>
              <a
                href="/dashboard"
                onClick={(e) => handleLinkClick(e, '/dashboard')}
                style={{
                  background: 'rgba(29,52,97,0.055)',
                  border: '1.5px solid rgba(29,52,97,0.15)',
                  color: 'var(--navy)',
                  padding: '14px 30px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.92rem', fontWeight: 700,
                  fontFamily: 'var(--font-ui)',
                  transition: 'all 0.25s ease',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  textDecoration: 'none',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(29,52,97,0.10)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(29,52,97,0.055)'; e.currentTarget.style.transform = '' }}
              >
                📊 Open Dashboard
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Dark Premium Footer ── */}
      <footer className="footer-premium" style={{ padding: '72px 24px 36px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 48, marginBottom: 56 }} className="foot-grid">

            {/* Brand column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <img 
                  src="/studytra-logo.png" 
                  alt="Studytra Logo" 
                  style={{
                    width: 38, height: 38, borderRadius: 11,
                    objectFit: 'contain',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: '#ffffff',
                    padding: 4,
                    boxShadow: '0 4px 14px rgba(29,52,97,0.40)',
                  }}
                />
                <span style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontWeight: 800, fontSize: '1.25rem',
                  letterSpacing: '-0.03em',
                  color: '#ffffff',
                }}>Studytra</span>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.52)', lineHeight: 1.75, maxWidth: 280, marginBottom: 24 }}>
                AI-powered study abroad execution engine for Indian students.
                6 countries. Structured checklists. Zero costs.
              </p>

              {/* Country flag chips */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
                {COUNTRIES.map(c => {
                  const href = `/chat?country=${encodeURIComponent(c.name)}`
                  return (
                    <a
                      key={c.id}
                      href={href}
                      onClick={(e) => handleLinkClick(e, href)}
                      title={`Plan for ${c.name}`}
                      style={{
                        fontSize: '1.2rem',
                        background: 'rgba(255,255,255,0.07)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        width: 36, height: 36, borderRadius: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s', textDecoration: 'none',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.borderColor = 'rgba(184,146,42,0.40)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
                    >
                      {c.flag}
                    </a>
                  )
                })}
              </div>

              {/* Social icons */}
              <div style={{ display: 'flex', gap: 8 }}>
                {[Twitter, Linkedin, Instagram, Github].map((Icon, i) => (
                  <button key={i} style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s', cursor: 'pointer',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.borderColor = 'rgba(184,146,42,0.40)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
                  >
                    <Icon size={14} color="rgba(255,255,255,0.50)" />
                  </button>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(cols).map(([cat, items]) => (
              <div key={cat}>
                <h4 style={{
                  fontSize: '0.70rem', fontWeight: 700, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)',
                  marginBottom: 18, fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}>{cat}</h4>
                {items.map(item => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    style={{
                      display: 'block', marginBottom: 12,
                      fontSize: '0.86rem', color: 'rgba(255,255,255,0.52)',
                      transition: 'color 0.18s', textDecoration: 'none',
                    }}
                    onMouseEnter={e => e.target.style.color = '#ffffff'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.52)'}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            ))}
          </div>

          {/* Bottom strip */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: 24,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: 12,
          }}>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.30)' }}>
              © 2026 Studytra. Made with passion for Indian student applicants worldwide.
            </span>
            <div style={{ display: 'flex', gap: 22 }}>
              {['Privacy Policy', 'Terms of Service', 'Contact Us'].map(l => (
                <a
                  key={l}
                  href="#"
                  style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.30)', transition: 'color 0.18s', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.70)'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.30)'}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) { .foot-grid { grid-template-columns: 1fr 1fr !important; } }
          @media (max-width: 540px) { .foot-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </footer>
    </>
  )
}