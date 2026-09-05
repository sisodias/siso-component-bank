import React, { useRef, useEffect, Suspense, useMemo } from "react";
import * as THREE from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// --- CONFIGURATION OBJECT V3.0 ---
// This version focuses on a dynamic, interactive particle system.
const config = {
    // Particle system properties
    particles: {
        count: 50000, // Number of particles in the simulation
        size: 0.02,   // Base size of each particle
        boxSize: 5,   // The cubic volume where particles are generated
    },
    // Colors for the scene
    colors: {
        // Using HSL for easier color manipulation and vibrant results
        baseHue: 200, // Base hue for particles (200 is a cyan/blue)
        hueVariance: 20, // How much the hue can vary between particles
    },
    // Animation and simulation properties
    simulation: {
        // Curl noise parameters for organic, swirling motion
        noiseSpeed: 0.1,
        noiseScale: 1.2,
        // How strongly the particles are pushed away from the mouse
        mouseRepulsion: 0.005,
        // How quickly particles return to their original path
        friction: 0.95,
    },
    // Post-processing bloom effect for the glow
    bloom: {
        strength: 0.6, // Intensity of the glow
        radius: 0.4,   // How far the glow spreads
        threshold: 0.1,// Brightness threshold to trigger the bloom
    },
    // Camera settings
    camera: {
        initialDistance: 5,
        parallaxIntensity: 0.005,
    }
};


// v3.0: Interactive Particle Nebula Scene
export default function GenerativeArtSceneV3() {
    const mountRef = useRef(null);
    // Refs for Three.js objects that need to be accessed across renders
    const rendererRef = useRef(null);
    const composerRef = useRef(null);
    const cameraRef = useRef(null);
    const mouseRef = useRef(new THREE.Vector2(0, 0)); // Using a Vector2 for mouse position

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        // --- CORE THREE.JS & POST-PROCESSING SETUP ---

        // 1. Scene and Camera
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        camera.position.z = config.camera.initialDistance;
        cameraRef.current = camera;

        // 2. Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        rendererRef.current = renderer;
        currentMount.appendChild(renderer.domElement);

        // 3. Post-Processing Composer for Bloom Effect
        const renderPass = new RenderPass(scene, camera);
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(currentMount.clientWidth, currentMount.clientHeight), config.bloom.strength, config.bloom.radius, config.bloom.threshold);
        const composer = new EffectComposer(renderer);
        composer.addPass(renderPass);
        composer.addPass(bloomPass);
        composerRef.current = composer;


        // --- PARTICLE SYSTEM CREATION ---
        const particleCount = config.particles.count;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3).fill(0); // For physics simulation
        const baseColor = new THREE.Color();

        for (let i = 0; i < particleCount; i++) {
            // Position particles randomly within a box
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * config.particles.boxSize;
            positions[i3 + 1] = (Math.random() - 0.5) * config.particles.boxSize;
            positions[i3 + 2] = (Math.random() - 0.5) * config.particles.boxSize;

            // Assign a unique, vibrant color to each particle
            const hue = (config.colors.baseHue + (Math.random() - 0.5) * config.colors.hueVariance) / 360;
            baseColor.setHSL(hue, 1.0, 0.6);
            colors[i3] = baseColor.r;
            colors[i3 + 1] = baseColor.g;
            colors[i3 + 2] = baseColor.b;
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // --- SHADER MATERIAL FOR PARTICLES ---
        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                u_pointSize: { value: config.particles.size * renderer.getPixelRatio() }
            },
            vertexShader: `
                attribute vec3 color;
                varying vec3 vColor;
                uniform float u_pointSize;

                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = u_pointSize * (10.0 / -mvPosition.z); // Make particles appear smaller further away
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                void main() {
                    // Create a soft, circular shape for each particle
                    float strength = distance(gl_PointCoord, vec2(0.5));
                    strength = 1.0 - step(0.5, strength);
                    if (strength < 0.01) discard; // Discard transparent fragments for performance

                    gl_FragColor = vec4(vColor, strength);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending, // Brightens where particles overlap
            depthWrite: false, // Important for correct blending
        });

        const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particleSystem);


        // --- ANIMATION & SIMULATION LOOP ---
        let frameId;
        const clock = new THREE.Clock();
        const noise = `
            // Perlin Noise function (same as V2)
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
            vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
            float snoise(vec3 v) {
                const vec2 C = vec2(1.0/6.0, 1.0/3.0);
                const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
                vec3 i = floor(v + dot(v, C.yyy));
                vec3 x0 = v - i + dot(i, C.xxx);
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 i1 = min(g.xyz, l.zxy);
                vec3 i2 = max(g.xyz, l.zxy);
                vec3 x1 = x0 - i1 + C.xxx;
                vec3 x2 = x0 - i2 + C.yyy;
                vec3 x3 = x0 - D.yyy;
                i = mod289(i);
                vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0))
                    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
                float n_ = 0.142857142857;
                vec3 ns = n_ * D.wyz - D.xzx;
                vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
                vec4 x_ = floor(j * ns.z);
                vec4 y_ = floor(j - 7.0 * x_);
                vec4 x = x_ * ns.x + ns.yyyy;
                vec4 y = y_ * ns.x + ns.yyyy;
                vec4 h = 1.0 - abs(x) - abs(y);
                vec4 b0 = vec4(x.xy, y.xy);
                vec4 b1 = vec4(x.zw, y.zw);
                vec4 s0 = floor(b0) * 2.0 + 1.0;
                vec4 s1 = floor(b1) * 2.0 + 1.0;
                vec4 sh = -step(h, vec4(0.0));
                vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
                vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
                vec3 p0 = vec3(a0.xy, h.x);
                vec3 p1 = vec3(a0.zw, h.y);
                vec3 p2 = vec3(a1.xy, h.z);
                vec3 p3 = vec3(a1.zw, h.w);
                vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
                p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
                vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
                m = m * m;
                return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
            }
            // Curl Noise: Creates a divergence-free vector field for swirling motion
            vec3 snoiseVec3( vec3 x ){
                float s  = snoise(vec3( x ));
                float s1 = snoise(vec3( x.y - 19.1, x.z + 33.4, x.x + 47.2 ));
                float s2 = snoise(vec3( x.z + 74.2, x.x - 124.5, x.y + 99.4 ));
                vec3 c = vec3( s, s1, s2 );
                return c;
            }

            vec3 curlNoise( vec3 p, float speed, float scale ){
                vec3 e = vec3( 0.001, 0.001, 0.001 );
                vec3 p_x = p - e.xyy;
                vec3 p_y = p - e.yxy;
                vec3 p_z = p - e.yyx;
                vec3 p_x_ = p + e.xyy;
                vec3 p_y_ = p + e.yxy;
                vec3 p_z_ = p + e.yyx;
                vec3 o_x = snoiseVec3( p_x_ * scale + speed ) - snoiseVec3( p_x * scale + speed );
                vec3 o_y = snoiseVec3( p_y_ * scale + speed ) - snoiseVec3( p_y * scale + speed );
                vec3 o_z = snoiseVec3( p_z_ * scale + speed ) - snoiseVec3( p_z * scale + speed );
                vec3 r = vec3( o_y.z - o_z.y, o_z.x - o_x.z, o_x.y - o_y.x );
                return normalize( r );
            }
        `; // This is just a string, it will be used in the JS logic below.

        // --- CPU-based Particle Simulation ---
        const snoiseFn = (v) => { /* A JS implementation of snoise would be too slow. We'll use a trick. */ return new THREE.Vector3(); };
        const curlNoiseFn = (p, speed, scale) => {
            // A simplified JS curl noise is still too slow. We will simulate forces directly.
            const e = 0.01;
            const p_x = p.clone().sub(new THREE.Vector3(e, 0, 0));
            // ...this approach is not performant.
            // A better way is to use a simpler force calculation on the CPU.
            const noiseVec = new THREE.Vector3(
                Math.sin(p.y * scale + speed),
                Math.cos(p.z * scale + speed),
                Math.sin(p.x * scale + speed)
            ).normalize();
            return noiseVec;
        };


        const animate = () => {
            const elapsedTime = clock.getElapsedTime();
            const positions = particleSystem.geometry.attributes.position.array;
            
            // Update each particle's position based on forces
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                const p = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]);
                
                // 1. Curl Noise Force for swirling
                const curlForce = curlNoiseFn(p, elapsedTime * config.simulation.noiseSpeed, config.simulation.noiseScale);
                
                // 2. Mouse Repulsion Force
                const mouseForce = new THREE.Vector3();
                const mouseTarget = new THREE.Vector3(mouseRef.current.x * (config.particles.boxSize / 2), mouseRef.current.y * (config.particles.boxSize / 2), 0);
                const distanceToMouse = p.distanceTo(mouseTarget);
                if (distanceToMouse < 2) { // Only react if close to the mouse
                    mouseForce.subVectors(p, mouseTarget).normalize().multiplyScalar(1 / (distanceToMouse + 0.1));
                }

                // Update velocity
                velocities[i3] += (curlForce.x * 0.001 + mouseForce.x * config.simulation.mouseRepulsion);
                velocities[i3 + 1] += (curlForce.y * 0.001 + mouseForce.y * config.simulation.mouseRepulsion);
                velocities[i3 + 2] += (curlForce.z * 0.001 + mouseForce.z * config.simulation.mouseRepulsion);
                
                // Apply friction
                velocities[i3] *= config.simulation.friction;
                velocities[i3 + 1] *= config.simulation.friction;
                velocities[i3 + 2] *= config.simulation.friction;

                // Update position
                positions[i3] += velocities[i3];
                positions[i3 + 1] += velocities[i3 + 1];
                positions[i3 + 2] += velocities[i3 + 2];

                // Boundary check: wrap particles around the box
                if (Math.abs(positions[i3]) > config.particles.boxSize / 2) positions[i3] *= -1;
                if (Math.abs(positions[i3+1]) > config.particles.boxSize / 2) positions[i3+1] *= -1;
                if (Math.abs(positions[i3+2]) > config.particles.boxSize / 2) positions[i3+2] *= -1;
            }

            particleSystem.geometry.attributes.position.needsUpdate = true; // Crucial!

            // Camera Parallax
            camera.position.x += (mouseRef.current.x * config.camera.parallaxIntensity - camera.position.x) * 0.02;
            camera.position.y += (-mouseRef.current.y * config.camera.parallaxIntensity - camera.position.y) * 0.02;
            camera.lookAt(scene.position);

            // Use the composer to render the scene with post-processing
            composer.render();
            frameId = requestAnimationFrame(animate);
        };
        animate();


        // --- EVENT HANDLERS & CLEANUP ---
        const handleResize = () => {
            const w = currentMount.clientWidth;
            const h = currentMount.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            composer.setSize(w, h);
        };

        const handleMouseMove = (e) => {
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
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
            particleGeometry.dispose();
            particleMaterial.dispose();
        };
    }, []);

    return <div ref={mountRef} className="absolute inset-0 w-full h-full z-0" />;
}