"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../_utils/cn";
import { Upload, X } from "lucide-react";

interface AudioUploadCardProps {
  className?: string;
  triggerAnimation?: boolean;
  onAnimationComplete?: () => void;
  title?: string;
  description?: string;
}

interface WaveformProps {
  width?: number;
  height?: number;
  bars?: number;
}

interface UploadCardBaseProps {
  children: React.ReactNode;
  className?: string;
  isDragOver?: boolean;
  isUploading?: boolean;
}

const Waveform = ({ width = 300, height = 40, bars = 60 }: WaveformProps) => {
  const [barsArray, setBarsArray] = useState<React.ReactElement[]>([]);

  useEffect(() => {
    const barWidth = (width / bars) * 0.5; // Thinner bars (60% of available space)
    const spacing = (width / bars) * 0.4; // Spacing between bars
    const centerY = height / 2;
    const cornerRadius = barWidth * 0.7; // Rounded corners

    const newBarsArray = [];

    // Calculate total width of all bars and spacing
    const totalBarsWidth = (barWidth + spacing) * bars - spacing; // Subtract last spacing
    const startX = (width - totalBarsWidth) / 2; // Center the waveform

    for (let i = 0; i < bars; i++) {
      const x = startX + i * (barWidth + spacing);
      const barHeight = Math.random() * (height * 0.6) + height * 0.1; // Random height between 10% and 70% of total height
      const topY = centerY - barHeight / 2;

      newBarsArray.push(
        <rect
          key={i}
          x={x}
          y={topY}
          width={barWidth}
          height={barHeight}
          rx={cornerRadius}
          ry={cornerRadius}
          fill="currentColor"
          className="text-muted-foreground/60"
        />
      );
    }

    setBarsArray(newBarsArray);
  }, [width, height, bars]);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {barsArray}
    </svg>
  );
};

const UploadCardBase = ({ children, className, isDragOver = false, isUploading = false }: UploadCardBaseProps) => {
  const hasChildren = React.Children.count(children) > 0;

  return (
    <div
      className={cn(
        "rounded-xl border-2 border-dashed border-border/60 p-6 backdrop-blur-sm min-h-[120px] flex items-center justify-center relative transition-colors duration-200",
        // Add cursor pointer when clickable and not uploading
        !isUploading && "cursor-pointer hover:bg-accent/20",
        // Background color changes based on state
        isUploading
          ? "bg-primary/20 border-primary/60"
          : isDragOver
            ? "bg-accent/40 border-accent/80 shadow-inner"
            : "bg-card",
        className
      )}
    >
      {/* Upload icon in background - only shows when no children */}
      {!hasChildren && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Upload
            size={48}
            className={cn(
              "transition-colors duration-200",
              isDragOver ? "text-primary" : "text-muted",
              isUploading && "text-primary"
            )}
          />
        </div>
      )}

      {/* Content layer - above the background icon */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};

interface AudioComponentProps {
  isAnimating: boolean;
  onAnimationComplete?: () => void;
  filename?: string;
  onRemove?: () => void;
}

// Utility function to truncate filename
const truncateFilename = (filename: string, maxLength: number = 20) => {
  if (filename.length <= maxLength) return filename;
  const extension = filename.split('.').pop();
  const nameWithoutExt = filename.replace(`.${extension}`, '');
  const truncatedName = nameWithoutExt.substring(0, maxLength - 3 - extension!.length);
  return `${truncatedName}...${extension}`;
};

const AudioComponent = ({
  isAnimating,
  onAnimationComplete,
  filename = "audio.mp3",
  onRemove,
}: AudioComponentProps) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  // Update shouldShow when isAnimating changes
  useEffect(() => {
    if (isAnimating) {
      setShouldShow(true);
    }
  }, [isAnimating]);

  // Don't render if we shouldn't show and we're not removing
  if (!shouldShow && !isRemoving) return null;

  const displayName = truncateFilename(filename);

  const handleRemove = () => {
    setIsRemoving(true);
  };

  const handleRemoveComplete = () => {
    setShouldShow(false);
    setIsRemoving(false);
    onRemove?.();
  };

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          className="absolute z-20"
          initial={{
            // Start at bottom-right corner of the main card
            right: 20,
            bottom: 20,
            opacity: 0,
          }}
          animate={isRemoving ? {
            scale: 0,
            opacity: 0,
            filter: "blur(8px)",
            transition: {
              duration: 0.4,
              ease: [0.23, 1, 0.32, 1],
            }
          } : {
            // Move quickly from bottom-right to center  
            left: "50%",
            top: "calc(50% - 15px)", // Dynamic center of upload area
            x: "-50%",
            y: "-50%",
            opacity: 1,
            transition: {
              duration: 0.6, // Much faster
              ease: [0.23, 1, 0.32, 1],
            },
          }}
          exit={{
            scale: 0,
            opacity: 0,
            filter: "blur(8px)",
            transition: {
              duration: 0.4,
              ease: [0.23, 1, 0.32, 1],
            }
          }}
          style={{
            transformOrigin: "center",
          }}
          onAnimationComplete={isRemoving ? handleRemoveComplete : onAnimationComplete}
        >
          <motion.div 
            initial={{ scale: 1.5 }}
            animate={isRemoving ? {
              scale: 0,
              transition: { duration: 0.4 }
            } : [
              // Phase 1: Stay big while moving
              {
                scale: 1.1,
                transition: {
                  ease: "easeInOut",
                },
              },
              // Phase 2: Scale down to normal size
              {
                scale: 1.0,
                transition: {
                  duration: 0.8, // Faster
                  ease: [0.68, -0.55, 0.265, 1.55], // Bounce effect
                },
              },
            ]}
            className="rounded-lg border border-border/30 bg-muted px-2 py-1.5 backdrop-blur-sm shadow-lg relative group"
          >
            {/* X button */}
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110 z-30"
            >
              <X size={12} />
            </button>

            <div className="w-full flex items-center justify-center">
              <Waveform width={180} height={32} bars={40} />
            </div>
            <div className="">
              <span className="text-xs text-foreground/60 font-medium text-left">
                {displayName}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export function AudioUploadCard({
  className,
  triggerAnimation = false,
  onAnimationComplete,
  title = "Upload Your Audio",
  description = "Drop in your recordings and start transcribing instantly.",
}: AudioUploadCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (triggerAnimation) {
      setIsAnimating(true);
    }
  }, [triggerAnimation]);

  const handleAnimationComplete = () => {
    // Don't automatically stop the animation - keep it visible
    onAnimationComplete?.();
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find(file => file.type.startsWith('audio/'));

    if (audioFile) {
      setUploadedFile(audioFile);
      setIsUploading(true);

      // Simulate upload process
      setTimeout(() => {
        setIsUploading(false);
        setIsAnimating(true); // Trigger animation after upload
      }, 200); // Much faster upload simulation
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setUploadedFile(file);
      setIsUploading(true);

      // Simulate upload process
      setTimeout(() => {
        setIsUploading(false);
        setIsAnimating(true); // Trigger animation after upload
      }, 200); // Much faster upload simulation
    }
  }, []);

  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null);
    setIsAnimating(false);
    // Reset the file input so it can trigger onChange again for the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleBaseClick = useCallback(() => {
    if (!isUploading && !uploadedFile) {
      fileInputRef.current?.click();
    }
  }, [isUploading, uploadedFile]);
  return (
    <motion.div
      className={cn("relative w-full max-w-md mx-auto", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-border/50 bg-card p-6 text-center"
        )}
      >
        <div className="flex flex-col justify-center space-y-8">
          <div className="relative w-full mx-auto">
            <div
              className="relative"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleBaseClick}
            >
              <UploadCardBase
                isDragOver={isDragOver}
                isUploading={isUploading}
              />

              {/* Hidden file input for click-to-upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                className="sr-only"
              />
            </div>
          </div>

          <div className="flex flex-col items-start">
            <h2 className="text-lg font-semibold text-foreground text-left">
              {title}
            </h2>

            <p className="text-sm text-muted-foreground text-left">
              {description}
            </p>
          </div>
        </div>

        <AudioComponent
          isAnimating={isAnimating}
          onAnimationComplete={handleAnimationComplete}
          filename={uploadedFile?.name}
          onRemove={handleRemoveFile}
        />
      </div>
    </motion.div>
  );
}
