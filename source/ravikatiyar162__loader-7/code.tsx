import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="campfire-loader">
        <div className="fire-container">
          <div className="flame flame-main" />
          <div className="flame flame-left" />
          <div className="flame flame-right" />
        </div>
        <div className="logs">
          <div className="log" />
          <div className="log" />
        </div>
        <div className="embers">
          <div style={{delay: 0}} className="ember" />
          <div style={{delay: '0.3'}} className="ember" />
          <div style={{delay: '0.6'}} className="ember" />
        </div>
        <div className="sparkles" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .campfire-loader {
    position: relative;
    width: 6em;
    height: 6em;
    margin: 2em auto;
  }

  .fire-container {
    position: absolute;
    bottom: 2.5em;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
  }

  .flame {
    position: absolute;
    background: linear-gradient(180deg, #ff6b00 0%, #ffd700 70%);
    border-radius: 50%;
    animation: flicker 0.8s ease-in-out infinite alternate;
  }

  .flame-main {
    width: 1.8em;
    height: 2.5em;
    clip-path: polygon(50% 0, 100% 100%, 0 100%);
  }

  .flame-left,
  .flame-right {
    width: 1.2em;
    height: 1.8em;
    top: 0.5em;
  }

  .flame-left {
    left: -1.2em;
    clip-path: polygon(70% 0, 100% 100%, 0 100%);
    animation-delay: 0.2s;
  }

  .flame-right {
    right: -1.2em;
    clip-path: polygon(30% 0, 100% 100%, 0 100%);
    animation-delay: 0.4s;
  }

  .logs {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 0.8em;
  }

  .log {
    width: 1.5em;
    height: 0.5em;
    background: linear-gradient(45deg, #6b4226, #8b4513);
    border-radius: 0.2em;
    transform: rotate(-15deg);
  }

  .log:last-child {
    transform: rotate(15deg);
  }

  .embers {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .ember {
    position: absolute;
    width: 0.3em;
    height: 0.3em;
    background: #ff4500;
    border-radius: 50%;
    animation: float 1.5s ease-in infinite;
    animation-delay: calc(var(--delay) * 1s);
    bottom: 2.8em;
    left: 50%;
  }

  .sparkles {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle,
      rgba(255, 215, 0, 0.2) 0%,
      transparent 60%
    );
    animation: glow 1.5s ease-in-out infinite;
  }

  @keyframes flicker {
    0% {
      transform: scaleY(1) skew(2deg);
      opacity: 0.9;
    }
    100% {
      transform: scaleY(1.2) skew(-3deg);
      opacity: 1;
    }
  }

  @keyframes float {
    0% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translateY(-3em) translateX(calc(var(--delay) * 1em)) scale(0.2);
      opacity: 0;
    }
  }

  @keyframes glow {
    0%,
    100% {
      opacity: 0.3;
    }
    50% {
      opacity: 0.6;
    }
  }`;

export default Loader;
