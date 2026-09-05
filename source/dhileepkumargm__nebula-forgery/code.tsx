import React from 'react';


export const Component = () => {
     // Generate a random number within a range for animation delays/durations
    const random = (min, max) => Math.random() * (max - min) + min;

  return (

            <main className="hero-section w-full h-screen">
                <div className="nebula-container">
                    <div className="proto-star"></div>
                    
                    {/* Procedurally generate 8 streams of particles */}
                    {[...Array(8)].map((_, i) => (
                        <div key={`stream-${i}`} className="ejecta-stream" style={{
                            animationDelay: `${i * -2.5}s` // Stagger the stream rotations
                        }}>
                            {/* Generate 15 particles per stream */}
                            {[...Array(15)].map((_, p) => {
                                const angle = random(0, 360);
                                const radius = random(200, 500);
                                const distanceX = Math.cos(angle) * radius;
                                const distanceY = Math.sin(angle) * radius;
                                const duration = random(8, 15);
                                const delay = random(-12, 0);

                                return (
                                    <div
                                        key={`particle-${i}-${p}`}
                                        className="particle"
                                        style={{
                                            '--distance-x': distanceX,
                                            '--distance-y': distanceY,
                                            animationDuration: `${duration}s, ${duration}s`,
                                            animationDelay: `${delay}s, ${delay}s`,
                                        }}
                                    ></div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* The content container is empty */}
                <div className="relative z-10 text-center p-8 max-w-2xl">
                </div>
            </main>
  );
};
