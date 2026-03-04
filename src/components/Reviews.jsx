import { useEffect, useRef } from 'react'
import { Star } from 'lucide-react'

const reviews = [
  {
    initials: 'VR',
    name: 'Vikram Reddy',
    target: 'Germany · MSc Robotics',
    text: 'The APS and visa document checklist saved me from so many mistakes. Everything was structured perfectly. I never needed a consultancy.',
    rating: 5,
    color: '#1a3260',
  },
  {
    initials: 'SM',
    name: 'Sneha Mehta',
    target: 'Canada · MBA',
    text: 'Cost estimator with INR conversion was a game-changer. I could show my parents exactly what the finances looked like. Incredibly transparent.',
    rating: 5,
    color: '#7B2D00',
  },
  {
    initials: 'AK',
    name: 'Arjun Krishnan',
    target: 'USA · MS Computer Science',
    text: 'Studytra gave me a complete GRE-to-I20 roadmap. The timeline planner kept me on track for Fall intake applications. Highly recommend.',
    rating: 5,
    color: '#8B1A1A',
  },
]

export default function Reviews() {
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
    <section id="reviews" ref={sectionRef} style={{ padding: '100px 24px', background: 'var(--off-white)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <span className="section-label reveal">Reviews</span>
          <h2 className="section-title reveal" style={{ transitionDelay: '0.1s' }}>
            What Students Say About Studytra
          </h2>
          <div className="reveal" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            marginTop: 12, transitionDelay: '0.2s',
          }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#c9933a" color="#c9933a" />)}
            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy)', marginLeft: 6 }}>4.9</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--gray-400)' }}>/ 5 from 200+ students</span>
          </div>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24,
        }} className="reviews-grid">
          {reviews.map(({ initials, name, target, text, rating, color }, i) => (
            <div key={name} className="reveal" style={{
              transitionDelay: `${0.1 + i * 0.12}s`,
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
              {/* Quote mark */}
              <div style={{
                fontSize: '4rem', lineHeight: 1,
                color: 'var(--gray-200)',
                fontFamily: 'Fraunces, serif',
                marginBottom: 4,
              }}>"</div>

              {/* Stars */}
              <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                {[...Array(rating)].map((_, i) => (
                  <Star key={i} size={14} fill="#c9933a" color="#c9933a" />
                ))}
              </div>

              <p style={{
                fontSize: '0.9rem', color: 'var(--gray-600)',
                lineHeight: 1.7, marginBottom: 24,
              }}>{text}</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontFamily: 'Fraunces, serif',
                  fontSize: '0.95rem', fontWeight: 700, flexShrink: 0,
                }}>{initials}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--navy)' }}>{name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{target}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .reviews-grid { grid-template-columns: 1fr !important; max-width: 480px; margin: 0 auto; }
        }
      `}</style>
    </section>
  )
}