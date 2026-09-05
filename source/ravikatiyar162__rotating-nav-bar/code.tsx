import React, { useState } from 'react';
import { Briefcase } from 'lucide-react';

const ResponsiveNavigation = () => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    { id: 'home', label: 'HOME' },
    { id: 'services', label: 'SERVICES' },
    { id: 'about', label: 'ABOUT' },
    { id: 'contact', label: 'CONTACT' }
  ];

  // Enhanced function to create seamless circular text
  const getRotatingText = (hoveredLabel) => {
    // Calculate repetitions based on text length to fill circle completely
    const baseRepetitions = Math.max(6, Math.ceil(60 / hoveredLabel.length));
    let text = '';
    for (let i = 0; i < baseRepetitions; i++) {
      text += `${hoveredLabel} • `;
    }
    return text;
  };

  // Enhanced icon rendering with proper fallbacks
  const renderIcon = (item) => {
    switch (item.id) {
      case 'home':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        );
      case 'services':
        return <Briefcase size={20} className="text-white" />;
      case 'about':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        );
      case 'contact':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        );
      default:
        return <span className="text-white text-sm font-semibold">{item.label.charAt(0)}</span>;
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-50 w-full dark:bg-gray-900 flex items-center justify-center">
      <nav className="w-full max-w-4xl px-4">
        <ul className="flex justify-center items-center gap-16 lg:gap-24">
          {navItems.map((item, index) => (
            <li key={item.id} className="relative group">
              <div 
                className="relative cursor-pointer select-none"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                role="button"
                tabIndex={0}
                aria-label={`Navigate to ${item.label}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    console.log(`Navigating to ${item.label}`);
                  }
                }}
              >
                {/* Default Text State - Fixed positioning and transitions */}
                <div className={`transition-all duration-700 ease-out ${hoveredItem === item.id ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'}`}>
                  <span className="block text-2xl font-semibold text-gray-700 dark:text-gray-200 tracking-wide whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
                
                {/* Hover State Container - Fixed sizing and positioning */}
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out ${hoveredItem === item.id ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}>
                  
                  {/* Central Circle with Icon - Enhanced styling */}
                  <div className="relative z-20 w-16 h-16 bg-gray-800 dark:bg-gray-700 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 hover:bg-gray-700 dark:hover:bg-gray-600">
                    {renderIcon(item)}
                  </div>
                  
                  {/* Rotating Text Circle - Fixed text distribution and gaps */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 z-10">
                    <svg 
                      className="w-full h-full animate-spin origin-center" 
                      style={{ 
                        animationDuration: '12s',
                        animationTimingFunction: 'linear',
                        animationIterationCount: 'infinite'
                      }} 
                      viewBox="0 0 144 144"
                    >
                      <defs>
                        {/* Increased radius for better text distribution */}
                        <path 
                          id={`circle-path-${item.id}`} 
                          d="M 72 72 m -60 0 a 60 60 0 1 1 120 0 a 60 60 0 1 1 -120 0" 
                          fill="none"
                        />
                      </defs>
                      <text 
                        className="text-xs font-semibold fill-gray-600 dark:fill-gray-400 tracking-wider"
                        style={{ 
                          fontSize: '10px',
                          letterSpacing: '0.5px',
                          dominantBaseline: 'middle',
                          textAnchor: 'start'
                        }}
                      >
                        <textPath 
                          href={`#circle-path-${item.id}`} 
                          startOffset="0%"
                          spacing="auto"
                          method="stretch"
                        >
                          {getRotatingText(item.label)}
                        </textPath>
                      </text>
                    </svg>
                  </div>
                  
                  {/* Additional background circle for visual depth */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full opacity-10 z-0"></div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Enhanced CSS with detailed solutions */}
      <style jsx>{`
        /* SOLUTION 1: Fixed Animation Performance and Consistency */
        @keyframes spin {
          from { 
            transform: rotate(0deg); 
          }
          to { 
            transform: rotate(360deg); 
          }
        }
        
        .animate-spin {
          animation: spin 12s linear infinite;
          transform-origin: center center;
          will-change: transform;
        }
        
        /* SOLUTION 2: Enhanced Text Path Distribution */
        textPath {
          /* Ensure text fills the entire circle path */
          text-anchor: start;
          dominant-baseline: middle;
        }
        
        /* SOLUTION 3: Improved Hover State Management */
        .group:hover {
          z-index: 50;
        }
        
        /* SOLUTION 4: Enhanced Accessibility and Focus States */
        [role="button"]:focus {
          outline: 2px solid rgb(59 130 246);
          outline-offset: 4px;
          border-radius: 8px;
        }
        
        [role="button"]:focus-visible {
          outline: 2px solid rgb(59 130 246);
          outline-offset: 4px;
        }
        
        /* SOLUTION 5: Smooth Transitions for All States */
        * {
          transition-property: opacity, transform, background-color, color, box-shadow;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* SOLUTION 6: Fix for Text Rendering Issues */
        svg text {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-feature-settings: "kern" 1;
          text-rendering: optimizeLegibility;
        }
        
        /* SOLUTION 7: Responsive Adjustments */
        @media (max-width: 768px) {
          .animate-spin {
            animation-duration: 10s;
          }
          
          svg {
            width: 120px !important;
            height: 120px !important;
          }
          
          textPath {
            font-size: 8px !important;
          }
        }
        
        /* SOLUTION 8: Dark Mode Optimizations */
        @media (prefers-color-scheme: dark) {
          svg text {
            filter: brightness(1.1);
          }
        }
        
        /* SOLUTION 9: Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
          .animate-spin {
            animation: none;
          }
          
          * {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ResponsiveNavigation;