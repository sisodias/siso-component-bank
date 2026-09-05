"use client"

import React, { useState, useCallback } from 'react';
import { Moon, Sun, Fingerprint, Shield, CheckCircle, XCircle, Scan } from 'lucide-react';

// Simple theme hook
const useTheme = () => {
  const [darkMode, setDarkMode] = useState(true);
  return { darkMode, toggleTheme: () => setDarkMode(!darkMode) };
};

// Animated progress circle
const ProgressCircle = ({ progress, darkMode }) => (
  <div className="w-full relative w-24 h-24">
    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
      <circle
        cx="50" cy="50" r="45"
        stroke={darkMode ? '#4b5563' : '#e5e7eb'}
        strokeWidth="8" fill="none"
      />
      <circle
        cx="50" cy="50" r="45"
        stroke="url(#gradient)"
        strokeWidth="8" fill="none"
        strokeDasharray="283"
        strokeDashoffset={283 - (progress / 100) * 283}
        strokeLinecap="round"
        className="transition-all duration-300 ease-out"
      />
      <defs>
        <linearGradient id="gradient">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        {Math.round(progress)}%
      </span>
    </div>
  </div>
);

// Fingerprint scanner component
const FingerprintScanner = ({ 
  onScanComplete, 
  className = "",
  autoReset = true 
}) => {
  const { darkMode } = useTheme();
  const [state, setState] = useState('idle'); // idle, scanning, success, failed
  const [progress, setProgress] = useState(0);

  const startScan = useCallback(() => {
    setState('scanning');
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          const result = Math.random() > 0.2 ? 'success' : 'failed';
          setState(result);
          onScanComplete?.(result);
          
          if (autoReset) {
            setTimeout(() => setState('idle'), 3000);
          }
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 150);
  }, [onScanComplete, autoReset]);

  const getIcon = () => {
    switch (state) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500 animate-bounce" />;
      case 'failed':
        return <XCircle className="w-16 h-16 text-red-500 animate-pulse" />;
      case 'scanning':
        return <Fingerprint className="w-16 h-16 text-blue-500 animate-spin" />;
      default:
        return <Fingerprint className={`w-16 h-16 ${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-500'} transition-colors duration-300`} />;
    }
  };

  const getMessage = () => {
    switch (state) {
      case 'scanning': return 'Scanning...';
      case 'success': return 'Access Granted!';
      case 'failed': return 'Access Denied';
      default: return 'Touch to scan';
    }
  };

  return (
    <div className={`
      relative overflow-hidden rounded-3xl p-8 text-center transition-all duration-500 transform hover:scale-105
      ${darkMode ? 'bg-gray-800 border-gray-600 shadow-2xl shadow-gray-900/50' : 'bg-white border-gray-200 shadow-2xl shadow-blue-500/20'}
      border-2 ${state === 'scanning' ? 'border-blue-400' : ''}
      ${className}
    `}>
      
      {/* Animated background glow */}
      {state === 'scanning' && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 animate-pulse" />
      )}
      
      {/* Floating particles */}
      {state === 'scanning' && (
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping"
              style={{
                left: `${20 + i * 12}%`,
                top: `${30 + i * 8}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10">
        {/* Icon container */}
        <div className={`
          w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-300
          ${state === 'success' ? (darkMode ? 'bg-green-900/40 scale-110' : 'bg-green-100 scale-110') :
            state === 'failed' ? (darkMode ? 'bg-red-900/40 scale-110' : 'bg-red-100 scale-110') :
            state === 'scanning' ? (darkMode ? 'bg-blue-900/40' : 'bg-blue-100') :
            (darkMode ? 'bg-gray-700 hover:bg-blue-900/30' : 'bg-gray-100 hover:bg-blue-50')
          }
        `}>
          {getIcon()}
        </div>

        {/* Progress circle (only during scanning) */}
        {state === 'scanning' && (
          <div className="flex justify-center mb-6">
            <ProgressCircle progress={progress} darkMode={darkMode} />
          </div>
        )}

        {/* Title and message */}
        <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          Fingerprint Scanner
        </h3>
        
        <p className={`text-lg mb-6 transition-colors duration-300 ${
          state === 'success' ? (darkMode ? 'text-green-400' : 'text-green-600') :
          state === 'failed' ? (darkMode ? 'text-red-400' : 'text-red-600') :
          state === 'scanning' ? (darkMode ? 'text-blue-400' : 'text-blue-600') :
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {getMessage()}
        </p>

        {/* Action button */}
        {state === 'idle' && (
          <button
            onClick={startScan}
            className={`group w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg hover:shadow-xl ${darkMode ? 'shadow-gray-900/50' : 'shadow-blue-500/25'}`}
          >
            <Scan className="w-5 h-5 mr-2 group-hover:animate-spin" />
            Start Scan
          </button>
        )}
      </div>

      {/* Scanning border animation */}
      {state === 'scanning' && (
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse" />
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse" 
               style={{ animationDelay: '1s' }} />
        </div>
      )}
    </div>
  );
};

// Main app component
const App = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [scanResults, setScanResults] = useState([]);
  const [hasScanned, setHasScanned] = useState(false);

  const handleScanComplete = (result) => {
    setHasScanned(true);
    setScanResults(prev => [...prev.slice(-2), {
      result,
      time: new Date().toLocaleTimeString(),
      id: Date.now()
    }]);
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 ${
      darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-white'
    }`}>
      
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800/90' : 'bg-white/80'} backdrop-blur-lg border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'} sticky top-0 z-50`}>
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'}`}>
              SecureScan
            </h1>
          </div>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
              darkMode ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-gray-100' : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'}`}>
            Biometric Authentication
          </h2>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Advanced fingerprint scanning technology
          </p>
        </div>

        <div className="flex justify-center">
          <div className="max-w-md w-full">
            <FingerprintScanner onScanComplete={handleScanComplete} />
          </div>
        </div>

        {/* Status panel - shows after first scan */}
        {hasScanned && (
          <div className="flex justify-center mt-8">
            <div className={`max-w-md w-full ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-lg`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                System Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Scanner</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                    <span className="text-sm text-green-400 font-medium">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Security</span>
                  <span className="text-sm text-blue-400 font-medium">Active</span>
                </div>
              </div>

              {scanResults.length > 0 && (
                <div className="mt-6">
                  <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Recent Scans
                  </h4>
                  <div className="space-y-2">
                    {scanResults.slice(-3).reverse().map(scan => (
                      <div key={scan.id} className={`p-2 rounded-lg text-xs flex justify-between ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                          {scan.time}
                        </span>
                        <span className={scan.result === 'success' ? (darkMode ? 'text-green-400' : 'text-green-600') : (darkMode ? 'text-red-400' : 'text-red-600')}>
                          {scan.result === 'success' ? '✓' : '✗'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;