# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Make Real** application that converts hand-drawn wireframes into functional HTML prototypes using tldraw and Claude AI (Anthropic). Users draw UI mockups on an infinite canvas, select them, and press "Make Real" to generate working HTML/CSS/JavaScript code that renders in an interactive iframe.

Originally based on OpenAI's GPT-4V, this version has been adapted to use Anthropic's Claude API with vision capabilities.

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

Create a `.env.local` file in the project root:

```
ANTHROPIC_API_KEY=your_api_key_here
```

The Anthropic API key is required for the backend API route to function. The application will not work without it.

## Architecture

### Tech Stack
- **Next.js 14** (App Router)
- **React 18**
- **tldraw 2.0** - Infinite canvas/whiteboard library
- **TypeScript**
- **Anthropic Claude API** - Vision model for wireframe-to-HTML conversion

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
- `app/lib/getHtmlFromAnthropic.ts` - Client-side function that calls the API route, formats the request, and handles the response

**Custom tldraw shape:**
- `app/PreviewShape/PreviewShape.tsx` - Custom shape definition that renders generated HTML in an iframe with export capabilities (SVG, PNG, JSON, HTML)

**UI components:**
- `app/components/MakeRealButton.tsx` - Button that triggers the Make Real flow
- `app/components/SystemMessageEditor.tsx` - UI for editing the system prompt sent to Claude
- `app/components/RiskyButCoolAPIKeyInput.tsx` - Optional client-side API key input (for prototyping)

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

### API Request Format

The Anthropic API expects:
```typescript
{
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 4096,
  temperature: 0,
  messages: [{
    role: 'user',
    content: [
      { type: 'text', text: 'Please convert this design into HTML.' },
      {
        type: 'image',
        source: {
          type: 'base64',
          media_type: 'image/png',
          data: '<base64-string>'
        }
      }
    ]
  }],
  system: '<system-prompt>'
}
```

The response is transformed to match OpenAI's format for compatibility:
```typescript
{
  choices: [{
    message: {
      content: '<claude-response-text>'
    }
  }]
}
```

## Customization

### Changing the AI behavior

Edit the system prompt in `app/prompt.ts`. The prompt instructs Claude on:
- How to interpret wireframes vs annotations (red elements are annotations)
- Output format requirements (single HTML file with Tailwind CSS)
- JavaScript and external dependencies handling
- Image placeholder strategies

The prompt can also be edited at runtime via the SystemMessageEditor UI component.

### Changing the output format

To generate something other than HTML:
1. Modify the prompt in `app/prompt.ts`
2. Update `app/PreviewShape/PreviewShape.tsx` to handle the new format
3. Or use tldraw's built-in shapes (image, text) instead of PreviewShape

### Model configuration

The model and parameters are configured in `app/lib/getHtmlFromAnthropic.ts`:
- Current model: `claude-3-5-sonnet-20241022`
- Max tokens: 4096
- Temperature: 0 (deterministic)

## Important Notes

- The application uses `'use client'` directive in `app/page.tsx` because tldraw requires client-side rendering
- tldraw is dynamically imported with `ssr: false` to avoid server-side rendering issues
- The persistence key `"make-real"` in the Tldraw component enables local storage of canvas state
- Grid overlay color is set to red to match the prompt's instruction about annotations
- Safari requires special handling for SVG-to-image conversion (checked via user agent)
