import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Send, AlertCircle, RefreshCw } from 'lucide-react'
import ChatSidebar from '../components/chat/ChatSidebar'
import MessageBubble from '../components/chat/MessageBubble'
import TypingIndicator from '../components/chat/TypingIndicator'
import { callGemini, parsePlanLock } from '../utils/gemini'

export default function ChatPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedCountry = searchParams.get('country') || null

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [lockedPlan, setLockedPlan] = useState(null)
  const [error, setError] = useState(null)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const hasInitialized = useRef(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // ✅ AI এখন নিজে থেকে প্রথমে greet করবে
  const initializeChat = useCallback(async () => {
    if (hasInitialized.current) return
    hasInitialized.current = true
    setLoading(true)
    setError(null)

    try {
      // AI কে বলছি student এসেছে, এখন greet করো
      const systemTrigger = preselectedCountry
        ? `A student just arrived at the chat page. They have pre-selected "${preselectedCountry}" as their target country. Greet them warmly as Studytra AI, acknowledge their country choice, and ask for their degree and target intake in a friendly structured way.`
        : `A student just arrived at the Studytra chat page. Greet them warmly as Studytra AI and ask all three onboarding questions: target country (Germany/USA/Canada), degree, and target intake — all in one message.`

      const response = await callGemini([
        { role: 'user', content: systemTrigger },
      ])

      const { cleanText, plan } = parsePlanLock(response)
      setMessages([{ role: 'assistant', content: cleanText }])
      if (plan) setLockedPlan(plan)
    } catch (err) {
      if (err.message === 'MISSING_API_KEY') {
        setError('missing_key')
      } else {
        setError(err.message || 'Connection failed. Please retry.')
      }
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [preselectedCountry])

  useEffect(() => {
    initializeChat()
  }, [initializeChat])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    const userMsg = { role: 'user', content: trimmed }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const apiMessages = updatedMessages.map(m => ({ role: m.role, content: m.content }))
      const response = await callGemini(apiMessages)
      const { cleanText, plan } = parsePlanLock(response)
      setMessages(prev => [...prev, { role: 'assistant', content: cleanText }])
      if (plan && !lockedPlan) setLockedPlan(plan)
    } catch (err) {
      setError(err.message || 'Failed to get a response. Please retry.')
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickReplies = lockedPlan ? [
    'Show me the complete roadmap',
    'What exams do I need?',
    'Explain the visa process step by step',
    'Break down my monthly costs',
    'Compare Indian bank education loans',
    'Show pre-departure checklist',
  ] : [
    'Germany – MSc Computer Science – Winter 2026',
    'USA – MS Data Science – Fall 2026',
    'Canada – MBA – September 2026',
  ]

  const handleRetry = () => {
    setError(null)
    if (messages.length === 0) {
      hasInitialized.current = false
      initializeChat()
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--off-white)', overflow: 'hidden' }}>
      <ChatSidebar lockedPlan={lockedPlan} onBack={() => navigate('/')} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Mobile header */}
        <div style={{
          display: 'none', padding: '14px 18px',
          background: 'white', borderBottom: '1px solid var(--gray-200)',
          alignItems: 'center', justifyContent: 'space-between',
        }} className="mobile-header">
          <button onClick={() => navigate('/')} style={{
            background: 'none', color: 'var(--navy)',
            fontSize: '0.85rem', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>← Home</button>
          <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: 'var(--navy)' }}>Studytra AI</span>
          {lockedPlan && (
            <span style={{
              fontSize: '0.7rem', background: 'var(--accent-light)',
              color: 'var(--accent)', padding: '3px 10px',
              borderRadius: 100, fontWeight: 600,
            }}>🔒 {lockedPlan.country}</span>
          )}
        </div>

        {/* Chat header */}
        <div style={{
          padding: '16px 28px',
          background: 'white',
          borderBottom: '1px solid var(--gray-200)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              fontFamily: 'Fraunces, serif', fontWeight: 700,
              fontSize: '1.05rem', color: 'var(--navy)',
            }}>
              {lockedPlan
                ? `${lockedPlan.country} · ${lockedPlan.degree} · ${lockedPlan.intake}`
                : 'Study Abroad Advisor'}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: loading ? 'var(--accent)' : '#22c55e',
              display: 'flex', alignItems: 'center', gap: 5, marginTop: 3,
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: loading ? 'var(--accent)' : '#22c55e',
                animation: loading ? 'pulse-dot 1s infinite' : 'none',
              }} />
              {loading ? 'Studytra AI is thinking...' : 'Online · Ready to plan'}
            </div>
          </div>

          {lockedPlan && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--accent-light)',
              border: '1px solid rgba(201,147,58,0.25)',
              borderRadius: 100, padding: '5px 14px',
            }}>
              <span style={{ fontSize: '0.9rem' }}>🔒</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)' }}>Plan Locked</span>
            </div>
          )}
        </div>

        {/* Messages area */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '24px 28px',
          display: 'flex', flexDirection: 'column',
        }}>

          {/* Loading initial greeting */}
          {messages.length === 0 && loading && (
            <div style={{ textAlign: 'center', margin: 'auto', padding: '40px 20px' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'var(--navy)', margin: '0 auto 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem',
              }}>🎓</div>
              <h3 style={{
                fontFamily: 'Fraunces, serif', fontSize: '1.2rem',
                color: 'var(--navy)', marginBottom: 8,
              }}>Studytra AI is starting...</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                Preparing your personalized study abroad advisor
              </p>
            </div>
          )}

          {/* Error */}
          {error && error !== 'missing_key' && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 14, padding: '16px 20px',
              marginBottom: 16, maxWidth: 520,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <AlertCircle size={16} color="#dc2626" />
                <strong style={{ fontSize: '0.88rem', color: '#dc2626' }}>
                  {error === 'QUOTA_EXCEEDED' ? 'API Quota Exceeded' : 'Connection Error'}
                </strong>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#dc2626', lineHeight: 1.6 }}>
                {error === 'QUOTA_EXCEEDED'
                  ? 'Free tier quota reached. Wait a minute and retry — quota resets hourly.'
                  : error}
              </p>
              <button onClick={handleRetry} style={{
                marginTop: 12, display: 'flex', alignItems: 'center', gap: 6,
                background: '#dc2626', color: 'white',
                padding: '7px 16px', borderRadius: 8,
                fontSize: '0.8rem', fontWeight: 600,
              }}>
                <RefreshCw size={13} /> Retry
              </button>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}

          {/* Typing indicator — only show after initial greeting loaded */}
          {loading && messages.length > 0 && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick replies */}
        {!loading && messages.length > 0 && (
          <div style={{
            padding: '0 28px 12px',
            display: 'flex', gap: 8, flexWrap: 'wrap',
          }}>
            {quickReplies.map(reply => (
              <button key={reply}
                onClick={() => {
                  setInput(reply)
                  setTimeout(() => inputRef.current?.focus(), 50)
                }}
                style={{
                  background: 'white', color: 'var(--navy)',
                  border: '1px solid var(--gray-200)',
                  borderRadius: 100, padding: '6px 14px',
                  fontSize: '0.78rem', fontWeight: 500,
                  transition: 'all 0.15s', cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--navy)'; e.currentTarget.style.background = 'var(--gray-100)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.background = 'white' }}
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{
          padding: '14px 28px 20px',
          background: 'white',
          borderTop: '1px solid var(--gray-200)',
        }}>
          <div style={{
            display: 'flex', gap: 10, alignItems: 'flex-end',
            maxWidth: 860, margin: '0 auto',
          }}>
            <div style={{
              flex: 1, position: 'relative',
              border: `1.5px solid ${input ? 'var(--navy)' : 'var(--gray-200)'}`,
              borderRadius: 14, overflow: 'hidden',
              background: 'var(--off-white)',
              transition: 'border-color 0.2s',
            }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  lockedPlan
                    ? `Ask anything about your ${lockedPlan.country} plan...`
                    : 'Type your reply here...'
                }
                rows={1}
                disabled={loading}
                style={{
                  width: '100%', padding: '13px 16px',
                  background: 'transparent',
                  border: 'none', outline: 'none', resize: 'none',
                  fontSize: '0.93rem', fontFamily: 'DM Sans, sans-serif',
                  color: 'var(--text)', lineHeight: 1.5,
                  maxHeight: 120, overflowY: 'auto',
                }}
                onInput={e => {
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
                }}
              />
            </div>

            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                width: 48, height: 48, borderRadius: 13,
                background: input.trim() && !loading ? 'var(--navy)' : 'var(--gray-200)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.2s',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              }}
              onMouseEnter={e => { if (input.trim() && !loading) e.currentTarget.style.background = 'var(--navy-mid)' }}
              onMouseLeave={e => { if (input.trim() && !loading) e.currentTarget.style.background = 'var(--navy)' }}
            >
              <Send size={17} color={input.trim() && !loading ? 'white' : 'var(--gray-400)'} />
            </button>
          </div>

          <p style={{
            textAlign: 'center', fontSize: '0.7rem',
            color: 'var(--gray-400)', marginTop: 8,
          }}>
            Press <kbd style={{
              background: 'var(--gray-100)', border: '1px solid var(--gray-200)',
              borderRadius: 4, padding: '1px 5px', fontSize: '0.65rem',
            }}>Enter</kbd> to send ·{' '}
            <kbd style={{
              background: 'var(--gray-100)', border: '1px solid var(--gray-200)',
              borderRadius: 4, padding: '1px 5px', fontSize: '0.65rem',
            }}>Shift+Enter</kbd> for new line
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-header { display: flex !important; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        textarea::placeholder { color: var(--gray-400); }
      `}</style>
    </div>
  )
}