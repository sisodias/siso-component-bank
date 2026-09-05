"use client";

/**
 * Dependencies:
 * - react
 * - framer-motion
 * - three
 * - clsx
 * - tailwind-merge
 * * Recommended Fonts:
 * - Inter (for body text)
 * - Playfair Display (for headline)
 */

import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utility Function ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Component Props ---
interface CrystalForgeHeroProps {
  /** The main headline text. */
  title?: string;
  /** The descriptive text below the headline. */
  description?: string;
  /** The text for the main action button. */
  buttonText?: string;
  /** The text for the logo/brand name in the navigation. */
  brandName?: string;
}

// --- Main Hero Component ---
export const CrystalForgeHero = ({
  title = "Consciousness Forged.",
  description = "Here, thought becomes light. Click to create your reality.",
  buttonText = "Connect",
  brandName = "CoinLight"
}: CrystalForgeHeroProps) => {
  const textControls = useAnimation();
  const titleId = React.useId();
  const descriptionId = React.useId();

  useEffect(() => {
    // Add elegant fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Playfair+Display:wght@900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    textControls.start(i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05 + 1.5,
        duration: 1.2,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    }));

    return () => {
        document.head.removeChild(link);
    }
  }, [textControls]);

  return (
    <div 
        className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-white dark:bg-black" 
        style={{ cursor: 'none' }}
        role="region"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
    >
      <CrystalCanvas />
      <HeroNav brandName={brandName} buttonText={buttonText} />
      <div className="relative z-10 text-center px-4 pointer-events-none">
        <h1 
            id={titleId}
            className="text-7xl md:text-8xl lg:text-9xl font-black text-slate-900 dark:text-white leading-none tracking-tighter"
            style={{ fontFamily: "'Playfair Display', serif" }}
        >
            {title.split("").map((char, i) => (
                <motion.span key={i} custom={i} initial={{ opacity: 0, y: 50 }} animate={textControls} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
                    {char}
                </motion.span>
            ))}
        </h1>
        <motion.p
          id={descriptionId}
          custom={title.length}
          initial={{ opacity: 0, y: 30 }}
          animate={textControls}
          className="mx-auto mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-300"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {description}
        </motion.p>
      </div>
    </div>
  );
};

// --- Navigation Component ---
export const HeroNav = ({ brandName, buttonText }: { brandName: string, buttonText: string }) => {
    return (
        <motion.nav 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1, duration: 1 } }}
            className="absolute top-0 left-0 right-0 z-20 p-6"
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-slate-800 dark:text-white tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>{brandName}</span>
                </div>
                <button className="bg-slate-900 text-white px-5 py-2 text-sm font-bold rounded-lg hover:bg-slate-700 transition-colors shadow-lg dark:bg-white dark:text-black dark:hover:bg-gray-200" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {buttonText}
                </button>
            </div>
        </motion.nav>
    );
};

// --- Custom Cursor ---
export const CustomCursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (cursorRef.current) {
                cursorRef.current.style.left = `${e.clientX}px`;
                cursorRef.current.style.top = `${e.clientY}px`;
            }
        };
        const onMouseDown = () => cursorRef.current?.classList.add('active');
        const onMouseUp = () => cursorRef.current?.classList.remove('active');

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    return <div ref={cursorRef} className="cursor-dot"></div>;
};


// --- Three.js Canvas Component ---
export const CrystalCanvas = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(0, 0);
    const creationGroup = new THREE.Group();
    scene.add(creationGroup);
    
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Post-processing for bloom effect
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 2.0, 1.2, 0);
    composer.addPass(bloomPass);

    const onMouseDown = (event: MouseEvent) => {
        const crystalMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color().setHSL(Math.random(), 1.0, 0.7),
            emissive: new THREE.Color().setHSL(Math.random(), 1.0, 0.5),
            emissiveIntensity: isDarkMode ? 5 : 1, 
            metalness: 0.95, 
            roughness: 0.1,
            transparent: true, 
            opacity: 0.9
        });
        const crystalGeo = new THREE.IcosahedronGeometry(Math.random() * 1.5 + 0.5, 0);
        const crystal = new THREE.Mesh(crystalGeo, crystalMat);

        const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        vector.unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        const pos = camera.position.clone().add(dir.multiplyScalar(distance));
        crystal.position.copy(pos);

        crystal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        (crystal as any).velocity = new THREE.Vector3((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02);
        creationGroup.add(crystal);
    };

    const onMouseMove = (event: MouseEvent) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
        requestAnimationFrame(animate);
        
        camera.position.z -= 0.01;
        if (camera.position.z < 10) camera.position.z = 30;

        creationGroup.children.forEach(crystal => {
            crystal.position.add((crystal as any).velocity);
            crystal.rotation.x += (crystal as any).velocity.y * 0.1;
            crystal.rotation.y += (crystal as any).velocity.z * 0.1;
        });

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
        window.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
};


// --- Demo / Usage Example ---
export default function App() {
    return (
        <>
            <CustomCursor />
            <style>{`
                .cursor-dot {
                    width: 12px; height: 12px; border: 2px solid #111827;
                    border-radius: 50%; position: fixed; pointer-events: none;
                    transform: translate(-50%, -50%); z-index: 10000;
                    mix-blend-mode: difference;
                    transition: transform 0.2s ease-out, background-color 0.2s ease;
                }
                .dark .cursor-dot {
                    border-color: white;
                }
                .cursor-dot.active {
                    background-color: #ff00ff;
                    transform: translate(-50%, -50%) scale(2.5);
                    border: none;
                }
            `}</style>
            <CrystalForgeHero 
                title="Consciousness Forged."
                description="Here, thought becomes light. Click to create your reality."
                buttonText="Connect"
                brandName="CoinLight"
            />
        </>
    );
}
