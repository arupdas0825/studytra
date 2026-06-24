import React from 'react'
import { FileText, CheckSquare, Square, Info } from 'lucide-react'

const DOCUMENT_CATEGORIES = [
  {
    title: '🎓 Academic Documents',
    items: [
      { id: 'acad-trans', name: 'Official University Transcripts', desc: 'Semester-wise marksheets for all years of college.' },
      { id: 'acad-deg', name: 'Degree Certificate / Provisional', desc: 'Degree completion proof issued by your university.' },
      { id: 'acad-school', name: '10th & 12th Passing Certificates', desc: 'Required as base academic and age proof.' }
    ]
  },
  {
    title: '📄 Application Essentials',
    items: [
      { id: 'app-sop', name: 'Statement of Purpose (SOP)', desc: 'Tailored country-specific motivation essay.' },
      { id: 'app-lor', name: '2-3 Letters of Recommendation', desc: 'From college professors or work managers.' },
      { id: 'app-cv', name: 'ATS-Optimized Academic CV', desc: 'Europass format for EU, standard resume for USA/Canada.' }
    ]
  },
  {
    title: '💱 Financial Proofs',
    items: [
      { id: 'fin-bank', name: 'Bank Statement (6 Months)', desc: 'Showing liquid cash balance to cover living expenses.' },
      { id: 'fin-loan', name: 'Education Loan Sanction Letter', desc: 'If applicable, issued by SBI, HDFC, Avanse etc.' },
      { id: 'fin-setup', name: 'Blocked Account / GIC Confirmation', desc: 'Mandatory for Germany (€11,208) and Canada (CAD $10,000).' }
    ]
  },
  {
    title: '🌍 Travel & Visa Pack',
    items: [
      { id: 'visa-pass', name: 'Valid Passport (Original)', desc: 'Validity must extend at least 6 months beyond course end.' },
      { id: 'visa-photo', name: 'Biometric Passport Photos', desc: 'Meeting specific visa embassy guidelines (size/white background).' },
      { id: 'visa-insur', name: 'Student Travel Health Insurance', desc: 'Basic coverage required before leaving India.' }
    ]
  }
]

export default function DocumentChecklist({ completedDocs, onToggleDoc }) {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0, fontFamily: 'Plus Jakarta Sans' }}>
          Document Checklist
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: 4, margin: 0, fontWeight: 500 }}>
          Collect and organize your documents according to standard visa and university requirements.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
        {DOCUMENT_CATEGORIES.map(category => (
          <div
            key={category.title}
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              borderRadius: 24,
              padding: '24px 24px',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)'
            }}
          >
            <h3 style={{
              fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', margin: '0 0 16px',
              fontFamily: 'Plus Jakarta Sans', display: 'flex', alignItems: 'center', gap: 8
            }}>
              {category.title}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {category.items.map(item => {
                const isChecked = completedDocs.includes(item.id)
                return (
                  <div
                    key={item.id}
                    onClick={() => onToggleDoc(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 14,
                      padding: '12px 14px',
                      borderRadius: 12,
                      background: isChecked ? 'rgba(16, 185, 129, 0.03)' : 'rgba(15, 23, 42, 0.01)',
                      border: isChecked ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(15, 23, 42, 0.06)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      if (!isChecked) e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.2)'
                    }}
                    onMouseLeave={e => {
                      if (!isChecked) e.currentTarget.style.borderColor = 'rgba(15, 23, 42, 0.06)'
                    }}
                  >
                    <div style={{ marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isChecked ? (
                        <CheckSquare size={18} color="#10B981" style={{ fill: 'rgba(16, 185, 129, 0.1)' }} />
                      ) : (
                        <Square size={18} color="#64748B" />
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.88rem', fontWeight: 700,
                        color: isChecked ? '#10B981' : '#0F172A',
                        transition: 'color 0.15s'
                      }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 4, lineHeight: 1.5, fontWeight: 500 }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
