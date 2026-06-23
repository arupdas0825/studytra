import React from 'react'
import { LayoutDashboard, Calendar, FileCheck, Landmark, LogOut, User } from 'lucide-react'

export default function Sidebar({ activeTab, setActiveTab, user, onSignOut, profile }) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'documents', label: 'Documents', icon: FileCheck },
    { id: 'visa', label: 'Visa Guide', icon: Landmark },
  ]

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student'
  const targetCountry = profile?.dream_country || 'Not Set'

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="db-sidebar-desktop" style={{
        width: 260,
        background: '#0d1b2a',
        borderRight: '1px solid rgba(79, 142, 247, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        {/* Header Logo */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(79, 142, 247, 0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <img src="/studytra-logo.png" alt="Logo" style={{ width: 32, height: 32, borderRadius: 8 }} />
          <span style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontWeight: 800,
            fontSize: '1.15rem',
            color: '#f0f4ff',
            letterSpacing: '-0.02em'
          }}>Studytra DB</span>
        </div>

        {/* Menu Items */}
        <nav style={{ padding: '20px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {menuItems.map(item => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: isActive ? 'rgba(79, 142, 247, 0.15)' : 'transparent',
                  color: isActive ? '#4f8ef7' : '#94a3b8',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#f0f4ff'
                    e.currentTarget.style.background = 'rgba(79, 142, 247, 0.05)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#94a3b8'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <Icon size={18} />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* User Profile Card */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(79, 142, 247, 0.12)',
          background: 'rgba(5, 9, 20, 0.4)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f8ef7, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#f0f4ff', fontWeight: 700, fontSize: '0.88rem',
            }}>
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{
                fontWeight: 700, fontSize: '0.85rem', color: '#f0f4ff',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
              }}>{displayName}</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 1 }}>
                Target: {targetCountry}
              </div>
            </div>
          </div>

          <button
            onClick={onSignOut}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '8px 12px',
              borderRadius: 8,
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
          >
            <LogOut size={13} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Mobile Tab Bar (Bottom) ── */}
      <nav className="db-sidebar-mobile" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#0d1b2a',
        borderTop: '1px solid rgba(79, 142, 247, 0.15)',
        display: 'none',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 64,
        zIndex: 999,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {menuItems.map(item => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                background: 'none',
                color: isActive ? '#4f8ef7' : '#94a3b8',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.7rem',
                fontWeight: isActive ? 700 : 500,
                width: '25%',
                height: '100%',
                padding: '6px 0',
              }}
            >
              <Icon size={18} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .db-sidebar-desktop { display: none !important; }
          .db-sidebar-mobile { display: flex !important; }
        }
      `}</style>
    </>
  )
}
