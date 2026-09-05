"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function NovaSphere() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      <Canvas className="absolute inset-0" camera={{ position: [0, 0, 12], fov: 60 }} dpr={[1, 2]}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#64ffda" />
        <SpectacularKnowledgeGraph />
      </Canvas>
    </section>
  )
}

function SpectacularKnowledgeGraph() {
  const groupRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)

  // Create a spectacular knowledge graph
  useFrame((state) => {
    if (!groupRef.current) return

    const time = state.clock.getElapsedTime()

    // Continuous rotation
    groupRef.current.rotation.y = time * 0.1
    groupRef.current.rotation.x = Math.sin(time * 0.05) * 0.2

    // Animate particles
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      const colors = particlesRef.current.geometry.attributes.color.array as Float32Array

      for (let i = 0; i < positions.length; i += 3) {
        const index = i / 3

        // Pulsing effect
        const pulse = Math.sin(time * 2 + index * 0.1) * 0.5 + 0.5

        // Color animation
        colors[i] = 0.3 + pulse * 0.4 // R
        colors[i + 1] = 0.8 + pulse * 0.2 // G
        colors[i + 2] = 0.8 + pulse * 0.2 // B
      }

      particlesRef.current.geometry.attributes.color.needsUpdate = true
    }
  })

  // Generate spectacular particle network
  const particleCount = 400
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    // Create layered sphere distribution
    const layer = Math.floor(i / (particleCount / 5))
    const radius = 2 + layer * 1.5

    const phi = Math.acos(-1 + (2 * (i % (particleCount / 5))) / (particleCount / 5))
    const theta = Math.sqrt((particleCount / 5) * Math.PI) * phi

    positions[i * 3] = radius * Math.cos(theta) * Math.sin(phi)
    positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi)
    positions[i * 3 + 2] = radius * Math.cos(phi)

    // Vibrant colors
    colors[i * 3] = 0.3 + Math.random() * 0.4
    colors[i * 3 + 1] = 0.8 + Math.random() * 0.2
    colors[i * 3 + 2] = 0.8 + Math.random() * 0.2
  }

  return (
    <group ref={groupRef}>
      {/* Central core */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#64ffda" transparent opacity={0.3} wireframe />
      </mesh>

      {/* Outer shells */}
      {[2, 3.5, 5].map((radius, i) => (
        <mesh key={i}>
          <sphereGeometry args={[radius, 24, 24]} />
          <meshBasicMaterial color="#64ffda" transparent opacity={0.1} wireframe />
        </mesh>
      ))}

      {/* Spectacular particle network */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={particleCount} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.1} vertexColors transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </points>

      {/* Connection lines between layers */}
      {connectionLines.map((line, i) => (
        <ConnectionLine key={i} start={line.start} end={line.end} delay={i * 0.1} />
      ))}
    </group>
  )
}

function ConnectionLine({ start, end, delay }: { start: number[]; end: number[]; delay: number }) {
  const lineRef = useRef<THREE.Line>(null)

  useFrame((state) => {
    if (!lineRef.current) return

    const time = state.clock.getElapsedTime()
    const material = lineRef.current.material as THREE.LineBasicMaterial

    // Animated opacity
    material.opacity = 0.3 + Math.sin(time * 2 + delay) * 0.2
  })

  const points = [new THREE.Vector3(start[0], start[1], start[2]), new THREE.Vector3(end[0], end[1], end[2])]
  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color="#64ffda" transparent opacity={0.3} />
    </line>
  )
}

// Pre-defined spectacular connections
const connectionLines = [
  { start: [0, 2, 0], end: [1.5, 1, 1] },
  { start: [0, 2, 0], end: [-1.5, 1, 1] },
  { start: [1.5, 1, 1], end: [2, 0, -1] },
  { start: [-1.5, 1, 1], end: [-2, 0, -1] },
  { start: [0, -2, 0], end: [1, -1, 1.5] },
  { start: [0, -2, 0], end: [-1, -1, 1.5] },
  { start: [0, 0, 2], end: [0, 0, -2] },
  { start: [2, 0, -1], end: [0, 0, -2] },
  { start: [-2, 0, -1], end: [0, 0, -2] },
  { start: [1, -1, 1.5], end: [0, 0, 2] },
  { start: [-1, -1, 1.5], end: [0, 0, 2] },
]
