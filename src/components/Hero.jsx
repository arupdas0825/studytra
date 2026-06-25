import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// Typewriter component for Card 1
function TypewriterText({ text, active }) {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    if (!active) {
      setDisplayedText('')
      return
    }

    let index = 0
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index + 1))
      index++
      if (index >= text.length) {
        clearInterval(interval)
      }
    }, 25) // Smooth fast typing

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

  // Auto cycle cards every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCard(prev => (prev + 1) % 3)
    }, 4000)
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
    <section className="hero-section" style={{
      minHeight: '100vh',
      background: 'var(--bg-app)',
      display: 'flex',
      alignItems: 'center',
      padding: '80px 24px 64px',
      position: 'relative',
      overflow: 'hidden',
      isolation: 'isolate',
    }}>
      {/* Background gradients */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-10%', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(29, 52, 97, 0.04) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-5%', left: '-5%', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(184, 146, 42, 0.04) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ width: '100%', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 64, alignItems: 'center' }} className="hero-grid">

          {/* LEFT COLUMN */}
          <div style={{ animation: 'fadeUp 0.8s ease both' }}>
            
            {/* AI Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--navy-faint)', border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-pill)', padding: '6px 16px 6px 8px', marginBottom: 28,
            }}>
              <div style={{
                background: 'var(--gradient-primary)', borderRadius: 'var(--radius-pill)',
                padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <Sparkles size={11} color="white" />
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'white', letterSpacing: '0.07em', fontFamily: 'var(--font-ui)' }}>AI-POWERED</span>
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--navy)', fontFamily: 'var(--font-ui)' }}>
                Study Abroad Simplified
              </span>
            </div>

            {/* Headline */}
            <h1 className="t-display" style={{ marginBottom: 20 }}>
              Your Dream University.<br />
              Your Roadmap.<br />
              <span className="gradient-text">All in One Place.</span>
            </h1>

            {/* Subtext */}
            <p className="t-body" style={{ fontSize: '16px', maxWidth: 540, marginBottom: 36 }}>
              AI-powered study abroad planning for Indian students targeting Europe, USA, Canada & more. 
              Get customized roadmaps, cost calculators, and visa checklists.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
              <button onClick={handleStartPlanning} className="btn btn-lg btn-primary btn-pill">
                Start Planning Free <ArrowRight size={16} />
              </button>
              
              <button 
                onClick={() => document.querySelector('#countries')?.scrollIntoView({ behavior: 'smooth' })} 
                className="btn btn-lg btn-ghost btn-pill"
              >
                <Play size={14} fill="var(--navy)" color="var(--navy)" /> Explore Destinations
              </button>
            </div>

            {/* Trust Badges */}
            <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)', paddingTop: 28 }}>
              {[
                { label: '🎓 AI-Powered Advisor' },
                { label: '🌍 6+ Destinations' },
                { label: '✅ 100% Free & Unbiased' }
              ].map(badge => (
                <div key={badge.label} style={{
                  fontSize: '0.86rem', fontWeight: 700, color: 'var(--navy)', fontFamily: 'var(--font-ui)'
                }}>
                  {badge.label}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN — Cycling Feature Cards */}
          <div style={{ animation: 'fadeUp 0.8s 0.2s ease both' }} className="hero-mockup-col">
            <div className="hero-feature-cards">
              
              {/* Card 1: AI Chat Demo */}
              <div className={`hero-feature-card ${activeCard === 0 ? 'active' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 10, borderBottom: '1px solid var(--border-subtle)', marginBottom: 12 }}>
                  <span style={{ fontSize: '20px' }}>🤖</span>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--navy)', fontFamily: 'var(--font-ui)' }}>Studytra AI</span>
                </div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
                  {/* User Bubble */}
                  <div style={{
                    alignSelf: 'flex-end',
                    background: 'var(--bg-app)',
                    padding: '10px 14px',
                    borderRadius: '16px 16px 4px 16px',
                    fontSize: '13.5px',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    maxWidth: '85%'
                  }}>
                    "What are requirements for TU Wien M.Sc CS?"
                  </div>

                  {/* AI Bubble */}
                  <div style={{
                    alignSelf: 'flex-start',
                    background: 'var(--navy-faint)',
                    border: '1px solid var(--border-strong)',
                    padding: '12px 14px',
                    borderRadius: '16px 16px 16px 4px',
                    fontSize: '13px',
                    color: 'var(--navy)',
                    lineHeight: 1.5,
                    maxWidth: '90%',
                    fontFamily: 'var(--font-body)',
                    minHeight: 90
                  }}>
                    <TypewriterText 
                      active={activeCard === 0} 
                      text="For TU Wien Computer Science, you'll need a B.Tech with min 60% in CS/related field, IELTS 6.5+, and German B2 or English..." 
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Budget Snapshot */}
              <div className={`hero-feature-card ${activeCard === 1 ? 'active' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 10, borderBottom: '1px solid var(--border-subtle)', marginBottom: 14 }}>
                  <span style={{ fontSize: '20px' }}>💰</span>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--navy)', fontFamily: 'var(--font-ui)' }}>Monthly Budget — Vienna</span>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { label: 'Rent', value: '€550', pct: 46, color: 'var(--navy)' },
                    { label: 'Food', value: '€280', pct: 23, color: 'var(--gold)' },
                    { label: 'Transport', value: '€30', pct: 3, color: '#0ea5e9' },
                    { label: 'Miscellaneous', value: '€340', pct: 28, color: '#10b981' },
                  ].map(item => (
                    <div key={item.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>
                        <span>{item.label}</span>
                        <span style={{ fontWeight: 700 }}>{item.value} <span style={{ fontWeight: 500, fontSize: '11px', color: 'var(--text-tertiary)' }}>({item.pct}%)</span></span>
                      </div>
                      <div style={{ background: 'var(--bg-app)', height: 6, borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: 3 }} />
                      </div>
                    </div>
                  ))}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--navy)' }}>
                      Total €1,200/mo <span style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '13px' }}>= ₹1,09,200</span>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gold)', fontFamily: 'var(--font-ui)', cursor: 'pointer' }} onClick={() => navigate('/budget')}>
                      Calculate →
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3: Roadmap Steps */}
              <div className={`hero-feature-card ${activeCard === 2 ? 'active' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 10, borderBottom: '1px solid var(--border-subtle)', marginBottom: 12 }}>
                  <span style={{ fontSize: '20px' }}>🗺️</span>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--navy)', fontFamily: 'var(--font-ui)' }}>Germany M.Sc Roadmap</span>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {[
                    { text: 'IELTS 7.0+ achieved', done: true },
                    { text: 'Universities shortlisted', done: true },
                    { text: 'APS Certificate — In Progress', active: true },
                    { text: 'Applications open', pending: true },
                    { text: 'Blocked account setup', pending: true },
                    { text: 'Student Visa appointment', pending: true }
                  ].map((step, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px' }}>
                      <span style={{ 
                        color: step.done ? '#10b981' : step.active ? 'var(--navy)' : 'var(--text-tertiary)',
                        fontWeight: 900
                      }}>
                        {step.done ? '✓' : step.active ? '●' : '○'}
                      </span>
                      <span style={{ 
                        fontWeight: step.active || step.done ? 600 : 500,
                        color: step.pending ? 'var(--text-secondary)' : 'var(--text-primary)'
                      }}>
                        {step.text}
                      </span>
                    </div>
                  ))}

                  <div style={{ marginTop: 'auto', paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: 4 }}>
                      <span>4 of 6 steps complete</span>
                      <span style={{ fontWeight: 700 }}>67%</span>
                    </div>
                    <div style={{ background: 'var(--bg-app)', height: 6, borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: '67%', height: '100%', background: 'var(--gradient-primary)', borderRadius: 3 }} />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Dots OUTSIDE the card container — below it */}
            <div className="hero-card-dots" style={{ marginTop: 16 }}>
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
          from { opacity: 0; transform: translateY(24px); }
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