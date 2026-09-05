import * as React from 'react';
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Text, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

const Model = () => {
  const torus = React.useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const materialProps = {
    thickness: 0.4,
    roughness: 0,
    transmission: 1,
    ior: 1.2,
    chromaticAberration: 0.2,
    backside: false,
  }

  useFrame(() => {
    if (torus.current) {
      torus.current.rotation.x += 0.03;
    }
  });

  return (
        <>
            <group scale={viewport.width / 3.75}>
                <Text
                    fontWeight={900}
                    fontSize={0.7}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    position={[0, 0.4, -1]}
                >
                    Liquid Glass
                </Text>
            </group>
            <group scale={viewport.width / 3.75}>
                <Text
                    fontWeight={900}
                    fontSize={0.7}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    position={[0, -0.4, -1]}
                >
                    Donut
                </Text>
            </group>
            <group position={[0, 0, 0]} scale={viewport.width / 10}>
                    <mesh rotation={[Math.PI / 8, Math.PI / 6, 0]} ref={torus}>
                    <torusGeometry args={[1.3 , 0.7, 20, 100, Math.PI * 2]} />
                    <MeshTransmissionMaterial {...materialProps}/>
                </mesh>
            </group>
            <Environment preset="city" background={false} />
        </>
  )
};

export const Component = () => {
  return (
    <main className="h-screen">
        <Canvas className="h-screen w-screen bg-black">
          <Model />
        </Canvas>
    </main>
  );
};
