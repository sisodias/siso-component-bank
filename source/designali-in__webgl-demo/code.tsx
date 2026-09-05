'use client';

import { useEffect, useRef } from 'react';

interface WebGLDemoProps {
  width?: number | string; // Can be number (px) or string (e.g., '100%')
  height?: number | string;
  baseColor?: [number, number, number];
  scale?: number;
  timeMultiplier?: number;
  circMultiplier?: number;
  noiseIntensity?: number;
  className?: string;
}

export function WebGLDemo({
  width = '100%',
  height = '100%',
  baseColor = [0.1, 0.1, 0.643],
  scale = 1,
  timeMultiplier = 0.2,
  circMultiplier = 2.0,
  noiseIntensity = 1.0,
  className = '',
}: WebGLDemoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = typeof width === 'number' ? width : canvas.offsetWidth;
    canvas.height = typeof height === 'number' ? height : canvas.offsetHeight;

    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    glRef.current = gl;

    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    // --- Fragment Shader (unchanged, but uses props) ---
    const fragmentShaderSource = `
      precision highp float;
      const float PI = 3.14159265359;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec3 uBaseColor;
      uniform float uTimeMultiplier;
      uniform float uCircMultiplier;
      uniform float uNoiseIntensity;

      float random(float x) {
        return fract(tan(x * 12.345) * 12345.6789);
      }

      float noise(vec2 p) {
        float r = length(p);
        float angle = atan(p.y, p.x);
        float base = sin(12.0 * r + 7.0 * angle);
        return fract(base * 0.5 + 0.5);
      }

      vec2 sw(vec2 p) { return vec2(floor(p.x), floor(p.y)); }
      vec2 se(vec2 p) { return vec2(ceil(p.x), floor(p.y)); }
      vec2 nw(vec2 p) { return vec2(floor(p.x), ceil(p.y)); }
      vec2 ne(vec2 p) { return vec2(ceil(p.x), ceil(p.y)); }

      float smoothNoise(vec2 p) {
        vec2 inter = smoothstep(0.0, 1.0, fract(p));
        float s = mix(noise(sw(p)), noise(se(p)), inter.x);
        float n = mix(noise(nw(p)), noise(ne(p)), inter.x);
        return mix(s, n, inter.y);
      }

      float circleShape(vec2 p) {
    float r = length(p);                  
    r = log(r + 0.001);                 
    return abs(mod(4.0 * r, PI * 2.0) - PI) * uCircMultiplier + 0.2;
}


      void main() {
        vec2 p = gl_FragCoord.xy / uResolution.xy - 0.5;
        p.x *= uResolution.x / uResolution.y;

        float rz = noise(p) * uNoiseIntensity;
        p /= exp(mod(uTime * uTimeMultiplier, PI));
        rz *= pow(abs(0.1 - circleShape(p)), 0.9);

        vec3 col = uBaseColor / rz;
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const vertexShaderSource = `
      attribute vec3 aVertexPosition;
      void main() {
        gl_Position = vec4(aVertexPosition, 1.0);
      }
    `;

    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return;

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram!, vertexShader);
    gl.attachShader(shaderProgram!, fragmentShader);
    gl.linkProgram(shaderProgram!);

    if (!gl.getProgramParameter(shaderProgram!, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(shaderProgram!));
      return;
    }

    gl.useProgram(shaderProgram!);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    const resolutionLocation = gl.getUniformLocation(shaderProgram!, 'uResolution');
    const timeLocation = gl.getUniformLocation(shaderProgram!, 'uTime');
    const baseColorLocation = gl.getUniformLocation(shaderProgram!, 'uBaseColor');
    const timeMultiplierLocation = gl.getUniformLocation(shaderProgram!, 'uTimeMultiplier');
    const circMultiplierLocation = gl.getUniformLocation(shaderProgram!, 'uCircMultiplier');
    const noiseIntensityLocation = gl.getUniformLocation(shaderProgram!, 'uNoiseIntensity');
    const vertexPositionLocation = gl.getAttribLocation(shaderProgram!, 'aVertexPosition');

    const vertices = new Float32Array([
      -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(vertexPositionLocation);
    gl.vertexAttribPointer(vertexPositionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.uniform3fv(baseColorLocation, baseColor);
    gl.uniform1f(timeMultiplierLocation, timeMultiplier);
    gl.uniform1f(circMultiplierLocation, circMultiplier);
    gl.uniform1f(noiseIntensityLocation, noiseIntensity);

    startTimeRef.current = Date.now();

    const render = () => {
      const time = (Date.now() - (startTimeRef.current ?? 0)) / 1000;
      gl.uniform1f(timeLocation, time);
      gl.uniform2fv(resolutionLocation, [canvas.width, canvas.height]);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      canvas.width = typeof width === 'number' ? width : canvas.offsetWidth;
      canvas.height = typeof height === 'number' ? height : canvas.offsetHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [width, height, baseColor, scale, timeMultiplier, circMultiplier, noiseIntensity]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: 'block',
        width,
        height,
      }}
    />
  );
}