import React from 'react';

const StreamLinesBackground = () => {
  // --- Configuration ---
  const numLines = 50; // Adjust for more/less lines

  // --- Generate Lines ---
  // Creates an array of div elements, each representing a line with random properties.
  const lines = Array.from({ length: numLines }, (_, i) => {
    const degrees = Math.random() * 360; // Random angle for the line
    const delay = Math.random() * 5;     // Random delay for the animation start
    const duration = 3 + Math.random() * 3; // Random duration for the animation
    
    return (
      <div
        key={i}
        className="stream-line absolute w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_4px_white,0_0_10px_white]"
        style={{
          // CSS Custom Properties for animation
          '--degrees': `${degrees}deg`,
          '--delay': `${delay}s`,
          '--duration': `${duration}s`,
          '--tail-length': `${150 + Math.random() * 250}px`,
          // Assigning animation from the CSS below
          animation: `animate var(--duration) linear infinite`,
          animationDelay: `var(--delay)`,
        }}
      />
    );
  });

  return (
    // Main container: full screen, black background, and centers content.
    <div className="relative w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
      
      {/* The animated stream line elements */}
      {lines}

      {/* The animated text content, displayed on top */}
      <div className="relative z-10 text-center animate-fade-in-up backdrop-blur-sm p-8 rounded-lg shadow-2xl shadow-white/20">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-widest" style={{fontFamily: "'Orbitron', sans-serif"}}>
          STREAM
        </h1>
        <p className="text-white text-lg md:text-2xl mt-4">
          Animated Background Component
        </p>
      </div>

      {/* --- Styles and Animations --- */}
      <style>{`
        /* Import Google Font for the text */
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');

        /* Keyframes for the text fade-in and slide-up animation */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Class to apply the text animation */
        .animate-fade-in-up {
          animation: fadeInUp 1.2s ease-out forwards;
        }

        /* Base style for the stream lines, positioned in the center */
        .stream-line {
          top: 50%;
          left: 50%;
        }

        /* Creates the "tail" of the stream line using a pseudo-element */
        .stream-line::before {
          content: '';
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: var(--tail-length);
          height: 1px;
          background: linear-gradient(to right, white, transparent);
        }
        
        /* Keyframes for moving the stream line from outside to the center */
        @keyframes animate {
          0% {
            /* Start far away, rotated at its angle */
            transform: rotate(var(--degrees)) translateX(100vmax);
            opacity: 0;
          }
          50%, 70% {
            /* Fade in as it moves */
            opacity: 1;
          }
          100% {
            /* End at the center, faded out */
            transform: rotate(var(--degrees)) translateX(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default StreamLinesBackground;
