import React, { useRef } from "react";

export default function Example() {
  return (
    <div className="w-full bg-neutral-50 px-4 h-screen flex items-center justify-center relative overflow-hidden">
      {/* Orthogonal Grid Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
            backgroundImage: `
            linear-gradient(to right, #a3a3a3 1px, transparent 1px),
            linear-gradient(to bottom, #a3a3a3 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      <div className="mx-auto max-w-7xl w-full relative z-10">
        <ClipPathLinks />
      </div>
    </div>
  );
}

// SVG Logo Components
const GoogleLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const FacebookLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const LinkedInLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const AppleLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

const InstagramLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const ShopifyLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.337 2.487c-.232-.028-.676.02-.676.02s-1.474.148-3.165 1.023c-.455.232-.964.493-1.502.784-.077-.232-.173-.473-.29-.724-.347-.754-.86-1.15-1.485-1.15-.04 0-.087 0-.126.01-.02-.03-.04-.05-.06-.08-.406-.436-.925-.627-1.474-.59-1.15.078-2.29 1.15-3.195 2.922-.637 1.242-1.123 2.795-1.123 3.95 0 .164.01.318.02.473C.58 9.62 0 10.227 0 10.98c0 .473.676 5.158 7.447 6.366l4.453-1.163V3.047c.658-.067 1.134-.03 1.415.078.676.26.984 1.036 1.034 1.667.018.464-.174.85-.464 1.143-.058.058-.133.145-.174.213-.01.01-.01.03-.02.04.174.097.348.203.522.31.29.174.58.348.86.542.02-.02.04-.05.05-.078.406-.676.734-1.474.734-2.513-.01-1.61-.887-2.475-2.518-2.772zm-7.447 5.196c0-.058-.01-.116-.01-.174-.01-.29-.02-.58-.02-.87 0-.348.02-.676.02-.994-.02-.61-.03-1.192-.03-1.735 0-.29.01-.57.01-.86 0-.26.02-.512.05-.744 0-.01 0-.03.01-.04.01-.05.03-.1.04-.15.01-.028.02-.058.04-.088.01-.02.03-.05.04-.078.02-.04.05-.078.08-.116.01-.02.03-.04.05-.06.03-.03.05-.06.08-.088.02-.02.04-.04.07-.06.03-.02.06-.05.09-.07.03-.02.05-.03.08-.05.04-.02.08-.04.12-.05.03-.01.06-.02.1-.03.05-.01.09-.02.14-.03h.09c.174-.02.348-.02.522 0 .02 0 .04 0 .07.01.06.01.12.02.18.04.03.01.06.02.09.03.05.02.1.04.15.06.03.01.06.03.09.04.04.03.09.05.13.08.03.02.06.04.09.06.04.03.08.06.12.1.03.03.06.05.08.08.04.04.07.08.1.13l.05.06c.03.05.06.1.09.15.01.03.03.05.04.08.02.05.05.1.07.16.01.03.02.06.03.1.02.06.04.12.05.18.01.04.02.08.02.12.01.06.02.13.03.2 0 .04.01.08.01.13.01.08.01.17.02.26v.1c0 .07.01.15.01.22v1.71c0 .57 0 1.15.01 1.76 0 .32.01.64.01.96 0 .29.01.58.01.87v.17c-1.04-.36-1.96-.81-2.75-1.24v-2.59z"/>
  </svg>
);

const AdobeLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.884 1.376H0v21.248zm15.116 0h-8.884L24 22.624Z"/>
  </svg>
);

const YouTubeLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TikTokLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const SpotifyLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

const ClipPathLinks = () => {
  return (
    <div className="divide-y divide-neutral-900 border border-neutral-900">
      <div className="grid grid-cols-2 divide-x divide-neutral-900">
        <LinkBox Icon={GoogleLogo} href="#" />
        <LinkBox Icon={InstagramLogo} href="#" />
      </div>
      <div className="grid grid-cols-4 divide-x divide-neutral-900">
        <LinkBox Icon={AppleLogo} href="#" />
        <LinkBox Icon={YouTubeLogo} href="#" />
        <LinkBox Icon={AdobeLogo} href="#" />
        <LinkBox Icon={FacebookLogo} href="#" />
      </div>
      <div className="grid grid-cols-3 divide-x divide-neutral-900">
        <LinkBox Icon={TikTokLogo} href="#" />
        <LinkBox Icon={SpotifyLogo} href="#" />
        <LinkBox Icon={LinkedInLogo} href="#" />
      </div>
    </div>
  );
};

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

const LinkBox = ({ Icon, href }) => {
  const overlayRef = useRef(null);

  const getNearestSide = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    const proximityToLeft = {
      proximity: Math.abs(box.left - e.clientX),
      side: "left",
    };
    const proximityToRight = {
      proximity: Math.abs(box.right - e.clientX),
      side: "right",
    };
    const proximityToTop = {
      proximity: Math.abs(box.top - e.clientY),
      side: "top",
    };
    const proximityToBottom = {
      proximity: Math.abs(box.bottom - e.clientY),
      side: "bottom",
    };
    const sortedProximity = [
      proximityToLeft,
      proximityToRight,
      proximityToTop,
      proximityToBottom,
    ].sort((a, b) => a.proximity - b.proximity);
    return sortedProximity[0].side;
  };

  const handleMouseEnter = (e) => {
    const side = getNearestSide(e);
    const keyframes = ENTRANCE_KEYFRAMES[side];
    
    if (overlayRef.current) {
      overlayRef.current.animate(
        { clipPath: keyframes },
        { duration: 300, fill: "forwards", easing: "ease-out" }
      );
    }
  };

  const handleMouseLeave = (e) => {
    const side = getNearestSide(e);
    const keyframes = EXIT_KEYFRAMES[side];
    
    if (overlayRef.current) {
      overlayRef.current.animate(
        { clipPath: keyframes },
        { duration: 300, fill: "forwards", easing: "ease-out" }
      );
    }
  };

  return (
    <a
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative grid h-20 w-full place-content-center sm:h-28 md:h-36"
    >
      <Icon className="text-xl sm:text-3xl lg:text-4xl w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16" />
      <div
        ref={overlayRef}
        style={{
          clipPath: BOTTOM_RIGHT_CLIP,
        }}
        className="absolute inset-0 grid place-content-center bg-neutral-900 text-white"
      >
        <Icon className="text-xl sm:text-3xl md:text-4xl w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16" />
      </div>
    </a>
  );
}