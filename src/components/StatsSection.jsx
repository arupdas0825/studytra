import { useEffect, useRef, useState } from 'react'
import { Users, Globe, Star, Zap } from 'lucide-react'

const stats = [
  { icon: Users, value: 12400, suffix: '+', label: 'Students Planning', color: 'var(--blue-700)' },
  { icon: Globe, value: 5, suffix: '', label: 'Countries Covered', color: 'var(--mint-500)' },
  { icon: Star, value: 4.9, suffix: '/5', label: 'Average Rating', color: '#f59e0b' },
  { icon: Zap, value: 100, suffix: '% Free', label: 'No Consultancy Fees', color: 'var(--blue-400)' },
]

function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const isDecimal = target % 1 !== 0
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(isDecimal ? parseFloat((eased * target).toFixed(1)) : Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

function StatItem({ icon: Icon, value, suffix, label, color, animate }) {
  const count = useCountUp(value, 1800, animate)
  return (
    <div style={{
      textAlign: 'center', padding: '24px 16px',
      transition: 'transform 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 'var(--r-md)',
        background: `${color}15`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 14px',
      }}>
        <Icon size={22} color={color} />
      </div>
      <div style={{
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        fontWeight: 800, fontSize: '2rem',
        color: 'var(--blue-950)', lineHeight: 1,
        marginBottom: 6,
      }}>
        {animate ? count : value}{suffix}
      </div>
      <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)', fontWeight: 500 }}>{label}</div>
    </div>
  )
}

export default function StatsSection() {
  const ref = useRef(null)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) setAnimate(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} style={{
      background: 'var(--ivory)',
      borderTop: '1px solid var(--gray-200)',
      borderBottom: '1px solid var(--gray-200)',
      padding: '16px 24px',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 0,
        }} className="stats-grid">
          {stats.map((s, i) => (
            <div key={i} style={{
              borderRight: i < 3 ? '1px solid var(--gray-200)' : 'none',
            }}>
              <StatItem {...s} animate={animate} />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </section>
  )
}