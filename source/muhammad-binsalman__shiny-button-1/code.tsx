import React, { useId } from 'react';

const GlowButton = ({ children = 'Register' }) => {
  const id = useId().replace(/:/g, '');
  const filters = {
    unopaq: `unopaq-${id}`,
    unopaq2: `unopaq2-${id}`,
    unopaq3: `unopaq3-${id}`,
  };

  return (
    <div className="relative mx-8 group">
      {/* SVG Filters */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter width="300%" x="-100%" height="300%" y="-100%" id={filters.unopaq}>
          <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 9 0" />
        </filter>
        <filter width="300%" x="-100%" height="300%" y="-100%" id={filters.unopaq2}>
          <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 3 0" />
        </filter>
        <filter width="300%" x="-100%" height="300%" y="-100%" id={filters.unopaq3}>
          <feColorMatrix values="1 0 0 0.2 0 0 1 0 0.2 0 0 0 1 0.2 0 0 0 0 2 0" />
        </filter>
      </svg>

      {/* Hidden Button */}
      <button className="absolute w-[120px] h-[60px] z-20 outline-none border-none rounded-[17px] cursor-pointer opacity-0" />

      {/* Backdrop */}
      <div className="absolute dark:inset-[-9900%] dark:bg-[radial-gradient(circle_at_50%_50%,#0000_0,#0000_20%,#111111aa_50%)] bg-[length:3px_3px] -z-10" />

      {/* Button Container */}
      <div className="relative">
        {/* Outer Glow Layer */}
        <div 
          className="absolute inset-0 -z-20 opacity-50 overflow-hidden transition-opacity duration-300
                     group-hover:opacity-75 group-active:opacity-100"
          style={{ filter: `blur(2em) url(#${filters.unopaq})` }}
        >
          <div 
            className="absolute inset-[-150%] group-hover:animate-[speen_8s_cubic-bezier(0.56,0.15,0.28,0.86)_infinite,woah_4s_infinite]"
            style={{ 
              background: 'linear-gradient(90deg, #f50 30%, #0000 50%, #05f 70%)',
            }}
          />
        </div>

        {/* Middle Glow Layer */}
        <div 
          className="absolute inset-[-0.125em] -z-20 opacity-50 overflow-hidden transition-opacity duration-300
                     group-hover:opacity-75 group-active:opacity-100"
          style={{ 
            filter: `blur(0.25em) url(#${filters.unopaq2})`,
            borderRadius: '0.75em'
          }}
        >
          <div 
            className="absolute inset-[-150%] group-hover:animate-[speen_8s_cubic-bezier(0.56,0.15,0.28,0.86)_infinite,woah_4s_infinite]"
            style={{ 
              background: 'linear-gradient(90deg, #f95 20%, #0000 45% 55%, #59f 80%)',
            }}
          />
        </div>

        {/* Button Border */}
        <div 
          className="p-0.5 bg-[#0005] rounded-[inherit]"
          style={{ 
            clipPath: 'path("M 90 0 C 121 0 126 5 126 33 C 126 61 121 66 90 66 L 33 66 C 5 66 0 61 0 33 C 0 5 5 0 33 0 Z")' 
          }}
        >
          <div className="relative">
            {/* Inner Glow Layer */}
            <div 
              className="absolute inset-[-2px] -z-10 opacity-50 overflow-hidden transition-opacity duration-300
                         group-hover:opacity-75 group-active:opacity-100"
              style={{ 
                filter: `blur(2px) url(#${filters.unopaq3})`,
                borderRadius: 'inherit'
              }}
            >
              <div 
                className="absolute inset-[-150%] group-hover:animate-[speen_8s_cubic-bezier(0.56,0.15,0.28,0.86)_infinite,woah_4s_infinite]"
                style={{ 
                  background: 'linear-gradient(90deg, #fc9 30%, #0000 45% 55%, #9cf 70%)',
                }}
              />
            </div>
            
            {/* Button Surface */}
            <div 
              className="flex flex-col items-center justify-center w-[120px] h-[60px] bg-[#111215] text-white overflow-hidden"
              style={{ 
                clipPath: 'path("M 90 0 C 115 0 120 5 120 30 C 120 55 115 60 90 60 L 30 60 C 5 60 0 55 0 30 C 0 5 5 0 30 0 Z")',
                borderRadius: '0.875em'
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes speen {
          0% { transform: rotate(10deg); }
          50% { transform: rotate(190deg); }
          100% { transform: rotate(370deg); }
        }
        @keyframes woah {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(0.75); }
        }
      `}</style>
    </div>
  );
};

export {GlowButton};