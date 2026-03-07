import { STUDYTRA_KNOWLEDGE } from './studytraKnowledge.js'

const MODEL = 'gemini-2.0-flash'
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

export async function callGemini(messages) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  const profileRaw = sessionStorage.getItem('studentProfile')
  const profile = profileRaw ? JSON.parse(profileRaw) : null
  const profileCtx = profile ? `
STUDENT PROFILE (personalize everything based on this):
- Name: ${profile.fullName} (use first name)
- Age: ${profile.age}
- Current Level: ${profile.currentLevel}
- Current University: ${profile.currentUniversity}
- Target Degree: ${profile.targetDegree}
- Target Course: ${profile.targetCourse}
- Dream Country: ${profile.dreamCountry}
` : ''

  const isFirst = messages.length <= 1
  const systemPair = isFirst ? [
    { role: 'user', parts: [{ text: `${STUDYTRA_KNOWLEDGE}${profileCtx}\nYou are Studytra AI. Confirm ready.` }] },
    { role: 'model', parts: [{ text: 'Ready. I am Studytra AI.' }] },
  ] : [
    { role: 'user', parts: [{ text: `You are Studytra AI, expert study abroad advisor for Indian students across Germany, USA, Canada, UK, and Australia.${profileCtx}` }] },
    { role: 'model', parts: [{ text: 'Continuing as Studytra AI.' }] },
  ]

  const recentMessages = messages.slice(-10)
  const contents = recentMessages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const body = {
    contents: [...systemPair, ...contents],
    generationConfig: { temperature: 0.65, maxOutputTokens: 1800, topP: 0.9 },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
    ],
  }

  const res = await fetch(`${API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = err?.error?.message || ''
    if (msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) throw new Error('QUOTA_EXCEEDED')
    throw new Error(msg || `API Error ${res.status}`)
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Empty response from Gemini.')
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