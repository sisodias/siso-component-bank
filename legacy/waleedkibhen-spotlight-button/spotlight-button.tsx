import React, { useState } from 'react';
import { Home, Bookmark, PlusCircle, User, Settings } from 'lucide-react';

interface NavItemProps {
  icon: React.ElementType;
  isActive?: boolean;
  onClick?: () => void;
  indicatorPosition: number;
  position: number;
}

const NavItem: React.FC<NavItemProps> = ({ 
  icon: Icon, 
  isActive = false, 
  onClick,
  indicatorPosition,
  position
}) => {
  const distance = Math.abs(indicatorPosition - position);
  const spotlightOpacity = isActive ? 1 : Math.max(0, 1 - distance * 0.6);

  return (
    <button
      className="relative flex items-center justify-center w-12 h-12 mx-2 transition-all duration-400"
      onClick={onClick}
    >
      <div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-24 bg-gradient-to-b from-white/40 to-transparent blur-lg rounded-full transition-opacity duration-400"
        style={{
          opacity: spotlightOpacity,
          transitionDelay: isActive ? '0.1s' : '0s',
        }}
      />
      <Icon
        className={`w-6 h-6 transition-colors duration-200 ${
          isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
        }`}
        strokeWidth={isActive ? 2.5 : 2}
      />
    </button>
  );
};

export const Component = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const navItems = [
    { icon: Home, label: 'Home' },
    { icon: Bookmark, label: 'Bookmarks' },
    { icon: PlusCircle, label: 'Add' },
    { icon: User, label: 'Profile' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="container">
      <nav className="relative flex items-center px-2 py-3 bg-black/90 backdrop-blur-sm rounded-md shadow-lg border border-white/10">
        <div 
          className="absolute top-0 h-[2px] bg-white transition-all duration-400 ease-in-out"
          style={{
            left: `${activeIndex * 64 + 16}px`,
            width: '48px',
            transform: 'translateY(-1px)',
          }}
        />
        {navItems.map((item, index) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            isActive={activeIndex === index}
            onClick={() => setActiveIndex(index)}
            indicatorPosition={activeIndex}
            position={index}
          />
        ))}
      </nav>
      <style>{`
        html, body, :root {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .container {
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgb(243 244 246);
        }
      `}</style>
    </div>
  );
};