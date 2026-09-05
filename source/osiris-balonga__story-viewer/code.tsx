"use client";

import * as React from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX, Pause, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Story {
  id: string;
  type: "image" | "video";
  src: string;
  duration?: number;
}

export interface StoryViewerProps {
  stories: Story[];
  username: string;
  avatar: string;
  timestamp?: string;
  onStoryView?: (storyId: string) => void;
  onAllStoriesViewed?: () => void;
  className?: string;
}

const DEFAULT_IMAGE_DURATION = 5000;

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return diffMinutes <= 1 ? "Just now" : `${diffMinutes}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  return `${Math.floor(diffHours / 24)}d ago`;
}

interface StoryThumbnailProps {
  stories: Story[];
  username: string;
  viewedIndices: Set<number>;
  onClick: () => void;
  className?: string;
}

function StoryThumbnail({
  stories,
  username,
  viewedIndices,
  onClick,
  className,
}: StoryThumbnailProps) {
  const segmentCount = stories.length;
  const gapDegrees = segmentCount > 1 ? 12 : 0;
  const segmentDegrees = (360 - gapDegrees * segmentCount) / segmentCount;
  const allViewed = viewedIndices.size === stories.length;

  const lastStory = stories[stories.length - 1];
  const thumbnailImage = React.useMemo(() => {
    for (let i = stories.length - 1; i >= 0; i--) {
      if (stories[i].type === "image") {
        return stories[i].src;
      }
    }
    return null;
  }, [stories]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center gap-2 group cursor-pointer",
        "bg-transparent border-none outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg",
        className
      )}
      aria-label={`View ${username}'s stories`}
    >
      <div className="relative w-[72px] h-[72px]">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
        >
          {stories.map((_, index) => {
            const startAngle = -90 + index * (segmentDegrees + gapDegrees);
            const endAngle = startAngle + segmentDegrees;
            const isViewed = viewedIndices.has(index);

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            const radius = 46;
            const x1 = 50 + radius * Math.cos(startRad);
            const y1 = 50 + radius * Math.sin(startRad);
            const x2 = 50 + radius * Math.cos(endRad);
            const y2 = 50 + radius * Math.sin(endRad);
            const largeArc = segmentDegrees > 180 ? 1 : 0;

            return (
              <path
                key={index}
                d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`}
                fill="none"
                strokeWidth="5"
                strokeLinecap="round"
                className={cn(
                  "transition-colors duration-300",
                  isViewed || allViewed
                    ? "stroke-muted-foreground/30"
                    : "stroke-primary"
                )}
              />
            );
          })}
        </svg>

        <div className="absolute inset-[5px] rounded-full bg-background p-[2px]">
          <div className="w-full h-full rounded-full overflow-hidden bg-muted">
            {lastStory.type === "video" ? (
              <video
                src={lastStory.src}
                poster={thumbnailImage || undefined}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                muted
                playsInline
                preload="metadata"
              />
            ) : (
              <img
                src={lastStory.src}
                alt={`${username}'s story`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            )}
          </div>
        </div>
      </div>

      <span className="text-xs text-muted-foreground truncate max-w-[80px]">
        {username}
      </span>
    </button>
  );
}

interface ProgressBarProps {
  count: number;
  currentIndex: number;
  progress: number;
  viewedIndices: Set<number>;
}

function ProgressBar({ count, currentIndex, progress, viewedIndices }: ProgressBarProps) {
  return (
    <div className="flex gap-1 w-full px-2">
      {Array.from({ length: count }).map((_, index) => {
        const isActive = index === currentIndex;
        const isCompleted = viewedIndices.has(index) && index < currentIndex;
        const isPast = index < currentIndex;

        return (
          <div
            key={index}
            className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: isPast || isCompleted ? "100%" : "0%" }}
              animate={{
                width: isActive ? `${progress}%` : isPast ? "100%" : "0%",
              }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>
        );
      })}
    </div>
  );
}

interface StoryContentProps {
  story: Story;
  isMuted: boolean;
  isInitialLoading: boolean;
  isBuffering: boolean;
  onVideoReady: (duration: number) => void;
  onVideoTimeUpdate: (currentTime: number, duration: number) => void;
  onVideoWaiting: () => void;
  onVideoPlaying: () => void;
  onVideoEnded: () => void;
  onImageLoad: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

function StoryContent({
  story,
  isMuted,
  isInitialLoading,
  isBuffering,
  onVideoReady,
  onVideoTimeUpdate,
  onVideoWaiting,
  onVideoPlaying,
  onVideoEnded,
  onImageLoad,
  videoRef,
}: StoryContentProps) {
  const showSpinner = isInitialLoading || isBuffering;

  return (
    <>
      {showSpinner && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
      )}
      {story.type === "video" ? (
        <video
          ref={videoRef}
          src={story.src}
          className={cn(
            "w-full h-full object-contain transition-opacity duration-200",
            isInitialLoading ? "opacity-0" : "opacity-100"
          )}
          autoPlay
          playsInline
          muted={isMuted}
          onCanPlay={(e) => {
            const video = e.currentTarget;
            onVideoReady(video.duration * 1000);
          }}
          onTimeUpdate={(e) => {
            const video = e.currentTarget;
            onVideoTimeUpdate(video.currentTime, video.duration);
          }}
          onWaiting={onVideoWaiting}
          onPlaying={onVideoPlaying}
          onEnded={onVideoEnded}
        />
      ) : (
        <img
          src={story.src}
          alt=""
          className={cn(
            "w-full h-full object-contain transition-opacity duration-200",
            isInitialLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={onImageLoad}
        />
      )}
    </>
  );
}

interface StoryViewerModalProps {
  stories: Story[];
  username: string;
  avatar: string;
  timestamp?: string;
  initialIndex: number;
  viewedIndices: Set<number>;
  onClose: () => void;
  onStoryChange: (index: number) => void;
}

function StoryViewerModal({
  stories,
  username,
  avatar,
  timestamp,
  initialIndex,
  viewedIndices,
  onClose,
  onStoryChange,
}: StoryViewerModalProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const [progress, setProgress] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);
  const [duration, setDuration] = React.useState(DEFAULT_IMAGE_DURATION);
  const [localViewedIndices, setLocalViewedIndices] = React.useState(() => viewedIndices);
  const [direction, setDirection] = React.useState(0);
  const [isVideoReady, setIsVideoReady] = React.useState(false);
  const [isVideoBuffering, setIsVideoBuffering] = React.useState(false);

  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const progressIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = React.useRef<number>(0);
  const elapsedRef = React.useRef<number>(0);

  const currentStory = stories[currentIndex];

  const goToNext = React.useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
      elapsedRef.current = 0;
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const goToPrevious = React.useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
      elapsedRef.current = 0;
    } else {
      setProgress(0);
      elapsedRef.current = 0;
    }
  }, [currentIndex]);

  React.useEffect(() => {
    setLocalViewedIndices((prev) => new Set([...prev, currentIndex]));
    onStoryChange(currentIndex);
  }, [currentIndex, onStoryChange]);

  React.useEffect(() => {
    if (currentStory.type === "image") {
      setDuration(currentStory.duration || DEFAULT_IMAGE_DURATION);
    }
  }, [currentStory]);

  React.useEffect(() => {
    if (currentStory.type === "video") {
      if (isPaused) {
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
        }
      } else if (isVideoReady && !isVideoBuffering) {
        if (videoRef.current && videoRef.current.paused) {
          videoRef.current.play().catch(() => {});
        }
      }
      return;
    }

    if (isPaused || !isVideoReady) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      return;
    }

    startTimeRef.current = Date.now() - elapsedRef.current;

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      elapsedRef.current = elapsed;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        goToNext();
      }
    }, 50);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPaused, duration, goToNext, currentStory.type, isVideoReady, isVideoBuffering]);

  React.useEffect(() => {
    setProgress(0);
    elapsedRef.current = 0;
    startTimeRef.current = Date.now();
    setIsVideoReady(false);
    setIsVideoBuffering(false);
  }, [currentIndex]);

  const handleVideoReady = React.useCallback((videoDuration: number) => {
    setDuration(videoDuration);
    setIsVideoReady(true);
    setIsVideoBuffering(false);
  }, []);

  const handleVideoTimeUpdate = React.useCallback((currentTime: number, videoDuration: number) => {
    if (videoDuration > 0) {
      const newProgress = (currentTime / videoDuration) * 100;
      setProgress(newProgress);
    }
  }, []);

  const handleVideoWaiting = React.useCallback(() => {
    setIsVideoBuffering(true);
  }, []);

  const handleVideoPlaying = React.useCallback(() => {
    setIsVideoBuffering(false);
  }, []);

  const handleVideoEnded = React.useCallback(() => {
    goToNext();
  }, [goToNext]);

  const handleImageLoad = React.useCallback(() => {
    setIsVideoReady(true);
  }, []);

  const handlePointerDown = React.useCallback(() => {
    setIsPaused(true);
  }, []);

  const handlePointerUp = React.useCallback(() => {
    setIsPaused(false);
  }, []);

  const handleTap = React.useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const clientX = "touches" in e ? e.changedTouches[0].clientX : e.clientX;
      const x = clientX - rect.left;
      const halfWidth = rect.width / 2;

      if (x < halfWidth) {
        goToPrevious();
      } else {
        goToNext();
      }
    },
    [goToNext, goToPrevious]
  );

  const handleDragEnd = React.useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const { offset, velocity } = info;
      const swipeThreshold = 50;
      const velocityThreshold = 500;

      if (Math.abs(offset.x) > swipeThreshold || Math.abs(velocity.x) > velocityThreshold) {
        if (offset.x > 0) {
          goToPrevious();
        } else {
          goToNext();
        }
      }

      if (offset.y > 100 || velocity.y > 500) {
        onClose();
      }
    },
    [goToNext, goToPrevious, onClose]
  );

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
        case "Escape":
          onClose();
          break;
        case " ":
          e.preventDefault();
          setIsPaused((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious, onClose]);

  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        ref={containerRef}
        className="relative w-full h-full max-w-lg mx-auto flex flex-col overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div className="absolute top-0 left-0 right-0 z-10 pt-2 pb-4 bg-gradient-to-b from-black/60 to-transparent">
          <ProgressBar
            count={stories.length}
            currentIndex={currentIndex}
            progress={progress}
            viewedIndices={localViewedIndices}
          />

          <div className="flex items-center justify-between px-4 mt-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src={avatar} alt={username} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-white text-sm font-medium">{username}</span>
                {timestamp && (
                  <span className="text-white/60 text-xs">
                    {formatTimestamp(timestamp)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isPaused && (
                <div className="flex items-center gap-1 text-white/80">
                  <Pause className="w-4 h-4" />
                  <span className="text-xs">Paused</span>
                </div>
              )}

              {currentStory.type === "video" && (
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center justify-center rounded-md",
                    "h-8 w-8 text-white hover:bg-white/20 transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted((prev) => !prev);
                  }}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
              )}

              <button
                type="button"
                className={cn(
                  "inline-flex items-center justify-center rounded-md",
                  "h-8 w-8 text-white hover:bg-white/20 transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div
          className="flex-1 flex items-center justify-center overflow-hidden select-none relative"
          onClick={handleTap}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentStory.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <StoryContent
                story={currentStory}
                isMuted={isMuted}
                isInitialLoading={!isVideoReady}
                isBuffering={isVideoBuffering}
                onVideoReady={handleVideoReady}
                onVideoTimeUpdate={handleVideoTimeUpdate}
                onVideoWaiting={handleVideoWaiting}
                onVideoPlaying={handleVideoPlaying}
                onVideoEnded={handleVideoEnded}
                onImageLoad={handleImageLoad}
                videoRef={videoRef}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="hidden md:flex absolute inset-y-0 left-0 right-0 items-center justify-between pointer-events-none px-4">
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center",
              "h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors pointer-events-auto",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
              "disabled:pointer-events-none disabled:opacity-50",
              currentIndex === 0 && "opacity-50 cursor-not-allowed"
            )}
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            disabled={currentIndex === 0}
            aria-label="Previous story"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center",
              "h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors pointer-events-auto",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            )}
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label={currentIndex === stories.length - 1 ? "Close" : "Next story"}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

const StoryViewer = React.forwardRef<HTMLDivElement, StoryViewerProps>(
  (
    {
      stories,
      username,
      avatar,
      timestamp,
      onStoryView,
      onAllStoriesViewed,
      className,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [viewedIndices, setViewedIndices] = React.useState<Set<number>>(() => new Set());
    const thumbnailRef = React.useRef<HTMLDivElement>(null);

    const firstUnviewedIndex = React.useMemo(() => {
      for (let i = 0; i < stories.length; i++) {
        if (!viewedIndices.has(i)) return i;
      }
      return 0;
    }, [stories.length, viewedIndices]);

    const handleOpen = React.useCallback(() => {
      setIsOpen(true);
    }, []);

    const handleClose = React.useCallback(() => {
      setIsOpen(false);
    }, []);

    const handleStoryChange = React.useCallback(
      (index: number) => {
        setViewedIndices((prev) => {
          const next = new Set(prev);
          next.add(index);

          if (next.size === stories.length && onAllStoriesViewed) {
            onAllStoriesViewed();
          }

          return next;
        });

        if (onStoryView) {
          onStoryView(stories[index].id);
        }
      },
      [stories, onStoryView, onAllStoriesViewed]
    );

    return (
      <>
        <div ref={ref} className={className}>
          <div ref={thumbnailRef}>
            <StoryThumbnail
              stories={stories}
              username={username}
              viewedIndices={viewedIndices}
              onClick={handleOpen}
            />
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <StoryViewerModal
              stories={stories}
              username={username}
              avatar={avatar}
              timestamp={timestamp}
              initialIndex={firstUnviewedIndex}
              viewedIndices={viewedIndices}
              onClose={handleClose}
              onStoryChange={handleStoryChange}
            />
          )}
        </AnimatePresence>
      </>
    );
  }
);

StoryViewer.displayName = "StoryViewer";

export { StoryViewer };
