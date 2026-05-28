import { useEffect, useState } from 'react';
import { generateSummary } from '../services/openai';
import { ClockIcon } from './Icons';
import type { Decision, Topic } from '../types';
import { getPartyInfo } from '../data/parties';

interface DecisionDetailProps {
  decision: Decision;
  topicMap: Record<Topic, { label: string; color: string }>;
}

export function DecisionDetail({ decision, topicMap }: DecisionDetailProps) {
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const yesVotes = decision.voteSummary.reduce((sum, party) => sum + party.yes, 0);
  const noVotes = decision.voteSummary.reduce((sum, party) => sum + party.no, 0);
  const abstainVotes = decision.voteSummary.reduce((sum, party) => sum + party.abstain, 0);
  const majorityVotes = yesVotes + noVotes || 1;
  const yesRatio = Math.round((yesVotes / majorityVotes) * 100);
  const noRatio = Math.round((noVotes / majorityVotes) * 100);
  const totalVotes = yesVotes + noVotes + abstainVotes;

  useEffect(() => {
    let active = true;
    setSummaryLoading(true);
    setSummaryError(null);
    
    generateSummary(decision.summary)
      .then((value) => {
        if (active) {
          setAiSummary(value);
          setSummaryLoading(false);
        }
      })
      .catch((error) => {
        if (active) {
          setSummaryError('Kunde inte generera sammanfattning');
          setSummaryLoading(false);
          console.error('Summary generation error:', error);
        }
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
        <div className="vote-overview">
          <div className="vote-stats-row">
            <div className="vote-stat-card yes">
              <span className="vote-stat-label">Ja</span>
              <strong>{yesVotes}</strong>
              <span>{yesRatio}% av aktiva röster</span>
            </div>
            <div className="vote-stat-card no">
              <span className="vote-stat-label">Nej</span>
              <strong>{noVotes}</strong>
              <span>{noRatio}% av aktiva röster</span>
            </div>
            <div className="vote-stat-card abstain">
              <span className="vote-stat-label">Avstod</span>
              <strong>{abstainVotes}</strong>
              <span>{totalVotes} röster totalt</span>
            </div>
          </div>

          <div className="vote-stack-bar">
            {decision.voteSummary.map((party) => {
              const info = getPartyInfo(party.party);
              const width = party.yes > 0 ? (party.yes / Math.max(yesVotes, 1)) * 100 : 0;
              return party.yes > 0 ? (
                <div
                  key={`${party.party}-yes`}
                  className="vote-stack-segment"
                  style={{ width: `${width}%`, backgroundColor: info.color }}
                  title={`${party.party}: ${party.yes} ja-röster`}
                />
              ) : null;
            })}
          </div>
          <div className="vote-stack-labels">
            <span>Ja-röster per parti</span>
            <span>{yesVotes} aktiva ja-röster</span>
          </div>
        </div>

        <div className="party-grid">
          {decision.voteSummary.map((party) => {
            const info = getPartyInfo(party.party);
            return (
              <div key={party.party} className="party-card">
                <div className="party-header">
                  <span className="party-icon" style={{ backgroundColor: info.color }}>
                    {info.abbreviation}
                  </span>
                  <div>
                    <span className="party-name">{party.party}</span>
                    <span className="party-subtitle">{info.label}</span>
                  </div>
                </div>
                <div className="party-stats">
                  <div>
                    <span className="party-stat-label">Ja</span>
                    <strong>{party.yes}</strong>
                  </div>
                  <div>
                    <span className="party-stat-label">Nej</span>
                    <strong>{party.no}</strong>
                  </div>
                  <div>
                    <span className="party-stat-label">Avstod</span>
                    <strong>{party.abstain}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section-block">
        <h3>AI-sammanfattning</h3>
        {summaryLoading ? (
          <p className="loading-text"><ClockIcon className="loading-icon" /> Genererar AI-sammanfattning...</p>
        ) : summaryError ? (
          <p className="error-text">{summaryError}</p>
        ) : (
          <p>{aiSummary}</p>
        )}
      </section>

      <section className="section-block">
        <h3>Vad det kan betyda för dig</h3>
        <p>
          Appen förklarar beslutet med fokus på vardagliga konsekvenser, till exempel hur det kan påverka
          jobb, skola eller klimatet. Länk till originaltexten finns längst ner.
        </p>
      </section>

      <section className="section-block source-links">
        {decision.riksdagenLink && (
          <a href={decision.riksdagenLink} target="_blank" rel="noreferrer">
            Läs ursprunglig text i Riksdagen
          </a>
        )}
        {decision.governmentLink && (
          <a href={decision.governmentLink} target="_blank" rel="noreferrer">
            Läs pressmeddelande / proposition
          </a>
        )}
        {!decision.riksdagenLink && !decision.governmentLink && (
          <p className="no-source-text">Ingen originalkälla finns tillgänglig för detta beslut.</p>
        )}
      </section>
    </article>
  );
}
