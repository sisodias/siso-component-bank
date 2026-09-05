'use client';

import { cn } from "@/lib/utils";
import { useState } from 'react';

interface SlicedTextProps {
  word?: string;
  className?: string;
}

export default function SliceText({ word = "SPLIT REALITY", className = "" }: SlicedTextProps) {
  const [key, setKey] = useState(0);

  const replay = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div className={`sliced-container ${className}`}>
      
      <div key={key} className="text-wrapper">
        <h1 className="title" aria-label={word}>
          {word.split("").map((char, i) => (
            <span
              key={`${key}-${i}`}
              className="char"
              data-char={char} // Essential for the slice effect
              style={{ "--index": i } as React.CSSProperties}
            >
              {/* The main char is hidden, we see the pseudo-elements instead */}
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>
      </div>

      <button className="replay-button" onClick={replay}>
        <span className="btn-text">Merge Text</span>
      </button>

      <style jsx>{`
        /* --- INVERTED THEME VARIABLES --- */
        .sliced-container {
          /* Light Mode: Black Box, White Text */
          --bg-color: #09090b;      
          --text-color: #ffffff;    
          
          /* Button */
          --btn-bg: #27272a;       
          --btn-text: #ffffff;
          --btn-border: #3f3f46;
          --btn-hover: #ffffff;
          --btn-hover-text: #000000;
        }

        @media (prefers-color-scheme: dark) {
          .sliced-container {
            /* Dark Mode: White Box, Black Text */
            --bg-color: #ffffff;    
            --text-color: #09090b;  
            
            --btn-bg: #f4f4f5;      
            --btn-text: #18181b;
            --btn-border: #e4e4e7;
            --btn-hover: #000000;
            --btn-hover-text: #ffffff;
          }
        }

        /* Manual .dark class override */
        :global(.dark) .sliced-container {
          --bg-color: #ffffff;    
          --text-color: #09090b;  
          --btn-bg: #f4f4f5;      
          --btn-text: #18181b;
          --btn-border: #e4e4e7;
          --btn-hover: #000000;
          --btn-hover-text: #ffffff;
        }

        /* --- Layout --- */
        .sliced-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          background-color: var(--bg-color); 
          color: var(--text-color);
          border-radius: 20px;
          overflow: hidden;
          min-height: 350px;
          width: 100%;
          transition: background-color 0.4s ease, color 0.4s ease;
        }

        /* --- Typography --- */
        .title {
          font-family: 'Arial Black', 'Helvetica Neue', sans-serif;
          font-size: 4.5rem;
          font-weight: 900;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          line-height: 1;
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }

        /* --- The Sliced Logic --- */
        .char {
          display: inline-block;
          position: relative;
          color: transparent; /* Hide the actual text */
        }

        /* Top Half */
        .char::before {
          content: attr(data-char);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          color: var(--text-color);
          overflow: hidden;
          
          /* Clip to show only top half */
          clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
          
          /* Start higher up */
          transform: translateY(-50%) scale(1.1);
          opacity: 0;
          
          animation: slice-top 0.8s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
          animation-delay: calc(0.04s * var(--index));
        }

        /* Bottom Half */
        .char::after {
          content: attr(data-char);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          color: var(--text-color);
          overflow: hidden;
          
          /* Clip to show only bottom half */
          clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%);
          
          /* Start lower down */
          transform: translateY(50%) scale(1.1);
          opacity: 0;
          
          animation: slice-bottom 0.8s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
          animation-delay: calc(0.04s * var(--index));
        }

        /* --- Button --- */
        .replay-button {
          margin-top: 3.5rem;
          padding: 0.8rem 2rem;
          background: transparent;
          color: var(--btn-text);
          border: 2px solid var(--btn-border);
          border-radius: 8px;
          font-weight: 700;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .replay-button:hover {
          background: var(--btn-hover);
          color: var(--btn-hover-text);
          border-color: var(--btn-hover);
        }

        /* --- Keyframes --- */
        @keyframes slice-top {
          0% {
            opacity: 0;
            transform: translateY(-60%) skewX(10deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) skewX(0deg);
          }
        }

        @keyframes slice-bottom {
          0% {
            opacity: 0;
            transform: translateY(60%) skewX(-10deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) skewX(0deg);
          }
        }

        @media (max-width: 768px) {
          .title { font-size: 2.5rem; }
        }
      `}</style>
    </div>
  );
}