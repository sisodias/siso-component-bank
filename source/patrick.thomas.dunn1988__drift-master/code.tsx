"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { cn } from "@/lib/utils";

// --- Types ---

export interface CarData {
  url: string;
  name: string;
  desc: string;
}

interface ComponentProps {
  cars?: CarData[];
  className?: string;
}

// --- Constants ---

const DEFAULT_CARS: CarData[] = [
  {
    url: "https://pub-a56d70d158b1414d83c3856ea210601c.r2.dev/Cars/nissan_s15_drift_free.glb",
    name: "S15 DRIFT",
    desc: "Spec-R drift build",
  },
  {
    url: "https://pub-a56d70d158b1414d83c3856ea210601c.r2.dev/Cars/Sil80.glb",
    name: "SIL80",
    desc: "Street legend",
  },
  {
    url: "https://pub-a56d70d158b1414d83c3856ea210601c.r2.dev/Cars/Rx-7FD1.glb",
    name: "RX-7 FD",
    desc: "Rotary icon",
  },
  {
    url: "https://pub-a56d70d158b1414d83c3856ea210601c.r2.dev/Cars/RX-7FD2.glb",
    name: "RX-7 TRACK",
    desc: "Track aero",
  },
  {
    url: "https://pub-a56d70d158b1414d83c3856ea210601c.r2.dev/Cars/Mustang.glb",
    name: "MUSTANG",
    desc: "American muscle",
  },
  {
    url: "https://pub-a56d70d158b1414d83c3856ea210601c.r2.dev/Cars/280z.glb",
    name: "280Z",
    desc: "Vintage Z",
  },
  {
    url: "https://pub-a56d70d158b1414d83c3856ea210601c.r2.dev/Cars/180xsWidebody.glb",
    name: "WIDEBODY",
    desc: "Rocket Bunny",
  },
  {
    url: "https://pub-a56d70d158b1414d83c3856ea210601c.r2.dev/Cars/180sx.glb",
    name: "180SX",
    desc: "Drift platform",
  },
];

const CONFIG = {
  spacing: 60,
  targetSize: 8,
};

// --- Helper Logic ---

class TextParticle {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  x: number;
  y: number;
  size: number;
  alpha: number;

  constructor(x: number, y: number) {
    this.startX = x + (Math.random() - 0.5) * 200;
    this.startY = y + (Math.random() - 0.5) * 200;
    this.targetX = x;
    this.targetY = y;
    this.x = this.startX;
    this.y = this.startY;
    this.size = 2 + Math.random() * 3;
    this.alpha = 0;
  }

  update(progress: number) {
    const eased =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    this.x = this.startX + (this.targetX - this.startX) * eased;
    this.y = this.startY + (this.targetY - this.startY) * eased;
    this.alpha = Math.min(1, eased * 1.2);
  }
}

// --- Component ---

export const Component = ({
  cars = DEFAULT_CARS,
  className,
}: ComponentProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeCarIndex, setActiveCarIndex] = useState(0);

  // Use refs for animation loop values to avoid re-renders
  const scrollProgressRef = useRef(0);
  const loadedCarsRef = useRef<THREE.Group[]>([]);
  const lookTargetRef = useRef(new THREE.Vector3(0, 1.5, 0));
  const currentLookTargetRef = useRef(new THREE.Vector3(0, 1.5, 0));
  const textParticlesRef = useRef<TextParticle[]>([]);
  const textTransitionProgressRef = useRef(1);
  const loadedFontRef = useRef<any>(null); // Type 'any' for Three Font
  const keyframesRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mountRef.current || !textContainerRef.current) return;

    // -- 1. Setup Three.js Scene --
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf6f6f6);
    scene.fog = new THREE.FogExp2(0xf6f6f6, 0.006);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(12 * 0.7, 2.5, 12 * 0.7);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Handle strict mode double-mount by clearing first
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }
    mountRef.current.appendChild(renderer.domElement);

    // -- 2. Lighting & Environment --
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    new RGBELoader().load(
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_08_1k.hdr",
      (texture) => {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        scene.environment = envMap;
        texture.dispose();
        pmremGenerator.dispose();
      }
    );

    scene.add(new THREE.AmbientLight(0xffffff, 0.18));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(12, 18, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.radius = 4;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-10, 8, 5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
    rimLight.position.set(-15, 12, -12);
    scene.add(rimLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 0.6);
    topLight.position.set(0, 25, 0);
    scene.add(topLight);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 1000),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.15,
        metalness: 0,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.z = -250;
    floor.receiveShadow = true;
    scene.add(floor);

    // -- 3. Text Particle System Setup --
    const textScene = new THREE.Scene();
    const textWidth = textContainerRef.current.offsetWidth;
    const textHeight = textContainerRef.current.offsetHeight;
    const textCamera = new THREE.OrthographicCamera(
      0,
      textWidth,
      0,
      textHeight,
      1,
      1000
    );
    textCamera.position.z = 100;

    const textRenderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    textRenderer.setSize(textWidth, textHeight);
    textRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    while (textContainerRef.current.firstChild) {
      textContainerRef.current.removeChild(textContainerRef.current.firstChild);
    }
    textContainerRef.current.appendChild(textRenderer.domElement);

    const fontLoader = new FontLoader();
    fontLoader.load(
      "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json",
      (font) => {
        loadedFontRef.current = font;
      }
    );

    const sampleTextPoints = (text: string) => {
      if (!loadedFontRef.current) return [];
      const shapes = loadedFontRef.current.generateShapes(text, 40);
      const points: { x: number; y: number }[] = [];
      shapes.forEach((shape: any) => {
        const shapePoints = shape.getPoints(5);
        shapePoints.forEach((point: any) => {
          points.push({ x: point.x, y: point.y });
        });
      });
      return points;
    };

    const setText = (text: string) => {
      if (!loadedFontRef.current) return;
      const points = sampleTextPoints(text);
      textParticlesRef.current = points.map(
        (p) => new TextParticle(p.x + 50, p.y + 80)
      );
      textTransitionProgressRef.current = 0;
    };

    // -- 4. Load Cars --
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    gltfLoader.setDRACOLoader(dracoLoader);

    let loadCount = 0;
    const normalizeModel = (model: THREE.Group) => {
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = CONFIG.targetSize / maxDim;
      model.scale.setScalar(scale);

      box.setFromObject(model);
      const center = new THREE.Vector3();
      box.getCenter(center);
      model.position.sub(center);

      box.setFromObject(model);
      model.position.y -= box.min.y;
    };

    cars.forEach((data, i) => {
      gltfLoader.load(data.url, (gltf) => {
        const model = gltf.scene;
        model.traverse((o: any) => {
          if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
          }
        });
        normalizeModel(model);
        model.position.z = -i * CONFIG.spacing;
        scene.add(model);
        loadedCarsRef.current[i] = model;

        loadCount++;
        setLoadingProgress((loadCount / cars.length) * 100);

        if (loadCount === cars.length) {
          // Calculate Keyframes
          calculateKeyframes();
          setIsLoaded(true);

          // Initial Text
          const interval = setInterval(() => {
            if (loadedFontRef.current) {
              setText(cars[0].name);
              clearInterval(interval);
            }
          }, 100);
        }
      });
    });

    // -- 5. Keyframe Calculation Logic --
    const calculateKeyframes = () => {
      const radius = 12;
      const baseHeight = 2.5;
      const keys: any[] = [];
      const loadedCars = loadedCarsRef.current;

      if (!loadedCars[0]) return;

      // Start position
      keys.push({
        progress: 0,
        x: loadedCars[0].position.x + radius * 0.7,
        y: baseHeight,
        z: loadedCars[0].position.z + radius * 0.7,
        lookX: loadedCars[0].position.x,
        lookY: 1.5,
        lookZ: loadedCars[0].position.z,
      });

      loadedCars.forEach((car, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        const carZ = car.position.z;
        const carX = car.position.x;
        const segmentStart = i / cars.length;
        const segmentLen = 1 / cars.length;
        const orbitSteps = 6;

        for (let s = 0; s <= orbitSteps; s++) {
          const t = s / orbitSteps;
          const angle = t * Math.PI * 1.5 * dir;
          const startAngle = dir > 0 ? 0.4 : Math.PI - 0.4;
          const actualAngle = startAngle + angle;

          if (i === 0 && s === 0) continue;

          keys.push({
            progress: segmentStart + t * segmentLen * 0.75,
            x: carX + Math.cos(actualAngle) * radius,
            y: baseHeight + Math.sin(t * Math.PI) * 0.6,
            z: carZ + Math.sin(actualAngle) * radius,
            lookX: carX,
            lookY: 1.5,
            lookZ: carZ,
          });
        }

        if (i < loadedCars.length - 1) {
          const nextCar = loadedCars[i + 1];
          const nextDir = (i + 1) % 2 === 0 ? 1 : -1;
          keys.push({
            progress: segmentStart + segmentLen * 0.85,
            x: carX + nextDir * radius * 0.5,
            y: baseHeight + 0.8,
            z: (carZ + nextCar.position.z) / 2,
            lookX: nextCar.position.x,
            lookY: 1.5,
            lookZ: nextCar.position.z,
          });
        }
      });

      keys.sort((a, b) => a.progress - b.progress);
      keyframesRef.current = keys;
    };

    // -- 6. Animation Loop --
    const smoothstep = (t: number) => t * t * (3 - 2 * t);

    const getInterpolatedPosition = (progress: number) => {
      const keyframes = keyframesRef.current;
      if (keyframes.length === 0) return null;

      let i = 0;
      while (i < keyframes.length - 1 && keyframes[i + 1].progress < progress) {
        i++;
      }

      const k1 = keyframes[Math.max(0, i)];
      const k2 = keyframes[Math.min(keyframes.length - 1, i + 1)];

      if (k1 === k2) return k1;

      const range = k2.progress - k1.progress;
      const t = range > 0 ? smoothstep((progress - k1.progress) / range) : 0;

      return {
        x: k1.x + (k2.x - k1.x) * t,
        y: k1.y + (k2.y - k1.y) * t,
        z: k1.z + (k2.z - k1.z) * t,
        lookX: k1.lookX + (k2.lookX - k1.lookX) * t,
        lookY: k1.lookY + (k2.lookY - k1.lookY) * t,
        lookZ: k1.lookZ + (k2.lookZ - k1.lookZ) * t,
      };
    };

    let animationFrameId: number;
    let lastIndex = -1;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Camera Movement
      const pos = getInterpolatedPosition(scrollProgressRef.current);
      if (pos) {
        camera.position.x += (pos.x - camera.position.x) * 0.08;
        camera.position.y += (pos.y - camera.position.y) * 0.08;
        camera.position.z += (pos.z - camera.position.z) * 0.08;

        lookTargetRef.current.set(pos.lookX, pos.lookY, pos.lookZ);
        currentLookTargetRef.current.lerp(lookTargetRef.current, 0.06);
        camera.lookAt(currentLookTargetRef.current);
      }

      renderer.render(scene, camera);

      // Text Particles
      if (textTransitionProgressRef.current < 1) {
        textTransitionProgressRef.current = Math.min(
          1,
          textTransitionProgressRef.current + 0.02
        );
      }

      const ctx = textRenderer.domElement.getContext("2d");
      if (ctx) {
        ctx.clearRect(
          0,
          0,
          textRenderer.domElement.width,
          textRenderer.domElement.height
        );
        ctx.fillStyle = "#111111"; // Swiss black

        textParticlesRef.current.forEach((p) => {
          p.update(textTransitionProgressRef.current);
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(
            p.x * window.devicePixelRatio,
            (200 - p.y) * window.devicePixelRatio,
            p.size * window.devicePixelRatio,
            0,
            Math.PI * 2
          );
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      }

      // Update UI state if needed
      if (loadedCarsRef.current.length > 0) {
        const idx = Math.min(
          cars.length - 1,
          Math.floor(scrollProgressRef.current * cars.length)
        );
        if (idx !== lastIndex) {
          lastIndex = idx;
          setActiveCarIndex(idx);
          if (loadedFontRef.current) {
            setText(cars[idx].name);
          }
        }
      }
    };

    animate();

    // -- 7. Handlers --
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Update text renderer
      if (textContainerRef.current) {
        const tw = textContainerRef.current.offsetWidth;
        const th = textContainerRef.current.offsetHeight;
        textCamera.right = tw;
        textCamera.top = th;
        textCamera.updateProjectionMatrix();
        textRenderer.setSize(tw, th);
      }
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate scroll progress (0 to 1) based on container visibility
      const totalScroll = rect.height - viewportHeight;
      const currentScroll = -rect.top;

      let progress = currentScroll / totalScroll;
      progress = Math.max(0, Math.min(1, progress));

      scrollProgressRef.current = progress;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Init

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);

      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      if (textContainerRef.current && textContainerRef.current.contains(textRenderer.domElement)) {
        textContainerRef.current.removeChild(textRenderer.domElement);
      }
      renderer.dispose();
      dracoLoader.dispose();
    };
  }, [cars]);

  // CSS string helper to avoid markdown template literal issues
  const css = "@import url('https://api.fontshare.com/v2/css?f[]=clash-display@200,400,600,700&f[]=general-sans@300,400,500&display=swap'); .font-clash { font-family: 'Clash Display', sans-serif; } .font-general { font-family: 'General Sans', sans-serif; }";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div
        ref={containerRef}
        className={cn("relative w-full bg-[#ECECEC]", className)}
        style={{ height: `${cars.length * 200}vh` }} // Tall container for scroll
      >
        {/* Sticky Viewport */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          
          {/* Loading Screen */}
          <div
            className={cn(
              "absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#111] text-[#ECECEC] transition-transform duration-1000 ease-in-out",
              isLoaded ? "-translate-y-full" : "translate-y-0"
            )}
          >
            <h1 className="font-clash text-4xl md:text-6xl uppercase tracking-tighter mb-8">
              Loading Collection
            </h1>
            <div className="w-64 h-[2px] bg-[#333] relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-[#ECECEC] transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <div className="font-mono text-xs mt-4 opacity-50">
              CALIBRATING MODEL SCALE...
            </div>
          </div>

          {/* 3D Scene Container */}
          <div ref={mountRef} className="absolute inset-0 z-10 pointer-events-none" />

          {/* Text Particles Container */}
          <div
            ref={textContainerRef}
            className="absolute bottom-[10vh] left-[5vw] z-30 pointer-events-none w-[90vw] h-[200px]"
          />

          {/* UI Layer */}
          <div className="absolute inset-0 z-20 pointer-events-none mix-blend-difference text-[#ECECEC] p-6 md:p-12 flex flex-col justify-between">
            {/* Header */}
            <div 
              className="flex justify-between items-start opacity-0 animate-in fade-in duration-1000 delay-1000 fill-mode-forwards" 
              style={{ animationPlayState: isLoaded ? 'running' : 'paused'}}
            >
              <h2 className="font-clash text-xl font-bold tracking-widest">SHOWROOM // 08</h2>
            </div>

            {/* Info */}
            <div className={cn(
                "absolute bottom-[10vh] left-[5vw] transition-all duration-700 ease-out transform",
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              )}>
               <div className="flex flex-col md:flex-row items-start gap-4 mt-20 md:mt-0">
                  <div className="font-mono text-sm border border-white/30 px-2 py-1">
                    {String(activeCarIndex + 1).padStart(2, '0')} / {String(cars.length).padStart(2, '0')}
                  </div>
                  <p className="font-general text-sm max-w-sm opacity-80 uppercase tracking-wide">
                    {cars[activeCarIndex]?.desc || "Loading data..."}
                  </p>
               </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 h-[30vh] w-[2px] bg-white/10 hidden md:block">
              <div 
                className="w-full bg-white transition-all duration-100 ease-linear"
                style={{ height: `${(scrollProgressRef.current || 0) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};