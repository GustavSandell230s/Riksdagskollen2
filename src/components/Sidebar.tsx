import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  activeNav: 'Home' | 'Flöde' | 'Inställningar' | 'Profil';
  onSelectNav: (nav: 'Home' | 'Flöde' | 'Inställningar' | 'Profil') => void;
}

const NAV_ITEMS = [
  { id: 'Home', label: 'Hem', icon: '🏠' },
  { id: 'Flöde', label: 'Flöde', icon: '📰' },
  { id: 'Inställningar', label: 'Inställningar', icon: '⚙️' },
  { id: 'Profil', label: 'Profil', icon: '👤' },
] as const;

export function Sidebar({ activeNav, onSelectNav }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="sidebar-shell">
      <div className="sidebar-logo">
        <div className="logo-icon">RK</div>
        <h2>Riksdagkollen</h2>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-button ${activeNav === item.id ? 'active' : ''}`}
            onClick={() => onSelectNav(item.id as 'Home' | 'Flöde' | 'Inställningar' | 'Profil')}
            title={item.label}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="theme-toggle" onClick={toggleTheme} title={`Byt till ${theme === 'light' ? 'mörkt' : 'ljust'} tema`}>
        <span className="theme-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
        <span className="theme-label">{theme === 'light' ? 'Mörkt' : 'Ljust'}</span>
      </button>

      <div className="sidebar-footer">
        <p className="version-text">v1.0.0</p>
        <p className="footer-text">Riksdagkollen</p>
      </div>
    </aside>
  );
}
