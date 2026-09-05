import React, { useRef, useEffect, Suspense } from "react";
import * as THREE from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// --- CONFIGURATION OBJECT V2.1 ---
// This version adds post-processing bloom and dynamic color shifting.
const config = {
    colors: {
        plasmaBase: new THREE.Color("#0a84ff"),
        rimColor: new THREE.Color("#0a84ff"),
        starColor: new THREE.Color("#0a84ff"),
    },
    geometry: {
        knotRadius: 1.5,
        tubeRadius: 0.6,
        radialSegments: 200,
        tubularSegments: 32,
    },
    animation: {
        rotationSpeedX: 0.0005,
        rotationSpeedY: 0.001,
        starRotationSpeed: 0.0001,
        cameraBreathingIntensity: 0.2,
        cameraParallaxIntensity: 0.5,
        // New: Speed of the color shift
        hueShiftSpeed: 0.02,
    },
    starfield: {
        starCount: 10000,
        starSize: 0.7,
        fieldRadius: 1000,
    },
    // New: Bloom effect configuration (Values adjusted to reduce glow)
    bloom: {
        strength: 0.6,
        radius: 0.2,
        threshold: 0.2,
    }
};

// v2.1 of the generative art scene with post-processing
export default function GenerativeArtSceneV2_1() {
    const mountRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        // --- CORE THREE.JS SETUP ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            currentMount.clientWidth / currentMount.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);

        // --- POST-PROCESSING SETUP (BLOOM) ---
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(currentMount.clientWidth, currentMount.clientHeight),
            config.bloom.strength,
            config.bloom.radius,
            config.bloom.threshold
        );
        composer.addPass(bloomPass);

        // --- OBJECT CREATION ---
        const starVertices = [];
        for (let i = 0; i < config.starfield.starCount; i++) {
            const x = (Math.random() - 0.5) * config.starfield.fieldRadius * 2;
            const y = (Math.random() - 0.5) * config.starfield.fieldRadius * 2;
            const z = (Math.random() - 0.5) * config.starfield.fieldRadius * 2;
            starVertices.push(x, y, z);
        }
        const starGeometry = new THREE.BufferGeometry();
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const starMaterial = new THREE.PointsMaterial({
            color: config.colors.starColor,
            size: config.starfield.starSize
        });
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        const geometry = new THREE.TorusKnotGeometry(
            config.geometry.knotRadius,
            config.geometry.tubeRadius,
            config.geometry.radialSegments,
            config.geometry.tubularSegments
        );
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0 },
                u_plasma_color: { value: config.colors.plasmaBase },
                u_rim_color: { value: config.colors.rimColor },
            },
            vertexShader: `
                uniform float u_time;
                varying vec3 v_normal;
                varying float v_noise;
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
                void main() {
                    v_normal = normal;
                    float displacement = snoise(position * 1.5 + u_time * 0.2) * 0.25;
                    v_noise = displacement;
                    vec3 newPosition = position + normal * displacement;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                }
            `,
            fragmentShader: `
                uniform float u_time;
                uniform vec3 u_plasma_color;
                uniform vec3 u_rim_color;
                varying vec3 v_normal;
                varying float v_noise;
                // HSL to RGB conversion
                vec3 hsl2rgb(vec3 c) {
                    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
                    return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
                }
                void main() {
                    // Create a pulsating plasma effect
                    float plasma = sin(v_noise * 10.0 + u_time * 0.5);
                    vec3 color = u_plasma_color * (0.6 + 0.4 * plasma);
                    // Create a "rim light" or "fresnel" effect
                    float fresnel = 1.0 - dot(normalize(v_normal), vec3(0.0, 0.0, 1.0));
                    fresnel = pow(fresnel, 2.5);
                    vec3 rimColor = u_rim_color * fresnel;
                    gl_FragColor = vec4(color + rimColor, 1.0);
                }
            `,
            wireframe: false,
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // --- ANIMATION LOOP ---
        let frameId;
        const clock = new THREE.Clock();
        const baseColorHSL = { h: 0, s: 0, l: 0 };
        config.colors.plasmaBase.getHSL(baseColorHSL);

        const animate = () => {
            const elapsedTime = clock.getElapsedTime();
            material.uniforms.u_time.value = elapsedTime;
            
            // New: Animate the hue of the plasma color
            const hueShift = elapsedTime * config.animation.hueShiftSpeed;
            material.uniforms.u_plasma_color.value.setHSL(
                (baseColorHSL.h + hueShift) % 1.0,
                baseColorHSL.s,
                baseColorHSL.l
            );

            mesh.rotation.y += config.animation.rotationSpeedY;
            mesh.rotation.x += config.animation.rotationSpeedX;
            stars.rotation.y += config.animation.starRotationSpeed;

            const parallaxX = mouseRef.current.x * config.animation.cameraParallaxIntensity;
            const parallaxY = -mouseRef.current.y * config.animation.cameraParallaxIntensity;
            camera.position.x += (parallaxX - camera.position.x) * 0.05;
            camera.position.y += (parallaxY - camera.position.y) * 0.05;
            camera.position.z = 5 + Math.sin(elapsedTime * 0.5) * config.animation.cameraBreathingIntensity;
            camera.lookAt(scene.position);

            // Use the composer to render the scene with post-processing
            composer.render();
            frameId = requestAnimationFrame(animate);
        };
        animate();

        // --- EVENT HANDLERS & CLEANUP ---
        const handleResize = () => {
            if (currentMount) {
                camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
                // Also resize the composer
                composer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            }
        };

        const handleMouseMove = (e) => {
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
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
            geometry.dispose();
            material.dispose();
            starGeometry.dispose();
            starMaterial.dispose();
        };
    }, []);

    return <div ref={mountRef} className="absolute inset-0 w-full h-full z-0" />;
}
