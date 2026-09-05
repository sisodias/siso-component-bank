"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================================
// NEUMORPHIC AUDIO BUTTON
// A soft UI button with satisfying click sounds from a Nintendo Switch
// ============================================================================

// Default audio URLs - hosted sounds you can use freely
const DEFAULT_PRESS_SOUND = "https://billy-rose.com/button-press-in.m4a";
const DEFAULT_RELEASE_SOUND = "https://billy-rose.com/button-release.m4a";

// ============================================================================
// COLOR THEMES
// ============================================================================

const themes = {
  light: {
    bg: "#ffffff",
    text: "#262626",
    shadowDark: "#d1d1d1",
    shadowLight: "#ffffff",
  },
  dark: {
    bg: "#0a0a0a",
    text: "#ffffff",
    shadowDark: "#000000",
    shadowLight: "#1a1a1a",
  },
};

// ============================================================================
// TYPES
// ============================================================================

interface NeumorphicButtonProps {
  /** Button content */
  children?: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Button size variant */
  size?: "sm" | "md" | "lg";
  /** Disable the button */
  disabled?: boolean;
  /** URL for the press-in sound effect */
  pressSoundUrl?: string;
  /** URL for the release sound effect */
  releaseSoundUrl?: string;
  /** Disable sound effects */
  muted?: boolean;
  /** Use dark theme */
  dark?: boolean;
}

// ============================================================================
// NEUMORPHIC BUTTON COMPONENT
// ============================================================================

function NeumorphicButton({
  children = "Button",
  onClick,
  className = "",
  size = "md",
  disabled = false,
  pressSoundUrl = DEFAULT_PRESS_SOUND,
  releaseSoundUrl = DEFAULT_RELEASE_SOUND,
  muted = false,
  dark = false,
}: NeumorphicButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pressAudioRef = useRef<HTMLAudioElement | null>(null);
  const releaseAudioRef = useRef<HTMLAudioElement | null>(null);

  const theme = dark ? themes.dark : themes.light;

  useEffect(() => {
    // Preload audio files
    pressAudioRef.current = new Audio(pressSoundUrl);
    pressAudioRef.current.preload = "auto";
    releaseAudioRef.current = new Audio(releaseSoundUrl);
    releaseAudioRef.current.preload = "auto";
    setMounted(true);
  }, [pressSoundUrl, releaseSoundUrl]);

  const playPressSound = useCallback(() => {
    if (pressAudioRef.current && !muted) {
      pressAudioRef.current.currentTime = 0;
      pressAudioRef.current.play().catch(() => {});
    }
  }, [muted]);

  const playReleaseSound = useCallback(() => {
    if (releaseAudioRef.current && !muted) {
      releaseAudioRef.current.currentTime = 0;
      releaseAudioRef.current.play().catch(() => {});
    }
  }, [muted]);

  const handlePressStart = useCallback(() => {
    if (!disabled) {
      setIsPressed(true);
      playPressSound();
    }
  }, [disabled, playPressSound]);

  const handlePressEnd = useCallback(() => {
    if (isPressed) {
      setIsPressed(false);
      playReleaseSound();
    }
  }, [isPressed, playReleaseSound]);

  // Size configurations
  const sizeConfig = {
    sm: { fontSize: 14, paddingX: 24, paddingY: 12, borderRadius: 15 },
    md: { fontSize: 18, paddingX: 32, paddingY: 16, borderRadius: 20 },
    lg: { fontSize: 24, paddingX: 48, paddingY: 20, borderRadius: 25 },
  };

  const config = sizeConfig[size];

  const baseStyle: React.CSSProperties = {
    fontSize: config.fontSize,
    padding: `${config.paddingY}px ${config.paddingX}px`,
    borderRadius: config.borderRadius,
    backgroundColor: theme.bg,
    color: theme.text,
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 500,
    fontFamily: "system-ui, -apple-system, sans-serif",
    transition: "all 150ms ease-out",
    outline: "none",
    opacity: mounted ? (disabled ? 0.5 : 1) : 0,
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    boxShadow: isPressed
      ? `inset 2px 2px 5px ${theme.shadowDark}, inset -2px -2px 5px ${theme.shadowLight}`
      : `4px 4px 8px ${theme.shadowDark}, -4px -4px 8px ${theme.shadowLight}`,
  };

  return (
    <button
      onClick={onClick}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      disabled={disabled}
      className={className}
      style={baseStyle}
    >
      {children}
    </button>
  );
}

// ============================================================================
// MUTE/UNMUTE FAB COMPONENT
// ============================================================================

interface AudioFabProps {
  muted: boolean;
  onToggle: () => void;
  /** Use dark theme */
  dark?: boolean;
}

function AudioFab({ muted, onToggle, dark = false }: AudioFabProps) {
  const theme = dark ? themes.dark : themes.light;

  return (
    <button
      onClick={onToggle}
      aria-label={muted ? "Unmute sounds" : "Mute sounds"}
      style={{
        position: "absolute",
        top: 16,
        right: 16,
        width: 40,
        height: 40,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.bg,
        border: "none",
        cursor: "pointer",
        color: muted ? (dark ? "#666" : "#999") : (dark ? "#aaa" : "#666"),
        boxShadow: `3px 3px 6px ${theme.shadowDark}, -3px -3px 6px ${theme.shadowLight}`,
        transition: "all 150ms",
      }}
    >
      {muted ? (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      ) : (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      )}
    </button>
  );
}

// ============================================================================
// DEMO COMPONENT FOR 21ST.DEV
// Fully self-contained - no external imports
// ============================================================================

function Component() {
  const [isDark, setIsDark] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pressAudioRef = useRef<HTMLAudioElement | null>(null);
  const releaseAudioRef = useRef<HTMLAudioElement | null>(null);

  // Detect theme by checking actual rendered background
  useEffect(() => {
    const getLuminance = (color: string) => {
      const match = color.match(/\d+/g);
      if (match && match.length >= 3) {
        const [r, g, b] = match.map(Number);
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      }
      return null;
    };

    const checkTheme = () => {
      // Try multiple detection methods
      
      // 1. Check color-scheme CSS property
      const colorScheme = window.getComputedStyle(document.documentElement).colorScheme;
      if (colorScheme === "light") { setIsDark(false); return; }
      if (colorScheme === "dark") { setIsDark(true); return; }

      // 2. Check for explicit theme classes/attributes
      const html = document.documentElement;
      const body = document.body;
      
      if (html.classList.contains("light") || body.classList.contains("light") ||
          html.getAttribute("data-theme") === "light" || body.getAttribute("data-theme") === "light") {
        setIsDark(false); return;
      }
      if (html.classList.contains("dark") || body.classList.contains("dark") ||
          html.getAttribute("data-theme") === "dark" || body.getAttribute("data-theme") === "dark") {
        setIsDark(true); return;
      }

      // 3. Check actual background colors up the tree
      let element: HTMLElement | null = document.body;
      while (element) {
        const bg = window.getComputedStyle(element).backgroundColor;
        const lum = getLuminance(bg);
        // Only use if not transparent (rgba with alpha 0)
        if (lum !== null && !bg.includes("0)") && bg !== "rgba(0, 0, 0, 0)") {
          setIsDark(lum < 0.5);
          return;
        }
        element = element.parentElement;
      }

      // 4. Fallback: check system preference
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    };

    // Run after a short delay to let styles settle
    const timeout = setTimeout(checkTheme, 100);
    
    // Re-check periodically
    const interval = setInterval(checkTheme, 1000);

    // Watch for changes
    const observer = new MutationObserver(() => setTimeout(checkTheme, 50));
    observer.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ["class", "data-theme", "style"] });

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  // Preload audio
  useEffect(() => {
    pressAudioRef.current = new Audio("https://billy-rose.com/button-press-in.m4a");
    pressAudioRef.current.preload = "auto";
    releaseAudioRef.current = new Audio("https://billy-rose.com/button-release.m4a");
    releaseAudioRef.current.preload = "auto";
    setMounted(true);
  }, []);

  const playPress = () => {
    if (pressAudioRef.current) {
      pressAudioRef.current.currentTime = 0;
      pressAudioRef.current.play().catch(() => {});
    }
  };

  const playRelease = () => {
    if (releaseAudioRef.current) {
      releaseAudioRef.current.currentTime = 0;
      releaseAudioRef.current.play().catch(() => {});
    }
  };

  // Theme colors
  const theme = isDark
    ? { bg: "#0a0a0a", text: "#ffffff", shadowDark: "#000000", shadowLight: "#1a1a1a" }
    : { bg: "#ffffff", text: "#262626", shadowDark: "#d1d1d1", shadowLight: "#ffffff" };

  return (
    <button
      onMouseDown={() => { setIsPressed(true); playPress(); }}
      onMouseUp={() => { setIsPressed(false); playRelease(); }}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => { setIsPressed(true); playPress(); }}
      onTouchEnd={() => { setIsPressed(false); playRelease(); }}
      style={{
        fontSize: 24,
        padding: "20px 48px",
        borderRadius: 25,
        backgroundColor: theme.bg,
        color: theme.text,
        border: "none",
        cursor: "pointer",
        fontWeight: 500,
        fontFamily: "system-ui, -apple-system, sans-serif",
        transition: "all 150ms ease-out",
        outline: "none",
        opacity: mounted ? 1 : 0,
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
        boxShadow: isPressed
          ? `inset 2px 2px 5px ${theme.shadowDark}, inset -2px -2px 5px ${theme.shadowLight}`
          : `4px 4px 8px ${theme.shadowDark}, -4px -4px 8px ${theme.shadowLight}`,
      }}
    >
      Press Me
    </button>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export { NeumorphicButton, AudioFab, Component };
export type { NeumorphicButtonProps, AudioFabProps };

// Default export for convenience
export default NeumorphicButton;
