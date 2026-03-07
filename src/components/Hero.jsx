import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react'
import { COUNTRIES } from '../constants/countries'

const ROTATING_COUNTRIES = COUNTRIES.map(c => `${c.flag} ${c.name}`)

export default function Hero() {
  const navigate = useNavigate()
  const [activeCountry, setActiveCountry] = useState(0)
  const leftRef = useRef(null)
  const rightRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCountry(p => (p + 1) % ROTATING_COUNTRIES.length)
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    [leftRef, rightRef].forEach((ref, i) => {
      if (!ref.current) return
      ref.current.style.opacity = '0'
      ref.current.style.transform = 'translateY(28px)'
      setTimeout(() => {
        if (!ref.current) return
        ref.current.style.transition = 'all 0.8s ease'
        ref.current.style.opacity = '1'
        ref.current.style.transform = 'translateY(0)'
      }, 150 + i * 200)
    })
  }, [])

  return (
    <section style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, var(--ivory) 0%, var(--white) 50%, var(--blue-50) 100%)',
      display: 'flex', alignItems: 'center',
      padding: '120px 24px 80px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background blobs */}
      <div style={{
        position: 'absolute', top: -100, right: -100,
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,196,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: -80,
        width: 380, height: 380, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ width: '100%' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64, alignItems: 'center',
        }} className="hero-grid">

          {/* LEFT */}
          <div ref={leftRef}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--mint-50)',
              border: '1px solid var(--mint-200)',
              borderRadius: 'var(--r-full)',
              padding: '6px 16px 6px 8px', marginBottom: 28,
            }}>
              <div style={{
                background: 'var(--mint-500)', borderRadius: 'var(--r-full)',
                padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <Sparkles size={11} color="white" />
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'white', letterSpacing: '0.06em' }}>AI-POWERED</span>
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--mint-600)' }}>
                Study Abroad Execution Platform
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              fontWeight: 800, color: 'var(--blue-950)',
              marginBottom: 10, lineHeight: 1.08,
            }}>
              Plan Your Future in
            </h1>

            {/* Animated country name */}
            <div style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              fontWeight: 800, lineHeight: 1.08, marginBottom: 24,
              height: '1.2em', overflow: 'hidden', position: 'relative',
            }}>
              <div style={{
                transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
                transform: `translateY(${activeCountry * -100}%)`,
              }}>
                {ROTATING_COUNTRIES.map((c, i) => (
                  <div key={i} style={{
                    height: '1.2em', display: 'flex', alignItems: 'center',
                    background: 'linear-gradient(90deg, var(--blue-700), var(--accent))',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>{c}</div>
                ))}
              </div>
            </div>

            <p style={{
              fontSize: '1.05rem', color: 'var(--gray-500)',
              lineHeight: 1.75, maxWidth: 480, marginBottom: 36,
            }}>
              Structured AI guidance for Indian students — roadmaps, visa steps, cost breakdowns, and timelines for{' '}
              <strong style={{ color: 'var(--blue-700)' }}>Germany, USA, Canada, UK & Australia.</strong>{' '}
              No consultancy needed.
            </p>

            {/* Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
              {['Complete country-specific roadmap', 'Visa & document checklist', 'Cost calculator with INR conversion'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle size={16} color="var(--mint-500)" />
                  <span style={{ fontSize: '0.9rem', color: 'var(--gray-700)', fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/chat')} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, var(--blue-700) 0%, var(--blue-500) 100%)',
                color: 'white', padding: '14px 28px',
                borderRadius: 'var(--r-sm)', fontSize: '0.95rem', fontWeight: 700,
                boxShadow: '0 6px 24px rgba(26,58,140,0.3)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(26,58,140,0.4)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(26,58,140,0.3)' }}
              >
                Start Planning Free <ArrowRight size={16} />
              </button>
              <button onClick={() => document.querySelector('#countries')?.scrollIntoView({ behavior: 'smooth' })} style={{
                background: 'white', color: 'var(--blue-700)',
                padding: '14px 28px', borderRadius: 'var(--r-sm)',
                fontSize: '0.95rem', fontWeight: 600,
                border: '1.5px solid var(--blue-100)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue-300)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--blue-100)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                Explore Countries →
              </button>
            </div>

            {/* 5 country flags */}
            <div style={{ display: 'flex', gap: 12, marginTop: 32, alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 500 }}>Available for:</span>
              {COUNTRIES.map(c => (
                <span key={c.id} title={c.name} style={{ fontSize: '1.4rem', cursor: 'default' }}>{c.flag}</span>
              ))}
            </div>
          </div>

          {/* RIGHT — Dashboard card */}
          <div ref={rightRef} style={{ position: 'relative' }}>
            <div style={{
              background: 'white', borderRadius: 'var(--r-xl)',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--gray-200)',
              overflow: 'hidden',
              animation: 'float 4s ease-in-out infinite',
            }}>
              {/* Card header */}
              <div style={{
                background: 'linear-gradient(135deg, var(--blue-900) 0%, var(--blue-700) 100%)',
                padding: '20px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', marginBottom: 4 }}>ACTIVE PLAN</div>
                  <div style={{ color: 'white', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '1rem' }}>
                    Germany · MSc CS · WS 2026
                  </div>
                </div>
                <div style={{
                  background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)',
                  color: '#34d399', padding: '4px 12px', borderRadius: 'var(--r-full)',
                  fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em',
                }}>LIVE</div>
              </div>

              {/* Stages */}
              <div style={{ padding: '20px 24px' }}>
                {[
                  { stage: 'IELTS + APS', done: true },
                  { stage: 'Uni-Assist Applications', done: true },
                  { stage: 'Visa Process', active: true },
                  { stage: 'Pre-Departure', pending: true },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    paddingBottom: i < 3 ? 16 : 0, position: 'relative',
                  }}>
                    {i < 3 && <div style={{
                      position: 'absolute', left: 9, top: 22,
                      width: 2, height: 16,
                      background: item.done ? 'var(--mint-400)' : 'var(--gray-200)',
                    }} />}
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      background: item.done ? 'var(--mint-500)' : item.active ? 'var(--blue-500)' : 'var(--gray-200)',
                      boxShadow: item.active ? '0 0 0 4px rgba(37,99,196,0.15)' : 'none',
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '0.86rem', fontWeight: 600,
                        color: item.pending ? 'var(--gray-400)' : 'var(--blue-950)',
                      }}>{item.stage}</div>
                    </div>
                    {item.done && <span style={{ fontSize: '0.7rem', color: 'var(--mint-500)', fontWeight: 700 }}>✓ Done</span>}
                    {item.active && <span style={{ fontSize: '0.7rem', color: 'var(--blue-500)', fontWeight: 700 }}>Active</span>}
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div style={{ padding: '14px 24px 20px', borderTop: '1px solid var(--gray-100)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)', fontWeight: 500 }}>Overall Progress</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--blue-700)' }}>62%</span>
                </div>
                <div style={{ background: 'var(--gray-100)', borderRadius: 'var(--r-full)', height: 7, overflow: 'hidden' }}>
                  <div style={{
                    width: '62%', height: '100%',
                    background: 'linear-gradient(90deg, var(--blue-600) 0%, var(--mint-400) 100%)',
                    borderRadius: 'var(--r-full)',
                  }} />
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div style={{
              position: 'absolute', top: -16, right: -16,
              background: 'white', borderRadius: 'var(--r-md)',
              padding: '10px 14px', boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--gray-200)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: '1.2rem' }}>🇩🇪</span>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--blue-900)' }}>Germany</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--gray-400)' }}>WS 2026</div>
              </div>
            </div>

            <div style={{
              position: 'absolute', bottom: -14, left: -14,
              background: 'var(--mint-500)', borderRadius: 'var(--r-md)',
              padding: '10px 14px', boxShadow: 'var(--shadow-md)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ fontSize: '1rem' }}>✓</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'white' }}>Visa Approved!</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}