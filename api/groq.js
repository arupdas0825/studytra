// api/groq.js
// Vercel Serverless Function — Groq API proxy
// Key stays server-side only, never exposed to browser

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const API_URL = 'https://api.groq.com/openai/v1/chat/completions'

  try {
    const body = req.body

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      const msg = data?.error?.message || `API Error ${response.status}`
      return res.status(response.status).json({ error: msg })
    }

    return res.status(200).json(data)

  } catch (error) {
    console.error('Groq proxy error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
