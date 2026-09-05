import React, { useState, useEffect } from 'react';
import { MapPin, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

const IPLocationDisplay = ({ 
  showIcon = true,
  showCountryFlag = true,
  customStyles = {},
  onLocationFetch = null,
  fallbackText = "Location unavailable"
}) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect system theme preference
  useEffect(() => {
    const detectTheme = () => {
      if (typeof window !== 'undefined') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
      }
    };

    detectTheme();

    // Listen for theme changes
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => setIsDarkMode(e.matches);
      
      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } 
      // Fallback for older browsers
      else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, []);

  const fetchLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try multiple endpoints for better reliability
      const endpoints = [
        'https://api.ipify.org?format=json',
        'https://httpbin.org/ip'
      ];

      let ip = null;
      
      // First get IP address
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint);
          if (response.ok) {
            const data = await response.json();
            ip = data.ip || data.origin;
            if (ip) break;
          }
        } catch (err) {
          console.log(`Failed to fetch from ${endpoint}:`, err.message);
        }
      }

      if (!ip) {
        throw new Error('Unable to detect IP address');
      }

      // Then get location data using ip-api.com (free, no key required)
      const locationResponse = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,city,timezone,query`);
      
      if (!locationResponse.ok) {
        throw new Error(`HTTP error! status: ${locationResponse.status}`);
      }
      
      const locationData = await locationResponse.json();
      
      if (locationData.status === 'fail') {
        throw new Error(locationData.message || 'Failed to fetch location data');
      }
      
      const formattedLocation = {
        city: locationData.city,
        country: locationData.country,
        countryCode: locationData.countryCode,
        region: locationData.region,
        ip: locationData.query,
        timezone: locationData.timezone
      };
      
      setLocation(formattedLocation);
      
      // Call callback if provided
      if (onLocationFetch) {
        onLocationFetch(formattedLocation);
      }
      
    } catch (err) {
      console.error('Location fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const getCountryFlag = (countryCode) => {
    if (!countryCode) return '';
    return countryCode
      .toUpperCase()
      .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
  };

  // Responsive and theme-aware styles
  const getThemeStyles = () => {
    const baseStyles = {
      light: {
        container: {
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          color: '#334155',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        },
        icon: { color: '#64748b' },
        text: { color: '#334155' },
        error: { color: '#dc2626' },
        retry: { color: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)' },
        loading: { color: '#64748b' }
      },
      dark: {
        container: {
          backgroundColor: '#1e293b',
          border: '1px solid #475569',
          color: '#e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)'
        },
        icon: { color: '#94a3b8' },
        text: { color: '#e2e8f0' },
        error: { color: '#f87171' },
        retry: { color: '#60a5fa', backgroundColor: 'rgba(96, 165, 250, 0.2)' },
        loading: { color: '#94a3b8' }
      }
    };

    const theme = isDarkMode ? baseStyles.dark : baseStyles.light;

    return {
      container: {
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(6px, 2vw, 12px)',
        padding: 'clamp(8px, 3vw, 16px)',
        borderRadius: 'clamp(6px, 2vw, 12px)',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSize: 'clamp(12px, 3.5vw, 14px)',
        fontWeight: '500',
        width: '100%',
        maxWidth: 'min(300px, 90vw)',
        minHeight: '44px', // Touch-friendly minimum
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'default',
        ...theme.container,
        ...customStyles.container
      },
      icon: {
        flexShrink: 0,
        width: 'clamp(14px, 4vw, 16px)',
        height: 'clamp(14px, 4vw, 16px)',
        transition: 'color 0.3s ease',
        ...theme.icon,
        ...customStyles.icon
      },
      text: {
        flex: 1,
        lineHeight: '1.4',
        wordBreak: 'break-word',
        transition: 'color 0.3s ease',
        ...theme.text,
        ...customStyles.text
      },
      flag: {
        fontSize: 'clamp(16px, 5vw, 20px)',
        flexShrink: 0,
        transition: 'transform 0.2s ease',
        ...customStyles.flag
      },
      error: {
        fontSize: 'clamp(11px, 3vw, 13px)',
        lineHeight: '1.3',
        ...theme.error,
        ...customStyles.error
      },
      retry: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 'clamp(4px, 1.5vw, 8px)',
        borderRadius: 'clamp(4px, 1.5vw, 6px)',
        fontSize: 'clamp(10px, 3vw, 12px)',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        transition: 'all 0.2s ease',
        minHeight: '32px',
        minWidth: '60px',
        justifyContent: 'center',
        ...theme.retry,
        ...customStyles.retry
      },
      loading: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        ...theme.loading,
        ...customStyles.loading
      }
    };
  };

  const styles = getThemeStyles();

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          {showIcon && (
            <Loader2 
              size={styles.icon.width || 16} 
              style={styles.icon} 
              className="animate-spin" 
            />
          )}
          <span>Detecting location...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        {showIcon && <AlertCircle size={styles.icon.width || 16} style={styles.icon} />}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={styles.error}>
            {fallbackText}
          </div>
          <button 
            onClick={handleRetry}
            style={styles.retry}
            title="Click to retry"
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          >
            <RefreshCw size={12} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!location || !location.city || !location.country) {
    return (
      <div style={styles.container}>
        {showIcon && <MapPin size={styles.icon.width || 16} style={styles.icon} />}
        <span style={styles.text}>{fallbackText}</span>
        <button 
          onClick={handleRetry}
          style={styles.retry}
          title="Click to retry"
        >
          <RefreshCw size={12} />
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {showIcon && <MapPin size={styles.icon.width || 16} style={styles.icon} />}
      <span style={styles.text}>
        {location.city}, {location.country}
      </span>
      {showCountryFlag && location.countryCode && (
        <span 
          style={styles.flag}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
        >
          {getCountryFlag(location.countryCode)}
        </span>
      )}
    </div>
  );
};

// Demo component showing different configurations
const LocationThemeDemo = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const detectTheme = () => {
      if (typeof window !== 'undefined') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
      }
    };

    detectTheme();

    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => setIsDarkMode(e.matches);
      
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, []);

  const handleLocationFetch = (locationData) => {
    console.log('Location detected:', locationData);
  };

  const containerStyle = {
    padding: 'clamp(16px, 5vw, 32px)',
    minHeight: '100vh',
    backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
    color: isDarkMode ? '#e2e8f0' : '#334155',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(16px, 4vw, 24px)'
  };

  const headingStyle = {
    margin: '0 0 clamp(12px, 3vw, 20px) 0',
    fontSize: 'clamp(18px, 5vw, 24px)',
    fontWeight: '700',
    color: isDarkMode ? '#f1f5f9' : '#1e293b'
  };

  const subheadingStyle = {
    margin: '0 0 clamp(8px, 2vw, 12px) 0',
    fontSize: 'clamp(14px, 4vw, 16px)',
    fontWeight: '600',
    color: isDarkMode ? '#cbd5e1' : '#475569'
  };

  const cardStyle = {
    padding: 'clamp(12px, 3vw, 16px)',
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    borderRadius: 'clamp(8px, 2vw, 12px)',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
    boxShadow: isDarkMode 
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' 
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={containerStyle}>
      <div>
        <h1 style={headingStyle}>
          IP Location Display - Auto Theme Detection
        </h1>
        <p style={{ 
          margin: '0 0 clamp(20px, 5vw, 32px) 0',
          fontSize: 'clamp(13px, 3.5vw, 15px)',
          lineHeight: '1.6',
          color: isDarkMode ? '#94a3b8' : '#64748b'
        }}>
          This component automatically adapts to your system's theme preference and is fully responsive across all devices.
          Current mode: <strong>{isDarkMode ? 'Dark' : 'Light'}</strong>
        </p>
      </div>

      <div style={cardStyle}>
        <h2 style={subheadingStyle}>Default Configuration</h2>
        <IPLocationDisplay onLocationFetch={handleLocationFetch} />
      </div>

      <div style={cardStyle}>
        <h2 style={subheadingStyle}>Minimal Style</h2>
        <IPLocationDisplay 
          showIcon={false}
          showCountryFlag={false}
          customStyles={{
            container: {
              backgroundColor: 'transparent',
              border: 'none',
              padding: 'clamp(4px, 1vw, 8px) 0',
              boxShadow: 'none'
            }
          }}
        />
      </div>

      <div style={cardStyle}>
        <h2 style={subheadingStyle}>Accent Color Variant</h2>
        <IPLocationDisplay 
          customStyles={{
            container: {
              background: isDarkMode 
                ? 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)'
                : 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
              border: 'none',
              color: 'white'
            },
            icon: { color: 'rgba(255, 255, 255, 0.9)' },
            text: { color: 'white' }
          }}
        />
      </div>

      <div style={cardStyle}>
        <h2 style={subheadingStyle}>Compact Mobile-Friendly</h2>
        <IPLocationDisplay 
          customStyles={{
            container: {
              maxWidth: '100%',
              fontSize: 'clamp(11px, 3vw, 13px)',
              padding: 'clamp(6px, 2vw, 10px)',
              gap: 'clamp(4px, 1.5vw, 8px)'
            }
          }}
        />
      </div>
    </div>
  );
};

export default LocationThemeDemo;