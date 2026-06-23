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
        background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 16,
        padding: 20, fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-primary)',
        boxShadow: 'var(--shadow-card)', width: '100%', maxWidth: 360, margin: '0 auto'
      }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, borderBottom: '1px solid var(--border-default)', paddingBottom: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ alignSelf: 'flex-end', background: 'var(--accent-primary)', color: 'white', padding: '8px 12px', borderRadius: '12px 12px 2px 12px', maxWidth: '80%' }}>
            How do I apply to TU Wien?
          </div>
          <div style={{ alignSelf: 'flex-start', background: 'var(--bg-primary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '12px 12px 12px 2px', maxWidth: '85%' }}>
            <strong>Studytra AI:</strong><br />
            1. Language: English or German B2<br />
            2. App Window: June - Aug<br />
            3. Apply directly on their portal.<br />
            ➤ Next Step: Collect B2 certificate.
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
        background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 16,
        padding: 20, color: 'var(--text-primary)', boxShadow: 'var(--shadow-card)',
        width: '100%', maxWidth: 360, margin: '0 auto'
      }}>
        <div style={{ display: 'flex', justifycontent: 'space-between', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Rent & Utilities</span>
          <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--accent-primary)' }}>€550 / mo</span>
        </div>
        <div style={{ height: 6, background: 'rgba(37, 99, 235, 0.08)', borderRadius: 99, position: 'relative', marginBottom: 16 }}>
          <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '55%', background: 'var(--accent-primary)', borderRadius: 99 }} />
          <div style={{ position: 'absolute', top: -4, left: '55%', width: 14, height: 14, borderRadius: '50%', background: 'var(--accent-primary)', border: '2.5px solid var(--bg-card)' }} />
        </div>
        <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
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
        background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 16,
        padding: 20, color: 'var(--text-primary)', boxShadow: 'var(--shadow-card)',
        width: '100%', maxWidth: 360, margin: '0 auto', fontSize: '0.76rem'
      }}>
        <div style={{ fontWeight: 700, borderBottom: '1px solid var(--border-default)', paddingBottom: 6, marginBottom: 10, color: 'var(--accent-primary)' }}>
          SOP Paragraph Structure
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ background: 'rgba(37, 99, 235, 0.04)', padding: 8, borderRadius: 6, borderLeft: '3.5px solid var(--accent-primary)', color: 'var(--text-primary)' }}>
            <strong>Para 1: Fit & Focus</strong> — Mention specific labs, professors, or curriculum highlights.
          </div>
          <div style={{ background: 'rgba(124, 58, 237, 0.04)', padding: 8, borderRadius: 6, borderLeft: '3.5px solid #7c3aed', color: 'var(--text-primary)' }}>
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
        background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 16,
        padding: 20, color: 'var(--text-primary)', boxShadow: 'var(--shadow-card)',
        width: '100%', maxWidth: 360, margin: '0 auto', fontSize: '0.74rem'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-default)', textAlign: 'left', color: 'var(--text-secondary)' }}>
              <th style={{ paddingBottom: 6 }}>Bank</th>
              <th style={{ paddingBottom: 6 }}>Interest</th>
              <th style={{ paddingBottom: 6 }}>No-Collateral</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
              <td style={{ padding: '8px 0', fontWeight: 700, color: 'var(--text-primary)' }}>SBI Scholar</td>
              <td style={{ padding: '8px 0', color: 'var(--accent-success)', fontWeight: 700 }}>8.05%</td>
              <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Up to ₹40L</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 700, color: 'var(--text-primary)' }}>HDFC Credila</td>
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
        background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 16,
        padding: 20, color: 'var(--text-primary)', boxShadow: 'var(--shadow-card)',
        width: '100%', maxWidth: 360, margin: '0 auto', fontSize: '0.76rem',
        display: 'flex', flexDirection: 'column', gap: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--accent-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', color: 'white' }}>✓</span>
          <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>Take IELTS / GRE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--accent-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', color: 'white' }}>✓</span>
          <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>Apply for APS Certificate</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 14, height: 14, borderRadius: '50%', border: '2.5px solid var(--accent-primary)' }} />
          <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>Secure Blocked Account</span>
        </div>
      </div>
    )
  }
]

export default function Features() {
  const navigate = useNavigate()
  const { user, setAuthModalOpen } = useAuth()
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
        }
      })
    }, { threshold: 0.1 })
    
    const elements = document.querySelectorAll('.feat-row-reveal')
    elements.forEach(el => obs.observe(el))
    
    return () => obs.disconnect()
  }, [])

  const handleOpenTool = (e, link) => {
    if (!user) {
      e.preventDefault()
      setAuthModalOpen(true)
    } else {
      navigate(link)
    }
  }

  return (
    <section id="features" style={{
      padding: '100px 24px',
      background: 'var(--bg-primary)',
      borderTop: '1px solid var(--border-default)'
    }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <span style={{
            display: 'inline-block', background: 'rgba(37, 99, 235, 0.05)',
            border: '1px solid rgba(37, 99, 235, 0.12)', color: 'var(--accent-primary)',
            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em',
            textTransform: 'uppercase', padding: '5px 14px', borderRadius: 'var(--r-full)',
            marginBottom: 16
          }}>Features</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Built for Execution.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 480, margin: '12px auto 0', lineHeight: 1.6 }}>
            Every tool you need to plan your study abroad journey independently, without hiring consultancies.
          </p>
        </div>

        {/* Alternating Feature List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 100 }}>
          {featuresList.map((f, i) => {
            const Icon = f.icon
            const isEven = i % 2 === 0
            return (
              <div
                key={f.id}
                className="feat-row-reveal"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 64,
                  alignItems: 'center',
                  opacity: 0,
                  transform: 'translateY(30px)',
                  transition: 'opacity 0.8s ease, transform 0.8s ease',
                }}
              >
                {/* Text Content */}
                <div style={{
                  order: isEven ? 1 : 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16
                }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 12,
                    background: 'rgba(37, 99, 235, 0.05)',
                    border: '1px solid rgba(37, 99, 235, 0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Icon size={20} color="var(--accent-primary)" />
                  </div>
                  <h3 style={{
                    fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)',
                    fontFamily: 'Plus Jakarta Sans', margin: 0
                  }}>{f.title}</h3>
                  <p style={{
                    color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.7, margin: 0
                  }}>{f.desc}</p>
                  
                  <button
                    onClick={(e) => handleOpenTool(e, f.link)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: 'none', color: 'var(--accent-primary)', border: 'none',
                      fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer',
                      padding: '4px 0', width: 'fit-content', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                  >
                    Open Tool <ArrowRight size={14} />
                  </button>
                </div>

                {/* Mockup Container */}
                <div style={{
                  order: isEven ? 2 : 1,
                  display: 'flex',
                  justifyContent: 'center',
                  background: '#FFFFFF',
                  border: '1px solid var(--border-default)',
                  borderRadius: 24,
                  padding: '48px 24px',
                  boxShadow: 'var(--shadow-card)',
                  position: 'relative'
                }}>
                  {f.mockup}
                </div>
              </div>
            )
          })}
        </div>

      </div>

      <style>{`
        .feat-row-reveal.visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        @media (max-width: 860px) {
          .feat-row-reveal {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
          .feat-row-reveal > div {
            order: unset !important;
          }
        }
      `}</style>
    </section>
  )
}