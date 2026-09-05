import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

const toastConfig = {
  success: {
    icon: CheckCircle2,
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    darkGradient: 'dark:from-emerald-600 dark:via-teal-600 dark:to-cyan-600',
  },
  error: {
    icon: AlertCircle,
    gradient: 'from-rose-500 via-red-500 to-orange-500',
    darkGradient: 'dark:from-rose-600 dark:via-red-600 dark:to-orange-600',
  },
  info: {
    icon: Info,
    gradient: 'from-blue-500 via-indigo-500 to-cyan-500',
    darkGradient: 'dark:from-blue-600 dark:via-indigo-600 dark:to-cyan-600',
  },
  warning: {
    icon: AlertTriangle,
    gradient: 'from-amber-500 via-orange-500 to-yellow-500',
    darkGradient: 'dark:from-amber-600 dark:via-orange-600 dark:to-yellow-600',
  },
};

const ToastItem: React.FC<{
  toast: Toast;
  onDismiss: (id: string) => void;
}> = ({ toast, onDismiss }) => {
  const config = toastConfig[toast.type];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.3, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.5, filter: 'blur(10px)', transition: { duration: 0.3 } }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
      className="relative overflow-hidden rounded-2xl shadow-2xl backdrop-blur-xl"
    >
      {/* Gradient Border */}
      <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} ${config.darkGradient} opacity-100`} />
      
      {/* Content Container */}
      <div className="relative m-[2px] rounded-2xl bg-white dark:bg-gray-900 px-5 py-4">
        <div className="flex items-start gap-3">
          {/* Icon with Gradient */}
          <div className={`flex-shrink-0 rounded-full bg-gradient-to-br ${config.gradient} ${config.darkGradient} p-1.5`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          
          {/* Message */}
          <p className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100 leading-relaxed pt-0.5">
            {toast.message}
          </p>
          
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDismiss(toast.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
        
        {/* Progress Bar */}
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: (toast.duration || 3000) / 1000, ease: 'linear' }}
          className={`absolute bottom-0 left-0 h-1 w-full origin-left bg-gradient-to-r ${config.gradient} ${config.darkGradient} opacity-50`}
        />
      </div>
    </motion.div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType, duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast = { id, message, type, duration };
    
    setToasts((prev) => [...prev, toast]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <ToastItem toast={toast} onDismiss={dismissToast} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// Demo Component
export default function ToastDemo() {
  const [isDark, setIsDark] = useState(false);

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <ToastProvider>
      <div className={`w-full min-h-screen transition-colors duration-500 relative overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800' 
          : 'bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50'
      }`}>
        {/* Orthogonal Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path 
                  d="M 50 0 L 0 0 0 50" 
                  fill="none" 
                  stroke={isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.4)'} 
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent"
              >
                Toast Component
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 dark:text-gray-400"
              >
                Modern notification system with smooth animations
              </motion.p>
            </div>

            {/* Demo Buttons */}
            <DemoButtons isDark={isDark} setIsDark={setIsDark} />
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}

const DemoButtons: React.FC<{ isDark: boolean; setIsDark: (v: boolean) => void }> = ({ isDark, setIsDark }) => {
  const { showToast } = useToast();

  const buttons = [
    { type: 'success' as ToastType, label: 'Success', message: 'Operation completed successfully!' },
    { type: 'error' as ToastType, label: 'Error', message: 'Something went wrong. Please try again.' },
    { type: 'info' as ToastType, label: 'Info', message: 'Here\'s some useful information for you.' },
    { type: 'warning' as ToastType, label: 'Warning', message: 'Please review your changes before continuing.' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {buttons.map(({ type, label, message }) => (
          <motion.button
            key={type}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => showToast(message, type)}
            className={`px-6 py-4 rounded-xl font-semibold text-white shadow-lg transition-all
              bg-gradient-to-r ${toastConfig[type].gradient} ${toastConfig[type].darkGradient}
              hover:shadow-xl`}
          >
            {label}
          </motion.button>
        ))}
      </div>

      {/* Theme Toggle */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsDark(!isDark)}
        className="w-full px-6 py-4 rounded-xl font-semibold text-gray-700 dark:text-gray-300 
          bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all border-2 
          border-gray-200 dark:border-gray-700"
      >
        {isDark ? '☀️' : '🌙'} Toggle {isDark ? 'Light' : 'Dark'} Mode
      </motion.button>
    </div>
  );
};
