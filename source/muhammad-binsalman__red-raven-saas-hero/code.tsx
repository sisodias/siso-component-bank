import React, { useEffect, useRef, useState } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import { Menu, X, Sparkles, Zap, Brain, Cpu, ArrowRight, Check, Star } from "lucide-react";
import { Component } from 'lucide-react';

// GradientBlinds Component
interface GradientBlindsProps {
  className?: string;
  dpr?: number;
  paused?: boolean;
  gradientColors?: string[];
  angle?: number;
  noise?: number;
  blindCount?: number;
  blindMinWidth?: number;
  mouseDampening?: number;
  mirrorGradient?: boolean;
  spotlightRadius?: number;
  spotlightSoftness?: number;
  spotlightOpacity?: number;
  distortAmount?: number;
  shineDirection?: "left" | "right";
  mixBlendMode?: string;
}

const MAX_COLORS = 8;
const hexToRGB = (hex: string): [number, number, number] => {
  const c = hex.replace("#", "").padEnd(6, "0");
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  return [r, g, b];
};

const prepStops = (stops?: string[]) => {
  const base = (stops && stops.length ? stops : ["#FF9FFC", "#5227FF"]).slice(
    0,
    MAX_COLORS
  );
  if (base.length === 1) base.push(base[0]);
  while (base.length < MAX_COLORS) base.push(base[base.length - 1]);
  const arr: [number, number, number][] = [];
  for (let i = 0; i < MAX_COLORS; i++) arr.push(hexToRGB(base[i]));
  const count = Math.max(2, Math.min(MAX_COLORS, stops?.length ?? 2));
  return { arr, count };
};

const GradientBlinds: React.FC<GradientBlindsProps> = ({
  className,
  dpr,
  paused = false,
  gradientColors,
  angle = 0,
  noise = 0.3,
  blindCount = 16,
  blindMinWidth = 60,
  mouseDampening = 0.15,
  mirrorGradient = false,
  spotlightRadius = 0.5,
  spotlightSoftness = 1,
  spotlightOpacity = 1,
  distortAmount = 0,
  shineDirection = "left",
  mixBlendMode = "lighten",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const programRef = useRef<Program | null>(null);
  const meshRef = useRef<Mesh<Triangle> | null>(null);
  const geometryRef = useRef<Triangle | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const mouseTargetRef = useRef<[number, number]>([0, 0]);
  const lastTimeRef = useRef<number>(0);
  const firstResizeRef = useRef<boolean>(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      dpr:
        dpr ??
        (typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1),
      alpha: true,
      antialias: true,
    });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;

    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    const vertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

    const fragment = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec3  iResolution;
uniform vec2  iMouse;
uniform float iTime;

uniform float uAngle;
uniform float uNoise;
uniform float uBlindCount;
uniform float uSpotlightRadius;
uniform float uSpotlightSoftness;
uniform float uSpotlightOpacity;
uniform float uMirror;
uniform float uDistort;
uniform float uShineFlip;
uniform vec3  uColor0;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform vec3  uColor4;
uniform vec3  uColor5;
uniform vec3  uColor6;
uniform vec3  uColor7;
uniform int   uColorCount;

varying vec2 vUv;

float rand(vec2 co){
  return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453);
}

vec2 rotate2D(vec2 p, float a){
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c) * p;
}

vec3 getGradientColor(float t){
  float tt = clamp(t, 0.0, 1.0);
  int count = uColorCount;
  if (count < 2) count = 2;
  float scaled = tt * float(count - 1);
  float seg = floor(scaled);
  float f = fract(scaled);

  if (seg < 1.0) return mix(uColor0, uColor1, f);
  if (seg < 2.0 && count > 2) return mix(uColor1, uColor2, f);
  if (seg < 3.0 && count > 3) return mix(uColor2, uColor3, f);
  if (seg < 4.0 && count > 4) return mix(uColor3, uColor4, f);
  if (seg < 5.0 && count > 5) return mix(uColor4, uColor5, f);
  if (seg < 6.0 && count > 6) return mix(uColor5, uColor6, f);
  if (seg < 7.0 && count > 7) return mix(uColor6, uColor7, f);
  if (count > 7) return uColor7;
  if (count > 6) return uColor6;
  if (count > 5) return uColor5;
  if (count > 4) return uColor4;
  if (count > 3) return uColor3;
  if (count > 2) return uColor2;
  return uColor1;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv0 = fragCoord.xy / iResolution.xy;

    float aspect = iResolution.x / iResolution.y;
    vec2 p = uv0 * 2.0 - 1.0;
    p.x *= aspect;
    vec2 pr = rotate2D(p, uAngle);
    pr.x /= aspect;
    vec2 uv = pr * 0.5 + 0.5;

    vec2 uvMod = uv;
    if (uDistort > 0.0) {
      float a = uvMod.y * 6.0;
      float b = uvMod.x * 6.0;
      float w = 0.01 * uDistort;
      uvMod.x += sin(a) * w;
      uvMod.y += cos(b) * w;
    }
    float t = uvMod.x;
    if (uMirror > 0.5) {
      t = 1.0 - abs(1.0 - 2.0 * fract(t));
    }
    vec3 base = getGradientColor(t);

    vec2 offset = vec2(iMouse.x/iResolution.x, iMouse.y/iResolution.y);
  float d = length(uv0 - offset);
  float r = max(uSpotlightRadius, 1e-4);
  float dn = d / r;
  float spot = (1.0 - 2.0 * pow(dn, uSpotlightSoftness)) * uSpotlightOpacity;
  vec3 cir = vec3(spot);
  float stripe = fract(uvMod.x * max(uBlindCount, 1.0));
  if (uShineFlip > 0.5) stripe = 1.0 - stripe;
    vec3 ran = vec3(stripe);

    vec3 col = cir + base - ran;
    col += (rand(gl_FragCoord.xy + iTime) - 0.5) * uNoise;

    fragColor = vec4(col, 1.0);
}

void main() {
    vec4 color;
    mainImage(color, vUv * iResolution.xy);
    gl_FragColor = color;
}
`;

    const { arr: colorArr, count: colorCount } = prepStops(gradientColors);
    const uniforms: any = {
      iResolution: {
        value: [gl.drawingBufferWidth, gl.drawingBufferHeight, 1],
      },
      iMouse: { value: [0, 0] },
      iTime: { value: 0 },
      uAngle: { value: (angle * Math.PI) / 180 },
      uNoise: { value: noise },
      uBlindCount: { value: Math.max(1, blindCount) },
      uSpotlightRadius: { value: spotlightRadius },
      uSpotlightSoftness: { value: spotlightSoftness },
      uSpotlightOpacity: { value: spotlightOpacity },
      uMirror: { value: mirrorGradient ? 1 : 0 },
      uDistort: { value: distortAmount },
      uShineFlip: { value: shineDirection === "right" ? 1 : 0 },
      uColor0: { value: colorArr[0] },
      uColor1: { value: colorArr[1] },
      uColor2: { value: colorArr[2] },
      uColor3: { value: colorArr[3] },
      uColor4: { value: colorArr[4] },
      uColor5: { value: colorArr[5] },
      uColor6: { value: colorArr[6] },
      uColor7: { value: colorArr[7] },
      uColorCount: { value: colorCount },
    };

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms,
    });
    programRef.current = program;

    const geometry = new Triangle(gl);
    geometryRef.current = geometry;
    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      uniforms.iResolution.value = [
        gl.drawingBufferWidth,
        gl.drawingBufferHeight,
        1,
      ];

      if (blindMinWidth && blindMinWidth > 0) {
        const maxByMinWidth = Math.max(
          1,
          Math.floor(rect.width / blindMinWidth)
        );

        const effective = blindCount
          ? Math.min(blindCount, maxByMinWidth)
          : maxByMinWidth;
        uniforms.uBlindCount.value = Math.max(1, effective);
      } else {
        uniforms.uBlindCount.value = Math.max(1, blindCount);
      }

      if (firstResizeRef.current) {
        firstResizeRef.current = false;
        const cx = gl.drawingBufferWidth / 2;
        const cy = gl.drawingBufferHeight / 2;
        uniforms.iMouse.value = [cx, cy];
        mouseTargetRef.current = [cx, cy];
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scale = (renderer as any).dpr || 1;
      const x = (e.clientX - rect.left) * scale;
      const y = (rect.height - (e.clientY - rect.top)) * scale;
      mouseTargetRef.current = [x, y];
      if (mouseDampening <= 0) {
        uniforms.iMouse.value = [x, y];
      }
    };
    canvas.addEventListener("pointermove", onPointerMove);

    const loop = (t: number) => {
      rafRef.current = requestAnimationFrame(loop);
      uniforms.iTime.value = t * 0.001;
      if (mouseDampening > 0) {
        if (!lastTimeRef.current) lastTimeRef.current = t;
        const dt = (t - lastTimeRef.current) / 1000;
        lastTimeRef.current = t;
        const tau = Math.max(1e-4, mouseDampening);
        let factor = 1 - Math.exp(-dt / tau);
        if (factor > 1) factor = 1;
        const target = mouseTargetRef.current;
        const cur = uniforms.iMouse.value;
        cur[0] += (target[0] - cur[0]) * factor;
        cur[1] += (target[1] - cur[1]) * factor;
      } else {
        lastTimeRef.current = t;
      }
      if (!paused && programRef.current && meshRef.current) {
        try {
          renderer.render({ scene: meshRef.current });
        } catch (e) {
          console.error(e);
        }
      }
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("pointermove", onPointerMove);
      ro.disconnect();
      if (canvas.parentElement === container) {
        container.removeChild(canvas);
      }
      const callIfFn = <T extends object, K extends keyof T>(
        obj: T | null,
        key: K
      ) => {
        if (obj && typeof obj[key] === "function") {
          (obj[key] as unknown as () => void).call(obj);
        }
      };
      callIfFn(programRef.current, "remove");
      callIfFn(geometryRef.current, "remove");
      callIfFn(meshRef.current as unknown as { remove?: () => void }, "remove");
      callIfFn(
        rendererRef.current as unknown as { destroy?: () => void },
        "destroy"
      );
      programRef.current = null;
      geometryRef.current = null;
      meshRef.current = null;
      rendererRef.current = null;
    };
  }, [
    dpr,
    paused,
    gradientColors,
    angle,
    noise,
    blindCount,
    blindMinWidth,
    mouseDampening,
    mirrorGradient,
    spotlightRadius,
    spotlightSoftness,
    spotlightOpacity,
    distortAmount,
    shineDirection,
  ]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden relative ${className}`}
      style={{
        ...(mixBlendMode && {
          mixBlendMode: mixBlendMode as React.CSSProperties["mixBlendMode"],
        }),
      }}
    />
  );
};

// Main Landing Page Component
const AILandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Advanced AI Models",
      description: "State-of-the-art machine learning algorithms that adapt to your business needs"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Process millions of data points in seconds with our optimized infrastructure"
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Smart Automation",
      description: "Automate complex workflows and eliminate repetitive tasks"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      features: ["10K API calls/month", "Basic analytics", "Email support", "Standard models"]
    },
    {
      name: "Pro",
      price: "$99",
      features: ["100K API calls/month", "Advanced analytics", "Priority support", "All models", "Custom integrations"],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: ["Unlimited API calls", "Custom models", "Dedicated support", "On-premise deployment", "SLA guarantee"]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Gradient */}
      <div className="fixed inset-0 z-0">
        <GradientBlinds
          gradientColors={['#DC143C', '#8B0000', '#B22222', '#FF4500']}
          angle={45}
          noise={0.4}
          blindCount={12}
          blindMinWidth={50}
          spotlightRadius={0.5}
          spotlightSoftness={1.2}
          spotlightOpacity={0.8}
          mouseDampening={0.1}
          distortAmount={0.5}
          shineDirection="right"
          mixBlendMode="multiply"
        />
      </div>

      {/* Glassmorphism Navbar */}
      <nav className="fixed top-3 left-20 right-20 z-50 bg-black/10 backdrop-blur-md border border-white/10 rounded-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Component className="w-8 h-8 text-red-500" />
              <span className="ml-2 text-xl font-bold">MyshAI</span>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8 font-thin">
                <a href="#features" className="hover:text-red-400 transition-colors">Features</a>
                <a href="#pricing" className="hover:text-red-400 transition-colors">Pricing</a>
                <a href="#about" className="hover:text-red-400 transition-colors">About</a>
                <a href="#contact" className="hover:text-red-400 transition-colors">Contact</a>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <button className="text-white hover:text-red-400 transition-colors">Sign In</button>
              <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full transition-colors">
                Get Started
              </button>
            </div>
            
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white hover:text-red-400"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-md border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 hover:text-red-400">Features</a>
              <a href="#pricing" className="block px-3 py-2 hover:text-red-400">Pricing</a>
              <a href="#about" className="block px-3 py-2 hover:text-red-400">About</a>
              <a href="#contact" className="block px-3 py-2 hover:text-red-400">Contact</a>
              <div className="flex space-x-2 px-3 pt-4">
                <button className="flex-1 text-center py-2 border border-white/20 rounded hover:bg-white/10">
                  Sign In
                </button>
                <button className="flex-1 text-center py-2 bg-red-600 hover:bg-red-700 rounded">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-900/30 border border-red-500/30 text-red-300 text-sm mb-8 font-thin">
              <Sparkles className="w-4 h-4 mr-2" />
              Next-Generation AI Platform
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-thin mb-6 leading-tight">
            Unleash the Power of Artificial Intelligence
          </h1>
          
          <p className="text-md md:text-xl text-gray-300 mb-12  font-thin max-w-3xl mx-auto leading-relaxed">
            Transform your business with cutting-edge AI solutions. From machine learning to neural networks, 
            we provide the tools you need to stay ahead in the digital age.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
             <button
      className="group relative bg-neutral-800 rounded-full p-px cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <span className="absolute inset-0 rounded-full overflow-hidden">
        <span className="inset-0 absolute pointer-events-none select-none">
          <span
            className="block -translate-x-1/2 -translate-y-1/3 size-24 blur-xl"
            style={{ 
              background: 'linear-gradient(135deg, rgb(122, 105, 249), rgb(242, 99, 120), rgb(245, 131, 63))'
            }}
          ></span>
        </span>
      </span>

      <span
        className="inset-0 absolute pointer-events-none select-none"
        style={{ 
          animation: '10s ease-in-out 0s infinite alternate none running border-glow-translate' 
        }}
      >
        <span
          className="block z-0 h-full w-12 blur-xl -translate-x-1/2 rounded-full"
          style={{ 
            animation: '10s ease-in-out 0s infinite alternate none running border-glow-scale',
            background: 'linear-gradient(135deg, rgb(122, 105, 249), rgb(242, 99, 120), rgb(245, 131, 63))'
          }}
        ></span>
      </span>

      <span className="flex items-center justify-center relative z-[1] dark:bg-neutral-950/90 bg-neutral-50/90 rounded-full py-4 px-8 w-full">
        <span className="bg-gradient-to-b dark:from-white dark:to-white/50 from-neutral-950 to-neutral-950/50 bg-clip-text text-lg text-transparent group-hover:scale-105 transition-transform duration-500">
          Get Started
        </span>
      </span>
    </button>
            <button className="px-8 py-4 rounded-full text-lg border border-white/20 bg-white/10 hover:bg-white/30 cursor-pointer transition-colors">
              Watch Demo
            </button>
          </div>
          
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-gray-400 font-thin">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              <span>4.9/5 Rating</span>
            </div>
            <div>500K+ Users</div>
            <div>99.9% Uptime</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export {AILandingPage};