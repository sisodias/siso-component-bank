"use client"

import { useRef, useEffect } from "react"
import * as THREE from "three"
import { cn } from "@/lib/utils"

interface InfiniteGridBackgroundProps {
  className?: string
  speed?: number
  gridColor?: string
  gridOpacity?: number
  gridSize?: number
  mouseFollow?: boolean
  mouseRadius?: number
}

// Custom shader for perfect grid rendering
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform float uGridSize;
  uniform vec3 uGridColor;
  uniform float uGridOpacity;
  uniform vec2 uMousePos;
  uniform float uMouseRadius;
  uniform bool uMouseFollow;
  uniform vec2 uResolution;

  varying vec2 vUv;

  void main() {
    // Calculate grid position with scrolling offset
    // vUv: (0,0) is bottom-left, (1,1) is top-right in Three.js
    // To scroll from top-left to bottom-right, we need to offset based on vUv.y (inverted)
    vec2 gridPos = vUv * uResolution;

    // Scroll from bottom-right to top-left (reverse direction)
    float offset = fract(uTime * 0.2) * uGridSize;
    gridPos.x -= offset;
    gridPos.y += offset;

    // Calculate grid cell
    vec2 cellPos = mod(gridPos, uGridSize);
    vec2 cellId = floor(gridPos / uGridSize);

    // Draw grid lines with anti-aliased edges, no叠加 at intersections
    float lineWidth = 1.0;
    float grid = 0.0;

    // Horizontal lines - smooth edges
    float hLine1 = smoothstep(lineWidth, lineWidth + 0.5, cellPos.y);
    float hLine2 = smoothstep(uGridSize - lineWidth - 0.5, uGridSize - lineWidth, cellPos.y);
    float hGrid = (1.0 - hLine1) + (hLine2);

    // Vertical lines - smooth edges
    float vLine1 = smoothstep(lineWidth, lineWidth + 0.5, cellPos.x);
    float vLine2 = smoothstep(uGridSize - lineWidth - 0.5, uGridSize - lineWidth, cellPos.x);
    float vGrid = (1.0 - vLine1) + (vLine2);

    // Use max instead of addition to avoid叠加 at intersections
    grid = max(hGrid, vGrid);

    // Mouse light source effect - illuminate nearby grid lines (square light)
    if (uMouseFollow) {
      vec2 worldPos = vUv * uResolution;

      // Calculate distance from mouse to this pixel (Manhattan-like for square)
      vec2 diff = worldPos - uMousePos;
      float squareDist = max(abs(diff.x), abs(diff.y));

      // Light falloff - bright inside mouse radius square, fades outside
      float lightSize = uMouseRadius * 0.5;
      float lightIntensity = 1.0 - smoothstep(lightSize * 0.5, lightSize * 1.5, squareDist);
      lightIntensity = max(0.0, lightIntensity);

      // Apply light to grid lines - brighter grid lines near mouse
      float litGrid = grid * (1.0 + lightIntensity * 0.75);

      // Also add a subtle glow around the mouse position
      float glow = lightIntensity * 0.15;

      grid = litGrid + glow;
    }

    vec3 color = uGridColor * grid;
    float alpha = grid * uGridOpacity;

    gl_FragColor = vec4(color, alpha);
  }
`

export function Component({
  className,
  speed = 0.5,
  gridColor = "#aabbcc",
  gridOpacity = 0.15,
  gridSize = 40,
  mouseFollow = true,
  mouseRadius = 200,
}: InfiniteGridBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null)
  const gridMeshRef = useRef<THREE.Mesh | null>(null)
  const glowMeshesRef = useRef<
    { mesh: THREE.Mesh; basePosition: { x: number; y: number } }[]
  >([])
  const animationIdRef = useRef<number>(0)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const isInitializedRef = useRef(false)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Setup scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Setup camera
    const camera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      0.1,
      1000
    )
    camera.position.z = 100
    cameraRef.current = camera

    // Parse grid color
    const gridColorVec = new THREE.Color(gridColor)

    // Create shader material
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uGridSize: { value: gridSize },
        uGridColor: { value: gridColorVec },
        uGridOpacity: { value: gridOpacity },
        uMousePos: { value: new THREE.Vector2(width / 2, height / 2) },
        uMouseRadius: { value: mouseRadius },
        uMouseFollow: { value: mouseFollow },
        uResolution: { value: new THREE.Vector2(width, height) },
      },
      transparent: true,
      depthWrite: false,
    })
    materialRef.current = material

    // Create grid plane
    const gridGeometry = new THREE.PlaneGeometry(width, height)
    const gridMesh = new THREE.Mesh(gridGeometry, material)
    gridMesh.position.z = 0
    scene.add(gridMesh)
    gridMeshRef.current = gridMesh

    // Create glow textures and meshes
    const glowCanvas = document.createElement("canvas")
    glowCanvas.width = 512
    glowCanvas.height = 512
    const glowCtx = glowCanvas.getContext("2d")!
    const glowGradient = glowCtx.createRadialGradient(
      512,
      512,
      0,
      512,
      512,
      512
    )
    glowGradient.addColorStop(0, "rgba(255, 255, 255, 1)")
    glowGradient.addColorStop(0.2, "rgba(255, 255, 255, 0.6)")
    glowGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.2)")
    glowGradient.addColorStop(1, "rgba(255, 255, 255, 0)")
    glowCtx.fillStyle = glowGradient
    glowCtx.fillRect(0, 0, 512, 512)
    const glowTex = new THREE.CanvasTexture(glowCanvas)

    const glowSize = Math.max(width, height) * 0.8
    const glowGeometry = new THREE.PlaneGeometry(glowSize, glowSize)
    glowMeshesRef.current = []

    // Top-right glow
    const topRightGlow = new THREE.Mesh(
      glowGeometry,
      new THREE.MeshBasicMaterial({
        map: glowTex.clone(),
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    )
    topRightGlow.position.set(
      width * 0.5 + glowSize * 0.25,
      height * 0.5 + glowSize * 0.25,
      1
    )
    scene.add(topRightGlow)
    glowMeshesRef.current.push({
      mesh: topRightGlow,
      basePosition: {
        x: width * 0.5 + glowSize * 0.25,
        y: height * 0.5 + glowSize * 0.25,
      },
    })

    // Bottom-left glow
    const bottomLeftGlow = new THREE.Mesh(
      glowGeometry.clone(),
      new THREE.MeshBasicMaterial({
        map: glowTex.clone(),
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    )
    bottomLeftGlow.position.set(
      -width * 0.5 - glowSize * 0.25,
      -height * 0.5 - glowSize * 0.25,
      1
    )
    scene.add(bottomLeftGlow)
    glowMeshesRef.current.push({
      mesh: bottomLeftGlow,
      basePosition: {
        x: -width * 0.5 - glowSize * 0.25,
        y: -height * 0.5 - glowSize * 0.25,
      },
    })

    // Mouse tracking
    const mousePosRef = { current: { x: 0, y: 0 } }
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
      if (materialRef.current) {
        materialRef.current.uniforms.uMousePos.value.set(
          mousePosRef.current.x,
          height - mousePosRef.current.y
        )
      }
    }

    container.addEventListener("mousemove", handleMouseMove)

    isInitializedRef.current = true

    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
      renderer.dispose()
      container.removeChild(renderer.domElement)
      gridGeometry.dispose()
      glowGeometry.dispose()
      glowTex.dispose()
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [gridColor, gridOpacity, gridSize, mouseFollow, mouseRadius])

  // Animation loop
  useEffect(() => {
    if (!isInitializedRef.current) return

    const startTime = performance.now()

    const animate = () => {
      const elapsed = (performance.now() - startTime) / 1000

      // Update shader time
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = elapsed * speed
      }

      // Mouse follow for glows
      if (
        mouseFollow &&
        glowMeshesRef.current.length > 0 &&
        materialRef.current
      ) {
        const mouseX =
          materialRef.current.uniforms.uMousePos.value.x -
          containerRef.current!.clientWidth / 2
        const mouseY =
          materialRef.current.uniforms.uMousePos.value.y -
          containerRef.current!.clientHeight / 2

        glowMeshesRef.current.forEach(({ mesh, basePosition }) => {
          const dx = mouseX - basePosition.x
          const dy = mouseY - basePosition.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < mouseRadius) {
            const factor = 1 - distance / mouseRadius
            const opacity = 0.5 + factor * 0.3
            ;(mesh.material as THREE.MeshBasicMaterial).opacity = opacity
          } else {
            ;(mesh.material as THREE.MeshBasicMaterial).opacity = 0.5
          }
        })
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }

      animationIdRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [speed, mouseFollow, mouseRadius])

  // Handle resize
  useEffect(() => {
    if (!containerRef.current || !rendererRef.current || !cameraRef.current)
      return

    const handleResize = () => {
      const container = containerRef.current
      if (!container) return

      const width = container.clientWidth
      const height = container.clientHeight

      rendererRef.current?.setSize(width, height)

      cameraRef.current!.left = -width / 2
      cameraRef.current!.right = width / 2
      cameraRef.current!.top = height / 2
      cameraRef.current!.bottom = -height / 2
      cameraRef.current!.updateProjectionMatrix()

      if (materialRef.current) {
        materialRef.current.uniforms.uResolution.value.set(width, height)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 overflow-hidden", className)}
      style={{ background: "transparent" }}
    />
  )
}
