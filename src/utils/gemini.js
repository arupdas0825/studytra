import { STUDYTRA_KNOWLEDGE } from './studytraKnowledge.js'

const MODEL = 'gemini-2.0-flash'
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

export { STUDYTRA_KNOWLEDGE }

export async function callGemini(messages) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  const recentMessages = messages.slice(-10)

  // ✅ system_instruction বাদ — knowledge base কে first user+model pair হিসেবে inject করো
  const systemPair = [
    {
      role: 'user',
      parts: [{ text: `You are Studytra AI. Here is your complete knowledge base and instructions:\n\n${STUDYTRA_KNOWLEDGE}\n\nConfirm you are ready.` }],
    },
    {
      role: 'model',
      parts: [{ text: 'Understood. I am Studytra AI, ready to help Indian students plan their study abroad journey to Germany, USA, or Canada with structured, precise guidance.' }],
    },
  ]

  const geminiContents = recentMessages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }))

  const body = {
    contents: [...systemPair, ...geminiContents],
    generationConfig: {
      temperature: 0.65,
      maxOutputTokens: 1500,
      topP: 0.9,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
    ],
  }

  const response = await fetch(`${API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    const errMsg = err?.error?.message || ''
    if (errMsg.includes('quota') || errMsg.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('QUOTA_EXCEEDED')
    }
    throw new Error(errMsg || `API Error ${response.status}`)
  }

  const data = await response.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    const blockReason = data?.candidates?.[0]?.finishReason
    if (blockReason === 'SAFETY') throw new Error('Response blocked by safety filter.')
    throw new Error('Empty response from Gemini.')
  }

  return text
}

export function parsePlanLock(text) {
  const match = text.match(/PLAN_LOCKED:(\{.*?\})/)
  if (!match) return { cleanText: text, plan: null }
  let plan = null
  try { plan = JSON.parse(match[1]) } catch (e) {}
  const cleanText = text.replace(/PLAN_LOCKED:\{.*?\}/, '').trim()
  return { cleanText, plan }
}