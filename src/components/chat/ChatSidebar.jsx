import { ArrowLeft, GraduationCap, Lock, MapPin, BookOpen, Calendar, CheckCircle2, Circle, MessageSquare, Plus, Trash2, Sparkles, User } from 'lucide-react'

const countryFlags = { Germany: '🇩🇪', 'United States': '🇺🇸', Canada: '🇨🇦', USA: '🇺🇸', UK: '🇬🇧', 'United Kingdom': '🇬🇧', Australia: '🇦🇺', Austria: '🇦🇹' }
const countryColors = { 
  Germany: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', 
  'United States': 'linear-gradient(135deg, #7f1d1d 0%, #ef4444 100%)', 
  USA: 'linear-gradient(135deg, #7f1d1d 0%, #ef4444 100%)', 
  Canada: 'linear-gradient(135deg, #b91c1c 0%, #f87171 100%)',
  UK: 'linear-gradient(135deg, #312e81 0%, #6366f1 100%)',
  'United Kingdom': 'linear-gradient(135deg, #312e81 0%, #6366f1 100%)',
  Australia: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
  Austria: 'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)'
}

const quickChips = [
  { label: 'Visa Requirements', prompt: 'What are the visa requirements and process for my target country?' },
  { label: 'SOP Writing Help', prompt: 'Can you help me outline or structure my Statement of Purpose (SOP)?' },
  { label: 'Top Universities', prompt: 'Which are the best universities for my target course and degree?' },
  { label: 'Blocked Account / Finance', prompt: 'What are the financial proof requirements (like blocked accounts or loans)?' }
]

export default function ChatSidebar({
  lockedPlan,
  onBack,
  profile,
  user,
  chatSessions = [],
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onQuickAction
}) {
  const flag = lockedPlan ? (countryFlags[lockedPlan.country] || '🌍') : (profile ? (countryFlags[profile.dreamCountry] || '🌍') : '🌍')
  const bgGradient = lockedPlan ? (countryColors[lockedPlan.country] || 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)') : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'

  return (
    <div style={{
      width: 300, flexShrink: 0,
      background: 'var(--bg-secondary, rgba(15, 33, 53, 0.65))',
      backdropFilter: 'blur(16px)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      height: '100vh',
      position: 'sticky', top: 0,
      color: 'var(--text-primary)'
    }} className="chat-sidebar">

      {/* Top Header Logo */}
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid var(--border)',
      }}>
        <button onClick={onBack} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'none', color: 'var(--text-muted)',
          fontSize: '0.82rem', fontWeight: 600,
          marginBottom: 16,
          transition: 'color 0.2s',
          cursor: 'pointer'
        }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft size={15} /> Back to Home
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--gradient-main)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <GraduationCap size={18} color="white" />
          </div>
          <span style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800,
            fontSize: '1.2rem', color: 'var(--text-primary)',
          }}>Studytra AI</span>
        </div>
      </div>

      <div style={{ padding: '16px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }} className="custom-scroll">
        
        {/* Profile Card / Plan Card */}
        {profile ? (
          <div style={{
            background: bgGradient,
            borderRadius: 16, padding: '16px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 12,
            }}>
              <span style={{
                fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase',
              }}>{lockedPlan ? 'Plan Locked' : 'Draft Profile'}</span>
              
              <div style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'rgba(255,255,255,0.15)', borderRadius: 100,
                padding: '2px 8px',
              }}>
                {lockedPlan ? <Lock size={10} color="white" /> : <Sparkles size={10} color="white" />}
                <span style={{ fontSize: '0.6rem', color: 'white', fontWeight: 700 }}>
                  {lockedPlan ? 'LOCKED' : 'ACTIVE'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: '1.3rem' }}>{flag}</span>
              <span style={{
                fontFamily: 'Plus Jakarta Sans', fontWeight: 700,
                fontSize: '0.98rem', color: 'white',
              }}>{lockedPlan ? lockedPlan.country : (profile.dreamCountry || 'Not Selected')}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'rgba(255,255,255,0.9)' }}>
                <User size={12} color="rgba(255,255,255,0.7)" />
                <span style={{ fontWeight: 600 }}>{profile.fullName}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)' }}>
                <BookOpen size={12} color="rgba(255,255,255,0.7)" />
                <span>{lockedPlan ? lockedPlan.degree : profile.targetDegree} · {profile.targetCourse}</span>
              </div>
              {lockedPlan && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)' }}>
                  <Calendar size={12} color="rgba(255,255,255,0.7)" />
                  <span>{lockedPlan.intake}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{
            background: 'var(--bg-card)', borderRadius: 16,
            padding: '16px', textAlign: 'center', border: '1px solid var(--border)'
          }}>
            <MapPin size={18} color="var(--primary)" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>No Profile Linked</div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Onboarding form was bypassed. Complete it to set profile.
            </p>
          </div>
        )}

        {/* Quick Help Chips */}
        <div>
          <div style={{
            fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em',
            color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10,
          }}>Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {quickChips.map(chip => (
              <button
                key={chip.label}
                onClick={() => onQuickAction && onQuickAction(chip.prompt)}
                style={{
                  background: 'var(--theme-icon-bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: '9px 12px',
                  textAlign: 'left',
                  fontSize: '0.76rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--theme-icon-hover)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--theme-icon-bg)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <Sparkles size={11} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat History Section */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 180 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 10, borderTop: '1px solid var(--border)', paddingTop: 14
          }}>
            <span style={{
              fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em',
              color: 'var(--text-muted)', textTransform: 'uppercase'
            }}>Chat History</span>

            <button
              onClick={onNewChat}
              style={{
                background: 'var(--theme-icon-bg)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                padding: '3px 8px',
                fontSize: '0.68rem',
                color: 'var(--primary)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--theme-icon-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--theme-icon-bg)'}
            >
              <Plus size={11} /> New
            </button>
          </div>

          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
              {chatSessions.length === 0 ? (
                <div style={{ padding: '16px 8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                  No saved conversations.
                </div>
              ) : (
                chatSessions.map(session => {
                  const isActive = session.id === activeSessionId
                  return (
                    <div
                      key={session.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: isActive ? 'var(--theme-icon-hover)' : 'transparent',
                        borderRadius: 10,
                        padding: '2px 8px',
                        border: `1px solid ${isActive ? 'var(--primary)' : 'transparent'}`,
                        transition: 'all 0.15s'
                      }}
                    >
                      <button
                        onClick={() => onSelectSession(session.id)}
                        style={{
                          flex: 1,
                          textAlign: 'left',
                          background: 'none',
                          color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                          fontSize: '0.76rem',
                          fontWeight: isActive ? 700 : 500,
                          padding: '8px 4px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        <MessageSquare size={12} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.title || 'Untitled Chat'}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm('Delete this chat history?')) {
                            onDeleteSession(session.id)
                          }
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '6px',
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'color 0.15s, background 0.15s'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)' }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none' }}
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          ) : (
            <div style={{
              background: 'var(--theme-icon-bg)',
              borderRadius: 12,
              padding: '12px',
              textAlign: 'center',
              border: '1px dashed var(--border)',
              marginTop: 4
            }}>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Sign in to save chat sessions and access them later from your sidebar!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom User Profile Section */}
      <div style={{
        padding: '14px 20px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--navbar-bg)'
      }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--gradient-main)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-inverse, white)', flexShrink: 0
            }}>
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.user_metadata?.full_name || user.email?.split('@')[0]}
              </div>
              <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </div>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.45, margin: 0 }}>
            ⚡ Powered by Groq AI
          </p>
        )}
      </div>

      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(79, 142, 247, 0.12);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(79, 142, 247, 0.25);
        }
        @media (max-width: 768px) {
          .chat-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  )
}