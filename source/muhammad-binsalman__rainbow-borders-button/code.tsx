import React from 'react';

export const Button = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <button className="rainbow-border relative w-[140px] h-10 flex items-center justify-center gap-2.5 px-4 bg-black rounded-xl border-none text-white cursor-pointer font-black transition-all duration-200">
        Button
      </button>
      
      <style jsx>{`
        .rainbow-border::before,
        .rainbow-border::after {
          content: '';
          position: absolute;
          left: -2px;
          top: -2px;
          border-radius: 12px;
          background: linear-gradient(45deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000);
          background-size: 400%;
          width: calc(100% + 4px);
          height: calc(100% + 4px);
          z-index: -1;
          animation: rainbow 20s linear infinite;
        }
        .rainbow-border::after {
          filter: blur(50px);
        }
        @keyframes rainbow {
          0% { background-position: 0 0; }
          50% { background-position: 400% 0; }
          100% { background-position: 0 0; }
        }
      `}</style>
    </div>
  );
};