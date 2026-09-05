import React from 'react';

export const ShowcaseVideoCard = ({ src, alt, badge, className = "" }) => {
  return (
      <div
        className={`relative group overflow-hidden rounded-xl shadow-2xl h-72 md:h-[28rem] lg:h-[30rem] ${className}`}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          src={src}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Optional Badge */}
        {badge && (
          <span className="absolute z-10 top-3 right-3 text-xs bg-black/60 text-white/90 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm font-medium">
            {badge}
          </span>
        )}

        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>

        {/* Bottom gradient overlay for better text readability if needed */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
  );
};