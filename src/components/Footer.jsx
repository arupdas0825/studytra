import React from 'react'
import { GraduationCap, Twitter, Linkedin, Instagram, Github, ArrowRight } from 'lucide-react'
import { COUNTRIES } from '../constants/countries'

export default function Footer() {
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

  return (
    <>
      {/* ── Premium CTA Banner Block ── */}
      <section style={{
        background: '#050914',
        padding: '90px 24px',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(79, 142, 247, 0.15)'
      }}>
        {/* Glow rings */}
        <div style={{
          position: 'absolute', width: 450, height: 450, background: '#4f8ef7',
          borderRadius: '50%', filter: 'blur(150px)', opacity: 0.08, top: '-80px', left: '10%',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', width: 450, height: 450, background: '#7c3aed',
          borderRadius: '50%', filter: 'blur(150px)', opacity: 0.08, bottom: '-80px', right: '10%',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 860 }}>
          <div style={{
            background: 'rgba(15, 33, 53, 0.5)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(79, 142, 247, 0.2)',
            borderRadius: 24,
            padding: '56px 40px',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <h2 style={{
              fontSize: '2.1rem',
              fontWeight: 800,
              color: '#f0f4ff',
              marginBottom: 16,
              lineHeight: 1.25,
              fontFamily: 'Plus Jakarta Sans, sans-serif'
            }}>
              Ready to Lock Your Abroad Roadmap?
            </h2>
            <p style={{
              fontSize: '0.96rem',
              color: '#94a3b8',
              lineHeight: 1.65,
              maxWidth: 580,
              margin: '0 auto 36px'
            }}>
              Connect with our intelligent planner to lock destination timelines, verify checklists, and calculate your target intakes today.
            </p>

            <div style={{
              display: 'flex',
              gap: 16,
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <a href="/chat" style={{
                background: 'linear-gradient(135deg, #4f8ef7 0%, #7c3aed 100%)',
                color: 'white',
                padding: '14px 30px',
                borderRadius: 12,
                fontSize: '0.92rem',
                fontWeight: 700,
                boxShadow: '0 4px 16px rgba(124,58,237,0.35)',
                transition: 'all 0.2s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                textDecoration: 'none'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.45)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,58,237,0.35)' }}
              >
                <span>🚀 Plan with Studytra AI</span>
                <ArrowRight size={15} />
              </a>
              <a href="/dashboard" style={{
                background: 'rgba(79, 142, 247, 0.08)',
                border: '1px solid rgba(79, 142, 247, 0.25)',
                color: '#4f8ef7',
                padding: '14px 30px',
                borderRadius: 12,
                fontSize: '0.92rem',
                fontWeight: 700,
                transition: 'all 0.2s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                textDecoration: 'none'
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(79, 142, 247, 0.15)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(79, 142, 247, 0.08)'; e.currentTarget.style.transform = 'none' }}
              >
                <span>📊 Open Dashboard</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer Section ── */}
      <footer style={{ 
        background: '#050914', 
        color: '#f0f4ff', 
        padding: '72px 24px 36px',
        borderTop: '1px solid rgba(79, 142, 247, 0.12)'
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 48, marginBottom: 56 }} className="foot-grid">
            
            {/* Brand column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 11,
                  background: 'linear-gradient(135deg, #4f8ef7 0%, #7c3aed 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(79,142,247,0.25)'
                }}>
                  <GraduationCap size={20} color="white" />
                </div>
                <span style={{ 
                  fontFamily: 'Plus Jakarta Sans, sans-serif', 
                  fontWeight: 800, 
                  fontSize: '1.25rem',
                  letterSpacing: '-0.02em',
                  color: '#f0f4ff'
                }}>Studytra</span>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.75, maxWidth: 280, marginBottom: 24 }}>
                AI-powered study abroad execution engine for Indian students. 6 countries. Structured checklists. Zero costs.
              </p>
              
              {/* Country badges */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
                {COUNTRIES.map(c => (
                  <a 
                    key={c.id} 
                    href={`/chat?country=${encodeURIComponent(c.name)}`}
                    title={`Plan for ${c.name}`} 
                    style={{
                      fontSize: '1.2rem', 
                      background: 'rgba(79, 142, 247, 0.08)',
                      border: '1px solid rgba(79, 142, 247, 0.12)',
                      width: 36, height: 36, borderRadius: 10,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(79, 142, 247, 0.18)'; e.currentTarget.style.borderColor = '#4f8ef7' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(79, 142, 247, 0.08)'; e.currentTarget.style.borderColor = 'rgba(79, 142, 247, 0.12)' }}
                  >
                    {c.flag}
                  </a>
                ))}
              </div>

              {/* Social icons */}
              <div style={{ display: 'flex', gap: 10 }}>
                {[Twitter, Linkedin, Instagram, Github].map((Icon, i) => (
                  <button key={i} style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'rgba(79, 142, 247, 0.08)',
                    border: '1px solid rgba(79, 142, 247, 0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(79, 142, 247, 0.18)'; e.currentTarget.style.borderColor = '#4f8ef7' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(79, 142, 247, 0.08)'; e.currentTarget.style.borderColor = 'rgba(79, 142, 247, 0.12)' }}
                  >
                    <Icon size={14} color="#94a3b8" />
                  </button>
                ))}
              </div>
            </div>

            {/* Link categories */}
            {Object.entries(cols).map(([cat, items]) => (
              <div key={cat}>
                <h4 style={{
                  fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: '#64748b',
                  marginBottom: 18, fontFamily: 'Inter, sans-serif',
                }}>{cat}</h4>
                {items.map(item => (
                  <a key={item.label} href={item.href} style={{
                    display: 'block', marginBottom: 12,
                    fontSize: '0.86rem', color: '#94a3b8',
                    transition: 'color 0.2s',
                    textDecoration: 'none'
                  }}
                    onMouseEnter={e => e.target.style.color = '#4f8ef7'}
                    onMouseLeave={e => e.target.style.color = '#94a3b8'}
                  >{item.label}</a>
                ))}
              </div>
            ))}
          </div>

          {/* Bottom attribution strip */}
          <div style={{
            borderTop: '1px solid rgba(79, 142, 247, 0.12)',
            paddingTop: 24,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
          }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              © 2026 Studytra. Made with passion for Indian student applicants worldwide.
            </span>
            <div style={{ display: 'flex', gap: 22 }}>
              {['Privacy Policy', 'Terms of Service', 'Contact Us'].map(l => (
                <a key={l} href="#" style={{ fontSize: '0.8rem', color: '#64748b', transition: 'color 0.2s', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = '#f0f4ff'}
                  onMouseLeave={e => e.target.style.color = '#64748b'}
                >{l}</a>
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