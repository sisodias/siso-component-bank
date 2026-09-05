import React, { useState, useEffect } from 'react';

const MorphingLoader = ({ 
  size = 60, 
  text = "Loading", 
  subtitle = "Please wait while we prepare your content",
  showText = true,
  showSubtitle = true,
  className = "",
  colors = [
    ['#3b82f6', '#8b5cf6'],
    ['#10b981', '#3b82f6'],
    ['#f59e0b', '#ec4899'],
    ['#8b5cf6', '#ec4899'],
    ['#3b82f6', '#10b981']
  ]
}) => {
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColorIndex(prev => (prev + 1) % colors.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [colors.length]);

  const currentColors = colors[currentColorIndex];

  const morphKeyframes = `
    @keyframes morph-${currentColorIndex} {
      0%, 100% {
        border-radius: 50%;
        transform: scale(1) rotate(0deg);
        background: linear-gradient(45deg, ${currentColors[0]}, ${currentColors[1]});
      }
      12.5% {
        border-radius: 70% 30% 30% 70% / 60% 60% 40% 40%;
        transform: scale(0.85) rotate(45deg);
        background: linear-gradient(45deg, ${currentColors[1]}, ${currentColors[0]});
      }
      25% {
        border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
        transform: scale(0.95) rotate(90deg);
        background: linear-gradient(45deg, ${currentColors[0]}, ${currentColors[1]});
      }
      37.5% {
        border-radius: 40% 60% 60% 40% / 70% 30% 70% 30%;
        transform: scale(1.05) rotate(135deg);
        background: linear-gradient(45deg, ${currentColors[1]}, ${currentColors[0]});
      }
      50% {
        border-radius: 20% 80% 50% 50% / 50% 15% 85% 50%;
        transform: scale(1.1) rotate(180deg);
        background: linear-gradient(45deg, ${currentColors[0]}, ${currentColors[1]});
      }
      62.5% {
        border-radius: 60% 40% 70% 30% / 40% 60% 40% 60%;
        transform: scale(1.05) rotate(225deg);
        background: linear-gradient(45deg, ${currentColors[1]}, ${currentColors[0]});
      }
      75% {
        border-radius: 60% 40% 30% 70% / 60% 40% 60% 40%;
        transform: scale(0.95) rotate(270deg);
        background: linear-gradient(45deg, ${currentColors[0]}, ${currentColors[1]});
      }
      87.5% {
        border-radius: 30% 70% 40% 60% / 70% 30% 70% 30%;
        transform: scale(0.85) rotate(315deg);
        background: linear-gradient(45deg, ${currentColors[1]}, ${currentColors[0]});
      }
    }
  `;

  return (
    <div className={`flex flex-col items-center justify-center space-y-8 ${className}`}>
      <style>{`
        ${morphKeyframes}
        
        .morph-loader {
          position: relative;
          animation: spin 2s linear infinite, pulse 1.5s ease-in-out infinite, deform 3s ease-in-out infinite;
        }
        
        .morph-loader::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, ${currentColors[0]}, ${currentColors[1]});
          border-radius: 50%;
          animation: morph-${currentColorIndex} 4s ease-in-out infinite;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes deform {
          0%, 100% { transform: skewX(0deg) skewY(0deg); }
          25% { transform: skewX(10deg) skewY(5deg); }
          50% { transform: skewX(-5deg) skewY(10deg); }
          75% { transform: skewX(5deg) skewY(-5deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        .loading-text {
          font-weight: 600;
          color: #3b82f6;
          animation: textPulse 2s ease-in-out infinite;
        }
        
        @keyframes textPulse {
          0%, 100% {
            opacity: 0.7;
            letter-spacing: 0px;
          }
          50% {
            opacity: 1;
            letter-spacing: 1px;
          }
        }
        
        .dots::after {
          content: '.';
          animation: dots 1.5s steps(5, end) infinite;
        }
        
        @keyframes dots {
          0%, 20% { content: '.'; }
          40% { content: '..'; }
          60% { content: '...'; }
          80%, 100% { content: ''; }
        }
      `}</style>
      
      <div 
        className="morph-loader mx-auto" 
        style={{ width: `${size}px`, height: `${size}px` }}
      />
      
      {showText && (
        <div className="loading-text text-xl flex justify-center">
          <span>{text}</span>
          <span className="dots"></span>
        </div>
      )}
      
      {showSubtitle && (
        <p className="text-gray-500 text-sm mt-4">{subtitle}</p>
      )}
    </div>
  );
};

export default MorphingLoader