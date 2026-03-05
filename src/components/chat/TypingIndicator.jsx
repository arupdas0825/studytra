export default function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'flex-end' }}>
      <div style={{
        width: 34, height: 34, borderRadius: '50%',
        background: 'var(--navy)', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.75rem', color: 'white', fontWeight: 700,
      }}>AI</div>

      <div style={{
        background: 'white',
        border: '1px solid var(--gray-200)',
        borderRadius: '18px 18px 18px 4px',
        padding: '14px 18px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex', alignItems: 'center', gap: 5,
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--gray-400)',
            animation: 'typing-bounce 1.2s infinite ease-in-out',
            animationDelay: `${i * 0.2}s`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}