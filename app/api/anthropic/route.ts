import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { apiKey, ...requestBody } = body
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': apiKey || process.env.ANTHROPIC_API_KEY || '',
      },
      body: JSON.stringify(requestBody),
    })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Anthropic API Error:', error)
    return NextResponse.json(
      { error: 'Failed to contact Anthropic API' },
      { status: 500 }
    )
  }
} 