import React, { useState, useEffect } from 'react';

// Custom hook for responsive breakpoints
const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
};

const capabilities = [
  {
    id: 'reasoning',
    title: 'Reasoning',
    description: "Understand the universe: solve humanity's most difficult scientific problems with deep thought.",
    href: 'https://docs.x.ai/docs/guides/reasoning',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.0817 18.291C19.727 16.7 20.75 14.4695 20.75 12C20.75 7.16751 16.8325 3.25 12 3.25C7.16751 3.25 3.25 7.16751 3.25 12C3.25 16.8325 7.16751 20.75 12 20.75H19.5347L18.0817 18.291Z" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
  },
  {
    id: 'vision',
    title: 'Vision',
    description: 'See the world through vision, interpreting images and visuals with sharp, insightful understanding.',
    href: 'https://docs.x.ai/docs/guides/image-understanding',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.75 9.375C10.75 10.1344 10.1344 10.75 9.375 10.75C8.61561 10.75 8 10.1344 8 9.375C8 8.61561 8.61561 8 9.375 8C10.1344 8 10.75 8.61561 10.75 9.375Z" fill="currentColor"/>
        <path d="M7.15104 15.1655L9.67016 12.3665C9.85307 12.1633 10.1653 12.1446 10.3711 12.3247L12 13.75L13.4519 11.5918C13.6454 11.3041 14.0661 11.296 14.2706 11.5761L16.9198 15.2052C17.161 15.5356 16.925 16 16.516 16L7.52269 16C7.0898 16 6.86145 15.4873 7.15104 15.1655Z" fill="currentColor"/>
        <path d="M9 4V4C8.07069 4 7.60603 4 7.21964 4.07686C5.63288 4.39249 4.39249 5.63288 4.07686 7.21964C4 7.60603 4 8.07069 4 9V9M15 4V4C15.9293 4 16.394 4 16.7804 4.07686C18.3671 4.39249 19.6075 5.63288 19.9231 7.21964C20 7.60603 20 8.07069 20 9V9M9 20V20C8.07069 20 7.60603 20 7.21964 19.9231C5.63288 19.6075 4.39249 18.3671 4.07686 16.7804C4 16.394 4 15.9293 4 15V15M15 20V20C15.9293 20 16.394 20 16.7804 19.9231C18.3671 19.6075 19.6075 18.3671 19.9231 16.7804C20 16.394 20 15.9293 20 15V15" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
  },
  {
    id: 'tool-calling',
    title: 'Tool calling',
    description: 'Craft agentic experiences with both server-side and client-side tool calling with our Agent Tools API.',
    href: 'https://docs.x.ai/docs/guides/tools/overview',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1"/>
        <path d="M8 8.25L10.5 10.75L8 13.25" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
  },
  {
    id: 'structured-outputs',
    title: 'Structured outputs',
    description: 'Organize chaos with structured outputs, delivering clean, predictable responses.',
    href: 'https://docs.x.ai/docs/guides/structured-outputs',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.3 3.5H9.7C8.58438 3.5 8.02657 3.5 7.56622 3.61052C6.10362 3.96166 4.96166 5.10362 4.61052 6.56622C4.5 7.02657 4.5 7.58438 4.5 8.7V15.3C4.5 16.4156 4.5 16.9734 4.61052 17.4338C4.96166 18.8964 6.10362 20.0383 7.56622 20.3895C8.02657 20.5 8.58438 20.5 9.7 20.5H12.8461C13.3347 20.5 13.579 20.5 13.8133 20.4723C14.5459 20.3856 15.2402 20.098 15.8195 19.6413C16.0048 19.4952 16.1775 19.3225 16.523 18.977L17.977 17.523C18.3225 17.1775 18.4952 17.0048 18.6413 16.8195C19.098 16.2402 19.3856 15.5459 19.4723 14.8133C19.5 14.579 19.5 14.3347 19.5 13.8461V8.7C19.5 7.58438 19.5 7.02657 19.3895 6.56622C19.0383 5.10362 17.8964 3.96166 16.4338 3.61052C15.9734 3.5 15.4156 3.5 14.3 3.5Z" stroke="currentColor" strokeWidth="1" strokeLinecap="square" strokeLinejoin="round"/>
        <path d="M14 20V17.5C14 16.1193 15.1193 15 16.5 15H19" stroke="currentColor" strokeWidth="1"/>
        <path d="M9 9L15 9" stroke="currentColor" strokeWidth="1"/>
        <path d="M9 13H12" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
  },
  {
    id: 'image-generation',
    title: 'Image generation',
    description: 'Bring your ideas to life with image generation, creating visuals that are as unique as you are.',
    href: 'https://docs.x.ai/docs/guides/image-generations',
    icon: (
      <svg width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <rect width="16" height="16" x="4" y="4" stroke="currentColor" strokeWidth="1" rx="4"/>
        <path stroke="currentColor" strokeWidth="1" d="M4 12a5 5 0 0 1 6 8"/>
        <circle cx="15.25" cy="8.75" r="1.75" fill="currentColor"/>
        <path stroke="currentColor" strokeWidth="1" d="M4 16.5c2.333-.5 8-.5 9-2S11 13 11 13"/>
      </svg>
    ),
  },
  {
    id: 'search',
    title: 'Search',
    description: 'Tap into the now with real-time search, pulling fresh, relevant data from the web and X instantly.',
    href: 'https://docs.x.ai/docs/guides/tools/search-tools',
    isNew: true,
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 18.9381C16.9463 18.446 20 15.0796 20 11C20 6.58172 16.4183 3 12 3C8.27232 3 5.14012 5.54955 4.25204 9" stroke="currentColor" strokeWidth="1"/>
        <path d="M18.5 17.5L21 20" stroke="currentColor" strokeWidth="1" strokeLinecap="square"/>
        <path d="M2 17.875L7.78571 11L7.14286 15.125H11L5.21429 22L5.85714 17.875H2Z" fill="currentColor"/>
      </svg>
    ),
  },
];

const CapabilityCard = ({ capability, index, isHovered, onHover, onLeave, breakpoint, totalItems }) => {
  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';
  const isDesktop = breakpoint === 'desktop';
  
  // Determine if card is in first row based on breakpoint
  const columnsPerRow = isDesktop ? 3 : isTablet ? 2 : 1;
  const isFirstRow = index < columnsPerRow;
  const isLastInRow = (index + 1) % columnsPerRow === 0;
  const isLastRow = index >= totalItems - columnsPerRow;
  
  return (
    <a
      href={capability.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        padding: isMobile ? '32px 20px' : isTablet ? '36px 28px' : '40px 32px',
        background: isHovered
          ? 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)'
          : 'transparent',
        transition: 'background 0.3s ease',
        textDecoration: 'none',
        color: 'inherit',
        borderBottom: !isLastRow || isMobile ? '1px solid rgba(255,255,255,0.1)' : 'none',
      }}
    >
      {/* Corner markers - only show on hover (desktop/tablet only) */}
      {!isMobile && (
        <>
          <div
            style={{
              position: 'absolute',
              width: 8,
              height: 8,
              background: '#fff',
              top: -4,
              left: -4,
              zIndex: 10,
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'scale(1)' : 'scale(0)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: 8,
              height: 8,
              background: '#fff',
              top: -4,
              right: -5,
              zIndex: 10,
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'scale(1)' : 'scale(0)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDelay: '0.05s',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: 8,
              height: 8,
              background: '#fff',
              bottom: -5,
              left: -4,
              zIndex: 10,
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'scale(1)' : 'scale(0)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDelay: '0.1s',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: 8,
              height: 8,
              background: '#fff',
              bottom: -5,
              right: -5,
              zIndex: 10,
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'scale(1)' : 'scale(0)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDelay: '0.15s',
            }}
          />
        </>
      )}

      {/* Hover border overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          border: '1px solid rgba(255,255,255,0.1)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />

      {/* New badge */}
      {capability.isNew && (
        <span
          style={{
            position: 'absolute',
            top: isMobile ? 24 : 32,
            right: isMobile ? 20 : 32,
            padding: isMobile ? '3px 10px' : '4px 12px',
            borderRadius: 9999,
            border: '1px solid rgba(255,255,255,0.2)',
            fontSize: isMobile ? 11 : 12,
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          New
        </span>
      )}

      {/* Icon */}
      <div
        style={{
          color: '#fff',
          marginBottom: isMobile ? 40 : isTablet ? 52 : 64,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        }}
      >
        {capability.icon}
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: isMobile ? 18 : 20,
          fontWeight: 400,
          color: isHovered ? '#fff' : 'rgba(255,255,255,0.9)',
          margin: 0,
          marginBlockEnd: isMobile ? 12 : 16,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        }}
      >
        {capability.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: isMobile ? 14 : 15,
          lineHeight: 1.6,
          color: isHovered ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.45)',
          maxWidth: 320,
          margin: 0,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transitionDelay: '0.05s',
          transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
          opacity: isHovered ? 1 : 0.85,
        }}
      >
        {capability.description}
      </p>
    </a>
  );
};

export const CapabilitiesSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const breakpoint = useBreakpoint();
  
  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';
  const isDesktop = breakpoint === 'desktop';

  // Grid columns based on breakpoint
  const gridColumns = isDesktop ? 'repeat(3, 1fr)' : isTablet ? 'repeat(2, 1fr)' : '1fr';

  return (
    <section
      style={{
        background: '#0a0a0a',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#fff',
        WebkitFontSmoothing: 'antialiased',
        padding: isMobile ? '64px 0' : isTablet ? '96px 0' : '128px 0',
        minHeight: '100vh',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: isMobile ? '0 16px' : isTablet ? '0 20px' : '0 24px',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: isMobile ? 48 : isTablet ? 64 : 80 }}>
          <div
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, "Roboto Mono", Menlo, Monaco, monospace',
              color: 'rgba(255,255,255,0.5)',
              fontSize: isMobile ? 12 : 14,
              marginBottom: isMobile ? 24 : isTablet ? 36 : 48,
              letterSpacing: '0.05em',
            }}
          >
            [ Capabilities ]
          </div>

          <h2
            style={{
              fontSize: isMobile ? 28 : isTablet ? 40 : 'clamp(32px, 5vw, 56px)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              maxWidth: 600,
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Models that fit your needs
          </h2>
        </div>

        {/* Capabilities Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: gridColumns,
            position: 'relative',
          }}
        >
          {/* Vertical divider lines - only on tablet and desktop */}
          {!isMobile && (
            <>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: isDesktop ? '33.333%' : '50%',
                  width: 1,
                  background: 'rgba(255,255,255,0.1)',
                }}
              />
              {isDesktop && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: '66.666%',
                    width: 1,
                    background: 'rgba(255,255,255,0.1)',
                  }}
                />
              )}
            </>
          )}

          {capabilities.map((capability, index) => (
            <CapabilityCard
              key={capability.id}
              capability={capability}
              index={index}
              isHovered={hoveredIndex === index}
              onHover={() => setHoveredIndex(index)}
              onLeave={() => setHoveredIndex(null)}
              breakpoint={breakpoint}
              totalItems={capabilities.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
};