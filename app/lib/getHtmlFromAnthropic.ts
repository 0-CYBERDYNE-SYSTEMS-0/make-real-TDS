import { PreviewShape } from '../PreviewShape/PreviewShape'

type Content = {
	type: 'text'
	text: string
} | {
	type: 'image'
	source: {
		type: 'base64'
		media_type: string
		data: string
	}
}

type Message = {
	role: 'user' | 'system' | 'assistant'
	content: string | Content[]
}

export async function getHtmlFromAnthropic({
	image,
	apiKey: _,
	text,
	grid,
	theme = 'light',
	previousPreviews = [],
	systemMessage,
}: {
	image: string
	apiKey: string
	text: string
	theme?: string
	grid?: {
		color: string
		size: number
		labels: boolean
	}
	previousPreviews?: PreviewShape[]
	systemMessage: string
}) {
	console.log('=== Starting getHtmlFromAnthropic ===')
	console.log('System message length:', systemMessage?.length)
	console.log('Image data length:', image?.length)
	
	// Log image format
	console.log('Image format check:')
	console.log('Is base64?', image.startsWith('data:image'))
	console.log('Image type:', image.split(';')[0])

	console.log('Building messages array...')
	const messages: Message[] = [
		{
			role: 'user',
			content: [
				{
					type: 'text',
					text: 'Please convert this design into HTML.'
				},
				{
					type: 'image',
					source: {
						type: 'base64',
						media_type: 'image/png',
						data: image.split(',')[1],
					},
				},
			] as Content[],
		},
	]

	try {
		console.log('=== Preparing API Request ===')
		
		const requestBody = {
			model: 'claude-3-5-sonnet-20241022',
			max_tokens: 4096,
			temperature: 0,
			messages,
			system: systemMessage
		}

		console.log('Request configuration:')
		console.log('- Model:', requestBody.model)
		console.log('- Messages count:', requestBody.messages.length)
		console.log('- First message role:', requestBody.messages[0].role)

		console.log('=== Making API Request ===')
		console.log('Request URL:', '/api/anthropic')

		const response = await fetch('/api/anthropic', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestBody),
		})

		console.log('=== Response Details ===')
		console.log('Response status:', response.status)
		console.log('Response status text:', response.statusText)

		if (!response.ok) {
			const errorText = await response.text()
			console.error('Error response body:', errorText)
			
			try {
				const errorData = JSON.parse(errorText)
				console.error('Parsed error data:', errorData)
				throw new Error(errorData.error?.message || `Anthropic API error: ${response.statusText}`)
			} catch (parseError) {
				console.error('Could not parse error response:', parseError)
				throw new Error(`Anthropic API error: ${response.statusText} - ${errorText}`)
			}
		}

		const json = await response.json()
		console.log('=== Response Success ===')
		console.log('Response structure:', Object.keys(json))
		console.log('Has content array?', Array.isArray(json.content))
		console.log('Content length:', json.content?.length)
		
		return {
			choices: [{
				message: {
					content: json.content[0].text,
				},
			}],
		}
	} catch (e: any) {
		console.error('=== Detailed Error Information ===')
		console.error('Error name:', e.name)
		console.error('Error message:', e.message)
		console.error('Error stack:', e.stack)
		console.error('Is network error?', e instanceof TypeError && e.message === 'Failed to fetch')
		throw Error(`Could not contact Anthropic API: ${e.message}`)
	}
}