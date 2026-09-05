"use client";
import React, { useState } from "react";
import { Send, Check, Loader2 } from "lucide-react";

export const StatefulButton = ({ onClick, children, ...props }) => {
  const [state, setState] = useState('idle'); 
  
  const handleClick = async () => {
    if (state === 'loading') return;
    
    setState('loading');
    try {
      await onClick();
      setState('success');
      setTimeout(() => setState('idle'), 2000);
    } catch (error) {
      setState('idle');
    }
  };

  const getButtonContent = () => {
    switch (state) {
      case 'loading':
        return (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Sending...
          </>
        );
      case 'success':
        return (
          <>
            <Check className="w-4 h-4 mr-2" />
            Sent!
          </>
        );
      default:
        return (
          <>
            <Send className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-0.5" />
            {children}
          </>
        );
    }
  };

  const getButtonStyles = () => {
    const baseStyles = "group relative px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 ease-out transform active:scale-95 shadow-lg hover:shadow-xl";
    
    switch (state) {
      case 'loading':
        return `${baseStyles} bg-gradient-to-r from-blue-500 to-purple-600 cursor-wait scale-105`;
      case 'success':
        return `${baseStyles} bg-gradient-to-r from-green-500 to-emerald-600 scale-105`;
      default:
        return `${baseStyles} bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 hover:scale-105 hover:-translate-y-0.5`;
    }
  };

  return (
    <button
      onClick={handleClick}
      className={getButtonStyles()}
      disabled={state === 'loading'}
      {...props}
    >
      <div className="flex items-center justify-center">
        {getButtonContent()}
      </div>
      
      {/* Animated background pulse for loading state */}
      {state === 'loading' && (
        <div className="absolute inset-0 rounded-xl bg-white opacity-20 animate-pulse" />
      )}
      
      {/* Success celebration effect */}
      {state === 'success' && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/30 to-emerald-400/30 animate-ping" />
      )}
    </button>
  );
};

