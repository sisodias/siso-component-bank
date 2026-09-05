"use client";

import React, { FC, useRef, useEffect, useState } from "react";

export interface PulsingGeometricDreamProps {
  /** Base radius of the first pulsing circle */
  circleRadius1?: number;
  /** Base radius of the second pulsing circle */
  circleRadius2?: number;
  /** Amplitude of the circle pulsing */
  pulseAmplitude?: number;
  /** Speed of the pulsing animation */
  pulseSpeed?: number;
  /** Spacing of the rotating grid pattern */
  gridSpacing?: number;
  /** Half‐size of each box in the grid */
  boxHalfSize?: [number, number];
  /** Smooth union blending factor */
  unionK?: number;
  /** Vignette intensity (0–1) */
  vignetteStrength?: number;
  /** Extra CSS classes on the wrapper */
  className?: string;
  /** Accessible label for the region */
  ariaLabel?: string;
}

const vsSource = `#version 100
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fsSource = `precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_circleR1;
uniform float u_circleR2;
uniform float u_amp;
uniform float u_speed;
uniform float u_grid;
uniform vec2  u_box;
uniform float u_k;
uniform float u_vignette;

// Signed‐distance for a circle
float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

// Signed‐distance for a box
float sdBox(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

// Smooth union of two distances
float opSmoothUnion(float d1, float d2, float k) {
  float h = clamp(0.5 + 0.5*(d2 - d1)/k, 0.0, 1.0);
  return mix(d2, d1, h) - k*h*(1.0 - h);
}

// Palette by Inigo Quilez
vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(6.28318 * (c * t + d));
}

void main() {
  vec2 uv = (2.0 * gl_FragCoord.xy - u_resolution) / u_resolution.y;
  
  // Pulsing circles
  float r1 = u_circleR1 + u_amp * sin(u_time * u_speed);
  float r2 = u_circleR2 + u_amp * cos(u_time * u_speed + 1.57);
  float dC1 = sdCircle(uv, r1);
  float dC2 = sdCircle(uv, r2);
  float d = min(max(-dC1, dC2), 1e6);

  // Rotating grid of boxes
  vec2 pGrid = mod(uv, u_grid) - u_grid * 0.5;
  float ang = u_time * 0.8;
  mat2 rot = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
  vec2 pRot = rot * pGrid;
  float dBox = sdBox(pRot, u_box);
  d = opSmoothUnion(d, dBox, u_k);

  // Color & glow
  vec3 col = palette(
    length(uv) - u_time * 0.1,
    vec3(0.5),
    vec3(0.5),
    vec3(1.0),
    vec3(0.0, 0.10, 0.20)
  );
  col *= (1.0 - exp(-6.0 * abs(d)));
  col *= 0.8 + 0.2 * cos(150.0 * d);
  col = mix(col, vec3(1.0), 1.0 - smoothstep(0.0, 0.01, abs(d)));

  // Vignette
  float vig = smoothstep(1.0, 1.0 - u_vignette, length(uv));
  col *= 1.0 - vig;

  gl_FragColor = vec4(col, 1.0);
}
`;

const PulsingGeometricDream: FC<PulsingGeometricDreamProps> = ({
  circleRadius1    = 0.4,
  circleRadius2    = 0.6,
  pulseAmplitude   = 0.1,
  pulseSpeed       = 0.5,
  gridSpacing      = 0.5,
  boxHalfSize      = [0.1, 0.1],
  unionK           = 0.1,
  vignetteStrength = 0.5,
  className        = "",
  ariaLabel        = "Pulsing geometric dream shader background",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const frameId = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Request WebGL context
    const gl =
      (canvas.getContext("webgl2") as WebGL2RenderingContext)
      || (canvas.getContext("webgl")  as WebGLRenderingContext);
    if (!gl) {
      setError("WebGL not supported");
      return;
    }

    // Compile shader helper
    const compile = (type: GLenum, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        setError("Shader compile error. See console.");
        return null;
      }
      return sh;
    };

    // Compile and link
    const vs = compile(gl.VERTEX_SHADER,   vsSource);
    const fs = compile(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      setError("Program link error. See console.");
      return;
    }

    // Locations
    const aPos   = gl.getAttribLocation(prog, "a_position");
    const uRes   = gl.getUniformLocation(prog, "u_resolution")!;
    const uTime  = gl.getUniformLocation(prog, "u_time")!;
    const uR1    = gl.getUniformLocation(prog, "u_circleR1")!;
    const uR2    = gl.getUniformLocation(prog, "u_circleR2")!;
    const uAmp   = gl.getUniformLocation(prog, "u_amp")!;
    const uSpd   = gl.getUniformLocation(prog, "u_speed")!;
    const uGrid  = gl.getUniformLocation(prog, "u_grid")!;
    const uBox   = gl.getUniformLocation(prog, "u_box")!;
    const uK     = gl.getUniformLocation(prog, "u_k")!;
    const uVig   = gl.getUniformLocation(prog, "u_vignette")!;

    // Full‐screen quad buffer
    const quad = new Float32Array([
      -1, -1,  1, -1,  -1, 1,
      -1,  1,  1, -1,   1, 1,
    ]);
    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    // Resize handling
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width  = rect.width * dpr;
      canvas.height = rect.height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // Render loop
    const start = Date.now();
    const render = () => {
      const t = (Date.now() - start) * 0.001;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(prog);

      // Bind attributes
      gl.enableVertexAttribArray(aPos);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      // Set uniforms
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uR1, circleRadius1);
      gl.uniform1f(uR2, circleRadius2);
      gl.uniform1f(uAmp, pulseAmplitude);
      gl.uniform1f(uSpd, pulseSpeed);
      gl.uniform1f(uGrid, gridSpacing);
      gl.uniform2fv(uBox, boxHalfSize);
      gl.uniform1f(uK, unionK);
      gl.uniform1f(uVig, vignetteStrength);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frameId.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(frameId.current!);
      ro.disconnect();
    };
  }, [
    circleRadius1,
    circleRadius2,
    pulseAmplitude,
    pulseSpeed,
    gridSpacing,
    boxHalfSize,
    unionK,
    vignetteStrength,
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

export default PulsingGeometricDream;
