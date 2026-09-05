'use client';

import { cn } from "../_utils/cn";
import { useState } from 'react';

interface FlipTextProps {
  word?: string;
  className?: string;
}

export default function FlipTextReveal({ word = "DIGITAL REALITY", className = "" }: FlipTextProps) {
  const [key, setKey] = useState(0);

  const replay = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div className={`flip-container ${className}`}>
      
      <div key={key} className="text-wrapper">
        <h1 className="title" aria-label={word}>
          {word.split("").map((char, i) => (
            <span
              key={`${key}-${i}`}
              className="char"
              style={{ "--index": i } as React.CSSProperties}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>
      </div>

      <button className="replay-button" onClick={replay}>
        <span className="btn-text">Replay Action</span>
      </button>

      <style jsx>{`
        /* --- INVERTED THEME VARIABLES --- */
        .flip-container {
          /* Light Mode (Default): Component is BLACK, Text is WHITE */
          --bg-color: #09090b;      
          --text-color: #ffffff;    
          
          /* Button styling */
          --btn-bg: #27272a;       
          --btn-text: #ffffff;
          --btn-border: #3f3f46;
          --btn-hover: #52525b;
        }

        @media (prefers-color-scheme: dark) {
          .flip-container {
            /* Dark Mode: Component is WHITE, Text is BLACK */
            --bg-color: #ffffff;    
            --text-color: #09090b;  
            
            --btn-bg: #f4f4f5;      
            --btn-text: #18181b;
            --btn-border: #e4e4e7;
            --btn-hover: #d4d4d8;
          }
        }

        /* Manual .dark class override */
        :global(.dark) .flip-container {
          --bg-color: #ffffff;    
          --text-color: #09090b;  
          --btn-bg: #f4f4f5;      
          --btn-text: #18181b;
          --btn-border: #e4e4e7;
          --btn-hover: #d4d4d8;
        }

        /* --- Layout --- */
        .flip-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          background-color: var(--bg-color); 
          color: var(--text-color);
          border-radius: 16px;
          overflow: hidden;
          min-height: 350px;
          width: 100%;
          transition: background-color 0.4s ease, color 0.4s ease;
          
          /* 3D Stage */
          perspective: 800px; 
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1);
        }

        /* --- Typography --- */
        .title {
          font-size: 4.5rem; /* Massive text */
          font-weight: 900;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          line-height: 1;
          text-transform: uppercase; /* Force uppercase for impact */
          letter-spacing: -0.04em;   /* Tight tracking */
          transform-style: preserve-3d;
        }

        /* --- 3D Character Animation --- */
        .char {
          display: inline-block;
          color: var(--text-color);
          transform-origin: bottom center; /* Hinge from bottom */
          
          opacity: 0;
          transform: rotateX(-90deg) translateY(20px);
          
          /* Elastic bounce effect */
          animation: flip-up 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          animation-delay: calc(0.06s * var(--index));
          will-change: transform, opacity;
        }

        /* --- Button --- */
        .replay-button {
          margin-top: 3.5rem;
          padding: 0.8rem 2rem;
          background-color: var(--btn-bg);
          color: var(--btn-text);
          border: 1px solid var(--btn-border);
          border-radius: 99px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .replay-button:hover {
          background-color: var(--btn-hover);
          transform: scale(1.05);
        }
        
        .replay-button:active {
          transform: scale(0.95);
        }

        /* --- Keyframes --- */
        @keyframes flip-up {
          0% {
            opacity: 0;
            transform: rotateX(-90deg) translateY(40px);
          }
          100% {
            opacity: 1;
            transform: rotateX(0deg) translateY(0);
          }
        }

        /* Responsive Text Sizing */
        @media (max-width: 768px) {
          .title { font-size: 2.5rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .char {
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
