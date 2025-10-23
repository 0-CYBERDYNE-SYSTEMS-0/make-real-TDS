# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Make Real** application that converts hand-drawn wireframes into functional HTML prototypes using tldraw and multiple AI providers. Users draw UI mockups on an infinite canvas, select them, and press "Make Real" to generate working HTML/CSS/JavaScript code that renders in an interactive iframe.

**Multi-Provider Support**: The application supports multiple AI providers:
- **Anthropic** (Claude models)
- **OpenAI** (GPT-5, GPT-4.1, GPT-4o, o3, o4-mini models)
- **OpenRouter** (unified access to multiple providers)
- **LM Studio** (local models)

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (starts on localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Environment Setup

Create a `.env.local` file in the project root (optional - API keys can also be configured in the Settings UI):

```
# Optional: Set default API keys (can be overridden in Settings UI)
ANTHROPIC_API_KEY=your_anthropic_key_here
OPENAI_API_KEY=your_openai_key_here
OPENROUTER_API_KEY=your_openrouter_key_here
```

**Note**: API keys can be configured either via environment variables OR through the Settings panel in the UI. Keys entered in the Settings panel are stored in browser localStorage and take precedence over environment variables.

## Architecture

### Tech Stack
- **Next.js 14** (App Router)
- **React 18**
- **tldraw 2.0** - Infinite canvas/whiteboard library
- **TypeScript**
- **Multiple AI Providers**:
  - Anthropic Claude API (claude-3-5-sonnet, claude-3-opus, etc.)
  - OpenAI API (GPT-5, GPT-4.1, GPT-4o, o3, o4-mini)
  - OpenRouter API (unified access to multiple models)
  - LM Studio (local models)

### Key Flow

1. **User draws wireframes** on the tldraw canvas
2. **Selection capture**: When "Make Real" is clicked, selected shapes are:
   - Exported as SVG with a reference grid overlay
   - Converted to PNG image (base64 encoded)
3. **API request**: Image + system prompt + context sent to Claude API
4. **Response parsing**: HTML extracted from Claude's response
5. **Rendering**: HTML displayed in a custom tldraw shape (PreviewShape) using an iframe

### Core Files

**Main orchestration:**
- `app/lib/makeReal.tsx` - Entry point for the Make Real flow. Handles shape selection, image conversion, API call, and shape creation.

**API layer:**
- `app/api/anthropic/route.ts` - Next.js API route that proxies requests to Anthropic API
- `app/api/openai/route.ts` - Next.js API route that proxies requests to OpenAI API
- `app/api/openrouter/route.ts` - Next.js API route that proxies requests to OpenRouter API
- `app/api/lmstudio/route.ts` - Next.js API route that proxies requests to LM Studio local server
- `app/lib/getHtmlFromProvider.ts` - Unified client-side function that handles all providers
- `app/lib/getHtmlFromAnthropic.ts` - Legacy Anthropic-specific function (kept for reference)

**Custom tldraw shape:**
- `app/PreviewShape/PreviewShape.tsx` - Custom shape definition that renders generated HTML in an iframe with export capabilities (SVG, PNG, JSON, HTML)

**UI components:**
- `app/components/MakeRealButton.tsx` - Button that triggers the Make Real flow
- `app/components/SettingsPanel.tsx` - Comprehensive settings UI for provider/model/API key configuration
- `app/components/SystemMessageEditor.tsx` - UI for editing the system prompt sent to AI
- `app/components/RiskyButCoolAPIKeyInput.tsx` - Legacy API key input (replaced by SettingsPanel)

**Prompts:**
- `app/prompt.ts` - Contains the system prompt that instructs Claude on how to convert wireframes to HTML

**Utilities:**
- `app/lib/addGridToSvg.ts` - Adds reference grid to SVG for better spatial awareness
- `app/lib/blobToBase64.ts` - Converts image blob to base64
- `app/lib/getSelectionAsText.ts` - Extracts text from selected shapes for additional context

### How PreviewShape Works

The `PreviewShape` is a custom tldraw shape (type: 'response') that:
- Renders generated HTML in a sandboxed iframe
- Supports editing mode (double-click to interact with iframe content)
- Provides copy-to-clipboard functionality
- Includes export options (SVG, PNG, JSON, HTML)
- Uses html2canvas for screenshot generation during SVG export
- Prevents pinch-zoom inside the iframe to maintain consistent UX

### Multi-Provider API Support

The application uses a unified interface (`getHtmlFromProvider`) that handles format differences between providers:

**Anthropic Format:**
```typescript
{
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 4096,
  temperature: 0,
  messages: [{
    role: 'user',
    content: [
      { type: 'text', text: '...' },
      { type: 'image', source: { type: 'base64', media_type: 'image/png', data: '...' } }
    ]
  }],
  system: '<system-prompt>'
}
```

**OpenAI/OpenRouter/LM Studio Format:**
```typescript
{
  model: 'gpt-5',
  max_tokens: 4096,
  temperature: 0,
  messages: [
    { role: 'system', content: '<system-prompt>' },
    {
      role: 'user',
      content: [
        { type: 'text', text: '...' },
        { type: 'image_url', image_url: { url: 'data:image/png;base64,...' } }
      ]
    }
  ]
}
```

All responses are normalized to a common format:
```typescript
{
  choices: [{ message: { content: '<html-response>' } }]
}
```

## Configuration & Customization

### Settings Panel

The SettingsPanel component (`app/components/SettingsPanel.tsx`) provides comprehensive configuration:

**Provider Selection:**
- Anthropic (Claude models)
- OpenAI (GPT-5, GPT-4.1, GPT-4o, o3 series)
- OpenRouter (access to multiple providers)
- LM Studio (local models)

**Model Selection:**
- Each provider has a curated list of available models
- For LM Studio, you can enter custom model names

**Advanced Settings:**
- Temperature (0-2): Controls creativity vs determinism
- Max Tokens (256-8192): Maximum response length
- API Keys: Securely stored in browser localStorage
- Base URL: For LM Studio local server (default: http://localhost:1234)

Settings are persisted in localStorage as `makereal_settings`.

### Changing the AI Behavior

Edit the system prompt in `app/prompt.ts`. The prompt instructs the AI on:
- How to interpret wireframes vs annotations (red elements are annotations)
- Output format requirements (single HTML file with Tailwind CSS)
- JavaScript and external dependencies handling
- Image placeholder strategies

The prompt can also be edited at runtime via the SystemMessageEditor UI component.

### Adding New Providers

To add a new provider:
1. Create API route in `app/api/[provider]/route.ts`
2. Add provider to `Settings['provider']` type in `app/components/SettingsPanel.tsx`
3. Add models to `PROVIDER_MODELS` object
4. Update `getEndpoint()` and `buildRequestBody()` in `app/lib/getHtmlFromProvider.ts`

### Supported Models (2025)

**Anthropic:**
- claude-3-5-sonnet-20241022 (recommended)
- claude-3-opus-20240229
- claude-3-sonnet-20240229
- claude-3-haiku-20240307

**OpenAI:**
- gpt-5 (newest flagship)
- o3, o3-pro, o3-mini (reasoning models)
- o4-mini (fast reasoning)
- gpt-4.1, gpt-4.1-mini, gpt-4.1-nano (1M context)
- gpt-4o, gpt-4o-mini

**OpenRouter:**
- Supports models from multiple providers via unified API
- See OpenRouter docs for full list

## Responsive Design

The application is fully responsive with breakpoints at:
- **Desktop**: Full-featured UI with side panels
- **Tablet (768px)**: Optimized layouts, adjusted spacing
- **Mobile (480px)**: Stacked layouts, larger touch targets
- **Touch devices**: 44px minimum touch target sizes per accessibility guidelines

All UI components (SettingsPanel, SystemMessageEditor, MakeRealButton) are responsive and work well on both mobile and desktop.

## LM Studio Setup

To use local models via LM Studio:

1. Download and install [LM Studio](https://lmstudio.ai)
2. Load a vision-capable model (e.g., LLaVA, BakLLaVA)
3. Start the local server (default: http://localhost:1234)
4. In Settings, select "LM Studio (Local)" provider
5. Enter your model identifier or use the default
6. Make sure the base URL matches your LM Studio server

## Important Notes

- The application uses `'use client'` directive in `app/page.tsx` because tldraw requires client-side rendering
- tldraw is dynamically imported with `ssr: false` to avoid server-side rendering issues
- The persistence key `"make-real"` in the Tldraw component enables local storage of canvas state
- Settings are persisted in localStorage as `makereal_settings`
- Grid overlay color is set to red to match the prompt's instruction about annotations
- Safari requires special handling for SVG-to-image conversion (checked via user agent)
- API keys stored in localStorage are only accessible to this application on the same domain
