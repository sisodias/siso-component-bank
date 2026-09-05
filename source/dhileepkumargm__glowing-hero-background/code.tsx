import React from 'react';

export const Component = () => {

  return (
     <main className="hero-section w-full h-screen bg-gray-900 text-white flex items-center justify-center">
                {/* The background orb */}
                <div className="bg-orb" />

                {/* The content container is now empty */}
                <div className="relative z-10 text-center p-8 max-w-2xl">
                </div>
            </main>
  );
};
