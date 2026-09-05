"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Send, ChevronDown, Image, X, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "../_utils/cn";

interface GradientColors {
  topLeft: string;
  topRight: string;
  bottomRight: string;
  bottomLeft: string;
}

interface ThemeGradients {
  light: GradientColors;
  dark: GradientColors;
}

interface DropdownOption {
  id: string;
  label: string;
  value: string;
}

interface GradientAIChatInputProps {
  placeholder?: string;
  onSend?: (message: string) => void;
  onFileAttach?: () => void;
  enableAnimations?: boolean;
  className?: string;
  disabled?: boolean;

  // Dropdown options
  dropdownOptions?: DropdownOption[];
  onOptionSelect?: (option: DropdownOption) => void;

  // Gradient customization - now theme-aware
  mainGradient?: ThemeGradients;
  outerGradient?: ThemeGradients;
  innerGradientOpacity?: number;
  buttonBorderColor?: {
    light: string;
    dark: string;
  };

  // Shadow customization
  enableShadows?: boolean;
  shadowOpacity?: number;
  shadowColor?: {
    light: string;
    dark: string;
  };
}

export function GradientAIChatInput({
  placeholder = "Send message...",
  onSend,
  enableAnimations = true,
  className,
  disabled = false,

  // Dropdown options with defaults
  dropdownOptions = [
    { id: "option1", label: "ChatGPT", value: "chatgpt" },
    { id: "option2", label: "Claude", value: "claude" },
    { id: "option3", label: "Gemini", value: "gemini" }
  ],
  onOptionSelect,

  // Theme-aware gradient defaults
  mainGradient = {
    light: {
      topLeft: "#F5E9AD",
      topRight: "#F6B4AD", 
      bottomRight: "#F5ABA0",
      bottomLeft: "#F5DCBA"
    },
    dark: {
      topLeft: "#B8905A",    // Much darker amber
      topRight: "#B86B42",   // Much darker orange
      bottomRight: "#A8502D", // Very deep orange-red
      bottomLeft: "#B89E6E"  // Much darker golden
    }
  },
  outerGradient = {
    light: {
      topLeft: "#E5D99D",
      topRight: "#E6A49D",
      bottomRight: "#E59B90", 
      bottomLeft: "#E5CCBA"
    },
    dark: {
      topLeft: "#996F40",    // Very dark outer border
      topRight: "#99532D",   
      bottomRight: "#8A3F22",
      bottomLeft: "#997D50"
    }
  },
  innerGradientOpacity = 0.1,
  buttonBorderColor = {
    light: "#DBDBD8",  // Light gray for light mode
    dark: "#4A4A4A"    // Darker gray for dark mode
  },

  // Shadow defaults
  enableShadows = true,
  shadowOpacity = 1,
  shadowColor = {
    light: "rgb(0, 0, 0)", // Black shadow for light mode
    dark: "rgb(184, 107, 66)" // Orange shadow for dark mode
  },
}: GradientAIChatInputProps) {
  const [message, setMessage] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = enableAnimations && !shouldReduceMotion;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  // Fix hydration mismatch - only apply theme after mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get current theme's gradients - default to light mode for SSR
  const isDark = mounted && theme === "dark";
  const currentMainGradient = isDark ? mainGradient.dark : mainGradient.light;
  const currentOuterGradient = isDark ? outerGradient.dark : outerGradient.light;
  const currentButtonBorderColor = isDark ? buttonBorderColor.dark : buttonBorderColor.light;
  const currentShadowColor = isDark ? shadowColor.dark : shadowColor.light;

  // Utility function to convert hex or rgb to rgba
  const hexToRgba = (color: string, alpha: number): string => {
    // Handle RGB format: rgb(r, g, b)
    if (color.startsWith('rgb(')) {
      const rgbValues = color.slice(4, -1).split(',').map(val => parseInt(val.trim()));
      return `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, ${alpha})`;
    }

    // Handle hex format
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Fallback - return as is if neither format
    return color;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  return (
    <motion.div
      className={cn(
        "relative",
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
      {/* Main container with complex multi-layer gradient border */}
      <div className="relative">
        {/* Outer thin border (0.5px) - darker gradient */}
        <div className="absolute inset-0 rounded-[20px] p-[0.5px]"
             style={{
               background: `conic-gradient(from 0deg at 50% 50%,
                 ${currentOuterGradient.topLeft} 0deg,     /* Top left - darker version */
                 ${currentOuterGradient.topRight} 90deg,    /* Top right - darker version */
                 ${currentOuterGradient.bottomRight} 180deg,   /* Bottom right - darker version */
                 ${currentOuterGradient.bottomLeft} 270deg,   /* Bottom left - darker version */
                 ${currentOuterGradient.topLeft} 360deg    /* Back to top left */
               )`
             }}>
          
          {/* Main thick border (2px) - primary gradient */}
          <div className="h-full w-full rounded-[19.5px] p-[2px]"
               style={{
                 background: `conic-gradient(from 0deg at 50% 50%,
                   ${currentMainGradient.topLeft} 0deg,     /* Top left */
                   ${currentMainGradient.topRight} 90deg,    /* Top right */
                   ${currentMainGradient.bottomRight} 180deg,   /* Bottom right - deeper side */
                   ${currentMainGradient.bottomLeft} 270deg,   /* Bottom left */
                   ${currentMainGradient.topLeft} 360deg    /* Back to top left */
                 )`
               }}>
            
            {/* Inner container with background */}
            <div className="h-full w-full rounded-[17.5px] bg-background relative">
              
              {/* Inner thin border (0.5px) - configurable opacity darker gradient */}
              <div className="absolute inset-0 rounded-[17.5px] p-[0.5px]"
                   style={{
                     background: `conic-gradient(from 0deg at 50% 50%,
                       ${hexToRgba(currentOuterGradient.topLeft, innerGradientOpacity)} 0deg,
                       ${hexToRgba(currentOuterGradient.topRight, innerGradientOpacity)} 90deg,
                       ${hexToRgba(currentOuterGradient.bottomRight, innerGradientOpacity)} 180deg,
                       ${hexToRgba(currentOuterGradient.bottomLeft, innerGradientOpacity)} 270deg,
                       ${hexToRgba(currentOuterGradient.topLeft, innerGradientOpacity)} 360deg
                     )`
                   }}>
                <div className="h-full w-full rounded-[17px] bg-background"></div>
              </div>

              {/* Yellow/orange highlight on top edge */}
              <div
                className="absolute top-0 left-4 right-4 h-[0.5px] bg-gradient-to-r from-transparent via-[var(--top-highlight)]/30 to-transparent"
                style={{ '--top-highlight': currentMainGradient.topLeft } as React.CSSProperties}
              />

              {/* Darker bottom edge */}
              <div
                className="absolute bottom-0 left-4 right-4 h-[0.5px] bg-gradient-to-r from-transparent via-[var(--bottom-highlight)]/20 to-transparent"
                style={{ '--bottom-highlight': currentMainGradient.bottomRight } as React.CSSProperties}
              />
            </div>
          </div>
        </div>

        {/* Content container - Two row layout */}
        <div className="relative p-4">

          {/* Top row: Text input + Send button */}
          <div className="flex items-start gap-3 mb-3">
            {/* Text input area */}
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                rows={1}
                className={cn(
                  "w-full resize-none border-0 bg-transparent",
                  "text-foreground placeholder:text-muted-foreground",
                  "text-base leading-6 py-2 px-0",
                  "focus:outline-none focus:ring-0 outline-none",
                  "overflow-hidden",
                  "transition-colors duration-200",
                  disabled && "opacity-50 cursor-not-allowed"
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

            {/* Send button - Top right corner */}
            <motion.button
              type="submit"
              onClick={handleSubmit}
              disabled={disabled || !message.trim()}
              className={cn(
                "flex items-center justify-center",
                "w-8 h-8 mt-1", // Align with text top
                "text-muted-foreground hover:text-foreground",
                "transition-colors cursor-pointer",
                (disabled || !message.trim()) && "opacity-50 cursor-not-allowed"
              )}
              whileHover={shouldAnimate && message.trim() ? { scale: 1.1 } : {}}
              whileTap={shouldAnimate && message.trim() ? { scale: 0.9 } : {}}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Bottom row: File pills + Attach File + Select buttons */}
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
              <span>Attach File</span>
            </motion.button>

            {/* Dropdown selector */}
            <div className="relative" ref={dropdownRef}>
              <motion.button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
                <span className="text-muted-foreground font-medium">
                  {selectedOption ? selectedOption.label : "Select"}
                </span>
                <ChevronDown className={cn(
                  "w-3 h-3 transition-transform",
                  isDropdownOpen && "rotate-180"
                )} />
              </motion.button>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  className="absolute top-full mt-2 left-0 bg-popover border border-border rounded-lg shadow-lg min-w-[120px] z-10"
                >
                  <div className="p-1">
                    {dropdownOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSelectedOption(option);
                          onOptionSelect?.(option);
                          setIsDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent transition-colors flex items-center gap-2 mb-1",
                          selectedOption?.id === option.id && "bg-accent"
                        )}
                      >
                        <span className="flex-1">{option.label}</span>
                        {selectedOption?.id === option.id && (
                          <Check className="w-3 h-3 text-foreground" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Vertical line separator at the very end */}
            {attachedFiles.length > 0 && (
            <div
              className="h-6 w-px"
              style={{ backgroundColor: currentButtonBorderColor }}
            />
            )}
             {/* File pills - show next to buttons when files attached */}
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

        {/* Enhanced shadow system for both light and dark modes */}
        {enableShadows && (
          <>
            {/* Bottom shadow - stronger and more visible */}
            <div
              className="absolute -bottom-3 left-3 right-3 h-6 rounded-full blur-md"
              style={{
                opacity: shadowOpacity,
                background: `linear-gradient(to bottom, ${hexToRgba(currentShadowColor, 0.1)} 0%, transparent 100%)`
              }}
            />

            {/* Side shadows - more pronounced */}
            <div
              className="absolute -left-2 top-3 bottom-3 w-4 rounded-full blur-sm"
              style={{
                opacity: shadowOpacity,
                background: `linear-gradient(to right, ${hexToRgba(currentShadowColor, 0.06)} 0%, transparent 100%)`
              }}
            />
            <div
              className="absolute -right-2 top-3 bottom-3 w-4 rounded-full blur-sm"
              style={{
                opacity: shadowOpacity,
                background: `linear-gradient(to left, ${hexToRgba(currentShadowColor, 0.06)} 0%, transparent 100%)`
              }}
            />

            {/* Additional drop shadow for depth */}
            <div
              className="absolute inset-0 rounded-[20px] shadow-lg pointer-events-none"
              style={{
                opacity: shadowOpacity,
                boxShadow: `0 10px 25px ${hexToRgba(currentShadowColor, isDark ? 0.15 : 0.05)}`
              }}
            />
          </>
        )}
      </div>
    </motion.div>
  );
}
