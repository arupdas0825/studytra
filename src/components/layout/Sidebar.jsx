import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  MessageSquare, 
  LayoutDashboard, 
  DollarSign, 
  Map, 
  FileText, 
  GraduationCap, 
  Globe, 
  Settings, 
  LogOut, 
  Plus,
  User,
  X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { db } from '../../lib/firebase'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth()
  const { showSuccess } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [recentChats, setRecentChats] = useState([])

  // Load user's recent chats for the sidebar
  useEffect(() => {
    if (!user) return

    const loadRecentChats = async () => {
      try {
        const q = query(
          collection(db, "chatHistory", user.uid, "sessions"), 
          orderBy("updatedAt", "desc"),
          limit(5)
        )
        const snap = await getDocs(q)
        const list = []
        snap.forEach(docSnap => {
          list.push({ id: docSnap.id, ...docSnap.data() })
        })
        setRecentChats(list)
      } catch (err) {
        console.error("Error loading recent chats for sidebar:", err)
      }
    }

    loadRecentChats()
  }, [user, location.pathname, location.search]) // Reload on navigate/chat updates

  const handleSignOut = async () => {
    try {
      await logout()
      showSuccess("Successfully signed out ✓")
      navigate('/')
    } catch (err) {
      console.error("Sign out failed:", err)
    }
  }

  const getInitials = () => {
    if (!user) return "?"
    if (user.displayName) return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    if (user.email) return user.email.charAt(0).toUpperCase()
    return "?"
  }

  const navItems = [
    { label: 'AI Chat', path: '/chat', icon: MessageSquare },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Budget Planner', path: '/budget', icon: DollarSign },
    { label: 'Roadmaps', path: '/roadmap', icon: Map },
    { label: 'SOP Guide', path: '/sop', icon: FileText },
    { label: 'Loan Guide', path: '/loan', icon: GraduationCap },
    { label: 'Countries', path: '/countries', icon: Globe },
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleNewChat = () => {
    navigate('/chat?new=true')
    if (onClose) onClose()
  }

  return (
    <>
      {/* Desktop & Mobile Slide-out Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <img src="/studytra-logo.png" alt="Studytra Logo" className="sidebar-logo" />
          <span className="sidebar-brand-name">Studytra</span>
          {isOpen && (
            <button 
              onClick={onClose} 
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                padding: 4
              }}
              className="app-mobile-only-close"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* New Chat CTA */}
        <button onClick={handleNewChat} className="sidebar-new-chat">
          <Plus size={16} />
          New Chat
        </button>

        {/* Scrollable Navigation Area */}
        <div className="sidebar-scroll">
          {/* Recent Chats */}
          {recentChats.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div className="sidebar-section-label">Recent Chats</div>
              {recentChats.map(chat => (
                <Link 
                  key={chat.id}
                  to={`/chat?session=${chat.id}`}
                  onClick={onClose}
                  className={`sidebar-chat-item ${location.search === `?session=${chat.id}` ? 'active' : ''}`}
                  style={{
                    display: 'block',
                    textDecoration: 'none',
                    fontWeight: location.search === `?session=${chat.id}` ? 600 : 500
                  }}
                >
                  {chat.title || 'Abroad Counseling'}
                </Link>
              ))}
            </div>
          )}

          {/* Navigate Section */}
          <div>
            <div className="sidebar-section-label">Navigate</div>
            {navItems.map(item => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
                >
                  <Icon className="sidebar-item-icon" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Footer Account Details */}
        <div className="sidebar-footer">
          <div className="sidebar-user" onClick={() => navigate('/settings')}>
            <div className="sidebar-avatar-initials">
              {getInitials()}
            </div>
            <div className="sidebar-user-name" style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>
                {user?.displayName || user?.email?.split('@')[0] || 'Student'}
              </span>
              <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
                {user?.email}
              </span>
            </div>
            <Settings size={16} style={{ color: 'var(--text-secondary)', marginLeft: 'auto', flexShrink: 0 }} />
          </div>

          <button 
            onClick={handleSignOut} 
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: 10,
              padding: '8px 0',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              fontFamily: 'var(--font-ui)',
              fontWeight: 600,
              color: '#dc2626',
              background: 'rgba(220, 38, 38, 0.05)',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(220, 38, 38, 0.05)'}
          >
            <LogOut size={12} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Tab Navigation */}
      <nav className="bottom-tabs">
        <Link to="/chat" className={`bottom-tab ${isActive('/chat') ? 'active' : ''}`}>
          <MessageSquare />
          <span>Chat</span>
        </Link>
        <Link to="/dashboard" className={`bottom-tab ${isActive('/dashboard') ? 'active' : ''}`}>
          <LayoutDashboard />
          <span>Dashboard</span>
        </Link>
        <Link to="/budget" className={`bottom-tab ${isActive('/budget') ? 'active' : ''}`}>
          <DollarSign />
          <span>Budget</span>
        </Link>
        <Link to="/roadmap" className={`bottom-tab ${isActive('/roadmap') ? 'active' : ''}`}>
          <Map />
          <span>Roadmaps</span>
        </Link>
        <button onClick={() => navigate('/settings')} className={`bottom-tab ${isActive('/settings') ? 'active' : ''}`}>
          <Settings />
          <span>Settings</span>
        </button>
      </nav>

      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 95,
            backdropFilter: 'blur(4px)',
            webkitBackdropFilter: 'blur(4px)'
          }}
          className="app-mobile-only-backdrop"
        />
      )}

      <style>{`
        .app-mobile-only-close {
          display: none;
        }
        @media (max-width: 768px) {
          .app-mobile-only-close {
            display: flex;
          }
        }
      `}</style>
    </>
  )
}
