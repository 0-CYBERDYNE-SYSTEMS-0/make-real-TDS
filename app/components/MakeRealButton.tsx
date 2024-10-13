import { useEditor, useToasts } from '@tldraw/tldraw'
import { useCallback } from 'react'
import { makeReal } from '../lib/makeReal'

interface MakeRealButtonProps {
	systemMessage: string;
}

export function MakeRealButton({ systemMessage }: MakeRealButtonProps) {
	const editor = useEditor()
	const { addToast } = useToasts()

	const handleClick = useCallback(async () => {
		try {
			const input = document.getElementById('openai_key_risky_but_cool') as HTMLInputElement
			const apiKey = input?.value ?? null
			if (!apiKey) throw Error('Make sure the input includes your API Key!')
			await makeReal(editor, apiKey, systemMessage)
		} catch (e) {
			console.error(e)
			addToast({
				icon: 'cross-2',
				title: 'Something went wrong',
				description: (e as Error).message.slice(0, 100),
			})
		}
	}, [editor, addToast, systemMessage])

	return (
		<button className="makeRealButton" onClick={handleClick}>
			Make Real
		</button>
	)
}
