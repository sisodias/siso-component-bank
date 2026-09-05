import * as React from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

import { cn } from "../_utils/cn";

/**
 * @typedef {object} MusicCardProps
 * @property {string} imageUrl - The URL for the background image of the card.
 * @property {string} title - The main title displayed on the card (e.g., "Now Playing").
 * @property {string} artist - The name of the artist.
 * @property {string} songTitle - The title of the song.
 * @property {() => void} [onPlay] - Optional callback for the play button's click event.
 */
interface MusicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  title: string;
  artist: string;
  songTitle: string;
  onPlay?: () => void;
}

const MusicCard = React.forwardRef<HTMLDivElement, MusicCardProps>(
  ({ className, imageUrl, title, artist, songTitle, onPlay, ...props }, ref) => {
    // Animation variants for the main card container
    const cardVariants = {
      initial: { scale: 1 },
      hover: { scale: 1.03, transition: { type: "spring", stiffness: 300, damping: 20 } },
    };

    // Parallax effect for the background image
    const imageVariants = {
      initial: { scale: 1.1 },
      hover: { scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } },
    };

    // Fade-in and scale animation for the play button
    const playButtonVariants = {
      initial: { scale: 0.8, opacity: 0 },
      hover: { scale: 1.1, opacity: 1 },
      tap: { scale: 0.95 },
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative h-64 w-full max-w-xs cursor-pointer overflow-hidden rounded-2xl border bg-card shadow-lg",
          className
        )}
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        {...props}
      >
        {/* Background Image */}
        <motion.img
          src={imageUrl}
          alt={`${artist} - ${songTitle}`}
          className="absolute inset-0 h-full w-full object-cover"
          variants={imageVariants}
        />

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-end p-5">
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-primary-foreground">{title}</h3>
              <p className="text-sm text-primary-foreground/80">{`${artist} - ${songTitle}`}</p>
            </div>
            <motion.button
              onClick={(e) => {
                e.stopPropagation(); // Prevent card's onClick if button is clicked
                onPlay?.();
              }}
              aria-label="Play song"
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
              variants={playButtonVariants}
              whileTap="tap"
            >
              <Play className="h-6 w-6 translate-x-px fill-current" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }
);

MusicCard.displayName = "MusicCard";

export { MusicCard };