import React from 'react'
import { FileText, Download, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { COUNTRIES } from '../constants/countries'

export default function RoadmapPage() {
  const navigate = useNavigate()

  // Generate some fake placeholder roadmap action
  const handlePdfAction = (countryName) => {
    alert(`Generating 30-Day Arrival Roadmap PDF for \${countryName}... (Placeholder)`)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ivory)', fontFamily: 'DM Sans, sans-serif' }}>
      <Navbar />
      
      <div style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '1000px', margin: '0 auto', paddingX: '24px' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            background: 'none', border: 'none', color: 'var(--blue-700)', 
            fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
            marginBottom: '32px'
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--blue-950)', marginBottom: '16px', letterSpacing: '-0.03em' }}>
            30-Day Arrival Roadmaps
          </h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            A comprehensive, day-by-day checklist covering your first month abroad. Get your bank account, SIM card, university ID, and local registration sorted instantly.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', padding: '0 24px' }}>
          {COUNTRIES.map(c => (
            <div key={c.id} className="glass-panel" style={{
              padding: '32px',
              display: 'flex', flexDirection: 'column', gap: '24px',
              background: 'white',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--gray-200)',
              borderRadius: '24px',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'default',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '3rem', lineHeight: 1 }}>{c.flag}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'var(--blue-950)' }}>{c.name}</h3>
                  <span style={{ color: 'var(--gray-400)', fontSize: '0.85rem', fontWeight: 600 }}>Arrival Checklist</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: c.accentColor }} />
                  Bank Account Setup
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: c.accentColor }} />
                  Local Registration / Visa
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: c.accentColor }} />
                  SIM Card & Transport
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                <button 
                  onClick={() => handlePdfAction(c.name)}
                  className="btn-3d"
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '12px', borderRadius: '12px',
                    background: `linear-gradient(135deg, \${c.headerColor} 0%, \${c.accentColor} 100%)`,
                    color: 'white', fontWeight: 700, fontSize: '0.9rem',
                    border: 'none', cursor: 'pointer',
                  }}
                >
                  <FileText size={16} /> View PDF
                </button>
                <button 
                  onClick={() => handlePdfAction(c.name)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '12px', borderRadius: '12px',
                    background: 'var(--blue-50)', color: 'var(--blue-700)',
                    border: '1px solid var(--blue-100)', cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-100)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--blue-50)'}
                  title="Download PDF"
                >
                  <Download size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
