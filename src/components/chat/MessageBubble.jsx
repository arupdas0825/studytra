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
          color: '#4f8ef7', marginTop: 14, marginBottom: 6,
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
          color: '#f0f4ff', marginTop: 16, marginBottom: 8,
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          borderBottom: '1px solid rgba(79, 142, 247, 0.15)', paddingBottom: 6,
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
        <ol key={`ol-${i}`} style={{ paddingLeft: 20, marginTop: 6, marginBottom: 6, color: '#e2e8f0' }}>
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
              color: '#e2e8f0'
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: '#4f8ef7', marginTop: 8, flexShrink: 0,
                boxShadow: '0 0 6px #4f8ef7'
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
      result.push(<hr key={i} style={{ border: 'none', borderTop: '1px solid rgba(79, 142, 247, 0.15)', margin: '12px 0' }} />)
      i++; continue
    }

    // Normal paragraph
    result.push(
      <p key={i} style={{ fontSize: '0.88rem', lineHeight: 1.7, marginBottom: 4, color: '#e2e8f0' }}>
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
      parts.push(<strong key={match.index} style={{ fontWeight: 700, color: '#ffffff' }}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('*')) {
      parts.push(<em key={match.index} style={{ color: '#cbd5e1' }}>{token.slice(1, -1)}</em>)
    } else if (token.startsWith('`')) {
      parts.push(
        <code key={match.index} style={{
          background: 'rgba(79, 142, 247, 0.15)', padding: '2px 6px',
          borderRadius: 4, fontSize: '0.85em', fontFamily: 'monospace',
          color: '#6aa0f0', border: '1px solid rgba(79, 142, 247, 0.1)'
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
          background: 'linear-gradient(135deg, #4f8ef7 0%, #7c3aed 100%)',
          color: '#ffffff',
          borderRadius: '18px 18px 4px 18px',
          padding: '12px 18px',
          maxWidth: '70%',
          fontSize: '0.9rem', lineHeight: 1.65,
          boxShadow: '0 4px 16px rgba(124,58,237,0.25)',
          border: '1px solid rgba(255,255,255,0.08)'
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
        background: 'linear-gradient(135deg, #4f8ef7 0%, #7c3aed 100%)',
        flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.74rem', color: '#ffffff', fontWeight: 800,
        marginTop: 4,
        boxShadow: '0 2px 10px rgba(79, 142, 247, 0.2)'
      }}>AI</div>

      <div style={{
        background: 'rgba(15, 33, 53, 0.6)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(79, 142, 247, 0.15)',
        borderRadius: '18px 18px 18px 4px',
        padding: '16px 20px',
        maxWidth: '78%',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        color: '#f0f4ff',
      }}>
        {renderMarkdown(message.content)}
      </div>
    </div>
  )
}