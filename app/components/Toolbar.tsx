import { useEditor, useToasts } from '@tldraw/tldraw'
import { useCallback } from 'react'
import { makeReal } from '../lib/makeReal'
import { Settings, SettingsPanel } from './SettingsPanel'

interface ToolbarProps {
	systemMessage: string;
	settings: Settings;
	onSettingsSave: (settings: Settings) => void;
}

export function Toolbar({ systemMessage, settings, onSettingsSave }: ToolbarProps) {
	const editor = useEditor()
	const { addToast } = useToasts()

	const handleMakeReal = useCallback(async () => {
		try {
			await makeReal(editor, '', systemMessage, settings)
		} catch (e) {
			console.error(e)
			addToast({
				icon: 'cross-2',
				title: 'Something went wrong',
				description: (e as Error).message.slice(0, 100),
			})
		}
	}, [editor, addToast, systemMessage, settings])

	return (
		<div className="toolbar-container">
			<SettingsPanel initialSettings={settings} onSave={onSettingsSave} />
			<button
				className="makeRealButton"
				onClick={handleMakeReal}
			>
				Make Real
			</button>
		</div>
	)
}
