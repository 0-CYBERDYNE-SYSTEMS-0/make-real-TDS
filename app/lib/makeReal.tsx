import { Editor, createShapeId, getSvgAsImage } from '@tldraw/tldraw'
import { getSelectionAsText } from './getSelectionAsText'
import { getHtmlFromAnthropic } from './getHtmlFromAnthropic'
import { blobToBase64 } from './blobToBase64'
import { addGridToSvg } from './addGridToSvg'
import { PreviewShape } from '../PreviewShape/PreviewShape'

export async function makeReal(editor: Editor, _: string, systemMessage: string) {
	console.log('Starting makeReal function...')
	
	const selectedShapes = editor.getSelectedShapes()
	console.log('Selected shapes count:', selectedShapes.length)

	if (selectedShapes.length === 0) throw Error('First select something to make real.')

	const { maxX, midY } = editor.getSelectionPageBounds()!
	const newShapeId = createShapeId()
	console.log('Creating new shape with ID:', newShapeId)
	
	editor.createShape<PreviewShape>({
		id: newShapeId,
		type: 'response',
		x: maxX + 60,
		y: midY - (540 * 2) / 3 / 2,
		props: { html: '' },
	})

	console.log('Getting SVG...')
	const svg = await editor.getSvg(selectedShapes, {
		scale: 1,
		background: true,
	})

	if (!svg) {
		console.error('Failed to get SVG')
		return
	}

	const grid = { color: 'red', size: 100, labels: true }
	console.log('Adding grid to SVG...')
	addGridToSvg(svg, grid)

	if (!svg) throw Error(`Could not get the SVG.`)

	const IS_SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
	console.log('Converting SVG to image...')
	const blob = await getSvgAsImage(svg, IS_SAFARI, {
		type: 'png',
		quality: 0.8,
		scale: 1,
	})
	const dataUrl = await blobToBase64(blob!)
	console.log('Image converted to base64, length:', dataUrl.length)

	const previousPreviews = selectedShapes.filter((shape) => {
		return shape.type === 'response'
	}) as PreviewShape[]
	console.log('Previous previews count:', previousPreviews.length)

	try {
		console.log('Making request to Anthropic API...')
		const json = await getHtmlFromAnthropic({
			image: dataUrl,
			apiKey: '',
			text: getSelectionAsText(editor),
			previousPreviews,
			grid,
			theme: editor.user.getUserPreferences().isDarkMode ? 'dark' : 'light',
			systemMessage,
		})

		if (!json) {
			console.error('No response from Anthropic API')
			throw Error('Could not contact Anthropic API.')
		}

		if (json?.error) {
			console.error('Anthropic API error:', json.error)
			throw Error(`${json.error.message?.slice(0, 128)}...`)
		}

		console.log('Got response from Anthropic API')
		const message = json.choices[0].message.content
		console.log('Raw message:', message)
		
		const start = message.indexOf('<!DOCTYPE html>')
		const end = message.indexOf('</html>')
		console.log('HTML bounds found:', { start, end })
		
		const html = message.slice(start, end + '</html>'.length)

		if (html.length < 100) {
			console.warn('Generated HTML too short:', html)
			throw Error('Could not generate a design from those wireframes.')
		}

		console.log('Updating shape with generated HTML')
		editor.updateShape<PreviewShape>({
			id: newShapeId,
			type: 'response',
			props: {
				html,
			},
		})

		console.log('Shape updated successfully')
	} catch (e) {
		console.error('Error in makeReal:', e)
		editor.deleteShape(newShapeId)
		throw e
	}
}
