import React, { useState, useEffect, useRef } from 'react';

// Reusable Submit Button Component
const SubmitButton = ({ 
  onClick,
  disabled = false,
  className = '',
  variant = 'gradient',
  size = 'md'
}: {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'gradient' | 'solid' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}) => {
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const variantClasses = {
    gradient: disabled 
      ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
      : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-110',
    solid: disabled
      ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
      : 'bg-violet-600 hover:bg-violet-700 shadow-lg hover:shadow-xl transform hover:scale-110',
    outline: disabled
      ? 'border-2 border-gray-300 dark:border-gray-700 cursor-not-allowed'
      : 'border-2 border-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 transform hover:scale-110'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative ${sizeClasses[size]} rounded-full transition-all duration-300 ${variantClasses[variant]} ${className}`}
    >
      <svg 
        className={`${iconSizes[size]} transition-all duration-300 ${
          disabled 
            ? 'text-gray-500 dark:text-gray-400'
            : variant === 'outline' 
              ? 'text-violet-600 dark:text-violet-400 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
              : 'text-white transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
        }`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
      {!disabled && (
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300" />
      )}
    </button>
  );
};

// Reusable Icon Button Component
const IconButton = ({ 
  children, 
  onClick,
  className = '',
  tooltip,
  variant = 'glass',
  size = 'md'
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  tooltip?: string;
  variant?: 'glass' | 'solid' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}) => {
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4'
  };

  const variantClasses = {
    glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur hover:bg-gray-100 dark:hover:bg-gray-700',
    solid: 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700',
    outline: 'border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
  };

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`${sizeClasses[size]} rounded-xl ${variantClasses[variant]} transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-110 ${className}`}
        title={tooltip}
      >
        {children}
      </button>
      {tooltip && (
        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          {tooltip}
        </span>
      )}
    </div>
  );
};

// Reusable Quick Action Button Component
const QuickActionButton = ({
  icon,
  text,
  onClick,
  variant = 'glass',
  size = 'md'
}: {
  icon: string;
  text: string;
  onClick?: () => void;
  variant?: 'glass' | 'solid';
  size?: 'sm' | 'md' | 'lg';
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  };

  const variantClasses = {
    glass: 'bg-white/90 dark:bg-gray-800/80 backdrop-blur text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 border border-gray-200/50 dark:border-transparent',
    solid: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200/50 dark:border-transparent'
  };

  return (
    <button
      onClick={onClick}
      className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-full font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105`}
    >
      <span className="flex items-center justify-center gap-1 sm:gap-2">
        <span>{icon}</span>
        <span className="text-xs sm:text-sm">{text}</span>
      </span>
    </button>
  );
};

// Reusable Action Button Component
const ActionButton = ({
  icon,
  text,
  onClick,
  color = 'purple',
  size = 'md'
}: {
  icon: string;
  text: string;
  onClick?: () => void;
  color?: 'pink' | 'purple' | 'blue' | 'green';
  size?: 'sm' | 'md' | 'lg';
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const colorClasses = {
    pink: 'bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800 hover:from-pink-100 hover:to-pink-200 dark:hover:from-pink-900/30 dark:hover:to-pink-800/30',
    purple: 'bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-900/30 dark:hover:to-purple-800/30',
    blue: 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30',
    green: 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 hover:from-green-100 hover:to-green-200 dark:hover:from-green-900/30 dark:hover:to-green-800/30'
  };

  return (
    <button 
      onClick={onClick}
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 group`}
    >
      <span className="flex items-center gap-2">
        <span className="group-hover:rotate-12 transition-transform duration-300 inline-block">{icon}</span>
        {text}
      </span>
    </button>
  );
};

// Reusable Auto-resize Textarea Component
const AutoResizeTextarea = ({
  value,
  onChange,
  onKeyDown,
  placeholder = 'Type here...',
  maxHeight = 300,
  minHeight = 100,
  className = ''
}: {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  maxHeight?: number;
  minHeight?: number;
  className?: string;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`;
    }
  }, [value, maxHeight]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className={`w-full bg-transparent resize-none outline-none ${className}`}
      style={{ minHeight: `${minHeight}px`, maxHeight: `${maxHeight}px` }}
      rows={2}
    />
  );
};

// Reusable Chat Input Component
const ChatInput = ({
  value,
  onChange,
  onSubmit,
  placeholder = '✨ Ask me anything...',
  showAttachments = true,
  className = ''
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  showAttachments?: boolean;
  className?: string;
}) => {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setIsTyping(value.length > 0);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className={`relative bg-white dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-xl dark:shadow-2xl transition-all duration-300 ${isTyping ? 'ring-4 ring-purple-500/30' : ''} ${className}`}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl opacity-10 dark:opacity-20 blur-xl" />
      
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl border border-gray-300/80 dark:border-gray-700/50">
        <div className="p-2">
          <AutoResizeTextarea
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="px-4 sm:px-5 py-3 sm:py-4 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base leading-relaxed"
          />
          
          <div className="flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 border-t border-gray-100 dark:border-gray-800">
            {showAttachments && (
              <div className="flex items-center gap-1 sm:gap-2">
                <IconButton tooltip="Attach file" size="sm" variant="glass">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </IconButton>
                
                <IconButton tooltip="Add image" size="sm" variant="glass">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </IconButton>
                
                <IconButton tooltip="Voice input" size="sm" variant="glass">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </IconButton>
              </div>
            )}
            
            <div className="flex items-center gap-2 sm:gap-3 ml-auto">
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                {value.length > 0 && `${value.length} characters`}
              </span>
              
              <SubmitButton
                onClick={onSubmit}
                disabled={!value.trim()}
                size="sm"
                variant="gradient"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Page Component
const AIStarterPage = () => {
  const [prompt, setPrompt] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Always default to dark mode
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  }, []);

  const handleSubmit = () => {
    if (prompt.trim()) {
      console.log('Submitting:', prompt);
    }
  };

  const quickActions = [
    { 
      icon: '💡', 
      text: 'Creative ideas',
      prompt: 'Help me brainstorm creative ideas for a new mobile app that helps people build better habits and track their personal growth journey'
    },
    { 
      icon: '📝', 
      text: 'Write content',
      prompt: 'Write an engaging blog post about the future of artificial intelligence in everyday life, focusing on practical applications that will impact people in the next 5 years'
    },
    { 
      icon: '🔍', 
      text: 'Analyze data',
      prompt: 'Analyze the key trends in e-commerce growth over the past year and provide insights on what businesses should focus on to stay competitive'
    },
    { 
      icon: '🎨', 
      text: 'Create design',
      prompt: 'Design a modern, minimalist landing page for a sustainable fashion brand targeting eco-conscious millennials with a focus on clean aesthetics and user experience'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden w-full sm:max-w-3xl">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-purple-50/50 to-indigo-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/50 to-transparent dark:via-black/30" />
      </div>
      
      {/* Floating gradient orbs - hidden on mobile */}
      <div className="hidden sm:block fixed top-20 left-20 w-72 h-72 bg-gradient-to-br from-purple-300 to-pink-300 dark:from-purple-400 dark:to-pink-400 rounded-full filter blur-3xl opacity-20 dark:opacity-15 animate-pulse" />
      <div className="hidden sm:block fixed bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-300 to-indigo-300 dark:from-blue-400 dark:to-indigo-400 rounded-full filter blur-3xl opacity-20 dark:opacity-15 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="hidden sm:block fixed top-40 right-40 w-64 h-64 bg-gradient-to-br from-green-300 to-cyan-300 dark:from-green-400 dark:to-cyan-400 rounded-full filter blur-3xl opacity-15 dark:opacity-10 animate-pulse" style={{ animationDelay: '4s' }} />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="flex flex-col items-center">
            <div className="text-center mb-8 sm:mb-10 px-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Build something amazing
                </span>
              </h1>
              
              <p className="text-gray-700 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10">
               Create apps and websites by chatting with AI
              </p>
              
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-3 mt-6 px-2 max-w-md sm:max-w-none mx-auto">
                {quickActions.map((action, idx) => (
                  <QuickActionButton
                    key={idx}
                    icon={action.icon}
                    text={action.text}
                    onClick={() => setPrompt(action.prompt)}
                    variant="glass"
                    size="md"
                  />
                ))}
              </div>
            </div>

            <div className="w-full max-w-4xl mx-auto">
              <ChatInput
                value={prompt}
                onChange={setPrompt}
                onSubmit={handleSubmit}
                placeholder="✨ Ask me anything..."
                showAttachments={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIStarterPage;