import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Wallet, GraduationCap, Briefcase } from 'lucide-react'
import { COUNTRIES } from '../constants/countries'
import { useAuth } from '../context/AuthContext'

export default function Countries() {
  const navigate = useNavigate()
  const { user, setAuthModalOpen } = useAuth()
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.sr').forEach(el => el.classList.add('sr-visible'))
        }
      })
    }, { threshold: 0.08 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const getTuition = (c) => {
    if (c.id === 'germany')   return 'Free (Public)'
    if (c.id === 'austria')   return '€1,500 – €3,000 / yr'
    if (c.id === 'usa')       return '$20,000 – $35,000 / yr'
    if (c.id === 'canada')    return 'CAD $15,000 – $35,000 / yr'
    if (c.id === 'uk')        return '£12,000 – £22,000 / yr'
    if (c.id === 'australia') return 'AUD $20,000 – $40,000 / yr'
    return 'Affordable'
  }

  const handleCountryClick = (e, countryName) => {
    if (!user) {
      e.preventDefault()
      setAuthModalOpen(true)
    } else {
      navigate(`/chat?country=${encodeURIComponent(countryName)}`)
    }
  }

  return (
    <section
      id="countries"
      ref={ref}
      style={{
        padding: '108px 24px',
        background: '#f7f5f0',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(26,20,8,0.07)',
      }}
    >
      {/* Large radial depth glow */}
      <div style={{
        position: 'absolute',
        top: '40%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700, height: 700,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(29,52,97,0.05) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="sr" style={{ textAlign: 'center', marginBottom: 52 }}>
          <span className="section-badge">Destinations</span>
          <h2 className="section-headline" style={{ textAlign: 'center' }}>
            Explore Top Study Destinations
          </h2>
          <div className="gold-rule" />
          <p className="section-subtext" style={{ textAlign: 'center' }}>
            Compare tuition costs, living expenses, and post-study opportunities tailored for Indian students.
          </p>
        </div>

        {/* Countries Grid */}
        <div className="countries-grid-scroll" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 28,
        }}>
          {COUNTRIES.map((c, i) => (
            <div
              key={c.id}
              onClick={(e) => handleCountryClick(e, c.name)}
              className={`country-card-premium sr sr-delay-${Math.min(i + 1, 4)}`}
              style={{
                padding: '30px 26px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Flag + name row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: '2.6rem', lineHeight: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.10))' }}>
                    {c.flag}
                  </span>
                  <div>
                    <h3 style={{
                      fontSize: '1.22rem', fontWeight: 800, color: 'var(--text-primary)',
                      margin: '0 0 2px', fontFamily: 'Plus Jakarta Sans, sans-serif',
                    }}>
                      {c.name}
                    </h3>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {c.tagline}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 13, flex: 1, marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: 'rgba(29,52,97,0.06)', border: '1px solid rgba(29,52,97,0.10)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <GraduationCap size={14} color="var(--navy)" />
                  </div>
                  <div style={{ fontSize: '0.86rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Tuition: </span>
                    <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{getTuition(c)}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: 'rgba(184,146,42,0.07)', border: '1px solid rgba(184,146,42,0.14)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Wallet size={14} color="var(--gold)" />
                  </div>
                  <div style={{ fontSize: '0.86rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Living: </span>
                    <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{c.costRange}</strong>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginLeft: 6 }}>
                      ({c.costINR.replace('≈ ', '')})
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: 'rgba(5,150,105,0.07)', border: '1px solid rgba(5,150,105,0.14)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Briefcase size={14} color="var(--accent-success)" />
                  </div>
                  <div style={{ fontSize: '0.86rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Work Permit: </span>
                    <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{c.workAllowed}</strong>
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderTop: '1px solid rgba(26,20,8,0.07)', paddingTop: 16,
              }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Top Uni: {c.topUnis[0]}
                </span>
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: '0.84rem', fontWeight: 700, color: 'var(--navy)',
                  transition: 'gap 0.2s ease',
                }}>
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
          .countries-grid-scroll::-webkit-scrollbar { display: none; }
          .country-card-premium {
            flex-shrink: 0;
            width: 300px !important;
            scroll-snap-align: center;
          }
        }
      `}</style>
    </section>
  )
}