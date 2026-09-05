import React from 'react';

export const Component = () => {
      // Generate a random number within a range
    const random = (min, max) => Math.random() * (max - min) + min;

  return (

            <main className="hero-section w-full h-screen">
                <div className="engine-container">
                    <div className="power-core"></div>
                    
                    {/* Define the gears of the engine */}
                    <div className="gear gear-1">
                        <div className="spark-emitter">
                            {/* Procedurally generate sparks for this gear */}
                            {[...Array(20)].map((_, i) => {
                                const angle = random(0, 360);
                                const radius = 200; // Half of gear width
                                const spawnX = Math.cos(angle) * radius;
                                const spawnY = Math.sin(angle) * radius;
                                // Tangential travel direction
                                const travelX = spawnX + (-spawnY * random(0.5, 1.5));
                                const travelY = spawnY + (spawnX * random(0.5, 1.5));
                                const duration = random(2, 5);
                                const delay = random(0, 5);

                                return <div key={i} className="spark" style={{
                                    '--spawn-x': spawnX, '--spawn-y': spawnY,
                                    '--travel-x': travelX, '--travel-y': travelY,
                                    animationDuration: `${duration}s`, animationDelay: `${delay}s`,
                                }} />;
                            })}
                        </div>
                    </div>

                    <div className="gear gear-2"></div>
                    
                    <div className="gear gear-3">
                        <div className="spark-emitter">
                             {[...Array(15)].map((_, i) => {
                                const angle = random(0, 360);
                                const radius = 125;
                                const spawnX = Math.cos(angle) * radius;
                                const spawnY = Math.sin(angle) * radius;
                                const travelX = spawnX + (-spawnY * random(0.5, 1.5));
                                const travelY = spawnY + (spawnX * random(0.5, 1.5));
                                const duration = random(2, 4);
                                const delay = random(0, 4);

                                return <div key={i} className="spark" style={{
                                    '--spawn-x': spawnX, '--spawn-y': spawnY,
                                    '--travel-x': travelX, '--travel-y': travelY,
                                    animationDuration: `${duration}s`, animationDelay: `${delay}s`,
                                }} />;
                            })}
                        </div>
                    </div>
                </div>

                {/* The content container is empty */}
                <div className="relative z-10 text-center p-8 max-w-2xl">
                </div>
            </main>
  );
};


