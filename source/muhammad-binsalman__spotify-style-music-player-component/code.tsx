import React, { useState, useEffect } from 'react';

const SpotifyMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(215); // 3:35 duration in seconds

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRemainingTime = () => {
    return duration - currentTime;
  };

  const getProgressPercentage = () => {
    return (currentTime / duration) * 100;
  };

  const VolumeBar = ({ delay }) => (
    <div 
      className={`w-1 bg-gradient-to-t from-green-400 to-green-300 rounded-full transition-all duration-300 ${
        isPlaying 
          ? 'animate-pulse' 
          : 'h-2'
      }`}
      style={{
        height: isPlaying ? `${Math.random() * 20 + 8}px` : '8px',
        animationDelay: `${delay}s`,
        animationDuration: '0.8s'
      }}
    />
  );

  return (
    <div className="max-w-md w-full mx-auto bg-gradient-to-br from-green-900 via-black to-green-900 rounded-2xl p-6 shadow-2xl border border-gray-800">
      {/* Track Info Section */}
      <div className="flex items-center gap-4 mb-6">
        {/* Album Art */}
        <div className="relative group">
          <img src={'data:image/jpeg;base64,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'} className="h-12 w-12 object-cover rounded-full"/>
        </div>

        {/* Track Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-lg truncate">Blinding Lights</h3>
          <p className="text-gray-400 text-sm truncate">The Weeknd</p>
        </div>

        {/* Volume Bars */}
        <div className="flex items-end gap-1 h-8">
          {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7].map((delay, index) => (
            <VolumeBar key={index} delay={delay} />
          ))}
        </div>
      </div>

      {/* Playback Controls Section */}
      <div className="space-y-4">
        {/* Time Info */}
        <div className="flex justify-between text-xs text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>-{formatTime(getRemainingTime())}</span>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          <div 
            className="absolute top-1/2 w-3 h-3 bg-white rounded-full shadow-md transform -translate-y-1/2 transition-all duration-300"
            style={{ left: `calc(${getProgressPercentage()}% - 6px)` }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Previous Button */}
            <button className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M.5 3.5A.5.5 0 0 0 0 4v8a.5.5 0 0 0 1 0V8.753l6.267 3.636c.54.313 1.233-.066 1.233-.697v-2.94l6.267 3.636c.54.314 1.233-.065 1.233-.696V4.308c0-.63-.693-1.01-1.233-.696L8.5 7.248v-2.94c0-.63-.692-1.01-1.233-.696L1 7.248V4a.5.5 0 0 0-.5-.5"/>
              </svg>
            </button>

            {/* Play/Pause Button */}
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-4 bg-green-500 hover:bg-green-400 text-black rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {isPlaying ? (
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"/>
                </svg>
              ) : (
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.596 8.697l-6.363 3.692c-.54.314-1.233-.065-1.233-.696V4.308c0-.63.693-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
                </svg>
              )}
            </button>

            {/* Next Button */}
            <button className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M15.5 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V8.753l-6.267 3.636c-.54.313-1.233-.066-1.233-.697v-2.94l-6.267 3.636C.693 12.703 0 12.324 0 11.693V4.308c0-.63.693-1.01 1.233-.696L7.5 7.248v-2.94c0-.63.693-1.01 1.233-.696L15 7.248V4a.5.5 0 0 1 .5-.5"/>
              </svg>
            </button>
          </div>

          {/* Additional Controls */}
          <button className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path d="M6.634 1.135A7 7 0 0 1 15 8a.5.5 0 0 1-1 0 6 6 0 1 0-6.5 5.98v-1.005A5 5 0 1 1 13 8a.5.5 0 0 1-1 0 4 4 0 1 0-4.5 3.969v-1.011A2.999 2.999 0 1 1 11 8a.5.5 0 0 1-1 0 2 2 0 1 0-2.5 1.936v-1.07a1 1 0 1 1 1 0V15.5a.5.5 0 0 1-1 0v-.518a7 7 0 0 1-.866-13.847"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpotifyMusicPlayer;