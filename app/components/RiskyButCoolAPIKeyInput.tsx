import { Icon } from '@tldraw/tldraw'
import { ChangeEvent, useCallback } from 'react'

export function RiskyButCoolAPIKeyInput() {
	const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		localStorage.setItem('makeitreal_key', e.target.value)
	}, [])

	const handleQuestionMessage = useCallback(() => {
		window.alert(
			`If you have an Anthropic API key, you can put it in this input and it will be used when making requests to Claude.\n\nSee https://console.anthropic.com/account/keys to get a key.\n\nPutting API keys into boxes is generally a bad idea! If you have any concerns, create an API key and then revoke it after using this site.`
		)
	}, [])

	return (
		<div className="your-own-api-key">
			<div className="your-own-api-key__inner">
				<div className="input__wrapper">
					<input
						id="anthropic_key_risky_but_cool"
						defaultValue={localStorage.getItem('makeitreal_key') ?? ''}
						onChange={handleChange}
						spellCheck={false}
						autoCapitalize="off"
						placeholder="Enter your Anthropic API key"
					/>
				</div>
				<button className="question__button" onClick={handleQuestionMessage}>
					<Icon icon="question" />
				</button>
			</div>
		</div>
	)
}
