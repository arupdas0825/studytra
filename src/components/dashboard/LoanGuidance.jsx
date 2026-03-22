import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Navbar'

// ─────────────────────────────────────────────────────────────────
//  VERIFIED BANK DATA (Research date: March 2026)
//  All interest rates are floating and subject to change.
//  Always verify on official bank website before applying.
// ─────────────────────────────────────────────────────────────────

const BANKS = [
  {
    id: 'sbi',
    name: 'State Bank of India',
    shortName: 'SBI',
    loanName: 'Global Ed-Vantage Scheme',
    type: 'Public Sector Bank',
    color: '#1A4BA0',
    badgeColor: '#1A4BA0',
    badge: 'Lowest Rate',
    badgeBg: '#EBF2FF',
    interestRate: '9.15% – 11.15%',
    interestNote: 'MCLR-based floating rate. 0.5% extra for girl students.',
    maxLoan: '₹1.5 Crore',
    collateral: 'Required above ₹7.5L',
    collateralNote: 'Unsecured up to ₹50L for select premier foreign universities (from Jan 2025)',
    moratorium: 'Course + 6 months',
    repayment: 'Up to 15 years',
    processingFee: 'Free up to ₹20L | ₹10,000 above ₹20L',
    taxBenefit: 'Section 80E',
    covered: [
      'Tuition fees & exam fees',
      'Books, laptop, instruments',
      'Travel & accommodation',
      'Germany Blocked Account',
      'Canada GIC fees',
    ],
    pros: [
      'Lowest interest rate among all lenders',
      'Simple interest during moratorium (not compound)',
      'Up to 15 years repayment — longest tenure',
      'Pre-visa disbursement available',
    ],
    cons: [
      'Longer processing time (15–20 days)',
      'Strict document requirements',
      'Branch visit usually required',
    ],
    applyUrl: 'https://sbi.co.in/web/personal-banking/loans/education-loans/global-ed-vantage-scheme',
    websiteUrl: 'https://sbi.co.in',
    countries: ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Singapore', 'Japan', 'Europe'],
  },
  {
    id: 'credila',
    name: 'Credila Financial Services',
    shortName: 'Credila',
    loanName: 'Education Loan for Abroad Studies',
    type: 'NBFC (formerly HDFC Credila)',
    color: '#005A8E',
    badgeColor: '#005A8E',
    badge: 'Most Popular',
    badgeBg: '#E0F2FE',
    interestRate: '9.75% – 13.0%',
    interestNote: 'CBLR-linked floating rate. Lower rates for top-ranked QS universities.',
    maxLoan: '₹75L (unsecured) | No limit (secured)',
    collateral: 'Optional',
    collateralNote: '100% financing available. Unsecured up to ₹75L depending on university.',
    moratorium: 'Course + 12 months',
    repayment: 'Up to 14 years',
    processingFee: '0.5% – 1.25% of loan amount + GST',
    taxBenefit: 'Section 80E (only NBFC eligible for this)',
    covered: [
      'Full tuition fees (100%)',
      'Living & accommodation expenses',
      'Travel fares (return economy)',
      'Germany Blocked Account & Canada GIC',
      'Exam fees, books, laptop',
    ],
    pros: [
      'Fully digital — paperless process',
      'Approval in 7–12 working days',
      'No prepayment charges',
      'Pre-visa & pre-admission loans available',
      'Accepted at 4,600+ universities in 65 countries',
    ],
    cons: [
      'Higher interest than public banks',
      'Processing fee not waived',
    ],
    applyUrl: 'https://www.credila.com/education-loan',
    websiteUrl: 'https://www.credila.com',
    countries: ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Ireland', 'France', 'Singapore', 'UAE', '+ more'],
  },
  {
    id: 'icici',
    name: 'ICICI Bank',
    shortName: 'ICICI',
    loanName: 'ICICI Bank Abroad Education Loan',
    type: 'Private Sector Bank',
    color: '#B91C1C',
    badgeColor: '#B91C1C',
    badge: 'High Limit',
    badgeBg: '#FEE2E2',
    interestRate: '10.25% – 12.75%',
    interestNote: 'Repo Rate + 3.75% onwards. Collateral loans lower than non-collateral.',
    maxLoan: '₹3 Crore (secured) | ₹1 Crore (unsecured)',
    collateral: 'Optional up to ₹50L',
    collateralNote: 'Pre-approved instant sanction available for select universities.',
    moratorium: 'Course + 12 months',
    repayment: 'Up to 12 years',
    processingFee: 'Up to 2% of loan amount + GST',
    taxBenefit: 'Section 80E',
    covered: [
      'Tuition, exam, library fees',
      'Accommodation & living costs',
      'Travel & laptop expenses',
      'Student exchange costs',
      'Pre-visa disbursement available',
    ],
    pros: [
      'Highest unsecured limit — up to ₹1 Crore',
      'Instant sanction letter for pre-approved cases',
      'Pre-visa disbursement for visa process',
      'Fast processing — 5–7 working days',
    ],
    cons: [
      'High processing fee (2%)',
      'Interest rates higher than SBI',
    ],
    applyUrl: 'https://www.icicibank.com/personal-banking/loans/education-loan',
    websiteUrl: 'https://www.icicibank.com',
    countries: ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'New Zealand', 'Singapore', '+ more'],
  },
  {
    id: 'avanse',
    name: 'Avanse Financial Services',
    shortName: 'Avanse',
    loanName: 'Avanse Abroad Study Loan',
    type: 'NBFC (Education Focused)',
    color: '#D97706',
    badgeColor: '#D97706',
    badge: 'Flexible',
    badgeBg: '#FEF3C7',
    interestRate: '10.25% – 16.5%',
    interestNote: 'Base Rate 14.55% + Spread. Rate varies by university rank & profile.',
    maxLoan: '₹1.25 Crore (unsecured) | ₹3 Crore (secured)',
    collateral: 'Optional',
    collateralNote: 'Accepts minor CIBIL issues. No collateral for Masters at select unis.',
    moratorium: 'Course + 6 months',
    repayment: 'Up to 15 years',
    processingFee: '1% – 1.5% of loan amount',
    taxBenefit: 'Section 80E',
    covered: [
      'Full tuition fees (100%)',
      '75% of living expenses',
      'Travel up to ₹75,000',
      'Deposits & visa fees',
      'Laptop & study materials',
    ],
    pros: [
      'Pre-admission & pre-visa loans available',
      'Fast-track processing in 72 hours',
      'Score-based benefits (GRE/GMAT/IELTS)',
      'USD loan option via Avanse Global',
      'Covers 30,000+ courses in 50+ countries',
    ],
    cons: [
      'Higher interest rates for low-ranked universities',
      'No Bachelor\'s loans without collateral',
    ],
    applyUrl: 'https://www.avanse.com/education-loan/study-abroad-loan',
    websiteUrl: 'https://www.avanse.com',
    countries: ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Ireland', '+ 45 more'],
  },
  {
    id: 'axis',
    name: 'Axis Bank',
    shortName: 'Axis',
    loanName: 'Axis Bank Education Loan for Abroad',
    type: 'Private Sector Bank',
    color: '#7C3AED',
    badgeColor: '#7C3AED',
    badge: 'GRE-Based',
    badgeBg: '#EDE9FE',
    interestRate: '11.0% – 14.0%',
    interestNote: 'Floating rate. GRE score above cutoff qualifies for better rates without collateral.',
    maxLoan: '₹1 Crore (unsecured)',
    collateral: 'Optional',
    collateralNote: 'GRE-based product: loan without offer letter or collateral if GRE score qualifies.',
    moratorium: 'Course + 12 months',
    repayment: 'Up to 15 years',
    processingFee: '1% – 2% of loan amount + GST',
    taxBenefit: 'Section 80E',
    covered: [
      'Tuition fees & academic costs',
      'Accommodation & living expenses',
      'Travel & visa fees',
      'Books & laptop',
    ],
    pros: [
      'Unique GRE-based loan — no offer letter needed',
      'No collateral for GRE score above cutoff',
      'Fast approval for strong academic profiles',
    ],
    cons: [
      'Higher interest rates',
      'GRE requirement for best terms',
    ],
    applyUrl: 'https://www.axisbank.com/retail/loans/education-loan/education-loan-abroad',
    websiteUrl: 'https://www.axisbank.com',
    countries: ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'New Zealand', '+ more'],
  },
  {
    id: 'bob',
    name: 'Bank of Baroda',
    shortName: 'BoB',
    loanName: 'Baroda Scholar Education Loan',
    type: 'Public Sector Bank',
    color: '#0EA5A0',
    badgeColor: '#0EA5A0',
    badge: 'Girls Special',
    badgeBg: '#D1FAF8',
    interestRate: '8.25% – 9.85%',
    interestNote: '0.5% concession for girl students. Lower rate for listed premier institutions.',
    maxLoan: '₹1.5 Crore',
    collateral: 'Required above ₹7.5L',
    collateralNote: 'Better rates for students admitted to BoB\'s listed premier institutions.',
    moratorium: 'Course + 12 months',
    repayment: 'Up to 15 years',
    processingFee: 'Nil for loans up to ₹7.5L | 1% above ₹7.5L (max ₹10,000)',
    taxBenefit: 'Section 80E',
    covered: [
      'Tuition & examination fees',
      'Accommodation & living costs',
      'Travel expenses',
      'Books, equipment & laptop',
      'Caution deposit / refundable deposits',
    ],
    pros: [
      'Very competitive rates for listed institutions',
      'No processing fee up to ₹7.5L',
      'Simple interest during moratorium',
      'Special concession for girl students',
    ],
    cons: [
      'Branch visit required',
      'Best rates only for listed institutions',
    ],
    applyUrl: 'https://www.bankofbaroda.in/personal-banking/loans/education-loans/baroda-scholar',
    websiteUrl: 'https://www.bankofbaroda.in',
    countries: ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Europe', 'New Zealand', '+ more'],
  },
]

// ─── EMI Calculator Logic ────────────────────────────────────────
function calcEMI(principal, ratePercent, tenureYears) {
  const r = ratePercent / 12 / 100
  const n = tenureYears * 12
  if (r === 0) return principal / n
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

// ─── Bank Card Component ─────────────────────────────────────────
function BankCard({ bank, expanded, onToggle }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 20,
      border: `1.5px solid ${expanded ? bank.color : '#E8EDF5'}`,
      overflow: 'hidden',
      boxShadow: expanded ? `0 8px 32px ${bank.color}18` : '0 2px 12px rgba(0,0,0,0.04)',
      transition: 'all .25s ease',
    }}>
      {/* Card Header */}
      <div
        onClick={onToggle}
        style={{
          padding: '22px 24px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 16,
        }}
      >
        {/* Avatar */}
        <div style={{
          width: 50, height: 50, borderRadius: 14, flexShrink: 0,
          background: bank.color + '14',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontWeight: 900, fontSize: 14, color: bank.color, letterSpacing: '-0.5px' }}>
            {bank.shortName}
          </span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{ fontWeight: 800, fontSize: 16, color: '#0F1C3F' }}>{bank.name}</span>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100,
              background: bank.badgeBg, color: bank.badgeColor,
            }}>{bank.badge}</span>
          </div>
          <div style={{ fontSize: 12, color: '#718096', marginBottom: 12 }}>
            {bank.loanName} · {bank.type}
          </div>

          {/* Key stats row */}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'Interest Rate', val: bank.interestRate },
              { label: 'Max Loan',      val: bank.maxLoan },
              { label: 'Repayment',     val: bank.repayment },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 10, color: '#A0AEC0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{s.label}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: bank.color, marginTop: 2 }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Expand toggle */}
        <div style={{
          width: 32, height: 32, borderRadius: 10, flexShrink: 0,
          background: expanded ? bank.color : '#F4F6FA',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .2s', marginTop: 4,
        }}>
          <span style={{ color: expanded ? '#fff' : '#718096', fontSize: 16, lineHeight: 1, transform: expanded ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform .2s' }}>
            ↓
          </span>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div style={{ borderTop: `1px solid ${bank.color}22`, padding: '20px 24px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>

            {/* Loan Details */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Loan Details</div>
              {[
                { label: 'Interest Rate',    val: bank.interestRate, note: bank.interestNote },
                { label: 'Collateral',       val: bank.collateral, note: bank.collateralNote },
                { label: 'Moratorium',       val: bank.moratorium },
                { label: 'Repayment Tenure', val: bank.repayment },
                { label: 'Processing Fee',   val: bank.processingFee },
                { label: 'Tax Benefit',      val: bank.taxBenefit },
              ].map(item => (
                <div key={item.label} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: '#A0AEC0', fontWeight: 600 }}>{item.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0F1C3F', marginTop: 1 }}>{item.val}</div>
                  {item.note && <div style={{ fontSize: 11, color: '#718096', marginTop: 1, lineHeight: 1.5 }}>{item.note}</div>}
                </div>
              ))}
            </div>

            {/* What's Covered + Pros/Cons */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>What's Covered</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
                {bank.covered.map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: '#0EA5A0', fontWeight: 700, fontSize: 13, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: 13, color: '#4A5568', lineHeight: 1.4 }}>{c}</span>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 11, fontWeight: 700, color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Pros</div>
              {bank.pros.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
                  <span style={{ color: bank.color, fontSize: 12, marginTop: 2 }}>▲</span>
                  <span style={{ fontSize: 12, color: '#4A5568', lineHeight: 1.4 }}>{p}</span>
                </div>
              ))}

              <div style={{ fontSize: 11, fontWeight: 700, color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8, marginTop: 12 }}>Cons</div>
              {bank.cons.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
                  <span style={{ color: '#E53E3E', fontSize: 12, marginTop: 2 }}>▼</span>
                  <span style={{ fontSize: 12, color: '#4A5568', lineHeight: 1.4 }}>{c}</span>
                </div>
              ))}

              {/* Countries */}
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Supported Countries</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {bank.countries.map(c => (
                    <span key={c} style={{
                      fontSize: 11, fontWeight: 600, padding: '3px 8px',
                      background: bank.color + '12', color: bank.color,
                      borderRadius: 6,
                    }}>{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
            <a
              href={bank.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: bank.color, color: '#fff',
                borderRadius: 10, padding: '11px 20px',
                fontWeight: 700, fontSize: 13, textDecoration: 'none',
                boxShadow: `0 4px 16px ${bank.color}30`,
              }}
            >
              Apply on {bank.shortName} Website →
            </a>
            <a
              href={bank.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#F4F6FA', color: '#4A5568',
                borderRadius: 10, padding: '11px 20px',
                fontWeight: 600, fontSize: 13, textDecoration: 'none',
                border: '1.5px solid #E8EDF5',
              }}
            >
              🌐 Official Website
            </a>
          </div>

          <p style={{ fontSize: 11, color: '#A0AEC0', marginTop: 10, fontStyle: 'italic' }}>
            ⚠️ Interest rates are floating and subject to change. Always verify latest rates on the official bank website before applying.
          </p>
        </div>
      )}
    </div>
  )
}

// ─── EMI Calculator Component ────────────────────────────────────
function EMICalculator() {
  const [amount, setAmount]   = useState(2000000)
  const [rate, setRate]       = useState(10)
  const [tenure, setTenure]   = useState(10)

  const emi   = calcEMI(amount, rate, tenure)
  const total = emi * tenure * 12
  const interest = total - amount

  const fmt = n => '₹' + Math.round(n).toLocaleString('en-IN')

  return (
    <div style={{
      background: '#fff', borderRadius: 20, border: '1.5px solid #E8EDF5',
      padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    }}>
      <h3 style={{ fontWeight: 800, fontSize: 18, color: '#0F1C3F', marginBottom: 4, letterSpacing: '-0.4px' }}>
        EMI Calculator
      </h3>
      <p style={{ fontSize: 13, color: '#718096', marginBottom: 24 }}>Estimate your monthly loan repayment</p>

      {/* Sliders */}
      {[
        { label: 'Loan Amount', val: amount, min: 500000, max: 15000000, step: 100000, set: setAmount, display: fmt(amount), unit: '' },
        { label: 'Interest Rate', val: rate, min: 8, max: 16, step: 0.25, set: setRate, display: rate + '%', unit: '% p.a.' },
        { label: 'Repayment Tenure', val: tenure, min: 1, max: 15, step: 1, set: setTenure, display: tenure + ' yrs', unit: 'years' },
      ].map(s => (
        <div key={s.label} style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#4A5568' }}>{s.label}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#1A56DB' }}>{s.display}</span>
          </div>
          <input
            type="range" min={s.min} max={s.max} step={s.step} value={s.val}
            onChange={e => s.set(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#1A56DB', height: 4, cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
            <span style={{ fontSize: 10, color: '#A0AEC0' }}>{s.label === 'Loan Amount' ? fmt(s.min) : s.min + s.unit}</span>
            <span style={{ fontSize: 10, color: '#A0AEC0' }}>{s.label === 'Loan Amount' ? fmt(s.max) : s.max + s.unit}</span>
          </div>
        </div>
      ))}

      {/* Result */}
      <div style={{
        background: 'linear-gradient(135deg, #1A56DB, #0EA5A0)',
        borderRadius: 16, padding: 20, color: '#fff', marginTop: 8,
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, textAlign: 'center' }}>
          {[
            { label: 'Monthly EMI', val: fmt(emi) },
            { label: 'Total Interest', val: fmt(interest) },
            { label: 'Total Payable', val: fmt(total) },
          ].map(r => (
            <div key={r.label}>
              <div style={{ fontSize: 10, opacity: 0.8, marginBottom: 4 }}>{r.label}</div>
              <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.5px' }}>{r.val}</div>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontSize: 11, color: '#A0AEC0', marginTop: 12, textAlign: 'center' }}>
        This is an estimate only. Actual EMI may vary based on bank-specific calculations.
      </p>
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────
export default function LoanGuidance() {
  const navigate    = useNavigate()
  const [expanded, setExpanded] = useState(null)
  const [filter, setFilter]     = useState('ALL')

  const FILTERS = [
    { val: 'ALL',     label: 'All Lenders' },
    { val: 'public',  label: 'Public Banks' },
    { val: 'private', label: 'Private Banks' },
    { val: 'nbfc',    label: 'NBFCs' },
  ]

  const filtered = BANKS.filter(b => {
    if (filter === 'public')  return b.type.includes('Public')
    if (filter === 'private') return b.type.includes('Private')
    if (filter === 'nbfc')    return b.type.includes('NBFC')
    return true
  })

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh', background: '#F4F6FA', paddingTop: 68,
        fontFamily: "'Plus Jakarta Sans', 'DM Sans', 'Segoe UI', sans-serif",
      }}>
        {/* Back */}
        <div style={{ padding: '18px 5vw 0' }}>
          <button onClick={() => navigate(-1)} style={{
            background: 'none', border: 'none', color: '#1A56DB',
            fontWeight: 600, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, padding: 0,
          }}>← Back</button>
        </div>

        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '40px 5vw 36px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: '#D1FAF8', borderRadius: 100, padding: '5px 14px', marginBottom: 16,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#0EA5A0', display: 'inline-block' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#0EA5A0' }}>VERIFIED 2025–26 DATA · 6 LENDERS</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 900,
            color: '#0F1C3F', letterSpacing: '-1.5px', margin: '0 0 12px', lineHeight: 1.1,
          }}>
            India's Best Education Loans<br />for Studying Abroad
          </h1>
          <p style={{ fontSize: 15, color: '#718096', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
            Compare SBI, Credila, ICICI, Avanse, Axis & Bank of Baroda —
            interest rates, loan limits, collateral rules, and direct apply links.
          </p>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 5vw 60px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

            {/* LEFT — Bank Cards */}
            <div>
              {/* Filter Tabs */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                {FILTERS.map(f => (
                  <button key={f.val} onClick={() => setFilter(f.val)} style={{
                    background: filter === f.val ? '#1A56DB' : '#fff',
                    color: filter === f.val ? '#fff' : '#4A5568',
                    border: `1.5px solid ${filter === f.val ? '#1A56DB' : '#E8EDF5'}`,
                    borderRadius: 10, padding: '8px 16px',
                    fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all .2s',
                  }}>{f.label}</button>
                ))}
              </div>

              {/* Bank Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {filtered.map(bank => (
                  <BankCard
                    key={bank.id}
                    bank={bank}
                    expanded={expanded === bank.id}
                    onToggle={() => setExpanded(expanded === bank.id ? null : bank.id)}
                  />
                ))}
              </div>

              {/* Quick Compare Table */}
              <div style={{ marginTop: 28, background: '#fff', borderRadius: 20, border: '1.5px solid #E8EDF5', overflow: 'hidden' }}>
                <div style={{ padding: '18px 24px', borderBottom: '1px solid #F0F3F8' }}>
                  <h3 style={{ fontWeight: 800, fontSize: 16, color: '#0F1C3F', margin: 0 }}>Quick Comparison</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#F8FAFD' }}>
                        {['Bank', 'Loan Name', 'Interest Rate', 'Max Amount', 'Collateral', 'Tenure'].map(h => (
                          <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#4A5568', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {BANKS.map((b, i) => (
                        <tr key={b.id} style={{ borderTop: '1px solid #F0F3F8', background: i % 2 === 0 ? '#fff' : '#FAFBFD' }}>
                          <td style={{ padding: '10px 14px', fontWeight: 800, color: b.color, whiteSpace: 'nowrap' }}>{b.shortName}</td>
                          <td style={{ padding: '10px 14px', color: '#4A5568', whiteSpace: 'nowrap' }}>{b.loanName.split(' ').slice(0, 4).join(' ')}</td>
                          <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0F1C3F', whiteSpace: 'nowrap' }}>{b.interestRate}</td>
                          <td style={{ padding: '10px 14px', color: '#4A5568', whiteSpace: 'nowrap' }}>{b.maxLoan.split('|')[0].trim()}</td>
                          <td style={{ padding: '10px 14px', color: '#4A5568', whiteSpace: 'nowrap' }}>{b.collateral}</td>
                          <td style={{ padding: '10px 14px', color: '#4A5568', whiteSpace: 'nowrap' }}>{b.repayment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* RIGHT STICKY — EMI + Tips */}
            <div style={{ position: 'sticky', top: 88 }}>
              <EMICalculator />

              {/* Pro Tips */}
              <div style={{
                marginTop: 16, background: '#0F1C3F', borderRadius: 20,
                padding: '20px 22px', color: '#fff',
              }}>
                <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 14, letterSpacing: '-0.3px' }}>
                  💡 Loan Tips from Stu
                </div>
                {[
                  'SBI offers simple interest during moratorium — saves ₹2–4L vs private banks',
                  'Apply 4–6 months before your course starts — documents take time',
                  'Girl students get 0.5% concession at SBI + BoB — always ask',
                  'Section 80E lets you deduct the ENTIRE interest paid from taxable income',
                  'Pre-visa disbursement available at Credila, Avanse & ICICI — great for Germany blocked account',
                ].map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: '#0EA5A0', fontWeight: 800, fontSize: 14, flexShrink: 0, marginTop: 1 }}>{i + 1}.</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>{tip}</span>
                  </div>
                ))}

                <button
                  onClick={() => navigate('/chat')}
                  style={{
                    width: '100%', marginTop: 8,
                    background: 'linear-gradient(135deg, #0EA5A0, #1A56DB)',
                    color: '#fff', border: 'none', borderRadius: 10,
                    padding: '11px 0', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  }}
                >
                  ✨ Ask Stu About Loans
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}