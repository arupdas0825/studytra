import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Wallet, GraduationCap, Briefcase } from 'lucide-react'
import { COUNTRIES } from '../constants/countries'

export default function Countries() {
  const navigate = useNavigate()

  // Tuition helper mapping since it differs in raw data
  const getTuition = (c) => {
    if (c.id === 'germany') return 'Free (Public)'
    if (c.id === 'austria') return '€1,500 - €3,000 / yr'
    if (c.id === 'usa') return '$20,000 - $35,000 / yr'
    if (c.id === 'canada') return 'CAD $15,000 - $35,000 / yr'
    if (c.id === 'uk') return '£12,000 - £22,000 / yr'
    if (c.id === 'australia') return 'AUD $20,000 - $40,000 / yr'
    return 'Affordable'
  }

  return (
    <section id="countries" style={{
      padding: '100px 24px',
      background: '#050914',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glow */}
      <div style={{
        position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 600, height: 600, background: 'radial-gradient(circle, rgba(79, 142, 247, 0.05) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(79, 142, 247, 0.1)',
            border: '1px solid rgba(79, 142, 247, 0.2)',
            color: '#4f8ef7',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '5px 14px',
            borderRadius: 'var(--r-full)',
            marginBottom: 16,
          }}>
            Destinations
          </span>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 800,
            color: '#f0f4ff',
            fontFamily: 'Plus Jakarta Sans, sans-serif'
          }}>
            Explore Top Study Destinations
          </h2>
          <p style={{
            color: '#94a3b8',
            fontSize: '1rem',
            maxWidth: 520,
            margin: '12px auto 0',
            lineHeight: 1.6
          }}>
            Compare tuition costs, living expenses, and post-study opportunities for Indian students.
          </p>
        </div>

        {/* Countries Grid/Row */}
        <div className="countries-grid-scroll" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 28,
        }}>
          {COUNTRIES.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/chat?country=${encodeURIComponent(c.name)}`)}
              className="country-hover-card"
              style={{
                background: 'rgba(15, 33, 53, 0.6)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(79, 142, 247, 0.15)',
                borderRadius: 20,
                padding: '30px 24px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.borderColor = 'rgba(79, 142, 247, 0.4)'
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(79, 142, 247, 0.18)'
                const btn = e.currentTarget.querySelector('.explore-btn')
                if (btn) btn.style.opacity = '1'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'rgba(79, 142, 247, 0.15)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)'
                const btn = e.currentTarget.querySelector('.explore-btn')
                if (btn) btn.style.opacity = '0'
              }}
            >
              {/* Flag and name */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '2.5rem', lineHeight: 1 }}>{c.flag}</span>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f0f4ff', margin: 0, fontFamily: 'Plus Jakarta Sans' }}>
                      {c.name}
                    </h3>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>
                      {c.tagline}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats block */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, marginBottom: 28 }}>
                
                {/* Tuition Fee */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <GraduationCap size={16} color="#4f8ef7" />
                  <div style={{ fontSize: '0.86rem' }}>
                    <span style={{ color: '#94a3b8' }}>Tuition: </span>
                    <strong style={{ color: '#f0f4ff', fontWeight: 600 }}>{getTuition(c)}</strong>
                  </div>
                </div>

                {/* Living Costs */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <Wallet size={16} color="#7c3aed" />
                  <div style={{ fontSize: '0.86rem' }}>
                    <span style={{ color: '#94a3b8' }}>Living: </span>
                    <strong style={{ color: '#f0f4ff', fontWeight: 600 }}>{c.costRange}</strong>
                    <span style={{ color: '#64748b', fontSize: '0.75rem', marginLeft: 6 }}>({c.costINR.replace('≈ ', '')})</span>
                  </div>
                </div>

                {/* Work Permit */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <Briefcase size={16} color="#10b981" />
                  <div style={{ fontSize: '0.86rem' }}>
                    <span style={{ color: '#94a3b8' }}>Work Permit: </span>
                    <strong style={{ color: '#f0f4ff', fontWeight: 600 }}>{c.workAllowed}</strong>
                  </div>
                </div>

              </div>

              {/* Bottom Explore Button (revealed on hover) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(79, 142, 247, 0.12)', paddingTop: 16 }}>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>
                  Top Uni: {c.topUnis[0]}
                </span>
                <span 
                  className="explore-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: '#4f8ef7',
                    opacity: 0,
                    transition: 'opacity 0.25s ease'
                  }}
                >
                  Explore <ArrowRight size={13} />
                </span>
              </div>

            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .countries-grid-scroll {
            display: flex !important;
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory;
            padding-bottom: 20px !important;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .countries-grid-scroll::-webkit-scrollbar {
            display: none;
          }
          .country-hover-card {
            flex-shrink: 0;
            width: 290px !important;
            scroll-snap-align: center;
          }
          .explore-btn {
            opacity: 1 !important;
          }
        }
      `}</style>
    </section>
  )
}