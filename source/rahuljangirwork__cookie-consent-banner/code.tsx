"use client";

import * as React from "react";
import { Cookie } from "lucide-react";
import { ParticleButton } from "@/components/ui/particle-button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CookieConsentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "small" | "mini";
  demo?: boolean;
  onAcceptCallback?: () => void;
  onDeclineCallback?: () => void;
  description?: string;
  learnMoreHref?: string;
}

const CookieConsent = React.forwardRef<HTMLDivElement, CookieConsentProps>(
  (
    {
      variant = "default",
      demo = false,
      onAcceptCallback = () => {},
      onDeclineCallback = () => {},
      className,
      description = "We use cookies to ensure you get the best experience on our website. For more information on how we use cookies, please see our cookie policy.",
      learnMoreHref = "#",
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [hide, setHide] = React.useState(false);

    const handleAccept = React.useCallback(() => {
      setIsOpen(false);
      document.cookie = "cookieConsent=true; expires=Fri, 31 Dec 9999 23:59:59 GMT";
      setTimeout(() => setHide(true), 700);
      onAcceptCallback();
    }, [onAcceptCallback]);

    const handleDecline = React.useCallback(() => {
      setIsOpen(false);
      setTimeout(() => setHide(true), 700);
      onDeclineCallback();
    }, [onDeclineCallback]);

    React.useEffect(() => {
      try {
        setIsOpen(true);
        if (document.cookie.includes("cookieConsent=true") && !demo) {
          setIsOpen(false);
          setTimeout(() => setHide(true), 700);
        }
      } catch (error) {
        console.warn("Cookie consent error:", error);
      }
    }, [demo]);

    if (hide) return null;

    // Animate up/down and fade
    const containerClasses = cn(
      "fixed z-50 transition-all duration-700",
      !isOpen ? "translate-y-full opacity-0" : "translate-y-0 opacity-100",
      className
    );

    // Positioning varies slightly for ‘mini’
    const wrapperClasses = cn(
      containerClasses,
      variant === "mini"
        ? "left-0 right-0 sm:left-4 bottom-4 w-full sm:max-w-3xl"
        : "bottom-0 left-0 right-0 sm:left-4 sm:bottom-4 w-full sm:max-w-md"
    );

    // ─── DEFAULT VARIANT ──────────────────────────────────────────────────────
    if (variant === "default") {
      return (
        <div ref={ref} className={wrapperClasses} {...props}>
          <Card className="m-3 shadow-lg" title="We use cookies" description={description}>
            <p className="text-xs text-muted-foreground">
              By clicking <span className="font-medium">"Accept"</span>, you agree to our use of cookies.
            </p>
            <a
              href={learnMoreHref}
              className="text-xs text-primary underline underline-offset-4 hover:no-underline"
            >
              Learn more
            </a>
            <div className="flex gap-2 pt-2">
              <ParticleButton onClick={handleDecline} variant="secondary" className="flex-1">
                Decline
              </ParticleButton>
              <ParticleButton onClick={handleAccept} className="flex-1">
                Accept
              </ParticleButton>
            </div>
          </Card>
        </div>
      );
    }

    // ─── SMALL VARIANT ────────────────────────────────────────────────────────
    if (variant === "small") {
      return (
        <div ref={ref} className={wrapperClasses} {...props}>
          <Card className="m-3 shadow-lg" title="We use cookies" description={description}>
            <div className="flex gap-2 py-2">
              <ParticleButton
                onClick={handleDecline}
                variant="secondary"
                size="sm"
                className="flex-1 rounded-full"
              >
                Decline
              </ParticleButton>
              <ParticleButton onClick={handleAccept} size="sm" className="flex-1 rounded-full">
                Accept
              </ParticleButton>
            </div>
          </Card>
        </div>
      );
    }

    // ─── MINI VARIANT ─────────────────────────────────────────────────────────
    if (variant === "mini") {
      return (
        <div ref={ref} className={wrapperClasses} {...props}>
          <Card className="mx-3 p-0 py-3 shadow-lg">
            <div className="flex items-center gap-2 justify-between p-3.5">
              <span className="text-xs sm:text-sm flex-1">{description}</span>
              <div className="flex items-center gap-2">
                <ParticleButton
                  onClick={handleDecline}
                  size="sm"
                  variant="secondary"
                  className="text-xs h-7"
                >
                  Decline
                </ParticleButton>
                <ParticleButton onClick={handleAccept} size="sm" className="text-xs h-7">
                  Accept
                </ParticleButton>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return null;
  }
);

CookieConsent.displayName = "CookieConsent";

export { CookieConsent };
export default CookieConsent;
