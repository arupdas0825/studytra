import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  Sparkles, 
  Map, 
  GraduationCap, 
  FileText, 
  Wallet, 
  FileCheck, 
  Landmark, 
  Calendar, 
  Settings, 
  User, 
  LogOut,
  ChevronRight
} from 'lucide-react'

export default function AppSidebar({ isOpen, onClose }) {
  const { user, userProfile, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Match the active page
  const getActiveItem = () => {
    const path = location.pathname
    const search = location.search

    if (path.includes('/chat')) return 'chat'
    if (path.includes('/roadmap')) return 'roadmap'
    if (path.includes('/countries') || path.includes('/universities')) return 'universities'
    if (path.includes('/sop')) return 'sop'
    if (path.includes('/budget')) return 'budget'
    
    if (path.includes('/dashboard')) {
      if (search.includes('tab=documents')) return 'documents'
      if (search.includes('tab=visa')) return 'visa'
      if (search.includes('tab=timeline')) return 'timeline'
      return 'documents' // default dashboard fallback
    }
    
    if (path.includes('/settings')) return 'settings'
    if (path.includes('/profile')) return 'profile'
    
    return 'chat'
  }

  const activeItem = getActiveItem()

  const menuItems = [
    { id: 'chat', label: 'AI Assistant', icon: Sparkles, path: '/chat', emoji: '🏠' },
    { id: 'roadmap', label: 'Roadmap', icon: Map, path: '/roadmap', emoji: '🗺' },
    { id: 'universities', label: 'Universities', icon: GraduationCap, path: '/countries', emoji: '🎓' },
    { id: 'sop', label: 'SOP Builder', icon: FileText, path: '/sop', emoji: '📄' },
    { id: 'budget', label: 'Budget Planner', icon: Wallet, path: '/budget', emoji: '💰' },
    { id: 'documents', label: 'Documents', icon: FileCheck, path: '/dashboard?tab=documents', emoji: '📁' },
    { id: 'visa', label: 'Visa Guide', icon: Landmark, path: '/dashboard?tab=visa', emoji: '🛂' },
    { id: 'timeline', label: 'Timeline', icon: Calendar, path: '/dashboard?tab=timeline', emoji: '📅' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings', emoji: '⚙' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile', emoji: '👤' },
  ]

  const displayName = userProfile?.fullName || user?.displayName || user?.email?.split('@')[0] || 'Student'
  const targetCountry = userProfile?.targetCountry || 'Austria'

  const handleNavigation = (path) => {
    navigate(path)
    if (onClose) onClose()
  }

  const handleSignOut = async () => {
    try {
      await logout()
      navigate('/')
    } catch (err) {
      console.error('Sign Out Error:', err)
    }
  }

  const sidebarContent = (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#FFFFFF',
      borderRight: '1px solid rgba(15, 23, 42, 0.08)',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Sidebar Header */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid rgba(15, 23, 42, 0.04)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontWeight: 800,
          fontSize: '1rem',
        }}>
          S
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{
            fontWeight: 800,
            fontSize: '1.05rem',
            color: '#0F172A',
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}>Studytra</span>
          <span style={{
            fontSize: '0.68rem',
            color: '#64748B',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>AI Workspace</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav style={{
        padding: '20px 12px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        overflowY: 'auto'
      }} className="custom-scroll">
        {menuItems.map(item => {
          const Icon = item.icon
          const isActive = activeItem === item.id
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '10px 14px',
                borderRadius: 12,
                background: isActive ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                color: isActive ? '#2563EB' : '#64748B',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.88rem',
                fontWeight: isActive ? 700 : 500,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.color = '#0F172A'
                  e.currentTarget.style.background = 'rgba(15, 23, 42, 0.03)'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.color = '#64748B'
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '1.1rem', width: 20, display: 'inline-flex', justifyContent: 'center' }}>
                  {item.emoji}
                </span>
                <span style={{ letterSpacing: '-0.01em' }}>{item.label}</span>
              </div>
              {isActive && <ChevronRight size={14} color="#2563EB" />}
            </button>
          )
        })}
      </nav>

      {/* User Profile Card at Bottom */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid rgba(15, 23, 42, 0.06)',
        background: '#FAFBFD',
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 12, 
          marginBottom: 12,
          padding: '4px'
        }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '0.95rem',
            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.15)'
          }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{
              fontWeight: 700,
              fontSize: '0.85rem',
              color: '#0F172A',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>{displayName}</div>
            <div style={{ 
              fontSize: '0.72rem', 
              color: '#64748B', 
              marginTop: 1,
              fontWeight: 500
            }}>
              🇦🇹 {targetCountry} Plan
            </div>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '10px',
            borderRadius: 10,
            background: 'rgba(239, 68, 68, 0.06)',
            color: '#EF4444',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            border: 'none',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.06)'
          }}
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside style={{
        width: 250,
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        flexShrink: 0,
        display: 'none', // Managed by CSS media query
      }} className="app-sidebar-desktop">
        {sidebarContent}
      </aside>

      {/* Mobile overlay sidebar drawer */}
      {isOpen && (
        <>
          <div 
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.3)',
              backdropFilter: 'blur(4px)',
              zIndex: 998,
            }}
          />
          <aside style={{
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            width: 260,
            zIndex: 999,
            animation: 'slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            {sidebarContent}
            <style>{`
              @keyframes slideIn {
                from { transform: translateX(-100%); }
                to { transform: translateX(0); }
              }
            `}</style>
          </aside>
        </>
      )}

      {/* Global CSS to toggle visibility between desktop and mobile */}
      <style>{`
        @media (min-width: 1024px) {
          .app-sidebar-desktop {
            display: block !important;
          }
        }
      `}</style>
    </>
  )
}
