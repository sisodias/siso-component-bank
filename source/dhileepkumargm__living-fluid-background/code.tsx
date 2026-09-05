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

                // 2D Noise function
                float noise(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                }

                // Fractional Brownian Motion
                float fbm(vec2 st) {
                    float value = 0.0;
                    float amplitude = 0.5;
                    float frequency = 0.0;
                    for (int i = 0; i < 6; i++) {
                        value += amplitude * noise(st);
                        st *= 2.0;
                        amplitude *= 0.5;
                    }
                    return value;
                }

                void main() {
                    vec2 st = gl_FragCoord.xy / u_resolution.xy;
                    vec2 mouse = u_mouse / u_resolution.xy;

                    // Animate the noise field
                    vec2 q = vec2(fbm(st + 0.0*u_time), fbm(st + vec2(1.0)));
                    
                    // Add mouse interaction to distort the field
                    float mouse_dist = distance(st, mouse);
                    vec2 mouse_effect = (mouse - st) * 0.1 / (mouse_dist + 0.01);
                    q += mouse_effect;
                    
                    // More animation
                    vec2 r = vec2(fbm(st + q + vec2(1.7,9.2) + 0.15*u_time), fbm(st + q + vec2(8.3,2.8) + 0.126*u_time));

                    // Use the final noise values to generate color
                    float final_noise = fbm(st + r);

                    vec3 color = mix(vec3(0.1, 0.0, 0.2), // Dark violet
                                     vec3(0.6, 0.2, 0.8), // Magenta
                                     smoothstep(0.3, 0.7, final_noise));

                    color = mix(color,
                                vec3(0.9, 0.9, 1.0), // Iridescent white
                                smoothstep(0.6, 0.8, final_noise));
                    
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
                // Invert Y for shader coordinates
                uniforms.u_mouse.value.set(event.clientX, window.innerHeight - event.clientY);
            };
            window.addEventListener('mousemove', handleMouseMove, false);

            // --- Animation Loop ---
            const clock = new THREE.Clock();
            const animate = () => {
                requestAnimationFrame(animate);
                uniforms.u_time.value = clock.getElapsedTime() * 0.2;
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
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-8 pointer-events-none">
                     <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-4" style={{textShadow: '0 0 20px rgba(0,0,0,0.7)'}}>
                        Sculpt the Flow
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8" style={{textShadow: '0 0 15px rgba(0,0,0,0.7)'}}>
                        An interactive fluid simulation powered by GLSL. Move your cursor to bend the fabric of digital light.
                    </p>
                    <a href="#" className="bg-white text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-white/20 pointer-events-auto">
                        Dive In
                    </a>
                </div>
            </main>
    );
};
