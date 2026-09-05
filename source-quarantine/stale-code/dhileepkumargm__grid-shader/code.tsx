"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function ScrollingGridShader() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let animationId;

    // --- Shaders ---
    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      
      #define FC gl_FragCoord.xy
      #define R resolution
      #define T time
      #define MN min(R.x,R.y)

      void main(void) {
          vec2 uv = (FC - 0.5 * R) / MN;

          // This is the key line that makes the grid scroll.
          // It offsets the UV coordinates based on the elapsed time.
          uv.x += T * 0.1;

          vec3 col = vec3(0.0);
          float s = 12.0, e = 9e-4;

          // This formula creates the bright lines of the grid.
          col += e / (sin(uv.x * s) * cos(uv.y * s));

          gl_FragColor = vec4(col, 1.0);
      }
    `;

    // --- Three.js Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

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

    // --- Event Listeners and Animation Loop ---
    const onWindowResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };
    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      uniforms.time.value += 0.01; // Adjust speed here
      renderer.render(scene, camera);
    };
    animate();

    // --- Cleanup ---
    return () => {
      window.removeEventListener("resize", onWindowResize);
      cancelAnimationFrame(animationId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{
        background: "#000",
        overflow: "hidden",
        height: "100vh",
      }}
    />
  );
}
