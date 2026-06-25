import { useEffect, useRef, useState } from 'react'
import { Users, Globe, Star, Zap } from 'lucide-react'

export function getAIUsageCount() {
  return parseInt(localStorage.getItem('studytra_ai_sessions') || '10247')
}

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const isDecimal = String(target).includes('.')
    const step = (ts) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(isDecimal
        ? parseFloat((eased * target).toFixed(1))
        : Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

function StatItem({ icon: Icon, value, suffix, label, color, animate, isLive }) {
  const count = useCountUp(typeof value === 'number' ? value : 0, 2000, animate)
  const displayVal = animate ? count : value

  return (
    <div style={{
      textAlign: 'center', padding: '36px 20px',
      transition: 'transform 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'none'}
    >
      <div style={{
        width: 50, height: 50, borderRadius: 12,
        background: 'rgba(79, 142, 247, 0.1)',
        border: '1px solid rgba(79, 142, 247, 0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 16px',
      }}>
        <Icon size={22} color="#4f8ef7" />
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2 }}>
        <div style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontWeight: 800, fontSize: '2.2rem',
          color: '#f0f4ff', lineHeight: 1,
        }}>
          {typeof displayVal === 'number'
            ? displayVal.toLocaleString('en-IN')
            : displayVal}
        </div>
        <div style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontWeight: 800, fontSize: '1.3rem',
          color: '#f0f4ff',
        }}>{suffix}</div>
        {isLive && (
          <div style={{
            marginLeft: 6,
            width: 8, height: 8, borderRadius: '50%',
            background: '#10b981',
            animation: 'livepin 2s infinite',
            boxShadow: '0 0 8px #10b981'
          }} />
        )}
      </div>

      <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </div>
    </div>
  )
}

export default function StatsSection() {
  const ref = useRef(null)
  const [animate, setAnimate] = useState(false)
  const [liveCount, setLiveCount] = useState(getAIUsageCount())

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => {
        const next = prev + (Math.random() > 0.7 ? 1 : 0)
        localStorage.setItem('studytra_ai_sessions', String(next))
        return next
      })
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) setAnimate(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const stats = [
    {
      icon: Users, value: liveCount, suffix: '+', label: 'AI Sessions Started',
      color: '#4f8ef7', isLive: true,
    },
    { icon: Globe, value: 6, suffix: '', label: 'Countries Covered', color: '#7c3aed' },
    { icon: Star, value: 4.9, suffix: '/5', label: 'Average Rating', color: '#f59e0b' },
    { icon: Zap, value: 100, suffix: '% Free', label: 'No Consultancy Fees', color: '#10b981' },
  ]

  return (
    <section ref={ref} style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-default)',
      borderBottom: '1px solid var(--border-default)',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }} className="stats-grid">
          {stats.map((s, i) => (
            <div key={i} style={{ borderRight: i < 3 ? '1px solid rgba(79, 142, 247, 0.15)' : 'none' }} className="stats-item-wrapper">
              <StatItem {...s} animate={animate} />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .stats-item-wrapper { border-right: none !important; border-bottom: 1px solid rgba(79, 142, 247, 0.15); }
          .stats-item-wrapper:nth-last-child(-n+2) { border-bottom: none !important; }
        }
        @keyframes livepin { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.4; transform:scale(1.4); } }
      `}</style>
    </section>
  )
}