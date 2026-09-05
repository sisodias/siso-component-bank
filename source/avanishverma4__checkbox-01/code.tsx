import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CheckboxItem = ({ id, label, checked, onChange, disabled = false }) => {
  return (
    <div className={`flex items-center gap-3 py-2 ${disabled ? 'opacity-50' : ''}`}>
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative w-5 h-5 rounded border-2 transition-colors focus:outline-none ${
          disabled 
            ? 'border-gray-300 cursor-not-allowed bg-gray-100' 
            : 'border-gray-400 hover:border-gray-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer'
        }`}
        aria-checked={checked}
        aria-disabled={disabled}
        role="checkbox"
      >
        {checked && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`absolute inset-0 rounded flex items-center justify-center ${
              disabled ? 'bg-gray-400' : 'bg-purple-600'
            }`}
          >
            <motion.svg
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M2 7L5.5 10.5L12 3.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.div>
        )}
      </button>
      <label
        htmlFor={id}
        className={`text-base select-none ${
          disabled ? 'text-gray-500 cursor-not-allowed' : 'text-gray-900 cursor-pointer'
        }`}
        onClick={() => !disabled && onChange(!checked)}
      >
        {label}
      </label>
    </div>
  );
};

export default function App() {
  const [reactJS, setReactJS] = useState(false);
  const [angularJS, setAngularJS] = useState(true);
  const [java, setJava] = useState(false);
  const [python, setPython] = useState(false);

  return (
    <div className="w-full min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Orthogonal Grid Background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(0,0,0,0.05)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Programming Languages & Frameworks
          </h2>
          
          <div className="space-y-1">
            <CheckboxItem
              id="react-js"
              label="React JS"
              checked={reactJS}
              onChange={setReactJS}
            />
            
            <CheckboxItem
              id="angular-js"
              label="Angular JS"
              checked={angularJS}
              onChange={setAngularJS}
            />

            <CheckboxItem
              id="java"
              label="Java"
              checked={java}
              onChange={setJava}
            />

            <CheckboxItem
              id="python"
              label="Python"
              checked={python}
              onChange={setPython}
              disabled={true}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}