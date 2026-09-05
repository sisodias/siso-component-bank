import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection = () => {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const interactiveElementsRef = useRef([]);
  const progressRef = useRef(null);
  
  // Initialize state with safe default values
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [deviceOrientation, setDeviceOrientation] = useState({ x: 0, y: 0, z: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');

  const dynamicTexts = [
    "AI INTELLIGENCE",
    "NEURAL NETWORKS", 
    "DEEP LEARNING",
    "QUANTUM COMPUTING"
  ];

  // Dark Elegant Color Palette
  const colorPalette = {
    deepBlack: 0x000000,
    charcoal: 0x1a1a1a,
    darkGrey: 0x2a2a2a,
    deepOrange: 0xff4500,
    vibrantOrange: 0xff6600,
    lightOrange: 0xff8533,
    deepRed: 0x8b0000,
    vibrantRed: 0xff3333,
    softRed: 0xcc0000,
    white: 0xffffff,
    offWhite: 0xf5f5f5
  };

  // Device Detection
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Device Orientation for Mobile
  useEffect(() => {
    if (!isMobile) return;

    const handleOrientation = (event) => {
      setDeviceOrientation({
        x: event.beta || 0,
        y: event.gamma || 0,
        z: event.alpha || 0
      });
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, [isMobile]);

  // Enhanced 3D Scene with Static and Dynamic Starfields
  useEffect(() => {
    if (!canvasRef.current) return;

    let animationId;
    let orbitSystem;
    let staticStarField;
    let particleStarField;
    let scene, camera, renderer, composer;
    let bloomPass, filmPass;

    try {
      // Scene Setup
      scene = new THREE.Scene();
      scene.background = new THREE.Color(colorPalette.deepBlack);
      scene.fog = new THREE.Fog(colorPalette.deepBlack, 25, 60);

      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ 
        canvas: canvasRef.current, 
        alpha: false,
        antialias: true,
        powerPreference: "high-performance"
      });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.4;

      // Post-Processing Setup
      composer = new EffectComposer(renderer);
      
      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);

      // Enhanced Bloom Effect
      bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,    // strength
        1.1,    // radius
        0.06    // threshold
      );
      composer.addPass(bloomPass);

      // Film Grain Effect
      filmPass = new FilmPass(
        0.25,   // noise intensity
        0.14,   // scanline intensity
        1024,   // scanline count
        false   // grayscale
      );
      composer.addPass(filmPass);

      const outputPass = new OutputPass();
      composer.addPass(outputPass);

      // Enhanced Lighting Setup
      const ambientLight = new THREE.AmbientLight(colorPalette.charcoal, 0.5);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(colorPalette.vibrantOrange, 3);
      keyLight.position.set(12, 10, 8);
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(colorPalette.deepRed, 2.5);
      rimLight.position.set(-10, 8, -6);
      scene.add(rimLight);

      // Noise Functions for Curl Noise
      const noise3D = (x, y, z) => {
        return Math.sin(x * 0.1) * Math.cos(y * 0.1) * Math.sin(z * 0.1) +
               Math.sin(x * 0.05) * Math.cos(y * 0.05) * Math.sin(z * 0.05) * 0.5 +
               Math.sin(x * 0.02) * Math.cos(y * 0.02) * Math.sin(z * 0.02) * 0.25;
      };

      const curlNoise = (x, y, z, time) => {
        const epsilon = 0.05;
        const scale = 0.5;
        const timeScale = 0.1;
        
        const t = time * timeScale;
        
        const n1 = noise3D((x + epsilon) * scale, y * scale, (z + t));
        const n2 = noise3D((x - epsilon) * scale, y * scale, (z + t));
        const n3 = noise3D(x * scale, (y + epsilon) * scale, (z + t));
        const n4 = noise3D(x * scale, (y - epsilon) * scale, (z + t));
        const n5 = noise3D(x * scale, y * scale, (z + epsilon) * scale + t);
        const n6 = noise3D(x * scale, y * scale, (z - epsilon) * scale + t);
        
        const curlX = (n3 - n4) / (2 * epsilon);
        const curlY = (n5 - n6) / (2 * epsilon);
        const curlZ = (n1 - n2) / (2 * epsilon);
        
        return new THREE.Vector3(curlX, curlY, curlZ);
      };

      // Static Starfield System
      class StaticStarField {
        constructor() {
          this.starCount = isMobile ? 3000 : 6000;
          this.createStaticStars();
        }

        createStaticStars() {
          const geometry = new THREE.BufferGeometry();
          const positions = new Float32Array(this.starCount * 3);
          const colors = new Float32Array(this.starCount * 3);
          const sizes = new Float32Array(this.starCount);

          for (let i = 0; i < this.starCount; i++) {
            const i3 = i * 3;
            
            // Create a spherical distribution of stars
            const radius = 80 + Math.random() * 120;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);

            // Varied star sizes
            sizes[i] = 0.5 + Math.random() * 5;

            // Color variations - mostly white with some colored stars
            const colorChoice = Math.random();
            let color;
            if (colorChoice < 0.85) {
              color = new THREE.Color(colorPalette.white);
            } else if (colorChoice < 0.92) {
              color = new THREE.Color(colorPalette.lightOrange);
            } else if (colorChoice < 0.97) {
              color = new THREE.Color(colorPalette.softRed);
            } else {
              color = new THREE.Color(colorPalette.vibrantOrange);
            }

            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
          }

          geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
          geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
          geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

          // Simple static star material
          const material = new THREE.ShaderMaterial({
            uniforms: {},
            vertexShader: `
              attribute float size;
              attribute vec3 color;
              varying vec3 vColor;

              void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (200.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
              }
            `,
            fragmentShader: `
              varying vec3 vColor;
              
              void main() {
                float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                alpha *= alpha;
                
                gl_FragColor = vec4(vColor, alpha * 0.8);
              }
            `,
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
          });

          this.points = new THREE.Points(geometry, material);
          scene.add(this.points);
        }

        dispose() {
          if (this.points.parent) this.points.parent.remove(this.points);
          this.points.geometry.dispose();
          this.points.material.dispose();
        }
      }

      // Dynamic Particle Star Field System
      class ParticleStarField {
        constructor() {
          this.particleCount = isMobile ? 4000 : 8000;
          this.systems = [];
          this.createParticleSystems();
        }

        createParticleSystems() {
          this.createParticleLayer(this.particleCount * 0.7, 30, 70, 'background');
          this.createParticleLayer(this.particleCount * 0.2, 15, 30, 'midground');
          this.createParticleLayer(this.particleCount * 0.1, 5, 15, 'foreground');
        }

        createParticleLayer(count, minDist, maxDist, layer) {
          const geometry = new THREE.BufferGeometry();
          const positions = new Float32Array(count * 3);
          const velocities = new Float32Array(count * 3);
          const phases = new Float32Array(count);
          const sizes = new Float32Array(count);
          const colors = new Float32Array(count * 3);

          for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            
            const radius = minDist + Math.random() * (maxDist - minDist);
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);

            velocities[i3] = (Math.random() - 0.5) * 0.0008;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.0008;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.0008;

            phases[i] = Math.random() * Math.PI * 2;

            const baseSize = layer === 'foreground' ? 3.5 : layer === 'midground' ? 2.0 : 1.2;
            sizes[i] = baseSize + Math.random() * baseSize * 0.5;

            const colorChoice = Math.random();
            let color;
            if (colorChoice < 0.3) {
              color = new THREE.Color(colorPalette.white);
            } else if (colorChoice < 0.6) {
              color = new THREE.Color(colorPalette.lightOrange);
            } else if (colorChoice < 0.85) {
              color = new THREE.Color(colorPalette.vibrantOrange);
            } else {
              color = new THREE.Color(colorPalette.softRed);
            }

            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
          }

          geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
          geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
          geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
          geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
          geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

          const material = new THREE.ShaderMaterial({
            uniforms: {
              time: { value: 0 },
              layerIntensity: { value: layer === 'foreground' ? 1.5 : layer === 'midground' ? 1.0 : 0.6 }
            },
            vertexShader: `
              attribute float phase;
              attribute float size;
              attribute vec3 velocity;
              attribute vec3 color;
              
              varying vec3 vColor;
              varying float vIntensity;
              
              uniform float time;
              uniform float layerIntensity;

              void main() {
                vColor = color;
                
                float twinkle = sin(time * 4.0 + phase) * 0.3 + 0.7;
                twinkle += sin(time * 6.0 + phase * 1.5) * 0.15;
                twinkle += sin(time * 8.0 + phase * 0.8) * 0.08;
                vIntensity = twinkle * layerIntensity;
                
                vec3 pos = position + velocity * time * 15.0;
                
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = size * vIntensity * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
              }
            `,
            fragmentShader: `
              varying vec3 vColor;
              varying float vIntensity;
              
              void main() {
                float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                
                alpha *= alpha * vIntensity;
                
                float sparkle = sin(gl_PointCoord.x * 25.0) * sin(gl_PointCoord.y * 25.0);
                alpha += sparkle * 0.08 * vIntensity;
                
                gl_FragColor = vec4(vColor * vIntensity, alpha);
              }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
          });

          const particles = new THREE.Points(geometry, material);
          scene.add(particles);

          this.systems.push({
            particles,
            geometry,
            material,
            layer,
            rotationSpeed: layer === 'foreground' ? 0.0008 : layer === 'midground' ? 0.0005 : 0.0002
          });
        }

        update(time) {
          this.systems.forEach(system => {
            system.material.uniforms.time.value = time;
            system.particles.rotation.x += system.rotationSpeed * 0.4;
            system.particles.rotation.y += system.rotationSpeed;
            system.particles.rotation.z += system.rotationSpeed * 0.6;
          });

          if (bloomPass) {
            const intensity = 1.2 + Math.sin(time * 0.6) * 0.5 + Math.sin(time * 1.1) * 0.1;
            bloomPass.strength = intensity;
          }
        }

        dispose() {
          this.systems.forEach(system => {
            if (system.particles.parent) system.particles.parent.remove(system.particles);
            system.geometry.dispose();
            system.material.dispose();
          });
        }
      }

      // Metaball Orbit System (unchanged from previous version)
      class MetaballOrbitSystem {
        constructor() {
          this.centralBodies = [];
          this.orbitingBodies = [];
          this.trails = [];
          this.metaballInfluences = [];
          this.materials = this.createMaterials();
          
          this.initSystem();
        }

        createMaterials() {
          return {
            central: new THREE.MeshBasicMaterial({
              color: colorPalette.offWhite,
              transparent: true,
              opacity: 0.95
            }),
            orbiting: [
              new THREE.MeshBasicMaterial({
                color: colorPalette.deepOrange,
                transparent: true,
                opacity: 0.85
              }),
              new THREE.MeshBasicMaterial({
                color: colorPalette.vibrantRed,
                transparent: true,
                opacity: 0.85
              }),
              new THREE.MeshBasicMaterial({
                color: colorPalette.vibrantOrange,
                transparent: true,
                opacity: 0.85
              }),
              new THREE.MeshBasicMaterial({
                color: colorPalette.softRed,
                transparent: true,
                opacity: 0.8
              })
            ]
          };
        }

        initSystem() {
          const centralPositions = [
            new THREE.Vector3(0, 0, 0),
            //new THREE.Vector3(-4, 2, -1.5),
            ///new THREE.Vector3(3.5, -1.8, 2.2)
          ];

          centralPositions.forEach((pos, i) => {
            const geometry = new THREE.SphereGeometry(0.35, 20, 20);
            const mesh = new THREE.Mesh(geometry, this.materials.central);
            mesh.position.copy(pos);
            scene.add(mesh);
            
            this.centralBodies.push({
              mesh: mesh,
              position: pos.clone(),
              mass: 180 + i * 90,
              pulsePhase: Math.random() * Math.PI * 2,
              originalPosition: pos.clone(),
              influenceRadius: 7.5 + i * 0.6
            });
          });

          for (let i = 0; i < 20; i++) {
            const centralBodyIndex = Math.floor(Math.random() * this.centralBodies.length);
            const centralBody = this.centralBodies[centralBodyIndex];
            
            const orbitRadius = 1.8 + Math.random() * 3.5;
            const angle = Math.random() * Math.PI * 2;
            const inclination = (Math.random() - 0.5) * 1.6;
            
            const position = new THREE.Vector3(
              centralBody.position.x + Math.cos(angle) * orbitRadius,
              centralBody.position.y + Math.sin(inclination) * orbitRadius * 0.8,
              centralBody.position.z + Math.sin(angle) * orbitRadius
            );

            const baseRadius = 0.09 + Math.random() * 0.14;
            const geometry = new THREE.SphereGeometry(baseRadius, 12, 12);
            const materialIndex = i % this.materials.orbiting.length;
            const mesh = new THREE.Mesh(geometry, this.materials.orbiting[materialIndex]);
            mesh.position.copy(position);
            scene.add(mesh);

            const distanceToCenter = position.distanceTo(centralBody.position);
            const orbitalSpeed = Math.sqrt(centralBody.mass / distanceToCenter) * 0.122;
            
            const toCenterNormalized = centralBody.position.clone().sub(position).normalize();
            const up = new THREE.Vector3(0, 1, 0);
            const velocity = new THREE.Vector3().crossVectors(toCenterNormalized, up).normalize();
            velocity.multiplyScalar(orbitalSpeed);
            
            velocity.add(new THREE.Vector3(
              (Math.random() - 0.5) * 0.004,
              (Math.random() - 0.5) * 0.004,
              (Math.random() - 0.5) * 0.004
            ));

            const orbitingBody = {
              mesh: mesh,
              position: position.clone(),
              velocity: velocity,
              centralBodyIndex: centralBodyIndex,
              mass: 0.5,
              trailPositions: [],
              maxTrailLength: 35,
              baseRadius: baseRadius,
              currentRadius: baseRadius,
              pulsePhase: Math.random() * Math.PI * 2,
              materialIndex: materialIndex,
              metaballStrength: 1.2 + Math.random() * 0.9,
              influenceRadius: 0.9 + Math.random() * 1.5,
              mergeIntensity: 0.3
            };

            this.orbitingBodies.push(orbitingBody);

            const trailGeometry = new THREE.BufferGeometry();
            const trailMaterial = new THREE.LineBasicMaterial({
              color: this.materials.orbiting[materialIndex].color,
              transparent: true,
              opacity: 0.3,
              linewidth: 6
            });
            const trailMesh = new THREE.Line(trailGeometry, trailMaterial);
            scene.add(trailMesh);
            
            this.trails.push({
              mesh: trailMesh,
              geometry: trailGeometry,
              material: trailMaterial,
              bodyIndex: this.orbitingBodies.length - 1
            });
          }
        }

        calculateMetaballInfluence(body1, body2) {
          const distance = body1.position.distanceTo(body2.position);
          const combinedRadius = body1.influenceRadius + body2.influenceRadius;
          
          if (distance < combinedRadius) {
            const influence = 1 - (distance / combinedRadius);
            return Math.pow(influence, 2);
          }
          return 0;
        }

        update(time, touchPos, touchIntensity) {
          const deltaTime = 0.016;
          const G = 0.3;
          const safeTouchIntensity = touchIntensity || 0;

          this.centralBodies.forEach((body, i) => {
            const pulse = Math.sin(time * 2.0 + body.pulsePhase) * 0.28 + 1;
            body.mesh.scale.setScalar(pulse);
            
            const orbitSpeed = 0.06 + i * 0.025;
            const orbitRadius = 0.7 + i * 0.5;
            body.position.x = body.originalPosition.x + Math.cos(time * orbitSpeed) * orbitRadius;
            body.position.z = body.originalPosition.z + Math.sin(time * orbitSpeed) * orbitRadius;
            body.position.y = body.originalPosition.y + Math.sin(time * orbitSpeed * 0.9) * 0.35;
            
            body.mesh.position.copy(body.position);
          });

          this.orbitingBodies.forEach((body, i) => {
            body.mergeIntensity = 0;
            
            this.orbitingBodies.forEach((otherBody, j) => {
              if (i !== j) {
                const influence = this.calculateMetaballInfluence(body, otherBody);
                body.mergeIntensity = Math.max(body.mergeIntensity, influence);
              }
            });
          });

          this.orbitingBodies.forEach((body, i) => {
            const acceleration = new THREE.Vector3();

            this.centralBodies.forEach((centralBody) => {
              const distance = body.position.distanceTo(centralBody.position);
              if (distance > 0.1) {
                const force = centralBody.position.clone().sub(body.position);
                force.normalize();
                force.multiplyScalar(G * centralBody.mass / (distance * distance));
                acceleration.add(force);
              }
            });

            if (safeTouchIntensity > 0 && touchPos) {
              const touchWorld = new THREE.Vector3(
                (touchPos.x - 0.5) * 12,
                -(touchPos.y - 0.5) * 10,
                0
              );
              const touchDistance = body.position.distanceTo(touchWorld);
              if (touchDistance < 10) {
                const touchForce = touchWorld.clone().sub(body.position);
                touchForce.normalize();
                touchForce.multiplyScalar(G * 120 * safeTouchIntensity / (touchDistance * touchDistance + 1));
                acceleration.add(touchForce);
              }
            }

            this.orbitingBodies.forEach((otherBody, j) => {
              if (i !== j) {
                const distance = body.position.distanceTo(otherBody.position);
                const influence = this.calculateMetaballInfluence(body, otherBody);
                
                if (influence > 0) {
                  const force = otherBody.position.clone().sub(body.position);
                  force.normalize();
                  force.multiplyScalar(G * otherBody.mass * influence * 0.6);
                  acceleration.add(force);
                  
                  const velocityBlend = otherBody.velocity.clone().sub(body.velocity);
                  velocityBlend.multiplyScalar(influence * 0.12);
                  acceleration.add(velocityBlend);
                }
                
                if (distance < 2.5 && distance > 0.1) {
                  const force = otherBody.position.clone().sub(body.position);
                  force.normalize();
                  force.multiplyScalar(G * otherBody.mass / (distance * distance) * 0.1);
                  acceleration.add(force);
                }
              }
            });

            body.velocity.add(acceleration.clone().multiplyScalar(deltaTime));
            body.velocity.multiplyScalar(0.9996);
            body.position.add(body.velocity.clone().multiplyScalar(deltaTime));

            const maxDistance = 25;
            if (body.position.length() > maxDistance) {
              body.position.normalize().multiplyScalar(maxDistance);
              body.velocity.multiplyScalar(0.5);
            }

            body.currentRadius = body.baseRadius * (1 + body.mergeIntensity * 1.9);
            const pulse = Math.sin(time * 3.5 + body.pulsePhase) * 0.15 + 1;
            const finalScale = pulse * (1 + body.mergeIntensity * 0.6);
            body.mesh.scale.setScalar(finalScale);
            
            body.mesh.material.opacity = 0.85 + body.mergeIntensity * 0.15;
            body.mesh.position.copy(body.position);

            if (body.trailPositions.length === 0 || 
                body.position.distanceTo(body.trailPositions[body.trailPositions.length - 1]) > 0.12) {
              
              const curlOffset = curlNoise(body.position.x, body.position.y, body.position.z, time);
              curlOffset.multiplyScalar(0.25 + body.mergeIntensity * 0.4);
              
              const displacedPosition = body.position.clone().add(curlOffset);
              body.trailPositions.push(displacedPosition);
              
              if (body.trailPositions.length > body.maxTrailLength) {
                body.trailPositions.shift();
              }
            }
          });

          this.trails.forEach((trail) => {
            const body = this.orbitingBodies[trail.bodyIndex];
            if (body && body.trailPositions.length > 1) {
              const positions = [];
              
              body.trailPositions.forEach((pos, index) => {
                const trailCurl = curlNoise(pos.x, pos.y, pos.z, time + index * 0.12);
                trailCurl.multiplyScalar(0.06);
                
                const finalPos = pos.clone().add(trailCurl);
                positions.push(finalPos.x, finalPos.y, finalPos.z);
              });
              
              trail.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
              trail.geometry.setDrawRange(0, body.trailPositions.length);
              trail.material.opacity = 0.5 + body.mergeIntensity * 0.4;
            }
          });
        }

        addOrbitingBody(position) {
          if (!position || this.orbitingBodies.length >= 30) return;

          let nearestCentral = this.centralBodies[0];
          let minDistance = position.distanceTo(nearestCentral.position);

          this.centralBodies.forEach(body => {
            const distance = position.distanceTo(body.position);
            if (distance < minDistance) {
              minDistance = distance;
              nearestCentral = body;
            }
          });

          const baseRadius = 0.12 + Math.random() * 0.5;
          const geometry = new THREE.SphereGeometry(baseRadius, 12, 12);
          const materialIndex = Math.floor(Math.random() * this.materials.orbiting.length);
          const mesh = new THREE.Mesh(geometry, this.materials.orbiting[materialIndex]);
          mesh.position.copy(position);
          scene.add(mesh);

          const distanceToCenter = position.distanceTo(nearestCentral.position);
          const orbitalSpeed = Math.sqrt(nearestCentral.mass / distanceToCenter) * 0.02;
          
          const toCenterNormalized = nearestCentral.position.clone().sub(position).normalize();
          const up = new THREE.Vector3(0, 1, 0);
          const velocity = new THREE.Vector3().crossVectors(toCenterNormalized, up).normalize();
          velocity.multiplyScalar(orbitalSpeed);

          const newBody = {
            mesh: mesh,
            position: position.clone(),
            velocity: velocity,
            centralBodyIndex: this.centralBodies.indexOf(nearestCentral),
            mass: 0.5,
            trailPositions: [],
            maxTrailLength: 30,
            baseRadius: baseRadius,
            currentRadius: baseRadius,
            pulsePhase: Math.random() * Math.PI * 2,
            materialIndex: materialIndex,
            metaballStrength: 1.7 + Math.random() * 0.9,
            influenceRadius: 0.9 + Math.random() * 1.5,
            mergeIntensity: 0.6
          };

          this.orbitingBodies.push(newBody);

          const trailGeometry = new THREE.BufferGeometry();
          const trailMaterial = new THREE.LineBasicMaterial({
            color: this.materials.orbiting[materialIndex].color,
            transparent: true,
            opacity: 0.,
            linewidth: 4
          });
          const trailMesh = new THREE.Line(trailGeometry, trailMaterial);
          scene.add(trailMesh);
          
          this.trails.push({
            mesh: trailMesh,
            geometry: trailGeometry,
            material: trailMaterial,
            bodyIndex: this.orbitingBodies.length - 1
          });
        }

        dispose() {
          this.orbitingBodies.forEach(body => {
            if (body.mesh.parent) body.mesh.parent.remove(body.mesh);
          });
          this.centralBodies.forEach(body => {
            if (body.mesh.parent) body.mesh.parent.remove(body.mesh);
          });
          this.trails.forEach(trail => {
            if (trail.mesh.parent) trail.mesh.parent.remove(trail.mesh);
            trail.geometry.dispose();
            trail.material.dispose();
          });
          Object.values(this.materials).forEach(material => {
            if (Array.isArray(material)) {
              material.forEach(mat => mat.dispose());
            } else {
              material.dispose();
            }
          });
        }
      }

      // Create all systems
      staticStarField = new StaticStarField();
      particleStarField = new ParticleStarField();
      orbitSystem = new MetaballOrbitSystem();

      // Position camera
      camera.position.set(0, 3.5, 14);
      camera.lookAt(0, 0, 0);

      // Touch state
      let touchIntensity = 0;
      let touchPosition = { x: 0.5, y: 0.5 };

      // Animation Loop
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        
        try {
          const time = Date.now() * 0.001;
          
          // Update particle star field (static stars don't need updates)
          if (particleStarField) {
            particleStarField.update(time);
          }
          
          // Update metaball orbit system
          if (orbitSystem) {
            orbitSystem.update(time, touchPosition, touchIntensity);
          }
          
          // Gentle camera movement
          if (camera) {
            camera.position.x = Math.sin(time * 0.015) * 1.5;
            camera.position.y = 3.5 + Math.cos(time * 0.02) * 0.8;
            camera.position.z = 14 + Math.sin(time * 0.012) * 1.0;
            camera.lookAt(0, 0, 0);
          }

          // Render with post-processing
          if (composer) {
            composer.render();
          }
        } catch (error) {
          console.error('Animation error:', error);
        }
      };

      animate();

      // Touch handlers
      const handleTouchStart = (e) => {
        if (!canvasRef.current || !e.touches?.[0]) return;
        
        try {
          e.preventDefault();
          const touch = e.touches[0];
          const rect = canvasRef.current.getBoundingClientRect();
          touchPosition = {
            x: (touch.clientX - rect.left) / rect.width,
            y: 1 - (touch.clientY - rect.top) / rect.height
          };
          touchIntensity = 1.0;
          
          const worldPos = new THREE.Vector3(
            (touchPosition.x - 0.5) * 12,
            -(touchPosition.y - 0.5) * 10,
            Math.random() * 4 - 2
          );
          if (orbitSystem) {
            orbitSystem.addOrbitingBody(worldPos);
          }
        } catch (error) {
          console.error('Touch start error:', error);
        }
      };

      const handleTouchMove = (e) => {
        if (!canvasRef.current || !e.touches?.[0]) return;
        
        try {
          e.preventDefault();
          const touch = e.touches[0];
          const rect = canvasRef.current.getBoundingClientRect();
          touchPosition = {
            x: (touch.clientX - rect.left) / rect.width,
            y: 1 - (touch.clientY - rect.top) / rect.height
          };
          touchIntensity = Math.min(touchIntensity + 0.4, 3.0);
        } catch (error) {
          console.error('Touch move error:', error);
        }
      };

      const handleTouchEnd = () => {
        touchIntensity *= 0.15;
      };

      // Add touch event listeners
      if (isMobile && canvasRef.current) {
        canvasRef.current.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvasRef.current.addEventListener('touchmove', handleTouchMove, { passive: false });
        canvasRef.current.addEventListener('touchend', handleTouchEnd, { passive: false });
      }

      // Resize Handler
      const handleResize = () => {
        if (!camera || !renderer || !composer) return;
        
        try {
          const width = window.innerWidth;
          const height = window.innerHeight;
          
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
          composer.setSize(width, height);
        } catch (error) {
          console.error('Resize error:', error);
        }
      };

      window.addEventListener('resize', handleResize);

      // Cleanup function
      return () => {
        try {
          if (animationId) {
            cancelAnimationFrame(animationId);
          }
          
          window.removeEventListener('resize', handleResize);
          
          if (canvasRef.current && isMobile) {
            canvasRef.current.removeEventListener('touchstart', handleTouchStart);
            canvasRef.current.removeEventListener('touchmove', handleTouchMove);
            canvasRef.current.removeEventListener('touchend', handleTouchEnd);
          }
          
          if (staticStarField) {
            staticStarField.dispose();
          }
          
          if (particleStarField) {
            particleStarField.dispose();
          }
          
          if (orbitSystem) {
            orbitSystem.dispose();
          }
          
          if (composer) {
            composer.dispose();
          }
          
          if (scene) {
            scene.traverse((object) => {
              if (object.geometry) object.geometry.dispose();
              if (object.material) {
                if (Array.isArray(object.material)) {
                  object.material.forEach(material => material.dispose());
                } else {
                  object.material.dispose();
                }
              }
            });
            scene.clear();
          }
          
          if (renderer) {
            renderer.dispose();
          }
        } catch (error) {
          console.error('Cleanup error:', error);
        }
      };

    } catch (error) {
      console.error('Three.js setup error:', error);
      setIsLoaded(true);
    }
  }, [isMobile, deviceOrientation, scrollProgress]);

  // Text Interpolation Animation (unchanged)
  useEffect(() => {
    const interpolateText = (fromText, toText, progress) => {
      const maxLength = Math.max(fromText.length, toText.length);
      let result = '';
      
      for (let i = 0; i < maxLength; i++) {
        const fromChar = fromText[i] || ' ';
        const toChar = toText[i] || ' ';
        
        if (progress < 0.5) {
          const charProgress = Math.max(0, (progress * 2) - (i * 0.1));
          if (charProgress < 1) {
            const glitchChars = '█▓▒░▄▀■□▪▫!@#$%&*^';
            const randomChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
            result += Math.random() < charProgress ? randomChar : fromChar;
          } else {
            result += ' ';
          }
        } else {
          const charProgress = Math.max(0, ((progress - 0.5) * 2) - (i * 0.1));
          if (charProgress > 0) {
            if (charProgress < 0.7) {
              const glitchChars = '█▓▒░▄▀■□▪▫!@#$%^&*_-+=';
              const randomChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
              result += Math.random() < 0.7 ? randomChar : toChar;
            } else {
              result += toChar;
            }
          } else {
            result += ' ';
          }
        }
      }
      
      return result;
    };

    const animateTextTransition = () => {
      const currentText = dynamicTexts[currentTextIndex];
      const nextIndex = (currentTextIndex + 1) % dynamicTexts.length;
      const nextText = dynamicTexts[nextIndex];
      
      const tl = gsap.timeline();
      
      tl.to({}, {
        duration: 1.8,
        ease: "power2.inOut",
        onUpdate: function() {
          const progress = this.progress();
          const interpolated = interpolateText(currentText, nextText, progress);
          setDisplayText(interpolated);
        },
        onComplete: () => {
          setCurrentTextIndex(nextIndex);
          setDisplayText(nextText);
        }
      });
    };

    if (displayText === '') {
      setDisplayText(dynamicTexts[currentTextIndex]);
    }

    const interval = setInterval(animateTextTransition, 4500);
    return () => clearInterval(interval);
  }, [currentTextIndex, displayText]);

  // Enhanced GSAP Animations
  useEffect(() => {
    if (!titleRef.current || !subtitleRef.current || !ctaRef.current) return;

    const mm = gsap.matchMedia();
    
    // Desktop animations
    mm.add("(min-width: 769px)", () => {
      const tl = gsap.timeline({ delay: 1.2 });
      
      tl.fromTo(titleRef.current, 
        { 
          y: 120, 
          opacity: 0,
          scale: 0.97,
          filter: "blur(15px)"
        },
        { 
          y: 0, 
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.4,
          ease: "power3.out"
        }
      )
      .fromTo(subtitleRef.current,
        {
          y: 60,
          opacity: 0,
          filter: "blur(8px)"
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.0,
          ease: "power2.out"
        },
        "-=0.6"
      )
      .fromTo(ctaRef.current.children,
        {
          y: 40,
          opacity: 0,
          scale: 0.94
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.4)",
          stagger: 0.12
        },
        "-=0.3"
      );
    });

    // Mobile animations
    mm.add("(max-width: 768px)", () => {
      const tl = gsap.timeline({ delay: 0.8 });
      
      tl.fromTo(titleRef.current, 
        { 
          y: 60, 
          opacity: 0,
          filter: "blur(8px)"
        },
        { 
          y: 0, 
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.0,
          ease: "power2.out"
        }
      )
      .fromTo(subtitleRef.current,
        {
          y: 30,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out"
        },
        "-=0.4"
      )
      .fromTo(ctaRef.current.children,
        {
          y: 20,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.06
        },
        "-=0.3"
      );
    });

    // Scroll-triggered animations
    if (heroRef.current && progressRef.current) {
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          setScrollProgress(progress);
          
          if (titleRef.current) {
            gsap.to(titleRef.current, {
              y: -progress * (isMobile ? 80 : 140),
              scale: 1 - progress * 0.12,
              filter: `blur(${progress * 8}px)`,
              duration: 0.1
            });
          }
          
          if (subtitleRef.current) {
            gsap.to(subtitleRef.current, {
              y: -progress * (isMobile ? 40 : 70),
              opacity: 1 - progress * 0.8,
              duration: 0.1
            });
          }

          if (progressRef.current) {
            gsap.to(progressRef.current, {
              scaleX: progress,
              duration: 0.05
            });
          }
        }
      });
    }

    setIsLoaded(true);

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isMobile]);

  // Enhanced Click Effects
  const handleCTAClick = (e, buttonType) => {
    try {
      if (navigator.vibrate && isMobile) {
        navigator.vibrate(10);
      }

      const button = e.currentTarget;
      
      gsap.to(button, {
        scale: 0.98,
        duration: 0.04,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });

      if (buttonType === 'primary') {
        console.log('Exploring AI...');
      } else {
        console.log('Connecting...');
      }
    } catch (error) {
      console.error('Click handler error:', error);
    }
  };

  return (
    <section ref={heroRef} className={`hero-section ${isLoaded ? 'loaded' : ''} ${isMobile ? 'mobile' : 'desktop'}`}>
      <canvas ref={canvasRef} className="hero-canvas" />
      
      {/* Progress Bar */}
      <div className="scroll-progress">
        <div ref={progressRef} className="scroll-progress-bar"></div>
      </div>
      
      {/* Header with Glassmorphism */}
      <header className="hero-header glass-morphism">
        <div className="logo">AI</div>
        <nav className="main-nav">
          <a href="#work">WORK</a>
          <a href="#about">ABOUT</a>
          <a href="#contact">CONTACT</a>
        </nav>
        <div className="header-info">
          <span className="version">2024</span>
          <button className="menu-toggle">
            <span></span>
            <span></span>
          </button>
        </div>
      </header>
      
      <div className="hero-content">
        <div className="hero-text">
          <h1 ref={titleRef} className="hero-title">
            <span className="dynamic-text">{displayText}</span>
          </h1>
          
          <p ref={subtitleRef} className="hero-subtitle glass-morphism">
            Next-generation artificial intelligence<br />
            for innovative solutions
          </p>
          
          <div ref={ctaRef} className="hero-cta">
            <button 
              ref={el => {
                if (el && interactiveElementsRef.current) {
                  interactiveElementsRef.current[0] = el;
                }
              }}
              className="cta-button primary glass-morphism"
              onClick={(e) => handleCTAClick(e, 'primary')}
            >
              EXPLORE
            </button>
            
            <button 
              ref={el => {
                if (el && interactiveElementsRef.current) {
                  interactiveElementsRef.current[1] = el;
                }
              }}
              className="cta-button secondary glass-morphism"
              onClick={(e) => handleCTAClick(e, 'secondary')}
            >
              CONNECT
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer with Glassmorphism */}
      <footer className="hero-footer glass-morphism">
        <div className="footer-left">
          <span>© 2024</span>
        </div>
        <div className="footer-right">
          <span>INNOVATION × TECHNOLOGY</span>
        </div>
      </footer>
      
      {/* Loading Screen */}
      {!isLoaded && (
        <div className="loading-screen glass-morphism">
          <div className="loader">
            <div className="loader-text">INITIALIZING</div>
            <div className="loader-bar">
              <div className="loader-progress"></div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};