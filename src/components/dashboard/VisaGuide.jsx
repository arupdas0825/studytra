import React from 'react'
import { Info, ShieldAlert, Award, FileText } from 'lucide-react'

const GUIDES = {
  germany: {
    name: 'Germany Student Visa (National Visa Type D)',
    steps: [
      { title: '1. Obtain APS Certificate', desc: 'Mandatory verification of Indian academic credentials before university application. Apply early at aps-india.de.' },
      { title: '2. Open Blocked Account (Sperrkonto)', desc: 'Open account with Coracle, Fintiba or Expatrio and deposit €11,208. You will receive a Blocked Account Confirmation Letter for the visa.' },
      { title: '3. Secure Public Health Insurance', desc: 'Register with a German public insurer like TK (Techniker Krankenkasse). Mandatory for enrollment and visa.' },
      { title: '4. Book VFS / Consulate Appointment', desc: 'Secure a visa slot early. Bookings fill up 6–8 weeks in advance during peak season (June-August).' },
      { title: '5. Submit Visa Application & Biometrics', desc: 'Submit passport, application forms, admission letter, blocked account letter, and photos. Fee is €75. Processing takes 4–6 weeks.' }
    ],
    tips: [
      'Bring duplicate copies of all academic documents, attested.',
      'Coracle and Fintiba provide combo packages (Blocked Account + Insurance) which save money.',
      'Check the consulate jurisdiction based on your place of residence in India (Delhi, Mumbai, Kolkata, Chennai, Bangalore).'
    ]
  },
  usa: {
    name: 'USA Student Visa (F-1 Visa)',
    steps: [
      { title: '1. Receive Form I-20', desc: 'Once admitted, submit financial proofs to your university to receive the signed Form I-20 (Certificate of Eligibility).' },
      { title: '2. Pay SEVIS I-901 Fee', desc: 'Pay the mandatory SEVIS fee ($350) online at fmjfee.com. Keep the printed receipt safe; it is required for your interview.' },
      { title: '3. Complete DS-160 Form', desc: 'Submit the online DS-160 visa application form. Upload a professional digital photo. Print the DS-160 confirmation page.' },
      { title: '4. Book Visa Appointments', desc: 'Pay the MRV fee ($185) and book two slots: Biometrics (VAC) and the Consular Interview.' },
      { title: '5. Pass F-1 Interview', desc: 'Attend your interview. Be ready to explain: your academic goals, university choice, and ties back to India.' }
    ],
    tips: [
      'Do not bring bags, electronic devices, or metals to the consulate.',
      'Focus your answers on academics. Be concise. State clear post-grad plans back home or globally.',
      'Prepare sponsor profiles and detailed proof of funds (bank balances, loans, assets).'
    ]
  },
  canada: {
    name: 'Canada Study Permit (Student Direct Stream - SDS)',
    steps: [
      { title: '1. Secure DLI Admission Letter', desc: 'Confirm your admission to a Designated Learning Institution (DLI) that offers a Post-Graduation Work Permit (PGWP).' },
      { title: '2. Pay First Year Tuition Fee', desc: 'You must pay the full first-year tuition fee as billed by your university/college. Keep the receipt.' },
      { title: '3. Purchase GIC ($10,000 CAD)', desc: 'Deposit CAD $10,000 into a Guaranteed Investment Certificate (GIC) with CIBC, BMO, or Scotiabank for living proof.' },
      { title: '4. Take Upfront Medical Exam', desc: 'Book a medical examination with an approved panel physician in India. Keep the medical receipt.' },
      { title: '5. Submit Study Permit Online', desc: 'Apply online via the IRCC portal. SDS applications are typically processed within 20 calendar days.' }
    ],
    tips: [
      'SDS is highly recommended for Indian applicants. Non-SDS applications take up to 12 weeks.',
      'Write a brief Statement of Purpose (SOP) explaining why you chose this specific course and DLI.',
      'Ensure you have no band below 6.0 in IELTS Academic.'
    ]
  },
  austria: {
    name: 'Austria Student Residence Permit (Aufenthaltstitel)',
    steps: [
      { title: '1. Get University Admission Letter', desc: 'Receive your official letter of admission from TU Wien, University of Vienna, or other Austrian institutions.' },
      { title: '2. Secure Accommodation Proof', desc: 'Secure housing in Austria (such as a dorm contract with OeAD or a private tenancy). This is strictly required for the visa.' },
      { title: '3. Gather Financial Proofs', desc: 'Show bank statements or education loan. No blocked account required. Show €9,588/yr (under 24) or €17,184/yr (24+).' },
      { title: '4. Obtain Travel & Student Insurance', desc: 'Purchase private travel insurance for entry. Register for student self-insurance (ÖGK) immediately upon arrival.' },
      { title: '5. Submit Visa Application in India', desc: 'Submit your Residence Permit application at the Austrian Embassy in New Delhi. Processing takes 4–8 weeks.' }
    ],
    tips: [
      'Unlike Germany, Austria does not require an APS certificate or blocked account for Indian students.',
      'Start the visa application immediately upon receiving the admission letter, as Austrian embassies have limited slots.',
      'All Indian public documents (marks cards, birth certificate) must be apostilled by the Ministry of External Affairs (MEA).'
    ]
  },
  uk: {
    name: 'UK Student Visa (Tier 4 / Student Route)',
    steps: [
      { title: '1. Get your CAS Letter', desc: 'Accept your unconditional university offer and pay your tuition deposit to receive the Confirmation of Acceptance for Studies (CAS).' },
      { title: '2. Complete TB Clearance', desc: 'Get tested for Tuberculosis at a UKVI-approved clinic in India. Keep the clearance certificate.' },
      { title: '3. Maintain 28-Day Bank Funds', desc: 'Keep your remaining tuition fee + living expenses (£9,207 outside London, £12,006 inside) in your bank account for 28 consecutive days.' },
      { title: '4. Apply Online & Book Biometrics', desc: 'Submit application on gov.uk, pay the visa fee (£363) and Immigration Health Surcharge (IHS, ~£776/yr). Book biometrics slot.' },
      { title: '5. Attend Biometrics & Interview', desc: 'Submit fingerprints and photo at VFS. Some applicants may undergo a brief credibility interview.' }
    ],
    tips: [
      'Ensure bank statements are dated within 31 days of your application submission.',
      'The NHS health surcharge must be paid upfront for the entire duration of your visa.',
      'UK Student Visa processing is generally very fast (15 days standard, 5 days priority).'
    ]
  },
  australia: {
    name: 'Australia Student Visa (Subclass 500)',
    steps: [
      { title: '1. Receive CoE', desc: 'Pay your tuition fee deposit and Overseas Student Health Cover (OSHC) to receive your Confirmation of Enrolment (CoE).' },
      { title: '2. Undergo Medical Check', desc: 'Schedule and complete your medical exam at an approved clinic in India before or immediately after applying.' },
      { title: '3. Pass Genuine Student (GS) Check', desc: 'Submit statement and document evidence demonstrating your intent is genuine academic study, not migration.' },
      { title: '4. Submit Subclass 500 Visa', desc: 'Apply online via ImmiAccount. Upload academic docs, CoE, OSHC health insurance, and financial declarations.' },
      { title: '5. Provide Biometrics', desc: 'Visit a VFS global centre in India to submit biometric data. Processing takes 2-6 weeks.' }
    ],
    tips: [
      'OSHC insurance must cover you from the date you arrive in Australia until your course end date.',
      'Genuine Student (GS) requirement replaced the GTE test. Ensure your SOP highlights course value and ties back home.',
      'Do not book non-refundable travel before your visa is granted.'
    ]
  }
}

export default function VisaGuide({ profile }) {
  const targetCountry = (profile?.dream_country || 'Germany').toLowerCase()
  const guide = GUIDES[targetCountry === 'united kingdom' ? 'uk' : targetCountry] || GUIDES.germany

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0, fontFamily: 'Plus Jakarta Sans' }}>
          Visa Application Guide
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: 4, margin: 0, fontWeight: 500 }}>
          Follow these sequential steps to apply for your student visa for {profile?.dream_country || 'Austria'}.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }} className="visa-grid">
        
        {/* Left Column: Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {guide.steps.map((step, idx) => (
            <div
              key={step.title}
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(15, 23, 42, 0.08)',
                borderRadius: 24,
                padding: '20px 24px',
                display: 'flex',
                gap: 16,
                alignItems: 'flex-start',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)'
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'rgba(37, 99, 235, 0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#2563EB', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0
              }}>
                {idx + 1}
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: '0 0 6px', fontFamily: 'Plus Jakarta Sans' }}>
                  {step.title}
                </h4>
                <p style={{ color: '#64748B', fontSize: '0.84rem', margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Tips & Warnings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="right-panel">
          {/* Pro Tips Box */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.03)',
            border: '1px solid rgba(16, 185, 129, 0.15)',
            borderRadius: 24,
            padding: 24,
          }}>
            <h4 style={{
              fontSize: '0.95rem', fontWeight: 700, color: '#16A34A', margin: '0 0 14px',
              fontFamily: 'Plus Jakarta Sans', display: 'flex', alignItems: 'center', gap: 8
            }}>
              <Award size={18} color="#16A34A" />
              Pro Tips
            </h4>
            <ul style={{ paddingLeft: 16, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {guide.tips.map((tip, idx) => (
                <li key={idx} style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.5, fontWeight: 500 }}>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Warning Box */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.03)',
            border: '1px solid rgba(239, 68, 68, 0.15)',
            borderRadius: 24,
            padding: 24,
          }}>
            <h4 style={{
              fontSize: '0.95rem', fontWeight: 700, color: '#EF4444', margin: '0 0 12px',
              fontFamily: 'Plus Jakarta Sans', display: 'flex', alignItems: 'center', gap: 8
            }}>
              <ShieldAlert size={18} color="#EF4444" />
              Important Warning
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
              Visa slot timelines are extremely tight. Embassies do not accommodate late requests. Start collecting financial proofs at least 3 months prior.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .visa-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
