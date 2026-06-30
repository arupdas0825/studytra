import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare, Calculator, BookOpen, Landmark, Calendar, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const featuresList = [
  {
    id: 'ai-chat',
    icon: MessageSquare,
    title: 'AI Study Advisor',
    desc: 'Ask questions, review course requirements, and receive immediate structured planning guidance.',
    link: '/chat',
    mockup: (
      <div style={{
        background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(29,52,97,0.08)', borderRadius: 16,
        padding: 20, fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-primary)',
        boxShadow: '0 4px 20px rgba(26,20,8,0.07)', width: '100%', maxWidth: 360, margin: '0 auto'
      }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, borderBottom: '1px solid rgba(26,20,8,0.07)', paddingBottom: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ alignSelf: 'flex-end', background: 'var(--navy)', color: 'white', padding: '8px 12px', borderRadius: '12px 12px 2px 12px', maxWidth: '80%' }}>
            How do I apply to TU Wien?
          </div>
          <div style={{ alignSelf: 'flex-start', background: 'var(--navy-faint)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '12px 12px 12px 2px', maxWidth: '85%' }}>
            <strong>Studytra AI:</strong><br />
            1. Language: English or German B2<br />
            2. App Window: June – Aug<br />
            3. Apply on their portal.<br />
            ➤ Next: Collect B2 certificate.
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'budget',
    icon: Calculator,
    title: 'Smart Cost Planner',
    desc: 'Simulate rent, tuition, and living costs in local currencies with live INR conversions.',
    link: '/budget',
    mockup: (
      <div style={{
        background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(29,52,97,0.08)', borderRadius: 16,
        padding: 20, color: 'var(--text-primary)', boxShadow: '0 4px 20px rgba(26,20,8,0.07)',
        width: '100%', maxWidth: 360, margin: '0 auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Rent & Utilities</span>
          <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--navy)' }}>€550 / mo</span>
        </div>
        <div style={{ height: 6, background: 'rgba(29,52,97,0.07)', borderRadius: 99, position: 'relative', marginBottom: 16 }}>
          <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '55%', background: 'var(--gradient-primary)', borderRadius: 99 }} />
          <div style={{ position: 'absolute', top: -4, left: '55%', width: 14, height: 14, borderRadius: '50%', background: 'var(--navy)', border: '2.5px solid #fff' }} />
        </div>
        <div style={{ borderTop: '1px solid rgba(26,20,8,0.07)', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Total in INR:</span>
          <strong style={{ fontSize: '0.88rem', color: 'var(--accent-success)' }}>≈ ₹49,775 / month</strong>
        </div>
      </div>
    )
  },
  {
    id: 'sop',
    icon: BookOpen,
    title: 'SOP Structure Guide',
    desc: 'Access copyable templates, section structures, and what admission committees seek.',
    link: '/tools/sop-guide',
    mockup: (
      <div style={{
        background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(29,52,97,0.08)', borderRadius: 16,
        padding: 20, color: 'var(--text-primary)', boxShadow: '0 4px 20px rgba(26,20,8,0.07)',
        width: '100%', maxWidth: 360, margin: '0 auto', fontSize: '0.76rem'
      }}>
        <div style={{ fontWeight: 700, borderBottom: '1px solid rgba(26,20,8,0.07)', paddingBottom: 6, marginBottom: 10, color: 'var(--navy)' }}>
          SOP Paragraph Structure
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ background: 'rgba(29,52,97,0.04)', padding: 8, borderRadius: 6, borderLeft: '3.5px solid var(--navy)' }}>
            <strong>Para 1: Fit & Focus</strong> — Mention specific labs, professors, or curriculum highlights.
          </div>
          <div style={{ background: 'rgba(184,146,42,0.04)', padding: 8, borderRadius: 6, borderLeft: '3.5px solid var(--gold)' }}>
            <strong>Para 2: Academic Projects</strong> — Describe bachelor thesis details and metrics.
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'loans',
    icon: Landmark,
    title: 'Loan Comparison Guide',
    desc: 'Compare collateral limits, interest rates, and tax benefits from leading Indian banks.',
    link: '/loans',
    mockup: (
      <div style={{
        background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(29,52,97,0.08)', borderRadius: 16,
        padding: 20, color: 'var(--text-primary)', boxShadow: '0 4px 20px rgba(26,20,8,0.07)',
        width: '100%', maxWidth: 360, margin: '0 auto', fontSize: '0.74rem'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(26,20,8,0.07)', textAlign: 'left', color: 'var(--text-secondary)' }}>
              <th style={{ paddingBottom: 6 }}>Bank</th>
              <th style={{ paddingBottom: 6 }}>Interest</th>
              <th style={{ paddingBottom: 6 }}>No-Collateral</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid rgba(26,20,8,0.07)' }}>
              <td style={{ padding: '8px 0', fontWeight: 700 }}>SBI Scholar</td>
              <td style={{ padding: '8px 0', color: 'var(--accent-success)', fontWeight: 700 }}>8.05%</td>
              <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Up to ₹40L</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 700 }}>HDFC Credila</td>
              <td style={{ padding: '8px 0', color: 'var(--accent-success)', fontWeight: 700 }}>9.50%+</td>
              <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Flexible</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  },
  {
    id: 'roadmaps',
    icon: Calendar,
    title: 'Preparation Milestones',
    desc: 'Stay organized with custom timelines covering IELTS prep, APS applications, and visa slots.',
    link: '/tools/execution-guides',
    mockup: (
      <div style={{
        background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(29,52,97,0.08)', borderRadius: 16,
        padding: 20, color: 'var(--text-primary)', boxShadow: '0 4px 20px rgba(26,20,8,0.07)',
        width: '100%', maxWidth: 360, margin: '0 auto', fontSize: '0.76rem',
        display: 'flex', flexDirection: 'column', gap: 10
      }}>
        {[
          { done: true, text: 'Take IELTS / GRE' },
          { done: true, text: 'Apply for APS Certificate' },
          { done: false, text: 'Secure Blocked Account', active: true },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 18, height: 18, borderRadius: '50%',
              background: item.done ? 'var(--accent-success)' : item.active ? 'var(--navy)' : 'transparent',
              border: item.done || item.active ? 'none' : '2px solid rgba(26,20,8,0.20)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.6rem', color: 'white', flexShrink: 0,
            }}>
              {item.done ? '✓' : item.active ? '●' : ''}
            </span>
            <span style={{
              fontWeight: item.active ? 700 : 500,
              color: item.done ? 'var(--text-secondary)' : item.active ? 'var(--navy)' : 'var(--text-secondary)',
              textDecoration: item.done ? 'line-through' : 'none',
            }}>{item.text}</span>
          </div>
        ))}
      </div>
    )
  }
]

export default function Features() {
  const navigate = useNavigate()
  const { user, setAuthModalOpen } = useAuth()
  const sectionRef = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.sr').forEach(el => el.classList.add('sr-visible'))
        }
      })
    }, { threshold: 0.08 })

    const rows = document.querySelectorAll('.feat-row')
    rows.forEach(el => obs.observe(el))
    if (sectionRef.current) obs.observe(sectionRef.current)

    return () => obs.disconnect()
  }, [])

  const handleOpenTool = (e, link) => {
    if (!user) { e.preventDefault(); setAuthModalOpen(true) }
    else { navigate(link) }
  }

  return (
    <section
      id="features"
      ref={sectionRef}
      style={{
        padding: '108px 24px',
        background: '#ffffff',
        borderTop: '1px solid rgba(26,20,8,0.07)',
      }}
    >
      <div className="container">

        {/* Section Header */}
        <div className="sr" style={{ textAlign: 'center', marginBottom: 80 }}>
          <span className="section-badge">Features</span>
          <h2 className="section-headline" style={{ textAlign: 'center' }}>
            Built for Execution.
          </h2>
          <div className="gold-rule" />
          <p className="section-subtext" style={{ textAlign: 'center' }}>
            Every tool you need to plan your study abroad journey independently,
            without hiring consultancies.
          </p>
        </div>

        {/* Alternating Feature Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 88 }}>
          {featuresList.map((f, i) => {
            const Icon = f.icon
            const isEven = i % 2 === 0
            return (
              <div
                key={f.id}
                className="feat-row sr"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 64,
                  alignItems: 'center',
                }}
              >
                {/* Text */}
                <div style={{ order: isEven ? 1 : 2, display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div className="icon-box">
                    <Icon size={22} color="var(--navy)" />
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)',
                      fontFamily: 'Plus Jakarta Sans, sans-serif', margin: '0 0 10px',
                    }}>{f.title}</h3>
                    <p style={{
                      color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.72, margin: 0,
                    }}>{f.desc}</p>
                  </div>
                  <button
                    onClick={(e) => handleOpenTool(e, f.link)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 7,
                      background: 'none', color: 'var(--navy)', border: 'none',
                      fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                      padding: '4px 0', width: 'fit-content',
                      transition: 'gap 0.2s ease',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                    }}
                    onMouseEnter={e => e.currentTarget.style.gap = '12px'}
                    onMouseLeave={e => e.currentTarget.style.gap = '7px'}
                  >
                    Open Tool <ArrowRight size={15} />
                  </button>
                </div>

                {/* Mockup */}
                <div
                  className="mockup-container"
                  style={{ order: isEven ? 2 : 1 }}
                >
                  {f.mockup}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .feat-row { grid-template-columns: 1fr !important; gap: 36px !important; }
          .feat-row > div { order: unset !important; }
        }
      `}</style>
    </section>
  )
}