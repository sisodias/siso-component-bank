"use client";

import React, { FC, useRef, useEffect, useState } from "react";

export interface NeonCrystalCityProps {
  /** Forward movement speed multiplier (default: 5) */
  cameraSpeed?: number;
  /** Size of each city block tile (default: 2) */
  tileSize?: number;
  /** Smooth‐union factor k (default: 0.5) */
  unionK?: number;
  /** Number of ray‐march steps (default: 100) */
  maxSteps?: number;
  /** Maximum ray distance (default: 100) */
  maxDist?: number;
  /** Surface hit threshold (default: 0.001) */
  surfDist?: number;
  /** Additional wrapper CSS classes */
  className?: string;
  /** ARIA label for screen readers */
  ariaLabel?: string;
}

const vsSource = `#version 300 es
in vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fsSource = `#version 300 es
precision highp float;

uniform vec2  u_resolution;
uniform float u_time;
uniform vec2  u_mouse;
uniform float u_cameraSpeed;
uniform float u_tileSize;
uniform float u_unionK;
uniform int   u_maxSteps;
uniform float u_maxDist;
uniform float u_surfDist;

out vec4 fragColor;

// SDF box
float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

// Smooth union
float opSmoothUnion(float d1, float d2, float k) {
  float h = clamp(0.5 + 0.5*(d2 - d1)/k, 0.0, 1.0);
  return mix(d2, d1, h) - k*h*(1.0 - h);
}

// Scene SDF: infinite crystal city
float getDist(vec3 p) {
  vec2 id = floor(p.xz / u_tileSize);
  p.xz = mod(p.xz, u_tileSize) - u_tileSize*0.5;

  float n = fract(sin(dot(id, vec2(12.9898,78.233))) * 43758.5453);
  float h = 1.0 + n * 4.0;
  float b = sdBox(p - vec3(0.0, h - 1.0, 0.0),
                  vec3(0.4, h, 0.4));

  if (n > 0.8) {
    float s = length(p - vec3(0.0, h*2.0, 0.0)) - 0.5;
    b = opSmoothUnion(b, s, u_unionK);
  }

  float ground = p.y + 1.0;
  return min(b, ground);
}

// Raymarching
float rayMarch(vec3 ro, vec3 rd) {
  float dist = 0.0;
  for (int i = 0; i < u_maxSteps; i++) {
    vec3 pos = ro + rd * dist;
    float dS = getDist(pos);
    dist += dS;
    if (dist > u_maxDist || abs(dS) < u_surfDist) break;
  }
  return dist;
}

// Estimate normal
vec3 getNormal(vec3 p) {
  vec2 e = vec2(u_surfDist, 0.0);
  return normalize(vec3(
    getDist(p + e.xyy) - getDist(p - e.xyy),
    getDist(p + e.yxy) - getDist(p - e.yxy),
    getDist(p + e.yyx) - getDist(p - e.yyx)
  ));
}

// Color palette
vec3 palette(float t) {
  vec3 a = vec3(0.5);
  vec3 b = vec3(0.5);
  vec3 c = vec3(1.0,1.0,0.5);
  vec3 d = vec3(0.8,0.9,0.3);
  return a + b * cos(6.28318 * (c*t + d));
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / u_resolution.y;

  // Camera moves forward
  vec3 ro = vec3(0.0, 0.0, u_time * u_cameraSpeed);
  vec3 rd = normalize(vec3(uv, 1.0));

  // Mouse‐look
  float mx = (u_mouse.x / u_resolution.x - 0.5) * 3.14;
  float my = (u_mouse.y / u_resolution.y - 0.5) * 1.5;
  mat3 rotX = mat3(
    1, 0, 0,
    0, cos(my), -sin(my),
    0, sin(my), cos(my)
  );
  mat3 rotY = mat3(
    cos(mx), 0, sin(mx),
    0, 1, 0,
    -sin(mx),0, cos(mx)
  );
  rd = rotY * rotX * rd;

  float dist = rayMarch(ro, rd);
  vec3 col = vec3(0.0);

  if (dist < u_maxDist) {
    vec3 p = ro + rd * dist;
    float idSeed = floor(p.xz / u_tileSize).x * 157.0
                 + floor(p.xz / u_tileSize).y * 311.0;
    float n = fract(sin(idSeed) * 43758.5453);

    // Vertical line glow
    float lines = abs(fract(p.y * 2.0) - 0.5);
    float glow  = pow(0.01 / lines, 1.5);
    col += palette(n + u_time * 0.1) * glow;
  }

  // Fog
  col = mix(col, vec3(0.0, 0.0, 0.05),
            smoothstep(0.0, u_maxDist * 0.7, dist));

  fragColor = vec4(col, 1.0);
}
`;

const NeonCrystalCity: FC<NeonCrystalCityProps> = ({
  cameraSpeed = 5,
  tileSize    = 2,
  unionK      = 0.5,
  maxSteps    = 100,
  maxDist     = 100,
  surfDist    = 0.001,
  className   = "",
  ariaLabel   = "Neon Crystal City shader background",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const frameId = useRef<number>();
  const mouse   = useRef({ x: 0, y: 0 });
  const start   = useRef<number>(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext("webgl2") as WebGL2RenderingContext)
      || (canvas.getContext("webgl")  as WebGLRenderingContext);
    if (!gl) {
      setError("WebGL not supported");
      return;
    }

    // Compile helper
    const compileShader = (
      type: GLenum,
      src: string
    ): WebGLShader | null => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        setError("Shader compile error (see console)");
        return null;
      }
      return sh;
    };

    // Compile & link
    const vs = compileShader(gl.VERTEX_SHADER,   vsSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      setError("Program link error (see console)");
      return;
    }

    // Locations
    const posLoc    = gl.getAttribLocation(prog, "a_position");
    const resLoc    = gl.getUniformLocation(prog, "u_resolution")!;
    const timeLoc   = gl.getUniformLocation(prog, "u_time")!;
    const mouseLoc  = gl.getUniformLocation(prog, "u_mouse")!;
    const speedLoc  = gl.getUniformLocation(prog, "u_cameraSpeed")!;
    const tileLoc   = gl.getUniformLocation(prog, "u_tileSize")!;
    const unionLoc  = gl.getUniformLocation(prog, "u_unionK")!;
    const stepsLoc  = gl.getUniformLocation(prog, "u_maxSteps")!;
    const maxLoc    = gl.getUniformLocation(prog, "u_maxDist")!;
    const surfLoc   = gl.getUniformLocation(prog, "u_surfDist")!;

    // Full‐screen quad
    const quadBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1,1, -1,-1, 1,1, 1,-1]),
      gl.STATIC_DRAW
    );

    // Mouse tracking
    const onMouse = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMouse);

    // Resize
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = canvas.clientWidth  * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener("resize", resize);
    resize();

    // Render loop
    const render = (t: number) => {
      if (error) return;

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(prog);

      gl.enableVertexAttribArray(posLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      const now = (Date.now() - start.current) * 0.001;
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, now);
      gl.uniform2f(mouseLoc, mouse.current.x, mouse.current.y);
      gl.uniform1f(speedLoc, cameraSpeed);
      gl.uniform1f(tileLoc, tileSize);
      gl.uniform1f(unionLoc, unionK);
      gl.uniform1i(stepsLoc, maxSteps);
      gl.uniform1f(maxLoc, maxDist);
      gl.uniform1f(surfLoc, surfDist);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frameId.current = requestAnimationFrame(render);
    };
    frameId.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId.current!);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [
    cameraSpeed,
    tileSize,
    unionK,
    maxSteps,
    maxDist,
    surfDist,
    error,
  ]);

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className={`relative w-full h-full overflow-hidden ${className}`}
    >
      {error && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center text-white font-mono p-4">
          {error}
        </div>
      )}
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default NeonCrystalCity;
