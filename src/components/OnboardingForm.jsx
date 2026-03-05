import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

const countries = ['Germany', 'USA', 'Canada']
const degrees = ['BTech / BE', 'MTech / ME', 'MSc', 'MBA', 'PhD', 'Other']
const intakes = {
  Germany: ['Winter 2025', 'Summer 2026', 'Winter 2026'],
  USA: ['Fall 2025', 'Spring 2026', 'Fall 2026'],
  Canada: ['Sept 2025', 'Jan 2026', 'May 2026', 'Sept 2026'],
}

export default function OnboardingForm({ onSubmit }) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState({ country: '', degree: '', intake: '' })

  const steps = [
    {
      label: 'Which country?',
      key: 'country',
      options: countries,
      emoji: ['🇩🇪', '🇺🇸', '🇨🇦'],
    },
    {
      label: 'What degree?',
      key: 'degree',
      options: degrees,
      emoji: null,
    },
    {
      label: 'Which intake?',
      key: 'intake',
      options: data.country ? intakes[data.country] : [],
      emoji: null,
    },
  ]

  const current = steps[step]

  const select = (val) => {
    const updated = { ...data, [current.key]: val }
    setData(updated)
    if (step < 2) {
      setStep(step + 1)
    } else {
      const msg = `I'm targeting ${updated.country} for ${updated.degree} in the ${updated.intake} intake.`
      onSubmit(msg, updated)
    }
  }

  return (
    <div style={{
      background: 'var(--off-white)',
      borderRadius: 16, padding: '18px 20px',
      margin: '8px 0',
      border: '1px solid var(--gray-200)',
    }}>
      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            height: 4, flex: 1, borderRadius: 4,
            background: i <= step ? 'var(--accent)' : 'var(--gray-200)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      <p style={{
        fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)',
        marginBottom: 12,
      }}>{current.label}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {current.options.map((opt, i) => (
          <button key={opt} onClick={() => select(opt)} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'white', border: '1.5px solid var(--gray-200)',
            borderRadius: 12, padding: '10px 14px',
            fontSize: '0.85rem', fontWeight: 500, color: 'var(--navy)',
            textAlign: 'left',
            transition: 'border-color 0.15s, background 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-light)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.background = 'white' }}
          >
            {current.emoji && <span>{current.emoji[i]}</span>}
            <span style={{ flex: 1 }}>{opt}</span>
            <ArrowRight size={13} color="var(--gray-400)" />
          </button>
        ))}
      </div>
    </div>
  )
}