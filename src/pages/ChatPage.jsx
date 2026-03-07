import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Send, RefreshCw, AlertCircle } from 'lucide-react'
import ChatSidebar from '../components/chat/ChatSidebar'
import MessageBubble from '../components/chat/MessageBubble'
import TypingIndicator from '../components/chat/TypingIndicator'
import OnboardingForm from '../components/OnboardingForm'
import { callGemini, parsePlanLock } from '../utils/gemini'

export default function ChatPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedCountry = searchParams.get('country') || null

  const [showOnboarding, setShowOnboarding] = useState(() => !sessionStorage.getItem('studentProfile'))
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [lockedPlan, setLockedPlan] = useState(null)
  const [error, setError] = useState(null)

  const endRef = useRef(null)
  const inputRef = useRef(null)
  const initialized = useRef(false)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  const initChat = useCallback(async () => {
    if (initialized.current || showOnboarding) return
    initialized.current = true
    setLoading(true)
    setError(null)

    const profileRaw = sessionStorage.getItem('studentProfile')
    const profile = profileRaw ? JSON.parse(profileRaw) : null
    const country = preselectedCountry || profile?.dreamCountry || ''

    const trigger = country && country !== 'Not decided yet'
      ? `A student named ${profile?.fullName || 'a student'} just arrived. They want to study in ${country}. They are currently doing ${profile?.currentLevel || 'their studies'} at ${profile?.currentUniversity || 'their institution'} and want to pursue ${profile?.targetDegree || 'a degree'} in ${profile?.targetCourse || 'their field'}. Greet them warmly by first name, acknowledge their country choice, and ask for their target intake and any specific questions they have.`
      : `A student named ${profile?.fullName || 'a new student'} just arrived at Studytra. Greet them warmly, introduce yourself as Studytra AI, and run the 5-step onboarding: country (Germany/USA/Canada/UK/Australia), degree, intake, current stage (A-F), and budget.`

    try {
      const res = await callGemini([{ role: 'user', content: trigger }])
      const { cleanText, plan } = parsePlanLock(res)
      setMessages([{ role: 'assistant', content: cleanText }])
      if (plan) setLockedPlan(plan)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [showOnboarding, preselectedCountry])

  useEffect(() => { initChat() }, [initChat])

  const handleSend = async () => {
    const t = input.trim()
    if (!t || loading) return
    const updated = [...messages, { role: 'user', content: t }]
    setMessages(updated)
    setInput('')
    setLoading(true)
    setError(null)
    try {
      const res = await callGemini(updated.map(m => ({ role: m.role, content: m.content })))
      const { cleanText, plan } = parsePlanLock(res)
      setMessages(p => [...p, { role: 'assistant', content: cleanText }])
      if (plan && !lockedPlan) setLockedPlan(plan)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const profile = (() => { try { return JSON.parse(sessionStorage.getItem('studentProfile') || 'null') } catch { return null } })()
  const quickReplies = lockedPlan ? [
    'Show complete roadmap', 'Visa step-by-step', 'Monthly cost breakdown',
    'Which exams do I need?', 'Best universities for my profile', 'Education loan options',
  ] : [
    'Germany – MSc Computer Science', 'USA – MS Data Science – Fall 2026',
    'Canada – MBA – September 2026', 'UK – MSc Finance', 'Australia – Master of IT',
  ]

  return (
    <>
      {showOnboarding && (
        <OnboardingForm onClose={() => {
          setShowOnboarding(false)
          setTimeout(() => { initialized.current = false; initChat() }, 100)
        }} />
      )}

      <div style={{ display: 'flex', height: '100vh', background: 'var(--ivory)', overflow: 'hidden' }}>
        <ChatSidebar lockedPlan={lockedPlan} onBack={() => navigate('/')} profile={profile} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Header */}
          <div style={{
            padding: '16px 28px', background: 'white',
            borderBottom: '1px solid var(--gray-200)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '1rem', color: 'var(--blue-950)' }}>
                {lockedPlan ? `${lockedPlan.country} · ${lockedPlan.degree} · ${lockedPlan.intake}` : 'Studytra AI Advisor'}
              </div>
              <div style={{
                fontSize: '0.74rem', color: loading ? '#f59e0b' : 'var(--mint-500)',
                display: 'flex', alignItems: 'center', gap: 5, marginTop: 3,
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: loading ? '#f59e0b' : 'var(--mint-500)',
                  animation: loading ? 'pulse-ring 1s infinite' : 'none',
                }} />
                {loading ? 'Studytra AI is thinking...' : 'Online · Ready to plan'}
              </div>
            </div>
            {lockedPlan && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'var(--mint-50)', border: '1px solid var(--mint-200)',
                borderRadius: 'var(--r-full)', padding: '5px 14px',
              }}>
                <span style={{ fontSize: '0.8rem' }}>🔒</span>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--mint-600)' }}>Plan Locked</span>
              </div>
            )}
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column' }}>
            {messages.length === 0 && loading && (
              <div style={{ textAlign: 'center', margin: 'auto', padding: '40px' }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--blue-700) 0%, var(--blue-500) 100%)',
                  margin: '0 auto 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
                }}>🎓</div>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>Studytra AI is getting ready...</p>
              </div>
            )}

            {error && (
              <div style={{
                background: 'white', border: '1px solid var(--gray-200)',
                borderRadius: 'var(--r-lg)', padding: '24px',
                maxWidth: 420, margin: '20px auto', textAlign: 'center',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>⏳</div>
                <h3 style={{ fontSize: '1rem', color: 'var(--blue-950)', marginBottom: 8 }}>
                  {error === 'QUOTA_EXCEEDED' ? 'Just a moment...' : 'Connection hiccup'}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--gray-500)', marginBottom: 20, lineHeight: 1.65 }}>
                  {error === 'QUOTA_EXCEEDED'
                    ? 'Studytra AI is handling many students right now. Wait 30 seconds and retry.'
                    : 'Something went wrong. A quick retry usually fixes it.'}
                </p>
                <button onClick={() => { setError(null); if (!messages.length) { initialized.current = false; initChat() } }} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  background: 'linear-gradient(135deg, var(--blue-700) 0%, var(--blue-500) 100%)',
                  color: 'white', padding: '10px 22px', borderRadius: 'var(--r-sm)',
                  fontSize: '0.88rem', fontWeight: 700,
                }}>
                  <RefreshCw size={14} /> Try Again
                </button>
              </div>
            )}

            {messages.map((m, i) => <MessageBubble key={i} message={m} />)}
            {loading && messages.length > 0 && <TypingIndicator />}
            <div ref={endRef} />
          </div>

          {/* Quick replies */}
          {!loading && messages.length > 0 && !error && (
            <div style={{ padding: '0 28px 12px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {quickReplies.map(r => (
                <button key={r} onClick={() => { setInput(r); setTimeout(() => inputRef.current?.focus(), 50) }} style={{
                  background: 'white', color: 'var(--blue-700)',
                  border: '1px solid var(--blue-100)',
                  borderRadius: 'var(--r-full)', padding: '6px 14px',
                  fontSize: '0.78rem', fontWeight: 500, whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-700)'; e.currentTarget.style.color = 'white' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'var(--blue-700)' }}
                >{r}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '14px 28px 20px', background: 'white', borderTop: '1px solid var(--gray-200)' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', maxWidth: 860, margin: '0 auto' }}>
              <div style={{
                flex: 1,
                border: `1.5px solid ${input ? 'var(--blue-400)' : 'var(--gray-200)'}`,
                borderRadius: 'var(--r-md)', overflow: 'hidden',
                background: 'var(--ivory)', transition: 'border-color 0.2s',
              }}>
                <textarea ref={inputRef} value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                  placeholder={lockedPlan ? `Ask anything about your ${lockedPlan.country} plan...` : 'Tell me your target country, degree, and intake...'}
                  rows={1} disabled={loading}
                  style={{
                    width: '100%', padding: '13px 16px',
                    background: 'transparent', border: 'none', outline: 'none',
                    resize: 'none', fontSize: '0.92rem', fontFamily: 'DM Sans',
                    color: 'var(--text)', lineHeight: 1.5, maxHeight: 120, overflowY: 'auto',
                  }}
                  onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px' }}
                />
              </div>
              <button onClick={handleSend} disabled={loading || !input.trim()} style={{
                width: 48, height: 48, borderRadius: 'var(--r-md)', flexShrink: 0,
                background: input.trim() && !loading
                  ? 'linear-gradient(135deg, var(--blue-700) 0%, var(--blue-500) 100%)'
                  : 'var(--gray-200)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                boxShadow: input.trim() && !loading ? '0 4px 14px rgba(26,58,140,0.3)' : 'none',
              }}>
                <Send size={17} color={input.trim() && !loading ? 'white' : 'var(--gray-400)'} />
              </button>
            </div>
            <p style={{ textAlign: 'center', fontSize: '0.68rem', color: 'var(--gray-400)', marginTop: 8 }}>
              Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </>
  )
}