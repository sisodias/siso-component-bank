import React, { useEffect, useRef } from 'react';

export const Component = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        // Dynamically load the Three.js script
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            const THREE = window.THREE;
            const currentMount = mountRef.current;

            // Scene setup
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            currentMount.appendChild(renderer.domElement);

            // --- Lighting ---
            const ambientLight = new THREE.AmbientLight(0x404040, 2);
            scene.add(ambientLight);

            const pointLight1 = new THREE.PointLight(0x8e2de2, 2, 200);
            pointLight1.position.set(50, 50, 50);
            scene.add(pointLight1);
            
            const pointLight2 = new THREE.PointLight(0x4a00e0, 2, 200);
            pointLight2.position.set(-50, -50, -50);
            scene.add(pointLight2);
            
            // --- Crystal Geometry ---
            const crystals = [];
            const crystalGeometry = new THREE.IcosahedronGeometry(1, 0);
            const crystalMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                metalness: 0.8,
                roughness: 0.1,
                transparent: true,
                opacity: 0.8
            });

            for (let i = 0; i < 200; i++) {
                const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
                const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
                crystal.position.set(x, y, z);
                
                crystal.rotation.set(
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                );

                const scale = THREE.MathUtils.randFloat(0.2, 1.5);
                crystal.scale.set(scale, scale, scale);
                
                // Store random rotation speeds
                crystal.userData.rotationSpeed = {
                    x: (Math.random() - 0.5) * 0.01,
                    y: (Math.random() - 0.5) * 0.01,
                };

                scene.add(crystal);
                crystals.push(crystal);
            }
            
            camera.position.z = 50;

            // --- Mouse Interaction ---
            const mouse = { x: 0, y: 0 };
            const handleMouseMove = (event) => {
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            };
            window.addEventListener('mousemove', handleMouseMove);

            // --- Animation Loop ---
            const animate = () => {
                requestAnimationFrame(animate);

                crystals.forEach(crystal => {
                    crystal.rotation.x += crystal.userData.rotationSpeed.x;
                    crystal.rotation.y += crystal.userData.rotationSpeed.y;
                });
                
                // Parallax effect
                camera.position.x += (mouse.x * 5 - camera.position.x) * 0.05;
                camera.position.y += (mouse.y * 5 - camera.position.y) * 0.05;
                camera.lookAt(scene.position);

                renderer.render(scene, camera);
            };

            animate();

            // --- Responsive Handling ---
            const handleResize = () => {
                camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            };
            window.addEventListener('resize', handleResize);

            // Cleanup
            return () => {
                window.removeEventListener('resize', handleResize);
                window.removeEventListener('mousemove', handleMouseMove);
                currentMount.removeChild(renderer.domElement);
                document.body.removeChild(script);
            };
        };

        return () => {
             if (script && script.parentNode) {
                document.body.removeChild(script);
             }
        }

    }, []);

  return (
<main className="relative w-screen h-screen">
                <div ref={mountRef} className="hero-mount"></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-8">
                     <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-4" style={{textShadow: '0 0 20px rgba(0,0,0,0.7)'}}>
                        Enter the Crystalverse
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8" style={{textShadow: '0 0 15px rgba(0,0,0,0.7)'}}>
                        Discover an immersive 3D world built with Three.js, where generative art meets interactive design.
                    </p>
                    <a href="#" className="bg-white text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-white/20">
                        Begin Exploration
                    </a>
                </div>
      </main>
  );
};
