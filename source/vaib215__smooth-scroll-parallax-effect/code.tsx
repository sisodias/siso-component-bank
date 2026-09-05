"use client";
import { ReactLenis } from "lenis/dist/lenis-react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import { FiArrowRight, FiMapPin } from "react-icons/fi";
import { useRef } from "react";
import { cn } from "@/lib/utils";

// Core reusable components

interface SmoothScrollContainerProps {
  children: React.ReactNode;
  className?: string;
  options?: {
    lerp?: number;
    infinite?: boolean;
    syncTouch?: boolean;
  };
}

export const SmoothScrollContainer = ({ 
  children, 
  className,
  options = { lerp: 0.05 }
}: SmoothScrollContainerProps) => {
  return (
    <div className={cn("bg-background", className)}>
      <ReactLenis root options={options}>
        {children}
      </ReactLenis>
    </div>
  );
};

interface NavigationProps {
  logo?: React.ReactNode;
  onLogoClick?: () => void;
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
}

export const Navigation = ({
  logo,
  onLogoClick,
  ctaText = "SCROLL DOWN",
  onCtaClick,
  className
}: NavigationProps) => {
  return (
    <nav className={cn(
      "fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-3 text-foreground",
      className
    )}>
      <div 
        onClick={onLogoClick}
        className="cursor-pointer mix-blend-difference"
      >
        {logo}
      </div>
      <button
        onClick={onCtaClick}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {ctaText} <FiArrowRight />
      </button>
    </nav>
  );
};

interface ParallaxHeroProps {
  backgroundImage: string;
  sectionHeight?: number;
  children?: React.ReactNode;
  className?: string;
}

export const ParallaxHero = ({ 
  backgroundImage, 
  sectionHeight = 1500, 
  children,
  className 
}: ParallaxHeroProps) => {
  return (
    <div
      style={{ height: `calc(${sectionHeight}px + 100vh)` }}
      className={cn("relative w-full", className)}
    >
      <CenterImage 
        backgroundImage={backgroundImage} 
        sectionHeight={sectionHeight} 
      />
      {children}
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-background/0 to-background" />
    </div>
  );
};

interface CenterImageProps {
  backgroundImage: string;
  sectionHeight: number;
}

const CenterImage = ({ backgroundImage, sectionHeight }: CenterImageProps) => {
  const { scrollY } = useScroll();

  const clip1 = useTransform(scrollY, [0, 1500], [25, 0]);
  const clip2 = useTransform(scrollY, [0, 1500], [75, 100]);

  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  const backgroundSize = useTransform(
    scrollY,
    [0, sectionHeight + 500],
    ["170%", "100%"]
  );
  const opacity = useTransform(
    scrollY,
    [sectionHeight, sectionHeight + 500],
    [1, 0]
  );

  return (
    <motion.div
      className="sticky top-0 h-screen w-full"
      style={{
        clipPath,
        backgroundSize,
        opacity,
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
};

interface ParallaxImageProps {
  src: string;
  alt: string;
  start: number;
  end: number;
  className?: string;
}

export const ParallaxImage = ({
  className,
  alt,
  src,
  start,
  end,
}: ParallaxImageProps) => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  });

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85]);

  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`;

  return (
    <motion.img
      src={src}
      alt={alt}
      className={cn("object-cover", className)}
      ref={ref}
      style={{ transform, opacity }}
    />
  );
};

interface ScheduleSectionProps {
  title: string;
  items: Array<{
    title: string;
    date: string;
    location: string;
  }>;
  className?: string;
  id?: string;
}

export const ScheduleSection = ({ 
  title, 
  items, 
  className, 
  id = "schedule" 
}: ScheduleSectionProps) => {
  return (
    <section
      id={id}
      className={cn("mx-auto max-w-5xl px-4 py-48 text-foreground", className)}
    >
      <motion.h1
        initial={{ y: 48, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.75 }}
        className="mb-20 text-4xl font-black uppercase"
      >
        {title}
      </motion.h1>
      {items.map((item, index) => (
        <ScheduleItem key={index} {...item} />
      ))}
    </section>
  );
};

interface ScheduleItemProps {
  title: string;
  date: string;
  location: string;
}

const ScheduleItem = ({ title, date, location }: ScheduleItemProps) => {
  return (
    <motion.div
      initial={{ y: 48, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.75 }}
      className="mb-9 flex items-center justify-between border-b border-border px-3 pb-9"
    >
      <div>
        <p className="mb-1.5 text-xl text-foreground">{title}</p>
        <p className="text-sm uppercase text-muted-foreground">{date}</p>
      </div>
      <div className="flex items-center gap-1.5 text-end text-sm uppercase text-muted-foreground">
        <p>{location}</p>
        <FiMapPin />
      </div>
    </motion.div>
  );
};
