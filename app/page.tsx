'use client'

import dynamic from 'next/dynamic'
import '@tldraw/tldraw/tldraw.css'
import { Toolbar } from './components/Toolbar'
import { TldrawLogo } from './components/TldrawLogo'
import { PreviewShapeUtil } from './PreviewShape/PreviewShape'
import { SystemMessageEditor } from './components/SystemMessageEditor'
import { Settings } from './components/SettingsPanel'
import { useState, useEffect } from 'react'
import { OPEN_AI_SYSTEM_PROMPT } from './prompt'
import { Tldraw as TldrawComponent } from '@tldraw/tldraw'

const Tldraw = dynamic(async () => {
	const mod = await import('@tldraw/tldraw')
	return {
		default: (props: any) => (
			<TldrawComponent {...props} />
		),
	}
}, {
	ssr: false,
})

const shapeUtils = [PreviewShapeUtil]

const DEFAULT_SETTINGS: Settings = {
	provider: 'anthropic',
	model: 'claude-3-5-sonnet-20241022',
	apiKey: '',
	temperature: 0,
	maxTokens: 4096,
}

export default function App() {
	const [systemMessage, setSystemMessage] = useState(OPEN_AI_SYSTEM_PROMPT);
	const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

	// Load settings from localStorage on mount
	useEffect(() => {
		const savedSettings = localStorage.getItem('makereal_settings');
		if (savedSettings) {
			try {
				setSettings(JSON.parse(savedSettings));
			} catch (e) {
				console.error('Failed to load settings:', e);
			}
		}
	}, []);

	// Save settings to localStorage when they change
	const handleSettingsSave = (newSettings: Settings) => {
		setSettings(newSettings);
		localStorage.setItem('makereal_settings', JSON.stringify(newSettings));
	};

	return (
		<div className="editor">
			<Tldraw
				persistenceKey="make-real"
				shareZone={
					<Toolbar
						systemMessage={systemMessage}
						settings={settings}
						onSettingsSave={handleSettingsSave}
					/>
				}
				shapeUtils={shapeUtils}
			>
				<TldrawLogo />
				<SystemMessageEditor initialMessage={systemMessage} onSave={setSystemMessage} />
			</Tldraw>
		</div>
	)
}
