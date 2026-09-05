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

    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `;

    // Updated fragment shader with a 7-color neon rainbow palette
    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      // Updated to a brighter, more saturated "neon" rainbow palette
      vec3 getColor(float intensity) {
          vec3 color1 = vec3(1.0, 0.05, 0.25); // Neon Red/Pink
          vec3 color2 = vec3(1.0, 0.4, 0.0);   // Neon Orange
          vec3 color3 = vec3(1.0, 1.0, 0.0);   // Neon Yellow
          vec3 color4 = vec3(0.1, 1.0, 0.1);   // Neon Green
          vec3 color5 = vec3(0.2, 0.5, 1.0);   // Neon Blue
          vec3 color6 = vec3(0.7, 0.0, 1.0);   // Neon Indigo/Purple
          vec3 color7 = vec3(1.0, 0.0, 0.7);   // Neon Magenta

          vec3 finalColor = color1;
          finalColor = mix(finalColor, color2, smoothstep(0.0, 0.17, intensity));
          finalColor = mix(finalColor, color3, smoothstep(0.17, 0.34, intensity));
          finalColor = mix(finalColor, color4, smoothstep(0.34, 0.51, intensity));
          finalColor = mix(finalColor, color5, smoothstep(0.51, 0.68, intensity));
          finalColor = mix(finalColor, color6, smoothstep(0.68, 0.85, intensity));
          finalColor = mix(finalColor, color7, smoothstep(0.85, 1.0, intensity));
          
          return finalColor;
      }

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time*0.05;
        float lineWidth = 0.003; // Slightly thicker lines for the spiral

        // Convert to polar coordinates to create the spiral
        float radius = length(uv);
        float angle = atan(uv.y, uv.x);

        float total_intensity = 0.0;
        
        // The new core mathematical pattern, based on a spiral
        for(int i=0; i < 5; i++){
          // We combine radius and angle to create the spiral shape
          float spiral_pattern = radius * 2.0 + angle * 0.5; // Adjust the 0.5 to make the spiral tighter or looser
          total_intensity += lineWidth*float(i*i) / abs(fract(t + float(i)*0.02)*5.0 - spiral_pattern + mod(uv.x+uv.y, 0.2));
        }
        
        // Map the calculated intensity to our color gradient
        vec3 finalColor = getColor(fract(total_intensity * 0.25 + t * 0.1));

        // Multiply the gradient color by the raw intensity to make the bright lines glow
        gl_FragColor = vec4(finalColor * total_intensity, 1.0);
      }
    `;

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

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const onWindowResize = () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };
    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);

    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      uniforms.time.value += 0.05;
      renderer.render(scene, camera);
      if (sceneRef.current) {
        sceneRef.current.animationId = animationId;
      }
    };

    sceneRef.current = { camera, scene, renderer, uniforms, animationId: 0 };
    animate();

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
      className="absolute top-0 left-0 w-full h-full"
      style={{
        background: "#000",
        overflow: "hidden",
      }}
    />
  );
}

export default ShaderAnimation;
  