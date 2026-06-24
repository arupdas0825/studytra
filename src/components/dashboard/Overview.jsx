import React from 'react'
import { Calendar, HelpCircle, Wallet, ArrowRight, BookOpen, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Overview({ profile, user, completedSteps, completedDocs, setActiveTab }) {
  const navigate = useNavigate()

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student'
  const targetCountry = profile?.dream_country || 'Germany'
  const targetDegree = profile?.target_degree || "Master's"
  const targetCourse = profile?.target_course || 'Computer Science'

  // Calculate progress percentage
  // Assume: 6 steps in timeline, 12 documents in checklist = 18 total items
  const totalTasks = 18
  const completedCount = completedSteps.length + completedDocs.length
  const progressPct = Math.round((completedCount / totalTasks) * 100)

  // Calculate days remaining to typical winter intake deadline (Sep 5 or July 15)
  // Let's make it target-country-based
  const getDeadline = (country) => {
    const today = new Date()
    const year = today.getFullYear()
    let deadlineDate

    switch (country.toLowerCase()) {
      case 'germany':
        deadlineDate = new Date(year, 6, 15) // July 15
        break
      case 'austria':
        deadlineDate = new Date(year, 8, 5) // Sept 5
        break
      case 'canada':
        deadlineDate = new Date(year + (today.getMonth() >= 9 ? 1 : 0), 0, 15) // Jan 15
        break
      case 'usa':
        deadlineDate = new Date(year + (today.getMonth() >= 11 ? 1 : 0), 11, 15) // Dec 15
        break
      case 'united kingdom':
      case 'uk':
        deadlineDate = new Date(year, 7, 31) // Aug 31
        break
      case 'australia':
        deadlineDate = new Date(year, 10, 30) // Nov 30
        break
      default:
        deadlineDate = new Date(year, 6, 15)
    }

    // If deadline passed this year, set to next year
    if (deadlineDate < today) {
      deadlineDate.setFullYear(deadlineDate.getFullYear() + 1)
    }

    const diffTime = Math.abs(deadlineDate - today)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return { days: diffDays, dateStr: deadlineDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) }
  }

  const { days: daysLeft, dateStr: deadlineStr } = getDeadline(targetCountry)

  // Budget summaries (from localStorage if set, else presets)
  const getBudgetSummary = () => {
    try {
      const budgetKey = targetCountry.toLowerCase() === 'germany' ? 'de' :
                        targetCountry.toLowerCase() === 'usa' ? 'us' :
                        targetCountry.toLowerCase() === 'canada' ? 'ca' :
                        targetCountry.toLowerCase() === 'united kingdom' || targetCountry.toLowerCase() === 'uk' ? 'uk' :
                        targetCountry.toLowerCase() === 'austria' ? 'at' : 'de'
      
      // Look for saved items or fall back to defaults
      const savedPreset = {
        de: { tuition: 500, rent: 700, food: 250, transport: 90, entertainment: 160 },
        us: { tuition: 2500, rent: 1200, food: 400, transport: 120, entertainment: 230 },
        ca: { tuition: 2000, rent: 1100, food: 350, transport: 100, entertainment: 200 },
        uk: { tuition: 1800, rent: 1000, food: 320, transport: 110, entertainment: 220 },
        at: { tuition: 200, rent: 550, food: 250, transport: 30, entertainment: 150 },
      }[budgetKey] || { tuition: 500, rent: 700, food: 250, transport: 90, entertainment: 160 }

      const total = Object.values(savedPreset).reduce((a, b) => a + b, 0)
      const symbol = budgetKey === 'us' ? '$' : budgetKey === 'ca' ? 'CA$' : budgetKey === 'uk' ? '£' : '€'
      return { total, symbol }
    } catch {
      return { total: 1700, symbol: '€' }
    }
  }

  const budgetInfo = getBudgetSummary()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.06) 0%, rgba(124, 58, 237, 0.06) 100%)',
        border: '1px solid rgba(37, 99, 235, 0.12)',
        borderRadius: 24,
        padding: '32px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 20,
      }}>
        <div>
          <h2 style={{
            fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', margin: 0,
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            letterSpacing: '-0.02em'
          }}>
            Hello, {displayName}!
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.92rem', marginTop: 6, margin: 0, fontWeight: 500 }}>
            Here is your personalized roadmap status for studying in {targetCountry}.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{
            background: '#FFFFFF',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            borderRadius: 12,
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.02)'
          }}>
            <MapPin size={16} color="#2563EB" />
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>{targetCountry}</span>
          </div>
          <div style={{
            background: '#FFFFFF',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            borderRadius: 12,
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.02)'
          }}>
            <BookOpen size={16} color="#7c3aed" />
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>{targetDegree}</span>
          </div>
        </div>
      </div>

      {/* Overview Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 24,
      }}>
        {/* Card 1: Checklist Progress */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid rgba(15, 23, 42, 0.08)',
          borderRadius: 24,
          padding: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Checklist Progress
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginTop: 10, fontFamily: 'Plus Jakarta Sans' }}>
              {progressPct}%
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: 6, fontWeight: 500 }}>
              {completedCount} of {totalTasks} items completed
            </div>
          </div>

          {/* SVG Progress Ring */}
          <div style={{ position: 'relative', width: 70, height: 70 }}>
            <svg width="70" height="70" viewBox="0 0 70 70">
              <circle cx="35" cy="35" r="28" fill="none" stroke="rgba(37, 99, 235, 0.04)" strokeWidth="6" />
              <circle cx="35" cy="35" r="28" fill="none" stroke="url(#progressGradient)" strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - progressPct / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 35 35)"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 700, color: '#0F172A'
            }}>
              {progressPct}%
            </div>
          </div>
        </div>

        {/* Card 2: Application Deadline */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid rgba(15, 23, 42, 0.08)',
          borderRadius: 24,
          padding: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Intake Deadline
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#EF4444', marginTop: 10, fontFamily: 'Plus Jakarta Sans' }}>
              {daysLeft} Days
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: 6, fontWeight: 500 }}>
              Typical deadline: {deadlineStr}
            </div>
          </div>
          <div style={{
            width: 48, height: 48, borderRadius: 14, 
            background: 'rgba(239, 68, 68, 0.06)',
            border: '1px solid rgba(239, 68, 68, 0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Calendar size={22} color="#EF4444" />
          </div>
        </div>

        {/* Card 3: Budget Estimator */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid rgba(15, 23, 42, 0.08)',
          borderRadius: 24,
          padding: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Planned Budget
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#16A34A', marginTop: 10, fontFamily: 'Plus Jakarta Sans' }}>
              {budgetInfo.symbol}{budgetInfo.total.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: 6, fontWeight: 500 }}>
              Estimated monthly cost of living
            </div>
          </div>
          <div style={{
            width: 48, height: 48, borderRadius: 14, 
            background: 'rgba(22, 163, 74, 0.06)',
            border: '1px solid rgba(22, 163, 74, 0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Wallet size={22} color="#16A34A" />
          </div>
        </div>
      </div>

      {/* Quick Actions & Short Cuts */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: 18, fontFamily: 'Plus Jakarta Sans', letterSpacing: '-0.01em' }}>
          Quick Planning Shortcuts
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}>
          <button
            onClick={() => navigate('/chat')}
            style={{
              padding: '24px',
              borderRadius: 24,
              background: '#FFFFFF',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.2)'
              e.currentTarget.style.background = 'rgba(37, 99, 235, 0.01)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(15, 23, 42, 0.08)'
              e.currentTarget.style.background = '#FFFFFF'
              e.currentTarget.style.transform = 'none'
            }}
          >
            <span style={{ fontSize: '1.5rem', marginBottom: 4 }}>💬</span>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>Chat with AI Advisor</div>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>Get custom answers, review university profiles, or write essays.</p>
          </button>

          <button
            onClick={() => navigate('/budget')}
            style={{
              padding: '24px',
              borderRadius: 24,
              background: '#FFFFFF',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.2)'
              e.currentTarget.style.background = 'rgba(124, 58, 237, 0.01)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(15, 23, 42, 0.08)'
              e.currentTarget.style.background = '#FFFFFF'
              e.currentTarget.style.transform = 'none'
            }}
          >
            <span style={{ fontSize: '1.5rem', marginBottom: 4 }}>💰</span>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>Calculate Living Budget</div>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>Adjust savings, calculate part-time job incomes, and compare cities.</p>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            style={{
              padding: '24px',
              borderRadius: 24,
              background: '#FFFFFF',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(22, 163, 74, 0.2)'
              e.currentTarget.style.background = 'rgba(22, 163, 74, 0.01)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(15, 23, 42, 0.08)'
              e.currentTarget.style.background = '#FFFFFF'
              e.currentTarget.style.transform = 'none'
            }}
          >
            <span style={{ fontSize: '1.5rem', marginBottom: 4 }}>📅</span>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>Review Preparation Steps</div>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>Check off steps like IELTS prep, loan applications, and visa steps.</p>
          </button>
        </div>
      </div>
    </div>
  )
}
