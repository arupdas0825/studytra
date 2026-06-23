import React from 'react'

function renderMarkdown(text) {
  if (!text) return ''

  const lines = text.split('\n')
  const result = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Skip empty lines
    if (!line.trim()) {
      result.push(<div key={`gap-${i}`} style={{ height: 8 }} />)
      i++
      continue
    }

    // Heading ## or ###
    if (line.startsWith('### ')) {
      result.push(
        <div key={i} style={{
          fontWeight: 700, fontSize: '0.94rem',
          color: 'var(--primary)', marginTop: 14, marginBottom: 6,
          fontFamily: 'Plus Jakarta Sans, sans-serif',
        }}>
          {renderInline(line.replace(/^###\s+/, ''))}
        </div>
      )
      i++; continue
    }
    if (line.startsWith('## ')) {
      result.push(
        <div key={i} style={{
          fontWeight: 700, fontSize: '1.05rem',
          color: 'var(--text-primary)', marginTop: 16, marginBottom: 8,
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          borderBottom: '1px solid var(--border)', paddingBottom: 6,
        }}>
          {renderInline(line.replace(/^##\s+/, ''))}
        </div>
      )
      i++; continue
    }

    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      const listItems = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\d+\.\s/, ''))
        i++
      }
      result.push(
        <ol key={`ol-${i}`} style={{ paddingLeft: 20, marginTop: 6, marginBottom: 6, color: 'var(--text-secondary)' }}>
          {listItems.map((item, j) => (
            <li key={j} style={{
              fontSize: '0.88rem', color: 'inherit',
              marginBottom: 6, lineHeight: 1.65,
            }}>
              {renderInline(item)}
            </li>
          ))}
        </ol>
      )
      continue
    }

    // Bullet list
    if (line.startsWith('- ') || line.startsWith('• ')) {
      const listItems = []
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('• '))) {
        listItems.push(lines[i].replace(/^[-•]\s/, ''))
        i++
      }
      result.push(
        <ul key={`ul-${i}`} style={{ paddingLeft: 6, marginTop: 4, marginBottom: 6, listStyle: 'none' }}>
          {listItems.map((item, j) => (
            <li key={j} style={{
              fontSize: '0.88rem', marginBottom: 5, lineHeight: 1.65,
              display: 'flex', alignItems: 'flex-start', gap: 8,
              color: 'var(--text-secondary)'
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: 'var(--primary)', marginTop: 8, flexShrink: 0,
                boxShadow: 'var(--shadow-glow)'
              }} />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      )
      continue
    }

    // Horizontal rule
    if (line.trim() === '---') {
      result.push(<hr key={i} style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '12px 0' }} />)
      i++; continue
    }

    // Normal paragraph
    result.push(
      <p key={i} style={{ fontSize: '0.88rem', lineHeight: 1.7, marginBottom: 4, color: 'var(--text-secondary)' }}>
        {renderInline(line)}
      </p>
    )
    i++
  }

  return result
}

function renderInline(text) {
  // Handle **bold**, *italic*, and `code`
  const parts = []
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    const token = match[0]
    if (token.startsWith('**')) {
      parts.push(<strong key={match.index} style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('*')) {
      parts.push(<em key={match.index} style={{ color: 'var(--text-secondary)' }}>{token.slice(1, -1)}</em>)
    } else if (token.startsWith('`')) {
      parts.push(
        <code key={match.index} style={{
          background: 'var(--theme-icon-bg)', padding: '2px 6px',
          borderRadius: 4, fontSize: '0.85em', fontFamily: 'monospace',
          color: 'var(--primary)', border: '1px solid var(--border)'
        }}>{token.slice(1, -1)}</code>
      )
    }
    lastIndex = match.index + token.length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : text
}

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <div style={{
          background: 'var(--gradient-main)',
          color: 'var(--text-inverse, #ffffff)',
          borderRadius: '18px 18px 4px 18px',
          padding: '12px 18px',
          maxWidth: '70%',
          fontSize: '0.9rem', lineHeight: 1.65,
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border)'
        }}>
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'flex-start' }}>
      {/* AI Avatar */}
      <div style={{
        width: 34, height: 34, borderRadius: '50%',
        background: 'var(--gradient-main)',
        flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.74rem', color: 'var(--text-inverse, #ffffff)', fontWeight: 800,
        marginTop: 4,
        boxShadow: 'var(--shadow-sm)'
      }}>AI</div>

      <div style={{
        background: 'var(--bg-card)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border)',
        borderRadius: '18px 18px 18px 4px',
        padding: '16px 20px',
        maxWidth: '78%',
        boxShadow: 'var(--shadow-md)',
        color: 'var(--text-primary)',
      }}>
        {renderMarkdown(message.content)}
      </div>
    </div>
  )
}