import React, { useState } from 'react';

const LuxuryButton = ({ text = "Free Trial", onClick }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e) => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
    if (onClick) onClick(e);
  };

  return (
    <>
      <style>
        {`
          .luxury-btn {
            position: relative;
            min-width: 200px;
            padding: 15px 30px;
            border: none;
            background: linear-gradient(135deg, #2a1a4a 0%, #4a2b8a 100%);
            color: #e0e0e0;
            cursor: pointer;
            overflow: hidden;
            transform: translateY(0);
            box-shadow: 0 4px 15px rgba(74, 43, 138, 0.2);
            transition:
              transform 0.2s,
              box-shadow 0.2s,
              background 0.3s;
            font-family: 'Georgia', serif;
          }

          .luxury-btn__text {
            position: relative;
            z-index: 2;
            letter-spacing: 2px;
            text-transform: uppercase;
            font-weight: 500;
          }

          .luxury-btn__border {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
          }

          .luxury-btn__border-path {
            stroke: #d4af37;
            stroke-width: 2;
            transition:
              stroke-dasharray 0.3s,
              stroke-dashoffset 0.3s;
            stroke-dasharray: 400;
            stroke-dashoffset: 400;
          }

          .luxury-btn:hover .luxury-btn__border-path {
            stroke-dashoffset: 0;
          }

          .luxury-btn__ornament-left,
          .luxury-btn__ornament-right {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 2;
            color: #d4af37;
            transition: transform 0.3s;
          }

          .luxury-btn__ornament-left {
            left: 15px;
          }

          .luxury-btn__ornament-right {
            right: 15px;
          }

          .luxury-btn:hover .luxury-btn__ornament-left {
            transform: translateY(-50%) rotate(-180deg);
          }

          .luxury-btn:hover .luxury-btn__ornament-right {
            transform: translateY(-50%) rotate(180deg);
          }

          .luxury-btn__shine {
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 3;
            animation: shine-effect 3s infinite;
          }

          @keyframes shine-effect {
            0% {
              transform: translateX(0%);
              opacity: 0;
            }
            10% {
              opacity: 0.5;
            }
            50% {
              transform: translateX(200%);
              opacity: 0.5;
            }
            100% {
              transform: translateX(200%);
              opacity: 0;
            }
          }

          .luxury-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(74, 43, 138, 0.3);
            background: linear-gradient(135deg, #321f57 0%, #5633a6 100%);
          }

          .luxury-btn:active {
            transform: translateY(1px);
            box-shadow: 0 2px 10px rgba(74, 43, 138, 0.1);
            background: linear-gradient(135deg, #231640 0%, #3d2475 100%);
          }
        `}
      </style>
      
      <button 
        className={`luxury-btn ${isClicked ? 'luxury-btn--clicked' : ''}`}
        onClick={handleClick}
      >
        <svg
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
          height="100%"
          width="100%"
          className="luxury-btn__border"
        >
          <path
            stroke="currentColor"
            fill="none"
            d="M5,20 Q50,5 95,20 Q95,50 95,80 Q50,95 5,80 Q5,50 5,20"
            className="luxury-btn__border-path"
          ></path>
        </svg>
        <svg
          viewBox="0 0 15 15"
          height="15"
          width="15"
          className="luxury-btn__ornament-left"
        >
          <path
            fill="none"
            stroke="currentColor"
            d="M7.5,1 L14,7.5 L7.5,14 L1,7.5 L7.5,1Z"
          ></path>
          <circle fill="currentColor" r="2" cy="7.5" cx="7.5"></circle>
        </svg>
        <span className="luxury-btn__text">{text}</span>
        <svg
          viewBox="0 0 15 15"
          height="15"
          width="15"
          className="luxury-btn__ornament-right"
        >
          <path
            fill="none"
            stroke="currentColor"
            d="M7.5,1 L14,7.5 L7.5,14 L1,7.5 L7.5,1Z"
          ></path>
          <circle fill="currentColor" r="2" cy="7.5" cx="7.5"></circle>
        </svg>
        <svg
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
          height="100%"
          width="100%"
          className="luxury-btn__shine"
        >
          <defs>
            <linearGradient y2="0%" x2="100%" y1="0%" x1="0%" id="shineGradient">
              <stop stopColor="transparent" offset="0%"></stop>
              <stop stopColor="rgba(255,255,255,0.2)" offset="50%"></stop>
              <stop stopColor="transparent" offset="100%"></stop>
            </linearGradient>
          </defs>
          <path fill="url(#shineGradient)" d="M0,0 L100,0 L100,100 L0,100Z"></path>
        </svg>
      </button>
    </>
  );
};

export {LuxuryButton};