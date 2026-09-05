'use client';

import { cn } from "@/lib/utils";
import { useState } from 'react';

interface GlitchTextProps {
  word?: string;
  className?: string;
}

export default function GlitchText({ word = "SYSTEM FAILURE", className = "" }: GlitchTextProps) {
  const [key, setKey] = useState(0);

  const replay = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div className={`glitch-container ${className}`}>
      
      <div key={key} className="text-wrapper">
        <h1 className="title" aria-label={word}>
          {word.split("").map((char, i) => (
            <span
              key={`${key}-${i}`}
              className="char"
              data-char={char} // Crucial for pseudo-element duplication
              style={{ "--index": i } as React.CSSProperties}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>
      </div>

      <button className="replay-button" onClick={replay}>
        <span className="btn-text">Initialize</span>
      </button>

      <style jsx>{`
        /* --- INVERTED THEME VARIABLES --- */
        .glitch-container {
          /* Light Mode: Black Box, White Text, Green Accent */
          --bg-color: #050505;      
          --text-color: #ffffff;    
          --glitch-color-1: #00ffff; /* Cyan */
          --glitch-color-2: #ff00ff; /* Magenta */
          
          /* Button */
          --btn-bg: #222;       
          --btn-text: #00ffff;
          --btn-border: #00ffff;
        }

        @media (prefers-color-scheme: dark) {
          .glitch-container {
            /* Dark Mode: White Box, Black Text, Red Accent */
            --bg-color: #ffffff;    
            --text-color: #000000;  
            --glitch-color-1: #ff0000; /* Red */
            --glitch-color-2: #0000ff; /* Blue */
            
            --btn-bg: #eee;      
            --btn-text: #000;
            --btn-border: #000;
          }
        }

        /* Manual .dark class override */
        :global(.dark) .glitch-container {
          --bg-color: #ffffff;    
          --text-color: #000000;  
          --glitch-color-1: #ff0000;
          --glitch-color-2: #0000ff;
          --btn-bg: #eee;      
          --btn-text: #000;
          --btn-border: #000;
        }

        /* --- Layout --- */
        .glitch-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          background-color: var(--bg-color); 
          color: var(--text-color);
          border-radius: 4px;
          overflow: hidden;
          min-height: 350px;
          width: 100%;
          transition: background-color 0.1s steps(2);
          font-family: 'Courier New', Courier, monospace; /* Monospace is key */
        }

        /* --- Typography --- */
        .title {
          font-size: 4rem;
          font-weight: 700;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          line-height: 1;
          letter-spacing: -0.05em;
          text-transform: uppercase;
        }

        /* --- Glitch Animation --- */
        .char {
          display: inline-block;
          position: relative;
          opacity: 0;
          animation: reveal 0.1s steps(2) forwards;
          animation-delay: calc(0.05s * var(--index));
        }

        /* The RGB Split Layers */
        .char::before,
        .char::after {
          content: attr(data-char);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
        }

        /* Layer 1: Cyan/Red Shift */
        .char::before {
          color: var(--glitch-color-1);
          animation: glitch-1 0.4s steps(2) forwards;
          animation-delay: calc(0.05s * var(--index));
        }

        /* Layer 2: Magenta/Blue Shift */
        .char::after {
          color: var(--glitch-color-2);
          animation: glitch-2 0.5s steps(2) forwards;
          animation-delay: calc(0.05s * var(--index));
        }

        /* --- Button --- */
        .replay-button {
          margin-top: 3rem;
          padding: 0.8rem 2rem;
          background-color: var(--btn-bg);
          color: var(--btn-text);
          border: 1px solid var(--btn-border);
          font-family: 'Courier New', monospace;
          font-weight: 700;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.1s;
          box-shadow: 4px 4px 0px var(--btn-border);
        }

        .replay-button:hover {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0px var(--btn-border);
        }
        
        .replay-button:active {
          transform: translate(4px, 4px);
          box-shadow: none;
        }

        /* --- Keyframes --- */
        @keyframes reveal {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes glitch-1 {
          0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 1px); opacity: 0; }
          20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); opacity: 1; }
          40% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); opacity: 1; }
          60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); opacity: 1; }
          80% { clip-path: inset(10% 0 70% 0); transform: translate(-1px, 1px); opacity: 1; }
          100% { clip-path: inset(0 0 0 0); transform: translate(0, 0); opacity: 0; } /* Disappear at end */
        }

        @keyframes glitch-2 {
          0% { clip-path: inset(10% 0 60% 0); transform: translate(2px, -1px); opacity: 0; }
          20% { clip-path: inset(80% 0 5% 0); transform: translate(-2px, 2px); opacity: 1; }
          40% { clip-path: inset(30% 0 20% 0); transform: translate(2px, 1px); opacity: 1; }
          60% { clip-path: inset(10% 0 80% 0); transform: translate(-1px, -2px); opacity: 1; }
          80% { clip-path: inset(50% 0 30% 0); transform: translate(1px, 2px); opacity: 1; }
          100% { clip-path: inset(0 0 0 0); transform: translate(0, 0); opacity: 0; }
        }

        @media (max-width: 768px) {
          .title { font-size: 2.5rem; }
        }
      `}</style>
    </div>
  );
}