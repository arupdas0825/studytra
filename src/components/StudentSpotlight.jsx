import { useEffect, useRef } from 'react'
import { COUNTRIES } from '../constants/countries'

const students = [
  { name: 'Priya Sharma', initials: 'PS', countryId: 'germany', intake: 'Winter 2025', degree: 'MSc Data Science', uni: 'TU Munich', quote: 'APS, Uni-Assist, and visa timeline — all perfectly structured.' },
  { name: 'Rahul Kumar', initials: 'RK', countryId: 'canada', intake: 'Sept 2025', degree: 'MEng Computer Eng.', uni: 'University of Waterloo', quote: 'The cost estimator and SDS guidance saved me months of confusion.' },
  { name: 'Aishwarya Nair', initials: 'AN', countryId: 'usa', intake: 'Fall 2025', degree: 'MS Electrical Eng.', uni: 'Georgia Tech', quote: 'GRE to I-20 — every step was mapped out with zero guesswork.' },
  { name: 'Aryan Mehta', initials: 'AM', countryId: 'uk', intake: 'Sept 2025', degree: 'MSc Finance', uni: 'UCL London', quote: 'CAS process and Graduate Route explained better than any consultant.' },
  { name: 'Sneha Rao', initials: 'SR', countryId: 'australia', intake: 'Feb 2026', degree: 'Master of IT', uni: 'University of Melbourne', quote: 'Subclass 500 visa and post-study work rights — all crystal clear.' },
]

export default function StudentSpotlight() {
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')) })
    }, { threshold: 0.08 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} style={{ padding: '100px 24px', background: 'var(--ivory)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{
            display: 'inline-block', background: 'var(--mint-100)',
            color: 'var(--mint-600)', fontSize: '0.72rem', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '5px 14px', borderRadius: 'var(--r-full)', marginBottom: 16,
          }} className="reveal">Student Spotlight</span>
          <h2 className="reveal" style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', transitionDelay: '0.1s' }}>
            Real Students. Real Results.
          </h2>
          <p className="reveal" style={{ color: 'var(--gray-500)', maxWidth: 480, margin: '12px auto 0', transitionDelay: '0.15s' }}>
            Students across all 5 destinations who planned independently using Studytra.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 18 }} className="spot-grid">
          {students.map(({ name, initials, countryId, intake, degree, uni, quote }, i) => {
            const country = COUNTRIES.find(c => c.id === countryId)
            return (
              <div key={name} className="reveal" style={{
                transitionDelay: `${0.05 + i * 0.1}s`,
                background: 'white', borderRadius: 'var(--r-lg)',
                border: '1px solid var(--gray-200)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.22s, box-shadow 0.22s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
              >
                <div style={{
                  background: `linear-gradient(135deg, ${country.headerColor} 0%, ${country.accentColor} 100%)`,
                  padding: '22px 18px',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontFamily: 'Plus Jakarta Sans',
                    fontSize: '1rem', fontWeight: 800, flexShrink: 0,
                  }}>{initials}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'white' }}>{name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
                      {country.flag} {country.name} · {intake}
                    </div>
                  </div>
                </div>

                <div style={{ padding: '16px 18px 18px' }}>
                  <div style={{
                    background: 'var(--gray-50)', borderRadius: 'var(--r-sm)',
                    padding: '10px 12px', marginBottom: 14,
                  }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray-400)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Program</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--blue-950)' }}>{degree}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{uni}</div>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', lineHeight: 1.65, fontStyle: 'italic' }}>
                    "{quote}"
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) { .spot-grid { grid-template-columns: repeat(3,1fr) !important; } }
        @media (max-width: 700px) { .spot-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 480px) { .spot-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}