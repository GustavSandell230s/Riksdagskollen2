import { useTheme } from '../context/ThemeContext';
import { HomeIcon, FeedIcon, SettingsIcon, UserIcon, AdminIcon, MoonIcon, SunIcon } from './Icons';
import type { ReactNode } from 'react';

interface SidebarProps {
  activeNav: 'Home' | 'Flöde' | 'Inställningar' | 'Profil' | 'Admin';
  onSelectNav: (nav: 'Home' | 'Flöde' | 'Inställningar' | 'Profil' | 'Admin') => void;
}

interface NavItem {
  id: 'Home' | 'Flöde' | 'Inställningar' | 'Profil' | 'Admin';
  label: string;
  icon: ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'Home', label: 'Hem', icon: <HomeIcon /> },
  { id: 'Flöde', label: 'Flöde', icon: <FeedIcon /> },
  { id: 'Inställningar', label: 'Inställningar', icon: <SettingsIcon /> },
  { id: 'Profil', label: 'Profil', icon: <UserIcon /> },
  { id: 'Admin', label: 'Admin', icon: <AdminIcon /> },
];

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
            onClick={() => onSelectNav(item.id as 'Home' | 'Flöde' | 'Inställningar' | 'Profil' | 'Admin')}
            title={item.label}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="theme-toggle" onClick={toggleTheme} title={`Byt till ${theme === 'light' ? 'mörkt' : 'ljust'} tema`}>
        <span className="theme-icon">{theme === 'light' ? <MoonIcon /> : <SunIcon />}</span>
        <span className="theme-label">{theme === 'light' ? 'Mörkt' : 'Ljust'}</span>
      </button>

      <div className="sidebar-footer">
        <p className="version-text">v1.0.0</p>
        <p className="footer-text">Riksdagkollen</p>
      </div>
    </aside>
  );
}
