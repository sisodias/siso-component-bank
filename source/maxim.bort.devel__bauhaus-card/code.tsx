"use client";
import React, { useEffect, useRef } from "react";
import { ChronicleButton } from "./chronicle-button";

const BAUHAUS_CARD_STYLES = `
.bauhaus-card {
  position: relative;
  z-index: 555;
  max-width: 20rem;
  min-height: 20rem;
  width: 90%;
  display: grid;
  place-content: center;
  place-items: center;
  text-align: center;
  box-shadow: 1px 12px 25px rgb(0,0,0/78%);
  border-radius: var(--card-radius, 20px);
  border: var(--card-border-width, 2px) solid transparent;
  --rotation: 4.2rad;
  background-image:
    linear-gradient(var(--card-bg, #151419), var(--card-bg, #151419)),
    linear-gradient(calc(var(--rotation,4.2rad)), var(--card-accent, #156ef6) 0, var(--card-bg, #151419) 30%, transparent 80%);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  color: var(--card-text-main, #f0f0f1);
}
.bauhaus-card::before {
  position: absolute;
  content: "";
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 2.25rem;
  z-index: -1;
  border: 0.155rem solid transparent;
  -webkit-mask-composite: destination-out;
  mask-composite: exclude;
}
.bauhaus-card-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8em 0.5em 0em 1.5em;
}
.bauhaus-button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  padding-top: 7px;
  padding-bottom: 7px;
}
.bauhaus-date {
  color: var(--card-text-top, #bfc7d5);
}
.bauhaus-size6 {
  width: 2.5rem;
  cursor: pointer;
}
.bauhaus-card-body {
  position: absolute;
  width: 100%;
  display: block;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0.7em 1.25em 0.5em 1.5em;
}
.bauhaus-card-body h3 {
  font-size: 1.375rem;
  margin-top: -0.4em;
  margin-bottom: 0.188em;
  font-weight: 600;
  color: var(--card-text-main, #f0f0f1);
}
.bauhaus-card-body p {
  color: var(--card-text-sub, #a0a1b3);
  font-size: 1rem;
  letter-spacing: 0.031rem;
}
.bauhaus-progress {
  margin-top: 0.938rem;
}
.bauhaus-progress-bar {
  position: relative;
  width: 100%;
  background: var(--card-progress-bar-bg, #363636);
  height: 0.313rem;
  display: block;
  border-radius: 3.125rem;
}
.bauhaus-progress-bar > div {
  height: 5px;
  border-radius: 3.125rem;
}
.bauhaus-progress span:first-of-type {
  text-align: left;
  font-weight: 600;
  width: 100%;
  display: block;
  margin-bottom: 0.313rem;
  color: var(--card-text-progress-label, #b4c7e7);
}
.bauhaus-progress span:last-of-type {
  margin-top: 0.313rem;
  text-align: right;
  display: block;
  color: var(--card-text-progress-value, #e7e7f7);
}
.bauhaus-card-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.7em 1.25em 0.5em 1.5em;
  border-bottom-left-radius: 2.25rem;
  border-bottom-right-radius: 2.25rem;
  border-top: 0.063rem solid var(--card-separator, #2F2B2A);
}
`;

function injectBauhausCardStyles() {
  if (typeof window === "undefined") return;
  if (!document.getElementById("bauhaus-card-styles")) {
    const style = document.createElement("style");
    style.id = "bauhaus-card-styles";
    style.innerHTML = BAUHAUS_CARD_STYLES;
    document.head.appendChild(style);
  }
}

const isRTL = (text: string): boolean =>
  /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F]/.test(text);

export interface BauhausCardProps {
  id: string;
  borderRadius?: string;
  backgroundColor?: string;
  separatorColor?: string;
  accentColor: string;
  borderWidth?: string;
  topInscription: string;
  mainText: string;
  subMainText: string;
  progressBarInscription: string;
  progress: number;
  progressValue: string;
  filledButtonInscription?: string;
  outlinedButtonInscription?: string;
  onFilledButtonClick: (id: string) => void;
  onOutlinedButtonClick: (id: string) => void;
  onMoreOptionsClick: (id: string) => void;
  mirrored?: boolean;
  swapButtons?: boolean;
  ChronicleButtonHoverColor?: string;
  textColorTop?: string;
  textColorMain?: string;
  textColorSub?: string;
  textColorProgressLabel?: string;
  textColorProgressValue?: string;
  progressBarBackground?: string;
  chronicleButtonBg?: string;
  chronicleButtonFg?: string;
  chronicleButtonHoverFg?: string;
}

export const Component: React.FC<BauhausCardProps> = ({
  id,
  borderRadius = "2em",
  backgroundColor = "#151419",
  separatorColor = "#2F2B2A",
  accentColor = "#156ef6",
  borderWidth = "2px",
  topInscription = "Not Set!",
  swapButtons = false,
  mainText = "Not Set!",
  subMainText = "Not Set!",
  progressBarInscription = "Not Set!",
  progress = 0,
  progressValue = "Not Set!",
  filledButtonInscription = "Not Set!",
  outlinedButtonInscription = "Not Set!",
  onFilledButtonClick,
  onOutlinedButtonClick,
  onMoreOptionsClick,
  mirrored = false,
  ChronicleButtonHoverColor = "#156ef6",
  textColorTop = "#bfc7d5",
  textColorMain = "#f0f0f1",
  textColorSub = "#a0a1b3",
  textColorProgressLabel = "#b4c7e7",
  textColorProgressValue = "#e7e7f7",
  progressBarBackground = "#363636",
  chronicleButtonBg = "#151419",
  chronicleButtonFg = "#fff",
  chronicleButtonHoverFg = "#fff",
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    injectBauhausCardStyles();
    const card = cardRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      if (card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const angle = Math.atan2(-x, y);
        card.style.setProperty("--rotation", angle + "rad");
      }
    };
    if (card) {
      card.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (card) {
        card.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <div
      className="bauhaus-card"
      ref={cardRef}
      style={{
        '--card-bg': backgroundColor,
        '--card-border': separatorColor,
        '--card-accent': accentColor,
        '--card-radius': borderRadius,
        '--card-border-width': borderWidth,
        '--card-text-top': textColorTop,
        '--card-text-main': textColorMain,
        '--card-text-sub': textColorSub,
        '--card-text-progress-label': textColorProgressLabel,
        '--card-text-progress-value': textColorProgressValue,
        '--card-separator': separatorColor,
        '--card-progress-bar-bg': progressBarBackground,
      } as React.CSSProperties}
    >
      <div
        style={{ transform: mirrored ? 'scaleX(-1)' : 'none' }}
        className="bauhaus-card-header"
      >
        <div
          className="bauhaus-date"
          style={{
            transform: mirrored ? 'scaleX(-1)' : 'none',
            direction: isRTL(topInscription) ? 'rtl' : 'ltr',
          }}
        >
          {topInscription}
        </div>
        <div
          onClick={() => onMoreOptionsClick(id)}
          style={{ cursor: 'pointer' }}
        >
          <svg viewBox="0 0 24 24" fill="var(--card-text-main)" className="bauhaus-size6">
            <path fillRule="evenodd" d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <div className="bauhaus-card-body">
        <h3 style={{ direction: isRTL(mainText) ? 'rtl' : 'ltr' }}>{mainText}</h3>
        <p style={{ direction: isRTL(subMainText) ? 'rtl' : 'ltr' }}>{subMainText}</p>
        <div className="bauhaus-progress">
          <span style={{
            direction: isRTL(progressBarInscription) ? 'rtl' : 'ltr',
            textAlign: mirrored ? 'right' : 'left'
          }}>
            {progressBarInscription}
          </span>
          <div
            style={{ transform: mirrored ? 'scaleX(-1)' : 'none' }}
            className="bauhaus-progress-bar"
          >
            <div
              style={{
                width: `${(progress / 100) * 100}%`,
                backgroundColor: accentColor
              }}
            />
          </div>
          <span style={{
            direction: isRTL(progressValue) ? 'rtl' : 'ltr',
            textAlign: mirrored ? 'left' : 'right'
          }}>
            {progressValue}
          </span>
        </div>
      </div>
      <div className="bauhaus-card-footer">
        <div className="bauhaus-button-container">
          {swapButtons ? (
            <>
              <ChronicleButton
                text={outlinedButtonInscription}
                outlined={true}
                width="124px"
                onClick={() => onOutlinedButtonClick(id)}
                borderRadius={borderRadius}
                hoverColor={accentColor}
                customBackground={chronicleButtonBg}
                customForeground={chronicleButtonFg}
                hoverForeground={chronicleButtonHoverFg}
              />
              <ChronicleButton
                text={filledButtonInscription}
                width="124px"
                onClick={() => onFilledButtonClick(id)}
                borderRadius={borderRadius}
                hoverColor={accentColor}
                customBackground={chronicleButtonBg}
                customForeground={chronicleButtonFg}
                hoverForeground={chronicleButtonHoverFg}
              />
            </>
          ) : (
            <>
              <ChronicleButton
                text={filledButtonInscription}
                width="124px"
                onClick={() => onFilledButtonClick(id)}
                borderRadius={borderRadius}
                hoverColor={accentColor}
                customBackground={chronicleButtonBg}
                customForeground={chronicleButtonFg}
                hoverForeground={chronicleButtonHoverFg}
              />
              <ChronicleButton
                text={outlinedButtonInscription}
                outlined={true}
                width="124px"
                onClick={() => onOutlinedButtonClick(id)}
                borderRadius={borderRadius}
                hoverColor={accentColor}
                customBackground={chronicleButtonBg}
                customForeground={chronicleButtonFg}
                hoverForeground={chronicleButtonHoverFg}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
