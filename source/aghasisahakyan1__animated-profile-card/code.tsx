"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { forwardRef, useRef, useCallback } from "react";
import { useTheme } from "next-themes";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

export type SocialItem = {
  id: string;
  url: string;
  icon: React.ReactNode;
  label: string;
};

export interface IdentityCardProps extends React.HTMLAttributes<HTMLDivElement> {
  fullName: string;
  place: string;
  about: string;
  avatarUrl: string;
  avatarText: string;
  scheme?: "plain" | "accented";
  socials?: SocialItem[];
  displayAvatar?: boolean;
  titleCss?: React.CSSProperties;
  cardCss?: React.CSSProperties;
  descClass?: string;
  bioClass?: string;
  footerClass?: string;
}

export const IdentityCardBody = forwardRef<HTMLDivElement, IdentityCardProps>(
  (
    {
      fullName,
      place,
      about,
      avatarUrl,
      avatarText,
      scheme = "plain",
      socials = [],
      displayAvatar = true,
      titleCss,
      cardCss,
      descClass,
      bioClass,
      footerClass,
      className,
      ...rest
    },
    ref
  ) => {
    const isAccent = scheme === "accented";

    return (
      <Card
        ref={ref}
        style={cardCss}
        className={cn(
          "flex flex-col rounded-3xl border-0 p-8",
          isAccent
            ? "text-[var(--on-accent-foreground)]"
            : "bg-card text-card-foreground",
          className
        )}
        {...rest}
      >
        <CardHeader className="p-0">
          <div className={cn(!displayAvatar && "invisible")}>
            <Avatar
              className="h-16 w-16 ring-2 ring-offset-4 ring-offset-card"
              style={
                {
                  "--tw-ring-color": "var(--accent-color)",
                } as React.CSSProperties
              }
            >
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>{avatarText}</AvatarFallback>
            </Avatar>
          </div>
          <CardDescription
            className={cn(
              "pt-6 text-left",
              !isAccent && "text-muted-foreground",
              descClass
            )}
            style={isAccent ? { color: "var(--on-accent-muted-foreground)" } : {}}
          >
            {place}
          </CardDescription>
          <CardTitle
            className="text-3xl text-left"
            style={{
              ...(isAccent ? { color: "var(--on-accent-foreground)" } : {}),
              ...titleCss,
            }}
          >
            {fullName}
          </CardTitle>
        </CardHeader>

        <CardContent className="mt-6 flex-grow p-0">
          <p
            className={cn(
              "text-base leading-relaxed text-left",
              !isAccent && "text-foreground/80",
              bioClass
            )}
            style={isAccent ? { opacity: 0.9 } : {}}
          >
            {about}
          </p>
        </CardContent>

        {socials.length > 0 && (
          <CardFooter className={cn("mt-6 p-0", footerClass)}>
            <div
              className={cn(
                "flex items-center gap-4",
                !isAccent && "text-muted-foreground"
              )}
              style={
                isAccent
                  ? { color: "var(--on-accent-muted-foreground)" }
                  : undefined
              }
            >
              {socials.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "transition-opacity",
                    isAccent ? "hover:opacity-75" : "hover:text-foreground"
                  )}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </CardFooter>
        )}
      </Card>
    );
  }
);
IdentityCardBody.displayName = "IdentityCardBody";

// ------------------ Animated Container ------------------

export interface RevealCardProps extends React.HTMLAttributes<HTMLDivElement> {
  base: React.ReactNode;
  overlay: React.ReactNode;
  accent?: string;
  textOnAccent?: string;
  mutedOnAccent?: string;
}

export const RevealCardContainer = forwardRef<HTMLDivElement, RevealCardProps>(
  (
    {
      base,
      overlay,
      accent = "var(--primary)",
      textOnAccent = "#fff",
      mutedOnAccent = "rgba(255,255,255,0.8)",
      className,
      ...rest
    },
    ref
  ) => {
    const holderRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const { resolvedTheme } = useTheme();
    const overlayMode = resolvedTheme === "dark" ? "light" : "dark";

    const assignRef = useCallback(
      (el: HTMLDivElement | null) => {
        holderRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
      },
      [ref]
    );

    const startClip = "circle(50px at 64px 64px)";
    const expandClip = "circle(160% at 64px 64px)";

    useGSAP(() => {
      gsap.set(overlayRef.current, { clipPath: startClip });
    }, { scope: holderRef });

    const reveal = () => {
      gsap.to(overlayRef.current, {
        clipPath: expandClip,
        duration: 0.8,
        ease: "expo.inOut",
      });
    };
    const conceal = () => {
      gsap.to(overlayRef.current, {
        clipPath: startClip,
        duration: 1,
        ease: "expo.out(1, 1)",
      });
    };

    return (
      <div
        ref={assignRef}
        onMouseEnter={reveal}
        onMouseLeave={conceal}
        style={
          {
            "--accent-color": accent,
            "--on-accent-foreground": textOnAccent,
            "--on-accent-muted-foreground": mutedOnAccent,
            borderColor: "var(--accent-color)",
          } as React.CSSProperties
        }
        className={cn(
          "relative w-[350px] overflow-hidden rounded-3xl border-2",
          className
        )}
        {...rest}
      >
        <div>{base}</div>
        <div
          ref={overlayRef}
          className={cn("absolute inset-0 h-full w-full", overlayMode)}
        >
          {overlay}
        </div>
      </div>
    );
  }
);
RevealCardContainer.displayName = "RevealCardContainer";
