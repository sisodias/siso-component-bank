"use client";

import React from "react";

interface FloatingIconsLoaderProps {
  count?: number; // Number of icons
  size?: number; // Icon size in px
  color?: string; // Icon color
  Icon?: React.ElementType; // React icon component
}

const FloatingIconsLoader: React.FC<FloatingIconsLoaderProps> = ({
  count = 3,
  size = 40,
  color = "#5c3d99",
  Icon, // pass icon component
}) => {
  const icons = Array.from({ length: count });

  return (
    <div className="relative w-32 h-32 mx-auto">
      {icons.map((_, idx) => {
        const delay = idx * 0.3;
        const animationClass =
          idx % 3 === 0
            ? "animate-flowe-one"
            : idx % 3 === 1
            ? "animate-flowe-two"
            : "animate-flowe-three";

        return (
          <div
            key={idx}
            className={`absolute w-full h-full flex justify-center items-center ${animationClass}`}
            style={{ animationDelay: `${delay}s` }}
          >
            {Icon ? <Icon size={size} color={color} /> : null}
          </div>
        );
      })}

      <style jsx>{`
        @keyframes flowe-one {
          0% { transform: scale(0.5) translateY(-200px); opacity:0; }
          25% { transform: scale(0.75) translateY(-100px); opacity:1; }
          50% { transform: scale(1) translateY(0); opacity:1; }
          75% { transform: scale(0.5) translateY(50px); opacity:1; }
          100% { transform: scale(0) translateY(100px); opacity:0; }
        }
        @keyframes flowe-two {
          0% { transform: scale(0.5) rotate(-10deg) translateY(-200px) translateX(-100px); opacity:0; }
          25% { transform: scale(1) rotate(-5deg) translateY(-100px) translateX(-50px); opacity:1; }
          50% { transform: scale(1) rotate(0deg) translateY(0) translateX(-25px); opacity:1; }
          75% { transform: scale(0.5) rotate(5deg) translateY(50px) translateX(0); opacity:1; }
          100% { transform: scale(0) rotate(10deg) translateY(100px) translateX(25px); opacity:0; }
        }
        @keyframes flowe-three {
          0% { transform: scale(0.5) rotate(10deg) translateY(-200px) translateX(100px); opacity:0; }
          25% { transform: scale(1) rotate(5deg) translateY(-100px) translateX(50px); opacity:1; }
          50% { transform: scale(1) rotate(0deg) translateY(0) translateX(25px); opacity:1; }
          75% { transform: scale(0.5) rotate(-5deg) translateY(50px) translateX(0); opacity:1; }
          100% { transform: scale(0) rotate(-10deg) translateY(100px) translateX(-25px); opacity:0; }
        }

        .animate-flowe-one { animation: flowe-one 1s linear infinite; }
        .animate-flowe-two { animation: flowe-two 1s linear infinite; }
        .animate-flowe-three { animation: flowe-three 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default FloatingIconsLoader;
