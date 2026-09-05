import { Mic, Play, Pause } from "lucide-react";
import { useState, useEffect } from "react";

function AIVoiceInput({
  onStart,
  onStop,
  visualizerBars = 48,
  demoMode = false,
  demoInterval = 3000,
  className = ""
}) {
  const [submitted, setSubmitted] = useState(false);
  const [time, setTime] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isDemo, setIsDemo] = useState(demoMode);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    let intervalId;

    if (submitted) {
      onStart?.();
      intervalId = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    } else {
      onStop?.(time);
      setTime(0);
    }

    return () => clearInterval(intervalId);
  }, [submitted, time, onStart, onStop]);

  useEffect(() => {
    if (!isDemo) return;

    let timeoutId;
    const runAnimation = () => {
      setSubmitted(true);
      timeoutId = setTimeout(() => {
        setSubmitted(false);
        timeoutId = setTimeout(runAnimation, 1000);
      }, demoInterval);
    };

    const initialTimeout = setTimeout(runAnimation, 100);
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(initialTimeout);
    };
  }, [isDemo, demoInterval]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClick = () => {
    if (isDemo) {
      setIsDemo(false);
      setSubmitted(false);
    } else {
      setSubmitted((prev) => !prev);
    }
  };

  return (
    <div className={`w-full py-4 ${className}`}>
      <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-2">
        <button
          className={`group w-16 h-16 rounded-xl flex items-center justify-center transition-colors ${
            submitted
              ? "bg-none"
              : "bg-none hover:bg-black/10 dark:hover:bg-white/10"
          }`}
          type="button"
          onClick={handleClick}
        >
          {submitted ? (
            <div
              className="w-6 h-6 rounded-sm bg-black dark:bg-white cursor-pointer pointer-events-auto"
              style={{ 
                animation: "spin 3s linear infinite"
              }}
            />
          ) : (
            <Mic className="w-6 h-6 text-black/70 dark:text-white/70" />
          )}
        </button>

        <span
          className={`font-mono text-sm transition-opacity duration-300 ${
            submitted
              ? "text-black/70 dark:text-white/70"
              : "text-black/30 dark:text-white/30"
          }`}
        >
          {formatTime(time)}
        </span>

        <div className="h-4 w-64 flex items-center justify-center gap-0.5">
          {[...Array(visualizerBars)].map((_, i) => (
            <div
              key={i}
              className={`w-0.5 rounded-full transition-all duration-300 ${
                submitted
                  ? "bg-black/50 dark:bg-white/50"
                  : "bg-black/10 dark:bg-white/10 h-1"
              }`}
              style={
                submitted && isClient
                  ? {
                      height: `${20 + Math.random() * 80}%`,
                      animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                      animationDelay: `${i * 0.05}s`,
                    }
                  : undefined
              }
            />
          ))}
        </div>

        <p className="h-4 text-xs text-black/70 dark:text-white/70">
          {submitted ? "Listening..." : "Click to speak"}
        </p>
      </div>
    </div>
  );
}

export default function AIVoiceInputDemo() {
  const [recordings, setRecordings] = useState([]);
  const [playingIndex, setPlayingIndex] = useState(null);

  const handleStop = (duration) => {
    if (duration > 0) {
      setRecordings(prev => [...prev.slice(-4), { duration, timestamp: new Date() }]);
    }
  };

  const handlePlayRecording = (index, duration) => {
    setPlayingIndex(index);
    setTimeout(() => {
      setPlayingIndex(null);
    }, duration * 1000);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Voice Input
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Click the microphone to start recording your voice
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
          <AIVoiceInput 
            onStart={() => console.log('Recording started')}
            onStop={handleStop}
          />
        </div>

        {recordings.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Recent Recordings
            </h2>
            <div className="space-y-3">
              {[...recordings].reverse().map((recording, idx) => {
                const actualIndex = recordings.length - 1 - idx;
                const isPlaying = playingIndex === actualIndex;
                
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <button
                        onClick={() => handlePlayRecording(actualIndex, recording.duration)}
                        disabled={isPlaying}
                        className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors disabled:opacity-50"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        ) : (
                          <Play className="w-5 h-5 text-slate-600 dark:text-slate-300 ml-0.5" />
                        )}
                      </button>
                      <div className="flex-1">
                        <p className="text-base font-medium text-slate-900 dark:text-white">
                          Recording {recordings.length - idx}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {recording.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      {isPlaying && (
                        <div className="flex items-center gap-0.5 h-8">
                          {[...Array(12)].map((_, i) => (
                            <div
                              key={i}
                              className="w-0.5 bg-slate-400 dark:bg-slate-500 rounded-full"
                              style={{
                                height: `${30 + Math.random() * 70}%`,
                                animation: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                                animationDelay: `${i * 0.1}s`,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-4">
                      {formatDuration(recording.duration)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
