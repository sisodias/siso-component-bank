// Original component inspired by voice input concept
// Created with unique pulse animation and recording visualization

import { cn } from "../_utils/cn";
import { useState, useEffect } from "react";

export const PulseVoiceRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [pulseIntensity, setPulseIntensity] = useState<number[]>([]);

  useEffect(() => {
    if (!recording) return;
    
    const timer = setInterval(() => {
      setDuration(prev => prev + 1);
      // Generate random pulse patterns for visual feedback
      setPulseIntensity(Array.from({ length: 5 }, () => Math.random()));
    }, 1000);

    return () => clearInterval(timer);
  }, [recording]);

  const handleToggle = () => {
    if (recording) {
      setRecording(false);
      setDuration(0);
      setPulseIntensity([]);
    } else {
      setRecording(true);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <div className="relative">
        {/* Animated pulse rings */}
        {recording && (
          <>
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={cn(
                  "absolute inset-0 rounded-full border-2 border-blue-400/30",
                  "animate-ping"
                )}
                style={{
                  animationDelay: `${index * 0.3}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </>
        )}
        
        {/* Main record button */}
        <button
          onClick={handleToggle}
          className={cn(
            "relative z-10 w-24 h-24 rounded-full transition-all duration-300",
            "flex items-center justify-center",
            recording
              ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50"
              : "bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/50"
          )}
        >
          {recording ? (
            <div className="w-8 h-8 bg-white rounded-sm" />
          ) : (
            <div className="w-6 h-6 bg-white rounded-full" />
          )}
        </button>
      </div>

      {/* Duration display */}
      {recording && (
        <div className="text-2xl font-mono font-bold text-gray-700">
          {formatTime(duration)}
        </div>
      )}

     


    </div>
  );
};
