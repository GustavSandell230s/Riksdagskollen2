import { useState } from 'react';
import { ApiKeyInput } from '../components/ApiKeyInput';
import { LockIcon, CheckIcon } from '../components/Icons';
import { useTheme } from '../context/ThemeContext';
import '../styles/pages.css';

interface SettingsProps {
  apiKey: string | null;
  onApiKeyChange: (key: string) => void;
}

export function Settings({ apiKey, onApiKeyChange }: SettingsProps) {
  const [notifications, setNotifications] = useState(true);
  const [autoSummary, setAutoSummary] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Inställningar</h1>
        <p>Anpassa din upplevelse</p>
      </div>

      <div className="settings-grid">
        <section className="settings-section">
          <h2>API-nyckel</h2>
          <p className="section-description">
            Lägg till din OpenAI API-nyckel för att aktivera AI-sammanfattningar av politiska ärenden.
          </p>

          <div className="api-section">
            <ApiKeyInput onSave={onApiKeyChange} />
            {apiKey && (
              <div className="api-status success">
                <span className="status-icon"><CheckIcon /></span>
                <span>API-nyckel är konfigurerad</span>
              </div>
            )}
          </div>

          <div className="info-box">
            <h4><LockIcon className="section-icon" /> Sekuritet</h4>
            <p>
              Din API-nyckel lagras lokalt i din webbläsare och skickas aldrig till externa servrar. Du kan när som helst
              radera eller uppdatera den.
            </p>
          </div>
        </section>

        <section className="settings-section">
          <h2>Preferenser</h2>

          <div className="settings-option">
            <div className="setting-header">
              <label htmlFor="notifications">Notifikationer</label>
              <input
                id="notifications"
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="checkbox-input"
              />
            </div>
            <p className="setting-description">Få notifikationer om nya viktiga politiska beslut</p>
          </div>

          <div className="settings-option">
            <div className="setting-header">
              <label htmlFor="themeToggle">Mörkt tema</label>
              <input
                id="themeToggle"
                type="checkbox"
                checked={theme === 'dark'}
                onChange={toggleTheme}
                className="checkbox-input"
              />
            </div>
            <p className="setting-description">Byt mellan mörkt och ljust tema.</p>
          </div>

          <div className="settings-option">
            <div className="setting-header">
              <label htmlFor="autoSummary">Automatiska sammanfattningar</label>
              <input
                id="autoSummary"
                type="checkbox"
                checked={autoSummary}
                onChange={(e) => setAutoSummary(e.target.checked)}
                className="checkbox-input"
              />
            </div>
            <p className="setting-description">Generera AI-sammanfattningar automatiskt (kräver API-nyckel)</p>
          </div>
        </section>

        <section className="settings-section">
          <h2>Om Riksdagkollen</h2>
          <div className="about-content">
            <p>
              <strong>Riksdagkollen</strong> är en informativ plattform för att utforska och förstå politiska beslut från Sveriges
              Riksdag och regering.
            </p>

            <h4>Datakällor</h4>
            <ul>
              <li>
                <strong>Riksdagen:</strong> data.riksdagen.se
              </li>
              <li>
                <strong>Regeringen:</strong> regeringen.se
              </li>
            </ul>

            <h4>Använd AI-sammanfattningar</h4>
            <p>
              Med en OpenAI API-nyckel kan du låta AI generera neutrala sammanfattningar av komplexa politiska texter.
            </p>

            <h4>Version</h4>
            <p>Riksdagkollen v1.0.0</p>
          </div>
        </section>
      </div>
    </div>
  );
}
