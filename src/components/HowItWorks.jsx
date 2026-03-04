import { useEffect, useRef } from 'react'
import { Target, BookOpen, FileText, Plane } from 'lucide-react'

const steps = [
  {
    num: '01', icon: Target,
    title: 'Lock Your Decision',
    desc: 'Choose your country, degree, university, and intake. Every step that follows is customized to your locked plan.',
  },
  {
    num: '02', icon: BookOpen,
    title: 'Follow Your Roadmap',
    desc: 'Get a chronological, stage-by-stage plan covering exams, applications, finances, visa, and pre-departure.',
  },
  {
    num: '03', icon: FileText,
    title: 'Execute Each Stage',
    desc: 'Checklists, timelines, and document guides walk you through every task with precision. No guesswork.',
  },
  {
    num: '04', icon: Plane,
    title: 'Depart with Confidence',
    desc: 'Flight guidance, arrival tips, and final pre-departure prep. You\'re ready to go, independently.',
  },
]

export default function HowItWorks() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'))
      }),
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="how-it-works" ref={sectionRef} style={{
      padding: '100px 24px',
      background: 'var(--off-white)',
    }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <span className="section-label reveal">Process</span>
          <h2 className="section-title reveal" style={{ transitionDelay: '0.1s' }}>
            Four Stages, One Clear Path
          </h2>
          <p className="section-sub reveal" style={{ margin: '0 auto', transitionDelay: '0.2s' }}>
            Studytra breaks your entire study abroad journey into four logical stages — so you always know what to do next.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20,
        }} className="steps-grid">
          {steps.map(({ num, icon: Icon, title, desc }, i) => (
            <div key={num} className="reveal" style={{
              transitionDelay: `${0.1 + i * 0.1}s`,
              background: 'white',
              borderRadius: 'var(--radius)',
              padding: '32px 28px',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--gray-200)',
              position: 'relative',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
            >
              <div style={{
                fontSize: '3.5rem', fontFamily: 'Fraunces, serif',
                fontWeight: 700, color: 'var(--gray-200)',
                lineHeight: 1, marginBottom: 20,
              }}>{num}</div>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'var(--navy)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 18,
              }}>
                <Icon size={20} color="white" />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: 10, color: 'var(--navy)' }}>{title}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--gray-600)', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .steps-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .steps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}