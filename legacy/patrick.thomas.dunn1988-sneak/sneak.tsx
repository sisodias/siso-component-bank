"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export const Component = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneInitialized = useRef(false);

  useEffect(() => {
    if (!containerRef.current || sceneInitialized.current) return;
    sceneInitialized.current = true;

    // === Scene Setup ===
    const scene = new THREE.Scene();
    let aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
    const cameraDistance = 3.5;

    const camera = new THREE.OrthographicCamera(
      -cameraDistance * aspect,
      cameraDistance * aspect,
      cameraDistance,
      -cameraDistance,
      0.01,
      1000
    );
    camera.position.set(0, -10, 4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    
    // Clear any existing canvas elements first
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    
    containerRef.current.appendChild(renderer.domElement);
    
    // Use Tailwind's dark mode detection like the official example
    const detectTheme = () => {
      return document.documentElement.classList.contains('dark');
    };

    let currentTheme = detectTheme();
    scene.background = new THREE.Color(currentTheme ? 0x000000 : 0xffffff);

    // === Utility: Create Text Texture ===
    function createTextTexture(text: string): Promise<THREE.Texture> {
      const isDark = detectTheme();
      const textColor = isDark ? '#ffffff' : '#000000';
      const bgColor = isDark ? '#000000' : '#ffffff';
      
      const svg = `
        <svg width="2048" height="512" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="${bgColor}"/>
          <text x="50%" y="50%" 
                font-family="Arial, sans-serif" 
                font-size="240" 
                font-weight="bold" 
                text-anchor="middle" 
                dominant-baseline="middle" 
                fill="${textColor}">${text}</text>
        </svg>
      `;

      const img = new Image();
      const svgBlob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);

      return new Promise((resolve) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = 2048;
          canvas.height = 512;
          const ctx = canvas.getContext("2d")!;
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0);
          const texture = new THREE.CanvasTexture(canvas);
          texture.generateMipmaps = false;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          URL.revokeObjectURL(url);
          resolve(texture);
        };
        img.src = url;
      });
    }

    // === Shader Material ===
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
        uDisplacement: { value: new THREE.Vector3(1000, 1000, 1000) }, // Start far away from text
      },
      vertexShader: `
        varying vec2 vUv;
        uniform vec3 uDisplacement;

        float easeInOutCubic(float x) {
          return x < 0.5 ? 4. * x * x * x : 1. - pow(-2. * x + 2., 3.) / 2.;
        }

        float map(float value, float min1, float max1, float min2, float max2) {
          return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }

        void main() {
          vUv = uv;
          vec3 new_position = position;

          vec4 localPosition = vec4(position, 1.);
          vec4 worldPosition = modelMatrix * localPosition;

          float dist = length(uDisplacement - worldPosition.xyz);
          float min_distance = 3.;

          if (dist < min_distance) {
            float distance_mapped = map(dist, 0., min_distance, 1., 0.);
            float val = easeInOutCubic(distance_mapped) * 1.;
            new_position.z += val;
          }

          gl_Position = projectionMatrix * modelViewMatrix * vec4(new_position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D uTexture;
        void main() {
          vec4 color = texture2D(uTexture, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = vec4(color.rgb, 1.0);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.FrontSide,
    });

    // Load texture
    createTextTexture("HOVER ME").then((texture) => {
      shaderMaterial.uniforms.uTexture.value = texture;
    });

    // === Main text plane (SINGLE PLANE ONLY) ===
    const geometry = new THREE.PlaneGeometry(15, 15, 100, 100);
    const plane = new THREE.Mesh(geometry, shaderMaterial);
    plane.rotation.z = Math.PI / 4;
    scene.add(plane);

    // === Mouse interaction (FIXED BOUNDS) ===
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function onPointerMove(event: PointerEvent) {
      const bounds = containerRef.current!.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObject(plane);

      if (intersects.length > 0) {
        shaderMaterial.uniforms.uDisplacement.value.copy(intersects[0].point);
      }
    }

    // === Resize handling ===
    function onWindowResize() {
      if (!containerRef.current) return;
      aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.left = -cameraDistance * aspect;
      camera.right = cameraDistance * aspect;
      camera.top = cameraDistance;
      camera.bottom = -cameraDistance;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    }

    // Theme change handler
    const handleThemeChange = () => {
      const newTheme = detectTheme();
      if (newTheme !== currentTheme) {
        currentTheme = newTheme;
        scene.background = new THREE.Color(currentTheme ? 0x000000 : 0xffffff);
        
        // Recreate texture with new theme
        createTextTexture("HOVER ME").then((texture) => {
          if (shaderMaterial.uniforms.uTexture.value) {
            shaderMaterial.uniforms.uTexture.value.dispose();
          }
          shaderMaterial.uniforms.uTexture.value = texture;
        });
      }
    };

    // Watch for theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleThemeChange);
    
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class', 'data-theme'] 
    });
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("resize", onWindowResize);

    // === Animation loop ===
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // === Cleanup ===
    return () => {
      sceneInitialized.current = false;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onWindowResize);
      mediaQuery.removeEventListener('change', handleThemeChange);
      observer.disconnect();
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-[600px]" />;
};