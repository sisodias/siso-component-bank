import React from 'react';

// RetroButton Component
function RetroButton({ children, variant = "default", className = "", ...props }) {
  const [isPressed, setIsPressed] = React.useState(false);
  
  const variantStyles = {
    default: {
      textColor: 'text-white',
      bgColor: 'rgb(59, 130, 246)',
      bgColorActive: 'rgb(37, 99, 235)',
      shadowLight: 'rgb(147, 197, 253)',
      shadowDark: 'rgb(29, 78, 216)',
    },
    darkGray: {
      textColor: 'text-white',
      bgColor: 'rgb(168, 85, 247)',
      bgColorActive: 'rgb(147, 51, 234)',
      shadowLight: 'rgb(216, 180, 254)',
      shadowDark: 'rgb(126, 34, 206)',
    },
    white: {
      textColor: 'text-white',
      bgColor: 'rgb(34, 197, 94)',
      bgColorActive: 'rgb(22, 163, 74)',
      shadowLight: 'rgb(134, 239, 172)',
      shadowDark: 'rgb(21, 128, 61)',
    },
    lightGray: {
      textColor: 'text-white',
      bgColor: 'rgb(236, 72, 153)',
      bgColorActive: 'rgb(219, 39, 119)',
      shadowLight: 'rgb(251, 207, 232)',
      shadowDark: 'rgb(190, 24, 93)',
    },
    gray: {
      textColor: 'text-white',
      bgColor: 'rgb(234, 179, 8)',
      bgColorActive: 'rgb(202, 138, 4)',
      shadowLight: 'rgb(253, 224, 71)',
      shadowDark: 'rgb(161, 98, 7)',
    },
  };

  const style = variantStyles[variant] || variantStyles.default;
  const currentBg = isPressed ? style.bgColorActive : style.bgColor;

  return (
    <button
      className={`relative inline-flex items-center justify-center w-24 border-2 border-transparent bg-black ${className}`}
      style={{
        borderRadius: '2px',
        boxShadow: '1px 1px 1px rgba(255,255,255,0.6)',
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      {...props}
    >
      <span
        className={`inline-block w-full px-3 py-2 uppercase tracking-wider text-center text-sm font-bold transition-all duration-200 ${style.textColor}`}
        style={{
          borderRadius: '9px',
          backgroundColor: currentBg,
          boxShadow: isPressed
            ? `inset 0 0 4px #000, inset 1px 1px 1px transparent, inset -1px -1px 1px transparent, 2px 2px 4px transparent`
            : `inset 1px 1px 1px ${style.shadowLight}, inset -1px -1px 1px ${style.shadowDark}, 2px 2px 4px #000`,
          transform: isPressed ? 'scale(0.98)' : 'scale(1)',
        }}
      >
        {children}
      </span>
    </button>
  );
}

// Demo Component
export default function RetroButtonDemo() {
  const [isDark, setIsDark] = React.useState(true);

  return (
    <div className={`w-full min-h-screen flex items-center justify-center transition-colors duration-300 relative overflow-hidden ${
      isDark ? 'bg-neutral-900' : 'bg-neutral-300'
    }`}>
      {/* Orthogonal Grid Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: isDark 
            ? 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)'
            : 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10">
        {/* Theme Toggle Button */}
        <button
          onClick={() => setIsDark(!isDark)}
          className={`absolute -top-16 right-0 px-4 py-2 rounded-lg font-medium transition-colors ${
            isDark 
              ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
              : 'bg-white text-gray-800 hover:bg-gray-200 border border-gray-300'
          }`}
        >
          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>

        {/* Buttons Container */}
        <div className="flex flex-wrap justify-center items-center max-w-[26em] gap-4">
          <RetroButton>Record</RetroButton>
          <RetroButton variant="darkGray">Sound</RetroButton>
          <RetroButton variant="white">Erase</RetroButton>
          <RetroButton variant="lightGray">Shift</RetroButton>
          <RetroButton variant="gray">Play</RetroButton>
        </div>
      </div>
    </div>
  );
}