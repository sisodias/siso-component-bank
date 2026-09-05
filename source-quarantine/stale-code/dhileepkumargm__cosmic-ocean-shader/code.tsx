import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CosmicOceanShader = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        // Ensure the component is mounted
        if (!containerRef.current) {
            return;
        }

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        
        let renderer;
        try {
            renderer = new THREE.WebGLRenderer();
        } catch (error) {
            console.error("WebGL is not supported on this browser:", error);
            containerRef.current.innerHTML = '<p style="color: white; text-align: center;">Sorry, your browser does not support WebGL.</p>';
            return;
        }
        
        containerRef.current.appendChild(renderer.domElement);

        // --- SHADER CODE ---
        const vertexShader = `
            void main() {
                gl_Position = vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            precision highp float;
            uniform vec2 iResolution;
            uniform float iTime;

            float hash(vec2 p) {
                p = fract(p * vec2(443.897, 441.423));
                p += dot(p, p.yx + 19.19);
                return fract((p.x + p.y) * p.x);
            }

            float noise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                f = f * f * (3.0 - 2.0 * f);
                float a = hash(i);
                float b = hash(i + vec2(1.0, 0.0));
                float c = hash(i + vec2(0.0, 1.0));
                float d = hash(i + vec2(1.0, 1.0));
                return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
            }

            float fbm(vec2 p) {
                float value = 0.0;
                float amplitude = 0.5;
                for (int i = 0; i < 6; i++) {
                    value += amplitude * noise(p);
                    p *= 2.0;
                    amplitude *= 0.5;
                }
                return value;
            }

            void main() {
                vec2 uv = (gl_FragCoord.xy * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);
                float t = iTime * 0.1;

                vec2 p1 = uv * 2.0 + vec2(t * 0.2);
                float pattern = fbm(p1 + fbm(p1));
                
                vec3 color1 = vec3(0.05, 0.0, 0.15);
                vec3 color2 = vec3(0.1, 0.3, 0.8);
                vec3 color3 = vec3(0.5, 0.8, 1.0);
                
                float sinWave = sin(uv.y * 10.0 + t * 2.0) * 0.5 + 0.5;
                float wavePattern = smoothstep(0.4, 0.6, sinWave + pattern * 0.5);
                
                vec3 color = mix(color1, color2, wavePattern);
                
                float highlights = smoothstep(0.8, 0.9, pattern);
                color = mix(color, color3, highlights);
                
                float vig = 1.0 - length(uv) * 0.5;
                color *= vig;

                gl_FragColor = vec4(color, 1.0);
            }
        `;

        const uniforms = {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2() }
        };

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const onResize = () => {
            if (!containerRef.current) return;
            // Use window dimensions for a full background
            renderer.setSize(window.innerWidth, window.innerHeight);
            uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
        };
        onResize();
        window.addEventListener('resize', onResize);

        let animationFrameId;
        const clock = new THREE.Clock();
        const animate = () => {
            uniforms.iTime.value = clock.getElapsedTime();
            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', onResize);
            cancelAnimationFrame(animationFrameId);
            
            renderer.dispose();
            geometry.dispose();
            material.dispose();
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={containerRef} style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1}} aria-label="Cosmic Ocean animated background" />;
};

export default CosmicOceanShader;
