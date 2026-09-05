import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface MouseState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
}

const vertexShaderSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  
  #define PI 3.14159265359
  #define TAU 6.28318530718
  #define MAX_STEPS 80
  #define MAX_DIST 100.0
  #define SURF_DIST 0.0001
  
  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }
  
  mat2 rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
  }
  
  float sdSphere(vec3 p, float r) {
    return length(p) - r;
  }
  
  float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
  }
  
  float sdOctahedron(vec3 p, float s) {
    p = abs(p);
    float m = p.x + p.y + p.z - s;
    vec3 q;
    if(3.0 * p.x < m) q = p.xyz;
    else if(3.0 * p.y < m) q = p.yzx;
    else if(3.0 * p.z < m) q = p.zxy;
    else return m * 0.57735027;
    
    float k = clamp(0.5 * (q.z - q.y + s), 0.0, s);
    return length(vec3(q.x, q.y - s + k, q.z - k));
  }
  
  float sdTriPrism(vec3 p, vec2 h) {
    vec3 q = abs(p);
    return max(q.z - h.y, max(q.x * 0.866025 + p.y * 0.5, -p.y) - h.x * 0.5);
  }
  
  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }
  
  float smax(float a, float b, float k) {
    return -smin(-a, -b, k);
  }
  
  float map(vec3 p) {
    vec3 op = p;
    vec2 m = (uMouse - 0.5) * 2.5;
    p.xy += m * 0.4;
    p.xz *= rot(uTime * 0.12);
    p.xy *= rot(uTime * 0.08);
    
    float d = 100.0;
    vec3 p1 = p;
    p1.yz *= rot(uTime * 0.15);
    
    float core_distort = sin(p1.x * 3.0 + uTime) * sin(p1.y * 3.0 + uTime) * sin(p1.z * 3.0 + uTime) * 0.1;
    float core = sdOctahedron(p1, 1.6) + core_distort;
    
    vec3 p2 = p1;
    p2.xy *= rot(PI * 0.25 + uTime * 0.2);
    float prism = sdTriPrism(p2, vec2(1.4, 2.0));
    core = smax(core, -prism, 0.2);
    d = core;
    
    float k_blend = 0.2 + 0.15 * (0.5 + 0.5 * sin(uTime * 1.5));
    
    for(int i = 0; i < 4; i++) {
      float fi = float(i);
      float angle = fi * TAU / 4.0 + uTime * 0.3;
      float radius = 3.0 + 0.3 * sin(uTime * 0.4 + fi);
      
      vec3 pos = vec3(
        cos(angle) * radius,
        sin(angle * 0.7) * 1.0,
        sin(angle) * radius
      );
      
      vec3 po = p - pos;
      po.xy *= rot(uTime * 0.5 + fi);
      
      float sat_distort = sin(po.x * 5.0 + fi) * sin(po.y * 5.0 + fi) * sin(po.z * 5.0 + fi) * 0.05;
      float satellite = sdOctahedron(po, 0.4) + sat_distort;
      d = smin(d, satellite, k_blend);
    }
    
    return d;
  }
  
  vec3 getNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
      map(p + e.xyy) - map(p - e.xyy),
      map(p + e.yxy) - map(p - e.yxy),
      map(p + e.yyx) - map(p - e.yyx)
    ));
  }
  
  float raymarch(vec3 ro, vec3 rd) {
    float t = 0.0;
    for(int i = 0; i < MAX_STEPS; i++) {
      vec3 p = ro + rd * t;
      float d = map(p);
      if(abs(d) < SURF_DIST || t > MAX_DIST) break;
      t += d * 0.7;
    }
    return t;
  }
  
  vec3 getBackground(vec3 rd) {
    float stars = 0.0;
    vec3 p = rd * 100.0;
    float h = hash(dot(p, vec3(12.9898, 78.233, 54.53)));
    if(h > 0.98) stars = pow(h - 0.98, 10.0) * 20.0;
    
    vec3 nebula = vec3(0.0);
    nebula += vec3(0.3, 0.15, 0.5) * pow(max(0.0, sin(rd.x * 2.0 + uTime * 0.1)), 3.0) * 0.2;
    nebula += vec3(0.15, 0.3, 0.6) * pow(max(0.0, sin(rd.y * 2.5 + uTime * 0.05)), 3.0) * 0.2;
    
    return stars + nebula;
  }
  
  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
    vec2 m = (uMouse - 0.5) * 0.5;
    vec3 ro = vec3(m.x * 2.0, m.y * 2.0, 5.5);
    vec3 rd = normalize(vec3(uv, -1.0));
    
    rd.xy *= rot(m.x * 0.2);
    rd.yz *= rot(m.y * 0.2);
    
    float t = raymarch(ro, rd);
    vec3 color = vec3(0.0);
    
    if(t < MAX_DIST) {
      vec3 p = ro + rd * t;
      vec3 normal = getNormal(p);
      vec3 viewDir = normalize(ro - p);
      float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);
      
      float ior = 1.5;
      vec3 refractDir = refract(rd, normal, 1.0 / ior);
      
      if(length(refractDir) > 0.0) {
        float t2 = raymarch(p - normal * 0.01, refractDir);
        
        if(t2 < MAX_DIST) {
          vec3 p2 = p - normal * 0.01 + refractDir * t2;
          vec3 normal2 = getNormal(p2);
          
          vec3 r = refract(refractDir, -normal2, ior - 0.2);
          vec3 g = refract(refractDir, -normal2, ior);
          vec3 b = refract(refractDir, -normal2, ior + 0.2);
          
          vec3 bgR = getBackground(r) * vec3(1.4, 0.7, 0.7);
          vec3 bgG = getBackground(g) * vec3(0.7, 1.4, 0.8);
          vec3 bgB = getBackground(b) * vec3(0.7, 0.8, 1.4);
          
          color = vec3(bgR.x, bgG.y, bgB.z);
          color = pow(color, vec3(0.7)) * 5.0;
        } else {
          color = getBackground(refractDir) * 2.0;
        }
      }
      
      vec3 lightDir = normalize(vec3(1.0, 1.0, -1.0));
      vec3 halfDir = normalize(lightDir + viewDir);
      float spec = pow(max(dot(normal, halfDir), 0.0), 150.0);
      color += spec * vec3(1.0, 1.0, 1.0) * 3.5;
      
      vec3 fresnelColor = vec3(
        0.5 + 0.5 * sin(fresnel * TAU + uTime),
        0.5 + 0.5 * sin(fresnel * TAU + uTime + TAU / 3.0),
        0.5 + 0.5 * sin(fresnel * TAU + uTime + TAU * 2.0 / 3.0)
      );
      color += fresnel * fresnelColor * 1.2;
      
      float edge = pow(1.0 - abs(dot(viewDir, normal)), 4.0);
      color += edge * vec3(0.6, 0.7, 1.0) * 0.7;
      
      float sss = pow(max(dot(-normal, lightDir), 0.0), 2.0);
      color += sss * vec3(1.0, 0.6, 0.8) * 0.5;
    } else {
      color = getBackground(rd);
    }
    
    float vignette = 1.0 - length(uv) * 0.4;
    vignette = smoothstep(0.3, 1.0, vignette);
    color *= vignette;
    color *= vec3(0.96, 0.99, 1.06);
    color = pow(color, vec3(0.88));
    color *= 1.12;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export const Component = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const mouseRef = useRef<MouseState>({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const startTimeRef = useRef<number>(Date.now());
  const animationFrameRef = useRef<number>();
  const [buttonHover, setButtonHover] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }
    glRef.current = gl as WebGLRenderingContext;

    const createShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const createProgram = (vs: WebGLShader, fs: WebGLShader): WebGLProgram | null => {
      const program = gl.createProgram();
      if (!program) return null;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program link error:", gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }
      return program;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const program = createProgram(vertexShader, fragmentShader);
    if (!program) return;
    programRef.current = program;

    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resizeCanvas();

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);

    const render = () => {
      if (!gl || !program || !canvas) return;

      const currentTime = (Date.now() - startTimeRef.current) * 0.001;
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);

      const uTime = gl.getUniformLocation(program, "uTime");
      const uResolution = gl.getUniformLocation(program, "uResolution");
      const uMouse = gl.getUniformLocation(program, "uMouse");

      gl.uniform1f(uTime, currentTime);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouse.x, mouse.y);

      const positionLocation = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      resizeObserver.disconnect();
      if (gl && program) {
        gl.deleteProgram(program);
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    mouseRef.current.targetX = e.clientX / canvas.width;
    mouseRef.current.targetY = 1.0 - e.clientY / canvas.height;
  };

  const handleButtonMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setButtonHover({ x, y });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        className="absolute inset-0 w-full h-full"
      />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center pointer-events-none">
        <h1 className={cn(
          "text-[clamp(9.5rem,10vw,17rem)] font-black mb-2 tracking-tighter",
          "bg-gradient-to-br from-white via-gray-100 to-white bg-clip-text text-transparent",
          "animate-[glowPulse_3s_ease-in-out_infinite_alternate]"
        )}
        style={{
          filter: "drop-shadow(0 0 40px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 80px rgba(138, 43, 226, 0.3))"
        }}>
          TWENTYFIRST
        </h1>
        
        <p className={cn(
          "text-[clamp(0.9rem,2vw,3.2rem)] font-light tracking-[0.3em] uppercase",
          "text-white/90"
        )}
        style={{
          textShadow: "0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(138, 43, 226, 0.3)"
        }}>
          WebGL Hero
        </p>
        
        <div className="flex justify-center gap-24 mt-16 pointer-events-auto">
          {["Discover", "Join Now"].map((text) => (
            <button
              key={text}
              onMouseMove={handleButtonMouseMove}
              className={cn(
                "relative px-10 py-4 text-base font-semibold tracking-wider text-white",
                "rounded-full overflow-hidden cursor-pointer",
                "transition-all duration-500 ease-out",
                "hover:scale-105 hover:-translate-y-1",
                "active:scale-98 active:translate-y-0"
              )}
              style={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
                backdropFilter: "blur(30px)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(255, 255, 255, 0.05)",
                ...(buttonHover && {
                  "--x": `${buttonHover.x}%`,
                  "--y": `${buttonHover.y}%`
                } as React.CSSProperties)
              }}
            >
              <span className="absolute inset-0 rounded-full p-[1.5px] bg-gradient-to-r from-white/40 via-purple-500/40 via-cyan-500/40 via-pink-500/40 to-white/40 bg-[length:200%_200%] animate-[borderFlow_3s_linear_infinite] opacity-60 hover:opacity-100 transition-opacity"
              style={{
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude"
              }} />
              
              <span className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255, 255, 255, 0.2) 0%, transparent 50%)`
              }} />
              
              <span className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-[30deg] animate-[shimmer_2s_infinite]" />
              
              <span className="relative z-10">{text}</span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes glowPulse {
          from {
            filter: drop-shadow(0 0 40px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 80px rgba(138, 43, 226, 0.3));
          }
          to {
            filter: drop-shadow(0 0 60px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 120px rgba(0, 191, 255, 0.4));
          }
        }
        
        @keyframes borderFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(30deg); }
          100% { transform: translateX(100%) rotate(30deg); }
        }
      `}</style>
    </div>
  );
};