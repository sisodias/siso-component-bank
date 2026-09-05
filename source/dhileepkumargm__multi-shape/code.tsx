"use client";

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// --- Main Component ---
export const MultiShapeLightformHero = () => {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black">
      <LightformCanvas />
    </div>
  );
};

// --- Three.js Canvas Component ---
const LightformCanvas = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();

    // Post-processing for bloom effect
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 1.5;
    bloomPass.radius = 0.5;
    composer.addPass(bloomPass);

    // --- Symbiotic Lightform ---
    const totalParticleCount = 100000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(totalParticleCount * 3);
    const originalPositions = new Float32Array(totalParticleCount * 3);
    const velocities = new Float32Array(totalParticleCount * 3);
    const colors = new Float32Array(totalParticleCount * 3);

    const material = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0,
    });

    // --- Shape Generation ---
    const shapes = [
        { char: '2', offset: new THREE.Vector3(-4, 3, 0) },
        { char: '1', offset: new THREE.Vector3(4, 3, 0) },
        { char: 's', offset: new THREE.Vector3(-4, -3, 0) },
        { char: 't', offset: new THREE.Vector3(4, -3, 0) },
    ];
    const particlesPerShape = Math.floor(totalParticleCount / shapes.length);

    const shapePaths: { [key: string]: THREE.CatmullRomCurve3 } = {
        '2': new THREE.CatmullRomCurve3([
            new THREE.Vector3(1, -1.5, 0), new THREE.Vector3(-1, -1.5, 0), new THREE.Vector3(-1, -0.5, 0), 
            new THREE.Vector3(1, 0.5, 0), new THREE.Vector3(1, 1.5, 0), new THREE.Vector3(-1, 1.5, 0)
        ], false, 'catmullrom', 0.5),
        '1': new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 1.5, 0), new THREE.Vector3(0, -1.5, 0)
        ]),
        's': new THREE.CatmullRomCurve3([
            new THREE.Vector3(1, 1.5, 0), new THREE.Vector3(-1, 1, 0), new THREE.Vector3(1, -1, 0), new THREE.Vector3(-1, -1.5, 0)
        ], false, 'catmullrom', 0.5),
        't': new THREE.CatmullRomCurve3([
            new THREE.Vector3(-1.5, 1.5, 0), new THREE.Vector3(1.5, 1.5, 0), new THREE.Vector3(0, 1.5, 0), new THREE.Vector3(0, -1.5, 0)
        ]),
    };

    let particleIndex = 0;
    shapes.forEach(shape => {
        const curve = shapePaths[shape.char];
        const pointsOnCurve = curve.getPoints(particlesPerShape);
        for (let i = 0; i < particlesPerShape; i++) {
            if (particleIndex >= totalParticleCount) break;
            const i3 = particleIndex * 3;
            const point = pointsOnCurve[i % pointsOnCurve.length];
            
            const pos = new THREE.Vector3(
                point.x + (Math.random() - 0.5) * 0.2,
                point.y + (Math.random() - 0.5) * 0.2,
                point.z + (Math.random() - 0.5) * 0.2
            ).add(shape.offset);

            positions[i3] = pos.x;
            positions[i3 + 1] = pos.y;
            positions[i3 + 2] = pos.z;
            originalPositions[i3] = pos.x;
            originalPositions[i3 + 1] = pos.y;
            originalPositions[i3 + 2] = pos.z;
            particleIndex++;
        }
    });


    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setDrawRange(0, 0); // Initially draw nothing

    const lightform = new THREE.Points(geometry, material);
    scene.add(lightform);

    const handleMouseMove = (event: MouseEvent) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        
        // --- Animation Loop for Write-on Effect ---
        const loopDuration = 8; // Total loop time in seconds
        const timeInLoop = elapsedTime % loopDuration;
        const drawDuration = 3;
        const holdDuration = 2;
        const fadeDuration = 2;

        if (timeInLoop < drawDuration) {
            // Drawing phase
            const progress = timeInLoop / drawDuration;
            const count = Math.floor(progress * totalParticleCount);
            geometry.setDrawRange(0, count);
            material.opacity = 1.0;
        } else if (timeInLoop < drawDuration + holdDuration) {
            // Holding phase
            geometry.setDrawRange(0, totalParticleCount);
            material.opacity = 1.0;
        } else if (timeInLoop < drawDuration + holdDuration + fadeDuration) {
            // Fading phase
            const progress = (timeInLoop - (drawDuration + holdDuration)) / fadeDuration;
            material.opacity = 1.0 - progress;
            geometry.setDrawRange(0, totalParticleCount);
        } else {
            // Waiting phase
            geometry.setDrawRange(0, 0);
            material.opacity = 0.0;
        }

        const mouseWorld = new THREE.Vector3(mouse.x * (window.innerWidth/window.innerHeight) * 4, mouse.y * 4, 0);
        
        const positions = geometry.attributes.position.array as Float32Array;
        const colorsAttribute = geometry.attributes.color.array as Float32Array;

        for (let i = 0; i < totalParticleCount; i++) {
            const i3 = i * 3;
            const pos = new THREE.Vector3(positions[i3], positions[i3+1], positions[i3+2]);
            const originalPos = new THREE.Vector3(originalPositions[i3], originalPositions[i3+1], originalPositions[i3+2]);
            const vel = new THREE.Vector3(velocities[i3], velocities[i3+1], velocities[i3+2]);

            // Attraction to mouse
            const dist = pos.distanceTo(mouseWorld);
            if (dist < 2.5) {
                const force = (2.5 - dist) * 0.05;
                const direction = new THREE.Vector3().subVectors(mouseWorld, pos).normalize();
                vel.add(direction.multiplyScalar(force));
            }

            // Return to original position
            const returnForce = new THREE.Vector3().subVectors(originalPos, pos).multiplyScalar(0.005);
            vel.add(returnForce);

            // Damping
            vel.multiplyScalar(0.95);
            pos.add(vel);

            positions[i3] = pos.x;
            positions[i3+1] = pos.y;
            positions[i3+2] = pos.z;
            velocities[i3] = vel.x; velocities[i3+1] = vel.y; velocities[i3+2] = vel.z;

            // Coloring
            const speed = vel.length();
            const color = new THREE.Color();
            color.setHSL(0.6 + speed * 5.0, 0.8, 0.5 + speed * 2.0 + (1.0 - Math.min(dist/2.5, 1.0)) * 0.5);
            colorsAttribute[i3] = color.r;
            colorsAttribute[i3+1] = color.g;
            colorsAttribute[i3+2] = color.b;
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;

        lightform.rotation.y = elapsedTime * 0.05;
        
        composer.render();
    };
    animate();

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
};


// --- Default Export for Demo ---
export default function App() {
    return <MultiShapeLightformHero />;
}
