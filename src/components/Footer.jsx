import { GraduationCap, Twitter, Linkedin, Instagram } from 'lucide-react'

export default function Footer() {
  const links = {
    Platform: ['Admission Roadmap', 'Visa Process', 'Cost Estimator', 'Timeline Planner'],
    Countries: ['Germany', 'United States', 'Canada'],
    Resources: ['Exam Guide', 'Loan Comparison', 'Flight Planning', 'FAQ'],
  }

  return (
    <footer style={{ background: 'var(--navy)', color: 'white', padding: '72px 24px 40px' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr 1fr 1fr',
          gap: 48, marginBottom: 60,
        }} className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(255,255,255,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <GraduationCap size={20} color="white" />
              </div>
              <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: '1.3rem' }}>Studytra</span>
            </div>
            <p style={{
              fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.7, maxWidth: 280, marginBottom: 28,
            }}>
              AI-powered study abroad execution for Indian students. Germany, USA, and Canada — structured, clear, and free.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                <button key={i} style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                >
                  <Icon size={15} color="rgba(255,255,255,0.7)" />
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 style={{
                fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)',
                marginBottom: 20, fontFamily: 'DM Sans, sans-serif',
              }}>{category}</h4>
              {items.map(item => (
                <a key={item} href="#" style={{
                  display: 'block', marginBottom: 12,
                  fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)',
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.target.style.color = 'white'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
                >{item}</a>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: 28,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}>
          <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.3)' }}>
            © 2025 Studytra. Built for Indian students planning to study abroad.
          </span>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <a key={l} href="#" style={{
                fontSize: '0.82rem', color: 'rgba(255,255,255,0.3)',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}
              >{l}</a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}