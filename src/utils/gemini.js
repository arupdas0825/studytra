// src/utils/gemini.js

import { STUDYTRA_KNOWLEDGE } from './studytraKnowledge.js'

// In production → use serverless proxy (key stays server-side)
// In local dev  → call Gemini API directly (key from .env)
const IS_DEV = import.meta.env.DEV
const PROXY_URL = '/api/gemini'
const GEMINI_DIRECT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`

export async function callGemini(messages) {
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

  const isFirst = messages.length <= 1

  const systemPair = isFirst
    ? [
        { role: 'user', parts: [{ text: `${STUDYTRA_KNOWLEDGE}${profileCtx}\nYou are Studytra AI. Confirm ready.` }] },
        { role: 'model', parts: [{ text: 'Ready. I am Studytra AI — your personalized study abroad advisor.' }] },
      ]
    : [
        { role: 'user', parts: [{ text: `You are Studytra AI — expert study abroad advisor for Indian students going to Germany, Austria, USA, Canada, UK, Australia.${profileCtx}` }] },
        { role: 'model', parts: [{ text: 'Understood. Continuing as Studytra AI.' }] },
      ]

  const contents = [
    ...systemPair,
    ...messages.slice(-10).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
  ]

  const body = {
    contents,
    generationConfig: { temperature: 0.65, maxOutputTokens: 1800, topP: 0.9 },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
    ],
  }

  let res

  if (IS_DEV) {
    // LOCAL DEV — call Gemini directly with browser-visible key
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) throw new Error('Add VITE_GEMINI_API_KEY to your .env file for local dev.')
    res = await fetch(`${GEMINI_DIRECT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    if (msg.toLowerCase().includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('QUOTA_EXCEEDED')
    }
    throw new Error(msg || `Gemini API Error ${res.status}`)
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Empty response from AI. Please try again.')
  return text
}

export function parsePlanLock(text) {
  const match = text.match(/PLAN_LOCKED:(\{.*?\})/s)
  if (!match) return { cleanText: text, plan: null }
  let plan = null
  try { plan = JSON.parse(match[1]) } catch (e) {}
  const cleanText = text.replace(/PLAN_LOCKED:\{.*?\}/s, '').trim()
  return { cleanText, plan }
}