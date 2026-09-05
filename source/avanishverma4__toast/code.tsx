import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Sun, Moon } from 'lucide-react';

const ToastDemo = () => {
  const [toasts, setToasts] = useState([]);
  const [isDark, setIsDark] = useState(true);

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const toastConfig = {
    success: {
      icon: CheckCircle,
      bgLight: 'bg-green-50 border-green-200',
      bgDark: 'bg-green-900/20 border-green-700',
      iconLight: 'text-green-600',
      iconDark: 'text-green-400',
      textLight: 'text-green-900',
      textDark: 'text-green-100'
    },
    error: {
      icon: AlertCircle,
      bgLight: 'bg-red-50 border-red-200',
      bgDark: 'bg-red-900/20 border-red-700',
      iconLight: 'text-red-600',
      iconDark: 'text-red-400',
      textLight: 'text-red-900',
      textDark: 'text-red-100'
    },
    warning: {
      icon: AlertTriangle,
      bgLight: 'bg-yellow-50 border-yellow-200',
      bgDark: 'bg-yellow-900/20 border-yellow-700',
      iconLight: 'text-yellow-600',
      iconDark: 'text-yellow-400',
      textLight: 'text-yellow-900',
      textDark: 'text-yellow-100'
    },
    info: {
      icon: Info,
      bgLight: 'bg-blue-50 border-blue-200',
      bgDark: 'bg-blue-900/20 border-blue-700',
      iconLight: 'text-blue-600',
      iconDark: 'text-blue-400',
      textLight: 'text-blue-900',
      textDark: 'text-blue-100'
    }
  };

  const Toast = ({ toast }) => {
    const config = toastConfig[toast.type];
    const Icon = config.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, x: 300, scale: 0.9 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm max-w-md ${
          isDark ? `${config.bgDark}` : `${config.bgLight}`
        }`}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? config.iconDark : config.iconLight}`} />
        <p className={`flex-1 text-sm font-medium ${isDark ? config.textDark : config.textLight}`}>
          {toast.message}
        </p>
        <button
          onClick={() => removeToast(toast.id)}
          className={`flex-shrink-0 rounded-md p-1 transition-colors ${
            isDark 
              ? 'hover:bg-white/10 text-gray-400 hover:text-gray-200' 
              : 'hover:bg-black/5 text-gray-500 hover:text-gray-700'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Orthogonal Grid Background */}
      <div className="fixed inset-0 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={() => setIsDark(!isDark)}
          className={`p-3 rounded-full shadow-lg backdrop-blur-sm transition-all ${
            isDark 
              ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Toast Container */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-40 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast toast={toast} />
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Demo Controls */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className={`max-w-md w-full p-8 rounded-2xl shadow-2xl backdrop-blur-sm ${
          isDark ? 'bg-gray-900/80 border border-gray-800' : 'bg-white/80 border border-gray-200'
        }`}>
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Toast Component
          </h1>
          <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Click the buttons below to trigger different toast notifications
          </p>

          <div className="space-y-3">
            <button
              onClick={() => addToast('success', 'Your changes have been saved successfully!')}
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Show Success Toast
            </button>
            
            <button
              onClick={() => addToast('error', 'Something went wrong. Please try again.')}
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Show Error Toast
            </button>
            
            <button
              onClick={() => addToast('warning', 'Your session will expire in 5 minutes.')}
              className="w-full px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
            >
              Show Warning Toast
            </button>
            
            <button
              onClick={() => addToast('info', 'New features are now available in settings.')}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Show Info Toast
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastDemo;