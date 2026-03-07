import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, TrendingUp } from 'lucide-react'
import { COUNTRIES } from '../constants/countries'

export default function Countries() {
  const navigate = useNavigate()
  const ref = useRef(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')) })
    }, { threshold: 0.08 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const filters = [
    { key: 'all', label: 'All 5 Countries' },
    { key: 'popular', label: '⭐ Most Popular' },
    { key: 'europe', label: '🌍 Europe' },
    { key: 'other', label: '🌏 Americas & Pacific' },
  ]

  const filtered = COUNTRIES.filter(c => {
    if (filter === 'all') return true
    if (filter === 'popular') return c.popular
    if (filter === 'europe') return ['germany', 'uk'].includes(c.id)
    if (filter === 'other') return ['usa', 'canada', 'australia'].includes(c.id)
    return true
  })

  return (
    <section id="countries" ref={ref} style={{ padding: '100px 24px', background: 'var(--ivory)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{
            display: 'inline-block', background: 'var(--mint-100)',
            color: 'var(--mint-600)', fontSize: '0.72rem', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '5px 14px', borderRadius: 'var(--r-full)', marginBottom: 16,
          }} className="reveal">5 Destinations</span>
          <h2 className="reveal" style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', transitionDelay: '0.1s' }}>
            Choose Your Country
          </h2>
          <p className="reveal" style={{ color: 'var(--gray-500)', maxWidth: 520, margin: '12px auto 0', transitionDelay: '0.15s' }}>
            Each country has its own process, timeline, and costs. Studytra gives you precise guidance for all five.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="reveal" style={{
          display: 'flex', gap: 8, justifyContent: 'center',
          flexWrap: 'wrap', marginBottom: 40,
          transitionDelay: '0.2s',
        }}>
          {filters.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: '8px 18px', borderRadius: 'var(--r-full)',
              fontSize: '0.82rem', fontWeight: filter === f.key ? 700 : 500,
              background: filter === f.key ? 'var(--blue-700)' : 'white',
              color: filter === f.key ? 'white' : 'var(--gray-600)',
              border: `1.5px solid ${filter === f.key ? 'var(--blue-700)' : 'var(--gray-200)'}`,
              transition: 'all 0.2s',
            }}>{f.label}</button>
          ))}
        </div>

        {/* Country cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: filtered.length === 3 ? 'repeat(3,1fr)' : filtered.length <= 2 ? `repeat(${filtered.length},1fr)` : 'repeat(3,1fr)',
          gap: 24,
        }} className="countries-grid">
          {filtered.map((c, i) => (
            <div key={c.id} className="reveal" style={{
              transitionDelay: `${0.05 + i * 0.1}s`,
              borderRadius: 'var(--r-xl)', overflow: 'hidden',
              background: 'white',
              border: '1px solid var(--gray-200)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.25s, box-shadow 0.25s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-xl)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
            >
              {/* Header */}
              <div style={{
                background: `linear-gradient(135deg, ${c.headerColor} 0%, ${c.accentColor} 100%)`,
                padding: '28px 24px 22px',
                position: 'relative',
              }}>
                {c.popular && (
                  <div style={{
                    position: 'absolute', top: 14, right: 14,
                    display: 'flex', alignItems: 'center', gap: 4,
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white', fontSize: '0.65rem', fontWeight: 700,
                    padding: '3px 10px', borderRadius: 'var(--r-full)',
                    letterSpacing: '0.06em',
                  }}>
                    <TrendingUp size={10} /> POPULAR
                  </div>
                )}
                <div style={{ fontSize: '2.8rem', marginBottom: 12, lineHeight: 1 }}>{c.flag}</div>
                <h3 style={{
                  color: 'white', fontFamily: 'Plus Jakarta Sans',
                  fontWeight: 800, fontSize: '1.4rem', marginBottom: 6,
                }}>{c.name}</h3>
                <span style={{
                  display: 'inline-block',
                  background: 'rgba(255,255,255,0.18)',
                  color: 'rgba(255,255,255,0.92)',
                  fontSize: '0.7rem', fontWeight: 600,
                  padding: '3px 12px', borderRadius: 'var(--r-full)',
                }}>{c.tagline}</span>
              </div>

              {/* Body */}
              <div style={{ padding: '22px 24px' }}>
                <div style={{ marginBottom: 18 }}>
                  {c.highlights.map(h => (
                    <div key={h} style={{
                      display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9,
                    }}>
                      <div style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: c.accentColor, flexShrink: 0,
                      }} />
                      <span style={{ fontSize: '0.83rem', color: 'var(--gray-600)' }}>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Cost / Intake row */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  background: 'var(--gray-50)', borderRadius: 'var(--r-md)',
                  padding: '12px 14px', marginBottom: 16,
                }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--gray-400)', fontWeight: 600, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Intake</div>
                    <div style={{ fontSize: '0.83rem', fontWeight: 700, color: 'var(--blue-950)' }}>{c.intake}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--gray-400)', fontWeight: 600, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Est. Cost</div>
                    <div style={{ fontSize: '0.83rem', fontWeight: 700, color: 'var(--blue-950)' }}>{c.costRange}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>{c.costINR}</div>
                  </div>
                </div>

                {/* Post-study badge */}
                <div style={{
                  display: 'inline-block',
                  background: c.badgeColor,
                  color: c.badgeText,
                  fontSize: '0.72rem', fontWeight: 600,
                  padding: '4px 12px', borderRadius: 'var(--r-full)',
                  marginBottom: 16,
                }}>🎯 {c.postStudy}</div>

                <button onClick={() => navigate(`/chat?country=${encodeURIComponent(c.name)}`)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  width: '100%', padding: '12px',
                  background: `linear-gradient(135deg, ${c.headerColor} 0%, ${c.accentColor} 100%)`,
                  color: 'white', borderRadius: 'var(--r-md)',
                  fontSize: '0.87rem', fontWeight: 700,
                  transition: 'opacity 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  Plan for {c.name} <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .countries-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 580px) { .countries-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}