import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Globe, Sparkles, Check, ArrowLeft, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

import StepOne from '../components/onboarding/StepOne'
import StepTwo from '../components/onboarding/StepTwo'
import StepThree from '../components/onboarding/StepThree'

export default function OnboardingPage() {
  const { user, userProfile, saveOnboardingData, logout } = useAuth()
  const { showSuccess, showError } = useToast()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState('forward')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    // Step 1
    fullName: '',
    age: '',
    gender: '',
    educationLevel: '',
    university: '',
    fieldOfStudy: '',
    semester: '',
    cgpa: '',
    // Step 2
    targetCountry: '',
    targetDegree: '',
    targetIntake: '',
    englishLevel: '',
    // Step 3
    careerGoal: '',
    studyLanguage: '',
    workPreference: '',
  })

  // Pre-fill user details from Auth Context
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.displayName || '',
      }))
    }
  }, [user])

  // Redirect if already onboarded
  useEffect(() => {
    if (userProfile && (userProfile.onboardingCompleted || userProfile.onboardingComplete)) {
      navigate('/chat', { replace: true })
    }
  }, [userProfile, navigate])

  const update = (key, val) => {
    setFormData(prev => ({ ...prev, [key]: val }))
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }))
    }
  }

  const validateStep = (currentStep) => {
    const errs = {}
    if (currentStep === 1) {
      if (!formData.fullName.trim()) errs.fullName = 'Full name is required'
      if (!formData.age) errs.age = 'Age is required'
      else {
        const parsedAge = parseInt(formData.age, 10)
        if (isNaN(parsedAge) || parsedAge < 15 || parsedAge > 40) {
          errs.age = 'Enter an age between 15 and 40'
        }
      }
      if (!formData.gender) errs.gender = 'Gender selection is required'
      if (!formData.educationLevel) errs.educationLevel = 'Education level is required'
      if (!formData.university.trim()) errs.university = 'University / College is required'
      if (!formData.fieldOfStudy.trim()) errs.fieldOfStudy = 'Field of study is required'
    } else if (currentStep === 2) {
      if (!formData.targetCountry) errs.targetCountry = 'Target country is required'
      if (!formData.targetDegree) errs.targetDegree = 'Degree goal is required'
      if (!formData.targetIntake) errs.targetIntake = 'Intended intake is required'
      if (!formData.englishLevel) errs.englishLevel = 'English level is required'
    }
    
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setDirection('forward')
      setStep(s => s + 1)
    } else {
      showError('Please check your input details.')
    }
  }

  const handleBack = () => {
    setDirection('back')
    setStep(s => s - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await saveOnboardingData(formData)
      setSubmitted(true)
      // Success screen will auto-navigate to /chat after 2 seconds
      setTimeout(() => {
        navigate('/chat', { replace: true })
      }, 2000)
    } catch (err) {
      console.error("Onboarding submission failed:", err)
      showError(err.message || "Failed to submit onboarding profile.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="ob-page">
        <div className="ob-card ob-success-card">
          <div className="ob-success-icon">✦</div>
          <h2 className="ob-step-title">Your Roadmap Is Ready</h2>
          <p className="ob-step-subtitle" style={{ marginTop: 8 }}>
            Studytra AI is personalizing your plan for {formData.targetCountry}.
          </p>
          <div className="ob-success-loader">
            <div className="ob-success-progress" />
          </div>
        </div>
      </div>
    )
  }

  const getStepProgress = () => {
    if (step === 1) return '33%'
    if (step === 2) return '66%'
    return '100%'
  }

  return (
    <div className="ob-page">
      <div className="ob-card">
        
        {/* Step dots */}
        <div className="ob-step-dots">
          {[1, 2, 3].map((n, i) => (
            <React.Fragment key={n}>
              <div className={`ob-dot ${n < step ? 'done' : n === step ? 'active' : 'pending'}`}>
                {n < step ? <Check size={10} /> : n}
              </div>
              {i < 2 && (
                <div className={`ob-dot-connector ${step > n ? 'filled' : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Header content */}
        <div className="ob-step-header">
          <div className="ob-step-icon-wrap">
            {step === 1 && <User size={24} />}
            {step === 2 && <Globe size={24} />}
            {step === 3 && <Sparkles size={24} />}
          </div>
          <div className="ob-step-label">Step {step} of 3</div>
          <h2 className="ob-step-title">
            {step === 1 && "Tell Us About You"}
            {step === 2 && "Where Are You Headed?"}
            {step === 3 && "Personalize Your AI"}
          </h2>
          <p className="ob-step-subtitle">
            {step === 1 && "We'll use this to personalize your study abroad roadmap."}
            {step === 2 && "Choose your destination and degree goal."}
            {step === 3 && (
              <span>
                Help Studytra AI give you sharper, more relevant guidance.
                <span style={{
                  marginLeft: 8,
                  background: 'var(--gold-faint)',
                  border: '1px solid var(--gold-border)',
                  color: 'var(--gold)',
                  fontSize: '9px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: 4,
                  fontFamily: 'var(--font-ui)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'inline-block',
                  verticalAlign: 'middle'
                }}>[RECOMMENDED]</span>
              </span>
            )}
          </p>

          {/* Thin Progress bar */}
          <div className="ob-progress-track">
            <div className="ob-progress-fill" style={{ width: getStepProgress() }} />
          </div>
        </div>

        {/* Transition form content */}
        <div key={step} className={`ob-step-content ${direction === 'back' ? 'going-back' : ''}`}>
          {step === 1 && <StepOne formData={formData} update={update} errors={errors} />}
          {step === 2 && <StepTwo formData={formData} update={update} errors={errors} />}
          {step === 3 && <StepThree formData={formData} update={update} />}
        </div>

        {/* Footer buttons */}
        <div className="ob-footer">
          {step > 1 ? (
            <button type="button" onClick={handleBack} className="ob-btn-back">
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <div /> // Spacer
          )}

          {step < 3 ? (
            <button type="button" onClick={handleNext} className="ob-btn-next">
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button 
              type="button" 
              onClick={handleSubmit} 
              disabled={loading}
              className="ob-btn-next ob-btn-finish"
            >
              {loading ? (
                <span className="btn-spinner" />
              ) : (
                <>
                  <span>Build My Roadmap</span>
                  <Sparkles size={16} fill="white" />
                </>
              )}
            </button>
          )}
        </div>

      </div>

      <div style={{ textAlign: 'center', zIndex: 1, marginTop: '16px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
          Signed in as <strong style={{ color: 'var(--text-secondary)' }}>{user?.email}</strong>. Not you?{' '}
          <button 
            type="button"
            onClick={logout}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--navy)',
              fontWeight: 600,
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: 0,
              fontFamily: 'inherit',
              fontSize: 'inherit',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-hover, #2b4c8c)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--navy)'}
          >
            Sign Out
          </button>
        </span>
      </div>
    </div>
  )
}
