import React from 'react';


export const Component = () => {
  return (
     <main className="hero-section w-full h-screen bg-[#0c0a18] flex items-center justify-center">
                {/* The background orbs that form the nebula */}
                <div className="bg-orb orb-1" />
                <div className="bg-orb orb-2" />
                <div className="bg-orb orb-3" />

                {/* The content container is now empty */}
                <div className="relative z-10 text-center p-8 max-w-2xl">
                </div>
    </main>
  );
};
