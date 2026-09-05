"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { MeshDistortMaterial } from "@react-three/drei"
import type * as THREE from "three"

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<any>(null)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.1
      meshRef.current.rotation.y = time * 0.15
    }

    if (materialRef.current) {
      materialRef.current.distort = 0.4 + Math.sin(time * 0.5) * 0.2
    }
  })

  return (
    <mesh ref={meshRef} scale={2.5}>
      <sphereGeometry args={[1, 128, 128]} />
      <MeshDistortMaterial
        ref={materialRef}
        color="#FF6B35"
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  )
}

export function GradientBackground() {
  return (
    <div className="fixed inset-0 w-full h-screen">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }} gl={{ antialias: true, alpha: false }}>
       
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#FF6B9D" />
        <pointLight position={[10, 10, 5]} intensity={0.5} color="#4CC9F0" />

        
        <AnimatedSphere />
      </Canvas>
    </div>
  )
}
