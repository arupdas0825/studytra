import { useEffect, useRef, useState } from 'react'
import { Star, Plus, X, Send, Loader } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { db } from '../lib/firebase'
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore'

const DEFAULT_REVIEWS = [
  { id: '1', name: 'Vikram Reddy', country: 'Germany', university: 'MSc Robotics', text: 'APS and visa checklist saved me from so many mistakes. Never needed a consultancy.', rating: 5, created_at: '2026-06-01T00:00:00Z' },
  { id: '2', name: 'Sneha Mehta', country: 'Canada', university: 'MBA', text: 'Cost estimator with INR conversion was a game-changer. Incredibly transparent.', rating: 5, created_at: '2026-06-10T00:00:00Z' },
  { id: '3', name: 'Arjun Krishnan', country: 'USA', university: 'MS Computer Science', text: 'Complete GRE-to-I20 roadmap. Timeline planner kept me on track. Highly recommend.', rating: 5, created_at: '2026-06-15T00:00:00Z' },
]

const COLORS = ['#1d3461', '#2d5498', '#b8922a', '#059669', '#0891b2', '#7c3aed', '#1d3461']

export default function Reviews() {
  const ref = useRef(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', country: '', university: '', text: '', rating: 5 })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const { user, setAuthModalOpen } = useAuth()

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.sr').forEach(el => el.classList.add('sr-visible'))
        }
      })
    }, { threshold: 0.08 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const q = query(collection(db, 'reviews'), orderBy('created_at', 'desc'))
      const snap = await getDocs(q)
      if (!snap.empty) {
        setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } else {
        setReviews(DEFAULT_REVIEWS)
      }
    } catch (err) {
      console.warn('Could not load reviews from Firestore. Using defaults.', err)
      setReviews(DEFAULT_REVIEWS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReviews() }, [])

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Enter your name'
    if (!form.country.trim()) e.country = 'e.g. Germany'
    if (!form.university.trim()) e.university = 'e.g. TU Wien or MSc CS'
    if (form.text.trim().length < 20) e.text = 'Min 20 characters'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async () => {
    if (!user) { setAuthModalOpen(true); return }
    if (!validate()) return
    setSubmitting(true)

    const newReview = {
      name: form.name.trim(), country: form.country.trim(),
      university: form.university.trim(), text: form.text.trim(),
      rating: form.rating, created_at: new Date().toISOString()
    }

    const originalReviews = [...reviews]
    setReviews(prev => [newReview, ...prev])
    setDone(true)
    setTimeout(() => { setShowForm(false); setDone(false); setForm({ name: '', country: '', university: '', text: '', rating: 5 }) }, 1200)

    try {
      await addDoc(collection(db, 'reviews'), newReview)
      fetchReviews()
    } catch (err) {
      console.error('Failed to save review:', err)
      setReviews(originalReviews)
      setDone(false)
    } finally {
      setSubmitting(false)
    }
  }

  const getInitials = (n) => {
    if (!n) return '?'
    const parts = n.trim().split(/\s+/)
    return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : n[0].toUpperCase()
  }

  const handleWriteReviewClick = () => {
    if (!user) setAuthModalOpen(true)
    else setShowForm(true)
  }

  return (
    <section
      id="reviews"
      ref={ref}
      style={{
        padding: '108px 24px',
        background: '#f7f5f0',
        borderTop: '1px solid rgba(26,20,8,0.07)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Depth glows */}
      <div style={{
        position: 'absolute', top: '20%', left: '-6%',
        width: 420, height: 420, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(29,52,97,0.04) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="sr" style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="section-badge">Testimonials</span>
          <h2 className="section-headline" style={{ textAlign: 'center' }}>
            Loved by Indian Students.
          </h2>
          <div className="gold-rule" />
          <p className="section-subtext" style={{ textAlign: 'center' }}>
            Hear from students who built their roadmap independently and secured admissions.
          </p>
        </div>

        {/* Shimmer skeleton */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 52 }} className="rev-grid">
            {[1, 2, 3].map(i => (
              <div key={i} className="shimmer-wrapper" style={{
                background: '#fff', borderRadius: 18, padding: '28px 24px',
                height: 215, border: '1px solid rgba(26,20,8,0.08)',
                boxShadow: '0 2px 8px rgba(26,20,8,0.04)',
              }}>
                <div style={{ width: '40%', height: 10, background: '#eae7df', borderRadius: 4 }} />
                <div style={{ width: '90%', height: 13, background: '#eae7df', borderRadius: 4, marginTop: 20 }} />
                <div style={{ width: '80%', height: 13, background: '#eae7df', borderRadius: 4, marginTop: 10 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 44 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#eae7df' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ width: '60%', height: 9, background: '#eae7df', borderRadius: 3 }} />
                    <div style={{ width: '40%', height: 7, background: '#eae7df', borderRadius: 3, marginTop: 6 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 52 }} className="rev-grid">
            {reviews.map((rev, i) => {
              const initials = getInitials(rev.name)
              const color = COLORS[i % COLORS.length]
              return (
                <div
                  key={rev.id || i}
                  className={`testimonial-card sr sr-delay-${Math.min(i % 3 + 1, 4)}`}
                >
                  {/* Stars */}
                  <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                    {[...Array(rev.rating)].map((_, j) => <Star key={j} size={13} fill="#f59e0b" color="#f59e0b" />)}
                  </div>

                  {/* Text */}
                  <p style={{
                    fontSize: '0.88rem', color: 'var(--text-secondary)',
                    lineHeight: 1.72, marginBottom: 22, minHeight: 60,
                    fontStyle: 'italic',
                  }}>
                    "{rev.text}"
                  </p>

                  {/* Author row */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    borderTop: '1px solid rgba(26,20,8,0.07)', paddingTop: 14,
                  }}>
                    <div className="avatar-chip" style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)` }}>
                      {initials}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{
                        fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        fontFamily: 'var(--font-ui)',
                      }}>
                        {rev.name}
                      </div>
                      <div style={{
                        fontSize: '0.74rem', color: 'var(--text-secondary)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {rev.country} · {rev.university}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Write a Review CTA */}
        {!showForm && (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleWriteReviewClick}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.85)',
                color: 'var(--navy)',
                border: '1.5px solid rgba(29,52,97,0.16)',
                padding: '12px 28px', borderRadius: 'var(--radius-pill)',
                fontSize: '0.92rem', fontWeight: 700,
                fontFamily: 'var(--font-ui)',
                transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(26,20,8,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--gradient-primary)'
                e.currentTarget.style.color = 'white'
                e.currentTarget.style.borderColor = 'transparent'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(29,52,97,0.28)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.85)'
                e.currentTarget.style.color = 'var(--navy)'
                e.currentTarget.style.borderColor = 'rgba(29,52,97,0.16)'
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(26,20,8,0.06), inset 0 1px 0 rgba(255,255,255,0.9)'
              }}
            >
              <Plus size={16} /> Write a Review
            </button>
          </div>
        )}

        {/* Review Form Modal */}
        {showForm && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
            background: 'rgba(26,20,8,0.40)',
            backdropFilter: 'blur(18px)',
            animation: 'authFadeIn 0.25s ease',
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.90)',
              backdropFilter: 'blur(40px) saturate(2)',
              borderRadius: 28,
              padding: '36px 32px',
              maxWidth: 540, width: '100%',
              boxShadow: '0 2px 0 rgba(255,255,255,0.98) inset, 0 32px 80px rgba(26,20,8,0.18)',
              border: '1px solid rgba(255,255,255,0.95)',
              animation: 'authCardIn 0.4s cubic-bezier(0.34,1.4,0.64,1)',
            }}>
              {done ? (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎉</div>
                  <h3 style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-primary)', fontWeight: 800, fontSize: '1.4rem', marginBottom: 8 }}>Thank You!</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>Your review has been saved and is now live.</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h3 style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>
                      Share Your Experience
                    </h3>
                    <button
                      onClick={() => setShowForm(false)}
                      style={{
                        background: 'rgba(26,20,8,0.06)', width: 32, height: 32,
                        borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', border: '1px solid rgba(26,20,8,0.08)',
                      }}
                    >
                      <X size={14} color="var(--text-secondary)" />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14, marginBottom: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Full Name</label>
                      <input
                        value={form.name}
                        onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: '' })) }}
                        placeholder="e.g. Priya Sharma"
                        style={{ width: '100%', borderColor: errors.name ? '#ef4444' : undefined }}
                      />
                      {errors.name && <span style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: 4, display: 'block' }}>{errors.name}</span>}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Country</label>
                        <input
                          value={form.country}
                          onChange={e => { setForm(p => ({ ...p, country: e.target.value })); setErrors(p => ({ ...p, country: '' })) }}
                          placeholder="e.g. Austria"
                          style={{ width: '100%', borderColor: errors.country ? '#ef4444' : undefined }}
                        />
                        {errors.country && <span style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: 4, display: 'block' }}>{errors.country}</span>}
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>University / Course</label>
                        <input
                          value={form.university}
                          onChange={e => { setForm(p => ({ ...p, university: e.target.value })); setErrors(p => ({ ...p, university: '' })) }}
                          placeholder="e.g. TU Wien"
                          style={{ width: '100%', borderColor: errors.university ? '#ef4444' : undefined }}
                        />
                        {errors.university && <span style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: 4, display: 'block' }}>{errors.university}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Stars */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Rating</label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} onClick={() => setForm(p => ({ ...p, rating: n }))} style={{ background: 'none', padding: 2, border: 'none', cursor: 'pointer' }}>
                          <Star size={24} fill={n <= form.rating ? '#f59e0b' : 'none'} color="#f59e0b" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your Review</label>
                    <textarea
                      value={form.text}
                      onChange={e => { setForm(p => ({ ...p, text: e.target.value })); setErrors(p => ({ ...p, text: '' })) }}
                      placeholder="What helped you most? How did Studytra make your journey easier?"
                      rows={4}
                      style={{
                        width: '100%', resize: 'none', lineHeight: 1.65,
                        borderColor: errors.text ? '#ef4444' : undefined,
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      {errors.text ? <span style={{ fontSize: '0.72rem', color: '#ef4444' }}>{errors.text}</span> : <span />}
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{form.text.length} chars</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      width: '100%', padding: '14px',
                      background: 'var(--gradient-primary)',
                      color: 'white', borderRadius: 14,
                      fontSize: '0.92rem', fontWeight: 700,
                      fontFamily: 'var(--font-ui)',
                      boxShadow: '0 4px 18px rgba(29,52,97,0.28), inset 0 1px 0 rgba(255,255,255,0.12)',
                      transition: 'all 0.2s', cursor: submitting ? 'wait' : 'pointer', border: 'none',
                    }}
                    onMouseEnter={e => { if (!submitting) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(29,52,97,0.36)' } }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 18px rgba(29,52,97,0.28)' }}
                  >
                    {submitting
                      ? <><Loader size={15} className="spin-loader" /> Saving Review...</>
                      : <><Send size={15} /> Submit Review</>
                    }
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .spin-loader { animation: spin 0.9s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .rev-grid { grid-template-columns: 1fr !important; max-width: 480px; margin: 0 auto 40px !important; }
        }
      `}</style>
    </section>
  )
}