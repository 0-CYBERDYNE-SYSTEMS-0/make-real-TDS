import React, { useState, useEffect } from 'react';
import { Icon } from '@tldraw/tldraw';

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
    // GPT-5
    'gpt-5',
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
    // Popular models via OpenRouter
    'anthropic/claude-3.5-sonnet',
    'anthropic/claude-3-opus',
    'openai/gpt-5',
    'openai/o3',
    'openai/o3-mini',
    'openai/gpt-4.1',
    'openai/gpt-4o',
    'google/gemini-2.0-flash-exp:free',
    'google/gemini-pro-1.5',
    'meta-llama/llama-3.2-90b-vision-instruct',
    'qwen/qwen-2-vl-72b-instruct',
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

  console.log('[SettingsPanel] Current settings:', settings);
  console.log('[SettingsPanel] isOpen:', isOpen);
  console.log('[SettingsPanel] showAdvanced:', showAdvanced);

  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  const handleSave = () => {
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
    console.log('[SettingsPanel] Rendering closed button');
    return (
      <button
        className="settings-button"
        onClick={() => {
          console.log('[SettingsPanel] Button clicked, opening...');
          setIsOpen(true);
        }}
        title="Settings"
        style={{ border: '2px solid blue' }}
      >
        <Icon icon="gear" />
        <span className="settings-button-text">Settings</span>
      </button>
    );
  }

  console.log('[SettingsPanel] Rendering open panel');

  return (
    <div className="settings-panel-overlay" onClick={() => setIsOpen(false)}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-panel-header">
          <h2>Settings</h2>
          <button
            className="settings-panel-close"
            onClick={() => setIsOpen(false)}
            title="Close"
          >
            <Icon icon="cross-2" />
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
                  <Icon icon="question" />
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
            <Icon icon={showAdvanced ? 'chevron-up' : 'chevron-down'} />
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
}
