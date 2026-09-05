import React, { useEffect, useRef, useState } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

interface PlasmaProps {
  color?: string;
  speed?: number;
  direction?: "forward" | "reverse" | "pingpong";
  scale?: number;
  opacity?: number;
  mouseInteractive?: boolean;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 0.5, 0.2];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
};

const vertex = `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;
  
  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);
  
  float i, d, z, T = iTime * uSpeed * uDirection;
  vec3 O, p, S;

  for (vec2 r = iResolution.xy, Q; ++i < 60.; O += o.w/d*o.xyz) {
    p = z*normalize(vec3(C-.5*r,r.y)); 
    p.z -= 4.; 
    S = p;
    d = p.y-T;
    
    p.x += .4*(1.+p.y)*sin(d + p.x*0.1)*cos(.34*d + p.x*0.05); 
    Q = p.xz *= mat2(cos(p.y+vec4(0,11,33,0)-T)); 
    z+= d = abs(sqrt(length(Q*Q)) - .25*(5.+S.y))/3.+8e-4; 
    o = 1.+sin(S.y+p.z*.5+S.z-length(S-p)+vec4(2,1,0,8));
  }
  
  o.xyz = tanh(O/1e4);
}

bool finite1(float x){ return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);
  
  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));
  
  float alpha = length(rgb) * uOpacity;
  fragColor = vec4(finalColor, alpha);
}`;

export const Plasma: React.FC<PlasmaProps> = ({
  color = "#ffffff",
  speed = 1,
  direction = "forward",
  scale = 1,
  opacity = 1,
  mouseInteractive = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const useCustomColor = color ? 1.0 : 0.0;
    const customColorRgb = color ? hexToRgb(color) : [1, 1, 1];

    const directionMultiplier = direction === "reverse" ? -1.0 : 1.0;

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    containerRef.current.appendChild(canvas);

    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex: vertex,
      fragment: fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uCustomColor: { value: new Float32Array(customColorRgb) },
        uUseCustomColor: { value: useCustomColor },
        uSpeed: { value: speed * 0.4 },
        uDirection: { value: directionMultiplier },
        uScale: { value: scale },
        uOpacity: { value: opacity },
        uMouse: { value: new Float32Array([0, 0]) },
        uMouseInteractive: { value: mouseInteractive ? 1.0 : 0.0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseInteractive) return;
      const rect = containerRef.current!.getBoundingClientRect();
      mousePos.current.x = e.clientX - rect.left;
      mousePos.current.y = e.clientY - rect.top;
      const mouseUniform = program.uniforms.uMouse.value as Float32Array;
      mouseUniform[0] = mousePos.current.x;
      mouseUniform[1] = mousePos.current.y;
    };

    if (mouseInteractive) {
      containerRef.current.addEventListener("mousemove", handleMouseMove);
    }

    const setSize = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height);
      const res = program.uniforms.iResolution.value as Float32Array;
      res[0] = gl.drawingBufferWidth;
      res[1] = gl.drawingBufferHeight;
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(containerRef.current);
    setSize();

    let raf = 0;
    const t0 = performance.now();
    const loop = (t: number) => {
      let timeValue = (t - t0) * 0.001;

      if (direction === "pingpong") {
        const cycle = Math.sin(timeValue * 0.5) * directionMultiplier;
        (program.uniforms.uDirection as any).value = cycle;
      }

      (program.uniforms.iTime as any).value = timeValue;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (mouseInteractive && containerRef.current) {
        containerRef.current.removeEventListener("mousemove", handleMouseMove);
      }
      try {
        containerRef.current?.removeChild(canvas);
      } catch {}
    };
  }, [color, speed, direction, scale, opacity, mouseInteractive]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden"
    />
  );
};

export function Logo() {
    return (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-16 w-16">
            <defs>
                <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#8B5CF6", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#6366F1", stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="lightPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#A78BFA", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#8B5CF6", stopOpacity: 1 }} />
                </linearGradient>
            </defs>
            <polygon points="50,25 65,35 65,55 50,65 35,55 35,35"
                fill="url(#purpleGradient)"
                stroke="none" />
            <circle cx="30" cy="30" r="4" fill="url(#lightPurple)" />
            <circle cx="70" cy="30" r="4" fill="url(#lightPurple)" />
            <circle cx="20" cy="50" r="4" fill="url(#lightPurple)" />
            <circle cx="80" cy="50" r="4" fill="url(#lightPurple)" />
            <circle cx="30" cy="70" r="4" fill="url(#lightPurple)" />
            <circle cx="70" cy="70" r="4" fill="url(#lightPurple)" />
            <line x1="30" y1="30" x2="42" y2="38" stroke="#A78BFA" strokeWidth="2" opacity="0.6" />
            <line x1="70" y1="30" x2="58" y2="38" stroke="#A78BFA" strokeWidth="2" opacity="0.6" />
            <line x1="20" y1="50" x2="35" y2="45" stroke="#A78BFA" strokeWidth="2" opacity="0.6" />
            <line x1="80" y1="50" x2="65" y2="45" stroke="#A78BFA" strokeWidth="2" opacity="0.6" />
            <line x1="30" y1="70" x2="42" y2="58" stroke="#A78BFA" strokeWidth="2" opacity="0.6" />
            <line x1="70" y1="70" x2="58" y2="58" stroke="#A78BFA" strokeWidth="2" opacity="0.6" />
            <path d="M 42 42 L 48 42 L 50 38 L 52 42 L 58 42 L 54 48 L 56 54 L 50 50 L 44 54 L 46 48 Z"
                fill="#FFFFFF"
                opacity="0.9" />
        </svg>)
}
const GlassmorphicNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 w-full max-w-6xl xl:px-0 px-12">
            <div className="bg-white/60 backdrop-blur-xl rounded-full px-6 py-1 shadow-lg border border-white/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Logo />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                            Mysh.ai
                        </span> 
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-1">
                        <a href="#" className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium rounded-full hover:bg-white/50 transition-colors">
                            Features
                        </a>
                        <a href="#" className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium rounded-full hover:bg-white/50 transition-colors">
                            Solutions
                        </a>
                        <a href="#" className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium rounded-full hover:bg-white/50 transition-colors">
                            Pricing
                        </a>
                        <a href="#" className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium rounded-full hover:bg-white/50 transition-colors">
                            Resources
                        </a>
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-2">
                        <a href="#" className="px-5 py-2 text-gray-700 font-medium rounded-full hover:bg-white/50 transition-colors">
                            Sign in
                        </a>
                        <a href="#" className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-full shadow-md hover:bg-indigo-700 transition-colors">
                            Get Started
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-full bg-white/50"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 bg-white/90 rounded-2xl p-4 shadow-lg border border-white/20">
                        <div className="flex flex-col space-y-3">
                            <a href="#" className="px-4 py-3 text-gray-700 hover:text-indigo-600 font-medium rounded-lg hover:bg-white transition-colors">
                                Features
                            </a>
                            <a href="#" className="px-4 py-3 text-gray-700 hover:text-indigo-600 font-medium rounded-lg hover:bg-white transition-colors">
                                Solutions
                            </a>
                            <a href="#" className="px-4 py-3 text-gray-700 hover:text-indigo-600 font-medium rounded-lg hover:bg-white transition-colors">
                                Pricing
                            </a>
                            <a href="#" className="px-4 py-3 text-gray-700 hover:text-indigo-600 font-medium rounded-lg hover:bg-white transition-colors">
                                Resources
                            </a>
                            <div className="border-t border-gray-200 pt-3 flex flex-col space-y-3">
                                <a href="#" className="px-4 py-3 text-center text-gray-700 font-medium rounded-lg bg-white/50">
                                    Sign in
                                </a>
                                <a href="#" className="px-4 py-3 text-center bg-indigo-600 text-white font-medium rounded-lg shadow-md">
                                    Get Started
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

const HeroSection = () => {
    return (
        <div className="min-h-screen relative overflow-hidden w-full">
            {/* Navbar */}
            <GlassmorphicNavbar />

            {/* Plasma background with light theme settings */}
            <div className="absolute inset-0 z-0">
                <Plasma
                    color="#4f46e5"
                    speed={0.5}
                    direction="forward"
                    scale={1.2}
                    opacity={0.15}
                    mouseInteractive={true}
                />

                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white/80"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-52 pb-20 text-center">
                {/* Badge */}
                <div className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-800 mb-8">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    AI-Powered Platform v2.0
                </div>

                {/* Main headline */}
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight pb-4">
                    Transform Your Business with
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 block mt-2 pb-2">
                        AI Intelligence
                    </span>
                </h1>

                {/* Subheadline */}
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
                    Our advanced AI platform helps businesses automate processes, gain insights, and make data-driven decisions with unparalleled accuracy.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                    <button className="px-8 py-4 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700 transition-colors duration-300 transform hover:-translate-y-1">
                        Get Started Free
                    </button>
                    <button className="px-8 py-4 bg-white text-gray-900 font-medium rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        Watch Demo
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">98%</div>
                        <div className="text-gray-600">Accuracy</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">24/7</div>
                        <div className="text-gray-600">AI Monitoring</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">5x</div>
                        <div className="text-gray-600">Faster Analysis</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">100+</div>
                        <div className="text-gray-600">Integrations</div>
                    </div>
                </div>
            </div>

            {/* Floating elements for visual interest */}
            <div className="absolute top-1/4 left-10 w-6 h-6 rounded-full bg-indigo-200/40 blur-xl"></div>
            <div className="absolute bottom-1/3 right-16 w-10 h-10 rounded-full bg-purple-200/30 blur-xl"></div>
            <div className="absolute top-1/3 right-1/4 w-8 h-8 rounded-full bg-blue-200/40 blur-xl"></div>
        </div>
    );
};

export {HeroSection};
