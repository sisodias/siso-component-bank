"use client";
import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";

export interface ModernRetroButtonColors {
  textDefault?: string;
  textHover?: string;
  background?: string;        // SVG rect fill
  borderColor?: string;       // (Unused, safe to remove from your theme vars)
  boxShadow?: string;
  boxShadowHover?: string;
  svgRect?: string;           // Animated bars
  svgRectFlicker?: string;    // Flicker color
  elasticity?: string;        // e.g., "elastic.out(12,0.3)"
}

export interface ModernRetroButtonProps extends ModernRetroButtonColors {
  onClick?: () => void;
  label: string;
  // border?: boolean;  // REMOVED
}

const ModernRetroButton: React.FC<ModernRetroButtonProps> = ({
  onClick,
  label,
  textDefault = "#f7f7ff",
  textHover = "#111118",
  background = "#f7f7ff", // default to light
  // border = false,           // REMOVED
  // borderColor = "#b6eaff",  // REMOVED
  boxShadow = "0 0 0 0 #0763f7",
  boxShadowHover = "0 0 20px 2px #0763f7",
  svgRect = "#76b3fa",
  svgRectFlicker = "#0c79f7",
  elasticity = "elastic.out(12, 0.3)",
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [textColor, setTextColor] = useState(textDefault);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isHovered) {
      timer = setTimeout(() => {
        setTextColor(textHover);
      }, 1000);
    } else {
      setTextColor(textDefault);
    }
    return () => clearTimeout(timer);
  }, [isHovered, textDefault, textHover]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (buttonRef.current) {
      const rects = buttonRef.current.querySelectorAll("rect.bar");
      gsap.to(rects, {
        duration: 0.8,
        ease: elasticity,
        x: "100%",
        stagger: 0.01,
        overwrite: true,
        onComplete: () => flickerEffect(rects),
      });
    }
  };

  const flickerEffect = (rects: NodeListOf<SVGRectElement>) => {
    gsap.fromTo(
      rects,
      { fill: svgRectFlicker },
      {
        fill: svgRect,
        duration: 0.1,
        ease: elasticity,
        repeat: -1,
        yoyo: true,
      }
    );
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (buttonRef.current) {
      const rects = buttonRef.current.querySelectorAll("rect.bar");
      gsap.to(rects, {
        duration: 0.8,
        ease: elasticity,
        x: "-100%",
        stagger: 0.01,
        overwrite: true,
        onComplete: () => {
          rects.forEach((node) => node.setAttribute("fill", svgRect));
        },
      });
    }
  };

  return (
    <button
      ref={buttonRef}
      className="retro-button"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        // border: border ? `2px solid ${borderColor}` : "none", // REMOVED
        boxShadow: isHovered ? boxShadowHover : boxShadow,
        position: "relative",
        background: "transparent", // SVG handles background
      }}
    >
      {/* SVG Background */}
      <svg
        className="bg-svg"
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          borderRadius: 15,
          pointerEvents: "none",
        }}
      >
        <rect x="0" y="0" width="100%" height="100%" rx="15" fill={background} />
      </svg>
      {/* Animated Bars */}
      <svg
        className="bars-svg"
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          borderRadius: 15,
          pointerEvents: "none",
        }}
      >
        <g className="left">
          {[...Array(25)].map((_, index) => (
            <rect
              className="bar"
              key={index}
              x="-100%"
              y={index * 2}
              width="100%"
              height="2"
              fill={svgRect}
            />
          ))}
        </g>
      </svg>
      {/* Label */}
      <span style={{ color: textColor, zIndex: 2, position: "relative" }}>
        {label}
      </span>
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&display=swap");
        .retro-button {
          cursor: pointer;
          display: flex;
          font-weight: 500;
          font-style: italic;
          align-items: center;
          justify-content: center;
          font-family: "IBM Plex Mono", monospace;
          height: 50px;
          padding: 0 30px;
          border-radius: 15px;
          outline: none;
          transform: skew(-15deg);
          overflow: hidden;
          transition: transform 350ms, box-shadow 350ms;
        }
        .retro-button:hover {
          transform: scale(1.05) skew(-15deg);
        }
        span {
          transition: color 350ms;
        }
      `}</style>
    </button>
  );
};

export default ModernRetroButton;