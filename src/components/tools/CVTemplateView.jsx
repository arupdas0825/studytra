import { useState } from 'react'

// Template data per country
const TEMPLATES = {
  germany: {
    title: 'CURRICULUM VITAE',
    hasPhoto: true,
    font: '"Times New Roman", "Georgia", serif',
    sections: [
      {
        title: 'PERSÖNLICHE DATEN (Personal Data)',
        rows: [
          ['Full Name', '[Your Full Name]'],
          ['Date of Birth', 'DD.MM.YYYY'],
          ['Nationality', 'Indian'],
          ['Address', '[Your Address, City, PIN Code]'],
          ['Email', 'your.email@gmail.com'],
          ['Phone', '+91 XXXXX XXXXX'],
          ['LinkedIn', 'linkedin.com/in/yourprofile'],
        ],
      },
      {
        title: 'EDUCATION',
        entries: [
          { date: 'MM/YYYY – MM/YYYY', title: 'Bachelor of Technology — Computer Science', org: 'Your University, India', detail: 'CGPA: 8.5/10' },
          { date: 'MM/YYYY', title: 'Higher Secondary (12th)', org: 'Your School, City', detail: 'Percentage: 92%' },
        ],
      },
      {
        title: 'WORK EXPERIENCE',
        entries: [
          { date: 'MM/YYYY – MM/YYYY', title: 'Software Engineer Intern', org: 'Company Name, City', bullets: ['Developed and deployed microservices reducing response time by 40%', 'Collaborated with cross-functional team of 8 engineers'] },
        ],
      },
      {
        title: 'SKILLS',
        rows: [
          ['Programming', 'Python, Java, C++, JavaScript'],
          ['Frameworks', 'React, Node.js, Django, Spring Boot'],
          ['Tools', 'Git, Docker, Linux, AWS, Jenkins'],
        ],
      },
      {
        title: 'LANGUAGES',
        rows: [
          ['English', 'C1 (IELTS 7.0)'],
          ['German', 'A2 (currently learning at Goethe-Institut)'],
          ['Hindi', 'Native'],
        ],
      },
      {
        title: 'CERTIFICATIONS',
        list: ['AWS Cloud Practitioner (2024)', 'Google Data Analytics Certificate (2023)'],
      },
    ],
  },
  usa: {
    title: 'ACADEMIC RESUME',
    hasPhoto: false,
    font: '"Times New Roman", "Georgia", serif',
    sections: [
      {
        title: 'CONTACT',
        centered: true,
        contactBlock: '[Your Full Name]\nyour.email@gmail.com | +91 XXXXX XXXXX | linkedin.com/in/yourprofile | github.com/yourhandle',
      },
      {
        title: 'EDUCATION',
        entries: [
          { date: 'Aug 2020 – May 2024', title: 'Bachelor of Technology — Computer Science & Engineering', org: 'Your University, City, India', detail: 'GPA: 3.7/4.0 (8.8/10) | Dean\'s List: 4 semesters' },
        ],
      },
      {
        title: 'RESEARCH EXPERIENCE',
        entries: [
          { date: 'Jan 2024 – May 2024', title: 'Undergraduate Thesis — Machine Learning Lab', org: 'Department of CS, Your University', bullets: ['Designed a novel attention mechanism for NLP tasks, improving BLEU score by 12%', 'Published findings at [Conference Name] 2024'] },
        ],
      },
      {
        title: 'WORK EXPERIENCE',
        entries: [
          { date: 'Jun 2023 – Aug 2023', title: 'Software Engineering Intern', org: 'Company Name, City', bullets: ['Built REST APIs serving 10K+ daily requests with <100ms latency', 'Reduced deployment time by 60% through CI/CD pipeline optimization'] },
        ],
      },
      {
        title: 'PROJECTS',
        entries: [
          { date: '2023', title: 'Project Name — github.com/you/project', bullets: ['Brief description of what the project does and impact', 'Technologies: Python, TensorFlow, Flask'] },
        ],
      },
      {
        title: 'SKILLS',
        rows: [
          ['Languages', 'Python, Java, C++, JavaScript, SQL'],
          ['Frameworks', 'React, Node.js, TensorFlow, PyTorch'],
          ['Tools', 'AWS, Docker, Git, Linux, PostgreSQL'],
        ],
      },
    ],
  },
  canada: {
    title: 'ACADEMIC CV',
    hasPhoto: false,
    font: '"Calibri", "Segoe UI", sans-serif',
    sections: [
      {
        title: 'CONTACT INFORMATION',
        centered: true,
        contactBlock: '[Your Full Name]\nyour.email@gmail.com | +91 XXXXX XXXXX\nLinkedIn: linkedin.com/in/yourprofile | GitHub: github.com/yourhandle',
      },
      {
        title: 'EDUCATION',
        entries: [
          { date: '2020 – 2024', title: 'B.Tech — Computer Science & Engineering', org: 'Your University, India', detail: 'CGPA: 8.5/10 (Equivalent: 3.7/4.0)' },
        ],
      },
      {
        title: 'RESEARCH / WORK EXPERIENCE',
        entries: [
          { date: 'Jun 2023 – Aug 2023', title: 'Software Developer Intern', org: 'Company Name, City', bullets: ['Developed full-stack features used by 5,000+ users', 'Implemented automated testing reducing bug reports by 35%'] },
        ],
      },
      {
        title: 'VOLUNTEER EXPERIENCE',
        entries: [
          { date: '2022 – 2024', title: 'Technical Mentor', org: 'Coding Club, Your University', bullets: ['Mentored 50+ junior students in data structures and algorithms', 'Organized 3 hackathons with 200+ participants'] },
        ],
      },
      {
        title: 'SKILLS & QUALIFICATIONS',
        rows: [
          ['Programming', 'Python, Java, JavaScript, C++'],
          ['IELTS Score', 'Overall 7.0 (L:7.5, R:7.0, W:6.5, S:7.0)'],
        ],
      },
      {
        title: 'REFERENCES',
        list: ['Available upon request'],
      },
    ],
  },
  uk: {
    title: 'CURRICULUM VITAE',
    hasPhoto: false,
    font: '"Calibri", "Arial", sans-serif',
    sections: [
      {
        title: 'PERSONAL INFORMATION',
        centered: true,
        contactBlock: '[Your Full Name]\nyour.email@gmail.com | +91 XXXXX XXXXX\nNationality: Indian | LinkedIn: linkedin.com/in/yourprofile',
      },
      {
        title: 'PERSONAL STATEMENT',
        paragraph: 'A motivated computer science graduate with strong analytical skills and research experience in machine learning. Seeking to pursue an MSc at [University] to deepen expertise in [specific area] and contribute to [specific research group]. Demonstrated ability to deliver impactful projects through a final year thesis that improved model accuracy by 15%.',
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
          { date: 'Jun 2023 – Sep 2023', title: 'Software Engineering Intern', org: 'Company Name, City', bullets: ['Developed microservices architecture serving 10K+ requests/day', 'Collaborated with product team to deliver 3 features ahead of schedule'] },
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
        title: 'REFEREES',
        list: [
          'Prof. [Name] — Department of CS, Your University — email@university.ac.in',
          'Dr. [Name] — [Role], Company Name — email@company.com',
        ],
      },
    ],
  },
  australia: {
    title: 'CURRICULUM VITAE',
    hasPhoto: false,
    font: '"Calibri", "Segoe UI", sans-serif',
    sections: [
      {
        title: 'CONTACT DETAILS',
        centered: true,
        contactBlock: '[Your Full Name]\nyour.email@gmail.com | +91 XXXXX XXXXX\nLinkedIn: linkedin.com/in/yourprofile',
      },
      {
        title: 'CAREER OBJECTIVE',
        paragraph: 'A results-driven computer science graduate seeking admission to the Master of Information Technology program at [University]. Aiming to specialize in [area] and leverage Australia\'s strong tech industry to build a career in [specific domain]. Available for part-time work on Student Visa (Subclass 500) — 48 hours per fortnight.',
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
          { date: 'Jun 2023 – Aug 2023', title: 'Software Developer Intern', org: 'Company Name, City', bullets: ['Designed RESTful APIs handling 8K+ daily transactions', 'Improved database query performance by 45% through indexing'] },
        ],
      },
      {
        title: 'PROJECTS',
        entries: [
          { date: '2024', title: 'Smart Campus App', bullets: ['Full-stack application using React + Node.js serving 2,000+ students', 'Integrated real-time notifications using WebSocket'] },
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

function renderSection(sec, font) {
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
          <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: 500, whiteSpace: 'nowrap' }}>{entry.date}</div>
        </div>
        {entry.detail && <div style={{ fontSize: '0.82rem', color: '#555', marginTop: 2 }}>{entry.detail}</div>}
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

export default function CVTemplateView({ countryId }) {
  const [copied, setCopied] = useState(false)
  const tpl = TEMPLATES[countryId]
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

  const isResume = tpl.title.includes('RESUME')

  return (
    <div style={{
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: 16,
      padding: 'clamp(24px, 5vw, 48px) clamp(20px, 5vw, 48px)',
      fontFamily: tpl.font,
      fontSize: '13.5px',
      color: '#1a1a2e',
      maxWidth: 720,
      margin: '24px auto 0',
      boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
      lineHeight: 1.8,
      position: 'relative',
      overflowX: 'auto',
      wordBreak: 'break-word',
    }}>
      {/* Toolbar */}
      <div style={{
        position: 'absolute', top: 12, right: 14,
        display: 'flex', gap: 8,
      }}>
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
        textAlign: 'center', fontSize: isResume ? '1.25rem' : '1.1rem', fontWeight: 700,
        letterSpacing: isResume ? '0.05em' : '0.15em', marginBottom: isResume ? 16 : 24, paddingBottom: 12,
        borderBottom: isResume ? 'none' : '2px solid #1a1a1a', fontFamily: tpl.font,
        color: '#1a1a1a',
      }}>
        {tpl.title}
      </h3>

      {/* Photo placeholder for Germany */}
      {tpl.hasPhoto && (
        <div style={{
          float: 'right', width: 90, height: 110,
          border: '1px solid #d1d5db', borderRadius: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.65rem', color: '#9ca3af', textAlign: 'center',
          background: '#f9fafb', marginLeft: 16, marginBottom: 8,
        }}>
          Photo<br/>(Passport<br/>Style)
        </div>
      )}

      {/* Sections */}
      {tpl.sections.map((sec, i) => (
        <div key={i} style={{ marginBottom: isResume ? 12 : 20 }}>
          <div style={{
            fontSize: isResume ? '0.85rem' : '0.8rem', fontWeight: 700, letterSpacing: isResume ? '0.05em' : '0.1em',
            borderBottom: isResume ? '1px solid #1a1a1a' : '1px solid #d1d5db', paddingBottom: 4, marginBottom: isResume ? 8 : 10,
            color: '#1a1a1a', textTransform: 'uppercase',
          }}>
            {sec.title}
          </div>
          {renderSection(sec, tpl.font)}
        </div>
      ))}

      {/* Clear float */}
      <div style={{ clear: 'both' }} />
    </div>
  )
}
