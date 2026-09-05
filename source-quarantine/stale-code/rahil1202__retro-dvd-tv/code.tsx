"use client";

import React from "react";

export type RetroDvdTvProps = {
  /** Outer TV width (e.g. "35rem", "500px") */
  width?: string;
  /** Outer TV height (optional; default adjusts automatically) */
  height?: string;
  /** Logo text shown bouncing on the screen */
  logoText?: string;
  /** Marquee speed (lower = slower). Default: 100 */
  speed?: number;
  /** Base color of the logo (used if colorCycle = false) */
  color?: string;
  /** Enable or disable color-cycling animation */
  colorCycle?: boolean;
  /** Extra class names for wrapper */
  className?: string;
};

const RetroDvdTv: React.FC<RetroDvdTvProps> = ({
  width = "35rem",
  height = "auto",
  logoText = "DVD",
  speed = 100,
  color = "#ffffff",
  colorCycle = true,
  className = "",
}) => {
  return (
    <div
      className={`tv-root ${className}`}
      style={
        {
          ["--tv-width" as any]: width,
          ["--tv-height" as any]: height,
          ["--logo-color" as any]: color,
          ["--marquee-speed" as any]: `${speed}`,
          ["--color-animate" as any]: colorCycle ? "running" : "paused",
        } as React.CSSProperties
      }
    >
      <div className="tv">
        <div className="tv__frame">
          <div className="tv__screen">
            <marquee
              className="tv__screen-inner"
              direction="down"
              behavior="alternate"
              scrollamount={speed}
            >
              <marquee behavior="alternate" scrollamount={speed}>
                <span className="logo">{logoText}</span>
              </marquee>
            </marquee>
          </div>
        </div>

        <div className="tv__bottom">
          <div className="tv__speaker" />
          <div className="tv__controls">
            <button className="tv__button" aria-label="Power">
              ⏻
            </button>
          </div>
          <div className="tv__controls">
            <button className="tv__button">−</button>
            <button className="tv__button">+</button>
          </div>
          <div className="tv__controls">
            <button className="tv__button">‹</button>
            <button className="tv__button">›</button>
          </div>
          <div className="tv__speaker" />
        </div>
      </div>

      <style jsx>{`
        .tv-root {
          --shadow: drop-shadow(0px 2px 0px #ffffff0f)
            drop-shadow(0px -2px 0px #0000000f);
          width: var(--tv-width);
          height: var(--tv-height);
          display: grid;
          place-items: center;
          padding: 2rem;
          background: #ccc;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica,
            Arial, "Apple Color Emoji", "Segoe UI Emoji";
        }

        .tv {
          width: 100%;
          padding: 1.5rem;
          background: #2f363a;
          border-radius: 1rem;
          border: 0.4rem solid #24231f;
          display: grid;
          gap: 1.5rem;
          height: 100%;
        }

        .tv__frame {
          position: relative;
          border-radius: 1rem;
          background-color: #24231f;
          padding: 2rem;
          filter: var(--shadow);
          flex: 1;
        }
        .tv__frame::after {
          content: "";
          border-radius: 5% / 100%;
          position: absolute;
          inset: 1.4rem 2rem;
          z-index: 1;
          animation: scanlines 0.5s linear infinite;
          background-image: repeating-linear-gradient(
            transparent,
            transparent 5px,
            rgba(0, 0, 0, 0.02) 5px,
            rgba(0, 0, 0, 0.02) 10px
          );
          box-shadow: inset 6px 5px 20px 11px #24231f57;
          pointer-events: none;
        }

        .tv__screen {
          position: relative;
          border-radius: 100% / 5%;
          z-index: 1;
          padding: 0;
        }
        .tv__screen::after,
        .tv__screen::before {
          content: "";
          background: #4e5e55;
          border-radius: 5% / 100%;
          position: absolute;
          inset: 0;
          z-index: -1;
        }
        .tv__screen::after {
          inset: -0.6rem 0.7rem;
          border-radius: 100% / 5%;
        }

        .tv__screen-inner {
          width: 100%;
          height: 60%;
          aspect-ratio: 5 / 4;
          display: block;
        }

        .tv__bottom {
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          gap: 0.75rem;
        }

        .tv__controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .tv__button {
          display: block;
          background: none;
          color: inherit;
          border: 1px solid black;
          border-radius: 50%;
          line-height: 0;
          font-weight: 100;
          aspect-ratio: 1;
          width: 1.5rem;
          height: 1.5rem;
          filter: var(--shadow);
          cursor: pointer;
        }

        .tv__speaker {
          background-image: radial-gradient(black 0.1rem, transparent 0);
          background-size: 0.5rem 0.5rem;
          width: 8rem;
          padding: 2rem;
          filter: var(--shadow);
        }

        .logo {
          display: inline-block;
          text-align: center;
          font-size: 2rem;
          font-weight: bold;
          line-height: 1;
          letter-spacing: -0.05em;
          color: var(--logo-color, #ffffff);
          animation: colorChange 42s infinite;
          animation-play-state: var(--color-animate);
          animation-timing-function: steps(1, end);
          opacity: 0.5;
          user-select: none;
          text-transform: uppercase;
        }
        .logo::after {
          display: block;
          font-size: 0.3em;
          font-weight: normal;
          letter-spacing: 0.2em;
          background-color: var(--logo-color, #ffffff);
          color: #4e5e55;
          padding-block: 0.2em;
          border-radius: 50%;
          text-transform: uppercase;
          content: "Video";
        }

        @keyframes scanlines {
          to {
            background-position-y: 10px;
          }
        }

        @keyframes colorChange {
          0% {
            --logo-color: #ffffff;
          }
          10% {
            --logo-color: #ff0000;
          }
          20% {
            --logo-color: #00ff00;
          }
          30% {
            --logo-color: #0000ff;
          }
          40% {
            --logo-color: #ffff00;
          }
          50% {
            --logo-color: #00ffff;
          }
          60% {
            --logo-color: #ff00ff;
          }
          70% {
            --logo-color: #ffa500;
          }
          80% {
            --logo-color: #800080;
          }
          90% {
            --logo-color: #1e90ff;
          }
          100% {
            --logo-color: #ffffff;
          }
        }
      `}</style>
    </div>
  );
};

export  {RetroDvdTv};
