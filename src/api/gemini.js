// api/gemini.js
// Vercel Serverless Function — Gemini API proxy
// Key stays server-side only, never exposed to browser

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const MODEL   = 'gemini-2.0-flash'
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

  try {
    const { contents, generationConfig, safetySettings } = req.body

    const response = await fetch(`${API_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, generationConfig, safetySettings }),
    })

    const data = await response.json()

    if (!response.ok) {
      const msg = data?.error?.message || `API Error ${response.status}`
      return res.status(response.status).json({ error: msg })
    }

    return res.status(200).json(data)

  } catch (error) {
    console.error('Gemini proxy error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}