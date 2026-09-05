import React, { useRef, useEffect, Suspense, useMemo } from "react";
import * as THREE from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// --- CONFIGURATION OBJECT V6.0 ---
// This version uses raymarching to render a complex, interactive fractal manifold.
const config = {
    fractal: {
        iterations: 8, // How many layers of detail in the fractal
        power: 8.0, // The exponent for the Mandelbulb-like structure
        distortion: 0.8, // How much the shape twists and evolves
    },
    colors: {
        baseHue: 280, // Deep cosmic purples
        hueVariance: 50,
        lightColor: new THREE.Color(0xffdDBB), // Warm, sun-like light
    },
    simulation: {
        timeSpeed: 0.1, // How fast the fractal evolves
        mouseWarpStrength: 0.5, // How strongly the mouse distorts the manifold
    },
    bloom: {
        strength: 0.6,
        radius: 0.8,
        threshold: 0.0,
    },
    camera: {
        orbitRadius: 6.0,
        fov: 75,
    }
};

// V6.0: Hyper-Dimensional Manifold Scene
export default function GenerativeArtSceneV6() {
    const mountRef = useRef(null);
    const mouseRef = useRef(new THREE.Vector2(0, 0));

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        // --- CORE SETUP ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(config.camera.fov, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);

        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        composer.addPass(new UnrealBloomPass(new THREE.Vector2(currentMount.clientWidth, currentMount.clientHeight), config.bloom.strength, config.bloom.radius, config.bloom.threshold));
        
        // --- RAYMARCHING SETUP ---
        // We only need a simple plane that covers the screen. The magic happens in the fragment shader.
        const planeGeometry = new THREE.PlaneGeometry(2, 2);
        const raymarchMaterial = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0 },
                u_resolution: { value: new THREE.Vector2(currentMount.clientWidth, currentMount.clientHeight) },
                u_mouse: { value: new THREE.Vector2(0, 0) },
                u_cameraPos: { value: new THREE.Vector3() },
                u_cameraLookAt: { value: new THREE.Vector3(0, 0, 0) },
                // Pass config to shader
                u_iterations: { value: config.fractal.iterations },
                u_power: { value: config.fractal.power },
                u_distortion: { value: config.fractal.distortion },
                u_baseHue: { value: config.colors.baseHue },
                u_hueVariance: { value: config.colors.hueVariance },
                u_lightColor: { value: config.colors.lightColor },
                u_mouseWarp: { value: config.simulation.mouseWarpStrength },
            },
            vertexShader: `
                void main() {
                    gl_Position = vec4(position, 1.0);
                }
            `,
            // This is where the entire world is created and rendered
            fragmentShader: `
                precision highp float;
                uniform float u_time;
                uniform vec2 u_resolution;
                uniform vec2 u_mouse;
                uniform vec3 u_cameraPos;
                uniform vec3 u_cameraLookAt;
                
                // Config Uniforms
                uniform int u_iterations;
                uniform float u_power;
                uniform float u_distortion;
                uniform float u_baseHue;
                uniform float u_hueVariance;
                uniform vec3 u_lightColor;
                uniform float u_mouseWarp;

                // HSL to RGB conversion
                vec3 hsl2rgb(vec3 c) {
                    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
                    return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
                }

                // Signed Distance Function (SDF) for the fractal manifold
                // This function defines the shape of our entire world.
                float map(vec3 p) {
                    vec3 original_p = p;
                    float d = 0.0;
                    float power = u_power;

                    // Mouse interaction - warps space
                    vec2 mouse_uv = (u_mouse - u_resolution.xy * 0.5) / u_resolution.y;
                    vec3 mouse_pos = vec3(mouse_uv.x * 4.0, mouse_uv.y * 4.0, u_cameraPos.z - 2.0);
                    float warp = u_mouseWarp / (0.1 + distance(p, mouse_pos));
                    
                    // Fractal iteration (Mandelbulb-like)
                    float dr = 1.0;
                    for (int i = 0; i < u_iterations; i++) {
                        float r = length(p);
                        if (r > 2.0) break;
                        
                        // Spherical coordinates
                        float theta = acos(p.z / r);
                        float phi = atan(p.y, p.x);
                        dr = pow(r, power - 1.0) * power * dr + 1.0;
                        
                        // Scale and rotate
                        float zr = pow(r, power);
                        theta = theta * power;
                        phi = phi * power;
                        
                        // Convert back to cartesian
                        p = zr * vec3(sin(theta) * cos(phi), sin(theta) * sin(phi), cos(theta));
                        
                        // Add distortion over time and the original position to create the final shape
                        p += original_p + sin(u_time * 0.1 + p.yzx * 2.0) * u_distortion;
                    }
                    return 0.5 * log(length(p)) * length(p) / dr - warp;
                }

                // Calculate the normal vector of a surface point (for lighting)
                vec3 calcNormal(vec3 p) {
                    vec2 e = vec2(0.001, 0.0);
                    return normalize(vec3(
                        map(p + e.xyy) - map(p - e.xyy),
                        map(p + e.yxy) - map(p - e.yxy),
                        map(p + e.yyx) - map(p - e.yyx)
                    ));
                }

                void main() {
                    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
                    
                    // Camera setup
                    vec3 ro = u_cameraPos;
                    vec3 ww = normalize(u_cameraLookAt - ro);
                    vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
                    vec3 vv = normalize(cross(uu, ww));
                    vec3 rd = normalize(uv.x * uu + uv.y * vv + 1.5 * ww); // 1.5 is zoom

                    // Raymarching
                    float t = 0.0;
                    vec3 p = ro;
                    float d = 0.0;
                    for (int i = 0; i < 100; i++) {
                        p = ro + rd * t;
                        d = map(p);
                        if (abs(d) < 0.001 || t > 100.0) break;
                        t += d * 0.5;
                    }

                    vec3 col = vec3(0.0);
                    
                    if (abs(d) < 0.001) {
                        vec3 n = calcNormal(p);
                        
                        // Lighting
                        vec3 light_pos = vec3(u_cameraPos.x, u_cameraPos.y, u_cameraPos.z - 1.0);
                        vec3 l = normalize(light_pos - p);
                        float diffuse = max(0.0, dot(n, l));
                        
                        // Fake Ambient Occlusion
                        float ao = clamp(t * 0.05, 0.0, 1.0);
                        
                        // Color based on position and time
                        float hue = (u_baseHue + sin(p.z + u_time * 0.3) * u_hueVariance) / 360.0;
                        vec3 base_color = hsl2rgb(vec3(hue, 0.8, 0.5));
                        
                        // Final color composition
                        col = base_color * (diffuse * u_lightColor + 0.2) * ao;
                    }
                    
                    gl_FragColor = vec4(col, 1.0);
                }
            `
        });
        
        const screenQuad = new THREE.Mesh(planeGeometry, raymarchMaterial);
        scene.add(screenQuad);

        // --- ANIMATION LOOP ---
        let frameId;
        const clock = new THREE.Clock();

        const animate = () => {
            const elapsedTime = clock.getElapsedTime();
            
            // Update camera orbit based on mouse
            const camX = Math.sin(mouseRef.current.x * Math.PI) * config.camera.orbitRadius;
            const camZ = Math.cos(mouseRef.current.x * Math.PI) * config.camera.orbitRadius;
            const camY = mouseRef.current.y * 2.0;
            camera.position.set(camX, camY, camZ);
            camera.lookAt(0, 0, 0);

            // Update uniforms
            raymarchMaterial.uniforms.u_time.value = elapsedTime * config.simulation.timeSpeed;
            raymarchMaterial.uniforms.u_mouse.value.copy(mouseRef.current);
            raymarchMaterial.uniforms.u_cameraPos.value.copy(camera.position);
            
            composer.render();
            frameId = requestAnimationFrame(animate);
        };
        animate();

        // --- EVENT HANDLERS & CLEANUP ---
        const handleResize = () => {
            const width = currentMount.clientWidth;
            const height = currentMount.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            composer.setSize(width, height);
            raymarchMaterial.uniforms.u_resolution.value.set(width, height);
        };
        const handleMouseMove = (e) => {
            // Remap mouse from 0->width to -1->1 for easier use in shaders
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2.0 - 1.0;
            mouseRef.current.y = -(e.clientY / window.innerHeight) * 2.0 + 1.0;
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            if (currentMount && renderer.domElement) {
                currentMount.removeChild(renderer.domElement);
            }
            planeGeometry.dispose();
            raymarchMaterial.dispose();
        };
    }, []);

    return <div ref={mountRef} className="absolute inset-0 w-full h-full z-0" />;
}
