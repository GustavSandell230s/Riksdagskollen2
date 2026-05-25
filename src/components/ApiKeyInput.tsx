import { useEffect, useState } from 'react';
import { getSavedApiKey, saveApiKey, clearSavedApiKey } from '../services/openai';

export function ApiKeyInput() {
  const [key, setKey] = useState('');
  const [savedKey, setSavedKey] = useState<string | null>(null);

  useEffect(() => {
    setSavedKey(getSavedApiKey());
  }, []);

  const handleSave = () => {
    saveApiKey(key.trim());
    setSavedKey(getSavedApiKey());
    setKey('');
  };

  return (
    <div className="api-key-card">
      <h3>API-nyckel</h3>
      <p>
        Klistra in din OpenAI-nyckel här när du är redo. Appen kan då generera neutrala
        sammanfattningar från officiella källor.
      </p>
      {savedKey ? (
        <div className="api-key-status">
          <span>Nyckel sparad</span>
          <button onClick={() => { clearSavedApiKey(); setSavedKey(null); }}>Rensa</button>
        </div>
      ) : (
        <div className="api-key-input-group">
          <input
            type="password"
            value={key}
            onChange={(event) => setKey(event.target.value)}
            placeholder="Klistra in API-nyckel"
          />
          <button onClick={handleSave} disabled={!key.trim()}>
            Spara
          </button>
        </div>
      )}
    </div>
  );
}
