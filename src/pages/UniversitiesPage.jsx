import React from 'react'
import Countries from '../components/Countries'

export default function UniversitiesPage() {
  return (
    <div style={{
      background: '#FAFAF8',
      minHeight: '100vh',
    }}>
      {/* Visual overrides to make the section look like a workspace page rather than a homepage section */}
      <style>{`
        #countries {
          padding: 40px 24px 80px !important;
          background: transparent !important;
          border-top: none !important;
        }
        #countries .container {
          max-width: 1100px !important;
          margin: 0 auto !important;
        }
      `}</style>
      <Countries />
    </div>
  )
}
