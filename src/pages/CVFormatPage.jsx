import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import CVTemplateView from '../components/tools/CVTemplateView'

const COUNTRIES = [
  {
    id: 'germany',
    name: 'Germany',
    flag: '🇩🇪',
    color: '#1a3a8c',
    formatName: 'Europass CV + Motivationsschreiben',
    type: 'Academic CV (not resume)',
    length: '2–3 pages',
    keyRequirements: [
      'Photo mandatory (professional, passport-style, top-right corner)',
      'Date of birth included (standard in Germany)',
      'Europass format preferred by most German universities',
      'Reverse chronological order',
      'Personal profile/summary NOT common — skip it',
      'Motivationsschreiben (motivation letter) is separate from SOP',
      'No references section needed',
      'Language skills with CEFR levels (A1–C2)',
    ],
    atsNotes: 'German unis use Uni-Assist — not ATS-scanned but manually reviewed. Clean formatting critical.',
    sectionsOrder: [
      'Personal Data', 'Education', 'Work Experience',
      'Skills', 'Languages', 'Certifications', 'Hobbies (optional)',
    ],
    keyMistake: 'Including a "Career Objective" section (not German style)',
  },
  {
    id: 'uk',
    name: 'UK',
    flag: '🇬🇧',
    color: '#1d4ed8',
    formatName: 'UK Academic CV',
    type: 'Academic CV (not American-style resume)',
    length: '2 pages standard',
    keyRequirements: [
      'NO photo (not expected, can be seen as unprofessional)',
      'Personal statement (4-6 lines) at the top — brief professional summary',
      'UK date format: DD/MM/YYYY',
      'Include nationality if relevant to scholarship eligibility',
      'Referees: 2 academic referees listed by name (not "available on request")',
      'Hobbies/Interests section is acceptable and common',
      'Degree classification: First, 2:1, 2:2 — include if strong',
    ],
    atsNotes: 'UCAS for undergrad uses its own system. Postgrad direct applications are human-reviewed. Clean 2-column layout acceptable.',
    sectionsOrder: [
      'Personal Info', 'Personal Statement', 'Education',
      'Work Experience', 'Skills', 'Publications', 'Referees',
    ],
    keyMistake: 'Using an American 1-page resume for UK applications',
  },
  {
    id: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    color: '#c2410c',
    formatName: 'Canadian Academic CV',
    type: 'Hybrid (resume style, academic content)',
    length: '1–2 pages (Masters) | 2-3 pages (PhD)',
    keyRequirements: [
      'NO photo, NO DOB (Canadian Human Rights Act)',
      'Include LinkedIn URL and GitHub if relevant',
      'GPA in both original scale and 4.0 equivalent',
      'Co-op/internship experience highly valued',
      'Volunteer work relevant to field should be included',
      'References: "Available upon request" at bottom',
      'IELTS/TOEFL score can be listed under qualifications',
    ],
    atsNotes: 'Canadian universities use various ATS. Keep formatting simple. Use .pdf format. Standard fonts only.',
    sectionsOrder: [
      'Contact', 'Education', 'Research/Work Experience',
      'Skills', 'Projects', 'Volunteer', 'Awards', 'References',
    ],
    keyMistake: 'Not including co-op/internship experience',
  },
  {
    id: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    color: '#059669',
    formatName: 'Australian CV',
    type: 'Chronological CV',
    length: '2–3 pages',
    keyRequirements: [
      'Photo optional (not required, not discouraged)',
      'Include career objective/summary (2-3 lines)',
      'Australian phone format if available, else Indian +91',
      'Work rights status relevant: mention "Student Visa — 48hrs/fortnight"',
      'Key Selection Criteria responses if applying for research roles',
      'OSHC and visa status awareness for part-time work context',
      'References: 2 references with contact details',
    ],
    atsNotes: 'Australian universities and employers widely use ATS. Use .pdf. Avoid headers/footers with important info. Standard section names only.',
    sectionsOrder: [
      'Contact', 'Career Objective', 'Education',
      'Work Experience', 'Skills', 'Projects', 'References',
    ],
    keyMistake: 'Not mentioning Australian work rights on student visa',
  },
]

export default function CVFormatPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('germany')
  const [showTemplate, setShowTemplate] = useState(false)
  const templateRef = useRef(null)

  const country = COUNTRIES.find(c => c.id === activeTab)

  const handleTabChange = (id) => {
    setActiveTab(id)
    setShowTemplate(false)
  }

  const handleToggleTemplate = () => {
    setShowTemplate(prev => {
      if (!prev) {
        setTimeout(() => {
          templateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
      return !prev
    })
  }

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh', background: '#F4F6FA', paddingTop: 68,
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      }}>
        {/* Back */}
        <div style={{ padding: '18px 5vw 0' }}>
          <button onClick={() => navigate(-1)} style={{
            background: 'none', border: 'none', color: '#1A56DB',
            fontWeight: 600, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, padding: 0,
          }}>← Back</button>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', padding: '40px 5vw 36px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: '#EBF2FF', borderRadius: 100, padding: '5px 14px', marginBottom: 16,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#1A56DB', display: 'inline-block' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#1A56DB' }}>ACADEMIC CV · 4 COUNTRIES</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 900,
            color: '#0F1C3F', letterSpacing: '-1.5px', margin: '0 0 12px', lineHeight: 1.1,
          }}>
            CV Formats by Country
          </h1>
          <p style={{ fontSize: 15, color: '#718096', maxWidth: 600, margin: '0 auto 0', lineHeight: 1.7 }}>
            Academic CVs for university admissions — Europass (DE), UK Academic, Canadian, Australian
          </p>

          {/* CV vs Resume callout */}
          <div style={{
            maxWidth: 640, margin: '24px auto 0',
            background: '#EFF6FF', border: '1px solid #BFDBFE',
            borderRadius: 14, padding: '16px 20px', textAlign: 'left',
          }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#1E40AF', marginBottom: 6 }}>
              CV vs Resume — What's the difference?
            </div>
            <p style={{ fontSize: 12.5, color: '#3B5998', lineHeight: 1.7, margin: 0 }}>
              <strong>CV (Curriculum Vitae):</strong> Comprehensive academic document, 2–3+ pages, used for university admissions in Germany, UK, Australia, Canada.
              <br />
              <strong>Resume:</strong> 1-page targeted document for job applications and some US/Canadian university programs. ATS-optimized.
              {' '}<a href="/tools/resume-formats" style={{ color: '#1A56DB', fontWeight: 700, textDecoration: 'underline' }}>→ View Resume Formats</a>
            </p>
          </div>
        </div>

        {/* Country Tabs */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 5vw' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
            {COUNTRIES.map(c => (
              <button
                key={c.id}
                onClick={() => handleTabChange(c.id)}
                style={{
                  background: activeTab === c.id ? c.color : '#fff',
                  color: activeTab === c.id ? '#fff' : '#4A5568',
                  border: `1.5px solid ${activeTab === c.id ? c.color : '#E8EDF5'}`,
                  borderRadius: 10, padding: '10px 20px',
                  fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  transition: 'all .2s, transform 0.2s',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
                onMouseEnter={e => { if (activeTab !== c.id) e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
              >
                <span className="hero-flag" style={{ fontSize: '1.1rem' }}>{c.flag}</span> {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Country Card */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 5vw 40px' }}>
          <div style={{
            background: '#fff', borderRadius: 20,
            border: `1.5px solid ${country.color}30`,
            overflow: 'hidden',
            boxShadow: `0 8px 32px ${country.color}12`,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}>
            {/* Card Header */}
            <div style={{
              background: `linear-gradient(135deg, ${country.color} 0%, ${country.color}cc 100%)`,
              padding: '28px 32px',
              color: 'white',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                <span className="hero-flag" style={{ fontSize: '2.4rem' }}>{country.flag}</span>
                <div>
                  <h2 style={{ fontSize: 24, fontWeight: 900, color: 'white', margin: 0, lineHeight: 1.2 }}>
                    {country.name}
                  </h2>
                  <span style={{ fontSize: 13, opacity: 0.85, fontWeight: 500 }}>{country.formatName}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {[
                  { label: 'Type', val: country.type },
                  { label: 'Length', val: country.length },
                ].map(s => (
                  <div key={s.label} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 14px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.7 }}>{s.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, marginTop: 2 }}>{s.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card Body */}
            <div style={{ padding: '28px 32px' }}>
              {/* Key Requirements */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 14 }}>
                  Key Requirements
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {country.keyRequirements.map((req, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ color: country.color, fontWeight: 700, fontSize: 14, marginTop: 1, flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: 14, color: '#4A5568', lineHeight: 1.6 }}>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ATS Notes */}
              <div style={{
                background: `${country.color}08`, border: `1px solid ${country.color}20`,
                borderRadius: 14, padding: '18px 20px', marginBottom: 28,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: country.color, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                  📋 ATS Notes
                </div>
                <p style={{ fontSize: 13, color: '#4A5568', lineHeight: 1.7, margin: 0 }}>{country.atsNotes}</p>
              </div>

              {/* Sections Order */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 14 }}>
                  Recommended Sections Order
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {country.sectionsOrder.map((sec, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{
                        fontSize: 12, fontWeight: 700, padding: '5px 12px',
                        background: `${country.color}10`, color: country.color,
                        borderRadius: 8, border: `1px solid ${country.color}20`,
                      }}>
                        {i + 1}. {sec}
                      </span>
                      {i < country.sectionsOrder.length - 1 && (
                        <span style={{ color: '#CBD5E0', fontSize: 14 }}>→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Mistake */}
              <div style={{
                background: '#FEF2F2', border: '1px solid #FECACA',
                borderRadius: 14, padding: '16px 20px', marginBottom: 24,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#B91C1C', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                  ⚠️ Key Mistake to Avoid
                </div>
                <p style={{ fontSize: 14, color: '#991B1B', lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
                  {country.keyMistake}
                </p>
              </div>

              {/* View Template Button */}
              <button
                onClick={handleToggleTemplate}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: showTemplate
                    ? '#f1f5f9'
                    : `linear-gradient(135deg, ${country.color} 0%, ${country.color}cc 100%)`,
                  color: showTemplate ? '#4A5568' : '#fff',
                  borderRadius: 12, padding: '13px 24px',
                  fontWeight: 700, fontSize: 14, border: 'none',
                  boxShadow: showTemplate ? 'none' : `0 4px 16px ${country.color}30`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
              >
                {showTemplate ? '✕ Hide Template' : '📄 View CV Template'}
              </button>

              {/* Template View — animated expand/collapse with maxHeight */}
              <div
                ref={templateRef}
                style={{
                  overflow: 'hidden',
                  maxHeight: showTemplate ? '9999px' : '0',
                  transition: 'max-height 0.4s ease',
                }}
              >
                <CVTemplateView countryId={activeTab} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #0F1C3F 0%, #1A2744 100%)',
          padding: '56px 5vw',
          textAlign: 'center',
        }}>
          <h2 style={{ color: 'white', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, marginBottom: 12, lineHeight: 1.2 }}>
            Want Stu to review your CV draft?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, maxWidth: 520, margin: '0 auto 28px', lineHeight: 1.7 }}>
            Paste your CV content in the AI Assistant — get instant feedback on gaps, formatting, and ATS compliance.
          </p>
          <button
            onClick={() => navigate('/chat')}
            className="btn-primary"
            style={{
              background: 'linear-gradient(135deg, #1a3a8c 0%, #2563eb 100%)',
              color: '#fff', border: 'none', borderRadius: 10,
              padding: '12px 24px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(26, 58, 140, 0.25)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(26,58,140,0.35)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(26,58,140,0.25)' }}
          >
            ✨ Ask Stu to Review My CV
          </button>
        </div>
      </div>
    </>
  )
}
