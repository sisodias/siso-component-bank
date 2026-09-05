import React from 'react';

// This is a self-contained React component that creates a "Living Origami" effect.
// An evolution of procedural animation, this simulates a flock of glowing origami
// birds flying across the screen. The effect is achieved with CSS 3D transforms
// and a procedurally generated set of layered animations.

export const Component = () => {
    // Generate a random number within a range
    const random = (min, max) => Math.random() * (max - min) + min;

    return (
            <main className="hero-section w-full h-screen">
                {/* Procedurally generate multiple drifters */}
                {[...Array(15)].map((_, i) => {
                    const duration = random(20, 40);
                    const delay = random(-40, 0);
                    const scale = random(0.2, 0.8);
                    
                    return (
                        <div key={i} className="drifter-container" style={{
                            '--y-start': `${random(-30, 30)}vh`,
                            '--y-end': `${random(-30, 30)}vh`,
                            '--r-start': `${random(-30, 30)}deg`,
                            '--r-end': `${random(-30, 30)}deg`,
                            animationDuration: `${duration}s`,
                            animationDelay: `${delay}s`,
                        }}>
                            <div className="origami-crane" style={{
                                transform: `scale(${scale})`,
                                animationDelay: `${random(-4, 0)}s`,
                            }}>
                                <div className="crane-part body"></div>
                                <div className="crane-part wing-left"></div>
                                <div className="crane-part wing-right"></div>
                                <div className="crane-part tail"></div>
                            </div>
                        </div>
                    );
                })}

                {/* The content container is empty */}
                <div className="relative z-10 text-center p-8 max-w-2xl">
                </div>
            </main>
    );
}
