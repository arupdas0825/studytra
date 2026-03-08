import { useEffect, useState } from 'react'
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'

const COUNTRY_CURRENCIES = [
    { country: 'Germany', flag: '🇩🇪', code: 'EUR', symbol: '€', color: '#1a3a8c', lightColor: '#eff6ff' },
    { country: 'United States', flag: '🇺🇸', code: 'USD', symbol: '$', color: '#991b1b', lightColor: '#fef2f2' },
    { country: 'Canada', flag: '🇨🇦', code: 'CAD', symbol: 'CA$', color: '#c2410c', lightColor: '#fff7ed' },
    { country: 'United Kingdom', flag: '🇬🇧', code: 'GBP', symbol: '£', color: '#1d4ed8', lightColor: '#eff6ff' },
    { country: 'Australia', flag: '🇦🇺', code: 'AUD', symbol: 'A$', color: '#065f46', lightColor: '#ecfdf5' },
]

// Fallback rates (INR per 1 unit of foreign currency)
const FALLBACK_RATES = { EUR: 90.5, USD: 83.2, CAD: 61.8, GBP: 105.4, AUD: 54.6 }

export default function CurrencyExchange() {
    const [rates, setRates] = useState(FALLBACK_RATES)
    const [prevRates, setPrevRates] = useState(FALLBACK_RATES)
    const [loading, setLoading] = useState(true)
    const [lastUpdated, setLastUpdated] = useState(null)
    const [inrAmount, setInrAmount] = useState(100000)
    const [error, setError] = useState(false)

    const fetchRates = async () => {
        setLoading(true)
        setError(false)
        try {
            // Free API — no key needed
            const res = await fetch('https://api.exchangerate-api.com/v4/latest/INR')
            if (!res.ok) throw new Error('fetch failed')
            const data = await res.json()
            const newRates = {}
            COUNTRY_CURRENCIES.forEach(c => {
                newRates[c.code] = data.rates[c.code] ? +(1 / data.rates[c.code]).toFixed(4) : FALLBACK_RATES[c.code]
            })
            setPrevRates(rates)
            setRates(newRates)
            setLastUpdated(new Date())
        } catch {
            setRates(FALLBACK_RATES)
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchRates() }, [])

    const inr = Number(inrAmount) || 0

    return (
        <section id="currency" style={{
            padding: '96px 24px',
            background: 'linear-gradient(160deg, #f0f7ff 0%, #fff 60%, #f0fdf4 100%)',
        }}>
            <div className="container">
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'var(--mint-50)', border: '1px solid var(--mint-200)',
                        borderRadius: 'var(--r-full)', padding: '6px 18px', marginBottom: 20,
                    }}>
                        <span style={{ fontSize: '1rem' }}>💱</span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--mint-600)', letterSpacing: '0.06em' }}>
                            LIVE EXCHANGE RATES
                        </span>
                    </div>

                    <h2 style={{
                        fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800,
                        color: 'var(--blue-950)', marginBottom: 12,
                    }}>
                        INR → Study Abroad Currencies
                    </h2>
                    <p style={{ color: 'var(--gray-500)', fontSize: '1rem', maxWidth: 520, margin: '0 auto 20px' }}>
                        Real-time exchange rates from INR to all 5 supported study destinations.
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                        {lastUpdated && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                                Updated: {lastUpdated.toLocaleTimeString()}
                            </span>
                        )}
                        {error && (
                            <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>⚠️ Using estimated rates</span>
                        )}
                        <button
                            onClick={fetchRates}
                            disabled={loading}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                background: 'white', border: '1px solid var(--gray-200)',
                                borderRadius: 'var(--r-full)', padding: '6px 14px',
                                fontSize: '0.78rem', fontWeight: 600, color: 'var(--blue-700)',
                                cursor: loading ? 'wait' : 'pointer', transition: 'all 0.2s',
                            }}
                        >
                            <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                            {loading ? 'Updating…' : 'Refresh'}
                        </button>
                    </div>
                </div>

                {/* Rate Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: 20, marginBottom: 56,
                }}>
                    {COUNTRY_CURRENCIES.map(c => {
                        const rate = rates[c.code]
                        const prev = prevRates[c.code]
                        const up = rate > prev
                        const same = rate === prev
                        return (
                            <div key={c.code} style={{
                                background: 'white', borderRadius: 'var(--r-xl)',
                                border: `1px solid ${c.lightColor === '#eff6ff' ? 'var(--blue-100)' : '#e5e7eb'}`,
                                padding: '24px 20px', textAlign: 'center',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                cursor: 'default',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)' }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)' }}
                            >
                                <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>{c.flag}</div>
                                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray-400)', letterSpacing: '0.08em', marginBottom: 4 }}>
                                    {c.country}
                                </div>
                                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-500)', marginBottom: 10 }}>
                                    {c.code} · {c.symbol}
                                </div>

                                {loading ? (
                                    <div style={{
                                        height: 36, background: 'var(--gray-100)',
                                        borderRadius: 8, animation: 'pulse 1.5s infinite',
                                        margin: '0 auto', width: '80%',
                                    }} />
                                ) : (
                                    <>
                                        <div style={{
                                            fontSize: '1.6rem', fontWeight: 800,
                                            color: c.color, lineHeight: 1.1,
                                        }}>
                                            ₹{rate.toFixed(2)}
                                        </div>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', marginTop: 2 }}>
                                            per 1 {c.code}
                                        </div>
                                        {!same && (
                                            <div style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 3,
                                                marginTop: 8, padding: '3px 10px',
                                                borderRadius: 'var(--r-full)', fontSize: '0.7rem', fontWeight: 700,
                                                background: up ? '#dcfce7' : '#fee2e2',
                                                color: up ? '#15803d' : '#dc2626',
                                            }}>
                                                {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                                                {up ? 'Up' : 'Down'}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Converter */}
                <div style={{
                    background: 'white', borderRadius: 'var(--r-xl)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                    border: '1px solid var(--gray-200)',
                    padding: '40px 40px',
                    maxWidth: 800, margin: '0 auto',
                }}>
                    <h3 style={{
                        fontSize: '1.2rem', fontWeight: 800, color: 'var(--blue-950)',
                        marginBottom: 24, textAlign: 'center',
                    }}>
                        💸 Quick INR Converter
                    </h3>

                    {/* INR Input */}
                    <div style={{ marginBottom: 28 }}>
                        <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 8 }}>
                            Amount in INR (₹)
                        </label>
                        <input
                            type="number"
                            value={inrAmount}
                            onChange={e => setInrAmount(e.target.value)}
                            min={0}
                            style={{
                                width: '100%', padding: '14px 18px',
                                border: '1.5px solid var(--blue-200)', borderRadius: 'var(--r-md)',
                                fontSize: '1.1rem', fontWeight: 700, color: 'var(--blue-950)',
                                outline: 'none', background: 'var(--blue-50)',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    {/* Converted values grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                        gap: 14,
                    }}>
                        {COUNTRY_CURRENCIES.map(c => {
                            const converted = rates[c.code] ? (inr / rates[c.code]).toFixed(2) : '—'
                            return (
                                <div key={c.code} style={{
                                    background: '#f8faff',
                                    border: '1px solid var(--gray-100)',
                                    borderRadius: 'var(--r-lg)', padding: '16px 14px',
                                    textAlign: 'center',
                                }}>
                                    <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{c.flag}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', fontWeight: 600, marginBottom: 6 }}>{c.code}</div>
                                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: c.color }}>
                                        {c.symbol}{loading ? '…' : Number(converted).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--gray-400)', marginTop: 20 }}>
                        Rates fetched from ExchangeRate-API. For reference only — actual rates may vary slightly at banks.
                    </p>
                </div>
            </div>

            <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
        </section>
    )
}
