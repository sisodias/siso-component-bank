import React, { useEffect, useRef } from 'react';

// This is a self-contained React component that generates an interactive, kaleidoscopic fractal world.
// It uses a Ray Marching shader with a technique called "Domain Folding" to create infinite,
// self-similar structures in real-time, representing a step into pure mathematical art.

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
            const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            currentMount.appendChild(renderer.domElement);

            // --- Kaleidoscopic Shader ---
            const fragmentShader = `
                uniform vec2 u_resolution;
                uniform float u_time;
                uniform vec2 u_mouse;
                varying vec2 vUv;

                #define MAX_STEPS 100
                #define MAX_DIST 100.0
                #define SURF_DIST 0.001

                // --- Rotation Matrix ---
                mat2 rot(float a) {
                    float s = sin(a);
                    float c = cos(a);
                    return mat2(c, -s, s, c);
                }

                // --- Signed Distance Function for the core shape ---
                float sdSphere(vec3 p, float s) {
                    return length(p) - s;
                }

                // --- The main scene function ---
                // This is where the magic of domain folding happens.
                float map(vec3 p) {
                    vec3 p_orig = p;
                    
                    // We apply a series of transformations (folding and rotation)
                    // to the space itself before drawing our shape.
                    for (int i = 0; i < 8; i++) {
                        p = abs(p); // Fold space along all axes
                        p -= vec3(0.5, 0.5, 0.2); // Translate
                        p.xy *= rot(u_time * 0.1); // Rotate
                        p.yz *= rot(u_time * 0.15); // Rotate on another axis
                    }
                    
                    // The final shape is just a simple sphere, but because space has been
                    // folded so many times, it appears infinitely complex.
                    return sdSphere(p, 0.3);
                }

                // --- Ray Marching Core ---
                vec4 rayMarch(vec3 ro, vec3 rd) {
                    float dO = 0.0;
                    vec3 p = ro;
                    for(int i = 0; i < MAX_STEPS; i++) {
                        p = ro + rd * dO;
                        float dS = map(p);
                        dO += dS;
                        if(dO > MAX_DIST || dS < SURF_DIST) break;
                    }
                    return vec4(dO, p);
                }

                // --- Normal Calculation for Lighting ---
                vec3 getNormal(vec3 p) {
                    vec2 e = vec2(0.001, 0.0);
                    float d = map(p);
                    vec3 n = d - vec3(map(p - e.xyy), map(p - e.yxy), map(p - e.yyx));
                    return normalize(n);
                }

                void main() {
                    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;

                    // --- Camera and Ray Setup ---
                    vec3 ro = vec3(0.0, 0.0, 3.0); // Ray Origin (Camera Position)
                    vec3 rd = normalize(vec3(uv, -1.0)); // Ray Direction

                    // Mouse look
                    ro.xy *= rot(u_mouse.x * 3.14);
                    ro.yz *= rot(u_mouse.y * 3.14);

                    // --- March the Ray and Get Color ---
                    vec4 res = rayMarch(ro, rd);
                    float d = res.x;
                    vec3 p = res.yzw;

                    vec3 col = vec3(0.0); // Background color

                    if(d < MAX_DIST) {
                        vec3 normal = getNormal(p);
                        
                        // --- Lighting & Coloring ---
                        // Create a vibrant, otherworldly color palette that shifts over time
                        vec3 color1 = 0.5 + 0.5 * cos(u_time * 0.5 + p.xyz * 0.8 + vec3(0,2,4));
                        vec3 color2 = 0.5 + 0.5 * cos(u_time * 0.3 + p.yzx * 1.2 + vec3(1,3,2));
                        
                        // Base color is a mix based on the normal vector
                        vec3 materialColor = mix(color1, color2, abs(normal.y));

                        // Add a glow based on how far the ray traveled
                        col = materialColor * exp(-0.1 * d);
                    }
                    
                    gl_FragColor = vec4(col, 1.0);
                }
            `;
            
            const planeGeometry = new THREE.PlaneGeometry(2, 2);
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    u_resolution: { value: new THREE.Vector2(currentMount.clientWidth, currentMount.clientHeight) },
                    u_time: { value: 0.0 },
                    u_mouse: { value: new THREE.Vector2() }
                },
                fragmentShader,
            });
            const plane = new THREE.Mesh(planeGeometry, material);
            scene.add(plane);

            // --- Mouse Interaction ---
            const handleMouseMove = (event) => {
                material.uniforms.u_mouse.value.x = (event.clientX / window.innerWidth) - 0.5;
                material.uniforms.u_mouse.y = (event.clientY / window.innerHeight) - 0.5;
            };
            window.addEventListener('mousemove', handleMouseMove);

            // --- Animation Loop ---
            const clock = new THREE.Clock();
            const animate = () => {
                requestAnimationFrame(animate);
                material.uniforms.u_time.value = clock.getElapsedTime();
                renderer.render(scene, camera);
            };
            animate();
            
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
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
                     <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-4" style={{textShadow: '0 0 20px rgba(0,0,0,0.9)'}}>
                        The Symmetry Engine
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8" style={{textShadow: '0 0 15px rgba(0,0,0,0.9)'}}>
                        An interactive world born from pure mathematics. Move your mouse to traverse the folded dimensions of a living kaleidoscope.
                    </p>
                    <a href="#" className="bg-white text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-white/20 pointer-events-auto">
                        Calibrate Reality
                    </a>
                </div>
            </main>
    );
};

