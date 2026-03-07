import { useEffect, useRef } from 'react'
import { Map, Calculator, CreditCard, Clock, Plane, Lock, Globe, FileCheck } from 'lucide-react'

const features = [
  { icon: Globe, title: '5 Country Coverage', desc: 'Germany, USA, Canada, UK & Australia — complete guidance for all five destinations.', color: 'var(--mint-500)' },
  { icon: Map, title: 'Admission Roadmap', desc: 'Step-by-step country-specific application process from research to enrollment.', color: 'var(--blue-500)' },
  { icon: Calculator, title: 'Cost Estimator', desc: 'Monthly & yearly cost breakdown with live INR conversion for every city.', color: '#f59e0b' },
  { icon: CreditCard, title: 'Loan Guidance', desc: 'Compare SBI, HDFC Credila, Avanse & more — interest, collateral, and limits.', color: '#8b5cf6' },
  { icon: Clock, title: 'Timeline Planner', desc: 'Intake-based milestone tracker covering all stages — editable to your dates.', color: 'var(--blue-400)' },
  { icon: FileCheck, title: 'Document Checklist', desc: 'Interactive country-wise checklist with progress tracking — never miss a doc.', color: 'var(--mint-600)' },
  { icon: Plane, title: 'Flight Planning', desc: 'Booking window, budget range, and direct links to flight search platforms.', color: '#f97316' },
  { icon: Lock, title: 'Decision Locking', desc: 'Lock your plan — country, university, intake. All AI guidance aligns to it.', color: 'var(--blue-700)' },
]

export default function Features() {
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')) })
    }, { threshold: 0.08 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="features" ref={ref} style={{ padding: '100px 24px', background: 'var(--white)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.7fr', gap: 72, alignItems: 'start' }} className="feat-layout">
          <div style={{ position: 'sticky', top: 96 }}>
            <span style={{
              display: 'inline-block', background: 'var(--blue-50)',
              color: 'var(--blue-700)', fontSize: '0.72rem', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '5px 14px', borderRadius: 'var(--r-full)', marginBottom: 16,
            }} className="reveal">Features</span>
            <h2 className="reveal" style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', transitionDelay: '0.1s' }}>
              Everything You Need.<br />
              <span style={{ color: 'var(--gray-400)', fontWeight: 400, fontSize: '90%' }}>Nothing You Don't.</span>
            </h2>
            <p className="reveal" style={{ color: 'var(--gray-500)', marginTop: 14, lineHeight: 1.75, transitionDelay: '0.15s' }}>
              Every functional area of study abroad planning — from exams to visa to flight — in one structured platform.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="feat-grid">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <div key={title} className="reveal" style={{
                transitionDelay: `${0.05 + i * 0.07}s`,
                background: 'var(--ivory)',
                borderRadius: 'var(--r-lg)', padding: '22px 20px',
                border: '1px solid var(--gray-200)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.background = 'white' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'var(--ivory)' }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 'var(--r-sm)',
                  background: `${color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
                }}>
                  <Icon size={18} color={color} />
                </div>
                <h3 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: 6, color: 'var(--blue-950)' }}>{title}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .feat-layout { grid-template-columns: 1fr !important; }
          .feat-layout > div:first-child { position: static !important; }
        }
        @media (max-width: 540px) { .feat-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}