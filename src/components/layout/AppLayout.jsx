import React, { useState } from 'react'
import AppSidebar from '../dashboard/AppSidebar'
import { Menu } from 'lucide-react'

export default function AppLayout({ children, scrollable = true }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#FAFAF8', // Warm off-white primary background
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#0F172A',
      width: '100vw',
      overflow: 'hidden'
    }}>
      {/* Navigation Left Sidebar */}
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Workspace Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        height: '100vh',
        overflow: 'hidden'
      }}>
        {/* Mobile Header Bar */}
        <header style={{
          height: 60,
          background: '#FFFFFF',
          borderBottom: '1px solid rgba(15, 23, 42, 0.06)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          justifyContent: 'space-between',
          zIndex: 90,
          flexShrink: 0
        }} className="app-mobile-header">
          <button 
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 4,
              borderRadius: 8,
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(15, 23, 42, 0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <Menu size={20} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.75rem',
            }}>
              S
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A', letterSpacing: '-0.02em' }}>Studytra</span>
          </div>

          <div style={{ width: 28 }} /> {/* Spacer to center the logo */}
        </header>

        {/* Scrollable View Container */}
        <div style={{
          flex: 1,
          overflowY: scrollable ? 'auto' : 'hidden',
          height: '100%',
          position: 'relative',
        }}>
          {children}
        </div>
      </div>

      <style>{`
        /* Hide mobile header on large screens */
        @media (min-width: 1024px) {
          .app-mobile-header {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
