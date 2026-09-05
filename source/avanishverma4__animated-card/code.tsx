import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider, useTheme } from 'next-themes';
import { Github, Palette, ExternalLink, Sun, Moon } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Internal Utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Primitive UI Components (Consolidated for single-file portability) ---

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className,
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted font-bold",
      className,
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className,
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// --- Interfaces ---

export interface SocialLink {
  id: string;
  url: string;
  icon: React.ReactNode;
  label: string;
}

export interface ProfileCardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  location: string;
  bio: string;
  avatarSrc: string;
  avatarFallback: string;
  variant?: 'default' | 'on-accent';
  socials?: SocialLink[];
  showAvatar?: boolean;
  titleStyle?: React.CSSProperties;
  cardStyle?: React.CSSProperties;
  descriptionClassName?: string;
  bioClassName?: string;
  footerClassName?: string;
}

export interface AnimatedProfileCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  baseCard: React.ReactNode;
  overlayCard: React.ReactNode;
  accentColor?: string;
  onAccentForegroundColor?: string;
  onAccentMutedForegroundColor?: string;
}

interface ThemePreset {
  name: string;
  accentColor: string;
  onAccentForeground: string;
  onAccentMuted: string;
  dotColor: string;
}

// --- Animated Profile Components ---

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
          'w-full h-full p-8 flex flex-col rounded-3xl border-0 shadow-none overflow-hidden',
          isOnAccent
            ? 'text-[var(--on-accent-foreground)]'
            : 'bg-card text-card-foreground',
          className
        )}
        style={cardStyle}
        {...props}
      >
        <CardHeader className='p-0'>
          <div className={cn('flex-shrink-0 transition-opacity duration-300', !showAvatar && 'opacity-0')}>
            <Avatar
              className={cn(
                'h-16 w-16 border-[3px] transition-all duration-300 shadow-sm',
                isOnAccent 
                  ? 'border-white/30' 
                  : 'border-[var(--accent-color)]'
              )}
              style={
                {
                  borderColor: isOnAccent ? 'rgba(255,255,255,0.3)' : 'var(--accent-color)',
                } as React.CSSProperties
              }
            >
              <AvatarImage src={avatarSrc} />
              <AvatarFallback className={isOnAccent ? "bg-white/10 text-white" : ""}>
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardDescription
            className={cn(
              'pt-6 text-left font-semibold tracking-wide uppercase text-xs',
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
            className={cn('text-3xl text-left font-black tracking-tighter mt-1', className)}
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
              'text-[15px] leading-relaxed text-left opacity-90 font-medium',
              !isOnAccent && 'text-foreground/70',
              bioClassName
            )}
            style={isOnAccent ? { opacity: 0.9 } : {}}
          >
            {bio}
          </p>
        </CardContent>

        {socials.length > 0 && (
          <CardFooter className={cn('p-0 mt-auto pt-6', footerClassName)}>
            <div
              className={cn(
                'flex items-center gap-5',
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
                    'transition-all hover:scale-125 active:scale-90',
                    isOnAccent ? 'hover:text-white' : 'hover:text-foreground'
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

    // Initial state: circle is collapsed over the avatar location (64px, 64px)
    const initialClipPath = 'circle(0% at 64px 64px)';
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
        duration: 0.8,
        ease: 'power4.inOut',
      });
    };

    const handleMouseLeave = () => {
      gsap.killTweensOf(overlayRef.current);
      gsap.to(overlayRef.current, {
        clipPath: initialClipPath,
        duration: 0.8,
        ease: 'power4.inOut',
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
            borderColor: accentColor,
          } as React.CSSProperties
        }
        className={cn(
          'relative h-fit w-[350px] overflow-hidden rounded-[2.5rem] border-2 shadow-2xl transition-all duration-500 hover:scale-[1.02]',
          className
        )}
        {...props}
      >
        <div className='h-full w-full bg-card'>{baseCard}</div>
        <div
          ref={overlayRef}
          className={cn('absolute inset-0 h-full w-full pointer-events-none', overlayThemeClass)}
        >
          {overlayCard}
        </div>
      </div>
    );
  }
);
AnimatedProfileCard.displayName = 'AnimatedProfileCard';

// --- Theme and Data Config ---

const THEME_PRESETS: ThemePreset[] = [
  {
    name: 'Emerald',
    accentColor: '#10b981',
    onAccentForeground: '#ecfdf5',
    onAccentMuted: '#a7f3d0',
    dotColor: 'bg-emerald-500',
  },
  {
    name: 'Blue',
    accentColor: '#3b82f6',
    onAccentForeground: '#eff6ff',
    onAccentMuted: '#bfdbfe',
    dotColor: 'bg-blue-500',
  },
  {
    name: 'Rose',
    accentColor: '#f43f5e',
    onAccentForeground: '#fff1f2',
    onAccentMuted: '#fecdd3',
    dotColor: 'bg-rose-500',
  },
  {
    name: 'Amber',
    accentColor: '#f59e0b',
    onAccentForeground: '#fffbeb',
    onAccentMuted: '#fde68a',
    dotColor: 'bg-amber-500',
  },
  {
    name: 'Violet',
    accentColor: '#8b5cf6',
    onAccentForeground: '#f5f3ff',
    onAccentMuted: '#ddd6fe',
    dotColor: 'bg-violet-500',
  },
  {
    name: 'Slate',
    accentColor: '#475569',
    onAccentForeground: '#f8fafc',
    onAccentMuted: '#cbd5e1',
    dotColor: 'bg-slate-600',
  },
];

const cardData = {
  avatarSrc: 'https://github.com/avanishverma4.png',
  avatarFallback: 'AV',
  name: 'Awanish Verma',
  location: 'Patna, India',
  bio: 'Passionate UI/UX designer with a deep engineering background, dedicated to crafting seamless digital experiences by bridging the gap between high-fidelity design and clean, performant code.',
  socials: [
    { id: 'github', url: 'https://github.com/avanishverma4/', label: 'GitHub', icon: <Github className="h-5 w-5" /> },
    { id: 'website', label: 'Website', url: 'https://awanishverma.com/', icon: <ExternalLink className="h-5 w-5" /> },
  ] as SocialLink[],
};

// --- Theme Toggle Component ---

const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="fixed top-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-xl"
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-5 w-5 text-amber-400 transition-transform duration-500 hover:rotate-45" />
      ) : (
        <Moon className="h-5 w-5 text-indigo-600 transition-transform duration-500 hover:-rotate-12" />
      )}
    </button>
  );
};

// --- Main App Showcase ---

const App: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [activeTheme, setActiveTheme] = useState<ThemePreset>(THEME_PRESETS[0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="w-full relative min-h-screen bg-background text-foreground transition-colors duration-300 overflow-hidden">
        <ThemeToggle />
        
        {/* Orthogonal Grid Background Decoration */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.2] dark:opacity-[0.1]" 
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse at center, black, transparent 90%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 90%)',
          }}
        />

        <main className="relative container mx-auto py-24 px-4 z-10 flex flex-col items-center">
          <div className="mb-16 text-center max-w-2xl">
            <h2 className="text-5xl font-black mb-6 tracking-tight sm:text-6xl">
              Showcase Your <span style={{ color: activeTheme.accentColor }}>Identity</span>
            </h2>
            <p className="text-muted-foreground text-lg font-medium mb-10">
              Interactive GSAP-powered profile card with a smooth circular reveal. 
              Hover to transition between themes or select an accent below.
            </p>

            {/* Theme Selection Controls */}
            <div className="flex flex-col items-center gap-5">
              <div className="flex items-center gap-2 text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">
                <Palette className="h-4 w-4" />
                Theme Engine
              </div>
              <div className="flex flex-wrap justify-center gap-4 p-3 bg-card/40 backdrop-blur-md rounded-2xl border border-border shadow-2xl">
                {THEME_PRESETS.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => setActiveTheme(theme)}
                    className={cn(
                      "group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-500 hover:rotate-12 active:scale-90",
                      activeTheme.name === theme.name ? "bg-accent/50 shadow-inner" : "hover:bg-accent/20"
                    )}
                    title={theme.name}
                  >
                    <span 
                      className={cn(
                        "h-7 w-7 rounded-lg shadow-sm transition-all duration-300 ring-offset-background", 
                        theme.dotColor, 
                        activeTheme.name === theme.name ? "scale-110 ring-2 ring-ring ring-offset-2" : "scale-100"
                      )} 
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center items-center py-10">
             <AnimatedProfileCard
                key={activeTheme.accentColor}
                accentColor={activeTheme.accentColor}
                onAccentForegroundColor={activeTheme.onAccentForeground}
                onAccentMutedForegroundColor={activeTheme.onAccentMuted}
                baseCard={
                  <ProfileCardContent 
                    {...cardData} 
                    variant="default" 
                    showAvatar={true}
                  />
                }
                overlayCard={
                  <ProfileCardContent
                    {...cardData}
                    variant="on-accent"
                    showAvatar={true}
                    cardStyle={{ backgroundColor: activeTheme.accentColor }}
                  />
                }
              />
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default App;