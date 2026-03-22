// api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { messages, system } = req.body

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: system || '',
      messages,
    }),
  })

  const data = await response.json()
  return res.status(200).json(data)
}