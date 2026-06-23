import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, CheckCircle, Play } from 'lucide-react'

// Country display names with emoji
const ROTATING = [
  { name: 'Germany', flag: '🇩🇪', code: 'DE', color: '#3b82f6' },
  { name: 'United States', flag: '🇺🇸', code: 'US', color: '#ef4444' },
  { name: 'Canada', flag: '🇨🇦', code: 'CA', color: '#f97316' },
  { name: 'United Kingdom', flag: '🇬🇧', code: 'GB', color: '#6366f1' },
  { name: 'Australia', flag: '🇦🇺', code: 'AU', color: '#10b981' },
  { name: 'Austria', flag: '🇦🇹', code: 'AT', color: '#ec4899' },
]

// Active Plan card data for all 6 countries
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
  {
    flag: '🇦🇹', code: 'AT', country: 'Austria', intake: 'WS 2026',
    title: 'Austria · MSc CS · WS 2026',
    badge: 'Admission Offer!',
    progress: 50,
    steps: [
      { stage: 'Degree + B2 Language', done: true },
      { stage: 'TU Wien Application', active: true },
      { stage: 'Visa Application', pending: true },
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
    }, 2500)
    return () => clearInterval(timer)
  }, [])

  return (
    <section style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      padding: '120px 24px 80px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Moving Background Mesh */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-10%', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79, 142, 247, 0.15) 0%, transparent 70%)',
        animation: 'floatBg 8s infinite alternate', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-5%', left: '-5%', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, transparent 70%)',
        animation: 'floatBg 10s infinite alternate-reverse', pointerEvents: 'none'
      }} />

      <div className="container" style={{ width: '100%', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 64, alignItems: 'center' }} className="hero-grid">

          {/* LEFT COLUMN */}
          <div style={{ animation: 'fadeUp 0.8s ease both' }}>
            
            {/* AI badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(79, 142, 247, 0.08)', border: '1px solid rgba(79, 142, 247, 0.2)',
              borderRadius: 'var(--r-full)', padding: '6px 16px 6px 8px', marginBottom: 28,
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #4f8ef7 0%, #7c3aed 100%)', borderRadius: 'var(--r-full)',
                padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <Sparkles size={11} color="white" />
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'white', letterSpacing: '0.07em' }}>AI-POWERED</span>
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Study Abroad Simplified
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
              fontWeight: 800, color: 'var(--text-primary)',
              marginBottom: 14, lineHeight: 1.08,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: '-0.03em'
            }}>
              Your Dream University.<br />
              Your Roadmap.<br />
              <span style={{
                background: 'linear-gradient(135deg, #4f8ef7, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>All in One Place.</span>
            </h1>

            {/* Subtext */}
            <p style={{
              fontSize: '1.05rem', color: 'var(--text-secondary)',
              lineHeight: 1.75, maxWidth: 540, marginBottom: 32,
            }}>
              AI-powered study abroad planning for Indian students targeting Europe, USA, Canada & more. 
              Get customized roadmaps, cost calculators, and visa checklists.
            </p>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
              <button onClick={() => navigate('/chat')} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, #4f8ef7 0%, #7c3aed 100%)',
                color: 'white', padding: '15px 30px',
                borderRadius: 'var(--r-sm)', fontSize: '0.96rem', fontWeight: 700,
                boxShadow: '0 6px 24px rgba(79,142,247,0.35)', transition: 'all 0.2s',
                cursor: 'pointer'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(79,142,247,0.45)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(79,142,247,0.35)' }}
              >
                Start Planning Free <ArrowRight size={16} />
              </button>
              
              <button 
                onClick={() => document.querySelector('#countries')?.scrollIntoView({ behavior: 'smooth' })} 
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'var(--theme-icon-bg)', color: 'var(--text-primary)',
                  padding: '15px 30px', borderRadius: 'var(--r-sm)',
                  fontSize: '0.96rem', fontWeight: 700,
                  border: '1px solid var(--border-default)', transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--theme-icon-hover)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--theme-icon-bg)'; e.currentTarget.style.transform = 'none' }}
              >
                <Play size={14} fill="#f0f4ff" /> Watch Demo
              </button>
            </div>

            {/* Trust Badges */}
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap', borderTop: '1px solid var(--border-default)', paddingTop: 28 }}>
              {[
                { label: '🎓 AI-Powered' },
                { label: '🌍 6+ Countries' },
                { label: '✅ Free to Use' }
              ].map(badge => (
                <div key={badge.label} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)'
                }}>
                  {badge.label}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Dashboard Mockup */}
          <div style={{ position: 'relative', animation: 'fadeUp 0.8s 0.2s ease both' }} className="hero-mockup-col">
            {/* Main Mockup Card */}
            <div style={{
              background: 'rgba(15, 33, 53, 0.65)',
              backdropFilter: 'blur(16px)',
              borderRadius: 24,
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(79, 142, 247, 0.18)',
              overflow: 'hidden',
              animation: 'float 5s ease-in-out infinite',
              opacity: cardFading ? 0 : 1,
              transform: cardFading ? 'scale(0.97) translateY(6px)' : 'scale(1) translateY(0)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}>
              {/* Header */}
              <div style={{
                background: 'var(--gradient-card)',
                padding: '20px 24px',
                borderBottom: '1px solid var(--border-default)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: '0.62rem', color: '#94a3b8', letterSpacing: '0.1em', marginBottom: 4, fontWeight: 700 }}>ACTIVE ROADMAP</div>
                  <div style={{ color: 'var(--text-primary)', fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '0.95rem' }}>
                    {PLANS[cardIdx].title}
                  </div>
                </div>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#34d399', padding: '4px 12px', borderRadius: 'var(--r-full)',
                  fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em',
                }}>LIVE STATUS</div>
              </div>

              {/* Steps List */}
              <div style={{ padding: '24px' }}>
                {PLANS[cardIdx].steps.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    paddingBottom: i < 3 ? 18 : 0, position: 'relative',
                  }}>
                    {i < 3 && <div style={{
                      position: 'absolute', left: 9, top: 22, width: 2, height: 18,
                      background: item.done ? '#10b981' : 'rgba(79, 142, 247, 0.2)',
                    }} />}
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      background: item.done ? '#10b981' : item.active ? '#4f8ef7' : 'rgba(79, 142, 247, 0.1)',
                      border: item.active ? '2.5px solid var(--bg-primary)' : 'none',
                      boxShadow: item.active ? '0 0 0 4px rgba(79, 142, 247, 0.25)' : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.6rem', color: 'white', fontWeight: 700
                    }}>
                      {item.done && '✓'}
                    </div>
                    <span style={{ fontSize: '0.86rem', fontWeight: 700, color: item.pending ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                      {item.stage}
                    </span>
                    {item.done && <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#10b981', fontWeight: 800 }}>Done</span>}
                    {item.active && <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#4f8ef7', fontWeight: 800 }}>In Progress</span>}
                  </div>
                ))}
              </div>

              {/* Progress Ring / Bar */}
              <div style={{ padding: '16px 24px 22px', borderTop: '1px solid rgba(79, 142, 247, 0.12)', background: 'rgba(5, 9, 20, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Overall Roadmap Completion</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4f8ef7' }}>{PLANS[cardIdx].progress}%</span>
                </div>
                <div style={{ background: 'rgba(5, 9, 20, 0.8)', borderRadius: 'var(--r-full)', height: 7, overflow: 'hidden', border: '1px solid rgba(79, 142, 247, 0.1)' }}>
                  <div style={{
                    width: `${PLANS[cardIdx].progress}%`, height: '100%',
                    background: 'linear-gradient(90deg, #4f8ef7 0%, #7c3aed 100%)',
                    borderRadius: 'var(--r-full)',
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>
            </div>

            {/* Floating Top Badge */}
            <div style={{
              position: 'absolute', top: -16, right: -16,
              background: '#0f2135', borderRadius: 16,
              padding: '10px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              border: '1px solid rgba(79, 142, 247, 0.18)',
              display: 'flex', alignItems: 'center', gap: 10,
              opacity: cardFading ? 0 : 1,
              transition: 'opacity 0.4s ease',
            }}>
              <span style={{ fontSize: '1.4rem' }}>{PLANS[cardIdx].flag}</span>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f0f4ff' }}>{PLANS[cardIdx].country}</div>
                <div style={{ fontSize: '0.62rem', color: '#94a3b8', marginTop: 1 }}>{PLANS[cardIdx].intake}</div>
              </div>
            </div>

            {/* Floating Bottom Badge */}
            <div style={{
              position: 'absolute', bottom: -12, left: -12,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: 14, padding: '10px 16px',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)',
              display: 'flex', alignItems: 'center', gap: 7,
              opacity: cardFading ? 0 : 1,
              transition: 'opacity 0.4s ease',
            }}>
              <span style={{ fontSize: '1rem', lineHeight: 1 }}>🎖️</span>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'white' }}>{PLANS[cardIdx].badge}</span>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes floatBg {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.05); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @media (max-width: 860px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 48px; }
          .hero-mockup-col { display: flex; justify-content: center; }
        }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </section>
  )
}