import { useState, useCallback } from 'react'
import { sendMessage } from '../utils/gemini'
import { buildSystemPrompt } from '../utils/systemPrompt'

const WELCOME = {
  id: 'welcome',
  role: 'assistant',
  content: `👋 Welcome to **Studytra AI** — your study abroad execution assistant.

I help Indian students plan their journey to **Germany, USA, or Canada** with structured, step-by-step guidance.

To get started, tell me:
1. 🌍 Which country are you targeting?
2. 🎓 What degree are you planning?
3. 📅 Which intake are you aiming for?`,
  timestamp: new Date(),
}

export function useChat() {
  const [messages, setMessages] = useState([WELCOME])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [profile, setProfile] = useState(null)
  const [streamingId, setStreamingId] = useState(null)

  const detectProfile = useCallback((text) => {
    const countries = { germany: 'Germany', usa: 'USA', 'united states': 'USA', canada: 'Canada' }
    const detected = {}
    const lower = text.toLowerCase()

    for (const [key, val] of Object.entries(countries)) {
      if (lower.includes(key)) { detected.country = val; break }
    }

    const intakeMatch = lower.match(/(winter|summer|fall|spring)\s*(20\d\d)/)
    if (intakeMatch) detected.intake = `${intakeMatch[1].charAt(0).toUpperCase() + intakeMatch[1].slice(1)} ${intakeMatch[2]}`

    const degreeMatch = lower.match(/\b(msc|ms|mtech|btech|mba|phd|bachelor|master)\b/i)
    if (degreeMatch) detected.degree = degreeMatch[1].toUpperCase()

    return Object.keys(detected).length > 0 ? detected : null
  }, [])

  const sendUserMessage = useCallback(async (userText) => {
    if (!userText.trim() || isLoading) return

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date(),
    }

    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setIsLoading(true)
    setError(null)

    // Try to detect profile info from user messages
    const allUserText = updatedMessages
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join(' ')
    const detectedProfile = detectProfile(allUserText)
    if (detectedProfile && (!profile || !profile.country)) {
      setProfile(prev => ({ ...prev, ...detectedProfile }))
    }

    const aiMsgId = (Date.now() + 1).toString()
    const aiMsg = { id: aiMsgId, role: 'assistant', content: '', timestamp: new Date() }
    setMessages(prev => [...prev, aiMsg])
    setStreamingId(aiMsgId)

    try {
      const apiMessages = [
        { role: 'system', content: buildSystemPrompt(profile) },
        ...updatedMessages.map(m => ({ role: m.role, content: m.content })),
      ]

      await sendMessage(apiMessages, (streamedText) => {
        setMessages(prev =>
          prev.map(m => m.id === aiMsgId ? { ...m, content: streamedText } : m)
        )
      })
    } catch (err) {
      setError(err.message)
      setMessages(prev =>
        prev.map(m => m.id === aiMsgId
          ? { ...m, content: '⚠️ Something went wrong. Please check your API key and try again.' }
          : m
        )
      )
    } finally {
      setIsLoading(false)
      setStreamingId(null)
    }
  }, [messages, isLoading, profile, detectProfile])

  const clearChat = useCallback(() => {
    setMessages([WELCOME])
    setProfile(null)
    setError(null)
  }, [])

  return { messages, isLoading, error, profile, streamingId, sendUserMessage, clearChat }
}