'use client'

import dynamic from 'next/dynamic'
import '@tldraw/tldraw/tldraw.css'
import { MakeRealButton } from './components/MakeRealButton'
import { TldrawLogo } from './components/TldrawLogo'
import { PreviewShapeUtil } from './PreviewShape/PreviewShape'
import { SystemMessageEditor } from './components/SystemMessageEditor'
import { useState } from 'react'
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

export default function App() {
	const [systemMessage, setSystemMessage] = useState(OPEN_AI_SYSTEM_PROMPT);

	return (
		<div className="editor">
			<Tldraw 
				persistenceKey="make-real" 
				shareZone={<MakeRealButton systemMessage={systemMessage} />} 
				shapeUtils={shapeUtils}
			>
				<TldrawLogo />
				<SystemMessageEditor initialMessage={systemMessage} onSave={setSystemMessage} />
			</Tldraw>
		</div>
	)
}
