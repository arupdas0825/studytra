import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Send, RefreshCw, Trash2, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react'
import ChatSidebar from '../components/chat/ChatSidebar'
import MessageBubble from '../components/chat/MessageBubble'
import TypingIndicator from '../components/chat/TypingIndicator'
import OnboardingForm from '../components/OnboardingForm'
import { callGemini, parsePlanLock } from '../utils/gemini'
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

  const [showOnboarding, setShowOnboarding] = useState(() => !sessionStorage.getItem('studentProfile'))
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [lockedPlan, setLockedPlan] = useState(null)
  const [error, setError] = useState(null)

  // Auth & Session History States
  const { user } = useAuth()
  const { showInfo, showError, showSuccess } = useToast()
  const [chatSessions, setChatSessions] = useState([])
  const [activeSessionId, setActiveSessionId] = useState(null)

  const endRef = useRef(null)
  const inputRef = useRef(null)
  const initialized = useRef(false)

  // Scroll to bottom on new message
  useEffect(() => { 
    endRef.current?.scrollIntoView({ behavior: 'smooth' }) 
  }, [messages, loading])

  // Load chat history sessions when user is available
  useEffect(() => {
    if (user) {
      loadUserSessions(user.uid)
    } else {
      setChatSessions([])
      setActiveSessionId(null)
    }
  }, [user])

  // Load chat history sessions
  const loadUserSessions = async (userId, selectId = null) => {
    const list = await fetchChatSessions(userId)
    setChatSessions(list)
    
    // If a specific ID is requested, select it
    if (selectId && list.some(s => s.id === selectId)) {
      setActiveSessionId(selectId)
      const active = list.find(s => s.id === selectId)
      setMessages(active.messages || [])
      // Re-evaluate locked plan if present in history
      detectPlanLock(active.messages || [])
    } else if (list.length > 0 && !activeSessionId) {
      // Otherwise select the first session by default
      setActiveSessionId(list[0].id)
      setMessages(list[0].messages || [])
      detectPlanLock(list[0].messages || [])
      initialized.current = true
    }
  }

  // Detect plan lock in loaded chat history
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

  // Initialize a new chat session greeting
  const initChat = useCallback(async (customProfile = null) => {
    if (initialized.current || showOnboarding) return
    initialized.current = true
    setLoading(true)
    setError(null)

    const profileRaw = sessionStorage.getItem('studentProfile')
    const profile = customProfile || (profileRaw ? JSON.parse(profileRaw) : null)
    const country = preselectedCountry || profile?.dreamCountry || ''

    const trigger = country && country !== 'Not decided yet'
      ? `A student named ${profile?.fullName || 'a student'} just arrived. They want to study in ${country}. They are currently doing ${profile?.currentLevel || 'their studies'} at ${profile?.currentUniversity || 'their institution'} and want to pursue ${profile?.targetDegree || 'a degree'} in ${profile?.targetCourse || 'their field'}. Greet them warmly by first name, acknowledge their country choice, and ask for their target intake and any specific questions they have.`
      : `A student named ${profile?.fullName || 'a new student'} just arrived at Studytra. Greet them warmly, introduce yourself as Studytra AI, and run the 5-step onboarding: country (Germany/USA/Canada/UK/Australia), degree, intake, current stage (A-F), and budget.`

    try {
      const res = await callGemini([{ role: 'user', content: trigger }])
      const { cleanText, plan } = parsePlanLock(res)
      const welcomeMessages = [{ role: 'assistant', content: cleanText }]
      setMessages(welcomeMessages)
      if (plan) setLockedPlan(plan)

      // If logged in, create a session in Firestore immediately
      if (user) {
        const title = plan ? `${plan.country} Plan` : (country && country !== 'Not decided yet' ? `${country} Counseling` : 'Abroad Plan Setup')
        const newSess = await createChatSession(user.uid, title, welcomeMessages)
        if (newSess) {
          setActiveSessionId(newSess.id)
          setChatSessions(prev => [newSess, ...prev])
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [showOnboarding, preselectedCountry, user])

  useEffect(() => { 
    initChat() 
  }, [initChat])

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
      // Call Gemini AI
      const res = await callGemini(updated.map(m => ({ role: m.role, content: m.content })))
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
    
    // Check if profile exists, otherwise force onboarding
    const profileRaw = sessionStorage.getItem('studentProfile')
    if (!profileRaw) {
      setShowOnboarding(true)
    } else {
      initChat(JSON.parse(profileRaw))
    }
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

  const profile = (() => { 
    try { 
      return JSON.parse(sessionStorage.getItem('studentProfile') || 'null') 
    } catch { 
      return null 
    } 
  })()

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
      {showOnboarding && (
        <OnboardingForm onClose={() => {
          setShowOnboarding(false)
          setTimeout(() => { 
            initialized.current = false
            initChat() 
          }, 100)
        }} />
      )}

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

        {/* Sidebar */}
        <ChatSidebar 
          lockedPlan={lockedPlan} 
          onBack={() => navigate('/')} 
          profile={profile}
          user={user}
          chatSessions={chatSessions}
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
          onQuickAction={(promptText) => handleSend(promptText)}
        />

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
                  {error === 'QUOTA_EXCEEDED' ? 'AI limit reached' : 'Connection timeout'}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
                  {error === 'QUOTA_EXCEEDED'
                    ? 'Our servers are experiencing high traffic from study abroad students. Please wait 30 seconds and try again.'
                    : 'We could not reach the AI server. Verify your internet and trigger a quick retry.'}
                </p>
                <button 
                  onClick={() => { 
                    setError(null)
                    if (!messages.length) { 
                      initialized.current = false
                      initChat() 
                    } else {
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
            padding: '14px 28px 20px', 
            background: 'var(--navbar-bg)',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid var(--border)' 
          }}>
            <div style={{ 
              maxWidth: 860, 
              margin: '0 auto', 
              display: 'flex', 
              gap: 12, 
              alignItems: 'flex-end' 
            }}>
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                border: `1.5px solid ${input ? 'var(--primary)' : 'var(--border-default)'}`,
                borderRadius: 12, 
                overflow: 'hidden',
                background: 'var(--bg-input)', 
                transition: 'all 0.2s',
                boxShadow: input ? 'var(--shadow-xs)' : 'none'
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
                  placeholder={lockedPlan ? `Ask anything about your ${lockedPlan.country} plan...` : 'Tell me your target country, degree, and intake...'}
                  rows={1} 
                  disabled={loading}
                  maxLength={1000}
                  style={{
                    width: '100%', 
                    padding: '13px 16px',
                    background: 'transparent', 
                    border: 'none', 
                    outline: 'none',
                    resize: 'none', 
                    fontSize: '0.9rem', 
                    fontFamily: 'Inter, sans-serif',
                    color: 'var(--text-primary)', 
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
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: input.trim() && !loading
                    ? 'var(--gradient-main)'
                    : 'var(--theme-icon-bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  border: 'none'
                }}
              >
                <Send size={16} color={input.trim() && !loading ? 'var(--text-inverse, #ffffff)' : 'var(--text-muted)'} />
              </button>
            </div>
            
            {/* Character Count & Tip footer strip */}
            <div style={{ maxWidth: 860, margin: '6px auto 0', display: 'flex', justifyContent: 'space-between', padding: '0 4px' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                AI responses can take a few seconds. For best results, specify degree & Intake.
              </span>
              <span style={{ 
                fontSize: '0.68rem', 
                color: input.length > 900 ? 'var(--accent-error)' : 'var(--text-muted)',
                fontWeight: input.length > 900 ? 700 : 400
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