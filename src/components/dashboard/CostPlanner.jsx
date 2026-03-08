import { useEffect, useState } from 'react'
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'

const COUNTRIES = [
    {
        id: 'de', flag: '🇩🇪', name: 'Germany', currency: 'EUR', symbol: '€',
        color: '#1a3a8c', light: '#eff6ff',
        costs: { tuition: 500, rent: 700, food: 250, transport: 90, misc: 160 },
        note: 'Most public universities charge minimal semester fees (~€150–500/semester).',
    },
    {
        id: 'us', flag: '🇺🇸', name: 'USA', currency: 'USD', symbol: '$',
        color: '#991b1b', light: '#fef2f2',
        costs: { tuition: 2500, rent: 1200, food: 400, transport: 120, misc: 230 },
        note: 'Tuition varies widely by state. Public universities are cheaper for in-state.',
    },
    {
        id: 'ca', flag: '🇨🇦', name: 'Canada', currency: 'CAD', symbol: 'CA$',
        color: '#c2410c', light: '#fff7ed',
        costs: { tuition: 2000, rent: 1100, food: 350, transport: 100, misc: 200 },
        note: 'Canada is known for affordable education relative to the US.',
    },
    {
        id: 'uk', flag: '🇬🇧', name: 'United Kingdom', currency: 'GBP', symbol: '£',
        color: '#1d4ed8', light: '#eff6ff',
        costs: { tuition: 1800, rent: 1000, food: 320, transport: 110, misc: 220 },
        note: 'London is pricier; cities like Manchester or Glasgow are more affordable.',
    },
    {
        id: 'au', flag: '🇦🇺', name: 'Australia', currency: 'AUD', symbol: 'A$',
        color: '#065f46', light: '#ecfdf5',
        costs: { tuition: 2200, rent: 1150, food: 380, transport: 130, misc: 240 },
        note: 'Cost of living varies; Sydney and Melbourne are the most expensive cities.',
    },
]

const FALLBACK = { EUR: 90.5, USD: 83.2, CAD: 61.8, GBP: 105.4, AUD: 54.6 }

export default function CostEstimator() {
    const [activeId, setActiveId] = useState('de')
    const [rates, setRates] = useState(FALLBACK)
    const [rateLoading, setRateLoading] = useState(true)
    const [rateError, setRateError] = useState(false)
    const [lastUpdated, setLastUpdated] = useState(null)

    const active = COUNTRIES.find(c => c.id === activeId)
    const inrRate = rates[active.currency] || FALLBACK[active.currency]
    const totalFC = Object.values(active.costs).reduce((a, b) => a + b, 0)
    const totalINR = Math.round(totalFC * inrRate)

    const fetchRates = async () => {
        setRateLoading(true)
        setRateError(false)
        try {
            const res = await fetch('https://api.exchangerate-api.com/v4/latest/INR')
            if (!res.ok) throw new Error()
            const data = await res.json()
            const r = {}
            COUNTRIES.forEach(c => {
                r[c.currency] = data.rates[c.currency] ? +(1 / data.rates[c.currency]).toFixed(4) : FALLBACK[c.currency]
            })
            setRates(r)
            setLastUpdated(new Date())
        } catch {
            setRates(FALLBACK)
            setRateError(true)
        } finally {
            setRateLoading(false)
        }
    }

    useEffect(() => { fetchRates() }, [])

    const costRows = [
        { key: 'tuition', label: 'Tuition / Semester', emoji: '🎓' },
        { key: 'rent', label: 'Rent (monthly)', emoji: '🏠' },
        { key: 'food', label: 'Food & Groceries', emoji: '🍱' },
        { key: 'transport', label: 'Transport', emoji: '🚌' },
        { key: 'misc', label: 'Misc & Entertainment', emoji: '🛍️' },
    ]

    return (
        <section id="cost" style={{
            padding: '96px 24px',
            background: 'linear-gradient(160deg, #f8faff 0%, #fff 55%, #f0fdf4 100%)',
        }}>
            <div className="container">

                {/* ── Header ── */}
                <div style={{ textAlign: 'center', marginBottom: 52 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: '#eff6ff', border: '1px solid #bfdbfe',
                        borderRadius: 'var(--r-full)', padding: '6px 18px', marginBottom: 18,
                    }}>
                        <span>💰</span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563eb', letterSpacing: '0.06em' }}>COST ESTIMATOR</span>
                    </div>
                    <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, color: 'var(--blue-950)', marginBottom: 10 }}>
                        Monthly Study Abroad Budget
                    </h2>
                    <p style={{ color: 'var(--gray-500)', maxWidth: 520, margin: '0 auto' }}>
                        Real-time cost breakdowns with live INR exchange rates for each destination.
                    </p>
                </div>

                {/* ── Country tabs ── */}
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
                    {COUNTRIES.map(c => (
                        <button
                            key={c.id}
                            onClick={() => setActiveId(c.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 7,
                                padding: '9px 20px', borderRadius: 'var(--r-full)',
                                fontWeight: 700, fontSize: '0.88rem',
                                border: activeId === c.id ? `2px solid ${c.color}` : '2px solid var(--gray-200)',
                                background: activeId === c.id ? c.light : 'white',
                                color: activeId === c.id ? c.color : 'var(--gray-500)',
                                cursor: 'pointer', transition: 'all 0.2s',
                            }}
                        >
                            <span style={{ fontSize: '1.1rem' }}>{c.flag}</span>{c.name}
                        </button>
                    ))}
                </div>

                {/* ── Main card ── */}
                <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28,
                    maxWidth: 900, margin: '0 auto',
                }} className="cost-grid">

                    {/* Cost breakdown */}
                    <div style={{
                        background: 'white', borderRadius: 'var(--r-xl)',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                        border: '1px solid var(--gray-100)', overflow: 'hidden',
                    }}>
                        <div style={{
                            padding: '18px 24px',
                            background: `linear-gradient(135deg, ${active.color} 0%, ${active.color}cc 100%)`,
                        }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{active.flag}</div>
                            <div style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem' }}>{active.name}</div>
                            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', marginTop: 2 }}>
                                Monthly cost breakdown
                            </div>
                        </div>

                        <div style={{ padding: '20px 24px' }}>
                            {costRows.map(row => (
                                <div key={row.key} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '10px 0', borderBottom: '1px solid var(--gray-100)',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ fontSize: '1.1rem' }}>{row.emoji}</span>
                                        <span style={{ fontSize: '0.88rem', color: 'var(--gray-600)', fontWeight: 500 }}>{row.label}</span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 700, color: active.color, fontSize: '0.95rem' }}>
                                            {active.symbol}{active.costs[row.key].toLocaleString()}
                                        </div>
                                        <div style={{ fontSize: '0.71rem', color: 'var(--gray-400)' }}>
                                            ≈ ₹{Math.round(active.costs[row.key] * inrRate).toLocaleString('en-IN')}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Total */}
                            <div style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '14px 16px', marginTop: 12,
                                background: active.light, borderRadius: 'var(--r-md)',
                                border: `1px solid ${active.color}22`,
                            }}>
                                <span style={{ fontWeight: 800, color: active.color }}>Total / Month</span>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: active.color }}>
                                        {active.symbol}{totalFC.toLocaleString()}
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', fontWeight: 600 }}>
                                        ₹{totalINR.toLocaleString('en-IN')}
                                    </div>
                                </div>
                            </div>

                            <p style={{ fontSize: '0.74rem', color: 'var(--gray-400)', marginTop: 14, lineHeight: 1.6 }}>
                                💡 {active.note}
                            </p>
                        </div>
                    </div>

                    {/* ── Live exchange rates ── */}
                    <div style={{
                        background: 'white', borderRadius: 'var(--r-xl)',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                        border: '1px solid var(--gray-100)',
                        display: 'flex', flexDirection: 'column',
                    }}>
                        {/* Rate header */}
                        <div style={{
                            padding: '18px 22px', borderBottom: '1px solid var(--gray-100)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                            <div>
                                <div style={{ fontWeight: 800, color: 'var(--blue-950)', fontSize: '0.95rem' }}>💱 Live Exchange Rates</div>
                                {lastUpdated && (
                                    <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', marginTop: 2 }}>
                                        Updated {lastUpdated.toLocaleTimeString()}
                                    </div>
                                )}
                                {rateError && (
                                    <div style={{ fontSize: '0.7rem', color: '#f59e0b' }}>⚠️ Estimated fallback rates</div>
                                )}
                            </div>
                            <button onClick={fetchRates} disabled={rateLoading} style={{
                                display: 'flex', alignItems: 'center', gap: 5,
                                background: '#eff6ff', border: '1px solid #bfdbfe',
                                borderRadius: 'var(--r-full)', padding: '5px 12px',
                                fontSize: '0.75rem', fontWeight: 600, color: '#2563eb',
                                cursor: rateLoading ? 'wait' : 'pointer',
                            }}>
                                <RefreshCw size={12} style={{ animation: rateLoading ? 'spin 1s linear infinite' : 'none' }} />
                                {rateLoading ? 'Updating…' : 'Refresh'}
                            </button>
                        </div>

                        {/* Rate rows */}
                        <div style={{ padding: '12px 22px', flex: 1 }}>
                            {COUNTRIES.map(c => {
                                const rate = rates[c.currency]
                                const isActive = c.id === activeId
                                return (
                                    <div
                                        key={c.id}
                                        onClick={() => setActiveId(c.id)}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '11px 12px', borderRadius: 'var(--r-md)',
                                            marginBottom: 6, cursor: 'pointer',
                                            background: isActive ? c.light : 'transparent',
                                            border: `1px solid ${isActive ? c.color + '33' : 'transparent'}`,
                                            transition: 'all 0.15s',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <span style={{ fontSize: '1.3rem' }}>{c.flag}</span>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--blue-950)' }}>{c.name}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>{c.currency} · {c.symbol}</div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            {rateLoading ? (
                                                <div style={{
                                                    width: 60, height: 18, background: 'var(--gray-100)',
                                                    borderRadius: 6, animation: 'pulse 1.4s infinite',
                                                }} />
                                            ) : (
                                                <>
                                                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: c.color }}>
                                                        ₹{rate?.toFixed(2)}
                                                    </div>
                                                    <div style={{ fontSize: '0.68rem', color: 'var(--gray-400)' }}>per 1 {c.currency}</div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div style={{ padding: '12px 22px', borderTop: '1px solid var(--gray-100)' }}>
                            <p style={{ fontSize: '0.7rem', color: 'var(--gray-400)', textAlign: 'center' }}>
                                Rates from ExchangeRate-API · For reference only
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── CTA to full Budget Planner ── */}
                <div style={{ textAlign: 'center', marginTop: 44 }}>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: 16 }}>
                        Want to set <strong>your own</strong> budget limits and see exactly how much you'll save?
                    </p>
                    <a href="/budget" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'linear-gradient(135deg, #1a3a8c 0%, #2563eb 100%)',
                        color: 'white', padding: '14px 32px',
                        borderRadius: 'var(--r-sm)', fontSize: '0.96rem', fontWeight: 700,
                        boxShadow: '0 6px 24px rgba(26,58,140,0.3)',
                        textDecoration: 'none', transition: 'all 0.2s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(26,58,140,0.4)' }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(26,58,140,0.3)' }}
                    >
                        🧮 Try the Budget Planner →
                    </a>
                </div>

            </div>

            <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @media (max-width: 720px) { .cost-grid { grid-template-columns: 1fr !important; } }
      `}</style>
        </section>
    )
}
