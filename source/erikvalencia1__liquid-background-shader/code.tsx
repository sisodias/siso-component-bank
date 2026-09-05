import { useRef, useEffect } from "react";
import * as THREE from "three";

export const LiquidShader = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);

    // Shader material
    const uniforms = {
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      fragmentShader: `
        precision mediump float;
        uniform float u_time;
        uniform vec2 u_resolution;

        void main() {
          vec2 pos = gl_FragCoord.xy / u_resolution.xy;
          float c = 0.0;
          c += sin(pos.x * 50.0 + cos(u_time + pos.y * 10.0 + sin(pos.x * 50.0 + u_time * 2.0))) * 2.0;
          c += cos(pos.x * 20.0 + sin(u_time + pos.y * 10.0 + cos(pos.x * 50.0 + u_time * 2.0))) * 2.0;
          c += sin(pos.x * 30.0 + cos(u_time + pos.y * 10.0 + sin(pos.x * 50.0 + u_time * 2.0))) * 2.0;
          c += cos(pos.x * 10.0 + sin(u_time + pos.y * 10.0 + cos(pos.x * 50.0 + u_time * 2.0))) * 2.0;
          gl_FragColor = vec4(vec3(c + pos.y, c + pos.x, c + pos.x + pos.y), 1.0);
        }
      `,
    });

    // Plane geometry
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return <div ref={canvasRef} className="w-full h-full" />;
};
