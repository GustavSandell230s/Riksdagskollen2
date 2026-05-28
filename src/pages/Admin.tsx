import { useState } from 'react';
import { generateAndSaveDecisions } from '../services/aiGenerator';
import { hasDecisions } from '../services/supabase';
import { topicMap } from '../data/topics';
import type { Topic } from '../types';
import {
  AdminIcon,
  DatabaseIcon,
  PlayIcon,
  InfoIcon,
  ClipboardIcon,
} from '../components/Icons';

interface AdminProps {
  onRefreshDecisions?: () => Promise<void>;
}

export function Admin({ onRefreshDecisions }: AdminProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalDecisions, setTotalDecisions] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [generatedCount, setGeneratedCount] = useState(10);
  const [selectedTopics, setSelectedTopics] = useState<Set<Topic>>(new Set());

  const handleGenerateDecisions = async () => {
    setIsGenerating(true);
    setMessage('');
    setError('');
    setProgress(0);
    setTotalDecisions(generatedCount);

    try {
      const result = await generateAndSaveDecisions(
        generatedCount,
        Array.from(selectedTopics),
        (current, total) => {
          setProgress(current);
        },
      );

      if (result.success) {
        setMessage(`${generatedCount} beslut har genererats och sparats i Supabase.`);
        if (onRefreshDecisions) {
          await onRefreshDecisions();
        }
      } else {
        setError(
          `Det gick inte att spara besluten. Kontrollera din Supabase-anslutning.${result.error ? ` ${result.error}` : ''}`,
        );
      }
    } catch (err) {
      setError(`Ett fel uppstod: ${err instanceof Error ? err.message : 'Okänt fel'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCheckDatabase = async () => {
    try {
      const has = await hasDecisions();
      if (has) {
        setMessage('Databasen innehåller redan beslut.');
      } else {
        setMessage('Databasen är tom. Generera några beslut för att komma igång.');
      }
    } catch (err) {
      setError(`Fel vid kontroll: ${err instanceof Error ? err.message : 'Okänt fel'}`);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1>
          <AdminIcon className="header-icon" />
          Admin-panel
        </h1>
        <p className="admin-subtitle">Generera och hantera AI-beslut för databasen</p>

        <section className="admin-section">
          <h2>Generator för beslut</h2>
          <p>
            Denna generator skapar realistiska svenska politiska beslut och sparar dem i Supabase.
            Besluten genereras med slumpmässig röstfördelning och datum.
          </p>

          <div className="admin-control">
            <label htmlFor="count-input">
              Antal beslut att generera:
              <button
                type="button"
                className="info-button"
                title="Hur många nya beslut som ska skapas och sparas i Supabase."
              >
                <InfoIcon />
              </button>
            </label>
            <input
              id="count-input"
              type="number"
              min="1"
              max="1000"
              value={generatedCount}
              onChange={(e) => setGeneratedCount(Math.max(1, parseInt(e.target.value) || 10))}
              disabled={isGenerating}
              className="admin-input"
            />
          </div>

          <div className="admin-control">
            <label>
              Välj ämnen (taggar) att utgå från:
              <button
                type="button"
                className="info-button"
                title="Du kan välja ämnen som styr vilka typer av beslut som genereras. Om du inte väljer något används alla ämnen."
              >
                <InfoIcon />
              </button>
            </label>
            <div className="topic-chip-row admin-topic-row">
              {Object.entries(topicMap).map(([topic, { label, color }]) => (
                <button
                  key={topic}
                  type="button"
                  className={`topic-chip-button ${selectedTopics.has(topic as Topic) ? 'selected' : ''}`}
                  style={{ borderColor: selectedTopics.has(topic as Topic) ? color : 'transparent' }}
                  onClick={() => {
                    const next = new Set(selectedTopics);
                    if (next.has(topic as Topic)) {
                      next.delete(topic as Topic);
                    } else {
                      next.add(topic as Topic);
                    }
                    setSelectedTopics(next);
                  }}
                >
                  <span className="topic-chip-dot" style={{ backgroundColor: color }} />
                  {label}
                </button>
              ))}
            </div>
            <p className="admin-hint">Om du inte väljer något ämne används alla ämnen.</p>
          </div>

          {isGenerating && (
            <div className="progress-container">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${Math.round((progress / totalDecisions) * 100)}%` }}
                />
              </div>
              <p className="progress-text">
                Genererar: {progress} / {totalDecisions}
              </p>
            </div>
          )}

          <div className="admin-buttons">
            <button onClick={handleGenerateDecisions} disabled={isGenerating} className="btn-generate">
              <PlayIcon className="button-icon" />
              {isGenerating ? 'Genererar...' : 'Generera beslut'}
            </button>
            <button onClick={handleCheckDatabase} disabled={isGenerating} className="btn-secondary">
              <DatabaseIcon className="button-icon" />
              Kontrollera databas
            </button>
          </div>

          {message && <div className="admin-message success">{message}</div>}
          {error && <div className="admin-message error">{error}</div>}
        </section>

        <section className="admin-section">
          <h2>
            <InfoIcon className="section-icon" />
            Instruktioner
          </h2>
          <ul className="admin-instructions">
            <li>
              <strong>Första gången:</strong> Generera 50-100 beslut för att fylla databasen med innehåll.
            </li>
            <li>
              <strong>Generering tar tid:</strong> Många beslut (500+) kan ta flera minuter.
            </li>
            <li>
              <strong>Autentisering:</strong> Se till att din Supabase API-nyckel är korrekt i .env.local.
            </li>
            <li>
              <strong>Databasschemat:</strong> Du måste skapa tabellen 'decisions' i Supabase först.
            </li>
            <li>
              <strong>Framtid:</strong> Du kan köra detta igen för att lägga till fler beslut senare.
            </li>
          </ul>
        </section>

        <section className="admin-section">
          <h2>
            <ClipboardIcon className="section-icon" />
            Databasschemat
          </h2>
          <pre className="code-block">
{`CREATE TABLE decisions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  source TEXT NOT NULL,
  type TEXT NOT NULL,
  department TEXT NOT NULL,
  committee TEXT NOT NULL,
  topics TEXT[] NOT NULL,
  summary TEXT NOT NULL,
  vote_summary JSONB NOT NULL,
  riksdagen_link TEXT,
  government_link TEXT,
  status TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);`}
          </pre>
        </section>
      </div>
    </div>
  );
}
