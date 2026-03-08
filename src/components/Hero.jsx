import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react'
import { COUNTRIES } from '../constants/countries'

// Country display names with emoji
const ROTATING = [
  { name: 'Germany 🇩🇪', color: '#1a3a8c' },
  { name: 'United States 🇺🇸', color: '#b91c1c' },
  { name: 'Canada 🇨🇦', color: '#c2410c' },
  { name: 'United Kingdom 🇬🇧', color: '#1d4ed8' },
  { name: 'Australia 🇦🇺', color: '#059669' },
]

// Active Plan card data for all 5 countries
const PLANS = [
  {
    flag: '🇩🇪', code: 'DE', country: 'Germany', intake: 'WS 2026',
    title: 'Germany · MSc CS · WS 2026',
    badge: 'Visa Approved!',
    progress: 62,
    steps: [
      { stage: 'IELTS + APS', done: true },
      { stage: 'Uni-Assist Applications', done: true },
      { stage: 'Visa Process', active: true },
      { stage: 'Pre-Departure', pending: true },
    ],
  },
  {
    flag: '🇺🇸', code: 'US', country: 'United States', intake: 'Fall 2026',
    title: 'USA · MS Data Science · Fall 2026',
    badge: 'I-20 Received!',
    progress: 48,
    steps: [
      { stage: 'GRE + TOEFL', done: true },
      { stage: 'University Applications', done: true },
      { stage: 'Visa Interview Prep', active: true },
      { stage: 'Pre-Departure', pending: true },
    ],
  },
  {
    flag: '🇨🇦', code: 'CA', country: 'Canada', intake: 'Sep 2026',
    title: 'Canada · MBA · September 2026',
    badge: 'Offer Letter!',
    progress: 35,
    steps: [
      { stage: 'IELTS + GMAT', done: true },
      { stage: 'Applications Submitted', active: true },
      { stage: 'Study Permit', pending: true },
      { stage: 'Pre-Departure', pending: true },
    ],
  },
  {
    flag: '🇬🇧', code: 'UK', country: 'United Kingdom', intake: 'Sep 2026',
    title: 'UK · MSc Finance · Sep 2026',
    badge: 'CAS Issued!',
    progress: 55,
    steps: [
      { stage: 'IELTS', done: true },
      { stage: 'UCAS Application', done: true },
      { stage: 'Student Visa (CAS)', active: true },
      { stage: 'Pre-Departure', pending: true },
    ],
  },
  {
    flag: '🇦🇺', code: 'AU', country: 'Australia', intake: 'Feb 2026',
    title: 'Australia · Master of IT · Feb 2026',
    badge: 'CoE Received!',
    progress: 70,
    steps: [
      { stage: 'PTE + Applications', done: true },
      { stage: 'CoE Received', done: true },
      { stage: 'Student Visa Applied', active: true },
      { stage: 'Pre-Departure', pending: true },
    ],
  },
]

export default function Hero() {
  const navigate = useNavigate()
  const [activeIdx, setActiveIdx] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [cardIdx, setCardIdx] = useState(0)
  const [cardFading, setCardFading] = useState(false)

  // Cycle card every 5 seconds
  useEffect(() => {
    const cardTimer = setInterval(() => {
      setCardFading(true)
      setTimeout(() => {
        setCardIdx(p => (p + 1) % PLANS.length)
        setCardFading(false)
      }, 400)
    }, 5000)
    return () => clearInterval(cardTimer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setActiveIdx(p => (p + 1) % ROTATING.length)
        setAnimating(false)
      }, 400)
    }, 2200)
    return () => clearInterval(timer)
  }, [])

  return (
    <section style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, var(--ivory) 0%, var(--white) 55%, var(--blue-50) 100%)',
      display: 'flex', alignItems: 'center',
      padding: '120px 24px 80px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* BG blobs */}
      <div style={{ position: 'absolute', top: -80, right: -80, width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,196,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 40, left: -60, width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="container" style={{ width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="hero-grid">

          {/* LEFT */}
          <div style={{ animation: 'fadeUp 0.8s ease both' }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--mint-50)', border: '1px solid var(--mint-200)',
              borderRadius: 'var(--r-full)', padding: '6px 16px 6px 8px', marginBottom: 28,
            }}>
              <div style={{
                background: 'var(--mint-500)', borderRadius: 'var(--r-full)',
                padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <Sparkles size={11} color="white" />
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'white', letterSpacing: '0.07em' }}>AI-POWERED</span>
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--mint-600)' }}>
                Study Abroad Execution Platform
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
              fontWeight: 800, color: 'var(--blue-950)',
              marginBottom: 14, lineHeight: 1.08,
            }}>
              Plan Your Future in
            </h1>

            {/* Animated country name */}
            <div style={{
              minHeight: 'clamp(3rem, 6vw, 4.2rem)',
              marginBottom: 28,
              overflow: 'visible',
            }}>
              <span style={{
                fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
                fontWeight: 800, lineHeight: 1.08,
                color: ROTATING[activeIdx].color,
                transform: animating ? 'translateY(-10px)' : 'translateY(0)',
                opacity: animating ? 0 : 1,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'block',
              }}>
                {ROTATING[activeIdx].name}
              </span>
            </div>

            {/* Country dots indicator */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
              {ROTATING.map((_, i) => (
                <div key={i} onClick={() => setActiveIdx(i)} style={{
                  width: i === activeIdx ? 24 : 6,
                  height: 6, borderRadius: 99,
                  background: i === activeIdx ? ROTATING[activeIdx].color : 'var(--gray-200)',
                  transition: 'all 0.4s ease',
                  cursor: 'pointer',
                }} />
              ))}
            </div>

            <p style={{
              fontSize: '1.05rem', color: 'var(--gray-500)',
              lineHeight: 1.75, maxWidth: 480, marginBottom: 32,
            }}>
              Structured AI guidance for Indian students — roadmaps, visa steps, cost breakdowns, and timelines for{' '}
              <strong style={{ color: 'var(--blue-700)' }}>Germany, USA, Canada, UK & Australia.</strong>{' '}
              No consultancy needed.
            </p>

            {/* Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
              {[
                'Complete country-specific roadmap',
                'Visa & document checklist',
                'Cost calculator with INR conversion',
              ].map(item => (
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
                color: 'white', padding: '15px 30px',
                borderRadius: 'var(--r-sm)', fontSize: '0.96rem', fontWeight: 700,
                boxShadow: '0 6px 24px rgba(26,58,140,0.3)', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(26,58,140,0.4)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(26,58,140,0.3)' }}
              >
                Start Planning Free <ArrowRight size={16} />
              </button>
              <button onClick={() => document.querySelector('#countries')?.scrollIntoView({ behavior: 'smooth' })} style={{
                background: 'white', color: 'var(--blue-700)',
                padding: '15px 30px', borderRadius: 'var(--r-sm)',
                fontSize: '0.96rem', fontWeight: 600,
                border: '1.5px solid var(--blue-100)', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue-300)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--blue-100)'; e.currentTarget.style.transform = 'none' }}
              >
                Explore Countries →
              </button>
            </div>

            {/* Available for */}
            <div style={{ display: 'flex', gap: 10, marginTop: 32, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 500 }}>Available for:</span>
              {COUNTRIES.map(c => (
                <div key={c.id} title={c.name} style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: 'white', border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--r-full)', padding: '4px 10px',
                  fontSize: '0.78rem', fontWeight: 600, color: 'var(--blue-950)',
                  boxShadow: 'var(--shadow-xs)',
                }}>
                  <span style={{ fontSize: '1rem' }}>{c.flag}</span>
                  <span>{c.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Dashboard preview */}
          <div style={{ position: 'relative', animation: 'fadeUp 0.8s 0.2s ease both' }}>
            {/* Animated Active Plan Card */}
            <div style={{
              background: 'white', borderRadius: 'var(--r-xl)',
              boxShadow: 'var(--shadow-xl)', border: '1px solid var(--gray-200)',
              overflow: 'hidden', animation: 'float 4s ease-in-out infinite',
              opacity: cardFading ? 0 : 1,
              transform: cardFading ? 'scale(0.97) translateY(6px)' : 'scale(1) translateY(0)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}>
              {/* Card header */}
              <div style={{
                background: 'linear-gradient(135deg, var(--blue-900) 0%, var(--blue-700) 100%)',
                padding: '20px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', marginBottom: 4 }}>ACTIVE PLAN</div>
                  <div style={{ color: 'white', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '1rem' }}>
                    {PLANS[cardIdx].title}
                  </div>
                </div>
                <div style={{
                  background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)',
                  color: '#34d399', padding: '4px 12px', borderRadius: 'var(--r-full)',
                  fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em',
                }}>LIVE</div>
              </div>

              {/* Steps */}
              <div style={{ padding: '20px 24px' }}>
                {PLANS[cardIdx].steps.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    paddingBottom: i < 3 ? 16 : 0, position: 'relative',
                  }}>
                    {i < 3 && <div style={{
                      position: 'absolute', left: 9, top: 22, width: 2, height: 16,
                      background: item.done ? 'var(--mint-400)' : 'var(--gray-200)',
                    }} />}
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      background: item.done ? 'var(--mint-500)' : item.active ? 'var(--blue-500)' : 'var(--gray-200)',
                      boxShadow: item.active ? '0 0 0 4px rgba(37,99,196,0.15)' : 'none',
                    }} />
                    <span style={{ fontSize: '0.86rem', fontWeight: 600, color: item.pending ? 'var(--gray-400)' : 'var(--blue-950)' }}>{item.stage}</span>
                    {item.done && <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--mint-500)', fontWeight: 700 }}>✓ Done</span>}
                    {item.active && <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--blue-500)', fontWeight: 700 }}>Active</span>}
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div style={{ padding: '14px 24px 20px', borderTop: '1px solid var(--gray-100)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)', fontWeight: 500 }}>Overall Progress</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--blue-700)' }}>{PLANS[cardIdx].progress}%</span>
                </div>
                <div style={{ background: 'var(--gray-100)', borderRadius: 'var(--r-full)', height: 7, overflow: 'hidden' }}>
                  <div style={{
                    width: `${PLANS[cardIdx].progress}%`, height: '100%',
                    background: 'linear-gradient(90deg, var(--blue-600) 0%, var(--mint-400) 100%)',
                    borderRadius: 'var(--r-full)',
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>
            </div>

            {/* Floating country badge — updates with card */}
            <div style={{
              position: 'absolute', top: -18, right: -18,
              background: 'white', borderRadius: 'var(--r-md)',
              padding: '10px 14px', boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--gray-200)',
              display: 'flex', alignItems: 'center', gap: 8,
              opacity: cardFading ? 0 : 1,
              transition: 'opacity 0.4s ease',
            }}>
              <span style={{ fontSize: '1.3rem' }}>{PLANS[cardIdx].flag}</span>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--blue-900)' }}>{PLANS[cardIdx].country}</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--gray-400)' }}>{PLANS[cardIdx].intake}</div>
              </div>
            </div>

            {/* Bottom badge */}
            <div style={{
              position: 'absolute', bottom: -16, left: -16,
              background: 'linear-gradient(135deg, var(--mint-500) 0%, var(--mint-400) 100%)',
              borderRadius: 'var(--r-md)', padding: '10px 16px',
              boxShadow: 'var(--shadow-md)',
              display: 'flex', alignItems: 'center', gap: 7,
              opacity: cardFading ? 0 : 1,
              transition: 'opacity 0.4s ease',
            }}>
              <span style={{ fontSize: '1rem' }}>✅</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'white' }}>{PLANS[cardIdx].badge}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) { .hero-grid { grid-template-columns: 1fr !important; } }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </section>
  )
}