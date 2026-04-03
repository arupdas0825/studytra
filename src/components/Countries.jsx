import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { COUNTRIES } from '../constants/countries'

const ORDERED_IDS = ['usa', 'uk', 'germany', 'canada', 'australia']
const ORDERED_COUNTRIES = ORDERED_IDS.map(id => COUNTRIES.find(c => c.id === id))

const SCROLL_IMAGES = [
  '/images/mit.jpg',
  '/images/uk.jpg',
  '/images/tum.jpg',
  '/images/uoft.jpg',
  '/images/australia.jpg',
]

export default function Countries() {
  const navigate = useNavigate()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [animKey, setAnimKey] = useState(0)

  const goTo = useCallback((idx) => {
    setActiveIndex(idx)
    setAnimKey(k => k + 1)
  }, [])

  // Auto-advance every 4s, pause on hover
  useEffect(() => {
    if (isHovered) return
    const timer = setInterval(() => {
      goTo((activeIndex + 1) % ORDERED_COUNTRIES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [activeIndex, isHovered, goTo])

  const c = ORDERED_COUNTRIES[activeIndex]
  const image = SCROLL_IMAGES[activeIndex]
  const code = c.id === 'usa' ? 'US' : c.id === 'uk' ? 'GB' : c.id === 'germany' ? 'DE' : c.id === 'canada' ? 'CA' : 'AU'

  return (
    <section id="countries" style={{ padding: '60px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Main Card */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="countries-card"
          style={{
            width: '100%',
            height: 580,
            borderRadius: 24,
            position: 'relative',
            background: '#0f1c3f',
            overflow: 'hidden',
            display: 'flex',
          }}
        >
          {/* LEFT PANEL — 45% */}
          <div
            key={`info-${animKey}`}
            className="countries-left"
            style={{
              width: '45%',
              padding: '48px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 5,
              animation: 'slideInLeft 0.4s ease forwards',
            }}
          >
            {/* Country badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 99, padding: '6px 16px', marginBottom: 20, width: 'fit-content',
            }}>
              <span style={{ fontSize: '1.1rem' }}>{c.flag}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white', letterSpacing: '0.08em' }}>{code} {c.name}</span>
            </div>

            {/* University name */}
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.12,
              marginBottom: 20,
              letterSpacing: '-0.5px',
            }}>
              {c.topUnis[0]}
            </h2>

            {/* Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {c.highlights.map(h => (
                <div key={h} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: c.accentColor, flexShrink: 0,
                  }} />
                  <span style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{h}</span>
                </div>
              ))}
            </div>

            {/* Cost card */}
            <div style={{
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14, padding: '14px 18px', marginBottom: 28,
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Estimated Monthly Cost
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white', marginTop: 4 }}>
                {c.costRange}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                {c.costINR}
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate(`/chat?country=${encodeURIComponent(c.name)}`)}
                style={{
                  background: `linear-gradient(135deg, ${c.headerColor} 0%, ${c.accentColor} 100%)`,
                  color: 'white', padding: '13px 26px',
                  borderRadius: 99, fontSize: '0.9rem', fontWeight: 700,
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)' }}
              >
                Start Planning <ArrowRight size={15} />
              </button>
              <button
                onClick={() => navigate(`/chat?country=${encodeURIComponent(c.name)}`)}
                style={{
                  background: 'transparent',
                  color: 'white', padding: '13px 26px',
                  borderRadius: 99, fontSize: '0.9rem', fontWeight: 600,
                  border: '1.5px solid rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.transform = 'none' }}
              >
                Know More
              </button>
            </div>
          </div>

          {/* RIGHT PANEL — 55% image */}
          <div
            className="countries-right"
            style={{
              width: '55%',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <img
              key={`img-${animKey}`}
              src={image}
              alt={c.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '0 24px 24px 0',
                animation: 'slideInRight 0.4s ease forwards',
              }}
            />
            {/* Gradient overlay for seamless blend */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, #0f1c3f 0%, transparent 30%)',
              pointerEvents: 'none',
            }} />
          </div>

          {/* Pagination dots — bottom center */}
          <div style={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 8,
            zIndex: 10,
          }}>
            {ORDERED_COUNTRIES.map((cc, i) => (
              <button
                key={cc.id}
                onClick={() => goTo(i)}
                aria-label={`Go to ${cc.name}`}
                style={{
                  width: activeIndex === i ? 28 : 8,
                  height: 8,
                  borderRadius: activeIndex === i ? 4 : '50%',
                  background: activeIndex === i ? '#2563eb' : 'rgba(255,255,255,0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.35s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>

          {/* Prev / Next arrows */}
          <button
            onClick={() => goTo((activeIndex - 1 + ORDERED_COUNTRIES.length) % ORDERED_COUNTRIES.length)}
            aria-label="Previous country"
            style={{
              position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
              width: 42, height: 42, borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.15)', color: 'white',
              fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 10, transition: 'background 0.2s',
              padding: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >‹</button>
          <button
            onClick={() => goTo((activeIndex + 1) % ORDERED_COUNTRIES.length)}
            aria-label="Next country"
            style={{
              position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
              width: 42, height: 42, borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.15)', color: 'white',
              fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 10, transition: 'background 0.2s',
              padding: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >›</button>
        </div>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @media (max-width: 768px) {
          .countries-card {
            flex-direction: column-reverse !important;
            height: auto !important;
          }
          .countries-left {
            width: 100% !important;
            padding: 32px 24px !important;
            border-radius: 0 0 24px 24px !important;
          }
          .countries-right {
            width: 100% !important;
            height: 220px !important;
          }
          .countries-right img {
            border-radius: 24px 24px 0 0 !important;
          }
        }
      `}</style>
    </section>
  )
}