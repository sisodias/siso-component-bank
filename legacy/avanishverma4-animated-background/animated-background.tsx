import React from 'react';

const AuroraBackground = ({ children, className = '' }) => {
  return (
    <div className={`relative min-h-screen overflow-hidden bg-black w-full ${className}`}>
      {/* Aurora Background */}
      <div className="absolute inset-0">
        {/* Base aurora layer */}
        <div className="absolute inset-0 opacity-70">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-indigo-900/40"></div>
        </div>
        
        {/* Animated aurora waves */}
        <div className="absolute inset-0">
          {/* Wave 1 */}
          <div 
            className="absolute inset-0 opacity-60"
            style={{
              background: 'radial-gradient(ellipse 800px 600px at 50% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
              animation: 'aurora1 8s ease-in-out infinite alternate'
            }}
          ></div>
          
          {/* Wave 2 */}
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              background: 'radial-gradient(ellipse 600px 400px at 80% 30%, rgba(139, 92, 246, 0.4) 0%, transparent 50%)',
              animation: 'aurora2 6s ease-in-out infinite alternate-reverse'
            }}
          ></div>
          
          {/* Wave 3 */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              background: 'radial-gradient(ellipse 700px 500px at 20% 60%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)',
              animation: 'aurora3 10s ease-in-out infinite alternate'
            }}
          ></div>
          
          {/* Wave 4 */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(ellipse 900px 300px at 60% 80%, rgba(34, 197, 94, 0.2) 0%, transparent 50%)',
              animation: 'aurora4 7s ease-in-out infinite alternate-reverse'
            }}
          ></div>
        </div>
        
        {/* Overlay gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes aurora1 {
          0% { transform: translateX(-100px) translateY(-50px) rotate(0deg) scale(1); }
          50% { transform: translateX(50px) translateY(30px) rotate(180deg) scale(1.1); }
          100% { transform: translateX(100px) translateY(-30px) rotate(360deg) scale(0.9); }
        }
        
        @keyframes aurora2 {
          0% { transform: translateX(80px) translateY(40px) rotate(45deg) scale(0.8); }
          50% { transform: translateX(-30px) translateY(-20px) rotate(225deg) scale(1.2); }
          100% { transform: translateX(-80px) translateY(60px) rotate(405deg) scale(0.9); }
        }
        
        @keyframes aurora3 {
          0% { transform: translateX(-50px) translateY(20px) rotate(90deg) scale(1.1); }
          50% { transform: translateX(70px) translateY(-40px) rotate(270deg) scale(0.8); }
          100% { transform: translateX(-20px) translateY(50px) rotate(450deg) scale(1.0); }
        }
        
        @keyframes aurora4 {
          0% { transform: translateX(30px) translateY(-20px) rotate(135deg) scale(0.9); }
          50% { transform: translateX(-60px) translateY(10px) rotate(315deg) scale(1.1); }
          100% { transform: translateX(40px) translateY(-60px) rotate(495deg) scale(0.8); }
        }
      `}</style>
    </div>
  );
};

// Example usage component
const AuroraDemo = () => {
  return (
    <AuroraBackground>
      <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center">
        <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
          Aurora Magic
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-md">
          Experience the mesmerizing beauty of dancing lights.
        </p>
        <button className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white border border-white/20 hover:bg-white/20 transition-all duration-300">
          Explore More
        </button>
      </div>
    </AuroraBackground>
  );
};

export default AuroraDemo;