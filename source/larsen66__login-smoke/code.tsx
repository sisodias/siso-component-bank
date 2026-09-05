'use client';

import Image from "next/image";
import React, { useRef, useState, useEffect, ReactNode, MouseEvent } from "react";
import "@/index.css";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { EffectComposer, wrapEffect } from "@react-three/postprocessing";
import { Effect } from "postprocessing";
import * as THREE from "three";

const waveVertexShader = `
precision highp float;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
}
`;

const waveFragmentShader = `
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float waveSpeed;
uniform float waveFrequency;
uniform float waveAmplitude;
uniform vec3 waveColor;
uniform vec2 mousePos;
uniform int enableMouseInteraction;
uniform float mouseRadius;

vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

const int OCTAVES = 8;
float fbm(vec2 p) {
  float value = 0.0;
  float amp = 1.0;
  float freq = waveFrequency;
  for (int i = 0; i < OCTAVES; i++) {
    value += amp * abs(cnoise(p));
    p *= freq;
    amp *= waveAmplitude;
  }
  return value;
}

float pattern(vec2 p) {
  vec2 p2 = p - time * waveSpeed;
  return fbm(p - fbm(p + fbm(p2)));
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv -= 0.5;
  uv.x *= resolution.x / resolution.y;
  float f = pattern(uv);
  if (enableMouseInteraction == 1) {
    vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
    mouseNDC.x *= resolution.x / resolution.y;
    float dist = length(uv - mouseNDC);
    float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
    f -= 0.5 * effect;
  }
  vec3 col = mix(vec3(0.0), waveColor, f);
  gl_FragColor = vec4(col, 1.0);
}
`;

const ditherFragmentShader = `
precision highp float;
uniform float colorNum;
uniform float pixelSize;
const float bayerMatrix8x8[64] = float[64](
  0.0/64.0, 48.0/64.0, 12.0/64.0, 60.0/64.0,  3.0/64.0, 51.0/64.0, 15.0/64.0, 63.0/64.0,
  32.0/64.0,16.0/64.0, 44.0/64.0, 28.0/64.0, 35.0/64.0,19.0/64.0, 47.0/64.0, 31.0/64.0,
  8.0/64.0, 56.0/64.0,  4.0/64.0, 52.0/64.0, 11.0/64.0,59.0/64.0,  7.0/64.0, 55.0/64.0,
  40.0/64.0,24.0/64.0, 36.0/64.0, 20.0/64.0, 43.0/64.0,27.0/64.0, 39.0/64.0, 23.0/64.0,
  2.0/64.0, 50.0/64.0, 14.0/64.0, 62.0/64.0,  1.0/64.0,49.0/64.0, 13.0/64.0, 61.0/64.0,
  34.0/64.0,18.0/64.0, 46.0/64.0, 30.0/64.0, 33.0/64.0,17.0/64.0, 45.0/64.0, 29.0/64.0,
  10.0/64.0,58.0/64.0,  6.0/64.0, 54.0/64.0,  9.0/64.0,57.0/64.0,  5.0/64.0, 53.0/64.0,
  42.0/64.0,26.0/64.0, 38.0/64.0, 22.0/64.0, 41.0/64.0,25.0/64.0, 37.0/64.0, 21.0/64.0
);

vec3 dither(vec2 uv, vec3 color) {
  vec2 scaledCoord = floor(uv * resolution / pixelSize);
  int x = int(mod(scaledCoord.x, 8.0));
  int y = int(mod(scaledCoord.y, 8.0));
  float threshold = bayerMatrix8x8[y * 8 + x] - 0.25;
  float step = 1.0 / (colorNum - 1.0);
  color += threshold * step;
  float bias = 0.2;
  color = clamp(color - bias, 0.0, 1.0);
  return floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
}

void mainImage(in vec4 inputColor, in vec2 uv, out vec4 outputColor) {
  vec2 normalizedPixelSize = pixelSize / resolution;
  vec2 uvPixel = normalizedPixelSize * floor(uv / normalizedPixelSize);
  vec4 color = texture2D(inputBuffer, uvPixel);
  color.rgb = dither(uv, color.rgb);
  outputColor = color;
}
`;

class RetroEffectImpl extends Effect {
  public uniforms: Map<string, THREE.Uniform<any>>;
  constructor() {
    const uniforms = new Map<string, THREE.Uniform<any>>([
      ["colorNum", new THREE.Uniform(4.0)],
      ["pixelSize", new THREE.Uniform(2.0)],
    ]);
    super("RetroEffect", ditherFragmentShader, { uniforms });
    this.uniforms = uniforms;
  }
  set colorNum(value: number) {
    this.uniforms.get("colorNum")!.value = value;
  }
  get colorNum(): number {
    return this.uniforms.get("colorNum")!.value;
  }
  set pixelSize(value: number) {
    this.uniforms.get("pixelSize")!.value = value;
  }
  get pixelSize(): number {
    return this.uniforms.get("pixelSize")!.value;
  }
}

const RetroEffect = wrapEffect(
  RetroEffectImpl
) as React.ForwardRefExoticComponent<React.RefAttributes<RetroEffectImpl>>;

interface WaveUniforms {
  [key: string]: THREE.Uniform<any>;
  time: THREE.Uniform<number>;
  resolution: THREE.Uniform<THREE.Vector2>;
  waveSpeed: THREE.Uniform<number>;
  waveFrequency: THREE.Uniform<number>;
  waveAmplitude: THREE.Uniform<number>;
  waveColor: THREE.Uniform<THREE.Color>;
  mousePos: THREE.Uniform<THREE.Vector2>;
  enableMouseInteraction: THREE.Uniform<number>;
  mouseRadius: THREE.Uniform<number>;
}

interface DitheredWavesProps {
  waveSpeed: number;
  waveFrequency: number;
  waveAmplitude: number;
  waveColor: [number, number, number];
  colorNum: number;
  pixelSize: number;
  disableAnimation: boolean;
  enableMouseInteraction: boolean;
  mouseRadius: number;
}

function DitheredWaves({
  waveSpeed,
  waveFrequency,
  waveAmplitude,
  waveColor,
  colorNum,
  pixelSize,
  disableAnimation,
  enableMouseInteraction,
  mouseRadius
}: DitheredWavesProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const effect = useRef<any>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const { viewport, size, gl } = useThree();

  // Create ShaderMaterial instance ONCE
  const material = useRef<THREE.ShaderMaterial>(
    new THREE.ShaderMaterial({
      vertexShader: waveVertexShader,
      fragmentShader: waveFragmentShader,
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(0, 0) },
        waveSpeed: { value: waveSpeed },
        waveFrequency: { value: waveFrequency },
        waveAmplitude: { value: waveAmplitude },
        waveColor: { value: new THREE.Color(...waveColor) },
        mousePos: { value: new THREE.Vector2(0, 0) },
        enableMouseInteraction: { value: enableMouseInteraction ? 1 : 0 },
        mouseRadius: { value: mouseRadius }
      }
    })
  );

  useEffect(() => {
    const dpr = gl.getPixelRatio();
    const newWidth = Math.floor(size.width * dpr);
    const newHeight = Math.floor(size.height * dpr);
    material.current.uniforms.resolution.value.set(newWidth, newHeight);
    if (
      effect.current &&
      (effect.current as any).uniforms &&
      (effect.current as any).uniforms.get("resolution") &&
      (effect.current as any).uniforms.get("resolution").value
    ) {
      (effect.current as any).uniforms
        .get("resolution")
        .value.set(newWidth, newHeight);
    }
  }, [size, gl]);

  useEffect(() => {
    material.current.uniforms.waveSpeed.value = waveSpeed;
    material.current.uniforms.waveFrequency.value = waveFrequency;
    material.current.uniforms.waveAmplitude.value = waveAmplitude;
    material.current.uniforms.waveColor.value.set(...waveColor);
    material.current.uniforms.enableMouseInteraction.value = enableMouseInteraction ? 1 : 0;
    material.current.uniforms.mouseRadius.value = mouseRadius;
  }, [waveSpeed, waveFrequency, waveAmplitude, waveColor, enableMouseInteraction, mouseRadius]);

  useFrame(({ clock }) => {
    if (!disableAnimation) {
      material.current.uniforms.time.value = clock.getElapsedTime();
    }
    material.current.uniforms.mousePos.value.set(mousePos.x, mousePos.y);
    if (effect.current) {
      (effect.current as any).colorNum = colorNum;
      (effect.current as any).pixelSize = pixelSize;
    }
  });

  const handlePointerMove = (e: import('@react-three/fiber').ThreeEvent<PointerEvent>) => {
    if (!enableMouseInteraction) return;
    const rect = gl.domElement.getBoundingClientRect();
    const dpr = gl.getPixelRatio();
    const x = (e.clientX - rect.left) * dpr;
    const y = (e.clientY - rect.top) * dpr;
    setMousePos({ x, y });
  };

  return (
    <>
      <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry args={[1, 1]} />
        <primitive object={material.current} attach="material" />
      </mesh>
      {process.env.NODE_ENV === 'production' && (
        <EffectComposer>
          <RetroEffect ref={effect} />
        </EffectComposer>
      )}
      <mesh
        onPointerMove={handlePointerMove}
        position={[0, 0, 0.01]}
        scale={[viewport.width, viewport.height, 1]}
        visible={false}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}

interface DitherProps {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  waveColor?: [number, number, number];
  colorNum?: number;
  pixelSize?: number;
  disableAnimation?: boolean;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
}

function Dither({
  waveSpeed = 0.05,
  waveFrequency = 3,
  waveAmplitude = 0.3,
  waveColor = [0.5, 0.5, 0.6],
  colorNum = 4,
  pixelSize = 2,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 1,
}: DitherProps) {
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    setDpr(window.devicePixelRatio);
  }, []);

  return (
    <Canvas
      style={{ width: '100vw', height: '100vh', display: 'block', position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
      camera={{ position: [0, 0, 6] }}
      dpr={dpr}
      gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }}
    >
      <DitheredWaves
        waveSpeed={waveSpeed}
        waveFrequency={waveFrequency}
        waveAmplitude={waveAmplitude}
        waveColor={waveColor}
        colorNum={colorNum}
        pixelSize={pixelSize}
        disableAnimation={disableAnimation}
        enableMouseInteraction={enableMouseInteraction}
        mouseRadius={mouseRadius}
      />
    </Canvas>
  );
}

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

// SpotlightCard component
const SpotlightCard = ({ children, className = "" }: SpotlightCardProps) => (
  <div className={`w-[400px] h-[700px] mx-auto my-12 rounded-2xl border border-white/10 bg-slate-950/85 p-8 overflow-hidden backdrop-blur-md shadow-lg flex flex-col justify-center ${className}`}>
    {children}
  </div>
);

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [titleClass, setTitleClass] = useState("title-active");
  const [isAnimating, setIsAnimating] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (isLogin) {
      if (e.target.value.length > 0 && !showPassword) {
        setShowPassword(true);
      } else if (e.target.value.length === 0 && showPassword) {
        setShowPassword(false);
      }
    }
  };

  const handleTabChange = (loginMode: boolean) => {
    if (loginMode === isLogin || isAnimating) return;
    
    setIsAnimating(true);
    setTitleClass("title-exit");
    
    setTimeout(() => {
      setIsLogin(loginMode);
      setTitleClass("title-enter");
      
      setTimeout(() => {
        setTitleClass("title-active");
      }, 50);
      
      if (!loginMode) {
        setShowPassword(true);
      } else if (email.length === 0) {
        setShowPassword(false);
      }
      
      setTimeout(() => {
        setIsAnimating(false);
      }, 600);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLogin) {
      console.log("Login attempt:", { email, password });
    } else {
      console.log("Signup attempt:", { name, email, password, confirmPassword });
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login attempt");
  };

  const handleGithubLogin = () => {
    console.log("GitHub login attempt");
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <Dither 
          waveSpeed={0.05}
          waveFrequency={3}
          waveAmplitude={0.3}
          waveColor={[0.5, 0.5, 0.6]}
          colorNum={4}
          pixelSize={2}
          enableMouseInteraction={true}
          mouseRadius={1}
        />
      </div>

      {/* Content Layer */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
        <div className="relative z-[200] pointer-events-auto">
          <SpotlightCard>
            <div className="relative text-white z-[201] flex flex-col items-center gap-3 pt-4">
              <div className={`flex mb-6 rounded-lg overflow-hidden border border-white/10 relative z-[1] transform-gpu h-[42px] ${!isLogin ? 'signup' : ''} justify-center w-full max-w-[260px] mx-auto`}>
               <button 
                  className={`tab-btn ${isLogin ? 'active' : ''}`}
                  onClick={() => handleTabChange(true)}
                >
                  Login
                </button>
                <button 
                  className={`tab-btn ${!isLogin ? 'active' : ''}`}
                  onClick={() => handleTabChange(false)}
                >
                  Sign Up
                </button>
              </div>
              
              <h2 className={`login-title ${titleClass}`}>
                {isLogin ? "Login" : "Create Account"}
              </h2>
              
              <form onSubmit={handleSubmit} className="login-form">
                <div className={`form-container ${isLogin ? 'active-login' : 'inactive-login'}`}>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      value={email} 
                      onChange={handleEmailChange}
                      placeholder="Enter your email"
                      required
                      autoComplete="email"
                    />
                  </div>
                  
                  {showPassword && (
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input 
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        autoComplete="current-password"
                      />
                    </div>
                  )}
                  
                  <div className="form-footer">
                    <button type="submit" className="login-button px-6 py-4">
                      Sign In
                    </button>
                    
                    <a href="#" className="forgot-password">
                      Forgot password?
                    </a>
                  </div>
                </div>

                <div className={`form-container ${!isLogin ? 'active-signup' : 'inactive-signup'}`}>
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Enter your full name"
                      required={!isLogin}
                      autoComplete="name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="signup-email">Email</label>
                    <input 
                      type="email" 
                      id="signup-email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required={!isLogin}
                      autoComplete="email"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="signup-password">Password</label>
                    <input 
                      type="password" 
                      id="signup-password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      required={!isLogin}
                      autoComplete="new-password"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input 
                      type="password" 
                      id="confirm-password" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      required={!isLogin}
                      autoComplete="new-password"
                    />
                  </div>
                  
                  <div className="form-footer">
                    <button type="submit" className="login-button px-6 py-4">
                      Create Account
                    </button>
                  </div>
                </div>
              </form>

              <div className="social-login">
                <div className="divider">
                  <span>or continue with</span>
                </div>
                
                <div className="social-buttons">
                  <button 
                    onClick={handleGoogleLogin}
                    className="social-btn google-btn px-6 py-4"
                  >
                    <span className="icon">G</span>
                    Google
                  </button>
                  
                  <button 
                    onClick={handleGithubLogin}
                    className="social-btn github-btn px-6 py-4"
                  >
                    <span className="icon">G</span>
                    GitHub
                  </button>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </main>
  );
}
