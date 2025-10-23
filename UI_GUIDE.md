# Make Real - UI Guide

## Settings Location

When you run `npm run dev` and open http://localhost:3000, you'll see:

### Top-Left Corner: ⚙️ Settings Button
**Click the gear icon** to access:
- **Provider Selection**: Choose between Anthropic, OpenAI, OpenRouter, or LM Studio
- **Model Selection**: Pick from available models (GPT-5, Claude 3.5, o3, etc.)
- **API Key Input**: Enter your API key for the selected provider
- **Advanced Settings**:
  - Temperature slider (0-2)
  - Max Tokens (256-8192)
  - Base URL (for LM Studio)

### Top-Right Corner: ✏️ System Prompt Editor
Edit the AI instructions for how to convert wireframes to HTML

### Center-Top: "Make Real" Button
Click this after selecting shapes on the canvas to generate HTML

## How to Select a Model

1. Click the **⚙️ gear icon** (top-left)
2. **Select Provider** dropdown - Choose: Anthropic, OpenAI, OpenRouter, or LM Studio
3. **Select Model** dropdown - Choose from available models:
   - Anthropic: claude-3-5-sonnet-20241022, claude-3-opus, etc.
   - OpenAI: gpt-5, o3, o3-mini, o4-mini, gpt-4.1, gpt-4o, etc.
   - OpenRouter: Multiple providers' models
   - LM Studio: Enter your local model name
4. **Enter API Key** (not needed for LM Studio)
5. **(Optional) Click "Show Advanced Settings"** to adjust temperature and max tokens
6. Click **"Save Settings"**

Your settings are automatically saved to browser localStorage!

## Available Models (2025)

### Anthropic
- claude-3-5-sonnet-20241022 ⭐ (Recommended)
- claude-3-opus-20240229
- claude-3-sonnet-20240229
- claude-3-haiku-20240307

### OpenAI
- gpt-5 (Newest flagship model)
- o3, o3-pro, o3-mini (Reasoning models)
- o4-mini (Fast reasoning)
- gpt-4.1, gpt-4.1-mini, gpt-4.1-nano (1M context)
- gpt-4o, gpt-4o-mini
- gpt-4-turbo, gpt-4

### OpenRouter
- anthropic/claude-3.5-sonnet
- openai/gpt-5
- openai/o3
- google/gemini-2.0-flash-exp:free
- meta-llama/llama-3.2-90b-vision-instruct
- And many more...

### LM Studio (Local)
- Load any vision-capable model locally
- Common: LLaVA, BakLLaVA
- Enter custom model identifier

## Responsive Design

The Settings Panel works on:
- 💻 **Desktop**: Full modal with all options
- 📱 **Tablet**: Optimized layout
- 📱 **Mobile**: Full-screen overlay with stacked buttons

All touch targets are 44px minimum for accessibility!
