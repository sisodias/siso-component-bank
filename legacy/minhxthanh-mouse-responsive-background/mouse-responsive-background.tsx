import React, { useEffect, useRef } from 'react';

const ParallaxBackground = () => {
  const bgRef = useRef(null);

  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;

    const handleMouseMove = (e) => {
      const windowWidth = window.innerWidth / 5;
      const windowHeight = window.innerHeight / 5;
      const mouseX = e.clientX / windowWidth;
      const mouseY = e.clientY / windowHeight;

      bg.style.transform = `translate3d(-${mouseX}%, -${mouseY}%, 0)`;
    };

    // Listen for mouse movement on window
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute top-0 left-0 w-[110%] h-[110%] bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1537884944318-390069bb8665?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      {/* Hover Text */}
      <h1
        className="pointer-events-none whitespace-nowrap font-['Lobster Two',cursive] italic text-[100px] text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9]"
      >
        Hover me
      </h1>
    </div>
  );
};

export default ParallaxBackground;
