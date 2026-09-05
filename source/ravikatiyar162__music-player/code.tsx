import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat } from 'lucide-react';

// Helper to format time from seconds to MM:SS
const formatTime = (timeInSeconds: number): string => {
  if (isNaN(timeInSeconds)) return '00:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// Interface for the component props
interface MusicPlayerProps {
  albumArt: string;
  songTitle: string;
  artistName: string;
  audioSrc: string;
}

// The main MusicPlayer component
export const MusicPlayer: React.FC<MusicPlayerProps> = ({ albumArt, songTitle, artistName, audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);

  // Effect to handle audio playback and updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    }

    const setAudioTime = () => {
        setCurrentTime(audio.currentTime);
        if (progressBarRef.current) {
            const progress = audio.duration > 0 ? (audio.currentTime / audio.duration) * 100 : 0;
            progressBarRef.current.style.setProperty('--progress', `${progress}%`);
        }
    };

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    if (isPlaying) {
      audio.play().catch(error => console.error("Error playing audio:", error));
    } else {
      audio.pause();
    }
    
    // Cleanup event listeners
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    }
  }, [isPlaying, audioSrc]);

  // Handle seeking through the song
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(e.target.value);
    }
  };

  const togglePlayPause = () => setIsPlaying(!isPlaying);
  const toggleShuffle = () => setIsShuffle(!isShuffle);
  const toggleRepeat = () => setIsRepeat(!isRepeat);

  return (
    <div className="w-full max-w-sm mx-auto bg-[hsl(var(--background))] text-[hsl(var(--foreground))] rounded-2xl shadow-lg p-6 flex flex-col items-center font-sans">
       <style>{`
        .progress-bar {
            --progress: 0%;
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 8px;
            background: hsl(var(--muted));
            border-radius: 4px;
            outline: none;
            cursor: pointer;
            background-image: linear-gradient(hsl(var(--primary)), hsl(var(--primary)));
            background-size: var(--progress) 100%;
            background-repeat: no-repeat;
        }

        .progress-bar::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            background: white;
            border: 2px solid hsl(var(--primary));
            border-radius: 50%;
            cursor: pointer;
            margin-top: -4px;
        }

        .progress-bar::-moz-range-thumb {
            width: 16px;
            height: 16px;
            background: white;
            border: 2px solid hsl(var(--primary));
            border-radius: 50%;
            cursor: pointer;
        }
       `}</style>
      <audio ref={audioRef} src={audioSrc} loop={isRepeat} preload="metadata" />
      
      {/* Album Art */}
      <motion.div
        className="relative mb-6"
        animate={{ rotate: isPlaying ? 360 : 0 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <img
          src={albumArt}
          alt={`${songTitle} album art`}
          className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover shadow-2xl"
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/224x224/1a1a1a/ffffff?text=Music'; }}
        />
      </motion.div>

      {/* Song Info */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">{songTitle}</h2>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">{artistName}</p>
      </div>

      {/* Progress Bar and Timestamps */}
      <div className="w-full flex items-center gap-x-3 mb-4">
        <span className="text-xs font-mono text-[hsl(var(--muted-foreground))] w-12 text-left">{formatTime(currentTime)}</span>
        <input
          ref={progressBarRef}
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="progress-bar flex-grow"
        />
        <span className="text-xs font-mono text-[hsl(var(--muted-foreground))] w-12 text-right">{formatTime(duration)}</span>
      </div>


      {/* Controls */}
      <div className="flex items-center justify-center space-x-6 w-full">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggleShuffle} className={`transition-colors ${isShuffle ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'}`}>
          <Shuffle size={20} />
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-[hsl(var(--foreground))]">
          <SkipBack size={28} />
        </motion.button>
        
        <motion.button
          onClick={togglePlayPause}
          className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isPlaying ? 'pause' : 'play'}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
            </motion.div>
          </AnimatePresence>
        </motion.button>

        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-[hsl(var(--foreground))]">
          <SkipForward size={28} />
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggleRepeat} className={`transition-colors ${isRepeat ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'}`}>
          <Repeat size={20} />
        </motion.button>
      </div>
    </div>
  );
};
