import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { baseUrl, ...requestBody } = body

    const url = `${baseUrl || 'http://localhost:1234'}/v1/chat/completions`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('LM Studio API Error:', error)
    return NextResponse.json(
      { error: 'Failed to contact LM Studio. Make sure LM Studio is running and the server is started.' },
      { status: 500 }
    )
  }
}
