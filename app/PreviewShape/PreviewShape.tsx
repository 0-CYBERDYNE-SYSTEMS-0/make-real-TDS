/* eslint-disable react-hooks/rules-of-hooks */
import {
	BaseBoxShapeUtil,
	DefaultSpinner,
	HTMLContainer,
	SvgExportContext,
	TLBaseShape,
	Vec,
	stopEventPropagation,
	toDomPrecision,
	useIsEditing,
	useToasts,
	useValue,
} from '@tldraw/tldraw'
import { useCallback, useState, useRef, useEffect } from 'react'

export type PreviewShape = TLBaseShape<
	'response',
	{
		html: string
		w: number
		h: number
	}
>

export class PreviewShapeUtil extends BaseBoxShapeUtil<PreviewShape> {
	static override type = 'response' as const

	getDefaultProps(): PreviewShape['props'] {
		return {
			html: '',
			w: (960 * 2) / 3,
			h: (540 * 2) / 3,
		}
	}

	override canEdit = () => true
	override isAspectRatioLocked = () => false
	override canResize = () => true
	override canBind = () => false
	override component(shape: PreviewShape) {
		const isEditing = useIsEditing(shape.id)
		const toast = useToasts()
		const [showExportMenu, setShowExportMenu] = useState(false)
		const exportMenuRef = useRef<HTMLDivElement>(null)

		const handleExport = useCallback((format: 'svg' | 'png' | 'json' | 'html') => {
			this.exportShape(shape, format)
			setShowExportMenu(false)
		}, [shape])

		const handleClickOutside = useCallback((event: MouseEvent) => {
			if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
				setShowExportMenu(false)
			}
		}, [])

		useEffect(() => {
			if (showExportMenu) {
				document.addEventListener('mousedown', handleClickOutside)
			} else {
				document.removeEventListener('mousedown', handleClickOutside)
			}

			return () => {
				document.removeEventListener('mousedown', handleClickOutside)
			}
		}, [showExportMenu, handleClickOutside])

		const boxShadow = useValue(
			'box shadow',
			() => {
				const rotation = this.editor.getShapePageTransform(shape)!.rotation()
				return getRotatedBoxShadow(rotation)
			},
			[this.editor]
		)

		// Kind of a hack—we're preventing users from pinching-zooming into the iframe
		const htmlToUse = shape.props.html.replace(
			`</body>`,
			`<script src="https://unpkg.com/html2canvas"></script><script>
			// send the screenshot to the parent window
  			window.addEventListener('message', function(event) {
    		if (event.data.action === 'take-screenshot' && event.data.shapeid === "${shape.id}") {
      		html2canvas(document.body, {useCors : true}).then(function(canvas) {
        		const data = canvas.toDataURL('image/png');
        		window.parent.postMessage({screenshot: data, shapeid: "${shape.id}"}, "*");
      		});
    		}
  			}, false);
			document.body.addEventListener('wheel', e => { if (!e.ctrlKey) return; e.preventDefault(); return }, { passive: false })</script>
</body>`
		)
		return (
			<HTMLContainer className="tl-embed-container" id={shape.id}>
				{htmlToUse ? (
					<iframe
						id={`iframe-1-${shape.id}`}
						srcDoc={htmlToUse}
						width={toDomPrecision(shape.props.w)}
						height={toDomPrecision(shape.props.h)}
						draggable={false}
						style={{
							pointerEvents: isEditing ? 'auto' : 'none',
							boxShadow,
							border: '1px solid var(--color-panel-contrast)',
							borderRadius: 'var(--radius-2)',
						}}
					/>
				) : (
					<div
						style={{
							width: '100%',
							height: '100%',
							backgroundColor: 'var(--color-muted-2)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							border: '1px solid var(--color-muted-1)',
						}}
					>
						<DefaultSpinner />
					</div>
				)}
				<div
					style={{
						position: 'absolute',
						top: 0,
						right: -40,
						height: 40,
						width: 40,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						cursor: 'pointer',
						pointerEvents: 'all',
					}}
					onClick={() => {
						if (navigator && navigator.clipboard) {
							navigator.clipboard.writeText(shape.props.html)
							toast.addToast({
								icon: 'duplicate',
								title: 'Copied to clipboard',
							})
						}
					}}
					onPointerDown={stopEventPropagation}
				>
					<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
						<path d="M4 2a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4zm2 8V6h4v4H6z" opacity="0.6"/>
						<path d="M6 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6z"/>
					</svg>
				</div>
				<div
					style={{
						position: 'absolute',
						top: 0,
						right: -80,
						height: 40,
						width: 40,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						cursor: 'pointer',
						pointerEvents: 'all',
					}}
					onClick={() => setShowExportMenu(!showExportMenu)}
					onPointerDown={stopEventPropagation}
				>
					<svg width="16" height="16" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" fill="none">
						<path d="M8 2v8M5 5l3-3 3 3M3 12h10v2H3z"/>
					</svg>
				</div>
				{showExportMenu && (
					<div
						ref={exportMenuRef}
						style={{
							position: 'absolute',
							top: 40,
							right: -120,
							backgroundColor: 'var(--color-panel)',
							borderRadius: 'var(--radius-2)',
							boxShadow: '0 0 0 1px var(--color-muted-1)',
							overflow: 'hidden',
						}}
						onMouseLeave={() => setShowExportMenu(false)}
					>
						{['svg', 'png', 'json', 'html'].map((format) => (
							<div
								key={format}
								style={{
									padding: '8px 16px',
									cursor: 'pointer',
								}}
								onClick={() => handleExport(format as 'svg' | 'png' | 'json' | 'html')}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor = 'var(--color-muted-2)'
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = ''
								}}
							>
								Export as {format.toUpperCase()}
							</div>
						))}
					</div>
				)}
				{htmlToUse && (
					<div
						style={{
							textAlign: 'center',
							position: 'absolute',
							bottom: isEditing ? -40 : 0,
							padding: 4,
							fontFamily: 'inherit',
							fontSize: 12,
							left: 0,
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							pointerEvents: 'none',
						}}
					>
						<span
							style={{
								background: 'var(--color-panel)',
								padding: '4px 12px',
								borderRadius: 99,
								border: '1px solid var(--color-muted-1)',
							}}
						>
							{isEditing ? 'Click the canvas to exit' : 'Double click to interact'}
						</span>
					</div>
				)}
			</HTMLContainer>
		)
	}
	// Note: toSvg removed due to API changes in tldraw 2.x
	// The base class handles basic SVG export
	// Custom export functionality is available via the exportShape method
	indicator(shape: PreviewShape) {
		return <rect width={shape.props.w} height={shape.props.h} />
	}

	exportShape(shape: PreviewShape, format: 'svg' | 'png' | 'json' | 'html') {
		switch (format) {
			case 'svg':
				// SVG export removed due to API changes - use PNG instead
				this.toPng(shape);
				break;
			case 'png':
				this.toPng(shape);
				break;
			case 'json':
				this.toJson(shape);
				break;
			case 'html':
				this.exportHTML(shape);
				break;
		}
	}

	exportHTML(shape: PreviewShape) {
		const htmlContent = shape.props.html;
		const blob = new Blob([htmlContent], { type: 'text/html' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'exported_html.html';
		link.click();
		URL.revokeObjectURL(url);
	}

	async toPng(shape: PreviewShape) {
		// Export the iframe content directly using html2canvas
		const iframe = document.getElementById(`iframe-1-${shape.id}`) as HTMLIFrameElement;
		if (!iframe || !iframe.contentWindow) {
			console.error('Iframe not found or not accessible');
			return;
		}
		
		// Request screenshot from iframe
		return new Promise<void>((resolve) => {
			const messageListener = (event: MessageEvent) => {
				if (event.data.screenshot && event.data?.shapeid === shape.id) {
					window.removeEventListener('message', messageListener);
					
					// Convert base64 to blob and download
					fetch(event.data.screenshot)
						.then(res => res.blob())
						.then(blob => {
							const url = URL.createObjectURL(blob);
							const link = document.createElement('a');
							link.href = url;
							link.download = 'exported_image.png';
							link.click();
							URL.revokeObjectURL(url);
							resolve();
						});
				}
			};
			
			window.addEventListener('message', messageListener);
			iframe.contentWindow!.postMessage({ action: 'take-screenshot', shapeid: shape.id }, '*');
			
			// Timeout after 3 seconds
			setTimeout(() => {
				window.removeEventListener('message', messageListener);
				resolve();
			}, 3000);
		});
	}

	toJson(shape: PreviewShape) {
		const json = JSON.stringify({
			id: shape.id,
			type: shape.type,
			x: shape.x,
			y: shape.y,
			props: shape.props
		}, null, 2);

		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'exported_shape.json';
		link.click();
		URL.revokeObjectURL(url);
	}

	downloadSvg(svg: SVGElement) {
		const svgString = new XMLSerializer().serializeToString(svg);
		const blob = new Blob([svgString], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'exported_image.svg';
		link.click();
		URL.revokeObjectURL(url);
	}
}

function getRotatedBoxShadow(rotation: number) {
	const cssStrings = ROTATING_BOX_SHADOWS.map((shadow) => {
		const { offsetX, offsetY, blur, spread, color } = shadow
		const vec = new Vec(offsetX, offsetY)
		const { x, y } = vec.rot(-rotation)
		return `${x}px ${y}px ${blur}px ${spread}px ${color}`
	})
	return cssStrings.join(', ')
}

const ROTATING_BOX_SHADOWS = [
	{
		offsetX: 0,
		offsetY: 2,
		blur: 4,
		spread: -1,
		color: '#0000003a',
	},
	{
		offsetX: 0,
		offsetY: 3,
		blur: 12,
		spread: -2,
		color: '#0000001f',
	},
]