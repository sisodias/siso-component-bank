"use client";

import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import * as THREE from 'three';

// --- Main Hero Component ---
export const GravitationalMeshHero = () => {
  const textControls = useAnimation();
  const buttonControls = useAnimation();

  useEffect(() => {
    textControls.start(i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05 + 1.5,
        duration: 1.2,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    }));
    buttonControls.start({
        opacity: 1,
        transition: { delay: 2.5, duration: 1 }
    });
  }, [textControls, buttonControls]);

  const headline = "Retrying Digital";
  
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-white dark:bg-black">
      <MeshCanvas />
      <div className="relative z-10 text-center px-4">
        <h1 className="text-6xl font-bold tracking-tight text-slate-900 dark:text-white md:text-8xl" style={{ textShadow: '0 0 50px rgba(0, 0, 0, 0.1)' }}>
            {headline.split("").map((char, i) => (
                <motion.span key={i} custom={i} initial={{ opacity: 0, y: 50 }} animate={textControls} style={{ display: 'inline-block' }}>
                    {char}
                </motion.span>
            ))}
        </h1>
        <motion.p
          custom={headline.length}
          initial={{ opacity: 0, y: 30 }}
          animate={textControls}
          className="mx-auto mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-300"
        >
          “Let’s keep that cinematic backdrop energy, but move the mouse ‘vibe’ for something with a ‘Reteyinh burn’ intensity.”
        </motion.p>
      </div>
    </div>
  );
};

// --- Three.js Canvas Component ---
const MeshCanvas = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;
    const renderer = new THREE.WebGLRenderer({ antias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();

    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // --- Gravitational Mesh ---
    const geometry = new THREE.PlaneGeometry(40, 40, 50, 50);
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0,0) },
            uColor: { value: new THREE.Color(isDarkMode ? 0xa0a0ff : 0x404080) }
        },
        vertexShader: `
            uniform float uTime;
            uniform vec2 uMouse;
            varying float vIntensity;

            void main() {
                vec3 pos = position;
                float mouseDist = distance(pos.xy, uMouse * 20.0);
                
                float warp = 1.0 - smoothstep(0.0, 5.0, mouseDist);
                pos.z += warp * 3.0;
                vIntensity = warp;

                pos.z += sin(pos.x * 0.5 + uTime * 0.5) * 0.1;

                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 uColor;
            varying float vIntensity;
            void main() {
                gl_FragColor = vec4(uColor * vIntensity, vIntensity * 0.8);
            }
        `,
        wireframe: true,
        transparent: true,
        blending: isDarkMode ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const handleMouseMove = (event: MouseEvent) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        
        material.uniforms.uTime.value = elapsedTime;
        material.uniforms.uMouse.value.lerp(mouse, 0.05);

        mesh.rotation.x = -0.2;
        
        renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
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
