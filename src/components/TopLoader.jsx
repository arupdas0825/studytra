import { useState, useEffect } from 'react'

export default function TopLoader() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Simulate a loading progress
    const timer1 = setTimeout(() => setProgress(30), 100)
    const timer2 = setTimeout(() => setProgress(60), 400)
    const timer3 = setTimeout(() => setProgress(85), 800)
    const timer4 = setTimeout(() => {
      setProgress(100)
      setTimeout(() => setVisible(false), 400) // Hide after complete
    }, 1200)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '2px', // Very thin, premium feel
      zIndex: 9999,
      pointerEvents: 'none',
      background: 'transparent',
    }}>
      <div style={{
        height: '100%',
        width: `${progress}%`,
        background: 'var(--blue-700)',
        transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 0 10px rgba(26,58,140,0.5)',
      }} />
    </div>
  )
}
