"use client";

import React from "react";

export default function Loader() {
  return (
    <div className="relative w-12 h-12 mx-auto">
      {/* Shadow */}
      {/* <div className="absolute top-16 left-0 w-12 h-[2px] bg-[#f0808050] rounded-full animate-shadow-jump" /> */}
      
      {/* Box */}
      <div className="absolute w-full h-full bg-[#f08080] rounded-md animate-box-jump" />
      
      {/* Tailwind keyframe styles */}
      <style>{`
        @keyframes box-jump {
          15% {
            border-bottom-right-radius: 3px;
          }
          25% {
            transform: translateY(9px) rotate(22.5deg);
          }
          50% {
            transform: translateY(18px) scale(1, 0.9) rotate(45deg);
            border-bottom-right-radius: 40px;
          }
          75% {
            transform: translateY(9px) rotate(67.5deg);
          }
          100% {
            transform: translateY(0) rotate(90deg);
          }
        }

        @keyframes shadow-jump {
          0%, 100% {
            transform: scale(1, 1);
          }
          50% {
            transform: scale(1.2, 1);
          }
        }

        .animate-box-jump {
          animation: box-jump 0.5s linear infinite;
        }

        .animate-shadow-jump {
          animation: shadow-jump 0.5s linear infinite;
        }
      `}</style>
    </div>
  );
}
