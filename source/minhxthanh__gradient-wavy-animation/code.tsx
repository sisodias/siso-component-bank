import React from 'react';

const WavyStyles = () => (
  <style>
    {`
      .wavy {
        position: relative;
        width: 150px; 
        height: 40px;
      }

      .wavy span {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 100px;
        letter-spacing: 5px;
        font-family: monospace;
        font-weight: 800; /* Updated font weight */
        white-space: nowrap;
      }

      /* This span creates the outline effect */
      .wavy span:nth-child(1) {
        color: transparent;
        -webkit-text-stroke: 0.3px rgb(128, 198, 255);
      }

      /* This span has the gradient color and the animation */
      .wavy span:nth-child(2) {
        /* Use a gradient background clipped to the text */
        background: linear-gradient(90deg, #80c6ff, #ff80c6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: uiverse-animation 3s ease-in-out infinite;
      }

      @keyframes uiverse-animation {
        0%, 100% {
          clip-path: polygon(0% 45%, 15% 44%, 32% 50%, 
          54% 60%, 70% 61%, 84% 59%, 100% 52%, 100% 100%, 0% 100%);
        }

        50% {
          clip-path: polygon(0% 60%, 16% 65%, 34% 66%, 
          51% 62%, 67% 50%, 84% 45%, 100% 46%, 100% 100%, 0% 100%);
        }
      }
    `}
  </style>
);

const WavyAnimation = () => {
  return (
    <>
      <WavyStyles />
      <div className="wavy">
        <span>21ST.DEV</span>
        <span>21ST.DEV</span>
      </div>
    </>
  );
};

export default WavyAnimation;