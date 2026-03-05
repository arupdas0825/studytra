import { ArrowLeft, GraduationCap, Lock, MapPin, BookOpen, Calendar, CheckCircle2, Circle } from 'lucide-react'

const countryFlags = { Germany: '🇩🇪', 'United States': '🇺🇸', Canada: '🇨🇦', USA: '🇺🇸' }
const countryColors = { Germany: '#1a3260', 'United States': '#8B1A1A', Canada: '#7B2D00', USA: '#8B1A1A' }

const roadmapStages = [
  'Decision Locked',
  'Exam Preparation',
  'Applications',
  'Financial Planning',
  'Visa Process',
  'Pre-Departure',
]

export default function ChatSidebar({ lockedPlan, onBack }) {
  const color = lockedPlan ? (countryColors[lockedPlan.country] || 'var(--navy)') : 'var(--navy)'
  const flag = lockedPlan ? (countryFlags[lockedPlan.country] || '🌍') : null

  return (
    <div style={{
      width: 280, flexShrink: 0,
      background: 'white',
      borderRight: '1px solid var(--gray-200)',
      display: 'flex', flexDirection: 'column',
      height: '100vh',
      position: 'sticky', top: 0,
    }} className="chat-sidebar">

      {/* Top Logo */}
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid var(--gray-100)',
      }}>
        <button onClick={onBack} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'none', color: 'var(--gray-600)',
          fontSize: '0.82rem', fontWeight: 500,
          marginBottom: 20,
          transition: 'color 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--navy)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--gray-600)'}
        >
          <ArrowLeft size={15} /> Back to Home
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'var(--navy)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <GraduationCap size={17} color="white" />
          </div>
          <span style={{
            fontFamily: 'Fraunces, serif', fontWeight: 700,
            fontSize: '1.15rem', color: 'var(--navy)',
          }}>Studytra</span>
        </div>
      </div>

      {/* Plan Card */}
      <div style={{ padding: '16px 20px', flex: 1, overflowY: 'auto' }}>
        {lockedPlan ? (
          <>
            {/* Locked plan */}
            <div style={{
              background: color,
              borderRadius: 16, padding: '16px',
              marginBottom: 20,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 12,
              }}>
                <span style={{
                  fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
                  color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase',
                }}>Plan Locked</span>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  background: 'rgba(255,255,255,0.15)', borderRadius: 100,
                  padding: '2px 8px',
                }}>
                  <Lock size={10} color="rgba(255,255,255,0.8)" />
                  <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>LOCKED</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: '1.4rem' }}>{flag}</span>
                <span style={{
                  fontFamily: 'Fraunces, serif', fontWeight: 600,
                  fontSize: '1rem', color: 'white',
                }}>{lockedPlan.country}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <BookOpen size={12} color="rgba(255,255,255,0.6)" />
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.85)' }}>{lockedPlan.degree}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Calendar size={12} color="rgba(255,255,255,0.6)" />
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.85)' }}>{lockedPlan.intake}</span>
                </div>
              </div>
            </div>

            {/* Roadmap stages */}
            <div>
              <div style={{
                fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em',
                color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: 12,
              }}>Roadmap Stages</div>

              {roadmapStages.map((stage, i) => (
                <div key={stage} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 0',
                  borderBottom: i < roadmapStages.length - 1 ? '1px solid var(--gray-100)' : 'none',
                }}>
                  {i === 0 ? (
                    <CheckCircle2 size={15} color={color} />
                  ) : (
                    <Circle size={15} color="var(--gray-200)" />
                  )}
                  <span style={{
                    fontSize: '0.82rem',
                    fontWeight: i === 0 ? 600 : 400,
                    color: i === 0 ? 'var(--navy)' : 'var(--gray-400)',
                  }}>{stage}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Pre-lock state */
          <div style={{
            background: 'var(--gray-100)', borderRadius: 16,
            padding: '20px 16px', textAlign: 'center',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'white', margin: '0 auto 12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <MapPin size={18} color="var(--accent)" />
            </div>
            <div style={{
              fontFamily: 'Fraunces, serif', fontWeight: 600,
              fontSize: '0.95rem', color: 'var(--navy)', marginBottom: 6,
            }}>No Plan Yet</div>
            <p style={{ fontSize: '0.78rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>
              Answer the AI's questions to lock your study plan.
            </p>
          </div>
        )}
      </div>

      {/* Bottom hint */}
      <div style={{
        padding: '12px 20px',
        borderTop: '1px solid var(--gray-100)',
      }}>
        <p style={{ fontSize: '0.72rem', color: 'var(--gray-400)', lineHeight: 1.5 }}>
          🔒 Your plan stays locked once confirmed. Ask Studytra AI anything about your journey.
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .chat-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  )
}