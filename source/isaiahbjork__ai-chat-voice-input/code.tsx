"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Send, Image, X, AudioLines, Square } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface AIVoiceInputProps {
  placeholder?: string;
  onSend?: (message: string) => void;
  onFileAttach?: () => void;
  onVoiceStart?: () => void;
  onVoiceStop?: (duration: number) => void;
  enableAnimations?: boolean;
  className?: string;
  disabled?: boolean;
  
  // Voice settings
  visualizerBars?: number;
  demoMode?: boolean;
  demoInterval?: number;

  // Button border color
  buttonBorderColor?: {
    light: string;
    dark: string;
  };
}

export function AIVoiceInput({
  placeholder = "Send message...",
  onSend,
  onVoiceStart,
  onVoiceStop,
  enableAnimations = true,
  className,
  disabled = false,
  demoMode = false,
  demoInterval = 3000,

  buttonBorderColor = {
    light: "#DBDBD8",  // Light gray for light mode
    dark: "#4A4A4A"    // Darker gray for dark mode
  },
}: AIVoiceInputProps) {
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceTime, setVoiceTime] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isDemo, setIsDemo] = useState(demoMode);
  
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = enableAnimations && !shouldReduceMotion;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  // Fix hydration mismatch - only apply theme after mounting
  useEffect(() => {
    setMounted(true);
    setIsClient(true);
  }, []);

  // Get current theme's button border color
  const isDark = mounted && theme === "dark";
  const currentButtonBorderColor = isDark ? buttonBorderColor.dark : buttonBorderColor.light;

  // Voice timer effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isVoiceActive) {
      onVoiceStart?.();
      intervalId = setInterval(() => {
        setVoiceTime((t) => t + 1);
      }, 1000);
    } else {
      onVoiceStop?.(voiceTime);
      setVoiceTime(0);
    }

    return () => clearInterval(intervalId);
  }, [isVoiceActive, voiceTime, onVoiceStart, onVoiceStop]);

  // Demo mode effect
  useEffect(() => {
    if (!isDemo) return;

    let timeoutId: NodeJS.Timeout;
    const runAnimation = () => {
      setIsVoiceActive(true);
      timeoutId = setTimeout(() => {
        setIsVoiceActive(false);
        timeoutId = setTimeout(runAnimation, 1000);
      }, demoInterval);
    };

    const initialTimeout = setTimeout(runAnimation, 100);
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(initialTimeout);
    };
  }, [isDemo, demoInterval]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && onSend && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
    e.target.value = ''; // Reset input
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleVoiceClick = () => {
    if (isDemo) {
      setIsDemo(false);
      setIsVoiceActive(false);
    } else {
      setIsVoiceActive(prev => !prev);
    }
  };

  return (
    <motion.div
      className={cn(
        "relative w-full mx-auto",
        className
      )}
      initial={shouldAnimate ? { opacity: 0, y: 20 } : {}}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      }}
    >
        {/* Main container with visible borders */}
        <div className="relative">
          {/* Simple border with good visibility */}
          <div className="relative rounded-[20px] border-2 border-border bg-background">
            
            {/* Subtle bottom shadow */}
            <div className="absolute -bottom-1 left-4 right-4 h-2 bg-foreground/5 rounded-full blur-sm" />

            {/* Content container - Two row layout */}
            <div className="relative p-4">
              
              {/* Voice Overlay - covers entire component content */}
              <AnimatePresence>
                {isVoiceActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center rounded-[20px] z-10"
                  >
                    <div className="flex flex-col items-center gap-3">
                      {/* Cancel button */}
                      <button
                        onClick={() => setIsVoiceActive(false)}
                        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-muted/50 hover:bg-muted/70 flex items-center justify-center transition-colors"
                      >
                        <Square className="w-3 h-3 text-red-500" />
                      </button>

                      {/* Timer */}
                      <span className="font-mono text-sm text-foreground/70">
                        {formatTime(voiceTime)}
                      </span>

                      {/* Waveform - smaller size */}
                      <div className="h-8 w-48 flex items-center justify-center gap-0.5">
                        {[...Array(24)].map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "w-0.5 rounded-full transition-all duration-300",
                              isVoiceActive
                                ? "bg-foreground/50 animate-pulse"
                                : "bg-foreground/20 h-1"
                            )}
                            style={
                              isVoiceActive && isClient
                                ? {
                                    height: `${30 + Math.random() * 70}%`,
                                    animationDelay: `${i * 0.05}s`,
                                  }
                                : undefined
                            }
                          />
                        ))}
                      </div>

                      <p className="text-xs text-foreground/60">
                        Listening...
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Top row: Text input + Send button (appears when typing) */}
              <div className="flex items-start gap-3 mb-3">
                {/* Text input area with voice overlay */}
                <div className="flex-1 relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled || isVoiceActive}
                    rows={1}
                    className={cn(
                      "w-full resize-none border-0 bg-transparent",
                      "text-foreground placeholder:text-muted-foreground",
                      "text-base leading-6 py-2 px-0",
                      "focus:outline-none focus:ring-0 outline-none",
                      "overflow-hidden",
                      "transition-colors duration-200",
                      (disabled || isVoiceActive) && "opacity-50 cursor-not-allowed",
                      isVoiceActive && "opacity-30"
                    )}
                    style={{
                      minHeight: "40px",
                      maxHeight: "120px",
                      height: "auto",
                      outline: "none !important",
                      boxShadow: "none !important",
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = "auto";
                      target.style.height = Math.min(target.scrollHeight, 120) + "px";
                    }}
                  />

                </div>

                {/* Send button - Top right corner (only show when typing) */}
                <AnimatePresence>
                  {message.trim() && (
                    <motion.button
                      type="submit"
                      onClick={handleSubmit}
                      disabled={disabled || !message.trim()}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={cn(
                        "flex items-center justify-center",
                        "w-8 h-8 mt-1", // Align with text top
                        "text-muted-foreground hover:text-foreground",
                        "transition-colors cursor-pointer",
                        disabled && "opacity-50 cursor-not-allowed"
                      )}
                      whileHover={shouldAnimate ? { scale: 1.1 } : {}}
                      whileTap={shouldAnimate ? { scale: 0.9 } : {}}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom row: File pills + Attach File + Voice buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Attach File button */}
                  <motion.button
                    type="button"
                    onClick={handleFileAttachment}
                    disabled={disabled}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5",
                      "text-sm text-muted-foreground hover:text-foreground",
                      "rounded-full transition-colors cursor-pointer",
                      "bg-muted/30 hover:bg-muted/50",
                      disabled && "opacity-50 cursor-not-allowed"
                    )}
                    style={{
                      border: `1px solid ${currentButtonBorderColor}`
                    }}
                    whileHover={shouldAnimate ? { scale: 1.02 } : {}}
                    whileTap={shouldAnimate ? { scale: 0.98 } : {}}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                    }}
                  >
                    <Image className="w-3 h-3" aria-hidden="true" />
                    <span>Attach Image</span>
                  </motion.button>

                  {/* Vertical line separator */}
                  {attachedFiles.length > 0 && (
                  <div
                    className="h-6 w-px"
                    style={{ backgroundColor: currentButtonBorderColor }}
                  />
                  )}
                  
                  {/* File pills */}
                  {attachedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {attachedFiles.map((file, index) => (
                        <motion.div
                          key={`${file.name}-${index}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className={cn(
                            "flex items-center gap-2 px-3 py-1.5",
                            "text-sm text-muted-foreground",
                            "rounded-full border",
                            "bg-muted/50"
                          )}
                          style={{
                            border: `1px solid ${currentButtonBorderColor}`
                          }}
                        >
                          <span className="truncate max-w-[100px]">{file.name}</span>
                          <button
                            onClick={() => removeFile(index)}
                            className="flex-shrink-0 w-4 h-4 rounded-full bg-muted-foreground/20 hover:bg-destructive/20 flex items-center justify-center"
                          >
                            <X className="w-3 h-3 text-foreground hover:text-destructive" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Voice button - right side */}
                <motion.button
                  type="button"
                  onClick={handleVoiceClick}
                  disabled={disabled}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5",
                    "text-sm text-muted-foreground hover:text-foreground",
                    "rounded-full transition-colors cursor-pointer",
                    "bg-muted/30 hover:bg-muted/50",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                  style={{
                    border: `1px solid ${currentButtonBorderColor}`
                  }}
                  whileHover={shouldAnimate ? { scale: 1.02 } : {}}
                  whileTap={shouldAnimate ? { scale: 0.98 } : {}}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                >
                  <AudioLines className="w-3 h-3" aria-hidden="true" />
                  <span>Voice</span>
                </motion.button>

              </div>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          />
        </div>
      </motion.div>
  );
}
