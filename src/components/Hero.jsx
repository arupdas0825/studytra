import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, CheckCircle, Play } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// Country display names with emoji
const ROTATING = [
  { name: 'Germany', flag: '🇩🇪', code: 'DE', color: '#2563EB' },
  { name: 'United States', flag: '🇺🇸', code: 'US', color: '#EF4444' },
  { name: 'Canada', flag: '🇨🇦', code: 'CA', color: '#F97316' },
  { name: 'United Kingdom', flag: '🇬🇧', code: 'GB', color: '#6366F1' },
  { name: 'Australia', flag: '🇦🇺', code: 'AU', color: '#10B981' },
  { name: 'Austria', flag: '🇦🇹', code: 'AT', color: '#EC4899' },
]

// Active Plan card data for all 6 countries
const PLANS = [
  {
    flag: '🇩🇪', code: 'DE', country: 'Germany', intake: 'Winter Sem 2026',
    title: 'Germany · MSc CS · WS 2026',
    badge: 'Visa Approved!',
    progress: 62,
    steps: [
      { stage: 'IELTS + APS Certificate', done: true },
      { stage: 'Uni-Assist Applications', done: true },
      { stage: 'Visa Process & Interview', active: true },
      { stage: 'Pre-Departure Checklist', pending: true },
    ],
  },
  {
    flag: '🇺🇸', code: 'US', country: 'United States', intake: 'Fall Sem 2026',
    title: 'USA · MS Data Science · Fall 2026',
    badge: 'I-20 Form Received!',
    progress: 48,
    steps: [
      { stage: 'GRE + TOEFL Exams', done: true },
      { stage: 'University Applications', done: true },
      { stage: 'F-1 Visa Interview Prep', active: true },
      { stage: 'Pre-Departure Flight Pack', pending: true },
    ],
  },
  {
    flag: '🇨🇦', code: 'CA', country: 'Canada', intake: 'Sept Intake 2026',
    title: 'Canada · MBA · September 2026',
    badge: 'Offer Letter Secured!',
    progress: 35,
    steps: [
      { stage: 'IELTS + GMAT Preparation', done: true },
      { stage: 'Applications Submitted', active: true },
      { stage: 'Study Permit (SDS) Apply', pending: true },
      { stage: 'Pre-Departure Flight Pack', pending: true },
    ],
  },
  {
    flag: '🇬🇧', code: 'UK', country: 'United Kingdom', intake: 'Sept Intake 2026',
    title: 'UK · MSc Finance · Sep 2026',
    badge: 'CAS Issued Successfully!',
    progress: 55,
    steps: [
      { stage: 'IELTS English Exam', done: true },
      { stage: 'UCAS Portal Application', done: true },
      { stage: 'Student Visa (CAS) Slot', active: true },
      { stage: 'Pre-Departure Checklist', pending: true },
    ],
  },
  {
    flag: '🇦🇺', code: 'AU', country: 'Australia', intake: 'Feb Intake 2026',
    title: 'Australia · Master of IT · Feb 2026',
    badge: 'CoE Received!',
    progress: 70,
    steps: [
      { stage: 'PTE + Application Submission', done: true },
      { stage: 'CoE Form & Fee Payment', done: true },
      { stage: 'Student Visa (Subclass 500)', active: true },
      { stage: 'Pre-Departure Checklist', pending: true },
    ],
  },
  {
    flag: '🇦🇹', code: 'AT', country: 'Austria', intake: 'Winter Sem 2026',
    title: 'Austria · MSc CS · WS 2026',
    badge: 'Admission Offer Received!',
    progress: 50,
    steps: [
      { stage: 'Degree Legalization & B2', done: true },
      { stage: 'TU Wien Application Submission', active: true },
      { stage: 'Residence Permit D Application', pending: true },
      { stage: 'Pre-Departure Checklist', pending: true },
    ],
  },
]

export default function Hero() {
  const navigate = useNavigate()
  const { user, setAuthModalOpen } = useAuth()
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

  const handleStartPlanning = () => {
    if (!user) {
      setAuthModalOpen(true)
    } else {
      navigate('/chat')
    }
  }

  return (
    <section style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      padding: '140px 24px 80px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Moving Background Mesh */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-10%', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%)',
        animation: 'floatBg 8s infinite alternate', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-5%', left: '-5%', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(96, 165, 250, 0.06) 0%, transparent 70%)',
        animation: 'floatBg 10s infinite alternate-reverse', pointerEvents: 'none'
      }} />

      <div className="container" style={{ width: '100%', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 64, alignItems: 'center' }} className="hero-grid">

          {/* LEFT COLUMN */}
          <div style={{ animation: 'fadeUp 0.8s ease both' }}>
            
            {/* AI badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.12)',
              borderRadius: 'var(--r-full)', padding: '6px 16px 6px 8px', marginBottom: 28,
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)', borderRadius: 'var(--r-full)',
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
              marginBottom: 18, lineHeight: 1.08,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: '-0.03em'
            }}>
              Your Dream University.<br />
              Your Roadmap.<br />
              <span style={{
                background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>All in One Place.</span>
            </h1>

            {/* Subtext */}
            <p style={{
              fontSize: '1.05rem', color: 'var(--text-secondary)',
              lineHeight: 1.75, maxWidth: 540, marginBottom: 36,
            }}>
              AI-powered study abroad planning for Indian students targeting Europe, USA, Canada & more. 
              Get customized roadmaps, cost calculators, and visa checklists.
            </p>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
              <button onClick={handleStartPlanning} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
                color: 'white', padding: '15px 30px',
                borderRadius: 'var(--r-sm)', fontSize: '0.96rem', fontWeight: 700,
                boxShadow: '0 6px 24px rgba(37,99,235,0.2)', transition: 'all 0.2s',
                cursor: 'pointer'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(37,99,235,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(37,99,235,0.2)' }}
              >
                Start Planning Free <ArrowRight size={16} />
              </button>
              
              <button 
                onClick={() => document.querySelector('#countries')?.scrollIntoView({ behavior: 'smooth' })} 
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'var(--bg-card)', color: 'var(--text-primary)',
                  padding: '15px 30px', borderRadius: 'var(--r-sm)',
                  fontSize: '0.96rem', fontWeight: 700,
                  border: '1px solid var(--border-default)', transition: 'all 0.2s',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-xs)'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.transform = 'none' }}
              >
                <Play size={14} fill="var(--text-primary)" color="var(--text-primary)" /> Watch Demo
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
              background: '#FFFFFF',
              borderRadius: 24,
              boxShadow: '0 20px 50px rgba(15, 23, 42, 0.05)',
              border: '1px solid var(--border-default)',
              overflow: 'hidden',
              animation: 'float 5s ease-in-out infinite',
              opacity: cardFading ? 0 : 1,
              transform: cardFading ? 'scale(0.97) translateY(6px)' : 'scale(1) translateY(0)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}>
              {/* Header */}
              <div style={{
                background: '#FAFAF8',
                padding: '20px 24px',
                borderBottom: '1px solid var(--border-default)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 4, fontWeight: 700 }}>ACTIVE ROADMAP</div>
                  <div style={{ color: 'var(--text-primary)', fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '0.95rem' }}>
                    {PLANS[cardIdx].title}
                  </div>
                </div>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.15)',
                  color: 'var(--accent-success)', padding: '4px 12px', borderRadius: 'var(--r-full)',
                  fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em',
                }}>LIVE STATUS</div>
              </div>

              {/* Steps List */}
              <div style={{ padding: '24px', background: '#FFFFFF' }}>
                {PLANS[cardIdx].steps.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    paddingBottom: i < 3 ? 18 : 0, position: 'relative',
                  }}>
                    {i < 3 && <div style={{
                      position: 'absolute', left: 9, top: 22, width: 2, height: 18,
                      background: item.done ? 'var(--accent-success)' : 'rgba(37, 99, 235, 0.1)',
                    }} />}
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      background: item.done ? 'var(--accent-success)' : item.active ? 'var(--accent-primary)' : 'rgba(37, 99, 235, 0.05)',
                      border: item.active ? '2.5px solid var(--bg-primary)' : 'none',
                      boxShadow: item.active ? '0 0 0 4px rgba(37, 99, 235, 0.15)' : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.6rem', color: 'white', fontWeight: 700
                    }}>
                      {item.done && '✓'}
                    </div>
                    <span style={{ fontSize: '0.86rem', fontWeight: 700, color: item.pending ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                      {item.stage}
                    </span>
                    {item.done && <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--accent-success)', fontWeight: 800 }}>Done</span>}
                    {item.active && <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 800 }}>In Progress</span>}
                  </div>
                ))}
              </div>

              {/* Progress Ring / Bar */}
              <div style={{ padding: '16px 24px 22px', borderTop: '1px solid var(--border-default)', background: '#FAFAF8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Overall Roadmap Completion</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{PLANS[cardIdx].progress}%</span>
                </div>
                <div style={{ background: 'rgba(37, 99, 235, 0.08)', borderRadius: 'var(--r-full)', height: 7, overflow: 'hidden', border: '1px solid rgba(37, 99, 235, 0.05)' }}>
                  <div style={{
                    width: `${PLANS[cardIdx].progress}%`, height: '100%',
                    background: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)',
                    borderRadius: 'var(--r-full)',
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>
            </div>

            {/* Floating Top Badge */}
            <div style={{
              position: 'absolute', top: -16, right: -16,
              background: '#FFFFFF', borderRadius: 16,
              padding: '10px 16px', boxShadow: '0 8px 32px rgba(15,23,42,0.06)',
              border: '1px solid var(--border-default)',
              display: 'flex', alignItems: 'center', gap: 10,
              opacity: cardFading ? 0 : 1,
              transition: 'opacity 0.4s ease',
            }}>
              <span style={{ fontSize: '1.4rem' }}>{PLANS[cardIdx].flag}</span>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-primary)' }}>{PLANS[cardIdx].country}</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', marginTop: 1 }}>{PLANS[cardIdx].intake}</div>
              </div>
            </div>

            {/* Floating Bottom Badge */}
            <div style={{
              position: 'absolute', bottom: -12, left: -12,
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              borderRadius: 14, padding: '10px 16px',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.15)',
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