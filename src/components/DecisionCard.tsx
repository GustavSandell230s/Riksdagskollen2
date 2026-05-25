import type { Decision, Topic } from '../types';

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

  return (
    <button className={`decision-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
      <div className="card-meta">
        <span className="card-type">{decision.source}</span>
        <span>{decision.date}</span>
      </div>
      <h3>{decision.title}</h3>
      <div className="topic-row">
        {decision.topics.map((topic) => (
          <span key={topic} className="chip" style={{ background: topicMap[topic].color }}>
            {topicMap[topic].label}
          </span>
        ))}
      </div>
      <div className="vote-bar">
        <div className="vote-yes" style={{ width: `${yesRatio}%` }} />
        <div className="vote-no" style={{ width: `${100 - yesRatio}%` }} />
      </div>
      <div className="vote-labels">
        <span>Ja {yesVotes}</span>
        <span>Nej {noVotes}</span>
      </div>
    </button>
  );
}
