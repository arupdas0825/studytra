import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  GraduationCap, LogOut, ArrowRight, ArrowLeft, 
  Check, DollarSign, Search, Award, X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

const EDUCATION_LEVELS = [
  { id: '12th / HSC', label: '12th / HSC', desc: 'School completion' },
  { id: 'Undergraduate', label: 'Undergraduate', desc: 'B.Tech / B.Sc / BA in progress' },
  { id: 'Graduate', label: 'Graduate', desc: "Bachelor's completed" },
  { id: 'Working Professional', label: 'Working Professional', desc: 'Industry experience' },
  { id: 'Postgraduate', label: 'Postgraduate', desc: "Master's or higher" }
]

const COUNTRIES = [
  { id: 'Austria', label: 'Austria', flag: '🇦🇹' },
  { id: 'Germany', label: 'Germany', flag: '🇩🇪' },
  { id: 'Canada', label: 'Canada', flag: '🇨🇦' },
  { id: 'Australia', label: 'Australia', flag: '🇦🇺' },
  { id: 'UK', label: 'United Kingdom', flag: '🇬🇧' },
  { id: 'USA', label: 'United States', flag: '🇺🇸' },
  { id: 'France', label: 'France', flag: '🇫🇷' }
]

const FIELDS_OF_STUDY = [
  "Computer Science",
  "Artificial Intelligence",
  "Data Science",
  "Biotechnology",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Business Administration",
  "Finance",
  "Information Technology",
  "Civil Engineering",
  "Psychology",
  "Medicine / Healthcare"
]

export default function PremiumOnboardingModal({ isOpen, isDismissible = false, onClose }) {
  const { user, saveOnboardingData, logout } = useAuth()
  const { showSuccess, showError } = useToast()

  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  
  // Search state for searchable dropdown
  const [searchField, setSearchField] = useState('')
  const [showFieldDropdown, setShowFieldDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const [form, setForm] = useState({
    fullName: '',
    age: '',
    gender: '',
    educationLevel: '',
    university: '',
    fieldOfStudy: '',
    semester: '',
    cgpa: '',
    targetCountry: '',
    targetDegree: '',
    targetIntake: '',
    englishLevel: '',
    budgetRange: ''
  })

  // Pre-fill name from firebase user
  useEffect(() => {
    if (user && !form.fullName) {
      setForm(prev => ({
        ...prev,
        fullName: user.displayName || ''
      }))
    }
  }, [user])

  // Handle clicking outside searchable dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFieldDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!isOpen) return null

  const handleFieldChange = (val) => {
    setForm(p => ({ ...p, fieldOfStudy: val }))
    setSearchField(val)
    setErrors(p => ({ ...p, fieldOfStudy: '' }))
  }

  const updateField = (key, val) => {
    setForm(p => ({ ...p, [key]: val }))
    setErrors(p => ({ ...p, [key]: '' }))
  }

  // Validate Step 1
  const validateStep1 = () => {
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = 'Full name is required'
    if (!form.age) errs.age = 'Age is required'
    else if (isNaN(form.age) || +form.age < 15 || +form.age > 50) errs.age = 'Enter a valid age (15-50)'
    if (!form.gender) errs.gender = 'Please select your gender'
    if (!form.educationLevel) errs.educationLevel = 'Please select your education level'
    if (!form.university.trim()) errs.university = 'University / School is required'
    if (!form.fieldOfStudy.trim()) errs.fieldOfStudy = 'Field of study is required'
    if (form.cgpa && (isNaN(form.cgpa) || +form.cgpa < 0 || +form.cgpa > 10)) errs.cgpa = 'CGPA must be between 0 and 10'
    
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Validate Step 2
  const validateStep2 = () => {
    const errs = {}
    if (!form.targetCountry) errs.targetCountry = 'Please select a target country'
    if (!form.targetDegree) errs.targetDegree = 'Please select a target degree'
    if (!form.targetIntake) errs.targetIntake = 'Please select a target intake year'
    if (!form.englishLevel) errs.englishLevel = 'Please select your English level'
    if (!form.budgetRange) errs.budgetRange = 'Please select your budget range'
    
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2)
    } else {
      showError("Please fill all required fields correctly.")
    }
  }

  const handleSubmit = async () => {
    if (!validateStep2()) {
      showError("Please fill all target goal details.")
      return
    }
    
    setSubmitting(true)
    try {
      await saveOnboardingData(form)
      showSuccess("Welcome abroad! Onboarding completed successfully. 🎉")
      if (onClose) onClose()
    } catch (err) {
      console.error(err)
      showError(err.message || "Failed to save onboarding profile. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      showSuccess("Logged out successfully.")
      if (onClose) onClose()
    } catch (err) {
      showError("Failed to log out.")
    }
  }

  const filteredFields = FIELDS_OF_STUDY.filter(f => 
    f.toLowerCase().includes(searchField.toLowerCase())
  )

  return (
    <div style={styles.overlay}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ type: 'spring', duration: 0.5 }}
        style={styles.modalCard}
      >
        {/* Dismiss Button */}
        {isDismissible && onClose && (
          <button onClick={onClose} style={styles.dismissBtn} aria-label="Close modal">
            <X size={20} />
          </button>
        )}

        {/* Top Header Section */}
        <div style={styles.topHeader}>
          {/* Top Center Badge */}
          <div style={styles.iconCircle}>
            <GraduationCap size={32} color="#2563EB" />
          </div>

          <h2 style={styles.title}>Let's Personalize Your Plan</h2>
          <p style={styles.subtitle}>
            {step === 1 
              ? "Step 1 of 2 — Your Background" 
              : "Step 2 of 2 — Study Abroad Goal"
            }
          </p>

          {/* Progress Bar */}
          <div style={styles.progressBarWrapper}>
            <div style={styles.progressBarBg}>
              <motion.div 
                initial={{ width: '0%' }}
                animate={{ width: step === 1 ? '50%' : '100%' }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                style={styles.progressBarActive}
              />
            </div>
            <span style={styles.progressText}>{step === 1 ? '50%' : '100%'}</span>
          </div>

          <p style={styles.introText}>
            Complete this to unlock your personalized roadmap & study dashboard.
          </p>
        </div>

        {/* Scroll Container */}
        <div style={styles.scrollContainer}>
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.25 }}
                style={styles.formStep}
              >
                {/* Full Name & Age Grid */}
                <div style={styles.grid2}>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Full Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Arup Das" 
                      value={form.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      style={{
                        ...styles.input,
                        borderColor: errors.fullName ? 'var(--accent-error, #ef4444)' : 'rgba(15,23,42,.08)'
                      }}
                    />
                    {errors.fullName && <span style={styles.errorText}>{errors.fullName}</span>}
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Age *</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 21" 
                      value={form.age}
                      onChange={(e) => updateField('age', e.target.value)}
                      style={{
                        ...styles.input,
                        borderColor: errors.age ? 'var(--accent-error, #ef4444)' : 'rgba(15,23,42,.08)'
                      }}
                    />
                    {errors.age && <span style={styles.errorText}>{errors.age}</span>}
                  </div>
                </div>

                {/* Gender Selectable Cards */}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Gender *</label>
                  <div style={styles.genderGrid}>
                    {['Male', 'Female', 'Other'].map(g => {
                      const isSelected = form.gender === g;
                      return (
                        <div 
                          key={g} 
                          onClick={() => updateField('gender', g)}
                          style={{
                            ...styles.genderCard,
                            ...(isSelected ? styles.genderCardSelected : {})
                          }}
                        >
                          <div style={{
                            ...styles.genderCardDot,
                            ...(isSelected ? styles.genderCardDotSelected : {})
                          }} />
                          <span style={{ fontSize: '0.92rem', fontWeight: 600, color: isSelected ? '#2563EB' : '#0F172A' }}>{g}</span>
                        </div>
                      )
                    })}
                  </div>
                  {errors.gender && <span style={styles.errorText}>{errors.gender}</span>}
                </div>

                {/* Education Level Premium Selectable Cards */}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Education Level *</label>
                  <div style={styles.eduGrid}>
                    {EDUCATION_LEVELS.map(edu => {
                      const isSelected = form.educationLevel === edu.id;
                      return (
                        <motion.div 
                          key={edu.id}
                          whileHover={{ y: -1, boxShadow: '0 4px 12px rgba(15,23,42,0.04)' }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => updateField('educationLevel', edu.id)}
                          style={{
                            ...styles.eduCard,
                            ...(isSelected ? styles.eduCardSelected : {})
                          }}
                        >
                          <div style={styles.eduCardContent}>
                            <div style={{
                              ...styles.eduCardTitle,
                              color: isSelected ? '#2563EB' : '#0F172A'
                            }}>{edu.label}</div>
                            <div style={styles.eduCardDesc}>{edu.desc}</div>
                          </div>
                          <div style={{
                            ...styles.eduCardCheck,
                            ...(isSelected ? styles.eduCardCheckSelected : {})
                          }}>
                            {isSelected && <Check size={12} color="white" />}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                  {errors.educationLevel && <span style={styles.errorText}>{errors.educationLevel}</span>}
                </div>

                {/* University Field */}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Current School / College / University *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Brainware University" 
                    value={form.university}
                    onChange={(e) => updateField('university', e.target.value)}
                    style={{
                      ...styles.input,
                      borderColor: errors.university ? 'var(--accent-error, #ef4444)' : 'rgba(15,23,42,.08)'
                    }}
                  />
                  {errors.university && <span style={styles.errorText}>{errors.university}</span>}
                </div>

                {/* Field of Study (Searchable Dropdown) */}
                <div style={styles.fieldGroup} ref={dropdownRef}>
                  <label style={styles.label}>Field of Study *</label>
                  <div style={styles.searchableWrapper}>
                    <input 
                      type="text" 
                      placeholder="Search or type field of study..." 
                      value={searchField !== '' ? searchField : form.fieldOfStudy}
                      onFocus={() => setShowFieldDropdown(true)}
                      onChange={(e) => {
                        setSearchField(e.target.value)
                        updateField('fieldOfStudy', e.target.value)
                        setShowFieldDropdown(true)
                      }}
                      style={{
                        ...styles.input,
                        paddingRight: 45,
                        borderColor: errors.fieldOfStudy ? 'var(--accent-error, #ef4444)' : 'rgba(15,23,42,.08)'
                      }}
                    />
                    <Search size={18} style={styles.searchIcon} />
                    
                    {showFieldDropdown && (
                      <div style={styles.dropdownList}>
                        {filteredFields.length > 0 ? (
                          filteredFields.map(f => (
                            <div 
                              key={f}
                              onClick={() => {
                                handleFieldChange(f)
                                setShowFieldDropdown(false)
                              }}
                              style={styles.dropdownItem}
                            >
                              {f}
                            </div>
                          ))
                        ) : (
                          <div 
                            onClick={() => {
                              handleFieldChange(searchField)
                              setShowFieldDropdown(false)
                            }}
                            style={{...styles.dropdownItem, color: '#2563EB', fontWeight: 600}}
                          >
                            Add "{searchField}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {errors.fieldOfStudy && <span style={styles.errorText}>{errors.fieldOfStudy}</span>}
                </div>

                {/* Semester & CGPA Grid */}
                <div style={styles.grid2}>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Current Semester (If applicable)</label>
                    <select 
                      value={form.semester} 
                      onChange={(e) => updateField('semester', e.target.value)}
                      style={styles.select}
                    >
                      <option value="">Select Semester</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                        <option key={s} value={s}>Semester {s}</option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Current CGPA (If applicable)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      placeholder="e.g. 8.5" 
                      value={form.cgpa}
                      onChange={(e) => updateField('cgpa', e.target.value)}
                      style={{
                        ...styles.input,
                        borderColor: errors.cgpa ? 'var(--accent-error, #ef4444)' : 'rgba(15,23,42,.08)'
                      }}
                    />
                    {errors.cgpa && <span style={styles.errorText}>{errors.cgpa}</span>}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.25 }}
                style={styles.formStep}
              >
                {/* Target Country Selectable Cards */}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Target Country *</label>
                  <div style={styles.countryGrid}>
                    {COUNTRIES.map(country => {
                      const isSelected = form.targetCountry === country.id;
                      return (
                        <motion.div
                          key={country.id}
                          whileHover={{ y: -1, boxShadow: '0 4px 12px rgba(15,23,42,0.04)' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateField('targetCountry', country.id)}
                          style={{
                            ...styles.countryCard,
                            ...(isSelected ? styles.countryCardSelected : {})
                          }}
                        >
                          <span style={styles.countryFlag}>{country.flag}</span>
                          <span style={{
                            ...styles.countryName,
                            color: isSelected ? '#2563EB' : '#0F172A'
                          }}>{country.label}</span>
                          {isSelected && (
                            <div style={styles.countryCheck}>
                              <Check size={10} color="white" />
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                  {errors.targetCountry && <span style={styles.errorText}>{errors.targetCountry}</span>}
                </div>

                {/* Target Degree, Intake, English Level Grid */}
                <div style={styles.grid3}>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Target Degree *</label>
                    <select 
                      value={form.targetDegree} 
                      onChange={(e) => updateField('targetDegree', e.target.value)}
                      style={{
                        ...styles.select,
                        borderColor: errors.targetDegree ? 'var(--accent-error, #ef4444)' : 'rgba(15,23,42,.08)'
                      }}
                    >
                      <option value="">Select Degree</option>
                      {['Bachelor', 'Master', 'PhD'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    {errors.targetDegree && <span style={styles.errorText}>{errors.targetDegree}</span>}
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Target Intake *</label>
                    <select 
                      value={form.targetIntake} 
                      onChange={(e) => updateField('targetIntake', e.target.value)}
                      style={{
                        ...styles.select,
                        borderColor: errors.targetIntake ? 'var(--accent-error, #ef4444)' : 'rgba(15,23,42,.08)'
                      }}
                    >
                      <option value="">Select Intake</option>
                      {['2027', '2028', '2029'].map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    {errors.targetIntake && <span style={styles.errorText}>{errors.targetIntake}</span>}
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>English Level *</label>
                    <select 
                      value={form.englishLevel} 
                      onChange={(e) => updateField('englishLevel', e.target.value)}
                      style={{
                        ...styles.select,
                        borderColor: errors.englishLevel ? 'var(--accent-error, #ef4444)' : 'rgba(15,23,42,.08)'
                      }}
                    >
                      <option value="">Select Level</option>
                      {['Beginner', 'Intermediate', 'Advanced', 'IELTS Ready'].map(lvl => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                    {errors.englishLevel && <span style={styles.errorText}>{errors.englishLevel}</span>}
                  </div>
                </div>

                {/* Budget Range Selectable Chips */}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Budget Range *</label>
                  <div style={styles.budgetGrid}>
                    {['₹5L–10L', '₹10L–20L', '₹20L–30L', '₹30L+'].map(b => {
                      const isSelected = form.budgetRange === b;
                      return (
                        <div
                          key={b}
                          onClick={() => updateField('budgetRange', b)}
                          style={{
                            ...styles.budgetChip,
                            ...(isSelected ? styles.budgetChipSelected : {})
                          }}
                        >
                          <DollarSign size={14} style={{ color: isSelected ? '#2563EB' : '#64748B' }} />
                          <span>{b}</span>
                        </div>
                      )
                    })}
                  </div>
                  {errors.budgetRange && <span style={styles.errorText}>{errors.budgetRange}</span>}
                </div>

                {/* Security Trust Banner */}
                <div style={styles.trustBanner}>
                  <Award size={18} style={{ color: '#d97706', flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.4 }}>
                    Studytra AI uses your profile data strictly to compute your university matches, budget forecasts, and visa checklists. We never share your data.
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Buttons Footer */}
        <div style={styles.buttonsFooter}>
          {step === 2 ? (
            <button 
              onClick={() => setStep(1)} 
              disabled={submitting}
              style={styles.backBtn}
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>
          ) : (
            <button onClick={handleLogout} style={styles.signOutBtn}>
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          )}

          {step === 1 ? (
            <motion.button 
              whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext} 
              style={styles.continueBtn}
            >
              <span>Continue</span>
              <ArrowRight size={18} />
            </motion.button>
          ) : (
            <motion.button 
              whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit} 
              disabled={submitting}
              style={styles.continueBtn}
            >
              {submitting ? (
                <>
                  <span className="spinner" style={styles.spinner} />
                  <span>Saving Plan...</span>
                </>
              ) : (
                <>
                  <span>Unlock My Dashboard</span>
                  <Check size={18} />
                </>
              )}
            </motion.button>
          )}
        </div>
      </motion.div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: 'rgba(252, 252, 253, 0.82)',
    backdropFilter: 'blur(16px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
    overflowY: 'auto'
  },
  modalCard: {
    width: '100%',
    maxWidth: 900,
    background: '#FFFFFF',
    border: '1px solid rgba(15, 23, 42, 0.08)',
    borderRadius: 32,
    padding: '48px 48px 40px',
    boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)',
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '94vh',
    overflow: 'hidden'
  },
  dismissBtn: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: '#FFFFFF',
    border: '1px solid rgba(15, 23, 42, 0.08)',
    color: '#64748B',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      background: '#F8FAFC',
      color: '#0F172A'
    }
  },
  topHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 32
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    background: '#EFF6FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
    fontWeight: 800,
    color: '#0F172A',
    margin: '0 0 8px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    letterSpacing: '-0.03em',
    lineHeight: 1.15
  },
  subtitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#64748B',
    margin: '0 0 16px',
    letterSpacing: '-0.01em'
  },
  progressBarWrapper: {
    width: '100%',
    maxWidth: 420,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    background: 'rgba(15, 23, 42, 0.04)',
    borderRadius: 10,
    overflow: 'hidden'
  },
  progressBarActive: {
    height: '100%',
    background: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)',
    borderRadius: 10
  },
  progressText: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#2563EB',
    width: 32,
    textAlign: 'right'
  },
  introText: {
    fontSize: '0.92rem',
    color: '#64748B',
    lineHeight: 1.5,
    maxWidth: 520,
    margin: 0
  },
  scrollContainer: {
    flex: 1,
    overflowY: 'auto',
    paddingRight: 6,
    marginBottom: 32,
    minHeight: 120
  },
  formStep: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
    '@media (max-width: 640px)': {
      gridTemplateColumns: '1fr'
    }
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 16,
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr'
    }
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  label: {
    fontSize: '0.88rem',
    fontWeight: 700,
    color: '#0F172A'
  },
  input: {
    background: '#FFFFFF',
    border: '1px solid rgba(15, 23, 42, 0.08)',
    borderRadius: 16,
    padding: '0 20px',
    height: 56,
    color: '#0F172A',
    fontSize: '0.96rem',
    fontWeight: 500,
    outline: 'none',
    transition: 'all 0.25s',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    '&:focus': {
      borderColor: '#2563EB',
      boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.08)'
    }
  },
  select: {
    background: '#FFFFFF',
    border: '1px solid rgba(15, 23, 42, 0.08)',
    borderRadius: 16,
    padding: '0 20px',
    height: 56,
    color: '#0F172A',
    fontSize: '0.96rem',
    fontWeight: 500,
    outline: 'none',
    cursor: 'pointer',
    transition: 'all 0.25s',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  },
  genderGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr'
    }
  },
  genderCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: '#FFFFFF',
    border: '1px solid rgba(15, 23, 42, 0.08)',
    borderRadius: 16,
    padding: '0 20px',
    height: 56,
    cursor: 'pointer',
    transition: 'all 0.25s',
    userSelect: 'none'
  },
  genderCardSelected: {
    borderColor: '#2563EB',
    background: 'rgba(37, 99, 235, 0.04)',
    boxShadow: '0 0 0 1px #2563EB'
  },
  genderCardDot: {
    width: 16,
    height: 16,
    borderRadius: '50%',
    border: '2px solid rgba(15, 23, 42, 0.15)',
    transition: 'all 0.25s',
    flexShrink: 0
  },
  genderCardDotSelected: {
    borderColor: '#2563EB',
    borderWidth: 5
  },
  eduGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16,
    '@media (max-width: 640px)': {
      gridTemplateColumns: '1fr'
    }
  },
  eduCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    background: '#FFFFFF',
    border: '1px solid rgba(15, 23, 42, 0.08)',
    borderRadius: 18,
    padding: '18px 24px',
    cursor: 'pointer',
    transition: 'all 0.25s',
    userSelect: 'none',
    boxShadow: '0 2px 4px rgba(15,23,42,0.01)'
  },
  eduCardSelected: {
    borderColor: '#2563EB',
    background: 'rgba(37, 99, 235, 0.04)',
    boxShadow: '0 0 0 1px #2563EB'
  },
  eduCardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  },
  eduCardTitle: {
    fontSize: '0.98rem',
    fontWeight: 700,
    color: '#0F172A'
  },
  eduCardDesc: {
    fontSize: '0.8rem',
    color: '#64748B',
    lineHeight: 1.3
  },
  eduCardCheck: {
    width: 22,
    height: 22,
    borderRadius: '50%',
    border: '2px solid rgba(15, 23, 42, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s'
  },
  eduCardCheckSelected: {
    background: '#2563EB',
    borderColor: '#2563EB'
  },
  searchableWrapper: {
    position: 'relative'
  },
  searchIcon: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#64748B',
    pointerEvents: 'none'
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: '#FFFFFF',
    border: '1px solid rgba(15, 23, 42, 0.08)',
    borderRadius: 16,
    marginTop: 6,
    maxHeight: 200,
    overflowY: 'auto',
    zIndex: 99999,
    boxShadow: '0 10px 30px rgba(15,23,42,0.08)'
  },
  dropdownItem: {
    padding: '14px 20px',
    fontSize: '0.92rem',
    color: '#0F172A',
    cursor: 'pointer',
    transition: 'all 0.15s',
    borderBottom: '1px solid rgba(15,23,42,0.03)'
  },
  errorText: {
    fontSize: '0.78rem',
    color: '#EF4444',
    marginTop: 2,
    fontWeight: 500
  },
  countryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
    '@media (max-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)'
    }
  },
  countryCard: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    background: '#FFFFFF',
    border: '1px solid rgba(15, 23, 42, 0.08)',
    borderRadius: 18,
    padding: '20px 12px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.25s',
    userSelect: 'none'
  },
  countryCardSelected: {
    borderColor: '#2563EB',
    background: 'rgba(37, 99, 235, 0.04)',
    boxShadow: '0 0 0 1px #2563EB'
  },
  countryFlag: {
    fontSize: '2rem'
  },
  countryName: {
    fontSize: '0.88rem',
    fontWeight: 700
  },
  countryCheck: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: '#2563EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  budgetGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
    '@media (max-width: 640px)': {
      gridTemplateColumns: 'repeat(2, 1fr)'
    }
  },
  budgetChip: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 54,
    borderRadius: 16,
    background: '#FFFFFF',
    border: '1px solid rgba(15, 23, 42, 0.08)',
    cursor: 'pointer',
    fontSize: '0.92rem',
    fontWeight: 700,
    color: '#0F172A',
    transition: 'all 0.25s',
    userSelect: 'none'
  },
  budgetChipSelected: {
    borderColor: '#2563EB',
    background: 'rgba(37, 99, 235, 0.04)',
    color: '#2563EB',
    boxShadow: '0 0 0 1px #2563EB'
  },
  trustBanner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    background: '#FEF3C7',
    border: '1px solid #FCD34D',
    borderRadius: 18,
    padding: '16px 20px',
    marginTop: 8
  },
  buttonsFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    borderTop: '1px solid rgba(15, 23, 42, 0.06)',
    paddingTop: 32
  },
  backBtn: {
    background: '#FFFFFF',
    border: '1px solid rgba(15, 23, 42, 0.08)',
    borderRadius: 16,
    color: '#64748B',
    padding: '0 28px',
    height: 56,
    fontSize: '0.96rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      background: '#F8FAFC',
      color: '#0F172A'
    }
  },
  signOutBtn: {
    background: 'rgba(239, 68, 68, 0.04)',
    border: '1px solid rgba(239, 68, 68, 0.1)',
    borderRadius: 16,
    color: '#EF4444',
    padding: '0 24px',
    height: 56,
    fontSize: '0.92rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      background: 'rgba(239, 68, 68, 0.08)'
    }
  },
  continueBtn: {
    marginLeft: 'auto',
    background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
    border: 'none',
    borderRadius: 16,
    color: '#ffffff',
    padding: '0 32px',
    height: 56,
    fontSize: '0.96rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  spinner: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.2)',
    borderTopColor: 'white',
    animation: 'spin 0.8s linear infinite',
    marginRight: 6
  }
}
