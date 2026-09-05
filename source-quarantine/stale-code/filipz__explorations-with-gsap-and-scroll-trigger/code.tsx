// src/components/ui/component.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export function NebulaCube() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cubeRef = useRef<THREE.Mesh | null>(null);
  const cubeGroupRef = useRef<THREE.Group | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight | null>(null);

  const mouse = useRef({ x: 0, y:  0 });
  const uniformsRef = useRef({
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector2(512, 512) },
    scrollProgress: { value: 0.0 }
  });

  // Create an enhanced star texture
  function createStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.1, 'rgba(255, 255, 255, 0.95)');
    gradient.addColorStop(0.3, 'rgba(200, 200, 255, 0.7)');
    gradient.addColorStop(0.6, 'rgba(140, 140, 230, 0.4)');
    gradient.addColorStop(1, 'rgba(40, 40, 120, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    ctx.globalCompositeOperation = 'lighten';
    const linearGradient = ctx.createLinearGradient(32, 0, 32, 64);
    linearGradient.addColorStop(0, 'rgba(100, 100, 230, 0)');
    linearGradient.addColorStop(0.5, 'rgba(250, 250, 255, 0.7)');
    linearGradient.addColorStop(1, 'rgba(100, 100, 230, 0)');

    ctx.fillStyle = linearGradient;
    ctx.fillRect(28, 0, 8, 64);

    const horizontalGradient = ctx.createLinearGradient(0, 32, 64, 32);
    horizontalGradient.addColorStop(0, 'rgba(100, 100, 230, 0)');
    horizontalGradient.addColorStop(0.5, 'rgba(250, 250, 255, 0.7)');
    horizontalGradient.addColorStop(1, 'rgba(100, 100, 230, 0)');

    ctx.fillStyle = horizontalGradient;
    ctx.fillRect(0, 28, 64, 8);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  const starTexture = createStarTexture();

  // Enhanced galaxy shader
  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;

    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float iTime;
    uniform vec2 iResolution;
    uniform float scrollProgress;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;

    void mainImage(out vec4 O, vec2 I) {
        vec2 r = iResolution.xy;
        vec2 z;
        vec2 i;
        vec2 f = I*(z+=4.-4.*abs(.7-dot(I=(I+I-r)/r.y, I)));

        float timeOffset = sin(iTime * 0.2) * 0.1;
        f.x += timeOffset;
        f.y -= timeOffset;

        float iterations = mix(8.0, 12.0, scrollProgress);

        for(O *= 0.; i.y++<iterations;
            O += (sin(f += cos(f.yx*i.y+i+iTime)/i.y+.7)+1.).xyyx
            * abs(f.x-f.y));

        O = tanh(7.*exp(z.x-4.-I.y*vec4(-1,1,2,0))/O);

        float pulse = 1.0 + 0.2 * sin(iTime * 0.5);
        O.rgb *= pulse;

        float nebula = sin(I.x * 0.01 + iTime * 0.3) * sin(I.y * 0.01 - iTime * 0.2);
        nebula = abs(nebula) * 0.5;

        vec3 color1 = mix(vec3(0.1, 0.2, 0.8), vec3(0.8, 0.1, 0.5), scrollProgress);
        vec3 color2 = mix(vec3(0.8, 0.2, 0.7), vec3(0.2, 0.8, 0.7), scrollProgress);
        vec3 colorMix = mix(color1, color2, sin(iTime * 0.2) * 0.5 + 0.5);

        O.rgb = mix(O.rgb, colorMix, nebula * (1.0 - length(O.rgb)));
    }

    void main() {
        vec2 cubeUV = vUv * iResolution;

        vec4 fragColor;
        mainImage(fragColor, cubeUV);

        float depthFactor = abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
        fragColor.rgb *= 0.7 + 0.3 * depthFactor;

        float edge = 1.0 - max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)) * 2.0;
        edge = pow(edge, 4.0);
        fragColor.rgb += edge * vec3(0.1, 0.2, 0.8) * (0.6 + scrollProgress * 0.4);

        fragColor.rgb *= 2.0;

        gl_FragColor = fragColor;
    }
  `;

  // Enhanced particle system setup
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const constellationSystemRef = useRef<THREE.LineSegments | null>(null);
  const particleSettingsRef = useRef({
    PARTICLE_COUNT: 2000,
    PARTICLE_MOUSE_INFLUENCE: 0.0001,
    PARTICLE_REPULSION_RADIUS: 0.8,
    PARTICLE_REPULSION_STRENGTH: 0.00008,
    PARTICLE_CONNECTION_DISTANCE: 0.5,
    PARTICLE_DEPTH_RANGE: 12
  });

  function createEnhancedParticles() {
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = particleSettingsRef.current.PARTICLE_COUNT;
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    const depths = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const radius = 3 + Math.random() * 3;
      const depthExtension =
        Math.random() * particleSettingsRef.current.PARTICLE_DEPTH_RANGE -
        particleSettingsRef.current.PARTICLE_DEPTH_RANGE / 2;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi) + depthExtension;

      originalPositions[i * 3] = positions[i * 3];
      originalPositions[i * 3 + 1] = positions[i * 3 + 1];
      originalPositions[i * 3 + 2] = positions[i * 3 + 2];

      depths[i] = positions[i * 3 + 2];

      velocities[i * 3] = (Math.random() - 0.5) * 0.0004;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.0004;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.0002;

      const z = positions[i * 3 + 2];
      const normalizedDepth =
        (z + particleSettingsRef.current.PARTICLE_DEPTH_RANGE / 2) /
        particleSettingsRef.current.PARTICLE_DEPTH_RANGE;
      sizes[i] = 0.008 + 0.03 * (1 - normalizedDepth);

      const brightness = 0.5 + 0.5 * (1 - normalizedDepth);
      colors[i * 3] = 0.4 + 0.3 * brightness;
      colors[i * 3 + 1] = 0.4 + 0.3 * brightness;
      colors[i * 3 + 2] = 0.7 + 0.3 * brightness;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('originalPosition', new THREE.BufferAttribute(originalPositions, 3));
    particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('depth', new THREE.BufferAttribute(depths, 1));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.03,
      map: starTexture,
      transparent: true,
      vertexColors: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    sceneRef.current?.add(particleSystem);

    const constellationMaterial = new THREE.LineBasicMaterial({
      color: 0x4488ff,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending
    });

    const constellationGeometry = new THREE.BufferGeometry();
    const constellationSystem = new THREE.LineSegments(
      constellationGeometry,
      constellationMaterial
    );
    sceneRef.current?.add(constellationSystem);

    return { particleSystem, constellationSystem };
  }

  function updateParticleZoom(scrollProgress: number) {
    if (!particleSystemRef.current) return;

    const particleSystem = particleSystemRef.current;
    const positions = particleSystem.geometry.attributes.position.array as Float32Array;
    const originalPositions = particleSystem.geometry.attributes.originalPosition.array as Float32Array;
    const sizes = particleSystem.geometry.attributes.size.array as Float32Array;
    const colors = particleSystem.geometry.attributes.color.array as Float32Array;
    const particleCount = positions.length / 3;

    let zoomCurve;
    if (scrollProgress < 0.5) {
      zoomCurve = gsap.utils.clamp(0, 1, scrollProgress * 2);
    } else {
      zoomCurve = gsap.utils.clamp(0, 1, 2 - scrollProgress * 2);
    }
    zoomCurve = gsap.parseEase('power2.inOut')(zoomCurve);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      const zPosition = originalPositions[i3 + 2];
      positions[i3] = originalPositions[i3] * (1 + zoomCurve * 1.5);
      positions[i3 + 1] = originalPositions[i3 + 1] * (1 + zoomCurve * 1.5);

      let targetZ = zPosition;
      if (Math.abs(zPosition) > 1) {
        targetZ = zPosition * (1 - zoomCurve * 0.5);
      } else {
        targetZ = zPosition - zoomCurve * Math.sign(zPosition) * 2;
      }
      positions[i3 + 2] = lerp(positions[i3 + 2], targetZ, 0.1);

      const distFromCamera = Math.abs(positions[i3 + 2]);
      const closenessFactor = Math.max(0, 1 - distFromCamera / 5);
      const sizeBoost = 1 + zoomCurve * 4.0;
      sizes[i] = (0.008 + 0.03 * closenessFactor) * sizeBoost;

      const brightnessBoost = zoomCurve * 0.3;
      const baseBrightness = 0.5 + closenessFactor * 0.5;
      const brightness = baseBrightness + brightnessBoost;

      colors[i3] = 0.4 + 0.3 * brightness;
      colors[i3 + 1] = 0.4 + 0.3 * brightness;
      colors[i3 + 2] = 0.7 + 0.3 * brightness;
    }

    particleSystem.geometry.attributes.position.needsUpdate = true;
    particleSystem.geometry.attributes.size.needsUpdate = true;
    particleSystem.geometry.attributes.color.needsUpdate = true;
  }

  // Particle effects logic
  const particleEffectsRef = useRef({
    emitFromCube: (count = 15) => {
      if (!particleSystemRef.current) return;
      const particleSystem = particleSystemRef.current;
      const positions = particleSystem.geometry.attributes.position.array as Float32Array;
      const velocities = particleSystem.geometry.attributes.velocity.array as Float32Array;
      const sizes = particleSystem.geometry.attributes.size.array as Float32Array;
      const colors = particleSystem.geometry.attributes.color.array as Float32Array;
      const particleCount = positions.length / 3;
      const cubeVertices: THREE.Vector3[] = [];
      const positionAttr = cubeRef.current?.geometry.attributes.position;

      if (positionAttr && cubeGroupRef.current) {
        for (let i = 0; i < positionAttr.count; i++) {
          cubeVertices.push(
            new THREE.Vector3(
              positionAttr.getX(i),
              positionAttr.getY(i),
              positionAttr.getZ(i)
            )
          );
        }

        for (let i = 0; i < count; i++) {
          const particleIndex = Math.floor(Math.random() * particleCount);
          const i3 = particleIndex * 3;
          const vertexIndex = Math.floor(Math.random() * cubeVertices.length);
          const vertex = cubeVertices[vertexIndex].clone();
          vertex.applyMatrix4(cubeGroupRef.current.matrixWorld);

          positions[i3] = vertex.x;
          positions[i3 + 1] = vertex.y;
          positions[i3 + 2] = vertex.z;

          const speed = 0.02 + Math.random() * 0.04;
          velocities[i3] = (Math.random() - 0.5) * speed;
          velocities[i3 + 1] = (Math.random() - 0.5) * speed;
          velocities[i3 + 2] = (Math.random() - 0.5) * speed;

          sizes[particleIndex] = 0.03 + Math.random() * 0.03;
          colors[i3] = 0.8 + Math.random() * 0.2;
          colors[i3 + 1] = 0.8 + Math.random() * 0.2;
          colors[i3 + 2] = 1.0;
        }

        particleSystem.geometry.attributes.position.needsUpdate = true;
        particleSystem.geometry.attributes.velocity.needsUpdate = true;
        particleSystem.geometry.attributes.size.needsUpdate = true;
        particleSystem.geometry.attributes.color.needsUpdate = true;
      }
    },
    createWhirlpool: (duration = 2.0) => {
      if (!particleSystemRef.current) return;
      const particleSystem = particleSystemRef.current;
      const positions = particleSystem.geometry.attributes.position.array as Float32Array;
      const velocities = particleSystem.geometry.attributes.velocity.array as Float32Array;
      const particleCount = positions.length / 3;
      const originalVelocities = new Float32Array(velocities);
      let startTime = performance.now();

      function animateWhirlpool() {
        const elapsed = (performance.now() - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1.0);

        if (progress < 1.0 && cubeGroupRef.current) {
          for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const dx = positions[i3] - cubeGroupRef.current.position.x;
            const dy = positions[i3 + 1] - cubeGroupRef.current.position.y;
            const dz = positions[i3 + 2] - cubeGroupRef.current.position.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (distance < 8) {
              const strength = (1 - Math.min(distance / 8, 1)) * 0.001;
              const angle = Math.atan2(dy, dx) + 0.05;
              const fx = -dy * strength;
              const fy = dx * strength;
              const fz = -0.0002 * distance;
              velocities[i3] = originalVelocities[i3] + fx;
              velocities[i3 + 1] = originalVelocities[i3 + 1] + fy;
              velocities[i3 + 2] = originalVelocities[i3 + 2] + fz;
            }
          }
          particleSystem.geometry.attributes.velocity.needsUpdate = true;
          requestAnimationFrame(animateWhirlpool);
        } else {
          for (let i = 0; i < velocities.length; i++) {
            velocities[i] = originalVelocities[i];
          }
          particleSystem.geometry.attributes.velocity.needsUpdate = true;
        }
      }
      animateWhirlpool();
    },
    emitPulseWave: () => {
      if (!particleSystemRef.current) return;
      const particleSystem = particleSystemRef.current;
      const positions = particleSystem.geometry.attributes.position.array as Float32Array;
      const sizes = particleSystem.geometry.attributes.size.array as Float32Array;
      const colors = particleSystem.geometry.attributes.color.array as Float32Array;
      const particleCount = positions.length / 3;
      const originalSizes = new Float32Array(sizes);
      const originalColors = new Float32Array(colors);
      const waveSpeed = 3;
      const waveDuration = 2.5;
      const waveWidth = 1.0;
      let startTime = performance.now();

      function animatePulseWave() {
        const elapsed = (performance.now() - startTime) / 1000;
        const waveDistance = elapsed * waveSpeed;

        if (elapsed < waveDuration) {
          for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const dx = positions[i3] - (cubeGroupRef.current?.position.x ?? 0);
            const dy = positions[i3 + 1] - (cubeGroupRef.current?.position.y ?? 0);
            const dz = positions[i3 + 2] - (cubeGroupRef.current?.position.z ?? 0);
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            const distFromWave = Math.abs(distance - waveDistance);

            if (distFromWave < waveWidth) {
              const waveIntensity = 1 - distFromWave / waveWidth;
              sizes[i] = originalSizes[i] * (1 + waveIntensity * 2);
              colors[i3] = originalColors[i3] + waveIntensity * 0.4;
              colors[i3 + 1] = originalColors[i3 + 1] + waveIntensity * 0.2;
              colors[i3 + 2] = originalColors[i3 + 2] + waveIntensity * 0.7;
            } else {
              sizes[i] = originalSizes[i];
              colors[i3] = originalColors[i3];
              colors[i3 + 1] = originalColors[i3 + 1];
              colors[i3 + 2] = originalColors[i3 + 2];
            }
          }
          particleSystem.geometry.attributes.size.needsUpdate = true;
          particleSystem.geometry.attributes.color.needsUpdate = true;
          requestAnimationFrame(animatePulseWave);
        } else {
          for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            sizes[i] = originalSizes[i];
            colors[i3] = originalColors[i3];
            colors[i3 + 1] = originalColors[i3 + 1];
            colors[i3 + 2] = originalColors[i3 + 2];
          }
          particleSystem.geometry.attributes.size.needsUpdate = true;
          particleSystem.geometry.attributes.color.needsUpdate = true;
        }
      }
      animatePulseWave();
    }
  });

  useEffect(() => {
    const mountElement = mountRef.current;
    if (!mountElement) return;

    // Initialize scene, camera, renderer
    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountElement.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const canvas = renderer.domElement;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '10';
    canvas.style.pointerEvents = 'none';

    // Cube setup
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);
    cubeGroupRef.current = cubeGroup;

    const geometry = new THREE.BoxGeometry(2, 2, 2, 4, 4, 4);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: uniformsRef.current,
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide
    });

    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cubeRef.current = cube;
    cubeGroup.add(cube);

    const wireframe = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry, 10),
      new THREE.LineBasicMaterial({
        color: 0x4488ff,
        linewidth: 1.5,
        transparent: true,
        opacity: 0.1
      })
    );
    wireframe.scale.setScalar(1.001);
    cubeGroup.add(wireframe);

    // Particles
    const particlesData = createEnhancedParticles();
    if (particlesData) {
      particleSystemRef.current = particlesData.particleSystem;
      constellationSystemRef.current = particlesData.constellationSystem;
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    directionalLightRef.current = directionalLight;

    const pointLight = new THREE.PointLight(0x3366ff, 1.5, 20);
    pointLight.position.set(-3, 2, 5);
    scene.add(pointLight);
    pointLightRef.current = pointLight;

    // Scroll animations
    const scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.content',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
        markers: false,
        onUpdate: (self) => {
          uniformsRef.current.scrollProgress.value = self.progress;
          updateParticleZoom(self.progress);

          let zoomCurve;
          if (self.progress < 0.5) {
            zoomCurve = gsap.utils.clamp(0, 1, self.progress * 2);
          } else {
            zoomCurve = gsap.utils.clamp(0, 1, 2 - self.progress * 2);
          }
          zoomCurve = gsap.parseEase('power2.inOut')(zoomCurve);

          if (cameraRef.current) {
            const minFOV = 20;
            const maxFOV = 60;
            cameraRef.current.fov = maxFOV - (maxFOV - minFOV) * zoomCurve;
            cameraRef.current.updateProjectionMatrix();
          }

          if (cubeGroupRef.current) {
            const maxScale = 1.2;
            cubeGroupRef.current.scale.setScalar(1 + (maxScale - 1) * zoomCurve);
          }
        }
      }
    });

    scrollTimeline
      .to(cubeGroupRef.current?.rotation, {
        x: Math.PI * 1.2,
        y: Math.PI * 2,
        z: Math.PI * 0.3,
        ease: 'power2.inOut',
        immediateRender: false
      })
      .to(
        cameraRef.current?.position,
        {
          z: 0.8,
          y: 0.2,
          x: 0,
          ease: 'power2.inOut'
        },
        0.5
      )
      .to(
        cameraRef.current?.position,
        {
          z: 4.0,
          y: 0,
          x: 0,
          ease: 'power2.inOut'
        },
        1.0
      )
      .to(
        {},
        {
          duration: 1,
          onUpdate: function () {
            if (cameraRef.current && cubeGroupRef.current) {
              cameraRef.current.lookAt(cubeGroupRef.current.position);
            }
          }
        },
        0
      );

    scrollTimeline.to(
      ambientLightRef.current,
      {
        intensity: 1.2,
        ease: 'power1.inOut'
      },
      0
    );

    // Text animations
    const titles = document.querySelectorAll('.title');
    const descriptions = document.querySelectorAll('.description');

    document.querySelectorAll('.section').forEach((section, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1,
          toggleActions: 'play none none reverse'
        }
      });

      tl.to(titles[index], { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, 0);
      tl.to(descriptions[index], { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.2 }, 0);

      tl.to(
        cubeGroupRef.current?.position,
        { z: -1 * index, duration: 1 },
        0
      );
    });

    // Resize handler
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        uniformsRef.current.iResolution.value.set(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      };
      if (!ScrollTrigger.isScrolling() && cubeGroupRef.current) {
        gsap.to(cubeGroupRef.current.rotation, {
          x: '+=0.03',
          y: '+=0.03',
          duration: 1,
          ease: 'power2.out',
          overwrite: 'auto',
          modifiers: {
            x: (x) => parseFloat(x) + (mouse.current.y * 0.03 - parseFloat(x) * 0.02),
            y: (y) => parseFloat(y) + (mouse.current.x * 0.03 - parseFloat(y) * 0.02)
          }
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Click handler
    const handleClick = () => {
      if (cubeGroupRef.current) {
        gsap.to(cubeGroupRef.current.rotation, {
          x: cubeGroupRef.current.rotation.x + Math.PI * 0.25 * (Math.random() - 0.5),
          y: cubeGroupRef.current.rotation.y + Math.PI * 0.25 * (Math.random() - 0.5),
          z: cubeGroupRef.current.rotation.z + Math.PI * 0.25 * (Math.random() - 0.5),
          duration: 1,
          ease: 'back.out(1.5)'
        });
      }

      const effectChoice = Math.floor(Math.random() * 3);
      switch (effectChoice) {
        case 0: particleEffectsRef.current.emitFromCube(); break;
        case 1: particleEffectsRef.current.createWhirlpool(); break;
        case 2: particleEffectsRef.current.emitPulseWave(); break;
      }
    };
    document.addEventListener('click', handleClick);

    // Animation loop
    function animate(timestamp: number) {
      requestAnimationFrame(animate);

      const timeSeconds = timestamp * 0.001;
      uniformsRef.current.iTime.value = timeSeconds;

      if (!ScrollTrigger.isScrolling() && cubeGroupRef.current) {
        cubeGroupRef.current.rotation.x += 0.0005;
        cubeGroupRef.current.rotation.y += 0.0008;
      }

      if (particleSystemRef.current && constellationSystemRef.current) {
        const particleSystem = particleSystemRef.current;
        const constellationSystem = constellationSystemRef.current;
        const positions = particleSystem.geometry.attributes.position.array as Float32Array;
        const velocities = particleSystem.geometry.attributes.velocity.array as Float32Array;
        const colors = particleSystem.geometry.attributes.color.array as Float32Array;
        const particleCount = positions.length / 3;
        const connectedPoints: number[] = [];
        const scrollProgress = uniformsRef.current.scrollProgress.value;

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;

          positions[i3] += velocities[i3];
          positions[i3 + 1] += velocities[i3 + 1];
          positions[i3 + 2] += velocities[i3 + 2];

          positions[i3] += (mouse.current.x * 3 - positions[i3]) * particleSettingsRef.current.PARTICLE_MOUSE_INFLUENCE;
          positions[i3 + 1] += (mouse.current.y * 3 - positions[i3 + 1]) * particleSettingsRef.current.PARTICLE_MOUSE_INFLUENCE;

          const distFromCenter = Math.sqrt(
            positions[i3] * positions[i3] +
            positions[i3 + 1] * positions[i3 + 1] +
            positions[i3 + 2] * positions[i3 + 2]
          );

          if (distFromCenter > 10) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = 5 + Math.random() * 2;
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi) * (1 - scrollProgress * 0.3);

            velocities[i3] = (Math.random() - 0.5) * 0.0004;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.0004;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.0002;
          }

          if (i % 50 === 0 && scrollProgress > 0.6) {
            for (let j = i + 1; j < Math.min(i + 100, particleCount); j += 10) {
              const j3 = j * 3;
              const dx = positions[i3] - positions[j3];
              const dy = positions[i3 + 1] - positions[j3 + 1];
              const dz = positions[i3 + 2] - positions[j3 + 2];
              const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
              const connectionThreshold = 0.5;

              if (distance < connectionThreshold && positions[i3 + 2] < 3 && positions[j3 + 2] < 3) {
                connectedPoints.push(
                  positions[i3], positions[i3 + 1], positions[i3 + 2],
                  positions[j3], positions[j3 + 1], positions[j3 + 2]
                );
              }
            }
          }
        }

        const constellationGeometry = constellationSystem.geometry;
        constellationGeometry.setAttribute('position', new THREE.Float32BufferAttribute(connectedPoints, 3));
        constellationGeometry.attributes.position.needsUpdate = true;
        constellationSystem.material.opacity = Math.max(0, scrollProgress - 0.6) * 0.15;

        particleSystem.geometry.attributes.position.needsUpdate = true;
      }

      rendererRef.current?.render(scene, cameraRef.current!);
    }

    const animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);

      if (rendererRef.current) {
        mountElement.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      sceneRef.current?.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, []);

  return (
    <div ref={mountRef} style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div className="content">
        <section className="section">
          <div className="section-inner">
            <h1 className="title">Beyond<br />Time</h1>
            <p className="description">The universe breathes in patterns we barely comprehend, revealing itself through silence and the spaces between moments.</p>
          </div>
        </section>
        <section className="section">
          <div className="section-inner">
            <h1 className="title">Cosmic<br />Awareness</h1>
            <p className="description">When we surrender to the vastness, we find that consciousness itself might be the vehicle that transcends dimensional boundaries.</p>
          </div>
        </section>
        <section className="section">
          <div className="section-inner">
            <h1 className="title">Infinite<br />Perspectives</h1>
            <p className="description">What appears as chaos from one vantage point reveals itself as perfect order when viewed from the higher dimensions of existence.</p>
          </div>
        </section>
        <section className="section">
          <div className="section-inner">
            <h1 className="title">Eternal<br />Now</h1>
            <p className="description">The fourth dimension isn't just about time—it's about the simultaneous existence of all possibilities, waiting for our awareness to illuminate them.</p>
          </div>
        </section>
      </div>
      <footer className="footer">
        <p>Dimensional Explorations - A Journey Beyond Space</p>
      </footer>
    </div>
  );
}

function lerp(start: number, end: number, amt: number): number {
  return start * (1 - amt) + end * amt;
}