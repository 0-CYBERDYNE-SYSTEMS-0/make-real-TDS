# Settings Panel Test Checklist

## Pre-Flight Check
- [ ] Build succeeds: `npm run build`
- [ ] Dev server starts: `npm run dev`
- [ ] Page loads without console errors

## Settings Button Test
- [ ] Settings button visible in top-right area
- [ ] Settings button has gear icon
- [ ] Settings button shows "Settings" text on desktop
- [ ] Clicking Settings button opens modal

## Settings Modal - Overlay Test
- [ ] Modal overlay appears (dark background)
- [ ] Clicking overlay background closes modal
- [ ] Modal stays centered on screen
- [ ] Close X button visible in top-right of modal
- [ ] Clicking X button closes modal

## Settings Modal - Provider Selection
- [ ] Provider dropdown is clickable
- [ ] Can select "Anthropic (Claude)"
- [ ] Can select "OpenAI"
- [ ] Can select "OpenRouter"
- [ ] Can select "LM Studio (Local)"
- [ ] Model dropdown updates when provider changes

## Settings Modal - Model Selection
- [ ] Model dropdown is clickable
- [ ] Can select different models
- [ ] Models list changes based on provider
- [ ] For LM Studio: shows custom model input

## Settings Modal - API Key Input
- [ ] API Key input field is visible (non-LM Studio)
- [ ] Can type in API key field
- [ ] Input shows as password (dots)
- [ ] Info button (?) is clickable
- [ ] Info button shows alert with key URL

## Settings Modal - Advanced Settings
- [ ] "Show Advanced Settings" button is clickable
- [ ] Clicking toggles advanced section
- [ ] Temperature slider is draggable
- [ ] Temperature value updates when dragging
- [ ] Max Tokens input is editable
- [ ] Can type numbers in Max Tokens

## Settings Modal - Action Buttons
- [ ] Reset button is clickable
- [ ] Reset button reverts to initial settings
- [ ] Save button is clickable
- [ ] Save button closes modal
- [ ] Settings are saved (check localStorage)

## Make Real Button Test
- [ ] Make Real button visible next to Settings
- [ ] Make Real button is clickable
- [ ] Clicking without selection shows error toast

## Full Flow Test
1. [ ] Open settings
2. [ ] Change provider to OpenAI
3. [ ] Enter API key
4. [ ] Adjust temperature
5. [ ] Click Save
6. [ ] Reopen settings
7. [ ] Verify settings persisted
8. [ ] Click Reset
9. [ ] Verify settings reverted
10. [ ] Close modal with X button

## Edge Cases
- [ ] Can scroll modal content on mobile
- [ ] Modal doesn't break on window resize
- [ ] Multiple rapid clicks don't break state
- [ ] Can tab through form fields
- [ ] ESC key closes modal (if implemented)

## Would I Bet $100 This Works?
- [ ] YES - All tests pass, ready for user
- [ ] NO - Issues need fixing
