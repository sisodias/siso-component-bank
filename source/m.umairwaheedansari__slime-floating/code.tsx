'use client'

import React, { useRef, useEffect } from 'react';

export default function AnimatedHero3D() {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => initThreeJS();
    document.head.appendChild(script);

    return () => cleanup();
  }, []);

  const cleanup = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    if (rendererRef.current) rendererRef.current.dispose();
    if (mountRef.current && rendererRef.current) {
      mountRef.current.removeChild(rendererRef.current.domElement);
    }
  };

  const initThreeJS = () => {
    if (!window.THREE || !mountRef.current) return;
    const { THREE } = window;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1a3a); // deep blue

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 6;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0x224466, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x3399ff, 2, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Helper to generate random blue shades
    const randomBlue = () => {
      const shades = [0x66ccff, 0x3399ff, 0x1e90ff, 0x4682b4, 0x5dade2];
      return shades[Math.floor(Math.random() * shades.length)];
    };

    const objects = [];

    // Main slime
    const mainGeometry = new THREE.SphereGeometry(1.8, 64, 64);
    const mainMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x3399ff,
      metalness: 0.1,
      roughness: 0.1,
      clearcoat: 1,
      transparent: true,
      opacity: 0.85,
      transmission: 0.6,
      thickness: 1.0,
      emissive: 0x001a33,
      emissiveIntensity: 0.3
    });
    const mainSlime = new THREE.Mesh(mainGeometry, mainMaterial);
    scene.add(mainSlime);
    objects.push({ mesh: mainSlime, type: 'main', originalVertices: mainGeometry.attributes.position.array.slice() });

    // Orbiting slimes (reduced count)
    const orbitalRings = [
      { radius: 4, count: 3, speed: 0.2, tilt: 0.3 },
      { radius: 5.5, count: 2, speed: -0.15, tilt: -0.2 }
    ];

    orbitalRings.forEach((ring, ringIndex) => {
      for (let i = 0; i < ring.count; i++) {
        const orbitGeometry = new THREE.SphereGeometry(0.4 + Math.random() * 0.2, 32, 32);
        const orbitMaterial = new THREE.MeshPhysicalMaterial({
          color: randomBlue(),
          metalness: 0.05,
          roughness: 0.1,
          clearcoat: 1.0,
          transparent: true,
          opacity: 0.8,
          transmission: 0.5,
          thickness: 0.6,
          emissive: 0x001a33,
          emissiveIntensity: 0.3
        });

        const orbitSlime = new THREE.Mesh(orbitGeometry, orbitMaterial);
        const angle = (i / ring.count) * Math.PI * 2;
        orbitSlime.position.set(Math.cos(angle) * ring.radius, Math.sin(angle * ring.tilt) * 2, Math.sin(angle) * ring.radius);
        scene.add(orbitSlime);

        objects.push({
          mesh: orbitSlime,
          type: 'orbit',
          index: i,
          ring,
          originalVertices: orbitGeometry.attributes.position.array.slice()
        });
      }
    });

    // Floating slimes (reduced to 4, randomized positions)
    for (let i = 0; i < 4; i++) {
      const floatGeometry = new THREE.SphereGeometry(0.2 + Math.random() * 0.1, 16, 16);
      const floatMaterial = new THREE.MeshPhysicalMaterial({
        color: randomBlue(),
        metalness: 0.05,
        roughness: 0.15,
        clearcoat: 0.8,
        transparent: true,
        opacity: 0.7,
        emissive: 0x001a33,
        emissiveIntensity: 0.2
      });
      const floatSlime = new THREE.Mesh(floatGeometry, floatMaterial);
      floatSlime.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 6);
      scene.add(floatSlime);

      objects.push({
        mesh: floatSlime,
        type: 'float',
        index: i,
        floatOffset: Math.random() * Math.PI * 2,
        originalVertices: floatGeometry.attributes.position.array.slice()
      });
    }

    // Animation
    let time = 0;
    function animate() {
      time += 0.004;

      objects.forEach(({ mesh, type, index = 0, ring, floatOffset = 0, originalVertices }) => {
        if (type === 'main') {
          mesh.position.y = Math.sin(time * 0.6) * 0.3;
          mesh.rotation.y += 0.002;

          const vertices = mesh.geometry.attributes.position.array;
          for (let i = 0; i < vertices.length; i += 3) {
            const noise = Math.sin(time * 1.5 + i) * 0.03;
            vertices[i] = originalVertices[i] * (1 + noise);
            vertices[i + 1] = originalVertices[i + 1] * (1 + noise);
            vertices[i + 2] = originalVertices[i + 2] * (1 + noise);
          }
          mesh.geometry.attributes.position.needsUpdate = true;
          mesh.geometry.computeVertexNormals();
        }

        if (type === 'orbit') {
          const angle = time * ring.speed + (index / ring.count) * Math.PI * 2;
          mesh.position.x = Math.cos(angle) * ring.radius;
          mesh.position.z = Math.sin(angle) * ring.radius;
          mesh.position.y = Math.sin(angle * ring.tilt + time * 0.2) * 2;
          mesh.rotation.y += 0.003;
        }

        if (type === 'float') {
          mesh.position.y += Math.sin(time * 0.6 + floatOffset) * 0.003;
          mesh.position.x += Math.cos(time * 0.3 + floatOffset) * 0.002;
        }
      });

      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    }
    animate();

    // Resize
    const handleResize = () => {
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);
  };
  return (
    <div className="fixed inset-0 w-full h-full">
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
