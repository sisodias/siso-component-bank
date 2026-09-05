import React, { useState, useRef, useEffect } from 'react';

interface Tab {
  label: string;
  status?: 'online' | 'offline' | 'busy' | 'away';
  badge?: string;
}

interface GlassMorphicTabsProps {
  tabs?: Tab[];
  activeTab?: number;
  onTabChange?: (index: number) => void;
  showStatusDots?: boolean;
  className?: string;
  variant?: 'premium' | 'minimal' | 'neon';
  size?: 'small' | 'medium' | 'large';
  showGlow?: boolean;
  magneticStrength?: number;
}

const GlassMorphicTabs: React.FC<GlassMorphicTabsProps> = ({ 
  tabs = [], 
  activeTab = 0, 
  onTabChange = () => {},
  showStatusDots = true,
  className = "",
  variant = "premium",
  size = "medium",
  showGlow = true,
  magneticStrength = 0.8
}) => {
  const [hoveredTab, setHoveredTab] = useState<number | null>(null);
  const [indicatorPosition, setIndicatorPosition] = useState<{ x: number; width: number }>({ x: 0, width: 0 });
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tabRefs.current[activeTab]) {
      const tabElement = tabRefs.current[activeTab];
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (containerRect && tabElement) {
        const tabRect = tabElement.getBoundingClientRect();
        const containerPadding = 8;
        const x = tabRect.left - containerRect.left - containerPadding;
        const width = tabRect.width;

        setIndicatorPosition({ x, width });
      }
    }
  }, [activeTab]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const mouseX = event.clientX - containerRect.left;
    const mouseY = event.clientY - containerRect.top;

    let closestTab: number | null = null;
    let minDistance = Infinity;

    tabRefs.current.forEach((tabRef, index) => {
      if (tabRef) {
        const tabRect = tabRef.getBoundingClientRect();
        const tabCenterX = tabRect.left + tabRect.width / 2 - containerRect.left;
        const tabCenterY = tabRect.top + tabRect.height / 2 - containerRect.top;

        const distanceX = Math.abs(mouseX - tabCenterX);
        const distanceY = Math.abs(mouseY - tabCenterY);
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        const magneticZone = 100;
        if (distance < magneticZone && distance < minDistance) {
          minDistance = distance;
          closestTab = index;
        }
      }
    });

    if (closestTab !== null && closestTab !== hoveredTab) {
      setHoveredTab(closestTab);

      const tabElement = tabRefs.current[closestTab];
      if (tabElement) {
        const tabRect = tabElement.getBoundingClientRect();
        const containerPadding = 8;
        const x = tabRect.left - containerRect.left - containerPadding;
        const width = tabRect.width;

        setIndicatorPosition({ x, width });
      }
    }
  };

  const handleMouseLeave = () => {
    setHoveredTab(null);
    setIsHovering(false);

    if (tabRefs.current[activeTab] && containerRef.current) {
      const tabElement = tabRefs.current[activeTab];
      const containerRect = containerRef.current.getBoundingClientRect();
      if (tabElement) {
        const tabRect = tabElement.getBoundingClientRect();
        const containerPadding = 8;
        const x = tabRect.left - containerRect.left - containerPadding;
        const width = tabRect.width;

        setIndicatorPosition({ x, width });
      }
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleTabClick = (index: number) => {
    onTabChange(index);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        const prevIndex = index > 0 ? index - 1 : tabs.length - 1;
        onTabChange(prevIndex);
        break;
      case 'ArrowRight':
        event.preventDefault();
        const nextIndex = index < tabs.length - 1 ? index + 1 : 0;
        onTabChange(nextIndex);
        break;
      case 'Home':
        event.preventDefault();
        onTabChange(0);
        break;
      case 'End':
        event.preventDefault();
        onTabChange(tabs.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        onTabChange(index);
        break;
    }
  };

  const sizeConfig = {
    small: { padding: '4px', borderRadius: '8px', fontSize: '11px', minWidth: '70px' },
    medium: { padding: '8px', borderRadius: '12px', fontSize: '13px', minWidth: '100px' },
    large: { padding: '12px', borderRadius: '16px', fontSize: '15px', minWidth: '130px' },
  };

  const config = sizeConfig[size];

  const styles = {
    container: {
      position: 'relative' as const,
      background: 'rgba(20, 20, 20, 0.6)',
      backdropFilter: 'blur(20px)',
      borderRadius: config.borderRadius,
      padding: config.padding,
      border: '1px solid rgba(255, 255, 255, 0.08)',
      overflow: 'hidden',
      width: 'fit-content',
      maxWidth: '100%',
    },
    backgroundBlur: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(255, 255, 255, 0.02)',
      backdropFilter: 'blur(10px)',
      zIndex: 0,
    },
    indicator: {
      position: 'absolute' as const,
      top: config.padding,
      height: `calc(100% - calc(${config.padding} * 2))`,
      background: 'rgba(255, 255, 255, 0.15)',
      borderRadius: `calc(${config.borderRadius} - 4px)`,
      zIndex: 1,
      pointerEvents: 'none' as const,
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
      transform: `translateX(${indicatorPosition.x}px)`,
      width: `${indicatorPosition.width}px`,
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    tabsContainer: {
      position: 'relative' as const,
      display: 'flex',
      zIndex: 2,
      gap: '2px',
      alignItems: 'center',
    },
    tab: {
      position: 'relative' as const,
      background: 'transparent',
      border: 'none',
      padding: '10px 20px',
      borderRadius: `calc(${config.borderRadius} - 4px)`,
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 3,
      minWidth: config.minWidth,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      whiteSpace: 'nowrap' as const,
      minHeight: '44px',
    },
    tabContent: {
      position: 'relative' as const,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#BFC7CD',
      fontSize: config.fontSize,
      fontWeight: 500,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 1,
      justifyContent: 'center',
      width: '100%',
    },
    statusDot: {
      position: 'relative' as const,
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      flexShrink: 0,
      zIndex: 1,
      border: '1px solid rgba(0, 0, 0, 0.2)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    badge: {
      background: 'rgba(255, 255, 255, 0.08)',
      color: '#FFFFFF',
      fontSize: '11px',
      padding: '3px 8px',
      borderRadius: '6px',
      fontWeight: 500,
      border: '1px solid rgba(255, 255, 255, 0.1)',
      textAlign: 'center' as const,
      minWidth: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      minHeight: '20px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
  };

  const getStatusDotStyle = (status: string) => {
    const baseStyle = { ...styles.statusDot };
    switch (status) {
      case 'online':
        return { ...baseStyle, background: '#10b981', boxShadow: '0 0 0 1px rgba(16, 185, 129, 0.3)' };
      case 'offline':
        return { ...baseStyle, background: '#6b7280', boxShadow: '0 0 0 1px rgba(107, 114, 128, 0.3)' };
      case 'busy':
        return { ...baseStyle, background: '#ef4444', boxShadow: '0 0 0 1px rgba(239, 68, 68, 0.3)' };
      case 'away':
        return { ...baseStyle, background: '#f59e0b', boxShadow: '0 0 0 1px rgba(245, 158, 11, 0.3)' };
      default:
        return baseStyle;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`glass-morphic-tabs glass-morphic-tabs--${variant} glass-morphic-tabs--${size} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={styles.container}
    >
      <div style={styles.backgroundBlur} />

      <div
        style={styles.indicator}
      />

      <nav role="tablist" aria-label="main navigation tabs">
        <div style={styles.tabsContainer}>
          {tabs.map((tab, index) => (
            <button
              key={index}
              ref={(el) => (tabRefs.current[index] = el)}
              className={`tab ${activeTab === index ? 'active' : ''} ${hoveredTab === index ? 'hovered' : ''}`}
              role="tab"
              aria-selected={activeTab === index}
              tabIndex={activeTab === index ? 0 : -1}
              onClick={() => handleTabClick(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              style={{
                ...styles.tab,
                ...(activeTab === index && {
                  background: 'rgba(255, 255, 255, 0.05)',
                }),
                ...(hoveredTab === index && {
                  background: 'rgba(255, 255, 255, 0.03)',
                  transform: 'translateY(-2px) scale(1.02)',
                }),
              }}
            >
              <div style={{
                ...styles.tabContent,
                ...(activeTab === index && {
                  color: '#E6E6E6',
                  fontWeight: 600,
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                }),
                ...(hoveredTab === index && {
                  color: '#D1D5DB',
                }),
              }}>
                {showStatusDots && tab.status && (
                  <div
                    style={getStatusDotStyle(tab.status)}
                    aria-label={`status: ${tab.status}`}
                    className={`status-dot status-dot--${tab.status}`}
                  />
                )}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    style={{
                      ...styles.badge,
                      ...(activeTab === index && {
                        background: 'rgba(255, 255, 255, 0.15)',
                        color: '#ffffff',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                      }),
                    }}
                    aria-label={`${tab.badge} notifications`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </nav>

      <style jsx>{`
        .status-dot--online {
          animation: pulse-green 2.8s ease-in-out infinite;
        }
        .status-dot--busy {
          animation: pulse-red 2.8s ease-in-out infinite;
        }
        .status-dot--away {
          animation: pulse-orange 2.8s ease-in-out infinite;
        }
        .status-dot--offline {
          opacity: 0.6;
        }
        
        @keyframes pulse-green {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.4); opacity: 1; }
        }
        
        @keyframes pulse-red {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.4); opacity: 1; }
        }
        
        @keyframes pulse-orange {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.4); opacity: 1; }
        }
        
        .tab:hover {
          transform: translateY(-2px) scale(1.02) !important;
        }
        
        .tab:focus {
          outline: 2px solid rgba(255, 255, 255, 0.1);
          outline-offset: 2px;
        }
        
        @media (max-width: 768px) {
          .glass-morphic-tabs {
            padding: 4px;
            border-radius: 8px;
          }
          
          .tab {
            padding: 8px 12px;
            min-width: 60px;
          }
          
          .tab-content {
            font-size: 11px;
            gap: 4px;
          }
          
          .status-dot {
            width: 5px;
            height: 5px;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .tab-indicator,
          .tab,
          .status-dot,
          .tab-badge {
            transition: none !important;
            animation: none !important;
          }
          
          .tab:hover,
          .tab:focus {
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default GlassMorphicTabs;