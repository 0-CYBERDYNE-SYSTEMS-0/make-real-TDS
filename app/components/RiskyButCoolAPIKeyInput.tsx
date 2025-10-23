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
					<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
						<circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5"/>
						<path d="M8 6a1 1 0 1 1 0 2v3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
						<circle cx="8" cy="12" r="0.5"/>
					</svg>
				</button>
			</div>
		</div>
	)
}
