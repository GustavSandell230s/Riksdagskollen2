import { useState, useMemo } from 'react';
import { Decision, Topic } from '../types';
import { DecisionCard } from '../components/DecisionCard';
import { topicMap } from '../data/topics';
import '../styles/pages.css';

interface FeedProps {
  decisions: Decision[];
  onViewDecision: (decision: Decision) => void;
}

export function Feed({ decisions, onViewDecision }: FeedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<Set<Topic>>(new Set());
  const [selectedSource, setSelectedSource] = useState<'All' | 'Riksdagen' | 'Regeringen'>('All');
  const [sortBy, setSortBy] = useState<'date' | 'relevance'>('date');

  const filteredDecisions = useMemo(() => {
    return decisions
      .filter((decision) => {
        const matchesSearch =
          decision.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          decision.summary.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTopics =
          selectedTopics.size === 0 || decision.topics.some((topic) => selectedTopics.has(topic));

        const matchesSource = selectedSource === 'All' || decision.source === selectedSource;

        return matchesSearch && matchesTopics && matchesSource;
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return a.title.localeCompare(b.title);
      });
  }, [decisions, searchQuery, selectedTopics, selectedSource, sortBy]);

  const toggleTopic = (topic: Topic) => {
    const newTopics = new Set(selectedTopics);
    if (newTopics.has(topic)) {
      newTopics.delete(topic);
    } else {
      newTopics.add(topic);
    }
    setSelectedTopics(newTopics);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Flöde</h1>
        <p>Utforska och filtrera alla politiska beslut</p>
      </div>

      <div className="feed-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Sök bland ärenden..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-group">
          <div className="filter-section">
            <label className="filter-label">Källa</label>
            <div className="filter-options">
              <button
                className={`filter-button ${selectedSource === 'All' ? 'active' : ''}`}
                onClick={() => setSelectedSource('All')}
              >
                Alla
              </button>
              <button
                className={`filter-button ${selectedSource === 'Riksdagen' ? 'active' : ''}`}
                onClick={() => setSelectedSource('Riksdagen')}
              >
                Riksdagen
              </button>
              <button
                className={`filter-button ${selectedSource === 'Regeringen' ? 'active' : ''}`}
                onClick={() => setSelectedSource('Regeringen')}
              >
                Regeringen
              </button>
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-label">Sortering</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'date' | 'relevance')} className="sort-select">
              <option value="date">Senast</option>
              <option value="relevance">A-Ö</option>
            </select>
          </div>
        </div>
      </div>

      <div className="feed-layout">
        <aside className="feed-sidebar">
          <div className="sidebar-section">
            <h3>Kategorier</h3>
            <div className="topic-filter-list">
              {Object.entries(topicMap).map(([topic, { label, color }]) => (
                <label key={topic} className="topic-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedTopics.has(topic as Topic)}
                    onChange={() => toggleTopic(topic as Topic)}
                  />
                  <span className="checkbox-label">
                    <span className="checkbox-color" style={{ backgroundColor: color }} />
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <button
              className="clear-filters-button"
              onClick={() => {
                setSelectedTopics(new Set());
                setSelectedSource('All');
                setSearchQuery('');
              }}
            >
              Rensa filter
            </button>
          </div>
        </aside>

        <main className="feed-main">
          <div className="results-header">
            <p className="results-count">
              {filteredDecisions.length} resultat
              {searchQuery && ` för "${searchQuery}"`}
            </p>
          </div>

          <div className="cards">
            {filteredDecisions.length > 0 ? (
              filteredDecisions.map((decision) => (
                <DecisionCard
                  key={decision.id}
                  decision={decision}
                  topicMap={topicMap}
                  onClick={() => onViewDecision(decision)}
                />
              ))
            ) : (
              <div className="no-results">
                <p>Inga resultat hittades. Prova att ändra dina filter.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
