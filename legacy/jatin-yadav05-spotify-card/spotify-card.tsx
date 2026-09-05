"use client"
import { useState, useEffect, useRef } from 'react';
import { ChevronRight, Play, Pause, Volume2, Heart, Plus, MoreHorizontal, SkipBack, SkipForward } from 'lucide-react';

interface Song {
  title: string;
  artists: string;
  duration: number;
  albumArt: string;
}

interface SpotifyCardProps {
  songs: Song[];
}

export function SpotifyCard({ songs }: SpotifyCardProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [animationProgress, setAnimationProgress] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(75);
  const [isDraggingVolume, setIsDraggingVolume] = useState<boolean>(false);
  const [isDraggingProgress, setIsDraggingProgress] = useState<boolean>(false);
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  
  const cardRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  
  const currentSong = songs[currentSongIndex];
  const songDuration = currentSong.duration;
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setShowContextMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isDraggingProgress) {
      interval = setInterval(() => {
        setAnimationProgress(prev => {
          if (prev >= 100) {
            handleNextSong();
            return 0;
          }
          return prev + (100 / (songDuration * 10));
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isDraggingProgress, songDuration, currentSongIndex]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };
  
  const handleVolumeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDraggingVolume(true);
    handleVolumeChange(e);
    
    const handleMouseMove = (e: MouseEvent) => handleVolumeChange(e);
    const handleMouseUp = () => {
      setIsDraggingVolume(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleVolumeChange = (e: MouseEvent | React.MouseEvent) => {
    if (!volumeBarRef.current) return;
    
    const rect = volumeBarRef.current.getBoundingClientRect();
    let newVolume = ((e.clientX - rect.left) / rect.width) * 100;
    newVolume = Math.max(0, Math.min(100, newVolume));
    setVolume(newVolume);
    
    setIsMuted(newVolume === 0);
  };
  
  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDraggingProgress(true);
    handleProgressChange(e);
    
    const handleMouseMove = (e: MouseEvent) => handleProgressChange(e);
    const handleMouseUp = () => {
      setIsDraggingProgress(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleProgressChange = (e: MouseEvent | React.MouseEvent) => {
    if (!progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    let newProgress = ((e.clientX - rect.left) / rect.width) * 100;
    newProgress = Math.max(0, Math.min(100, newProgress));
    setAnimationProgress(newProgress);
  };
  
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMuted) {
      setIsMuted(false);
      setVolume(volume === 0 ? 75 : volume);
    } else {
      setIsMuted(true);
    }
  };
  
  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsPlaying(!isPlaying);
  };
  
  const handlePreviousSong = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newIndex = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
    setCurrentSongIndex(newIndex);
    setAnimationProgress(0);
    if (!isPlaying) setIsPlaying(true);
  };
  
  const handleNextSong = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(newIndex);
    setAnimationProgress(0);
    if (!isPlaying) setIsPlaying(true);
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const currentTime = (animationProgress / 100) * songDuration;
  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowContextMenu(true);
  };
  
  const VolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <Volume2 size={16} className="text-gray-400" style={{ opacity: 0.5 }} />;
    }
    return <Volume2 size={16} className="text-gray-400" />;
  };
  
  return (
    <div 
      ref={cardRef}
      className="w-80 rounded-xl overflow-hidden relative cursor-pointer group"
      style={{
        background: 'radial-gradient(25% 40% at 50% 30%, rgba(30, 215, 96, 0.15), rgba(8, 53, 24, 0.98))',
        boxShadow: `0px 1px 0px 0px rgba(255, 255, 255, 0.08) inset, 
                    0px 0px 25px 5px rgba(46, 212, 105, 0.06), 
                    0px 0px 40px 20px rgba(46, 212, 105, 0.03), 
                    0 0 0 1px rgba(255, 255, 255, 0.05) inset,
                    0 10px 30px -5px rgba(0, 0, 0, 0.3)`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowContextMenu(false);
      }}
      onMouseMove={handleMouseMove}
      onContextMenu={handleContextMenu}
    >
    <div 
        className="absolute w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ 
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(30, 215, 96, 0.12) 0%, transparent 60%)`,
          filter: 'blur(25px)',
        }}
      />
      
      <div 
        className="absolute w-full h-full pointer-events-none transition-opacity duration-700"
        style={{ 
          background: 'radial-gradient(50% 50% at 50% 50%, rgba(30, 215, 96, 0.10) 0%, transparent 100%)',
          opacity: isHovered ? 0.8 : 0,
          filter: 'blur(30px)',
          transform: 'translateY(20%)'
        }}
      />
      
      <div className="p-5 relative z-10">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <div 
              className="w-14 h-14 rounded-xl mr-3 flex items-center justify-center overflow-hidden bg-black/90 relative"
              style={{
                boxShadow: isHovered ? '0 0 15px rgba(30, 215, 96, 0.25)' : 'none',
                transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
              }}
            >
              <svg viewBox="0 0 24 24" className="w-8 h-8 transition-transform duration-700" 
                style={{
                  fill: '#1ED760',
                  transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                  filter: isHovered ? 'drop-shadow(0 0 3px rgba(30, 215, 96, 0.5))' : 'none'
                }}>
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              
              <div 
                className="absolute inset-0 rounded-xl transition-all duration-3000 ease-in-out"
                style={{ 
                  background: 'radial-gradient(ellipse at center, rgba(30, 215, 96, 0.12) 0%, transparent 70%)',
                  transform: isHovered ? 'rotate(360deg) scale(1.1)' : 'rotate(0deg) scale(1)',
                  opacity: isHovered ? 1 : 0.3,
                }}
              />
            </div>
            <div className="text-white font-medium text-lg transition-all duration-300" 
              style={{ 
                textShadow: isHovered ? '0 0 8px rgba(255, 255, 255, 0.4)' : 'none',
                letterSpacing: isHovered ? '0.03em' : 'normal',
                transform: isHovered ? 'translateY(-1px)' : 'translateY(0)'
              }}>
              <span className="bg-clip-text bg-gradient-to-r from-white to-green-300"
                style={{
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: isHovered ? 'transparent' : 'inherit',
                  transition: 'all 0.4s ease-out'
                }}>
                Spotify
              </span>
              <div className="text-xs font-normal opacity-0 group-hover:opacity-100 transition-all duration-500 transform"
                style={{ 
                  transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                  background: 'linear-gradient(90deg, #1ED760, #1DB954)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: '500',
                  letterSpacing: '0.05em',
                  filter: isHovered ? 'drop-shadow(0 0 2px rgba(30, 215, 96, 0.5))' : 'none'
                }}>
                Premium Experience
              </div>
            </div>
          </div>
          <button 
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ease-out ${isHovered ? 'bg-green-500 text-black shadow-lg' : 'bg-black/20 text-white/80'}`}
            type="button"
            aria-label="View details"
            style={{
              transform: isHovered ? 'translateX(0) scale(1.02)' : 'translateX(5px) scale(1)',
              opacity: isHovered ? 1 : 0.7,
              boxShadow: isHovered ? '0 0 10px rgba(30, 215, 96, 0.3)' : 'none'
            }}
          >
            <ChevronRight 
              size={18} 
              className="transition-all duration-500 ease-out" 
              style={{ 
                transform: isHovered ? 'translateX(1px)' : 'translateX(0)',
                strokeWidth: isHovered ? 2.5 : 2
              }} 
            />
          </button>
        </div>
        <p className="text-gray-200 text-sm mb-4 transition-all duration-500 font-light tracking-wide"
           style={{ 
             transform: isHovered ? 'translateY(-3px)' : 'translateY(0)', 
             opacity: isHovered ? 1 : 0.7,
             textShadow: isHovered ? '0 0 15px rgba(255, 255, 255, 0.2)' : 'none',
             letterSpacing: isHovered ? '0.03em' : 'normal',
             background: isHovered ? 'linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(30,215,96,0.8) 100%)' : 'none',
             WebkitBackgroundClip: isHovered ? 'text' : 'none',
             WebkitTextFillColor: isHovered ? 'transparent' : 'inherit'
           }}>
          Search for music and podcasts, browse your library, and control playback.
        </p>
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-5 mx-2 rounded-full" 
          style={{ 
            boxShadow: isHovered ? '0 0 8px rgba(30, 215, 96, 0.2)' : 'none',
            transform: isHovered ? 'scaleX(0.98)' : 'scaleX(1.5)',
            transition: 'all 0.5s ease-out'
          }}
        />
      </div>

      <div className="relative w-48 h-48 mx-auto rounded-xl overflow-hidden" 
        style={{ 
          boxShadow: isHovered ? '0 15px 30px -10px rgba(0, 0, 0, 0.4), 0 0 10px rgba(30, 215, 96, 0.15)' : '0 5px 15px -5px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
        <img 
          src={currentSong.albumArt} 
          alt="Album Cover" 
          className="w-full h-full object-cover transition-all duration-700"
          style={{ 
            transform: isHovered ? 'scale(1.02)' : 'scale(1)',
            filter: isHovered ? 'brightness(1.05) contrast(1.02)' : 'brightness(1)',
          }}
        />
        
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/70 flex items-center justify-center transition-all duration-500"
          style={{ opacity: isHovered ? 1 : 0 }}
        >
          <button 
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-green-400"
            style={{ 
              boxShadow: '0 0 20px rgba(30, 215, 96, 0.5)',
              transform: `scale(${isHovered ? 1 : 0})`,
              opacity: isHovered ? 1 : 0
            }}
          >
            {isPlaying ? 
              <Pause size={20} className="text-black" /> : 
              <Play size={20} className="text-black ml-1" />
            }
          </button>
          
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button 
              className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-black/60"
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
              style={{
                transform: isLiked ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              <Heart size={14} fill={isLiked ? "#1ED760" : "none"} stroke={isLiked ? "#1ED760" : "white"} 
                className="transition-all duration-300" 
                style={{ 
                  transform: isLiked ? 'scale(1.1)' : 'scale(1)',
                  filter: isLiked ? 'drop-shadow(0 0 2px rgba(30, 215, 96, 0.5))' : 'none'
                }}
              />
            </button>
            <button className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-black/60 hover:scale-105">
              <Plus size={14} className="text-white" />
            </button>
            <button 
              className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-black/60 hover:scale-105"
              onClick={(e) => {
                e.stopPropagation();
                setShowContextMenu(!showContextMenu);
              }}
            >
              <MoreHorizontal size={14} className="text-white" />
            </button>
          </div>
        </div>
      </div>
      
      {showContextMenu && (
        <div 
          ref={contextMenuRef}
          className="absolute right-6 bottom-32 bg-green-900/90 backdrop-blur-md rounded-lg shadow-lg overflow-hidden border border-white/10 z-30"
          style={{ 
            width: '200px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25), 0 0 5px rgba(255, 255, 255, 0.05)',
            animation: 'fadeIn 0.2s ease-out forwards'
          }}
        >
          <div className="py-1.5">
            <button className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-green-800/50 transition-all duration-200 flex items-center gap-3 group">
              <Heart size={15} className="text-green-400/70 group-hover:text-white transition-colors duration-200" 
                fill={isLiked ? "rgba(30, 215, 96, 0.7)" : "none"}
              /> 
              <span className="font-medium">{isLiked ? 'Remove from Liked' : 'Add to Liked'}</span>
            </button>
            <button className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-green-800/50 transition-all duration-200 flex items-center gap-3 group">
              <Plus size={15} className="text-green-400/70 group-hover:text-white transition-colors duration-200" /> 
              <span className="font-medium">Add to playlist</span>
            </button>
            <div className="h-px bg-green-500/10 my-1" />
            <button className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-green-800/50 transition-all duration-200 flex items-center gap-3 group">
              <SkipForward size={15} className="text-green-400/70 group-hover:text-white transition-colors duration-200" /> 
              <span className="font-medium">Next in queue</span>
            </button>
            <button className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-green-800/50 transition-all duration-200 flex items-center gap-3 group">
              <SkipBack size={15} className="text-green-400/70 group-hover:text-white transition-colors duration-200" /> 
              <span className="font-medium">Previous in queue</span>
            </button>
          </div>
        </div>
      )}
      
      <div className="flex justify-center gap-1 mt-3 mb-6 h-7 items-end transition-all duration-300">
        {isPlaying && (
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i}
                className="w-1 bg-green-500 rounded-full transition-all"
                style={{
                  height: `${Math.sin((Date.now()/300) + i * 0.5) * 6 + 10}px`,
                  opacity: 0.7,
                  animation: `wave${i} 1.${i}s ease-in-out infinite`,
                  filter: 'drop-shadow(0 0 1px rgba(30, 215, 96, 0.5))'
                }}
              />
            ))}
          </>
        )}
      </div>
      
      <div 
        className="bg-black/95 backdrop-blur-md p-3 transition-all duration-500 border-t border-white/5 overflow-hidden rounded-b-xl"
        style={{
          boxShadow: isHovered ? '0 -5px 15px rgba(0, 0, 0, 0.3)' : 'none'
        }}
      >
        <div 
          ref={progressBarRef}
          className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer relative mb-3 overflow-hidden"
          onMouseDown={handleProgressMouseDown}
          style={{
            boxShadow: '0 0 3px rgba(30, 215, 96, 0.2)'
          }}
        >
          <div 
            className="h-full rounded-full transition-all duration-150"
            style={{ 
              width: `${animationProgress}%`,
              background: 'linear-gradient(90deg, rgba(30, 215, 96, 0.8), rgba(30, 215, 96, 1))',
              boxShadow: '0 0 6px rgba(30, 215, 96, 0.4)'
            }}
          />
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div className="text-white">
            <div className="font-medium text-xs group-hover:text-green-400 transition-colors duration-500">
              {currentSong.title}
            </div>
            <div className="text-gray-400 text-xs mt-0.5">{currentSong.artists}</div>
          </div>
          <div className="text-xs text-gray-400 tabular-nums">
            {formatTime(currentTime)} / {formatTime(songDuration)}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-all duration-300"
              onClick={handlePreviousSong}
            >
              <SkipBack size={14} className="text-white" />
            </button>
            
            <button 
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-all duration-300 hover:scale-105 hover:brightness-105"
              onClick={togglePlay}
              style={{
                boxShadow: '0 0 5px rgba(255, 255, 255, 0.3)'
              }}
            >
              {isPlaying ? 
                <Pause size={16} className="text-black" /> : 
                <Play size={16} className="text-black ml-0.5" />
              }
            </button>
            
            <button 
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-all duration-300"
              onClick={handleNextSong}
            >
              <SkipForward size={14} className="text-white" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors duration-300"
              onClick={toggleMute}
            >
              <VolumeIcon />
            </button>
            
            <div 
              ref={volumeBarRef}
              className="w-16 h-1.5 bg-white/20 rounded-full cursor-pointer relative group/volume hover:bg-white/30 transition-colors duration-200"
              onMouseDown={handleVolumeMouseDown}
            >
              <div 
                className="h-full bg-white rounded-full group-hover/volume:bg-green-500 transition-colors duration-300" 
                style={{ width: `${isMuted ? 0 : volume}%` }} 
              />
              
              <div 
                className="absolute top-1/2 w-3 h-3 rounded-full bg-white -mt-1.5 transition-all duration-200"
                style={{ 
                  left: `${isMuted ? 0 : volume}%`, 
                  transform: `translateX(-50%) scale(${isHovered || isDraggingVolume ? 1 : 0})`,
                  opacity: isHovered || isDraggingVolume ? 1 : 0,
                  boxShadow: '0 0 4px rgba(255, 255, 255, 0.5)'
                }} 
              />
            </div>
          </div>
        </div>
      </div>
      
      <div 
        className="h-0.5 w-full absolute bottom-0 transition-all duration-500"
        style={{ 
          background: 'linear-gradient(90deg, transparent, rgba(46, 212, 105, 0.5), transparent)',
          opacity: isHovered ? 1 : 0,
          filter: 'blur(1px)'
        }}
      />
      
      <div 
        className="absolute inset-0 pointer-events-none rounded-xl transition-opacity duration-700 opacity-0 group-hover:opacity-100"
        style={{
          border: '1px solid rgba(30, 215, 96, 0.2)',
          animation: 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
      />
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.005);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            }
        }

        @keyframes pulse-subtle {
          0%, 100% {
            opacity: 0.9;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes wave1 {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
        @keyframes wave2 {
          0%, 100% { height: 5px; }
          50% { height: 12px; }
        }
        @keyframes wave3 {
          0%, 100% { height: 7px; }
          50% { height: 18px; }
        }
        @keyframes wave4 {
          0%, 100% { height: 5px; }
          50% { height: 14px; }
        }
        @keyframes wave5 {
          0%, 100% { height: 3px; }
          50% { height: 13px; }
        }
      `}</style>
    </div>
  );
} 