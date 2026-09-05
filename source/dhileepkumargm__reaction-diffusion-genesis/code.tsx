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
            const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            currentMount.appendChild(renderer.domElement);

            // --- Reaction-Diffusion Shader ---
            const simFragmentShader = `
                uniform sampler2D u_texture;
                uniform vec2 u_resolution;
                uniform vec2 u_mouse;
                uniform float u_mouse_down;
                uniform float u_time;

                // Gray-Scott model parameters
                const float feed = 0.055;
                const float kill = 0.062;
                const float diffA = 1.0;
                const float diffB = 0.5;

                vec2 laplacian(vec2 uv, vec2 offset) {
                    vec4 C = texture2D(u_texture, uv);
                    vec4 N = texture2D(u_texture, uv + vec2(0.0, offset.y));
                    vec4 S = texture2D(u_texture, uv - vec2(0.0, offset.y));
                    vec4 E = texture2D(u_texture, uv + vec2(offset.x, 0.0));
                    vec4 W = texture2D(u_texture, uv - vec2(offset.x, 0.0));
                    return (N + S + E + W - 4.0 * C).xy;
                }

                void main() {
                    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                    vec2 offset = 1.0 / u_resolution.xy;
                    
                    vec4 data = texture2D(u_texture, uv);
                    float A = data.x;
                    float B = data.y;

                    vec2 lap = laplacian(uv, offset);
                    
                    float reaction = A * B * B;
                    float dA = diffA * lap.x - reaction + feed * (1.0 - A);
                    float dB = diffB * lap.y + reaction - (kill + feed) * B;

                    float newA = A + dA * 1.0;
                    float newB = B + dB * 1.0;
                    
                    // Add "chemicals" with mouse
                    float mouseDist = distance(gl_FragCoord.xy, u_mouse);
                    if (u_mouse_down > 0.5 && mouseDist < 25.0) {
                        newB = 1.0;
                    }
                    
                    gl_FragColor = vec4(clamp(newA, 0.0, 1.0), clamp(newB, 0.0, 1.0), 0.0, 1.0);
                }
            `;
            
            // --- Rendering Shader ---
            const renderFragmentShader = `
                uniform sampler2D u_texture;
                varying vec2 vUv;
                
                void main() {
                    vec4 data = texture2D(u_texture, vUv);
                    float a = data.x;
                    float b = data.y;
                    // Coloring based on chemical concentrations
                    vec3 color = vec3(b * 1.5, (a * b) * 2.0, a * 1.2);
                    gl_FragColor = vec4(color, 1.0);
                }
            `;
            
            const vertexShader = `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `;

            // --- Multi-pass setup ---
            const createRenderTarget = () => new THREE.WebGLRenderTarget(currentMount.clientWidth, currentMount.clientHeight, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                type: THREE.FloatType,
            });

            let readTarget = createRenderTarget();
            let writeTarget = createRenderTarget();

            // Initialize the simulation with a starting state
            const initialData = new Float32Array(currentMount.clientWidth * currentMount.clientHeight * 4);
            for (let i = 0; i < initialData.length; i += 4) {
                initialData[i] = 1.0; // Chemical A
                initialData[i+1] = 0.0; // Chemical B
            }
            const initialTexture = new THREE.DataTexture(initialData, currentMount.clientWidth, currentMount.clientHeight, THREE.RGBAFormat, THREE.FloatType);
            initialTexture.needsUpdate = true;
            
            // A helper scene to copy the initial texture
            const copyScene = new THREE.Scene();
            const copyMaterial = new THREE.MeshBasicMaterial({ map: initialTexture });
            const plane = new THREE.PlaneGeometry(2, 2);
            const copyMesh = new THREE.Mesh(plane, copyMaterial);
            copyScene.add(copyMesh);
            renderer.setRenderTarget(readTarget);
            renderer.render(copyScene, camera);
            renderer.setRenderTarget(null);

            const simMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    u_texture: { value: readTarget.texture },
                    u_resolution: { value: new THREE.Vector2(currentMount.clientWidth, currentMount.clientHeight) },
                    u_mouse: { value: new THREE.Vector2(-100, -100) },
                    u_mouse_down: { value: 0.0 },
                },
                vertexShader,
                fragmentShader: simFragmentShader,
            });

            const simMesh = new THREE.Mesh(plane, simMaterial);
            const simScene = new THREE.Scene();
            simScene.add(simMesh);

            const renderMaterial = new THREE.ShaderMaterial({
                uniforms: { u_texture: { value: writeTarget.texture } },
                vertexShader,
                fragmentShader: renderFragmentShader,
            });
            const renderMesh = new THREE.Mesh(plane, renderMaterial);
            scene.add(renderMesh);

            // --- Mouse Interaction ---
            const handleMouseMove = (event) => {
                simMaterial.uniforms.u_mouse.value.set(event.clientX, window.innerHeight - event.clientY);
            };
            const handleMouseDown = () => { simMaterial.uniforms.u_mouse_down.value = 1.0; };
            const handleMouseUp = () => { simMaterial.uniforms.u_mouse_down.value = 0.0; };

            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mousedown', handleMouseDown);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchstart', handleMouseDown);
            window.addEventListener('touchend', handleMouseUp);
            window.addEventListener('touchmove', (e) => handleMouseMove(e.touches[0]));


            // --- Animation Loop ---
            const animate = () => {
                requestAnimationFrame(animate);

                // Run simulation pass
                simMaterial.uniforms.u_texture.value = readTarget.texture;
                renderer.setRenderTarget(writeTarget);
                renderer.render(simScene, camera);
                
                // Render to screen
                renderMaterial.uniforms.u_texture.value = writeTarget.texture;
                renderer.setRenderTarget(null);
                renderer.render(scene, camera);

                // Swap targets for next frame
                [readTarget, writeTarget] = [writeTarget, readTarget];
            };

            animate();
            
            // --- Cleanup and Resize ---
            // ... (resize logic would go here)
            
            return () => {
                // ... cleanup listeners
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mousedown', handleMouseDown);
                window.removeEventListener('mouseup', handleMouseUp);
                 window.removeEventListener('touchstart', handleMouseDown);
                window.removeEventListener('touchend', handleMouseUp);
                window.removeEventListener('touchmove', (e) => handleMouseMove(e.touches[0]));
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
                        Bio-Digital Genesis
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8" style={{textShadow: '0 0 15px rgba(0,0,0,0.9)'}}>
                        A real-time simulation of emergent life. Click and drag to catalyze the evolution of complex, self-organizing systems.
                    </p>
                    <a href="#" className="bg-white text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-white/20 pointer-events-auto">
                        Click any where
                    </a>
                </div>
            </main>
    );
};
