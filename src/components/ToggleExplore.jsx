import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'

export default function ToggleExplore({ onExplore }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Exactly 10-second delay per requirement
    const timer = setTimeout(() => {
      setVisible(true)
    }, 10000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{
      position: 'absolute',
      top: '40px', // Top of Choose Your Country section
      left: '50%',
      transform: `translateX(-50%) translateY(${visible ? 0 : '-50px'})`,
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? 'auto' : 'none',
      transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)', // Bounce effect
      zIndex: 50,
    }}>
      <button 
        onClick={onExplore}
        className="emerald-toggle btn-3d glass-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '16px 32px',
          borderRadius: '99px',
          color: 'white',
          fontSize: '1.2rem',
          fontWeight: 800,
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
          backdropFilter: 'blur(16px)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'scale(0.95)'
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
      >
        <Sparkles size={20} color="#6ee7b7" />
        Explore Countries
      </button>
    </div>
  )
}
