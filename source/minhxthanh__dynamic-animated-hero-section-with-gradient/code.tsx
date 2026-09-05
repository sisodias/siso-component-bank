import React, { useEffect } from 'react';

const HeroSection = () => {
  useEffect(() => {
    // Calculate path lengths for accurate animations
    document.querySelectorAll('.animation-line').forEach(path => {
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}px`;
      path.style.strokeDashoffset = `${len}px`;
      
      // Trigger the animation after a short delay
      setTimeout(() => {
        path.style.transition = 'stroke-dashoffset 2s ease-in-out';
        path.style.strokeDashoffset = '0px';
      }, 500);
    });
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes patternScroll {
            0% { transform: translate(-5%, -5%); }
            100% { transform: translate(5%, 5%); }
          }
          
          .animate-fadeIn {
            animation: fadeIn 1s ease-out forwards;
          }
          
          .animate-patternScroll {
            animation: patternScroll 20s linear infinite;
          }
          
          .gradient-text {
            background: linear-gradient(270deg, #ff00cc, #3333ff, #00ffcc, #ff00cc);
            background-size: 600% 600%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradient 15s ease infinite;
          }
          
          .animation-line {
            fill: none;
            stroke: white;
            stroke-width: 2;
          }
          
          /* Pulse animation for the button */
          @keyframes pulse {
            0% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.3); }
            50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.5); }
            100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.3); }
          }
          
          .pulse-animation {
            animation: pulse 2s infinite;
          }
        `}
      </style>
      
      <div className="min-h-screen flex items-center justify-center bg-black text-white font-sans overflow-hidden relative">
        {/* Container */}
        <div className="container text-center z-10 relative p-10 animate-fadeIn">
          <h1 className="text-6xl leading-tight m-0 relative z-20">
            Ready to build<br />
            <span className="gradient-text inline-block relative z-10">the software of the future?</span>
          </h1>
          <button className="mt-10 px-10 py-4 bg-white text-black border-none rounded cursor-pointer text-xl transition-all duration-300 ease-in-out hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:translate-y-[-2px] shadow-[0_0_10px_rgba(255,255,255,0.2)] hover:scale-105 pulse-animation">
            Start building
          </button>
        </div>

        {/* Dynamic Lines */}
        <div className="line-group absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <svg className="line-wrapper absolute w-full h-full" viewBox="0 0 177 159" preserveAspectRatio="none">
            <path 
              id="main-line" 
              className="animation-line" 
              d="M176 1L53.5359 1C52.4313 1 51.5359 1.89543 51.5359 3L51.5359 56C51.5359 57.1046 50.6405 58 49.5359 58L0 58"
            />
          </svg>
          
          <svg className="line-wrapper absolute w-full h-full" viewBox="0 0 176 59" preserveAspectRatio="none">
            <path 
              className="animation-line" 
              d="M0 1L122.464 1C123.569 1 124.464 1.89543 124.464 3L124.464 56C124.464 57.1046 125.36 58 126.464 58L176 58"
            />
          </svg>
        </div>

        {/* Background Patterns */}
        <div className="pattern absolute w-[200%] h-[200%] bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)] animate-patternScroll" style={{ top: '-50%', left: '-50%' }}></div>
        <div className="pattern absolute w-[200%] h-[200%] bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)] animate-patternScroll" style={{ top: '50%', left: '50%' }}></div>
      </div>
    </>
  );
};

export default HeroSection;
