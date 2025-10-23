import { PreviewShape } from '../PreviewShape/PreviewShape'
import { Settings } from '../components/SettingsPanel'

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
} | {
	type: 'image_url'
	image_url: {
		url: string
	}
}

type Message = {
	role: 'user' | 'system' | 'assistant'
	content: string | Content[]
}

export async function getHtmlFromProvider({
	image,
	text,
	settings,
	grid,
	theme = 'light',
	previousPreviews = [],
	systemMessage,
}: {
	image: string
	text: string
	settings: Settings
	theme?: string
	grid?: {
		color: string
		size: number
		labels: boolean
	}
	previousPreviews?: PreviewShape[]
	systemMessage: string
}) {
	console.log('=== Starting getHtmlFromProvider ===')
	console.log('Provider:', settings.provider)
	console.log('Model:', settings.model)
	console.log('System message length:', systemMessage?.length)
	console.log('Image data length:', image?.length)

	const endpoint = getEndpoint(settings.provider)
	const requestBody = buildRequestBody(settings, image, systemMessage)

	// Validate API key before making request
	if (settings.provider !== 'lmstudio' && !settings.apiKey?.trim()) {
		throw new Error(`Please configure your ${settings.provider.toUpperCase()} API key in Settings`)
	}

	try {
		console.log('=== Making API Request ===')
		console.log('Request URL:', endpoint)
		console.log('Provider:', settings.provider)
		console.log('Model:', settings.model)

		const response = await fetch(endpoint, {
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
				
				// Provide more helpful error messages
				if (response.status === 401 || response.status === 403) {
					throw new Error(`Invalid API key for ${settings.provider}. Please check your API key in Settings.`)
				}
				
				throw new Error(errorData.error?.message || `API error: ${response.statusText}`)
			} catch (parseError) {
				if (parseError instanceof Error && parseError.message.includes('Invalid API key')) {
					throw parseError
				}
				console.error('Could not parse error response:', parseError)
				throw new Error(`API error: ${response.statusText} - ${errorText}`)
			}
		}

		const json = await response.json()
		console.log('=== Response Success ===')
		console.log('Response structure:', Object.keys(json))

		// Handle different response formats
		const content = extractContent(json, settings.provider)

		return {
			choices: [{
				message: {
					content,
				},
			}],
		}
	} catch (e: any) {
		console.error('=== Detailed Error Information ===')
		console.error('Error name:', e.name)
		console.error('Error message:', e.message)
		console.error('Error stack:', e.stack)
		throw Error(`Could not contact ${settings.provider} API: ${e.message}`)
	}
}

function getEndpoint(provider: Settings['provider']): string {
	const endpoints = {
		anthropic: '/api/anthropic',
		openai: '/api/openai',
		openrouter: '/api/openrouter',
		lmstudio: '/api/lmstudio',
	}
	return endpoints[provider]
}

function buildRequestBody(settings: Settings, image: string, systemMessage: string): any {
	const { provider, model, apiKey, baseUrl, temperature, maxTokens } = settings

	// Build base request
	const request: any = {
		model,
		temperature: temperature ?? 0,
		max_tokens: maxTokens ?? 4096,
	}

	// Add provider-specific fields
	if (provider === 'anthropic') {
		// Anthropic format
		request.messages = [{
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
			],
		}]
		request.system = systemMessage
	} else {
		// OpenAI format (used by OpenAI, OpenRouter, LM Studio)
		request.messages = [
			{
				role: 'system',
				content: systemMessage,
			},
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: 'Please convert this design into HTML.'
					},
					{
						type: 'image_url',
						image_url: {
							url: image,
						},
					},
				],
			},
		]
	}

	// Add API key if needed
	if (provider !== 'lmstudio') {
		request.apiKey = apiKey
	}

	// Add base URL for LM Studio
	if (provider === 'lmstudio') {
		request.baseUrl = baseUrl
	}

	return request
}

function extractContent(response: any, provider: Settings['provider']): string {
	if (provider === 'anthropic') {
		// Anthropic returns: { content: [{ text: '...' }] }
		return response.content[0].text
	} else {
		// OpenAI format returns: { choices: [{ message: { content: '...' } }] }
		return response.choices[0].message.content
	}
}
