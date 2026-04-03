import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const COUNTRIES = [
  {
    id: 'germany',
    name: 'Germany',
    flag: '🇩🇪',
    color: '#1a3a8c',
    localName: 'Motivationsschreiben (Motivation Letter)',
    wordLimit: '500–800 words (1 page A4 strictly)',
    tone: 'Formal, structured, academic',
    whatTheyWant: [
      'Why THIS specific university and THIS specific program',
      'Your academic background relevant to the course',
      'Research interests if applying to research-oriented programs',
      'Career goal (specific, not vague — "I want to work in automotive embedded systems at Bosch" not "I want a good career")',
      'Why Germany specifically (cost, research quality, industry links)',
    ],
    doNotInclude: [
      'Personal hardship stories (not German academic culture)',
      'Generic phrases like "since childhood I was passionate about..."',
      'Anything not directly relevant to academics/career',
    ],
    structure: [
      { para: 'Para 1', content: 'Why this program at this university (specific)' },
      { para: 'Para 2', content: 'Your academic background and relevant projects/thesis' },
      { para: 'Para 3', content: 'Career goal and how this degree bridges you there' },
      { para: 'Para 4', content: 'Why Germany, why now' },
    ],
    commonMistakes: [
      'Submitting same SOP to all German unis — must be customized per uni',
      'Too long (Germans value conciseness)',
      'No mention of specific professors or research groups',
    ],
    starterTemplate: `[Your Full Name]
[Date]

Admissions Committee
[Program Name]
[University Name], Germany

Dear Admissions Committee,

PARAGRAPH 1 — Program & University Fit (Write 4–5 sentences):
Why you chose this specific program at this university.
Mention a specific research group, professor, or curriculum aspect.
Example: "The [specific course/lab] at [University] directly aligns with my research on [your topic]..."

PARAGRAPH 2 — Academic Background (Write 4–5 sentences):
Your degree, CGPA, relevant subjects, final year thesis/project.
Quantify your work: "developed a [system] that improved [metric] by X%"

PARAGRAPH 3 — Career Goal (Write 3–4 sentences):
Specific career goal, not vague.
How THIS degree is the bridge to get there.

PARAGRAPH 4 — Why Germany (Write 2–3 sentences):
Research quality, tuition structure, industry-academia links.
Any Germany-specific advantage for your field.

Yours sincerely,
[Your Full Name]`,
  },
  {
    id: 'usa',
    name: 'USA',
    flag: '🇺🇸',
    color: '#b91c1c',
    localName: 'Statement of Purpose (SOP)',
    wordLimit: '500–1000 words (check each university — varies)',
    tone: 'Personal, narrative, confident',
    whatTheyWant: [
      'Your intellectual journey — how you got here',
      'Specific research experience with quantifiable outcomes',
      'Why this program at this specific university (mention professors by name — critical for US admissions)',
      'Long-term career vision (academia or industry)',
      'What you bring to THEIR program (contribution mindset)',
    ],
    doNotInclude: [
      'Clichés: "from a young age", "always been passionate"',
      'Laundry list of achievements (that\'s what transcripts are for)',
      'Grammatical errors (US admissions are very detail-oriented)',
    ],
    structure: [
      { para: 'Hook (1 para)', content: 'Specific moment/project that defines your interest' },
      { para: 'Body (3-4 paras)', content: 'Research journey, key experiences, skills built' },
      { para: 'Program Fit (1 para)', content: 'Why THIS school, name specific professors' },
      { para: 'Vision (1 para)', content: 'Where you\'ll be in 10 years' },
    ],
    commonMistakes: [
      'Generic SOP sent to all universities',
      'Not mentioning specific faculty by name',
      'Weak opening line (first line determines if they keep reading)',
    ],
    starterTemplate: `[HOOK — Start with a specific moment, NOT "since childhood"]
The moment I realized [specific insight from a project/research] was when...

[BODY — Research Journey (3-4 paragraphs)]
During my undergraduate studies at [University], I pursued [relevant coursework/projects].
My thesis on [topic] under Prof. [Name] resulted in [quantifiable outcome — e.g., "improved accuracy by 12%"].
As an intern at [Company], I [specific contribution with impact metrics].

[PROGRAM FIT — Why THIS university]
I am drawn to [University Name]'s [Program] specifically because of Prof. [Faculty Name]'s work on [research area].
The [specific lab/center/course] aligns directly with my goal to [research direction].
I would contribute to [lab/group] by bringing my experience in [your strength].

[VISION — 10-year career goal]
After completing my [degree], I plan to [specific career path — academia/industry/startup].
This program at [University] is the critical bridge between my current skills and my goal of [specific outcome].

[Your Full Name]`,
  },
  {
    id: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    color: '#c2410c',
    localName: 'Statement of Purpose / Letter of Intent',
    wordLimit: '500–1000 words (varies by university)',
    tone: 'Professional, research-focused',
    whatTheyWant: [
      'Clear research interest aligned with department\'s work',
      'Potential supervisor identified (email them BEFORE applying)',
      'Canadian context: multicultural contribution, diversity angle',
      'Funding awareness: NSERC, Vanier — mention if applying for funded positions',
      'Post-graduation intent (PR pathway is known — be honest but frame it as building career in Canada)',
    ],
    doNotInclude: [
      'Mentioning immigration intent too explicitly',
      'Vague career goals',
    ],
    structure: [
      { para: 'Introduction', content: 'Research interest in one crisp paragraph' },
      { para: 'Academic Background', content: 'Relevant coursework, thesis, GPA context' },
      { para: 'Research Experience', content: 'Specific projects, publications if any' },
      { para: 'Program Fit', content: 'Why this university, potential supervisor' },
      { para: 'Career Goals', content: 'Academic or industry, Canada context' },
    ],
    commonMistakes: [
      'Not contacting potential supervisors before applying',
      'Ignoring the research fit angle',
    ],
    starterTemplate: `[INTRODUCTION — Research Interest]
My research interest lies in [specific area]. Through my undergraduate work on [project/thesis], I developed a strong foundation in [skills/methodology].

[ACADEMIC BACKGROUND]
I completed my B.Tech in [field] from [University] with a CGPA of [X]/10 (equivalent to [Y]/4.0).
Key coursework: [Course 1], [Course 2], [Course 3].
My final year thesis on [topic] resulted in [outcome].

[RESEARCH EXPERIENCE]
At [Lab/Company], I worked on [project] under [Supervisor Name], contributing to [specific outcome].
This experience strengthened my skills in [methodology/tools].

[PROGRAM FIT — Why this university + supervisor]
I have been following Prof. [Name]'s research on [topic] at [University].
I reached out to Prof. [Name] on [date] and discussed [brief summary].
The [program name] at [University] offers [specific advantages — courses, labs, funding].

[CAREER GOALS]
After completing my [degree], I aim to [career path] in Canada's growing [industry] sector.

[Your Full Name]`,
  },
  {
    id: 'uk',
    name: 'UK',
    flag: '🇬🇧',
    color: '#1d4ed8',
    localName: 'Personal Statement',
    wordLimit: '4000 characters (UCAS undergrad) | 500-1000 words (postgrad)',
    tone: 'Academic, reflective, enthusiastic',
    whatTheyWant: [
      'Why this specific subject (intellectual curiosity)',
      'Academic achievements directly related to the course',
      'Relevant work experience or research',
      'Extracurricular (leadership, societies — UK values this)',
      'Why UK education system suits your goals',
    ],
    doNotInclude: [
      'Mentioning a specific university name in UCAS statement (same statement goes to all 5 choices)',
      'Going over 4000 characters',
      'Too much focus on extracurricular for postgrad',
    ],
    ucasRules: [
      '4000 characters including spaces (NOT words)',
      'No mention of specific universities in UCAS statement',
      'Postgrad: can mention specific university/department',
    ],
    structure: [
      { para: 'Why this program', content: 'Academic reasons' },
      { para: 'Academic background', content: 'Your achievements' },
      { para: 'Research/Work', content: 'Relevant experience' },
      { para: 'Career aspirations', content: 'Where you\'re headed' },
      { para: 'Why this university', content: 'Postgrad only' },
    ],
    commonMistakes: [
      'Mentioning a specific university name in UCAS statement',
      'Going over 4000 characters',
      'Too much focus on extracurricular for postgrad',
    ],
    starterTemplate: `[WHY THIS SUBJECT — Academic Curiosity]
My fascination with [subject] began when [specific moment/discovery, NOT "since childhood"].
Through my studies in [relevant area], I became particularly interested in [niche].

[ACADEMIC ACHIEVEMENTS]
During my [degree] at [University], I achieved [GPA/classification].
My coursework in [subjects] provided strong foundations in [skills].
My dissertation on [topic] explored [brief description] and achieved [outcome].

[RELEVANT EXPERIENCE]
My internship at [Company/Lab] gave me practical exposure to [skills].
I contributed to [specific project] which [quantifiable impact].

[EXTRACURRICULAR — Leadership & Societies]
As [role] of [society/club], I [achievement — e.g., organized events, led a team of X].
These experiences developed my [transferable skills].

[CAREER ASPIRATIONS]
I aspire to [specific career path] in [field].
A postgraduate degree in [subject] will equip me with [specific skills] to achieve this goal.

[FOR POSTGRAD ONLY — Why this university]
I am particularly drawn to [University]'s [department/research group] and the opportunity to study under [faculty name].

[Your Full Name]`,
  },
  {
    id: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    color: '#059669',
    localName: 'Statement of Purpose / Research Proposal (PhD)',
    wordLimit: '500–800 words (Masters) | 1500-2000 words (PhD)',
    tone: 'Professional, outcome-oriented',
    whatTheyWant: [
      'Clear academic and professional background',
      'Specific reason for choosing Australia (research strengths, industry)',
      'Genuine student intent — critical for GS (Genuine Student) test',
      'For PhD: detailed research proposal with methodology',
      'Career plans post-graduation in Australia context',
    ],
    doNotInclude: [
      'Writing anything that suggests the degree is secondary to migration',
      'Weak connection between degree and career goal',
    ],
    gsTestNote: 'The SOP doubles as evidence for the Genuine Student requirement. Must clearly show: academic purpose, career value of the degree, and why you\'ll return home or build career in Australia.',
    structure: [
      { para: 'Academic background', content: '2 paragraphs' },
      { para: 'Why this program', content: 'And this university' },
      { para: 'Career outcome', content: 'Specific goals' },
      { para: 'Why Australia', content: 'For this degree' },
      { para: 'Post-graduation', content: 'Plans' },
    ],
    commonMistakes: [
      'Weak connection between degree and career goal',
      'Not addressing why Australia specifically',
      'For PhD: submitting without contacting supervisor first',
    ],
    starterTemplate: `[ACADEMIC BACKGROUND]
I completed my [degree] in [field] from [University], India, graduating with a CGPA of [X]/10.
My academic journey focused on [relevant area], with key projects including [Project 1] and [Project 2].

[PROFESSIONAL EXPERIENCE]
I gained [X months/years] of professional experience at [Company] as a [role].
Key contributions: [specific achievement with metrics].

[WHY THIS PROGRAM AT THIS UNIVERSITY]
The [Program Name] at [University] stands out for its [specific strengths — curriculum, research labs, industry partnerships].
Australia's [specific advantage for your field — e.g., "leading AI research ecosystem"] makes it the ideal destination.

[CAREER GOALS — Be specific, show degree-career connection]
Upon completing my [degree], I plan to [specific career path].
This program directly enables this goal by providing [specific skills/knowledge].

[WHY AUSTRALIA — Address GS Test requirements]
I have chosen to study in Australia because of [academic quality, research infrastructure, industry connections].
The [specific Australian advantage] aligns with my professional development goals.

[POST-GRADUATION PLANS]
After my studies, I intend to [career plan — be honest about whether staying in AU or returning].

[Your Full Name]`,
  },
]

const UNIVERSAL_TIPS = [
  'Write a new SOP for every application — never reuse',
  'First sentence must not start with "I" or a cliché',
  'Show don\'t tell — use specific projects, numbers, outcomes',
  'Get it reviewed by someone who has been admitted to that country',
  'Check word/character limits on each university\'s official page',
  'Proofread 3 times minimum — one typo can cost an admit',
]

export default function SOPGuidePage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('germany')
  const [showStarter, setShowStarter] = useState(false)
  const [copied, setCopied] = useState(false)
  const templateRef = useRef(null)

  const country = COUNTRIES.find(c => c.id === activeTab)

  const handleTabChange = (id) => {
    setActiveTab(id)
    setShowStarter(false)
    setCopied(false)
  }

  const handleCopyStarter = () => {
    navigator.clipboard.writeText(country.starterTemplate).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleToggleStarter = () => {
    setShowStarter(prev => {
      if (!prev) {
        setTimeout(() => {
          templateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
      setCopied(false)
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
            background: '#D1FAF8', borderRadius: 100, padding: '5px 14px', marginBottom: 16,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#0EA5A0', display: 'inline-block' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#0EA5A0' }}>VERIFIED FORMATS · 5 COUNTRIES</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 900,
            color: '#0F1C3F', letterSpacing: '-1.5px', margin: '0 0 12px', lineHeight: 1.1,
          }}>
            Statement of Purpose Guide
          </h1>
          <p style={{ fontSize: 15, color: '#718096', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
            Country-specific SOP formats, word limits, structure, and what admission committees actually want to read.
          </p>
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

        {/* Main Content */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 5vw 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }} className="sop-grid">
            {/* LEFT — Country Card */}
            <div style={{
              background: '#fff', borderRadius: 20,
              border: `1.5px solid ${country.color}30`,
              overflow: 'hidden',
              boxShadow: `0 8px 32px ${country.color}12`,
              minWidth: 0,
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
                    <span style={{ fontSize: 13, opacity: 0.85, fontWeight: 500 }}>{country.localName}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {[
                    { label: 'Word Limit', val: country.wordLimit },
                    { label: 'Tone', val: country.tone },
                  ].map(s => (
                    <div key={s.label} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 14px' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.7 }}>{s.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{s.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '28px 32px' }}>
                {/* What They Want */}
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 14 }}>
                    ✅ What They Want to Read
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {country.whatTheyWant.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ color: country.color, fontWeight: 700, fontSize: 14, marginTop: 1, flexShrink: 0 }}>▲</span>
                        <span style={{ fontSize: 14, color: '#4A5568', lineHeight: 1.6 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Do NOT Include */}
                <div style={{
                  background: '#FEF2F2', border: '1px solid #FECACA',
                  borderRadius: 14, padding: '18px 20px', marginBottom: 28,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#B91C1C', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
                    ❌ Do NOT Include
                  </div>
                  {country.doNotInclude.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
                      <span style={{ color: '#E53E3E', fontSize: 12, marginTop: 2 }}>▼</span>
                      <span style={{ fontSize: 13, color: '#991B1B', lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>

                {/* UCAS-specific rules for UK */}
                {country.ucasRules && (
                  <div style={{
                    background: `${country.color}08`, border: `1px solid ${country.color}20`,
                    borderRadius: 14, padding: '18px 20px', marginBottom: 28,
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: country.color, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
                      🎓 UCAS-Specific Rules
                    </div>
                    {country.ucasRules.map((rule, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
                        <span style={{ color: country.color, fontSize: 13, marginTop: 1 }}>•</span>
                        <span style={{ fontSize: 13, color: '#4A5568', lineHeight: 1.5 }}>{rule}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* GS Test Note for Australia */}
                {country.gsTestNote && (
                  <div style={{
                    background: '#ECFDF5', border: '1px solid #A7F3D0',
                    borderRadius: 14, padding: '18px 20px', marginBottom: 28,
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                      🛂 GS Test Alignment (Important)
                    </div>
                    <p style={{ fontSize: 13, color: '#065F46', lineHeight: 1.7, margin: 0 }}>{country.gsTestNote}</p>
                  </div>
                )}

                {/* Structure */}
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 14 }}>
                    📝 Recommended Structure
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {country.structure.map((s, i) => (
                      <div key={i} style={{
                        display: 'flex', gap: 14, alignItems: 'flex-start',
                        background: '#FAFBFD', borderRadius: 10, padding: '12px 16px',
                        border: '1px solid #F0F3F8',
                      }}>
                        <span style={{
                          fontSize: 11, fontWeight: 800, color: 'white',
                          background: country.color, borderRadius: 6,
                          padding: '3px 8px', flexShrink: 0, minWidth: 20, textAlign: 'center',
                        }}>{i + 1}</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: '#0F1C3F', marginBottom: 2 }}>{s.para}</div>
                          <div style={{ fontSize: 12, color: '#718096', lineHeight: 1.5 }}>{s.content}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common Mistakes */}
                <div style={{
                  background: '#FFFBEB', border: '1px solid #FDE68A',
                  borderRadius: 14, padding: '18px 20px', marginBottom: 28,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
                    ⚠️ Common Mistakes
                  </div>
                  {country.commonMistakes.map((m, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
                      <span style={{ color: '#D97706', fontSize: 12, marginTop: 2 }}>•</span>
                      <span style={{ fontSize: 13, color: '#92400E', lineHeight: 1.5 }}>{m}</span>
                    </div>
                  ))}
                </div>

                {/* SOP Starter Template Toggle */}
                <button
                  onClick={handleToggleStarter}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: showStarter
                      ? '#f1f5f9'
                      : `linear-gradient(135deg, ${country.color} 0%, ${country.color}cc 100%)`,
                    color: showStarter ? '#4A5568' : '#fff',
                    borderRadius: 12, padding: '13px 24px',
                    fontWeight: 700, fontSize: 14, border: 'none',
                    boxShadow: showStarter ? 'none' : `0 4px 16px ${country.color}30`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
                >
                  {showStarter ? '✕ Hide Starter Template' : '📋 View SOP Starter Template'}
                </button>

                {/* Starter Template — animated expand/collapse with maxHeight */}
                <div
                  ref={templateRef}
                  style={{
                    overflow: 'hidden',
                    maxHeight: showStarter ? '9999px' : '0',
                    transition: 'max-height 0.4s ease',
                  }}
                >
                  <div style={{ marginTop: 20 }}>
                    <div style={{
                      position: 'relative',
                      background: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: 16,
                    }}>
                      {/* Copy button */}
                      <div style={{
                        display: 'flex', justifyContent: 'flex-end',
                        padding: '12px 16px 0',
                        gap: 8,
                      }}>
                        <button
                          onClick={handleCopyStarter}
                          style={{
                            background: copied ? '#059669' : '#f1f5f9',
                            color: copied ? 'white' : '#4a5568',
                            border: '1px solid #e2e8f0',
                            borderRadius: 8, padding: '6px 14px',
                            fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          {copied ? '✓ Copied!' : '📋 Copy Starter'}
                        </button>
                      </div>
                      {/* Template content */}
                      <pre style={{
                        padding: '16px 24px 24px',
                        margin: 0,
                        fontFamily: '"Georgia", "Times New Roman", serif',
                        fontSize: '13.5px',
                        lineHeight: 1.8,
                        color: '#1a1a2e',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}>
                        {country.starterTemplate}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT STICKY — Universal Tips */}
            <div style={{ position: 'sticky', top: 88 }}>
              <div style={{
                background: '#0F1C3F', borderRadius: 20,
                padding: '24px 22px', color: '#fff',
              }}>
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6, letterSpacing: '-0.3px' }}>
                  ✍️ Universal SOP Tips
                </div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 18, lineHeight: 1.5 }}>
                  These apply to ALL countries
                </p>
                {UNIVERSAL_TIPS.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
                    <span style={{ color: '#0EA5A0', fontWeight: 800, fontSize: 14, flexShrink: 0, marginTop: 1 }}>{i + 1}.</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>{tip}</span>
                  </div>
                ))}

                <button
                  onClick={() => navigate('/chat')}
                  style={{
                    width: '100%', marginTop: 8,
                    background: 'linear-gradient(135deg, #1a3a8c 0%, #2563eb 100%)',
                    color: '#fff', border: 'none', borderRadius: 10,
                    padding: '12px 0', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(26, 58, 140, 0.25)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
                >
                  ✍️ Ask Stu to Review My SOP Draft
                </button>
              </div>

              {/* Quick Stats */}
              <div style={{
                marginTop: 16, background: '#fff', borderRadius: 20,
                border: '1.5px solid #E8EDF5', padding: '20px 22px',
              }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#0F1C3F', marginBottom: 16, letterSpacing: '-0.3px' }}>
                  📊 Quick Comparison
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                    <thead>
                      <tr style={{ background: '#F8FAFD' }}>
                        {['Country', 'Name', 'Limit'].map(h => (
                          <th key={h} style={{ padding: '8px 8px', textAlign: 'left', fontWeight: 700, color: '#4A5568', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {COUNTRIES.map((c, i) => (
                        <tr key={c.id} style={{ borderTop: '1px solid #F0F3F8', background: i % 2 === 0 ? '#fff' : '#FAFBFD' }}>
                          <td style={{ padding: '8px', fontWeight: 700, color: c.color, whiteSpace: 'nowrap' }}>{c.name}</td>
                          <td style={{ padding: '8px', color: '#4A5568', fontSize: 10 }}>{c.localName.split(' ')[0]}</td>
                          <td style={{ padding: '8px', fontWeight: 600, color: '#0F1C3F', fontSize: 10 }}>{c.wordLimit.split('(')[0]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
            Want Stu to review your SOP draft?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, maxWidth: 520, margin: '0 auto 28px', lineHeight: 1.7 }}>
            Paste your SOP content in the AI Assistant — get instant feedback on structure, tone, and university-specific requirements.
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
            ✍️ Ask Stu to Review My SOP Draft
          </button>
        </div>

        {/* Responsive grid for mobile */}
        <style>{`
          @media (max-width: 860px) {
            .sop-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </>
  )
}
