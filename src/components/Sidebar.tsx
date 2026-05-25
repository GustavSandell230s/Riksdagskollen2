import type { Topic } from '../types';
import { ApiKeyInput } from './ApiKeyInput';

interface SidebarProps {
  topicMap: Record<Topic, { label: string; color: string }>;
  activeTopic: Topic | 'Alla';
  onSelectTopic: (topic: Topic | 'Alla') => void;
  activeNav: 'Home' | 'Flöde' | 'Inställningar' | 'Profil';
  onSelectNav: (nav: 'Home' | 'Flöde' | 'Inställningar' | 'Profil') => void;
  totalDecisions: number;
}

export function Sidebar({ topicMap, activeTopic, onSelectTopic, activeNav, onSelectNav, totalDecisions }: SidebarProps) {
  return (
    <aside className="sidebar-shell">
      <div className="sidebar-card sidebar-menu">
        <nav className="nav-list">
          <button className={activeNav === 'Home' ? 'nav-item active' : 'nav-item'} onClick={() => onSelectNav('Home')}>
            Home
          </button>
          <button className={activeNav === 'Flöde' ? 'nav-item active' : 'nav-item'} onClick={() => onSelectNav('Flöde')}>
            Flöde
          </button>
          <button className={activeNav === 'Inställningar' ? 'nav-item active' : 'nav-item'} onClick={() => onSelectNav('Inställningar')}>
            Inställningar
          </button>
          <button className={activeNav === 'Profil' ? 'nav-item active' : 'nav-item'} onClick={() => onSelectNav('Profil')}>
            Profil
          </button>
        </nav>
      </div>

      <div className="sidebar-card sidebar-intro">
        <p className="eyebrow">Navigering</p>
        <h2>Utforska politiska beslut</h2>
        <p>
          Filtrera, jämför och förstå hur riksdagen och regeringen påverkar vardagen.
          Här finns också snabbt stöd för att koppla in AI-sammanfattningar senare.
        </p>
      </div>

      <div className="sidebar-card sidebar-section">
        <div className="sidebar-heading">
          <h3>Kategorier</h3>
          <span>{totalDecisions} ärenden</span>
        </div>
        <div className="topic-list">
          <button
            className={activeTopic === 'Alla' ? 'topic-button active' : 'topic-button'}
            onClick={() => onSelectTopic('Alla')}
          >
            Alla
          </button>
          {Object.keys(topicMap).map((topic) => (
            <button
              key={topic}
              className={activeTopic === topic ? 'topic-button active' : 'topic-button'}
              onClick={() => onSelectTopic(topic as Topic)}
            >
              {topicMap[topic as Topic].label}
            </button>
          ))}
        </div>
      </div>

      <ApiKeyInput />

      <div className="sidebar-card sidebar-section">
        <h3>Datakällor</h3>
        <ul className="source-list">
          <li>Riksdagens öppna API för dokument och voteringar</li>
          <li>Regeringen via g0v / öppna JSON-endpoints</li>
          <li>Officiella dokumenttyper, departement och utskott</li>
        </ul>
      </div>

      <div className="sidebar-card sidebar-section">
        <h3>Vad händer här?</h3>
        <p>
          Se neutral AI-sammanfattning av beslut, partiernas röster och förklaringar av
          vad det betyder för dig. Alltid med länk till originalkällan.
        </p>
      </div>

      <div className="sidebar-card profile-card">
        <p className="eyebrow">Profil</p>
        <strong>Ung politik</strong>
        <p className="profile-text">Användarinställningar och kontoöversikt kommer här.</p>
      </div>
    </aside>
  );
}
