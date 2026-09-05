
import React from 'react';

// This is a self-contained React component that creates a "Celestial Loom" effect.
// An evolution of the "Aether Weave", this simulates a cosmic loom with a static
// grid and a dynamic shuttle weaving threads of light. The effect is achieved
// through layered procedural animations and CSS gradients.
export const Component = () => {
    // Generate a random number within a range
    const random = (min, max) => Math.random() * (max - min) + min;
    const colors = ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff", "#bdb2ff", "#ffc6ff"];

    return (
            <main className="hero-section w-full h-screen">
                <div className="warp-grid"></div>

                {/* Procedurally generate multiple shuttle runs */}
                {[...Array(25)].map((_, i) => {
                    const duration = random(5, 12);
                    const delay = random(0, 10);
                    
                    return (
                        <div key={i} className="shuttle-run" style={{
                            animationDuration: `${duration}s`,
                            animationDelay: `${delay}s`,
                        }}>
                            <div className="shuttle" style={{
                                '--position': `${random(5, 95)}%`,
                                '--color': colors[Math.floor(random(0, colors.length))],
                                animationDuration: `${duration}s`,
                                animationDelay: `${delay}s`,
                            }}></div>
                            <div className="weft-thread" style={{
                                '--position': `${random(5, 95)}%`,
                                '--color': colors[Math.floor(random(0, colors.length))],
                                animationDuration: `${duration}s`,
                                animationDelay: `${delay}s`,
                            }}></div>
                        </div>
                    );
                })}

                {/* The content container is empty */}
                <div className="relative z-10 text-center p-8 max-w-2xl">
                </div>
            </main>
    );
}
