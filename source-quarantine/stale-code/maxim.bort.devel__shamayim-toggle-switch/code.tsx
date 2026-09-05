"use client";
import React, { useState } from "react";

type PatternType =
  | "conic"
  | "linear"
  | "dots"
  | "grid"
  | "zigzag"
  | "waves"
  | "cross"
  | "checker"
  | "hex"
  | "bricks"
  | "triangles"
  | "stars"
  | "rings"
  | "plaid"
  | "honeycomb"
  | "plus";

interface ShamayimToggleSwitchProps {
  defaultState: boolean;
  mirrored?: boolean;
  onChange: (isOn: boolean) => void;
  iconOff?: string;
  iconOn?: string;
  iconShadow?: string;
  trackBg?: string;
  trackShadow?: string;
  buttonBg?: string;
  buttonShadow?: string;
  buttonBeforeBg?: string;
  buttonAfterBg?: string;
  pattern?: PatternType;
}

const defaultColors = {
  iconOff: "#4c9bab",
  iconOn: "#e0f9fc",
  iconShadow: "0 1px 1px rgb(255 255 255 / .4)",
  trackBg: "repeating-conic-gradient(#0b66a0 0% 25%, #1093a8 0% 50%)",
  trackShadow:
    "inset 0 .125em .25em rgba(0, 9, 38, .6), inset -1.5em 0 .0625em rgba(0, 9, 38, .5), inset .5em 0 .5em rgba(0, 9, 38, .5), 0 1px 1px rgb(255 255 255 / .4)",
  buttonBg: "linear-gradient(to right, #86e2fa, #125e79)",
  buttonShadow: "0 .125em .25em rgb(0 0 0 / .6)",
  buttonBeforeBg: "linear-gradient(to right, #0f73a8, #57cfe2, #b3f0ff)",
  buttonAfterBg:
    "repeating-linear-gradient(to right, #d2f2f6 0 .0625em, #4ea0ae .0625em .125em, transparent .125em .1875em)",
};

const patternPresets: Record<PatternType, { trackBg: string; backgroundSize?: string; backgroundPosition?: string }> = {
  conic: {
    // Crisp, tight conic pattern
    trackBg: "repeating-conic-gradient(#0b66a0 0deg 18deg, #1093a8 18deg 36deg)",
    backgroundSize: "18px 18px",
  },
  linear: {
    trackBg: "repeating-linear-gradient(135deg, #0b66a0 0 2px, #1093a8 2px 4px)",
    backgroundSize: "8px 8px",
  },
  dots: {
    trackBg:
      "radial-gradient(circle at 2px 2px, #1093a8 1.5px, transparent 0), radial-gradient(circle at 6px 6px, #0b66a0 1.5px, transparent 0)",
    backgroundSize: "8px 8px",
  },
  grid: {
    trackBg:
      "linear-gradient(#1093a8 1.5px, transparent 1.5px), linear-gradient(90deg, #1093a8 1.5px, transparent 1.5px)",
    backgroundSize: "8px 8px",
  },
  zigzag: {
    trackBg:
      "repeating-linear-gradient(135deg, #1093a8 0 2px, transparent 2px 4px), repeating-linear-gradient(-135deg, #0b66a0 0 2px, transparent 2px 4px)",
    backgroundSize: "8px 8px",
  },
  waves: {
    trackBg:
      "repeating-radial-gradient(circle at 0 8px, #1093a8 0 1px, transparent 1px 8px)",
    backgroundSize: "16px 16px",
  },
  cross: {
    trackBg:
      "linear-gradient(90deg, #0b66a0 1px, transparent 1px), linear-gradient(#1093a8 1px, transparent 1px)",
    backgroundSize: "6px 6px",
  },
  checker: {
    // Crisp, small checkerboard
    trackBg:
      "linear-gradient(45deg, #0b66a0 25%, transparent 25%, transparent 75%, #0b66a0 75%, #0b66a0), linear-gradient(45deg, #0b66a0 25%, transparent 25%, transparent 75%, #0b66a0 75%, #0b66a0)",
    backgroundSize: "8px 8px",
    backgroundPosition: "0 0, 4px 4px",
  },
  hex: {
    // Crisp, small hex pattern
    trackBg:
      "radial-gradient(circle, #0b66a0 2px, transparent 2.5px), radial-gradient(circle, #1093a8 2px, transparent 2.5px)",
    backgroundSize: "12px 13.86px",
    backgroundPosition: "0 0, 6px 6.93px",
  },
  bricks: {
    trackBg:
      "repeating-linear-gradient(0deg, #1093a8 0 4px, transparent 4px 8px), repeating-linear-gradient(90deg, #0b66a0 0 8px, transparent 8px 16px)",
    backgroundSize: "16px 8px",
    backgroundPosition: "0 0, 8px 4px",
  },
  triangles: {
    trackBg:
      "repeating-linear-gradient(135deg, #1093a8 0 4px, transparent 4px 8px), repeating-linear-gradient(-135deg, #0b66a0 0 4px, transparent 4px 8px)",
    backgroundSize: "8px 8px",
  },
  stars: {
    trackBg:
      "radial-gradient(circle at 2px 2px, #1093a8 1px, transparent 1.5px), radial-gradient(circle at 6px 6px, #0b66a0 1px, transparent 1.5px)",
    backgroundSize: "8px 8px",
  },
  rings: {
    trackBg:
      "repeating-radial-gradient(circle, #1093a8 0 1px, transparent 1px 4px)",
    backgroundSize: "16px 16px",
  },
  plaid: {
    trackBg:
      "repeating-linear-gradient(0deg, #1093a8 0 2px, transparent 2px 8px), repeating-linear-gradient(90deg, #0b66a0 0 2px, transparent 2px 8px)",
    backgroundSize: "8px 8px",
  },
  honeycomb: {
    trackBg:
      "radial-gradient(circle, #0b66a0 2px, transparent 2.5px), radial-gradient(circle, #1093a8 2px, transparent 2.5px)",
    backgroundSize: "12px 10.4px",
    backgroundPosition: "0 0, 6px 5.2px",
  },
  plus: {
    trackBg:
      "linear-gradient(90deg, #0b66a0 1px, transparent 1px), linear-gradient(#1093a8 1px, transparent 1px)",
    backgroundSize: "8px 8px",
  },
};

const ShamayimToggleSwitch: React.FC<ShamayimToggleSwitchProps> = ({
  defaultState,
  mirrored = false,
  onChange,
  iconOff,
  iconOn,
  iconShadow,
  trackBg,
  trackShadow,
  buttonBg,
  buttonShadow,
  buttonBeforeBg,
  buttonAfterBg,
  pattern = "conic",
}) => {
  const [isOn, setIsOn] = useState(defaultState);

  // Pick pattern preset or fallback to default
  const preset = patternPresets[pattern] || patternPresets.conic;

  const patternTrackBg = trackBg || preset.trackBg || defaultColors.trackBg;
  const patternBackgroundSize = preset.backgroundSize || "16px 16px";
  const patternBackgroundPosition = preset.backgroundPosition || "0 0";

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    onChange(newState);
  };

  return (
    <div
      className="toggle-wrapper"
      style={{ transform: mirrored ? "scaleX(-1)" : "none" }}
    >
      <input
        className="toggle-checkbox"
        type="checkbox"
        checked={isOn}
        onChange={handleToggle}
      />
      <svg
        className="toggle-icon off"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          fill: iconOff || defaultColors.iconOff,
          filter: `drop-shadow(${iconShadow || defaultColors.iconShadow})`,
          transition: "fill .4s",
        }}
      >
        <path d="M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8Z" />
      </svg>
      <div
        className="toggle-container"
        style={{
          backgroundImage: patternTrackBg,
          backgroundSize: patternBackgroundSize,
          backgroundPosition: patternBackgroundPosition,
          boxShadow: trackShadow || defaultColors.trackShadow,
        }}
      >
        <div
          className="toggle-button"
          style={{
            backgroundImage: buttonBg || defaultColors.buttonBg,
            boxShadow: buttonShadow || defaultColors.buttonShadow,
          }}
        ></div>
      </div>
      <svg
        className="toggle-icon on"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        style={{
          fill: iconOn || defaultColors.iconOn,
          filter: `drop-shadow(${iconShadow || defaultColors.iconShadow})`,
          transition: "fill .4s",
        }}
      >
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 1 1 16 0zM2 8a6 6 0 1 0 12 0A6 6 0 1 0 2 8zm10 0a4 4 0 1 1-8 0 4 4 0 1 1 8 0z" />
      </svg>
      <style jsx>{`
        .toggle-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          column-gap: 0.25em;
        }
        .toggle-icon {
          width: 0.5em;
          height: 0.5em;
          transition: fill 0.4s;
        }
        .toggle-checkbox:not(:checked) + .toggle-icon.off,
        .toggle-checkbox:checked ~ .toggle-icon.on {
          fill: ${iconOn || defaultColors.iconOn};
        }
        .toggle-checkbox {
          -webkit-appearance: none;
          appearance: none;
          position: absolute;
          z-index: 1;
          border-radius: 3.125em;
          width: 4.05em;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
        .toggle-container {
          position: relative;
          border-radius: 3.125em;
          width: 4.05em;
          height: 1.5em;
        }
        .toggle-button {
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          top: 0.0625em;
          left: 0.0625em;
          border-radius: inherit;
          width: 2.55em;
          height: calc(100% - 0.125em);
          transition: left 0.4s;
        }
        .toggle-checkbox:checked ~ .toggle-container > .toggle-button {
          left: 1.4375em;
        }
        .toggle-button::before {
          content: '';
          position: absolute;
          top: inherit;
          border-radius: inherit;
          width: calc(100% - .375em);
          height: inherit;
          background-image: ${buttonBeforeBg || defaultColors.buttonBeforeBg};
        }
        .toggle-button::after {
          content: '';
          position: absolute;
          width: .5em;
          height: 38%;
          background-image: ${buttonAfterBg || defaultColors.buttonAfterBg};
        }
      `}</style>
    </div>
  );
};

export { ShamayimToggleSwitch };
