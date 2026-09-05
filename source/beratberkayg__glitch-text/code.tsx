import React from "react";

export const Component = () => {
  return (
    <button className="relative px-6 py-3 uppercase text-transparent text-2xl font-bold tracking-widest cursor-pointer group overflow-hidden ">
     
      <span
        className="relative z-10"
        style={{
          WebkitTextStroke: "1px rgba(0,0,255,0.6)"
        }}
      >
        hello world
      </span>

 
      <span
        className="absolute inset-0 text-[#37FF8B] border-r-[3px] border-[#37FF8B] transition-all duration-700 ease-in-out group-hover:w-full w-0 flex items-center justify-center animate-premium-shimmer"
        style={{
          WebkitTextStroke: "1px #37FF8B"
        }}
      >
        hello world
      </span>

    
      <style jsx>{`
        /* Premium shimmer animasyonu */
        @keyframes premiumShimmer {
          0% {
            clip-path: inset(0 100% 0 0);
          }
          50% {
            clip-path: inset(0 0 0 0);
          }
          100% {
            clip-path: inset(0 0 0 100%);
          }
        }
        .animate-premium-shimmer {
          animation: premiumShimmer 2s ease-in-out infinite;
          filter: drop-shadow(0 0 10px #37ff8b) drop-shadow(0 0 25px #37ff8b);
        }
      `}</style>
    </button>
  );
};
