import React, { useEffect, useRef } from 'react';

const AnimatedCard = () => {
  const topRef = useRef(null);
  const rightRef = useRef(null);
  const bottomRef = useRef(null);
  const leftRef = useRef(null);
  
  useEffect(() => {
    const animateBorder = () => {
      const now = Date.now() / 1000;
      const speed = 0.5; // Animation speed
      
      // Calculate positions based on time
      const topX = Math.sin(now * speed) * 100;
      const rightY = Math.cos(now * speed) * 100;
      const bottomX = Math.sin(now * speed + Math.PI) * 100;
      const leftY = Math.cos(now * speed + Math.PI) * 100;
      
      // Apply positions to elements
      if (topRef.current) topRef.current.style.transform = `translateX(${topX}%)`;
      if (rightRef.current) rightRef.current.style.transform = `translateY(${rightY}%)`;
      if (bottomRef.current) bottomRef.current.style.transform = `translateX(${bottomX}%)`;
      if (leftRef.current) leftRef.current.style.transform = `translateY(${leftY}%)`;
      
      requestAnimationFrame(animateBorder);
    };
    
    const animationId = requestAnimationFrame(animateBorder);
    return () => cancelAnimationFrame(animationId);
  }, []);
  
  return (
    <div className="relative w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl p-8 md:p-12 overflow-hidden shadow-2xl">
      {/* Animated border elements */}
      <div className="absolute top-0 left-0 w-full h-0.5 overflow-hidden">
        <div 
          ref={topRef}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"
        ></div>
      </div>
      
      <div className="absolute top-0 right-0 w-0.5 h-full overflow-hidden">
        <div 
          ref={rightRef}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-purple-500/50 to-transparent"
        ></div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-0.5 overflow-hidden">
        <div 
          ref={bottomRef}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"
        ></div>
      </div>
      
      <div className="absolute top-0 left-0 w-0.5 h-full overflow-hidden">
        <div 
          ref={leftRef}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-purple-500/50 to-transparent"
        ></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          <span className="text-white">Dynamic Border</span>{' '}
          <span className="bg-gradient-to-r from-orange-400 to-purple-500 text-transparent bg-clip-text">
            Animations
          </span>
        </h1>
        
        <p className="text-gray-400 max-w-xl mx-auto mb-8">
          This card features animated border elements that continuously move around the perimeter, 
          creating a dynamic visual effect using React and Tailwind CSS.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div 
              key={item}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 hover:border-orange-500/30 transition-all"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500/20 to-purple-500/20 flex items-center justify-center mr-3">
                  <span className="text-orange-400">{item}</span>
                </div>
                <div>
                  <h3 className="font-medium text-white">Feature {item}</h3>
                  <p className="text-sm text-gray-400">Description of feature</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="mt-8 bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-500 hover:to-purple-500 text-white font-medium py-3 px-8 rounded-xl transition-all transform hover:-translate-y-1">
          Explore More
        </button>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
      <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-orange-500/10 blur-xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-purple-500/10 blur-xl"></div>
    </div>
  );
};

export default AnimatedCard;