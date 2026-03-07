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
      entries.forEach(e => { if (e.isIntersecting) e.target.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')) })
    }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="how-it-works" ref={ref} style={{ padding: '100px 24px', background: 'var(--white)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{
            display: 'inline-block', background: 'var(--blue-50)',
            color: 'var(--blue-700)', fontSize: '0.72rem', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '5px 14px', borderRadius: 'var(--r-full)', marginBottom: 16,
          }} className="reveal">Process</span>
          <h2 className="reveal" style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', transitionDelay: '0.1s' }}>
            Four Stages, One Clear Path
          </h2>
          <p className="reveal" style={{ color: 'var(--gray-500)', maxWidth: 500, margin: '12px auto 0', fontSize: '1rem', transitionDelay: '0.15s' }}>
            We break your entire study abroad journey into four logical stages.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }} className="steps-grid">
          {steps.map(({ n, icon: Icon, title, desc }, i) => (
            <div key={n} className="reveal" style={{
              transitionDelay: `${0.1 + i * 0.1}s`,
              background: 'var(--ivory)',
              borderRadius: 'var(--r-lg)', padding: '32px 24px',
              border: '1px solid var(--gray-200)',
              position: 'relative', overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800,
                fontSize: '3.5rem', color: 'var(--gray-200)', lineHeight: 1, marginBottom: 20,
              }}>{n}</div>
              <div style={{
                width: 46, height: 46, borderRadius: 'var(--r-md)',
                background: 'linear-gradient(135deg, var(--blue-700) 0%, var(--blue-500) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
                boxShadow: '0 4px 14px rgba(26,58,140,0.25)',
              }}>
                <Icon size={20} color="white" />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 10, color: 'var(--blue-950)' }}>{title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', lineHeight: 1.7 }}>{desc}</p>
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