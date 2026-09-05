import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

export interface NexusOrbProps {
  className?: string;
  showSphere?: boolean;
  sphereDetail?: number;
  dotCount?: number;
  dotSpeed?: number;
  autoSpinX?: number;
  autoSpinY?: number;
  autoSpinZ?: number;
  sphereColor?: string;
  sphereEmissive?: string;
  sphereRoughness?: number;
  sphereMetalness?: number;
  sphereFlatShading?: boolean;
  dotColor?: string;
  lineColor?: string;
  dotSize?: number;
  connectDistance?: number;
  bloomStrength?: number;
  bloomRadius?: number;
  bloomThreshold?: number;
}

export const NexusOrb: React.FC<NexusOrbProps> = ({
  className,
  showSphere = true,
  sphereDetail = 4,
  dotCount = 300,
  dotSpeed = 0.3,
  autoSpinX = 1.2,
  autoSpinY = 1.4,
  autoSpinZ = 1.2,
  sphereColor = "#7638b7",
  sphereEmissive = "#371669",
  sphereRoughness = 0.5,
  sphereMetalness = 0.16,
  sphereFlatShading = true,
  dotColor = "#ffffff",
  lineColor = "#ffe6ff",
  dotSize = 0.03,
  connectDistance = 1.0,
  bloomStrength = 1.8,
  bloomRadius = 0.6,
  bloomThreshold = 0.5,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  const propsRef = useRef<NexusOrbProps>({});

  useEffect(() => {
    propsRef.current = {
      showSphere, sphereDetail, dotCount, dotSpeed, autoSpinX, autoSpinY, autoSpinZ,
      sphereColor, sphereEmissive, sphereRoughness, sphereMetalness, sphereFlatShading,
      dotColor, lineColor, dotSize, connectDistance, bloomStrength, bloomRadius, bloomThreshold
    };
  }, [
    showSphere, sphereDetail, dotCount, dotSpeed, autoSpinX, autoSpinY, autoSpinZ,
    sphereColor, sphereEmissive, sphereRoughness, sphereMetalness, sphereFlatShading,
    dotColor, lineColor, dotSize, connectDistance, bloomStrength, bloomRadius, bloomThreshold
  ]);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    if ('ColorManagement' in THREE) {
        (THREE as any).ColorManagement.enabled = false;
    }
    renderer.toneMapping = THREE.NoToneMapping;
    if ('outputColorSpace' in renderer) {
        renderer.outputColorSpace = (THREE as any).LinearSRGBColorSpace;
    } else {
        (renderer as any).outputEncoding = 3000; 
    }
    
    container.appendChild(renderer.domElement);

    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      propsRef.current.bloomStrength || 1.8,
      propsRef.current.bloomRadius || 0.6,
      propsRef.current.bloomThreshold || 0.5
    );
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    const ambientLight = new THREE.AmbientLight(0x7a4aa8, 0.8);
    scene.add(ambientLight);
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);
    const fillLight = new THREE.DirectionalLight(0xb088ff, 0.6);
    fillLight.position.set(-5, -2, -5);
    scene.add(fillLight);

    let sphereGeom = new THREE.IcosahedronGeometry(2.5, propsRef.current.sphereDetail);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: propsRef.current.sphereColor,
      emissive: propsRef.current.sphereEmissive,
      roughness: propsRef.current.sphereRoughness,
      metalness: propsRef.current.sphereMetalness,
      flatShading: propsRef.current.sphereFlatShading,
    });
    const sphere = new THREE.Mesh(sphereGeom, sphereMat);

    const sphereGroup = new THREE.Group();
    const orbitGroup = new THREE.Group();
    sphereGroup.add(sphere);
    sphereGroup.add(orbitGroup);
    scene.add(sphereGroup);

    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
        ctx.beginPath();
        ctx.arc(32, 32, 28, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
    }
    const dotTexture = new THREE.CanvasTexture(canvas);
    dotTexture.needsUpdate = true;

    const maxParticles = 400;
    const pPositions = new Float32Array(maxParticles * 3);
    const maxSegments = (maxParticles * (maxParticles - 1)) / 2;
    const lPositions = new Float32Array(maxSegments * 6);
    const lColors = new Float32Array(maxSegments * 6);
    const particlesData: any[] = [];

    const orbitRadius = 2.5 * 1.15;
    for (let i = 0; i < maxParticles; i++) {
      const pos = new THREE.Vector3(
        Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1
      ).normalize().multiplyScalar(orbitRadius + (Math.random() * 0.15 - 0.075));
      pPositions[i * 3] = pos.x; pPositions[i * 3 + 1] = pos.y; pPositions[i * 3 + 2] = pos.z;
      const axis = new THREE.Vector3(
        Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1
      ).normalize();
      particlesData.push({
        rotationAxis: axis,
        rotationSpeed: 0.002 + Math.random() * 0.003,
        baseRadius: pos.length()
      });
    }

    const pGeometry = new THREE.BufferGeometry();
    pGeometry.setAttribute("position", new THREE.BufferAttribute(pPositions, 3).setUsage(THREE.DynamicDrawUsage));
    pGeometry.setDrawRange(0, propsRef.current.dotCount || 300);

    const lGeometry = new THREE.BufferGeometry();
    lGeometry.setAttribute("position", new THREE.BufferAttribute(lPositions, 3).setUsage(THREE.DynamicDrawUsage));
    lGeometry.setAttribute("color", new THREE.BufferAttribute(lColors, 3).setUsage(THREE.DynamicDrawUsage));

    const pMaterial = new THREE.PointsMaterial({
      size: propsRef.current.dotSize,
      map: dotTexture,
      color: propsRef.current.dotColor,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const lMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const pointCloud = new THREE.Points(pGeometry, pMaterial);
    const linesMesh = new THREE.LineSegments(lGeometry, lMaterial);
    orbitGroup.add(pointCloud);
    orbitGroup.add(linesMesh);

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0;
    let targetRotationY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };
    const onPointerUp = () => { isDragging = false; };
    const onPointerMove = (e: PointerEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        
        targetRotationY += deltaX * 0.005; 
        targetRotationX += deltaY * 0.005; // Fix: Reverted inversion 
        
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.01;
      camera.position.z = Math.max(3.5, Math.min(20, camera.position.z));
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerleave", onPointerUp);
    container.addEventListener("wheel", onWheel, { passive: false });

    const onWindowResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };
    window.addEventListener("resize", onWindowResize);

    let animationFrameId: number;
    let lastSphereDetail = propsRef.current.sphereDetail;

    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      return { r, g, b };
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const p = propsRef.current;

      sphere.visible = p.showSphere ?? true;
      if (lastSphereDetail !== p.sphereDetail && p.sphereDetail !== undefined) {
        sphereGeom.dispose();
        sphereGeom = new THREE.IcosahedronGeometry(2.5, p.sphereDetail);
        sphere.geometry = sphereGeom;
        lastSphereDetail = p.sphereDetail;
      }
      sphereMat.color.set(p.sphereColor ?? "#7638b7");
      sphereMat.emissive.set(p.sphereEmissive ?? "#371669");
      sphereMat.roughness = p.sphereRoughness ?? 0.5;
      sphereMat.metalness = p.sphereMetalness ?? 0.16;
      if (sphereMat.flatShading !== p.sphereFlatShading) {
        sphereMat.flatShading = p.sphereFlatShading ?? true;
        sphereMat.needsUpdate = true;
      }

      pMaterial.color.set(p.dotColor ?? "#ffffff");
      pMaterial.size = p.dotSize ?? 0.03;
      pGeometry.setDrawRange(0, p.dotCount ?? 300);

      bloomPass.strength = p.bloomStrength ?? 1.8;
      bloomPass.radius = p.bloomRadius ?? 0.6;
      bloomPass.threshold = p.bloomThreshold ?? 0.5;

      targetRotationX += (p.autoSpinX ?? 0) / 1000;
      targetRotationY += (p.autoSpinY ?? 0) / 1000;
      sphereGroup.rotation.z += (p.autoSpinZ ?? 0) / 1000;

      sphereGroup.rotation.x += (targetRotationX - sphereGroup.rotation.x) * 0.1;
      sphereGroup.rotation.y += (targetRotationY - sphereGroup.rotation.y) * 0.1;

      orbitGroup.rotation.y -= 0.001;
      orbitGroup.rotation.z += 0.0005;

      let vertexpos = 0;
      let colorpos = 0;
      const lineBase = hexToRgb(p.lineColor ?? "#ffe6ff");

      for (let i = 0; i < (p.dotCount ?? 300); i++) {
        const particleData = particlesData[i];
        const p1 = new THREE.Vector3(pPositions[i * 3], pPositions[i * 3 + 1], pPositions[i * 3 + 2]);

        p1.applyAxisAngle(particleData.rotationAxis, particleData.rotationSpeed * (p.dotSpeed ?? 1));
        pPositions[i * 3] = p1.x; pPositions[i * 3 + 1] = p1.y; pPositions[i * 3 + 2] = p1.z;

        for (let j = i + 1; j < (p.dotCount ?? 300); j++) {
          const p2 = new THREE.Vector3(pPositions[j * 3], pPositions[j * 3 + 1], pPositions[j * 3 + 2]);
          const dist = p1.distanceTo(p2);

          if (dist < (p.connectDistance ?? 1.0)) {
            const alpha = 1.0 - (dist / (p.connectDistance ?? 1.0));
            const cR = lineBase.r * alpha;
            const cG = lineBase.g * alpha;
            const cB = lineBase.b * alpha;

            lPositions[vertexpos++] = p1.x; lPositions[vertexpos++] = p1.y; lPositions[vertexpos++] = p1.z;
            lPositions[vertexpos++] = p2.x; lPositions[vertexpos++] = p2.y; lPositions[vertexpos++] = p2.z;

            lColors[colorpos++] = cR; lColors[colorpos++] = cG; lColors[colorpos++] = cB;
            lColors[colorpos++] = cR; lColors[colorpos++] = cG; lColors[colorpos++] = cB;
          }
        }
      }

      pGeometry.attributes.position.needsUpdate = true;
      lGeometry.setDrawRange(0, vertexpos / 3);
      lGeometry.attributes.position.needsUpdate = true;
      lGeometry.attributes.color.needsUpdate = true;

      composer.render();
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onWindowResize);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerUp);
      container.removeEventListener("wheel", onWheel);

      container.removeChild(renderer.domElement);
      sphereGeom.dispose();
      sphereMat.dispose();
      pGeometry.dispose();
      lGeometry.dispose();
      pMaterial.dispose();
      lMaterial.dispose();
      dotTexture.dispose();
      renderer.dispose();
    };
  }, []); 

  return (
    <div 
      ref={mountRef} 
      className={cn("w-full h-full min-h-[100vh] cursor-grab active:cursor-grabbing bg-[radial-gradient(circle_at_center,_#1a0b2e_0%,_#05020a_100%)]", className)} 
      style={{ touchAction: "none" }} 
    />
  );
};