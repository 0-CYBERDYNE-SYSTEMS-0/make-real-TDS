import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { apiKey, ...requestBody } = body

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey || process.env.OPENROUTER_API_KEY || ''}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Make Real',
      },
      body: JSON.stringify(requestBody),
    })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('OpenRouter API Error:', error)
    return NextResponse.json(
      { error: 'Failed to contact OpenRouter API' },
      { status: 500 }
    )
  }
}
