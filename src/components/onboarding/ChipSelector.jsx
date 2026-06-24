import React from 'react'

export default function ChipSelector({ options, value, onChange, multi = false }) {
  const handleSelect = (optVal) => {
    if (multi) {
      if (Array.isArray(value)) {
        if (value.includes(optVal)) {
          onChange(value.filter(v => v !== optVal))
        } else {
          onChange([...value, optVal])
        }
      } else {
        onChange([optVal])
      }
    } else {
      onChange(optVal)
    }
  }

  const isSelected = (optVal) => {
    if (multi) {
      return Array.isArray(value) && value.includes(optVal)
    }
    return value === optVal
  }

  return (
    <div className="ob-chips">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          className={`ob-chip ${isSelected(opt.value) ? 'selected' : ''}`}
          onClick={() => handleSelect(opt.value)}
        >
          {opt.emoji && <span className="ob-chip-emoji">{opt.emoji}</span>}
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  )
}
