import React, { useState } from 'react';
import './duolingonavbar-utils/DuolingoNavbar.css';

interface NavbarProps {
  streakCount?: number;
  gems?: number;
  hearts?: number;
  userName?: string;
  userAvatar?: string;
  onLogoClick?: () => void;
  onProfileClick?: () => void;
  onMenuItemClick?: (item: string) => void;
}

const DuolingoNavbar: React.FC<NavbarProps> = ({
  streakCount = 0,
  gems = 0,
  hearts = 0,
  userName = 'User',
  userAvatar = '👤',
  onLogoClick,
  onProfileClick,
  onMenuItemClick,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <button className="logo" onClick={onLogoClick} aria-label="Home">
          🦉
        </button>

        {/* Navigation Menu */}
        <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
          {['Learn', 'Discuss', 'Shop'].map((item) => (
            <button
              key={item}
              className="nav-link"
              onClick={() => {
                onMenuItemClick?.(item);
                setIsMenuOpen(false);
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Right Section */}
        <div className="navbar-right">
          {/* Stats */}
          <div className="stats">
            {streakCount > 0 && <span className="stat">🔥 {streakCount}</span>}
            {gems > 0 && <span className="stat">💎 {gems}</span>}
            {hearts > 0 && <span className="stat">❤️ {hearts}</span>}
          </div>

          {/* Profile */}
          <button className="profile" onClick={onProfileClick} aria-label="Profile">
            <span>{userAvatar}</span>
          </button>

          {/* Mobile Menu */}
          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DuolingoNavbar;
