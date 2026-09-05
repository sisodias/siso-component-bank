import React, { useState, useEffect } from 'react';
import { Home, Twitter, Instagram, User, ArrowUpRight, Sun, Moon } from 'lucide-react';

const GlassmorphismNav = () => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', current: true },
  ];

  const socialLinks = [
    { id: 'twitter', icon: Twitter, label: 'X (Twitter)' },
    { id: 'instagram', icon: Instagram, label: 'Instagram' },
    { id: 'cv', icon: User, label: 'My CV' },
  ];

  const NavButton = ({ item, isActive = false }) => (
    <div className="relative">
      <button
        className={`
          relative flex items-center justify-center w-11 h-11 rounded-2xl
          transition-all duration-200 ease-out group overflow-hidden
        `}
        onMouseEnter={() => setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
        style={{
          backdropFilter: isActive ? 'blur(10px)' : 'none',
          boxShadow: isActive
            ? 'inset 0 1px 2px hsl(var(--foreground) / 0.1), inset 0 -1px 2px hsl(var(--background) / 0.8)'
            : 'none'
        }}
      >
        {/* Glass blur background */}
        <div
          className={`
            absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2
            rounded-xl backdrop-blur-md
            transition-all duration-300 ease-out
            ${hoveredItem === item.id
              ? 'opacity-100 scale-125'
              : 'opacity-0 scale-100'
            }
          `}
          style={{
            backgroundColor: hoveredItem === item.id ? 'hsl(var(--background) / 0.05)' : 'transparent',
            boxShadow: hoveredItem === item.id
              ? '0 8px 32px hsl(var(--foreground) / 0.1), inset 0 1px 0 hsl(var(--background) / 0.8)'
              : 'none'
          }}
        />

        {/* Icon */}
        <div className="relative z-10 flex items-center justify-center">
          <item.icon 
            size={18}
            className={`
              transition-all duration-200 ease-out
              ${isActive
                ? 'text-foreground'
                : 'text-muted-foreground group-hover:text-foreground'
              }
            `}
          />
        </div>

        <span className="sr-only">{item.label}</span>
      </button>

      {/* Floating label */}
      <div 
        className={`
          absolute -bottom-12 left-1/2 -translate-x-1/2 z-50
          px-2.5 py-1.5 rounded-lg backdrop-blur-md border
          text-xs font-medium whitespace-nowrap
          transition-all duration-200 ease-out pointer-events-none
          bg-background/90 text-foreground border-border/50
          ${hoveredItem === item.id
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-1'
          }
        `}
        style={{
          boxShadow: '0 4px 20px hsl(var(--foreground) / 0.15), inset 0 1px 0 hsl(var(--background) / 0.8)'
        }}
      >
        {item.label}
        {/* Tooltip arrow */}
        <div 
          className={`
            absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 backdrop-blur-sm
            bg-background/90 border-l border-t border-border/50
          `}
        />
      </div>
    </div>
  );

  const Divider = () => (
    <div 
      className="w-px h-8 rounded-full bg-gradient-to-b from-transparent via-border to-transparent"
    />
  );

  return (
    <div className="flex items-center justify-center min-h-screen p-8 w-full transition-all duration-500 bg-gradient-to-br from-background via-background to-muted/30">
      <div className="relative">
        <nav 
          className={`
            flex items-center gap-5 px-6 py-4 rounded-3xl border
            backdrop-blur-xl transition-all duration-500 ease-out
            bg-background/40 border-border/50 hover:bg-background/60
          `}
          style={{
            boxShadow: `
              0 8px 32px hsl(var(--foreground) / 0.08),
              0 4px 16px hsl(var(--foreground) / 0.04),
              inset 0 1px 0 hsl(var(--background) / 0.8),
              inset 0 -1px 0 hsl(var(--background) / 0.2)
            `
          }}
        >
          {/* Home section */}
          <div className="flex items-center">
            {navItems.map((item) => (
              <NavButton key={item.id} item={item} isActive={item.current} />
            ))}
          </div>

          <Divider />

          {/* Social links section */}
          <div className="flex items-center gap-1">
            {socialLinks.map((item) => (
              <NavButton key={item.id} item={item} />
            ))}
          </div>

          <Divider />

          {/* Call to action button */}
          <div className="relative">
            <button
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl
                font-medium text-sm backdrop-blur-sm
                transition-all duration-200 ease-out
                hover:scale-[1.02] active:scale-95 group
                bg-primary text-primary-foreground hover:bg-primary/90
              `}
              onMouseEnter={() => setHoveredItem('book-call')}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                boxShadow: '0 4px 20px hsl(var(--primary) / 0.3), inset 0 1px 0 hsl(var(--primary-foreground) / 0.2)'
              }}
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
            </button>
          </div>
        </nav>

        {/* Ambient glow effect */}
        <div 
          className={`
            absolute inset-0 rounded-3xl -z-10 transition-all duration-500 ease-out
            blur-2xl scale-110
            ${hoveredItem
              ? 'opacity-40'
              : 'opacity-20'
            }
          `}
          style={{
            background: hoveredItem 
              ? 'linear-gradient(to right, hsl(var(--primary) / 0.2), hsl(var(--accent) / 0.2), hsl(var(--secondary) / 0.2))'
              : 'linear-gradient(to right, hsl(var(--primary) / 0.1), hsl(var(--accent) / 0.1), hsl(var(--secondary) / 0.1))'
          }}
        />
      </div>
    </div>
  );
};

export default GlassmorphismNav;