import React, { useRef, useEffect } from 'react';

const AnimatedBackground = () => {
  return (
    <div className="relative w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* The animated background component */}
      <WarpSpeedBackground />
      
      {/* Example content to display on top of the background with animation */}
      <div className="relative z-10 text-center animate-fade-in-up">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-widest" style={{fontFamily: "'Orbitron', sans-serif"}}>
          STREAM
        </h1>
        <p className="text-white text-lg md:text-2xl mt-4">
          Animated Background Component
        </p>
      </div>
       {/* You can add a link to the font in your main HTML file's head for better performance */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');

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

          .animate-fade-in-up {
            animation: fadeInUp 1.2s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

/**
 * A React component that renders a "warp speed" or "hyperspace"
 * animation on an HTML5 canvas.
 */
const WarpSpeedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- Configuration ---
    const STAR_COUNT = 2000; // The number of stars to render
    const STAR_SPEED = 0.05; // The speed at which stars travel
    const STAR_COLOR = 'rgba(255, 255, 255, 0.7)'; // The color of the stars

    let stars = [];
    let animationFrameId;

    // --- Canvas and Star Initialization ---
    const setup = () => {
      // Set canvas dimensions to fill the window
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Center of the canvas
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Create the star field
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push(createStar());
      }
    };

    // --- Star Creation ---
    const createStar = () => {
        // A star is an object with x, y, and z coordinates
        // z represents the depth. A smaller z means the star is closer.
        return {
            x: (Math.random() - 0.5) * canvas.width,
            y: (Math.random() - 0.5) * canvas.height,
            z: Math.random() * canvas.width, // Start stars at various depths
            prevZ: Math.random() * canvas.width,
        };
    };

    // --- Animation Loop ---
    const animate = () => {
      // Request the next frame
      animationFrameId = requestAnimationFrame(animate);

      // Clear the canvas with a semi-transparent black for a motion blur effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.fillStyle = STAR_COLOR;
      ctx.strokeStyle = STAR_COLOR;

      // Update and draw each star
      stars.forEach(star => {
        // Move the star closer to the viewer (decrease z)
        star.z -= STAR_SPEED;

        // If the star has moved past the viewer (z < 1),
        // reset it to a new position at the back.
        if (star.z < 1) {
          star.x = (Math.random() - 0.5) * canvas.width;
          star.y = (Math.random() - 0.5) * canvas.height;
          star.z = canvas.width;
          star.prevZ = canvas.width;
        }

        // --- 3D to 2D Projection ---
        // This calculates the star's position on the 2D screen
        const k = 128.0 / star.z; // Perspective scaling factor
        const px = star.x * k + centerX; // Projected X
        const py = star.y * k + centerY; // Projected Y

        if (px >= 0 && px < canvas.width && py >= 0 && py < canvas.height) {
            // Calculate the size of the star based on its distance
            const size = (1 - star.z / canvas.width) * 5;
            
            // Calculate previous position to draw a line for the streak effect
            const prevK = 128.0 / star.prevZ;
            const prevX = star.x * prevK + centerX;
            const prevY = star.y * prevK + centerY;

            // Draw the line (streak)
            ctx.lineWidth = size;
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(px, py);
            ctx.stroke();
        }
        
        // Update the previous z-coordinate for the next frame
        star.prevZ = star.z;
      });
    };

    // --- Event Listener for Resizing ---
    const handleResize = () => {
      // Stop the animation and re-initialize on resize
      cancelAnimationFrame(animationFrameId);
      setup();
      animate();
    };

    // --- Start ---
    setup();
    animate();

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    // This function is called when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // The empty dependency array ensures this effect runs only once on mount

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0"
    />
  );
};

export default AnimatedBackground;
