import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Send, RefreshCw, Trash2, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react'
import { callGroq, parsePlanLock } from '../services/ai/groq'
import MessageBubble from '../components/chat/MessageBubble'
import TypingIndicator from '../components/chat/TypingIndicator'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { db } from '../lib/firebase'
import { collection, doc, addDoc, getDocs, query, orderBy, setDoc, deleteDoc } from 'firebase/firestore'

// Firestore Chat History Helpers
async function fetchChatSessions(uid) {
  try {
    const q = query(collection(db, "chatHistory", uid, "sessions"), orderBy("updatedAt", "desc"));
    const querySnapshot = await getDocs(q);
    const list = [];
    querySnapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });
    return list;
  } catch (err) {
    console.error("Error fetching chat sessions: ", err);
    return [];
  }
}

async function createChatSession(uid, title, messages) {
  try {
    const sessionData = {
      title,
      messages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, "chatHistory", uid, "sessions"), sessionData);
    return { id: docRef.id, ...sessionData };
  } catch (err) {
    console.error("Error creating chat session: ", err);
    return null;
  }
}

async function updateChatSession(uid, sessionId, title, messages) {
  try {
    const sessionRef = doc(db, "chatHistory", uid, "sessions", sessionId);
    await setDoc(sessionRef, {
      title,
      messages,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    console.error("Error updating chat session: ", err);
    return false;
  }
}

async function deleteChatSession(uid, sessionId) {
  try {
    const sessionRef = doc(db, "chatHistory", uid, "sessions", sessionId);
    await deleteDoc(sessionRef);
    return true;
  } catch (err) {
    console.error("Error deleting chat session: ", err);
    return false;
  }
}

export default function ChatPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedCountry = searchParams.get('country') || null

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [lockedPlan, setLockedPlan] = useState(null)
  const [error, setError] = useState(null)

  // Auth & Session History States
  const { user, userProfile } = useAuth()
  const { showInfo, showError, showSuccess } = useToast()
  const [chatSessions, setChatSessions] = useState([])
  const [activeSessionId, setActiveSessionId] = useState(null)

  const profileRaw = sessionStorage.getItem('studentProfile')
  const profile = userProfile || (profileRaw ? JSON.parse(profileRaw) : null)
  const fullName = profile?.fullName || user?.displayName || user?.email?.split('@')[0] || 'Student'
  const targetCountry = profile?.targetCountry || profile?.dreamCountry || 'Austria'
  const targetDegree = profile?.targetDegree || "Master's"
  const targetCourse = profile?.fieldOfStudy || profile?.targetCourse || 'Computer Science'
  const targetIntake = profile?.targetIntake || '2028'

  const endRef = useRef(null)
  const inputRef = useRef(null)
  const initialized = useRef(false)

  // Scroll to bottom on new message
  useEffect(() => { 
    endRef.current?.scrollIntoView({ behavior: 'smooth' }) 
  }, [messages, loading])

  // Load chat history sessions when user is available or URL search parameters update
  useEffect(() => {
    if (user) {
      const sessionId = searchParams.get('session')
      const isNew = searchParams.get('new')
      
      if (isNew) {
        handleNewChat()
        // Clean URL parameter
        navigate('/chat', { replace: true })
      } else {
        loadUserSessions(user.uid, sessionId)
      }
    } else {
      setChatSessions([])
      setActiveSessionId(null)
    }
  }, [user, searchParams])

  // Load chat history sessions
  const loadUserSessions = async (userId, selectId = null) => {
    const list = await fetchChatSessions(userId)
    setChatSessions(list)
    
    const targetId = selectId || (list.length > 0 ? list[0].id : null)
    
    if (targetId && list.some(s => s.id === targetId)) {
      setActiveSessionId(targetId)
      const active = list.find(s => s.id === targetId)
      setMessages(active.messages || [])
      detectPlanLock(active.messages || [])
      initialized.current = true
    } else {
      setMessages([])
      setLockedPlan(null)
      setActiveSessionId(null)
      initialized.current = false
    }
  }

  // detectPlanLock - parses locked plan from message content if present
  const detectPlanLock = (msgs) => {
    let plan = null
    // Scan backward to find the last assistant message with plan lock
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === 'assistant') {
        const { plan: detectedPlan } = parsePlanLock(msgs[i].content)
        if (detectedPlan) {
          plan = detectedPlan
          break
        }
      }
    }
    setLockedPlan(plan)
  }

  // Handle message sending (user text or quick action)
  const handleSend = async (textToSend = null) => {
    const rawText = textToSend !== null ? textToSend : input
    const t = typeof rawText === 'string' ? rawText.trim() : ''
    if (!t || loading) return

    const updated = [...messages, { role: 'user', content: t }]
    setMessages(updated)
    if (textToSend === null) setInput('') // Clear input if sent from textarea
    setLoading(true)
    setError(null)

    // Save temporary state so user sees their bubble immediately
    let currentSessionId = activeSessionId

    // For guest users, trigger info toast on 3rd user message
    if (!user && updated.filter(m => m.role === 'user').length >= 3) {
      showInfo("Sign in to save your chat sessions and access your personalized study dashboard! 🚀");
    }

    try {
      // Call Groq AI
      const res = await callGroq(updated.map(m => ({ role: m.role, content: m.content })))
      const { cleanText, plan } = parsePlanLock(res)
      const finalMessages = [...updated, { role: 'assistant', content: cleanText }]
      setMessages(finalMessages)
      
      if (plan && !lockedPlan) {
        setLockedPlan(plan)
      }

      // Sync with Firestore chatHistory if logged in
      if (user) {
        const title = plan 
          ? `${plan.country} · ${plan.degree}` 
          : (messages[0]?.role === 'assistant' && lockedPlan ? `${lockedPlan.country} Plan` : 'Abroad Counseling')

        if (currentSessionId) {
          // Update existing session
          await updateChatSession(user.uid, currentSessionId, title, finalMessages)
          // Update local sidebar title/messages list
          setChatSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, title, messages: finalMessages } : s))
        } else {
          // Create new session
          const newSess = await createChatSession(user.uid, title, finalMessages)
          if (newSess) {
            setActiveSessionId(newSess.id)
            setChatSessions(prev => [newSess, ...prev])
          }
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  // Create a brand new chat session
  const handleNewChat = () => {
    setMessages([])
    setLockedPlan(null)
    setActiveSessionId(null)
    initialized.current = false
    setError(null)
  }

  // Select an existing chat session from sidebar
  const handleSelectSession = (sessionId) => {
    setError(null)
    const sess = chatSessions.find(s => s.id === sessionId)
    if (sess) {
      setActiveSessionId(sessionId)
      setMessages(sess.messages || [])
      detectPlanLock(sess.messages || [])
      initialized.current = true
    }
  }

  // Delete a chat session
  const handleDeleteSession = async (sessionId) => {
    if (!user) return
    const success = await deleteChatSession(user.uid, sessionId)
    if (success) {
      setChatSessions(prev => prev.filter(s => s.id !== sessionId))
      if (activeSessionId === sessionId) {
        // Clear active conversation
        setMessages([])
        setLockedPlan(null)
        setActiveSessionId(null)
        initialized.current = false
        // Trigger default new greeting
        setTimeout(() => handleNewChat(), 100)
      }
    }
  }

  // Custom quick reply suggestions on active screens
  const quickReplies = lockedPlan ? [
    'Show complete roadmap', 'Visa step-by-step', 'Monthly cost breakdown',
    'Which exams do I need?', 'Best universities for my profile', 'Education loan options',
  ] : [
    'Germany – MSc Computer Science', 'USA – MS Data Science – Fall 2026',
    'Canada – MBA – September 2026', 'UK – MSc Finance', 'Australia – Master of IT',
  ]

  return (
    <>
      <div style={{ 
        display: 'flex', 
        height: '100vh', 
        background: 'var(--bg-primary)', 
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Glowing Background Mesh Overlays */}
        <div style={{
          position: 'absolute', width: 400, height: 400, background: 'var(--primary)',
          borderRadius: '50%', filter: 'blur(150px)', opacity: 0.06, top: '10%', left: '20%',
          pointerEvents: 'none', zIndex: 0
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400, background: 'var(--primary-dark)',
          borderRadius: '50%', filter: 'blur(150px)', opacity: 0.06, bottom: '15%', right: '20%',
          pointerEvents: 'none', zIndex: 0
        }} />


        {/* Main Chat Interface */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          minWidth: 0,
          position: 'relative',
          zIndex: 10
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 28px', 
            background: 'var(--navbar-bg)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ 
                fontFamily: 'Plus Jakarta Sans, sans-serif', 
                fontWeight: 800, 
                fontSize: '1rem', 
                color: 'var(--text-primary)' 
              }}>
                {lockedPlan ? `${lockedPlan.country} Plan · ${lockedPlan.degree}` : 'Studytra AI Planner'}
              </div>
              <div style={{
                fontSize: '0.74rem', color: loading ? 'var(--accent-warning)' : 'var(--accent-success)',
                display: 'flex', alignItems: 'center', gap: 5, marginTop: 3,
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: loading ? 'var(--accent-warning)' : 'var(--accent-success)',
                  animation: loading ? 'pulse-ring 1s infinite' : 'none',
                }} />
                {loading ? 'Studytra AI is thinking...' : 'Online · Ready to plan'}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Reset current chat locally */}
              <button
                onClick={handleNewChat}
                style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.15)',
                  borderRadius: 10,
                  padding: '6px 14px',
                  color: '#ef4444',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
                title="Clear current conversation state"
              >
                <Trash2 size={13} />
                Clear Chat
              </button>

              {lockedPlan && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: 10, padding: '6px 14px',
                }}>
                  <span style={{ fontSize: '0.8rem' }}>🔒</span>
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#34d399' }}>Plan Locked</span>
                </div>
              )}
            </div>
          </div>

          {/* Chat Messages viewport */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '24px 28px', 
            display: 'flex', 
            flexDirection: 'column' 
          }} className="custom-scroll">
             {messages.length === 0 && !loading && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 'auto',
                maxWidth: 680,
                width: '100%',
                padding: '40px 20px',
                textAlign: 'center',
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.2rem',
                  color: '#FFFFFF',
                  marginBottom: 24,
                  boxShadow: '0 8px 24px rgba(37, 99, 235, 0.15)'
                }}>
                  🎓
                </div>
                
                <h2 style={{
                  fontSize: '1.9rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  margin: '0 0 10px',
                  letterSpacing: '-0.02em',
                  fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}>
                  Hello, {fullName} 👋
                </h2>
                
                <p style={{
                  fontSize: '0.98rem',
                  color: '#64748B',
                  margin: '0 0 36px',
                  lineHeight: 1.5,
                  fontWeight: 600
                }}>
                  Ready to build your {targetCountry} study abroad roadmap?
                </p>

                <div style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  textAlign: 'left'
                }}>
                  <div style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#94A3B8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: 4,
                    paddingLeft: 4
                  }}>
                    Suggested Actions
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 12
                  }}>
                    {/* Action 1 */}
                    <button
                      onClick={() => handleSend(`Which are the best universities in ${targetCountry} for my ${targetDegree} in ${targetCourse}?`)}
                      className="welcome-action-btn"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: 4,
                        padding: '16px 20px',
                        background: '#FFFFFF',
                        border: '1px solid rgba(15, 23, 42, 0.08)',
                        borderRadius: 16,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.02)'
                      }}
                    >
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>🎓 Find universities</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.4 }}>Explore top programs suited for your CS master degree</span>
                    </button>

                    {/* Action 2 */}
                    <button
                      onClick={() => handleSend(`Help me outline and write my Statement of Purpose (SOP) for studying ${targetCourse} in ${targetCountry}.`)}
                      className="welcome-action-btn"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: 4,
                        padding: '16px 20px',
                        background: '#FFFFFF',
                        border: '1px solid rgba(15, 23, 42, 0.08)',
                        borderRadius: 16,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.02)'
                      }}
                    >
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>📄 Help me write SOP</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.4 }}>Structure your essay for target universities</span>
                    </button>

                    {/* Action 3 */}
                    <button
                      onClick={() => handleSend(`What is the estimated cost of living, tuition, and part-time salary in ${targetCountry}?`)}
                      className="welcome-action-btn"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: 4,
                        padding: '16px 20px',
                        background: '#FFFFFF',
                        border: '1px solid rgba(15, 23, 42, 0.08)',
                        borderRadius: 16,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.02)'
                      }}
                    >
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>💰 Estimate my budget</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.4 }}>Tuition fees & monthly living expenses checklist</span>
                    </button>

                    {/* Action 4 */}
                    <button
                      onClick={() => handleSend(`What is the step-by-step student visa process and document checklist for Indian students applying to ${targetCountry}?`)}
                      className="welcome-action-btn"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: 4,
                        padding: '16px 20px',
                        background: '#FFFFFF',
                        border: '1px solid rgba(15, 23, 42, 0.08)',
                        borderRadius: 16,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.02)'
                      }}
                    >
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>🛂 Create visa checklist</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.4 }}>Appointments, visa fees, block account rules</span>
                    </button>

                    {/* Action 5 */}
                    <button
                      onClick={() => handleSend(`Create a detailed preparation and application timeline for ${targetDegree} in ${targetCourse} for ${targetCountry} (Intake: ${targetIntake}).`)}
                      className="welcome-action-btn"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: 4,
                        padding: '16px 20px',
                        background: '#FFFFFF',
                        border: '1px solid rgba(15, 23, 42, 0.08)',
                        borderRadius: 16,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.02)',
                        gridColumn: '1 / -1' // Span full row for 5th item
                      }}
                    >
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>📅 Build my roadmap</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.4 }}>Day-by-day arrival preparation checklist for Intake: {targetIntake}</span>
                    </button>
                  </div>
                </div>

                <style>{`
                  .welcome-action-btn:hover {
                    border-color: #2563EB !important;
                    background: rgba(37, 99, 235, 0.02) !important;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.04) !important;
                  }
                `}</style>
              </div>
            )}

            {messages.length === 0 && loading && (
              <div style={{ textAlign: 'center', margin: 'auto', padding: '40px' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'var(--gradient-main)',
                  margin: '0 auto 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
                  boxShadow: 'var(--shadow-sm)'
                }}>🎓</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Studytra AI is analyzing details...</p>
              </div>
            )}

            {error && (
              <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-hover)',
                borderRadius: 16, padding: '24px',
                maxWidth: 420, margin: '20px auto', textAlign: 'center',
                boxShadow: 'var(--shadow-md)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                  <ShieldAlert size={36} color="var(--accent-error)" />
                </div>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 8 }}>
                  {error === 'QUOTA_EXCEEDED' ? 'AI limit reached' : 'API Connection Issue'}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
                  {error === 'QUOTA_EXCEEDED'
                    ? 'Our servers are experiencing high traffic from study abroad students. Please wait 30 seconds and try again.'
                    : `Error details: ${error}`}
                </p>
                <button 
                  onClick={() => { 
                    setError(null)
                    if (messages.length > 0) { 
                      handleSend(messages[messages.length - 1].content)
                    }
                  }} 
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    background: 'var(--gradient-main)',
                    color: 'var(--text-inverse, white)', padding: '10px 22px', borderRadius: 10,
                    fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={14} /> Retry Message
                </button>
              </div>
            )}

            {messages.map((m, i) => <MessageBubble key={i} message={m} />)}
            {loading && messages.length > 0 && <TypingIndicator />}
            <div ref={endRef} />
          </div>

          {/* Contextual Quick replies */}
          {!loading && messages.length > 0 && !error && (
            <div style={{ padding: '0 28px 12px', display: 'flex', gap: 8, flexWrap: 'wrap', maxWidth: 860, margin: '0 auto' }}>
              {quickReplies.map(r => (
                <button 
                  key={r} 
                  onClick={() => { 
                    setInput(r)
                    setTimeout(() => inputRef.current?.focus(), 50) 
                  }} 
                  style={{
                    background: 'var(--bg-card)', 
                    color: 'var(--primary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--r-full)', 
                    padding: '6px 14px',
                    fontSize: '0.76rem', 
                    fontWeight: 600, 
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { 
                    e.currentTarget.style.background = 'var(--gradient-main)'
                    e.currentTarget.style.color = 'var(--text-inverse, #ffffff)'
                    e.currentTarget.style.borderColor = 'transparent'
                  }}
                  onMouseLeave={e => { 
                    e.currentTarget.style.background = 'var(--bg-card)'
                    e.currentTarget.style.color = 'var(--primary)'
                    e.currentTarget.style.borderColor = 'var(--border)'
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          )}

          {/* Sticky Input Bar */}
          <div style={{ 
            padding: '20px 28px 24px', 
            background: 'rgba(250, 250, 248, 0.75)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(15, 23, 42, 0.06)' 
          }}>
            <div style={{ 
              maxWidth: 800, 
              margin: '0 auto', 
              display: 'flex', 
              gap: 12, 
              alignItems: 'flex-end' 
            }}>
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                border: `1.5px solid ${input ? '#2563EB' : 'rgba(15, 23, 42, 0.08)'}`,
                borderRadius: 16, 
                overflow: 'hidden',
                background: '#FFFFFF', 
                transition: 'all 0.2s',
                boxShadow: input ? '0 4px 20px rgba(37, 99, 235, 0.05)' : '0 2px 10px rgba(15, 23, 42, 0.02)'
              }}>
                <textarea 
                  ref={inputRef} 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { 
                    if (e.key === 'Enter' && !e.shiftKey) { 
                      e.preventDefault()
                      handleSend() 
                    } 
                  }}
                  placeholder="Ask anything about studying abroad..."
                  rows={1} 
                  disabled={loading}
                  maxLength={1000}
                  style={{
                    width: '100%', 
                    padding: '14px 18px',
                    background: 'transparent', 
                    border: 'none', 
                    outline: 'none',
                    resize: 'none', 
                    fontSize: '0.92rem', 
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: '#0F172A', 
                    lineHeight: 1.5, 
                    maxHeight: 120, 
                    overflowY: 'auto',
                  }}
                  onInput={e => { 
                    e.target.style.height = 'auto'
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px' 
                  }}
                />
              </div>
              <button 
                onClick={() => handleSend()} 
                disabled={loading || !input.trim()} 
                style={{
                  width: 50, height: 50, borderRadius: 16, flexShrink: 0,
                  background: input.trim() && !loading
                    ? 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)'
                    : '#FAFBFD',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  border: '1px solid rgba(15, 23, 42, 0.05)',
                  boxShadow: input.trim() && !loading ? '0 4px 14px rgba(37, 99, 235, 0.15)' : 'none'
                }}
              >
                <Send size={16} color={input.trim() && !loading ? '#FFFFFF' : '#94A3B8'} />
              </button>
            </div>
            
            {/* Character Count & Tip footer strip */}
            <div style={{ maxWidth: 800, margin: '8px auto 0', display: 'flex', justifyContent: 'space-between', padding: '0 4px' }}>
              <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 500 }}>
                💡 Tip: Ask for visa blocked account rules, SOP guidelines, or university fees.
              </span>
              <span style={{ 
                fontSize: '0.68rem', 
                color: input.length > 900 ? '#EF4444' : '#94A3B8',
                fontWeight: input.length > 900 ? 700 : 500
              }}>
                {input.length} / 1000
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}