import { useEffect, useState } from 'react';
import { generateSummary } from '../services/openai';
import type { Decision, Topic } from '../types';

interface DecisionDetailProps {
  decision: Decision;
  topicMap: Record<Topic, { label: string; color: string }>;
}

export function DecisionDetail({ decision, topicMap }: DecisionDetailProps) {
  const [aiSummary, setAiSummary] = useState('Läser in AI-sammanfattning...');
  const yesVotes = decision.voteSummary.reduce((sum, party) => sum + party.yes, 0);
  const noVotes = decision.voteSummary.reduce((sum, party) => sum + party.no, 0);
  const abstainVotes = decision.voteSummary.reduce((sum, party) => sum + party.abstain, 0);

  useEffect(() => {
    let active = true;
    generateSummary(decision.summary).then((value) => {
      if (active) setAiSummary(value);
    });
    return () => {
      active = false;
    };
  }, [decision.summary]);

  return (
    <article className="detail-card">
      <div className="detail-header">
        <div>
          <span className="status-pill">{decision.status}</span>
          <h2>{decision.title}</h2>
          <p className="detail-subtitle">
            {decision.type} · {decision.department} · {decision.committee}
          </p>
        </div>
      </div>

      <div className="tags-row">
        {decision.topics.map((topic) => (
          <span key={topic} className="chip" style={{ background: topicMap[topic].color }}>
            {topicMap[topic].label}
          </span>
        ))}
      </div>

      <section className="section-block">
        <h3>Regeringens motiv</h3>
        <p>{decision.summary}</p>
      </section>

      <section className="section-block">
        <h3>Oppositionens synpunkter</h3>
        <p>
          Oppositionen kan ha reservationer eller kritik, ofta om kostnad, effekt eller rättvisa.
          Den här appen visar att det finns olika perspektiv när riksdagen röstar.
        </p>
      </section>

      <section className="section-block vote-summary">
        <h3>Röstfördelning</h3>
        <div className="party-grid">
          {decision.voteSummary.map((party) => (
            <div key={party.party} className="party-card">
              <span className="party-name">{party.party}</span>
              <span>Ja: {party.yes}</span>
              <span>Nej: {party.no}</span>
              <span>Avstod: {party.abstain}</span>
            </div>
          ))}
        </div>
        <div className="summary-bar">
          <div className="summary-yes" style={{ width: `${Math.round((yesVotes / (yesVotes + noVotes || 1)) * 100)}%` }}>
            {yesVotes}
          </div>
          <div className="summary-no" style={{ width: `${Math.round((noVotes / (yesVotes + noVotes || 1)) * 100)}%` }}>
            {noVotes}
          </div>
        </div>
      </section>

      <section className="section-block">
        <h3>AI-sammanfattning</h3>
        <p>{aiSummary}</p>
      </section>

      <section className="section-block">
        <h3>Vad det kan betyda för dig</h3>
        <p>
          Appen förklarar beslutet med fokus på vardagliga konsekvenser, till exempel hur det kan påverka
          jobb, skola eller klimatet. Länk till originaltexten finns längst ner.
        </p>
      </section>

      <section className="section-block source-links">
        <a href={decision.riksdagenLink} target="_blank" rel="noreferrer">
          Läs ursprunglig text i Riksdagen
        </a>
        <a href={decision.governmentLink} target="_blank" rel="noreferrer">
          Läs pressmeddelande / proposition
        </a>
      </section>
    </article>
  );
}
