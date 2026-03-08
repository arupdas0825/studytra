import { useEffect, useRef, useState } from 'react'
import { Star, Plus, X, Send } from 'lucide-react'

const DEFAULT_REVIEWS = [
  { name: 'Vikram Reddy', target: 'Germany · MSc Robotics', text: 'APS and visa checklist saved me from so many mistakes. Never needed a consultancy.', rating: 5, color: '#142d6e', initials: 'VR' },
  { name: 'Sneha Mehta', target: 'Canada · MBA', text: 'Cost estimator with INR conversion was a game-changer. Incredibly transparent.', rating: 5, color: '#7c2d12', initials: 'SM' },
  { name: 'Arjun Krishnan', target: 'USA · MS Computer Science', text: 'Complete GRE-to-I20 roadmap. Timeline planner kept me on track. Highly recommend.', rating: 5, color: '#7f1d1d', initials: 'AK' },
]

const COLORS = ['#142d6e', '#1e3a5f', '#064e3b', '#7c2d12', '#7f1d1d', '#2563b0', '#059669']

export default function Reviews() {
  const ref = useRef(null)
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('studytra_reviews') || '[]')
      return [...DEFAULT_REVIEWS, ...saved]
    } catch { return DEFAULT_REVIEWS }
  })
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', target: '', text: '', rating: 5 })
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')) })
    }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Enter your name'
    if (!form.target.trim()) e.target = 'e.g. Germany · MSc CS'
    if (form.text.trim().length < 20) e.text = 'Min 20 characters'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = () => {
    if (!validate()) return
    const newReview = {
      name: form.name.trim(),
      target: form.target.trim(),
      text: form.text.trim(),
      rating: form.rating,
      initials: form.name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      color: COLORS[reviews.length % COLORS.length],
    }
    const updated = [...reviews, newReview]
    setReviews(updated)
    const userOnly = updated.slice(DEFAULT_REVIEWS.length)
    localStorage.setItem('studytra_reviews', JSON.stringify(userOnly))
    setDone(true)
    setTimeout(() => { setShowForm(false); setDone(false); setForm({ name: '', target: '', text: '', rating: 5 }) }, 2200)
  }

  return (
    <section id="reviews" ref={ref} style={{ padding: '100px 24px', background: 'var(--white)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span style={{
            display: 'inline-block', background: '#fef3c7',
            color: '#92400e', fontSize: '0.72rem', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '5px 14px', borderRadius: 'var(--r-full)', marginBottom: 16,
          }} className="reveal">Reviews</span>
          <h2 className="reveal" style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', transitionDelay: '0.1s' }}>
            What Students Say About Studytra
          </h2>
          <div className="reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, transitionDelay: '0.15s' }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />)}
            <span style={{ fontWeight: 800, color: 'var(--blue-950)', fontSize: '1rem', marginLeft: 4 }}>4.9</span>
            <span style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>/ 5 · {reviews.length}+ reviews</span>
          </div>
        </div>

        {/* Reviews grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22, marginBottom: 40 }} className="rev-grid">
          {reviews.map(({ name, target, text, rating, color, initials }, i) => (
            <div key={i} className="reveal" style={{
              transitionDelay: `${0.04 + (i % 3) * 0.1}s`,
              background: 'var(--ivory)', borderRadius: 'var(--r-xl)',
              padding: '28px 24px', border: '1px solid var(--gray-200)',
              boxShadow: 'var(--shadow-xs)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.background = 'white' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-xs)'; e.currentTarget.style.background = 'var(--ivory)' }}
            >
              <div style={{ fontSize: '2.8rem', color: 'var(--gray-200)', fontFamily: 'Plus Jakarta Sans', lineHeight: 1, marginBottom: 6 }}>"</div>
              <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                {[...Array(rating)].map((_, j) => <Star key={j} size={13} fill="#f59e0b" color="#f59e0b" />)}
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--gray-600)', lineHeight: 1.72, marginBottom: 22 }}>{text}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '0.82rem', flexShrink: 0,
                }}>{initials}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--blue-950)' }}>{name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)' }}>{target}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Write review button */}
        {!showForm && (
          <div style={{ textAlign: 'center' }}>
            <button onClick={() => setShowForm(true)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'white', color: 'var(--blue-700)',
              border: '2px solid var(--blue-700)',
              padding: '12px 28px', borderRadius: 'var(--r-sm)',
              fontSize: '0.92rem', fontWeight: 700,
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-700)'; e.currentTarget.style.color = 'white' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'var(--blue-700)' }}
            >
              <Plus size={16} /> Write a Review
            </button>
          </div>
        )}

        {/* Review form */}
        {showForm && (
          <div style={{
            background: 'white', borderRadius: 'var(--r-xl)',
            padding: '32px', maxWidth: 540, margin: '0 auto',
            boxShadow: 'var(--shadow-xl)', border: '1px solid var(--gray-200)',
            animation: 'fadeUp 0.3s ease',
          }}>
            {done ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎉</div>
                <h3 style={{ fontFamily: 'Plus Jakarta Sans', color: 'var(--blue-950)', marginBottom: 8 }}>Thank you!</h3>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.88rem' }}>Your review is now live on the page.</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '1.1rem', color: 'var(--blue-950)' }}>Share Your Experience</h3>
                  <button onClick={() => setShowForm(false)} style={{
                    background: 'var(--gray-100)', width: 32, height: 32,
                    borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}><X size={14} color="var(--gray-600)" /></button>
                </div>

                {[
                  { key: 'name', label: 'Your Full Name', placeholder: 'e.g. Priya Sharma' },
                  { key: 'target', label: 'Country · Program', placeholder: 'e.g. Germany · MSc Data Science' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--blue-950)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
                    <input value={form[key]} onChange={e => { setForm(p => ({ ...p, [key]: e.target.value })); setErrors(p => ({ ...p, [key]: '' })) }}
                      placeholder={placeholder} style={{
                        width: '100%', padding: '11px 14px',
                        border: `1.5px solid ${errors[key] ? '#fca5a5' : 'var(--gray-200)'}`,
                        borderRadius: 'var(--r-sm)', fontSize: '0.9rem',
                        fontFamily: 'DM Sans', color: 'var(--text)', outline: 'none',
                        background: errors[key] ? '#fef9f9' : 'var(--ivory)',
                      }} />
                    {errors[key] && <span style={{ fontSize: '0.72rem', color: '#dc2626', marginTop: 4, display: 'block' }}>{errors[key]}</span>}
                  </div>
                ))}

                {/* Star rating */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--blue-950)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rating</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} onClick={() => setForm(p => ({ ...p, rating: n }))} style={{ background: 'none', padding: 2 }}>
                        <Star size={24} fill={n <= form.rating ? '#f59e0b' : 'none'} color="#f59e0b" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review text */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--blue-950)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Review</label>
                  <textarea value={form.text} onChange={e => { setForm(p => ({ ...p, text: e.target.value })); setErrors(p => ({ ...p, text: '' })) }}
                    placeholder="What helped you most? How did Studytra make your journey easier?" rows={4}
                    style={{
                      width: '100%', padding: '11px 14px',
                      border: `1.5px solid ${errors.text ? '#fca5a5' : 'var(--gray-200)'}`,
                      borderRadius: 'var(--r-sm)', fontSize: '0.9rem',
                      fontFamily: 'DM Sans', resize: 'none', lineHeight: 1.65,
                      background: errors.text ? '#fef9f9' : 'var(--ivory)', outline: 'none',
                    }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {errors.text ? <span style={{ fontSize: '0.72rem', color: '#dc2626' }}>{errors.text}</span> : <span />}
                    <span style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>{form.text.length} chars</span>
                  </div>
                </div>

                <button onClick={handleSubmit} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  width: '100%', padding: '13px',
                  background: 'linear-gradient(135deg, var(--blue-700) 0%, var(--blue-500) 100%)',
                  color: 'white', borderRadius: 'var(--r-sm)', fontSize: '0.92rem', fontWeight: 700,
                  boxShadow: '0 4px 16px rgba(26,58,140,0.25)', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                ><Send size={15} /> Submit Review</button>
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) { .rev-grid { grid-template-columns: 1fr !important; max-width: 480px; margin: 0 auto 40px; } }
      `}</style>
    </section>
  )
}