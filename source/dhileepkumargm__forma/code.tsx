"use client";

import React, { useRef, useMemo, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import * as Tone from 'tone';

// Internal scene component where all the R3F hooks are used
const FerrofluidScene = () => {
  const fluidPlane = useRef<THREE.Mesh>(null!);
  const { camera } = useThree();
  const mouse3D = useRef(new THREE.Vector3());
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);

  // Audio setup
  const [isAudioReady, setIsAudioReady] = useState(false);
  const audioRefs = useRef<{ drone: Tone.NoiseSynth | null, filter: Tone.Filter | null }>({ drone: null, filter: null });

  useEffect(() => {
    const filter = new Tone.Filter(200, "lowpass").toDestination();
    const drone = new Tone.NoiseSynth({
        noise: { type: "brown" },
        envelope: { attack: 5, decay: 0.1, sustain: 1 },
        volume: -20
    }).connect(filter);
    audioRefs.current = { drone, filter };

    const handleUserInteraction = () => {
      if (!isAudioReady) {
        Tone.start();
        audioRefs.current.drone?.triggerAttack();
        setIsAudioReady(true);
      }
    };
    window.addEventListener('click', handleUserInteraction);
    return () => {
      window.removeEventListener('click', handleUserInteraction);
      audioRefs.current.drone?.dispose();
      audioRefs.current.filter?.dispose();
    };
  }, [isAudioReady]);

  useFrame(({ mouse }) => {
    // Update mouse position in 3D space
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, mouse3D.current);

    // Deform the plane based on mouse position
    if (fluidPlane.current) {
        const positions = fluidPlane.current.geometry.attributes.position;
        let maxDeformation = 0;

        for (let i = 0; i < positions.count; i++) {
            const vertex = new THREE.Vector3().fromBufferAttribute(positions, i);
            const dist = vertex.distanceTo(mouse3D.current);
            const deformation = 10 / (dist * dist + 1) * 5;
            positions.setZ(i, deformation);
            if (deformation > maxDeformation) {
                maxDeformation = deformation;
            }
        }
        positions.needsUpdate = true;
        fluidPlane.current.geometry.computeVertexNormals();
        
        // Update audio based on deformation
        if (isAudioReady && audioRefs.current.filter) {
            const freq = 100 + maxDeformation * 50;
            audioRefs.current.filter.frequency.rampTo(freq, 0.1);
        }
    }
  });

  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight color="hsl(var(--primary))" intensity={5} distance={50} position={[-10, 5, -10]} />
      <pointLight color="hsl(var(--secondary))" intensity={5} distance={50} position={[10, 5, 10]} />
      
      <mesh ref={fluidPlane} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[50, 50, 100, 100]} />
        <meshStandardMaterial
          color="hsl(var(--primary-foreground))"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </>
  );
};

// Main exportable component
export const FerrofluidBackground = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 15, 0], fov: 75 }}>
        <Suspense fallback={null}>
          <FerrofluidScene />
          <EffectComposer>
            <Bloom intensity={1.0} luminanceThreshold={0} luminanceSmoothing={0.9} height={500} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};
