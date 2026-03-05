import { useEffect, useRef } from 'react'
import { GraduationCap, User } from 'lucide-react'

// Minimal markdown-to-HTML renderer
function renderMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^### (.+)$/gm, '<h4 style="font-size:0.92rem;color:var(--navy);margin:14px 0 6px;font-family:Fraunces,serif">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 style="font-size:1rem;color:var(--navy);margin:14px 0 8px;font-family:Fraunces,serif">$1</h3>')
    .replace(/^\| (.+) \|$/gm, (match) => {
      const cells = match.split('|').filter(c => c.trim() && !c.match(/^[-\s]+$/))
      return `<div style="display:flex;gap:8px;padding:4px 0;font-size:0.8rem">${cells.map(c => `<span style="flex:1;color:var(--gray-600)">${c.trim()}</span>`).join('')}</div>`
    })
    .replace(/^\|[-| ]+\|$/gm, '<div style="border-bottom:1px solid var(--gray-200);margin:2px 0"></div>')
    .replace(/^(\d+)\. (.+)$/gm, '<div style="display:flex;gap:8px;margin:5px 0;font-size:0.88rem"><span style="color:var(--accent);font-weight:700;min-width:18px">$1.</span><span>$2</span></div>')
    .replace(/^- (.+)$/gm, '<div style="display:flex;gap:8px;margin:4px 0;font-size:0.88rem"><span style="color:var(--accent);margin-top:2px">•</span><span>$1</span></div>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')
}

export default function ChatMessage({ message, isStreaming }) {
  const isUser = message.role === 'user'
  const contentRef = useRef(null)

  useEffect(() => {
    if (contentRef.current && !isUser) {
      contentRef.current.innerHTML = renderMarkdown(message.content || (isStreaming ? '' : '…'))
    }
  }, [message.content, isUser, isStreaming])

  return (
    <div style={{
      display: 'flex',
      flexDirection: isUser ? 'row-reverse' : 'row',
      gap: 10,
      marginBottom: 18,
      alignItems: 'flex-start',
    }}>
      {/* Avatar */}
      <div style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        background: isUser ? 'var(--navy)' : 'var(--accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginTop: 2,
      }}>
        {isUser
          ? <User size={15} color="white" />
          : <GraduationCap size={15} color="white" />
        }
      </div>

      {/* Bubble */}
      <div style={{
        maxWidth: '80%',
        background: isUser ? 'var(--navy)' : 'white',
        borderRadius: isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
        padding: '12px 16px',
        boxShadow: isUser ? 'none' : 'var(--shadow-sm)',
        border: isUser ? 'none' : '1px solid var(--gray-200)',
        fontSize: '0.88rem',
        color: isUser ? 'white' : 'var(--text)',
        lineHeight: 1.65,
        position: 'relative',
      }}>
        {isUser
          ? <span>{message.content}</span>
          : <div ref={contentRef} />
        }
        {isStreaming && (
          <span style={{
            display: 'inline-block', width: 8, height: 14,
            background: 'var(--accent)', borderRadius: 2,
            marginLeft: 3, verticalAlign: 'middle',
            animation: 'blink 0.7s steps(1) infinite',
          }} />
        )}
      </div>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }
      `}</style>
    </div>
  )
}