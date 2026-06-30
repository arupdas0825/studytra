import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function TypewriterText({ text, active }) {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    if (!active) { setDisplayedText(''); return }
    let index = 0
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index + 1))
      index++
      if (index >= text.length) clearInterval(interval)
    }, 22)
    return () => clearInterval(interval)
  }, [text, active])

  return (
    <span>
      {displayedText}
      {active && <span className="typewriter-cursor" />}
    </span>
  )
}

export default function Hero() {
  const navigate = useNavigate()
  const { user, setAuthModalOpen } = useAuth()
  const [activeCard, setActiveCard] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setActiveCard(prev => (prev + 1) % 3), 4200)
    return () => clearInterval(timer)
  }, [])

  const handleStartPlanning = () => {
    if (!user) setAuthModalOpen(true)
    else navigate('/chat')
  }

  return (
    <section className="hero-section" style={{
      minHeight: '100vh',
      background: 'var(--bg-app)',
      display: 'flex',
      alignItems: 'center',
      padding: '88px 24px 72px',
      position: 'relative',
      overflow: 'hidden',
      isolation: 'isolate',
    }}>

      {/* Depth glow layers */}
      <div style={{
        position: 'absolute', top: '-12%', right: '-8%',
        width: 560, height: 560, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(29,52,97,0.055) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-8%', left: '-5%',
        width: 440, height: 440, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(184,146,42,0.045) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      {/* Parchment texture overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(145deg, rgba(255,255,255,0.4) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ width: '100%', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 64, alignItems: 'center' }} className="hero-grid">

          {/* ── LEFT COLUMN ── */}
          <div style={{ animation: 'fadeUp 0.8s ease both' }}>

            {/* AI Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.80)',
              border: '1px solid rgba(29,52,97,0.14)',
              borderRadius: 'var(--radius-pill)',
              padding: '6px 16px 6px 6px',
              marginBottom: 30,
              boxShadow: '0 2px 12px rgba(29,52,97,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
              backdropFilter: 'blur(12px)',
            }}>
              <div style={{
                background: 'var(--gradient-primary)',
                borderRadius: 'var(--radius-pill)',
                padding: '4px 10px',
                display: 'flex', alignItems: 'center', gap: 5,
                boxShadow: '0 2px 8px rgba(29,52,97,0.28)',
              }}>
                <Sparkles size={11} color="white" />
                <span style={{ fontSize: '0.67rem', fontWeight: 700, color: 'white', letterSpacing: '0.08em', fontFamily: 'var(--font-ui)' }}>
                  AI-POWERED
                </span>
              </div>
              <span style={{ fontSize: '0.83rem', fontWeight: 600, color: 'var(--navy)', fontFamily: 'var(--font-ui)' }}>
                Study Abroad Simplified
              </span>
            </div>

            {/* Headline — Playfair Display */}
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 5vw, 3.5rem)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.12,
              letterSpacing: '-0.02em',
              marginBottom: 22,
            }}>
              Your Dream University.<br />
              Your Roadmap.<br />
              <span style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                All in One Place.
              </span>
            </h1>

            {/* Subtext */}
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.02rem',
              color: 'var(--text-secondary)',
              maxWidth: 520,
              marginBottom: 38,
              lineHeight: 1.68,
            }}>
              AI-powered study abroad planning for Indian students targeting Europe, USA, Canada & more.
              Get customized roadmaps, cost calculators, and visa checklists — free.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 44 }}>
              <button
                onClick={handleStartPlanning}
                className="btn btn-lg btn-pill"
                style={{
                  background: 'var(--gradient-primary)',
                  color: '#fff',
                  border: 'none',
                  boxShadow: '0 4px 18px rgba(29,52,97,0.32), 0 1px 0 rgba(255,255,255,0.12) inset',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(29,52,97,0.38), 0 1px 0 rgba(255,255,255,0.12) inset' }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 18px rgba(29,52,97,0.32), 0 1px 0 rgba(255,255,255,0.12) inset' }}
              >
                Start Planning Free <ArrowRight size={16} />
              </button>

              <button
                onClick={() => document.querySelector('#countries')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn btn-lg btn-pill"
                style={{
                  background: 'rgba(255,255,255,0.80)',
                  color: 'var(--navy)',
                  border: '1.5px solid rgba(29,52,97,0.14)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 2px 10px rgba(26,20,8,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.96)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.background = 'rgba(255,255,255,0.80)' }}
              >
                <Play size={13} fill="var(--navy)" color="var(--navy)" />
                Explore Destinations
              </button>
            </div>

            {/* Trust badges */}
            <div style={{
              display: 'flex', gap: 10, flexWrap: 'wrap',
              borderTop: '1px solid rgba(26,20,8,0.08)', paddingTop: 26,
            }}>
              {[
                { emoji: '🎓', label: 'AI-Powered Advisor' },
                { emoji: '🌍', label: '6+ Destinations' },
                { emoji: '✅', label: '100% Free & Unbiased' },
              ].map(badge => (
                <span key={badge.label} className="stat-pill">
                  <span style={{ fontSize: '14px' }}>{badge.emoji}</span>
                  {badge.label}
                </span>
              ))}
            </div>
          </div>

          {/* ── RIGHT COLUMN — Cycling Feature Cards ── */}
          <div style={{ animation: 'fadeUp 0.8s 0.2s ease both' }} className="hero-mockup-col">
            <div className="hero-feature-cards">

              {/* Card 1: AI Chat Demo */}
              <div className={`hero-feature-card ${activeCard === 0 ? 'active' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 10, borderBottom: '1px solid rgba(26,20,8,0.07)', marginBottom: 12 }}>
                  <span style={{ fontSize: '18px' }}>🤖</span>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--navy)', fontFamily: 'var(--font-ui)' }}>Studytra AI</span>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
                  <div style={{
                    alignSelf: 'flex-end',
                    background: 'var(--bg-app)', border: '1px solid rgba(26,20,8,0.08)',
                    padding: '9px 13px', borderRadius: '14px 14px 3px 14px',
                    fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600, maxWidth: '85%',
                  }}>
                    "What are requirements for TU Wien M.Sc CS?"
                  </div>
                  <div style={{
                    alignSelf: 'flex-start',
                    background: 'rgba(29,52,97,0.05)', border: '1px solid rgba(29,52,97,0.10)',
                    padding: '11px 13px', borderRadius: '14px 14px 14px 3px',
                    fontSize: '12.5px', color: 'var(--navy)', lineHeight: 1.55,
                    maxWidth: '90%', fontFamily: 'var(--font-body)', minHeight: 80,
                  }}>
                    <TypewriterText
                      active={activeCard === 0}
                      text="For TU Wien Computer Science, you'll need B.Tech 60%+ in CS/related, IELTS 6.5+, and German B2 or English proficiency…"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Budget Snapshot */}
              <div className={`hero-feature-card ${activeCard === 1 ? 'active' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 10, borderBottom: '1px solid rgba(26,20,8,0.07)', marginBottom: 14 }}>
                  <span style={{ fontSize: '18px' }}>💰</span>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--navy)', fontFamily: 'var(--font-ui)' }}>Monthly Budget — Vienna</span>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { label: 'Rent', value: '€550', pct: 46, color: 'var(--navy)' },
                    { label: 'Food', value: '€280', pct: 23, color: 'var(--gold)' },
                    { label: 'Transport', value: '€30', pct: 3, color: '#0ea5e9' },
                    { label: 'Misc', value: '€340', pct: 28, color: '#10b981' },
                  ].map(item => (
                    <div key={item.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 3 }}>
                        <span>{item.label}</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.value}</span>
                      </div>
                      <div style={{ background: 'rgba(26,20,8,0.07)', height: 5, borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: 3 }} />
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 8, borderTop: '1px solid rgba(26,20,8,0.07)' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--navy)' }}>
                      Total €1,200/mo <span style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '11.5px' }}>= ₹1,09,200</span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold)', cursor: 'pointer' }} onClick={() => navigate('/budget')}>
                      Calculate →
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3: Roadmap Steps */}
              <div className={`hero-feature-card ${activeCard === 2 ? 'active' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 10, borderBottom: '1px solid rgba(26,20,8,0.07)', marginBottom: 12 }}>
                  <span style={{ fontSize: '18px' }}>🗺️</span>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--navy)', fontFamily: 'var(--font-ui)' }}>Germany M.Sc Roadmap</span>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {[
                    { text: 'IELTS 7.0+ achieved', done: true },
                    { text: 'Universities shortlisted', done: true },
                    { text: 'APS Certificate — In Progress', active: true },
                    { text: 'Applications open', pending: true },
                    { text: 'Blocked account setup', pending: true },
                    { text: 'Student Visa appointment', pending: true },
                  ].map((step, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: '12.5px' }}>
                      <span style={{
                        color: step.done ? '#10b981' : step.active ? 'var(--navy)' : 'rgba(26,20,8,0.20)',
                        fontWeight: 900, fontSize: '15px',
                      }}>
                        {step.done ? '✓' : step.active ? '●' : '○'}
                      </span>
                      <span style={{
                        fontWeight: step.active || step.done ? 600 : 400,
                        color: step.pending ? 'var(--text-tertiary)' : 'var(--text-primary)',
                      }}>
                        {step.text}
                      </span>
                    </div>
                  ))}
                  <div style={{ marginTop: 'auto', paddingTop: 8, borderTop: '1px solid rgba(26,20,8,0.07)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: 'var(--navy)', marginBottom: 4 }}>
                      <span>4 of 6 steps complete</span>
                      <span style={{ fontWeight: 700 }}>67%</span>
                    </div>
                    <div style={{ background: 'rgba(26,20,8,0.07)', height: 5, borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: '67%', height: '100%', background: 'var(--gradient-primary)', borderRadius: 3 }} />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Dot indicators */}
            <div className="hero-card-dots" style={{ marginTop: 18 }}>
              {[0, 1, 2].map(i => (
                <button
                  key={i}
                  className={`hero-card-dot ${activeCard === i ? 'active' : ''}`}
                  onClick={() => setActiveCard(i)}
                  aria-label={`Show card ${i + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 860px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 48px; }
          .hero-mockup-col { display: flex; flex-direction: column; align-items: center; }
        }
      `}</style>
    </section>
  )
}