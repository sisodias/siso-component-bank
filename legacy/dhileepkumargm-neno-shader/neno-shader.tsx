"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function ShaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    camera: THREE.Camera;
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    uniforms: any;
    animationId: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Vertex shader
    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `;

    // Fragment shader - More Creative Version
    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      // 2D rotation function
      mat2 rotate2d(float angle){
          return mat2(cos(angle),-sin(angle),
                      sin(angle),cos(angle));
      }

      // 2D pseudo-random function
      float random(vec2 st){
          return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123);
      }

      void main(void) {
          vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
          float t = time * 0.1;

          // --- Creative UV Distortion ---
          // Make the rings warp and breathe
          uv += vec2(sin(uv.y * 4.0 + t * 2.0), cos(uv.x * 4.0 + t * 2.0)) * 0.1;
          uv = rotate2d(t * 0.25) * uv; // Slowly rotate the whole scene

          // The core calculation, enhanced
          float intensity = 0.0;
          float lineWidth = 0.02; // Make lines a bit thicker

          for(int i=0; i < 7; i++){ // Increase iterations for more complexity
              float i_float = float(i);
              // Use a smoother wave function (sin) for a less harsh pulse
              float wave = sin(t * 2.0 + i_float * 0.5) * 0.5 + 0.5; // normalized sine wave
              intensity += lineWidth / abs(wave - length(uv) + sin(uv.x + uv.y) * 0.1);
          }
          
          // --- Creative Coloring ---
          // Define a cool and a warm color
          vec3 color1 = vec3(0.0, 0.5, 1.0); // Electric Blue
          vec3 color2 = vec3(1.0, 0.2, 0.5); // Magenta/Pink
          
          // Mix colors based on UV position and time for a dynamic gradient
          vec3 baseColor = mix(color1, color2, sin(length(uv) * 2.0 - t) * 0.5 + 0.5);

          // Apply the calculated intensity to the base color
          vec3 finalColor = baseColor * intensity;

          // Add a subtle grain/noise for texture
          finalColor += (random(uv + t) - 0.5) * 0.08;
          
          gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // Initialize Three.js scene
    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
    };

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);

    // Handle window resize
    const onWindowResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };

    // Initial resize
    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);

    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      uniforms.time.value += 0.05;
      renderer.render(scene, camera);

      if (sceneRef.current) {
        sceneRef.current.animationId = animationId;
      }
    };

    // Store scene references for cleanup
    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: 0,
    };

    // Start animation
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener("resize", onWindowResize);

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);

        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement);
        }

        sceneRef.current.renderer.dispose();
        geometry.dispose();
        material.dispose();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{
        background: "#000",
        overflow: "hidden",
      }}
    />
  );
}
