import React from "react";
import styled from "styled-components";

const LiquidSwipeButton = () => {
  const initialText = "Swipe to confirm";
  const confirmedText = "Confirmed";

  const renderText = (text: string) =>
    text.split("").map((char, i) => (
      <span
        key={i}
        className="char"
        style={{ "--i": i } as React.CSSProperties}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  return (
    <StyledWrapper>
      <div className="liquid-container">
        <input type="checkbox" id="swipe-btn" className="liquid-input" />

        <label htmlFor="swipe-btn" className="liquid-button">
          <div className="button-bg">
            <div className="glass-layer" />
            <div className="reflex-shine" />

            <div className="text-content">
              <p className="text-initial">{renderText(initialText)}</p>
              <p className="text-confirmed">{renderText(confirmedText)}</p>
            </div>

            <div className="swipe-handle">
              <div className="handle-glow" />

              {/* LOCK ICON */}
              <svg
                className="icon-lock"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={24}
                height={24}
              >
                <path
                  fill="currentColor"
                  d="M6 22q-.825 0-1.412-.587T4 20V10q0-.825.588-1.412T6 8h1V6q0-2.075 1.463-3.537T12 1t3.538 1.463T17 6v2h1q.825 0 1.413.588T20 10v10q0 .825-.587 1.413T18 22zm0-2h12V10H6z"
                />
              </svg>

              {/* UNLOCK ICON */}
              <svg
                className="icon-unlock"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={24}
                height={24}
              >
                <path
                  fill="currentColor"
                  d="M12 2c1.091 0 2.117.292 3 .804a1 1 0 1 1-1 1.73A4 4 0 0 0 8 8h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1a6 6 0 0 1 6-6z"
                />
              </svg>
            </div>
          </div>
        </label>
      </div>
    </StyledWrapper>
  );
};


const StyledWrapper = styled.div`
  .liquid-container {
    --button-width: 20em;
    --button-height: 5em;
    --handle-size: 4em;
    --border-radius: 2.8em;
    --travel-distance: calc(var(--button-width) - var(--handle-size) - 0.8em);
    --primary-color: #718096;
    --success-color: #00c4ff;
    --glass-bg: rgba(255, 255, 255, 0.4);
    --text-color: #6a7fa4;
    --handle-color: #ffffff;
    font-family: Poppins, sans-serif;
    max-width: var(--button-width);
    max-height: 27.75em;

    perspective: 1000px;
  }

  .liquid-input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .liquid-button {
    position: relative;
    display: block;
    width: var(--button-width);
    height: var(--button-height);
    cursor: pointer;
    user-select: none;
    outline: none;

    transform-style: preserve-3d;
    transition: transform 0.4s ease;
  }

  .liquid-button:hover {
    transform: rotateX(8deg) rotateY(-10deg) scale(1.02);
  }

  .button-bg {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: var(--border-radius);
    background: linear-gradient(175deg, #d3e6ff 0%, #ffffff 100%);
    border: 0.05em solid rgba(255, 255, 255, 0.9);
    box-shadow:
      0.4em 0.4em 0.6em rgba(163, 177, 198, 0.8),
      -0.4em -0.4em 0.6em rgba(255, 255, 255, 0.311),
      inset 0.1em 0.1em 0.1em rgba(255, 255, 255, 0.8),
      inset -0.1em -0.1em 0.1em rgba(163, 177, 198, 0.5);

    overflow: hidden;
    transition:
      all 0.6s cubic-bezier(0.23, 1, 0.32, 1),
      transform 0.4s ease;
    animation: gentle-float 4s ease-in-out infinite;
  }

  @keyframes gentle-float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-0.2em);
    }
  }

  .glass-layer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.5) 0%,
      rgba(255, 255, 255, 0.1) 100%
    );
    border-radius: var(--border-radius) var(--border-radius) 0 0;
    pointer-events: none;
  }

  .reflex-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.6) 50%,
      transparent 100%
    );
    transform: skewX(-25deg);
    transition: left 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
  }

  .liquid-button:hover .reflex-shine {
    left: 100%;
  }

  .liquid-waves {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  .wave {
    position: absolute;
    width: 200%;
    height: 200%;
    left: -50%;
    top: -50%;
    border-radius: 45%;
    animation-play-state: paused;
  }

  .wave-1 {
    background: radial-gradient(
      ellipse at center,
      rgba(255, 255, 255, 0.4) 0%,
      transparent 70%
    );
    animation: wave-rotate 8s linear infinite;
    filter: blur(0.3em);
  }

  .wave-2 {
    background: radial-gradient(
      ellipse at center,
      rgba(200, 200, 220, 0.3) 0%,
      transparent 70%
    );
    animation: wave-rotate 12s linear infinite reverse;
    filter: blur(0.4em);
  }

  .wave-3 {
    background: radial-gradient(
      ellipse at center,
      rgba(220, 220, 220, 0.2) 0%,
      transparent 70%
    );
    animation: wave-rotate 15s linear infinite;
    filter: blur(0.5em);
  }

  @keyframes wave-rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .liquid-button:hover .liquid-waves {
    opacity: 1;
  }

  .liquid-button:hover .wave {
    animation-play-state: running;
  }

  .bubble-system {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .bubble {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(
      circle at 30% 30%,
      rgba(255, 255, 255, 0.8),
      rgba(255, 255, 255, 0.3)
    );
    opacity: 0;
    animation: bubble-rise var(--duration, 3s) ease-in-out infinite
      var(--delay, 0s);
    animation-play-state: paused;
  }

  .bubble-1 {
    width: 0.4em;
    height: 0.4em;
    left: 15%;
    --duration: 3s;
    --delay: 0s;
  }
  .bubble-2 {
    width: 0.3em;
    height: 0.3em;
    left: 25%;
    --duration: 4s;
    --delay: 0.5s;
  }
  .bubble-3 {
    width: 0.5em;
    height: 0.5em;
    left: 35%;
    --duration: 3.5s;
    --delay: 1s;
  }
  .bubble-4 {
    width: 0.25em;
    height: 0.25em;
    left: 50%;
    --duration: 4.5s;
    --delay: 1.5s;
  }
  .bubble-5 {
    width: 0.35em;
    height: 0.35em;
    left: 65%;
    --duration: 3.8s;
    --delay: 2s;
  }
  .bubble-6 {
    width: 0.3em;
    height: 0.3em;
    left: 80%;
    --duration: 4.2s;
    --delay: 2.5s;
  }

  @keyframes bubble-rise {
    0% {
      bottom: -0.5em;
      opacity: 0;
      transform: translateX(0) scale(0.5);
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      bottom: 4em;
      opacity: 0;
      transform: translateX(0.5em) scale(1);
    }
  }

  .liquid-button:hover .bubble {
    animation-play-state: running;
  }

  .text-content {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .text-initial,
  .text-confirmed {
    position: absolute;
    font-weight: 600;
    font-size: 1.4em;
    left: 94px;
    color: var(--text-color);
    text-shadow: 0 0.1em 0.3em rgba(255, 255, 255, 0.8);
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .text-confirmed {
    opacity: 0;
    transform: translateY(1em) scale(0.9);
    color: var(--success-color);
  }

  .char {
    display: inline-block;
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    transition-delay: calc(var(--i) * 0.05s);
  }

  .liquid-button:hover .text-initial .char {
    transform: translateY(-0.2em);
    animation: char-celebrate 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: calc(var(--i) * 0.08s);
  }

  .swipe-handle {
    position: absolute;
    left: 0.4em;
    top: 50%;
    transform: translateY(-50%);
    width: var(--handle-size);
    height: var(--handle-size);
    background: var(--handle-color);
    border-radius: 50%;
    box-shadow:
      0 0.3em 1em rgba(0, 0, 0, 0.2),
      inset 0 0.1em 0.3em rgba(255, 255, 255, 0.8),
      inset 0 -0.1em 0.2em rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;

    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .handle-glow {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(100, 110, 200, 0.4),
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .icon-lock,
  .icon-unlock {
    position: absolute;
    width: 1.8em;
    height: 1.8em;
    color: var(--primary-color);
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .icon-lock {
    opacity: 1;
    transform: scale(1);
  }

  .icon-unlock {
    opacity: 0;
    transform: scale(0.8);
  }

  .liquid-button:hover .handle-glow {
    opacity: 1;
  }

  .liquid-button:hover .swipe-handle {
    transform: translateY(-50%) scale(1.05);
  }

  .liquid-button:active .swipe-handle {
    transform: translateY(-50%) scale(0.95);
  }

  .particle-burst {
    position: absolute;
    right: var(--handle-size);
    top: 50%;
    transform: translateY(-50%);
    width: 2em;
    height: 2em;
    pointer-events: none;
  }

  .particle {
    position: absolute;
    width: 0.2em;
    height: 0.2em;
    background: var(--success-color);
    border-radius: 50%;
    opacity: 0;
  }

  .particle-1 {
    top: 0.2em;
    left: 0.5em;
  }
  .particle-2 {
    top: 0.8em;
    left: 0.2em;
  }
  .particle-3 {
    top: 1.2em;
    left: 0.9em;
  }
  .particle-4 {
    top: 0.4em;
    left: 1.1em;
  }
  .particle-5 {
    top: 1em;
    left: 1.4em;
  }
  .particle-6 {
    top: 0.1em;
    left: 0.8em;
  }
  .particle-7 {
    top: 1.4em;
    left: 0.6em;
  }
  .particle-8 {
    top: 0.6em;
    left: 0.1em;
  }

  .ripple-effect {
    position: absolute;
    right: 1.4em;
    top: 50%;
    transform: translateY(-50%);
    width: 2em;
    height: 2em;
    pointer-events: none;
  }

  .ripple {
    position: absolute;
    inset: 0;
    border: 0.1em solid var(--success-color);
    border-radius: 50%;
    opacity: 0;
    transform: scale(0);
  }

  .liquid-input:checked + .liquid-button .swipe-handle {
    transform: translateY(-50%) translateX(var(--travel-distance));
    background: linear-gradient(135deg, var(--success-color), #32cdc0);
  }

  .liquid-input:checked + .liquid-button .icon-lock {
    opacity: 0;
    transform: scale(0.8);
  }

  .liquid-input:checked + .liquid-button .icon-unlock {
    opacity: 1;
    transform: scale(1.1);
    color: #fff;
  }

  .liquid-input:checked + .liquid-button .text-initial {
    opacity: 0;
    transform: translateY(-1em) scale(1.1);
  }

  .liquid-input:checked + .liquid-button .text-confirmed {
    opacity: 1;
    transform: translateY(0) scale(1);

    color: #ffffff;
    text-shadow: 0 0.1em 0.4em rgba(0, 0, 0, 0.25);
  }

  .liquid-input:checked + .liquid-button .text-confirmed .char {
    animation: char-celebrate 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: calc(var(--i) * 0.08s);
  }

  @keyframes char-celebrate {
    0% {
      transform: translateY(1em) rotate(-10deg) scale(0.8);
      opacity: 0;
    }
    50% {
      transform: translateY(-0.3em) rotate(5deg) scale(1.1);
    }
    100% {
      transform: translateY(0) rotate(0deg) scale(1);
      opacity: 1;
    }
  }

  .liquid-input:checked + .liquid-button .particle {
    animation: particle-burst 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: calc(var(--i, 0) * 0.1s);
  }

  @keyframes particle-burst {
    0% {
      opacity: 1;
      transform: translate(0, 0) scale(0);
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translate(var(--dx, 1em), var(--dy, -1em)) scale(1.5);
    }
  }

  .particle-1 {
    --dx: 1.5em;
    --dy: -0.8em;
    --i: 1;
  }
  .particle-2 {
    --dx: 0.8em;
    --dy: 1.2em;
    --i: 2;
  }
  .particle-3 {
    --dx: -0.5em;
    --dy: 1.5em;
    --i: 3;
  }
  .particle-4 {
    --dx: 1.8em;
    --dy: -1.2em;
    --i: 4;
  }
  .particle-5 {
    --dx: -1.2em;
    --dy: -0.6em;
    --i: 5;
  }
  .particle-6 {
    --dx: 1em;
    --dy: -1.8em;
    --i: 6;
  }
  .particle-7 {
    --dx: -0.8em;
    --dy: 1em;
    --i: 7;
  }
  .particle-8 {
    --dx: 1.3em;
    --dy: 0.8em;
    --i: 8;
  }

  .liquid-input:checked + .liquid-button .ripple {
    animation: ripple-expand 1.2s ease-out forwards;
  }

  .ripple-1 {
    animation-delay: 0.1s;
  }
  .ripple-2 {
    animation-delay: 0.3s;
  }
  .ripple-3 {
    animation-delay: 0.5s;
  }

  @keyframes ripple-expand {
    0% {
      opacity: 1;
      transform: scale(0);
    }
    50% {
      opacity: 0.8;
    }
    100% {
      opacity: 0;
      transform: scale(2);
    }
  }

  .liquid-input:checked + .liquid-button .button-bg {
    background: linear-gradient(135deg, var(--success-color) 0%, #32cdc3 100%);
    box-shadow:
      0 0.5em 2em rgba(0, 218, 242, 0.4),
      inset 0 0.1em 0.3em rgba(255, 255, 255, 0.5),
      inset 0 -0.1em 0.2em rgba(0, 0, 0, 0.1);
  }

  .liquid-button:focus-visible {
    outline: 0.15em solid #718096;
    outline-offset: 0.2em;
  }

  @media (pointer: coarse) {
    .liquid-button:hover .reflex-shine {
      left: -100%;
    }

    .liquid-button:hover .liquid-waves {
      opacity: 0.5;
    }

    .liquid-button:hover {
      transform: none;
    }
  }`;



export default LiquidSwipeButton;
