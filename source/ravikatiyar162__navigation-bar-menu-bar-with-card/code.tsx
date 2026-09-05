import React, { useState, useEffect } from 'react';
import { Home, Twitter, Instagram, User, Calendar, ArrowUpRight, Sun, Moon } from 'lucide-react';

const GlassmorphismNav = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'about', icon: User, label: 'About' },
    { id: 'projects', icon: Calendar, label: 'Projects' },
  ];

  const socialLinks = [
    { id: 'twitter', icon: Twitter, label: 'X (Twitter)', href: 'https://x.com' },
    { id: 'instagram', icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/' },
    { id: 'cv', icon: User, label: 'My CV', href: 'https://read.cv/' },
  ];

  const handleTabClick = (e, itemId) => {
    e.preventDefault();
    setActiveTab(itemId);
  };

  const NavButton = ({ item, isActive = false, isTab = false }) => (
    <div className="relative">
      <button
        onClick={isTab ? (e) => handleTabClick(e, item.id) : undefined}
        className={`
          relative flex items-center justify-center w-11 h-11 rounded-2xl
          transition-all duration-300 ease-out group
          backdrop-blur-md border
          ${isActive 
            ? isDarkMode 
              ? 'bg-white/15 border-white/20 shadow-lg shadow-white/10' 
              : 'bg-white/40 border-white/30 shadow-lg shadow-black/10'
            : isDarkMode
              ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              : 'bg-white/20 border-white/20 hover:bg-white/30 hover:border-white/30'
          }
        `}
        onMouseEnter={() => setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        {/* Glass reflection effect */}
        <div 
          className={`
            absolute inset-0 rounded-2xl
            bg-gradient-to-br from-white/20 via-transparent to-transparent
            transition-opacity duration-300
            ${hoveredItem === item.id ? 'opacity-100' : 'opacity-0'}
          `}
        />
        
        {/* Blur background glow */}
        <div 
          className={`
            absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2
            rounded-lg backdrop-blur-sm
            transition-all duration-300 ease-out
            ${hoveredItem === item.id 
              ? isDarkMode
                ? 'opacity-100 scale-125 bg-white/10 blur-sm shadow-lg shadow-white/20'
                : 'opacity-100 scale-125 bg-black/5 blur-sm shadow-lg shadow-black/20'
              : 'opacity-0 scale-100'
            }
          `}
        />
        
        {/* Icon */}
        <div className="relative z-10 flex items-center justify-center">
          <item.icon 
            size={18} 
            className={`
              transition-all duration-300 ease-out
              ${isActive 
                ? isDarkMode ? 'text-white' : 'text-gray-900'
                : isDarkMode 
                  ? 'text-gray-300 group-hover:text-white' 
                  : 'text-gray-600 group-hover:text-gray-900'
              }
            `}
          />
        </div>
      </button>
      
      {/* Floating label */}
      <div 
        className={`
          absolute -bottom-12 left-1/2 -translate-x-1/2 z-50
          px-2.5 py-1.5 rounded-lg backdrop-blur-md
          text-xs font-medium whitespace-nowrap
          transition-all duration-200 ease-out pointer-events-none
          border
          ${isDarkMode
            ? 'bg-gray-900/90 text-white border-white/10'
            : 'bg-white/90 text-gray-900 border-black/10'
          }
          ${hoveredItem === item.id 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-1'
          }
        `}
        style={{ 
          boxShadow: isDarkMode 
            ? '0 4px 20px rgba(0,0,0,0.5)' 
            : '0 4px 20px rgba(0,0,0,0.15)'
        }}
      >
        {item.label}
        {/* Tooltip arrow */}
        <div 
          className={`
            absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-l border-t
            ${isDarkMode 
              ? 'bg-gray-900/90 border-white/10' 
              : 'bg-white/90 border-black/10'
            }
          `} 
        />
      </div>
    </div>
  );

  const ExternalLink = ({ item }) => (
    <div className="relative">
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          relative flex items-center justify-center w-11 h-11 rounded-2xl
          transition-all duration-300 ease-out group
          backdrop-blur-md border
          ${isDarkMode
            ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            : 'bg-white/20 border-white/20 hover:bg-white/30 hover:border-white/30'
          }
        `}
        onMouseEnter={() => setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        {/* Glass reflection effect */}
        <div 
          className={`
            absolute inset-0 rounded-2xl
            bg-gradient-to-br from-white/20 via-transparent to-transparent
            transition-opacity duration-300
            ${hoveredItem === item.id ? 'opacity-100' : 'opacity-0'}
          `}
        />
        
        {/* Icon */}
        <div className="relative z-10 flex items-center justify-center">
          <item.icon 
            size={18} 
            className={`
              transition-all duration-300 ease-out
              ${isDarkMode 
                ? 'text-gray-300 group-hover:text-white' 
                : 'text-gray-600 group-hover:text-gray-900'
              }
            `}
          />
        </div>
      </a>
      
      {/* Floating label */}
      <div 
        className={`
          absolute -bottom-12 left-1/2 -translate-x-1/2 z-50
          px-2.5 py-1.5 rounded-lg backdrop-blur-md
          text-xs font-medium whitespace-nowrap
          transition-all duration-200 ease-out pointer-events-none
          border
          ${isDarkMode
            ? 'bg-gray-900/90 text-white border-white/10'
            : 'bg-white/90 text-gray-900 border-black/10'
          }
          ${hoveredItem === item.id 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-1'
          }
        `}
      >
        {item.label}
        <div 
          className={`
            absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-l border-t
            ${isDarkMode 
              ? 'bg-gray-900/90 border-white/10' 
              : 'bg-white/90 border-black/10'
            }
          `} 
        />
      </div>
    </div>
  );

  const Divider = () => (
    <div 
      className={`
        w-px h-8 rounded-full
        ${isDarkMode 
          ? 'bg-gradient-to-b from-transparent via-white/20 to-transparent' 
          : 'bg-gradient-to-b from-transparent via-black/15 to-transparent'
        }
      `}
    />
  );

  const TabContent = () => {
    const content = {
      home: {
        title: "Welcome Home",
        description: "This is the home section with beautiful glassmorphic design."
      },
      about: {
        title: "About Me",
        description: "Learn more about my background and experience."
      },
      projects: {
        title: "My Projects",
        description: "Explore my latest work and creative projects."
      }
    };

    return (
      <div 
        className={`
          mt-12 p-8 rounded-3xl backdrop-blur-md border
          transition-all duration-500 ease-out
          ${isDarkMode
            ? 'bg-white/5 border-white/10'
            : 'bg-white/20 border-white/20'
          }
        `}
        style={{
          boxShadow: isDarkMode
            ? '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
            : '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5)'
        }}
      >
        <h2 
          className={`
            text-2xl font-bold mb-4 transition-colors duration-300
            ${isDarkMode ? 'text-white' : 'text-gray-900'}
          `}
        >
          {content[activeTab]?.title}
        </h2>
        <p 
          className={`
            transition-colors duration-300
            ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
          `}
        >
          {content[activeTab]?.description}
        </p>
      </div>
    );
  };

  return (
    <div 
      className={`
        min-h-screen transition-all duration-500 ease-out p-8
        ${isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 w-full via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-slate-50 w-full via-white to-blue-50/30'
        }
      `}
    >
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="relative">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`
              absolute -top-16 right-0 p-3 rounded-2xl backdrop-blur-md border
              transition-all duration-300 ease-out
              ${isDarkMode
                ? 'bg-white/10 border-white/20 text-white hover:bg-white/15'
                : 'bg-white/30 border-white/30 text-gray-900 hover:bg-white/40'
              }
            `}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <nav 
            className={`
              flex items-center gap-5 px-6 py-4 rounded-3xl backdrop-blur-2xl border
              transition-all duration-500 ease-out
              ${isDarkMode
                ? 'bg-white/10 border-white/10 hover:bg-white/15'
                : 'bg-white/40 border-white/30 hover:bg-white/50'
              }
            `}
            style={{
              boxShadow: isDarkMode
                ? `0 8px 32px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)`
                : `0 8px 32px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.5)`
            }}
          >
            {/* Navigation tabs */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <NavButton 
                  key={item.id} 
                  item={item} 
                  isActive={activeTab === item.id} 
                  isTab={true}
                />
              ))}
            </div>

            <Divider />

            {/* Social links */}
            <div className="flex items-center gap-1">
              {socialLinks.map((item) => (
                <ExternalLink key={item.id} item={item} />
              ))}
            </div>

            <Divider />

            {/* Call to action button */}
            <div className="relative">
              <a
                href="https://www.linkedin.com/in/ravikatiyar11/"
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl
                  font-medium text-sm backdrop-blur-md border
                  transition-all duration-300 ease-out group
                  ${isDarkMode
                    ? 'bg-white text-gray-900 border-white/20 hover:bg-gray-100'
                    : 'bg-gray-900 text-white border-gray-900/20 hover:bg-gray-800'
                  }
                  hover:scale-[1.02] active:scale-95
                `}
                onMouseEnter={() => setHoveredItem('book-call')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span>Book a Call</span>
                <ArrowUpRight 
                  size={14} 
                  className={`
                    transition-all duration-200 ease-out
                    ${hoveredItem === 'book-call' 
                      ? 'opacity-100 translate-x-0.5 -translate-y-0.5 rotate-6' 
                      : 'opacity-80 translate-x-0 translate-y-0 rotate-0'
                    }
                  `}
                />
              </a>
            </div>
          </nav>
          
          {/* Ambient glow effect */}
          <div 
            className={`
              absolute inset-0 rounded-3xl -z-10 transition-all duration-500 ease-out
              blur-2xl scale-110
              ${isDarkMode
                ? hoveredItem 
                  ? 'opacity-30 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20'
                  : 'opacity-10 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10'
                : hoveredItem
                  ? 'opacity-50 bg-gradient-to-r from-blue-200/30 via-purple-200/30 to-pink-200/30'
                  : 'opacity-20 bg-gradient-to-r from-blue-200/20 via-purple-200/20 to-pink-200/20'
              }
            `}
          />
        </div>

        {/* Tab content */}
        <TabContent />
      </div>
    </div>
  );
};

export default GlassmorphismNav;