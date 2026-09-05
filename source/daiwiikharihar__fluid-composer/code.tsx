"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// --- Apple Palette Constants ---
const PALETTE = {
  lightGray: "#E5E5EA",
  midGray: "#8E8E93",
  darkGray2: "#3A3A3C",
  darkGray: "#1C1C1E",
  blue: "#007AFF",
  green: "#34C759",
  orange: "#FF9500",
  red: "#FF3B30",
};

// --- Icons ---
const Icons = {
  Image: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="4" ry="4" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  ),
  X: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      {...props}
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  Smile: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ),
  Globe: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Loader: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
      className="animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
};

const ANIMATED_EMOJIS = [
  "😂",
  "❤️",
  "🔥",
  "👍",
  "😭",
  "😍",
  "😮",
  "🎉",
  "💀",
  "🚀",
  "👀",
  "💯",
];

// --- Animation Config ---
// High-quality spring physics for that "Apple" feel
const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

export default function ComposeBox({ userAvatar }: { userAvatar: string }) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [text, setText] = React.useState("");
  const [media, setMedia] = React.useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const [isPosting, setIsPosting] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const maxLength = 280;
  const progress = (text.length / maxLength) * 100;
  const remaining = maxLength - text.length;

  // --- Click Outside Logic ---
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        containerRef.current.contains(event.target as Node)
      ) {
        return;
      }
      if (!isPosting) {
        setIsFocused(false);
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPosting]);

  // Determine Ring Color
  let ringColor = PALETTE.blue;
  if (remaining < 50) ringColor = PALETTE.orange;
  if (remaining < 20) ringColor = PALETTE.red;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMedia(url);
      setIsFocused(true);
      setShowEmojiPicker(false);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setText((prev) => prev + emoji);
  };

  const handlePost = () => {
    setIsPosting(true);
    setTimeout(() => {
      setIsPosting(false);
      setText("");
      setMedia(null);
      setIsFocused(false);
    }, 1500);
  };

  const isPostDisabled = (text.length === 0 && !media) || isPosting;

  return (
    <motion.div
      ref={containerRef}
      layout
      // Use variables for clean palette mapping
      style={{
        ["--apple-blue" as string]: PALETTE.blue,
        ["--apple-border-light" as string]: PALETTE.lightGray,
        ["--apple-border-dark" as string]: PALETTE.darkGray2,
      }}
      // 1. Container Variants for "Breathing" Effect
      initial="collapsed"
      animate={isFocused || media ? "focused" : "collapsed"}
      variants={{
        collapsed: { scale: 0.98, boxShadow: "0px 4px 12px rgba(0,0,0,0.05)" },
        focused: { scale: 1, boxShadow: "0px 20px 40px rgba(0,0,0,0.12)" },
      }}
      transition={springTransition}
      className={cn(
        "group w-full max-w-lg overflow-hidden rounded-[28px] p-5 transition-colors relative z-20",
        // Glassmorphism Bases
        "bg-white/80 border border-[var(--apple-border-light)]",
        "dark:bg-[#1C1C1E]/90 dark:border-[var(--apple-border-dark)]",
        "backdrop-blur-2xl"
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <motion.div
            layout
            className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-offset-2 ring-transparent transition-all duration-300 group-focus-within:ring-[var(--apple-blue)]"
          >
            <Image src={userAvatar} alt="User" fill className="object-cover" />
          </motion.div>
        </div>

        <div className="flex-1 min-w-0 relative">
          <motion.div layout>
            {/* Visibility Toggle - Fade In/Out */}
            <AnimatePresence>
              {isFocused && (
                <motion.button
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{
                    opacity: { duration: 0.2 },
                    layout: springTransition,
                  }}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-colors text-[#007AFF] bg-[#007AFF]/10 hover:bg-[#007AFF]/20"
                >
                  <Icons.Globe className="w-3.5 h-3.5" />
                  Everyone can reply
                </motion.button>
              )}
            </AnimatePresence>

            {/* 2. Fluid Height Text Area */}
            {/* We animate the container's minHeight instead of using rows for smoother resizing */}
            <motion.div
              layout
              initial={{ minHeight: "40px" }}
              animate={{ minHeight: isFocused || media ? "120px" : "40px" }}
              transition={springTransition}
              className="relative"
            >
              <textarea
                onFocus={() => {
                  setIsFocused(true);
                  setShowEmojiPicker(false);
                }}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What is happening?!"
                className={cn(
                  "w-full h-full resize-none bg-transparent text-[23px] leading-relaxed outline-none transition-colors absolute inset-0",
                  "text-black placeholder-[#8E8E93]",
                  "dark:text-white dark:placeholder-[#636366]"
                )}
              />
            </motion.div>

            {/* Image Preview */}
            <AnimatePresence>
              {media && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10, height: 0 }}
                  animate={{ opacity: 1, scale: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, scale: 0.9, height: 0 }}
                  transition={springTransition}
                  className="relative mt-3 w-full overflow-hidden rounded-2xl border border-black/5 dark:border-white/10"
                >
                  <img
                    src={media}
                    alt="Upload preview"
                    className="max-h-[300px] w-full object-cover"
                  />
                  <button
                    onClick={() => setMedia(null)}
                    className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white backdrop-blur-md transition-transform hover:scale-110 hover:bg-black/70"
                  >
                    <Icons.X className="h-4 w-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Emoji Picker */}
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={springTransition}
                  className="overflow-hidden"
                >
                  <div className="mt-3 grid grid-cols-6 gap-2 rounded-2xl p-3 bg-gray-100/50 dark:bg-white/5">
                    {ANIMATED_EMOJIS.map((emoji) => (
                      <motion.button
                        key={emoji}
                        whileHover={{ scale: 1.4, rotate: [0, -10, 10, 0] }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEmojiClick(emoji)}
                        className="flex h-10 w-10 items-center justify-center text-2xl"
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Action Bar - Slide In/Out */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto", marginTop: 16 }}
                exit={{ opacity: 0, y: -10, height: 0, marginTop: 0 }}
                transition={springTransition}
                className="flex items-center justify-between border-t border-[var(--apple-border-light)] dark:border-[var(--apple-border-dark)] pt-4 overflow-hidden"
              >
                <div className="flex gap-1">
                  <motion.button
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: `${PALETTE.blue}15`,
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-full p-2.5 transition-colors text-[#007AFF]"
                  >
                    <Icons.Image className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: `${PALETTE.blue}15`,
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`rounded-full p-2.5 transition-colors text-[#007AFF] ${
                      showEmojiPicker ? "bg-blue-100 dark:bg-blue-900/30" : ""
                    }`}
                  >
                    <Icons.Smile className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="flex items-center gap-4">
                  {/* Character Count */}
                  {text.length > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-3"
                    >
                      {remaining < 20 && (
                        <span
                          className={`text-xs font-bold`}
                          style={{ color: PALETTE.red }}
                        >
                          {remaining}
                        </span>
                      )}
                      <div className="relative h-6 w-6">
                        <svg className="h-full w-full -rotate-90">
                          <circle
                            cx="12"
                            cy="12"
                            r="9"
                            stroke={PALETTE.lightGray}
                            strokeWidth="2"
                            fill="none"
                            className="dark:stroke-[#3A3A3C]"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="9"
                            stroke={ringColor}
                            strokeWidth="2"
                            fill="none"
                            strokeDasharray="56.5"
                            strokeDashoffset={56.5 - (56.5 * progress) / 100}
                            strokeLinecap="round"
                            className="transition-all duration-300"
                          />
                        </svg>
                      </div>
                    </motion.div>
                  )}

                  <div className="h-8 w-[1px] bg-[var(--apple-border-light)] dark:bg-[var(--apple-border-dark)]" />

                  <motion.button
                    onClick={handlePost}
                    whileHover={{ brightness: 1.1, scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    disabled={isPostDisabled}
                    className="relative rounded-full px-5 py-2 font-bold text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px] bg-[#007AFF]"
                  >
                    {isPosting ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icons.Loader className="h-5 w-5 text-white" />
                      </div>
                    ) : (
                      "Post"
                    )}
                    <span
                      className={isPosting ? "opacity-0" : "opacity-100"}
                    ></span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
