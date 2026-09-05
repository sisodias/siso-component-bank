'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTheme } from 'next-themes';
import * as React from 'react';
import { useRef } from 'react';

export interface SocialLink {
  id: string;
  url: string;
  icon: React.ReactNode;
  label: string;
}

export interface ProfileCardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The full name of the individual. */
  name: string;
  /** The location, such as city and state. */
  location: string;
  /** A short biography or description. */
  bio: string;
  /** The source URL for the avatar image. */
  avatarSrc: string;
  /** Fallback text to display in the avatar (usually initials). */
  avatarFallback: string;
  /**
   * The color variant of the card content. Use 'on-accent' for text
   * that needs to be readable on a background matching the accent color.
   * @default 'default'
   */
  variant?: 'default' | 'on-accent';
  /** An array of social media links to display in the footer. */
  socials?: SocialLink[];
  /**
   * Controls the visibility of the avatar. If `false`, the avatar will be
   * invisible but still occupy space to prevent layout shifts.
   * @default true
   */
  showAvatar?: boolean;
  /** Optional inline styles for the main title element. */
  titleStyle?: React.CSSProperties;
  /** Optional inline styles for the root Card element. */
  cardStyle?: React.CSSProperties;
  /** Custom Tailwind classes for the location description text. */
  descriptionClassName?: string;
  /** Custom Tailwind classes for the main biography paragraph. */
  bioClassName?: string;
  /** Custom Tailwind classes for the footer container. */
  footerClassName?: string;
}

/**
 * A presentational component that displays the content of a user profile card.
 * It is designed to be composed within other components, such as an animation container.
 */
export const ProfileCardContent = React.forwardRef<
  HTMLDivElement,
  ProfileCardContentProps
>(
  (
    {
      className,
      name,
      location,
      bio,
      avatarSrc,
      avatarFallback,
      variant = 'default',
      socials = [],
      showAvatar = true,
      titleStyle,
      cardStyle,
      descriptionClassName,
      bioClassName,
      footerClassName,
      ...props
    },
    ref
  ) => {
    const isOnAccent = variant === 'on-accent';

    return (
      <Card
        ref={ref}
        className={cn(
          'w-full h-full p-8 flex flex-col rounded-3xl border-0',
          isOnAccent
            ? 'text-[var(--on-accent-foreground)]'
            : 'bg-card text-card-foreground',
          className
        )}
        style={cardStyle}
        {...props}
      >
        <CardHeader className='p-0'>
          <div className={cn('flex-shrink-0', !showAvatar && 'invisible')}>
            <Avatar
              className='h-16 w-16 ring-2 ring-offset-4 ring-offset-card'
              style={
                {
                  '--tw-ring-color': 'var(--accent-color)',
                } as React.CSSProperties
              }
            >
              <AvatarImage src={avatarSrc} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          </div>
          <CardDescription
            className={cn(
              'pt-6 text-left',
              !isOnAccent && 'text-muted-foreground',
              descriptionClassName
            )}
            style={
              isOnAccent ? { color: 'var(--on-accent-muted-foreground)' } : {}
            }
          >
            {location}
          </CardDescription>
          <CardTitle
            className={cn('text-3xl text-left', className)}
            style={{
              ...(isOnAccent ? { color: 'var(--on-accent-foreground)' } : {}),
              ...titleStyle,
            }}
          >
            {name}
          </CardTitle>
        </CardHeader>

        <CardContent className='p-0 flex-grow mt-6'>
          <p
            className={cn(
              'text-base leading-relaxed text-left',
              !isOnAccent && 'text-foreground/80',
              bioClassName
            )}
            style={isOnAccent ? { opacity: 0.9 } : {}}
          >
            {bio}
          </p>
        </CardContent>

        {socials.length > 0 && (
          <CardFooter className={cn('p-0 mt-6', footerClassName)}>
            <div
              className={cn(
                'flex items-center gap-4',
                !isOnAccent && 'text-muted-foreground'
              )}
              style={
                isOnAccent ? { color: 'var(--on-accent-muted-foreground)' } : {}
              }
            >
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  aria-label={social.label}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={cn(
                    'transition-opacity',
                    isOnAccent ? 'hover:opacity-75' : 'hover:text-foreground'
                  )}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </CardFooter>
        )}
      </Card>
    );
  }
);
ProfileCardContent.displayName = 'ProfileCardContent';

export interface AnimatedProfileCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The React node to display as the base layer of the card. */
  baseCard: React.ReactNode;
  /** The React node to display as the overlay layer, revealed on hover. */
  overlayCard: React.ReactNode;
  /**
   * The accent color used for the border and avatar ring.
   * Accepts any valid CSS color value.
   */
  accentColor?: string;
  /**
   * The color for primary text when on the accent background.
   * @default '#ffffff'
   */
  onAccentForegroundColor?: string;
  /**
   * The color for secondary/muted text when on the accent background.
   * @default 'rgba(255, 255, 255, 0.8)'
   */
  onAccentMutedForegroundColor?: string;
}

/**
 * A container component that creates a circular reveal animation on hover.
 * It composes two child components, a `baseCard` and an `overlayCard`,
 * to create the effect.
 */
export const AnimatedProfileCard = React.forwardRef<
  HTMLDivElement,
  AnimatedProfileCardProps
>(
  (
    {
      className,
      accentColor = 'var(--primary)',
      onAccentForegroundColor = '#ffffff',
      onAccentMutedForegroundColor = 'rgba(255, 255, 255, 0.8)',
      baseCard,
      overlayCard,
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const { resolvedTheme } = useTheme();
    const overlayThemeClass = resolvedTheme === 'dark' ? 'light' : 'dark';

    const setContainerRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref]
    );

    const initialClipPath = 'circle(40px at 64px 64px)';
    const hoverClipPath = 'circle(150% at 64px 64px)';

    useGSAP(
      () => {
        gsap.set(overlayRef.current, { clipPath: initialClipPath });
      },
      { scope: containerRef }
    );
    const handleMouseEnter = () => {
      gsap.killTweensOf(overlayRef.current);
      gsap.to(overlayRef.current, {
        clipPath: hoverClipPath,
        duration: 0.7,
        ease: 'expo.inOut',
      });
    };
    const handleMouseLeave = () => {
      gsap.killTweensOf(overlayRef.current);
      gsap.to(overlayRef.current, {
        clipPath: initialClipPath,
        duration: 1.2,
        ease: 'expo.out(1, 1)',
      });
    };

    return (
      <div
        ref={setContainerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={
          {
            '--accent-color': accentColor,
            '--on-accent-foreground': onAccentForegroundColor,
            '--on-accent-muted-foreground': onAccentMutedForegroundColor,
            borderColor: 'var(--accent-color)',
          } as React.CSSProperties
        }
        className={cn(
          'relative h-fit w-[350px] overflow-hidden rounded-3xl border-2',
          className
        )}
        {...props}
      >
        <div className='h-full w-full'>{baseCard}</div>
        <div
          ref={overlayRef}
          className={cn('absolute inset-0 h-full w-full', overlayThemeClass)}
        >
          {overlayCard}
        </div>
      </div>
    );
  }
);
AnimatedProfileCard.displayName = 'AnimatedProfileCard';