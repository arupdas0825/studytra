import { useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'

const countries = [
  {
    flag: '🇩🇪',
    name: 'Germany',
    tag: 'Tuition-Free Public Universities',
    color: '#1a3260',
    highlights: ['APS Certificate required', 'Uni-Assist applications', 'Blocked account: €11,208/yr', 'Student visa in ~6 weeks'],
    intake: 'Winter & Summer',
    cost: '€800–€1,200/mo',
  },
  {
    flag: '🇺🇸',
    name: 'United States',
    tag: 'World-Ranked Research Programs',
    color: '#8B1A1A',
    highlights: ['GRE/GMAT required', 'Direct university portals', 'I-20 for F-1 Visa', 'SEVIS fee: $350'],
    intake: 'Fall & Spring',
    cost: '$1,500–$2,500/mo',
  },
  {
    flag: '🇨🇦',
    name: 'Canada',
    tag: 'Post-Study Work Permit (PGWP)',
    color: '#7B2D00',
    highlights: ['IELTS 6.5+ required', 'DLI-designated colleges only', 'Study Permit process', 'PR pathway available'],
    intake: 'Sept & Jan',
    cost: 'CAD 1,500–2,200/mo',
  },
]

export default function Countries() {
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
    <section id="countries" ref={sectionRef} style={{ padding: '100px 24px', background: 'white' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <span className="section-label reveal">Destinations</span>
          <h2 className="section-title reveal" style={{ transitionDelay: '0.1s' }}>
            Choose Your Country
          </h2>
          <p className="section-sub reveal" style={{ margin: '0 auto', transitionDelay: '0.2s' }}>
            Each country has its own process, timeline, and costs. Studytra gives you precise guidance for all three.
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24,
        }} className="countries-grid">
          {countries.map(({ flag, name, tag, color, highlights, intake, cost }, i) => (
            <div key={name} className="reveal" style={{
              transitionDelay: `${0.1 + i * 0.12}s`,
              borderRadius: 'var(--radius)', overflow: 'hidden',
              border: '1px solid var(--gray-200)',
              boxShadow: 'var(--shadow-sm)',
              background: 'white',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
            >
              {/* Card header */}
              <div style={{
                background: color,
                padding: '28px 28px 24px',
              }}>
                <div style={{ fontSize: '2.8rem', marginBottom: 12 }}>{flag}</div>
                <h3 style={{
                  color: 'white', fontFamily: 'Fraunces, serif',
                  fontSize: '1.5rem', marginBottom: 6,
                }}>{name}</h3>
                <span style={{
                  display: 'inline-block',
                  background: 'rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '0.72rem', fontWeight: 500,
                  padding: '3px 12px', borderRadius: 100,
                }}>{tag}</span>
              </div>

              {/* Card body */}
              <div style={{ padding: '24px 28px' }}>
                <div style={{ marginBottom: 20 }}>
                  {highlights.map(h => (
                    <div key={h} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      marginBottom: 10,
                    }}>
                      <div style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: color, flexShrink: 0,
                      }} />
                      <span style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>{h}</span>
                    </div>
                  ))}
                </div>

                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  background: 'var(--gray-100)', borderRadius: 12,
                  padding: '12px 16px', marginBottom: 20,
                }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', marginBottom: 2 }}>INTAKE</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)' }}>{intake}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', marginBottom: 2 }}>EST. COST</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)' }}>{cost}</div>
                  </div>
                </div>

                <button style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  width: '100%', padding: '12px',
                  background: color, color: 'white',
                  borderRadius: 12, fontSize: '0.88rem', fontWeight: 600,
                  transition: 'opacity 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  Plan for {name} <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .countries-grid { grid-template-columns: 1fr !important; max-width: 440px; margin: 0 auto; }
        }
      `}</style>
    </section>
  )
}