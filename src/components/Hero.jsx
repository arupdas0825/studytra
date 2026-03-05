import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Shield, Clock, TrendingUp } from 'lucide-react'

const stats = [
  { icon: Shield, value: '3 Countries', label: 'Germany · USA · Canada' },
  { icon: Clock, value: '8 Stages', label: 'Structured Roadmap' },
  { icon: TrendingUp, value: '100% Free', label: 'No Consultancy Fees' },
]

export default function Hero() {
  const navigate = useNavigate()
  const badgeRef = useRef(null)
  const headRef = useRef(null)
  const subRef = useRef(null)
  const ctaRef = useRef(null)
  const statsRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    const els = [badgeRef, headRef, subRef, ctaRef, statsRef, imageRef]
    els.forEach((ref, i) => {
      if (!ref.current) return
      ref.current.style.opacity = '0'
      ref.current.style.transform = 'translateY(24px)'
      setTimeout(() => {
        if (!ref.current) return
        ref.current.style.transition = 'opacity 0.7s ease, transform 0.7s ease'
        ref.current.style.opacity = '1'
        ref.current.style.transform = 'translateY(0)'
      }, 120 + i * 110)
    })
  }, [])

  return (
    <section style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #f8f8f6 0%, #ffffff 55%, #f0f4ff 100%)',
      display: 'flex', alignItems: 'center',
      padding: '120px 24px 80px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '-80px', right: '-80px',
        width: 480, height: 480, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,147,58,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '60px', left: '-120px',
        width: 360, height: 360, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(15,31,61,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1160, margin: '0 auto', width: '100%' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 60, alignItems: 'center',
        }} className="hero-grid">

          <div>
            <div ref={badgeRef} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--accent-light)',
              border: '1px solid rgba(201,147,58,0.25)',
              borderRadius: 100, padding: '6px 16px 6px 6px', marginBottom: 28,
            }}>
              <span style={{
                background: 'var(--accent)', color: 'white',
                fontSize: '10px', fontWeight: 700,
                padding: '3px 10px', borderRadius: 100, letterSpacing: '0.06em',
              }}>NEW</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--navy)' }}>
                AI-Powered Study Abroad Planning
              </span>
            </div>

            <h1 ref={headRef} style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
              fontWeight: 700, color: 'var(--navy)',
              lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.02em',
            }}>
              Your Study Abroad<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--accent)' }}>Execution</em>{' '}Platform
            </h1>

            <p ref={subRef} style={{
              fontSize: '1.1rem', color: 'var(--gray-600)',
              lineHeight: 1.75, marginBottom: 36, maxWidth: 480,
            }}>
              Stop guessing. Start executing. Studytra gives Indian students a clear, structured roadmap to study in{' '}
              <strong style={{ color: 'var(--navy)' }}>Germany, USA, or Canada</strong> — without expensive consultancies.
            </p>

            <div ref={ctaRef} style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 48 }}>
              <button
                onClick={() => navigate('/chat')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'var(--navy)', color: 'white',
                  padding: '14px 28px', borderRadius: 12,
                  fontSize: '0.95rem', fontWeight: 600,
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 20px rgba(15,31,61,0.25)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--navy-mid)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--navy)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                Start Planning Free <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/chat')}
                style={{
                  background: 'white', color: 'var(--navy)',
                  padding: '14px 28px', borderRadius: 12,
                  fontSize: '0.95rem', fontWeight: 500,
                  border: '1.5px solid var(--gray-200)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--navy)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                See Roadmap →
              </button>
            </div>

            <div ref={statsRef} style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={value} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: 'var(--gray-100)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={16} color="var(--navy)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--navy)' }}>{value}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div ref={imageRef} style={{ position: 'relative' }}>
            <div style={{
              background: 'white', borderRadius: 28,
              boxShadow: 'var(--shadow-lg)', overflow: 'hidden',
              border: '1px solid var(--gray-200)',
            }}>
              <div style={{
                background: 'var(--navy)', padding: '20px 28px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: 4, letterSpacing: '0.1em' }}>STUDY PLAN</div>
                  <div style={{ color: 'white', fontFamily: 'Fraunces, serif', fontSize: '1.1rem' }}>Germany · MSc CS · WS 2025</div>
                </div>
                <div style={{
                  background: 'rgba(201,147,58,0.2)', border: '1px solid rgba(201,147,58,0.4)',
                  color: '#f0b960', padding: '4px 12px', borderRadius: 100,
                  fontSize: '0.72rem', fontWeight: 600,
                }}>ACTIVE</div>
              </div>

              <div style={{ padding: '24px 28px' }}>
                {[
                  { stage: 'Exam Prep', detail: 'IELTS · APS', status: 'done', dot: '#22c55e' },
                  { stage: 'Applications', detail: 'Uni-Assist · 4 unis', status: 'done', dot: '#22c55e' },
                  { stage: 'Visa Application', detail: 'Documents ready', status: 'active', dot: 'var(--accent)' },
                  { stage: 'Pre-Departure', detail: 'Flight & insurance', status: 'pending', dot: 'var(--gray-200)' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    paddingBottom: i < 3 ? 20 : 0, position: 'relative',
                  }}>
                    {i < 3 && (
                      <div style={{
                        position: 'absolute', left: 9, top: 20,
                        width: 2, height: 20,
                        background: item.status === 'done' ? '#22c55e' : 'var(--gray-200)',
                      }} />
                    )}
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: item.dot, flexShrink: 0,
                      border: item.status === 'active' ? '3px solid rgba(201,147,58,0.3)' : 'none',
                      boxShadow: item.status === 'active' ? '0 0 0 4px rgba(201,147,58,0.12)' : 'none',
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: item.status === 'pending' ? 'var(--gray-400)' : 'var(--navy)' }}>{item.stage}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{item.detail}</div>
                    </div>
                    {item.status === 'done' && <span style={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: 600 }}>✓ Done</span>}
                    {item.status === 'active' && <span style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 600 }}>In Progress</span>}
                  </div>
                ))}
              </div>

              <div style={{ padding: '16px 28px 24px', borderTop: '1px solid var(--gray-100)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gray-600)', fontWeight: 500 }}>Overall Progress</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy)' }}>62%</span>
                </div>
                <div style={{ background: 'var(--gray-100)', borderRadius: 100, height: 7 }}>
                  <div style={{ width: '62%', height: '100%', background: 'linear-gradient(90deg, var(--accent) 0%, #f0b960 100%)', borderRadius: 100 }} />
                </div>
              </div>
            </div>

            <div style={{
              position: 'absolute', top: -18, right: -18,
              background: 'white', borderRadius: 16, padding: '10px 16px',
              boxShadow: 'var(--shadow-md)', border: '1px solid var(--gray-200)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: '1.1rem' }}>🇩🇪</span>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--navy)' }}>Germany</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--gray-400)' }}>WS 2025</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}