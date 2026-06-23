import React from 'react'
import { CheckCircle2, Circle, Clock } from 'lucide-react'

// Country specific timeline data
const TIMELINES = {
  germany: [
    { id: 'de-1', phase: 'Language & IELTS', time: '14–18 Months Before', title: 'Prepare & Take Exams', desc: 'Prepare for IELTS (English programs, 6.5+ required) or start German language levels (A1 to B2/C1 depending on program).' },
    { id: 'de-2', phase: 'APS Certificate', time: '12–14 Months Before', title: 'Apply for APS Certificate', desc: 'Mandatory for Indian students. Apply at aps-india.de. Gathers marksheets and pays fee ~₹18,000. Takes 6–10 weeks.' },
    { id: 'de-3', phase: 'Applications', time: '8–10 Months Before', title: 'Uni-Assist & Portals', desc: 'Apply to universities via Uni-Assist portal or directly. Deadline is typically May 31 – July 15 for Winter semester.' },
    { id: 'de-4', phase: 'Admissions', time: '6–8 Months Before', title: 'Get Admit & Enrollment', desc: 'Receive your admission letter (Zulassungsbescheid). Start university pre-enrollment paperwork.' },
    { id: 'de-5', phase: 'Finances', time: '5–6 Months Before', title: 'Open Blocked Account', desc: 'Deposit €11,208 into a blocked account (Sperrkonto) via Fintiba, Coracle, or Expatrio. Obtain TK health insurance.' },
    { id: 'de-6', phase: 'Visa & Departure', time: '3–4 Months Before', title: 'Visa Appointment', desc: 'Book visa appointment at VFS or German Consulate. Present block account letter, APS certificate, and admit letter.' }
  ],
  usa: [
    { id: 'us-1', phase: 'Exams Preparation', time: '14–18 Months Before', title: 'Take GRE + TOEFL/IELTS', desc: 'Standardized tests prep. Aim for GRE Quant 160+, TOEFL 100+ or IELTS 7.0+ for top-tier schools.' },
    { id: 'us-2', phase: 'Shortlisting & SOP', time: '12–14 Months Before', title: 'University Lists & SOP Drafts', desc: 'Shortlist 8-10 universities. Draft Statement of Purpose (SOP) and request Letters of Recommendation (LOR) from professors.' },
    { id: 'us-3', phase: 'Applications', time: '8–10 Months Before', title: 'Submit University Applications', desc: 'Submit directly via university portals. Deadlines fall between Dec 15 and Feb 15 for Fall intake.' },
    { id: 'us-4', phase: 'Finances & I-20', time: '5–6 Months Before', title: 'I-20 Form & Loan Sanctions', desc: 'Receive admit letter. Submit proof of funds (bank statements/loan sanction letters of $30K-$50K) to get the I-20 document.' },
    { id: 'us-5', phase: 'SEVIS & DS-160', time: '3–4 Months Before', title: 'Pay SEVIS & DS-160 Form', desc: 'Pay SEVIS fee ($350) and submit DS-160 visa application. Schedule biometrics and consulate interview.' },
    { id: 'us-6', phase: 'Visa & Flights', time: '1–2 Months Before', title: 'Consular Interview & Flights', desc: 'Attend the F-1 visa interview. Once approved, book flights and prepare for pre-departure orientation.' }
  ],
  canada: [
    { id: 'ca-1', phase: 'Language Exam', time: '14–16 Months Before', title: 'Take IELTS Academic', desc: 'Secure an overall band of 6.5+ (no band less than 6.0) to qualify for the Student Direct Stream (SDS).' },
    { id: 'ca-2', phase: 'Shortlisting', time: '12–14 Months Before', title: 'Shortlist DLI Institutions', desc: 'Ensure your target university or college is a Designated Learning Institution (DLI) to qualify for PGWP.' },
    { id: 'ca-3', phase: 'Applications', time: '8–10 Months Before', title: 'Submit Applications', desc: 'Submit applications directly to DLIs. Intake is primarily September. Winter intakes open in Jan.' },
    { id: 'ca-4', phase: 'GIC Account', time: '5–6 Months Before', title: 'Open GIC Account', desc: 'Purchase a Guaranteed Investment Certificate (GIC) of CAD $10,000 via CIBC, BMO, or Scotiabank for SDS visa.' },
    { id: 'ca-5', phase: 'Medicals & Visa', time: '3–4 Months Before', title: 'Upfront Medical & SDS Visa', desc: 'Complete upfront panel medical exam. Apply for Study Permit via SDS online. Takes 2-4 weeks.' },
    { id: 'ca-6', phase: 'Pre-Departure', time: '1–2 Months Before', title: 'SIN Number & Flights', desc: 'Book flights. Apply for SIN (Social Insurance Number) online or at Service Canada upon arrival.' }
  ],
  austria: [
    { id: 'at-1', phase: 'Language Certs', time: '12–14 Months Before', title: 'German/English Certification', desc: 'Prepare for IELTS (B2) or Goethe Zertifikat (B2) depending on whether the program is English or German taught.' },
    { id: 'at-2', phase: 'Shortlist TU Wien', time: '10–12 Months Before', title: 'Shortlist Courses', desc: 'Identify courses at TU Wien, University of Vienna, or TU Graz. Confirm specific course admission guidelines.' },
    { id: 'at-3', phase: 'Applications', time: '6–8 Months Before', title: 'Submit Applications', desc: 'Apply directly. Deadlines are typically June to August for Winter Semester starting in October.' },
    { id: 'at-4', phase: 'Accommodation', time: '4–6 Months Before', title: 'Proof of Accommodation', desc: 'Crucial for visa. Secure student housing (OeAD guesthouse or shared apartment contract) early.' },
    { id: 'at-5', phase: 'Financial Proof', time: '3–4 Months Before', title: 'Bank statements / Loan', desc: 'No blocked account. Show bank statement or loan sanction of €9,588/yr (under 24) or €17,184/yr (24+).' },
    { id: 'at-6', phase: 'Residence Permit', time: '2–3 Months Before', title: 'Apply for Student Visa', desc: 'Submit Student Visa (Aufenthaltstitel Studierender) at Austrian Embassy in Delhi/Mumbai. Takes 4–8 weeks.' }
  ],
  uk: [
    { id: 'uk-1', phase: 'IELTS preparation', time: '12–14 Months Before', title: 'Take IELTS Academic', desc: 'Achieve 6.5+ bands. Some UK universities waive IELTS if 10th/12th English marks are >80%.' },
    { id: 'uk-2', phase: 'Applications', time: '8–10 Months Before', title: 'Apply to Universities', desc: 'Submit applications. Draft SOP and collect academic references. Primary intake is September.' },
    { id: 'uk-3', phase: 'Offer & CAS Deposit', time: '5–6 Months Before', title: 'CAS Deposit & Acceptance', desc: 'Accept conditional/unconditional offer. Pay tuition fee deposit (typically £2,000–5,000) to request your CAS.' },
    { id: 'uk-4', phase: 'Financial Proof', time: '3–4 Months Before', title: '28-Day Financial Rule', desc: 'Keep remaining tuition + living expenses in a bank account for 28 consecutive days before applying.' },
    { id: 'uk-5', phase: 'CAS Issued & TB Test', time: '2–3 Months Before', title: 'Get CAS & Take TB Test', desc: 'Obtain CAS letter. Complete TB test from an approved clinic (mandatory for Indians).' },
    { id: 'uk-6', phase: 'Visa & Flight', time: '1–2 Months Before', title: 'Apply for Student Visa', desc: 'Submit Tier 4 student visa application. Attend biometrics. Visa is usually processed in 3 weeks.' }
  ],
  australia: [
    { id: 'au-1', phase: 'Language Test', time: '10–12 Months Before', title: 'Take IELTS or PTE', desc: 'Aim for overall 6.5 with no band less than 6.0. PTE score of 58+ is also widely accepted.' },
    { id: 'au-2', phase: 'Applications', time: '8–10 Months Before', title: 'Submit Applications', desc: 'Submit applications to universities. Intake seasons: Semester 1 (Feb/March) or Semester 2 (July).' },
    { id: 'au-3', phase: 'CoE & Financials', time: '4–6 Months Before', title: 'Accept Offer & Get CoE', desc: 'Accept offer, pay first semester tuition + OSHC fee to receive Confirmation of Enrolment (CoE).' },
    { id: 'au-4', phase: 'GS Requirement', time: '3–4 Months Before', title: 'Genuine Student Test', desc: 'Provide financial documentation, SOP details, and background verification for the GS check.' },
    { id: 'au-5', phase: 'Visa Submission', time: '2–3 Months Before', title: 'Subclass 500 Visa', desc: 'Apply for Student Visa Subclass 500. Undergo biometric submission and medical examinations.' },
    { id: 'au-6', phase: 'Departure', time: '1 Month Before', title: 'Fly to Australia', desc: 'Book flights and secure student housing near campus. Start studies.' }
  ]
}

export default function Timeline({ profile, completedSteps, onToggleStep }) {
  const targetCountry = (profile?.dream_country || 'Germany').toLowerCase()
  const steps = TIMELINES[targetCountry === 'united kingdom' ? 'uk' : targetCountry] || TIMELINES.germany

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f0f4ff', margin: 0, fontFamily: 'Plus Jakarta Sans' }}>
          Personalized Preparation Timeline
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: 4, margin: 0 }}>
          Step-by-step roadmap for studying in {profile?.dream_country || 'Germany'}. Mark tasks completed to save your progress.
        </p>
      </div>

      {/* Vertical Timeline container */}
      <div style={{ position: 'relative', paddingLeft: 28, display: 'flex', flexDirection: 'column', gap: 32 }}>
        
        {/* Central timeline line */}
        <div style={{
          position: 'absolute', left: 8, top: 12, bottom: 20, width: 2,
          background: 'linear-gradient(180deg, #4f8ef7 0%, rgba(79,142,247,0.15) 100%)'
        }} />

        {steps.map((step, idx) => {
          const isDone = completedSteps.includes(step.id)
          return (
            <div key={step.id} style={{ display: 'flex', gap: 20, position: 'relative' }}>
              
              {/* Dot Icon */}
              <div style={{
                position: 'absolute', left: -28, top: 4,
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2
              }}>
                <button
                  onClick={() => onToggleStep(step.id)}
                  style={{
                    background: '#050914', border: 'none', padding: 0, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%'
                  }}
                >
                  {isDone ? (
                    <CheckCircle2 size={18} color="#10b981" fill="#10b981" style={{ filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.3))' }} />
                  ) : (
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%',
                      border: '2.5px solid #4f8ef7', background: '#050914',
                      boxShadow: '0 0 6px rgba(79,142,247,0.2)'
                    }} />
                  )}
                </button>
              </div>

              {/* Card Container */}
              <div style={{
                flex: 1,
                background: 'rgba(15, 33, 53, 0.65)',
                border: isDone ? '1px solid rgba(16, 185, 129, 0.15)' : '1px solid rgba(79, 142, 247, 0.15)',
                borderRadius: 16,
                padding: '20px 24px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.border = isDone ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(79, 142, 247, 0.3)'}
                onMouseLeave={e => e.currentTarget.style.border = isDone ? '1px solid rgba(16, 185, 129, 0.15)' : '1px solid rgba(79, 142, 247, 0.15)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 700, color: isDone ? '#10b981' : '#4f8ef7',
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                      background: isDone ? 'rgba(16, 185, 129, 0.1)' : 'rgba(79, 142, 247, 0.1)',
                      padding: '3px 8px', borderRadius: 4
                    }}>
                      {step.phase}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f0f4ff', margin: '10px 0 6px', fontFamily: 'Plus Jakarta Sans' }}>
                      {step.title}
                    </h4>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500 }}>
                    <Clock size={13} color="#94a3b8" />
                    <span>{step.time}</span>
                  </div>
                </div>

                <p style={{ color: '#94a3b8', fontSize: '0.86rem', margin: '8px 0 0', lineHeight: 1.65 }}>
                  {step.desc}
                </p>

                {/* Checkbox Trigger button inside card */}
                <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => onToggleStep(step.id)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: isDone ? 'rgba(16, 185, 129, 0.1)' : 'rgba(79, 142, 247, 0.05)',
                      border: isDone ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(79, 142, 247, 0.2)',
                      padding: '6px 12px', borderRadius: 8,
                      fontSize: '0.78rem', fontWeight: 600,
                      color: isDone ? '#10b981' : '#f0f4ff',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = isDone ? 'rgba(16, 185, 129, 0.2)' : 'rgba(79, 142, 247, 0.15)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = isDone ? 'rgba(16, 185, 129, 0.1)' : 'rgba(79, 142, 247, 0.05)'
                    }}
                  >
                    {isDone ? '✓ Completed' : 'Mark Completed'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
