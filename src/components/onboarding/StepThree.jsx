import React from 'react'
import ChipSelector from './ChipSelector'
import { Info } from 'lucide-react'

const CAREER_OPTIONS = [
  { value: 'Software Engineer', label: 'Software Engineer', emoji: '💻' },
  { value: 'AI / ML Engineer', label: 'AI / ML Engineer', emoji: '🤖' },
  { value: 'Data Scientist', label: 'Data Scientist', emoji: '📊' },
  { value: 'Cybersecurity', label: 'Cybersecurity', emoji: '🔐' },
  { value: 'Biotechnology Researcher', label: 'Biotechnology Researcher', emoji: '🧬' },
  { value: 'Academic Research', label: 'Academic Research', emoji: '🔬' },
  { value: 'Other', label: 'Other', emoji: '✏__' }
]

const LANGUAGE_OPTIONS = [
  { value: 'English', label: 'English', emoji: '🇬🇧' },
  { value: 'German', label: 'German', emoji: '🇩🇪' },
  { value: 'Both', label: 'Both', emoji: '🔀' }
]

const WORK_OPTIONS = [
  { value: 'Study Only', label: 'Study Only', emoji: '📚' },
  { value: 'Study + Part-time Job', label: 'Study + Part-time Job', emoji: '💼' },
  { value: 'PR Focused', label: 'PR Focused', emoji: '🌐' }
]

export default function StepThree({ formData, update }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* CAREER GOAL */}
      <div className="ob-section-label">
        Career Goal 
        <span className="ob-label-optional">(Optional)</span>
      </div>

      <div className="ob-field">
        <ChipSelector
          options={CAREER_OPTIONS}
          value={formData.careerGoal}
          onChange={val => update('careerGoal', val)}
        />
      </div>

      <div className="ob-section-divider" />

      {/* STUDY PREFERENCES */}
      <div className="ob-section-label">
        Study Preferences 
        <span className="ob-label-optional">(Optional)</span>
      </div>

      <div className="ob-field">
        <label className="ob-label">Preferred Study Language</label>
        <ChipSelector
          options={LANGUAGE_OPTIONS}
          value={formData.studyLanguage}
          onChange={val => update('studyLanguage', val)}
        />
      </div>

      <div className="ob-field">
        <label className="ob-label">Work Preference</label>
        <ChipSelector
          options={WORK_OPTIONS}
          value={formData.workPreference}
          onChange={val => update('workPreference', val)}
        />
      </div>

      {/* Info Note */}
      <div className="ob-info-note">
        <Info size={14} />
        <span>Your AI advisor uses this to tailor visa tips, scholarship suggestions, and SOP guidance specifically for your profile.</span>
      </div>
    </div>
  )
}
