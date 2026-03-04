import { useEffect, useRef } from 'react'

const students = [
  {
    initials: 'PS',
    name: 'Priya Sharma',
    country: 'Germany',
    flag: '🇩🇪',
    intake: 'Winter 2025',
    degree: 'MSc Data Science',
    university: 'TU Munich',
    summary: 'Studytra helped me structure APS, Uni-Assist, and visa timeline clearly.',
    color: '#1a3260',
    bg: '#e8ecf5',
  },
  {
    initials: 'RK',
    name: 'Rahul Kumar',
    country: 'Canada',
    flag: '🇨🇦',
    intake: 'Sept 2025',
    degree: 'MEng Computer Eng.',
    university: 'University of Waterloo',
    summary: 'The cost estimator and loan comparison saved me months of research.',
    color: '#7B2D00',
    bg: '#f5ece8',
  },
  {
    initials: 'AN',
    name: 'Aishwarya Nair',
    country: 'USA',
    flag: '🇺🇸',
    intake: 'Fall 2025',
    degree: 'MS Electrical Eng.',
    university: 'Georgia Tech',
    summary: 'From GRE prep to I-20, every step was mapped out with no confusion.',
    color: '#8B1A1A',
    bg: '#f5e8e8',
  },
]

export default function StudentSpotlight() {
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
    <section ref={sectionRef} style={{ padding: '100px 24px', background: 'white' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <span className="section-label reveal">Student Spotlight</span>
          <h2 className="section-title reveal" style={{ transitionDelay: '0.1s' }}>
            Real Students. Real Results.
          </h2>
          <p className="section-sub reveal" style={{ margin: '0 auto', transitionDelay: '0.2s' }}>
            Students who planned their study abroad journey using Studytra — independently, without consultancies.
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24,
        }} className="spotlight-grid">
          {students.map(({ initials, name, country, flag, intake, degree, university, summary, color, bg }, i) => (
            <div key={name} className="reveal" style={{
              transitionDelay: `${0.1 + i * 0.12}s`,
              background: 'white',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--gray-200)',
              boxShadow: 'var(--shadow-sm)',
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
            >
              {/* Avatar area */}
              <div style={{
                background: bg,
                padding: '32px 28px 24px',
                display: 'flex', alignItems: 'center', gap: 16,
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontFamily: 'Fraunces, serif',
                  fontSize: '1.4rem', fontWeight: 700, flexShrink: 0,
                }}>{initials}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--navy)', marginBottom: 4 }}>{name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>
                    {flag} {country} · {intake}
                  </div>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '20px 28px 24px' }}>
                <div style={{
                  background: 'var(--gray-100)', borderRadius: 12,
                  padding: '12px 16px', marginBottom: 16,
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', marginBottom: 2 }}>DEGREE</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--navy)' }}>{degree}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--gray-600)' }}>{university}</div>
                </div>
                <p style={{
                  fontSize: '0.87rem', color: 'var(--gray-600)',
                  lineHeight: 1.65, fontStyle: 'italic',
                }}>"{summary}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .spotlight-grid { grid-template-columns: 1fr !important; max-width: 440px; margin: 0 auto; }
        }
      `}</style>
    </section>
  )
}