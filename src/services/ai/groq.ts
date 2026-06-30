// src/services/ai/groq.ts

import { STUDYTRA_KNOWLEDGE } from '../../utils/studytraKnowledge.js'
import { AI_CONFIG } from './config'

const IS_DEV = import.meta.env.DEV
const PROXY_URL = '/api/groq'
const GROQ_DIRECT = 'https://api.groq.com/openai/v1/chat/completions'

export async function callGroq(messages: { role: string; content: string }[]) {
  const profileRaw = sessionStorage.getItem('studentProfile')
  const profile = profileRaw ? JSON.parse(profileRaw) : null

  const profileCtx = profile ? `
STUDENT PROFILE — personalize every response:
- Name: ${profile.fullName || 'Student'} (use first name only)
- Age: ${profile.age || 'unknown'}
- Education Level: ${profile.currentLevel || 'Undergraduate'}
- University: ${profile.currentUniversity || 'unknown'}
- Target Degree: ${profile.targetDegree || "Master's"}
- Field: ${profile.targetCourse || 'Computer Science'}
- Target Country: ${profile.dreamCountry || 'Germany'}
- Target Intake: ${profile.targetIntake || 'Winter 2028'}
- English Level: ${profile.englishLevel || 'Advanced'}
- Career Goal: ${profile.careerGoal || 'unknown'}
- Work Preference: ${profile.workPreference || 'unknown'}
` : ''

  // Build the system prompt
  const systemPrompt = `${STUDYTRA_KNOWLEDGE}${profileCtx}
You are Studytra AI — an expert study abroad advisor for Indian students going to Germany, Austria, USA, Canada, UK, and Australia. Keep your tone helpful, encouraging, and highly specific to the student's dream country and profile.`

  // Format messages for Groq Chat Completions API
  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.slice(-10).map(m => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'assistant' : 'user',
      content: m.content || '',
    })),
  ]

  const body = {
    model: AI_CONFIG.model,
    messages: formattedMessages,
    temperature: 0.65,
    max_tokens: 1800,
    top_p: 0.9,
  }

  let res

  if (IS_DEV) {
    // LOCAL DEV — call Groq directly with browser-visible key
    const apiKey = import.meta.env.VITE_GROQ_API_KEY
    if (!apiKey) {
      throw new Error('Add VITE_GROQ_API_KEY to your .env file for local dev.')
    }
    res = await fetch(GROQ_DIRECT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    })
  } else {
    // PRODUCTION — use serverless proxy (key never in browser)
    res = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = err?.error?.message || err?.error || ''
    if (msg.toLowerCase().includes('quota') || msg.includes('rate_limit') || res.status === 429) {
      throw new Error('QUOTA_EXCEEDED')
    }
    throw new Error(msg || `Groq API Error ${res.status}`)
  }

  const data = await res.json()
  const text = data?.choices?.[0]?.message?.content
  if (!text) throw new Error('Empty response from AI. Please try again.')
  return text
}

export function parsePlanLock(text: string) {
  const match = text.match(/PLAN_LOCKED:(\{.*?\})/s)
  if (!match) return { cleanText: text, plan: null }
  let plan = null
  try {
    plan = JSON.parse(match[1])
  } catch (e) {}
  const cleanText = text.replace(/PLAN_LOCKED:\{.*?\}/s, '').trim()
  return { cleanText, plan }
}
