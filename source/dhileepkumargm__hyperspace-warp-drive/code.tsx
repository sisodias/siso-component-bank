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

            // --- Scene Setup ---
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
            camera.position.z = 1;
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            currentMount.appendChild(renderer.domElement);
            
            // --- GLSL Shader Code ---

            const vertexShader = `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `;

            const fragmentShader = `
                uniform vec2 u_resolution;
                uniform float u_time;
                uniform vec2 u_mouse;

                // Psuedo-random number generator
                float random(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                }

                void main() {
                    vec2 st = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
                    vec3 color = vec3(0.01, 0.0, 0.05); // Deep space color
                    
                    // Mouse influence
                    st += u_mouse * 0.1;

                    float len = length(st);
                    
                    // Convert to polar coordinates
                    vec2 polar = vec2(atan(st.y, st.x), len);
                    
                    // Number of stars/streaks
                    float num_stars = 200.0;
                    polar.x *= num_stars;

                    // Create star seeds
                    float star_seed = floor(polar.x) + 0.5;
                    float random_star = random(vec2(star_seed));
                    
                    // Animate stars moving outwards
                    float time_offset = u_time * (0.5 + random_star * 0.5);
                    float star_pos = fract(random_star + time_offset) * 2.0;
                    
                    // Create streaks
                    float streak_width = 0.005 + random_star * 0.005;
                    float star_streak = smoothstep(-streak_width, streak_width, polar.y - star_pos) - 
                                      smoothstep(streak_width, streak_width + 0.2, polar.y - star_pos);

                    // Fade stars at the edges
                    star_streak *= smoothstep(0.0, 0.3, polar.y) * smoothstep(1.0, 0.7, polar.y);

                    // Brightness and color based on position and randomness
                    float brightness = 0.5 + random_star * 0.5;
                    vec3 star_color = vec3(0.8, 0.9, 1.0) * brightness; // Cool white stars

                    // Add some colored stars
                    if (random(vec2(star_seed, 2.0)) > 0.98) {
                        star_color = vec3(1.0, 0.6, 0.8); // Occasional pink/purple stars
                    }

                    color += star_streak * star_color;
                    
                    gl_FragColor = vec4(color, 1.0);
                }
            `;

            // --- Shader Material ---
            const uniforms = {
                u_time: { value: 0.0 },
                u_resolution: { value: new THREE.Vector2(currentMount.clientWidth, currentMount.clientHeight) },
                u_mouse: { value: new THREE.Vector2() }
            };

            const planeGeometry = new THREE.PlaneGeometry(2, 2);
            const planeMaterial = new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
            });

            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            scene.add(plane);

            // --- Mouse Interaction ---
            const handleMouseMove = (event) => {
                uniforms.u_mouse.value.x = (event.clientX / window.innerWidth) * 2 - 1;
                uniforms.u_mouse.value.y = -(event.clientY / window.innerHeight) * 2 + 1;
            };
            window.addEventListener('mousemove', handleMouseMove, false);

            // --- Animation Loop ---
            const clock = new THREE.Clock();
            const animate = () => {
                requestAnimationFrame(animate);
                uniforms.u_time.value = clock.getElapsedTime();
                renderer.render(scene, camera);
            };

            animate();

            // --- Responsive Handling ---
            const handleResize = () => {
                camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
                uniforms.u_resolution.value.set(currentMount.clientWidth, currentMount.clientHeight);
            };
            window.addEventListener('resize', handleResize);

            // --- Cleanup ---
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
                     <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-4" style={{textShadow: '0 0 20px rgba(173, 216, 230, 0.5)'}}>
                        Engage Warp Drive
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8" style={{textShadow: '0 0 15px rgba(0,0,0,0.7)'}}>
                        Witness the power of procedural generation with GLSL shaders, creating an infinite, high-performance visual experience.
                    </p>
                    <a href="#" className="bg-white text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-white/20">
                        Enter the Cosmos
                    </a>
                </div>
            </main>
  );
};
