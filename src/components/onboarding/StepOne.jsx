import React from 'react'
import ChipSelector from './ChipSelector'

const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
  { value: 'Prefer not to say', label: 'Prefer not to say' }
]

const EDUCATION_OPTIONS = [
  { value: '12th / HSC', label: '12th / HSC', emoji: '📚' },
  { value: 'Undergraduate', label: 'Undergraduate', emoji: '🎓' },
  { value: 'Working Professional', label: 'Working Professional', emoji: '💼' },
  { value: 'Postgraduate', label: 'Postgraduate', emoji: '🏛️' }
]

export default function StepOne({ formData, update, errors }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* PERSONAL INFO */}
      <div className="ob-section-label">Personal Information</div>

      {/* Grid: Full Name & Age */}
      <div className="ob-grid-2">
        <div className="ob-field">
          <label className="ob-label">Full Name</label>
          <input
            type="text"
            className={`ob-input ${errors.fullName ? 'error' : ''}`}
            placeholder="Your full name"
            value={formData.fullName}
            onChange={e => update('fullName', e.target.value)}
          />
          {errors.fullName && <div className="ob-field-error">{errors.fullName}</div>}
        </div>

        <div className="ob-field">
          <label className="ob-label">Age</label>
          <input
            type="number"
            className={`ob-input ${errors.age ? 'error' : ''}`}
            placeholder="e.g. 21"
            min="15"
            max="40"
            value={formData.age}
            onChange={e => update('age', e.target.value)}
          />
          {errors.age && <div className="ob-field-error">{errors.age}</div>}
        </div>
      </div>

      {/* Gender select */}
      <div className="ob-field">
        <label className="ob-label">Gender</label>
        <ChipSelector
          options={GENDER_OPTIONS}
          value={formData.gender}
          onChange={val => update('gender', val)}
        />
        {errors.gender && <div className="ob-field-error">{errors.gender}</div>}
      </div>

      <div className="ob-section-divider" />

      {/* EDUCATION INFO */}
      <div className="ob-section-label">Education</div>

      {/* Current Level */}
      <div className="ob-field">
        <label className="ob-label">Current Education Level</label>
        <ChipSelector
          options={EDUCATION_OPTIONS}
          value={formData.educationLevel}
          onChange={val => update('educationLevel', val)}
        />
        {errors.educationLevel && <div className="ob-field-error">{errors.educationLevel}</div>}
      </div>

      {/* University / College */}
      <div className="ob-field">
        <label className="ob-label">Current University / College</label>
        <input
          type="text"
          className={`ob-input ${errors.university ? 'error' : ''}`}
          placeholder="e.g. Brainware University, Kolkata"
          value={formData.university}
          onChange={e => update('university', e.target.value)}
        />
        {errors.university && <div className="ob-field-error">{errors.university}</div>}
      </div>

      {/* Grid: Major & Semester */}
      <div className="ob-grid-2">
        <div className="ob-field">
          <label className="ob-label">Field of Study / Major</label>
          <input
            type="text"
            className={`ob-input ${errors.fieldOfStudy ? 'error' : ''}`}
            placeholder="e.g. Computer Science"
            value={formData.fieldOfStudy}
            onChange={e => update('fieldOfStudy', e.target.value)}
          />
          {errors.fieldOfStudy && <div className="ob-field-error">{errors.fieldOfStudy}</div>}
        </div>

        <div className="ob-field">
          <label className="ob-label">
            Current Semester / Year
            <span className="ob-label-optional">(Optional)</span>
          </label>
          <input
            type="text"
            className="ob-input"
            placeholder="e.g. 5th Semester"
            value={formData.semester}
            onChange={e => update('semester', e.target.value)}
          />
        </div>
      </div>

      {/* CGPA */}
      <div className="ob-field">
        <label className="ob-label">
          Current CGPA / Percentage
          <span className="ob-label-optional">(Optional)</span>
        </label>
        <input
          type="text"
          className={`ob-input ${errors.cgpa ? 'error' : ''}`}
          placeholder="e.g. 7.9 or 78%"
          value={formData.cgpa}
          onChange={e => update('cgpa', e.target.value)}
        />
        {errors.cgpa && <div className="ob-field-error">{errors.cgpa}</div>}
      </div>
    </div>
  )
}
