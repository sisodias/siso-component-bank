import React, { useState } from 'react';

const AnimatedButton = ({ children = "BEGIN", disabled = false, onClick, ...props }) => {
  const [ripple, setRipple] = useState(false);

  const handleClick = (e) => {
    if (!disabled) {
      setRipple(true);
      setTimeout(() => setRipple(false), 700);
      if (onClick) onClick(e);
    }
  };

  return (
    <button
      className={`
        relative px-9 py-4 text-lg font-bold uppercase tracking-wider
        text-gray-900 bg-gradient-to-br from-lime-400 to-lime-300
        border-0 rounded-2xl cursor-pointer overflow-hidden
        transform transition-all duration-400 ease-out
        shadow-lg shadow-lime-400/40 outline-none z-10
        hover:translate-y-[-6px] hover:scale-105 hover:rotate-x-1
        hover:bg-gradient-to-br hover:from-lime-300 hover:to-lime-200
        hover:shadow-xl hover:shadow-lime-400/50
        active:translate-y-0.5 active:scale-95 active:rotate-x-[-1]
        active:bg-gradient-to-br active:from-lime-600 active:to-lime-500
        active:shadow-md active:shadow-green-400/20
        focus:outline-lime-300 focus:outline-offset-2 focus:outline-4
        focus:shadow-lg focus:shadow-lime-400/40 focus:scale-102 focus:rotate-x-0.5
        disabled:bg-gradient-to-br disabled:from-gray-600 disabled:to-gray-800
        disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none
        disabled:transform-none
        font-sans animate-bounce-in
      `}
      disabled={disabled}
      onClick={handleClick}
      {...props}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '200px',
        boxShadow: disabled ? 'none' : `
          0 8px 24px rgba(187, 255, 0, 0.385),
          0 4px 12px rgba(221, 255, 0, 0.296),
          inset 0 0 10px rgba(255, 255, 255, 0.2)
        `,
        animation: 'bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      }}
    >
      {/* Shimmer effect */}
      <div className={`
        absolute top-0 left-[-100%] w-1/2 h-full
        bg-gradient-to-r from-transparent via-white/40 to-transparent
        transform skew-x-[-20deg] transition-all duration-600 ease-out z-10
        group-hover:left-full hover:left-full
      `} 
      style={{
        transform: 'skewX(-20deg)',
        transition: 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      />

      {/* Glow pulse effect */}
      <div className={`
        absolute top-0 left-0 w-full h-full rounded-2xl
        opacity-0 transform scale-150 transition-all duration-500 ease-out
        hover:opacity-100 hover:scale-100
      `}
      style={{
        background: 'radial-gradient(circle, rgba(229, 255, 0, 0.3) 10%, transparent 10.01%)',
        animation: 'pulse 1.8s infinite cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      />

      {/* Ripple effect */}
      {ripple && (
        <div className={`
          absolute top-1/2 left-1/2 w-0 h-0 bg-white/40 rounded-full
          transform translate-x-[-50%] translate-y-[-50%] transition-all duration-700 ease-out
          opacity-0 z-0
        `}
        style={{
          width: ripple ? '400px' : '0',
          height: ripple ? '400px' : '0',
          opacity: ripple ? 1 : 0
        }}
        />
      )}

      {/* Button text */}
      <span className={`
        relative z-20 inline-block transition-all duration-500 ease-out
        hover:scale-110 hover:translate-y-[-2px] hover:text-black
        active:scale-90 active:translate-y-0.5 active:text-gray-800
        focus:scale-105
      `}>
        {children}
      </span>

      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes bounceIn {
          0% {
            transform: perspective(200px) scale(0.7) rotateX(-20deg);
            opacity: 0;
          }
          50% {
            transform: perspective(200px) scale(1.1) rotateX(5deg);
            opacity: 1;
          }
          100% {
            transform: perspective(200px) scale(1) rotateX(0);
            opacity: 1;
          }
        }

        button:hover .shimmer {
          left: 100%;
        }

        button:hover .glow {
          opacity: 1;
          transform: scale(1);
        }
      `}</style>
    </button>
  );
};

// Demo component to showcase the button
const ButtonDemo = () => {
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="min-h-screen w-full bg-stone-900 flex flex-col items-center justify-center space-y-8">
        
        <div className="flex gap-7 items-center justify-center">
          <AnimatedButton onClick={() => setClickCount(prev => prev + 1)}>
            Increase
          </AnimatedButton>
          
        <p className="text-white text-2xl font-bold my-auto"> {clickCount} 
        </p>
          <AnimatedButton onClick={() => setClickCount(prev => prev - 1)}>
            Decrease
          </AnimatedButton>
        </div>
    </div>
  );
};

export {ButtonDemo};