import { useState, useRef, useEffect } from 'react'
import {
  MessageCircle, X, Send, Trash2,
  GraduationCap, ChevronDown, Minimize2
} from 'lucide-react'
import { useChat } from '../hooks/useChat'
import ChatMessage from './ChatMessage'
import OnboardingForm from './OnboardingForm'

const QUICK_PROMPTS = [
  '📋 Show my full roadmap',
  '💰 Cost breakdown & budget',
  '🏦 Compare bank loans',
  '⏱️ Generate my timeline',
  '✈️ Flight planning guide',
  '📄 Visa document checklist',
]

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const { messages, isLoading, profile, streamingId, sendUserMessage, clearChat } = useChat()

  // Show onboarding after welcome message if no profile
  useEffect(() => {
    if (messages.length === 1 && !profile) {
      setTimeout(() => setShowOnboarding(true), 600)
    }
  }, [messages.length, profile])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, showOnboarding])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen, isMinimized])

  const handleSend = async (text) => {
    const msg = text || inputValue
    if (!msg.trim()) return
    setInputValue('')
    setShowOnboarding(false)
    await sendUserMessage(msg)
  }

  const handleOnboardingSubmit = async (msg) => {
    setShowOnboarding(false)
    await sendUserMessage(msg)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
            width: 58, height: 58, borderRadius: '50%',
            background: 'var(--navy)',
            boxShadow: '0 8px 32px rgba(15,31,61,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s',
            animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(15,31,61,0.45)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(15,31,61,0.35)' }}
        >
          <MessageCircle size={24} color="white" />
          {/* Pulse ring */}
          <span style={{
            position: 'absolute', inset: -4,
            borderRadius: '50%', border: '2px solid rgba(15,31,61,0.25)',
            animation: 'pulse 2s infinite',
          }} />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          width: 400,
          height: isMinimized ? 64 : 620,
          background: 'white',
          borderRadius: 24,
          boxShadow: '0 24px 80px rgba(15,31,61,0.2), 0 8px 24px rgba(15,31,61,0.12)',
          border: '1px solid var(--gray-200)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          transition: 'height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          animation: 'slideUp 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>

          {/* Header */}
          <div style={{
            background: 'var(--navy)',
            padding: '16px 20px',
            display: 'flex', alignItems: 'center',
            gap: 12, flexShrink: 0,
            cursor: isMinimized ? 'pointer' : 'default',
          }} onClick={() => isMinimized && setIsMinimized(false)}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'rgba(201,147,58,0.2)',
              border: '2px solid rgba(201,147,58,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <GraduationCap size={18} color="#f0b960" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '0.92rem', fontFamily: 'Fraunces, serif' }}>
                Studytra AI
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)',
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: isLoading ? '#f0b960' : '#22c55e',
                  display: 'inline-block',
                  animation: isLoading ? 'blink 0.7s steps(1) infinite' : 'none',
                }} />
                {isLoading ? 'Thinking...' : profile ? `${profile.country} Plan Active` : 'Study Abroad Assistant'}
              </div>
            </div>

            {/* Profile chip */}
            {profile?.country && !isMinimized && (
              <div style={{
                background: 'rgba(201,147,58,0.15)',
                border: '1px solid rgba(201,147,58,0.3)',
                borderRadius: 100,
                padding: '3px 10px',
                fontSize: '0.7rem', color: '#f0b960', fontWeight: 600,
                whiteSpace: 'nowrap',
              }}>
                {profile.country === 'Germany' ? '🇩🇪' : profile.country === 'USA' ? '🇺🇸' : '🇨🇦'} {profile.country}
              </div>
            )}

            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized) }} style={{
                width: 30, height: 30, borderRadius: 8,
                background: 'rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >
                {isMinimized
                  ? <ChevronDown size={14} color="rgba(255,255,255,0.7)" style={{ transform: 'rotate(180deg)' }} />
                  : <Minimize2 size={14} color="rgba(255,255,255,0.7)" />
                }
              </button>
              <button onClick={() => setIsOpen(false)} style={{
                width: 30, height: 30, borderRadius: 8,
                background: 'rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >
                <X size={14} color="rgba(255,255,255,0.7)" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div style={{
                flex: 1, overflowY: 'auto',
                padding: '20px 16px 8px',
                display: 'flex', flexDirection: 'column',
              }}>
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    isStreaming={msg.id === streamingId}
                  />
                ))}

                {/* Onboarding form */}
                {showOnboarding && !profile && (
                  <OnboardingForm onSubmit={handleOnboardingSubmit} />
                )}

                {/* Loading dots */}
                {isLoading && !streamingId && (
                  <div style={{ display: 'flex', gap: 5, padding: '8px 16px', alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width: 7, height: 7, borderRadius: '50%',
                        background: 'var(--gray-400)',
                        animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
                      }} />
                    ))}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              {messages.length <= 2 && !showOnboarding && (
                <div style={{
                  padding: '0 16px 8px',
                  display: 'flex', gap: 6, flexWrap: 'wrap',
                }}>
                  {QUICK_PROMPTS.map(p => (
                    <button key={p} onClick={() => handleSend(p)} style={{
                      fontSize: '0.72rem', padding: '5px 10px',
                      background: 'var(--gray-100)',
                      border: '1px solid var(--gray-200)',
                      borderRadius: 100, color: 'var(--navy)', fontWeight: 500,
                      transition: 'all 0.15s',
                      whiteSpace: 'nowrap',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-light)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--gray-100)'; e.currentTarget.style.borderColor = 'var(--gray-200)' }}
                    >{p}</button>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div style={{
                padding: '12px 16px 16px',
                borderTop: '1px solid var(--gray-100)',
                flexShrink: 0,
              }}>
                <div style={{
                  display: 'flex', gap: 8, alignItems: 'flex-end',
                  background: 'var(--off-white)',
                  borderRadius: 14,
                  border: '1.5px solid var(--gray-200)',
                  padding: '10px 10px 10px 14px',
                  transition: 'border-color 0.15s',
                }}>
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about visa, costs, roadmap, exams..."
                    rows={1}
                    style={{
                      flex: 1, border: 'none', background: 'transparent',
                      fontSize: '0.875rem', color: 'var(--text)',
                      resize: 'none', outline: 'none',
                      fontFamily: 'DM Sans, sans-serif',
                      lineHeight: 1.5, maxHeight: 100,
                      scrollbarWidth: 'none',
                    }}
                    onInput={e => {
                      e.target.style.height = 'auto'
                      e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'
                    }}
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!inputValue.trim() || isLoading}
                    style={{
                      width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                      background: inputValue.trim() && !isLoading ? 'var(--navy)' : 'var(--gray-200)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.15s, transform 0.1s',
                    }}
                    onMouseEnter={e => { if (inputValue.trim()) e.currentTarget.style.transform = 'scale(1.05)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
                  >
                    <Send size={15} color={inputValue.trim() && !isLoading ? 'white' : 'var(--gray-400)'} />
                  </button>
                </div>

                {/* Footer row */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginTop: 8, paddingLeft: 2,
                }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--gray-400)' }}>
                    Press Enter to send · Shift+Enter for new line
                  </span>
                  <button onClick={clearChat} style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    background: 'none', fontSize: '0.68rem', color: 'var(--gray-400)',
                    padding: '3px 6px', borderRadius: 6,
                    transition: 'color 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--navy)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--gray-400)'}
                  >
                    <Trash2 size={11} /> Clear chat
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.6; }
          70% { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @media (max-width: 480px) {
          .chat-panel {
            bottom: 0 !important; right: 0 !important;
            width: 100vw !important; border-radius: 20px 20px 0 0 !important;
          }
        }
      `}</style>
    </>
  )
}