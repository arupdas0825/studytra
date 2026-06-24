import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { User, Save, RefreshCw, GraduationCap, MapPin, Globe } from 'lucide-react'

export default function ProfilePage() {
  const { user, userProfile, saveOnboardingData } = useAuth()
  const { showSuccess, showError } = useToast()

  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
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

  // Load profile values on mount/load
  useEffect(() => {
    if (userProfile) {
      setFormData({
        fullName: userProfile.fullName || '',
        age: userProfile.age || '',
        gender: userProfile.gender || '',
        educationLevel: userProfile.educationLevel || '',
        institution: userProfile.institution || userProfile.university || '',
        fieldOfStudy: userProfile.fieldOfStudy || '',
        semester: userProfile.semester || '',
        cgpa: userProfile.cgpa || '',
        targetCountry: userProfile.targetCountry || '',
        targetDegree: userProfile.targetDegree || '',
        targetIntake: userProfile.targetIntake || '',
        englishLevel: userProfile.englishLevel || '',
        budgetRange: userProfile.budgetRange || ''
      })
    }
  }, [userProfile])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await saveOnboardingData(formData)
      showSuccess('Profile updated successfully!')
    } catch (err) {
      console.error(err)
      showError('Failed to save profile changes.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{
      maxWidth: 800,
      margin: '0 auto',
      padding: '40px 24px 80px',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      {/* Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF'
        }}>
          <User size={20} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>My Study Profile</h1>
          <p style={{ color: '#64748B', fontSize: '0.88rem', margin: '4px 0 0' }}>Manage the profile details used to personalize your AI adviser and checklist.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Profile Card */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid rgba(15, 23, 42, 0.08)',
          borderRadius: 24,
          padding: '32px',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: 28
        }}>
          {/* Section 1: Basic details */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={16} color="#2563EB" /> Basic Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName} 
                  onChange={handleChange}
                  required
                  style={{
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    outline: 'none',
                    fontSize: '0.9rem',
                    color: '#0F172A',
                    background: '#FAFAF8'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Age</label>
                <input 
                  type="number" 
                  name="age"
                  value={formData.age} 
                  onChange={handleChange}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    outline: 'none',
                    fontSize: '0.9rem',
                    color: '#0F172A',
                    background: '#FAFAF8'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Gender</label>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    outline: 'none',
                    fontSize: '0.9rem',
                    color: '#0F172A',
                    background: '#FAFAF8'
                  }}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(15, 23, 42, 0.06)' }} />

          {/* Section 2: Academic background */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <GraduationCap size={16} color="#2563EB" /> Academic Background
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Education Level</label>
                <select 
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    outline: 'none',
                    fontSize: '0.9rem',
                    color: '#0F172A',
                    background: '#FAFAF8'
                  }}
                >
                  <option value="">Select Level</option>
                  <option value="Undergraduate">Undergraduate (Bachelors)</option>
                  <option value="Graduate">Graduate (Masters)</option>
                  <option value="High School">High School (12th Grade)</option>
                  <option value="Working Professional">Working Professional</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Current Institution</label>
                <input 
                  type="text" 
                  name="institution"
                  value={formData.institution} 
                  onChange={handleChange}
                  placeholder="e.g. Delhi University"
                  style={{
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    outline: 'none',
                    fontSize: '0.9rem',
                    color: '#0F172A',
                    background: '#FAFAF8'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Field of Study</label>
                <input 
                  type="text" 
                  name="fieldOfStudy"
                  value={formData.fieldOfStudy} 
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                  style={{
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    outline: 'none',
                    fontSize: '0.9rem',
                    color: '#0F172A',
                    background: '#FAFAF8'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>CGPA / GPA</label>
                <input 
                  type="text" 
                  name="cgpa"
                  value={formData.cgpa} 
                  onChange={handleChange}
                  placeholder="e.g. 8.5/10"
                  style={{
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    outline: 'none',
                    fontSize: '0.9rem',
                    color: '#0F172A',
                    background: '#FAFAF8'
                  }}
                />
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(15, 23, 42, 0.06)' }} />

          {/* Section 3: Study Abroad Targets */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Globe size={16} color="#2563EB" /> Study Abroad Goals
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Dream Country</label>
                <select 
                  name="targetCountry"
                  value={formData.targetCountry}
                  onChange={handleChange}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    outline: 'none',
                    fontSize: '0.9rem',
                    color: '#0F172A',
                    background: '#FAFAF8'
                  }}
                >
                  <option value="Austria">Austria 🇦🇹</option>
                  <option value="Germany">Germany 🇩🇪</option>
                  <option value="United States">United States 🇺🇸</option>
                  <option value="Canada">Canada 🇨🇦</option>
                  <option value="United Kingdom">United Kingdom 🇬🇧</option>
                  <option value="Australia">Australia 🇦🇺</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Target Degree</label>
                <select 
                  name="targetDegree"
                  value={formData.targetDegree}
                  onChange={handleChange}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    outline: 'none',
                    fontSize: '0.9rem',
                    color: '#0F172A',
                    background: '#FAFAF8'
                  }}
                >
                  <option value="Bachelor">Bachelor Degree</option>
                  <option value="Master">Master Degree</option>
                  <option value="PhD">PhD / Doctorate</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Target Intake</label>
                <input 
                  type="text" 
                  name="targetIntake"
                  value={formData.targetIntake} 
                  onChange={handleChange}
                  placeholder="e.g. Winter 2028"
                  style={{
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    outline: 'none',
                    fontSize: '0.9rem',
                    color: '#0F172A',
                    background: '#FAFAF8'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>English Score / Level</label>
                <input 
                  type="text" 
                  name="englishLevel"
                  value={formData.englishLevel} 
                  onChange={handleChange}
                  placeholder="e.g. IELTS 7.5"
                  style={{
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    outline: 'none',
                    fontSize: '0.9rem',
                    color: '#0F172A',
                    background: '#FAFAF8'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Monthly Budget Range</label>
                <input 
                  type="text" 
                  name="budgetRange"
                  value={formData.budgetRange} 
                  onChange={handleChange}
                  placeholder="e.g. €700 - €1,000"
                  style={{
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    outline: 'none',
                    fontSize: '0.9rem',
                    color: '#0F172A',
                    background: '#FAFAF8'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '14px 28px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 18px rgba(37, 99, 235, 0.2)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            {saving ? <RefreshCw size={16} className="spin-loader" /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save Profile Details'}
          </button>
        </div>
      </form>
      
      <style>{`
        .spin-loader { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
