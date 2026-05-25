import { useMemo, useState } from 'react';
import { DecisionCard } from './components/DecisionCard';
import { DecisionDetail } from './components/DecisionDetail';
import { Sidebar } from './components/Sidebar';
import { topicMap } from './data/topics';
import type { Decision, Topic } from './types';

const sampleDecisions: Decision[] = [
  {
    id: '2025/26:129',
    title: 'Förändringar i lagen om verkliga huvudmän',
    date: '2026-05-03',
    source: 'Riksdagen',
    type: 'Proposition',
    department: 'Finansdepartementet',
    committee: 'Finansutskottet',
    topics: ['Ekonomi'],
    summary:
      'Förslaget handlar om nya krav för transparens kring verkliga huvudmän i aktiebolag och fastighetsbolag. Det är tänkt att stärka kampen mot penningtvätt och skattefusk.',
    voteSummary: [
      { party: 'S', yes: 22, no: 12, abstain: 0 },
      { party: 'M', yes: 18, no: 10, abstain: 0 },
      { party: 'V', yes: 5, no: 7, abstain: 0 },
      { party: 'C', yes: 10, no: 6, abstain: 0 },
    ],
    riksdagenLink: 'https://data.riksdagen.se/dokumentlista/?doktyp=prop&rm=2025/26',
    governmentLink: 'https://www.regeringen.se/rattsliga-dokument/proposition/2025/26:129',
    status: 'Riksdagsbeslut',
  },
  {
    id: '2026/27:12',
    title: 'Utvidgat stöd för klimatomställning',
    date: '2026-04-28',
    source: 'Regeringen',
    type: 'Pressmeddelande',
    department: 'Miljödepartementet',
    committee: 'Näringsutskottet',
    topics: ['Miljö', 'Energi'],
    summary:
      'Regeringen föreslår nya stöd till grön omställning i energisektorn och understryker att beslutet ska bidra till minskade utsläpp.',
    voteSummary: [
      { party: 'S', yes: 25, no: 8, abstain: 0 },
      { party: 'M', yes: 14, no: 16, abstain: 0 },
      { party: 'SD', yes: 8, no: 18, abstain: 0 },
      { party: 'MP', yes: 9, no: 3, abstain: 0 },
    ],
    riksdagenLink: 'https://data.riksdagen.se/dokumentlista/?doktyp=pm&rm=2026/27',
    governmentLink: 'https://www.regeringen.se/pressmeddelanden/2026/04/klimatpolitik-ny-lag/',
    status: 'Regeringsförslag',
  },
];

function App() {
  const [selectedId, setSelectedId] = useState(sampleDecisions[0].id);
  const [activeTopic, setActiveTopic] = useState<'Alla' | Topic>('Alla');
  const [activeNav, setActiveNav] = useState<'Home' | 'Flöde' | 'Inställningar' | 'Profil'>('Home');

  const filteredDecisions = useMemo(() => {
    if (activeTopic === 'Alla') {
      return sampleDecisions;
    }
    return sampleDecisions.filter((decision) => decision.topics.includes(activeTopic));
  }, [activeTopic]);

  const selectedDecision = useMemo(
    () => filteredDecisions.find((decision) => decision.id === selectedId) ?? filteredDecisions[0] ?? sampleDecisions[0],
    [filteredDecisions, selectedId],
  );

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Politik</p>
          <h1>Beslut för dig</h1>
          <p className="hero-text">
            Hitta korta, neutrala sammanfattningar av riksdagens och regeringens beslut.
          </p>
        </div>
      </header>

      <main className="layout-grid">
        <Sidebar
          topicMap={topicMap}
          activeTopic={activeTopic}
          onSelectTopic={setActiveTopic}
          activeNav={activeNav}
          onSelectNav={setActiveNav}
          totalDecisions={filteredDecisions.length}
        />

        <section className="card-list">
          <div className="section-header">
            <h2>Dagens beslut</h2>
            <p>Översikt av aktuella ärenden med ämnesmarkörer och partisympati.</p>
          </div>
          <div className="cards">
            {filteredDecisions.map((decision) => (
              <DecisionCard
                key={decision.id}
                decision={decision}
                topicMap={topicMap}
                selected={decision.id === selectedId}
                onSelect={() => setSelectedId(decision.id)}
              />
            ))}
          </div>
          {filteredDecisions.length === 0 ? (
            <p className="empty-state">Inga beslut matchar det valda ämnet ännu.</p>
          ) : null}
        </section>

        <section className="detail-panel">
          {filteredDecisions.length > 0 ? (
            <DecisionDetail decision={selectedDecision} topicMap={topicMap} />
          ) : (
            <div className="detail-empty">
              <h3>Inga beslut att visa</h3>
              <p>Välj ett annat ämne i sidofältet för att se relevanta beslut och sammanfattningar.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
