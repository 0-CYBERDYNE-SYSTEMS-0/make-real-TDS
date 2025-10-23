import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { apiKey, ...requestBody } = body

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey || process.env.OPENAI_API_KEY || ''}`,
      },
      body: JSON.stringify(requestBody),
    })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('OpenAI API Error:', error)
    return NextResponse.json(
      { error: 'Failed to contact OpenAI API' },
      { status: 500 }
    )
  }
}
