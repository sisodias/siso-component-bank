import React, { useRef, useEffect, useState } from 'react';
import { ArrowRight, Play, Users, Package, TrendingUp, Clock, BarChart3 } from 'lucide-react';
import { Renderer, Program, Triangle, Mesh } from "ogl";


export type RaysOrigin =
  | "top-center"
  | "top-left"
  | "top-right"
  | "right"
  | "left"
  | "bottom-center"
  | "bottom-right"
  | "bottom-left";

interface LightRaysProps {
  raysOrigin?: RaysOrigin;
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  pulsating?: boolean;
  fadeDistance?: number;
  saturation?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  noiseAmount?: number;
  distortion?: number;
  className?: string;
}

const DEFAULT_COLOR = "#ffffff";

const hexToRgb = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? [
        parseInt(m[1], 16) / 255,
        parseInt(m[2], 16) / 255,
        parseInt(m[3], 16) / 255,
      ]
    : [1, 1, 1];
};

const getAnchorAndDir = (
  origin: RaysOrigin,
  w: number,
  h: number
): { anchor: [number, number]; dir: [number, number] } => {
  const outside = 0.2;
  switch (origin) {
    case "top-left":
      return { anchor: [0, -outside * h], dir: [0, 1] };
    case "top-right":
      return { anchor: [w, -outside * h], dir: [0, 1] };
    case "left":
      return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
    case "right":
      return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
    case "bottom-left":
      return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
    case "bottom-center":
      return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
    case "bottom-right":
      return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
    default: // "top-center"
      return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
  }
};

const LightRays: React.FC<LightRaysProps> = ({
  raysOrigin = "top-center",
  raysColor = DEFAULT_COLOR,
  raysSpeed = 1,
  lightSpread = 1,
  rayLength = 2,
  pulsating = false,
  fadeDistance = 1.0,
  saturation = 1.0,
  followMouse = true,
  mouseInfluence = 0.1,
  noiseAmount = 0.0,
  distortion = 0.0,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniformsRef = useRef<any>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const animationIdRef = useRef<number | null>(null);
  const meshRef = useRef<any>(null);
  const cleanupFunctionRef = useRef<(() => void) | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    if (cleanupFunctionRef.current) {
      cleanupFunctionRef.current();
      cleanupFunctionRef.current = null;
    }

    const initializeWebGL = async () => {
      if (!containerRef.current) return;

      await new Promise((resolve) => setTimeout(resolve, 10));

      if (!containerRef.current) return;

      const renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio, 2),
        alpha: true,
      });
      rendererRef.current = renderer;

      const gl = renderer.gl;
      gl.canvas.style.width = "100%";
      gl.canvas.style.height = "100%";

      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
      containerRef.current.appendChild(gl.canvas);

      const vert = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

      const frag = `precision highp float;

uniform float iTime;
uniform vec2  iResolution;

uniform vec2  rayPos;
uniform vec2  rayDir;
uniform vec3  raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float pulsating;
uniform float fadeDistance;
uniform float saturation;
uniform vec2  mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;

varying vec2 vUv;

float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                  float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  vec2 dirNorm = normalize(sourceToCoord);
  float cosAngle = dot(dirNorm, rayRefDirection);

  float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;
  
  float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));

  float distance = length(sourceToCoord);
  float maxDistance = iResolution.x * rayLength;
  float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
  
  float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
  float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;

  float baseStrength = clamp(
    (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
    0.0, 1.0
  );

  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  
  vec2 finalRayDir = rayDir;
  if (mouseInfluence > 0.0) {
    vec2 mouseScreenPos = mousePos * iResolution.xy;
    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
  }

  vec4 rays1 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349,
                           1.5 * raysSpeed);
  vec4 rays2 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234,
                           1.1 * raysSpeed);

  fragColor = rays1 * 0.5 + rays2 * 0.4;

  if (noiseAmount > 0.0) {
    float n = noise(coord * 0.01 + iTime * 0.1);
    fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
  }

  float brightness = 1.0 - (coord.y / iResolution.y);
  fragColor.x *= 0.1 + brightness * 0.8;
  fragColor.y *= 0.3 + brightness * 0.6;
  fragColor.z *= 0.5 + brightness * 0.5;

  if (saturation != 1.0) {
    float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
    fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
  }

  fragColor.rgb *= raysColor;
}

void main() {
  vec4 color;
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor  = color;
}`;

      const uniforms = {
        iTime: { value: 0 },
        iResolution: { value: [1, 1] },

        rayPos: { value: [0, 0] },
        rayDir: { value: [0, 1] },

        raysColor: { value: hexToRgb(raysColor) },
        raysSpeed: { value: raysSpeed },
        lightSpread: { value: lightSpread },
        rayLength: { value: rayLength },
        pulsating: { value: pulsating ? 1.0 : 0.0 },
        fadeDistance: { value: fadeDistance },
        saturation: { value: saturation },
        mousePos: { value: [0.5, 0.5] },
        mouseInfluence: { value: mouseInfluence },
        noiseAmount: { value: noiseAmount },
        distortion: { value: distortion },
      };
      uniformsRef.current = uniforms;

      const geometry = new Triangle(gl);
      const program = new Program(gl, {
        vertex: vert,
        fragment: frag,
        uniforms,
      });
      const mesh = new Mesh(gl, { geometry, program });
      meshRef.current = mesh;

      const updatePlacement = () => {
        if (!containerRef.current || !renderer) return;

        renderer.dpr = Math.min(window.devicePixelRatio, 2);

        const { clientWidth: wCSS, clientHeight: hCSS } = containerRef.current;
        renderer.setSize(wCSS, hCSS);

        const dpr = renderer.dpr;
        const w = wCSS * dpr;
        const h = hCSS * dpr;

        uniforms.iResolution.value = [w, h];

        const { anchor, dir } = getAnchorAndDir(raysOrigin, w, h);
        uniforms.rayPos.value = anchor;
        uniforms.rayDir.value = dir;
      };

      const loop = (t: number) => {
        if (!rendererRef.current || !uniformsRef.current || !meshRef.current) {
          return;
        }

        uniforms.iTime.value = t * 0.001;

        if (followMouse && mouseInfluence > 0.0) {
          const smoothing = 0.92;

          smoothMouseRef.current.x =
            smoothMouseRef.current.x * smoothing +
            mouseRef.current.x * (1 - smoothing);
          smoothMouseRef.current.y =
            smoothMouseRef.current.y * smoothing +
            mouseRef.current.y * (1 - smoothing);

          uniforms.mousePos.value = [
            smoothMouseRef.current.x,
            smoothMouseRef.current.y,
          ];
        }

        try {
          renderer.render({ scene: mesh });
          animationIdRef.current = requestAnimationFrame(loop);
        } catch (error) {
          console.warn("WebGL rendering error:", error);
          return;
        }
      };

      window.addEventListener("resize", updatePlacement);
      updatePlacement();
      animationIdRef.current = requestAnimationFrame(loop);

      cleanupFunctionRef.current = () => {
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
          animationIdRef.current = null;
        }

        window.removeEventListener("resize", updatePlacement);

        if (renderer) {
          try {
            const canvas = renderer.gl.canvas;
            const loseContextExt =
              renderer.gl.getExtension("WEBGL_lose_context");
            if (loseContextExt) {
              loseContextExt.loseContext();
            }

            if (canvas && canvas.parentNode) {
              canvas.parentNode.removeChild(canvas);
            }
          } catch (error) {
            console.warn("Error during WebGL cleanup:", error);
          }
        }

        rendererRef.current = null;
        uniformsRef.current = null;
        meshRef.current = null;
      };
    };

    initializeWebGL();

    return () => {
      if (cleanupFunctionRef.current) {
        cleanupFunctionRef.current();
        cleanupFunctionRef.current = null;
      }
    };
  }, [
    isVisible,
    raysOrigin,
    raysColor,
    raysSpeed,
    lightSpread,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    followMouse,
    mouseInfluence,
    noiseAmount,
    distortion,
  ]);

  useEffect(() => {
    if (!uniformsRef.current || !containerRef.current || !rendererRef.current)
      return;

    const u = uniformsRef.current;
    const renderer = rendererRef.current;

    u.raysColor.value = hexToRgb(raysColor);
    u.raysSpeed.value = raysSpeed;
    u.lightSpread.value = lightSpread;
    u.rayLength.value = rayLength;
    u.pulsating.value = pulsating ? 1.0 : 0.0;
    u.fadeDistance.value = fadeDistance;
    u.saturation.value = saturation;
    u.mouseInfluence.value = mouseInfluence;
    u.noiseAmount.value = noiseAmount;
    u.distortion.value = distortion;

    const { clientWidth: wCSS, clientHeight: hCSS } = containerRef.current;
    const dpr = renderer.dpr;
    const { anchor, dir } = getAnchorAndDir(raysOrigin, wCSS * dpr, hCSS * dpr);
    u.rayPos.value = anchor;
    u.rayDir.value = dir;
  }, [
    raysColor,
    raysSpeed,
    lightSpread,
    raysOrigin,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    mouseInfluence,
    noiseAmount,
    distortion,
  ]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !rendererRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseRef.current = { x, y };
    };

    if (followMouse) {
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [followMouse]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full pointer-events-none z-[3] overflow-hidden relative ${className}`.trim()}
    />
  );
};

export function AlterHeroClone() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative w-full overflow-hidden">
      {/* Background decorative elements with WebGL light beams */}
      <div className="absolute inset-0 overflow-hidden">
        {/* WebGL Light Rays Effect */}
        <LightRays
    raysOrigin="top-center"
    raysColor="#5D3FD3"
    raysSpeed={1.2}
    lightSpread={0.8}
    rayLength={1.2}
    followMouse={true}
    mouseInfluence={0.1}
    noiseAmount={0.2}
    distortion={0.05}
    className="custom-rays"
  />
        
        {/* Soft gradient orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-100 rounded-full opacity-25 blur-3xl"></div>
        
        {/* Additional atmospheric effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/10 pointer-events-none"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black rounded transform rotate-12 flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm transform -rotate-12"></div>
          </div>
          <span className="text-xl font-semibold text-gray-900">Alter</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Changelog</a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
        </nav>

        <button className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-slate-700 transition-colors">
          <span className="text-sm font-medium">Get Template</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          {/* App Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center">
              <div className="w-10 h-10 bg-white rounded-lg transform rotate-12 flex items-center justify-center">
                <div className="w-6 h-6 bg-slate-800 rounded transform -rotate-12"></div>
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-6 leading-tight">
            Automate. Engage. Convert.
            <br />
            <span className="text-gray-700">Powered by AI.</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Your journey to AI-powered marketing starts here
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center space-x-2 hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="bg-slate-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center space-x-2 hover:bg-slate-600 transition-colors">
              <Play className="w-5 h-5" />
              <span>Learn More</span>
            </button>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="relative max-w-6xl mx-auto">
          {/* Stats Cards Row */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {/* Total User Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500 text-sm font-medium">Total User</span>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">50,789</div>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">8.5%</span>
                <span className="text-gray-500 ml-1">Up from yesterday</span>
              </div>
            </div>

            {/* Total Order Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500 text-sm font-medium">Total Order</span>
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">20393</div>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">1.3%</span>
                <span className="text-gray-500 ml-1">Up from past week</span>
              </div>
            </div>

            {/* Total Sales Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500 text-sm font-medium">Total Sales</span>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">$60,000</div>
              <div className="flex items-center text-sm">
                <div className="w-4 h-4 text-red-500 mr-1 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 transform rotate-180" />
                </div>
                <span className="text-red-500 font-medium">4.3%</span>
                <span className="text-gray-500 ml-1">Down from yesterday</span>
              </div>
            </div>

            {/* Total Pending Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500 text-sm font-medium">Total Pending</span>
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-gray-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">5040</div>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">1.8%</span>
                <span className="text-gray-500 ml-1">Up from yesterday</span>
              </div>
            </div>
          </div>

          {/* Sales Details Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Sales Details</h3>
              <div className="flex items-center space-x-2">
                <select className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm border-0 focus:ring-2 focus:ring-purple-500">
                  <option>October</option>
                </select>
              </div>
            </div>
            
            {/* Chart Area */}
            <div className="relative h-48 flex items-end justify-between px-4">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400">
                <span>100%</span>
                <span>80%</span>
                <span>60%</span>
                <span>40%</span>
                <span>20%</span>
                <span>0%</span>
              </div>
              
              {/* Chart bars */}
              <div className="flex items-end justify-center space-x-8 h-full w-full ml-8">
                {/* Bar 1 */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-16 h-24 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg shadow-lg"></div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-2 py-1 rounded text-xs font-medium">
                      34,493
                    </div>
                  </div>
                </div>
                
                {/* Bar 2 */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-16 h-40 bg-gradient-to-t from-purple-600 to-purple-500 rounded-t-lg shadow-lg"></div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                      70,867
                    </div>
                  </div>
                </div>
                
                {/* Bar 3 */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-t from-purple-300 to-purple-200 rounded-t-lg shadow-lg"></div>
                </div>
              </div>
            </div>
            
            {/* X-axis labels */}
            <div className="flex justify-center mt-4 space-x-8 ml-8">
              <span className="text-xs text-gray-400">Sep</span>
              <span className="text-xs text-gray-400">Oct</span>
              <span className="text-xs text-gray-400">Nov</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}