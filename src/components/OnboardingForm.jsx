import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X, GraduationCap, ChevronRight, ArrowLeft,
  User, BookOpen, MapPin, Layers,
} from 'lucide-react'
import { COUNTRIES } from '../constants/countries'
import { saveStudentProfile } from '../utils/supabase'

const EDUCATION_LEVELS = [
  '12th / HSC',
  "Undergraduate (B.Tech/BA/B.Sc)",
  "Graduate (Bachelor's done)",
  'Working Professional',
  'Postgraduate',
]

const DEGREE_GOALS = [
  "Bachelor's",
  "Master's / MSc / MEng",
  'PhD',
  'MBA',
  'PG Diploma (1-2 yr college)',
]

export default function OnboardingForm({ onClose }) {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    age: '',
    currentUniversity: '',
    currentLevel: '',
    targetDegree: '',
    targetCourse: '',
    dreamCountry: '',
  })
  const [errors, setErrors] = useState({})

  // ── Update field + clear its error ──
  const up = (key, val) => {
    setForm(p => ({ ...p, [key]: val }))
    setErrors(p => ({ ...p, [key]: '' }))
  }

  // ── Step 1 validation ──
  const val1 = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Please enter your name'
    if (!form.age || +form.age < 15 || +form.age > 45) e.age = 'Valid age: 15–45'
    if (!form.currentLevel) e.currentLevel = 'Please select your education level'
    if (!form.currentUniversity.trim()) e.currentUniversity = 'Please enter your university / school'
    setErrors(e)
    return !Object.keys(e).length
  }

  // ── Step 2 validation ──
  const val2 = () => {
    const e = {}
    if (!form.targetDegree) e.targetDegree = 'Please select your degree goal'
    if (!form.targetCourse.trim()) e.targetCourse = 'Please enter your target course'
    if (!form.dreamCountry) e.dreamCountry = 'Please select a country'
    setErrors(e)
    return !Object.keys(e).length
  }

  // ── Final submit ──
  const handleStart = async () => {
    if (!val2()) return

    setSubmitting(true)

    // Save to sessionStorage for AI context
    sessionStorage.setItem('studentProfile', JSON.stringify(form))

    // Save to Supabase database
    await saveStudentProfile(form)

    setSubmitting(false)
    onClose()

    const country = form.dreamCountry === 'Not decided yet' ? '' : form.dreamCountry
    navigate(`/chat?country=${encodeURIComponent(country)}`)
  }

  // ── Shared styles ──
  const inputSt = (err) => ({
    width: '100%',
    padding: '11px 14px',
    border: `1.5px solid ${err ? '#fca5a5' : 'var(--gray-200)'}`,
    borderRadius: 'var(--r-sm)',
    fontSize: '0.9rem',
    fontFamily: 'DM Sans, sans-serif',
    color: 'var(--text)',
    outline: 'none',
    background: err ? '#fff8f8' : 'var(--ivory)',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    display: 'block',
  })

  const chipSt = (active, color = 'var(--blue-700)') => ({
    padding: '8px 16px',
    borderRadius: 'var(--r-full)',
    fontSize: '0.82rem',
    fontWeight: active ? 700 : 400,
    border: `1.5px solid ${active ? color : 'var(--gray-200)'}`,
    background: active ? color : 'white',
    color: active ? 'white' : 'var(--gray-600)',
    cursor: 'pointer',
    transition: 'all 0.15s',
    lineHeight: 1.5,
  })

  const labelSt = {
    display: 'block',
    fontSize: '0.74rem',
    fontWeight: 700,
    color: 'var(--blue-950)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  }

  const errSt = {
    display: 'block',
    fontSize: '0.72rem',
    color: '#dc2626',
    marginTop: 5,
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(7,17,42,0.68)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: 'white',
        borderRadius: 'var(--r-2xl)',
        width: '100%', maxWidth: 520,
        boxShadow: '0 40px 120px rgba(7,17,42,0.35)',
        overflow: 'hidden',
        animation: 'onboardFadeUp 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}>

        {/* ══════════════════════════════
            HEADER
        ══════════════════════════════ */}
        <div style={{
          background: 'linear-gradient(135deg, var(--blue-900) 0%, var(--blue-700) 100%)',
          padding: '24px 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 'var(--r-md)',
              background: 'rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.15)',
            }}>
              <GraduationCap size={22} color="white" />
            </div>
            <div>
              <div style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                color: 'white', fontSize: '1.05rem', fontWeight: 800,
              }}>
                Let's Personalize Your Plan
              </div>
              <div style={{
                fontSize: '0.72rem',
                color: 'rgba(255,255,255,0.5)',
                marginTop: 3,
              }}>
                Step {step} of 2 — {step === 1 ? 'Your Background' : 'Your Goal'}
              </div>
            </div>
          </div>

          {/* X = navigate to home, NOT close modal */}
          <button
            onClick={() => navigate('/')}
            title="Back to Home"
            style={{
              background: 'rgba(255,255,255,0.1)',
              width: 34, height: 34,
              borderRadius: 'var(--r-sm)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.15)',
              transition: 'background 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <X size={15} color="white" />
          </button>
        </div>

        {/* ══════════════════════════════
            PROGRESS BAR
        ══════════════════════════════ */}
        <div style={{ height: 4, background: 'var(--gray-100)' }}>
          <div style={{
            height: '100%',
            width: step === 1 ? '50%' : '100%',
            background: 'linear-gradient(90deg, var(--blue-600) 0%, var(--mint-400) 100%)',
            borderRadius: '0 4px 4px 0',
            transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
          }} />
        </div>

        {/* ══════════════════════════════
            NOTICE STRIP — can't skip
        ══════════════════════════════ */}
        <div style={{
          background: 'var(--blue-50)',
          borderBottom: '1px solid var(--blue-100)',
          padding: '9px 28px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: '0.88rem' }}>🔒</span>
          <span style={{ fontSize: '0.76rem', color: 'var(--blue-700)', fontWeight: 500 }}>
            Complete this to access Studytra AI — takes less than 60 seconds.
          </span>
        </div>

        {/* ══════════════════════════════
            BODY
        ══════════════════════════════ */}
        <div style={{
          padding: '24px 28px 16px',
          maxHeight: '58vh',
          overflowY: 'auto',
        }}>

          {/* ─── STEP 1 — Background ─── */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <p style={{ fontSize: '0.86rem', color: 'var(--gray-500)', lineHeight: 1.65 }}>
                Tell us about yourself so our AI can give you{' '}
                <strong style={{ color: 'var(--blue-700)' }}>fully personalized</strong> guidance.
              </p>

              {/* Name + Age row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px', gap: 12 }}>
                <div>
                  <label style={labelSt}>
                    <User size={11} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
                    Full Name
                  </label>
                  <input
                    value={form.fullName}
                    onChange={e => up('fullName', e.target.value)}
                    placeholder="e.g. Arjun Sharma"
                    style={inputSt(errors.fullName)}
                    onFocus={e => e.target.style.borderColor = 'var(--blue-400)'}
                    onBlur={e => e.target.style.borderColor = errors.fullName ? '#fca5a5' : 'var(--gray-200)'}
                  />
                  {errors.fullName && <span style={errSt}>{errors.fullName}</span>}
                </div>
                <div>
                  <label style={labelSt}>Age</label>
                  <input
                    type="number"
                    value={form.age}
                    onChange={e => up('age', e.target.value)}
                    placeholder="22"
                    min="15" max="45"
                    style={{ ...inputSt(errors.age), width: '100%' }}
                    onFocus={e => e.target.style.borderColor = 'var(--blue-400)'}
                    onBlur={e => e.target.style.borderColor = errors.age ? '#fca5a5' : 'var(--gray-200)'}
                  />
                  {errors.age && <span style={errSt}>{errors.age}</span>}
                </div>
              </div>

              {/* Education level chips */}
              <div>
                <label style={labelSt}>
                  <Layers size={11} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
                  Current Education Level
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                  {EDUCATION_LEVELS.map(l => (
                    <button key={l} onClick={() => up('currentLevel', l)} style={chipSt(form.currentLevel === l)}>
                      {l}
                    </button>
                  ))}
                </div>
                {errors.currentLevel && <span style={errSt}>{errors.currentLevel}</span>}
              </div>

              {/* University */}
              <div>
                <label style={labelSt}>
                  <BookOpen size={11} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
                  Current University / College / School
                </label>
                <input
                  value={form.currentUniversity}
                  onChange={e => up('currentUniversity', e.target.value)}
                  placeholder="e.g. VIT Vellore, IIT Bombay, Delhi University"
                  style={inputSt(errors.currentUniversity)}
                  onFocus={e => e.target.style.borderColor = 'var(--blue-400)'}
                  onBlur={e => e.target.style.borderColor = errors.currentUniversity ? '#fca5a5' : 'var(--gray-200)'}
                />
                {errors.currentUniversity && <span style={errSt}>{errors.currentUniversity}</span>}
              </div>
            </div>
          )}

          {/* ─── STEP 2 — Goal ─── */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <p style={{ fontSize: '0.86rem', color: 'var(--gray-500)', lineHeight: 1.65 }}>
                Almost there — tell us your abroad goal so we can lock your AI plan.
              </p>

              {/* Degree goal chips */}
              <div>
                <label style={labelSt}>Degree Goal Abroad</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                  {DEGREE_GOALS.map(d => (
                    <button key={d} onClick={() => up('targetDegree', d)} style={chipSt(form.targetDegree === d)}>
                      {d}
                    </button>
                  ))}
                </div>
                {errors.targetDegree && <span style={errSt}>{errors.targetDegree}</span>}
              </div>

              {/* Target course */}
              <div>
                <label style={labelSt}>What course / field do you want to study?</label>
                <input
                  value={form.targetCourse}
                  onChange={e => up('targetCourse', e.target.value)}
                  placeholder="e.g. MSc Computer Science, MBA Finance, MEng Mechanical"
                  style={inputSt(errors.targetCourse)}
                  onFocus={e => e.target.style.borderColor = 'var(--blue-400)'}
                  onBlur={e => e.target.style.borderColor = errors.targetCourse ? '#fca5a5' : 'var(--gray-200)'}
                />
                {errors.targetCourse && <span style={errSt}>{errors.targetCourse}</span>}
              </div>

              {/* Dream country chips */}
              <div>
                <label style={labelSt}>
                  <MapPin size={11} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
                  Dream Country
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                  {[
                    ...COUNTRIES,
                    { id: 'undecided', name: 'Not decided yet', flag: '🤔', headerColor: 'var(--gray-500)' },
                  ].map(c => (
                    <button
                      key={c.id}
                      onClick={() => up('dreamCountry', c.name)}
                      style={{
                        ...chipSt(form.dreamCountry === c.name, c.headerColor || 'var(--blue-700)'),
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}
                    >
                      <span className="emoji-flag" style={{ fontSize: '1rem' }}>{c.flag}</span>
                      {c.name}
                    </button>
                  ))}
                </div>
                {errors.dreamCountry && <span style={errSt}>{errors.dreamCountry}</span>}
              </div>

              {/* Summary preview card */}
              {form.fullName && (
                <div style={{
                  background: 'linear-gradient(135deg, var(--blue-50) 0%, var(--mint-50) 100%)',
                  border: '1px solid var(--blue-100)',
                  borderRadius: 'var(--r-md)', padding: '16px',
                  display: 'flex', alignItems: 'center', gap: 14,
                  marginTop: 4,
                }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, var(--blue-700) 0%, var(--blue-500) 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontWeight: 800, fontSize: '1rem',
                  }}>
                    {form.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--blue-950)' }}>
                      {form.fullName}, {form.age}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: 2 }}>
                      {form.currentLevel} · {form.currentUniversity}
                    </div>
                    {form.dreamCountry && (
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        marginTop: 7,
                        background: 'var(--blue-100)',
                        borderRadius: 'var(--r-full)',
                        padding: '3px 10px',
                        fontSize: '0.72rem', fontWeight: 700, color: 'var(--blue-700)',
                      }}>
                        {[...COUNTRIES, { name: 'Not decided yet', flag: '🤔' }]
                          .find(c => c.name === form.dreamCountry)?.flag || '🌍'}
                        {' '}{form.dreamCountry}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: '1.6rem' }}>✅</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ══════════════════════════════
            FOOTER BUTTONS
        ══════════════════════════════ */}
        <div style={{
          padding: '16px 28px 28px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderTop: '1px solid var(--gray-100)',
        }}>
          {/* Left side */}
          {step === 2 ? (
            <button
              onClick={() => { setStep(1); setErrors({}) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'none', color: 'var(--gray-500)',
                fontSize: '0.88rem', fontWeight: 600,
                border: '1.5px solid var(--gray-200)',
                padding: '10px 18px', borderRadius: 'var(--r-sm)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--blue-300)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--gray-200)'}
            >
              <ArrowLeft size={14} /> Back
            </button>
          ) : (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: '0.74rem', color: 'var(--gray-400)',
            }}>
              🔒 Private & secure
            </div>
          )}

          {/* Right side — main CTA */}
          <button
            onClick={step === 1
              ? () => { if (val1()) setStep(2) }
              : handleStart
            }
            disabled={submitting}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: submitting
                ? 'var(--gray-300)'
                : 'linear-gradient(135deg, var(--blue-700) 0%, var(--blue-500) 100%)',
              color: 'white', padding: '12px 28px',
              borderRadius: 'var(--r-sm)', fontSize: '0.92rem', fontWeight: 700,
              boxShadow: submitting ? 'none' : '0 4px 16px rgba(26,58,140,0.25)',
              transition: 'all 0.2s',
              cursor: submitting ? 'not-allowed' : 'pointer',
              border: 'none',
            }}
            onMouseEnter={e => {
              if (!submitting) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(26,58,140,0.4)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = submitting ? 'none' : '0 4px 16px rgba(26,58,140,0.25)'
            }}
          >
            {step === 1 ? (
              <>Continue <ChevronRight size={16} /></>
            ) : submitting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Saving...
              </span>
            ) : (
              <>🚀 Start My AI Plan <ChevronRight size={16} /></>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes onboardFadeUp {
          from { opacity: 0; transform: translateY(32px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}