import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Reusable Radio Button Component
const RadioButton = ({ id, name, value, checked, onChange, disabled = false, label, theme }) => {
  const hoverBgColor = theme === 'dark' ? '#1f2937' : '#f3f4f6';
  const textColor = disabled 
    ? (theme === 'dark' ? '#6b7280' : '#9ca3af')
    : (theme === 'dark' ? '#f3f4f6' : '#111827');

  return (
    <motion.label
      htmlFor={id}
      className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-200 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      whileHover={!disabled ? { backgroundColor: hoverBgColor } : {}}
    >
      <div className="relative flex items-center justify-center">
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
        />
        <motion.div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            disabled
              ? 'border-gray-300 dark:border-gray-600'
              : checked
              ? 'border-purple-500'
              : ''
          }`}
          animate={{
            borderColor: disabled 
              ? (theme === 'dark' ? '#4b5563' : '#d1d5db')
              : checked
              ? '#a855f7'
              : (theme === 'dark' ? '#6b7280' : '#9ca3af')
          }}
          transition={{ duration: 0.3 }}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          <AnimatePresence>
            {checked && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={`w-2.5 h-2.5 rounded-full ${
                  disabled ? 'bg-gray-400' : 'bg-purple-500'
                }`}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <motion.span 
        className="text-base"
        animate={{ color: textColor }}
        transition={{ duration: 0.3 }}
      >
        {label}
      </motion.span>
    </motion.label>
  );
};

// Orthogonal Grid Background Component
const OrthogonalGrid = ({ theme }) => {
  return (
    <motion.div 
      className="absolute inset-0 overflow-hidden pointer-events-none"
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <motion.path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              strokeWidth="0.5"
              animate={{
                stroke: theme === 'dark' ? '#374151' : '#e5e7eb'
              }}
              transition={{ duration: 0.5 }}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </motion.div>
  );
};

// Main Theme Switcher Component
const ThemeSwitcher = () => {
  const [theme, setTheme] = useState('light');

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    
    // Apply theme to document immediately
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    }
    // System default is disabled, so no action needed
  };

  // Apply initial theme on mount
  React.useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <motion.div 
      className="w-full min-h-screen relative overflow-hidden"
      animate={{ 
        backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb'
      }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <OrthogonalGrid theme={theme} />
      
      <div className="relative z-10 flex items-start justify-center min-h-screen p-8 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <motion.div 
            className="rounded-2xl shadow-xl p-6"
            animate={{ 
              backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff'
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <motion.button
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  color: theme === 'dark' ? '#d1d5db' : '#374151'
                }}
                transition={{ duration: 0.5 }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </motion.button>
              <motion.h1 
                className="text-xl font-semibold"
                animate={{
                  color: theme === 'dark' ? '#f3f4f6' : '#111827'
                }}
                transition={{ duration: 0.5 }}
              >
                Display settings
              </motion.h1>
            </div>

            {/* Radio Button Group */}
            <div className="space-y-1">
              <RadioButton
                id="light"
                name="theme"
                value="light"
                checked={theme === 'light'}
                onChange={handleThemeChange}
                label="Light"
                theme={theme}
              />
              
              <RadioButton
                id="dark"
                name="theme"
                value="dark"
                checked={theme === 'dark'}
                onChange={handleThemeChange}
                label="Dark"
                theme={theme}
              />
              
              <RadioButton
                id="system"
                name="theme"
                value="system"
                checked={theme === 'system'}
                onChange={handleThemeChange}
                disabled={true}
                label="System default"
                theme={theme}
              />
            </div>

            {/* Info Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                color: theme === 'dark' ? '#9ca3af' : '#6b7280'
              }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-6 text-sm text-center"
            >
              Current theme: <span className="font-medium capitalize">{theme}</span>
            </motion.p>
          </motion.div>

          {/* Additional Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              backgroundColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : '#faf5ff',
              borderColor: theme === 'dark' ? '#6b21a8' : '#e9d5ff'
            }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 p-4 rounded-lg border"
          >
            <motion.p 
              className="text-sm"
              animate={{
                color: theme === 'dark' ? '#e9d5ff' : '#6b21a8'
              }}
              transition={{ duration: 0.5 }}
            >
              💡 <span className="font-medium">Tip:</span> The system default option is currently disabled. 
              This would typically match your device's theme preference.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ThemeSwitcher;