import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';

// Notification Context for managing global notifications
const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = {
      id,
      ...notification,
      timestamp: Date.now()
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-dismiss if duration is set
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
    
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const removeAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    removeAllNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// Individual Notification Component
const Notification = ({ notification, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  const { id, type = 'info', title, message, duration = 5000, actions = [] } = notification;

  useEffect(() => {
    if (duration > 0) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const elapsed = Date.now() - notification.timestamp;
          const remaining = Math.max(0, duration - elapsed);
          return (remaining / duration) * 100;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [duration, notification.timestamp]);

  const handleRemove = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onRemove(id), 300);
  }, [id, onRemove]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success': return 'border-l-green-500';
      case 'error': return 'border-l-red-500';
      case 'warning': return 'border-l-yellow-500';
      case 'info':
      default: return 'border-l-blue-500';
    }
  };

  return (
    <div
      className={`
        relative bg-card border border-l-4 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out
        ${getBorderColor()}
        ${isExiting ? 'transform translate-x-full opacity-0' : 'transform translate-x-0 opacity-100'}
      `}
      style={{ maxWidth: '400px', minWidth: '300px' }}
    >
      {/* Progress bar */}
      {duration > 0 && (
        <div className="absolute top-0 left-0 h-1 bg-primary transition-all duration-75 ease-linear" 
             style={{ width: `${progress}%` }} />
      )}
      
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="text-sm font-medium text-foreground mb-1">
                {title}
              </h4>
            )}
            <p className="text-sm text-muted-foreground">
              {message}
            </p>
            
            {actions.length > 0 && (
              <div className="flex gap-2 mt-3">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      action.onClick();
                      if (action.dismissOnClick !== false) {
                        handleRemove();
                      }
                    }}
                    className={`text-xs font-medium px-3 py-1 rounded transition-colors ${
                      action.variant === 'primary'
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'text-primary hover:bg-primary/10'
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button
            onClick={handleRemove}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Notification Container
const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};

// Demo Component
const NotificationDemo = () => {
  // const [theme, setTheme] = useState('light');
  const { addNotification, removeAllNotifications, notifications } = useNotifications();

  const showSuccessNotification = () => {
    addNotification({
      type: 'success',
      title: 'Success!',
      message: 'Your changes have been saved successfully.',
      duration: 5000
    });
  };

  const showErrorNotification = () => {
    addNotification({
      type: 'error',
      title: 'Error occurred',
      message: 'Failed to save your changes. Please try again.',
      duration: 7000,
      actions: [
        {
          label: 'Retry',
          variant: 'primary',
          onClick: () => {
            addNotification({
              type: 'info',
              message: 'Retrying operation...',
              duration: 3000
            });
          }
        },
        {
          label: 'Dismiss',
          onClick: () => {}
        }
      ]
    });
  };

  const showWarningNotification = () => {
    addNotification({
      type: 'warning',
      title: 'Warning',
      message: 'Your session will expire in 5 minutes. Please save your work.',
      duration: 10000,
      actions: [
        {
          label: 'Extend Session',
          variant: 'primary',
          onClick: () => {
            addNotification({
              type: 'success',
              message: 'Session extended successfully.',
              duration: 3000
            });
          }
        }
      ]
    });
  };

  const showInfoNotification = () => {
    addNotification({
      type: 'info',
      title: 'New Feature Available',
      message: 'Check out our new dashboard analytics feature.',
      duration: 6000,
      actions: [
        {
          label: 'Learn More',
          variant: 'primary',
          onClick: () => {
            addNotification({
              type: 'info',
              message: 'Opening documentation...',
              duration: 2000
            });
          }
        },
        {
          label: 'Later',
          onClick: () => {}
        }
      ]
    });
  };

  const showPersistentNotification = () => {
    addNotification({
      type: 'info',
      title: 'Persistent Notification',
      message: 'This notification will stay until manually dismissed.',
      duration: 0 // Never auto-dismiss
    });
  };


  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <style jsx global>{`
        :root {
          --background: 0 0% 100%;
          --foreground: 222.2 84% 4.9%;
          --card: 0 0% 100%;
          --card-foreground: 222.2 84% 4.9%;
          --popover: 0 0% 100%;
          --popover-foreground: 222.2 84% 4.9%;
          --primary: 222.2 47.4% 11.2%;
          --primary-foreground: 210 40% 98%;
          --secondary: 210 40% 96%;
          --secondary-foreground: 222.2 47.4% 11.2%;
          --muted: 210 40% 96%;
          --muted-foreground: 215.4 16.3% 46.9%;
          --accent: 210 40% 96%;
          --accent-foreground: 222.2 47.4% 11.2%;
          --destructive: 0 84.2% 60.2%;
          --destructive-foreground: 210 40% 98%;
          --border: 214.3 31.8% 91.4%;
          --input: 214.3 31.8% 91.4%;
          --ring: 222.2 47.4% 11.2%;
          --radius: 0.5rem;
        }
        
        .dark {
          --background: 222.2 84% 4.9%;
          --foreground: 210 40% 98%;
          --card: 222.2 84% 4.9%;
          --card-foreground: 210 40% 98%;
          --popover: 222.2 84% 4.9%;
          --popover-foreground: 210 40% 98%;
          --primary: 210 40% 98%;
          --primary-foreground: 222.2 47.4% 11.2%;
          --secondary: 217.2 32.6% 17.5%;
          --secondary-foreground: 210 40% 98%;
          --muted: 217.2 32.6% 17.5%;
          --muted-foreground: 215 20.2% 65.1%;
          --accent: 217.2 32.6% 17.5%;
          --accent-foreground: 210 40% 98%;
          --destructive: 0 62.8% 30.6%;
          --destructive-foreground: 210 40% 98%;
          --border: 217.2 32.6% 17.5%;
          --input: 217.2 32.6% 17.5%;
          --ring: 212.7 26.8% 83.9%;
        }
        
        * { border-color: hsl(var(--border)); }
        body { background-color: hsl(var(--background)); color: hsl(var(--foreground)); }
        .bg-background { background-color: hsl(var(--background)); }
        .text-foreground { color: hsl(var(--foreground)); }
        .bg-card { background-color: hsl(var(--card)); }
        .text-card-foreground { color: hsl(var(--card-foreground)); }
        .bg-muted { background-color: hsl(var(--muted)); }
        .text-muted-foreground { color: hsl(var(--muted-foreground)); }
        .bg-primary { background-color: hsl(var(--primary)); }
        .text-primary-foreground { color: hsl(var(--primary-foreground)); }
        .text-primary { color: hsl(var(--primary)); }
        .border-input { border-color: hsl(var(--input)); }
        .bg-muted\\/20 { background-color: hsl(var(--muted) / 0.2); }
        .hover\\:bg-primary\\/90:hover { background-color: hsl(var(--primary) / 0.9); }
        .hover\\:bg-primary\\/10:hover { background-color: hsl(var(--primary) / 0.1); }
        .hover\\:text-foreground:hover { color: hsl(var(--foreground)); }
        .hover\\:bg-accent:hover { background-color: hsl(var(--accent)); }
        .hover\\:text-accent-foreground:hover { color: hsl(var(--accent-foreground)); }
        .border-l-green-500 { border-left-color: #10b981; }
        .border-l-red-500 { border-left-color: #ef4444; }
        .border-l-yellow-500 { border-left-color: #f59e0b; }
        .border-l-blue-500 { border-left-color: #3b82f6; }
      `}</style>

      <div className="container mx-auto p-4 sm:p-6 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1" />
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Notification System</h1>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                Professional toast notifications with actions and animations
              </p>
            </div>
  
          </div>
        </div>

        {/* Demo Controls */}
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Try Different Notifications</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <button
              onClick={showSuccessNotification}
              className="flex items-center justify-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-green-700 dark:text-green-300">Success</span>
            </button>

            <button
              onClick={showErrorNotification}
              className="flex items-center justify-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-red-700 dark:text-red-300">Error</span>
            </button>

            <button
              onClick={showWarningNotification}
              className="flex items-center justify-center gap-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
            >
              <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-yellow-700 dark:text-yellow-300">Warning</span>
            </button>

            <button
              onClick={showInfoNotification}
              className="flex items-center justify-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-blue-700 dark:text-blue-300">Info</span>
            </button>

            <button
              onClick={showPersistentNotification}
              className="flex items-center justify-center gap-2 p-4 bg-muted/20 border rounded-lg hover:bg-muted/30 transition-colors"
            >
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-foreground">Persistent</span>
            </button>

            {notifications.length > 0 && (
              <button
                onClick={removeAllNotifications}
                className="flex items-center justify-center gap-2 p-4 bg-muted/20 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="font-medium text-foreground">Clear All</span>
              </button>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Auto-dismiss with progress bar
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Custom actions and buttons
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Smooth slide animations
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Multiple notification types
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Usage</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Success: Confirmations & completions
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Error: Failures & validation errors
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Warning: Important alerts
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Info: General information
                </li>
              </ul>
            </div>
          </div>

          {notifications.length > 0 && (
            <div className="mt-6 p-3 bg-muted/20 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                Active notifications: {notifications.length}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AppDemo = () => {
  return (
    <NotificationProvider>
      <NotificationDemo />
    </NotificationProvider>
  );
};

export default AppDemo;