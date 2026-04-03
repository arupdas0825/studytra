import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

/* ── Resume template data per country ── */
const RESUME_TEMPLATES = {
  usa: {
    title: 'RESUME',
    font: '"Times New Roman", "Georgia", serif',
    sections: [
      {
        title: 'CONTACT',
        centered: true,
        contactBlock: '[FIRST NAME LAST NAME]\nyour.email@gmail.com | +1 (xxx) xxx-xxxx | LinkedIn | GitHub\nCity, State (or "Open to Relocate")',
      },
      {
        title: 'EDUCATION',
        entries: [
          { date: 'Expected: May 2027', title: 'Master of Science in Computer Science', org: 'University Name, City, State', detail: 'GPA: 3.9/4.0 (if above 3.5)\nRelevant Coursework: Machine Learning, Distributed Systems, Cloud Computing' },
          { date: 'May 2024', title: 'Bachelor of Technology in Computer Science', org: 'Your University, India', detail: 'CGPA: 8.7/10 | Equivalent: 3.8/4.0' },
        ],
      },
      {
        title: 'RESEARCH EXPERIENCE',
        entries: [
          { date: 'Jan 2024 – Present', title: 'Research Assistant — [Lab Name]', org: 'University Name, Department', bullets: ['Developed [specific system] using [tech stack] achieving [X% improvement]', 'Co-authored paper on [topic] submitted to [conference/journal]', 'Processed datasets of [X size] using Python/Spark pipeline'] },
        ],
      },
      {
        title: 'WORK EXPERIENCE',
        entries: [
          { date: 'May 2023 – Aug 2023', title: 'Software Engineer Intern — [Company]', bullets: ['Built [feature] reducing [metric] by X% for Y million users', 'Led migration of [component] from [old] to [new tech]', 'Collaborated with team of N engineers in Agile environment'] },
        ],
      },
      {
        title: 'PROJECTS',
        entries: [
          { title: '[Project Name] — github.com/yourprofile/project', bullets: ['One-line description of what it does and who it\'s for', 'Tech stack: Python, React, PostgreSQL, Docker, AWS'] },
        ],
      },
      {
        title: 'SKILLS',
        rows: [
          ['Languages', 'Python, Java, JavaScript, SQL, C++'],
          ['Frameworks', 'React, Node.js, Spring Boot, FastAPI, TensorFlow'],
          ['Tools', 'Git, Docker, Kubernetes, AWS, Linux, Jira'],
        ],
      },
      {
        title: 'HONORS & AWARDS',
        list: [
          '[Scholarship/Award Name], [Institution], [Year]',
          'Dean\'s List, [University], [Semesters]',
        ],
      },
    ],
  },
  canada: {
    title: 'RESUME',
    font: '"Calibri", "Segoe UI", sans-serif',
    sections: [
      {
        title: 'CONTACT INFORMATION',
        centered: true,
        contactBlock: '[FIRST NAME LAST NAME]\nyour.email@gmail.com | +1 (xxx) xxx-xxxx\nLinkedIn: linkedin.com/in/yourprofile | GitHub: github.com/yourhandle',
      },
      {
        title: 'EDUCATION',
        entries: [
          { date: '2020 – 2024', title: 'B.Tech — Computer Science & Engineering', org: 'Your University, India', detail: 'CGPA: 8.5/10 (Equivalent: 3.7/4.0)' },
        ],
      },
      {
        title: 'WORK EXPERIENCE',
        entries: [
          { date: 'Jun 2023 – Aug 2023', title: 'Software Developer Intern — [Company]', bullets: ['Developed full-stack features used by 5,000+ users', 'Implemented automated testing reducing bug reports by 35%'] },
        ],
      },
      {
        title: 'PROJECTS',
        entries: [
          { title: '[Project Name] — github.com/yourhandle/project', bullets: ['Brief description of impact and technology', 'Technologies: Python, React, Node.js, MongoDB'] },
        ],
      },
      {
        title: 'VOLUNTEER / COMMUNITY EXPERIENCE',
        entries: [
          { date: '2022 – 2024', title: 'Technical Mentor — Coding Club', org: 'Your University', bullets: ['Mentored 50+ junior students in data structures and algorithms', 'Organized 3 hackathons with 200+ participants'] },
        ],
      },
      {
        title: 'SKILLS',
        rows: [
          ['Programming', 'Python, Java, JavaScript, C++'],
          ['Tools & Platforms', 'AWS, Docker, Git, Linux, PostgreSQL'],
          ['IELTS Score', 'Overall 7.0 (L:7.5, R:7.0, W:6.5, S:7.0)'],
        ],
      },
      {
        title: 'ADDITIONAL',
        list: [
          'Valid Study Permit — eligible to work 24hrs/week during studies',
          'References: Available upon request',
        ],
      },
    ],
  },
  uk: {
    title: 'RESUME',
    font: '"Calibri", "Arial", sans-serif',
    sections: [
      {
        title: 'PERSONAL DETAILS',
        centered: true,
        contactBlock: '[FIRST NAME LAST NAME]\nyour.email@gmail.com | +44 XXXX XXXXXX\n[UK Address Line 1, City, Postcode]\nLinkedIn: linkedin.com/in/yourprofile',
      },
      {
        title: 'PERSONAL STATEMENT',
        paragraph: 'A motivated computer science graduate with strong analytical skills and research experience in machine learning. Seeking a [role/opportunity] to apply expertise in [specific area]. Demonstrated ability to deliver impactful projects through a final year thesis that improved model accuracy by 15%.',
      },
      {
        title: 'EDUCATION',
        entries: [
          { date: '2020 – 2024', title: 'Bachelor of Technology — Computer Science', org: 'Your University, City, India', detail: 'First Class with Distinction — CGPA 8.8/10' },
        ],
      },
      {
        title: 'WORK EXPERIENCE',
        entries: [
          { date: 'Jun 2023 – Sep 2023', title: 'Software Engineering Intern — [Company]', bullets: ['Developed microservices architecture serving 10K+ requests/day', 'Collaborated with product team to deliver 3 features ahead of schedule'] },
        ],
      },
      {
        title: 'SKILLS',
        rows: [
          ['Technical', 'Python, Java, JavaScript, React, AWS, Docker'],
          ['Soft Skills', 'Team leadership, Technical writing, Presentation'],
        ],
      },
      {
        title: 'INTERESTS',
        paragraph: 'Open-source development, competitive programming, technical blogging, and hiking.',
      },
      {
        title: 'REFEREES',
        list: [
          'Prof. [Name] — Department of CS, Your University — email@university.ac.in',
          'Dr. [Name] — [Role], Company Name — email@company.com',
        ],
      },
    ],
  },
  australia: {
    title: 'RESUME',
    font: '"Calibri", "Segoe UI", sans-serif',
    sections: [
      {
        title: 'CONTACT DETAILS',
        centered: true,
        contactBlock: '[FIRST NAME LAST NAME]\nyour.email@gmail.com | +61 XXX XXX XXX\nLinkedIn: linkedin.com/in/yourprofile',
      },
      {
        title: 'CAREER OBJECTIVE',
        paragraph: 'A results-driven computer science graduate seeking opportunities in software engineering. Aiming to leverage skills in full-stack development and cloud computing to contribute to innovative teams. Available for part-time work on Student Visa (Subclass 500) — 48 hours per fortnight.',
      },
      {
        title: 'EDUCATION',
        entries: [
          { date: '2020 – 2024', title: 'Bachelor of Technology — Computer Science', org: 'Your University, City, India', detail: 'CGPA: 8.5/10 | Relevant coursework: ML, Algorithms, DBMS, Cloud Computing' },
        ],
      },
      {
        title: 'WORK EXPERIENCE',
        entries: [
          { date: 'Jun 2023 – Aug 2023', title: 'Software Developer Intern — [Company]', bullets: ['Designed RESTful APIs handling 8K+ daily transactions', 'Improved database query performance by 45% through indexing'] },
        ],
      },
      {
        title: 'PROJECTS',
        entries: [
          { date: '2024', title: 'Smart Campus App', bullets: ['Full-stack application using React + Node.js serving 2,000+ students', 'Integrated real-time notifications using WebSocket'] },
        ],
      },
      {
        title: 'SKILLS',
        rows: [
          ['Languages', 'Python, Java, JavaScript, C++, SQL'],
          ['Frameworks', 'React, Node.js, Django, Spring Boot'],
          ['Tools', 'Git, Docker, AWS, Linux, PostgreSQL'],
        ],
      },
      {
        title: 'REFERENCES',
        list: [
          'Prof. [Name] — Dept. of CS, Your University — +91 XXXXX XXXXX — email@uni.edu',
          'Mr./Ms. [Name] — Manager, Company Name — +91 XXXXX XXXXX — email@company.com',
        ],
      },
    ],
  },
}

/* ── Country metadata for resume page ── */
const COUNTRIES = [
  {
    id: 'usa',
    name: 'USA',
    flag: '🇺🇸',
    color: '#b91c1c',
    formatName: 'ATS-Optimized Academic Resume',
    type: '1-page strict (Masters/MS)',
    length: '1 page',
    keyRequirements: [
      'NO photo (illegal to request in US hiring/admissions)',
      'NO date of birth, marital status, nationality',
      'No "Objective" section — use a 2-line Summary instead',
      'GPA must be included if above 3.5/4.0 or 8.5/10',
      'Research experience prioritized over work experience',
      'Publications, projects, and GitHub links are important',
      'Font: Times New Roman or Garamond, 10-12pt',
    ],
    atsNotes: 'Most US university portals (Common App, Slate) use ATS. Use standard section headings. No tables, no columns, no text boxes. Save as .pdf (never .docx for submission).',
    sectionsOrder: [
      'Contact Info', 'Education', 'Research Experience',
      'Work Experience', 'Projects', 'Skills', 'Awards',
    ],
    keyMistake: 'Submitting a 2-page resume for Masters programs',
  },
  {
    id: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    color: '#c2410c',
    formatName: 'Canadian Job/Academic Resume',
    type: 'Hybrid (resume style, academic content)',
    length: '1–2 pages',
    keyRequirements: [
      'NO photo, NO DOB (Canadian Human Rights Act)',
      'Include LinkedIn URL and GitHub if relevant',
      'GPA in both original scale and 4.0 equivalent',
      'Co-op/internship experience highly valued',
      'Volunteer work relevant to field should be included',
      'References: "Available upon request" at bottom',
      'Include work permit status for part-time eligibility',
    ],
    atsNotes: 'Canadian employers widely use ATS. Keep formatting simple. Use .pdf format. Standard fonts only.',
    sectionsOrder: [
      'Contact', 'Education', 'Work Experience',
      'Projects', 'Volunteer', 'Skills', 'References',
    ],
    keyMistake: 'Not including co-op/internship or volunteer experience',
  },
  {
    id: 'uk',
    name: 'UK',
    flag: '🇬🇧',
    color: '#1d4ed8',
    formatName: 'UK Job Resume / CV',
    type: 'Resume (1-page for jobs, 2 for academic)',
    length: '1–2 pages',
    keyRequirements: [
      'NO photo (not expected, can be seen as unprofessional)',
      'Personal statement (3 lines) at the top — brief professional summary',
      'UK date format: DD/MM/YYYY',
      'Interests section at bottom is acceptable and common',
      'Referees: 2 referees listed with contact details',
      'UK address format if available',
    ],
    atsNotes: 'UK employers use ATS. Use standard section headings. Clean single-column layout recommended.',
    sectionsOrder: [
      'Personal Details', 'Personal Statement', 'Education',
      'Work Experience', 'Skills', 'Interests', 'Referees',
    ],
    keyMistake: 'Not including a personal statement at the top',
  },
  {
    id: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    color: '#059669',
    formatName: 'Australian Job Resume',
    type: 'Targeted Resume',
    length: '1–2 pages',
    keyRequirements: [
      'Career objective (2-3 lines) at top',
      'Work rights: mention "Student Visa Subclass 500 — 48hrs/fortnight"',
      'Two references with contact details required',
      'Key Selection Criteria if applicable for research roles',
      'Australian phone format if available, else Indian +91',
      'Photo optional (not required, not discouraged)',
    ],
    atsNotes: 'Australian employers widely use ATS. Use .pdf. Avoid headers/footers with important info. Standard section names only.',
    sectionsOrder: [
      'Contact', 'Career Objective', 'Education',
      'Work Experience', 'Projects', 'Skills', 'References',
    ],
    keyMistake: 'Not mentioning Australian work rights on student visa',
  },
]

/* ── Render helpers (identical to CVTemplateView pattern) ── */
function renderSection(sec) {
  if (sec.contactBlock) {
    return (
      <div style={{ textAlign: sec.centered ? 'center' : 'left', whiteSpace: 'pre-line', fontSize: '0.85rem', lineHeight: 1.8, marginBottom: 16 }}>
        {sec.contactBlock}
      </div>
    )
  }
  if (sec.paragraph) {
    return <p style={{ fontSize: '0.85rem', lineHeight: 1.8, marginBottom: 16, color: '#333' }}>{sec.paragraph}</p>
  }
  if (sec.rows) {
    return (
      <table style={{ width: '100%', fontSize: 'inherit', marginBottom: 12, borderCollapse: 'collapse', wordBreak: 'break-word' }}>
        <tbody>
          {sec.rows.map(([label, val], i) => (
            <tr key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: 6 }}>
              <td style={{ fontWeight: 600, color: '#1a1a1a' }}>{label}</td>
              <td style={{ color: '#444' }}>{val}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
  if (sec.entries) {
    return sec.entries.map((entry, i) => (
      <div key={i} style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1a1a1a' }}>{entry.title}</div>
            {entry.org && <div style={{ fontSize: '0.82rem', color: '#555', fontStyle: 'italic' }}>{entry.org}</div>}
          </div>
          {entry.date && <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: 500, whiteSpace: 'nowrap' }}>{entry.date}</div>}
        </div>
        {entry.detail && <div style={{ fontSize: '0.82rem', color: '#555', marginTop: 2, whiteSpace: 'pre-line' }}>{entry.detail}</div>}
        {entry.bullets && (
          <ul style={{ margin: '6px 0 0 18px', padding: 0 }}>
            {entry.bullets.map((b, j) => (
              <li key={j} style={{ fontSize: '0.82rem', color: '#444', lineHeight: 1.6, marginBottom: 2 }}>{b}</li>
            ))}
          </ul>
        )}
      </div>
    ))
  }
  if (sec.list) {
    return (
      <ul style={{ margin: '0 0 12px 18px', padding: 0 }}>
        {sec.list.map((item, i) => (
          <li key={i} style={{ fontSize: '0.82rem', color: '#444', lineHeight: 1.7, marginBottom: 3 }}>{item}</li>
        ))}
      </ul>
    )
  }
  return null
}

function ResumeTemplateView({ countryId }) {
  const [copied, setCopied] = useState(false)
  const tpl = RESUME_TEMPLATES[countryId]
  if (!tpl) return null

  const getPlainText = () => {
    let text = tpl.title + '\n\n'
    tpl.sections.forEach(sec => {
      text += sec.title.toUpperCase() + '\n'
      if (sec.contactBlock) text += sec.contactBlock + '\n'
      if (sec.paragraph) text += sec.paragraph + '\n'
      if (sec.rows) sec.rows.forEach(([k, v]) => { text += `${k}: ${v}\n` })
      if (sec.entries) sec.entries.forEach(e => {
        text += `${e.date ? e.date + '  ' : ''}${e.title}\n`
        if (e.org) text += `${e.org}\n`
        if (e.detail) text += `${e.detail}\n`
        if (e.bullets) e.bullets.forEach(b => { text += `• ${b}\n` })
      })
      if (sec.list) sec.list.forEach(l => { text += `• ${l}\n` })
      text += '\n'
    })
    return text.trim()
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(getPlainText()).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handlePrint = () => window.print()

  return (
    <div style={{
      background: 'white',
      border: '1px solid #f1f5f9',
      borderRadius: 4,
      padding: 'clamp(20px, 5vw, 44px)',
      fontFamily: tpl.font,
      fontSize: 13,
      color: '#1a1a1a',
      maxWidth: 750,
      margin: '20px auto',
      boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
      lineHeight: 1.5,
      position: 'relative',
      overflowX: 'auto',
      wordBreak: 'break-word',
    }}>
      {/* Toolbar */}
      <div style={{ position: 'absolute', top: 12, right: 14, display: 'flex', gap: 8 }}>
        <button onClick={handleCopy} style={{
          background: copied ? '#059669' : '#f1f5f9',
          color: copied ? 'white' : '#4a5568',
          border: '1px solid #e2e8f0',
          borderRadius: 8, padding: '6px 14px',
          fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
          transition: 'all 0.2s',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          {copied ? '✓ Copied!' : '📋 Copy'}
        </button>
        <button onClick={handlePrint} style={{
          background: '#f1f5f9', color: '#4a5568',
          border: '1px solid #e2e8f0',
          borderRadius: 8, padding: '6px 14px',
          fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
          transition: 'all 0.2s',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          🖨️ Print
        </button>
      </div>

      {/* Title */}
      <h3 style={{
        textAlign: 'center', fontSize: '1.25rem', fontWeight: 700,
        letterSpacing: '0.05em', marginBottom: 16, paddingBottom: 12,
        fontFamily: tpl.font, color: '#1a1a1a',
      }}>
        {tpl.title}
      </h3>

      {/* Sections */}
      {tpl.sections.map((sec, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <div style={{
            fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em',
            borderBottom: '1px solid #1a1a1a', paddingBottom: 4, marginBottom: 8,
            color: '#1a1a1a', textTransform: 'uppercase',
          }}>
            {sec.title}
          </div>
          {renderSection(sec)}
        </div>
      ))}
    </div>
  )
}

/* ── Main Page Component ── */
export default function ResumeFormatPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('usa')
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
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#b91c1c', display: 'inline-block' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#b91c1c' }}>ATS-OPTIMIZED · 4 COUNTRIES</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 900,
            color: '#0F1C3F', letterSpacing: '-1.5px', margin: '0 0 12px', lineHeight: 1.1,
          }}>
            Resume Formats by Country
          </h1>
          <p style={{ fontSize: 15, color: '#718096', maxWidth: 600, margin: '0 auto 0', lineHeight: 1.7 }}>
            ATS-optimized resumes for university applications & post-study job search
          </p>

          {/* CV vs Resume callout */}
          <div style={{
            maxWidth: 640, margin: '24px auto 0',
            background: '#FDF2F8', border: '1px solid #FBCFE8',
            borderRadius: 14, padding: '16px 20px', textAlign: 'left',
          }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#9D174D', marginBottom: 6 }}>
              CV vs Resume — What's the difference?
            </div>
            <p style={{ fontSize: 12.5, color: '#831843', lineHeight: 1.7, margin: 0 }}>
              <strong>Resume:</strong> 1-page targeted document for job applications and some US/Canadian university programs. ATS-optimized.
              <br />
              <strong>CV (Curriculum Vitae):</strong> Comprehensive academic document, 2–3+ pages, used for university admissions in Germany, UK, Australia, Canada.
              {' '}<a href="/tools/cv-formats" style={{ color: '#1A56DB', fontWeight: 700, textDecoration: 'underline' }}>→ View CV Formats</a>
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
                {showTemplate ? '✕ Hide Template' : '📋 View Resume Template'}
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
                <ResumeTemplateView countryId={activeTab} />
              </div>
            </div>
          </div>

          {/* Germany note */}
          <div style={{
            marginTop: 24, background: '#EFF6FF', border: '1px solid #BFDBFE',
            borderRadius: 14, padding: '18px 22px',
            display: 'flex', gap: 14, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>ℹ️</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1E40AF', marginBottom: 4 }}>
                Note about Germany
              </div>
              <p style={{ fontSize: 13, color: '#3B5998', lineHeight: 1.6, margin: 0 }}>
                German jobs use a <strong>Lebenslauf</strong> (German-style CV), not an American resume format.
                For German university admissions, use the Europass CV.
                {' '}<a href="/tools/cv-formats" style={{ color: '#1A56DB', fontWeight: 700, textDecoration: 'underline' }}>→ View CV Formats (includes Germany)</a>
              </p>
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
            Want Stu to review your Resume?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, maxWidth: 520, margin: '0 auto 28px', lineHeight: 1.7 }}>
            Paste your resume content in the AI Assistant — get instant feedback on gaps, formatting, and ATS compliance.
          </p>
          <button
            onClick={() => navigate('/chat')}
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
            ✨ Ask Stu to Review My Resume
          </button>
        </div>
      </div>
    </>
  )
}
