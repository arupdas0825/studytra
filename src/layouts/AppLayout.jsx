import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import { Menu } from 'lucide-react'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)' }}>
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main offset area */}
      <div className="app-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile Header */}
        <header 
          style={{
            height: 56,
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            justifyContent: 'space-between',
            zIndex: 90,
            flexShrink: 0
          }} 
          className="app-mobile-header"
        >
          <button 
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--navy)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 6,
              borderRadius: 'var(--radius-sm)',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <Menu size={20} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.75rem',
            }}>
              S
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--navy)', letterSpacing: '-0.02em', fontFamily: 'var(--font-ui)' }}>Studytra</span>
          </div>

          <div style={{ width: 32 }} /> {/* Spacer to center */}
        </header>

        {/* Workspace viewport */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
          <Outlet />
        </div>
      </div>

      <style>{`
        /* Hide mobile header on large screens */
        @media (min-width: 769px) {
          .app-mobile-header {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
