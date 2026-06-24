import React from 'react'
import ChipSelector from './ChipSelector'

const COUNTRY_OPTIONS = [
  { value: 'Austria', label: 'Austria', emoji: '🇦🇹' },
  { value: 'Germany', label: 'Germany', emoji: '🇩🇪' },
  { value: 'Canada', label: 'Canada', emoji: '🇨🇦' },
  { value: 'USA', label: 'USA', emoji: '🇺🇸' },
  { value: 'UK', label: 'UK', emoji: '🇬🇧' },
  { value: 'Australia', label: 'Australia', emoji: '🇦🇺' },
  { value: 'France', label: 'France', emoji: '🇫🇷' }
]

const DEGREE_OPTIONS = [
  { value: "Bachelor's", label: "Bachelor's" },
  { value: "Master's", label: "Master's" },
  { value: 'PhD', label: 'PhD' }
]

const INTAKE_OPTIONS = [
  { value: 'Winter 2026', label: 'Winter 2026' },
  { value: 'Summer 2027', label: 'Summer 2027' },
  { value: 'Winter 2027', label: 'Winter 2027' },
  { value: 'Summer 2028', label: 'Summer 2028' },
  { value: 'Winter 2028', label: 'Winter 2028' },
  { value: 'Summer 2029', label: 'Summer 2029' }
]

const ENGLISH_OPTIONS = [
  { value: 'Beginner', label: 'Beginner', emoji: '🔰' },
  { value: 'Intermediate', label: 'Intermediate', emoji: '📖' },
  { value: 'Advanced', label: 'Advanced', emoji: '✅' },
  { value: 'IELTS Ready', label: 'IELTS Ready', emoji: '🏆' }
]

export default function StepTwo({ formData, update, errors }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* TARGET DESTINATION */}
      <div className="ob-section-label">Target Destination</div>

      <div className="ob-field">
        <label className="ob-label">Target Country</label>
        <ChipSelector
          options={COUNTRY_OPTIONS}
          value={formData.targetCountry}
          onChange={val => update('targetCountry', val)}
        />
        {errors.targetCountry && <div className="ob-field-error">{errors.targetCountry}</div>}
      </div>

      <div className="ob-section-divider" />

      {/* DEGREE & TIMING */}
      <div className="ob-section-label">Degree & Timing</div>

      <div className="ob-grid-2">
        <div className="ob-field">
          <label className="ob-label">Degree Goal</label>
          <ChipSelector
            options={DEGREE_OPTIONS}
            value={formData.targetDegree}
            onChange={val => update('targetDegree', val)}
          />
          {errors.targetDegree && <div className="ob-field-error">{errors.targetDegree}</div>}
        </div>

        <div className="ob-field">
          <label className="ob-label">Intended Intake</label>
          <ChipSelector
            options={INTAKE_OPTIONS}
            value={formData.targetIntake}
            onChange={val => update('targetIntake', val)}
          />
          {errors.targetIntake && <div className="ob-field-error">{errors.targetIntake}</div>}
        </div>
      </div>

      <div className="ob-section-divider" />

      {/* ENGLISH PROFICIENCY */}
      <div className="ob-section-label">English Proficiency</div>

      <div className="ob-field">
        <label className="ob-label">English Proficiency Level</label>
        <ChipSelector
          options={ENGLISH_OPTIONS}
          value={formData.englishLevel}
          onChange={val => update('englishLevel', val)}
        />
        {errors.englishLevel && <div className="ob-field-error">{errors.englishLevel}</div>}
      </div>
    </div>
  )
}
