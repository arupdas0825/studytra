import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronDown, Sparkles, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Features from '../components/Features'
import Countries from '../components/Countries'
import Reviews from '../components/Reviews'
import Footer from '../components/Footer'

// FAQ Data
const FAQS = [
  {
    q: 'How does Studytra compare to traditional agents?',
    a: 'Studytra is 100% free, unbiased, and powered by data. Traditional consultancies charge ₹50,000 to ₹2,00,000 and push you toward partner universities where they receive commissions. Studytra helps you apply independently with absolute transparency.'
  },
  {
    q: 'Is Studytra really free? Are there hidden costs?',
    a: 'Yes, Studytra is completely free. We do not charge fees, require credit cards, or upsell services. Our goal is to make study abroad education accessible to every student.'
  },
  {
    q: 'Which countries are supported?',
    a: 'We currently support detailed roadmap planning for 6 top destinations: Germany, Austria, United Kingdom, USA, Canada, and Australia.'
  },
  {
    q: 'How does the AI Study Abroad Advisor help?',
    a: 'Our AI advisor acts as your 24/7 personal consultant, trained on thousands of official university databases, visa policies, and cost-of-living datasets. Ask questions about course requirements, deadlines, blocked account setup, and receive instant, structured answers.'
  },
  {
    q: 'Can I track my application checklists?',
    a: 'Yes! Once you authenticate and complete the onboarding, you get access to your personalized Dashboard. It houses custom, interactive checklists covering exam preparation, document collation, university applications, blocked accounts, and visa interviews.'
  }
]

// Roadmap Preview Data
const PREVIEW_ROADMAPS = {
  germany: {
    countryName: 'Germany',
    flag: '🇩🇪',
    intake: 'Winter Semester 2026',
    progress: 75,
    steps: [
      { title: 'Check Eligibility & Get APS Certificate', desc: 'Verifying course credits and submitting transcripts to APS India.', status: 'done' },
      { title: 'Take IELTS / TestAS & Shortlist Unis', desc: 'Aim for IELTS 6.5+ or TestAS 100+. Choose 5-7 target public universities.', status: 'done' },
      { title: 'Submit Applications via Uni-Assist', desc: 'Gathering documents, translating certificates, and paying application fees.', status: 'active' },
      { title: 'Open Blocked Account & Book Visa Slot', desc: 'Transferring €11,900 to Expatrio/Fintiba and securing a VFS visa interview slot.', status: 'pending' }
    ]
  },
  austria: {
    countryName: 'Austria',
    flag: '🇦🇹',
    intake: 'Winter Semester 2026',
    progress: 50,
    steps: [
      { title: 'Select University (TU Wien / Uni Wien)', desc: 'Find curriculum modules that match your bachelor degree exactly.', status: 'done' },
      { title: 'Legalize Documents (MEA Apostille)', desc: 'Apostille transcripts and graduation certs at Ministry of External Affairs.', status: 'done' },
      { title: 'Submit Physical Application by Post', desc: 'Mailing paper applications directly to the university admissions office in Vienna.', status: 'active' },
      { title: 'Apply for Residence Permit (Visa D)', desc: 'Securing accommodation in Vienna and booking VFS appointment in Delhi/Mumbai.', status: 'pending' }
    ]
  },
  uk: {
    countryName: 'United Kingdom',
    flag: '🇬🇧',
    intake: 'September Intake 2026',
    progress: 60,
    steps: [
      { title: 'Shortlist Masters Courses & Prep LORs', desc: 'Choose 3-5 programs. Request letters of recommendation from college professors.', status: 'done' },
      { title: 'Prepare Personal Statement (SOP)', desc: 'Write a high-impact essay focused on academic achievements.', status: 'done' },
      { title: 'Submit Application & Receive CAS Letter', desc: 'Applying via university portal and securing the Confirmation of Acceptance for Studies.', status: 'active' },
      { title: 'Apply for UK Student Visa (T4)', desc: 'Registering on UKVI, paying IHS health surcharge, and attending biometric scan.', status: 'pending' }
    ]
  }
}

export default function HomePage() {
  const navigate = useNavigate()
  const { user, setAuthModalOpen } = useAuth()

  useEffect(() => {
    if (user) {
      navigate('/chat', { replace: true })
    }
  }, [user, navigate])
  
  // State for Roadmap Preview Country tab
  const [activeTab, setActiveTab] = useState('germany')
  
  // State for FAQ accordion
  const [openFaq, setOpenFaq] = useState(null)

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const handleCtaClick = () => {
    if (!user) {
      setAuthModalOpen(true)
    } else {
      navigate('/chat')
    }
  }

  const currentRoadmap = PREVIEW_ROADMAPS[activeTab]

  return (
    <div style={{ overflowX: 'hidden', background: 'var(--bg-primary)' }}>
      {/* Main Content Sections */}
      <main>
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. How Studytra Works Section */}
        <HowItWorks />

        {/* 3. Features Section */}
        <Features />

        {/* 4. Countries Section */}
        <Countries />

        {/* 5. Success Roadmap Preview [NEW] */}
        <section id="roadmap-preview" style={{
          padding: '100px 24px',
          background: 'var(--bg-primary)',
          borderTop: '1px solid var(--border-default)'
        }}>
          <div className="container">
            {/* Section Header */}
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <span style={{
                display: 'inline-block',
                background: 'rgba(37, 99, 235, 0.05)',
                border: '1px solid rgba(37, 99, 235, 0.12)',
                color: 'var(--accent-primary)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '5px 14px',
                borderRadius: 'var(--r-full)',
                marginBottom: 16,
              }}>
                Interactive Preview
              </span>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                fontFamily: 'Plus Jakarta Sans, sans-serif'
              }}>
                Tailored Timelines at a Glance
              </h2>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '1rem',
                maxWidth: 520,
                margin: '12px auto 0',
                lineHeight: 1.6
              }}>
                Studytra generates chronological roadmaps based on your target country. See how we guide you to success.
              </p>
            </div>

            {/* Preview Box Container */}
            <div style={{
              maxWidth: 900,
              margin: '0 auto',
              background: '#FFFFFF',
              border: '1px solid var(--border-default)',
              borderRadius: 28,
              padding: '40px 32px',
              boxShadow: 'var(--shadow-xl)'
            }}>
              {/* Tab Selector */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 12,
                marginBottom: 36,
                flexWrap: 'wrap'
              }}>
                {Object.keys(PREVIEW_ROADMAPS).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    style={{
                      padding: '12px 20px',
                      borderRadius: 14,
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: '1px solid ' + (activeTab === key ? 'rgba(37, 99, 235, 0.15)' : 'var(--border-default)'),
                      background: activeTab === key ? 'rgba(37, 99, 235, 0.04)' : 'transparent',
                      color: activeTab === key ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      if (activeTab !== key) {
                        e.currentTarget.style.background = 'var(--bg-primary)'
                        e.currentTarget.style.color = 'var(--text-primary)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (activeTab !== key) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = 'var(--text-secondary)'
                      }
                    }}
                  >
                    <span>{PREVIEW_ROADMAPS[key].flag}</span>
                    <span>{PREVIEW_ROADMAPS[key].countryName}</span>
                  </button>
                ))}
              </div>

              {/* Roadmap Timeline */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
                {/* Header Information */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--border-default)',
                  paddingBottom: 20
                }}>
                  <div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Target Intake: {currentRoadmap.intake}
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
                      Dynamic Milestone Plan
                    </h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      Progress
                    </span>
                    <strong style={{ display: 'block', fontSize: '1.3rem', color: 'var(--accent-primary)', fontWeight: 900 }}>
                      {currentRoadmap.progress}%
                    </strong>
                  </div>
                </div>

                {/* Milestones Vertical Flow */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative', marginTop: 10 }}>
                  {currentRoadmap.steps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', position: 'relative' }}>
                      {/* Vertical line connecting dots */}
                      {i < currentRoadmap.steps.length - 1 && (
                        <div style={{
                          position: 'absolute',
                          left: 17,
                          top: 36,
                          width: 2,
                          height: 'calc(100% + 4px)',
                          background: step.status === 'done' ? 'var(--accent-success)' : 'rgba(37, 99, 235, 0.1)'
                        }} />
                      )}
                      
                      {/* Indicator Dot */}
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        flexShrink: 0,
                        zIndex: 2,
                        background: step.status === 'done' ? 'var(--accent-success)' : step.status === 'active' ? 'var(--accent-primary)' : 'rgba(37, 99, 235, 0.05)',
                        border: step.status === 'active' ? '3px solid #FFFFFF' : 'none',
                        boxShadow: step.status === 'active' ? '0 0 0 4px rgba(37, 99, 235, 0.15)' : 'none'
                      }}>
                        {step.status === 'done' ? '✓' : step.status === 'active' ? '●' : '○'}
                      </div>

                      {/* Content Card */}
                      <div style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 16,
                        padding: '18px 24px',
                        flex: 1
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <h4 style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {step.title}
                          </h4>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: 4,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            background: step.status === 'done' ? 'rgba(16, 185, 129, 0.08)' : step.status === 'active' ? 'rgba(37, 99, 235, 0.08)' : 'rgba(148, 163, 184, 0.08)',
                            color: step.status === 'done' ? 'var(--accent-success)' : step.status === 'active' ? 'var(--accent-primary)' : 'var(--text-muted)'
                          }}>
                            {step.status}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Testimonials Section */}
        <Reviews />

        {/* 7. FAQ Accordion [NEW] */}
        <section id="faq" style={{
          padding: '100px 24px',
          background: '#FFFFFF',
          borderBottom: '1px solid var(--border-default)'
        }}>
          <div className="container" style={{ maxWidth: 800 }}>
            {/* Section Header */}
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span style={{
                display: 'inline-block',
                background: 'rgba(37, 99, 235, 0.05)',
                border: '1px solid rgba(37, 99, 235, 0.12)',
                color: 'var(--accent-primary)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '5px 14px',
                borderRadius: 'var(--r-full)',
                marginBottom: 16,
              }}>
                Got Questions?
              </span>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                fontFamily: 'Plus Jakarta Sans, sans-serif'
              }}>
                Frequently Asked Questions
              </h2>
            </div>

            {/* Accordion List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 16,
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    boxShadow: openFaq === i ? 'var(--shadow-md)' : 'none'
                  }}
                >
                  <button
                    onClick={() => toggleFaq(i)}
                    style={{
                      width: '100%',
                      padding: '22px 28px',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Plus Jakarta Sans' }}>
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={18}
                      color="var(--text-muted)"
                      style={{
                        transform: openFaq === i ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s ease',
                        flexShrink: 0,
                        marginLeft: 16
                      }}
                    />
                  </button>
                  {openFaq === i && (
                    <div style={{
                      padding: '0 28px 22px',
                      fontSize: '0.92rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.7,
                      borderTop: '1px solid var(--border-default)',
                      paddingTop: 16,
                      animation: 'faqFadeDown 0.2s ease'
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <style>{`
            @keyframes faqFadeDown {
              from { opacity: 0; transform: translateY(-4px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </section>

        {/* 8. Final CTA Section */}
        <section style={{
          background: 'var(--bg-primary)',
          padding: '100px 24px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', width: 450, height: 450, background: 'rgba(37, 99, 235, 0.05)',
            borderRadius: '50%', filter: 'blur(150px)', opacity: 0.8, top: '-10%', left: '5%',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute', width: 450, height: 450, background: 'rgba(124, 58, 237, 0.04)',
            borderRadius: '50%', filter: 'blur(150px)', opacity: 0.8, bottom: '-10%', right: '5%',
            pointerEvents: 'none'
          }} />

          <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 800 }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: 16 }}>
              Ready to Start?
            </span>
            
            <h2 style={{
              fontSize: 'clamp(2.1rem, 5vw, 3.2rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: 18,
              lineHeight: 1.2,
              fontFamily: 'Plus Jakarta Sans, sans-serif'
            }}>
              Your Dream University<br />Is One Plan Away.
            </h2>

            <p style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: 580,
              margin: '0 auto 36px'
            }}>
              Join thousands of Indian students who chose smart, independent preparation over expensive consultancies. Get your customized plan now.
            </p>

            <button 
              onClick={handleCtaClick}
              className="btn-primary" 
              style={{
                padding: '16px 36px',
                fontSize: '1.05rem',
                fontWeight: 700,
                borderRadius: 14
              }}
            >
              Start Planning Free →
            </button>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 18,
              flexWrap: 'wrap',
              marginTop: 40,
              fontSize: '0.76rem',
              color: 'var(--text-muted)'
            }}>
              <span>✦ No consultancy fees</span>
              <span>✦ No hidden costs</span>
              <span>✦ AI-powered</span>
              <span>✦ Always free</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}