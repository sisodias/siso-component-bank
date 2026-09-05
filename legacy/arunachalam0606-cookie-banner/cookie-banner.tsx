"use client";

import { useEffect, useState } from "react";
import { cn } from "../_utils/cn";

interface CookieBannerProps {
  message?: string;
  acceptText?: string;
  declineText?: string;
  className?: string;
  position?: "bottom" | "top";
}

const EXIT_MS = 300;

const CookieBanner = (props: CookieBannerProps) => {
  const {
    message = "We use cookies to improve your experience. By using our site, you accept cookies.",
    acceptText = "Accept",
    declineText = "Decline",
    className,
    position = "bottom",
  } = props;

  const [visible, setVisible] = useState(false);
  const [render, setRender] = useState(false);

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem("cookie-consent")
        : null;
    if (!stored) {
      setRender(true);
      requestAnimationFrame(() => setVisible(true));
    }
  }, []);

  const closeWithExit = () => {
    setVisible(false);
    setTimeout(() => setRender(false), EXIT_MS);
  };

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "true");
    closeWithExit();
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "false");
    closeWithExit();
  };

  if (!render) return null;

  const slideIn =
    position === "top" ? "slide-in-from-top-8" : "slide-in-from-bottom-8";
  const slideOut =
    position === "top" ? "slide-out-to-top-8" : "slide-out-to-bottom-8";

  return (
    <div
      role='dialog'
      aria-live='polite'
      aria-label='Cookie consent'
      className={cn(
        "fixed left-1/2 z-50 w-[95%] max-w-lg -translate-x-1/2",
        position === "top" ? "top-4" : "bottom-4"
      )}
    >
      <div
        className={cn(
          "border border-border rounded-lg bg-card text-card-foreground shadow-lg",
          "p-4 flex flex-col sm:flex-row items-center gap-3",
          visible
            ? cn("animate-in", "fade-in", slideIn)
            : cn("animate-out", "fade-out", slideOut),
          "duration-300 ease-out",
          className
        )}
      >
        <p className='text-sm flex-1'>{message}</p>
        
        <div className='flex gap-2 shrink-0'>
          <button
            type='button'
            onClick={handleDecline}
            className={cn(
              "cursor-pointer px-3 py-1.5 rounded-md border border-border",
              "bg-muted text-muted-foreground text-sm",
              "transition-colors duration-200 hover:bg-muted/70"
            )}
          >
            {declineText}
          </button>

          <button
            type='button'
            onClick={handleAccept}
            className={cn(
              "cursor-pointer px-3 py-1.5 rounded-md",
              "bg-primary text-primary-foreground text-sm",
              "transition-colors duration-200 hover:bg-primary/90"
            )}
          >
            {acceptText}
          </button>
        </div>
      </div>
    </div>
  );
};

export { CookieBanner };
