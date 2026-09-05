import { useState, useEffect } from "react";

export function CopyCode() {
  const [copied, setCopied] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [progress, setProgress] = useState(0);
  const code = "21DEV-LEO";
  const duration = 4000;

  useEffect(() => {
    if (copied) {
      // Delay showing confirmation to allow blur-out animation
      const showTimer = setTimeout(() => {
        setShowConfirmation(true);
      }, 400);

      setProgress(0);
      const startTime = Date.now();
      
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / duration) * 100, 100);
        setProgress(newProgress);
        
        if (elapsed >= duration) {
          clearInterval(interval);
          setShowConfirmation(false);
          setTimeout(() => {
            setCopied(false);
            setProgress(0);
          }, 400);
        }
      }, 16);

      return () => {
        clearInterval(interval);
        clearTimeout(showTimer);
      };
    }
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      // Fallback for when Clipboard API is blocked
      const textArea = document.createElement('textarea');
      textArea.value = code;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    setCopied(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#141413] p-4">
      <div className="relative overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-[#1f1f1e] rounded-full px-10 py-3 min-w-80 h-16">
        {/* Progress background */}
        <div 
          className="absolute left-0 top-0 bottom-0 bg-gray-200 dark:bg-[#2a2a29]"
          style={{ 
            width: `${progress}%`,
            opacity: copied ? 1 : 0,
            transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
        
        {/* Original content - code and button */}
        <div 
          className="absolute inset-0 flex items-center justify-between pl-10 pr-3"
          style={{
            opacity: copied ? 0 : 1,
            filter: copied ? 'blur(12px)' : 'blur(0px)',
            transform: copied ? 'scale(0.92)' : 'scale(1)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: copied ? 'none' : 'auto',
            zIndex: copied ? 0 : 20,
          }}
        >
          <span className="text-2xl font-medium tracking-wide text-gray-400 dark:text-[#6b6b6a] select-all truncate max-w-48">
            {code}
          </span>
          <button
            onClick={handleCopy}
            className="bg-white dark:bg-[#2a2a29] hover:bg-gray-50 dark:hover:bg-[#353534] text-gray-700 dark:text-[#e5e5e4] font-medium text-lg px-8 py-3 rounded-full shadow-sm dark:shadow-black/30 transition-all duration-300 hover:shadow-md dark:hover:shadow-black/50 active:scale-95 cursor-pointer select-none"
          >
            Copy
          </button>
        </div>

        {/* Confirmation content - Code Copied! */}
        <div 
          className="relative flex items-center gap-3"
          style={{
            opacity: showConfirmation ? 1 : 0,
            filter: showConfirmation ? 'blur(0px)' : 'blur(12px)',
            transform: showConfirmation ? 'scale(1)' : 'scale(1.08)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <div className="w-7 h-7 bg-gray-800 dark:bg-[#e5e5e4] rounded-full flex items-center justify-center">
            <svg 
              className="w-4 h-4 text-white dark:text-[#141413]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M5 13l4 4L19 7"
                style={{
                  strokeDasharray: 24,
                  strokeDashoffset: showConfirmation ? 0 : 24,
                  transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s',
                }}
              />
            </svg>
          </div>
          <span className="text-xl font-semibold text-gray-800 dark:text-[#e5e5e4]">
            Code Copied!
          </span>
        </div>
      </div>
    </div>
  );
}