import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const Loader = () => {
  const [isDark, setIsDark] = useState(true);

  const theme = {
    dark: {
      bg: '#0a0a0a',
      cardBg: '#111',
      gridColor: 'rgba(255, 255, 255, 0.05)',
      textColor: 'rgb(124, 124, 124)',
      accentColor: '#956afa',
      buttonBg: 'rgba(255, 255, 255, 0.1)',
      buttonHover: 'rgba(255, 255, 255, 0.15)'
    },
    light: {
      bg: '#f5f5f5',
      cardBg: '#ffffff',
      gridColor: 'rgba(0, 0, 0, 0.05)',
      textColor: 'rgb(100, 100, 100)',
      accentColor: '#7c3aed',
      buttonBg: 'rgba(0, 0, 0, 0.05)',
      buttonHover: 'rgba(0, 0, 0, 0.1)'
    }
  };

  const currentTheme = isDark ? theme.dark : theme.light;

  return (
    <div style={{ 
      width: '100%',
      position: 'relative',
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      backgroundColor: currentTheme.bg,
      backgroundImage: `
        linear-gradient(${currentTheme.gridColor} 1px, transparent 1px),
        linear-gradient(90deg, ${currentTheme.gridColor} 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
      transition: 'background-color 0.3s ease'
    }}>
      <style>{`
        .card {
          --bg-color: ${currentTheme.cardBg};
          background-color: var(--bg-color);
          padding: 1rem 2rem;
          border-radius: 1.25rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          transition: background-color 0.3s ease;
        }

        .loader {
          color: ${currentTheme.textColor};
          font-family: "Poppins", sans-serif;
          font-weight: 500;
          font-size: 25px;
          -webkit-box-sizing: content-box;
          box-sizing: content-box;
          height: 40px;
          padding: 10px 10px;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          border-radius: 8px;
          transition: color 0.3s ease;
        }

        .words {
          overflow: hidden;
          position: relative;
        }

        .words::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            var(--bg-color) 10%,
            transparent 30%,
            transparent 70%,
            var(--bg-color) 90%
          );
          z-index: 20;
        }

        .word {
          display: block;
          height: 100%;
          padding-left: 6px;
          color: ${currentTheme.accentColor};
          animation: spin_4991 4s infinite;
          transition: color 0.3s ease;
        }

        @keyframes spin_4991 {
          10% {
            -webkit-transform: translateY(-102%);
            transform: translateY(-102%);
          }
          25% {
            -webkit-transform: translateY(-100%);
            transform: translateY(-100%);
          }
          35% {
            -webkit-transform: translateY(-202%);
            transform: translateY(-202%);
          }
          50% {
            -webkit-transform: translateY(-200%);
            transform: translateY(-200%);
          }
          60% {
            -webkit-transform: translateY(-302%);
            transform: translateY(-302%);
          }
          75% {
            -webkit-transform: translateY(-300%);
            transform: translateY(-300%);
          }
          85% {
            -webkit-transform: translateY(-402%);
            transform: translateY(-402%);
          }
          100% {
            -webkit-transform: translateY(-400%);
            transform: translateY(-400%);
          }
        }

        .theme-toggle {
          position: absolute;
          top: 20px;
          right: 20px;
          background: ${currentTheme.buttonBg};
          border: none;
          border-radius: 12px;
          padding: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .theme-toggle:hover {
          background: ${currentTheme.buttonHover};
          transform: scale(1.05);
        }

        .theme-toggle:active {
          transform: scale(0.95);
        }
      `}</style>
      
      <button 
        className="theme-toggle"
        onClick={() => setIsDark(!isDark)}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={24} color="#fbbf24" /> : <Moon size={24} color="#6366f1" />}
      </button>

      <div className="card">
        <div className="loader">
          <p>loading</p>
          <div className="words">
            <span className="word">buttons</span>
            <span className="word">forms</span>
            <span className="word">switches</span>
            <span className="word">cards</span>
            <span className="word">buttons</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loader;
