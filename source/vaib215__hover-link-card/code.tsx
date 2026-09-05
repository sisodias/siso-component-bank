import React, { MouseEvent, useRef } from "react";

const IconLink = ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
  <img src={src} alt={alt} className={className} />
);

const LINKS = [
  { src: 'https://svgl.app/library/google.svg', alt: 'Google', gridCols: 2 },
  { src: 'https://svgl.app/library/shopify.svg', alt: 'Shopify', gridCols: 2 },
  { src: 'https://svgl.app/library/messenger.svg', alt: 'Messenger', gridCols: 4 },
  { src: 'https://svgl.app/library/whatsapp.svg', alt: 'Whatsapp', gridCols: 4 },
  { src: 'https://svgl.app/library/adobe.svg', alt: 'Adobe', gridCols: 4 },
  { src: 'https://svgl.app/library/facebook.svg', alt: 'Facebook', gridCols: 4 },
  { src: 'https://svgl.app/library/tiktok.svg', alt: 'TikTok', gridCols: 3 },
  { src: 'https://svgl.app/library/spotify.svg', alt: 'Spotify', gridCols: 3 },
  { src: 'https://svgl.app/library/linkedin.svg', alt: 'LinkedIn', gridCols: 3 },
];

const NO_CLIP = "polygon(0 0, 100% 0, 100% 100%, 0% 100%)";
const BOTTOM_RIGHT_CLIP = "polygon(0 0, 100% 0, 0 0, 0% 100%)";
const TOP_RIGHT_CLIP = "polygon(0 0, 0 100%, 100% 100%, 0% 100%)";
const BOTTOM_LEFT_CLIP = "polygon(100% 100%, 100% 0, 100% 100%, 0 100%)";
const TOP_LEFT_CLIP = "polygon(0 0, 100% 0, 100% 100%, 100% 0)";

const ENTRANCE_KEYFRAMES = {
  left: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  bottom: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  top: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  right: [TOP_LEFT_CLIP, NO_CLIP],
};

const EXIT_KEYFRAMES = {
  left: [NO_CLIP, TOP_RIGHT_CLIP],
  bottom: [NO_CLIP, TOP_RIGHT_CLIP],
  top: [NO_CLIP, TOP_RIGHT_CLIP],
  right: [NO_CLIP, BOTTOM_LEFT_CLIP],
};

const LinkBox = ({ src, alt, href }: { src: string; alt: string; href: string }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  const getNearestSide = (e: MouseEvent) => {
    const box = (e.target as HTMLElement).getBoundingClientRect();
    const proximities = [
      { proximity: Math.abs(box.left - e.clientX), side: "left" as const },
      { proximity: Math.abs(box.right - e.clientX), side: "right" as const },
      { proximity: Math.abs(box.top - e.clientY), side: "top" as const },
      { proximity: Math.abs(box.bottom - e.clientY), side: "bottom" as const },
    ].sort((a, b) => a.proximity - b.proximity);
    return proximities[0].side;
  };

  const animate = (element: HTMLElement, side: keyof typeof ENTRANCE_KEYFRAMES, isEntering: boolean) => {
    const keyframes = isEntering ? ENTRANCE_KEYFRAMES[side] : EXIT_KEYFRAMES[side];
    element.animate(
      [{ clipPath: keyframes[0] }, { clipPath: keyframes[1] }],
      { duration: 500, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'forwards' }
    );
  };

  const handleMouseEnter = (e: MouseEvent) => {
    if (overlayRef.current) animate(overlayRef.current, getNearestSide(e), true);
  };

  const handleMouseLeave = (e: MouseEvent) => {
    if (overlayRef.current) animate(overlayRef.current, getNearestSide(e), false);
  };

  return (
    <a
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative grid h-28 w-full place-content-center sm:h-36 md:h-48 bg-background text-foreground hover:bg-muted/50 transition-colors group"
    >
      <IconLink src={src} alt={alt} className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16" />
      <div
        ref={overlayRef}
        style={{ clipPath: BOTTOM_RIGHT_CLIP }}
        className="absolute inset-0 grid place-content-center bg-primary text-primary-foreground"
      >
        <IconLink src={src} alt={alt} className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 brightness-0 invert" />
      </div>
    </a>
  );
};

const ClipPathLinks = () => {
  const groupedLinks = [LINKS.slice(0, 2), LINKS.slice(2, 6), LINKS.slice(6, 9)];

  return (
    <div className="divide-y divide-border border border-border rounded-lg overflow-hidden shadow-lg">
      {groupedLinks.map((group, index) => (
        <div key={index} className={`grid grid-cols-${group[0].gridCols} divide-x divide-border`}>
          {group.map(({ src, alt }, idx) => (
            <LinkBox key={idx} src={src} alt={alt} href="#" />
          ))}
        </div>
      ))}
    </div>
  );
};

export function Component() {
  return (
    <div className="bg-background text-foreground p-8 w-full min-h-screen">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-center mb-8">Interactive Brand Links</h1>
        <ClipPathLinks />
      </div>
    </div>
  );
}