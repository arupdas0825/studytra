import { useEffect, useRef, useState } from 'react'
import { Star, Plus, X, Send, Loader } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AuthModal from './auth/AuthModal'
import { db } from '../lib/firebase'
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore'

const DEFAULT_REVIEWS = [
  { id: '1', name: 'Vikram Reddy', country: 'Germany', university: 'MSc Robotics', text: 'APS and visa checklist saved me from so many mistakes. Never needed a consultancy.', rating: 5, created_at: '2026-06-01T00:00:00Z' },
  { id: '2', name: 'Sneha Mehta', country: 'Canada', university: 'MBA', text: 'Cost estimator with INR conversion was a game-changer. Incredibly transparent.', rating: 5, created_at: '2026-06-10T00:00:00Z' },
  { id: '3', name: 'Arjun Krishnan', country: 'USA', university: 'MS Computer Science', text: 'Complete GRE-to-I20 roadmap. Timeline planner kept me on track. Highly recommend.', rating: 5, created_at: '2026-06-15T00:00:00Z' },
]

const COLORS = ['#4f8ef7', '#7c3aed', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#06b6d4']

export default function Reviews() {
  const ref = useRef(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', country: '', university: '', text: '', rating: 5 })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const { user } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)

  // Intersection observer for animation
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')) })
    }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  // ── Fetch Reviews from Firestore ──
  const fetchReviews = async () => {
    try {
      setLoading(true)
      const q = query(collection(db, "reviews"), orderBy("created_at", "desc"));
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((docSnap) => {
        data.push({ id: docSnap.id, ...docSnap.data() });
      });

      if (data.length > 0) {
        setReviews(data)
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

  useEffect(() => {
    fetchReviews()
  }, [])

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
    if (!user) {
      setAuthModalOpen(true)
      return
    }
    if (!validate()) return
    setSubmitting(true)
    
    const newReview = {
      name: form.name.trim(),
      country: form.country.trim(),
      university: form.university.trim(),
      text: form.text.trim(),
      rating: form.rating,
      created_at: new Date().toISOString()
    }

    // Optimistic Update: immediately prepend the new review to the list
    const originalReviews = [...reviews]
    setReviews(prev => [newReview, ...prev])
    setDone(true)
    
    setTimeout(() => {
      setShowForm(false)
      setDone(false)
      setForm({ name: '', country: '', university: '', text: '', rating: 5 })
    }, 2200)

    try {
      await addDoc(collection(db, "reviews"), newReview)
      fetchReviews() // refresh in background to sync database IDs
    } catch (err) {
      console.error('Error inserting review to Firestore:', err)
      setReviews(originalReviews) // rollback on failure
    } finally {
      setSubmitting(false)
    }
  }

  // Initials and Color generator helper
  const getInitials = (name) => {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  }

  return (
    <section id="reviews" ref={ref} style={{
      padding: '100px 24px',
      background: '#050914',
      borderTop: '1px solid rgba(79, 142, 247, 0.12)'
    }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span style={{
            display: 'inline-block', background: 'rgba(79, 142, 247, 0.1)',
            border: '1px solid rgba(79, 142, 247, 0.2)',
            color: '#4f8ef7', fontSize: '0.72rem', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '5px 14px', borderRadius: 'var(--r-full)', marginBottom: 16,
          }} className="reveal">Reviews</span>
          <h2 className="reveal" style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: '#f0f4ff', fontWeight: 800, transitionDelay: '0.1s', fontFamily: 'Plus Jakarta Sans' }}>
            What Students Say About Studytra
          </h2>
          <div className="reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, transitionDelay: '0.15s' }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />)}
            <span style={{ fontWeight: 800, color: '#f0f4ff', fontSize: '1rem', marginLeft: 4 }}>4.9</span>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>/ 5 · {reviews.length}+ reviews</span>
          </div>
        </div>

        {/* Load Skeletons */}
        {loading ? (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22, marginBottom: 40
          }} className="rev-grid">
            {[1, 2, 3].map(n => (
              <div key={n} style={{
                background: 'rgba(15, 33, 53, 0.4)', borderRadius: 20,
                border: '1px solid rgba(79, 142, 247, 0.1)', height: 220, padding: 28,
                display: 'flex', flexDirection: 'column', gap: 14
              }}>
                <div style={{ width: '40%', height: 12, background: 'rgba(79, 142, 247, 0.1)', borderRadius: 4 }} />
                <div style={{ width: '90%', height: 14, background: 'rgba(79, 142, 247, 0.1)', borderRadius: 4 }} />
                <div style={{ width: '80%', height: 14, background: 'rgba(79, 142, 247, 0.1)', borderRadius: 4 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(79, 142, 247, 0.1)' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ width: '60%', height: 10, background: 'rgba(79, 142, 247, 0.1)', borderRadius: 3 }} />
                    <div style={{ width: '40%', height: 8, background: 'rgba(79, 142, 247, 0.1)', borderRadius: 3 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Reviews Grid */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 22,
            marginBottom: 40
          }} className="rev-grid">
            {reviews.map((rev, i) => {
              const initials = getInitials(rev.name)
              const color = COLORS[i % COLORS.length]
              return (
                <div key={rev.id || i} className="reveal" style={{
                  transitionDelay: `${0.04 + (i % 3) * 0.1}s`,
                  background: 'rgba(15, 33, 53, 0.6)',
                  borderRadius: 20,
                  padding: '28px 24px',
                  border: '1px solid rgba(79, 142, 247, 0.15)',
                  boxShadow: 'var(--shadow-xs)',
                  transition: 'all 0.25s ease',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.borderColor = 'rgba(79, 142, 247, 0.3)'
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(79, 142, 247, 0.1)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.borderColor = 'rgba(79, 142, 247, 0.15)'
                    e.currentTarget.style.boxShadow = 'var(--shadow-xs)'
                  }}
                >
                  <div style={{ fontSize: '2.8rem', color: 'rgba(79, 142, 247, 0.12)', fontFamily: 'Plus Jakarta Sans', lineHeight: 1, marginBottom: -10 }}>"</div>
                  <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                    {[...Array(rev.rating)].map((_, j) => <Star key={j} size={13} fill="#f59e0b" color="#f59e0b" />)}
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.72, marginBottom: 22, minHeight: 60 }}>{rev.text}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderTop: '1px solid rgba(79, 142, 247, 0.1)', paddingTop: 14 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '0.82rem', flexShrink: 0,
                    }}>{initials}</div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#f0f4ff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rev.name}</div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {rev.country} · {rev.university}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Add review trigger */}
        {!showForm && (
          <div style={{ textAlign: 'center' }}>
            <button onClick={() => setShowForm(true)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(79, 142, 247, 0.05)', color: '#4f8ef7',
              border: '1.5px solid rgba(79, 142, 247, 0.3)',
              padding: '12px 28px', borderRadius: 10,
              fontSize: '0.92rem', fontWeight: 700,
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#4f8ef7'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#4f8ef7' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(79, 142, 247, 0.05)'; e.currentTarget.style.color = '#4f8ef7'; e.currentTarget.style.borderColor = 'rgba(79, 142, 247, 0.3)' }}
            >
              <Plus size={16} /> Write a Review
            </button>
          </div>
        )}

        {/* Modal review form overlay */}
        {showForm && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20, background: 'rgba(5, 9, 20, 0.8)',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.25s ease'
          }}>
            <div style={{
              background: '#0d1b2a', borderRadius: 24,
              padding: '36px 32px', maxWidth: 540, width: '100%',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(79, 142, 247, 0.18)',
              animation: 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}>
              {done ? (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎉</div>
                  <h3 style={{ fontFamily: 'Plus Jakarta Sans', color: '#f0f4ff', fontWeight: 800, fontSize: '1.4rem', marginBottom: 8 }}>Thank You!</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>Your review has been saved to Supabase and is now live on our landing page.</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '1.2rem', color: '#f0f4ff', margin: 0 }}>
                      Share Your Experience
                    </h3>
                    <button onClick={() => setShowForm(false)} style={{
                      background: 'rgba(79, 142, 247, 0.1)', width: 32, height: 32,
                      borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', border: 'none'
                    }}><X size={14} color="#94a3b8" /></button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#f0f4ff', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
                      <input 
                        value={form.name} 
                        onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: '' })) }}
                        placeholder="e.g. Priya Sharma" 
                        style={{ width: '100%', borderColor: errors.name ? '#ef4444' : 'rgba(79, 142, 247, 0.15)' }} 
                      />
                      {errors.name && <span style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: 4, display: 'block' }}>{errors.name}</span>}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#f0f4ff', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target Country</label>
                        <input 
                          value={form.country} 
                          onChange={e => { setForm(p => ({ ...p, country: e.target.value })); setErrors(p => ({ ...p, country: '' })) }}
                          placeholder="e.g. Austria" 
                          style={{ width: '100%', borderColor: errors.country ? '#ef4444' : 'rgba(79, 142, 247, 0.15)' }} 
                        />
                        {errors.country && <span style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: 4, display: 'block' }}>{errors.country}</span>}
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#f0f4ff', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>University / Course</label>
                        <input 
                          value={form.university} 
                          onChange={e => { setForm(p => ({ ...p, university: e.target.value })); setErrors(p => ({ ...p, university: '' })) }}
                          placeholder="e.g. TU Wien" 
                          style={{ width: '100%', borderColor: errors.university ? '#ef4444' : 'rgba(79, 142, 247, 0.15)' }} 
                        />
                        {errors.university && <span style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: 4, display: 'block' }}>{errors.university}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#f0f4ff', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rating</label>
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
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#f0f4ff', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Review</label>
                    <textarea 
                      value={form.text} 
                      onChange={e => { setForm(p => ({ ...p, text: e.target.value })); setErrors(p => ({ ...p, text: '' })) }}
                      placeholder="What helped you most? How did Studytra make your journey easier?" 
                      rows={4}
                      style={{
                        width: '100%', resize: 'none', lineHeight: 1.65,
                        borderColor: errors.text ? '#ef4444' : 'rgba(79, 142, 247, 0.15)'
                      }} 
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      {errors.text ? <span style={{ fontSize: '0.72rem', color: '#ef4444' }}>{errors.text}</span> : <span />}
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{form.text.length} chars</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      width: '100%', padding: '14px',
                      background: 'linear-gradient(135deg, #4f8ef7 0%, #7c3aed 100%)',
                      color: 'white', borderRadius: 12, fontSize: '0.92rem', fontWeight: 700,
                      boxShadow: '0 4px 16px rgba(79,142,247,0.25)', transition: 'all 0.2s',
                      cursor: submitting ? 'wait' : 'pointer', border: 'none'
                    }}
                    onMouseEnter={e => { if(!submitting) e.currentTarget.style.transform = 'translateY(-1px)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
                  >
                    {submitting ? (
                      <>
                        <Loader size={15} className="spin-loader" /> Saving Review...
                      </>
                    ) : (
                      <>
                        <Send size={15} /> Submit Review
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .spin-loader { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        @media (max-width: 900px) {
          .rev-grid { grid-template-columns: 1fr !important; max-width: 480px; margin: 0 auto 40px; }
        }
      `}</style>
    </section>
  )
}