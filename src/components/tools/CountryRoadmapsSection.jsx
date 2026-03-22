import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Navbar'

const COUNTRIES = [
  {
    code: 'DE', name: 'Germany', flag: '🇩🇪',
    color: '#1A56DB', dotColor: '#1A56DB', badgeColor: '#0EA5A0', badge: 'Free Tuition',
    pdf: '/pdfs/Studytra_GERMANY_Roadmap_2026.pdf',
    highlights: ['APS Certificate & Blocked Account','Visa → Residence Permit Process','Anmeldung & Health Insurance'],
  },
  {
    code: 'US', name: 'United States', flag: '🇺🇸',
    color: '#C53030', dotColor: '#E53E3E', badgeColor: '#C53030', badge: 'STEM OPT 3yr',
    pdf: '/pdfs/Studytra_USA_Roadmap_2026.pdf',
    highlights: ['I-20, SEVIS Fee & F-1 Visa','SSN Pipeline & Campus Jobs','OPT / STEM OPT Work Rights'],
  },
  {
    code: 'CA', name: 'Canada', flag: '🇨🇦',
    color: '#B91C1C', dotColor: '#DC2626', badgeColor: '#B91C1C', badge: 'PR Pathway',
    pdf: '/pdfs/Studytra_CANADA_Roadmap_2026.pdf',
    highlights: ['GIC CAD $22,895 & PAL System','Study Permit at Port of Entry','PGWP & PR Pathway (CIP Codes)'],
  },
  {
    code: 'GB', name: 'United Kingdom', flag: '🇬🇧',
    color: '#1D4ED8', dotColor: '#1D4ED8', badgeColor: '#7C3AED', badge: 'eVisa 2026',
    pdf: '/pdfs/Studytra_UK_Roadmap_2026.pdf',
    highlights: ['CAS, IHS Surcharge & eVisa','Share Codes & GP Registration','Graduate Route (2yr) — 2026 Alert'],
  },
  {
    code: 'AU', name: 'Australia', flag: '🇦🇺',
    color: '#B45309', dotColor: '#D97706', badgeColor: '#B45309', badge: '48hrs/fortnight',
    pdf: '/pdfs/Studytra_AUSTRALIA_Roadmap_2026.pdf',
    highlights: ['GS Test, OSHC & AUD $29,710 Proof','TFN Application & Bank Account','Subclass 485 — Age Limit Now 35'],
  },
]

function CountryCard({ country }) {
  const [hovered, setHovered] = useState(false)

  const handlePreview = () => window.open(country.pdf, '_blank')

  const handleDownload = async () => {
    try {
      const res = await fetch(country.pdf)
      if (!res.ok) throw new Error('not found')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Studytra_${country.name.replace(/ /g, '_')}_Roadmap_2026.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      window.open(country.pdf, '_blank')
    }
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#FFFFFF', borderRadius: 20,
        border: `1.5px solid ${hovered ? country.color : '#E8EDF5'}`,
        padding: '28px 24px 22px', display: 'flex', flexDirection: 'column',
        boxShadow: hovered ? `0 8px 32px ${country.color}22` : '0 2px 12px rgba(0,0,0,0.05)',
        transition: 'all .25s ease', position: 'relative',
      }}
    >
      <div style={{
        position: 'absolute', top: 16, right: 16,
        background: country.badgeColor + '18', color: country.badgeColor,
        fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 100,
      }}>
        {country.badge}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14, background: country.color + '12',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ fontSize: 28 }}>{country.flag}</span>
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: '#0F1C3F', letterSpacing: '-0.4px' }}>
            {country.name}
          </div>
          <div style={{ fontSize: 12, color: '#A0AEC0', fontWeight: 600, marginTop: 2 }}>
            Complete 2026 Roadmap
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22, flex: 1 }}>
        {country.highlights.map((h, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: country.dotColor, flexShrink: 0, marginTop: 5 }} />
            <span style={{ fontSize: 13.5, color: '#4A5568', lineHeight: 1.5 }}>{h}</span>
          </div>
        ))}
      </div>
      <div style={{ height: 1, background: '#F0F3F8', marginBottom: 16 }} />
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={handlePreview} style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          background: hovered ? country.color : '#F4F6FA',
          color: hovered ? '#fff' : '#4A5568',
          borderRadius: 10, padding: '10px 0', fontSize: 13, fontWeight: 700,
          border: 'none', cursor: 'pointer', transition: 'all .25s',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          Preview PDF
        </button>
        <button onClick={handleDownload} title="Download PDF" style={{
          width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#F4F6FA', borderRadius: 10, border: 'none', cursor: 'pointer', flexShrink: 0, transition: 'background .2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = country.color + '18'}
          onMouseLeave={e => e.currentTarget.style.background = '#F4F6FA'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={country.color} strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function CountryRoadmapsSection() {
  const navigate = useNavigate()

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#F4F6FA', fontFamily: '"Plus Jakarta Sans", "DM Sans", sans-serif', paddingTop: 68 }}>

        <div style={{ padding: '20px 5vw 0' }}>
          <button onClick={() => navigate(-1)} style={{
            background: 'none', border: 'none', color: 'var(--blue-700, #1d4ed8)',
            fontWeight: 600, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, padding: 0,
          }}>
            ← Back
          </button>
        </div>

        <div style={{ textAlign: 'center', padding: '44px 5vw 36px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#D1FAF8', borderRadius: 100, padding: '5px 14px', marginBottom: 18 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#0EA5A0', display: 'inline-block' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#0EA5A0' }}>VERIFIED 2026 DATA · 5 COUNTRIES</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: '#0F1C3F', letterSpacing: '-1.5px', margin: '0 0 14px', lineHeight: 1.1 }}>
            Student Execution Guides
          </h1>
          <p style={{ fontSize: 16, color: '#718096', maxWidth: 580, margin: '0 auto', lineHeight: 1.7 }}>
            Complete pre-departure + post-arrival roadmaps for every country. Covers visa, documents, costs, registration, and work rights — all verified for 2026 intake.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 28, flexWrap: 'wrap' }}>
            {[{val:'5',label:'Countries Covered'},{val:'2026',label:'Verified Data'},{val:'Pre + Post',label:'Arrival Phases'},{val:'Free',label:'Download'}].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#1A56DB', letterSpacing: '-0.5px' }}>{s.val}</div>
                <div style={{ fontSize: 12, color: '#A0AEC0', fontWeight: 600, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 5vw 60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 22 }}>
          {COUNTRIES.map(c => <CountryCard key={c.code} country={c} />)}
        </div>

        <div style={{ background: 'linear-gradient(135deg,#0F1C3F 0%,#1A2E6B 100%)', padding: '40px 5vw', textAlign: 'center' }}>
          <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 22, marginBottom: 10, letterSpacing: '-0.5px' }}>
            Want a personalized roadmap for YOUR situation?
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, marginBottom: 24 }}>
            Tell Stu your country, intake, and stage — get your exact step-by-step plan in seconds.
          </p>
          <button onClick={() => navigate('/chat')} style={{
            background: 'linear-gradient(135deg,#0EA5A0,#1A56DB)', color: '#fff',
            border: 'none', borderRadius: 12, padding: '14px 32px',
            fontWeight: 800, fontSize: 15, cursor: 'pointer',
          }}>
            ✨ Start AI Assistant
          </button>
        </div>
      </div>
    </>
  )
}