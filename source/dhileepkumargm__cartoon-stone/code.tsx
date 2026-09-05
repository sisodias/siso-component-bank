'use client';

import React, { Suspense, useRef, useState, useEffect, useMemo, forwardRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * A hook that reads and subscribes to CSS theme variables from the DOM.
 * @returns {{ spotlightColor: THREE.Color, backlightColor: THREE.Color }}
 */
function useThemeAwareLighting() {
  const [lights, setLights] = useState({
    spotlightColor: new THREE.Color('hsl(210 40% 98%)'),
    backlightColor: new THREE.Color('hsl(210 40% 98%)').lerp(new THREE.Color(0xffffff), 0.5),
  });

  useEffect(() => {
    const updateLights = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      const primaryColor = computedStyle.getPropertyValue('--primary').trim();
      
      setLights({
        spotlightColor: new THREE.Color(primaryColor || '#ffffff'),
        backlightColor: new THREE.Color(primaryColor || '#fffde0').lerp(new THREE.Color(0xffffff), 0.5),
      });
    };

    updateLights();
    
    const observer = new MutationObserver(updateLights);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return lights;
}

/**
 * The internal 3D scene for the new character.
 */
const FaceScene = () => {
  const characterRef = useRef();
  const glowingCoreRef = useRef();
  const shardsRef = useRef([]);
  const { spotlightColor, backlightColor } = useThemeAwareLighting();

  // Animation for the character
  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    if (characterRef.current) {
      characterRef.current.rotation.y = elapsedTime * 0.1;
    }
    // Animate the glowing core
    if (glowingCoreRef.current) {
      const scale = 1 + Math.sin(elapsedTime * 2) * 0.1;
      glowingCoreRef.current.scale.set(scale, scale, scale);
    }
    // Animate the individual shards
    shardsRef.current.forEach((shard, i) => {
      if (shard) {
        shard.rotation.x += 0.001 * (i + 1);
        shard.rotation.y += 0.002 * (i + 1);
      }
    });
  });

  const materials = useMemo(() => ({
    crystal: new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 1.0,
        roughness: 0.1,
        thickness: 1.5,
        envMapIntensity: 2,
    }),
    core: new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }),
  }), []);

  return (
    <>
      {/* Lighting setup for a crystalline effect */}
      <ambientLight intensity={0.5} />
      <pointLight color={spotlightColor} intensity={5.0} position={[5, 5, 5]} />
      <pointLight color={backlightColor} intensity={3.0} position={[-5, -5, -5]} />
      
      <group ref={characterRef}>
        {/* Glowing Core */}
        <mesh ref={glowingCoreRef} material={materials.core}>
          <icosahedronGeometry args={[0.5, 0]} />
        </mesh>
        
        {/* Crystalline Shards */}
        {Array.from({ length: 15 }).map((_, i) => {
            const scale = THREE.MathUtils.randFloat(0.3, 1.2);
            const position = new THREE.Vector3(
                THREE.MathUtils.randFloatSpread(2.5),
                THREE.MathUtils.randFloatSpread(2.5),
                THREE.MathUtils.randFloatSpread(2.5)
            );
            const rotation = new THREE.Euler(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            return (
                <mesh
                    key={i}
                    ref={el => shardsRef.current[i] = el}
                    position={position}
                    rotation={rotation}
                    scale={[scale, scale, scale]}
                    material={materials.crystal}
                >
                    <dodecahedronGeometry args={[0.5, 0]} />
                </mesh>
            );
        })}
      </group>
    </>
  );
};

/**
 * The main CartoonFace component.
 */
export const CartoonStone = forwardRef(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={className} {...props} style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        aria-label="An interactive 3D cartoon face that follows the cursor"
        role="img"
      >
        <Suspense fallback={null}>
          <FaceScene />
        </Suspense>
      </Canvas>
    </div>
  );
});
CartoonStone.displayName = "CartoonFace";
