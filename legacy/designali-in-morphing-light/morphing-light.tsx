"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function MorphingLight() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    camera?: THREE.Camera
    scene?: THREE.Scene
    renderer?: THREE.WebGLRenderer
    clock?: THREE.Clock
    uniforms?: any
    animationId?: number
  }>({})

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // Vertex shader
    const vertexShader = `
      void main() { 
        gl_Position = vec4(position, 1.0); 
      }
    `

    // Fragment shader
    const fragmentShader = `
      // Fragment shader
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = (gl_FragCoord.xy - u_resolution * .5) / u_resolution.yy;

  // Rotate UVs by -90 degrees
  float angle = -1.5708; // -90 degrees in radians
  mat2 rotation = mat2(cos(angle), -sin(angle),
                       sin(angle),  cos(angle));
  uv = rotation * uv;

  float c = distance(uv, vec2(0.0));
  float a = u_time * 2.5;

  vec3 light = vec3(0.5 - acos(sin(c * 4. + a)), 0.5 - acos(sin(c * 8. + a)), 0.0);
  vec3 source = mix(light, vec3(5.), .5 - c);
  vec3 hue = mix(vec3(1.0, 0.41, 0.71), vec3(0.0, 1.0, 1.0), (uv.y - sin(u_time)) * 0.5);
  vec3 color = mix(source, hue, uv.x);

  gl_FragColor = vec4(color, 1.0);
}

    `

    // Initialize Three.js scene
    const clock = new THREE.Clock()
    const camera = new THREE.Camera()
    camera.position.z = 1

    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneGeometry(2, 2)

    const uniforms = {
      u_time: { type: "f", value: 1.0 },
      u_resolution: { type: "v2", value: new THREE.Vector2() },
    }

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)

    container.appendChild(renderer.domElement)

    // Store references
    sceneRef.current = {
      camera,
      scene,
      renderer,
      clock,
      uniforms,
    }

    // Resize handler
    const onWindowResize = () => {
      const width = container.clientWidth
      const height = container.clientHeight

      renderer.setSize(width, height)
      uniforms.u_resolution.value.x = renderer.domElement.width
      uniforms.u_resolution.value.y = renderer.domElement.height
    }

    // Animation loop
    const animate = () => {
      if (!sceneRef.current.uniforms || !sceneRef.current.clock) return

      sceneRef.current.uniforms.u_time.value = sceneRef.current.clock.getElapsedTime()
      renderer.render(scene, camera)
      sceneRef.current.animationId = requestAnimationFrame(animate)
    }

    // Initial setup
    onWindowResize()
    window.addEventListener("resize", onWindowResize)
    animate()

    // Cleanup function
    return () => {
      window.removeEventListener("resize", onWindowResize)

      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId)
      }

      if (sceneRef.current.renderer) {
        container.removeChild(sceneRef.current.renderer.domElement)
        sceneRef.current.renderer.dispose()
      }

      // Clean up geometry and material
      geometry.dispose()
      material.dispose()
    }
  }, [])

  return (
    <div
      className="absolute -z-10 w-full h-screen"
      ref={containerRef} 
    />
  )
}
