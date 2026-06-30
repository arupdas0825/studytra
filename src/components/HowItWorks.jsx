import { useEffect, useRef } from 'react'
import { Lock, Map, CheckSquare, Plane } from 'lucide-react'

const steps = [
  { n: '01', icon: Lock, title: 'Lock Your Decision', desc: 'Choose country, degree, university & intake. Every step aligns to your locked plan.' },
  { n: '02', icon: Map, title: 'Follow Your Roadmap', desc: 'Chronological, stage-based plan covering exams, applications, finances, visa & departure.' },
  { n: '03', icon: CheckSquare, title: 'Execute Each Stage', desc: 'Checklists, timelines & document guides walk you through every task with precision.' },
  { n: '04', icon: Plane, title: 'Depart with Confidence', desc: 'Flight guidance, arrival tips & pre-departure prep. Go independently.' },
]

export default function HowItWorks() {
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.sr').forEach(el => el.classList.add('sr-visible'))
        }
      })
    }, { threshold: 0.12 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="how-it-works"
      ref={ref}
      style={{
        padding: '108px 24px',
        background: '#ffffff',
        borderTop: '1px solid rgba(26,20,8,0.07)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background radial for depth */}
      <div style={{
        position: 'absolute', top: '30%', right: '-8%',
        width: 480, height: 480,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(29,52,97,0.035) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '-6%',
        width: 360, height: 360,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(184,146,42,0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="sr" style={{ textAlign: 'center', marginBottom: 60 }}>
          <span className="section-badge">Process</span>
          <h2 className="section-headline" style={{ textAlign: 'center' }}>
            Four Stages, One Clear Path
          </h2>
          <div className="gold-rule" />
          <p className="section-subtext" style={{ textAlign: 'center' }}>
            We break your entire study abroad journey into four logical stages —
            so you never feel lost.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
          {steps.map(({ n, icon: Icon, title, desc }, i) => (
            <div
              key={n}
              className={`navy-step-card sr sr-delay-${i + 1}`}
              style={{ padding: '32px 24px' }}
            >
              {/* Big ghost number */}
              <div style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 900,
                fontSize: '3.8rem',
                color: 'rgba(29, 52, 97, 0.05)',
                lineHeight: 1,
                marginBottom: 18,
                userSelect: 'none',
              }}>{n}</div>

              {/* Icon */}
              <div style={{
                width: 46, height: 46,
                borderRadius: 13,
                background: 'var(--gradient-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 18,
                boxShadow: '0 4px 16px rgba(29,52,97,0.22)',
              }}>
                <Icon size={20} color="white" />
              </div>

              <h3 style={{
                fontSize: '1rem',
                fontWeight: 800,
                marginBottom: 10,
                color: 'var(--text-primary)',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}>{title}</h3>

              <p style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.72,
                margin: 0,
              }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .steps-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 560px) { .steps-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}