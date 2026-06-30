import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, ChevronDown } from 'lucide-react'
import { callGroq } from '../../services/ai/groq'

const QUICK_QUESTIONS = [
  "Hey! I'm Studytra AI. To set up your personalized roadmap, tell me — which country are you planning to study in, and what degree are you targeting? (e.g. Germany for M.Sc CS, October 2028)",
]

// Parse AI response to extract form fields
function parseAIResponse(text) {
  const extracted = {}
  const lower = text.toLowerCase()

  // Country detection
  const countries = {
    'austria': 'Austria', 'germany': 'Germany', 'usa': 'USA',
    'united states': 'USA', 'canada': 'Canada', 'uk': 'UK',
    'united kingdom': 'UK', 'australia': 'Australia', 'france': 'France'
  }
  for (const [key, val] of Object.entries(countries)) {
    if (lower.includes(key)) { extracted.targetCountry = val; break }
  }

  // Degree detection
  if (lower.includes('phd') || lower.includes('doctorate')) extracted.targetDegree = 'PhD'
  else if (lower.includes("master") || lower.includes('msc') || lower.includes('m.sc') || lower.includes('ms ')) extracted.targetDegree = "Master's"
  else if (lower.includes('bachelor') || lower.includes('btech') || lower.includes('b.tech')) extracted.targetDegree = "Bachelor's"

  // Intake detection
  const intakeMatch = lower.match(/(winter|summer|fall|spring)\s*(202\d)/)
  if (intakeMatch) {
    const season = intakeMatch[1].charAt(0).toUpperCase() + intakeMatch[1].slice(1)
    extracted.targetIntake = `${season} ${intakeMatch[2]}`
  }
  const yearMatch = lower.match(/october|sept|jan|feb|march|april\s+202\d/)
  if (yearMatch && !extracted.targetIntake) {
    const y = lower.match(/202\d/)
    if (y) extracted.targetIntake = `Winter ${y[0]}`
  }

  // Field of study
  const fields = ['computer science', 'data science', 'ai', 'machine learning', 
    'biotechnology', 'business', 'finance', 'engineering', 'mathematics']
  for (const f of fields) {
    if (lower.includes(f)) {
      extracted.fieldOfStudy = f.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      break
    }
  }

  return extracted
}

export default function AIQuickSetup({ onExtracted, onSkip }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: QUICK_QUESTIONS[0] }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userText = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userText }])
    setLoading(true)

    try {
      // Call Groq to process this and extract structured data
      const prompt = `You are helping a student fill out a study abroad planning form.
The student said: "${userText}"

Extract: target country, degree (Bachelor's/Master's/PhD), field of study, and intake year.
Then reply warmly confirming what you understood and ask ONE follow-up if critical info is missing
(like their current university or career goal). Keep reply under 60 words. Be friendly and encouraging.

End your reply with this JSON on a new line (hidden from display):
DATA:${JSON.stringify({ extracting: true })}`

      const aiReply = await callGroq([{ role: 'user', content: prompt }])

      // Clean up the DATA: line from display
      const displayReply = aiReply.replace(/DATA:\{.*\}/, '').trim()
      
      // Extract fields from user input
      const extracted = parseAIResponse(userText)

      setMessages(prev => [...prev, { role: 'ai', text: displayReply }])
      
      // If we got meaningful data, apply it
      if (Object.keys(extracted).length > 0) {
        onExtracted(extracted)
        
        // After one exchange, mark as done and show confirm
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'ai',
            text: `✓ I've pre-filled your form with this info. You can review and edit in the steps below.`,
            isFinal: true
          }])
          setDone(true)
        }, 800)
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: "I couldn't process that. Please fill the form manually below — it only takes 2 minutes!"
      }])
    } finally {
      setLoading(false)
    }
  }

  if (collapsed) {
    return (
      <div
        className="ai-setup-collapsed"
        onClick={() => setCollapsed(false)}
      >
        <Sparkles size={14} />
        <span>AI Quick Setup {done ? '✓ Done' : '— click to expand'}</span>
        <ChevronDown size={14} />
      </div>
    )
  }

  return (
    <div className="ai-setup-widget">
      {/* Header */}
      <div className="ai-setup-header">
        <div className="ai-setup-header-left">
          <div className="ai-setup-icon">
            <Sparkles size={14} color="white" />
          </div>
          <div>
            <span className="ai-setup-title">AI Quick Setup</span>
            <span className="ai-setup-badge">Recommended</span>
          </div>
        </div>
        <button className="ai-setup-collapse" onClick={() => setCollapsed(true)}>
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Chat messages */}
      <div className="ai-setup-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`ai-setup-msg ${msg.role}`}>
            {msg.role === 'ai' && (
              <div className="ai-setup-avatar">
                <Sparkles size={10} color="white" />
              </div>
            )}
            <div className={`ai-setup-bubble ${msg.isFinal ? 'final' : ''}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="ai-setup-msg ai">
            <div className="ai-setup-avatar"><Sparkles size={10} color="white" /></div>
            <div className="ai-setup-bubble">
              <span className="ai-typing-dots">
                <span /><span /><span />
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input — only show if not done */}
      {!done ? (
        <div className="ai-setup-input-row">
          <input
            className="ai-setup-input"
            placeholder="e.g. Germany, M.Sc Computer Science, Winter 2028"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            disabled={loading}
            autoFocus
          />
          <button
            className="ai-setup-send"
            onClick={send}
            disabled={!input.trim() || loading}
          >
            <Send size={15} />
          </button>
        </div>
      ) : (
        <button
          className="ai-setup-done-btn"
          onClick={() => setCollapsed(true)}
        >
          Review my pre-filled form ↓
        </button>
      )}

      {/* Skip link */}
      {!done && (
        <button className="ai-setup-skip" onClick={onSkip}>
          Skip and fill manually →
        </button>
      )}
    </div>
  )
}
