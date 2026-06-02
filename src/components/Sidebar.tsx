import { HomeIcon, FeedIcon, SettingsIcon, UserIcon, AdminIcon } from './Icons';
import type { ReactNode } from 'react';
import { useState } from 'react';

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
  const [open, setOpen] = useState(false);

  function handleSelect(nav: SidebarProps['activeNav']) {
    onSelectNav(nav);
    if (typeof window !== 'undefined' && window.innerWidth <= 768) setOpen(false);
  }

  return (
    <>
      <button
        className="sidebar-toggle"
        aria-label={open ? 'Stäng meny' : 'Öppna meny'}
        onClick={() => setOpen((s) => !s)}
      >
        ☰
      </button>

      {open && <div className="sidebar-backdrop" onClick={() => setOpen(false)} />}

      <aside className={`sidebar-shell ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h2>Riksdagkollen</h2>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-button ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => handleSelect(item.id as SidebarProps['activeNav'])}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p className="version-text">v1.0.0</p>
          <p className="footer-text">Riksdagkollen</p>
        </div>
      </aside>
    </>
  );
}
