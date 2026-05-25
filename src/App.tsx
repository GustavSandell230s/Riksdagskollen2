import { useState } from 'react';
import { DecisionCard } from './components/DecisionCard';
import { DecisionDetail } from './components/DecisionDetail';
import { Sidebar } from './components/Sidebar';
import { Home } from './pages/Home';
import { Feed } from './pages/Feed';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { topicMap } from './data/topics';
import type { Decision } from './types';

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
  const [activeNav, setActiveNav] = useState<'Home' | 'Flöde' | 'Inställningar' | 'Profil'>('Home');
  const [apiKey, setApiKey] = useState<string | null>(import.meta.env.VITE_OPENAI_API_KEY || null);
  const [selectedDecisionDetail, setSelectedDecisionDetail] = useState<Decision | null>(null);

  const renderPage = () => {
    switch (activeNav) {
      case 'Home':
        return <Home decisions={sampleDecisions} onViewDecision={setSelectedDecisionDetail} />;
      case 'Flöde':
        return <Feed decisions={sampleDecisions} onViewDecision={setSelectedDecisionDetail} />;
      case 'Inställningar':
        return <Settings apiKey={apiKey} onApiKeyChange={setApiKey} />;
      case 'Profil':
        return <Profile decisions={sampleDecisions} />;
      default:
        return <Home decisions={sampleDecisions} onViewDecision={setSelectedDecisionDetail} />;
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
      </header>

      <main className="main-layout">
        <Sidebar activeNav={activeNav} onSelectNav={setActiveNav} />

        <div className="page-wrapper">
          {selectedDecisionDetail ? (
            <div className="detail-view">
              <button className="back-button" onClick={() => setSelectedDecisionDetail(null)}>
                ← Tillbaka
              </button>
              <DecisionDetail decision={selectedDecisionDetail} topicMap={topicMap} />
            </div>
          ) : (
            renderPage()
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
