import { useEffect, useRef } from 'react'
import { Map, Calculator, CreditCard, Clock, Plane, Lock } from 'lucide-react'

const features = [
  { icon: Map, title: 'Admission Roadmap', desc: 'Step-by-step country-specific application process from research to enrollment.' },
  { icon: Calculator, title: 'Cost Estimator', desc: 'Budget your tuition, rent, insurance, food and transport with INR conversion.' },
  { icon: CreditCard, title: 'Loan Guidance', desc: 'Compare Indian bank education loans by interest, collateral, and limits.' },
  { icon: Clock, title: 'Timeline Planner', desc: 'Intake-based milestone tracker covering all stages, editable to your dates.' },
  { icon: Plane, title: 'Flight Planning', desc: 'Booking window, budget range, and direct redirect to flight search platforms.' },
  { icon: Lock, title: 'Decision Locking', desc: 'Lock your country, university, and intake. All guidance aligns to your plan.' },
]

export default function Features() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'))
      }),
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="features" ref={sectionRef} style={{ padding: '100px 24px', background: 'var(--off-white)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 60, alignItems: 'start' }} className="features-layout">
          <div style={{ position: 'sticky', top: 100 }}>
            <span className="section-label reveal">Features</span>
            <h2 className="section-title reveal" style={{ transitionDelay: '0.1s' }}>
              Everything You Need.<br />
              <em style={{ fontWeight: 300, fontStyle: 'italic' }}>Nothing You Don't.</em>
            </h2>
            <p className="section-sub reveal" style={{ transitionDelay: '0.2s' }}>
              Studytra covers every functional area of study abroad planning — from exams to visa to flight — in one structured platform.
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
          }} className="features-grid">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="reveal" style={{
                transitionDelay: `${0.05 + i * 0.08}s`,
                background: 'white', borderRadius: 20,
                padding: '24px 22px',
                border: '1px solid var(--gray-200)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: 'var(--accent-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  <Icon size={18} color="var(--accent)" />
                </div>
                <h3 style={{ fontSize: '0.95rem', marginBottom: 8, color: 'var(--navy)' }}>{title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--gray-600)', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .features-layout { grid-template-columns: 1fr !important; }
          .features-layout > div:first-child { position: static !important; }
        }
        @media (max-width: 560px) {
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}