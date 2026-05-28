import type { Decision, Topic } from '../types';
import { InfoIcon } from './Icons';

interface DecisionCardProps {
  decision: Decision;
  topicMap: Record<Topic, { label: string; color: string }>;
  selected?: boolean;
  onSelect: () => void;
}

export function DecisionCard({ decision, topicMap, selected, onSelect }: DecisionCardProps) {
  const yesVotes = decision.voteSummary.reduce((sum, party) => sum + party.yes, 0);
  const noVotes = decision.voteSummary.reduce((sum, party) => sum + party.no, 0);
  const total = yesVotes + noVotes || 1;
  const yesRatio = Math.round((yesVotes / total) * 100);
  const summaryPreview = decision.summary.length > 140 ? `${decision.summary.slice(0, 140).trim()}...` : decision.summary;
  const formattedDate = new Date(decision.date).toLocaleDateString('sv-SE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <button className={`decision-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
      <div className="card-header">
        <div className="card-badges">
          <span className="card-type">{decision.source}</span>
          <button
            type="button"
            className="card-status"
            title={
              decision.type === 'Riksdagsbeslut'
                ? 'Beslut fattade av riksdagen i en votering eller omröstning.'
                : 'Propositioner är förslag från regeringen som riksdagen sedan tar ställning till.'
            }
          >
            {decision.type}
            <InfoIcon className="badge-info-icon" />
          </button>
        </div>
        <span className="card-date">{formattedDate}</span>
      </div>

      <h3 className="card-title">{decision.title}</h3>
      <p className="card-summary">{summaryPreview}</p>

      <div className="topic-row">
        {decision.topics.map((topic) => (
          <span key={topic} className="chip" style={{ background: topicMap[topic].color }}>
            {topicMap[topic].label}
          </span>
        ))}
      </div>

      <div className="card-footer">
        <div className="vote-bar">
          <div className="vote-yes" style={{ width: `${yesRatio}%` }} />
          <div className="vote-no" style={{ width: `${100 - yesRatio}%` }} />
        </div>
        <div className="vote-labels">
          <span>Ja {yesVotes}</span>
          <span>Nej {noVotes}</span>
        </div>
      </div>
    </button>
  );
}
