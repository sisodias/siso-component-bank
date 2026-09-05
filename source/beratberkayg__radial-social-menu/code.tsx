import React, { useEffect, useState } from "react";
import { Github, Linkedin, Twitter, Mail, Code, User, Fingerprint } from "lucide-react";

export const Component: React.FC = () => {
  const icons = [
    { icon: <Github /> },
    { icon: <Linkedin /> },
    { icon: <Twitter /> },
    { icon: <Mail /> },
    { icon: <Code /> },
    { icon: <Fingerprint /> },
  ];

  const radius = 140;
  const [angleOffset, setAngleOffset] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    const animate = () => {
      setAngleOffset(prev => prev + 0.002);
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="relative h-screen w-screen flex items-center justify-center">
     
      <div className="relative z-10 flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 shadow-xl ring-4 ring-blue-200/30 animate-pulse-slow">
        <User className="text-white w-16 h-16" />
      </div>

    
      <div
        className="absolute rounded-full border-1 border-dashed border-gray-300"
        style={{
          width: `${radius * 2}px`,
          height: `${radius * 2}px`,
          top: `calc(50% - ${radius}px)`,
          left: `calc(50% - ${radius}px)`,
        }}
      />

    
      {icons.map((item, index) => {
        const angle = (index / icons.length) * 2 * Math.PI + angleOffset;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        return (
          <button
            key={index}
            className="absolute flex items-center justify-center w-14 h-14 rounded-full bg-white border border-gray-200 shadow-md hover:scale-110 hover:shadow-2xl transition-transform duration-300 animate-float"
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
          >
            {React.cloneElement(item.icon, { size: 28, className: "text-gray-700" })}
          </button>
        );
      })}
    </div>
  );
};
