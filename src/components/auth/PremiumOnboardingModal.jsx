import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, GraduationCap, MapPin, Calendar, 
  BookOpen, LogOut, ArrowRight, ArrowLeft, 
  Check, DollarSign, Search, Award
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

export default function PremiumOnboardingModal({ isOpen, isDismissible = true, onClose }) {
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
    institution: '',
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
    if (!form.institution.trim()) errs.institution = 'Institution is required'
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

  // Filter study fields based on search input
  const filteredFields = FIELDS_OF_STUDY.filter(f => 
    f.toLowerCase().includes(searchField.toLowerCase())
  )

  return (
    <div style={styles.overlay}>
      {/* Background blur meshes */}
      <div style={styles.glowOverlay1} />
      <div style={styles.glowOverlay2} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', duration: 0.5 }}
        style={styles.modalCard}
      >
        {/* Modal Top Bar */}
        <div style={styles.topBar}>
          <div style={styles.logoGroup}>
            <div style={styles.logoIcon}>🎓</div>
            <div>
              <div style={styles.logoText}>Studytra AI</div>
              <div style={styles.logoSubtext}>Premium Onboarding</div>
            </div>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn} title="Sign Out">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Modal Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Let's Personalize Your Plan</h2>
          <p style={styles.subtitle}>
            {step === 1 
              ? "Step 1 of 2 — Your Background" 
              : "Step 2 of 2 — Study Abroad Goal"
            }
          </p>
          <div style={styles.subtext}>
            Complete this to unlock your personalized study abroad roadmap and dashboard.
          </div>
        </div>

        {/* Premium Progress Bar */}
        <div style={styles.progressBarBg}>
          <motion.div 
            initial={{ width: '0%' }}
            animate={{ width: step === 1 ? '50%' : '100%' }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={styles.progressBarActive}
          />
        </div>

        {/* Form Container */}
        <div style={styles.scrollContainer}>
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                style={styles.formStep}
              >
                <div style={styles.sectionHeader}>
                  <User size={16} style={{ color: '#2563eb' }} />
                  <span>Personal Information</span>
                </div>

                <div style={styles.grid2}>
                  {/* Full Name */}
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Full Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Arup Das" 
                      value={form.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      style={{
                        ...styles.input,
                        borderColor: errors.fullName ? '#ef4444' : 'var(--border-color, rgba(255,255,255,0.1))'
                      }}
                    />
                    {errors.fullName && <span style={styles.errorText}>{errors.fullName}</span>}
                  </div>

                  {/* Age */}
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Age *</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 21" 
                      value={form.age}
                      onChange={(e) => updateField('age', e.target.value)}
                      style={{
                        ...styles.input,
                        borderColor: errors.age ? '#ef4444' : 'var(--border-color, rgba(255,255,255,0.1))'
                      }}
                    />
                    {errors.age && <span style={styles.errorText}>{errors.age}</span>}
                  </div>
                </div>

                {/* Gender Options */}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Gender *</label>
                  <div style={styles.genderRow}>
                    {['Male', 'Female', 'Other'].map(g => (
                      <label 
                        key={g} 
                        style={{
                          ...styles.genderCard,
                          ...(form.gender === g ? styles.genderCardSelected : {})
                        }}
                      >
                        <input 
                          type="radio" 
                          name="gender" 
                          value={g} 
                          checked={form.gender === g}
                          onChange={() => updateField('gender', g)}
                          style={styles.hiddenRadio}
                        />
                        <span style={styles.genderDot}>
                          {form.gender === g && <span style={styles.genderDotInner} />}
                        </span>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{g}</span>
                      </label>
                    ))}
                  </div>
                  {errors.gender && <span style={styles.errorText}>{errors.gender}</span>}
                </div>

                {/* Education Level (Premium selectable cards) */}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Education Level *</label>
                  <div style={styles.eduCardGrid}>
                    {EDUCATION_LEVELS.map(edu => {
                      const isSelected = form.educationLevel === edu.id;
                      return (
                        <div 
                          key={edu.id}
                          onClick={() => updateField('educationLevel', edu.id)}
                          style={{
                            ...styles.eduCard,
                            ...(isSelected ? styles.eduCardSelected : {})
                          }}
                        >
                          <div style={styles.eduCardCheck}>
                            {isSelected ? (
                              <div style={styles.checkBubble}><Check size={10} color="white" /></div>
                            ) : (
                              <div style={styles.uncheckBubble} />
                            )}
                          </div>
                          <div style={styles.eduCardContent}>
                            <div style={styles.eduCardTitle}>{edu.label}</div>
                            <div style={styles.eduCardDesc}>{edu.desc}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {errors.educationLevel && <span style={styles.errorText}>{errors.educationLevel}</span>}
                </div>

                {/* Institution & Field of Study */}
                <div style={{ ...styles.sectionHeader, marginTop: 24, display: 'flex', gap: 8, alignItems: 'center', fontWeight: 700, fontSize: '0.95rem' }}>
                  <GraduationCap size={16} style={{ color: '#2563eb' }} />
                  <span>Academic Details</span>
                </div>

                <div style={styles.grid2}>
                  {/* Current School/University */}
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Current University / College / School *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Brainware University" 
                      value={form.institution}
                      onChange={(e) => updateField('institution', e.target.value)}
                      style={{
                        ...styles.input,
                        borderColor: errors.institution ? '#ef4444' : 'var(--border-color, rgba(255,255,255,0.1))'
                      }}
                    />
                    {errors.institution && <span style={styles.errorText}>{errors.institution}</span>}
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
                          paddingRight: 35,
                          borderColor: errors.fieldOfStudy ? '#ef4444' : 'var(--border-color, rgba(255,255,255,0.1))'
                        }}
                      />
                      <Search size={15} style={styles.searchIcon} />
                      
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
                              style={{...styles.dropdownItem, color: '#2563eb', fontWeight: 600}}
                            >
                              Add "{searchField}"
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {errors.fieldOfStudy && <span style={styles.errorText}>{errors.fieldOfStudy}</span>}
                  </div>
                </div>

                <div style={styles.grid2}>
                  {/* Semester */}
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Current Semester (1-8)</label>
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

                  {/* CGPA */}
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Current CGPA (Optional)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      placeholder="e.g. 8.1" 
                      value={form.cgpa}
                      onChange={(e) => updateField('cgpa', e.target.value)}
                      style={{
                        ...styles.input,
                        borderColor: errors.cgpa ? '#ef4444' : 'var(--border-color, rgba(255,255,255,0.1))'
                      }}
                    />
                    {errors.cgpa && <span style={styles.errorText}>{errors.cgpa}</span>}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                style={styles.formStep}
              >
                <div style={styles.sectionHeader}>
                  <MapPin size={16} style={{ color: '#2563eb' }} />
                  <span>Target Goals & Budget</span>
                </div>

                {/* Country List cards */}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Target Country *</label>
                  <div style={styles.countryGrid}>
                    {COUNTRIES.map(country => {
                      const isSelected = form.targetCountry === country.id;
                      return (
                        <div
                          key={country.id}
                          onClick={() => updateField('targetCountry', country.id)}
                          style={{
                            ...styles.countryCard,
                            ...(isSelected ? styles.countryCardSelected : {})
                          }}
                        >
                          <span style={styles.countryFlag}>{country.flag}</span>
                          <span style={styles.countryName}>{country.label}</span>
                          {isSelected && (
                            <span style={styles.countryCheck}><Check size={12} color="white" /></span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  {errors.targetCountry && <span style={styles.errorText}>{errors.targetCountry}</span>}
                </div>

                <div style={styles.grid3}>
                  {/* Degree Goal */}
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Target Degree *</label>
                    <select 
                      value={form.targetDegree} 
                      onChange={(e) => updateField('targetDegree', e.target.value)}
                      style={{
                        ...styles.select,
                        borderColor: errors.targetDegree ? '#ef4444' : 'var(--border-color, rgba(255,255,255,0.1))'
                      }}
                    >
                      <option value="">Select Degree</option>
                      {['Bachelor', 'Master', 'PhD'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    {errors.targetDegree && <span style={styles.errorText}>{errors.targetDegree}</span>}
                  </div>

                  {/* Intake Year */}
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Target Intake *</label>
                    <select 
                      value={form.targetIntake} 
                      onChange={(e) => updateField('targetIntake', e.target.value)}
                      style={{
                        ...styles.select,
                        borderColor: errors.targetIntake ? '#ef4444' : 'var(--border-color, rgba(255,255,255,0.1))'
                      }}
                    >
                      <option value="">Select Intake</option>
                      {['2027', '2028', '2029'].map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    {errors.targetIntake && <span style={styles.errorText}>{errors.targetIntake}</span>}
                  </div>

                  {/* English level */}
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>English Level *</label>
                    <select 
                      value={form.englishLevel} 
                      onChange={(e) => updateField('englishLevel', e.target.value)}
                      style={{
                        ...styles.select,
                        borderColor: errors.englishLevel ? '#ef4444' : 'var(--border-color, rgba(255,255,255,0.1))'
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

                {/* Budget Range (Selectable premium chips) */}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Budget Range *</label>
                  <div style={styles.budgetRow}>
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
                          <DollarSign size={13} style={isSelected ? { color: 'white' } : { color: '#64748b' }} />
                          <span>{b}</span>
                        </div>
                      )
                    })}
                  </div>
                  {errors.budgetRange && <span style={styles.errorText}>{errors.budgetRange}</span>}
                </div>

                {/* Trust banner */}
                <div style={styles.trustBanner}>
                  <Award size={18} style={{ color: '#d97706', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
                    Studytra AI uses your profile data strictly to compute your university matches, budget forecasts, and personalized visa checklists.
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Buttons */}
        <div style={styles.footerButtons}>
          {step === 2 && (
            <button 
              onClick={() => setStep(1)} 
              disabled={submitting}
              style={styles.backBtn}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          )}

          {step === 1 ? (
            <button 
              onClick={handleNext} 
              style={styles.nextBtn}
            >
              <span>Next Step</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button 
              onClick={handleSubmit} 
              disabled={submitting}
              style={styles.submitBtn}
            >
              {submitting ? (
                <>
                  <span className="spinner" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: 'white' }} />
                  <span>Saving Plan...</span>
                </>
              ) : (
                <>
                  <span>Unlock My Dashboard</span>
                  <Check size={16} />
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: 'var(--modal-overlay, rgba(4, 8, 15, 0.88))',
    backdropFilter: 'blur(20px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    overflowY: 'auto'
  },
  glowOverlay1: {
    position: 'absolute',
    width: 400,
    height: 400,
    background: '#2563eb',
    borderRadius: '50%',
    filter: 'blur(160px)',
    opacity: 0.12,
    top: '10%',
    left: '15%',
    pointerEvents: 'none'
  },
  glowOverlay2: {
    position: 'absolute',
    width: 400,
    height: 400,
    background: '#7c3aed',
    borderRadius: '50%',
    filter: 'blur(160px)',
    opacity: 0.1,
    bottom: '10%',
    right: '15%',
    pointerEvents: 'none'
  },
  modalCard: {
    width: '100%',
    maxWidth: 680,
    background: 'var(--card-bg, #0b1528)',
    border: '1px solid var(--border-color, rgba(59, 130, 246, 0.2))',
    borderRadius: 24,
    padding: '32px 32px 28px',
    boxShadow: '0 25px 60px rgba(0,0,0,0.7), inset 0 2px 22px rgba(255,255,255,0.03)',
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '92vh',
    overflow: 'hidden'
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottom: '1px solid rgba(255,255,255,0.06)'
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  logoIcon: {
    fontSize: '1.4rem'
  },
  logoText: {
    fontSize: '0.9rem',
    fontWeight: 800,
    color: 'var(--text-primary, #ffffff)',
    letterSpacing: '0.5px'
  },
  logoSubtext: {
    fontSize: '0.7rem',
    color: '#94a3b8'
  },
  logoutBtn: {
    background: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: 12,
    color: '#f87171',
    padding: '8px 14px',
    fontSize: '0.8rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  header: {
    textAlign: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: 'var(--text-primary, #ffffff)',
    margin: '0 0 6px',
    fontFamily: 'Playfair Display, serif'
  },
  subtitle: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#2563eb',
    margin: '0 0 8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  subtext: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    lineHeight: 1.4,
    maxWidth: 480,
    margin: '0 auto'
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    marginBottom: 24,
    overflow: 'hidden'
  },
  progressBarActive: {
    height: '100%',
    background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)',
    borderRadius: 10
  },
  scrollContainer: {
    flex: 1,
    overflowY: 'auto',
    paddingRight: 4,
    marginBottom: 24,
    minHeight: 100
  },
  formStep: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: '0.9rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderLeft: '3px solid #2563eb',
    paddingLeft: 8,
    marginBottom: 4
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    '@media (max-width: 580px)': {
      gridTemplateColumns: '1fr'
    }
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 16,
    '@media (max-width: 580px)': {
      gridTemplateColumns: '1fr'
    }
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#94a3b8'
  },
  input: {
    background: 'var(--input-bg, rgba(255,255,255,0.03))',
    border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
    borderRadius: 12,
    padding: '12px 16px',
    color: 'var(--text-primary, #ffffff)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'all 0.2s',
    '&:focus': {
      borderColor: '#2563eb',
      boxShadow: '0 0 10px rgba(37, 99, 235, 0.15)',
      background: 'rgba(255,255,255,0.05)'
    }
  },
  select: {
    background: 'var(--input-bg, rgba(255,255,255,0.03))',
    border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
    borderRadius: 12,
    padding: '12px 16px',
    color: 'var(--text-primary, #ffffff)',
    fontSize: '0.9rem',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    transition: 'all 0.2s'
  },
  genderRow: {
    display: 'flex',
    gap: 12
  },
  genderCard: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: '12px 16px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  genderCardSelected: {
    border: '1px solid #2563eb',
    background: 'rgba(37, 99, 235, 0.1)'
  },
  hiddenRadio: {
    display: 'none'
  },
  genderDot: {
    width: 16,
    height: 16,
    borderRadius: '50%',
    border: '2px solid #64748b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  genderDotInner: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#2563eb'
  },
  eduCardGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },
  eduCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: '12px 16px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  eduCardSelected: {
    border: '1px solid #2563eb',
    background: 'rgba(37, 99, 235, 0.1)'
  },
  eduCardCheck: {
    flexShrink: 0
  },
  checkBubble: {
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: '#2563eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  uncheckBubble: {
    width: 18,
    height: 18,
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.15)'
  },
  eduCardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2
  },
  eduCardTitle: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: 'var(--text-primary)'
  },
  eduCardDesc: {
    fontSize: '0.72rem',
    color: '#64748b'
  },
  searchableWrapper: {
    position: 'relative'
  },
  searchIcon: {
    position: 'absolute',
    right: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#64748b',
    pointerEvents: 'none'
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: 'var(--dropdown-bg, #0f1c30)',
    border: '1px solid var(--border-color, rgba(59, 130, 246, 0.25))',
    borderRadius: 12,
    marginTop: 6,
    maxHeight: 200,
    overflowY: 'auto',
    zIndex: 99999,
    boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
  },
  dropdownItem: {
    padding: '10px 16px',
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    transition: 'all 0.15s',
    borderBottom: '1px solid rgba(255,255,255,0.03)'
  },
  errorText: {
    fontSize: '0.72rem',
    color: '#ef4444',
    marginTop: 2
  },
  countryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 12,
    '@media (max-width: 580px)': {
      gridTemplateColumns: 'repeat(2, 1fr)'
    }
  },
  countryCard: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: '16px 10px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s'
  },
  countryCardSelected: {
    border: '1px solid #2563eb',
    background: 'rgba(37, 99, 235, 0.1)',
    boxShadow: '0 4px 15px rgba(37,99,235,0.1)'
  },
  countryFlag: {
    fontSize: '1.6rem'
  },
  countryName: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'var(--text-primary)'
  },
  countryCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: '50%',
    background: '#2563eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  budgetRow: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap'
  },
  budgetChip: {
    flex: 1,
    minWidth: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '12px 14px',
    borderRadius: 12,
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.08)',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    transition: 'all 0.2s'
  },
  budgetChipSelected: {
    background: '#2563eb',
    borderColor: '#2563eb',
    color: '#ffffff'
  },
  trustBanner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    background: 'rgba(217, 119, 6, 0.04)',
    border: '1px solid rgba(217, 119, 6, 0.15)',
    borderRadius: 14,
    padding: '12px 16px',
    marginTop: 10
  },
  footerButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 14,
    borderTop: '1px solid rgba(255,255,255,0.06)',
    paddingTop: 20
  },
  backBtn: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    color: '#94a3b8',
    padding: '12px 24px',
    fontSize: '0.9rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  nextBtn: {
    marginLeft: 'auto',
    background: '#2563eb',
    border: 'none',
    borderRadius: 12,
    color: '#ffffff',
    padding: '12px 24px',
    fontSize: '0.9rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 14px rgba(37,99,235,0.3)'
  },
  submitBtn: {
    marginLeft: 'auto',
    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
    border: 'none',
    borderRadius: 12,
    color: '#ffffff',
    padding: '12px 24px',
    fontSize: '0.9rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 14px rgba(37,99,235,0.3)'
  }
}
