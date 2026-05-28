import { useState, useMemo } from 'react';
import { Decision, Topic } from '../types';
import { DecisionCard } from '../components/DecisionCard';
import { SearchIcon, InfoIcon } from '../components/Icons';
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
  const [selectedType, setSelectedType] = useState<'All' | 'Riksdagsbeslut' | 'Proposition'>('All');
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

        const matchesType = selectedType === 'All' || decision.type === selectedType;

        return matchesSearch && matchesTopics && matchesSource && matchesType;
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

  const todayIso = new Date().toISOString().slice(0, 10);
  const todaysDecisions = decisions.filter((decision) => decision.date === todayIso);

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
          <span className="search-icon"><SearchIcon /></span>
        </div>

        <div className="filter-group">
          <div className="filter-section">
            <label className="filter-label">
              Källa
              <button
                type="button"
                className="info-button"
                title="Filtrera på var beslutet kommer ifrån: riksdagens voteringar eller regeringens propositioner."
              >
                <InfoIcon />
              </button>
            </label>
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
                Riksdagsbeslut
              </button>
              <button
                className={`filter-button ${selectedSource === 'Regeringen' ? 'active' : ''}`}
                onClick={() => setSelectedSource('Regeringen')}
              >
                Propositioner
              </button>
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-label">
              Typ
              <button
                type="button"
                className="info-button"
                title="Välj mellan besluts-typ: riksdagsbeslut eller propositioner."
              >
                <InfoIcon />
              </button>
            </label>
            <div className="filter-options">
              <button
                className={`filter-button ${selectedType === 'All' ? 'active' : ''}`}
                onClick={() => setSelectedType('All')}
              >
                Alla typer
              </button>
              <button
                className={`filter-button ${selectedType === 'Riksdagsbeslut' ? 'active' : ''}`}
                onClick={() => setSelectedType('Riksdagsbeslut')}
              >
                Riksdagsbeslut
              </button>
              <button
                className={`filter-button ${selectedType === 'Proposition' ? 'active' : ''}`}
                onClick={() => setSelectedType('Proposition')}
              >
                Proposition
              </button>
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-label">
              Sortering
              <button
                type="button"
                className="info-button"
                title="Sortera resultat efter senaste datum eller alfabetiskt."
              >
                <InfoIcon />
              </button>
            </label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'date' | 'relevance')} className="sort-select">
              <option value="date">Senast</option>
              <option value="relevance">A-Ö</option>
            </select>
          </div>
        </div>

        <div className="topic-chip-row">
          {Object.entries(topicMap).map(([topic, { label, color }]) => (
            <button
              key={topic}
              type="button"
              className={`topic-chip-button ${selectedTopics.has(topic as Topic) ? 'selected' : ''}`}
              style={{ borderColor: selectedTopics.has(topic as Topic) ? color : 'transparent' }}
              onClick={() => toggleTopic(topic as Topic)}
            >
              <span className="topic-chip-dot" style={{ backgroundColor: color }} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="feed-layout">
        <main className="feed-main">
          <div className="results-header">
            <p className="results-count">
              {filteredDecisions.length} resultat
              {searchQuery && ` för "${searchQuery}"`}
            </p>
          </div>

          <div className="today-highlights">
            <div className="today-highlights-header">
              <span>Dagens beslut</span>
              <strong>{todaysDecisions.length} beslut</strong>
            </div>
            {todaysDecisions.length > 0 ? (
              <ul className="today-decision-list">
                {todaysDecisions.map((decision) => (
                  <li key={decision.id} className="today-decision-item">
                    <button type="button" onClick={() => onViewDecision(decision)}>
                      {decision.title}
                    </button>
                    <span className="today-decision-meta">{decision.source}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="today-empty">Inga beslut publicerade idag.</p>
            )}
          </div>

          <div className="cards">
            {filteredDecisions.length > 0 ? (
              filteredDecisions.map((decision) => (
                <DecisionCard
                  key={decision.id}
                  decision={decision}
                  topicMap={topicMap}
                  onSelect={() => onViewDecision(decision)}
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
