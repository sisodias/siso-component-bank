import React, { useState } from 'react';

const Component = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  // Sparkle configuration data - enhanced with more particles
  const sparkles = [
    { width: 2, deg: 25, duration: 11 },
    { width: 1, deg: 100, duration: 18 },
    { width: 1, deg: 280, duration: 5 },
    { width: 2, deg: 200, duration: 3 },
    { width: 2, deg: 30, duration: 20 },
    { width: 2, deg: 300, duration: 9 },
    { width: 1, deg: 250, duration: 4 },
    { width: 2, deg: 210, duration: 8 },
    { width: 2, deg: 100, duration: 9 },
    { width: 1, deg: 15, duration: 13 },
    { width: 1, deg: 75, duration: 18 },
    { width: 2, deg: 65, duration: 6 },
    { width: 2, deg: 50, duration: 7 },
    { width: 1, deg: 320, duration: 5 },
    { width: 1, deg: 220, duration: 5 },
    { width: 1, deg: 215, duration: 2 },
    { width: 2, deg: 135, duration: 9 },
    { width: 2, deg: 45, duration: 4 },
    { width: 1, deg: 78, duration: 16 },
    { width: 1, deg: 89, duration: 19 },
    { width: 2, deg: 65, duration: 14 },
    { width: 2, deg: 97, duration: 1 },
    { width: 1, deg: 174, duration: 10 },
    { width: 1, deg: 236, duration: 5 },
    // Additional sparkles for more magic
    { width: 1, deg: 120, duration: 12 },
    { width: 2, deg: 150, duration: 6 },
    { width: 1, deg: 180, duration: 15 },
    { width: 2, deg: 240, duration: 8 },
    { width: 1, deg: 270, duration: 11 },
    { width: 2, deg: 330, duration: 4 },
    { width: 1, deg: 40, duration: 17 },
    { width: 2, deg: 80, duration: 7 },
    { width: 1, deg: 160, duration: 13 },
    { width: 2, deg: 190, duration: 9 },
    { width: 1, deg: 260, duration: 5 },
    { width: 2, deg: 310, duration: 14 },
    { width: 1, deg: 35, duration: 3 },
    { width: 2, deg: 125, duration: 16 },
    { width: 1, deg: 205, duration: 12 },
    { width: 2, deg: 285, duration: 6 },
    { width: 1, deg: 55, duration: 19 },
    { width: 2, deg: 110, duration: 8 },
    { width: 1, deg: 165, duration: 11 },
    { width: 2, deg: 225, duration: 4 },
    { width: 1, deg: 295, duration: 15 },
    { width: 2, deg: 345, duration: 7 },
    { width: 1, deg: 20, duration: 10 },
    { width: 2, deg: 70, duration: 13 },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="relative z-10 h-12 rounded-full w-fit">
        <input
          type="checkbox"
          id="toggle"
          checked={isChecked}
          onChange={handleToggle}
          className="hidden"
        />
        <label
          htmlFor="toggle"
          className={`cursor-pointer relative inline-block p-2 h-full rounded-full transition-all duration-300 ease-in-out ${
            isChecked
              ? 'bg-transparent border border-teal-700'
              : 'bg-gray-800 border border-gray-500'
          }`}
          style={{
            width: 'calc((50px + 5px) * 2)',
            borderBottom: '0',
            boxSizing: 'content-box',
          }}
        >
          {/* Before pseudo-element background */}
          <div
            className={`absolute -z-10 border border-gray-500 rounded-full transition-all duration-300 ease-in-out ${
              isChecked ? 'shadow-lg' : ''
            }`}
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'calc(100% + 1.5rem)',
              height: 'calc(100% + 1.5rem)',
              backgroundColor: '#414344',
              borderBottom: '0',
              boxShadow: isChecked ? '0 1rem 2.5rem -2rem #0080ff' : 'none',
            }}
          />
          
          {/* After pseudo-element radial gradient */}
          <div
            className="absolute -z-10 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle at 50% -100%, rgb(58, 155, 252) 0%, rgba(12, 12, 12, 1) 80%)',
            }}
          />

          {/* Icon container */}
          <div
            className={`relative flex justify-center items-center w-12 h-12 border rounded-full transition-transform duration-300 ease-in-out ${
              isChecked
                ? 'border-blue-400 overflow-visible'
                : 'border-gray-400 overflow-hidden'
            }`}
            style={{
              background: isChecked
                ? 'radial-gradient(circle at 50% 0%, #045ab1 0%, #54a8fc 100%)'
                : 'radial-gradient(circle at 50% 0%, #666666 0%, #414344 100%)',
              borderBottom: '0',
              boxShadow: 'inset 0 -0.15rem 0.15rem #54a8fc, inset 0 0 0.5rem 0.75rem var(--second)',
              transform: isChecked ? 'translateX(calc((5px * 2) + 100%)) rotate(-225deg)' : 'none',
            }}
          >
            {/* Sparkles */}
            {sparkles.map((sparkle, index) => (
              <span
                key={index}
                className={`absolute block rounded-full transition-all duration-300 ${
                  isChecked ? 'sparkle-glow' : ''
                }`}
                style={{
                  top: '50%',
                  left: '50%',
                  width: `${sparkle.width}px`,
                  aspectRatio: '1',
                  transformOrigin: '50% 50%',
                  transform: `translate(-50%, -50%) rotate(${sparkle.deg}deg)`,
                  backgroundColor: isChecked ? '#acacac' : '#d9d9d9',
                  zIndex: isChecked ? '-10' : '0',
                  animation: isChecked
                    ? `sparkle-checked ${100 / sparkle.duration}s linear ${10 / sparkle.duration}s infinite`
                    : `sparkle-normal ${100 / sparkle.duration}s linear ${0 / sparkle.duration}s infinite`,
                  animationDelay: `${index * 0.1}s`, // Stagger the animations
                }}
              />
            ))}

            {/* Star icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 30 30"
              className="w-5 h-5 fill-gray-300"
            >
              <path d="M0.96233 28.61C1.36043 29.0081 1.96007 29.1255 2.47555 28.8971L10.4256 25.3552C13.2236 24.11 16.4254 24.1425 19.2107 25.4401L27.4152 29.2747C27.476 29.3044 27.5418 29.3023 27.6047 29.32C27.6563 29.3348 27.7079 29.3497 27.761 29.3574C27.843 29.3687 27.9194 29.3758 28 29.3688C28.1273 29.3617 28.2531 29.3405 28.3726 29.2945C28.4447 29.262 28.5162 29.2287 28.5749 29.1842C28.6399 29.1446 28.6993 29.0994 28.7509 29.0477L28.9008 28.8582C28.9468 28.7995 28.9793 28.7274 29.0112 28.656C29.0599 28.5322 29.0811 28.4036 29.0882 28.2734C29.0939 28.1957 29.0868 28.1207 29.0769 28.0415C29.0705 27.9955 29.0585 27.9524 29.0472 27.9072C29.0295 27.8343 29.0302 27.7601 28.9984 27.6901L25.1638 19.4855C23.8592 16.7073 23.8273 13.5048 25.0726 10.7068L28.6145 2.75679C28.8429 2.24131 28.7318 1.63531 28.3337 1.2372C27.9165 0.820011 27.271 0.721743 26.7491 0.9961L19.8357 4.59596C16.8418 6.15442 13.2879 6.18696 10.2615 4.70062L1.80308 0.520214C1.7055 0.474959 1.60722 0.441742 1.50964 0.421943C1.44459 0.409215 1.37882 0.395769 1.3074 0.402133C1.14406 0.395769 0.981436 0.428275 0.818095 0.499692C0.77284 0.519491 0.719805 0.545671 0.67455 0.578198C0.596061 0.617088 0.524653 0.675786 0.4596 0.74084C0.394546 0.805894 0.335843 0.877306 0.296245 0.956502C0.263718 1.00176 0.237561 1.05477 0.217762 1.10003C0.152708 1.24286 0.126545 1.40058 0.120181 1.54978C0.120181 1.61483 0.126527 1.6735 0.132891 1.73219C0.15269 1.85664 0.178881 1.97332 0.237571 2.08434L4.41798 10.5427C5.91139 13.5621 5.8725 17.1238 4.3204 20.1099L0.720514 27.0233C0.440499 27.5536 0.545137 28.1928 0.96233 28.61Z" />
            </svg>
          </div>
        </label>

        {/* Custom CSS animations */}
        <style jsx>{`
          @keyframes sparkle-normal {
            0% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.3);
            }
            10% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
            90% {
              opacity: 1;
            }
            100% {
              opacity: 0;
              width: calc(var(--width) * 0.5px);
              transform: translate(2000%, -50%) scale(0.3);
            }
          }
          
          @keyframes sparkle-checked {
            0% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.2);
            }
            5% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1.2);
            }
            15% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
            85% {
              opacity: 0.8;
            }
            100% {
              opacity: 0;
              width: calc(var(--width) * 1px);
              transform: translate(5000%, -50%) scale(0.2);
            }
          }
          
          /* Additional glow effect for checked state */
          .sparkle-glow {
            animation: glow 2s ease-in-out infinite alternate;
          }
          
          @keyframes glow {
            from {
              filter: drop-shadow(0 0 2px #54a8fc);
            }
            to {
              filter: drop-shadow(0 0 8px #54a8fc) drop-shadow(0 0 12px #54a8fc);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export {Component};