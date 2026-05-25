import { Decision } from '../types';
import { topicMap } from '../data/topics';
import '../styles/pages.css';

interface HomeProps {
  decisions: Decision[];
  onViewDecision: (decision: Decision) => void;
}

export function Home({ decisions, onViewDecision }: HomeProps) {
  const recentDecisions = decisions.slice(0, 5);
  const topicStats = decisions.reduce(
    (acc, decision) => {
      decision.topics.forEach((topic) => {
        acc[topic] = (acc[topic] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>
  );

  const sourceStats = {
    riksdagen: decisions.filter((d) => d.source === 'Riksdagen').length,
    regeringen: decisions.filter((d) => d.source === 'Regeringen').length,
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Välkommen till Riksdagkollen</h1>
        <p>Håll dig uppdaterad om riksdagen och regeringens beslut</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{decisions.length}</div>
          <div className="stat-label">Totala ärenden</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{sourceStats.riksdagen}</div>
          <div className="stat-label">Från Riksdagen</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{sourceStats.regeringen}</div>
          <div className="stat-label">Från Regeringen</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{Object.keys(topicStats).length}</div>
          <div className="stat-label">Kategorier</div>
        </div>
      </div>

      <section className="page-section">
        <div className="section-title">
          <h2>Senaste besluten</h2>
          <p>De fem senaste politiska åtgärderna</p>
        </div>

        <div className="recent-list">
          {recentDecisions.map((decision) => (
            <div key={decision.id} className="decision-item">
              <div className="decision-header">
                <div>
                  <h3>{decision.title}</h3>
                  <p className="decision-meta">
                    {decision.source} • {new Date(decision.date).toLocaleDateString('sv-SE')} • {decision.type}
                  </p>
                </div>
                <div className="decision-topics">
                  {decision.topics.map((topic) => (
                    <span
                      key={topic}
                      className="topic-badge"
                      style={{ backgroundColor: topicMap[topic].color }}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              <p className="decision-summary">{decision.summary}</p>
              <button className="view-button" onClick={() => onViewDecision(decision)}>
                Läs mer →
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-title">
          <h2>Ämnen</h2>
          <p>Fördelning av ärenden per kategori</p>
        </div>

        <div className="topics-grid">
          {Object.entries(topicMap).map(([topic, { color, label }]) => (
            <div key={topic} className="topic-card">
              <div className="topic-color-indicator" style={{ backgroundColor: color }} />
              <div className="topic-card-content">
                <h3>{label}</h3>
                <div className="topic-count">{topicStats[topic] || 0} ärenden</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
