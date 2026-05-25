import { useState } from 'react';
import { Decision } from '../types';
import { topicMap } from '../data/topics';
import '../styles/pages.css';

interface ProfileProps {
  decisions: Decision[];
}

export function Profile({ decisions }: ProfileProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const favoriteDecisions = decisions.filter((d) => favorites.has(d.id));

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Min Profil</h1>
        <p>Dina sparade ärenden och aktivitet</p>
      </div>

      <div className="profile-grid">
        <section className="profile-card">
          <div className="profile-header-section">
            <div className="avatar">RN</div>
            <div>
              <h2>Användare</h2>
              <p>Aktiv på Riksdagkollen</p>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{decisions.length}</span>
              <span className="stat-name">Ärenden lästa</span>
            </div>
            <div className="stat">
              <span className="stat-value">{favorites.size}</span>
              <span className="stat-name">Sparade</span>
            </div>
          </div>
        </section>

        <section className="profile-card">
          <h3>Snabbdata</h3>
          <ul className="quick-stats">
            <li>
              <span className="label">Mest läst kategori:</span>
              <span className="value">Ekonomi</span>
            </li>
            <li>
              <span className="label">Senaste besök:</span>
              <span className="value">I dag</span>
            </li>
            <li>
              <span className="label">Medlemskap:</span>
              <span className="value">Gratis</span>
            </li>
          </ul>
        </section>
      </div>

      <section className="favorites-section">
        <div className="section-title">
          <h2>Sparade ärenden ({favorites.size})</h2>
          <p>Dina favoritbeslut och sparade objekt</p>
        </div>

        {favoriteDecisions.length > 0 ? (
          <div className="favorites-grid">
            {favoriteDecisions.map((decision) => (
              <div key={decision.id} className="favorite-card">
                <div className="favorite-header">
                  <h4>{decision.title}</h4>
                  <button
                    className="favorite-button active"
                    onClick={() => toggleFavorite(decision.id)}
                    title="Ta bort från favoriter"
                  >
                    ★
                  </button>
                </div>
                <p className="favorite-meta">
                  {decision.source} • {new Date(decision.date).toLocaleDateString('sv-SE')}
                </p>
                <div className="favorite-topics">
                  {decision.topics.map((topic) => (
                    <span
                      key={topic}
                      className="topic-badge-small"
                      style={{ backgroundColor: topicMap[topic].color }}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>Du har inte sparat några ärenden än.</p>
            <p>Klicka på stjärnan på ett ärende för att spara det här.</p>
          </div>
        )}
      </section>

      <section className="recommendations-section">
        <div className="section-title">
          <h2>Rekommenderade för dig</h2>
          <p>Baserat på dina intressen</p>
        </div>

        <div className="recommendations-grid">
          {decisions.slice(0, 3).map((decision) => (
            <div key={decision.id} className="recommendation-card">
              <div className="rec-topics">
                {decision.topics.map((topic) => (
                  <span
                    key={topic}
                    className="topic-badge-small"
                    style={{ backgroundColor: topicMap[topic].color }}
                  >
                    {topic}
                  </span>
                ))}
              </div>
              <h4>{decision.title}</h4>
              <p>{decision.summary.substring(0, 100)}...</p>
              <div className="rec-footer">
                <button
                  className={`favorite-button ${favorites.has(decision.id) ? 'active' : ''}`}
                  onClick={() => toggleFavorite(decision.id)}
                >
                  {favorites.has(decision.id) ? '★' : '☆'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
