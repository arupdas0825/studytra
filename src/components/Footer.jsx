import { GraduationCap, Twitter, Linkedin, Instagram, Github } from 'lucide-react'
import { COUNTRIES } from '../constants/countries'

export default function Footer() {
  const cols = {
    Platform: ['Admission Roadmap', 'Visa Process', 'Cost Estimator', 'Timeline Planner', 'Document Checklist'],
    Countries: COUNTRIES.map(c => `${c.flag} ${c.name}`),
    Resources: ['Exam Guide', 'Loan Comparison', 'Scholarship List', 'Flight Planning', 'FAQ'],
  }

  return (
    <footer style={{ background: 'var(--blue-950)', color: 'white', padding: '72px 24px 36px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 48, marginBottom: 56 }} className="foot-grid">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 11,
                background: 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <GraduationCap size={20} color="white" />
              </div>
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '1.2rem' }}>Studytra</span>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, maxWidth: 260, marginBottom: 24 }}>
              AI-powered study abroad execution for Indian students. 5 countries. Structured. Free.
            </p>
            {/* Country flags */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
              {COUNTRIES.map(c => (
                <span key={c.id} title={c.name} style={{
                  fontSize: '1.3rem', background: 'rgba(255,255,255,0.08)',
                  width: 36, height: 36, borderRadius: 'var(--r-sm)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'default',
                }}>{c.flag}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[Twitter, Linkedin, Instagram, Github].map((Icon, i) => (
                <button key={i} style={{
                  width: 34, height: 34, borderRadius: 'var(--r-sm)',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                >
                  <Icon size={14} color="rgba(255,255,255,0.6)" />
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(cols).map(([cat, items]) => (
            <div key={cat}>
              <h4 style={{
                fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
                marginBottom: 18, fontFamily: 'DM Sans',
              }}>{cat}</h4>
              {items.map(item => (
                <a key={item} href="#" style={{
                  display: 'block', marginBottom: 11,
                  fontSize: '0.86rem', color: 'rgba(255,255,255,0.55)',
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.target.style.color = 'white'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.55)'}
                >{item}</a>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
        }}>
          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.28)' }}>
            © 2025 Studytra. Built for Indian students planning to study abroad.
          </span>
          <div style={{ display: 'flex', gap: 22 }}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <a key={l} href="#" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.28)', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.28)'}
              >{l}</a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .foot-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 540px) { .foot-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  )
}