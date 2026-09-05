"use client";

import React, { useEffect, useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const IrisMaterial = shaderMaterial(
  { iTime: 0.0, pupilSize: 0.4 },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    varying vec2 vUv;
    uniform float iTime;
    uniform float pupilSize;

    vec3 hsl2rgb(vec3 c) {
      vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
      return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
    }

    void main() {
      vec2 centeredUv = vUv - 0.5;
      float dist = length(centeredUv);
      float angle = atan(centeredUv.y, centeredUv.x);
      vec3 color = vec3(0.9);
      float dynamicPupilSize = pupilSize * (0.8 + 0.2 * sin(iTime * 2.0));
      float irisMask = smoothstep(dynamicPupilSize - 0.01, dynamicPupilSize, dist) - smoothstep(0.5, 0.51, dist);

      if (irisMask > 0.0) {
        float lines = sin((angle + iTime * 0.5) * 40.0) * 0.5 + 0.5;
        lines = smoothstep(0.4, 0.6, lines);
        float hue = angle / (2.0 * 3.14159) + 0.5;
        vec3 irisColor = hsl2rgb(vec3(hue, 1.0, 0.5));
        color = mix(irisColor * 0.6, irisColor * 1.5, lines);
        float glow = smoothstep(0.3, 0.0, dist);
        color += vec3(0.2, 0.3, 0.5) * glow * irisMask;
      }

      float pupilMask = 1.0 - smoothstep(dynamicPupilSize - 0.02, dynamicPupilSize, dist);
      color = mix(color, vec3(0.05), pupilMask);
      float highlight = smoothstep(0.05, 0.07, length(centeredUv - vec2(0.1, 0.1)));
      color = mix(color, vec3(1.0), (1.0 - highlight) * pupilMask * 0.5);
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ IrisMaterial });

const Scene = () => {
  const eyeGroup1 = useRef<THREE.Group>(null!);
  const eyeGroup2 = useRef<THREE.Group>(null!);
  const particles = useRef<THREE.Points>(null!);
  const irisMaterial1 = useRef<any>();
  const irisMaterial2 = useRef<any>();

  const mouse = useRef(new THREE.Vector2());
  const lastMouse = useRef(new THREE.Vector2());
  const jiggleVelocity = useRef(new THREE.Vector2());
  const lookTarget = useRef(new THREE.Vector3());

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const newMouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const newMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      mouse.current.set(newMouseX, newMouseY);
      jiggleVelocity.current.x = (newMouseX - lastMouse.current.x) * 0.5;
      jiggleVelocity.current.y = (newMouseY - lastMouse.current.y) * 0.5;
      lastMouse.current.copy(mouse.current);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    lookTarget.current.x += (mouse.current.x * 10 - lookTarget.current.x) * 0.05;
    lookTarget.current.y += (mouse.current.y * 10 - lookTarget.current.y) * 0.05;
    lookTarget.current.z = 15;

    eyeGroup1.current?.lookAt(lookTarget.current);
    eyeGroup2.current?.lookAt(lookTarget.current);

    eyeGroup1.current.rotation.x += jiggleVelocity.current.y * 0.3;
    eyeGroup1.current.rotation.y += jiggleVelocity.current.x * 0.3;
    eyeGroup2.current.rotation.x += jiggleVelocity.current.y * 0.3;
    eyeGroup2.current.rotation.y += jiggleVelocity.current.x * 0.3;

    irisMaterial1.current.iTime = elapsedTime;
    irisMaterial2.current.iTime = elapsedTime;
    particles.current.rotation.y = elapsedTime * 0.05;

    jiggleVelocity.current.multiplyScalar(0.92);
  });

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return positions;
  }, []);

  return (
    <>
      <group ref={eyeGroup1} position={[-4.5, 0, 0]}>
        <mesh>
          <sphereGeometry args={[3, 64, 32]} />
          <irisMaterial ref={irisMaterial1} key={IrisMaterial.key} />
        </mesh>
      </group>
      <group ref={eyeGroup2} position={[4.5, 0, 0]}>
        <mesh>
          <sphereGeometry args={[3, 64, 32]} />
          <irisMaterial ref={irisMaterial2} key={IrisMaterial.key} />
        </mesh>
      </group>
      <points ref={particles}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlePositions.length / 3}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={0xffffff}
          size={0.08}
          blending={THREE.AdditiveBlending}
          transparent
          opacity={0.7}
        />
      </points>
    </>
  );
};

export const CreativeEyes = () => (
  <div className="absolute inset-0 z-0">
    <Canvas camera={{ position: [0, 0, 18], fov: 50 }}>
      <Suspense fallback={null}>
        <Scene />
        <EffectComposer>
          <Bloom intensity={2.2} kernelSize={5} luminanceThreshold={0.05} luminanceSmoothing={0.8} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  </div>
);
