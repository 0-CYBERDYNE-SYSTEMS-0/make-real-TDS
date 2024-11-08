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
			await makeReal(editor, '', systemMessage)
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
		<div style={{ display: 'flex', alignItems: 'center', padding: '0 8px' }}>
			<button 
				className="makeRealButton" 
				onClick={handleClick}
			>
				Make Real
			</button>
		</div>
	)
}
