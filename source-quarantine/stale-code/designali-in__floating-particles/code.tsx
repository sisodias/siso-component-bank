"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface FloatingParticlesProps {
  particleCount?: number
  particleColor1?: string
  particleColor2?: string 
  cameraDistance?: number
  rotationSpeed?: number
  particleSize?: number
  antigravityForce?: number
  activationRate?: number
  className?: string
}

export function FloatingParticles({
  particleCount = 10000,
  particleColor1 = "#ffff50",
  particleColor2 = "#99ffcc", 
  cameraDistance = 1000,
  rotationSpeed = 0.1,
  particleSize = 30,
  antigravityForce = 30,
  activationRate = 50,
  className = "",
}: FloatingParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    renderer?: THREE.WebGLRenderer
    scene?: THREE.Scene
    camera?: THREE.PerspectiveCamera
    animationId?: number
    movers?: any[]
    points?: THREE.Points
    points2?: THREE.Points
  }>({})

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Utility functions
    const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min
    const getRadian = (degrees: number) => (degrees * Math.PI) / 180
    const getSpherical = (rad1: number, rad2: number, r: number) => {
      const x = Math.cos(rad1) * Math.cos(rad2) * r
      const z = Math.cos(rad1) * Math.sin(rad2) * r
      const y = Math.sin(rad1) * r
      return [x, y, z]
    }

    // Mover class for particle physics
    class Mover {
      position = new THREE.Vector3()
      velocity = new THREE.Vector3()
      acceleration = new THREE.Vector3()
      anchor = new THREE.Vector3()
      mass = 1
      is_active = false

      init(vector: THREE.Vector3) {
        this.position = vector.clone()
        this.velocity = vector.clone()
        this.anchor = vector.clone()
        this.acceleration.set(0, 0, 0)
        this.is_active = false
      }

      updatePosition() {
        this.position.copy(this.velocity)
      }

      updateVelocity() {
        this.acceleration.divideScalar(this.mass)
        this.velocity.add(this.acceleration)
      }

      applyForce(vector: THREE.Vector3) {
        this.acceleration.add(vector)
      }

      activate() {
        this.is_active = true
      }
    }

    // Initialize Three.js
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0) // transparent background
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x000000, 800, 1600)

    // Camera setup
    const camera = new THREE.PerspectiveCamera(35, width / height, 1, 10000)
    camera.up.set(0, 1, 0)
    const cameraRad1 = getRadian(90)
    let cameraRad2 = getRadian(0)

    const setCameraPosition = () => {
      const points = getSpherical(cameraRad1, cameraRad2, cameraDistance)
      camera.position.set(points[0], points[1], points[2])
      camera.lookAt(0, 0, 0)
    }
    setCameraPosition()

    // Lighting
    const light = new THREE.HemisphereLight(0xffffff, 0x333333, 1)
    const lightPoints = getSpherical(getRadian(60), getRadian(30), 1000)
    light.position.set(lightPoints[0], lightPoints[1], lightPoints[2])
    scene.add(light)

    // Create particle texture (no dot in center)
    const createParticleTexture = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      canvas.width = 200
      canvas.height = 200

      const gradient = ctx.createRadialGradient(100, 100, 0, 100, 100, 100)
      gradient.addColorStop(0.0, "rgba(255, 255, 255, 1)")
      gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.4)")
      gradient.addColorStop(1.0, "rgba(255, 255, 255, 0)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height) // no arc, just gradient

      const texture = new THREE.Texture(canvas)
      texture.minFilter = THREE.NearestFilter
      texture.needsUpdate = true
      return texture
    }

    const texture = createParticleTexture()

    // Create particles
    const movers: Mover[] = []
    const pointsGeometry = new THREE.BufferGeometry()
    const pointsGeometry2 = new THREE.BufferGeometry()

    const pointsMaterial = new THREE.PointsMaterial({
      color: particleColor1,
      size: particleSize,
      transparent: true,
      opacity: 0.8,
      map: texture,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    })

    const pointsMaterial2 = new THREE.PointsMaterial({
      color: particleColor2,
      size: particleSize,
      transparent: true,
      opacity: 0.8,
      map: texture,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    })

    const positions = new Float32Array(particleCount * 3)
    const positions2 = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const mover = new Mover()
      const range = (Math.log(getRandomInt(2, 256)) / Math.log(256)) * 250 + 50
      const rad = getRadian(getRandomInt(0, 360))
      const x = Math.cos(rad) * range
      const z = Math.sin(rad) * range

      mover.init(new THREE.Vector3(x, 1000, z))
      mover.mass = getRandomInt(200, 500) / 100
      movers.push(mover)

      if (i % 2 === 0) {
        positions[i * 3] = x
        positions[i * 3 + 1] = 1000
        positions[i * 3 + 2] = z
      } else {
        positions2[i * 3] = x
        positions2[i * 3 + 1] = 1000
        positions2[i * 3 + 2] = z
      }
    }

    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    pointsGeometry2.setAttribute("position", new THREE.BufferAttribute(positions2, 3))

    const points = new THREE.Points(pointsGeometry, pointsMaterial)
    const points2 = new THREE.Points(pointsGeometry2, pointsMaterial2)

    scene.add(points)
    scene.add(points2)

    // Animation variables
    let lastTimeActivate = Date.now()
    const antigravity = new THREE.Vector3(0, antigravityForce, 0)

    const activateMovers = () => {
      let count = 0
      for (const mover of movers) {
        if (mover.is_active) continue
        mover.activate()
        mover.velocity.y = -300
        count++
        if (count >= activationRate) break
      }
    }

    const updateParticles = () => {
      const positionsArray = pointsGeometry.attributes.position.array as Float32Array
      const positionsArray2 = pointsGeometry2.attributes.position.array as Float32Array

      for (let i = 0; i < movers.length; i++) {
        const mover = movers[i]

        if (mover.is_active) {
          mover.applyForce(antigravity)
          mover.updateVelocity()
          mover.updatePosition()

          if (mover.position.y > 1000) {
            const range = (Math.log(getRandomInt(2, 256)) / Math.log(256)) * 250 + 50
            const rad = getRadian(getRandomInt(0, 360))
            const x = Math.cos(rad) * range
            const z = Math.sin(rad) * range
            mover.init(new THREE.Vector3(x, -300, z))
            mover.mass = getRandomInt(200, 500) / 100
          }
        }

        if (i % 2 === 0) {
          positionsArray[i * 3] = mover.position.x
          positionsArray[i * 3 + 1] = mover.position.y
          positionsArray[i * 3 + 2] = mover.position.z
        } else {
          positionsArray2[i * 3] = mover.position.x
          positionsArray2[i * 3 + 1] = mover.position.y
          positionsArray2[i * 3 + 2] = mover.position.z
        }
      }

      pointsGeometry.attributes.position.needsUpdate = true
      pointsGeometry2.attributes.position.needsUpdate = true
    }

    const rotateCamera = () => {
      cameraRad2 += getRadian(rotationSpeed)
      setCameraPosition()
    }

    const animate = () => {
      const now = Date.now()

      updateParticles()
      rotateCamera()
      renderer.render(scene, camera)

      if (now - lastTimeActivate > 10) {
        activateMovers()
        lastTimeActivate = now
      }

      sceneRef.current.animationId = requestAnimationFrame(animate)
    }

    // Handle resize
    const handleResize = () => {
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight

      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener("resize", handleResize)

    // Store references and start animation
    sceneRef.current = { renderer, scene, camera, movers, points, points2 }
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)

      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId)
      }

      if (sceneRef.current.renderer && container.contains(sceneRef.current.renderer.domElement)) {
        container.removeChild(sceneRef.current.renderer.domElement)
      }

      sceneRef.current.renderer?.dispose()
      pointsGeometry.dispose()
      pointsGeometry2.dispose()
      pointsMaterial.dispose()
      pointsMaterial2.dispose()
      texture.dispose()
    }
  }, [
    particleCount,
    particleColor1,
    particleColor2, 
    cameraDistance,
    rotationSpeed,
    particleSize,
    antigravityForce,
    activationRate,
  ])

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${className}`}
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    />
  )
}
