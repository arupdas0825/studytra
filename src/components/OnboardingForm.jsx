import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, GraduationCap, ChevronRight, User, BookOpen, MapPin, Layers } from 'lucide-react'
import { COUNTRIES } from '../constants/countries'

const EDUCATION_LEVELS = ['12th / HSC', 'Undergraduate (B.Tech/BA/B.Sc)', 'Graduate (Bachelor\'s done)', 'Working Professional', 'Postgraduate']
const DEGREE_GOALS = ['Bachelor\'s', 'Master\'s / MSc / MEng', 'PhD', 'MBA', 'PG Diploma (1-2 yr college)']

export default function OnboardingForm({ onClose }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    fullName: '', age: '',
    currentUniversity: '', currentLevel: '',
    targetDegree: '', targetCourse: '', dreamCountry: '',
  })
  const [errors, setErrors] = useState({})

  const up = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }

  const val1 = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Required'
    if (!form.age || +form.age < 15 || +form.age > 45) e.age = 'Valid age 15–45'
    if (!form.currentLevel) e.currentLevel = 'Select your level'
    if (!form.currentUniversity.trim()) e.currentUniversity = 'Required'
    setErrors(e); return !Object.keys(e).length
  }
  const val2 = () => {
    const e = {}
    if (!form.targetDegree) e.targetDegree = 'Select degree goal'
    if (!form.targetCourse.trim()) e.targetCourse = 'Enter your course'
    if (!form.dreamCountry) e.dreamCountry = 'Select a country'
    setErrors(e); return !Object.keys(e).length
  }

  const handleStart = () => {
    if (!val2()) return
    sessionStorage.setItem('studentProfile', JSON.stringify(form))
    onClose()
    navigate(`/chat?country=${encodeURIComponent(form.dreamCountry === 'Not decided yet' ? '' : form.dreamCountry)}`)
  }

  const inputSt = (err) => ({
    width: '100%', padding: '11px 14px',
    border: `1.5px solid ${err ? '#fca5a5' : 'var(--gray-200)'}`,
    borderRadius: 'var(--r-sm)', fontSize: '0.9rem',
    fontFamily: 'DM Sans', color: 'var(--text)', outline: 'none',
    background: err ? '#fef9f9' : 'var(--ivory)',
    boxSizing: 'border-box', transition: 'border-color 0.2s',
  })
  const chipSt = (active, color = 'var(--blue-700)') => ({
    padding: '8px 16px', borderRadius: 'var(--r-full)',
    fontSize: '0.82rem', fontWeight: active ? 700 : 400,
    border: `1.5px solid ${active ? color : 'var(--gray-200)'}`,
    background: active ? color : 'white',
    color: active ? 'white' : 'var(--gray-600)',
    cursor: 'pointer', transition: 'all 0.15s',
  })
  const label = { display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--blue-950)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.05em' }
  const errSt = { display: 'block', fontSize: '0.72rem', color: '#dc2626', marginTop: 5 }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(7,17,42,0.6)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{
        background: 'white', borderRadius: 'var(--r-2xl)',
        width: '100%', maxWidth: 520,
        boxShadow: 'var(--shadow-xl)', overflow: 'hidden',
        animation: 'fadeUp 0.3s ease',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--blue-900) 0%, var(--blue-700) 100%)',
          padding: '24px 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 'var(--r-md)',
              background: 'rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <GraduationCap size={20} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', color: 'white', fontSize: '1.05rem', fontWeight: 800 }}>
                Let's Personalize Your Plan
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                Step {step} of 2 — {step === 1 ? 'Your Background' : 'Your Goal'}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.1)', width: 34, height: 34,
            borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          ><X size={15} color="white" /></button>
        </div>

        {/* Progress */}
        <div style={{ height: 3, background: 'var(--gray-100)' }}>
          <div style={{ height: '100%', width: step === 1 ? '50%' : '100%', background: 'var(--mint-500)', transition: 'width 0.4s ease' }} />
        </div>

        {/* Body */}
        <div style={{ padding: '28px 28px 20px', maxHeight: '65vh', overflowY: 'auto' }}>
          {step === 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <p style={{ fontSize: '0.86rem', color: 'var(--gray-500)', marginBottom: 4 }}>
                Tell us about yourself so Studytra AI can give you fully personalized guidance.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}>
                <div>
                  <label style={label}><User size={12} style={{ display: 'inline', marginRight: 5 }} />Full Name</label>
                  <input value={form.fullName} onChange={e => up('fullName', e.target.value)} placeholder="e.g. Arjun Sharma" style={inputSt(errors.fullName)} />
                  {errors.fullName && <span style={errSt}>{errors.fullName}</span>}
                </div>
                <div>
                  <label style={label}>Age</label>
                  <input type="number" value={form.age} onChange={e => up('age', e.target.value)} placeholder="22" min="15" max="45" style={{ ...inputSt(errors.age), width: 90 }} />
                  {errors.age && <span style={errSt}>{errors.age}</span>}
                </div>
              </div>

              <div>
                <label style={label}><Layers size={12} style={{ display: 'inline', marginRight: 5 }} />Current Education Level</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                  {EDUCATION_LEVELS.map(l => (
                    <button key={l} onClick={() => up('currentLevel', l)} style={chipSt(form.currentLevel === l)}>{l}</button>
                  ))}
                </div>
                {errors.currentLevel && <span style={errSt}>{errors.currentLevel}</span>}
              </div>

              <div>
                <label style={label}><BookOpen size={12} style={{ display: 'inline', marginRight: 5 }} />Current University / School / College</label>
                <input value={form.currentUniversity} onChange={e => up('currentUniversity', e.target.value)} placeholder="e.g. VIT Vellore, IIT Bombay, DU" style={inputSt(errors.currentUniversity)} />
                {errors.currentUniversity && <span style={errSt}>{errors.currentUniversity}</span>}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <p style={{ fontSize: '0.86rem', color: 'var(--gray-500)' }}>
                Almost done — tell us your abroad goal.
              </p>

              <div>
                <label style={label}>Degree Goal Abroad</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                  {DEGREE_GOALS.map(d => (
                    <button key={d} onClick={() => up('targetDegree', d)} style={chipSt(form.targetDegree === d)}>{d}</button>
                  ))}
                </div>
                {errors.targetDegree && <span style={errSt}>{errors.targetDegree}</span>}
              </div>

              <div>
                <label style={label}>What course / field do you want to study?</label>
                <input value={form.targetCourse} onChange={e => up('targetCourse', e.target.value)} placeholder="e.g. MSc Computer Science, MBA Finance, MEng Mechanical" style={inputSt(errors.targetCourse)} />
                {errors.targetCourse && <span style={errSt}>{errors.targetCourse}</span>}
              </div>

              <div>
                <label style={label}><MapPin size={12} style={{ display: 'inline', marginRight: 5 }} />Dream Country</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
                  {[...COUNTRIES.map(c => c.name), 'Not decided yet'].map(n => {
                    const c = COUNTRIES.find(x => x.name === n)
                    return (
                      <button key={n} onClick={() => up('dreamCountry', n)} style={{
                        ...chipSt(form.dreamCountry === n, c?.headerColor || 'var(--blue-700)'),
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}>
                        {c?.flag || '🤔'} {n}
                      </button>
                    )
                  })}
                </div>
                {errors.dreamCountry && <span style={errSt}>{errors.dreamCountry}</span>}
              </div>

              {/* Summary */}
              {form.fullName && (
                <div style={{
                  background: 'var(--blue-50)', borderRadius: 'var(--r-md)',
                  padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--blue-700) 0%, var(--blue-500) 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0,
                  }}>{form.fullName.charAt(0).toUpperCase()}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--blue-950)' }}>{form.fullName}, {form.age}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{form.currentLevel} · {form.currentUniversity}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 28px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {step === 2
            ? <button onClick={() => setStep(1)} style={{ background: 'none', color: 'var(--gray-500)', fontSize: '0.88rem', fontWeight: 600, border: '1.5px solid var(--gray-200)', padding: '10px 18px', borderRadius: 'var(--r-sm)', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--blue-300)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--gray-200)'}
              >← Back</button>
            : <div />
          }
          <button onClick={step === 1 ? () => { if (val1()) setStep(2) } : handleStart} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg, var(--blue-700) 0%, var(--blue-500) 100%)',
            color: 'white', padding: '12px 28px', borderRadius: 'var(--r-sm)',
            fontSize: '0.92rem', fontWeight: 700,
            boxShadow: '0 4px 16px rgba(26,58,140,0.25)', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(26,58,140,0.35)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(26,58,140,0.25)' }}
          >
            {step === 1 ? 'Continue' : '🚀 Start My Plan'} <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}