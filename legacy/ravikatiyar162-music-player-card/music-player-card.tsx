import * as React from "react";
import { cn } from "../_utils/cn";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Share, Heart, SkipBack, SkipForward, Play, Pause } from "lucide-react";

// Props interface for type-safety and reusability
export interface MusicPlayerCardProps extends React.HTMLAttributes<HTMLDivElement> {
  artistName: string;
  artistHandle: string;
  avatarSrc: string;
  albumArtSrc: string;
  songDuration: number; // in seconds
  currentProgress: number; // in seconds
  isPlaying: boolean;
  isLiked: boolean;
  onPlayPauseClick: () => void;
  onLikeClick: () => void;
  onNextClick?: () => void;
  onPrevClick?: () => void;
  onShareClick?: () => void;
}

// Utility to format time from seconds to mm:ss
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const MusicPlayerCard = React.forwardRef<HTMLDivElement, MusicPlayerCardProps>(
  (
    {
      className,
      artistName,
      artistHandle,
      avatarSrc,
      albumArtSrc,
      songDuration,
      currentProgress,
      isPlaying,
      isLiked,
      onPlayPauseClick,
      onLikeClick,
      onNextClick,
      onPrevClick,
      onShareClick,
      ...props
    },
    ref
  ) => {
    const progressPercentage = (currentProgress / songDuration) * 100;

    return (
      <div
        ref={ref}
        className={cn(
          "w-full max-w-sm rounded-2xl border border-border/20 bg-card/60 p-4 shadow-lg backdrop-blur-lg transition-all duration-300",
          className
        )}
        {...props}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={avatarSrc} alt={artistName} />
              <AvatarFallback>{artistName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-card-foreground">{artistName}</p>
              <p className="text-xs text-muted-foreground">{artistHandle}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={onShareClick} aria-label="Share song">
              <Share className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onLikeClick} aria-label="Like song">
              <Heart
                className={cn("h-4 w-4 transition-all", isLiked && "fill-red-500 text-red-500")}
              />
            </Button>
          </div>
        </div>

        {/* Album Art & Controls Section */}
        <div className="relative mt-4 w-full aspect-square overflow-hidden rounded-lg">
          <img
            src={albumArtSrc}
            alt={`Album art for song by ${artistName}`}
            className="h-full w-full object-cover"
          />
          {/* Controls Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent p-4">
            {/* Progress Bar & Timestamps */}
            <div className="mb-3">
                {/* FIX: Changed text color to white for visibility on dark overlay */}
                <div className="flex justify-between text-xs text-white/90">
                    <span>{formatTime(currentProgress)}</span>
                    <span>-{formatTime(songDuration - currentProgress)}</span>
                </div>
                <div 
                    className="group relative mt-1 h-1.5 w-full cursor-pointer rounded-full bg-white/20" // FIX: Changed track background
                    role="progressbar"
                    aria-valuenow={progressPercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                >
                    <div
                    className="h-full rounded-full bg-white transition-all duration-200 ease-linear" // FIX: Changed fill color to white
                    style={{ width: `${progressPercentage}%` }}
                    />
                    <div
                    className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" // FIX: Changed thumb color to white
                    style={{ left: `calc(${progressPercentage}% - 6px)` }}
                    />
                </div>
            </div>

            {/* Playback Buttons */}
            {/* FIX: Changed icon color to white for visibility on dark overlay */}
            <div className="flex items-center justify-around text-white">
                <Button variant="ghost" size="icon" className="text-current hover:bg-white/10" onClick={onPrevClick} aria-label="Previous song">
                    <SkipBack className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-12 w-12 text-current hover:bg-white/10" onClick={onPlayPauseClick} aria-label={isPlaying ? "Pause song" : "Play song"}>
                    {isPlaying ? (
                        <Pause className="h-7 w-7 fill-current" />
                    ) : (
                        <Play className="h-7 w-7 fill-current" />
                    )}
                </Button>
                <Button variant="ghost" size="icon" className="text-current hover:bg-white/10" onClick={onNextClick} aria-label="Next song">
                    <SkipForward className="h-5 w-5" />
                </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

MusicPlayerCard.displayName = "MusicPlayerCard";

export { MusicPlayerCard };