import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, TrendingUp, CheckCircle } from 'lucide-react'
import { COUNTRIES } from '../constants/countries'

// Ordered for the 3D scroll: US, UK, Germany, Canada, Australia
const ORDERED_IDS = ['usa', 'uk', 'germany', 'canada', 'australia']
const ORDERED_COUNTRIES = ORDERED_IDS.map(id => COUNTRIES.find(c => c.id === id))

const SCROLL_IMAGES = [
  '/images/mit.jpg',       // USA
  '/images/uk.jpg',        // UK
  '/images/tum.jpg',       // Germany
  '/images/uoft.jpg',      // Canada
  '/images/australia.jpg'  // Australia
]

// ----------------------------------------
// THE STATIC EXPERIENCES (Restored Grid)
// ----------------------------------------
function StaticGrid({ exploreMode }) {
  const navigate = useNavigate()
  const ref = useRef(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')) })
    }, { threshold: 0.08 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const filters = [
    { key: 'all', label: 'All 5 Countries' },
    { key: 'popular', label: '⭐ Most Popular' },
    { key: 'europe', label: '🌍 Europe' },
    { key: 'other', label: '🌏 Americas & Pacific' },
  ]

  const filtered = COUNTRIES.filter(c => {
    if (filter === 'all') return true
    if (filter === 'popular') return c.popular
    if (filter === 'europe') return ['germany', 'uk'].includes(c.id)
    if (filter === 'other') return ['usa', 'canada', 'australia'].includes(c.id)
    return true
  })

  // We add 'disintegrate' if exploreMode is true
  return (
    <div className={`static-grid-wrapper ${exploreMode ? 'disintegrate' : ''}`} ref={ref} style={{ padding: '100px 24px', position: exploreMode ? 'absolute' : 'relative', top: 0, left: 0, width: '100%', zIndex: 2, background: 'linear-gradient(to bottom, #f0fdf4, #ffffff)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{
            display: 'inline-block', background: 'var(--mint-100)',
            color: 'var(--mint-600)', fontSize: '0.72rem', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '5px 14px', borderRadius: 'var(--r-full)', marginBottom: 16,
          }} className="reveal">5 Destinations</span>
          <h2 className="reveal" style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', transitionDelay: '0.1s' }}>
            Choose Your Country
          </h2>
          <p className="reveal" style={{ color: 'var(--gray-500)', maxWidth: 520, margin: '12px auto 0', transitionDelay: '0.15s' }}>
            Each country has its own process, timeline, and costs. Studytra gives you precise guidance for all five.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="reveal" style={{
          display: 'flex', gap: 8, justifyContent: 'center',
          flexWrap: 'wrap', marginBottom: 40,
          transitionDelay: '0.2s',
        }}>
          {filters.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: '8px 18px', borderRadius: 'var(--r-full)',
              fontSize: '0.82rem', fontWeight: filter === f.key ? 700 : 500,
              background: filter === f.key ? 'var(--blue-700)' : 'white',
              color: filter === f.key ? 'white' : 'var(--gray-600)',
              border: `1.5px solid ${filter === f.key ? 'var(--blue-700)' : 'var(--gray-200)'}`,
              transition: 'all 0.2s',
            }}>{f.label}</button>
          ))}
        </div>

        {/* Country cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: filtered.length === 3 ? 'repeat(3,1fr)' : filtered.length <= 2 ? `repeat(${filtered.length},1fr)` : 'repeat(3,1fr)',
          gap: 24,
        }} className="countries-grid">
          {filtered.map((c, i) => (
            <div key={c.id} className="reveal" style={{
              transitionDelay: `${0.05 + i * 0.1}s`,
              borderRadius: 'var(--r-xl)', overflow: 'hidden',
              background: 'white',
              border: '1px solid var(--gray-200)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.25s, box-shadow 0.25s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-xl)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
            >
              {/* Header */}
              <div style={{
                background: `linear-gradient(135deg, ${c.headerColor} 0%, ${c.accentColor} 100%)`,
                padding: '28px 24px 22px',
                position: 'relative',
              }}>
                {c.popular && (
                  <div style={{
                    position: 'absolute', top: 14, right: 14,
                    display: 'flex', alignItems: 'center', gap: 4,
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white', fontSize: '0.65rem', fontWeight: 700,
                    padding: '3px 10px', borderRadius: 'var(--r-full)',
                    letterSpacing: '0.06em',
                  }}>
                    <TrendingUp size={10} /> POPULAR
                  </div>
                )}
                <div style={{ fontSize: '2.8rem', marginBottom: 12, lineHeight: 1 }}>{c.flag}</div>
                <h3 style={{
                  color: 'white', fontFamily: 'Plus Jakarta Sans',
                  fontWeight: 800, fontSize: '1.4rem', marginBottom: 6,
                }}>{c.name}</h3>
                <span style={{
                  display: 'inline-block',
                  background: 'rgba(255,255,255,0.18)',
                  color: 'rgba(255,255,255,0.92)',
                  fontSize: '0.7rem', fontWeight: 600,
                  padding: '3px 12px', borderRadius: 'var(--r-full)',
                }}>{c.tagline}</span>
              </div>

              {/* Body */}
              <div style={{ padding: '22px 24px' }}>
                <div style={{ marginBottom: 18 }}>
                  {c.highlights.map(h => (
                    <div key={h} style={{
                      display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9,
                    }}>
                      <div style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: c.accentColor, flexShrink: 0,
                      }} />
                      <span style={{ fontSize: '0.83rem', color: 'var(--gray-600)' }}>{h}</span>
                    </div>
                  ))}
                </div>

                <div style={{
                  display: 'inline-block',
                  background: c.badgeColor,
                  color: c.badgeText,
                  fontSize: '0.72rem', fontWeight: 600,
                  padding: '4px 12px', borderRadius: 'var(--r-full)',
                  marginBottom: 16,
                }}>🎯 {c.postStudy}</div>

                <button onClick={() => navigate(`/chat?country=${encodeURIComponent(c.name)}`)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  width: '100%', padding: '12px',
                  background: `linear-gradient(135deg, ${c.headerColor} 0%, ${c.accentColor} 100%)`,
                  color: 'white', borderRadius: 'var(--r-md)',
                  fontSize: '0.87rem', fontWeight: 700,
                  transition: 'opacity 0.2s',
                }}>
                  Plan for {c.name} <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ----------------------------------------
// THE DYNAMIC SCROLLER (Split Layout)
// ----------------------------------------
function SplitGlassCard({ c, image, isReverse, isActive, progressOffset }) {
  const navigate = useNavigate()
  // Parallax calculations: progressOffset is between -1 and 1
  const imageTranslateY = progressOffset * 80 // Image moves faster for parallax
  const cardTranslateY = progressOffset * 20 

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: isReverse ? 'row-reverse' : 'row',
      opacity: isActive ? 1 : 0,
      pointerEvents: isActive ? 'auto' : 'none',
      transition: 'opacity 0.8s ease',
      zIndex: isActive ? 10 : 1,
      padding: '40px',
      gap: '40px',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      
      {/* 4K Photo Parallax Side */}
      <div style={{ 
        flex: 1, 
        height: '80%', 
        maxWidth: '500px',
        borderRadius: '24px', 
        overflow: 'hidden',
        boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
        transform: `translateY(${isActive ? imageTranslateY : 0}px)`,
      }}>
        <img 
          src={image} 
          alt={c.name}
          style={{
            width: '100%',
            height: '110%',
            objectFit: 'cover',
            transform: `translateY(${-5 + (progressOffset * 10)}%)`,
          }} 
        />
      </div>

      {/* Glass Details Side */}
      <div className="glass-panel-dark" style={{ 
        flex: 1, 
        maxWidth: '500px', 
        padding: '50px',
        transform: `translateY(${isActive ? cardTranslateY : 0}px)`,
        textAlign: 'left',
      }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
             <span style={{ fontSize: '3rem', lineHeight: 1 }}>{c.flag}</span>
             <div>
               <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', opacity: 0.7, margin: 0, letterSpacing: '0.05em' }}>
                 {(c.id === 'usa' ? 'US' : c.id === 'uk' ? 'GB' : c.id === 'germany' ? 'DE' : c.id === 'canada' ? 'CA' : 'AU')} {c.name}
               </h3>
             </div>
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: '20px' }}>
            {c.topUnis[0]}
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {c.highlights.map(h => (
              <div key={h} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.accentColor }} />
                <span style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.92)', fontWeight: 500 }}>{h}</span>
              </div>
            ))}
          </div>
          
          <div style={{ marginBottom: '32px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
             <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estimated Cost</p>
             <p style={{ margin: '4px 0 0 0', fontSize: '1.4rem', color: 'white', fontWeight: 800 }}>{c.costRange}</p>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button 
              className="btn-3d"
              onClick={() => navigate(`/chat?country=${encodeURIComponent(c.name)}`)} 
              style={{
                background: `linear-gradient(135deg, ${c.headerColor} 0%, ${c.accentColor} 100%)`,
                color: 'white', padding: '14px 28px',
                borderRadius: '99px', fontSize: '1rem', fontWeight: 700,
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,0.3)',
                cursor: 'pointer',
              }}
            >
              Start Planning
            </button>
            <button 
              className="btn-3d"
              style={{
                background: 'transparent',
                color: 'white', padding: '14px 28px',
                borderRadius: '99px', fontSize: '1rem', fontWeight: 700,
                border: '1.5px solid rgba(255,255,255,0.4)',
                cursor: 'pointer',
              }}
            >
              Know More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Countries() {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Scroll listener for the container
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      // Calculate progress across the container
      const totalScrollable = rect.height - windowHeight
      const scrolled = -rect.top
      
      let progress = scrolled / totalScrollable
      if (progress < 0) progress = 0
      if (progress > 1) progress = 1
      
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Init
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const totalSections = ORDERED_COUNTRIES.length + 1 // 5 countries + 1 reveal
  const rawIndex = scrollProgress * (totalSections - 1)
  const activeIndex = Math.min(Math.floor(rawIndex + 0.5), totalSections - 1)
  const distanceToCenter = rawIndex - activeIndex
  const isFinalCTA = activeIndex === ORDERED_COUNTRIES.length

  return (
    <section 
      id="countries-scrollytelling"
      style={{ 
        position: 'relative',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        height: `${totalSections * 100}vh`,
      }}
    >
      {/* Dynamic 3D Scroller */}
      <div 
        ref={containerRef}
        style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          zIndex: 5,
        }}
      >
        <div style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          
          {/* Subtle Parallax Background Gradient Overlays */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 60%)',
            transform: `translateY(${distanceToCenter * 50}px)`,
          }} />

          {/* Safe-area wrapper */}
          <div style={{ position: 'relative', zIndex: 5, width: '100%', height: '100%' }}>
            
            {/* Split Glass Cards */}
            {ORDERED_COUNTRIES.map((c, i) => (
              <SplitGlassCard 
                key={c.id} 
                c={c} 
                image={SCROLL_IMAGES[i]}
                // US: Image Left. UK: text left (reverse). Germany: image left. Canada: text left (reverse). Aus: image left.
                isReverse={i % 2 !== 0} 
                isActive={activeIndex === i && !isFinalCTA} 
                progressOffset={distanceToCenter}
              />
            ))}

            {/* Final Reveal Panel */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%', width: '100%', maxWidth: '800px',
              transform: `translate(-50%, -50%) scale(${isFinalCTA ? 1 : 0.9})`,
              opacity: isFinalCTA ? 1 : 0, pointerEvents: isFinalCTA ? 'auto' : 'none',
              transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease',
              zIndex: 15,
            }}>
              <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--blue-950)', fontSize: '3rem', fontWeight: 800, marginBottom: '24px' }}>
                  Your Global Profile is Ready.
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'left', marginBottom: '40px', background: 'rgba(255,255,255,0.4)', padding: '24px', borderRadius: '16px' }}>
                  {[
                    'Personalized University Shortlist',
                    'Precise Living Cost Estimates',
                    'Visa Requirement Breakdown',
                    'Custom Roadmap Timeline'
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <CheckCircle size={20} color="var(--mint-600)" />
                      <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--blue-900)' }}>{item}</span>
                    </div>
                  ))}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                  <button 
                    className="btn-3d"
                    onClick={() => navigate('/chat')}
                    style={{
                      background: 'linear-gradient(135deg, var(--blue-600) 0%, var(--blue-500) 100%)',
                      color: 'white', padding: '18px 48px', borderRadius: '99px',
                      fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.05em',
                      border: '1px solid rgba(255,255,255,0.3)',
                      boxShadow: '0 12px 30px rgba(37, 99, 196, 0.4), inset 0 2px 0 rgba(255,255,255,0.4)',
                      cursor: 'pointer',
                    }}
                  >
                    START PLANNING <ArrowRight size={18} style={{ marginLeft: 8 }} />
                  </button>
                  <a 
                    href="#how-it-works" 
                    style={{ 
                      color: 'var(--blue-900)', fontSize: '1rem', fontWeight: 700, 
                      textDecoration: 'underline', textUnderlineOffset: '4px',
                      transition: 'color 0.2s'
                    }}
                  >
                    KNOW MORE
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}