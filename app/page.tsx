'use client'

import dynamic from 'next/dynamic'
import '@tldraw/tldraw/tldraw.css'
import { MakeRealButton } from './components/MakeRealButton'
import { TldrawLogo } from './components/TldrawLogo'
import { RiskyButCoolAPIKeyInput } from './components/RiskyButCoolAPIKeyInput'
import { PreviewShapeUtil } from './PreviewShape/PreviewShape'
import { SystemMessageEditor } from './components/SystemMessageEditor'
import { useState } from 'react'
import { OPEN_AI_SYSTEM_PROMPT } from './prompt'

const Tldraw = dynamic(async () => (await import('@tldraw/tldraw')).Tldraw, {
	ssr: false,
})

const shapeUtils = [PreviewShapeUtil]

export default function App() {
	const [systemMessage, setSystemMessage] = useState(OPEN_AI_SYSTEM_PROMPT);

	return (
		<div className="editor">
			<Tldraw persistenceKey="make-real" shareZone={<MakeRealButton systemMessage={systemMessage} />} shapeUtils={shapeUtils}>
				<TldrawLogo />
				<RiskyButCoolAPIKeyInput />
				<SystemMessageEditor initialMessage={systemMessage} onSave={setSystemMessage} />
			</Tldraw>
		</div>
	)
}
