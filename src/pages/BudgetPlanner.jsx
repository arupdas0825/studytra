import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, PiggyBank, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'

const COUNTRIES = [
    { id: 'de', flag: '🇩🇪', name: 'Germany', currency: 'EUR', symbol: '€', color: '#1a3a8c', inrRate: 90.5 },
    { id: 'us', flag: '🇺🇸', name: 'United States', currency: 'USD', symbol: '$', color: '#991b1b', inrRate: 83.2 },
    { id: 'ca', flag: '🇨🇦', name: 'Canada', currency: 'CAD', symbol: 'CA$', color: '#c2410c', inrRate: 61.8 },
    { id: 'uk', flag: '🇬🇧', name: 'United Kingdom', currency: 'GBP', symbol: '£', color: '#1d4ed8', inrRate: 105.4 },
    { id: 'au', flag: '🇦🇺', name: 'Australia', currency: 'AUD', symbol: 'A$', color: '#065f46', inrRate: 54.6 },
]

const DEFAULTS = {
    de: { tuition: 500, rent: 700, food: 250, transport: 90, entertainment: 160, income: 2500 },
    us: { tuition: 2500, rent: 1200, food: 400, transport: 120, entertainment: 230, income: 5000 },
    ca: { tuition: 2000, rent: 1100, food: 350, transport: 100, entertainment: 200, income: 4000 },
    uk: { tuition: 1800, rent: 1000, food: 320, transport: 110, entertainment: 220, income: 3800 },
    au: { tuition: 2200, rent: 1150, food: 380, transport: 130, entertainment: 240, income: 4500 },
}

const CATEGORIES = [
    { key: 'tuition', label: 'Tuition / Semester', emoji: '🎓', tip: 'Per month equivalent of your semester fee', max: 5000 },
    { key: 'rent', label: 'Rent & Utilities', emoji: '🏠', tip: 'Room rent + electricity + internet', max: 4000 },
    { key: 'food', label: 'Food & Groceries', emoji: '🍱', tip: 'Cooking + eating out', max: 2000 },
    { key: 'transport', label: 'Transport', emoji: '🚌', tip: 'Public transport / bike', max: 500 },
    { key: 'entertainment', label: 'Entertainment', emoji: '🎮', tip: 'Movies, gym, outings, subscriptions', max: 1000 },
]

const SAVING_TIPS = {
    tuition: 'Apply for DAAD, Chevening, or Canada scholarships to cut tuition by 50–100%.',
    rent: 'Opt for student dormitories (Studentenwohnheim / dorms) — 30–50% cheaper.',
    food: 'Cook at home 5 days/week and batch-cook on weekends.',
    transport: 'Get a semester public-transport pass — often included in German university fees.',
    entertainment: 'Use student discounts on museums, streaming, and sports memberships.',
}

const BAR_COLORS = ['#2563eb', '#059669', '#f59e0b', '#7c3aed', '#db2777']

function Slider({ value, min = 0, max, step = 10, color, onChange }) {
    const pct = ((value - min) / (max - min)) * 100
    return (
        <div style={{ position: 'relative', height: 6, marginTop: 8 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 99, background: 'var(--gray-100)' }} />
            <div style={{
                position: 'absolute', top: 0, left: 0, bottom: 0, width: `${pct}%`,
                borderRadius: 99,
                background: `linear-gradient(90deg, ${color}88 0%, ${color} 100%)`,
                transition: 'width 0.1s',
            }} />
            <input type="range" min={min} max={max} step={step} value={value}
                onChange={e => onChange(Number(e.target.value))}
                style={{ position: 'absolute', inset: 0, width: '100%', opacity: 0, cursor: 'pointer', height: '100%', zIndex: 2 }}
            />
            <div style={{
                position: 'absolute', top: '50%', left: `${pct}%`,
                transform: 'translate(-50%, -50%)',
                width: 18, height: 18, borderRadius: '50%',
                background: color, border: '3px solid white',
                boxShadow: `0 2px 8px ${color}55`, pointerEvents: 'none',
            }} />
        </div>
    )
}

/* ── Compact exchange rate ticker ──────────────────────────────────────────── */
function RateTicker({ rates }) {
    const [open, setOpen] = useState(false)
    const active = COUNTRIES.filter(c => rates[c.currency])
    if (!active.length) return null

    return (
        <div style={{ position: 'relative' }}>
            {/* Compact pill */}
            <button
                onClick={() => setOpen(o => !o)}
                style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: open ? '#1e40af' : '#1a3a8c',
                    color: 'white', borderRadius: 'var(--r-full)',
                    padding: '6px 14px', fontSize: '0.78rem', fontWeight: 700,
                    cursor: 'pointer', transition: 'background 0.2s',
                    boxShadow: '0 2px 10px rgba(26,58,140,0.25)',
                    border: 'none',
                }}
            >
                <span style={{ fontSize: '0.9rem' }}>💱</span>
                Live Rates
                <div style={{
                    width: 6, height: 6, borderRadius: '50%', background: '#34d399',
                    animation: 'pulse-dot 2s infinite',
                }} />
            </button>

            {/* Dropdown panel */}
            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                    background: 'white', borderRadius: 16,
                    boxShadow: '0 12px 48px rgba(0,0,0,0.18)',
                    border: '1px solid var(--gray-100)',
                    padding: '14px 16px', minWidth: 220,
                    animation: 'fadeUp 0.18s ease', zIndex: 9999,
                }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--gray-400)', letterSpacing: '0.08em', marginBottom: 10 }}>
                        INR EXCHANGE RATES
                    </div>
                    {COUNTRIES.map(c => (
                        <div key={c.id} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '7px 0',
                            borderBottom: '1px solid var(--gray-100)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: '1.1rem' }}>{c.flag}</span>
                                <div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--blue-950)' }}>{c.currency}</div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--gray-400)' }}>{c.name}</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: c.color }}>
                                    ₹{(rates[c.currency] || c.inrRate).toFixed(2)}
                                </div>
                                <div style={{ fontSize: '0.62rem', color: 'var(--gray-400)' }}>per 1 {c.currency}</div>
                            </div>
                        </div>
                    ))}
                    <div style={{ fontSize: '0.62rem', color: 'var(--gray-400)', textAlign: 'center', marginTop: 8 }}>
                        Live · ExchangeRate-API
                    </div>
                </div>
            )}
        </div>
    )
}

/* ══════════════════════════════════════════════════════════════════════════ */
export default function BudgetPlanner() {
    const navigate = useNavigate()
    const [countryId, setCountryId] = useState('de')
    const [budget, setBudget] = useState(DEFAULTS.de)
    const [rates, setRates] = useState({})
    const [rateLoading, setRateLoading] = useState(true)

    const country = COUNTRIES.find(c => c.id === countryId)
    const inrRate = rates[country.currency] || country.inrRate

    const loadRates = () => {
        setRateLoading(true)
        fetch('https://api.exchangerate-api.com/v4/latest/INR')
            .then(r => r.json())
            .then(data => {
                const r = {}
                COUNTRIES.forEach(c => {
                    r[c.currency] = data.rates[c.currency] ? +(1 / data.rates[c.currency]).toFixed(4) : c.inrRate
                })
                setRates(r)
            })
            .catch(() => { })
            .finally(() => setRateLoading(false))
    }

    useEffect(() => { loadRates() }, [])

    const changeCountry = (id) => { setCountryId(id); setBudget(DEFAULTS[id]) }
    const setField = (key, val) => setBudget(p => ({ ...p, [key]: val }))

    const totalSpend = CATEGORIES.reduce((s, c) => s + budget[c.key], 0)
    const savings = budget.income - totalSpend
    const savingsPct = budget.income > 0 ? Math.round((savings / budget.income) * 100) : 0
    const inSurplus = savings >= 0
    const toINR = (fc) => Math.round(fc * inrRate).toLocaleString('en-IN')

    const breakdown = CATEGORIES.map(c => ({
        ...c, value: budget[c.key],
        pct: totalSpend > 0 ? Math.round((budget[c.key] / totalSpend) * 100) : 0,
    }))

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f0f7ff 0%, #fff 60%, #f0fdf4 100%)' }}>

            {/* ── Sticky top bar ── */}
            <div style={{
                position: 'sticky', top: 0, zIndex: 200,
                background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(14px)',
                borderBottom: '1px solid var(--gray-200)', padding: '0 24px',
            }}>
                <div className="container" style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', height: 64,
                }}>
                    {/* Left: back */}
                    <button onClick={() => navigate('/')} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        color: 'var(--blue-700)', fontWeight: 600, fontSize: '0.9rem',
                        background: 'none', cursor: 'pointer', border: 'none',
                    }}>
                        <ArrowLeft size={18} /> Back to Home
                    </button>

                    {/* Centre: title */}
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '1.1rem', color: 'var(--blue-950)' }}>
                        💰 Budget Planner
                    </div>

                    {/* Right: live rate ticker */}
                    <RateTicker rates={rates} />
                </div>
            </div>

            <div className="container" style={{ padding: '40px 24px 80px' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: '#eff6ff', border: '1px solid #bfdbfe',
                        borderRadius: 'var(--r-full)', padding: '6px 18px', marginBottom: 16,
                    }}>
                        <PiggyBank size={14} color="#2563eb" />
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563eb' }}>SMART BUDGET CALCULATOR</span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, color: 'var(--blue-950)', marginBottom: 10 }}>
                        Plan Your Monthly Budget
                    </h1>
                    <p style={{ color: 'var(--gray-500)', maxWidth: 520, margin: '0 auto' }}>
                        Set your own spending limits for each category — see exactly how much you'll save each month.
                    </p>
                </div>

                {/* Country tabs */}
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
                    {COUNTRIES.map(c => (
                        <button key={c.id} onClick={() => changeCountry(c.id)} style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '9px 18px', borderRadius: 'var(--r-full)', fontWeight: 700, fontSize: '0.88rem',
                            border: countryId === c.id ? `2px solid ${c.color}` : '2px solid var(--gray-200)',
                            background: countryId === c.id ? `${c.color}12` : 'white',
                            color: countryId === c.id ? c.color : 'var(--gray-500)',
                            cursor: 'pointer', transition: 'all 0.2s',
                        }}>
                            <span style={{ fontSize: '1.1rem' }}>{c.flag}</span>{c.name}
                        </button>
                    ))}
                </div>

                {/* ── Main grid ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28, alignItems: 'start' }} className="budget-grid">

                    {/* ═══ Left: sliders ═══ */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                        {/* Income */}
                        <div style={{
                            background: 'white', borderRadius: 'var(--r-xl)',
                            border: `1.5px solid ${country.color}44`,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.06)', padding: '24px 28px',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                <div>
                                    <div style={{ fontWeight: 800, color: 'var(--blue-950)', fontSize: '1rem' }}>💵 Monthly Income / Scholarship</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 2 }}>Part-time job, scholarship, or family support</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 800, fontSize: '1.4rem', color: country.color }}>{country.symbol}{budget.income.toLocaleString()}</div>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)' }}>≈ ₹{toINR(budget.income)}</div>
                                </div>
                            </div>
                            <Slider value={budget.income} min={500} max={10000} step={50} color={country.color} onChange={v => setField('income', v)} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--gray-300)', marginTop: 6 }}>
                                <span>{country.symbol}500</span><span>{country.symbol}10,000</span>
                            </div>
                        </div>

                        {/* Expense sliders */}
                        {CATEGORIES.map((cat, idx) => (
                            <div key={cat.key} style={{
                                background: 'white', borderRadius: 'var(--r-xl)',
                                border: '1px solid var(--gray-100)',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: '20px 28px',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <span style={{ fontSize: '1.4rem' }}>{cat.emoji}</span>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--blue-950)' }}>{cat.label}</div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)' }}>{cat.tip}</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', minWidth: 90 }}>
                                        <input
                                            type="number" value={budget[cat.key]} min={0} max={cat.max}
                                            onChange={e => setField(cat.key, Math.min(cat.max, Math.max(0, Number(e.target.value))))}
                                            style={{
                                                width: 90, padding: '5px 8px', textAlign: 'right',
                                                border: `1.5px solid ${BAR_COLORS[idx]}44`,
                                                borderRadius: 8, fontWeight: 800, fontSize: '1rem',
                                                color: BAR_COLORS[idx], background: `${BAR_COLORS[idx]}08`, outline: 'none',
                                            }}
                                        />
                                        <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', marginTop: 2 }}>≈ ₹{toINR(budget[cat.key])}</div>
                                    </div>
                                </div>
                                <Slider value={budget[cat.key]} max={cat.max} step={10} color={BAR_COLORS[idx]} onChange={v => setField(cat.key, v)} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--gray-300)', marginTop: 5 }}>
                                    <span>{country.symbol}0</span><span>{country.symbol}{cat.max.toLocaleString()}</span>
                                </div>
                                <div style={{
                                    marginTop: 10, padding: '8px 12px',
                                    background: `${BAR_COLORS[idx]}08`, borderRadius: 8,
                                    fontSize: '0.73rem', color: 'var(--gray-500)',
                                    borderLeft: `3px solid ${BAR_COLORS[idx]}55`,
                                }}>
                                    💡 {SAVING_TIPS[cat.key]}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ═══ Right: sticky summary column ═══ */}
                    <div style={{
                        position: 'sticky',
                        top: 80,          /* clears the 64px navbar */
                        display: 'flex', flexDirection: 'column', gap: 18,
                        maxHeight: 'calc(100vh - 96px)',
                        overflowY: 'auto',
                    }} className="right-panel">

                        {/* Savings card */}
                        <div style={{
                            background: inSurplus
                                ? 'linear-gradient(135deg, #052e16 0%, #065f46 100%)'
                                : 'linear-gradient(135deg, #450a0a 0%, #991b1b 100%)',
                            borderRadius: 'var(--r-xl)', padding: '24px 22px', color: 'white',
                            boxShadow: inSurplus ? '0 8px 32px rgba(5,150,105,0.3)' : '0 8px 32px rgba(153,27,27,0.3)',
                            flexShrink: 0,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                {inSurplus ? <CheckCircle size={18} color="#34d399" /> : <AlertCircle size={18} color="#fca5a5" />}
                                <span style={{ fontWeight: 700, fontSize: '0.88rem', opacity: 0.85 }}>
                                    {inSurplus ? 'Monthly Savings' : 'Budget Deficit'}
                                </span>
                            </div>

                            <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '2.6rem', lineHeight: 1 }}>
                                {inSurplus ? '+' : '-'}{country.symbol}{Math.abs(savings).toLocaleString()}
                            </div>
                            <div style={{ opacity: 0.65, fontSize: '0.82rem', marginTop: 4, marginBottom: 16 }}>
                                ≈ {inSurplus ? '+' : '−'}₹{Math.abs(Math.round(savings * inrRate)).toLocaleString('en-IN')} / month
                            </div>

                            {/* Savings rate bar */}
                            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 14, marginBottom: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.78rem', opacity: 0.75 }}>
                                    <span>Savings Rate</span>
                                    <span style={{ fontWeight: 800, color: inSurplus ? '#34d399' : '#fca5a5' }}>{Math.max(0, savingsPct)}%</span>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 99, height: 7, overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${Math.max(0, Math.min(100, savingsPct))}%`, height: '100%',
                                        background: inSurplus ? '#34d399' : '#fca5a5',
                                        borderRadius: 99, transition: 'width 0.4s ease',
                                    }} />
                                </div>
                                <div style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: 5 }}>
                                    {savingsPct >= 20 ? '🌟 Excellent saving rate!'
                                        : savingsPct >= 10 ? '👍 Good — aim for 20%'
                                            : inSurplus ? '⚠️ Low savings — trim discretionary spend'
                                                : '🔴 Over budget — use sliders to adjust'}
                                </div>
                            </div>

                            {/* Income / Spend */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px' }}>
                                    <div style={{ fontSize: '0.67rem', opacity: 0.6, marginBottom: 3 }}>Income</div>
                                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>{country.symbol}{budget.income.toLocaleString()}</div>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px' }}>
                                    <div style={{ fontSize: '0.67rem', opacity: 0.6, marginBottom: 3 }}>Total Spend</div>
                                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>{country.symbol}{totalSpend.toLocaleString()}</div>
                                </div>
                            </div>

                            {/* Yearly */}
                            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 14px' }}>
                                <div style={{ fontSize: '0.68rem', opacity: 0.65, marginBottom: 3 }}>📅 Yearly savings projection</div>
                                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                                    {country.symbol}{(Math.max(0, savings) * 12).toLocaleString()}
                                    <span style={{ fontSize: '0.73rem', fontWeight: 400, opacity: 0.7 }}>
                                        {' '}≈ ₹{(Math.max(0, Math.round(savings * inrRate)) * 12).toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ── Spending breakdown — same sticky column, always visible ── */}
                        <div style={{
                            background: 'white', borderRadius: 'var(--r-xl)',
                            border: '1px solid var(--gray-100)',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.05)', padding: '20px 20px',
                            flexShrink: 0,
                        }}>
                            <div style={{ fontWeight: 800, color: 'var(--blue-950)', marginBottom: 14, fontSize: '0.92rem' }}>
                                📊 Spending Breakdown
                            </div>
                            {breakdown.map((cat, idx) => (
                                <div key={cat.key} style={{ marginBottom: 10 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-700)' }}>
                                            {cat.emoji} {cat.label}
                                        </span>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: BAR_COLORS[idx] }}>
                                            {cat.pct}%
                                        </span>
                                    </div>
                                    <div style={{ background: 'var(--gray-100)', borderRadius: 99, height: 6, overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${cat.pct}%`, height: '100%',
                                            background: BAR_COLORS[idx], borderRadius: 99,
                                            transition: 'width 0.3s ease',
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <button onClick={() => navigate('/chat')} style={{
                            background: 'linear-gradient(135deg, var(--blue-700) 0%, var(--blue-500) 100%)',
                            color: 'white', padding: '15px 24px', borderRadius: 'var(--r-md)',
                            fontWeight: 700, fontSize: '0.92rem',
                            boxShadow: '0 6px 20px rgba(26,58,140,0.3)',
                            cursor: 'pointer', transition: 'all 0.2s', width: '100%', flexShrink: 0,
                            border: 'none',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(26,58,140,0.4)' }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(26,58,140,0.3)' }}
                        >
                            🚀 Get My Personalized AI Plan →
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 860px) {
          .budget-grid { grid-template-columns: 1fr !important; }
          .right-panel { position: static !important; max-height: none !important; overflow-y: visible !important; }
        }
        .right-panel::-webkit-scrollbar { width: 4px; }
        .right-panel::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
        input[type=range]::-webkit-slider-thumb { appearance: none; width: 0; height: 0; }
        input[type=range]::-moz-range-thumb { width: 0; height: 0; border: none; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-dot { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.5); } }
      `}</style>
        </div>
    )
}
