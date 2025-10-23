import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface SettingsPanelProps {
  initialSettings: Settings;
  onSave: (settings: Settings) => void;
}

export interface Settings {
  provider: 'anthropic' | 'openai' | 'openrouter' | 'lmstudio';
  model: string;
  apiKey: string;
  baseUrl?: string; // For LM Studio
  temperature?: number;
  maxTokens?: number;
}

const PROVIDER_MODELS = {
  anthropic: [
    'claude-3-5-sonnet-20241022',
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307',
  ],
  openai: [
    // GPT-5 series
    'gpt-5',
    'gpt-5-mini',
    'gpt-5-nano',
    'gpt-5-chat',
    'gpt-5-pro',
    // O-series (reasoning models)
    'o3',
    'o3-pro',
    'o3-mini',
    'o4-mini',
    // GPT-4.1 series
    'gpt-4.1',
    'gpt-4.1-mini',
    'gpt-4.1-nano',
    // GPT-4o series
    'gpt-4o',
    'gpt-4o-mini',
    // GPT-4 series
    'gpt-4-turbo',
    'gpt-4',
  ],
  openrouter: [
    // Anthropic Claude (Vision)
    'anthropic/claude-sonnet-4.5',
    'anthropic/claude-sonnet-4',
    'anthropic/claude-3.7-sonnet',
    'anthropic/claude-3.7-sonnet:thinking',
    'anthropic/claude-3.5-sonnet',
    'anthropic/claude-3.5-haiku',
    'anthropic/claude-3-opus',
    'anthropic/claude-3-sonnet',
    // OpenAI via OpenRouter
    'openai/gpt-5',
    'openai/gpt-5-mini',
    'openai/gpt-5-nano',
    'openai/o3',
    'openai/o3-pro',
    'openai/o3-mini',
    'openai/o4-mini',
    'openai/gpt-4.1',
    'openai/gpt-4.1-mini',
    'openai/gpt-4o',
    'openai/gpt-4o-mini',
    // Google Gemini (Vision)
    'google/gemini-2.5-pro',
    'google/gemini-2.5-flash',
    'google/gemini-2.5-flash-preview:thinking',
    'google/gemini-2.5-flash-image-preview',
    'google/gemini-2.0-flash-001',
    'google/gemini-2.0-flash-exp:free',
    'google/gemini-pro-vision',
    'google/gemini-pro-1.5',
    'google/gemma-3-27b-it:free',
    'google/gemma-3-12b-it:free',
    'google/gemma-3-4b-it:free',
    // Meta Llama (Vision)
    'meta-llama/llama-4-maverick',
    'meta-llama/llama-3.2-90b-vision-instruct',
    'meta-llama/llama-3.2-11b-vision-instruct:free',
    // xAI Grok (Vision)
    'x-ai/grok-4',
    'x-ai/grok-4-fast:free',
    'x-ai/grok-vision-beta',
    // Qwen (Vision)
    'qwen/qwen2.5-vl-72b-instruct:free',
    'qwen/qwen2.5-vl-32b-instruct:free',
    'qwen/qwen-2-vl-72b-instruct',
    // Mistral (Vision)
    'mistralai/mistral-small-3.1-24b-instruct:free',
    // Moonshotai (Vision)
    'moonshotai/kimi-vl-a3b-thinking:free',
    // 01.AI (Vision)
    '01-ai/yi-vision',
  ],
  lmstudio: [
    // User's locally loaded models
    'local-model',
  ],
};

export function SettingsPanel({ initialSettings, onSave }: SettingsPanelProps) {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [isOpen, setIsOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleSave = () => {
    // Validate API key for non-lmstudio providers
    if (settings.provider !== 'lmstudio' && !settings.apiKey?.trim()) {
      alert(`Please enter an API key for ${settings.provider}`);
      return;
    }
    
    console.log('Saving settings:', settings);
    onSave(settings);
    setIsOpen(false);
  };

  const handleProviderChange = (provider: Settings['provider']) => {
    const defaultModel = PROVIDER_MODELS[provider][0];
    setSettings({
      ...settings,
      provider,
      model: defaultModel,
      baseUrl: provider === 'lmstudio' ? 'http://localhost:1234' : undefined,
    });
  };

  const handleReset = () => {
    setSettings(initialSettings);
  };

  if (!isOpen) {
    return (
      <button
        className="settings-button"
        onClick={() => setIsOpen(true)}
        title="Settings"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
          <path d="M14 8a1.5 1.5 0 0 0-.5-1.1l-.9-.8.2-1.2a1.5 1.5 0 0 0-1.1-1.7l-1.2-.3-.6-1.1A1.5 1.5 0 0 0 8 1.1a1.5 1.5 0 0 0-1.9.7l-.6 1-.1.1-1.2.3a1.5 1.5 0 0 0-1.1 1.7l.2 1.2-.9.8A1.5 1.5 0 0 0 2 8c0 .4.2.9.5 1.1l.9.8-.2 1.2a1.5 1.5 0 0 0 1.1 1.7l1.2.3.6 1.1a1.5 1.5 0 0 0 1.9.7 1.5 1.5 0 0 0 1.9-.7l.6-1.1 1.2-.3a1.5 1.5 0 0 0 1.1-1.7l-.2-1.2.9-.8c.3-.2.5-.7.5-1.1z" opacity="0.4"/>
        </svg>
        <span className="settings-button-text">Settings</span>
      </button>
    );
  }

  const modalContent = (
    <div className="settings-panel-overlay" onClick={() => setIsOpen(false)}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-panel-header">
          <h2>Settings</h2>
          <button
            className="settings-panel-close"
            onClick={() => setIsOpen(false)}
            title="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </button>
        </div>

        <div className="settings-panel-content">
          {/* Provider Selection */}
          <div className="settings-field">
            <label htmlFor="provider">Provider</label>
            <select
              id="provider"
              value={settings.provider}
              onChange={(e) => handleProviderChange(e.target.value as Settings['provider'])}
            >
              <option value="anthropic">Anthropic (Claude)</option>
              <option value="openai">OpenAI</option>
              <option value="openrouter">OpenRouter</option>
              <option value="lmstudio">LM Studio (Local)</option>
            </select>
          </div>

          {/* Model Selection */}
          <div className="settings-field">
            <label htmlFor="model">Model</label>
            <select
              id="model"
              value={settings.model}
              onChange={(e) => setSettings({ ...settings, model: e.target.value })}
            >
              {PROVIDER_MODELS[settings.provider].map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
            {settings.provider === 'lmstudio' && (
              <small className="settings-hint">
                Or enter custom model name below
              </small>
            )}
          </div>

          {/* Custom Model Input for LM Studio */}
          {settings.provider === 'lmstudio' && (
            <div className="settings-field">
              <label htmlFor="custom-model">Custom Model Name</label>
              <input
                id="custom-model"
                type="text"
                value={settings.model === 'local-model' ? '' : settings.model}
                onChange={(e) => setSettings({ ...settings, model: e.target.value || 'local-model' })}
                placeholder="Enter model identifier"
              />
            </div>
          )}

          {/* API Key Input (except LM Studio) */}
          {settings.provider !== 'lmstudio' && (
            <div className="settings-field">
              <label htmlFor="api-key">
                API Key
                <button
                  className="settings-info-button"
                  onClick={() => {
                    const urls: Record<string, string> = {
                      anthropic: 'https://console.anthropic.com/account/keys',
                      openai: 'https://platform.openai.com/api-keys',
                      openrouter: 'https://openrouter.ai/keys',
                    };
                    window.alert(
                      `Get your ${settings.provider} API key from:\n${urls[settings.provider]}\n\nNote: API keys are stored in browser localStorage. Use at your own risk.`
                    );
                  }}
                  title="API Key Info"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M8 6a1 1 0 1 1 0 2v3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <circle cx="8" cy="12" r="0.5"/>
                  </svg>
                </button>
              </label>
              <input
                id="api-key"
                type="password"
                value={settings.apiKey}
                onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                placeholder={`Enter your ${settings.provider} API key`}
                spellCheck={false}
                autoCapitalize="off"
              />
            </div>
          )}

          {/* Base URL for LM Studio */}
          {settings.provider === 'lmstudio' && (
            <div className="settings-field">
              <label htmlFor="base-url">Base URL</label>
              <input
                id="base-url"
                type="text"
                value={settings.baseUrl || 'http://localhost:1234'}
                onChange={(e) => setSettings({ ...settings, baseUrl: e.target.value })}
                placeholder="http://localhost:1234"
              />
              <small className="settings-hint">
                Default: http://localhost:1234
              </small>
            </div>
          )}

          {/* Advanced Settings Toggle */}
          <button
            className="settings-toggle-advanced"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ marginLeft: '4px' }}>
              {showAdvanced ? (
                <path d="M4 10l4-4 4 4" stroke="currentColor" strokeWidth="2" fill="none"/>
              ) : (
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
              )}
            </svg>
          </button>

          {/* Advanced Settings */}
          {showAdvanced && (
            <>
              <div className="settings-field">
                <label htmlFor="temperature">
                  Temperature
                  <span className="settings-field-value">{settings.temperature ?? 0}</span>
                </label>
                <input
                  id="temperature"
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.temperature ?? 0}
                  onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                />
                <small className="settings-hint">
                  Lower = more focused, Higher = more creative
                </small>
              </div>

              <div className="settings-field">
                <label htmlFor="max-tokens">
                  Max Tokens
                  <span className="settings-field-value">{settings.maxTokens ?? 4096}</span>
                </label>
                <input
                  id="max-tokens"
                  type="number"
                  min="256"
                  max="8192"
                  step="256"
                  value={settings.maxTokens ?? 4096}
                  onChange={(e) => setSettings({ ...settings, maxTokens: parseInt(e.target.value) })}
                />
              </div>
            </>
          )}
        </div>

        <div className="settings-panel-actions">
          <button onClick={handleReset} className="settings-button-secondary">
            Reset
          </button>
          <button onClick={handleSave} className="settings-button-primary">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        className="settings-button"
        onClick={() => setIsOpen(true)}
        title="Settings"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
          <path d="M14 8a1.5 1.5 0 0 0-.5-1.1l-.9-.8.2-1.2a1.5 1.5 0 0 0-1.1-1.7l-1.2-.3-.6-1.1A1.5 1.5 0 0 0 8 1.1a1.5 1.5 0 0 0-1.9.7l-.6 1-.1.1-1.2.3a1.5 1.5 0 0 0-1.1 1.7l.2 1.2-.9.8A1.5 1.5 0 0 0 2 8c0 .4.2.9.5 1.1l.9.8-.2 1.2a1.5 1.5 0 0 0 1.1 1.7l1.2.3.6 1.1a1.5 1.5 0 0 0 1.9.7 1.5 1.5 0 0 0 1.9-.7l.6-1.1 1.2-.3a1.5 1.5 0 0 0 1.1-1.7l-.2-1.2.9-.8c.3-.2.5-.7.5-1.1z" opacity="0.4"/>
        </svg>
        <span className="settings-button-text">Settings</span>
      </button>
      {isOpen && typeof document !== 'undefined' && createPortal(modalContent, document.body)}
    </>
  );
}
