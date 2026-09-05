/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Torus, Cylinder, Stars, Environment, Box } from '@react-three/drei';
import * as THREE from 'three';

const QuantumParticle = ({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      ref.current.position.y = position[1] + Math.sin(t * 2 + position[0]) * 0.2;
      ref.current.rotation.x = t * 0.5;
      ref.current.rotation.z = t * 0.3;
    }
  });

  return (
    <Sphere ref={ref} args={[2, 98, 98]} position={position} scale={scale}>
      <MeshDistortMaterial
        color={color}
        envMapIntensity={1}
        clearcoat={1}
        clearcoatRoughness={0}
        metalness={0.1}
        distort={0.2}
        speed={0.1}
      />
    </Sphere>
  );
};

const MacroscopicWave = () => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
       const t = state.clock.getElapsedTime();
       ref.current.rotation.x = Math.sin(t * 0.1) * 0.7;
       ref.current.rotation.y = t * 0.3;
    }
  });

  return (
    <Torus ref={ref} args={[3, 0.1, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color="#C5A059" emissive="#C5A059" emissiveIntensity={0.5} transparent opacity={0.6} wireframe />
    </Torus>
  );
}

const HeroScene: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full z-0 opacity-100 pointer-events-none">
      <Canvas className="w-full h-full" camera={{ position: [3, 4, 7], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.1}>
          <QuantumParticle position={[0, 0, 0]} color="#ffffff" scale={1.2} />
          <MacroscopicWave />
        </Float>
        
        <Float speed={1} rotationIntensity={0.1} floatIntensity={1}>
           <QuantumParticle position={[1, -2, -2]} color="#C5A059" scale={0.3} />
           <QuantumParticle position={[1, -5, -3]} color="#C5A059" scale={0.6} />
        </Float>

        <Environment preset="sunset" />
        <Stars radius={100} depth={10} count={1000} factor={9} saturation={1} fade speed={1} />
      </Canvas>
    </div>
  );
};

export const Component = () => {
  return (
    <header className="relative w-screen h-screen flex items-center justify-center overflow-hidden bg-[#000000]" style={{ margin: 0, padding: 0, maxWidth: '100vw' }}>
      <HeroScene />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(220,25,15,0.2)_10%,rgba(119,20,20,0.1)_40%,rgba(5,155,215,0.2)_90%)]" />

      <div className="relative z-10 w-full px-12 lg:px-24 text-center">
        <div className="inline-block mb-4 px-3 py-1 border border-[#C5A059] text-[#C5A059] text-xs tracking-[0.2em] uppercase font-bold rounded-full backdrop-blur-sm bg-white/40">
          21st.DEV
        </div>
        <h1 className="font-serif text-6xl md:text-8xl lg:text-[12rem] font-medium leading-tight md:leading-[0.9] mb-8 text-stone-100 drop-shadow-sm">
          AlphaQubit <br/><span className="italic font-normal text-stone-400 text-4xl md:text-6xl lg:text-7xl block mt-9">Quantum Error Correction</span>
        </h1>
        <p className="text-xl md:text-2xl text-stone-700 font-light leading-relaxed mb-12">
          
        </p>
        
        <div className="flex justify-center">
           <div className="group flex flex-col items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors cursor-pointer">
              <span>DISCOVER</span>
              <span className="p-2 border border-stone-300 rounded-full group-hover:border-stone-900 transition-colors bg-white/50">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14m0 0l7-7m-7 7l-7-7"/>
                  </svg>
              </span>
           </div>
        </div>
      </div>
    </header>
  );
};