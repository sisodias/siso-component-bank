import React, { useState } from "react";

export const ShinyButton = ({ children, className = "", color = "blue", onClick }) => {
  return (
    <button 
      className={`shiny-cta ${className}`} 
      style={{ "--shiny-cta-highlight": color }}
      onClick={onClick}
    >
      <span>{children}</span>
    </button>
  );
};

export const Component = () => {
  const [clicked, setClicked] = useState("");

  const handleClick = (text) => {
    setClicked(text);
    setTimeout(() => {
      setClicked("");
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8 h-screen bg-[#02040c]">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold text-white mb-2">Shiny Buttons</h1>
        {clicked && (
          <p className="text-white text-xl mb-6">You clicked: {clicked}</p>
        )}
      </div>
      
      <div className="flex flex-wrap justify-center gap-6">
        <ShinyButton 
          color="blue" 
          onClick={() => handleClick("Get unlimited access")}
        >
          Get unlimited access
        </ShinyButton>
        
        <ShinyButton 
          color="#ff3e00" 
          onClick={() => handleClick("Subscribe now")}
        >
          Subscribe now
        </ShinyButton>
        
        <ShinyButton 
          color="#00c853" 
          onClick={() => handleClick("Join waitlist")}
        >
          Join waitlist
        </ShinyButton>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,500&display=swap");

        :root {
          --shiny-cta-bg: #000000;
          --shiny-cta-bg-subtle: #1a1818;
          --shiny-cta-fg: #ffffff;
          --shiny-cta-highlight: blue;
          --shiny-cta-highlight-subtle: #8484ff;
        }

        @property --gradient-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        @property --gradient-angle-offset {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        @property --gradient-percent {
          syntax: "<percentage>";
          initial-value: 5%;
          inherits: false;
        }

        @property --gradient-shine {
          syntax: "<color>";
          initial-value: white;
          inherits: false;
        }

        .shiny-cta {
          --animation: gradient-angle linear infinite;
          --duration: 3s;
          --shadow-size: 2px;
          isolation: isolate;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          outline-offset: 4px;
          padding: 1.25rem 2.5rem;
          font-family: 'Inter', sans-serif;
          font-size: 1.125rem;
          line-height: 1.2;
          border: 1px solid transparent;
          border-radius: 360px;
          color: var(--shiny-cta-fg);
          background: linear-gradient(var(--shiny-cta-bg), var(--shiny-cta-bg))
              padding-box,
            conic-gradient(
                from calc(var(--gradient-angle) - var(--gradient-angle-offset)),
                transparent,
                var(--shiny-cta-highlight) var(--gradient-percent),
                var(--gradient-shine) calc(var(--gradient-percent) * 2),
                var(--shiny-cta-highlight) calc(var(--gradient-percent) * 3),
                transparent calc(var(--gradient-percent) * 4)
              )
              border-box;
          box-shadow: inset 0 0 0 1px var(--shiny-cta-bg-subtle);
        }

        /* Dots pattern */
        .shiny-cta::before {
          content: "";
          pointer-events: none;
          position: absolute;
          inset-inline-start: 50%;
          inset-block-start: 50%;
          translate: -50% -50%;
          z-index: -1;
          --size: calc(100% - var(--shadow-size) * 3);
          --position: 2px;
          --space: calc(var(--position) * 2);
          width: var(--size);
          height: var(--size);
          background: radial-gradient(
              circle at var(--position) var(--position),
              white calc(var(--position) / 4),
              transparent 0
            )
            padding-box;
          background-size: var(--space) var(--space);
          background-repeat: space;
          mask-image: conic-gradient(
            from calc(var(--gradient-angle) + 45deg),
            black,
            transparent 10% 90%,
            black
          );
          border-radius: inherit;
          opacity: 0.4;
        }

        /* Inner shimmer */
        .shiny-cta::after {
          content: "";
          pointer-events: none;
          position: absolute;
          inset-inline-start: 50%;
          inset-block-start: 50%;
          translate: -50% -50%;
          z-index: -1;
          --animation: shimmer linear infinite;
          width: 100%;
          aspect-ratio: 1;
          background: linear-gradient(
            -50deg,
            transparent,
            var(--shiny-cta-highlight),
            transparent
          );
          mask-image: radial-gradient(circle at bottom, transparent 40%, black);
          opacity: 0.6;
        }

        .shiny-cta span {
          z-index: 1;
          position: relative;
        }

        .shiny-cta span::before {
          content: "";
          pointer-events: none;
          position: absolute;
          inset-inline-start: 50%;
          inset-block-start: 50%;
          translate: -50% -50%;
          z-index: -1;
          --size: calc(100% + 1rem);
          width: var(--size);
          height: var(--size);
          box-shadow: inset 0 -1ex 2rem 4px var(--shiny-cta-highlight);
          opacity: 0;
        }

        /* Animate */
        .shiny-cta {
          --transition: 800ms cubic-bezier(0.25, 1, 0.5, 1);
          transition: var(--transition);
          transition-property: --gradient-angle-offset, --gradient-percent,
            --gradient-shine;
        }

        .shiny-cta,
        .shiny-cta::before,
        .shiny-cta::after {
          animation: var(--animation) var(--duration),
            var(--animation) calc(var(--duration) / 0.4) reverse paused;
          animation-composition: add;
        }

        .shiny-cta span::before {
          transition: opacity var(--transition);
          animation: calc(var(--duration) * 1.5) breathe linear infinite;
        }

        .shiny-cta:active {
          transform: translateY(1px);
        }

        @keyframes gradient-angle {
          to {
            --gradient-angle: 360deg;
          }
        }

        @keyframes shimmer {
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes breathe {
          from,
          to {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
          }
        }
      `}</style>
    </div>
  );
};