import React, { useState, useEffect } from "react";
import { MessageSquare, Clock, X, Check, Calendar, ChevronDown, ChevronUp } from "lucide-react";

export function Component() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isConfirmed) {
      const timer = setTimeout(() => setIsVisible(false), 2200);
      return () => clearTimeout(timer);
    }
  }, [isConfirmed]);

  if (!isVisible) return null;

  return (
    <div 
      className="group relative w-full max-w-[360px] overflow-hidden rounded-2xl p-[1px] shadow-2xl transition-all duration-500 ease-in-out 
                 bg-neutral-200 dark:bg-neutral-950 hover:shadow-indigo-500/20"
    >
      {/* The Glow Border - Adapts opacity based on theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-indigo-500/40 opacity-30 dark:opacity-40 group-hover:opacity-100 transition-opacity" />

      <div className="relative flex flex-col rounded-[15px] p-4 backdrop-blur-xl 
                      bg-white/90 dark:bg-neutral-950/95">
        
        {/* TOP SECTION: THE MESSAGE */}
        <div className="flex items-start gap-4 transition-all duration-300">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20">
            <MessageSquare size={18} className="text-white" />
          </div>
          
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-600 dark:text-indigo-400/80">
                Slack • 2m ago
              </span>
              <button onClick={() => setIsVisible(false)} className="text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors">
                <X size={14} />
              </button>
            </div>
            <p className="mt-0.5 text-[13px] font-medium text-neutral-900 dark:text-neutral-200">
              Sarah: "The AI agent rollout is live!"
            </p>
            
            {!isConfirmed && (
              <div className="mt-3 flex gap-4">
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`text-[11px] font-bold transition-colors flex items-center gap-1.5 ${
                    isExpanded 
                      ? 'text-indigo-600 dark:text-white' 
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300'
                  }`}
                >
                  <Clock size={12} /> {isExpanded ? 'Cancel' : 'Remind me'}
                  {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                {!isExpanded && (
                  <button 
                    onClick={() => setIsVisible(false)}
                    className="text-[11px] font-bold text-neutral-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Reply Now
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ACCORDION SECTION: THE SCHEDULER */}
        <div 
          className={`grid transition-all duration-300 ease-in-out ${
            isExpanded && !isConfirmed ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800/50 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">
                Snooze Duration
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "15 mins", icon: <Clock size={12} /> },
                  { label: "Tomorrow", icon: <Calendar size={12} /> },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setIsConfirmed(true);
                      setIsExpanded(false);
                    }}
                    className="flex items-center justify-center gap-2 rounded-lg border py-2.5 text-[11px] font-semibold transition-all active:scale-95
                               border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 text-neutral-600 dark:text-neutral-300 
                               hover:border-indigo-500/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CONFIRMATION STATE */}
        {isConfirmed && (
          <div className="mt-4 flex items-center gap-2 py-1 animate-in fade-in slide-in-from-left-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-500">
              <Check size={12} strokeWidth={3} />
            </div>
            <span className="text-[12px] font-bold text-neutral-900 dark:text-neutral-100">
              Reminder scheduled.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}