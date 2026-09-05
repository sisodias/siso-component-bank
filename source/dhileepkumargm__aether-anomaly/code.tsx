import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

// --- INITIAL CONFIGURATION ---
// This is the default state. It can be modified in real-time.
const INITIAL_CONFIG = {
    // Scene settings
    scene: {
        bgColor: 0x00000a,
        fogColor: 0x00000a,
        fogDensity: 0.001,
    },
    // Crystal settings
    crystal: {
        size: 5,
        detail: 1,
        color: 0xeeeeff,
        emissiveColor: 0x220033,
        metalness: 0.9,
        roughness: 0.1,
        opacity: 0.8,
        rotationSpeedX: 0.0005,
        rotationSpeedY: 0.001,
    },
    // Wireframe settings
    wireframe: {
        color: 0x892cdc,
        opacity: 0.3,
    },
    // Starfield settings
    stars: {
        count: 15000,
        color: 0x88aaff,
        size: 0.7,
        opacity: 0.8,
    },
    // Light settings
    lights: {
        ambientColor: 0x4040ff,
        ambientIntensity: 0.5,
        pointLight1: { color: 0xff00ff, intensity: 2, distance: 100 },
        pointLight2: { color: 0x00ffff, intensity: 2, distance: 100 },
        pointLight3: { color: 0xffff00, intensity: 1.5, distance: 100 },
    },
    // Mouse interaction settings
    mouseInteract: {
        sensitivity: 5,
        lerpFactor: 0.05,
        parallaxFactor: 0.0001
    }
};

/**
 * A separate component for the UI overlay.
 * This keeps the DOM separate from the 3D canvas logic.
 */
const SceneUI = () => (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10"
         style={{ textShadow: '0 0 10px rgba(0, 255, 255, 0.7), 0 0 20px rgba(255, 0, 255, 0.7)' }}>
        <h1 className="text-4xl md:text-6xl font-bold tracking-widest uppercase">AETHER ANOMALY</h1>
        <p className="text-sm md:text-base text-cyan-300 tracking-widest">MOVE MOUSE TO SHIFT PERSPECTIVE</p>
    </div>
);

/**
 * The main component responsible for rendering the three.js scene.
 * It takes a configuration object as a prop.
 */
const AetherAnomaly = ({ config }) => {
    const mountRef = useRef(null);
    // Use refs to hold three.js objects so they persist across re-renders
    const sceneObjects = useRef({});

    useEffect(() => {
        const mountNode = mountRef.current;
        
        // --- One-time setup ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, mountNode.clientWidth / mountNode.clientHeight, 0.1, 1000);
        camera.position.z = 15;
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mountNode.appendChild(renderer.domElement);

        const mouse = new THREE.Vector2();

        // Store persistent objects
        sceneObjects.current = { scene, camera, renderer, mouse };

        // --- Create objects and add to scene ---
        const geometry = new THREE.IcosahedronGeometry(1, config.crystal.detail); // Size will be set dynamically
        const material = new THREE.MeshStandardMaterial();
        const crystal = new THREE.Mesh(geometry, material);
        scene.add(crystal);
        
        const wireframeMaterial = new THREE.MeshBasicMaterial({ wireframe: true, transparent: true });
        const wireframe = new THREE.Mesh(geometry, wireframeMaterial);
        crystal.add(wireframe);

        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial();
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        const ambientLight = new THREE.AmbientLight();
        scene.add(ambientLight);
        const pointLight1 = new THREE.PointLight();
        scene.add(pointLight1);
        const pointLight2 = new THREE.PointLight();
        scene.add(pointLight2);
        const pointLight3 = new THREE.PointLight();
        scene.add(pointLight3);
        
        // Store objects that need updating
        sceneObjects.current.crystal = crystal;
        sceneObjects.current.wireframe = wireframe;
        sceneObjects.current.stars = stars;
        sceneObjects.current.starGeometry = starGeometry;
        sceneObjects.current.ambientLight = ambientLight;
        sceneObjects.current.pointLight1 = pointLight1;
        sceneObjects.current.pointLight2 = pointLight2;
        sceneObjects.current.pointLight3 = pointLight3;

        // --- Event listeners ---
        const onWindowResize = () => {
            camera.aspect = mountNode.clientWidth / mountNode.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
        };

        const onMouseMove = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener('resize', onWindowResize);
        window.addEventListener('mousemove', onMouseMove);

        // --- Animation loop ---
        let animationFrameId;
        const animate = (time) => {
            const t = time * 0.0002;

            // Use the config passed via props for animations
            crystal.rotation.x += config.crystal.rotationSpeedX;
            crystal.rotation.y += config.crystal.rotationSpeedY;

            pointLight1.position.set(Math.sin(t * 1.1) * 10, Math.cos(t * 1.3) * 10, Math.cos(t * 1.2) * 10);
            pointLight2.position.set(Math.cos(t * 0.9) * 12, Math.sin(t * 0.8) * 12, Math.sin(t * 1.1) * 12);
            pointLight3.position.set(Math.sin(t * 0.7) * 15, Math.cos(t * 0.6) * 15, Math.sin(t * 0.8) * 15);

            const mi = config.mouseInteract;
            camera.position.x += (mouse.x * mi.sensitivity - camera.position.x) * mi.lerpFactor;
            camera.position.y += (mouse.y * mi.sensitivity - camera.position.y) * mi.lerpFactor;
            camera.lookAt(scene.position);

            stars.rotation.y += mouse.x * mi.parallaxFactor;
            stars.rotation.x += mouse.y * mi.parallaxFactor;

            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        // --- Cleanup ---
        return () => {
            window.removeEventListener('resize', onWindowResize);
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animationFrameId);
            mountNode.removeChild(renderer.domElement);
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    // This effect hook listens for changes in the config prop and updates the scene accordingly.
    // This is more efficient than rebuilding the entire scene.
    useEffect(() => {
        const { scene, crystal, wireframe, stars, starGeometry, ambientLight, pointLight1, pointLight2, pointLight3 } = sceneObjects.current;
        
        if (scene) {
            scene.fog = new THREE.FogExp2(config.scene.fogColor, config.scene.fogDensity);

            // Update crystal
            crystal.scale.set(config.crystal.size, config.crystal.size, config.crystal.size);
            Object.assign(crystal.material, {
                color: new THREE.Color(config.crystal.color),
                metalness: config.crystal.metalness,
                roughness: config.crystal.roughness,
                transparent: true,
                opacity: config.crystal.opacity,
                emissive: new THREE.Color(config.crystal.emissiveColor),
            });

            // Update wireframe
            wireframe.scale.set(1.001, 1.001, 1.001);
            Object.assign(wireframe.material, {
                color: new THREE.Color(config.wireframe.color),
                opacity: config.wireframe.opacity,
            });

            // Update stars (recreate vertices if count changes)
            const starVertices = [];
            for (let i = 0; i < config.stars.count; i++) {
                starVertices.push(
                    (Math.random() - 0.5) * 2000,
                    (Math.random() - 0.5) * 2000,
                    (Math.random() - 0.5) * 2000
                );
            }
            starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
            Object.assign(stars.material, {
                color: new THREE.Color(config.stars.color),
                size: config.stars.size,
                opacity: config.stars.opacity,
            });

            // Update lights
            ambientLight.color = new THREE.Color(config.lights.ambientColor);
            ambientLight.intensity = config.lights.ambientIntensity;
            const pl1 = config.lights.pointLight1;
            Object.assign(pointLight1, { color: new THREE.Color(pl1.color), intensity: pl1.intensity, distance: pl1.distance });
            const pl2 = config.lights.pointLight2;
            Object.assign(pointLight2, { color: new THREE.Color(pl2.color), intensity: pl2.intensity, distance: pl2.distance });
            const pl3 = config.lights.pointLight3;
            Object.assign(pointLight3, { color: new THREE.Color(pl3.color), intensity: pl3.intensity, distance: pl3.distance });
        }
    }, [config]); // This effect re-runs whenever the config prop changes

    return <div ref={mountRef} className="w-full h-full" />;
};

/**
 * Main App component.
 * This is where you would add UI controls to modify the config state.
 */
export default function App() {
    const [config, setConfig] = useState(INITIAL_CONFIG);

    // Example of how you could add a control to change the config:
    // <button onClick={() => setConfig(prev => ({...prev, crystal: {...prev.crystal, color: 0xff0000}}))}>
    //   Turn Crystal Red
    // </button>

    return (
        <div className="relative w-screen h-screen bg-[#00000a] text-white font-['Orbitron',_sans-serif] cursor-crosshair overflow-hidden">
            <SceneUI />
            <AetherAnomaly config={config} />
        </div>
    );
}

