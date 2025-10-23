# Settings Panel Testing Guide

## What Was Fixed

### Critical Issues Resolved:
1. **Anthropic API Route Bug** - The Anthropic API route was NOT reading the API key from settings, only from environment variables. This has been fixed.
2. **API Key Validation** - Added validation to prevent saving settings without an API key
3. **Better Error Messages** - Added helpful error messages for invalid API keys and missing configuration

### Files Modified:
- `app/api/anthropic/route.ts` - Now extracts and uses API key from request body
- `app/components/SettingsPanel.tsx` - Added API key validation on save
- `app/lib/getHtmlFromProvider.ts` - Added pre-request validation and better error handling

## How to Test Settings Menu

### 1. Open Settings
- Click the "Settings" button (gear icon) in the toolbar
- Settings panel should open as an overlay

### 2. Test Provider Selection
Each provider should show its appropriate models:

#### Test Anthropic:
1. Select "Anthropic (Claude)" from Provider dropdown
2. Model dropdown should show:
   - claude-3-5-sonnet-20241022 (default)
   - claude-3-opus-20240229
   - claude-3-sonnet-20240229
   - claude-3-haiku-20240307
3. API Key field should be visible
4. Base URL field should NOT be visible

#### Test OpenAI:
1. Select "OpenAI" from Provider dropdown
2. Model dropdown should show:
   - gpt-5
   - o3, o3-pro, o3-mini, o4-mini
   - gpt-4.1, gpt-4.1-mini, gpt-4.1-nano
   - gpt-4o, gpt-4o-mini
   - gpt-4-turbo, gpt-4
3. API Key field should be visible
4. Base URL field should NOT be visible

#### Test OpenRouter:
1. Select "OpenRouter" from Provider dropdown
2. Model dropdown should show various models including:
   - anthropic/claude-3.5-sonnet
   - openai/gpt-5
   - google/gemini models
   - meta-llama models
3. API Key field should be visible
4. Base URL field should NOT be visible

#### Test LM Studio:
1. Select "LM Studio (Local)" from Provider dropdown
2. Model dropdown should show:
   - local-model (default)
3. Custom Model Name input should be visible
4. API Key field should NOT be visible
5. Base URL field should be visible with default: http://localhost:1234

### 3. Test Model Selection
1. For each provider, select different models from the dropdown
2. Each selection should update immediately in the UI
3. The selected model should be retained when closing and reopening settings

### 4. Test API Key Entry
1. Select a non-LM Studio provider
2. Enter a test API key in the API Key field
3. Try to save without entering a key - should show validation error
4. Enter a valid key and save - should close panel successfully

### 5. Test Advanced Settings
1. Click "Show Advanced Settings"
2. Temperature slider should appear (range 0-2, default 0)
3. Max Tokens input should appear (default 4096)
4. Adjust values and verify they update
5. Click "Hide Advanced Settings" to collapse

### 6. Test Settings Persistence
1. Configure settings with:
   - Provider: OpenAI
   - Model: gpt-4o
   - API Key: test-key-123
   - Temperature: 0.5
   - Max Tokens: 2048
2. Click "Save Settings"
3. Refresh the browser page
4. Open Settings again
5. Verify all settings were restored correctly

### 7. Test Reset Button
1. Change several settings
2. Click "Reset" button
3. Settings should revert to the initial values shown when the panel was opened
4. Click "Save Settings" to confirm or close to discard

### 8. Test Provider Switching
1. Select "Anthropic" provider and a model
2. Switch to "OpenAI" provider
3. Model should automatically change to first OpenAI model (gpt-5)
4. API key field should still be visible (you need to enter OpenAI API key)
5. Switch to "LM Studio"
6. API key field should hide, Base URL field should appear

## Console Logging

When using Make Real, check the browser console for detailed logging:

```
=== Starting getHtmlFromProvider ===
Provider: openai
Model: gpt-4o
System message length: 1234
Image data length: 56789

=== Making API Request ===
Request URL: /api/openai
Provider: openai
Model: gpt-4o

=== Response Details ===
Response status: 200
Response status text: OK

=== Response Success ===
Response structure: ['choices']
```

## Expected Behavior Summary

### ✅ Provider Selection:
- Dropdown shows 4 providers
- Selecting a provider updates the model list
- Model automatically changes to first model of new provider

### ✅ Model Selection:
- Each provider shows correct models
- Can select any model from the list
- LM Studio allows custom model name entry

### ✅ API Key Management:
- Required for Anthropic, OpenAI, OpenRouter
- Not shown for LM Studio
- Validated on save (must not be empty)
- Clear error message if missing

### ✅ Persistence:
- Settings saved to localStorage as 'makereal_settings'
- Restored on page load
- Survives browser refresh

### ✅ Error Handling:
- "Please enter an API key for {provider}" - if saving without API key
- "Please configure your {PROVIDER} API key in Settings" - if calling API without key
- "Invalid API key for {provider}" - if API returns 401/403

## Common Issues & Solutions

### Issue: Settings don't persist after refresh
**Solution**: Check browser console for localStorage errors. Make sure localStorage is not disabled.

### Issue: API key validation error even though key is entered
**Solution**: Make sure there are no extra spaces. The validation uses `.trim()` to check.

### Issue: Wrong models showing for a provider
**Solution**: This shouldn't happen now. Verify the provider is actually selected in the dropdown.

### Issue: Make Real fails with "Please configure API key"
**Solution**: Open Settings, verify the correct provider is selected, enter valid API key, click Save Settings.

## Testing Checklist

- [ ] Can open Settings panel
- [ ] Can close Settings panel
- [ ] Can select all 4 providers
- [ ] Each provider shows correct models
- [ ] Can select different models
- [ ] API key field shows/hides correctly
- [ ] Base URL field shows only for LM Studio
- [ ] Can toggle Advanced Settings
- [ ] Can adjust Temperature slider
- [ ] Can change Max Tokens
- [ ] Reset button reverts changes
- [ ] Save button validates API key
- [ ] Settings persist after page refresh
- [ ] Can switch between providers smoothly
- [ ] Custom model name works for LM Studio
- [ ] Console shows detailed logging
- [ ] Error messages are clear and helpful

## Additional Notes

### localStorage Key
Settings are stored in `localStorage.makereal_settings` as JSON:
```json
{
  "provider": "openai",
  "model": "gpt-4o",
  "apiKey": "YOUR_API_KEY_HERE",
  "temperature": 0,
  "maxTokens": 4096
}
```

### Provider-Specific Request Formats
The system automatically handles different API formats:
- **Anthropic**: Uses `messages` array with `system` field separately
- **OpenAI/OpenRouter/LM Studio**: Uses `messages` array with system message as first message

All of this is handled automatically in `getHtmlFromProvider.ts`.
